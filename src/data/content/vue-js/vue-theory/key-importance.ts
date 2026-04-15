import type { Topic } from '../../../types'

export const keyImportance: Topic = {
  id: 'key-importance-vue',
  title: ':key Attribute Importance',
  importance: 2,
  status: 'to-learn',
  description: ':key attributi — v-for da ahamiyati, komponent identifikatsiyasi, re-render majburlash, anti-patternlar',
  content: `Vue-da :key attributi VDOM diff algoritmining to'g'ri ishlashi uchun ZARURIY signal. To'g'ri key ishlatish performance va to'g'rilikka KATTA ta'sir qiladi.

═══════════════════════════════════════
  :key NIMA UCHUN KERAK
═══════════════════════════════════════

Vue VDOM diff algoritmi eski va yangi VNode-larni TAQQOSLAYDI.
key — Vue-ga "bu ESKI element va YANGI element BIR XiL narsa" deb aytadi.

Key YO'Q bo'lsa:
  Vue "in-place patch" strategiyasini ishlatadi — elementlarni KETMA-KETLIK bo'yicha taqqoslaydi. Agar ro'yxat tartibi o'zgarsa — Vue elementni QAYTA YARATMAYDI, balki ICHINI o'zgartiradi. Bu state (input value, focus, animation) bilan MUAMMO qiladi.

Key BOR bo'lsa:
  Vue har bir elementni KEY bo'yicha aniqlay oladi. Element ko'chsa — Vue DOM-da KO'CHIRADI (qayta yaratmaydi). Element o'chsa — Vue O'CHIRADI. Yangi element — YARATADI.

═══════════════════════════════════════
  v-for DA :key ISHLATISH
═══════════════════════════════════════

MAJBURIY qoida: v-for doim :key bilan ishlatilishi KERAK.

Yaxshi key qiymatlari:
  ✅ Noyob ID: :key="item.id"
  ✅ Noyob slug: :key="item.slug"
  ✅ Birlashtirilgan: :key="item.type + '-' + item.id"

Yomon key qiymatlari:
  ❌ Index: :key="index" — tartib o'zgarganda MUAMMO
  ❌ Random: :key="Math.random()" — har renderda yangi = har safar qayta yaratish
  ❌ Takrorlanuvchi: :key="item.type" — bir nechta element bir xil key

═══════════════════════════════════════
  INDEX KEY MUAMMOSI
═══════════════════════════════════════

Misol: [A, B, C] ro'yxat, index key bilan.
B elementni olib tashlaymiz: [A, C]

Index key bilan Vue ko'radi:
  Eski: key=0(A), key=1(B), key=2(C)
  Yangi: key=0(A), key=1(C)
  → key=1: B ni C ga PATCH qiladi (ichini o'zgartiradi)
  → key=2: C ni O'CHIRADI

Noyob ID key bilan Vue ko'radi:
  Eski: key=a(A), key=b(B), key=c(C)
  Yangi: key=a(A), key=c(C)
  → key=a: A ni saqlaydi
  → key=b: B ni O'CHIRADI (to'g'ri!)
  → key=c: C ni saqlaydi

Natija: index key bilan input value, focus, animation, transition — BUZILADI.

═══════════════════════════════════════
  KEY VA KOMPONENT IDENTIFIKATSIYASI
═══════════════════════════════════════

Vue key asosida KOMPONENT INSTANCENI saqlaydi yoki yo'q qiladi:

  <UserProfile :key="userId" :user-id="userId" />

userId o'zgarganda:
- Key o'zgardi → Vue ESKI komponentni DESTRUCT qiladi (onUnmounted)
- YANGI komponent yaratadi (setup, onMounted qayta ishlaydi)
- Ichki state TOZALANADI (ref, reactive barchasi reset)

Bu "komponent reset" uchun eng oson pattern!

═══════════════════════════════════════
  KEY BILAN FORCE RE-RENDER
═══════════════════════════════════════

Ba'zan komponentni to'liq qayta yaratish kerak bo'ladi:

  <MyComponent :key="renderKey" />
  renderKey.value++ // komponent to'liq reset + re-create

Ishlatish holatlari:
- Form reset (barcha ichki state tozalash)
- Tashqi kutubxona re-initialize
- Cache invalidation
- Route o'zgarganda lekin komponent bir xil bo'lganda

═══════════════════════════════════════
  TRANSITION-GROUP DA KEY
═══════════════════════════════════════

<TransitionGroup> SHART key talab qiladi — har bir element animatsiya holati bilan bog'langan:

  <TransitionGroup name="list">
    <li v-for="item in items" :key="item.id">
      {{ item.text }}
    </li>
  </TransitionGroup>

Key noto'g'ri bo'lsa — animatsiya noto'g'ri elementga qo'llaniladi, "jumping" effekt.

═══════════════════════════════════════
  REACT BILAN TAQQOSLASH
═══════════════════════════════════════

Vue :key ≈ React key — bir xil maqsad, bir xil qoidalar:
- v-for key ≈ .map() key
- Index key muammosi IKKALASIDA bir xil
- Key bilan force re-mount IKKALASIDA ishlaydi

FARQLAR:
- Vue: key YO'Q bo'lsa — OGOHLANTIRISH (ESLint, DevTools)
- React: key YO'Q bo'lsa — console warning
- Vue: key primitive bo'lishi KERAK (string/number)
- React: ham primitive
- Vue: <template v-for> da key template-ga emas, ichki elementga qo'yiladi
- React: Fragment key qo'llab-quvvatlaydi (<React.Fragment key={id}>)`,
  codeExamples: [
    {
      title: 'Index key muammosi — misol bilan',
      language: 'html',
      code: `<script setup lang="ts">
import { ref } from 'vue'

interface Item {
  id: number
  name: string
}

let nextId = 4
const items = ref<Item[]>([
  { id: 1, name: 'Olma' },
  { id: 2, name: 'Banan' },
  { id: 3, name: 'Gilos' },
])

function addToTop() {
  items.value.unshift({ id: nextId++, name: 'Yangi meva' })
}

function removeFirst() {
  items.value.shift()
}
</script>

<template>
  <button @click="addToTop">Boshiga qo'shish</button>
  <button @click="removeFirst">Birinchini o'chirish</button>

  <h3>❌ Index key — MUAMMOLI</h3>
  <ul>
    <li v-for="(item, index) in items" :key="index">
      {{ item.name }}
      <input :placeholder="item.name + ' haqida...'" />
      <!-- Input value BUZILADI! Boshiga qo'shganda:
           Eski key=0 "Olma" edi, yangi key=0 "Yangi meva"
           Vue input-ni QAYTA YARATMAYDI — ichini patch qiladi
           Natija: "Olma" inputi "Yangi meva" ga ko'chadi -->
    </li>
  </ul>

  <h3>✅ Noyob ID key — TO'G'RI</h3>
  <ul>
    <li v-for="item in items" :key="item.id">
      {{ item.name }}
      <input :placeholder="item.name + ' haqida...'" />
      <!-- Har bir input O'Z elementi bilan qoladi -->
    </li>
  </ul>
</template>`,
      description: 'Index key muammosi real misol. Input value "buziladi" — chunki Vue elementni qayta yaratmaydi, ichini patch qiladi. Noyob ID bu muammoni hal qiladi.',
    },
    {
      title: 'Key bilan komponent reset',
      language: 'html',
      code: `<script setup lang="ts">
import { ref } from 'vue'

// UserProfile komponent — ichki state bor
// Har safar userId o'zgarganda TO'LIQ RESET bo'lishi kerak

const users = [
  { id: 1, name: 'Ali' },
  { id: 2, name: 'Vali' },
  { id: 3, name: 'Gani' },
]

const selectedUserId = ref(1)

// Force re-render uchun
const formKey = ref(0)
function resetForm() {
  formKey.value++ // key o'zgaradi -> komponent qayta yaratiladi
}
</script>

<template>
  <!-- KEY bilan komponent RESET -->
  <div>
    <button
      v-for="user in users"
      :key="user.id"
      @click="selectedUserId = user.id"
      :class="{ active: selectedUserId === user.id }"
    >
      {{ user.name }}
    </button>

    <!-- userId o'zgarganda — komponent TO'LIQ qayta yaratiladi -->
    <!-- Ichki state (form inputs, scroll, tabs) TOZALANADI -->
    <UserProfile :key="selectedUserId" :user-id="selectedUserId" />
  </div>

  <!-- FORM RESET pattern -->
  <div>
    <h3>Form</h3>
    <!-- key o'zgarganda — barcha input-lar tozalanadi -->
    <form :key="formKey">
      <input placeholder="Ism" />
      <input placeholder="Email" />
      <textarea placeholder="Xabar"></textarea>
    </form>
    <button @click="resetForm">Formani tozalash</button>
    <!-- Bu barcha ref va ichki state-ni reset qiladi -->
    <!-- Alternative: har bir ref-ni qo'lda tozalash kerak edi -->
  </div>
</template>`,
      description: 'Key o\'zgarganda Vue komponentni DESTRUCT + CREATE qiladi. Form reset, user switch, route change uchun foydali pattern.',
    },
    {
      title: 'TransitionGroup da key muhimligi',
      language: 'html',
      code: `<script setup lang="ts">
import { ref } from 'vue'

interface Notification {
  id: number
  text: string
  type: 'success' | 'error' | 'info'
}

let notifId = 0
const notifications = ref<Notification[]>([])

function addNotification(type: Notification['type']) {
  notifications.value.push({
    id: ++notifId,
    text: \`Xabar #\${notifId} (\${type})\`,
    type,
  })
  // 3 soniyadan keyin avtomatik o'chirish
  const id = notifId
  setTimeout(() => {
    notifications.value = notifications.value.filter(n => n.id !== id)
  }, 3000)
}

function removeNotification(id: number) {
  notifications.value = notifications.value.filter(n => n.id !== id)
}
</script>

<template>
  <div>
    <button @click="addNotification('success')">Success</button>
    <button @click="addNotification('error')">Error</button>
    <button @click="addNotification('info')">Info</button>
  </div>

  <!-- TransitionGroup — har bir element ANIMATSIYA bilan -->
  <!-- :key SHART — aks holda animatsiya noto'g'ri ishlaydi -->
  <TransitionGroup name="notif" tag="div" class="notif-container">
    <div
      v-for="notif in notifications"
      :key="notif.id"
      :class="['notif', notif.type]"
      @click="removeNotification(notif.id)"
    >
      {{ notif.text }}
    </div>
  </TransitionGroup>
</template>

<style scoped>
.notif-container {
  position: relative;
}

/* Enter */
.notif-enter-from {
  opacity: 0;
  transform: translateX(100px);
}
.notif-enter-active {
  transition: all 0.3s ease;
}

/* Leave */
.notif-leave-to {
  opacity: 0;
  transform: translateX(-100px);
}
.notif-leave-active {
  transition: all 0.3s ease;
}

/* Move (boshqa elementlar siljiganda) */
.notif-move {
  transition: transform 0.3s ease;
}
</style>`,
      description: 'TransitionGroup — :key orqali har bir element animatsiyasi to\'g\'ri ishlaydi. Key noto\'g\'ri bo\'lsa animatsiya boshqa elementga "sakraydi".',
    },
  ],
  interviewQA: [
    {
      question: ':key attributi nima uchun kerak? Tushuntirib bering.',
      answer: `key — Vue VDOM diff algoritmiga element IDENTIFIKATSIYASINI aytadi. Key yo'q: Vue elementlarni KETMA-KETLIK bo'yicha taqqoslaydi (in-place patch). Ro'yxat tartibi o'zgarsa — Vue elementni qayta yaratmaydi, ICHINI o'zgartiradi. Bu input value, focus, animation STATE-ni buzadi. Key bor: Vue har bir elementni KEY bo'yicha aniqlay oladi — ko'chsa DOM-da ko'chiradi, o'chsa o'chiradi, yangi bo'lsa yaratadi. Natija: TO'G'RI DOM yangilanish va STATE saqlanishi.`,
    },
    {
      question: 'v-for da index key nima uchun yomon?',
      answer: `Misol: [A(key=0), B(key=1), C(key=2)]. A ni o'chiramiz: [B(key=0), C(key=1)]. Vue ko'radi: key=0 A edi, endi B — ICHINI patch qiladi (A DOM-ni B ga o'zgartiradi). key=1 B edi, endi C — patch. key=2 — yo'q, O'CHIRADI. Natija: 2 ta PATCH + 1 O'CHIRISH (noto'g'ri!). Noyob ID bilan: key=a O'CHIRILADI, key=b va key=c SAQLANADI. Natija: 1 ta O'CHIRISH (TO'G'RI!). Index key muammolari: input value buzilishi, transition noto'g'ri ishlashi, komponent state aralashishi.`,
    },
    {
      question: 'Key bilan komponentni reset qilish qanday ishlaydi?',
      answer: `<Component :key="someValue" /> — key o'zgarganda Vue: 1) ESKI komponent instance-ni DESTRUCT qiladi (onBeforeUnmount, onUnmounted). 2) YANGI komponent instance yaratadi (setup, onBeforeMount, onMounted). 3) BARCHA ichki state (ref, reactive, local variable) TOZALANADI. Misol: <UserProfile :key="userId" /> — user almashganda ichki tab position, scroll, form data RESET. <form :key="formKey" /> — formKey++ qilsangiz form to'liq tozalanadi. Bu pattern JUDA foydali — har bir ref-ni qo'lda tozalashdan ko'ra OSONROQ.`,
    },
    {
      question: 'TransitionGroup da key nima uchun muhim?',
      answer: `TransitionGroup har bir element uchun ALOHIDA enter/leave animatsiya boshqaradi. Key orqali Vue qaysi element QOLDI, qaysi YANGI, qaysi O'CHIRILDI aniq biladi. Key noto'g'ri bo'lsa: 1) Leave animatsiya NOTO'G'RI elementga qo'llaniladi. 2) Enter animatsiya "sakraydi" — element bor joydan boshqa joyga. 3) Move animatsiya ishlamaydi. Doim NOYOB, BARQAROR key ishlatish kerak — id, slug. Index key TransitionGroup-da AYNIQSA xavfli — animatsiyalar to'liq buziladi. Har bir notification/toast/list-item uchun noyob id shart.`,
    },
    {
      question: 'Qachon index key ishlatish MUMKIN?',
      answer: `Index key faqat 3 shart bajarilganda XAVFSIZ: 1) Ro'yxat HECH QACHON qayta tartiblanmaydi (sort, reverse yo'q). 2) Ro'yxat elementlari HECH QACHON orasiga qo'shilmaydi/o'chirilmaydi (faqat oxiridan push). 3) Elementlarda STATE yo'q (input, focus, animation yo'q). Masalan: statik navigatsiya menyu, oddiy matn ro'yxati. LEKIN: hatto shu hollarda ham noyob ID ishlatish YAXSHIROQ — kelajakda funksionallik o'zgarganda muammo bo'lmaydi. ESLint "vue/require-v-for-key" qoidasi bu sababli key talab qiladi.`,
    },
  ],
  relatedTopics: [
    { techId: 'vue-js', sectionId: 'vue-core', topicId: 'directives', label: 'Direktivalar (v-for)' },
    { techId: 'vue-js', sectionId: 'vue-theory', topicId: 'virtual-dom-vue', label: 'Virtual DOM' },
    { techId: 'vue-js', sectionId: 'vue-advanced', topicId: 'transition', label: 'Transition & Animation' },
    { techId: 'vue-js', sectionId: 'vue-theory', topicId: 'compiler-optimizations', label: 'Compiler optimizatsiyalari' },
  ],
}
