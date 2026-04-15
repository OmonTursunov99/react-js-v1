import type { Topic } from '../../../types'

export const virtualDomVue: Topic = {
  id: 'virtual-dom-vue',
  title: 'Virtual DOM (Vue)',
  importance: 3,
  status: 'to-learn',
  description: 'Vue Virtual DOM — VNode, template compilation, diff/patch, block tree, static hoisting',
  content: `Virtual DOM (VDOM) — haqiqiy DOM-ning JavaScript ob'ekt ko'rinishidagi nusxasi. Vue template-larni render funksiyalarga kompilyatsiya qiladi, ular VNode daraxtini yaratadi.

═══════════════════════════════════════
  VNODE TUZILISHI
═══════════════════════════════════════

VNode — Virtual Node, DOM elementning JavaScript tasviri:
{
  type: 'div',           // tag nomi yoki komponent
  props: { id: 'app' }, // atributlar, eventlar
  children: [...],       // ichki VNode-lar
  key: null,             // :key qiymati
  patchFlag: 1,          // Vue 3 — optimallashtirish bayrog'i
  dynamicProps: ['class'], // qaysi proplar dinamik
  shapeFlag: 9,          // element turi bayrog'i
}

VNode turlari:
- Element VNode — HTML tag (div, p, span)
- Component VNode — Vue komponent
- Text VNode — matn
- Fragment VNode — bir nechta root element
- Teleport VNode — boshqa DOM joyiga
- Suspense VNode — async kutish

═══════════════════════════════════════
  TEMPLATE → RENDER FUNKSIYA
═══════════════════════════════════════

Vue template-ni compile vaqtida render funksiyaga aylantiradi:

Template:
  <div class="box"><p>{{ msg }}</p></div>

Render funksiya:
  function render() {
    return h('div', { class: 'box' }, [
      h('p', null, ctx.msg)
    ])
  }

h() — hyperscript, VNode yaratuvchi funksiya:
  h(type, props, children) → VNode

<script setup> ishlatganda SIZ render funksiya yozMAYSIZ — compiler template-dan avtomatik yaratadi. Lekin h() to'g'ridan-to'g'ri ishlatish HAM mumkin (murakkab holatlar uchun).

═══════════════════════════════════════
  DIFF/PATCH ALGORITMI
═══════════════════════════════════════

State o'zgarganda:
1. Yangi VNode daraxti yaratiladi (re-render)
2. Eski va yangi VNode TAQQOSLANADI (diff)
3. Faqat farqlar haqiqiy DOM-ga QO'LLANILADI (patch)

Vue 3 diff optimizatsiyalari:
- Patch flags — qaysi qism dinamik? Faqat shuni tekshir
- Block tree — dinamik node-larni flat array qilish
- Static hoisting — o'zgarmas VNode-larni render funksiyadan TASHQARIDA yaratish
- Cache handlers — event handler-larni qayta yaratmaslik

NIMA UCHUN VDOM?
- To'g'ridan-to'g'ri DOM manipulyatsiya SEKIN (layout recalc, repaint)
- VDOM — JavaScript ob'ektlar — taqqoslash TEZKOR
- Batch update — bir nechta o'zgarish bitta DOM yangilanish
- Abstraksiya — SSR, test, native render mumkin

═══════════════════════════════════════
  BLOCK TREE OPTIMALLASHTIRISH
═══════════════════════════════════════

Vue 2: har bir VNode bolalarini to'liq solishtiradi (tree walk)
Vue 3: Block tree — FAQAT dinamik node-larni kuzatadi

Misol template:
  <div>                      ← Block root
    <h1>Sarlavha</h1>        ← STATIK (o'zgarmaydi, skip)
    <p>{{ message }}</p>      ← DINAMIK (faqat shuni tekshir)
    <span>Footer</span>      ← STATIK (skip)
  </div>

Block root barcha dinamik nasllarni flat array-da saqlaydi:
  dynamicChildren: [pVNode]  ← faqat 1 ta element tekshiriladi

Vue 2-da esa barcha 3 ta bola tekshirilardi.

═══════════════════════════════════════
  STATIC HOISTING
═══════════════════════════════════════

O'zgarmas VNode-lar render funksiyadan TASHQARIDA yaratiladi:

  // Hoisted (bir marta yaratiladi):
  const _hoisted_1 = h('h1', null, 'Sarlavha')
  const _hoisted_2 = h('span', null, 'Footer')

  // Render (har safar chaqiriladi):
  function render() {
    return h('div', null, [
      _hoisted_1,              // reference — qayta yaratilMAYDI
      h('p', null, ctx.msg),   // faqat shu yangilanadi
      _hoisted_2,              // reference
    ])
  }

Katta template-larda bu KATTA performance farq beradi — 100 ta statik element bo'lsa, hammasi bir marta yaratiladi.

═══════════════════════════════════════
  REACT BILAN TAQQOSLASH
═══════════════════════════════════════

Ikkalasida HAM Virtual DOM bor, LEKIN:

Vue VDOM:
- Template COMPILE TIME da render funksiyaga aylanadi
- Compiler statik/dinamik node-larni ajratadi (KATTA afzallik)
- Patch flags — qaysi prop dinamik ANIQ ma'lum
- Block tree — faqat dinamik node-lar tekshiriladi
- Static hoisting — o'zgarmas node qayta yaratilMAYDI

React VDOM:
- JSX RUNTIME da createElement() chaqiradi
- Har safar BUTUN daraxtsni diff qiladi (fiber tree)
- Heuristic diff — O(n) lekin HAMMA node tekshiriladi
- React.memo/useMemo — qo'lda optimallashtirish
- React Compiler — avtomatik memoizatsiya (Vue-ga yaqinlashish)

Natija: Vue-ning template compiler COMPILE TIME da optimizatsiya qiladi, React RUNTIME da diff qiladi. Vue kichik/o'rtacha loyihalarda tezroq, React katta loyihalarda Concurrent Mode bilan ustunlik qiladi.`,
  codeExamples: [
    {
      title: 'h() funksiyasi bilan render',
      language: 'html',
      code: `<script setup lang="ts">
import { h, ref } from 'vue'
import type { VNode } from 'vue'

const count = ref(0)

// h() bilan VNode yaratish
// h(type, props?, children?)
function renderList(items: string[]): VNode {
  return h('ul', { class: 'list' },
    items.map(item =>
      h('li', { key: item }, item)
    )
  )
}

// Dinamik tag — JSX alternativ
function renderHeading(level: 1 | 2 | 3, text: string): VNode {
  return h(\`h\${level}\`, null, text)
}

// Komponent h() bilan render
// import MyButton from './MyButton.vue'
// h(MyButton, { onClick: handleClick }, { default: () => 'Click me' })
</script>

<template>
  <!-- Template-ni compiler render funksiyaga aylantiradi -->
  <!-- Lekin h() ni to'g'ridan-to'g'ri ham ishlatish mumkin: -->
  <component :is="renderList(['Vue', 'React', 'Angular'])" />
  <component :is="renderHeading(2, 'Sarlavha')" />
  <p>Count: {{ count }}</p>
  <button @click="count++">+1</button>
</template>`,
      description: 'h() — hyperscript funksiyasi, VNode yaratadi. Template yozganda siz h() yozMAYSIZ — compiler qiladi. Lekin murakkab holatlarda qo\'lda ishlatish mumkin.',
    },
    {
      title: 'Compiled template — patch flags va static hoisting',
      language: 'ts',
      code: `// Template:
// <div>
//   <h1>Statik sarlavha</h1>
//   <p :class="dynamicClass">{{ message }}</p>
//   <span>Statik footer</span>
// </div>

// Compiler natijasi (soddalashtirilgan):
import { createElementVNode as _createElementVNode, toDisplayString, openBlock, createElementBlock } from 'vue'

// STATIC HOISTING — render tashqarisida, bir marta yaratiladi
const _hoisted_1 = _createElementVNode('h1', null, 'Statik sarlavha', -1 /* HOISTED */)
const _hoisted_2 = _createElementVNode('span', null, 'Statik footer', -1 /* HOISTED */)

function render(_ctx: any) {
  return (openBlock(), createElementBlock('div', null, [
    _hoisted_1,  // Qayta yaratilMAYDI — reference

    // DINAMIK — patch flag = 3 (TEXT + CLASS)
    _createElementVNode('p', {
      class: _ctx.dynamicClass  // class DINAMIK
    }, toDisplayString(_ctx.message), 3 /* TEXT, CLASS */),
    // Patch flag 3 = TEXT(1) + CLASS(2)
    // Diff faqat text va class tekshiradi, boshqa attributlar SKIP

    _hoisted_2,  // Qayta yaratilMAYDI — reference
  ]))
}

// Patch flag qiymatlari:
// 1  = TEXT (matn dinamik)
// 2  = CLASS (class dinamik)
// 4  = STYLE (style dinamik)
// 8  = PROPS (prop-lar dinamik)
// 16 = FULL_PROPS (key dinamik — to'liq diff kerak)
// 32 = HYDRATE_EVENTS
// 64 = STABLE_FRAGMENT
// -1 = HOISTED (o'zgarmas, skip)
// -2 = BAIL (to'liq diff kerak)`,
      description: 'Vue compiler template-ni optimallashtirilgan render funksiyaga aylantiradi. Static hoisting + patch flags = minimal DOM yangilanish.',
    },
    {
      title: 'Block tree — dinamik node flat tracking',
      language: 'ts',
      code: `// Oddiy diff: butun daraxt bo'ylab yurish (O(n) hamma node)
// Block tree: faqat dinamik node-lar tekshiriladi

// Template:
// <div>                           ← Block root
//   <header>
//     <h1>App</h1>                ← statik
//     <nav>
//       <a href="/">Home</a>      ← statik
//       <a href="/about">About</a>← statik
//     </nav>
//   </header>
//   <main>
//     <p>{{ message }}</p>        ← DINAMIK
//     <span>{{ count }}</span>    ← DINAMIK
//   </main>
//   <footer>Copyright 2024</footer> ← statik
// </div>

// Block VNode tuzilmasi:
const blockVNode = {
  type: 'div',
  children: [/* ...to'liq daraxt */],

  // BLOCK MAGIC — dinamik node-lar flat array:
  dynamicChildren: [
    // Faqat 2 ta node — 8 ta o'rniga!
    { type: 'p', children: message, patchFlag: 1 /* TEXT */ },
    { type: 'span', children: count, patchFlag: 1 /* TEXT */ },
  ],
}

// Diff vaqtida:
// Vue 2: 8 ta node tekshiriladi (div, header, h1, nav, 2xa, main, p, span, footer)
// Vue 3: 2 ta node tekshiriladi (p va span — faqat dynamicChildren)
// = 4x tezroq diff!

// v-if/v-for yangi Block yaratadi:
// <div v-if="show">...</div>  ← alohida Block
// <li v-for="item in list">   ← har biri alohida Block`,
      description: 'Block tree — Vue 3 compiler optimizatsiyasi. Dinamik node-lar flat array-da — diff O(dinamik) bo\'ladi, O(barcha) emas.',
    },
  ],
  interviewQA: [
    {
      question: 'Virtual DOM nima va nima uchun kerak?',
      answer: `Virtual DOM — haqiqiy DOM-ning JavaScript ob'ekt nusxasi (VNode daraxti). Nima uchun: 1) To'g'ridan-to'g'ri DOM manipulyatsiya qimmat (layout recalc, repaint). 2) VDOM — JS ob'ektlarni taqqoslash tez. 3) Batch update — 10 ta o'zgarish bitta DOM patch. 4) Abstraksiya — SSR, native render, test mumkin. Ishlash: state o'zgaradi -> yangi VNode daraxti -> eski bilan diff -> faqat farqlar DOM-ga patch qilinadi. Vue-da template compiler bu jarayonni yanada optimallashtiradi.`,
    },
    {
      question: 'Vue template qanday render funksiyaga aylanadi?',
      answer: `Vue SFC <template> bloki compile vaqtida render funksiyaga aylanadi. Jarayon: 1) Template parser — HTML-ga o'xshash template-ni AST (Abstract Syntax Tree) ga aylantiradi. 2) Transform — AST optimizatsiya: statik node-lar belgilanadi, patch flag-lar qo'yiladi. 3) Code generation — AST dan JavaScript render funksiya generatsiya qilinadi. Natija: h() (createVNode) chaqiruvlari. Vite/webpack vue-loader yoki @vue/compiler-sfc bu ishni build vaqtida qiladi. Runtime-da template compile HAM mumkin lekin sekinroq (template option yozsangiz).`,
    },
    {
      question: 'Vue va React Virtual DOM farqi nima?',
      answer: `Vue: template compile-time da render funksiyaga aylanadi. Compiler STATIK va DINAMIK node-larni ajratadi. Patch flags — qaysi prop dinamik ANIQ belgilangan (TEXT, CLASS, STYLE). Block tree — faqat dinamik node-lar flat array-da tekshiriladi. Static hoisting — o'zgarmas VNode bir marta yaratiladi. React: JSX runtime-da createElement() ga aylanadi. Heuristic diff — O(n) hamma node. React.memo qo'lda. React Compiler avtomatik memoizatsiya qo'shmoqda lekin fundamental diff hali HAMMA node-ni tekshiradi. Natija: Vue kichik update-larda TEZROQ (compile-time bilim), React katta app-larda Concurrent Mode bilan boshqacha ustunlik qiladi.`,
    },
    {
      question: 'Patch flags nima? Misol bilan tushuntiring.',
      answer: `Patch flag — VNode-ga compiler qo'yadigan raqam, diff vaqtida NIMANI tekshirish kerakligini ko'rsatadi. Misollar: 1 = TEXT (faqat textContent tekshir), 2 = CLASS (faqat class), 4 = STYLE, 8 = PROPS, 16 = FULL_PROPS (dinamik key), -1 = HOISTED (umuman tekshirMA). Misol: <p :class="cls">{{ msg }}</p> -> patchFlag = 3 (TEXT + CLASS). Diff faqat text va class taqqoslaydi, boshqa attributlar SKIP. Oddiy VDOM-da BARCHA attributlar taqqoslanardi. Bu compile-time bilim — React-da bunday YO'Q.`,
    },
    {
      question: 'Static hoisting nima va qanday ishlaydi?',
      answer: `Static hoisting — o'zgarmas VNode-larni render funksiyadan TASHQARIDA yaratish. Render har safar chaqirilganda statik VNode QAYTA YARATILMAYDI — reference ishlatiladi. Misol: <h1>Sarlavha</h1> — bu hech qachon o'zgarmaydi. Compiler uni const _hoisted = createVNode('h1', null, 'Sarlavha') qilib render tashqarisiga chiqaradi. Foyda: 1) Kam xotira — yangi ob'ekt yaratilmaydi. 2) Tezroq diff — HOISTED flag bilan butunlay SKIP. 3) Katta template-larda sezilarli: 100 ta statik element = 100 ta ob'ekt tejaladi har renderda.`,
    },
    {
      question: 'Block tree optimallashtirish printsipini tushuntiring.',
      answer: `Vue 2: diff butun VNode daraxtini rekursiv tekshiradi — har bir node, har bir bola. 100 ta node = 100 ta taqqoslash. Vue 3 Block tree: template-dagi strukturali direktiv (v-if, v-for) bo'yicha "block" yaratiladi. Har bir block o'zining dinamik nasllarini flat array-da saqlaydi (dynamicChildren). Diff faqat shu flat array bo'ylab yuradi. Misol: 50 ta statik node + 3 ta dinamik node = FAQAT 3 ta taqqoslash. v-if/v-for yangi block yaratadi — chunki ular daraxt STRUKTURASINI o'zgartiradi, flat tracking ishlamaydi. Bu Vue compiler-ning eng kuchli optimizatsiyasi.`,
    },
  ],
  relatedTopics: [
    { techId: 'vue-js', sectionId: 'vue-theory', topicId: 'compiler-optimizations', label: 'Compiler optimizatsiyalari' },
    { techId: 'vue-js', sectionId: 'vue-theory', topicId: 'reactivity-theory', label: 'Reaktivlik nazariyasi' },
    { techId: 'vue-js', sectionId: 'vue-theory', topicId: 'vue-internals', label: 'Vue ichki arxitekturasi' },
    { techId: 'vue-js', sectionId: 'vue-core', topicId: 'components', label: 'Komponentlar' },
  ],
}
