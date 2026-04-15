import type { Topic } from '../../../types'

export const vModel: Topic = {
  id: 'v-model',
  title: 'v-model Deep Dive',
  importance: 3,
  status: 'to-learn',
  description: 'v-model ishlash mexanizmi, defineModel(), multiple v-model, custom modifiers — ikki tomonlama bog\'lash chuqur',
  content: `v-model — Vue ning ikki tomonlama ma'lumot bog'lash (two-way binding) mexanizmi. Bu aslida :modelValue + @update:modelValue sintaktik qisqartmasi (syntactic sugar).

═══════════════════════════════════════
  v-model QANDAY ISHLAYDI
═══════════════════════════════════════

Oddiy input uchun:
  <input v-model="name" />

Aslida bu quyidagiga teng:
  <input :value="name" @input="name = $event.target.value" />

Har xil input turlari uchun:
- text/textarea — :value + @input
- checkbox/radio — :checked + @change
- select — :value + @change

v-model avtomatik to'g'ri property va eventni tanlaydi.

═══════════════════════════════════════
  defineModel() — Vue 3.4+
═══════════════════════════════════════

Vue 3.4 dan boshlab defineModel() makrosi — eng qulay usul:

  // Bola komponent:
  const modelValue = defineModel<string>()

  // Ota:
  <Child v-model="parentValue" />

defineModel() REF qaytaradi — to'g'ridan-to'g'ri o'qish VA yozish mumkin.
Avvalgi usul (Vue 3.0-3.3):
  const props = defineProps<{ modelValue: string }>()
  const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
  // Har safar emit('update:modelValue', newValue) chaqirish kerak edi

═══════════════════════════════════════
  MULTIPLE v-model
═══════════════════════════════════════

Bitta komponentda bir nechta v-model ishlatish mumkin:

  <UserForm
    v-model:firstName="first"
    v-model:lastName="last"
    v-model:email="email"
  />

Bola komponentda:
  const firstName = defineModel<string>('firstName')
  const lastName = defineModel<string>('lastName')
  const email = defineModel<string>('email')

Har bir v-model alohida prop/emit juftligi.

═══════════════════════════════════════
  v-model MODIFIKATORLARI
═══════════════════════════════════════

Built-in modifikatorlar:
- .lazy — input emas, change eventda yangilash
- .number — qiymatni number ga aylantirish
- .trim — bosh va oxiridagi bo'shliqlarni olib tashlash

Custom modifikatorlar (Vue 3.4+):
  <Input v-model.capitalize="text" />

Bola komponentda:
  const [model, modifiers] = defineModel<string>({
    set(value) {
      if (modifiers.capitalize) {
        return value.charAt(0).toUpperCase() + value.slice(1)
      }
      return value
    }
  })

═══════════════════════════════════════
  TURLI INPUT TURLARI BILAN
═══════════════════════════════════════

Checkbox — boolean yoki array:
  <input type="checkbox" v-model="isAgree" />     // boolean
  <input type="checkbox" v-model="selected" value="vue" />  // array

Radio — bitta qiymat:
  <input type="radio" v-model="picked" value="a" />
  <input type="radio" v-model="picked" value="b" />

Select — bitta yoki ko'p qiymat:
  <select v-model="chosen">
    <option value="vue">Vue</option>
    <option value="react">React</option>
  </select>

  <select v-model="chosenMultiple" multiple>
    ...
  </select>

═══════════════════════════════════════
  REACT BILAN TAQQOSLASH
═══════════════════════════════════════

React: controlled component pattern — value + onChange qo'lda yoziladi:
  <input value={name} onChange={e => setName(e.target.value)} />

Vue: v-model BITTA atribut — avtomatik ikki tomonlama bog'lash:
  <input v-model="name" />

React-da form boshqarish uchun ko'pincha React Hook Form yoki Formik kerak.
Vue-da v-model o'zi yetarli — tashqi kutubxona kamdan-kam kerak.

React-da multiple v-model analog yo'q — har bir prop uchun alohida callback.
Vue-da v-model:name="..." — bir nechta ikki tomonlama bog'lash qulay.`,
  codeExamples: [
    {
      title: 'defineModel() — Vue 3.4+ asosiy ishlatish',
      language: 'html',
      code: `<!-- RangeSlider.vue -->
<script setup lang="ts">
// defineModel — ref qaytaradi, to'g'ridan-to'g'ri o'qish/yozish mumkin
const modelValue = defineModel<number>({ default: 50 })

// Computed bilan ishlatish
const percentage = computed(() => modelValue.value + '%')
</script>

<template>
  <div class="flex items-center gap-3">
    <input
      type="range"
      :value="modelValue"
      @input="modelValue = Number(($event.target as HTMLInputElement).value)"
      min="0"
      max="100"
      class="flex-1"
    />
    <span class="w-12 text-right font-mono">{{ percentage }}</span>
  </div>
</template>

<!-- Ota komponentda: -->
<!--
<script setup>
import { ref } from 'vue'
import RangeSlider from './RangeSlider.vue'
const volume = ref(50)
</script>

<template>
  <RangeSlider v-model="volume" />
  <p>Ovoz balandligi: {{ volume }}</p>
</template>
-->`,
      description: 'defineModel() — Vue 3.4+ da v-model uchun eng qulay makro. Ref qaytaradi, to\'g\'ridan-to\'g\'ri mutatsiya mumkin.',
    },
    {
      title: 'Multiple v-model — forma komponent',
      language: 'html',
      code: `<!-- AddressForm.vue — bir nechta v-model -->
<script setup lang="ts">
const street = defineModel<string>('street', { default: '' })
const city = defineModel<string>('city', { default: '' })
const zipCode = defineModel<string>('zipCode', { default: '' })
const country = defineModel<string>('country', { default: 'UZ' })

const countries = [
  { code: 'UZ', name: "O'zbekiston" },
  { code: 'KZ', name: 'Qozog\'iston' },
  { code: 'KG', name: 'Qirg\'iziston' },
]
</script>

<template>
  <div class="space-y-3">
    <input v-model="street" placeholder="Ko'cha" class="input" />
    <div class="grid grid-cols-2 gap-3">
      <input v-model="city" placeholder="Shahar" class="input" />
      <input v-model="zipCode" placeholder="Pochta indeksi" class="input" />
    </div>
    <select v-model="country" class="input">
      <option v-for="c in countries" :key="c.code" :value="c.code">
        {{ c.name }}
      </option>
    </select>
  </div>
</template>

<!-- Ota komponentda: -->
<!--
<AddressForm
  v-model:street="address.street"
  v-model:city="address.city"
  v-model:zip-code="address.zipCode"
  v-model:country="address.country"
/>
-->`,
      description: 'Bir nechta v-model — har bir maydon alohida bog\'lanadi. Ota komponent har birini mustaqil boshqaradi.',
    },
    {
      title: 'Custom v-model modifikatorlar',
      language: 'html',
      code: `<!-- FormInput.vue — custom modifiers -->
<script setup lang="ts">
const [model, modifiers] = defineModel<string>({
  // set — qiymat o'zgartirilganda ishga tushadi
  set(value) {
    let result = value

    // .capitalize — birinchi harfni katta qilish
    if (modifiers.capitalize) {
      result = result.charAt(0).toUpperCase() + result.slice(1)
    }

    // .uppercase — hammasini katta harf
    if (modifiers.uppercase) {
      result = result.toUpperCase()
    }

    // .phone — faqat raqamlar va +
    if (modifiers.phone) {
      result = result.replace(/[^\\d+\\-\\s]/g, '')
    }

    return result
  },
})
</script>

<template>
  <input
    :value="model"
    @input="model = ($event.target as HTMLInputElement).value"
    class="border rounded px-3 py-2 w-full"
  />
</template>

<!-- Ishlatish: -->
<!--
<FormInput v-model.capitalize="name" />
<FormInput v-model.uppercase="code" />
<FormInput v-model.phone="phone" />
<FormInput v-model.capitalize.uppercase="shout" />
-->`,
      description: 'defineModel() bilan custom modifikatorlar. set() callback ichida qiymatni transformatsiya qilish. Bir nechta modifikator birgalikda ishlaydi.',
    },
    {
      title: 'Turli input turlari bilan v-model',
      language: 'html',
      code: `<script setup lang="ts">
import { ref, computed } from 'vue'

// Text
const name = ref('')

// Checkbox — boolean
const isAgree = ref(false)

// Checkbox — array (ko'p tanlash)
const selectedSkills = ref<string[]>([])
const allSkills = ['Vue', 'React', 'Angular', 'Svelte']

// Radio
const gender = ref<'male' | 'female' | ''>('')

// Select
const city = ref('')
const cities = ['Toshkent', 'Samarqand', 'Buxoro', 'Namangan']

// Select multiple
const languages = ref<string[]>([])

// Textarea
const bio = ref('')

// Summary
const summary = computed(() => ({
  name: name.value,
  isAgree: isAgree.value,
  skills: selectedSkills.value,
  gender: gender.value,
  city: city.value,
  languages: languages.value,
  bio: bio.value,
}))
</script>

<template>
  <form @submit.prevent class="space-y-4">
    <!-- Text + .trim -->
    <input v-model.trim="name" placeholder="Ismingiz" />

    <!-- Checkbox boolean -->
    <label>
      <input type="checkbox" v-model="isAgree" />
      Shartlarga roziman
    </label>

    <!-- Checkbox array -->
    <div v-for="skill in allSkills" :key="skill">
      <label>
        <input type="checkbox" v-model="selectedSkills" :value="skill" />
        {{ skill }}
      </label>
    </div>

    <!-- Radio -->
    <label><input type="radio" v-model="gender" value="male" /> Erkak</label>
    <label><input type="radio" v-model="gender" value="female" /> Ayol</label>

    <!-- Select -->
    <select v-model="city">
      <option value="" disabled>Shahar tanlang</option>
      <option v-for="c in cities" :key="c" :value="c">{{ c }}</option>
    </select>

    <!-- Textarea + .lazy -->
    <textarea v-model.lazy="bio" placeholder="O'zingiz haqida" />

    <pre>{{ summary }}</pre>
  </form>
</template>`,
      description: 'v-model har xil input turlari bilan: text, checkbox (boolean/array), radio, select, textarea. Modifikatorlar: .trim, .lazy.',
    },
  ],
  interviewQA: [
    {
      question: 'v-model qanday ishlaydi? U aslida nima?',
      answer: `v-model — syntactic sugar (sintaktik qisqartma). <input v-model="name"> aslida <input :value="name" @input="name = $event.target.value"> ga teng. Har xil input turlari uchun turli property/event ishlatadi: text — :value + @input, checkbox — :checked + @change, select — :value + @change. Komponentda esa :modelValue + @update:modelValue. Vue 3.4+ da defineModel() buni yanada soddalashtirdi — ref qaytaradi, to'g'ridan-to'g'ri o'qish/yozish mumkin.`,
    },
    {
      question: 'defineModel() va avvalgi usul (defineProps + defineEmits) farqi nima?',
      answer: `Avvalgi usul (Vue 3.0-3.3): defineProps<{ modelValue: string }>() bilan prop e'lon qilish, defineEmits<{ 'update:modelValue': [value: string] }>() bilan event e'lon qilish, keyin har safar emit('update:modelValue', newValue) chaqirish kerak edi. defineModel() (Vue 3.4+): bitta qator — const model = defineModel<string>() — ref qaytaradi, model.value = 'yangi' deyish yetarli, Vue avtomatik emit qiladi. Kamroq boilerplate, osonroq, TypeScript bilan yaxshi ishlaydi.`,
    },
    {
      question: 'Multiple v-model qanday ishlaydi va qachon kerak?',
      answer: `Bitta komponentda bir nechta v-model: <Form v-model:name="n" v-model:email="e">. Bola komponentda: const name = defineModel('name'), const email = defineModel('email'). Har biri alohida prop/emit juftligi. Ishlatish holatlari: forma komponentlar (AddressForm, UserForm), murakkab UI (DateRangePicker — start va end). Vue 2 da faqat bitta v-model mumkin edi, Vue 3 dan boshlab cheksiz.`,
    },
    {
      question: 'v-model modifikatorlari (.trim, .number, .lazy) nima qiladi? Custom modifikator qanday yaratiladi?',
      answer: `.trim — input qiymatining bosh va oxiridagi bo'shliqlarni olib tashlaydi. .number — qiymatni Number() orqali raqamga aylantiradi (parseFloat ishlatadi). .lazy — har keystroke emas, faqat change eventda (fokus yo'qolganda) yangilanadi — katta formalar uchun performance yaxshi. Custom modifikator Vue 3.4+ da: const [model, modifiers] = defineModel({ set(value) { if (modifiers.myMod) return transform(value); return value } }). Ishlatish: <Comp v-model.myMod="val">.`,
    },
  ],
  relatedTopics: [
    { techId: 'vue-js', sectionId: 'vue-core', topicId: 'directives', label: 'Direktivalar' },
    { techId: 'vue-js', sectionId: 'vue-core', topicId: 'components', label: 'Komponentlar' },
    { techId: 'vue-js', sectionId: 'vue-core', topicId: 'event-handling', label: 'Event Handling' },
    { techId: 'vue-js', sectionId: 'vue-reactivity', topicId: 'ref-reactive', label: 'ref va reactive' },
  ],
}
