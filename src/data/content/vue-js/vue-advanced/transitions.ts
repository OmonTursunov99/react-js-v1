import type { Topic } from '../../../types'

export const transitions: Topic = {
  id: 'transitions',
  title: 'Transitions & Animations',
  importance: 2,
  status: 'to-learn',
  description: 'Transition, TransitionGroup, CSS/JS animatsiyalar, FLIP, Animate.css/GSAP',
  content: `Vue Transition komponentlari — elementlarning paydo bo'lishi, yo'qolishi va ro'yxat o'zgarishlarini animatsiya qilish uchun deklarativ tizim. CSS yoki JavaScript yordamida ishlaydi.

═══════════════════════════════════════
  <Transition> KOMPONENT
═══════════════════════════════════════

<Transition> — bitta element/komponentning paydo bo'lish (enter)
va yo'qolish (leave) animatsiyasi.

  <Transition name="fade">
    <p v-if="show">Salom</p>
  </Transition>

name="fade" bo'lganda Vue quyidagi CSS classlarni qo'shadi:

ENTER (paydo bo'lish):
  .fade-enter-from    — boshlang'ich holat (opacity: 0)
  .fade-enter-active  — animatsiya davomida (transition: opacity 0.3s)
  .fade-enter-to      — oxirgi holat (opacity: 1)

LEAVE (yo'qolish):
  .fade-leave-from    — boshlang'ich holat (opacity: 1)
  .fade-leave-active  — animatsiya davomida (transition: opacity 0.3s)
  .fade-leave-to      — oxirgi holat (opacity: 0)

═══════════════════════════════════════
  TRANSITION MODE
═══════════════════════════════════════

Ikki element almashganda:
  mode="out-in"  — avval eski ketadi, keyin yangi keladi (ENG KO'P)
  mode="in-out"  — avval yangi keladi, keyin eski ketadi

  <Transition name="fade" mode="out-in">
    <component :is="currentView" />
  </Transition>

mode="out-in" — 90% hollarda kerakli variant.

═══════════════════════════════════════
  appear PROP
═══════════════════════════════════════

Dastlabki render da ham animatsiya:
  <Transition name="fade" appear>
    <p>Sahifa ochilganda animatsiya bilan paydo bo'ladi</p>
  </Transition>

═══════════════════════════════════════
  JAVASCRIPT HOOKS
═══════════════════════════════════════

CSS o'rniga yoki CSS bilan birga JavaScript ishlatish:

  <Transition
    @before-enter="onBeforeEnter"
    @enter="onEnter"
    @after-enter="onAfterEnter"
    @enter-cancelled="onEnterCancelled"
    @before-leave="onBeforeLeave"
    @leave="onLeave"
    @after-leave="onAfterLeave"
    @leave-cancelled="onLeaveCancelled"
  >

MUHIM: JS hook ishlatganda :css="false" qo'shing —
Vue CSS transition tekshirmaydi (performance yaxshiroq).

  @enter(el, done) {
    gsap.to(el, { opacity: 1, duration: 0.5, onComplete: done })
  }

done() callback SHART — Vue animatsiya tugaganini bilishi uchun.

═══════════════════════════════════════
  <TransitionGroup> — RO'YXAT ANIMATSIYA
═══════════════════════════════════════

Ro'yxat elementlarining qo'shilish, o'chirilish va
TARTIB O'ZGARISHINI animatsiya qilish:

  <TransitionGroup name="list" tag="ul">
    <li v-for="item in items" :key="item.id">
      {{ item.text }}
    </li>
  </TransitionGroup>

MUHIM: TransitionGroup da har bir child MAJBURIY :key kerak.

MOVE animatsiya — elementlar joyi almashganda (FLIP):
  .list-move {
    transition: transform 0.5s ease;
  }

Vue ichki FLIP (First, Last, Invert, Play) algoritmi
elementlar pozitsiyasini hisoblaydi va transform bilan animatsiya qiladi.

═══════════════════════════════════════
  ANIMATE.CSS / GSAP INTEGRATSIYA
═══════════════════════════════════════

Animate.css — tayyor CSS animatsiyalar:
  <Transition
    enter-active-class="animate__animated animate__fadeInUp"
    leave-active-class="animate__animated animate__fadeOutDown"
  >

GSAP — professional JavaScript animatsiya:
  @enter(el, done) {
    gsap.from(el, {
      y: 50, opacity: 0, duration: 0.5, onComplete: done
    })
  }

═══════════════════════════════════════
  REACT BILAN TAQQOSLASH
═══════════════════════════════════════

React-da BUILT-IN transition tizimi YO'Q!

React muqobillari:
- react-transition-group (CSSTransition, TransitionGroup)
- framer-motion — eng mashhur (Vue Transition ga o'xshash)
- react-spring — fizika asosidagi animatsiya
- CSS @keyframes — qo'lda

Vue afzalliklari:
- <Transition> BUILT-IN — qo'shimcha kutubxona kerak emas
- Deklarativ CSS class tizimi — oddiy va tushunarliroq
- mode="out-in" — element almashtirish oson
- TransitionGroup + FLIP — ro'yxat animatsiya avtomatik
- appear — dastlabki render animatsiya

React (framer-motion) afzalliklari:
- Layout animations — murakkab layout o'zgarishlar
- Gesture animatsiya (drag, hover, tap)
- AnimatePresence — exit animatsiya (Vue leave ga o'xshash)
- Spring fizikasi — tabiiy ko'rinish`,
  codeExamples: [
    {
      title: 'Transition — fade va slide animatsiyalar',
      language: 'html',
      code: `<script setup lang="ts">
import { ref } from 'vue'

const show = ref(true)
const currentTab = ref<'home' | 'about' | 'contact'>('home')
</script>

<template>
  <div>
    <!-- ====== FADE ====== -->
    <button @click="show = !show">Toggle</button>
    <Transition name="fade">
      <p v-if="show">Fade animatsiya bilan paydo/yo'qoladi</p>
    </Transition>

    <!-- ====== SLIDE + FADE (mode="out-in") ====== -->
    <nav>
      <button @click="currentTab = 'home'">Bosh sahifa</button>
      <button @click="currentTab = 'about'">Haqida</button>
      <button @click="currentTab = 'contact'">Aloqa</button>
    </nav>

    <Transition name="slide-fade" mode="out-in">
      <div :key="currentTab">
        <p v-if="currentTab === 'home'">Bosh sahifa kontenti</p>
        <p v-else-if="currentTab === 'about'">Haqida kontenti</p>
        <p v-else>Aloqa kontenti</p>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* Fade */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Slide + Fade */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.2s ease-in;
}
.slide-fade-enter-from {
  transform: translateX(20px);
  opacity: 0;
}
.slide-fade-leave-to {
  transform: translateX(-20px);
  opacity: 0;
}
</style>`,
      description: 'Transition — fade va slide-fade animatsiyalar. mode="out-in" bilan tab almashtirish.',
    },
    {
      title: 'TransitionGroup — ro\'yxat animatsiya + FLIP',
      language: 'html',
      code: `<script setup lang="ts">
import { ref, computed } from 'vue'

interface Item {
  id: number
  text: string
}

let nextId = 4
const items = ref<Item[]>([
  { id: 1, text: 'Birinchi' },
  { id: 2, text: 'Ikkinchi' },
  { id: 3, text: 'Uchinchi' },
])

function addItem() {
  const index = Math.floor(Math.random() * (items.value.length + 1))
  items.value.splice(index, 0, {
    id: nextId++,
    text: \`Element #\${nextId - 1}\`,
  })
}

function removeItem(id: number) {
  items.value = items.value.filter(i => i.id !== id)
}

function shuffle() {
  const arr = [...items.value]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  items.value = arr
}
</script>

<template>
  <div>
    <button @click="addItem">Qo'shish</button>
    <button @click="shuffle">Aralashtirish</button>

    <TransitionGroup name="list" tag="ul" class="item-list">
      <li
        v-for="item in items"
        :key="item.id"
        class="item"
        @click="removeItem(item.id)"
      >
        {{ item.text }} (bosib o'chirish)
      </li>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.item-list {
  list-style: none;
  padding: 0;
}

.item {
  padding: 8px 16px;
  margin: 4px 0;
  background: #e2e8f0;
  border-radius: 4px;
  cursor: pointer;
}

/* ENTER — paydo bo'lish */
.list-enter-active {
  transition: all 0.4s ease;
}
.list-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

/* LEAVE — yo'qolish */
.list-leave-active {
  transition: all 0.4s ease;
  position: absolute;  /* MUHIM: FLIP uchun */
}
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* MOVE — FLIP animatsiya (tartib o'zgarishda) */
.list-move {
  transition: transform 0.4s ease;
}
</style>`,
      description: 'TransitionGroup — ro\'yxatga qo\'shish, o\'chirish, aralashtirish animatsiyasi. FLIP bilan move animatsiya.',
    },
    {
      title: 'JavaScript hooks + GSAP animatsiya',
      language: 'html',
      code: `<script setup lang="ts">
import { ref } from 'vue'
// import gsap from 'gsap'  // npm i gsap

const show = ref(false)
const items = ref([1, 2, 3, 4, 5])

// ========== JS Hooks ==========
function onBeforeEnter(el: Element) {
  const htmlEl = el as HTMLElement
  htmlEl.style.opacity = '0'
  htmlEl.style.transform = 'scale(0.6) translateY(20px)'
}

function onEnter(el: Element, done: () => void) {
  const htmlEl = el as HTMLElement
  // GSAP bilan (yoki oddiy JS)
  // gsap.to(el, {
  //   opacity: 1, scale: 1, y: 0,
  //   duration: 0.5, ease: 'back.out(1.7)',
  //   onComplete: done
  // })

  // Oddiy JS alternativa
  htmlEl.style.transition = 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
  requestAnimationFrame(() => {
    htmlEl.style.opacity = '1'
    htmlEl.style.transform = 'scale(1) translateY(0)'
  })
  setTimeout(done, 500)
}

function onLeave(el: Element, done: () => void) {
  const htmlEl = el as HTMLElement
  htmlEl.style.transition = 'all 0.3s ease-in'
  htmlEl.style.opacity = '0'
  htmlEl.style.transform = 'scale(0.8) translateY(-20px)'
  setTimeout(done, 300)
}

// ========== Stagger animation (ketma-ket) ==========
function onBeforeEnterList(el: Element) {
  const htmlEl = el as HTMLElement
  htmlEl.style.opacity = '0'
  htmlEl.style.transform = 'translateY(30px)'
}

function onEnterList(el: Element, done: () => void) {
  const htmlEl = el as HTMLElement
  const delay = Number(htmlEl.dataset.index) * 100

  setTimeout(() => {
    htmlEl.style.transition = 'all 0.4s ease-out'
    htmlEl.style.opacity = '1'
    htmlEl.style.transform = 'translateY(0)'
    setTimeout(done, 400)
  }, delay)
}
</script>

<template>
  <div>
    <button @click="show = !show">Toggle</button>

    <!-- JS hooks bilan :css="false" — CSS tekshirilmaydi -->
    <Transition
      :css="false"
      @before-enter="onBeforeEnter"
      @enter="onEnter"
      @leave="onLeave"
    >
      <div v-if="show" class="box">
        JS Animatsiya!
      </div>
    </Transition>

    <!-- Stagger — ketma-ket paydo bo'lish -->
    <TransitionGroup
      :css="false"
      @before-enter="onBeforeEnterList"
      @enter="onEnterList"
      tag="div"
    >
      <div
        v-for="(item, i) in items"
        :key="item"
        :data-index="i"
      >
        Element {{ item }}
      </div>
    </TransitionGroup>
  </div>
</template>`,
      description: 'JavaScript hooks bilan animatsiya. :css="false" va done() callback. Stagger pattern.',
    },
    {
      title: 'Animate.css integratsiya',
      language: 'html',
      code: `<script setup lang="ts">
// npm i animate.css
// main.ts: import 'animate.css'
import { ref } from 'vue'

const show = ref(true)
const currentPage = ref('home')
</script>

<template>
  <div>
    <button @click="show = !show">Toggle</button>

    <!-- Animate.css class-lari bilan -->
    <Transition
      enter-active-class="animate__animated animate__fadeInUp"
      leave-active-class="animate__animated animate__fadeOutDown"
    >
      <div v-if="show" class="notification">
        Animatsiyali bildirishnoma!
      </div>
    </Transition>

    <!-- Sahifa almashish — Animate.css + mode -->
    <Transition
      mode="out-in"
      enter-active-class="animate__animated animate__fadeInRight animate__faster"
      leave-active-class="animate__animated animate__fadeOutLeft animate__faster"
    >
      <div :key="currentPage">
        <p>{{ currentPage }} sahifasi</p>
      </div>
    </Transition>

    <!-- appear bilan — dastlabki render -->
    <Transition
      appear
      appear-active-class="animate__animated animate__bounceIn"
      enter-active-class="animate__animated animate__bounceIn"
      leave-active-class="animate__animated animate__bounceOut"
    >
      <div v-if="show" class="hero">
        Sahifa ochilganda bounce bilan paydo bo'ladi
      </div>
    </Transition>
  </div>
</template>`,
      description: 'Animate.css — tayyor animatsiya kutubxonasi integratsiyasi. Custom class nomlar.',
    },
  ],
  interviewQA: [
    {
      question: 'Vue Transition class-lari qanday ishlaydi? Ketma-ketligini tushuntiring.',
      answer: `ENTER: 1) v-enter-from qo'shiladi (boshlang'ich holat, masalan opacity: 0). 2) Element DOM-ga qo'shiladi. 3) Keyingi frame-da v-enter-from olib tashlanadi, v-enter-to qo'shiladi. 4) v-enter-active animatsiya davomida turadi (transition: opacity 0.3s). 5) Animatsiya tugaganda v-enter-active va v-enter-to olib tashlanadi. LEAVE: Teskari — v-leave-from -> v-leave-active + v-leave-to -> element DOM-dan olib tashlanadi. name="fade" bo'lsa: fade-enter-from, fade-leave-to va h.k.`,
    },
    {
      question: 'TransitionGroup va Transition farqi nima? FLIP nima?',
      answer: `Transition — BITTA element uchun (v-if/v-show). TransitionGroup — RO'YXAT uchun (v-for). TransitionGroup farqlari: 1) tag prop kerak (wrapper element), 2) mode prop YO'Q, 3) Har bir child :key MAJBURIY, 4) v-move class — element joyi o'zgarganda. FLIP — First, Last, Invert, Play algoritmi: element eski va yangi pozitsiyasini hisoblaydi, transform bilan animatsiya qiladi. .list-move { transition: transform 0.5s } — Vue avtomatik FLIP qo'llaydi.`,
    },
    {
      question: 'mode="out-in" va mode="in-out" farqi nima?',
      answer: `mode="out-in" — avval eski element ketadi (leave), keyin yangi keladi (enter). 90% hollarda kerakli variant — tab switch, sahifa almashtirish. mode="in-out" — avval yangi element keladi, keyin eski ketadi. Kam ishlatiladi — overlay effekt uchun. mode belgilanmasa — ikkalasi bir vaqtda ishlaydi (element ustma-ust). Eng ko'p xatolik — mode unutish, natijada ikki element bir paytda ko'rinadi.`,
    },
    {
      question: 'React-da Vue Transition ga muqobil nima?',
      answer: `React-da built-in transition YO'Q. Muqobillar: 1) framer-motion — eng mashhur. AnimatePresence (Vue Transition), layout animations, gesture. 2) react-transition-group — CSSTransition (Vue Transition ga o'xshash), TransitionGroup. 3) react-spring — fizika asosidagi. 4) CSS @keyframes — qo'lda. Vue afzalligi — built-in, deklarativ, CSS class tizimi oson. framer-motion afzalligi — layout animation, gesture, spring fizikasi. Vue TransitionGroup + FLIP — react-flip-toolkit ga muqobil.`,
    },
    {
      question: 'JS hooks qachon ishlatiladi? done() callback nima uchun kerak?',
      answer: `JS hooks — CSS transition yetarli bo'lmaganda: 1) GSAP kabi kutubxona bilan murakkab animatsiya, 2) Stagger (ketma-ket) animatsiya, 3) Fizika asosidagi animatsiya, 4) Dinamik davomiylik (element holatiga qarab). done() — Vue ga animatsiya tugaganini bildirish. Chaqirilmasa Vue element-ni olib tashlamaydi (leave da) yoki transition class-larni tozalamaydi. :css="false" qo'shish KERAK — Vue CSS transition tekshirmaydi, performance yaxshiroq.`,
    },
  ],
  relatedTopics: [
    { techId: 'vue-js', sectionId: 'vue-core', topicId: 'template-syntax', label: 'Template Syntax' },
    { techId: 'vue-js', sectionId: 'vue-advanced', topicId: 'render-functions', label: 'Render Functions' },
    { techId: 'vue-js', sectionId: 'vue-patterns', topicId: 'dynamic-components', label: 'Dynamic Components' },
  ],
}
