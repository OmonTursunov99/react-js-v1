import type { Topic } from '../../../types'

export const strictMode: Topic = {
  id: 'strict-mode',
  title: 'Strict Mode',
  importance: 2,
  status: 'to-learn',
  description: '"use strict" — qat\'iy rejim, farqlari va qachon ishlatilishi',
  content: `"use strict" — JavaScript ning qat'iy rejimi. Xatolarga moyil bo'lgan kodlarni aniqlash va oldini olish uchun ES5 da kiritilgan.

═══════════════════════════════════════
  YOQISH USULLARI
═══════════════════════════════════════

1. Butun fayl uchun — faylning BOSHIDA:
  'use strict'
  // butun fayl strict mode da

2. Faqat funksiya uchun — funksiya BOSHIDA:
  function strict() {
    'use strict'
    // faqat shu funksiya strict mode da
  }

3. ES Modules — avtomatik strict mode:
  // .mjs fayl yoki type="module"
  // 'use strict' yozish shart emas — DOIM strict

4. class body — avtomatik strict mode:
  class MyClass {
    // class ichidagi barcha kod strict mode da
  }

═══════════════════════════════════════
  STRICT MODE NING FARQLARI
═══════════════════════════════════════

1. E'LON QILINMAGAN O'ZGARUVCHIGA TAYINLASH — XATO:

  // Oddiy rejim:
  x = 10  // global o'zgaruvchi yaratiladi (XAVFLI!)

  // Strict mode:
  'use strict'
  x = 10  // ReferenceError: x is not defined

2. O'CHIRIB BO'LMAYDIGAN NARSALARNI O'CHIRISH — XATO:

  'use strict'
  delete Object.prototype  // TypeError
  var x = 10
  delete x  // SyntaxError

3. DUBLIKAT PARAMETR NOMLARI — XATO:

  // Oddiy rejim:
  function sum(a, a) { return a + a } // xato yo'q
  sum(1, 2) // 4 (ikkinchi a = 2)

  // Strict mode:
  function sum(a, a) {} // SyntaxError: Duplicate parameter name

4. OCTAL LITERAL — XATO:

  // Oddiy rejim:
  var x = 010 // 8 (octal)

  // Strict mode:
  var x = 010 // SyntaxError
  var x = 0o10 // TO'G'RI usul (ES6)

5. WRITABLE: FALSE GA YOZISH — XATO:

  'use strict'
  const obj = {}
  Object.defineProperty(obj, 'x', { value: 1, writable: false })
  obj.x = 2 // TypeError (oddiy rejimda jimgina o'tib ketadi)

6. GETTER-ONLY PROPERTY GA YOZISH — XATO:

  'use strict'
  const obj = { get x() { return 1 } }
  obj.x = 2 // TypeError

7. NON-EXTENSIBLE OBJECT GA PROPERTY QO'SHISH — XATO:

  'use strict'
  const obj = Object.preventExtensions({})
  obj.newProp = 1 // TypeError

8. this — GLOBAL DA undefined:

  // Oddiy rejim:
  function show() { console.log(this) } // window
  show()

  // Strict mode:
  'use strict'
  function show() { console.log(this) } // undefined
  show()

  Bu MUHIM — call/apply da null/undefined berilsa, this null/undefined bo'ladi
  (oddiy rejimda window ga almashtirilardi)

9. with STATEMENT — TAQIQLANGAN:

  'use strict'
  with (obj) {} // SyntaxError

10. eval O'Z SCOPE YARATADI:

  'use strict'
  eval('var x = 10')
  console.log(x) // ReferenceError — x eval scope da qoldi

═══════════════════════════════════════
  QACHON ISHLATISH KERAK
═══════════════════════════════════════

Zamonaviy loyihalarda strict mode deyarli DOIM faol:
- ES Modules (import/export) — avtomatik strict
- class body — avtomatik strict
- Webpack/Vite/Rollup — modul sifatida ishlov beradi
- TypeScript — compiled output strict mode da
- Babel — odatda strict mode qo'shadi

Qo'lda yozish kerak bo'lgan holat:
- Eski loyihada (script tag, CommonJS)
- Node.js da .js fayl (module bo'lmasa)

═══════════════════════════════════════
  NIMA UCHUN KERAK?
═══════════════════════════════════════

1. Xavfli kodlarni erta aniqlaydi (typo → global o'zgaruvchi)
2. Optimizatsiya uchun — engine strict kodda ko'proq optimallashtirish qiladi
3. Kelajak uchun — yangi kalit so'zlar (let, class) zaxiralanadi
4. Xavfsizroq — eval va arguments cheklangan
5. Aniqroq — this undefined (kutilmagan global this yo'q)`,
  codeExamples: [
    {
      title: 'Strict mode — asosiy farqlar',
      language: 'js',
      code: `'use strict'

// 1. E'lon qilinmagan o'zgaruvchi — XATO
// x = 10 // ReferenceError: x is not defined
let x = 10 // TO'G'RI

// 2. Object ning o'chirib bo'lmaydigan property sini o'chirish
// delete Object.prototype // TypeError

// 3. this — undefined (window emas)
function showThis() {
  console.log(this) // undefined
}
showThis()

// Arrow function hech qachon o'z this ga ega emas:
const arrowThis = () => {
  console.log(this) // tashqi scope this
}

// 4. Dublikat property — xato emas (ES6 dan beri)
// Lekin dublikat PARAMETR — xato:
// function dup(a, a) {} // SyntaxError

// 5. arguments va parametr aloqasi uziladi
function test(a) {
  a = 100
  console.log(arguments[0]) // strict: original qiymat
  // non-strict: 100 (arguments va parametr bog'langan edi)
}
test(1)

// 6. Reserved words — o'zgaruvchi nomi sifatida ISHLATIB BO'LMAYDI
// let implements, interface, package, private, protected, public, static
// Bu kalit so'zlar kelajakdagi JS versiyalari uchun zaxiralangan`,
      description: 'Strict mode kodni xavfsiz va predictable qiladi. Zamonaviy loyihalarda deyarli doim faol.',
    },
    {
      title: 'this — strict vs non-strict',
      language: 'js',
      code: `// NON-STRICT MODE
function nonStrictThis() {
  console.log(this) // window (browser) / global (Node)
}
nonStrictThis()

// STRICT MODE
function strictThis() {
  'use strict'
  console.log(this) // undefined
}
strictThis()

// call/apply bilan farq:
function showThis() {
  'use strict'
  console.log(this)
}

showThis.call(null)      // strict: null (oddiy: window)
showThis.call(undefined) // strict: undefined (oddiy: window)
showThis.call(42)        // strict: 42 (oddiy: Number {42} — wrapper)

// Amaliy ta'siri:
function Person(name) {
  'use strict'
  this.name = name // new bo'lmasa TypeError!
}
// Person('Ali') // TypeError: Cannot set properties of undefined
const p = new Person('Ali') // TO'G'RI

// Non-strict da:
// Person('Ali') → window.name = 'Ali' — XAVFLI!`,
      description: 'Strict mode da this undefined bo\'ladi — kutilmagan global object ga yozishning oldini oladi.',
    },
    {
      title: 'Zamonaviy loyihada strict mode',
      language: 'js',
      code: `// === ES Modules — AVTOMATIK strict ===
// module.mjs (yoki package.json: "type": "module")
export function greet(name) {
  // 'use strict' yozish shart emas!
  // x = 10 // ReferenceError — strict mode faol
  const x = 10
  return 'Salom, ' + name
}

// === Class — AVTOMATIK strict ===
class User {
  constructor(name) {
    // Class body strict mode da
    this.name = name
  }

  greet() {
    // Bu ham strict
    return 'Salom, ' + this.name
  }
}

// === Vite/Webpack loyiha — barcha fayllar module ===
// React/Vue/Angular loyihalarida
// import/export ishlatiladi = ES Module = strict mode
import { useState } from 'react'

// TypeScript — compiled output strict mode da
// tsconfig.json: "strict": true
// Compile natijasi: "use strict"; qo'shiladi

// === Node.js ===
// package.json: "type": "module" — strict mode
// yoki .mjs extension
// CommonJS (.cjs, .js) — strict emas, qo'lda yozish kerak`,
      description: 'Zamonaviy loyihalarda strict mode avtomatik faol — ES Modules, class body, va build tool lar orqali.',
    },
  ],
  interviewQA: [
    {
      question: '"use strict" nima qiladi? Asosiy farqlarini ayting.',
      answer: `"use strict" JavaScript ning qat'iy rejimini yoqadi. Asosiy farqlar: 1) E'lon qilinmagan o'zgaruvchiga tayinlash — ReferenceError (oddiy: global yaratiladi). 2) Dublikat parametr nomlari — SyntaxError. 3) Ochiral olmaydigan property ni delete — TypeError. 4) this global funksiyada undefined (oddiy: window). 5) with statement taqiqlangan. 6) eval o'z scope yaratadi. 7) Octal literal (010) taqiqlangan. 8) Writable:false ga yozish — TypeError (oddiy: jimgina o'tib ketadi).`,
    },
    {
      question: 'Strict mode qachon avtomatik yoqiladi?',
      answer: `3 holatda avtomatik strict mode: 1) ES Modules — import/export ishlatilgan fayl doim strict (browser da <script type="module">, Node da "type": "module" yoki .mjs). 2) class body — class ichidagi barcha kod strict mode da. 3) Build toollar natijasida — Vite, Webpack modul sifatida ishlov beradi, TypeScript "use strict" qo'shadi. Shuning uchun zamonaviy React/Vue/Angular loyihalarida qo'lda "use strict" yozish SHART EMAS — avtomatik faol.`,
    },
    {
      question: 'Strict mode da this qanday o\'zgaradi?',
      answer: `Oddiy rejimda: funksiya oddiy chaqirilsa this = global object (window/global). null/undefined call/apply ga berilsa — this = global object. Primitiv berilsa — wrapper object yaratiladi (42 → Number{42}). Strict mode da: oddiy chaqiruvda this = undefined. call/apply ga null berilsa — this = null. undefined berilsa — this = undefined. Primitiv berilsa — SHU QIYMAT (wrapper yo'q). Bu muhim chunki: new siz constructor chaqirilsa, strict da TypeError beradi (this = undefined), oddiy da esa global ga yozib yuboradi (xavfli bug).`,
    },
  ],
  relatedTopics: [
    { techId: 'javascript', sectionId: 'fundamentals', topicId: 'scope-hoisting', label: 'Scope va Hoisting' },
    { techId: 'javascript', sectionId: 'objects-prototypes', topicId: 'this-keyword', label: 'this kalit so\'zi' },
    { techId: 'javascript', sectionId: 'functions-closures', topicId: 'execution-context', label: 'Execution Context' },
  ],
}
