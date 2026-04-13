import type { Topic } from '../../../types'

export const teleportSuspense: Topic = {
  id: 'teleport-suspense',
  title: 'Teleport, Suspense, KeepAlive',
  importance: 2,
  status: 'to-learn',
  description: 'Built-in komponentlar: Teleport, Suspense, KeepAlive, Transition',
  content: `Vue 3 bir nechta built-in komponentlar beradi — Teleport, Suspense, KeepAlive, Transition. Bular DOM manipulyatsiya va UX muammolarini hal qiladi.

═══════════════════════════════════════
  TELEPORT
═══════════════════════════════════════

Teleport — komponent kontentini DOM daraxtining BOSHQA joyiga ko'chiradi.
Komponent logikasi va state shu joyda qoladi, faqat render boshqa joyda.

Qachon kerak:
  1. Modal dialog — body oxiriga render qilish
  2. Tooltip/dropdown — overflow: hidden muammosini hal qilish
  3. Toast notification — app tashqarisida ko'rsatish

  <Teleport to="body">
    <div class="modal">Modal kontent</div>
  </Teleport>

"to" attributi CSS selector qabul qiladi: "body", "#modal-root", ".container"

MUHIM: Teleport faqat DOM joylashuvini o'zgartiradi.
Komponent daraxti, props, events — hammasi avvalgidek ishlaydi.

Shartli Teleport:
  <Teleport to="body" :disabled="isMobile">
    Mobilda oddiy render, desktopda teleport
  </Teleport>

═══════════════════════════════════════
  SUSPENSE
═══════════════════════════════════════

Suspense — async komponentlarni yuklanish vaqtida fallback ko'rsatadi.

Vue 3 da async setup() mumkin:
  async setup() {
    const data = await fetchData()
    return { data }
  }

Suspense bu async komponentni kutib turadi:
  <Suspense>
    <template #default>
      <AsyncComponent />
    </template>
    <template #fallback>
      <LoadingSpinner />
    </template>
  </Suspense>

Suspense hodisalari:
  @pending — yuklanish boshlandi
  @resolve — yuklanish tugadi
  @fallback — fallback ko'rsatildi

MUHIM: Vue Suspense hali EKSPERIMENTAL (Vue 3.5).
React Suspense ancha yetuk va Server Components bilan ishlaydi.

═══════════════════════════════════════
  KEEPALIVE
═══════════════════════════════════════

KeepAlive — komponentni yo'q qilish o'rniga CACHE qiladi.
Tab, route almashganda state saqlanib qoladi.

  <KeepAlive>
    <component :is="currentTab" />
  </KeepAlive>

Filtrlash:
  <KeepAlive include="TabA,TabB">     — faqat shu komponentlar cache
  <KeepAlive exclude="HeavyChart">    — bu komponent cache emas
  <KeepAlive :max="5">                — maksimum 5 ta cache (LRU)

KeepAlive lifecycle hooklar:
  onActivated()   — komponent cache dan qaytdi
  onDeactivated() — komponent cache ga tushdi

Foydalanish holatlari:
  1. Tab interfeys — har bir tab state saqlanadi
  2. Form wizard — oldingi qadam ma'lumotlari yo'qolmaydi
  3. List -> Detail -> qaytish — scroll pozitsiyasi saqlanadi

═══════════════════════════════════════
  TRANSITION / TRANSITIONGROUP
═══════════════════════════════════════

Transition — enter/leave animatsiyalar uchun wrapper:

  <Transition name="fade">
    <div v-if="show">Kontent</div>
  </Transition>

CSS klasslari avtomatik qo'shiladi:
  .fade-enter-from    — boshlanish holati
  .fade-enter-active  — animatsiya davomida
  .fade-enter-to      — tugash holati
  .fade-leave-from    — chiqish boshlanishi
  .fade-leave-active  — chiqish davomida
  .fade-leave-to      — chiqish tugashi

TransitionGroup — ro'yxat elementlari uchun:
  <TransitionGroup name="list" tag="ul">
    <li v-for="item in items" :key="item.id">
      {{ item.text }}
    </li>
  </TransitionGroup>

MUHIM: TransitionGroup da har bir element MAJBURIY :key bo'lishi kerak.
Ko'chirish animatsiyasi uchun .list-move klassi qo'shiladi.

═══════════════════════════════════════
  REACT ANALOGLARI
═══════════════════════════════════════

  Vue            | React ekvivalenti
  ───────────────|──────────────────────
  Teleport       | createPortal()
  Suspense       | <Suspense> (yetukroq)
  KeepAlive      | Yo'q (qolda implement)
  Transition     | Framer Motion / react-transition-group`,
  codeExamples: [
    {
      title: 'Teleport — Modal dialog',
      language: 'ts',
      code: `// ModalDialog.vue — <script setup lang="ts">
import { ref } from "vue"

const isOpen = ref(false)

function open() { isOpen.value = true }
function close() { isOpen.value = false }

// Template:
// <button @click="open">Modal ochish</button>
//
// <Teleport to="body">
//   <div v-if="isOpen" class="modal-overlay" @click.self="close">
//     <div class="modal-content">
//       <h2>Modal sarlavha</h2>
//       <p>Bu kontent body oxirida renderlanadi</p>
//       <button @click="close">Yopish</button>
//     </div>
//   </div>
// </Teleport>

// Nima uchun Teleport?
// 1. Modal parent-ning overflow:hidden ta'sirida qolmaydi
// 2. z-index muammolari hal bo'ladi
// 3. Accessibility uchun — modal body darajasida

// React ekvivalenti:
// import { createPortal } from "react-dom"
// createPortal(<Modal />, document.body)`,
      description: 'Teleport modal kontentni body ga ko`chiradi — z-index va overflow muammolarini hal qiladi.',
    },
    {
      title: 'Suspense — async setup bilan',
      language: 'ts',
      code: `// UserProfile.vue — async komponent
// <script setup lang="ts">
// interface User { id: number; name: string; email: string }
//
// const user = await fetch("/api/user/1").then(r => r.json()) as User
// // setup() async bo'lgani uchun Suspense kerak
// </script>
//
// <template>
//   <div class="profile">
//     <h2>{{ user.name }}</h2>
//     <p>{{ user.email }}</p>
//   </div>
// </template>


// Parent — Suspense bilan o'rash
// App.vue template:
// <Suspense>
//   <template #default>
//     <UserProfile />
//   </template>
//   <template #fallback>
//     <div class="skeleton">
//       <div class="skeleton-line" />
//       <div class="skeleton-line" />
//     </div>
//   </template>
// </Suspense>


// Nested Suspense — ichki async komponentlar
// <Suspense>
//   <template #default>
//     <Dashboard>
//       <Suspense>
//         <template #default><UserStats /></template>
//         <template #fallback><StatsLoader /></template>
//       </Suspense>
//     </Dashboard>
//   </template>
//   <template #fallback><FullPageLoader /></template>
// </Suspense>`,
      description: 'Vue Suspense async setup() komponentlarni kutib, fallback slot ko`rsatadi.',
    },
    {
      title: 'KeepAlive — tab state saqlash',
      language: 'ts',
      code: `// TabContainer.vue
import { ref, onActivated, onDeactivated } from "vue"

const tabs = ["TabA", "TabB", "TabC"] as const
const activeTab = ref<string>("TabA")

// TabA.vue ichida — KeepAlive lifecycle
// <script setup>
// import { ref, onActivated, onDeactivated } from "vue"
//
// const scrollPos = ref(0)
// const formData = ref({ name: "", email: "" })
//
// onActivated(() => {
//   // Tab qayta ko'rindi — scroll tiklash
//   window.scrollTo(0, scrollPos.value)
//   console.log("Tab aktivlashdi, state saqlanib qoldi!")
// })
//
// onDeactivated(() => {
//   // Tab yashirildi — scroll saqlash
//   scrollPos.value = window.scrollY
//   console.log("Tab deaktivlashdi")
// })
// </script>


// Template:
// <div class="tabs">
//   <button v-for="tab in tabs" :key="tab"
//     :class="{ active: activeTab === tab }"
//     @click="activeTab = tab">
//     {{ tab }}
//   </button>
// </div>
//
// <KeepAlive :max="3">
//   <component :is="activeTab" :key="activeTab" />
// </KeepAlive>
//
// :max="3" — LRU cache, eng eski 4-chi komponent o'chiriladi`,
      description: 'KeepAlive komponentni cache qiladi. onActivated/onDeactivated lifecycle bilan boshqariladi.',
    },
    {
      title: 'Transition — fade va slide animatsiyalar',
      language: 'ts',
      code: `// AnimatedList.vue
import { ref } from "vue"

interface Item { id: number; text: string }

const items = ref<Item[]>([
  { id: 1, text: "Birinchi" },
  { id: 2, text: "Ikkinchi" },
])

let nextId = 3

function addItem() {
  items.value.push({ id: nextId++, text: "Element " + nextId })
}

function removeItem(id: number) {
  items.value = items.value.filter(i => i.id !== id)
}

// Template:
// <!-- Bitta element uchun Transition -->
// <Transition name="fade" mode="out-in">
//   <div :key="activeView">{{ activeView }}</div>
// </Transition>
//
// <!-- Ro'yxat uchun TransitionGroup -->
// <TransitionGroup name="list" tag="ul">
//   <li v-for="item in items" :key="item.id">
//     {{ item.text }}
//     <button @click="removeItem(item.id)">x</button>
//   </li>
// </TransitionGroup>

// CSS:
// .fade-enter-from, .fade-leave-to { opacity: 0 }
// .fade-enter-active, .fade-leave-active {
//   transition: opacity 0.3s ease
// }
// .list-enter-from { opacity: 0; transform: translateX(-30px) }
// .list-leave-to { opacity: 0; transform: translateX(30px) }
// .list-enter-active, .list-leave-active {
//   transition: all 0.3s ease
// }
// .list-move { transition: transform 0.3s ease }`,
      description: 'Transition bitta element, TransitionGroup ro`yxat uchun. CSS klasslari avtomatik boshqariladi.',
    },
  ],
  interviewQA: [
    {
      question: 'Vue Teleport nima va qachon ishlatiladi?',
      answer: `Teleport komponent kontentini DOM daraxtining boshqa joyiga render qiladi (masalan body ga). Komponent logikasi, state, events avvalgidek ishlaydi — faqat DOM joylashuvi o'zgaradi. Asosan modal, tooltip, dropdown uchun ishlatiladi — bu elementlar parent-ning overflow:hidden yoki z-index ta'sirida qolmasligi kerak. React-dagi createPortal() ning analogi. "to" attributi CSS selector qabul qiladi, "disabled" prop bilan shartli qilish mumkin.`,
    },
    {
      question: 'Vue Suspense qanday ishlaydi va React Suspense dan farqi nima?',
      answer: `Vue Suspense async setup() funksiyali komponentlarni kutib, yuklanish vaqtida fallback slot ko'rsatadi. #default va #fallback slotlari bor. Hodisalar: @pending, @resolve, @fallback. Farqlar: Vue Suspense hali eksperimental, React Suspense yetuk va Server Components, data fetching (use() hook), lazy loading bilan ishlaydi. React-da Suspense concurrent rendering bilan integratsiya qilingan (useTransition, startTransition). Vue-da Suspense faqat async setup uchun.`,
    },
    {
      question: 'KeepAlive nima uchun kerak va React-da analogi bormi?',
      answer: `KeepAlive komponentni unmount qilish o'rniga cache ga saqlaydi. Tab almashganda, route o'zgarganda komponent state (input qiymatlari, scroll pozitsiya) saqlanib qoladi. include/exclude bilan filtrlash, :max bilan cache limitlash mumkin. onActivated/onDeactivated lifecycle hooklar beradi. React-da to'g'ridan-to'g'ri analogi YO'Q. React-da shunga o'xshash xatti-harakatni display:none bilan yashirish yoki state-ni yuqori ko'tarish orqali qolda implement qilish kerak.`,
    },
    {
      question: 'Vue Transition komponenti qanday ishlaydi?',
      answer: `Transition bitta elementning kirish/chiqish animatsiyasini boshqaradi. Element paydo/yo'q bo'lganda 6 ta CSS klass avtomatik qo'shiladi: name-enter-from, name-enter-active, name-enter-to va leave uchun xuddi shunday. mode="out-in" — avval eski chiqadi, keyin yangi kiradi. TransitionGroup ro'yxat uchun — har bir element alohida animatsiya oladi, .name-move klassi pozitsiya o'zgarishini animatsiya qiladi. JavaScript hooklar ham bor: @before-enter, @enter, @after-enter va h.k.`,
    },
    {
      question: 'Teleport ichidagi komponent parent-ning provide/inject-ini olishi mumkinmi?',
      answer: `Ha. Teleport faqat DOM joylashuvini o'zgartiradi, Vue komponent daraxti o'zgarmaydi. Shuning uchun Teleport ichidagi komponent parent-dan provide/inject, props, events — hammasini oladi. Bu React createPortal bilan bir xil xatti-harakat. Teleport to'g'ri ishlashi uchun maqsad element (masalan #modal-root) DOM da mavjud bo'lishi kerak — aks holda xatolik beradi.`,
    },
  ],
  relatedTopics: [
    { techId: 'vue-js', sectionId: 'vue-patterns', topicId: 'vue-vs-react', label: 'Vue vs React' },
    { techId: 'vue-js', sectionId: 'vue-patterns', topicId: 'performance', label: 'Vue Performance' },
    { techId: 'react-js', sectionId: 'component-patterns', topicId: 'portal', label: 'React Portal' },
    { techId: 'react-js', sectionId: 'component-patterns', topicId: 'suspense-lazy', label: 'React Suspense & Lazy' },
  ],
}
