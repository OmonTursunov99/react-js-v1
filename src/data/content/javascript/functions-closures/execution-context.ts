import type { Topic } from '../../../types'

export const executionContext: Topic = {
  id: 'execution-context',
  title: 'Execution Context',
  importance: 3,
  status: 'to-learn',
  description: 'Creation phase, execution phase, global/function/eval context',
  content: `Execution Context (bajarilish konteksti) — JavaScript engine ning kodni bajarish muhiti. Har bir kod bo'lagi o'z kontekstida ishlaydi.

═══════════════════════════════════════
  EXECUTION CONTEXT TURLARI
═══════════════════════════════════════

1. GLOBAL Execution Context (GEC):
   - Dastur boshlanishida avtomatik yaratiladi
   - Faqat BITTA global context bo'ladi
   - window (browser) yoki global (Node.js) obyektini yaratadi
   - this = global object (non-strict mode da)

2. FUNCTION Execution Context (FEC):
   - Har bir funksiya CHAQIRILGANDA yangi context yaratiladi
   - Har bir chaqiruv uchun ALOHIDA context
   - O'z scope, o'z this, o'z arguments ga ega

3. EVAL Execution Context:
   - eval() chaqirilganda yaratiladi
   - Amalda deyarli ISHLATILMAYDI (xavfli, sekin)

═══════════════════════════════════════
  EXECUTION CONTEXT TARKIBI
═══════════════════════════════════════

Har bir execution context 3 qismdan iborat:

1. Variable Environment (VE):
   - var e'lonlari
   - function declaration lar
   - arguments object (funksiya uchun)

2. Lexical Environment (LE):
   - let/const e'lonlari
   - Tashqi scope ga havola (outer reference)
   - Block scope uchun yangi LE yaratiladi

3. this Binding:
   - this ning qiymati aniqlanadi
   - Global: window (non-strict) yoki undefined (strict)
   - Function: chaqiruv usuliga bog'liq

═══════════════════════════════════════
  IKKI BOSQICHLI BAJARILISH
═══════════════════════════════════════

Har bir execution context ikki bosqichda yaratiladi:

BOSQICH 1: CREATION PHASE (yaratish)
  1. Variable Environment yaratiladi:
     - var e'lonlari topiladi → undefined bilan saqlanadi
     - function declaration lar topiladi → to'liq xotiraga ko'chiriladi
  2. Lexical Environment yaratiladi:
     - let/const e'lonlari topiladi → TDZ da saqlanadi
     - Tashqi scope aniqlashadi (outer reference)
  3. this aniqlanadi:
     - Global context: this = window
     - Function context: chaqiruv usuliga qarab

BOSQICH 2: EXECUTION PHASE (bajarish)
  1. Kod QATORMA-QATOR bajariladi
  2. O'zgaruvchilarga qiymat TAYINLANADI
  3. Funksiyalar CHAQIRILADI (yangi context yaratiladi)
  4. Return yoki tugaganda context YO'Q QILINADI

═══════════════════════════════════════
  MISOL — BOSQICHMA-BOSQICH
═══════════════════════════════════════

  var x = 10
  let y = 20
  function add(a, b) {
    var result = a + b
    return result
  }
  var sum = add(x, y)

Creation Phase (Global):
  VE: { x: undefined, sum: undefined, add: <function> }
  LE: { y: <TDZ> }
  this: window

Execution Phase (Global):
  x = 10
  y = 20
  sum = add(10, 20) → YANGI context yaratiladi

Creation Phase (add funksiyasi):
  VE: { result: undefined, arguments: {0: 10, 1: 20} }
  LE: { a: 10, b: 20 }
  this: window (non-strict)

Execution Phase (add funksiyasi):
  result = 10 + 20 = 30
  return 30 → context YO'Q QILINADI

Qaytib Global Execution Phase:
  sum = 30

═══════════════════════════════════════
  OUTER REFERENCE (SCOPE CHAIN)
═══════════════════════════════════════

Har bir Lexical Environment tashqi scope ga havola saqlaydi:

  function outer() {
    const x = 10
    function inner() {
      console.log(x) // outer ning LE sidan topiladi
    }
    inner()
  }

inner ning LE → outer ning LE → Global LE → null

Bu LEXICAL SCOPE — funksiya qayerda YARATILGAN bo'lsa, shu joydagi
scope chain ishlatiladi. Qayerda CHAQIRILGANIGA BOG'LIQ EMAS.

═══════════════════════════════════════
  EXECUTION CONTEXT va CLOSURE
═══════════════════════════════════════

Closure — funksiya tashqi scope ga havola SAQLAB QOLISHI:

  function createCounter() {
    let count = 0
    return function() {
      count++
      return count
    }
  }

createCounter() chaqirilganda:
  1. Function context yaratiladi
  2. count = 0 saqlanadi
  3. Ichki funksiya qaytariladi
  4. createCounter contexti TUGAYDI...
  5. LEKIN ichki funksiya outer reference orqali count ga havola saqlaydi
  6. Garbage collector count ni YOQMAYDI — chunki havola bor

Bu closures ning mexanizmi — execution context yo'q qilinsa ham,
lexical environment (scope) saqlanib qoladi.`,
  codeExamples: [
    {
      title: 'Execution Context bosqichlari — vizual',
      language: 'js',
      code: `// === KOD ===
var name = 'Ali'
let age = 25

function greet(greeting) {
  var message = greeting + ', ' + name
  console.log(message)
  return message
}

var result = greet('Salom')

// === CREATION PHASE (Global) ===
// Variable Environment:
//   name: undefined
//   greet: <function reference>
//   result: undefined
//
// Lexical Environment:
//   age: <uninitialized> (TDZ)
//
// this: window

// === EXECUTION PHASE (Global) ===
// name = 'Ali'
// age = 25
// result = greet('Salom') → YANGI CONTEXT

// === CREATION PHASE (greet funksiyasi) ===
// Variable Environment:
//   message: undefined
//   arguments: { 0: 'Salom', length: 1 }
//
// Lexical Environment:
//   greeting: 'Salom'
//   outer: → Global Lexical Environment
//
// this: window (non-strict)

// === EXECUTION PHASE (greet) ===
// message = 'Salom' + ', ' + 'Ali' = 'Salom, Ali'
// console.log('Salom, Ali')
// return 'Salom, Ali'
// → greet context YO'Q QILINADI

// === Qaytib Global ===
// result = 'Salom, Ali'`,
      description: 'Har bir funksiya chaqiruvi yangi execution context yaratadi. Creation va execution bosqichlari ketma-ket ishlaydi.',
    },
    {
      title: 'Ichma-ich context lar — scope chain',
      language: 'js',
      code: `const globalVar = 'Global'

function outer() {
  const outerVar = 'Outer'

  function middle() {
    const middleVar = 'Middle'

    function inner() {
      const innerVar = 'Inner'

      // Scope chain: inner → middle → outer → global
      console.log(innerVar)   // 'Inner'   — o'z scope
      console.log(middleVar)  // 'Middle'  — 1 ta tashqari
      console.log(outerVar)   // 'Outer'   — 2 ta tashqari
      console.log(globalVar)  // 'Global'  — 3 ta tashqari
    }

    inner()
    // inner context yo'q qilinadi
  }

  middle()
  // middle context yo'q qilinadi
}

outer()
// outer context yo'q qilinadi

// Har bir funksiya chaqiruvi:
// 1. Yangi Execution Context yaratiladi
// 2. Call Stack ga qo'yiladi
// 3. Bajariladi
// 4. Call Stack dan olinadi va yo'q qilinadi
// 5. Oldingi context davom etadi

// CONTEXT TURI:
// Global EC  → doim mavjud (dastur tugaguncha)
// outer EC   → outer() chaqirilganda yaratiladi, tugaganda yo'q
// middle EC  → middle() chaqirilganda yaratiladi, tugaganda yo'q
// inner EC   → inner() chaqirilganda yaratiladi, tugaganda yo'q`,
      description: 'Ichma-ich funksiyalar zanjir hosil qiladi. Har bir context tashqi scope ga outer reference saqlaydi.',
    },
    {
      title: 'this binding — context da',
      language: 'js',
      code: `// === this BINDING TURLARI ===

// 1. Global context
console.log(this) // window (browser), globalThis (Node)

// 2. Function context — oddiy chaqiruv
function showThis() {
  console.log(this)
}
showThis() // window (non-strict), undefined (strict)

// 3. Method context — object.method()
const user = {
  name: 'Ali',
  greet() {
    console.log(this.name) // 'Ali' — this = user
  }
}
user.greet()

// 4. new bilan — yangi object
function Person(name) {
  // this = {} (yangi bo'sh object)
  this.name = name
  // return this (implicit)
}
const p = new Person('Ali') // this = yangi Person object

// 5. Explicit — call/apply/bind
function greet() {
  console.log('Salom, ' + this.name)
}
greet.call({ name: 'Ali' })    // 'Salom, Ali'
greet.apply({ name: 'Vali' })  // 'Salom, Vali'
const bound = greet.bind({ name: 'Gani' })
bound()                         // 'Salom, Gani'

// 6. Arrow function — LEKSIK this
const obj = {
  name: 'Ali',
  greet: () => {
    console.log(this.name) // undefined — tashqi scope this
  },
  greetCorrect() {
    const inner = () => {
      console.log(this.name) // 'Ali' — method ning this ni oladi
    }
    inner()
  }
}`,
      description: 'this binding execution context yaratilishida aniqlanadi. Arrow function istisno — leksik this.',
    },
  ],
  interviewQA: [
    {
      question: 'Execution Context nima? Qanday tarkibdan iborat?',
      answer: `Execution Context — JavaScript engine kodni bajarish muhiti. Har bir funksiya chaqiruvi yangi EC yaratadi. 3 ta turi bor: Global (dastur boshida 1 ta), Function (har chaqiruvda yangi), Eval (kamdan-kam). Tarkibi: 1) Variable Environment — var e'lonlari va function declaration lar. 2) Lexical Environment — let/const e'lonlari va tashqi scope ga outer reference. 3) this Binding — this ning qiymati. EC ikki bosqichda yaratiladi: Creation Phase (e'lonlar xotiraga) va Execution Phase (kod bajariladi).`,
    },
    {
      question: 'Creation Phase va Execution Phase nima? Misol bering.',
      answer: `Creation Phase — engine kodni skanerlaydi: var → undefined bilan saqlaydi, function declaration → to'liq saqlaydi, let/const → TDZ da saqlaydi, this aniqlanadi, tashqi scope bog'lanadi. Execution Phase — kod qatorma-qator bajariladi, o'zgaruvchilarga qiymat tayinlanadi. Misol: var x = 10; function add(a) { var r = a + x; return r }; var s = add(5). Creation: x=undefined, add=<fn>, s=undefined. Execution: x=10, s=add(5) → yangi EC yaratiladi: Creation (r=undefined, a=5), Execution (r=15, return 15), s=15.`,
    },
    {
      question: 'Variable Environment va Lexical Environment farqi nima?',
      answer: `Variable Environment (VE) — var e'lonlari va function declaration lar saqlanadi. Creation phase da var undefined bo'ladi, function to'liq saqlanadi. Lexical Environment (LE) — let/const e'lonlari saqlanadi, tashqi scope ga outer reference bor. let/const TDZ da bo'ladi — murojaat qilsa ReferenceError. Block scope ({}) uchun yangi LE yaratiladi (VE emas). Amaldagi farq: for loop da let ishlatilsa har iteratsiyada yangi LE yaratiladi, var uchun esa VE bir xil qoladi. Bu closure bilan setTimeout muammosining sababi.`,
    },
    {
      question: 'Closure execution context bilan qanday bog\'liq?',
      answer: `Funksiya yaratilganda u o'zi yaratilgan Lexical Environment ga outer reference saqlaydi. Funksiya qaytarilsa va tashqarida chaqirilsa — tashqi funksiya EC allaqachon yo'q qilingan. LEKIN qaytarilgan funksiya outer reference orqali tashqi LE ga hali ham murojaat qila oladi. Garbage collector bu LE ni yo'qmaydi — chunki havola bor. Bu CLOSURE. Misol: function counter() { let c = 0; return () => ++c }. counter() tugagandan keyin ham qaytarilgan funksiya c ga murojaat qiladi — LE saqlanib qoladi.`,
    },
    {
      question: 'Global Execution Context ning xususiyatlari nima?',
      answer: `Global EC — dastur boshida yaratiladi, dastur tugaguncha mavjud. Faqat BITTA bo'ladi. Xususiyatlari: 1) window/global obyektini yaratadi. 2) this = window (non-strict), undefined (strict — module da). 3) var e'lonlari window ga property sifatida qo'shiladi: var x = 10 → window.x = 10. let/const qo'shilMAYDI. 4) Barcha funksiya context larning scope chain oxiri global LE ga boradi. 5) Browser da document, console kabi obyektlar global scope da. 6) "Hoisting" global scope da ham ishlaydi.`,
    },
  ],
  relatedTopics: [
    { techId: 'javascript', sectionId: 'functions-closures', topicId: 'call-stack', label: 'Call Stack' },
    { techId: 'javascript', sectionId: 'functions-closures', topicId: 'closures', label: 'Closures' },
    { techId: 'javascript', sectionId: 'fundamentals', topicId: 'scope-hoisting', label: 'Scope va Hoisting' },
    { techId: 'javascript', sectionId: 'objects-prototypes', topicId: 'this-keyword', label: 'this kalit so\'zi' },
  ],
}
