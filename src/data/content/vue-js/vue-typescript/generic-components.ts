import type { Topic } from '../../../types'

export const genericComponents: Topic = {
  id: 'generic-components',
  title: 'Generic Components',
  importance: 2,
  status: 'to-learn',
  description: 'Vue 3.3+ generic="T" bilan type-safe universal komponentlar — List, Select, Table kabi qayta ishlatiladigan UI',
  content: `Generic komponentlar — bir xil logikani TURLI TIPLAR bilan qayta ishlatish imkonini beruvchi pattern. Vue 3.3 dan boshlab <script setup> da generic atributi qo'llab-quvvatlanadi.

═══════════════════════════════════════
  GENERIC KOMPONENT SINTAKSISI
═══════════════════════════════════════

Vue 3.3+ da generic atributi:
  <script setup lang="ts" generic="T">
  defineProps<{ items: T[]; selected?: T }>()
  </script>

Bu TypeScript ning function generics ga o'xshash:
  function useList<T>(items: T[]): T[] { ... }

Generic CONSTRAINTS ham ishlaydi:
  <script setup lang="ts" generic="T extends { id: number }">
  // T — faqat { id: number } ga mos keluvchi tiplar
  </script>

Bir nechta generic parametr:
  <script setup lang="ts" generic="T, K extends keyof T">
  // T — asosiy tip, K — T ning kalitlari
  </script>

MUHIM: generic atributi FAQAT <script setup> bilan ishlaydi.
Options API yoki oddiy <script> da ishlamaydi.

═══════════════════════════════════════
  NIMA UCHUN GENERIC KERAK?
═══════════════════════════════════════

Genericsiz:
  defineProps<{ items: any[]; selected?: any }>()
  // any — tip xavfsizligi YO'Q, xatolar compile da tutilmaydi

Union bilan:
  defineProps<{ items: (string | number | User)[]; }>()
  // Har bir yangi tip uchun union kengaytirish kerak

Generic bilan:
  <MyList :items="users" />        // T = User (avtomatik infer)
  <MyList :items="products" />     // T = Product (avtomatik infer)
  <MyList :items="['a','b']" />    // T = string (avtomatik infer)

Compiler items tipidan T ni avtomatik ANIQLAYDI (type inference).
Agar selected prop bersangiz — u HAM T tipida bo'lishi kerak:
  <MyList :items="users" :selected="currentUser" />
  // OK: T = User, selected = User

  <MyList :items="users" :selected="'text'" />
  // TYPE ERROR: string !== User

═══════════════════════════════════════
  TYPED SLOTS GENERIC BILAN
═══════════════════════════════════════

Generic komponentda slot ham tipizatsiya qilinadi:

  <script setup lang="ts" generic="T">
  defineProps<{ items: T[] }>()
  defineSlots<{
    default(props: { item: T; index: number }): any
    empty(): any
  }>()
  </script>

Template da scoped slot orqali T tipidagi ma'lumot uzatiladi:
  <slot v-for="(item, i) in items" :item="item" :index="i" />

Ota komponentda TypeScript avtomatik infer qiladi:
  <MyList :items="users">
    <template #default="{ item }">
      {{ item.name }}     <!-- item: User — to'liq autocomplete -->
    </template>
  </MyList>

═══════════════════════════════════════
  GENERIC CONSTRAINTS VA EXTENDS
═══════════════════════════════════════

Constraint — T ga minimal talab qo'yish:

  generic="T extends { id: string | number }"
  // T da ALBATTA id bo'lishi kerak

  generic="T extends Record<string, unknown>"
  // T — istalgan object

  generic="T extends string | number"
  // T — faqat primitive

Import qilingan interface bilan:
  generic="T extends BaseEntity"
  // import { BaseEntity } from './types' kerak

Constraint NIMA UCHUN KERAK:
  1) Komponent ichida T ning xususiyatlarini ishlatish uchun
  2) Noto'g'ri tip berilishini OLDINI OLISH uchun
  3) Autocomplete T ning xususiyatlarini ko'rsatishi uchun

═══════════════════════════════════════
  AMALIY MISOLLAR — QACHON ISHLATILADI
═══════════════════════════════════════

Generic komponent KERAK bo'ladigan holatlar:
  - List/Table — istalgan turdagi ma'lumotlar ro'yxati
  - Select/Dropdown — istalgan tip uchun tanlash
  - Form — turli modellar uchun universal forma
  - Pagination — istalgan ma'lumot bilan sahifalash
  - Autocomplete — turli turdagi natijalar
  - Tree — turli node tiplari bilan daraxt

Generic kerak EMAS bo'lgan holatlar:
  - Faqat bitta tip bilan ishlaydigan komponent (UserCard)
  - Oddiy UI komponentlar (Button, Badge, Modal)
  - Layout komponentlar (Header, Footer, Sidebar)

═══════════════════════════════════════
  REACT BILAN TAQQOSLASH
═══════════════════════════════════════

React da generic komponent — oddiy TypeScript generic function:

  function List<T>({ items }: { items: T[] }) {
    return <>{items.map(item => <div key={String(item)} />)}</>
  }

  // Ishlatish — tip infer qilinadi:
  <List items={users} />    // T = User

Vue da esa maxsus generic="T" atributi kerak — bu COMPILER
MAKROSI, TypeScript native generics emas. Ichki implementatsiyada
Vue compiler buni TypeScript generics ga aylantiradi.

ASOSIY FARQLAR:
  1) React: standart TS generics — hech qanday maxsus sintaksis kerak emas
  2) Vue: generic="T" atributi — faqat <script setup> da ishlaydi
  3) React: forwardRef bilan generic — murakkab
  4) Vue: defineExpose + generic — ancha sodda
  5) React: constraint oddiy: <T extends Base> — Vue ham xuddi shunday
  6) Ikkalasida HAM type inference ishlaydi — tip aniq ko'rsatish shart emas

Vue 3.3 dan OLDIN generic komponent qilish JUDA MURAKKAB edi —
defineComponent + render function + manual typing kerak bo'lgan.
generic atributi bu muammoni BUTUNLAY hal qildi.`,
  codeExamples: [
    {
      title: 'Generic List komponent — asosiy pattern',
      language: 'html',
      code: `<!-- GenericList.vue -->
<script setup lang="ts" generic="T extends { id: string | number }">
import { computed } from 'vue'

// ── Props ──
interface Props {
  items: T[]
  selected?: T
  keyField?: keyof T
  emptyText?: string
}

const props = withDefaults(defineProps<Props>(), {
  emptyText: 'Ma\\'lumot topilmadi',
})

// ── Emits ──
const emit = defineEmits<{
  select: [item: T]
  remove: [item: T]
}>()

// ── Slots ──
defineSlots<{
  default(props: { item: T; index: number; isSelected: boolean }): any
  empty(): any
  header(): any
}>()

// ── Logic ──
const isSelected = (item: T): boolean => {
  return props.selected?.id === item.id
}
</script>

<template>
  <div class="generic-list">
    <div class="list-header">
      <slot name="header" />
    </div>

    <template v-if="items.length > 0">
      <div
        v-for="(item, index) in items"
        :key="item.id"
        :class="{ selected: isSelected(item) }"
        @click="emit('select', item)"
      >
        <!-- Scoped slot — T tipidagi item uzatiladi -->
        <slot :item="item" :index="index" :is-selected="isSelected(item)">
          {{ item }}
        </slot>
      </div>
    </template>

    <div v-else class="empty">
      <slot name="empty">{{ emptyText }}</slot>
    </div>
  </div>
</template>`,
      description: 'Generic List — T extends { id } constraint bilan. Scoped slot orqali ota komponent har bir element ko\'rinishini belgilaydi. Type inference avtomatik ishlaydi.',
    },
    {
      title: 'Generic Select komponent',
      language: 'html',
      code: `<!-- GenericSelect.vue -->
<script setup lang="ts" generic="T extends Record<string, any>">
import { ref, computed } from 'vue'

interface Props {
  options: T[]
  modelValue?: T | null
  labelKey: keyof T         // qaysi field ko'rsatilsin
  valueKey: keyof T         // qaysi field unikal
  placeholder?: string
  disabled?: boolean
  searchable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Tanlang...',
  disabled: false,
  searchable: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: T | null]
  search: [query: string]
}>()

// ── Slots ──
defineSlots<{
  option(props: { option: T; isActive: boolean }): any
  selected(props: { value: T }): any
}>()

// ── Search ──
const searchQuery = ref('')
const isOpen = ref(false)

const filteredOptions = computed(() => {
  if (!props.searchable || !searchQuery.value) return props.options
  const q = searchQuery.value.toLowerCase()
  return props.options.filter(opt =>
    String(opt[props.labelKey]).toLowerCase().includes(q)
  )
})

function selectOption(option: T) {
  emit('update:modelValue', option)
  isOpen.value = false
  searchQuery.value = ''
}

function getLabel(option: T): string {
  return String(option[props.labelKey])
}

function isActive(option: T): boolean {
  if (!props.modelValue) return false
  return props.modelValue[props.valueKey] === option[props.valueKey]
}
</script>

<template>
  <div class="select-wrapper" :class="{ disabled }">
    <button @click="isOpen = !isOpen" :disabled="disabled">
      <template v-if="modelValue">
        <slot name="selected" :value="modelValue">
          {{ getLabel(modelValue) }}
        </slot>
      </template>
      <span v-else class="placeholder">{{ placeholder }}</span>
    </button>

    <div v-if="isOpen" class="dropdown">
      <input
        v-if="searchable"
        v-model="searchQuery"
        placeholder="Qidirish..."
        @input="emit('search', searchQuery)"
      />
      <div
        v-for="opt in filteredOptions"
        :key="String(opt[valueKey])"
        :class="{ active: isActive(opt) }"
        @click="selectOption(opt)"
      >
        <slot name="option" :option="opt" :is-active="isActive(opt)">
          {{ getLabel(opt) }}
        </slot>
      </div>
    </div>
  </div>
</template>

<!-- Ishlatish: -->
<!--
interface City {
  id: number
  name: string
  country: string
}

const cities: City[] = [...]
const selectedCity = ref<City | null>(null)

<GenericSelect
  v-model="selectedCity"
  :options="cities"
  label-key="name"
  value-key="id"
  searchable
>
  <template #option="{ option, isActive }">
    <span :class="{ bold: isActive }">
      {{ option.name }} ({{ option.country }})
    </span>
  </template>
</GenericSelect>
-->`,
      description: 'v-model bilan generic select. labelKey va valueKey orqali istalgan object tuzilmasi bilan ishlaydi. Searchable va slot customization.',
    },
    {
      title: 'Generic DataTable — ikki generic parametr',
      language: 'html',
      code: `<!-- DataTable.vue -->
<script setup lang="ts" generic="T extends { id: string | number }, K extends keyof T">
import { computed } from 'vue'

// ── Column definition ──
interface Column<Row, Key extends keyof Row> {
  key: Key
  label: string
  sortable?: boolean
  width?: string
  align?: 'left' | 'center' | 'right'
}

interface Props {
  rows: T[]
  columns: Column<T, K>[]
  sortBy?: K
  sortDir?: 'asc' | 'desc'
  selectable?: boolean
  selectedIds?: (string | number)[]
}

const props = withDefaults(defineProps<Props>(), {
  sortDir: 'asc',
  selectable: false,
  selectedIds: () => [],
})

const emit = defineEmits<{
  sort: [column: K, direction: 'asc' | 'desc']
  select: [row: T]
  selectAll: [ids: (string | number)[]]
}>()

defineSlots<{
  'cell': (props: { row: T; column: Column<T, K>; value: T[K] }) => any
  'header': (props: { column: Column<T, K> }) => any
  'empty': () => any
}>()

// ── Sort ──
const sortedRows = computed(() => {
  if (!props.sortBy) return props.rows
  const key = props.sortBy
  const dir = props.sortDir === 'asc' ? 1 : -1
  return [...props.rows].sort((a, b) => {
    const va = a[key], vb = b[key]
    if (va < vb) return -1 * dir
    if (va > vb) return 1 * dir
    return 0
  })
})

function toggleSort(col: Column<T, K>) {
  if (!col.sortable) return
  const newDir = props.sortBy === col.key && props.sortDir === 'asc'
    ? 'desc' : 'asc'
  emit('sort', col.key, newDir)
}
</script>

<template>
  <table>
    <thead>
      <tr>
        <th v-if="selectable"><input type="checkbox" /></th>
        <th
          v-for="col in columns"
          :key="String(col.key)"
          :style="{ width: col.width, textAlign: col.align }"
          :class="{ sortable: col.sortable }"
          @click="toggleSort(col)"
        >
          <slot name="header" :column="col">{{ col.label }}</slot>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="row in sortedRows" :key="row.id">
        <td v-if="selectable">
          <input
            type="checkbox"
            :checked="selectedIds.includes(row.id)"
            @change="emit('select', row)"
          />
        </td>
        <td v-for="col in columns" :key="String(col.key)">
          <slot name="cell" :row="row" :column="col" :value="row[col.key]">
            {{ row[col.key] }}
          </slot>
        </td>
      </tr>
      <tr v-if="sortedRows.length === 0">
        <td :colspan="columns.length + (selectable ? 1 : 0)">
          <slot name="empty">Ma'lumot yo'q</slot>
        </td>
      </tr>
    </tbody>
  </table>
</template>`,
      description: 'Ikki generic parametrli DataTable: T — row tipi, K — column key tipi. Sort, select, custom cell rendering — barchasi type-safe.',
    },
    {
      title: 'React vs Vue — Generic komponent taqqoslash',
      language: 'ts',
      code: `// ═══════════════════════════════════════
//  REACT — Standart TypeScript generics
// ═══════════════════════════════════════

interface ListProps<T> {
  items: T[]
  renderItem: (item: T, index: number) => React.ReactNode
  keyExtractor: (item: T) => string | number
  onSelect?: (item: T) => void
}

function List<T>({
  items,
  renderItem,
  keyExtractor,
  onSelect,
}: ListProps<T>) {
  return (
    <ul>
      {items.map((item, i) => (
        <li
          key={keyExtractor(item)}
          onClick={() => onSelect?.(item)}
        >
          {renderItem(item, i)}
        </li>
      ))}
    </ul>
  )
}

// Ishlatish — T avtomatik infer:
// <List
//   items={users}
//   renderItem={(user) => <span>{user.name}</span>}
//   keyExtractor={(user) => user.id}
//   onSelect={(user) => console.log(user.email)}
// />

// ═══════════════════════════════════════
//  VUE — generic="T" atributi
// ═══════════════════════════════════════

// <script setup lang="ts" generic="T extends { id: string | number }">
// defineProps<{ items: T[] }>()
// defineSlots<{
//   default(props: { item: T; index: number }): any
// }>()
// const emit = defineEmits<{ select: [item: T] }>()
// </script>
//
// <template>
//   <ul>
//     <li v-for="(item, i) in items" :key="item.id"
//         @click="emit('select', item)">
//       <slot :item="item" :index="i" />
//     </li>
//   </ul>
// </template>

// FARQLAR:
// React: renderItem prop (render prop pattern)
// Vue:   scoped slot (template #default="{ item }")
// React: keyExtractor function kerak
// Vue:   constraint (T extends { id }) + :key="item.id"
// React: onClick callback — oddiy function
// Vue:   emit('select', item) — event system`,
      description: 'React render props vs Vue scoped slots — generic komponentlarda rendering delegatsiyasi. React function-based, Vue template-based.',
    },
  ],
  interviewQA: [
    {
      question: 'Vue 3.3 generic="T" nima va uni qanday ishlatish kerak?',
      answer: `generic="T" — Vue 3.3 da qo'shilgan compiler atributi bo'lib, <script setup> da TypeScript generics qo'llash imkonini beradi. Misol: <script setup lang="ts" generic="T"> — bu T tipini props, emits, slots da ishlatishga ruxsat beradi. Constraint qo'shish ham mumkin: generic="T extends { id: number }". Vue compiler buni TypeScript generic function ga aylantiradi. Bu feature dan OLDIN generic komponent qilish uchun defineComponent + render function + manual type annotation kerak bo'lgan — juda murakkab va verbose edi.`,
    },
    {
      question: 'Generic komponent da type inference qanday ishlaydi? Tipni aniq ko\'rsatish kerakmi?',
      answer: `Vue compiler props qiymatlaridan generic tipni AVTOMATIK ANIQLAYDI (type inference). Misol: <MyList :items="users" /> — users: User[] bo'lsa, T avtomatik User bo'ladi. Barcha scoped slotlar, emitlar ham T = User bilan ishlaydi. Tipni aniq ko'rsatish KERAK EMAS va Vue da hozircha imkoni yo'q (React da <List<User> items={...} /> mumkin, lekin Vue template da generic argument berish sintaksisi mavjud emas). Agar inference ishlamasa — bu odatda constraint yoki props tuzilmasida muammo bor degani.`,
    },
    {
      question: 'Generic constraint nima va qachon ishlatiladi?',
      answer: `Constraint — generic tipga MINIMAL TALAB qo'yish. generic="T extends { id: number }" deganda, T da ALBATTA id: number bo'lishi kerak. Qachon kerak: 1) Komponent ichida T ning xususiyatini ishlatish kerak — masalan, :key="item.id" uchun id kerak, 2) Noto'g'ri tip berilishini oldini olish — masalan, string[] bermay, faqat object[] qabul qilish, 3) Autocomplete ishlashi uchun — IDE T.id ni ko'rsatadi. Constraint QANCHALIK MINIMAL bo'lsa, komponent SHUNCHALIK UNIVERSAL. Ortiqcha constraint — qayta ishlatish imkonini kamaytiradi.`,
    },
    {
      question: 'Generic komponent da defineSlots<T>() qanday ishlaydi?',
      answer: `defineSlots<T>() — scoped slot tiplarini belgilash uchun compiler makrosi. Generic komponentda slot orqali uzatiladigan ma'lumot T tipida bo'ladi. Misol: defineSlots<{ default(props: { item: T }): any }>() — bu default slot ga T tipidagi item uzatishni bildiradi. Ota komponentda: <template #default="{ item }"> — bu yerda item AVTOMATIK T tipida bo'ladi. defineSlots return qiymati ishlatilmaydi — u faqat COMPILER uchun type information beradi. Vue 3.3+ da defineSlots qo'shilgan.`,
    },
    {
      question: 'Vue generic komponentlarni React generic komponentlar bilan taqqoslang.',
      answer: `React da generic komponent — oddiy TypeScript generic function: function List<T>(props: { items: T[] }). Maxsus sintaksis yo'q, standart TS ishlaydi. Vue da esa generic="T" compiler atributi kerak — bu Vue-specific sintaksis. Asosiy farqlar: 1) React: render prop orqali rendering delegatsiyasi — Vue: scoped slot, 2) React: <List<User>> bilan aniq tip ko'rsatish mumkin — Vue da bu imkon yo'q, faqat inference, 3) React: forwardRef bilan generic murakkab — Vue: defineExpose oddiyroq, 4) Vue constraint sintaksisi React bilan bir xil: T extends Base. Natija: React yondashuvi TypeScript-native, Vue yondashuvi compiler-assisted.`,
    },
  ],
  relatedTopics: [
    { techId: 'vue-js', sectionId: 'vue-typescript', topicId: 'props-emits-typing', label: 'Props & Emits tipizatsiya' },
    { techId: 'vue-js', sectionId: 'vue-typescript', topicId: 'typed-slots-inject', label: 'Typed Slots & Inject' },
    { techId: 'vue-js', sectionId: 'vue-typescript', topicId: 'typed-composables', label: 'Tipli composablelar' },
    { techId: 'vue-js', sectionId: 'vue-core', topicId: 'components', label: 'Komponentlar' },
  ],
}
