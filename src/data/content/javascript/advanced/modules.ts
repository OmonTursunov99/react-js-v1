import type { Topic } from '../../../types'

export const modules: Topic = {
  id: 'modules',
  title: 'Modullar (ESM vs CJS)',
  importance: 3,
  status: 'to-learn',
  description: 'CommonJS vs ES Modules, import/export, dynamic import',
  content: `═══════════════════════════════════════
  MODULLAR — KODNI TASHKIL QILISH
═══════════════════════════════════════

Modul — mustaqil, qayta ishlatiladigan kod birligi. Modullar kodni
mantiqiy qismlarga ajratadi, global scope ni ifloslantirmaydi va
bog'liqliklarni aniq belgilaydi.

JavaScript da ikki asosiy modul tizimi mavjud:
1. CommonJS (CJS) — Node.js da ishlatilgan
2. ES Modules (ESM) — JavaScript standarti (ES2015+)

═══════════════════════════════════════
  COMMONJS — REQUIRE / MODULE.EXPORTS
═══════════════════════════════════════

CommonJS Node.js da standart modul tizimi bo'lib, SINXRON ishlaydi.

Asosiy xususiyatlar:
1. require() — modulni SINXRON yuklaydi
2. module.exports — eksport qilinadigan qiymat
3. exports — module.exports ga shortcut
4. RUNTIME da ishlaydi — require() har qanday joyda chaqirilishi mumkin
5. Keshlanadi — birinchi require() dan keyin keshga tushadi

MUHIM: exports = {} ISHLAMAYDI! Chunki exports faqat
module.exports ga referens. Yangi obyekt tayinlash referensni uzadi.
module.exports = {} to'g'ri ishlaydi.

CJS ning cheklovlari:
- Sinxron yuklash — browser uchun mos emas (network latency)
- Statik tahlil mumkin emas — tree shaking ishlamaydi
- Circular dependency muammolari murakkab

═══════════════════════════════════════
  ES MODULES — IMPORT / EXPORT
═══════════════════════════════════════

ES Modules — JavaScript ning rasmiy standart modul tizimi.
Browser va Node.js (v12+) da ishlaydi.

Asosiy xususiyatlar:
1. STATIK — import/export faqat fayl yuqorisida (top-level)
2. ASINXRON yuklash — browser uchun mos
3. Live bindings — eksport qilingan qiymat o'zgarsa, import ham yangilanadi
4. Strict mode avtomatik yoqilgan
5. Tree shaking mumkin — statik tahlil tufayli

Named export:
export const name = 'Ali'
export function greet() {}
export class User {}

Default export (faylda bitta):
export default class App {}

═══════════════════════════════════════
  NAMED VS DEFAULT EXPORT
═══════════════════════════════════════

NAMED EXPORT:
- Bir fayldan bir nechta export
- Import paytida ANIQ NOM kerak: { name }
- Refactoring uchun qulay (avtomatik rename)
- IDE autocomplete yaxshi ishlaydi

DEFAULT EXPORT:
- Faylda faqat BITTA default export
- Import paytida ixtiyoriy nom berish mumkin
- Asosiy eksport uchun ishlatiladi (komponent, class)

MUHIM: Loyiha bo'ylab bir xil convention tanlang.
React ekotizimida odatda: komponent — default export,
utility funksiyalar — named export.

═══════════════════════════════════════
  DYNAMIC IMPORT — LAZY LOADING
═══════════════════════════════════════

import() — funksiya sifatida chaqiriladi va Promise qaytaradi.
Modulni RUNTIME da, KERAK BO'LGANDA yuklaydi.

const module = await import('./heavy-module.js')

Afzalliklari:
1. Lazy loading — dastlabki yuklash vaqtini kamaytiradi
2. Code splitting — bundler (Webpack/Vite) alohida chunk yaratadi
3. Shartli yuklash — faqat kerak bo'lganda import qilish
4. Route-based splitting — har bir sahifa alohida bundle

React da: React.lazy(() => import('./Component'))
Vite da: avtomatik code splitting dynamic import orqali

═══════════════════════════════════════
  TREE SHAKING — DEAD CODE ELIMINATION
═══════════════════════════════════════

Tree shaking — ishlatilmagan eksportlarni yakuniy bundle dan
olib tashlash. Faqat ES Modules da ishlaydi (statik tahlil tufayli).

Ishlash sharti:
1. ES Modules ishlatilishi kerak (import/export)
2. Side effects bo'lmasligi kerak
3. package.json da "sideEffects": false belgilash
4. Production mode da bundler (Webpack/Rollup/Vite) amalga oshiradi

MUHIM: CommonJS da tree shaking ISHLAMAYDI — require() dinamik
va runtime da ishlaydi, shuning uchun bundler qaysi kod ishlatilishini
oldindan bila olmaydi.

Side effects — import paytida ishlaydigan kod (global o'zgaruvchilarni
o'zgartirish, polyfill qo'shish). Bunday fayllar tree shaking dan
himoyalanishi kerak: "sideEffects": ["*.css", "polyfill.js"]

═══════════════════════════════════════
  CIRCULAR DEPENDENCIES
═══════════════════════════════════════

Circular dependency — A modul B ni, B modul A ni import qilishi.

CJS da muammo:
- require() sinxron — A yuklayotganda B ni yuklaydi,
  B da A hali to'liq yuklanmagan, shuning uchun A ning
  shu paytgacha eksport qilgan qismi olinadi (partial export)

ESM da yechim:
- ESM live bindings ishlatadi — import qilingan qiymat
  REFERENS bo'lib, keyinchalik to'liq qiymat ko'rinadi
- Lekin baribir muammo bo'lishi mumkin (hoisted bo'lmagan qiymatlar)

Eng yaxshi yechim — circular dependency dan QOCHISH:
1. Umumiy kodni alohida modulga chiqarish
2. Dependency Injection pattern
3. Lazy evaluation (funksiya ichida import)`,
  codeExamples: [
    {
      title: 'CommonJS — require / module.exports',
      language: 'js',
      code: `// ═══ math.js (CJS) ═══
// Named exports
exports.add = (a, b) => a + b
exports.multiply = (a, b) => a * b

// YOKI module.exports bilan
module.exports = {
  add: (a, b) => a + b,
  multiply: (a, b) => a * b
}

// XATO! exports ni qayta tayinlash ishlamaydi:
// exports = { add, multiply }  // ← referens uziladi

// ═══ app.js ═══
const math = require('./math')
console.log(math.add(2, 3))       // 5

// Destrukturing
const { add, multiply } = require('./math')
console.log(multiply(4, 5))       // 20

// Shartli require (CJS da mumkin, ESM da yo'q)
let db
if (process.env.NODE_ENV === 'test') {
  db = require('./mock-db')
} else {
  db = require('./real-db')
}

// Keshlanish
const a = require('./math')  // 1-chi: fayl o'qiladi
const b = require('./math')  // 2-chi: keshdan olinadi
console.log(a === b)          // true — bir xil obyekt`,
      description: 'CommonJS modul tizimi — sinxron require va module.exports',
    },
    {
      title: 'ES Modules — import / export',
      language: 'js',
      code: `// ═══ utils.js (ESM) ═══

// Named exports
export const PI = 3.14159

export function formatDate(date) {
  return date.toLocaleDateString('uz')
}

export class EventEmitter {
  #handlers = new Map()
  on(event, fn) { /* ... */ }
  emit(event, data) { /* ... */ }
}

// Default export
export default class App {
  constructor() { /* ... */ }
}

// ═══ main.js ═══

// Default import — ixtiyoriy nom
import MyApp from './utils.js'

// Named import — aniq nom kerak
import { PI, formatDate } from './utils.js'

// Hammasi birga
import App, { PI, formatDate, EventEmitter } from './utils.js'

// Nom o'zgartirish (alias)
import { formatDate as format } from './utils.js'

// Barcha named export larni olish
import * as Utils from './utils.js'
console.log(Utils.PI)          // 3.14159
console.log(Utils.default)     // App class

// Re-export — barrel pattern
// ═══ index.js ═══
export { formatDate } from './utils.js'
export { default as App } from './utils.js'
export * from './helpers.js'`,
      description: 'ES Modules — named, default, re-export pattern lari',
    },
    {
      title: 'Dynamic import — code splitting',
      language: 'js',
      code: `// Dynamic import — Promise qaytaradi
async function loadChart() {
  // Faqat kerak bo'lganda yuklanadi
  const { Chart } = await import('./chart-library.js')
  const chart = new Chart('#container')
  chart.render(data)
}

// Shartli yuklash
async function loadLocale(lang) {
  const translations = await import(\`./locales/\${lang}.js\`)
  return translations.default
}

// Error handling
async function safeImport(path) {
  try {
    return await import(path)
  } catch (err) {
    console.error(\`Modul yuklanmadi: \${path}\`, err)
    return null
  }
}

// ═══ React bilan — lazy loading ═══
import { lazy, Suspense } from 'react'

// Komponent faqat render paytida yuklanadi
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Settings = lazy(() => import('./pages/Settings'))

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Suspense>
  )
}

// Named export bilan lazy
const Chart = lazy(() =>
  import('./components/Chart').then(mod => ({
    default: mod.Chart  // Named export ni default ga aylantirish
  }))
)`,
      description: 'Dynamic import() bilan lazy loading va code splitting',
    },
    {
      title: 'Tree shaking va side effects',
      language: 'js',
      code: `// ═══ utils.js ═══
export function add(a, b) { return a + b }
export function multiply(a, b) { return a * b }
export function divide(a, b) { return a / b }
export function subtract(a, b) { return a - b }

// ═══ app.js ═══
import { add } from './utils.js'
// Tree shaking: multiply, divide, subtract bundle ga TUSHMAYDI

// ────────────────────────────
// TREE SHAKING ISHLAMAYDI:
// ────────────────────────────

// 1. CommonJS — dinamik, tahlil mumkin emas
const { add } = require('./utils')  // Bundler bilmaydi nima ishlatiladi

// 2. Namespace import — butun modul olinadi
import * as Utils from './utils.js'
Utils.add(1, 2)  // Bundler Utils.multiply ham kerakmi bilmaydi

// 3. Side effect li kod
let count = 0
export function increment() { count++ }
count = 10  // Side effect — import paytida ishlaydi

// ────────────────────────────
// package.json sozlash
// ────────────────────────────
// {
//   "sideEffects": false,        ← barcha fayllar pure
//   "sideEffects": ["*.css"],    ← faqat CSS side effect
// }

// ────────────────────────────
// Barrel file muammosi
// ────────────────────────────
// index.js (barrel)
export { Button } from './Button'
export { Modal } from './Modal'
export { Table } from './Table'

// Agar faqat Button import qilsangiz,
// ba'zi bundlerlar Modal va Table ni ham yuklaydi
// Yechim: to'g'ridan-to'g'ri fayldan import qilish
import { Button } from './components/Button'  // ← yaxshiroq`,
      description: 'Tree shaking ishlash sharti va to\'sqinlik qiluvchi holatlar',
    },
    {
      title: 'CJS vs ESM — farqlar va migratsiya',
      language: 'js',
      code: `// ════════════════════════════════════
// ASOSIY FARQLAR JADVALI
// ════════════════════════════════════
//
// │ Xususiyat    │ CommonJS         │ ES Modules       │
// │ Sintaksis    │ require/exports  │ import/export     │
// │ Yuklash      │ Sinxron          │ Asinxron          │
// │ Tahlil       │ Runtime          │ Statik (parse)    │
// │ Binding      │ Nusxa (copy)     │ Live reference    │
// │ this         │ module.exports   │ undefined         │
// │ __dirname    │ Mavjud           │ Yo'q (import.meta)│
// │ Tree shaking │ Yo'q             │ Bor               │
// │ Top-level    │ Yo'q             │ await mumkin      │

// ════════════════════════════════════
// Live binding vs Copy
// ════════════════════════════════════

// CJS — nusxa (copy)
// counter.js
let count = 0
module.exports = { count, increment() { count++ } }

// app.js
const mod = require('./counter')
mod.increment()
console.log(mod.count)  // 0 — nusxa, yangilanmaydi!

// ESM — live binding (referens)
// counter.mjs
export let count = 0
export function increment() { count++ }

// app.mjs
import { count, increment } from './counter.mjs'
increment()
console.log(count)  // 1 — live binding, yangilanadi!

// ════════════════════════════════════
// Node.js da ESM ishlatish
// ════════════════════════════════════
// 1. package.json da "type": "module" qo'shish
// 2. Yoki .mjs kengaytmasi ishlatish
// 3. __dirname o'rniga:
import { fileURLToPath } from 'url'
import { dirname } from 'path'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)`,
      description: 'CJS va ESM farqlari — live binding, migratsiya, Node.js',
    },
  ],
  interviewQA: [
    {
      question: 'CommonJS va ES Modules ning asosiy farqlari nimada?',
      answer: 'Asosiy farqlar: 1) Yuklash — CJS sinxron (require), ESM asinxron (import). 2) Tahlil — CJS runtime da, ESM statik (parse paytida). 3) Binding — CJS qiymatni nusxalaydi, ESM live reference yaratadi (eksport o\'zgarsa, import ham yangilanadi). 4) Tree shaking — faqat ESM da ishlaydi (statik tahlil tufayli). 5) Scope — CJS da this = module.exports, ESM da this = undefined, strict mode avtomatik. 6) Top-level await — faqat ESM da mumkin.',
    },
    {
      question: 'Tree shaking nima va qanday ishlaydi?',
      answer: 'Tree shaking — ishlatilmagan eksportlarni yakuniy bundle dan olib tashlash (dead code elimination). Bundler (Webpack/Rollup/Vite) statik tahlil orqali qaysi import/export ishlatilganini aniqlaydi va faqat keraklilarini qoldiradi. Ishlash sharti: 1) ES Modules (import/export) — CJS da ishlamaydi. 2) Side effects yo\'q — package.json da "sideEffects": false. 3) Production mode. Barrel file (index.js dan re-export) ba\'zan tree shaking ga to\'sqinlik qiladi — to\'g\'ridan-to\'g\'ri import qilish afzal.',
    },
    {
      question: 'Dynamic import() nima va qachon ishlatiladi?',
      answer: 'import() — runtime da modulni asinxron yuklaydigan funksiya, Promise qaytaradi. Ishlatilish holatlari: 1) Lazy loading — og\'ir modullarni kerak bo\'lganda yuklash (dastlabki bundle hajmini kamaytirish). 2) Code splitting — bundler har bir dynamic import uchun alohida chunk yaratadi. 3) Route-based splitting — har bir sahifa alohida bundle (React.lazy). 4) Shartli yuklash — faqat ma\'lum sharoitda kerakli modulni import qilish. 5) A/B testing — turli versiyalarni dinamik yuklash.',
    },
    {
      question: 'Named va default export ning farqi va qaysi biri yaxshi?',
      answer: 'Named export: bir fayldan bir nechta, import paytida aniq nom kerak ({name}), IDE autocomplete va refactoring yaxshi ishlaydi. Default export: faylda bitta, import paytida ixtiyoriy nom berish mumkin, asosiy eksport uchun mo\'ljallangan. Yaxshi amaliyot: kutubxona utility funksiyalari — named export (import {useState} from "react"). Komponent yoki class — default export (export default App). Lekin ba\'zi jamollar (Google, Airbnb) faqat named export ishlatishni tavsiya qiladi — nomlar izchil, refactoring oson.',
    },
    {
      question: 'Circular dependency nima va qanday hal qilinadi?',
      answer: 'Circular dependency — A modul B ni, B modul A ni import qilishi. CJS da: require() sinxron, shuning uchun A hali to\'liq yuklanmagan holda B ga uzatiladi (partial export) — kutilmagan undefined qiymatlar. ESM da: live bindings tufayli ko\'pincha ishlaydi, lekin hoisted bo\'lmagan qiymatlar (let/const, class) TDZ xatosi beradi. Hal qilish: 1) Umumiy kodni uchinchi modulga chiqarish. 2) Dependency Injection. 3) Lazy evaluation — funksiya ichida import qilish. Eng yaxshisi — arxitekturani qayta ko\'rib chiqish.',
    },
    {
      question: 'ESM da __dirname va __filename qanday olinadi?',
      answer: 'ES Modules da __dirname va __filename mavjud emas — ular CJS ga xos global o\'zgaruvchilar. ESM da import.meta.url ishlatiladi — bu joriy fayl URL ini beradi (file:///path/to/file.mjs). Fayl yo\'lini olish uchun: import { fileURLToPath } from "url"; const __filename = fileURLToPath(import.meta.url); import { dirname } from "path"; const __dirname = dirname(__filename). Node.js 21.2+ da import.meta.dirname va import.meta.filename to\'g\'ridan-to\'g\'ri mavjud.',
    },
  ],
}
