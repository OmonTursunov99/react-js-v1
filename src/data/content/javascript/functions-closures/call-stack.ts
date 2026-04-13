import type { Topic } from '../../../types'

export const callStack: Topic = {
  id: 'call-stack',
  title: 'Call Stack',
  importance: 3,
  status: 'to-learn',
  description: 'LIFO, stack overflow, recursion, single-threaded model',
  content: `Call Stack — JavaScript engine funksiya chaqiruvlarini kuzatish uchun ishlatiladigan ma'lumot tuzilmasi. LIFO (Last In, First Out) prinsipi bilan ishlaydi.

═══════════════════════════════════════
  CALL STACK NIMA?
═══════════════════════════════════════

Call Stack — funksiya chaqiruvlarining "stek"i (to'plami).
Har bir funksiya chaqirilganda uning Execution Context stack ga qo'yiladi.
Funksiya tugaganda (return yoki oxirigacha) context stack dan olinadi.

Qoidalar:
1. LIFO — oxirgi qo'yilgan BIRINCHI olinadi
2. JavaScript SINGLE-THREADED — faqat BITTA call stack
3. Bir vaqtda faqat BITTA funksiya bajariladi
4. Stack bo'sh bo'lsa — dastur kutish holatida (event loop)

═══════════════════════════════════════
  QANDAY ISHLAYDI
═══════════════════════════════════════

  function birinchi() {
    ikkinchi()
    console.log('birinchi')
  }
  function ikkinchi() {
    uchinchi()
    console.log('ikkinchi')
  }
  function uchinchi() {
    console.log('uchinchi')
  }
  birinchi()

Call Stack o'zgarishi:
  1. [Global EC]
  2. [Global EC, birinchi()]
  3. [Global EC, birinchi(), ikkinchi()]
  4. [Global EC, birinchi(), ikkinchi(), uchinchi()]
  5. uchinchi tugadi → [Global EC, birinchi(), ikkinchi()]
  6. ikkinchi tugadi → [Global EC, birinchi()]
  7. birinchi tugadi → [Global EC]

Natija: 'uchinchi', 'ikkinchi', 'birinchi'

═══════════════════════════════════════
  STACK OVERFLOW
═══════════════════════════════════════

Stack overflow — call stack o'z chegarasini oshib ketganda.
Ko'pincha CHEKSIZ REKURSIYA sabab bo'ladi:

  function infinite() {
    infinite() // har doim o'zini chaqiradi
  }
  infinite()
  // RangeError: Maximum call stack size exceeded

Har bir browser/engine da stack chegarasi farq:
  - Chrome (V8): ~15,000 — 25,000 frame
  - Firefox: ~50,000 frame
  - Safari: ~50,000 frame

Stack overflow oldini olish:
  1. Rekursiyada DOIM base case bo'lishi kerak
  2. Chuqur rekursiya o'rniga iteratsiya ishlatish
  3. Tail call optimization (TCO) — faqat Safari da ishlaydi
  4. Trampoline pattern — rekursiyani iteratsiyaga aylantirish

═══════════════════════════════════════
  SINGLE-THREADED MODEL
═══════════════════════════════════════

JavaScript SINGLE-THREADED — bitta call stack, bitta thread:
  - Bir vaqtda BITTA ish bajariladi
  - Uzoq vaqt ishlaydigan kod UI ni BLOKLAYDI

  function heavyTask() {
    for (let i = 0; i < 10_000_000_000; i++) {} // UI muzlaydi!
  }

Yechim — ASINXRON operatsiyalar:
  - setTimeout/setInterval — Timer API
  - fetch/XMLHttpRequest — Network API
  - addEventListener — DOM Events
  - Promise/async-await — Microtask queue

Bu operatsiyalar BROWSER (Web API) tomonidan boshqariladi,
call stack da JOY OLMAYDI.

═══════════════════════════════════════
  CALL STACK va EVENT LOOP
═══════════════════════════════════════

  console.log('1')
  setTimeout(() => console.log('2'), 0)
  console.log('3')

Natija: '1', '3', '2'

Nima uchun?
  1. console.log('1') → call stack → bajariladi → olinadi
  2. setTimeout → Web API ga uzatiladi → timer 0ms
  3. console.log('3') → call stack → bajariladi → olinadi
  4. Call stack BO'SH
  5. Event loop callback ni task queue dan call stack ga qo'yadi
  6. console.log('2') → bajariladi

QOIDA: Asinxron callback faqat call stack BO'SH bo'lganda bajariladi.

═══════════════════════════════════════
  STACK TRACE (XATO KUZATUVI)
═══════════════════════════════════════

Xato yuz berganda call stack holati ko'rsatiladi:

  function a() { b() }
  function b() { c() }
  function c() { throw new Error('Xato!') }
  a()

  // Error: Xato!
  //     at c (file.js:3)
  //     at b (file.js:2)
  //     at a (file.js:1)
  //     at file.js:4

Stack trace PASTDAN YUQORIGA o'qiladi — chaqiruv zanjirini ko'rsatadi.
Bu debugging uchun juda muhim — xato QAYERDAN kelganini ko'rsatadi.

═══════════════════════════════════════
  CALL STACK DEBUGGING
═══════════════════════════════════════

1. console.trace() — hozirgi stack trace ni chop etadi
2. DevTools → Sources → Call Stack paneli
3. DevTools → Performance → flame chart
4. debugger; — breakpoint qo'yadi

  function problematicFunction() {
    console.trace('Bu yerda turibman') // stack trace chop etadi
    debugger // DevTools ochilgan bo'lsa, shu yerda to'xtaydi
  }`,
  codeExamples: [
    {
      title: 'Call Stack vizualizatsiyasi',
      language: 'js',
      code: `function multiply(a, b) {
  return a * b
}

function square(n) {
  return multiply(n, n)
}

function printSquare(n) {
  const result = square(n)
  console.log(result)
}

printSquare(4)

// CALL STACK o'zgarishi:
//
// Qadam 1: [main()]
// Qadam 2: [main(), printSquare(4)]
// Qadam 3: [main(), printSquare(4), square(4)]
// Qadam 4: [main(), printSquare(4), square(4), multiply(4, 4)]
// Qadam 5: multiply return 16 → [main(), printSquare(4), square(4)]
// Qadam 6: square return 16 → [main(), printSquare(4)]
// Qadam 7: [main(), printSquare(4), console.log(16)]
// Qadam 8: console.log tugadi → [main(), printSquare(4)]
// Qadam 9: printSquare tugadi → [main()]
// Qadam 10: main tugadi → [] (stack bo'sh)

// console.trace() bilan tekshirish:
function deepFunction() {
  console.trace('Stack trace:')
}
function middleFunction() {
  deepFunction()
}
function topFunction() {
  middleFunction()
}
topFunction()
// Console da stack trace ko'rsatiladi:
// Stack trace:
//   deepFunction
//   middleFunction
//   topFunction`,
      description: `Call stack LIFO prinsipi bilan ishlaydi. Har bir funksiya chaqiruvi frame qo'shadi, tugaganda olinadi.`,
    },
    {
      title: 'Stack Overflow va rekursiya',
      language: 'js',
      code: `// === XAVFLI: Cheksiz rekursiya ===
function countDown(n) {
  // BASE CASE YO'Q — cheksiz rekursiya
  console.log(n)
  countDown(n - 1) // 5, 4, 3, 2, 1, 0, -1, -2, ... STACK OVERFLOW
}
// countDown(5) // RangeError: Maximum call stack size exceeded

// === TO'G'RI: Base case bilan ===
function countDownSafe(n) {
  if (n < 0) return // BASE CASE — to'xtash sharti
  console.log(n)
  countDownSafe(n - 1)
}
countDownSafe(5) // 5, 4, 3, 2, 1, 0

// === Stack size tekshirish ===
function getMaxCallStackSize() {
  let count = 0
  function recurse() {
    count++
    recurse()
  }
  try {
    recurse()
  } catch (e) {
    return count
  }
}
console.log('Max stack size:', getMaxCallStackSize()) // ~15000-25000

// === Chuqur rekursiyani iteratsiyaga aylantirish ===
// Rekursiv (stack overflow xavfi)
function factorialRecursive(n) {
  if (n <= 1) return 1
  return n * factorialRecursive(n - 1) // n frame yaratadi
}

// Iterativ (stack overflow xavfi YO'Q)
function factorialIterative(n) {
  let result = 1
  for (let i = 2; i <= n; i++) {
    result *= i // faqat 1 frame
  }
  return result
}

// Trampoline pattern — rekursiyani xavfsiz qilish
function trampoline(fn) {
  return function(...args) {
    let result = fn(...args)
    while (typeof result === 'function') {
      result = result()
    }
    return result
  }
}`,
      description: `Stack overflow — base case yo'q rekursiyadan. Iteratsiya yoki trampoline pattern bilan oldini olish mumkin.`,
    },
    {
      title: 'Call Stack va Event Loop',
      language: 'js',
      code: `// === Single-threaded model ===
console.log('Birinchi')        // 1. Call stack → bajariladi

setTimeout(() => {
  console.log('Ikkinchi')      // 4. Stack bo'sh bo'lganda
}, 0)

Promise.resolve().then(() => {
  console.log('Uchinchi')      // 3. Microtask — callback dan OLDIN
})

console.log('To'rtinchi')     // 2. Call stack → bajariladi

// NATIJA: 'Birinchi', 'To'rtinchi', 'Uchinchi', 'Ikkinchi'

// NIMA UCHUN?
// 1. console.log('Birinchi') → stack ga → bajariladi → olinadi
// 2. setTimeout → Web API ga (0ms timer) → callback task queue ga
// 3. Promise.then → microtask queue ga
// 4. console.log('To'rtinchi') → stack ga → bajariladi → olinadi
// 5. Stack BO'SH → microtask queue tekshiriladi
// 6. 'Uchinchi' bajariladi (microtask BIRINCHI)
// 7. task queue tekshiriladi
// 8. 'Ikkinchi' bajariladi (macrotask)

// === UI bloklash misoli ===
// YOMON — UI 5 soniya muzlaydi:
function blockUI() {
  const start = Date.now()
  while (Date.now() - start < 5000) {} // 5s davomida stack band
  console.log('Tugadi')
}

// YAXSHI — UI muzlamaydi:
function nonBlockingWork(data, index = 0) {
  if (index >= data.length) return
  processItem(data[index]) // bitta element qayta ishlash
  setTimeout(() => nonBlockingWork(data, index + 1), 0) // keyingi tick
}`,
      description: `JavaScript single-threaded. Asinxron operatsiyalar Event Loop orqali boshqariladi. Stack bo'sh bo'lganda callback bajariladi.`,
    },
  ],
  interviewQA: [
    {
      question: 'Call Stack nima va qanday ishlaydi?',
      answer: `Call Stack — JS engine funksiya chaqiruvlarini kuzatish uchun ishlatiladigan LIFO (Last In, First Out) tuzilmasi. Funksiya chaqirilganda yangi Execution Context yaratiladi va stack ga qo'yiladi (push). Funksiya tugaganda context stack dan olinadi (pop). JavaScript SINGLE-THREADED — faqat BITTA call stack bor, bir vaqtda faqat BITTA funksiya bajariladi. Stack bo'sh bo'lganda event loop task queue dan keyingi vazifani qo'yadi.`,
    },
    {
      question: 'Stack Overflow nima? Qanday oldini olish mumkin?',
      answer: `Stack Overflow — call stack o'z chegarasini oshib ketganda yuz beradi (RangeError). Ko'pincha cheksiz rekursiya sabab. Browser ga qarab ~15,000–50,000 frame limit bor. Oldini olish: 1) Rekursiyada DOIM base case (to'xtash sharti) bo'lishi kerak. 2) Chuqur rekursiya o'rniga iteratsiya ishlatish. 3) Trampoline pattern — rekursiyani loop ga aylantiradi. 4) Tail Call Optimization (TCO) — faqat Safari da. 5) Katta ma'lumotlarni bo'laklarga ajratib qayta ishlash (chunking).`,
    },
    {
      question: 'JavaScript nima uchun single-threaded? Bu cheklov qanday yechiladi?',
      answer: `JavaScript single-threaded — bitta call stack, bir vaqtda bitta ish. Tarixiy sabab: browser DOM manipulyatsiyasi uchun yaratilgan, ko'p thread DOM ni buzishi mumkin (race condition). Cheklov yechimi: 1) Asinxron model — setTimeout, fetch, addEventListener kabi operatsiyalar BROWSER/NODE (Web API) tomonida bajariladi, natija EVENT LOOP orqali call stack ga qaytadi. 2) Web Workers — alohida thread da hisoblash (DOM ga murojaat qila olmaydi). 3) Service Workers — background da ishlash. 4) requestAnimationFrame — rendering bilan sinxronlash.`,
    },
    {
      question: 'console.log("1"); setTimeout(()=>console.log("2"),0); console.log("3") — natijasi nima?',
      answer: `Natija: "1", "3", "2". Tushuntirish: 1) console.log("1") — call stack ga qo'yiladi, bajariladi, olinadi. 2) setTimeout — Web API ga uzatiladi, 0ms timer tugagandan keyin callback TASK QUEUE ga qo'yiladi. 3) console.log("3") — call stack ga qo'yiladi, bajariladi, olinadi. 4) Stack BO'SH. Event loop task queue ni tekshiradi. 5) setTimeout callback call stack ga qo'yiladi. 6) console.log("2") bajariladi. MUHIM: setTimeout(fn, 0) darhol emas — faqat stack bo'sh bo'lganda bajariladi. Agar Promise ham bo'lsa — microtask (Promise) BIRINCHI, macrotask (setTimeout) KEYIN.`,
    },
    {
      question: 'Stack trace nima va debugging da qanday ishlatiladi?',
      answer: `Stack trace — xato yuz berganda call stack ning holati. Qaysi funksiya qaysi funksiyani chaqirganini ko'rsatadi. PASTDAN YUQORIGA o'qiladi — eng PASTKI qator xato yuz bergan joy, yuqoridagilar chaqiruv zanjiri. Debugging usullari: 1) console.trace() — istalgan joyda stack trace chop etish. 2) try/catch — Error.stack xususiyati. 3) DevTools Sources → Call Stack paneli. 4) DevTools Performance — flame chart (funksiya vaqtlari). 5) debugger; — breakpoint qo'yib step-by-step bajarish. Asinxron stack trace Chrome DevTools da "Async" checkbox bilan ko'rinadi.`,
    },
  ],
  relatedTopics: [
    { techId: 'javascript', sectionId: 'functions-closures', topicId: 'execution-context', label: 'Execution Context' },
    { techId: 'javascript', sectionId: 'functions-closures', topicId: 'recursion', label: 'Rekursiya' },
    { techId: 'javascript', sectionId: 'functions-closures', topicId: 'closures', label: 'Closures' },
  ],
}
