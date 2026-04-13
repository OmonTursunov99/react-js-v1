import type { Topic } from '../../../types'

export const scopeHoisting: Topic = {
  id: 'scope-hoisting',
  title: 'Scope va Hoisting',
  importance: 3,
  status: 'to-learn',
  description: 'Lexical scope, function scope, block scope, hoisting mexanizmi',
  content: `Scope (ko'rinish sohasi) va Hoisting (ko'tarish) — JavaScript ning eng asosiy tushunchalaridan. Intervyuda deyarli DOIM so'raladi.

═══════════════════════════════════════
  SCOPE NIMA?
═══════════════════════════════════════

Scope — o'zgaruvchining "ko'rinadigan" hududi. Ya'ni qayerdan murojaat qilish mumkin.

JavaScript da 3 xil scope bor:
1. Global Scope — hamma joydan ko'rinadi
2. Function Scope — faqat funksiya ichida ko'rinadi
3. Block Scope — faqat {} ichida ko'rinadi (let/const)

═══════════════════════════════════════
  GLOBAL SCOPE
═══════════════════════════════════════

Funksiya yoki block tashqarisida e'lon qilingan o'zgaruvchilar global:

  var globalVar = 'global'    // window.globalVar (browser da)
  let globalLet = 'global'    // window ga qo'shilMAYDI
  const globalConst = 'global' // window ga qo'shilMAYDI

Global o'zgaruvchilar — YOMON AMALIYOT:
- Nomlar to'qnashishi (name collision)
- Debugging qiyin
- Memory leak xavfi
- Module pattern yoki ES modules orqali oldini olish

═══════════════════════════════════════
  FUNCTION SCOPE
═══════════════════════════════════════

var — function scope ga ega. Funksiya ichidagi var tashqaridan ko'rinMAYDI:

  function example() {
    var x = 10
    if (true) {
      var y = 20  // var — function scope, block emas!
    }
    console.log(x) // 10
    console.log(y) // 20 — if dan tashqarida ham ko'rinadi!
  }
  console.log(x) // ReferenceError — funksiya tashqarisida ko'rinmaydi

═══════════════════════════════════════
  BLOCK SCOPE
═══════════════════════════════════════

let va const — block scope ga ega. {} ichida cheklangan:

  if (true) {
    let x = 10
    const y = 20
  }
  console.log(x) // ReferenceError
  console.log(y) // ReferenceError

Block scope qayerlarda ishlaydi:
  - if/else
  - for/while
  - switch
  - try/catch
  - Oddiy {} (bare block)

═══════════════════════════════════════
  LEXICAL SCOPE (STATIK SCOPE)
═══════════════════════════════════════

JavaScript LEXICAL scope ishlatadi — scope KOD YOZILGAN JOYIGA bog'liq, CHAQIRILGAN joyiga EMAS.

  const name = 'Global'

  function outer() {
    const name = 'Outer'

    function inner() {
      console.log(name) // 'Outer' — leksik scope
    }

    return inner
  }

  const fn = outer()
  fn() // 'Outer' — chaqirilgan joyda 'Global' emas, YOZILGAN joydagi 'Outer'

Bu CLOSURE ning asosi — funksiya o'zi yaratilgan scope ni "eslab qoladi".

═══════════════════════════════════════
  SCOPE CHAIN (SCOPE ZANJIRI)
═══════════════════════════════════════

O'zgaruvchi topilmasa, JavaScript tashqi scope ga qaraydi — oxirigacha:

  const a = 'global'

  function outer() {
    const b = 'outer'

    function inner() {
      const c = 'inner'
      console.log(c) // 'inner' — o'z scope da topildi
      console.log(b) // 'outer' — tashqi scope da topildi
      console.log(a) // 'global' — global scope da topildi
      console.log(d) // ReferenceError — hech qayerda yo'q
    }
    inner()
  }

Scope chain: inner → outer → global → ReferenceError

MUHIM: Scope chain FAQAT TASHQARIGA qaraydi, ICHKARIGA EMAS:
  function parent() {
    function child() { const secret = 'maxfiy' }
    console.log(secret) // ReferenceError — child scope ko'rinmaydi
  }

═══════════════════════════════════════
  HOISTING (KO'TARISH)
═══════════════════════════════════════

JavaScript engine kodni bajarishdan OLDIN e'lonlarni scope ning YUQORISIGA "ko'taradi".

Aslida fizik ko'tarish bo'lmaydi — Creation Phase da xotiraga joylanadi.

  // var — undefined bilan hoisting
  console.log(x) // undefined
  var x = 10

  // let/const — TDZ (Temporal Dead Zone)
  console.log(y) // ReferenceError
  let y = 20

  // function declaration — TO'LIQ hoisting
  greet() // 'Salom!'
  function greet() { console.log('Salom!') }

  // function expression — o'zgaruvchi hoisting
  hello() // TypeError: hello is not a function
  var hello = function() { console.log('Hello!') }
  // var hello = undefined ← hoisting
  // hello() ← undefined ni chaqirish — TypeError

  // class — hoisting BO'LMAYDI (TDZ)
  const p = new Person() // ReferenceError
  class Person {}

═══════════════════════════════════════
  HOISTING TARTIBI
═══════════════════════════════════════

Bir scope ichida bir xil nomli o'zgaruvchi va funksiya bo'lsa:
1. Function declaration BIRINCHI hoisting bo'ladi
2. var e'lonlari function ni QAYTA YOZMAYDI (agar tayinlash bo'lmasa)

  console.log(foo) // function foo
  var foo = 'string'
  function foo() { return 'function' }
  console.log(foo) // 'string' — tayinlash bajarildi`,
  codeExamples: [
    {
      title: 'Scope turlari — amaliy misollar',
      language: 'js',
      code: `// === GLOBAL SCOPE ===
var globalVar = 'men global'
let globalLet = 'men ham global, lekin window da emasman'

// Browser da:
// console.log(window.globalVar) // 'men global'
// console.log(window.globalLet) // undefined

// === FUNCTION SCOPE ===
function demo() {
  var funcVar = 'faqat funksiya ichida'

  if (true) {
    var blockVar = 'var block scope EMAS!'
    let blockLet = 'let block scope'
    const blockConst = 'const ham block scope'
  }

  console.log(funcVar)   // 'faqat funksiya ichida'
  console.log(blockVar)  // 'var block scope EMAS!' — ko'rinadi!
  // console.log(blockLet) // ReferenceError
  // console.log(blockConst) // ReferenceError
}

// console.log(funcVar) // ReferenceError — tashqarida ko'rinmaydi

// === BLOCK SCOPE ===
{
  let x = 1
  const y = 2
  var z = 3  // var block scope EMAS!
}
// console.log(x) // ReferenceError
// console.log(y) // ReferenceError
console.log(z)    // 3 — var ko'rinadi!

// for loop scope
for (let i = 0; i < 3; i++) {
  // i faqat shu block ichida
}
// console.log(i) // ReferenceError — let block scope

for (var j = 0; j < 3; j++) {
  // j function/global scope da
}
console.log(j) // 3 — var ko'rinadi!`,
      description: 'var — function scope, let/const — block scope. Bu farq ko\'plab buglarning sababi.',
    },
    {
      title: 'Lexical scope va scope chain',
      language: 'js',
      code: `// Lexical scope — KOD YOZILGAN JOYGA bog'liq
const language = 'Uzbek'

function outer() {
  const language = 'English'

  function middle() {
    const greeting = 'Hello'

    function inner() {
      // Scope chain: inner → middle → outer → global
      console.log(greeting)  // 'Hello' (middle dan)
      console.log(language)  // 'English' (outer dan)
      // Agar outer da bo'lmasa, global dan topiladi
    }

    inner()
  }

  middle()
}

outer()

// MUHIM: scope YOZILGAN joyga bog'liq, CHAQIRILGAN joyga EMAS
function createGreeter() {
  const name = 'Ali'
  return function() {
    console.log('Salom, ' + name)
  }
}

const greet = createGreeter()
// greet funksiyasi createGreeter ichida YARATILGAN
// shuning uchun name = 'Ali' ga murojaat qila oladi
greet() // 'Salom, Ali'

// Boshqa joyda chaqirilsa ham, YOZILGAN joydagi scope ishlatiladi
const name = 'Vali'
greet() // 'Salom, Ali' — global name ga QARAMAYDI`,
      description: 'Lexical scope — funksiya o\'zi YARATILGAN scope ni eslab qoladi. Bu closure ning asosi.',
    },
    {
      title: 'Hoisting — barcha turlar',
      language: 'js',
      code: `// 1. var hoisting — undefined
console.log(a) // undefined
var a = 10
console.log(a) // 10

// 2. let/const hoisting — TDZ
// console.log(b) // ReferenceError: Cannot access 'b' before initialization
let b = 20

// 3. Function Declaration — TO'LIQ hoisting
hello() // 'Salom!'
function hello() {
  console.log('Salom!')
}

// 4. Function Expression — O'ZGARUVCHI hoisting
// bye() // TypeError: bye is not a function
var bye = function() {
  console.log('Xayr!')
}

// 5. Arrow Function — let/const bilan TDZ
// greet() // ReferenceError
const greet = () => console.log('Hi!')

// 6. class — TDZ (hoisting bo'lmaydi)
// const p = new Person() // ReferenceError
class Person {
  constructor(name) { this.name = name }
}

// MURAKKAB MISOL — intervyu savoli
var x = 1
function foo() {
  console.log(x)  // undefined — var x ichki scope da hoisting
  var x = 2
  console.log(x)  // 2
}
foo()
// Nega undefined? Chunki foo ichida var x bor — hoisting:
// function foo() {
//   var x = undefined  ← hoisting
//   console.log(x)     ← undefined
//   x = 2
//   console.log(x)     ← 2
// }`,
      description: 'Hoisting turli e\'lon turlari uchun farq qiladi. var — undefined, let/const — TDZ, function — to\'liq.',
    },
  ],
  interviewQA: [
    {
      question: 'Scope nima? JavaScript da qanday scope turlari bor?',
      answer: `Scope — o'zgaruvchining ko'rinadigan hududi. 3 xil scope bor: 1) Global — hamma joydan murojaat qilish mumkin. var window ga qo'shiladi, let/const qo'shilmaydi. 2) Function — funksiya ichida cheklangan. var function scope ga ega. 3) Block — {} ichida cheklangan. let va const block scope ga ega. JavaScript lexical (statik) scope ishlatadi — scope kod YOZILGAN joyga bog'liq, chaqirilgan joyga emas. Scope chain — o'zgaruvchi topilmasa tashqi scope ga qaraladi, global gacha boradi.`,
    },
    {
      question: 'Lexical scope va dynamic scope farqi nima?',
      answer: `Lexical (statik) scope — JavaScript ishlatadi. O'zgaruvchi qidiruvi kod YOZILGAN joydagi scope chain bo'yicha amalga oshadi. Funksiya qaerda chaqirilganiga BOG'LIQ EMAS. Dynamic scope — ba'zi tillar ishlatadi (Bash, ba'zi Lisp dialektlari). O'zgaruvchi qidiruvi funksiya CHAQIRILGAN joydagi scope chain bo'yicha amalga oshadi. JavaScript da this mexanizmi dynamic scope ga O'XSHAYDI (chaqiruv joyiga bog'liq), lekin aslida bu scope emas — execution context. Arrow function this ni leksik oladi.`,
    },
    {
      question: `Hoisting nima? Aslida nima sodir bo'ladi?`,
      answer: `Hoisting — e'lonlarning scope yuqorisiga "ko'tarilishi". Aslida fizik ko'tarish YO'Q — bu JavaScript engine ning ikki bosqichli ishlashi: 1) Creation Phase — engine kodni skanerlaydi, var e'lonlarini undefined bilan, function declaration larni to'liq, let/const ni TDZ bilan xotiraga joylashtiradi. 2) Execution Phase — kod qatorma-qator bajariladi, tayinlashlar amalga oshadi. var — undefined bilan hoisting (murojaat qilsa xato emas, undefined). let/const — hoisting bor lekin TDZ da (murojaat qilsa ReferenceError). Function declaration — to'liq hoisting (chaqirish mumkin). Function expression — faqat o'zgaruvchi hoisting. Class — TDZ.`,
    },
    {
      question: 'Scope chain qanday ishlaydi? Misol bering.',
      answer: `O'zgaruvchi ishlatilganda JS engine avval HOZIRGI scope da qidiradi. Topilmasa — tashqi scope ga chiqadi. Bu tashqi scope dan ham topilmasa — yana tashqi scope ga. Oxirida global scope ga yetadi. Topilmasa — ReferenceError. Bu zanjir kod YOZILGAN paytda aniqlanadi (lexical). Misol: function outer() { const x = 1; function inner() { console.log(x) } inner() } — inner da x yo'q → outer da x = 1 topildi. MUHIM: scope chain faqat TASHQARIGA qaraydi, ichki scope larga QARAMAYDI. Parent scope child scope ni ko'ra olmaydi.`,
    },
    {
      question: 'Bu kod nima natija beradi va nima uchun: var x = 1; function foo() { console.log(x); var x = 2; } foo()',
      answer: `Natija: undefined. Sababi: foo ichida var x bor — bu function scope da hoisting bo'ladi. Engine foo ni shu ko'rinishda ko'radi: function foo() { var x = undefined; console.log(x); x = 2; }. Ya'ni console.log paytida x hali undefined. Tashqi x = 1 ga QARAMAYDI, chunki ichki scope da x bor (hoisting). Agar foo ichida var x bo'lmasa — scope chain bo'yicha tashqi x = 1 topiladi va 1 chiqadi. Bu hoisting va scope chain ning birgalikdagi ta'siri. let/const bilan bu xato bo'lardi — TDZ tufayli ReferenceError.`,
    },
  ],
  relatedTopics: [
    { techId: 'javascript', sectionId: 'fundamentals', topicId: 'variables', label: 'var / let / const' },
    { techId: 'javascript', sectionId: 'functions-closures', topicId: 'closures', label: 'Closures' },
    { techId: 'javascript', sectionId: 'functions-closures', topicId: 'execution-context', label: 'Execution Context' },
  ],
}
