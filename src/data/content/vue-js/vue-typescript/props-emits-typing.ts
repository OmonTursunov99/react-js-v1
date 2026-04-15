import type { Topic } from '../../../types'

export const propsEmitsTyping: Topic = {
  id: 'props-emits-typing',
  title: 'Props & Emits Typing',
  importance: 3,
  status: 'to-learn',
  description: 'defineProps<T>(), defineEmits<T>(), withDefaults, runtime vs type-only deklaratsiya — Vue da type-safe komponent interfeysi',
  content: `Vue 3 + TypeScript da komponentlar orasidagi ma'lumot almashinuvi to'liq tipizatsiya qilinadi. defineProps va defineEmits compiler makroslari orqali props va emitlar COMPILE TIME da tekshiriladi.

═══════════════════════════════════════
  RUNTIME VS TYPE-ONLY PROPS DEKLARATSIYA
═══════════════════════════════════════

Vue da props ikki xil usulda e'lon qilinadi:

1. RUNTIME deklaratsiya — JavaScript object sifatida:
   defineProps({
     title: { type: String, required: true },
     count: { type: Number, default: 0 },
   })
   Bu variant RUNTIME da ham tekshiradi (console warning beradi).

2. TYPE-ONLY deklaratsiya — TypeScript interface/type sifatida:
   defineProps<{ title: string; count?: number }>()
   Bu variant FAQAT compile time da tekshiradi. Runtime da
   validatsiya bo'lmaydi, lekin DX ancha yaxshi.

MUHIM: Ikkalasini BIRGA ishlatib BO'LMAYDI. Bitta komponentda
faqat BITTA usul tanlash kerak. Production loyihalarda type-only
yondashuv tavsiya etiladi — IDE support yaxshiroq, kodni o'qish
osonroq, TypeScript ekotizimi bilan uyg'un.

═══════════════════════════════════════
  defineProps<T>() — TYPE-SAFE PROPS
═══════════════════════════════════════

defineProps — compiler makrosi. Import qilish SHART EMAS.
Generic parametr sifatida interface yoki inline type berish mumkin:

  interface Props {
    title: string
    count: number
    items: string[]
    user?: { name: string; age: number }  // ixtiyoriy
  }

  const props = defineProps<Props>()
  // props.title — string
  // props.user — { name: string; age: number } | undefined

Destructuring QILINMAYDI (reaktivlik yo'qoladi):
  // NOTO'G'RI:
  const { title } = defineProps<Props>()  // reaktiv EMAS

  // TO'G'RI:
  const props = defineProps<Props>()
  // template da: {{ title }} (avtomatik unwrap)

Vue 3.5+ da reactive destructure ishlaydi:
  const { title, count = 0 } = defineProps<Props>()
  // title va count reaktiv, default qiymat ham ishlaydi

═══════════════════════════════════════
  withDefaults() — DEFAULT QIYMATLAR
═══════════════════════════════════════

Type-only deklaratsiyada default qiymat berish uchun withDefaults() ishlatiladi:

  const props = withDefaults(defineProps<Props>(), {
    count: 0,
    items: () => [],         // array/object uchun FACTORY FUNCTION
    user: () => ({ name: 'Guest', age: 0 }),
  })

Vue 3.5+ da withDefaults o'rniga destructure default ishlatish mumkin:
  const { count = 0, items = () => [] } = defineProps<Props>()

ESLATMA: Primitive tiplar (string, number, boolean) uchun
to'g'ridan-to'g'ri qiymat berish mumkin. Reference tiplar (array,
object) uchun DOIMO factory function ishlatish kerak — aks holda
barcha komponent instansiyalari bitta reference-ni share qiladi.

═══════════════════════════════════════
  defineEmits<T>() — TYPE-SAFE EVENTS
═══════════════════════════════════════

Emitlarni tipizatsiya qilishning ikki sintaksisi bor:

1. Call signature (Vue 3.2):
   const emit = defineEmits<{
     (e: 'update', value: string): void
     (e: 'delete', id: number): void
   }>()

2. Named tuple (Vue 3.3+ — TAVSIYA ETILADI):
   const emit = defineEmits<{
     update: [value: string]
     delete: [id: number]
     reset: []              // parametrsiz
   }>()

Ishlatish:
  emit('update', 'yangi qiymat')  // OK
  emit('update', 42)               // TYPE ERROR!
  emit('unknown')                   // TYPE ERROR!

═══════════════════════════════════════
  MURAKKAB PROP TIPLARI VA VALIDATOR
═══════════════════════════════════════

TypeScript orqali murakkab tiplar to'liq qo'llab-quvvatlanadi:

  type Status = 'active' | 'inactive' | 'pending'
  type SortDirection = 'asc' | 'desc'

  interface Column<T> {
    key: keyof T
    label: string
    sortable?: boolean
  }

  interface Props {
    status: Status                    // union type
    columns: Column<UserRow>[]        // generic type
    onSort?: (key: string, dir: SortDirection) => void
    renderHeader?: (col: Column<UserRow>) => string
  }

Runtime deklaratsiyada validator TypeScript bilan birgalikda ishlaydi:
  defineProps({
    status: {
      type: String as PropType<Status>,
      required: true,
      validator: (v: Status) => ['active', 'inactive', 'pending'].includes(v),
    },
  })

═══════════════════════════════════════
  REACT BILAN TAQQOSLASH
═══════════════════════════════════════

React da props — oddiy TypeScript interface, maxsus API yo'q:
  interface Props { title: string; count?: number }
  function MyComponent({ title, count = 0 }: Props) { ... }

Vue da esa defineProps<T>() COMPILER MAKROSI — TypeScript dan
tashqari qo'shimcha imkoniyatlar beradi:
  - withDefaults() — default qiymatlar alohida API
  - Runtime validatsiya — console warning development da
  - Template da avtomatik unwrap (props. prefiksi shart emas)

Emitlar farqi:
  - React: callback props (onChange, onSubmit) — oddiy function
  - Vue: defineEmits<T>() — maxsus emit tizimi, template da @event

Vue yondashuvi YANADA VERBOSE, lekin runtime tekshiruv va IDE
integration kuchliroq. React yondashuvi SODDAROQ — standart
TypeScript pattern.

Vue 3.5 reactive destructure React pattern-ga yaqinlashdi —
endi Vue da ham destructure + default ishlaydi.`,
  codeExamples: [
    {
      title: 'defineProps<T>() va withDefaults — to\'liq misol',
      language: 'html',
      code: `<script setup lang="ts">
// ── Props interface ──
interface UserProfile {
  id: number
  name: string
  email: string
  avatar?: string
}

type Size = 'sm' | 'md' | 'lg'
type Variant = 'default' | 'outlined' | 'filled'

interface Props {
  user: UserProfile
  size?: Size
  variant?: Variant
  showActions?: boolean
  maxNameLength?: number
  tags?: string[]
}

// ── withDefaults bilan default qiymatlar ──
const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  variant: 'default',
  showActions: true,
  maxNameLength: 50,
  tags: () => [],  // array uchun factory function!
})

// ── TypeScript to'liq ishlaydi ──
const displayName = computed(() => {
  const name = props.user.name
  return name.length > props.maxNameLength
    ? name.slice(0, props.maxNameLength) + '...'
    : name
})

// props.user.id    — number (autocomplete ishlaydi)
// props.size       — 'sm' | 'md' | 'lg' (default: 'md')
// props.tags       — string[] (default: [])
</script>

<template>
  <div :class="['user-card', size, variant]">
    <img v-if="user.avatar" :src="user.avatar" :alt="user.name" />
    <h3>{{ displayName }}</h3>
    <p>{{ user.email }}</p>
    <span v-for="tag in tags" :key="tag" class="tag">{{ tag }}</span>
    <slot v-if="showActions" name="actions" />
  </div>
</template>`,
      description: 'Murakkab props interface: nested object, union types, optional props, array default. withDefaults() orqali default qiymatlar.',
    },
    {
      title: 'defineEmits<T>() — Named Tuple sintaksisi (Vue 3.3+)',
      language: 'html',
      code: `<script setup lang="ts">
// ── Tiplar ──
interface FormData {
  title: string
  description: string
  priority: 'low' | 'medium' | 'high'
}

interface ValidationError {
  field: string
  message: string
}

// ── Props ──
const props = defineProps<{
  initialData?: FormData
  isLoading?: boolean
}>()

// ── Emits — named tuple (Vue 3.3+) ──
const emit = defineEmits<{
  submit: [data: FormData]
  cancel: []
  validate: [field: string, value: unknown]
  error: [errors: ValidationError[]]
}>()

// ── Ishlatish ──
function handleSubmit() {
  const data: FormData = {
    title: title.value,
    description: desc.value,
    priority: priority.value,
  }

  const errors = validateForm(data)
  if (errors.length > 0) {
    emit('error', errors)       // ValidationError[] kutadi
    return
  }

  emit('submit', data)          // FormData kutadi
}

function handleCancel() {
  emit('cancel')                // parametrsiz
}

function handleBlur(field: string, value: unknown) {
  emit('validate', field, value) // ikki parametr
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <!-- form fields -->
    <button type="submit" :disabled="isLoading">Saqlash</button>
    <button type="button" @click="handleCancel">Bekor qilish</button>
  </form>
</template>`,
      description: 'defineEmits named tuple sintaksisi — har bir event nomi va parametrlari aniq tipizatsiya qilingan. Vue 3.3+ da tavsiya etilgan yondashuv.',
    },
    {
      title: 'Vue 3.5 Reactive Destructure — withDefaults o\'rniga',
      language: 'html',
      code: `<script setup lang="ts">
// ═══ Vue 3.5+ — Reactive Destructure ═══
// withDefaults() o'rniga to'g'ridan-to'g'ri destructure

interface Props {
  title: string
  count?: number
  items?: string[]
  config?: {
    theme: 'light' | 'dark'
    locale: string
  }
}

// ── Default qiymatlar destructure da ──
const {
  title,                                // required — default yo'q
  count = 0,                            // primitive default
  items = () => [],                     // array — factory function
  config = () => ({                     // object — factory function
    theme: 'light' as const,
    locale: 'uz',
  }),
} = defineProps<Props>()

// Endi title, count, items, config — REAKTIV
// watch, computed da to'g'ridan-to'g'ri ishlatish mumkin
watch(() => count, (newVal) => {
  console.log('count o\\'zgardi:', newVal)
})

const doubled = computed(() => count * 2)

// ═══ ESKISI (Vue 3.4 va oldin) ═══
// const props = withDefaults(defineProps<Props>(), {
//   count: 0,
//   items: () => [],
//   config: () => ({ theme: 'light', locale: 'uz' }),
// })
// Template da: {{ props.count }} yoki {{ count }}
</script>

<template>
  <!-- Destructure qilingan o'zgaruvchilar to'g'ridan-to'g'ri -->
  <h1>{{ title }}</h1>
  <p>Count: {{ count }} (doubled: {{ doubled }})</p>
  <ul>
    <li v-for="item in items" :key="item">{{ item }}</li>
  </ul>
  <div :class="config.theme">{{ config.locale }}</div>
</template>`,
      description: 'Vue 3.5 reactive destructure — React pattern-ga yaqin. withDefaults() kerak emas, lekin array/object uchun factory function hali ham talab qilinadi.',
    },
    {
      title: 'PropType va Runtime Validator — murakkab tiplar',
      language: 'html',
      code: `<script setup lang="ts">
import type { PropType } from 'vue'

// ═══ Runtime deklaratsiya — validator bilan ═══
// Type-only deklaratsiya validator qo'llab-quvvatlamaydi,
// shuning uchun runtime deklaratsiya kerak bo'ladi

type Status = 'active' | 'inactive' | 'banned'

interface Address {
  street: string
  city: string
  zip: string
  country: string
}

interface GeoCoords {
  lat: number
  lng: number
}

const props = defineProps({
  // ── String union — PropType bilan ──
  status: {
    type: String as PropType<Status>,
    required: true,
    validator: (value: Status) => {
      return ['active', 'inactive', 'banned'].includes(value)
    },
  },

  // ── Object — PropType bilan ──
  address: {
    type: Object as PropType<Address>,
    required: true,
    validator: (addr: Address) => {
      return addr.zip.length >= 5 && addr.country.length === 2
    },
  },

  // ── Array of objects ──
  coords: {
    type: Array as PropType<GeoCoords[]>,
    default: () => [],
    validator: (points: GeoCoords[]) => {
      return points.every(p =>
        p.lat >= -90 && p.lat <= 90 &&
        p.lng >= -180 && p.lng <= 180
      )
    },
  },

  // ── Function prop ──
  formatter: {
    type: Function as PropType<(value: number) => string>,
    default: (v: number) => v.toFixed(2),
  },
})

// props.status  — Status ('active' | 'inactive' | 'banned')
// props.address — Address
// props.coords  — GeoCoords[]
</script>`,
      description: 'Runtime deklaratsiya + PropType + validator. Compile time VA runtime tekshiruv birga ishlaydi. Murakkab tiplar va custom validatsiya.',
    },
    {
      title: 'React vs Vue — Props tipizatsiya taqqoslash',
      language: 'ts',
      code: `// ═══════════════════════════════════════
//  REACT — Oddiy TypeScript interface
// ═══════════════════════════════════════

interface UserCardProps {
  user: { id: number; name: string }
  size?: 'sm' | 'md' | 'lg'
  onEdit?: (id: number) => void
  onDelete?: (id: number) => void
}

function UserCard({
  user,
  size = 'md',
  onEdit,
  onDelete,
}: UserCardProps) {
  return (
    <div className={size}>
      <h3>{user.name}</h3>
      <button onClick={() => onEdit?.(user.id)}>Edit</button>
      <button onClick={() => onDelete?.(user.id)}>Delete</button>
    </div>
  )
}

// ═══════════════════════════════════════
//  VUE — Compiler makroslari
// ═══════════════════════════════════════

// <script setup lang="ts">
// interface Props {
//   user: { id: number; name: string }
//   size?: 'sm' | 'md' | 'lg'
// }
//
// const { user, size = 'md' } = defineProps<Props>()  // Vue 3.5+
//
// const emit = defineEmits<{
//   edit: [id: number]
//   delete: [id: number]
// }>()
// </script>
//
// <template>
//   <div :class="size">
//     <h3>{{ user.name }}</h3>
//     <button @click="emit('edit', user.id)">Edit</button>
//     <button @click="emit('delete', user.id)">Delete</button>
//   </div>
// </template>

// FARQLAR:
// 1. React: callback props (onEdit) — Vue: emit system
// 2. React: destructure native — Vue: 3.5+ dan reactive destructure
// 3. React: default = standart JS — Vue: withDefaults / destructure
// 4. React: runtime tekshiruv YO'Q — Vue: runtime + compile time
// 5. React: children prop — Vue: slot system`,
      description: 'React va Vue props tipizatsiya yondashuvlarini yonma-yon taqqoslash. React soddaroq, Vue boy imkoniyatli (runtime check, emit system).',
    },
  ],
  interviewQA: [
    {
      question: 'Vue da runtime va type-only props deklaratsiya farqi nima? Qaysi birini qachon ishlatish kerak?',
      answer: `Runtime deklaratsiya — defineProps({ name: { type: String, required: true } }) — JavaScript object sifatida. Bu variant RUNTIME da ham tekshiradi (development da console warning beradi), validator function qo'shish mumkin. Type-only deklaratsiya — defineProps<{ name: string }>() — TypeScript generic sifatida. Bu FAQAT compile time da tekshiradi, DX yaxshiroq (IDE autocomplete, type inference). Ikkalasini birga ishlatib bo'lmaydi. Tavsiya: Production da type-only + custom validator kerak bo'lsa, runtime. Ko'p hollarda type-only yetarli — runtime tekshiruv asosan 3rd-party yoki dynamic data bilan ishlashda kerak.`,
    },
    {
      question: 'withDefaults() nima uchun kerak va Vue 3.5 da nima o\'zgardi?',
      answer: `withDefaults() — type-only props deklaratsiyada default qiymat berish uchun maxsus helper. Sababi: TypeScript generic da default qiymat berish IMKONSIZ — bu JS runtime konsepti. withDefaults ikkinchi argument sifatida default object oladi. Array va object uchun FACTORY FUNCTION kerak (reference sharing oldini olish). Vue 3.5+ da reactive destructure qo'shildi — endi const { count = 0, items = () => [] } = defineProps<Props>() ishlaydi. Bu withDefaults-ga ehtiyojni kamaytiradi va React pattern-ga o'xshash bo'ldi. Lekin ichki implementatsiya farqli — Vue compiler buni maxsus qayta ishlaydi, oddiy JS destructure emas.`,
    },
    {
      question: 'defineEmits da call signature va named tuple farqi nima?',
      answer: `Call signature (Vue 3.2): defineEmits<{ (e: 'update', v: string): void }>() — funksiya overload sintaksisi. Named tuple (Vue 3.3+): defineEmits<{ update: [value: string] }>() — soddaroq, o'qish oson. Named tuple TAVSIYA ETILADI sabablari: 1) qisqaroq sintaksis, 2) parametr nomlari aniqroq ko'rinadi, 3) parametrsiz eventlar oddiy: reset: [], 4) IDE tooling yaxshiroq ishlaydi. Call signature hali ham ishlaydi, lekin yangi loyihalarda named tuple standart.`,
    },
    {
      question: 'Vue da callback props (React pattern) o\'rniga emitlar ishlatiladi — buning afzalligi va kamchiligi nima?',
      answer: `Vue emit tizimi afzalliklari: 1) Template da @event bilan eshitish — deklarativ va tushunarli, 2) DevTools da eventlar kuzatiladi, 3) Component interface aniq — props kirish, emits chiqish, 4) event modifier-lar (.prevent, .stop) bilan birgalikda ishlaydi. Kamchiliklari: 1) string-based — typo xavfi (TypeScript bu muammoni hal qiladi), 2) event bubbling YO'Q — faqat parent eshitadi, 3) React callback props soddaroq — oddiy function, maxsus API kerak emas. React yondashuvining asosiy afzalligi — bu STANDART TypeScript, hech qanday maxsus tool kerak emas. Vue emit esa framework-specific konsept.`,
    },
    {
      question: 'PropType<T> nima va qachon ishlatiladi?',
      answer: `PropType<T> — runtime deklaratsiyada TypeScript tiplarini ulash uchun utility type. Sababi: runtime deklaratsiyada type: String faqat JavaScript constructor, TypeScript union type yoki interface bermaydi. PropType bilan: type: String as PropType<'active' | 'inactive'> — endi TypeScript ham, runtime ham ishlaydi. Ishlatish holatlari: 1) validator function kerak bo'lganda, 2) 3rd-party kutubxona komponentlarida, 3) mixed JS/TS loyihalarda. Type-only deklaratsiyada PropType KERAK EMAS — to'g'ridan-to'g'ri interface berish yetarli.`,
    },
  ],
  relatedTopics: [
    { techId: 'vue-js', sectionId: 'vue-core', topicId: 'components', label: 'Komponentlar' },
    { techId: 'vue-js', sectionId: 'vue-typescript', topicId: 'generic-components', label: 'Generic komponentlar' },
    { techId: 'vue-js', sectionId: 'vue-typescript', topicId: 'typed-composables', label: 'Tipli composablelar' },
    { techId: 'vue-js', sectionId: 'vue-patterns', topicId: 'teleport-suspense', label: 'Teleport va Suspense' },
  ],
}
