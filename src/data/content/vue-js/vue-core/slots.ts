import type { Topic } from '../../../types'

export const slots: Topic = {
  id: 'slots',
  title: 'Slots',
  importance: 2,
  status: 'to-learn',
  description: 'Default, named, scoped slots, useSlots(), renderless components — kontent uzatish tizimi',
  content: `Slots — Vue da ota komponentdan bola komponentga KONTENT (HTML, komponentlar) uzatish mexanizmi. Props ma'lumot uzatsa, slots — vizual tarkibni uzatadi.

═══════════════════════════════════════
  DEFAULT SLOT
═══════════════════════════════════════

Eng oddiy slot — bola komponent ichidagi <slot /> tegi:

  <!-- Bola: Card.vue -->
  <div class="card">
    <slot />
  </div>

  <!-- Ota: -->
  <Card>
    <p>Bu kontent slot ichiga tushadi</p>
  </Card>

Fallback (zaxira) kontent — slot bo'sh bo'lganda ko'rsatiladi:
  <slot>Standart kontent</slot>

═══════════════════════════════════════
  NAMED SLOTS
═══════════════════════════════════════

Bir nechta slot joylari kerak bo'lganda:

  <!-- Bola: PageLayout.vue -->
  <header><slot name="header" /></header>
  <main><slot /></main>            <!-- default slot -->
  <aside><slot name="sidebar" /></aside>
  <footer><slot name="footer" /></footer>

  <!-- Ota: -->
  <PageLayout>
    <template #header>
      <h1>Sarlavha</h1>
    </template>

    <p>Asosiy kontent (default slot)</p>

    <template #sidebar>
      <nav>Navigatsiya</nav>
    </template>

    <template #footer>
      <p>Pastki qism</p>
    </template>
  </PageLayout>

#name — v-slot:name ning qisqartmasi.

═══════════════════════════════════════
  SCOPED SLOTS (slot props)
═══════════════════════════════════════

Bola komponent o'z ma'lumotlarini ota-ga uzatadi:

  <!-- Bola: List.vue -->
  <li v-for="(item, i) in items" :key="item.id">
    <slot :item="item" :index="i" />
  </li>

  <!-- Ota: -->
  <List :items="users">
    <template #default="{ item, index }">
      {{ index + 1 }}. {{ item.name }}
    </template>
  </List>

Scoped slot — bola MA'LUMOT beradi, ota KO'RINISHNI belgilaydi.
Bu React-dagi render props pattern-ga to'liq teng.

═══════════════════════════════════════
  DINAMIK SLOT NOMLARI
═══════════════════════════════════════

Slot nomini dinamik qilish mumkin:

  <template v-for="tab in tabs" :key="tab.name">
    <template #[tab.slotName]>
      <component :is="tab.component" />
    </template>
  </template>

Computed bilan:
  <template #[dynamicSlotName]>...</template>

═══════════════════════════════════════
  useSlots() — Composition API
═══════════════════════════════════════

Slot-lar mavjudligini tekshirish:

  import { useSlots } from 'vue'
  const slots = useSlots()

  // Slot borligini tekshirish:
  const hasHeader = computed(() => !!slots.header)
  const hasDefault = computed(() => !!slots.default)

Bu layout komponentlar uchun foydali — slot bo'lmasa, bo'limni yashirish.

═══════════════════════════════════════
  RENDERLESS COMPONENT PATTERN
═══════════════════════════════════════

Renderless komponent — o'zi hech narsa renderlaMAYDI, faqat logika va ma'lumot beradi:

  <!-- MouseTracker.vue -->
  <script setup>
  const x = ref(0); const y = ref(0)
  onMounted(() => window.addEventListener('mousemove', update))
  onUnmounted(() => window.removeEventListener('mousemove', update))
  function update(e) { x.value = e.pageX; y.value = e.pageY }
  </script>
  <template>
    <slot :x="x" :y="y" />
  </template>

Ota ko'rinishni belgilaydi:
  <MouseTracker v-slot="{ x, y }">
    <p>Sichqoncha: {{ x }}, {{ y }}</p>
  </MouseTracker>

═══════════════════════════════════════
  REACT BILAN TAQQOSLASH
═══════════════════════════════════════

Vue slots = React children + render props:
- Default slot = React props.children
- Named slots = React da analog YO'Q (bir nechta prop orqali simulatsiya)
- Scoped slots = React render props pattern

React: <Card header={<h1>Title</h1>} footer={<Footer />}>content</Card>
Vue: <Card><template #header>...</template>content<template #footer>...</template></Card>

Vue slots TypeScript bilan kamroq tipizatsiyalangan (generic slots Vue 3.3+).
React children/render props — to'liq TypeScript qo'llab-quvvatlash.`,
  codeExamples: [
    {
      title: 'Named va Scoped slots — Tab komponent',
      language: 'html',
      code: `<!-- Tabs.vue — named + scoped slots -->
<script setup lang="ts">
import { ref } from 'vue'

interface TabItem {
  name: string
  label: string
  disabled?: boolean
}

const props = defineProps<{
  tabs: TabItem[]
}>()

const activeTab = defineModel<string>('activeTab', {
  default: '',
})

// Birinchi tab-ni standart qilib o'rnatish
if (!activeTab.value && props.tabs.length) {
  activeTab.value = props.tabs[0].name
}
</script>

<template>
  <div>
    <!-- Tab tugmalari -->
    <div class="flex border-b">
      <button
        v-for="tab in tabs"
        :key="tab.name"
        :class="[
          'px-4 py-2 -mb-px',
          activeTab === tab.name
            ? 'border-b-2 border-blue-500 text-blue-600'
            : 'text-gray-500 hover:text-gray-700',
        ]"
        :disabled="tab.disabled"
        @click="activeTab = tab.name"
      >
        <!-- Named slot — har bir tab sarlavhasini moslashtirish -->
        <slot :name="'tab-' + tab.name" :tab="tab">
          {{ tab.label }}
        </slot>
      </button>
    </div>

    <!-- Tarkib — scoped slot -->
    <div class="p-4">
      <slot :name="'panel-' + activeTab" :active-tab="activeTab">
        <slot :active-tab="activeTab" />
      </slot>
    </div>
  </div>
</template>

<!-- Ishlatish: -->
<!--
<Tabs :tabs="[
  { name: 'info', label: 'Ma\\'lumot' },
  { name: 'code', label: 'Kod' },
  { name: 'qa', label: 'Savollar' },
]" v-model:active-tab="currentTab">
  <template #tab-code="{ tab }">
    <span>💻 {{ tab.label }}</span>
  </template>

  <template #panel-info>
    <p>Ma'lumot kontenti</p>
  </template>
  <template #panel-code>
    <CodeBlock />
  </template>
</Tabs>
-->`,
      description: 'Named slots — har bir tab uchun alohida kontent. Scoped slot — tab ma\'lumotlarini ota-ga uzatish. Dinamik slot nomlari.',
    },
    {
      title: 'Renderless komponent — useFetch pattern',
      language: 'html',
      code: `<!-- FetchData.vue — renderless component -->
<script setup lang="ts" generic="T">
import { ref, onMounted, watch } from 'vue'

const props = defineProps<{
  url: string
  immediate?: boolean
}>()

const data = ref<T | null>(null)
const error = ref<string | null>(null)
const isLoading = ref(false)

async function fetchData() {
  isLoading.value = true
  error.value = null

  try {
    const response = await fetch(props.url)
    if (!response.ok) throw new Error(\`HTTP \${response.status}\`)
    data.value = await response.json()
  } catch (err) {
    error.value = (err as Error).message
  } finally {
    isLoading.value = false
  }
}

async function refetch() {
  await fetchData()
}

// URL o'zgarganda qayta yuklash
watch(() => props.url, fetchData)

// Darhol yuklash
if (props.immediate !== false) {
  onMounted(fetchData)
}
</script>

<!-- Renderless — faqat slot, o'z UI yo'q -->
<template>
  <slot
    :data="data"
    :error="error"
    :is-loading="isLoading"
    :refetch="refetch"
  />
</template>

<!-- Ishlatish: -->
<!--
<FetchData url="/api/users" v-slot="{ data, error, isLoading, refetch }">
  <div v-if="isLoading">Yuklanmoqda...</div>
  <div v-else-if="error" class="text-red-500">
    {{ error }}
    <button @click="refetch">Qayta urinish</button>
  </div>
  <ul v-else>
    <li v-for="user in data" :key="user.id">{{ user.name }}</li>
  </ul>
</FetchData>
-->`,
      description: 'Renderless komponent — logika beradi, ko\'rinishni ota belgilaydi. Scoped slot orqali data, error, isLoading uzatiladi.',
    },
    {
      title: 'useSlots() — slot mavjudligini tekshirish',
      language: 'html',
      code: `<!-- Section.vue — useSlots bilan shartli rendering -->
<script setup lang="ts">
import { useSlots, computed } from 'vue'

defineProps<{
  title: string
}>()

const slots = useSlots()

// Slot borligini tekshirish
const hasActions = computed(() => !!slots.actions)
const hasFooter = computed(() => !!slots.footer)
const hasIcon = computed(() => !!slots.icon)
</script>

<template>
  <section class="border rounded-lg overflow-hidden">
    <!-- Header — doim ko'rinadi -->
    <div class="flex items-center justify-between p-4 bg-gray-50">
      <div class="flex items-center gap-2">
        <!-- Icon slot bo'lsagina ko'rsatish -->
        <span v-if="hasIcon"><slot name="icon" /></span>
        <h2 class="text-lg font-semibold">{{ title }}</h2>
      </div>

      <!-- Actions slot bo'lsagina ko'rsatish -->
      <div v-if="hasActions">
        <slot name="actions" />
      </div>
    </div>

    <!-- Default slot — asosiy kontent -->
    <div class="p-4">
      <slot />
    </div>

    <!-- Footer — slot bo'lsagina ko'rsatish -->
    <div v-if="hasFooter" class="p-4 border-t bg-gray-50">
      <slot name="footer" />
    </div>
  </section>
</template>

<!-- Ishlatish: -->
<!--
<Section title="Foydalanuvchilar">
  <template #icon>👥</template>
  <template #actions>
    <button>Qo'shish</button>
  </template>
  <UserList />
  <template #footer>
    <Pagination />
  </template>
</Section>

<Section title="Oddiy bo'lim">
  <p>Footer va actions yo'q — ular ko'rsatilmaydi</p>
</Section>
-->`,
      description: 'useSlots() — slot mavjudligini tekshirish. Shartli rendering — slot bo\'lmasa, bo\'lim yashiriladi.',
    },
  ],
  interviewQA: [
    {
      question: 'Vue da default, named va scoped slots farqi nima?',
      answer: `Default slot — yagona, nomsiz slot, ota komponentdan bola ichiga kontent joylashtirish. Named slot — nom bilan aniqlangan, bir nechta bo'lishi mumkin (<template #header>, <template #footer>). Scoped slot — bola o'z ma'lumotlarini ota-ga uzatadi (<slot :item="item"> -> <template #default="{ item }">). Default slot — oddiy kontent, named — layout, scoped — bola ma'lumotlari asosida ota ko'rinishni belgilaydi.`,
    },
    {
      question: 'Scoped slots va React render props o\'xshashmi?',
      answer: `Ha, scoped slots — React render props ning Vue versiyasi. React: <DataProvider render={({ data }) => <List data={data} />} /> yoki <DataProvider>{({ data }) => <List data={data} />}</DataProvider>. Vue: <DataProvider v-slot="{ data }"><List :data="data" /></DataProvider>. Farq — Vue da template sintaksis ishlatiladi, React da JSX funksiya. Vue 3.3+ dan generic slots ham bor — TypeScript tipizatsiya yaxshilangan.`,
    },
    {
      question: 'Renderless component pattern nima va qachon ishlatiladi?',
      answer: `Renderless komponent — o'zi hech narsa renderlamaydi, faqat logika va ma'lumot beradi scoped slot orqali. Ota komponent ko'rinishni to'liq belgilaydi. Ishlatish: data fetching (FetchData), form validation, mouse/keyboard tracking, animation state. Afzalligi — logika bir joyda, ko'rinish har xil bo'lishi mumkin. Kamchiligi — composable (use funksiyalar) ko'pincha soddaroq va tezroq. Renderless pattern eski yondashuv — Vue 3 da composable tavsiya etiladi.`,
    },
    {
      question: 'useSlots() nima va qachon ishlatiladi?',
      answer: `useSlots() — Composition API da slot-larga dasturiy murojaat. Slot mavjudligini tekshirish uchun: const slots = useSlots(); const hasHeader = !!slots.header. Bu layout komponentlar uchun foydali — slot berilmagan bo'lsa, bo'limni yashirish. Options API da $slots orqali ham mumkin. useSlots() faqat setup() yoki <script setup> ichida chaqiriladi.`,
    },
  ],
  relatedTopics: [
    { techId: 'vue-js', sectionId: 'vue-core', topicId: 'components', label: 'Komponentlar' },
    { techId: 'vue-js', sectionId: 'vue-core', topicId: 'script-setup', label: 'Script Setup' },
    { techId: 'vue-js', sectionId: 'vue-patterns', topicId: 'teleport-suspense', label: 'Teleport va Suspense' },
    { techId: 'vue-js', sectionId: 'vue-advanced', topicId: 'composables', label: 'Composables' },
  ],
}
