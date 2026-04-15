import type { Topic } from '../../../types'

export const compilerOptimizations: Topic = {
  id: 'compiler-optimizations',
  title: 'Compiler Optimizations',
  importance: 2,
  status: 'to-learn',
  description: 'Vue template compiler optimizatsiyalari — static hoisting, patch flags, block tree, v-once, v-memo',
  content: `Vue 3 template compiler — framework-ning "yashirin kuchi". Template-ni oddiy render funksiyaga emas, YUQORI DARAJADA OPTIMALLASHTIRILGAN render funksiyaga aylantiradi.

═══════════════════════════════════════
  COMPILER PIPELINE
═══════════════════════════════════════

Template -> Render funksiya bosqichlari:

1. PARSE — Template-ni AST (Abstract Syntax Tree) ga aylantirish
   <div class="box"><p>{{ msg }}</p></div>
   → AST { type: 'Element', tag: 'div', children: [...] }

2. TRANSFORM — AST-ni optimallashtirish
   - Statik node-larni belgilash (hoistable)
   - Patch flag-lar aniqlash
   - Block daraxtini yaratish
   - v-if/v-for/v-on transformatsiyalar

3. CODEGEN — Optimallashtirilgan JavaScript kodi generatsiya
   → function render() { return ... }

═══════════════════════════════════════
  STATIC HOISTING (Statik ko'tarish)
═══════════════════════════════════════

O'zgarmas VNode-lar render funksiyadan TASHQARIDA yaratiladi:
- Har renderda QAYTA YARATILMAYDI
- Xotira tejash — bitta reference, ko'p render
- Diff SKIP — HOISTED flag (-1) bilan umuman taqqoslanmaydi

Ko'tariladi:
- O'zgarmas element: <h1>Sarlavha</h1>
- O'zgarmas attribut: <div class="static-class">
- Faqat statik bolalari bor element

Ko'tarilMAYDI:
- Dinamik binding: <p :class="cls">
- Dinamik matn: <p>{{ msg }}</p>
- v-if/v-for ichidagi elementlar
- Komponent (props o'zgarishi mumkin)

═══════════════════════════════════════
  PATCH FLAGS (Yamoq bayroqlari)
═══════════════════════════════════════

Har bir dinamik VNode-ga qo'yiladi — NIMANI tekshirish kerak:

  1  — TEXT: faqat textContent
  2  — CLASS: faqat class attributi
  4  — STYLE: faqat style
  8  — PROPS: dinamik non-class/style proplar
  16 — FULL_PROPS: dinamik key nomi (to'liq diff)
  32 — HYDRATE_EVENTS: SSR hydration eventlari
  64 — STABLE_FRAGMENT: fragment bolalari tartib o'zgarmaydi
  128 — KEYED_FRAGMENT: key-li fragment
  256 — UNKEYED_FRAGMENT: key-siz fragment
  512 — NEED_PATCH: ref yoki hook bor
  -1 — HOISTED: o'zgarmas, SKIP
  -2 — BAIL: to'liq diff kerak

Bitwise OR bilan birlashtirish:
  <p :class="c">{{ msg }}</p>  → patchFlag = 1 | 2 = 3 (TEXT + CLASS)
  Diff FAQAT text va class tekshiradi!

═══════════════════════════════════════
  BLOCK TREE
═══════════════════════════════════════

Block — struktural o'zgarish chegarasi. Root element + v-if/v-for:

  <div>          ← BLOCK (root)
    <p>Static</p>
    <p>{{ a }}</p> ← dynamicChildren[0]
    <p>{{ b }}</p> ← dynamicChildren[1]
  </div>

dynamicChildren flat array — diff faqat shu array-ni tekshiradi.

v-if YANGI BLOCK yaratadi:
  <div v-if="show">  ← BLOCK (struktura o'zgarishi mumkin)
    <p>{{ msg }}</p>
  </div>

Chunki v-if butun sub-tree-ni qo'shadi/olib tashlaydi — flat tracking ishlamaydi.

═══════════════════════════════════════
  v-once VA v-memo
═══════════════════════════════════════

v-once — element/komponentni BITTA MARTA render, keyin cache:
  <h1 v-once>{{ title }}</h1>
  Faqat birinchi renderda hisoblaydi, keyingi renderlarda cached VNode

v-memo — dependency asosida cache:
  <div v-memo="[item.id, selected === item.id]">
    <p>{{ item.name }}</p>
    <p>{{ expensiveComputation(item) }}</p>
  </div>
  Faqat dependency o'zgarganda qayta render — v-for ichida foydali

v-memo v-for bilan — katta list optimallashtirish:
  <div v-for="item in list" :key="item.id"
       v-memo="[item.id === selected]">
    <!-- Faqat selected o'zgarganda qayta render -->
  </div>

═══════════════════════════════════════
  TEMPLATE vs JSX PERFORMANCE
═══════════════════════════════════════

Template afzalliklari:
- Compile-time ma'lumot — statik/dinamik aniq
- Patch flags + block tree = minimal diff
- Static hoisting = kamroq xotira
- SSR string generation optimallashtirish

JSX kamchiliklari (Vue/React):
- Runtime-da qaysi qism o'zgarishini BILMAYDI
- Har safar to'liq diff kerak
- Har safar barcha VNode qayta yaratiladi

Vue-da JSX HAM ishlatish mumkin, lekin template compiler optimizatsiyalaridan MAHRUM bo'lasiz.

═══════════════════════════════════════
  COMPILER EXPLORER
═══════════════════════════════════════

Vue Template Explorer: https://template-explorer.vuejs.org
Bu tool orqali har qanday template-ning compiled output-ini ko'rishingiz mumkin — hoisted elementlar, patch flaglar, block tree-ni vizual ko'rish.

═══════════════════════════════════════
  REACT BILAN TAQQOSLASH
═══════════════════════════════════════

Vue compiler:
- Template -> optimallashtirilgan render funksiya (build time)
- Statik/dinamik ajratish AVTOMATIK
- Patch flags — qaysi prop tekshirish kerak
- Block tree — flat dynamic tracking
- v-once, v-memo — qo'shimcha hint

React (Hooks davri):
- JSX -> createElement() (oddiy transform, optimallashtirish YO'Q)
- Har safar BUTUN komponent qayta ishlaydi
- useMemo, React.memo — qo'lda optimallashtirish
- React Compiler — YANGI, avtomatik memoizatsiya

React Compiler Vue yondashuviga yaqinlashmoqda — lekin Vue compile-time bilim DOIMO ko'proq bo'ladi (template cheklovlari = ko'proq optimizatsiya imkoniyati).`,
  codeExamples: [
    {
      title: 'Template compiler output — optimizatsiyalar ko\'rish',
      language: 'ts',
      code: `// Template:
// <div id="app">
//   <h1>Vue Compiler</h1>
//   <p :class="textClass">{{ message }}</p>
//   <ul>
//     <li v-for="item in items" :key="item.id">{{ item.name }}</li>
//   </ul>
//   <footer>Copyright 2024</footer>
// </div>

// Compiled output (soddalashtirilgan):
import {
  createElementVNode as _createElementVNode,
  toDisplayString as _toDisplayString,
  renderList as _renderList,
  Fragment as _Fragment,
  openBlock as _openBlock,
  createElementBlock as _createElementBlock,
} from 'vue'

// ✅ STATIC HOISTING — render tashqarisida
const _hoisted_1 = { id: 'app' }
const _hoisted_2 = _createElementVNode('h1', null, 'Vue Compiler', -1 /* HOISTED */)
const _hoisted_3 = _createElementVNode('footer', null, 'Copyright 2024', -1 /* HOISTED */)

function render(_ctx: any) {
  return (_openBlock(), _createElementBlock('div', _hoisted_1, [
    _hoisted_2,  // ✅ Reference — qayta yaratilMAYDI

    // ✅ PATCH FLAG = 3 (TEXT + CLASS) — faqat text va class diff
    _createElementVNode('p', {
      class: _ctx.textClass
    }, _toDisplayString(_ctx.message), 3 /* TEXT, CLASS */),

    // ✅ v-for — KEYED_FRAGMENT block
    _createElementVNode('ul', null, [
      (_openBlock(true), _createElementBlock(_Fragment, null,
        _renderList(_ctx.items, (item) => {
          return (_openBlock(), _createElementBlock('li', {
            key: item.id
          }, _toDisplayString(item.name), 1 /* TEXT */))
        }), 128 /* KEYED_FRAGMENT */))
    ]),

    _hoisted_3,  // ✅ Reference — qayta yaratilMAYDI
  ]))
}`,
      description: 'Haqiqiy compiler output. Statik h1 va footer hoisted (-1). Dinamik p — patch flag 3 (TEXT+CLASS). v-for — KEYED_FRAGMENT.',
    },
    {
      title: 'v-once va v-memo ishlatish',
      language: 'html',
      code: `<script setup lang="ts">
import { ref } from 'vue'

interface Item {
  id: number
  name: string
  description: string
}

const selected = ref<number | null>(null)
const items = ref<Item[]>([
  { id: 1, name: 'Vue', description: 'Progressive framework' },
  { id: 2, name: 'React', description: 'UI library' },
  { id: 3, name: 'Angular', description: 'Full framework' },
])

const title = ref('Frameworklar')
const renderCount = ref(0)

function selectItem(id: number) {
  selected.value = id
  renderCount.value++
}
</script>

<template>
  <!-- v-once: BITTA MARTA render, keyin cache -->
  <h1 v-once>{{ title }}</h1>
  <!-- title o'zgarsa ham h1 YANGILANMAYDI -->
  <!-- Foyda: katta statik kontent (markdown parsed HTML va h.k.) -->

  <p>Render count: {{ renderCount }}</p>

  <!-- v-memo: dependency o'zgargandagina qayta render -->
  <div class="item-list">
    <div
      v-for="item in items"
      :key="item.id"
      v-memo="[selected === item.id]"
      :class="{ selected: selected === item.id }"
      @click="selectItem(item.id)"
    >
      <!-- Bu butun div faqat item select/deselect bo'lganda qayta render -->
      <!-- Agar 1000 ta item bo'lsa — faqat 2 tasi re-render (eski va yangi selected) -->
      <h3>{{ item.name }}</h3>
      <p>{{ item.description }}</p>
    </div>
  </div>
</template>`,
      description: 'v-once — bitta marta render (katta statik kontent uchun). v-memo — dependency cache (katta v-for list-lar uchun, faqat o\'zgarganlari re-render).',
    },
    {
      title: 'SSR compiler optimizatsiyalari',
      language: 'ts',
      code: `// SSR da compiler yana boshqa optimizatsiyalar qiladi:

// Template:
// <div>
//   <h1>Sarlavha</h1>
//   <p>{{ msg }}</p>
//   <ul>
//     <li>Statik 1</li>
//     <li>Statik 2</li>
//     <li>Statik 3</li>
//   </ul>
// </div>

// CLIENT render — VNode yaratadi:
function render() {
  return h('div', [
    _hoisted_h1,           // VNode
    h('p', msg),           // VNode
    _hoisted_ul,           // VNode
  ])
}

// SSR render — to'g'ridan-to'g'ri STRING:
function ssrRender(_ctx: any, _push: any) {
  _push('<div>')
  _push('<h1>Sarlavha</h1>')            // Statik = oddiy string concat
  _push(\`<p>\${_ctx.msg}</p>\`)         // Dinamik = interpolation
  _push('<ul><li>Statik 1</li><li>Statik 2</li><li>Statik 3</li></ul>')
  _push('</div>')
  // VNode yaratilMAYDI — to'g'ridan-to'g'ri string
  // Katta sahifalarda 2-3x tezroq
}

// Statik kontent STRING_CONCAT:
// 100 ta statik li bor? BITTA string sifatida push
// VNode yaratish, diff — hech biri YO'Q
// Bu Vue SSR ni React SSR dan tezroq qiladi`,
      description: 'SSR-da compiler VNode o\'rniga to\'g\'ridan-to\'g\'ri string generatsiya qiladi. Statik kontent bitta string concat — VNode overhead YO\'Q.',
    },
  ],
  interviewQA: [
    {
      question: 'Vue compiler qanday optimizatsiyalar qiladi?',
      answer: `4 asosiy optimallashtirish: 1) Static hoisting — o'zgarmas VNode-lar render tashqarisida yaratiladi, har renderda qayta yaratilmaydi. 2) Patch flags — har bir dinamik VNode-ga raqam qo'yiladi (TEXT=1, CLASS=2, STYLE=4...), diff faqat belgilangan qismlarni tekshiradi. 3) Block tree — dinamik node-lar flat array-da (dynamicChildren), statik node-lar SKIP. 4) Event handler caching — @click="handler" qayta yaratilmaydi. Natija: Vue template React JSX-dan tezroq — compile-time bilim ko'proq.`,
    },
    {
      question: 'Patch flag qanday ishlaydi? Nima uchun bitwise operatsiya?',
      answer: `Patch flag — VNode-ga compiler qo'yadigan raqam, diff vaqtida nimani tekshirish kerak. TEXT=1, CLASS=2, STYLE=4, PROPS=8. Bitwise OR bilan birlashtirish: <p :class="c">{{ msg }}</p> → 1|2 = 3. Diff vaqtida bitwise AND bilan tekshirish: flag & TEXT → true (text tekshir), flag & STYLE → false (style SKIP). Nima uchun bitwise: 1) TEZKOR — CPU-da bitta operatsiya. 2) Bitta raqamda bir nechta flag saqlash mumkin. 3) Kichik xotira. Bu C/C++ dunyosidan kelgan klassik optimizatsiya pattern.`,
    },
    {
      question: 'v-once va v-memo farqi nima? Qachon ishlatiladi?',
      answer: `v-once — BITTA MARTA render, keyin cache. State o'zgarsa ham YANGILANMAYDI. Ishlatish: katta statik kontent (markdown parsed HTML, litsenziya matni). v-memo="[deps]" — dependency asosida cache. deps O'ZGARMASA — cached VNode, O'ZGARSA — qayta render. Ishlatish: katta v-for list-larda performance. Misol: 1000 ta item, v-memo="[selected === item.id]" — select/deselect da faqat 2 ta item re-render (eski va yangi), 998 tasi cache-dan. Bu React.memo-ga o'xshash lekin TEMPLATE darajasida.`,
    },
    {
      question: 'Nima uchun template JSX dan tezroq Vue-da?',
      answer: `Template compile-time da optimizatsiyalarga imkon beradi: 1) Compiler statik/dinamik node-larni ANIQ biladi — template strukturalangan. 2) Patch flags qo'yish mumkin — qaysi prop dinamik. 3) Block tree yaratish mumkin — faqat dinamik node-lar track qilinadi. 4) Static hoisting — o'zgarmas qism bir marta yaratiladi. JSX-da bular IMKONSIZ — chunki JSX oddiy JavaScript, compiler "bu o'zgaradimi" deb BILMAYDI. Misol: h(cond ? 'div' : 'span', ...) — runtime-da hal qilinadi. LEKIN: JSX moslashuvchanroq — murakkab dinamik render uchun yaxshiroq.`,
    },
    {
      question: 'Vue Template Explorer nima va qanday ishlatiladi?',
      answer: `template-explorer.vuejs.org — Vue compiler output-ni vizual ko'rish tool. Template yozsangiz — real-time compiled JavaScript ko'rinadi. Foydasi: 1) Compiler qanday optimallashtirganini O'RGANISH. 2) Patch flag-larni ko'rish — to'g'ri flag qo'yilganmi. 3) Static hoisting — qaysi element hoisted. 4) v-if/v-for block-larni ko'rish. 5) Performance audit — template yozish yaxshilash. Senior dasturchi bu tool bilan ishlashni bilishi kerak — intervyuda "compiler output-ni bilasizmi" deb so'rashadi.`,
    },
  ],
  relatedTopics: [
    { techId: 'vue-js', sectionId: 'vue-theory', topicId: 'virtual-dom-vue', label: 'Virtual DOM' },
    { techId: 'vue-js', sectionId: 'vue-theory', topicId: 'vue-internals', label: 'Vue ichki arxitekturasi' },
    { techId: 'vue-js', sectionId: 'vue-theory', topicId: 'reactivity-theory', label: 'Reaktivlik nazariyasi' },
  ],
}
