import type { Topic } from '../../../types'

export const scopedCss: Topic = {
  id: 'scoped-css',
  title: 'Scoped CSS & CSS Modules',
  importance: 2,
  status: 'to-learn',
  description: 'Vue SFC scoped CSS, :deep(), :slotted(), :global(), CSS Modules, v-bind() in CSS',
  content: `Vue Single File Component (SFC) CSS boshqaruvining to'liq imkoniyatlari — scoped attributdan CSS Modules va v-bind() gacha.

═══════════════════════════════════════
  SCOPED CSS — ASOSIY MEXANIZM
═══════════════════════════════════════

<style scoped> qo'shsangiz, CSS faqat SHU komponentga ta'sir qiladi:

  <style scoped>
  .title { color: red; }
  </style>

Compiler natijasi:
  .title[data-v-7ba5bd90] { color: red; }

Har bir komponentga NOYOB data-v-xxxx attribut qo'shiladi:
  <h1 class="title" data-v-7ba5bd90>Salom</h1>

QOIDALAR:
- Scoped CSS faqat SHU komponent elementlariga ta'sir qiladi
- Bola komponentning ROOT elementiga ham ta'sir qiladi (faqat root!)
- Bola komponentning ICHKI elementlariga ta'sir qilMAYDI
- ID va class selektorlar ishlatish tavsiya (tag selektorlar sekinroq)

═══════════════════════════════════════
  :deep() — BOLA KOMPONENTGA KIRISH
═══════════════════════════════════════

Bola komponent ichidagi elementga stil berish uchun:

  <style scoped>
  .parent :deep(.child-inner) {
    color: blue;
  }
  </style>

Compiler natijasi:
  .parent[data-v-7ba5bd90] .child-inner { color: blue; }
  // data-v attribut faqat .parent da — .child-inner ga QO'SHILMAYDI

Ishlatish holatlari:
- UI kutubxona komponentini stilini o'zgartirish
- Third-party komponentga CSS override
- Slot ichidagi kontentni stilini o'zgartirish

EHTIYOT: :deep() ko'p ishlatish — encapsulation buzilishiga olib keladi.

═══════════════════════════════════════
  :slotted() — SLOT KONTENTI
═══════════════════════════════════════

Bola komponent ICHIDAN slot orqali kelgan kontentga stil berish:

  <!-- ChildComponent.vue -->
  <style scoped>
  :slotted(.slot-content) {
    font-weight: bold;
  }
  </style>

MUHIM: Slot kontenti OTA komponent kontekstida kompilatsiya qilinadi. Shuning uchun bola scoped CSS slot kontentiga ta'sir qilmaydi — :slotted() kerak.

═══════════════════════════════════════
  :global() — GLOBAL STIL
═══════════════════════════════════════

Scoped ichida GLOBAL stil yozish:

  <style scoped>
  :global(.modal-backdrop) {
    background: rgba(0,0,0,0.5);
  }
  </style>

Bu qoida data-v attribut OLMAYDI — global ta'sir qiladi.
Ishlatish: body, html, yoki Teleport orqali boshqa joyga render qilingan elementlar.

═══════════════════════════════════════
  CSS MODULES
═══════════════════════════════════════

Scoped CSS alternativ — CSS Modules:

  <style module>
  .title { color: red; }
  .active { font-weight: bold; }
  </style>

Template-da $style orqali murojaat:
  <h1 :class="$style.title">Salom</h1>
  <p :class="[$style.title, isActive && $style.active]">Matn</p>

Compiler natijasi:
  .title_abc123 { color: red; }
  // Noyob hash — collision YO'Q

Afzalliklari scoped CSS-dan:
+ Naming collision IMKONSIZ (hash)
+ JavaScript-da ishlatish mumkin ($style.title)
+ Conditional styling oson
+ CSS class ANIQ — debug qilish oson

═══════════════════════════════════════
  v-bind() IN CSS — DINAMIK STILLAR
═══════════════════════════════════════

Vue 3.2+ — JavaScript qiymatlarini CSS-da ishlatish:

  <script setup>
  const color = ref('red')
  const fontSize = ref(16)
  </script>

  <style scoped>
  .text {
    color: v-bind(color);
    font-size: v-bind(fontSize + 'px');
  }
  </style>

Ishlash mexanizmi:
- Compiler CSS custom property (--hash-color) yaratadi
- JavaScript qiymat inline style orqali element ga qo'yiladi
- CSS-da var(--hash-color) ishlatiladi
- State o'zgarganda inline style yangilanadi -> CSS avtomatik yangilanadi

═══════════════════════════════════════
  REACT BILAN TAQQOSLASH
═══════════════════════════════════════

Vue scoped CSS:
- SFC ichida <style scoped> — build tool kerak EMAS (vue-loader qiladi)
- :deep(), :slotted(), :global() — aniq API
- CSS Modules ham built-in
- v-bind() — JS -> CSS reaktiv bog'lanish

React CSS yondashuvlari:
- CSS Modules (import styles from './Comp.module.css')
- CSS-in-JS (styled-components, emotion) — JS ichida CSS
- Tailwind CSS — utility class-lar
- Inline styles (style={{ color: 'red' }})

FARQ: Vue-da CSS boshqaruv BUILT-IN va standartlashtirilgan. React-da tanlash ko'p lekin standart YO'Q — jamoa qaror qilishi kerak. Vue v-bind() CSS-in-JS ehtiyojini kamaytiradi.`,
  codeExamples: [
    {
      title: 'Scoped CSS va :deep() ishlatish',
      language: 'html',
      code: `<!-- ParentComponent.vue -->
<script setup lang="ts">
import ChildCard from './ChildCard.vue'
</script>

<template>
  <div class="parent">
    <h1 class="title">Ota komponent</h1>
    <ChildCard />
  </div>
</template>

<style scoped>
/* Bu FAQAT shu komponentga ta'sir qiladi */
.title {
  color: blue;
  font-size: 24px;
}

/* Bola komponentning ROOT elementiga ta'sir qiladi */
.parent :deep(.card) {
  border: 2px solid blue;
}

/* Bola komponentning ICHKI elementiga */
.parent :deep(.card-title) {
  color: navy;
}

/* Bola komponentning :deep() ORQALI */
.parent :deep(.card .card-body p) {
  line-height: 1.6;
}

/* GLOBAL stil — Teleport elementlari uchun */
:global(.modal-overlay) {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}
</style>

<!-- ChildCard.vue -->
<!--
<template>
  <div class="card">
    <h2 class="card-title">Bola</h2>
    <div class="card-body">
      <p>Matn</p>
    </div>
  </div>
</template>
<style scoped>
.card { padding: 16px; }
.card-title { font-size: 18px; }
</style>
-->`,
      description: 'Scoped CSS — faqat o\'z komponentga. :deep() — bola komponent ichiga kirish. :global() — global qoida.',
    },
    {
      title: 'CSS Modules va $style',
      language: 'html',
      code: `<script setup lang="ts">
import { ref, computed } from 'vue'

const isActive = ref(false)
const variant = ref<'primary' | 'danger'>('primary')

// CSS Modules class-larini JavaScript-da ishlatish
const buttonClasses = computed(() => [
  $style.button,
  isActive.value && $style.active,
  $style[variant.value],  // Dinamik class nomi
])
</script>

<template>
  <div :class="$style.container">
    <h1 :class="$style.title">CSS Modules</h1>

    <!-- Oddiy class -->
    <p :class="$style.text">Oddiy matn</p>

    <!-- Bir nechta class -->
    <p :class="[$style.text, $style.bold]">Qalin matn</p>

    <!-- Shartli class -->
    <button
      :class="buttonClasses"
      @click="isActive = !isActive"
    >
      {{ isActive ? 'Active' : 'Inactive' }}
    </button>

    <!-- Named module: <style module="classes"> bilan -->
    <!-- <p :class="classes.special">Special</p> -->
  </div>
</template>

<!-- Default module — $style -->
<style module>
.container {
  padding: 20px;
}

.title {
  font-size: 24px;
  color: #333;
}

.text {
  color: #666;
  line-height: 1.5;
}

.bold {
  font-weight: 700;
}

.button {
  padding: 8px 16px;
  border: 2px solid #ccc;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.active {
  border-color: #42b883;
  background: #42b883;
  color: white;
}

.primary {
  border-color: #3b82f6;
}

.danger {
  border-color: #ef4444;
}
</style>`,
      description: 'CSS Modules — $style orqali class-larga murojaat. Hash qo\'shiladi (collision YO\'Q). JavaScript-da ishlatish mumkin.',
    },
    {
      title: 'v-bind() in CSS — reaktiv stillar',
      language: 'html',
      code: `<script setup lang="ts">
import { ref, computed } from 'vue'

// Reaktiv CSS qiymatlar
const primaryColor = ref('#42b883')
const fontSize = ref(16)
const padding = ref(12)
const borderRadius = ref(8)
const isDark = ref(false)

const bgColor = computed(() =>
  isDark.value ? '#1a1a2e' : '#ffffff'
)
const textColor = computed(() =>
  isDark.value ? '#e0e0e0' : '#333333'
)

// Theme o'zgartirish — CSS AVTOMATIK yangilanadi!
function toggleTheme() {
  isDark.value = !isDark.value
}

function randomColor() {
  primaryColor.value = '#' + Math.random().toString(16).slice(2, 8)
}
</script>

<template>
  <div class="theme-demo">
    <h1 class="heading">v-bind() in CSS</h1>
    <p class="text">
      Bu matn dinamik stilga ega.
      Rangni o'zgartiring — CSS real-time yangilanadi!
    </p>

    <div class="controls">
      <label>
        Rang:
        <input type="color" v-model="primaryColor" />
      </label>
      <label>
        Font: {{ fontSize }}px
        <input type="range" v-model.number="fontSize" min="12" max="32" />
      </label>
      <label>
        Padding: {{ padding }}px
        <input type="range" v-model.number="padding" min="4" max="32" />
      </label>
      <button @click="toggleTheme">
        {{ isDark ? 'Light' : 'Dark' }} tema
      </button>
      <button @click="randomColor">Tasodifiy rang</button>
    </div>
  </div>
</template>

<style scoped>
.theme-demo {
  /* v-bind() — JS dan CSS ga! */
  background: v-bind(bgColor);
  color: v-bind(textColor);
  padding: v-bind(padding + 'px');
  border-radius: v-bind(borderRadius + 'px');
  transition: all 0.3s ease;
}

.heading {
  color: v-bind(primaryColor);
  font-size: v-bind(fontSize * 1.5 + 'px');
  border-bottom: 2px solid v-bind(primaryColor);
  padding-bottom: v-bind(padding / 2 + 'px');
}

.text {
  font-size: v-bind(fontSize + 'px');
  line-height: 1.6;
}

.controls {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: v-bind(padding + 'px');
}
</style>`,
      description: 'v-bind() — JavaScript qiymatlarini CSS-da REAKTIV ishlatish. State o\'zgarganda CSS avtomatik yangilanadi. CSS-in-JS ehtiyojini kamaytiradi.',
    },
  ],
  interviewQA: [
    {
      question: 'Vue scoped CSS qanday ishlaydi? Cheklovlari nima?',
      answer: `Scoped CSS har bir komponentga noyob data-v-xxxx attribut qo'shadi. CSS selektor oxiriga [data-v-xxxx] qo'shiladi: .title → .title[data-v-abc]. Natija: CSS faqat shu komponent elementlariga ta'sir qiladi. Cheklovlar: 1) Bola komponent ICHKI elementlariga ta'sir qilmaydi (:deep() kerak). 2) Tag selektorlar attribut selektor bilan sekinroq (class/id tavsiya). 3) Dinamik yaratilgan elementlarga ta'sir qilmaydi (ular data-v olmaydi). 4) Keyframes va font-face global bo'lib qoladi.`,
    },
    {
      question: ':deep(), :slotted(), :global() farqi va ishlatish holatlari?',
      answer: `:deep(.cls) — bola komponent ICHIDAGI elementga scoped CSS ta'sir qilishiga ruxsat beradi. Compiler: .parent[data-v-xxx] .cls (data-v faqat parent-da). Ishlatish: UI kutubxona stilini override. :slotted(.cls) — BOLA komponent ichidan SLOT kontentiga stil berish. Slot kontenti ota kontekstida kompilatsiya qilinadi, shuning uchun bola scoped CSS ta'sir qilmaydi. :global(.cls) — scoped ichida GLOBAL qoida yaratish. data-v attribut QO'SHILMAYDI. Ishlatish: body, Teleport elementlari, third-party elementlar.`,
    },
    {
      question: 'CSS Modules va Scoped CSS farqi nima? Qachon qaysi?',
      answer: `Scoped CSS: [data-v-xxx] attribut selektor, <style scoped>, template-da oddiy class nomi. CSS Modules: hash-langan class nomi (.title → .title_abc123), <style module>, template-da $style.title. Farq: 1) Scoped — attribut selektor (specificity past), Modules — class nomi hash (specificity bir xil). 2) Modules — JS-da ishlatish oson ($style.title). 3) Modules — naming collision IMKONSIZ (hash). 4) Scoped — yozish oson (oddiy class). Tavsiya: oddiy komponentlar — scoped, dinamik class logic ko'p — modules.`,
    },
    {
      question: 'v-bind() in CSS qanday ishlaydi? Performance ta\'siri bormi?',
      answer: `v-bind(jsValue) — CSS ichida JavaScript qiymatini ishlatish. Ichki mexanizm: 1) Compiler CSS custom property yaratadi: --hash-varname. 2) Element inline style-ga qo'shadi: style="--hash-varname: red". 3) CSS-da var(--hash-varname) ishlatadi. 4) State o'zgarganda inline style yangilanadi → CSS avtomatik yangilanadi. Performance: har bir v-bind() uchun inline style property qo'shiladi. 100+ v-bind() ishlatish TAVSIYA ETILMAYDI. Oddiy holatlar uchun juda qulay — CSS-in-JS kutubxona kerak emas. Computed ishlatish tavsiya — har renderda hisoblamaslik uchun.`,
    },
    {
      question: 'Vue CSS yondashuvini React bilan taqqoslang.',
      answer: `Vue: BUILT-IN yechimlar — scoped CSS, CSS Modules, v-bind() in CSS. Hammasi SFC ichida, qo'shimcha kutubxona kerak EMAS. Standartlashtirilgan — jamoa qaror qilishi SHART EMAS. React: standart yechim YO'Q — tanlash kerak: 1) CSS Modules (.module.css import), 2) CSS-in-JS (styled-components, emotion) — JS ichida, 3) Tailwind, 4) Inline styles. Har bir yondashuvning trade-off-lari bor. Vue v-bind() ≈ CSS-in-JS dinamik stillar, lekin Vue-da CSS HAQIQIY CSS bo'lib qoladi (developer tools, caching, extraction). CSS-in-JS runtime overhead bor (styled-components), Vue scoped CSS — build-time faqat attribut qo'shish.`,
    },
  ],
  relatedTopics: [
    { techId: 'vue-js', sectionId: 'vue-core', topicId: 'components', label: 'Komponentlar' },
    { techId: 'vue-js', sectionId: 'vue-theory', topicId: 'compiler-optimizations', label: 'Compiler optimizatsiyalari' },
    { techId: 'vue-js', sectionId: 'vue-patterns', topicId: 'slots', label: 'Slots' },
  ],
}
