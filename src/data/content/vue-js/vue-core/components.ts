import type { Topic } from '../../../types'

export const components: Topic = {
  id: 'components',
  title: 'Components',
  importance: 3,
  status: 'to-learn',
  description: 'Props, emits, slots, provide/inject, async components — Vue komponentlar tizimi',
  content: `Vue komponentlar — ilovaning asosiy qurilish bloklari. Har bir komponent o'z template, logika va style-ga ega bo'lgan mustaqil birlik.

═══════════════════════════════════════
  PROPS — Ota dan bolaga ma'lumot uzatish
═══════════════════════════════════════

Props — ota komponentdan bola komponentga ma'lumot uzatish mexanizmi.
Vue 3 + TypeScript da defineProps() makrosi ishlatiladi:

  <script setup lang="ts">
  interface Props {
    title: string
    count?: number       // ixtiyoriy
    items: string[]
  }

  const props = defineProps<Props>()
  </script>

Default qiymatlar:
  const props = withDefaults(defineProps<Props>(), {
    count: 0,
    items: () => [],    // object/array uchun factory function
  })

MUHIM: Props — ONE-WAY DATA FLOW. Bola komponent props-ni o'zgartira OLMAYDI.

═══════════════════════════════════════
  EMITS — Boladan otaga signal yuborish
═══════════════════════════════════════

Bola komponent hodisa chiqaradi, ota eshitadi:

  // Bola:
  const emit = defineEmits<{
    (e: 'update', value: string): void
    (e: 'delete', id: number): void
  }>()

  emit('update', 'yangi qiymat')

  // Ota:
  <ChildComponent @update="handleUpdate" @delete="handleDelete" />

Vue 3.3+ qisqa sintaksis:
  const emit = defineEmits<{
    update: [value: string]
    delete: [id: number]
  }>()

═══════════════════════════════════════
  SLOTS — Kontent uzatish
═══════════════════════════════════════

Slot — ota komponentdan bola komponentga HTML/komponent uzatish.

Default slot:
  <!-- Bola: Card.vue -->
  <div class="card">
    <slot />              <!-- Bu yerga ota kontentni joylashtiradi -->
  </div>

  <!-- Ota: -->
  <Card>
    <p>Bu kontent slot ichiga tushadi</p>
  </Card>

Named slots:
  <!-- Bola: Layout.vue -->
  <header><slot name="header" /></header>
  <main><slot /></main>
  <footer><slot name="footer" /></footer>

  <!-- Ota: -->
  <Layout>
    <template #header>Sarlavha</template>
    <p>Asosiy kontent</p>
    <template #footer>Pastki qism</template>
  </Layout>

Scoped slots — bola o'z ma'lumotlarini ota-ga uzatadi:
  <!-- Bola: List.vue -->
  <li v-for="item in items" :key="item.id">
    <slot :item="item" :index="index" />
  </li>

  <!-- Ota: -->
  <List :items="products">
    <template #default="{ item, index }">
      {{ index }}: {{ item.name }}
    </template>
  </List>

═══════════════════════════════════════
  PROVIDE / INJECT — Chuqur uzatish
═══════════════════════════════════════

Props drilling-dan qochish uchun. React Context-ga o'xshash.

  // Ota (provide):
  import { provide, ref } from 'vue'
  const theme = ref('dark')
  provide('theme', theme)       // reaktiv ref berish

  // Nasl (inject) — istalgan chuqurlikda:
  import { inject } from 'vue'
  const theme = inject<Ref<string>>('theme', ref('light'))  // default qiymat

═══════════════════════════════════════
  ASYNC COMPONENTS
═══════════════════════════════════════

Katta komponentlarni lazy-load qilish:

  import { defineAsyncComponent } from 'vue'

  const HeavyChart = defineAsyncComponent(() =>
    import('./HeavyChart.vue')
  )

  // Loading va error holatlari bilan:
  const HeavyChart = defineAsyncComponent({
    loader: () => import('./HeavyChart.vue'),
    loadingComponent: LoadingSpinner,
    errorComponent: ErrorDisplay,
    delay: 200,     // loading ko'rsatishdan oldin kutish (ms)
    timeout: 3000,  // timeout bo'lsa error ko'rsatish
  })`,
  codeExamples: [
    {
      title: 'Props va Emits — TypeScript bilan',
      language: 'html',
      code: `<!-- UserCard.vue -->
<script setup lang="ts">
interface User {
  id: number
  name: string
  email: string
}

interface Props {
  user: User
  isEditable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isEditable: false,
})

const emit = defineEmits<{
  edit: [user: User]
  delete: [id: number]
}>()

function handleEdit() {
  emit('edit', props.user)
}

function handleDelete() {
  emit('delete', props.user.id)
}
</script>

<template>
  <div class="card">
    <h3>{{ user.name }}</h3>
    <p>{{ user.email }}</p>
    <div v-if="isEditable">
      <button @click="handleEdit">Tahrirlash</button>
      <button @click="handleDelete">O'chirish</button>
    </div>
  </div>
</template>

<!-- Ota komponent: -->
<!-- <UserCard
  :user="currentUser"
  :is-editable="true"
  @edit="onEdit"
  @delete="onDelete"
/> -->`,
      description: 'defineProps va defineEmits TypeScript generics bilan. withDefaults default qiymatlar uchun. Ota komponent props va event-larni uzatadi.',
    },
    {
      title: 'Slots — Default, Named, Scoped',
      language: 'html',
      code: `<!-- DataTable.vue — Scoped slot bilan qayta ishlatiladigan jadval -->
<script setup lang="ts" generic="T">
interface Props {
  items: T[]
  columns: { key: keyof T; label: string }[]
}

defineProps<Props>()
</script>

<template>
  <table>
    <thead>
      <tr>
        <th v-for="col in columns" :key="String(col.key)">
          <!-- Named slot — sarlavha uchun -->
          <slot :name="'header-' + String(col.key)" :column="col">
            {{ col.label }}
          </slot>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in items" :key="index">
        <td v-for="col in columns" :key="String(col.key)">
          <!-- Scoped slot — har bir katakcha uchun -->
          <slot :name="'cell-' + String(col.key)" :item="item" :value="item[col.key]">
            {{ item[col.key] }}
          </slot>
        </td>
      </tr>
      <!-- Default slot — bo'sh holat uchun -->
      <tr v-if="items.length === 0">
        <td :colspan="columns.length">
          <slot name="empty">Ma'lumot topilmadi</slot>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<!-- Ishlatish: -->
<!--
<DataTable :items="users" :columns="columns">
  <template #cell-name="{ item }">
    <strong>{{ item.name }}</strong>
  </template>
  <template #cell-status="{ value }">
    <Badge :type="value">{{ value }}</Badge>
  </template>
  <template #empty>
    <p>Foydalanuvchilar yo'q</p>
  </template>
</DataTable>
-->`,
      description: 'Generic DataTable — scoped slots orqali har bir ustun ko\'rinishini moslashtirish. Vue 3.3+ generic="T" komponent generics.',
    },
    {
      title: 'Provide/Inject — Theme tizimi',
      language: 'html',
      code: `<!-- ThemeProvider.vue -->
<script setup lang="ts">
import { provide, ref, readonly } from 'vue'

type Theme = 'light' | 'dark'

const theme = ref<Theme>('light')

function toggleTheme() {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}

// readonly — bolalar to'g'ridan-to'g'ri o'zgartira olmasin
provide('theme', readonly(theme))
provide('toggleTheme', toggleTheme)
</script>

<template>
  <div :class="theme">
    <slot />
  </div>
</template>

<!-- useTheme.ts — composable sifatida ishlatish -->
<!--
import { inject, type Ref } from 'vue'

export function useTheme() {
  const theme = inject<Ref<'light' | 'dark'>>('theme')
  const toggleTheme = inject<() => void>('toggleTheme')

  if (!theme || !toggleTheme) {
    throw new Error('useTheme must be used within ThemeProvider')
  }

  return { theme, toggleTheme }
}
-->

<!-- Istalgan nasl komponentda: -->
<!--
<script setup>
import { useTheme } from './useTheme'
const { theme, toggleTheme } = useTheme()
</script>
-->`,
      description: 'Provide/Inject — React Context analog. readonly() bilan bir tomonlama ma\'lumot oqimi. Composable orqali qulay ishlatish.',
    },
  ],
  interviewQA: [
    {
      question: 'Vue da props va emits nima? One-way data flow qanday ishlaydi?',
      answer: `Props — ota komponentdan bola komponentga ma'lumot uzatish. Emits — bola komponentdan ota komponentga hodisa (event) yuborish. Vue da ma'lumot FAQAT yuqoridan pastga oqadi (one-way data flow). Bola komponent props-ni to'g'ridan-to'g'ri o'zgartira olmaydi — agar o'zgartirish kerak bo'lsa, emit orqali ota komponentga signal yuboradi, ota o'z state-ini yangilaydi, yangi props bola-ga tushadi. Bu pattern React-dagi props + callback bilan bir xil.`,
    },
    {
      question: 'Slots va props farqi nima? Qachon slot, qachon props ishlatiladi?',
      answer: `Props — ma'lumot (data) uzatish uchun: string, number, object, array. Slots — KONTENT (HTML, komponentlar) uzatish uchun. Props ishlatiladi — qiymat, flag, callback uzatish kerak bo'lganda. Slot ishlatiladi — komponent ichidagi vizual ko'rinishni ota tomondan boshqarish kerak bo'lganda. Scoped slots — bola o'z ma'lumotlarini ota-ga uzatadi, ota esa vizual ko'rinishni belgilaydi. Bu React-dagi render props pattern-ga teng.`,
    },
    {
      question: 'Provide/Inject va props drilling farqi nima?',
      answer: `Props drilling — har bir oraliq komponent orqali props uzatish (A -> B -> C -> D). Agar D ga ma'lumot kerak bo'lsa, B va C ham bilishi kerak. Provide/Inject — ota bir marta provide qiladi, istalgan chuqurlikdagi nasl inject qiladi. Oraliq komponentlar haqida bilishi shart emas. React Context-ga o'xshash, lekin farqi — Vue da provide har bir komponentda alohida bo'lishi mumkin (eng yaqin provide ishlatiladi). Kamchiligi — dependency tracking qiyinroq, debugging murakkab.`,
    },
    {
      question: 'defineAsyncComponent nima va qachon ishlatiladi?',
      answer: `defineAsyncComponent — komponentni lazy-load qilish uchun. Komponent faqat kerak bo'lganda (render qilinganda) yuklanadi. Bu bundle hajmini kamaytiradi va dastlabki yuklash tezligini oshiradi. Ishlatish holatlari: modal dialog, tab kontent, route komponentlar, og'ir kutubxona ishlatadigan komponentlar (chart, editor). Suspense bilan birgalikda ishlatilishi mumkin — loading holati uchun fallback ko'rsatish.`,
    },
  ],
  relatedTopics: [
    { techId: 'vue-js', sectionId: 'vue-core', topicId: 'composition-api', label: 'Composition API' },
    { techId: 'vue-js', sectionId: 'vue-core', topicId: 'directives', label: 'Direktivalar' },
    { techId: 'vue-js', sectionId: 'vue-patterns', topicId: 'teleport-suspense', label: 'Teleport va Suspense' },
    { techId: 'vue-js', sectionId: 'vue-advanced', topicId: 'composables', label: 'Composables' },
  ],
}
