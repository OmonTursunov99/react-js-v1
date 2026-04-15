import type { Topic } from '../../../types'

export const vueInternals: Topic = {
  id: 'vue-internals',
  title: 'Vue Internals',
  importance: 2,
  status: 'to-learn',
  description: 'Vue ichki arxitekturasi — Compiler, Renderer, Reactivity triad, @vue paketlar, Scheduler',
  content: `Vue 3 ichki arxitekturasi — uchta asosiy qism (triad): Compiler, Reactivity, Renderer. Har biri alohida npm paket sifatida tashkil etilgan.

═══════════════════════════════════════
  ARXITEKTURA TRIAD
═══════════════════════════════════════

1. COMPILER — Template → Render funksiya
   @vue/compiler-sfc    — SFC (.vue) fayllarni parse qilish
   @vue/compiler-dom    — DOM-ga mo'ljallangan template kompilyatsiya
   @vue/compiler-core   — platform-agnostik kompilyator yadro

2. REACTIVITY — State kuzatish va yangilash
   @vue/reactivity     — ref, reactive, computed, effect, watch
   Proxy-based, platform-agnostik (brauzer yoki server)

3. RENDERER — VNode → Haqiqiy DOM
   @vue/runtime-core    — Platform-agnostik renderer
   @vue/runtime-dom     — DOM-specific renderer (createElement, patchProp)

OQIM:
  Template → [Compiler] → Render fn → [Reactivity + Renderer] → DOM

═══════════════════════════════════════
  @vue/compiler-sfc — SFC PARSING
═══════════════════════════════════════

.vue faylni 3 qismga ajratadi:
  <script setup>  → JavaScript/TypeScript
  <template>      → HTML-like template
  <style scoped>  → CSS

Har bir qism alohida kompilyator orqali ishlanadi:
- script → TypeScript compiler (esbuild/tsc)
- template → @vue/compiler-dom
- style → PostCSS (scoped attr qo'shish, v-bind CSS)

Vite-da vue-plugin-vite bu jarayonni boshqaradi.

═══════════════════════════════════════
  @vue/compiler-dom — TEMPLATE COMPILER
═══════════════════════════════════════

3 bosqich:
1. PARSE: template string → AST (Abstract Syntax Tree)
   <div :class="c">{{ msg }}</div>
   → { type: 'Element', tag: 'div', props: [...], children: [...] }

2. TRANSFORM: AST optimizatsiya
   - Static node detection (hoistable)
   - Patch flag aniqlash
   - v-if → conditional VNode
   - v-for → renderList()
   - v-on → event handler caching
   - v-model → prop + event transform

3. CODEGEN: AST → JavaScript render funksiya string
   → "function render(_ctx) { return createVNode('div', ...) }"

═══════════════════════════════════════
  @vue/reactivity — REAKTIVLIK PAKETI
═══════════════════════════════════════

Mustaqil ishlatish mumkin (Vue-siz HAM!):
  import { ref, reactive, computed, effect } from '@vue/reactivity'

Asosiy primitive-lar:
- ref(value) — RefImpl class, .value getter/setter
- reactive(obj) — Proxy wrapper, get=track, set=trigger
- computed(fn) — lazy, cached, ReactiveEffect
- effect(fn) — low-level reaktiv effect (composable asosi)
- watch/watchEffect — effect + scheduler

targetMap: WeakMap<target, Map<key, Set<effect>>>
Bu GLOBAL dependency graph — barcha reaktiv bog'lanishlar shu yerda.

═══════════════════════════════════════
  @vue/runtime-core — RENDERER
═══════════════════════════════════════

Platform-agnostik renderer:
- createRenderer(options) — custom renderer yaratish
- options: createElement, patchProp, insert, remove...
- Vue DOM uchun: @vue/runtime-dom bu options beradi

Komponent lifecycle:
1. createComponentInstance() — instance yaratish
2. setupComponent() — props, setup(), lifecycle hook
3. setupRenderEffect() — render effect yaratish
4. Birinchi render: patch(null, vnode, container)
5. Yangilanish: patch(prevVNode, nextVNode, container)

patch() algoritmi:
- Ikkala VNode bir xil type/key? → patchElement (update)
- Farqli type? → unmount(old) + mount(new)
- null → mount (birinchi render)
- children diff → patchChildren (keyed, unkeyed)

═══════════════════════════════════════
  SCHEDULER — NAVBAT BOSHQARISHI
═══════════════════════════════════════

queueJob(job):
  - Job-ni navbatga qo'shish
  - Dublikatlarni olib tashlash (Set)
  - Mikrotask-da flush

queuePostFlushCb(cb):
  - Render KEYIN ishlash (onUpdated, watch flush: 'post')

flushJobs():
  1. Pre-flush queue (watch flush: 'pre')
  2. Component render queue (tartib: ota → bola)
  3. Post-flush queue (watch flush: 'post', onUpdated)

nextTick():
  - Joriy flush tugashini kutish
  - Promise.resolve().then(callback)
  - YOKI: await nextTick()

═══════════════════════════════════════
  KOMPONENT INSTANCE LIFECYCLE
═══════════════════════════════════════

1. createApp(App).mount('#app')
2. createVNode(App) → app root VNode
3. patch(null, vnode, container) → mount
4. createComponentInstance() → instance { props, setupState, ... }
5. setupComponent() → props init, setup() chaqirish
6. setupRenderEffect() → ReactiveEffect yaratish
7. render() → VNode tree → patch → DOM
8. onBeforeMount hooks
9. DOM insert
10. onMounted hooks
11. State o'zgaradi → trigger → queueJob → re-render
12. Unmount: onBeforeUnmount → DOM remove → onUnmounted

═══════════════════════════════════════
  REACT BILAN TAQQOSLASH
═══════════════════════════════════════

Vue arxitektura:
- Compiler + Reactivity + Renderer — ALOHIDA paketlar
- Compile-time optimallashtirish (template → optimized render fn)
- Fine-grained reactivity (Proxy)
- Sinxron rendering (async ichida ham)

React arxitektura:
- Reconciler (Fiber) + Renderer — ikki qism
- Runtime diff (JSX → createElement → fiber tree)
- Coarse-grained update (komponent darajasi)
- Concurrent rendering (interruptible)

React Fiber vs Vue Scheduler:
- Fiber: ishlashni TO'XTATIB, keyinroq davom ettirish mumkin (time-slicing)
- Vue Scheduler: mikrotask navbat, lekin to'xtatib bo'lMAYDI
- React: priority (urgent, transition, idle)
- Vue: oddiy navbat (lekin amalda yetarli tez)`,
  codeExamples: [
    {
      title: '@vue/reactivity — Vue-siz ishlatish',
      language: 'ts',
      code: `// @vue/reactivity MUSTAQIL paket — Vue runtime kerak EMAS!
// npm install @vue/reactivity
import {
  ref,
  reactive,
  computed,
  effect,
  watch,
  toRaw,
  isRef,
  isReactive,
} from '@vue/reactivity'

// Node.js, Deno, yoki boshqa runtime-da HAM ishlaydi
const count = ref(0)
const user = reactive({ name: 'Ali', age: 25 })
const doubled = computed(() => count.value * 2)

// effect — low-level reaktiv kuzatuvchi
// Birinchi chaqirilganda: count O'QILADI → track()
// count o'zgarganda: effect qayta ishlaydi
effect(() => {
  console.log(\`Count: \${count.value}, Doubled: \${doubled.value}\`)
})

count.value = 1  // Console: "Count: 1, Doubled: 2"
count.value = 5  // Console: "Count: 5, Doubled: 10"

// watch — Vue 3 watch analog
watch(
  () => user.name,
  (newVal, oldVal) => {
    console.log(\`Name: \${oldVal} → \${newVal}\`)
  }
)
user.name = 'Vali' // Console: "Name: Ali → Vali"

// Utility:
console.log(isRef(count))       // true
console.log(isReactive(user))   // true
console.log(toRaw(user))        // { name: 'Vali', age: 25 } (Proxy EMAS)`,
      description: '@vue/reactivity — mustaqil paket. Vue runtime kerak emas. Node.js/Deno-da ham ishlaydi. effect(), ref(), reactive(), computed() — core primitive-lar.',
    },
    {
      title: 'Custom Renderer — createRenderer()',
      language: 'ts',
      code: `// Vue custom renderer — HAR QANDAY platformaga render mumkin!
// Canvas, Terminal, PDF, Native UI...
import { createRenderer, h, ref } from '@vue/runtime-core'

// Canvas uchun oddiy custom renderer
interface CanvasElement {
  type: string
  props: Record<string, any>
  children: CanvasElement[]
  parent?: CanvasElement
}

const { createApp: createCanvasApp } = createRenderer<
  CanvasElement, // Node type
  CanvasElement  // Element type
>({
  // Element yaratish
  createElement(type) {
    return { type, props: {}, children: [] }
  },

  // Text node yaratish
  createText(text) {
    return { type: 'text', props: { text }, children: [] }
  },

  // Element ichiga qo'shish
  insert(child, parent, anchor) {
    child.parent = parent
    if (anchor) {
      const idx = parent.children.indexOf(anchor)
      parent.children.splice(idx, 0, child)
    } else {
      parent.children.push(child)
    }
    drawToCanvas(parent) // Canvas-ga chizish
  },

  // Element olib tashlash
  remove(child) {
    if (child.parent) {
      const idx = child.parent.children.indexOf(child)
      child.parent.children.splice(idx, 1)
      drawToCanvas(child.parent)
    }
  },

  // Property o'rnatish
  patchProp(el, key, _prevVal, nextVal) {
    el.props[key] = nextVal
  },

  // Parent olish
  parentNode(node) {
    return node.parent ?? null
  },

  // Keyingi sibling
  nextSibling(node) {
    if (!node.parent) return null
    const idx = node.parent.children.indexOf(node)
    return node.parent.children[idx + 1] ?? null
  },

  createComment: () => ({ type: 'comment', props: {}, children: [] }),
  setText: (node, text) => { node.props.text = text },
  setElementText: (el, text) => { el.props.text = text },
})

function drawToCanvas(root: CanvasElement) {
  // Canvas 2D API bilan chizish logikasi...
  console.log('Canvas yangilandi:', JSON.stringify(root, null, 2))
}

// Ishlatish:
// const app = createCanvasApp(CanvasComponent)
// app.mount(canvasRootElement)`,
      description: 'createRenderer() — custom renderer yaratish. Vue VDOM + Reactivity ishlaydi, faqat DOM o\'rniga boshqa platforma. Canvas, Terminal, PDF va h.k.',
    },
    {
      title: 'Scheduler ishlash tartibi',
      language: 'ts',
      code: `// Vue Scheduler — soddalashtirilgan versiya
// Haqiqiy manba: @vue/runtime-core/src/scheduler.ts

type Job = () => void
const queue: Job[] = []
const postFlushCbs: Job[] = []
let isFlushing = false
let isFlushPending = false

// Job navbatga qo'shish
function queueJob(job: Job) {
  // Dublikat tekshirish
  if (!queue.includes(job)) {
    queue.push(job)
    queueFlush()
  }
}

// Flush rejalashtirish (mikrotask)
function queueFlush() {
  if (!isFlushing && !isFlushPending) {
    isFlushPending = true
    Promise.resolve().then(flushJobs)
  }
}

// Navbatni bajarish
function flushJobs() {
  isFlushPending = false
  isFlushing = true

  // 1. Queue-ni tartibga solish (id bo'yicha — ota oldin, bola keyin)
  queue.sort((a: any, b: any) => (a.id ?? 0) - (b.id ?? 0))

  // 2. Har bir job-ni bajarish
  for (let i = 0; i < queue.length; i++) {
    queue[i]()
  }
  queue.length = 0

  // 3. Post-flush callback-lar (onUpdated, watch flush: 'post')
  for (let i = 0; i < postFlushCbs.length; i++) {
    postFlushCbs[i]()
  }
  postFlushCbs.length = 0

  isFlushing = false

  // Agar flush davomida yangi job qo'shilgan bo'lsa — yana flush
  if (queue.length || postFlushCbs.length) {
    flushJobs()
  }
}

// nextTick — flush tugashini kutish
function nextTick(fn?: () => void): Promise<void> {
  return fn ? Promise.resolve().then(fn) : Promise.resolve()
}

// Foydalanish misoli:
// state.value = 1  → trigger() → queueJob(renderEffect)
// state.value = 2  → trigger() → queueJob(renderEffect) — DUBLIKAT, skip
// state.value = 3  → trigger() → queueJob(renderEffect) — DUBLIKAT, skip
// --- sinxron kod tugadi ---
// --- mikrotask ---
// flushJobs() → renderEffect() BITTA MARTA ishlaydi (state = 3)`,
      description: 'Vue Scheduler — mikrotask navbat. Dublikat job-larni olib tashlaydi, ota→bola tartibda bajaradi. nextTick — flush tugashini kutish.',
    },
  ],
  interviewQA: [
    {
      question: 'Vue 3 ichki arxitekturasini tushuntiring.',
      answer: `Vue 3 uchta asosiy qismdan (triad) iborat: 1) COMPILER (@vue/compiler-sfc, @vue/compiler-dom) — template-ni optimallashtirilgan render funksiyaga aylantiradi (parse → transform → codegen). 2) REACTIVITY (@vue/reactivity) — Proxy-based state kuzatish (ref, reactive, computed, effect, track/trigger). 3) RENDERER (@vue/runtime-core, @vue/runtime-dom) — VNode-larni haqiqiy DOM-ga aylantirish (patch, diff, mount, unmount). Oqim: Template → Compiler → Render fn → Reactivity track → State change → Trigger → Re-render → Patch DOM.`,
    },
    {
      question: '@vue/reactivity alohida paket sifatida ishlatish mumkinmi?',
      answer: `Ha! @vue/reactivity MUSTAQIL paket — Vue runtime kerak EMAS. npm install @vue/reactivity qilib Node.js, Deno, yoki boshqa runtime-da ishlatish mumkin. ref(), reactive(), computed(), effect(), watch() — hammasi ishlaydi. Ishlatish holatlari: 1) Server-side logika — reaktiv state. 2) CLI tool-lar — config kuzatish. 3) Game engine — state management. 4) Boshqa framework-larga integratsiya. Bu Vue arxitekturasining KUCHLI tomoni — monolitik emas, modular.`,
    },
    {
      question: 'Vue Scheduler qanday ishlaydi? nextTick bilan bog\'liq tushuntiring.',
      answer: `Scheduler oqimi: 1) State o'zgaradi → trigger() → queueJob(renderEffect). 2) Bir nechta o'zgarish bo'lsa — DUBLIKAT job-lar olib tashlanadi. 3) Sinxron kod tugaydi. 4) Mikrotask — flushJobs() ishlaydi. 5) Queue tartibga solinadi (ota komponent oldin, bola keyin — id bo'yicha). 6) Render job-lar bajariladi. 7) Post-flush callback-lar (onUpdated, watch flush:'post'). nextTick() — shu flush tugashini kutadi (Promise.resolve().then). NATIJA: 3 marta state o'zgarish = 1 marta render. DOM yangilanganidan KEYIN nextTick orqali murojaat qilish mumkin.`,
    },
    {
      question: 'createRenderer() nima va nima uchun kerak?',
      answer: `createRenderer(options) — Vue-ning platform-agnostik rendererini custom platformaga moslashtirish. Options: createElement, insert, remove, patchProp, parentNode, nextSibling. Ishlatish: 1) Canvas rendering — o'yin, grafik. 2) Terminal UI — CLI ilovalar. 3) Native mobile — Vue Native, NativeScript. 4) PDF generation. 5) WebGL — 3D render. Vue Reactivity + VDOM ishlaydi, faqat DOM operatsiyalari custom bo'ladi. React ham shunaqa — react-dom, react-native, react-three-fiber — bir xil konsept. Bu ABSTRAKSIYA kuchi — bitta framework, ko'p platforma.`,
    },
    {
      question: 'Vue komponent instance lifecycle-ni ichki ishlash bilan tushuntiring.',
      answer: `1) createApp(App).mount('#app') → createVNode(App). 2) patch(null, vnode, container) — birinchi mount. 3) createComponentInstance() — instance ob'ekt: { props, setupState, render, effects... }. 4) setupComponent() — props resolve, setup() chaqirish, lifecycle hooks ro'yxatga olish. 5) setupRenderEffect() — ReactiveEffect yaratish, render funksiyani effect ichida ishga tushirish. 6) Birinchi render: render() → VNode tree → patch → DOM yaratish. 7) onBeforeMount → DOM insert → onMounted. 8) State o'zgaradi: trigger() → queueJob(renderEffect) → flushJobs → render() → patch → DOM update. 9) onBeforeUpdate → DOM patch → onUpdated. 10) Unmount: onBeforeUnmount → effects stop → DOM remove → onUnmounted.`,
    },
    {
      question: 'Vue Renderer va React Fiber farqi nima?',
      answer: `Vue Renderer: sinxron rendering + mikrotask scheduler. State o'zgaradi → render queue → mikrotask-da flush → DOM patch. TO'XTATIB BO'LMAYDI — boshlagan render oxirigacha ishlaydi. Kichik/o'rtacha loyihalarda YETARLI tez (fine-grained reactivity tufayli). React Fiber: async/concurrent rendering. Render ishini kichik bo'laklarga bo'ladi (fiber units). Har bir bo'lakdan keyin — to'xtash mumkin (user input uchun). Priority tizimi: urgent (click), transition (page change), idle (background). KATTA loyihalarda afzallik — UI janky bo'lmaydi. LEKIN: murakkablik yuqori, ba'zi holatlarda "tearing" muammosi. Vue soddaroq model — amalda ko'p loyihalar uchun yetarli.`,
    },
  ],
  relatedTopics: [
    { techId: 'vue-js', sectionId: 'vue-theory', topicId: 'reactivity-theory', label: 'Reaktivlik nazariyasi' },
    { techId: 'vue-js', sectionId: 'vue-theory', topicId: 'virtual-dom-vue', label: 'Virtual DOM' },
    { techId: 'vue-js', sectionId: 'vue-theory', topicId: 'compiler-optimizations', label: 'Compiler optimizatsiyalari' },
    { techId: 'vue-js', sectionId: 'vue-core', topicId: 'lifecycle', label: 'Lifecycle Hooks' },
  ],
}
