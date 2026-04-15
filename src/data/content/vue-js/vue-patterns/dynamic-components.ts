import type { Topic } from '../../../types'

export const dynamicComponents: Topic = {
  id: 'dynamic-components',
  title: 'Dynamic Components & KeepAlive',
  importance: 2,
  status: 'to-learn',
  description: 'Dinamik komponentlar, KeepAlive cache, recursive components',
  content: `Vue da <component :is="..."> orqali komponentni dinamik ravishda almashtirish mumkin. KeepAlive esa bu komponentlarni cache qilib, state ni saqlab qoladi.

═══════════════════════════════════════
  <component :is="..."> — DINAMIK RENDER
═══════════════════════════════════════

<component> — maxsus element. :is prop ga komponent nomi yoki reference beriladi.
Vue shu komponentni runtime da render qiladi.

  <component :is="currentView" />

:is qabul qiladi:
  1. String — ro'yxatdan o'tgan komponent nomi
  2. Komponent reference — import qilingan komponent
  3. HTML tag nomi — "div", "span" (kam ishlatiladi)

Qachon ishlatish:
  - Tab tizimi — har bir tab alohida komponent
  - Form builder — har bir field turi alohida komponent
  - Widget dashboard — foydalanuvchi tanlagan widgetlar

MUHIM: Har safar :is o'zgarganda eski komponent UNMOUNT bo'ladi
va yangi komponent MOUNT bo'ladi. State yo'qoladi!
Buni oldini olish uchun — KeepAlive.

═══════════════════════════════════════
  KEEPALIVE — KOMPONENTNI CACHE QILISH
═══════════════════════════════════════

KeepAlive — built-in komponent. Ichidagi komponentni unmount qilish
o'rniga cache ga saqlaydi. Qaytib kelganda state saqlanib qoladi.

  <KeepAlive>
    <component :is="currentTab" />
  </KeepAlive>

KeepAlive proplari:
  include — faqat shu komponentlarni cache qilish
    <KeepAlive include="TabA,TabB">
    <KeepAlive :include="['TabA', 'TabB']">
    <KeepAlive :include="/^Tab/">

  exclude — bu komponentlarni cache QILMASLIK
    <KeepAlive exclude="HeavyComponent">

  max — maksimum cache soni (LRU strategiya)
    <KeepAlive :max="5">
    Eng eski 6-chi komponent cache dan o'chiriladi.

═══════════════════════════════════════
  ACTIVATED / DEACTIVATED LIFECYCLE
═══════════════════════════════════════

KeepAlive komponentlar uchun 2 ta maxsus lifecycle hook bor:

  onActivated()   — komponent cache dan qaytdi (ko'rindi)
  onDeactivated() — komponent cache ga tushdi (yashirindi)

Bu hooklar onMounted/onUnmounted O'RNIGA emas, QO'SHIMCHA ishlaydi:
  Birinchi marta: onMounted → onActivated
  Cache dan qaytganda: onActivated (onMounted ishlamaydi)
  Cache ga tushganda: onDeactivated (onUnmounted ishlamaydi)

Foydali holatlar:
  - Timer ni to'xtatish/davom ettirish
  - Scroll pozitsiyani saqlash/tiklash
  - API so'rovni yangilash

═══════════════════════════════════════
  RECURSIVE COMPONENTS
═══════════════════════════════════════

Vue SFC komponent o'zini o'z nomi bilan chaqirishi mumkin.
Fayl nomi komponent nomi sifatida ishlaydi.

  // TreeItem.vue
  <template>
    <li>{{ item.label }}
      <ul v-if="item.children?.length">
        <TreeItem v-for="child in item.children"
          :key="child.id" :item="child" />
      </ul>
    </li>
  </template>

MUHIM: Recursive komponentda MAJBURIY chiqish sharti bo'lishi kerak!
Aks holda cheksiz loop — stack overflow.
v-if="item.children?.length" — bu chiqish sharti.

═══════════════════════════════════════
  AMALIY PATTERNLAR
═══════════════════════════════════════

1. TAB TIZIMI:
   Har bir tab — alohida komponent.
   KeepAlive bilan form state saqlanadi.

2. WIZARD (QADAM-MA-QADAM FORM):
   Har bir qadam — alohida komponent.
   KeepAlive bilan oldingi qadamlar saqlanadi.

3. FORM BUILDER:
   Field turi (text, select, checkbox) ga qarab
   mos komponent dinamik render qilinadi.

4. PLUGIN TIZIMI:
   Tashqi komponentlar runtime da yuklanadi.
   defineAsyncComponent + <component :is="...">

═══════════════════════════════════════
  REACT BILAN TAQQOSLASH
═══════════════════════════════════════

  Konsept              | Vue                    | React
  ─────────────────────|────────────────────────|─────────────────────
  Dinamik render       | <component :is="...">  | {ComponentMap[type]}
  Cache                | <KeepAlive>            | Yo'q (qolda qilish)
  Recursive            | SFC o'z nomini ishlatadi| Oddiy recursive JSX
  Lifecycle (cache)    | activated/deactivated  | Yo'q (KeepAlive yo'q)

React da KeepAlive analogi yo'q — komponent unmount bo'lsa state yo'qoladi.
State ni saqlash uchun parent da lift up qilish yoki display:none ishlatish kerak.
Vue da KeepAlive bu muammoni to'liq hal qiladi.`,
  codeExamples: [
    {
      title: 'Dynamic Component — Tab tizimi',
      language: 'html',
      code: `<script setup lang="ts">
import { ref, shallowRef, markRaw } from "vue"
import TabHome from "./TabHome.vue"
import TabProfile from "./TabProfile.vue"
import TabSettings from "./TabSettings.vue"

interface TabItem {
  name: string
  label: string
  component: ReturnType<typeof markRaw>
}

// markRaw — komponentni reactive qilmaslik uchun
const tabs: TabItem[] = [
  { name: "home", label: "Bosh sahifa", component: markRaw(TabHome) },
  { name: "profile", label: "Profil", component: markRaw(TabProfile) },
  { name: "settings", label: "Sozlamalar", component: markRaw(TabSettings) },
]

const activeTab = shallowRef(tabs[0])
</script>

<template>
  <div class="tabs">
    <nav class="tab-nav">
      <button
        v-for="tab in tabs"
        :key="tab.name"
        :class="{ active: activeTab.name === tab.name }"
        @click="activeTab = tab"
      >
        {{ tab.label }}
      </button>
    </nav>

    <!-- KeepAlive — tab almashganda state saqlanadi -->
    <KeepAlive :max="3">
      <component :is="activeTab.component" :key="activeTab.name" />
    </KeepAlive>
  </div>
</template>`,
      description: 'markRaw + shallowRef bilan dinamik tab tizimi. KeepAlive state ni saqlaydi.',
    },
    {
      title: 'KeepAlive — include/exclude/max',
      language: 'html',
      code: `<!-- Faqat belgilangan komponentlar cache bo'ladi -->
<template>
  <!-- String bilan -->
  <KeepAlive include="TabHome,TabProfile">
    <component :is="currentTab" />
  </KeepAlive>

  <!-- Array bilan -->
  <KeepAlive :include="['TabHome', 'TabProfile']">
    <component :is="currentTab" />
  </KeepAlive>

  <!-- RegExp bilan -->
  <KeepAlive :include="/^Tab/">
    <component :is="currentTab" />
  </KeepAlive>

  <!-- Og'ir komponentni cache qilmaslik -->
  <KeepAlive exclude="HeavyChart">
    <component :is="currentView" />
  </KeepAlive>

  <!-- LRU cache limiti -->
  <KeepAlive :max="5">
    <component :is="currentTab" />
  </KeepAlive>
  <!-- 6-chi komponent qo'shilganda eng eski cache o'chiriladi -->
</template>

<script setup lang="ts">
// MUHIM: include/exclude komponent NAME bilan ishlaydi
// SFC da fayl nomi ishlatiladi: TabHome.vue → "TabHome"
// Agar defineOptions({ name: "MyTab" }) bilan nom berilsa — shu ishlatiladi
</script>`,
      description: 'include, exclude va max proplari bilan KeepAlive ni nozik sozlash.',
    },
    {
      title: 'activated / deactivated lifecycle',
      language: 'html',
      code: `<!-- TabWithTimer.vue — KeepAlive ichida ishlatiladi -->
<script setup lang="ts">
import { ref, onMounted, onUnmounted, onActivated, onDeactivated } from "vue"

const count = ref(0)
let intervalId: ReturnType<typeof setInterval> | null = null

function startTimer() {
  intervalId = setInterval(() => count.value++, 1000)
}

function stopTimer() {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
}

// Birinchi marta mount bo'lganda
onMounted(() => {
  console.log("MOUNTED — birinchi marta")
  startTimer()
})

// KeepAlive: cache dan qaytganda
onActivated(() => {
  console.log("ACTIVATED — cache dan qaytdi")
  startTimer()  // Timer ni davom ettirish
})

// KeepAlive: cache ga tushganda
onDeactivated(() => {
  console.log("DEACTIVATED — cache ga tushdi")
  stopTimer()   // Timer ni to'xtatish (resource tejash)
})

// Komponent butunlay unmount bo'lganda (max limitdan tushsa)
onUnmounted(() => {
  console.log("UNMOUNTED — butunlay o'chirildi")
  stopTimer()
})
</script>

<template>
  <div class="timer">
    <h3>Timer: {{ count }} soniya</h3>
    <p>Tab almashib qayting — count davom etadi!</p>
  </div>
</template>`,
      description: 'KeepAlive lifecycle: activated da timer davom etadi, deactivated da to`xtatiladi.',
    },
    {
      title: 'Recursive Component — daraxt ko`rsatish',
      language: 'html',
      code: `<!-- TreeItem.vue — o'zini o'zi chaqiradi -->
<script setup lang="ts">
interface TreeNode {
  id: number
  label: string
  children?: TreeNode[]
}

defineProps<{
  item: TreeNode
  depth?: number
}>()

const emit = defineEmits<{
  select: [node: TreeNode]
}>()
</script>

<template>
  <li class="tree-item" :style="{ paddingLeft: (depth ?? 0) * 20 + 'px' }">
    <span
      class="tree-label"
      @click="emit('select', item)"
    >
      <span v-if="item.children?.length">
        {{ '▸' }}
      </span>
      {{ item.label }}
    </span>

    <!-- RECURSIVE: TreeItem o'zini chaqiradi -->
    <ul v-if="item.children?.length" class="tree-children">
      <TreeItem
        v-for="child in item.children"
        :key="child.id"
        :item="child"
        :depth="(depth ?? 0) + 1"
        @select="emit('select', $event)"
      />
    </ul>
  </li>
</template>


<!-- Foydalanish:
<script setup>
const tree = {
  id: 1, label: "src",
  children: [
    { id: 2, label: "components",
      children: [
        { id: 3, label: "Button.vue" },
        { id: 4, label: "Input.vue" },
      ]
    },
    { id: 5, label: "pages",
      children: [
        { id: 6, label: "Home.vue" },
      ]
    },
  ]
}
</script>

<template>
  <ul>
    <TreeItem :item="tree" @select="n => console.log(n)" />
  </ul>
</template> -->`,
      description: 'TreeItem o`zini o`zi chaqiradi. v-if="item.children?.length" chiqish sharti.',
    },
    {
      title: 'Form Builder — dinamik field render',
      language: 'html',
      code: `<script setup lang="ts">
import { ref, markRaw, type Component } from "vue"
import FieldText from "./fields/FieldText.vue"
import FieldSelect from "./fields/FieldSelect.vue"
import FieldCheckbox from "./fields/FieldCheckbox.vue"

interface FormField {
  name: string
  label: string
  type: "text" | "select" | "checkbox"
  options?: string[]   // select uchun
}

// Komponent xaritasi
const fieldComponents: Record<string, Component> = {
  text: markRaw(FieldText),
  select: markRaw(FieldSelect),
  checkbox: markRaw(FieldCheckbox),
}

// Form sxemasi (API dan kelishi mumkin)
const schema: FormField[] = [
  { name: "username", label: "Foydalanuvchi nomi", type: "text" },
  { name: "role", label: "Roli", type: "select",
    options: ["Admin", "User", "Manager"] },
  { name: "active", label: "Faol", type: "checkbox" },
]

const formData = ref<Record<string, unknown>>({})

function handleChange(name: string, value: unknown) {
  formData.value[name] = value
}
</script>

<template>
  <form @submit.prevent="console.log(formData)">
    <div v-for="field in schema" :key="field.name" class="form-field">
      <label>{{ field.label }}</label>

      <!-- Dinamik komponent — type ga qarab mos field renderlanadi -->
      <component
        :is="fieldComponents[field.type]"
        :name="field.name"
        :options="field.options"
        :modelValue="formData[field.name]"
        @update:modelValue="handleChange(field.name, $event)"
      />
    </div>
    <button type="submit">Yuborish</button>
  </form>
</template>`,
      description: 'Form builder — field turi bo`yicha mos komponent dinamik renderlanadi.',
    },
  ],
  interviewQA: [
    {
      question: '<component :is="..."> qanday ishlaydi va qanday qiymatlar qabul qiladi?',
      answer: `<component :is="..."> Vue ning maxsus elementi bo'lib, :is prop ga berilgan komponentni runtime da render qiladi. Qabul qiladigan qiymatlar: 1) Import qilingan komponent reference (tavsiya etiladi), 2) Ro'yxatdan o'tgan komponent string nomi, 3) HTML tag nomi ("div", "span"). Har safar :is qiymati o'zgarganda eski komponent unmount va yangi komponent mount bo'ladi — state yo'qoladi. Buni oldini olish uchun KeepAlive ishlatiladi. React da bu pattern oddiy: const Component = componentMap[type]; return <Component />.`,
    },
    {
      question: 'KeepAlive qanday ishlaydi va React da analogi bormi?',
      answer: `KeepAlive ichidagi komponentni unmount qilish o'rniga cache ga saqlaydi. Qaytib kelganda komponent DOM va state saqlanib qoladi. include/exclude (string, array, RegExp) bilan filtrlash, :max bilan LRU cache limiti o'rnatish mumkin. onActivated va onDeactivated maxsus lifecycle hooklar beradi. React da KeepAlive ning to'g'ridan-to'g'ri analogi YO'Q. React da shunga o'xshash funksionallik uchun: 1) State ni parent ga ko'tarish, 2) display:none bilan yashirish, 3) Tashqi kutubxona (react-activation) ishlatish kerak.`,
    },
    {
      question: 'Recursive komponent yaratishda nimaga e`tibor berish kerak?',
      answer: `Recursive komponent o'zini o'zi chaqiradi — Vue SFC da fayl nomi komponent nomi sifatida ishlaydi. MAJBURIY chiqish sharti bo'lishi kerak (masalan v-if="item.children?.length"), aks holda cheksiz loop va stack overflow bo'ladi. Har bir recursive chaqiruvda :key prop bo'lishi kerak. Event-larni emit orqali yuqoriga uzatish uchun har bir darajada $emit ni qayta emit qilish kerak. Performance: chuqur ma'lumotlar uchun v-memo yoki virtual scrolling ishlatish tavsiya qilinadi.`,
    },
    {
      question: 'markRaw va shallowRef nima uchun dinamik komponentlarda ishlatiladi?',
      answer: `Vue 3 da komponent object-ni reactive() yoki ref() ichiga qo'ysangiz, Vue uni Proxy bilan o'raydi — bu komponent ishlashini buzishi mumkin va performance muammo yaratadi. markRaw() — komponentni reactive qilishdan himoya qiladi (Vue uni kuzatmaydi). shallowRef() — faqat .value o'zgarishini kuzatadi, ichki property-larni emas. Dinamik tab tizimida: tabs massividagi komponentlar markRaw bilan o'raladi, activeTab esa shallowRef bilan saqlanadi. Bu to'g'ri pattern — keraksiz reactivity-dan saqlaydi.`,
    },
  ],
  relatedTopics: [
    { techId: 'vue-js', sectionId: 'vue-patterns', topicId: 'teleport-suspense', label: 'Teleport, Suspense, KeepAlive' },
    { techId: 'vue-js', sectionId: 'vue-patterns', topicId: 'component-patterns', label: 'Vue Component Patterns' },
    { techId: 'vue-js', sectionId: 'vue-core', topicId: 'slots', label: 'Slots' },
    { techId: 'vue-js', sectionId: 'vue-reactivity', topicId: 'ref-reactive', label: 'ref vs reactive' },
  ],
}
