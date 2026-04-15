import type { Topic } from '../../../types'

export const scriptSetup: Topic = {
  id: 'script-setup',
  title: '<script setup>',
  importance: 3,
  status: 'to-learn',
  description: 'defineProps, defineEmits, defineModel, defineExpose, defineOptions, defineSlots — compiler macros',
  content: `<script setup> — Vue 3 ning Composition API uchun compile-time syntactic sugar. Kamroq boilerplate, yaxshiroq TypeScript qo'llab-quvvatlash, tezroq runtime.

═══════════════════════════════════════
  <script setup> ASOSLARI
═══════════════════════════════════════

<script setup> — oddiy <script> + setup() funksiyasining qisqa versiyasi:

  <!-- <script setup> bilan: -->
  <script setup lang="ts">
  import { ref } from 'vue'
  const count = ref(0)
  function increment() { count.value++ }
  </script>

  <!-- setup() funksiyasi bilan (eski usul): -->
  <script lang="ts">
  import { ref, defineComponent } from 'vue'
  export default defineComponent({
    setup() {
      const count = ref(0)
      function increment() { count.value++ }
      return { count, increment }  // template uchun QAYTARISH kerak
    }
  })
  </script>

Afzalliklari:
- return {} kerak EMAS — hamma narsa avtomatik template-da mavjud
- import qilingan komponentlar avtomatik ro'yxatga olinadi
- TypeScript bilan yaxshiroq — tip inference soddaroq
- Kamroq boilerplate — toza, o'qilishi oson kod

═══════════════════════════════════════
  defineProps() — Props qabul qilish
═══════════════════════════════════════

TypeScript generics bilan:
  const props = defineProps<{
    title: string
    count?: number
    items: string[]
  }>()

Default qiymatlar:
  const props = withDefaults(defineProps<{
    title: string
    count?: number
    items?: string[]
  }>(), {
    count: 0,
    items: () => [],  // object/array — factory function
  })

Runtime validation bilan (kamroq ishlatiladi):
  const props = defineProps({
    title: { type: String, required: true },
    count: { type: Number, default: 0 },
  })

═══════════════════════════════════════
  defineEmits() — Event chiqarish
═══════════════════════════════════════

  const emit = defineEmits<{
    submit: [data: FormData]
    cancel: []
    'update:modelValue': [value: string]
  }>()

  emit('submit', formData)  // tip tekshirish ishlaydi

═══════════════════════════════════════
  defineModel() — Vue 3.4+
═══════════════════════════════════════

v-model uchun — ref qaytaradi:
  const modelValue = defineModel<string>()
  modelValue.value = 'yangi'  // avtomatik emit

Nomlangan v-model:
  const title = defineModel<string>('title')
  const content = defineModel<string>('content')

Modifikatorlar bilan:
  const [model, modifiers] = defineModel<string>({
    set(value) {
      if (modifiers.capitalize) {
        return value.charAt(0).toUpperCase() + value.slice(1)
      }
      return value
    }
  })

═══════════════════════════════════════
  defineExpose() — Tashqariga ochish
═══════════════════════════════════════

<script setup> da hamma narsa YOPIQ — ota template ref orqali kirita OLMAYDI.
defineExpose() bilan aniq ochish kerak:

  const count = ref(0)
  const secretData = ref('maxfiy')

  function reset() { count.value = 0 }

  // Faqat count va reset tashqarida ko'rinadi
  defineExpose({ count, reset })
  // secretData — tashqaridan KIRA OLMAYDI

Ota komponentda:
  const childRef = ref<InstanceType<typeof Child>>()
  childRef.value?.reset()

═══════════════════════════════════════
  defineOptions() — Vue 3.3+
═══════════════════════════════════════

Komponent opsiyalari (name, inheritAttrs):
  defineOptions({
    name: 'MyComponent',           // DevTools da ko'rinadi
    inheritAttrs: false,           // attrs avtomatik qo'shilmasin
  })

Avval <script setup> bilan komponent nomi berish mumkin emas edi —
alohida <script> blok kerak edi. defineOptions() buni hal qildi.

═══════════════════════════════════════
  defineSlots() — Vue 3.3+
═══════════════════════════════════════

Slot tiplarini aniqlash (TypeScript uchun):
  const slots = defineSlots<{
    default(props: { item: User }): any
    header(props: { title: string }): any
    footer(): any
  }>()

Bu asosan kutubxona mualliflari uchun — slot props tiplarini aniq belgilash.

═══════════════════════════════════════
  TOP-LEVEL AWAIT
═══════════════════════════════════════

<script setup> ichida top-level await ishlatish mumkin:
  const data = await fetch('/api/data').then(r => r.json())

Lekin komponent ASYNC bo'ladi — Suspense ichida bo'lishi SHART.
Aks holda renderlanMAYDI.

═══════════════════════════════════════
  IMPORT AUTO-EXPOSURE
═══════════════════════════════════════

Import qilingan narsalar template-da avtomatik mavjud:
  import { ref, computed } from 'vue'
  import MyButton from './MyButton.vue'      // komponent
  import { formatDate } from './utils'        // funksiya
  import { API_URL } from './constants'       // konstanta

Template-da hammasi ishlatiladi — alohida components:{} ro'yxat kerak EMAS.

═══════════════════════════════════════
  REACT BILAN TAQQOSLASH
═══════════════════════════════════════

Vue <script setup> va React functional component:
- Ikkalasi ham funksional yondashuv
- Vue setup BITTA MARTA ishlaydi, React funksiya HAR RENDER da
- Vue makrolar (defineProps, defineEmits) — compile-time, React-da runtime
- Vue defineExpose — aniq API, React useImperativeHandle — o'xshash
- Vue defineModel — v-model uchun, React-da analog yo'q
- Vue defineOptions — name, inheritAttrs, React-da displayName

React-da barcha logika funksiya ichida, re-render muammolari bor.
Vue <script setup> — bir marta ishlaydi, reaktivlik tizimi kuzatadi.`,
  codeExamples: [
    {
      title: 'Barcha compiler macros — to\'liq misol',
      language: 'html',
      code: `<!-- AdvancedInput.vue — barcha makrolar birgalikda -->
<script setup lang="ts">
import { ref, computed, watch } from 'vue'

// ═══ defineOptions — komponent nomi va attrs ═══
defineOptions({
  name: 'AdvancedInput',
  inheritAttrs: false,
})

// ═══ defineProps — props qabul qilish ═══
interface Props {
  label: string
  placeholder?: string
  type?: 'text' | 'email' | 'password' | 'number'
  error?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '',
  type: 'text',
  disabled: false,
})

// ═══ defineEmits — event chiqarish ═══
const emit = defineEmits<{
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
  'validation-error': [message: string]
}>()

// ═══ defineModel — v-model ═══
const modelValue = defineModel<string>({ default: '' })

// ═══ defineSlots — slot tiplari ═══
defineSlots<{
  prefix(): any
  suffix(): any
}>()

// ═══ Ichki logika ═══
const isFocused = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)

const charCount = computed(() => modelValue.value.length)
const hasError = computed(() => !!props.error)

function handleFocus(e: FocusEvent) {
  isFocused.value = true
  emit('focus', e)
}

function handleBlur(e: FocusEvent) {
  isFocused.value = false
  emit('blur', e)
}

function clear() {
  modelValue.value = ''
  inputRef.value?.focus()
}

function focusInput() {
  inputRef.value?.focus()
}

// ═══ defineExpose — tashqariga ochish ═══
defineExpose({
  focus: focusInput,
  clear,
  inputRef,
})
</script>

<template>
  <div class="space-y-1">
    <label v-if="label" class="block text-sm font-medium" @click="focusInput">
      {{ label }}
    </label>
    <div :class="[
      'flex items-center border rounded px-3 py-2 transition-colors',
      isFocused ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-300',
      hasError ? 'border-red-500' : '',
      disabled ? 'bg-gray-100 opacity-60' : '',
    ]">
      <slot name="prefix" />
      <input
        ref="inputRef"
        :value="modelValue"
        @input="modelValue = ($event.target as HTMLInputElement).value"
        @focus="handleFocus"
        @blur="handleBlur"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        class="flex-1 outline-none bg-transparent"
      />
      <button v-if="modelValue" @click="clear" class="text-gray-400 hover:text-gray-600 ml-2">
        ✕
      </button>
      <slot name="suffix" />
    </div>
    <div class="flex justify-between text-xs">
      <span v-if="error" class="text-red-500">{{ error }}</span>
      <span class="text-gray-400 ml-auto">{{ charCount }}</span>
    </div>
  </div>
</template>`,
      description: 'Barcha 6 ta makro birgalikda: defineOptions, defineProps, defineEmits, defineModel, defineSlots, defineExpose. To\'liq tipizatsiya.',
    },
    {
      title: 'defineExpose() — ota dan bolaga murojaat',
      language: 'html',
      code: `<!-- Timer.vue — defineExpose bilan API ochish -->
<script setup lang="ts">
import { ref, onUnmounted } from 'vue'

const seconds = ref(0)
const isRunning = ref(false)
let intervalId: number | null = null

function start() {
  if (isRunning.value) return
  isRunning.value = true
  intervalId = window.setInterval(() => {
    seconds.value++
  }, 1000)
}

function stop() {
  if (!isRunning.value) return
  isRunning.value = false
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
}

function reset() {
  stop()
  seconds.value = 0
}

// FAQAT kerakli API-ni ochish
defineExpose({
  start,
  stop,
  reset,
  seconds,    // readonly sifatida ishlatish kerak
  isRunning,
})

// intervalId — tashqarida KIRA OLMAYDI (xavfsiz)

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
})
</script>

<template>
  <div class="text-center p-4 border rounded">
    <div class="text-4xl font-mono mb-4">
      {{ String(Math.floor(seconds / 60)).padStart(2, '0') }}:{{ String(seconds % 60).padStart(2, '0') }}
    </div>
    <div class="flex gap-2 justify-center">
      <button @click="start" :disabled="isRunning"
        class="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50">
        Boshlash
      </button>
      <button @click="stop" :disabled="!isRunning"
        class="px-4 py-2 bg-yellow-500 text-white rounded disabled:opacity-50">
        To'xtatish
      </button>
      <button @click="reset" class="px-4 py-2 bg-red-500 text-white rounded">
        Qaytarish
      </button>
    </div>
  </div>
</template>

<!-- Ota komponentda: -->
<!--
<script setup>
import { ref } from 'vue'
import Timer from './Timer.vue'

const timerRef = ref<InstanceType<typeof Timer>>()

function externalReset() {
  timerRef.value?.reset()
  console.log('Vaqt:', timerRef.value?.seconds)
}
</script>

<template>
  <Timer ref="timerRef" />
  <button @click="externalReset">Tashqaridan qaytarish</button>
</template>
-->`,
      description: 'defineExpose() — faqat kerakli API tashqariga ochiladi. InstanceType<typeof Component> — TypeScript tip xavfsizlik.',
    },
    {
      title: '<script setup> vs setup() — farqlarni ko\'rish',
      language: 'html',
      code: `<!-- === USUL 1: <script setup> (TAVSIYA ETILADI) === -->
<script setup lang="ts">
import { ref, computed } from 'vue'
import ChildComponent from './ChildComponent.vue'  // avtomatik ro'yxatga olinadi
import { formatDate } from '@/utils'               // template-da mavjud

interface Props {
  title: string
  initialCount?: number
}

const props = withDefaults(defineProps<Props>(), {
  initialCount: 0,
})

const emit = defineEmits<{
  change: [value: number]
}>()

const count = ref(props.initialCount)
const doubled = computed(() => count.value * 2)

function increment() {
  count.value++
  emit('change', count.value)
}
</script>

<template>
  <div>
    <h1>{{ title }}</h1>
    <p>Count: {{ count }} | Doubled: {{ doubled }}</p>
    <p>{{ formatDate(new Date()) }}</p>
    <button @click="increment">+1</button>
    <ChildComponent />
  </div>
</template>

<!-- === USUL 2: setup() funksiyasi (ESKI USUL) === -->
<!--
<script lang="ts">
import { ref, computed, defineComponent } from 'vue'
import ChildComponent from './ChildComponent.vue'
import { formatDate } from '@/utils'

interface Props {
  title: string
  initialCount?: number
}

export default defineComponent({
  components: { ChildComponent },
  props: {
    title: { type: String, required: true },
    initialCount: { type: Number, default: 0 },
  },
  emits: ['change'],
  setup(props, { emit }) {
    const count = ref(props.initialCount)
    const doubled = computed(() => count.value * 2)

    function increment() {
      count.value++
      emit('change', count.value)
    }

    // QAYTARISH SHART!
    return { count, doubled, increment, formatDate }
  },
})
</script>
-->`,
      description: '<script setup> — kamroq boilerplate, avtomatik import, return kerak emas. setup() — ko\'proq kod, lekin Options API bilan aralash ishlatish mumkin.',
    },
    {
      title: 'Top-level await + Suspense',
      language: 'html',
      code: `<!-- AsyncUserProfile.vue — top-level await -->
<script setup lang="ts">
interface User {
  id: number
  name: string
  email: string
  avatar: string
}

const props = defineProps<{
  userId: number
}>()

// Top-level await — komponent ASYNC bo'ladi
// Suspense ichida bo'lishi SHART
const response = await fetch(\`https://api.example.com/users/\${props.userId}\`)
if (!response.ok) throw new Error(\`Foydalanuvchi topilmadi: \${props.userId}\`)
const user: User = await response.json()

// Bu vaqtga kelib data tayyor
</script>

<template>
  <div class="flex items-center gap-4 p-4 border rounded">
    <img :src="user.avatar" :alt="user.name" class="w-16 h-16 rounded-full" />
    <div>
      <h2 class="text-lg font-bold">{{ user.name }}</h2>
      <p class="text-gray-500">{{ user.email }}</p>
    </div>
  </div>
</template>

<!-- Ota komponent — Suspense bilan: -->
<!--
<template>
  <Suspense>
    <template #default>
      <AsyncUserProfile :user-id="1" />
    </template>
    <template #fallback>
      <div class="animate-pulse p-4">
        <div class="h-16 w-16 bg-gray-200 rounded-full"></div>
        <div class="h-4 bg-gray-200 rounded w-32 mt-2"></div>
      </div>
    </template>
  </Suspense>
</template>
-->`,
      description: 'Top-level await — async <script setup>. Suspense SHART — fallback loading ko\'rsatadi. Xatolik uchun onErrorCaptured.',
    },
  ],
  interviewQA: [
    {
      question: '<script setup> nima va qanday afzalliklari bor?',
      answer: `<script setup> — Vue 3 da Composition API uchun compile-time syntactic sugar. Afzalliklari: 1) Kamroq boilerplate — return {} kerak emas, hamma narsa avtomatik template-da mavjud. 2) Import qilingan komponentlar avtomatik components ro'yxatiga olinadi. 3) defineProps/defineEmits — compile-time macros, runtime overhead yo'q. 4) Yaxshiroq TypeScript — tip inference soddaroq. 5) Tezroq — compiler optimallashtirish mumkin. Kamchiligi — Options API bilan aralash ishlatish mumkin emas (alohida <script> blok kerak).`,
    },
    {
      question: 'defineExpose() nima uchun kerak?',
      answer: `<script setup> da barcha o'zgaruvchilar va funksiyalar YOPIQ — ota komponent template ref orqali kira OLMAYDI (xavfsizlik). defineExpose() bilan faqat kerakli API aniq ochiladi: defineExpose({ reset, focus }). Ota: const child = ref(); child.value.reset(). Bu React-dagi useImperativeHandle-ga o'xshash. MUHIM: defineExpose ishlatmasangiz — ota hech narsaga kira olmaydi. Bu yaxshi — minimal API, xavfsiz kapsulyatsiya.`,
    },
    {
      question: 'defineOptions() va defineSlots() nima va qachon kerak?',
      answer: `defineOptions() (Vue 3.3+) — <script setup> ichida komponent opsiyalarini belgilash: name (DevTools uchun), inheritAttrs (false — attrs qo'lda boshqarish). Avval alohida <script> blok kerak edi. defineSlots() (Vue 3.3+) — slot tiplarini aniqlash (TypeScript). Slot props tiplarini aniq belgilash, IDE intellisense uchun. Asosan kutubxona mualliflari uchun — oddiy ilova-da kamdan-kam ishlatiladi, lekin tip xavfsizlik uchun foydali.`,
    },
    {
      question: '<script setup> da top-level await ishlatsa nima bo\'ladi?',
      answer: `Top-level await ishlatilsa — komponent async bo'ladi. Suspense ichida bo'lishi SHART, aks holda renderlanMAYDI. <Suspense><AsyncComponent /><template #fallback>Loading...</template></Suspense>. Afzalligi — data tayyor bo'lgandan keyin render. Kamchiligi — Suspense hali experimental (Vue 3.5+), error handling murakkab (onErrorCaptured kerak). Ko'p hollarda onMounted + isLoading pattern soddaroq va ishonchliroq.`,
    },
    {
      question: '<script setup> va React functional component farqi nima?',
      answer: `Eng muhim farq — Vue <script setup> BITTA MARTA ishlaydi (mount qilganda), React funksional komponent HAR RENDERDA to'liq ishlaydi. Vue-da ref/reactive yaratiladi va reaktivlik tizimi kuzatadi. React-da useState/useMemo har renderda qayta baholanadi. Vue makrolar (defineProps, defineEmits) — compile-time, nol runtime cost. React-da props oddiy funksiya argumenti. Vue defineExpose — aniq API, React useImperativeHandle — o'xshash. Vue defineModel — v-model uchun, React-da analog YO'Q.`,
    },
  ],
  relatedTopics: [
    { techId: 'vue-js', sectionId: 'vue-core', topicId: 'composition-api', label: 'Composition API' },
    { techId: 'vue-js', sectionId: 'vue-core', topicId: 'components', label: 'Komponentlar' },
    { techId: 'vue-js', sectionId: 'vue-typescript', topicId: 'ts-components', label: 'TypeScript Components' },
    { techId: 'vue-js', sectionId: 'vue-core', topicId: 'template-refs', label: 'Template Refs' },
  ],
}
