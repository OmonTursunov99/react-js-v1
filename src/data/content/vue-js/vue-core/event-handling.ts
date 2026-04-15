import type { Topic } from '../../../types'

export const eventHandling: Topic = {
  id: 'event-handling',
  title: 'Event Handling',
  importance: 2,
  status: 'to-learn',
  description: '@click, event modifiers, key modifiers, defineEmits(), custom events — hodisa boshqarish',
  content: `Vue da hodisa (event) boshqarish — foydalanuvchi interaksiyalariga javob berish. v-on direktivi (@) orqali DOM va custom eventlarni tinglash mumkin.

═══════════════════════════════════════
  ASOSIY EVENT TINGLASH
═══════════════════════════════════════

v-on:event yoki @event qisqa sintaksis:

  <button @click="handleClick">Bosing</button>
  <input @input="onInput" />
  <form @submit="onSubmit" />

Inline handler — oddiy expression:
  <button @click="count++">+1</button>
  <button @click="message = 'Salom'">Salomlash</button>

Method handler — funksiya nomi:
  <button @click="handleClick">Bosing</button>

  function handleClick(event: MouseEvent) {
    console.log(event.target)
  }

Inline da method chaqirish — argumentlar bilan:
  <button @click="greet('Ali', $event)">Salomlash</button>

  function greet(name: string, event: MouseEvent) {
    console.log(name, event)
  }

$event — asl DOM event obyekti.

═══════════════════════════════════════
  EVENT MODIFIKATORLARI
═══════════════════════════════════════

Modifikatorlar — event xatti-harakatini o'zgartiradi:

  @click.stop       — event.stopPropagation() — bubble to'xtatish
  @click.prevent     — event.preventDefault() — standart xatti-harakatni bekor
  @click.self        — faqat element o'ziga bosilganda (bolalariga emas)
  @click.once        — faqat BIR MARTA ishlaydi
  @click.capture     — capture fazada tinglash (pastdan yuqoriga emas, yuqoridan pastga)
  @scroll.passive    — passive listener (scroll performance uchun)

Zanjirlab ishlatish mumkin:
  @click.stop.prevent — stopPropagation + preventDefault

Amaliy misollar:
  <form @submit.prevent="onSubmit">    <!-- forma yuborilmasin -->
  <a @click.prevent="navigate">Link</a> <!-- sahifa yangilanmasin -->
  <div @click.self="close">             <!-- faqat div o'ziga bosilganda -->
    <button>Ichki tugma — self ishlaMAYDI</button>
  </div>

═══════════════════════════════════════
  KEY MODIFIKATORLARI
═══════════════════════════════════════

Klaviatura hodisalari uchun:

  @keyup.enter    — Enter tugmasi
  @keyup.tab      — Tab
  @keyup.delete   — Delete (va Backspace)
  @keyup.esc      — Escape
  @keyup.space    — Space (bo'shliq)
  @keyup.up       — Yuqoriga strelka
  @keyup.down     — Pastga strelka
  @keyup.left     — Chapga strelka
  @keyup.right    — O'ngga strelka

Tizim modifikatorlari:
  @keyup.ctrl     — Ctrl bosib turgan holda
  @keyup.alt      — Alt bosib turgan holda
  @keyup.shift    — Shift bosib turgan holda
  @keyup.meta     — Meta (Cmd/Windows)

Kombinatsiya:
  @keyup.ctrl.enter="save"      — Ctrl + Enter
  @click.ctrl="selectMultiple"  — Ctrl + Click

.exact — FAQAT ko'rsatilgan modifikatorlar:
  @click.ctrl.exact="onCtrlClick" — faqat Ctrl, boshqa tugma emas

═══════════════════════════════════════
  defineEmits() — CUSTOM EVENTS
═══════════════════════════════════════

Bola komponent ota-ga hodisa yuboradi:

  // Bola komponent:
  const emit = defineEmits<{
    submit: [data: FormData]
    cancel: []
    update: [field: string, value: string]
  }>()

  emit('submit', formData)
  emit('cancel')
  emit('update', 'name', 'Ali')

  // Ota:
  <ChildForm
    @submit="onSubmit"
    @cancel="onCancel"
    @update="onFieldUpdate"
  />

defineEmits — compile-time macro, runtime-da yo'q bo'ladi.
TypeScript bilan to'liq tip tekshirish.

═══════════════════════════════════════
  INLINE VS METHOD HANDLERS
═══════════════════════════════════════

Inline — oddiy amallar uchun:
  @click="count++"
  @click="isOpen = !isOpen"
  @click="items.push('yangi')"

Method — murakkab logika uchun:
  @click="handleClick"
  @submit.prevent="handleSubmit"

QOIDA: Bir qatorga sig'masa — method ishlatish.
Method — test qilish, qayta ishlatish osonroq.

═══════════════════════════════════════
  REACT BILAN TAQQOSLASH
═══════════════════════════════════════

React: onClick={handleClick} — camelCase, JSX expression
Vue: @click="handleClick" — kebab-case event nomi, template directive

React: event.preventDefault() qo'lda chaqirish kerak
Vue: @submit.prevent — modifikator BILAN

React: custom event yo'q — callback props orqali (onSubmit, onCancel)
Vue: defineEmits() + emit('submit') — aniq event tizimi

React: synthetic events (React o'zi wrap qiladi)
Vue: native DOM events to'g'ridan-to'g'ri

React: onKeyDown={(e) => e.key === 'Enter' && save()}
Vue: @keyup.enter="save" — modifikator bilan soddaroq`,
  codeExamples: [
    {
      title: 'Event modifikatorlari — amaliy misollar',
      language: 'html',
      code: `<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)
const log = ref<string[]>([])

function addLog(msg: string) {
  log.value.unshift(\`[\${new Date().toLocaleTimeString()}] \${msg}\`)
  if (log.value.length > 10) log.value.pop()
}

function handleOuter() {
  addLog('Tashqi div bosildi')
}

function handleInner() {
  addLog('Ichki button bosildi')
}

function handleSelf() {
  addLog('.self — faqat div o\\'ziga bosildi')
}

function handleOnce() {
  addLog('.once — faqat BIR MARTA ishlaydi')
  count.value++
}

function handleSubmit() {
  addLog('.prevent — forma yuborilMADI, JavaScript ishladi')
}
</script>

<template>
  <div class="space-y-4">
    <!-- .stop — bubble to'xtatish -->
    <div @click="handleOuter" class="p-4 bg-blue-100 cursor-pointer">
      Tashqi div (click)
      <button @click.stop="handleInner" class="ml-2 px-3 py-1 bg-blue-500 text-white">
        .stop — bubble bermaydi
      </button>
    </div>

    <!-- .self — faqat o'ziga bosilganda -->
    <div @click.self="handleSelf" class="p-4 bg-green-100 cursor-pointer">
      .self div — faqat shu yerga bosing
      <button class="ml-2 px-3 py-1 bg-green-500 text-white">
        Bu bosilsa .self ishlaMAYDI
      </button>
    </div>

    <!-- .once — bir marta -->
    <button @click.once="handleOnce" class="px-4 py-2 bg-purple-500 text-white">
      .once — faqat birinchi marta ({{ count }})
    </button>

    <!-- .prevent — form submit -->
    <form @submit.prevent="handleSubmit" class="flex gap-2">
      <input type="text" placeholder="Matn kiriting" class="border px-3 py-1" />
      <button type="submit" class="px-4 py-1 bg-red-500 text-white">
        .prevent Submit
      </button>
    </form>

    <!-- Log -->
    <ul class="text-sm font-mono bg-gray-100 p-3 rounded">
      <li v-for="(entry, i) in log" :key="i">{{ entry }}</li>
    </ul>
  </div>
</template>`,
      description: '.stop (bubble to\'xtatish), .self (faqat o\'zi), .once (bir marta), .prevent (preventDefault). Amaliy misollar bilan.',
    },
    {
      title: 'Key modifikatorlari — klaviatura boshqaruv',
      language: 'html',
      code: `<script setup lang="ts">
import { ref } from 'vue'

const searchQuery = ref('')
const messages = ref<string[]>([])
const currentMessage = ref('')
const selectedIndex = ref(-1)
const items = ['Vue', 'React', 'Angular', 'Svelte', 'Solid']

function search() {
  console.log('Qidiruv:', searchQuery.value)
}

function sendMessage() {
  if (!currentMessage.value.trim()) return
  messages.value.push(currentMessage.value)
  currentMessage.value = ''
}

function navigateUp() {
  if (selectedIndex.value > 0) selectedIndex.value--
}

function navigateDown() {
  if (selectedIndex.value < items.length - 1) selectedIndex.value++
}

function clearSearch() {
  searchQuery.value = ''
}
</script>

<template>
  <div class="space-y-6">
    <!-- Enter — qidiruv -->
    <div>
      <label class="block mb-1 font-semibold">Enter bilan qidirish:</label>
      <input
        v-model="searchQuery"
        @keyup.enter="search"
        @keyup.esc="clearSearch"
        placeholder="Yozing va Enter bosing..."
        class="border px-3 py-2 w-full rounded"
      />
    </div>

    <!-- Ctrl+Enter — xabar yuborish -->
    <div>
      <label class="block mb-1 font-semibold">Ctrl+Enter bilan yuborish:</label>
      <textarea
        v-model="currentMessage"
        @keyup.ctrl.enter="sendMessage"
        placeholder="Xabar yozing... Ctrl+Enter yuborish"
        rows="3"
        class="border px-3 py-2 w-full rounded"
      />
      <div v-for="(msg, i) in messages" :key="i" class="mt-1 text-sm">
        {{ msg }}
      </div>
    </div>

    <!-- Arrow keys — navigatsiya -->
    <div @keyup.up="navigateUp" @keyup.down="navigateDown" tabindex="0"
         class="border rounded p-3 focus:ring-2">
      <p class="text-sm mb-2">⬆⬇ strelkalar bilan tanlang:</p>
      <div
        v-for="(item, i) in items"
        :key="item"
        :class="[
          'px-3 py-1 rounded',
          selectedIndex === i ? 'bg-blue-500 text-white' : 'hover:bg-gray-100',
        ]"
      >
        {{ item }}
      </div>
    </div>
  </div>
</template>`,
      description: '@keyup.enter, @keyup.esc, @keyup.ctrl.enter, @keyup.up/down — klaviatura hodisalari bilan qulay boshqaruv.',
    },
    {
      title: 'defineEmits() — custom events bilan forma',
      language: 'html',
      code: `<!-- ContactForm.vue -->
<script setup lang="ts">
import { ref, computed } from 'vue'

interface FormData {
  name: string
  email: string
  message: string
}

// defineEmits — TypeScript bilan tip tekshirish
const emit = defineEmits<{
  submit: [data: FormData]
  cancel: []
  'field-change': [field: keyof FormData, value: string]
}>()

const form = ref<FormData>({
  name: '',
  email: '',
  message: '',
})

const isValid = computed(() =>
  form.value.name.length > 0 &&
  form.value.email.includes('@') &&
  form.value.message.length > 10
)

function handleSubmit() {
  if (!isValid.value) return
  emit('submit', { ...form.value })
}

function handleCancel() {
  form.value = { name: '', email: '', message: '' }
  emit('cancel')
}

function onFieldChange(field: keyof FormData) {
  emit('field-change', field, form.value[field])
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-3">
    <input
      v-model="form.name"
      @input="onFieldChange('name')"
      placeholder="Ism"
      class="input"
    />
    <input
      v-model="form.email"
      @input="onFieldChange('email')"
      type="email"
      placeholder="Email"
      class="input"
    />
    <textarea
      v-model="form.message"
      @input="onFieldChange('message')"
      placeholder="Xabar (10+ belgi)"
      class="input"
    />
    <div class="flex gap-2">
      <button type="submit" :disabled="!isValid"
        class="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50">
        Yuborish
      </button>
      <button type="button" @click="handleCancel"
        class="px-4 py-2 bg-gray-300 rounded">
        Bekor
      </button>
    </div>
  </form>
</template>

<!-- Ota komponentda: -->
<!--
<ContactForm
  @submit="(data) => console.log('Yuborildi:', data)"
  @cancel="() => console.log('Bekor qilindi')"
  @field-change="(field, val) => console.log(field, val)"
/>
-->`,
      description: 'defineEmits<> — TypeScript bilan aniq event tiplar. submit, cancel, field-change — turli xil event pattern-lar.',
    },
  ],
  interviewQA: [
    {
      question: 'Vue da event modifikatorlari nima va nima uchun kerak?',
      answer: `Event modifikatorlari — DOM event xatti-harakatini deklarativ tarzda boshqarish. .prevent — preventDefault(), .stop — stopPropagation(), .self — faqat element o'ziga, .once — bir marta, .capture — capture fazada, .passive — passive listener. Afzalligi — JavaScript kodi toza qoladi, event logic template-da aniq ko'rinadi. React-da bularning hammasi qo'lda yoziladi: event.preventDefault(), event.stopPropagation(). Vue modifikatorlari kodni qisqartiradi va xatolarni kamaytiradi.`,
    },
    {
      question: 'defineEmits() nima va nima uchun ishlatiladi?',
      answer: `defineEmits() — bola komponentdan ota-ga hodisa yuborish uchun. Compile-time macro — runtime-da yo'q bo'ladi. TypeScript bilan tip xavfsizlik beradi: qaysi eventlar, qanday argumentlar bilan chiqarilishini aniq belgilaydi. Ishlatish: const emit = defineEmits<{ submit: [data: FormData], cancel: [] }>(), keyin emit('submit', data). Vue 3.3+ da qisqa tuple sintaksis. React-da analog — callback props: onSubmit, onCancel.`,
    },
    {
      question: 'Inline handler va method handler farqi nima?',
      answer: `Inline handler — template-da to'g'ridan-to'g'ri expression: @click="count++", @click="isOpen = !isOpen". Method handler — funksiya nomi: @click="handleClick". Vue farqni aniqlaydi: agar qiymat JavaScript identifikator yoki member expression bo'lsa — method, aks holda — inline. Method-da birinchi argument avtomatik Event obyekti. Inline-da $event orqali Event olish mumkin. Qoida: oddiy amal — inline, murakkab logika — method. Method test qilish va qayta ishlatish uchun yaxshiroq.`,
    },
    {
      question: 'Vue va React event handling farqlari nimada?',
      answer: `1) Sintaksis: Vue @click="handler" (directive), React onClick={handler} (JSX prop). 2) Modifikatorlar: Vue da .prevent, .stop, .once — template-da, React da qo'lda JavaScript-da. 3) Custom events: Vue da defineEmits + emit('eventName') — aniq event tizimi, React da callback props (onSubmit prop). 4) Key events: Vue da @keyup.enter — modifikator, React da onKeyUp + e.key === 'Enter' tekshirish. 5) Event obyekti: Vue native DOM event, React synthetic event (React o'zi wrap qiladi, React 19 dan beri native).`,
    },
    {
      question: '.passive modifikator nima uchun kerak?',
      answer: `.passive — brauzerga "bu listener preventDefault chaqirMAYDI" deb xabar beradi. Bu scroll va touch eventlar uchun muhim: brauzer listener natijasini kutmasdan scrollni darhol boshlaydi — performance yaxshilanadi. @scroll.passive, @touchmove.passive — mobil qurilmalarda smooth scrolling uchun. MUHIM: .passive va .prevent BIRGALIKDA ishlatib bo'lmaydi — brauzer ogohlantiris beradi. Chrome da touch/wheel eventlar default passive.`,
    },
  ],
  relatedTopics: [
    { techId: 'vue-js', sectionId: 'vue-core', topicId: 'directives', label: 'Direktivalar' },
    { techId: 'vue-js', sectionId: 'vue-core', topicId: 'v-model', label: 'v-model' },
    { techId: 'vue-js', sectionId: 'vue-core', topicId: 'components', label: 'Komponentlar' },
    { techId: 'vue-js', sectionId: 'vue-core', topicId: 'script-setup', label: 'Script Setup' },
  ],
}
