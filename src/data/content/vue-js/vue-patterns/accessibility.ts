import type { Topic } from '../../../types'

export const accessibility: Topic = {
  id: 'accessibility',
  title: 'Accessibility (a11y)',
  importance: 1,
  status: 'to-learn',
  description: 'Vue da accessibility — ARIA, focus management, keyboard navigation, screen reader',
  content: `Accessibility (a11y) — ilovani nogironligi bo'lgan foydalanuvchilar uchun ham qulay qilish. Bu faqat axloqiy emas, ko'p mamlakatlarda QONUNIY talab (ADA, WCAG).

═══════════════════════════════════════
  ARIA ATRIBUTLARI
═══════════════════════════════════════

ARIA (Accessible Rich Internet Applications) — HTML elementlarga
qo'shimcha semantik ma'lumot beradi. Screen reader lar buni o'qiydi.

Asosiy ARIA atributlar:
  role          — elementning vazifasi ("button", "dialog", "alert")
  aria-label    — ko'rinmas matn yorlig'i
  aria-labelledby — boshqa element ID bilan bog'lash
  aria-describedby — qo'shimcha tavsif
  aria-hidden   — screen reader dan yashirish
  aria-expanded — ochilgan/yopilgan holat
  aria-selected — tanlangan holat
  aria-live     — dinamik kontent e'lon qilish
  aria-disabled — nofaol holat

Vue template da ARIA:
  <button
    :aria-expanded="isOpen"
    :aria-controls="panelId"
    @click="toggle"
  >
    {{ isOpen ? "Yopish" : "Ochish" }}
  </button>

MUHIM QOIDA: Agar native HTML element vazifani bajarsa —
ARIA ISHLATMANG. <button> o'rniga <div role="button"> yozish NOTO'G'RI.
Native element allaqachon to'g'ri semantikaga ega.

═══════════════════════════════════════
  FOCUS MANAGEMENT
═══════════════════════════════════════

Focus boshqarish — keyboard foydalanuvchilar uchun muhim.
Vue da ref orqali element ga focus berish mumkin.

Qachon focus boshqarish kerak:
  1. Modal ochilganda — focus modal ichiga o'tkazish
  2. Modal yopilganda — focus trigger element ga qaytarish
  3. Route o'zgarganda — focus yangi sahifa boshiga
  4. Toast paydo bo'lganda — screen reader e'lon qilishi

Focus trap — modal ichida focus aylanishi:
  Tab bosib modal dan chiqib ketmaslik kerak.
  Oxirgi element dan birinchisiga, birinchidan oxirigiga o'tish.

Vue da template ref bilan focus:
  const inputRef = ref<HTMLInputElement | null>(null)
  onMounted(() => inputRef.value?.focus())

═══════════════════════════════════════
  KEYBOARD NAVIGATION
═══════════════════════════════════════

Barcha interaktiv elementlar keyboard bilan ishlatilishi KERAK.

Standart keyboard patternlar:
  Tab       — keyingi interaktiv elementga o'tish
  Shift+Tab — oldingi elementga o'tish
  Enter     — button bosish, link ochish
  Space     — checkbox toggle, button bosish
  Escape    — modal yopish, dropdown yopish
  Arrow keys — menu, tab, select ichida navigatsiya

tabindex atributi:
  tabindex="0"  — element tab tartibiga qo'shiladi
  tabindex="-1" — faqat programmatik focus mumkin (tab bilan emas)
  tabindex="1+" — ISHLATMANG (tartibni buzadi)

Vue da keyboard event boshqarish:
  @keydown.enter="submit"
  @keydown.escape="close"
  @keydown.tab="handleTab"
  @keydown.arrow-down="nextItem"

═══════════════════════════════════════
  SKIP LINKS
═══════════════════════════════════════

Skip link — sahifa boshida yashirin link. Focus tushganda ko'rinadi.
Keyboard foydalanuvchi navigatsiyani o'tkazib, asosiy kontentga o'tadi.

  <a href="#main-content" class="skip-link">
    Asosiy kontentga o'tish
  </a>

CSS: odatda ekrandan tashqarida, :focus da ko'rinadi.
Bu oddiy, lekin juda muhim a11y pattern.

═══════════════════════════════════════
  SCREEN READER
═══════════════════════════════════════

Screen reader (NVDA, VoiceOver, JAWS) sahifani OVOZLI o'qiydi.

Screen reader uchun muhim:
  1. Semantic HTML — <nav>, <main>, <article>, <aside>
  2. Heading ierarxiyasi — h1 → h2 → h3 (tartibda)
  3. Alt text — <img alt="Tavsif">
  4. Label — har bir form element uchun <label>
  5. ARIA — murakkab UI uchun qo'shimcha semantika

Yashirish usullari:
  aria-hidden="true" — screen reader dan yashirish (ko'rinadi)
  sr-only class — ko'zdan yashirish (screen reader o'qiydi)
  display:none — hammasidan yashirish

═══════════════════════════════════════
  LIVE REGIONS
═══════════════════════════════════════

Live region — dinamik o'zgaradigan kontent. Screen reader o'zgarishni
avtomatik e'lon qiladi, foydalanuvchi focus berishi shart emas.

  aria-live="polite"      — hozirgi o'qishni tugatsing, keyin e'lon qilsin
  aria-live="assertive"   — darhol e'lon qilsin (xatolik, ogohlantirishlar)
  role="alert"            — aria-live="assertive" ga teng
  role="status"           — aria-live="polite" ga teng

Vue da dinamik xabar uchun:
  <div aria-live="polite">
    {{ statusMessage }}
  </div>

statusMessage o'zgarganda screen reader avtomatik o'qiydi.

═══════════════════════════════════════
  VUE-SPECIFIC A11Y PATTERNLAR
═══════════════════════════════════════

1. Route o'zgarganda e'lon qilish:
   SPA da sahifa o'zgarganda screen reader bilmaydi.
   aria-live region orqali yangi sahifa nomini e'lon qilish kerak.

2. v-if vs v-show:
   v-if — DOM dan olib tashlaydi (screen reader ko'rmaydi)
   v-show — display:none (screen reader ko'rmaydi)
   Ikkalasi ham a11y jihatdan bir xil ishlaydi.

3. Teleport + aria:
   Modal Teleport bilan body ga ko'chganda ham
   aria-modal="true" va focus trap ishlashi kerak.

4. Transition + a11y:
   prefers-reduced-motion media query — animatsiya o'chirish.
   Vestibular disorder bo'lgan foydalanuvchilar uchun muhim.

═══════════════════════════════════════
  ESLINT-PLUGIN-VUEJS-ACCESSIBILITY
═══════════════════════════════════════

Avtomatik a11y tekshirish uchun ESLint plugin:
  npm install eslint-plugin-vuejs-accessibility

Tekshiradigan qoidalar:
  - img da alt atribut bormi
  - form element da label bormi
  - click event da keyboard alternative bormi
  - aria atributlar to'g'ri ishlatilganmi
  - tabindex qiymati to'g'rimi

Bu plugin a11y muammolarni development vaqtida ushlaydi.

═══════════════════════════════════════
  ACCESSIBLE FORM PATTERNLAR
═══════════════════════════════════════

1. Har bir input uchun label:
   <label for="email">Email</label>
   <input id="email" type="email" />

2. Xatolik xabari:
   <input aria-describedby="email-error" aria-invalid="true" />
   <p id="email-error" role="alert">Email noto'g'ri</p>

3. Required fieldlar:
   <input aria-required="true" />

4. Fieldset + legend:
   <fieldset><legend>Manzil</legend>...</fieldset>

═══════════════════════════════════════
  REACT BILAN TAQQOSLASH
═══════════════════════════════════════

  Konsept            | Vue                      | React
  ───────────────────|──────────────────────────|──────────────────
  ARIA binding       | :aria-expanded="val"     | aria-expanded={val}
  Focus ref          | ref<HTMLElement>          | useRef<HTMLElement>
  Keyboard events    | @keydown.enter           | onKeyDown + check
  A11y lint          | eslint-plugin-vuejs-a11y | eslint-plugin-jsx-a11y
  Skip link          | Bir xil                  | Bir xil
  Live region        | Bir xil (ARIA)           | Bir xil (ARIA)
  Focus after route  | router.afterEach         | useEffect + focus

Vue-ning afzalligi: @keydown.enter kabi modifier-lar keyboard
event-larni sodda qiladi. React-da event.key tekshirish kerak.
Umuman a11y pattern-lar framework-dan mustaqil — ARIA va HTML standart.`,
  codeExamples: [
    {
      title: 'Accessible Modal — focus trap bilan',
      language: 'html',
      code: `<!-- AccessibleModal.vue -->
<script setup lang="ts">
import { ref, watch, nextTick, onUnmounted } from "vue"

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()

const modalRef = ref<HTMLDivElement | null>(null)
const previousFocus = ref<HTMLElement | null>(null)

// Modal ochilganda focus boshqarish
watch(() => props.open, async (isOpen) => {
  if (isOpen) {
    // Oldingi focus ni saqlash
    previousFocus.value = document.activeElement as HTMLElement
    await nextTick()
    // Focus modal ga o'tkazish
    modalRef.value?.focus()
  } else {
    // Focus qaytarish
    previousFocus.value?.focus()
  }
})

// Focus trap — Tab modal ichida aylanadi
function handleKeydown(e: KeyboardEvent) {
  if (e.key === "Escape") {
    emit("close")
    return
  }
  if (e.key !== "Tab") return

  const focusable = modalRef.value?.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )
  if (!focusable?.length) return

  const first = focusable[0]
  const last = focusable[focusable.length - 1]

  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault()
    last.focus()
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault()
    first.focus()
  }
}

onUnmounted(() => previousFocus.value?.focus())
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="modal-overlay"
      @click.self="emit('close')"
    >
      <div
        ref="modalRef"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabindex="-1"
        @keydown="handleKeydown"
        class="modal-content"
      >
        <h2 id="modal-title">Modal sarlavha</h2>
        <p>Modal kontent</p>
        <button @click="emit('close')">Yopish</button>
      </div>
    </div>
  </Teleport>
</template>`,
      description: 'Focus trap, Escape yopish, aria-modal — to`liq accessible modal pattern.',
    },
    {
      title: 'Accessible Form — xatolik va label bilan',
      language: 'html',
      code: `<script setup lang="ts">
import { ref, computed } from "vue"

const email = ref("")
const password = ref("")
const submitted = ref(false)

const emailError = computed(() => {
  if (!submitted.value) return ""
  if (!email.value) return "Email kiritish majburiy"
  if (!email.value.includes("@")) return "Email formati noto'g'ri"
  return ""
})

const passwordError = computed(() => {
  if (!submitted.value) return ""
  if (!password.value) return "Parol kiritish majburiy"
  if (password.value.length < 8) return "Parol kamida 8 belgi"
  return ""
})

function handleSubmit() {
  submitted.value = true
  if (!emailError.value && !passwordError.value) {
    console.log("Form yuborildi")
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" novalidate>
    <!-- Email field -->
    <div class="field">
      <label for="email">Email *</label>
      <input
        id="email"
        v-model="email"
        type="email"
        :aria-invalid="!!emailError"
        :aria-describedby="emailError ? 'email-error' : undefined"
        aria-required="true"
      />
      <p v-if="emailError" id="email-error" role="alert" class="error">
        {{ emailError }}
      </p>
    </div>

    <!-- Password field -->
    <div class="field">
      <label for="password">Parol *</label>
      <input
        id="password"
        v-model="password"
        type="password"
        :aria-invalid="!!passwordError"
        :aria-describedby="passwordError ? 'password-error' : undefined"
        aria-required="true"
      />
      <p v-if="passwordError" id="password-error" role="alert" class="error">
        {{ passwordError }}
      </p>
    </div>

    <button type="submit">Kirish</button>
  </form>
</template>`,
      description: 'label, aria-invalid, aria-describedby, role="alert" — to`liq accessible form.',
    },
    {
      title: 'Keyboard navigatsiya — custom dropdown',
      language: 'html',
      code: `<script setup lang="ts">
import { ref, computed } from "vue"

interface Option {
  value: string
  label: string
}

const props = defineProps<{
  options: Option[]
  modelValue: string
}>()
const emit = defineEmits<{
  "update:modelValue": [value: string]
}>()

const isOpen = ref(false)
const activeIndex = ref(-1)
const listId = "dropdown-list"

const selectedLabel = computed(() =>
  props.options.find(o => o.value === props.modelValue)?.label ?? "Tanlang"
)

function toggle() {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    activeIndex.value = props.options.findIndex(
      o => o.value === props.modelValue
    )
  }
}

function select(option: Option) {
  emit("update:modelValue", option.value)
  isOpen.value = false
}

function handleKeydown(e: KeyboardEvent) {
  switch (e.key) {
    case "ArrowDown":
      e.preventDefault()
      if (!isOpen.value) { isOpen.value = true; return }
      activeIndex.value = Math.min(
        activeIndex.value + 1, props.options.length - 1
      )
      break
    case "ArrowUp":
      e.preventDefault()
      activeIndex.value = Math.max(activeIndex.value - 1, 0)
      break
    case "Enter":
    case " ":
      e.preventDefault()
      if (isOpen.value && activeIndex.value >= 0) {
        select(props.options[activeIndex.value])
      } else {
        toggle()
      }
      break
    case "Escape":
      isOpen.value = false
      break
  }
}
</script>

<template>
  <div class="dropdown" @keydown="handleKeydown">
    <button
      type="button"
      role="combobox"
      :aria-expanded="isOpen"
      :aria-controls="listId"
      :aria-activedescendant="
        activeIndex >= 0 ? 'option-' + activeIndex : undefined
      "
      @click="toggle"
    >
      {{ selectedLabel }}
    </button>

    <ul
      v-show="isOpen"
      :id="listId"
      role="listbox"
    >
      <li
        v-for="(option, i) in options"
        :key="option.value"
        :id="'option-' + i"
        role="option"
        :aria-selected="option.value === modelValue"
        :class="{ active: i === activeIndex }"
        @click="select(option)"
        @mouseenter="activeIndex = i"
      >
        {{ option.label }}
      </li>
    </ul>
  </div>
</template>`,
      description: 'Arrow keys, Enter, Escape bilan boshqariladigan accessible dropdown.',
    },
    {
      title: 'Live Region — dinamik xabar e`lon qilish',
      language: 'html',
      code: `<script setup lang="ts">
import { ref } from "vue"

// Polite — hozirgi o'qishni tugatsing, keyin e'lon qilsin
const statusMessage = ref("")

// Assertive — darhol e'lon qilsin
const errorMessage = ref("")

async function saveData() {
  try {
    statusMessage.value = "Saqlanmoqda..."
    // await api.save(data)
    statusMessage.value = "Muvaffaqiyatli saqlandi!"

    // 3 soniyadan keyin xabarni tozalash
    setTimeout(() => { statusMessage.value = "" }, 3000)
  } catch {
    errorMessage.value = "Xatolik! Ma'lumot saqlanmadi."
    setTimeout(() => { errorMessage.value = "" }, 5000)
  }
}

// Route o'zgarganda e'lon qilish (SPA a11y pattern)
// router.afterEach((to) => {
//   statusMessage.value = \`\${to.meta.title} sahifasi ochildi\`
// })
</script>

<template>
  <div>
    <button @click="saveData">Saqlash</button>

    <!-- Polite live region — status xabarlar -->
    <div
      role="status"
      aria-live="polite"
      class="sr-only"
    >
      {{ statusMessage }}
    </div>

    <!-- Assertive live region — xatolik xabarlar -->
    <div
      role="alert"
      aria-live="assertive"
      class="error-banner"
      v-show="errorMessage"
    >
      {{ errorMessage }}
    </div>
  </div>
</template>

<style>
/* Screen reader uchun ko'rinmas matn */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
</style>`,
      description: 'aria-live="polite" va role="alert" — screen reader dinamik o`zgarishlarni e`lon qiladi.',
    },
    {
      title: 'Skip Link va reduced motion',
      language: 'html',
      code: `<!-- App.vue — Skip link va a11y asoslari -->
<template>
  <!-- Skip link — Tab bilan focus tushganda ko'rinadi -->
  <a href="#main-content" class="skip-link">
    Asosiy kontentga o'tish
  </a>

  <header>
    <nav aria-label="Asosiy navigatsiya">
      <ul>
        <li><a href="/">Bosh sahifa</a></li>
        <li><a href="/about">Haqida</a></li>
        <li><a href="/contact">Aloqa</a></li>
      </ul>
    </nav>
  </header>

  <main id="main-content" tabindex="-1">
    <!-- tabindex="-1" — programmatik focus uchun -->
    <router-view />
  </main>

  <footer>
    <p>© 2024 Sayt nomi</p>
  </footer>
</template>

<style>
/* Skip link — odatda ko'rinmaydi */
.skip-link {
  position: absolute;
  top: -100%;
  left: 0;
  z-index: 100;
  padding: 1rem;
  background: #000;
  color: #fff;
}

/* Focus tushganda ko'rinadi */
.skip-link:focus {
  top: 0;
}

/* Reduced motion — animatsiyani o'chirish */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* Vue Transition bilan reduced motion */
/* .fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
@media (prefers-reduced-motion: reduce) {
  .fade-enter-active, .fade-leave-active {
    transition: none;
  }
} */
</style>`,
      description: 'Skip link keyboard foydalanuvchi uchun, prefers-reduced-motion vestibular disorder uchun.',
    },
  ],
  interviewQA: [
    {
      question: 'Web accessibility (a11y) nima va nima uchun muhim?',
      answer: `Accessibility — ilovani barcha foydalanuvchilar, jumladan nogironligi bo'lganlar uchun ham qulay qilish. Bunga ko'rish qobiliyati cheklangan (screen reader), motor qobiliyati cheklangan (keyboard foydalanuvchilar), eshitish qobiliyati cheklangan, kognitiv qiyinchiliklari borlar kiradi. Nima uchun muhim: 1) Axloqiy sabab — barcha odamlar uchun teng foydalanish huquqi. 2) Qonuniy talab — ADA (AQSH), WCAG standartlari. 3) SEO — semantic HTML qidiruv tizimlariga ham foydali. 4) UX yaxshilanadi — a11y barcha foydalanuvchilar tajribasini yaxshilaydi (keyboard shortcut, kontrast).`,
    },
    {
      question: 'Vue da focus management qanday amalga oshiriladi?',
      answer: `Vue da template ref orqali element ga focus beriladi: const el = ref<HTMLElement>(); el.value?.focus(). Modal ochilganda: 1) Oldingi focus ni saqlash (document.activeElement), 2) nextTick dan keyin modal ga focus berish, 3) Focus trap — Tab modal ichida aylanishi kerak (oxirgi → birinchi, birinchi → oxirgi), 4) Escape bilan yopish, 5) Yopilganda oldingi focus ni tiklash. Route o'zgarganda main elementga focus berish (SPA muammo — sahifa o'zgarganini screen reader bilmaydi). watch va nextTick kombinatsiyasi Vue da focus boshqarishning asosiy usuli.`,
    },
    {
      question: 'ARIA live region nima va qachon ishlatiladi?',
      answer: `Live region — dinamik o'zgaradigan kontent. aria-live atributi bilan belgilanadi. Screen reader o'zgarishni AVTOMATIK e'lon qiladi — foydalanuvchi focus berishi shart emas. Ikki turi: aria-live="polite" (hozirgi o'qishni tugatsing, keyin e'lon qilsin — status xabar, toast) va aria-live="assertive" (darhol e'lon qilsin — xatolik, ogohlantirishlar). role="status" = polite, role="alert" = assertive. SPA da muhim: AJAX javob kelganda, form validatsiya xatosi, route o'zgarganda sahifa nomi. MUHIM: live region avval DOM da bo'lishi kerak, keyin kontent o'zgarishi kerak — aks holda screen reader e'lon qilmaydi.`,
    },
    {
      question: 'Semantic HTML nima uchun a11y uchun muhim?',
      answer: `Semantic HTML elementlar (<nav>, <main>, <article>, <aside>, <header>, <footer>, <button>, <label>) o'z vazifasi haqida ma'lumot beradi. Screen reader bu elementlarni tushunadi va foydalanuvchiga aytadi ("navigatsiya", "asosiy kontent", "tugma"). <div> va <span> hech qanday semantik ma'lumot bermaydi. Misol: <div onclick="..."> — screen reader "matn" deydi, <button onclick="..."> — "tugma" deydi, Enter bilan ishlaydi, focus oladi. ARIA bu bo'shliqni to'ldiradi, lekin native element doimo afzal — "Native HTML is always better than ARIA".`,
    },
    {
      question: 'eslint-plugin-vuejs-accessibility nima tekshiradi?',
      answer: `Bu ESLint plugin Vue template larda a11y muammolarni avtomatik topadi. Asosiy qoidalar: 1) alt-text — img da alt atribut bormi, 2) label-has-for — form element uchun label bormi, 3) click-events-have-key-events — @click bor joyda keyboard alternative bormi, 4) no-autofocus — autofocus atributi screen reader ni chalg'itadi, 5) tabindex-no-positive — tabindex="1+" ishlatilmasin, 6) aria-props — ARIA atributlar to'g'ri yozilganmi. Bu plugin React dunyosidagi eslint-plugin-jsx-a11y ning Vue analogi. CI/CD ga qo'shib, a11y muammolarni development vaqtida ushlash tavsiya qilinadi.`,
    },
  ],
  relatedTopics: [
    { techId: 'vue-js', sectionId: 'vue-patterns', topicId: 'component-patterns', label: 'Vue Component Patterns' },
    { techId: 'vue-js', sectionId: 'vue-patterns', topicId: 'teleport-suspense', label: 'Teleport, Suspense, KeepAlive' },
    { techId: 'vue-js', sectionId: 'vue-patterns', topicId: 'testing-vue', label: 'Vue Testing' },
  ],
}
