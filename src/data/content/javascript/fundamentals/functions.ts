import type { Topic } from '../../../types'

export const functions: Topic = {
  id: 'functions',
  title: 'Funksiyalar',
  importance: 3,
  status: 'to-learn',
  description: 'Declaration, expression, arrow, default params, rest/spread, arguments',
  content: `Funksiyalar JavaScript ning asosi — "first-class citizens" deyiladi. Bu degani funksiyalar o'zgaruvchiga tayinlanishi, argument sifatida berilishi va natija sifatida qaytarilishi mumkin.

═══════════════════════════════════════
  FUNKSIYA E'LON QILISH USULLARI
═══════════════════════════════════════

1. Function Declaration (e'lon):
  function greet(name) {
    return 'Salom, ' + name
  }
  - HOISTING bo'ladi — e'lon qilishdan OLDIN chaqirish mumkin
  - O'z nomi bor (debug da foydali)

2. Function Expression (ifoda):
  const greet = function(name) {
    return 'Salom, ' + name
  }
  - HOISTING bo'lMAYDI — faqat tayinlashdan keyin chaqirish mumkin
  - Anonim yoki nomlangan bo'lishi mumkin

3. Arrow Function (strelka, ES6):
  const greet = (name) => 'Salom, ' + name
  - Qisqa sintaksis
  - O'z this i YO'Q — tashqi this ni ishlatadi
  - arguments obyekti YO'Q
  - constructor sifatida ishlatib BO'LMAYDI (new bilan)
  - prototype xususiyati YO'Q

4. Method (object ichida):
  const user = {
    name: 'Ali',
    greet() { return 'Salom, ' + this.name }
  }

═══════════════════════════════════════
  ARROW vs REGULAR FUNCTION
═══════════════════════════════════════

  | Xususiyat      | Regular        | Arrow          |
  |----------------|----------------|----------------|
  | this           | Chaqiruv joyiga bog'liq | Leksik (tashqi scope) |
  | arguments      | Bor            | Yo'q           |
  | new bilan      | Mumkin         | Mumkin EMAS    |
  | prototype      | Bor            | Yo'q           |
  | Hoisting       | Declaration — ha | Yo'q          |
  | super          | Bor            | Leksik         |
  | yield          | Mumkin (generator) | Mumkin EMAS |

Qachon arrow ishlatish kerak:
  ✅ Callback lar (map, filter, setTimeout)
  ✅ this ni tashqi scope dan olish kerak bo'lganda
  ✅ Qisqa, bir qatorli funksiyalar

Qachon regular ishlatish kerak:
  ✅ Object metod lari (this kerak)
  ✅ Constructor lar
  ✅ Generator lar
  ✅ Event handler lar (this = element bo'lishi kerak bo'lganda)

═══════════════════════════════════════
  DEFAULT PARAMETERS (ES6)
═══════════════════════════════════════

  function greet(name = 'Mehmon', greeting = 'Salom') {
    return greeting + ', ' + name
  }
  greet()            // 'Salom, Mehmon'
  greet('Ali')       // 'Salom, Ali'
  greet('Ali', 'Hi') // 'Hi, Ali'

Default qiymat FAQAT undefined uchun ishlaydi:
  greet(undefined)   // 'Salom, Mehmon' — default ishladi
  greet(null)        // 'Salom, null' — null !== undefined

Default qiymat EXPRESSION bo'lishi mumkin:
  function getId(prefix = 'id', num = Date.now()) { ... }

═══════════════════════════════════════
  REST PARAMETERS (...args)
═══════════════════════════════════════

Rest — qolgan barcha argumentlarni ARRAY ga yig'adi:

  function sum(...numbers) {
    return numbers.reduce((a, b) => a + b, 0)
  }
  sum(1, 2, 3)    // 6
  sum(1, 2, 3, 4) // 10

QOIDALAR:
- Rest parametr OXIRGI bo'lishi kerak
- Faqat BITTA rest parametr bo'lishi mumkin
- arguments dan farqi: rest — haqiqiy Array

  function log(level, ...messages) {
    messages.forEach(m => console.log('[' + level + ']', m))
  }

═══════════════════════════════════════
  SPREAD OPERATOR (...)
═══════════════════════════════════════

Spread — array/object ni yoyadi (rest ning teskarisi):

  // Funksiya chaqirishda:
  const nums = [1, 2, 3]
  Math.max(...nums)  // 3

  // Array yaratishda:
  const merged = [...arr1, ...arr2]

  // Object yaratishda:
  const updated = { ...obj, name: 'yangi' }

═══════════════════════════════════════
  arguments OBJECT
═══════════════════════════════════════

arguments — REGULAR funksiya ichida mavjud array-like object:

  function example() {
    console.log(arguments)        // { 0: 'a', 1: 'b', length: 2 }
    console.log(arguments.length) // 2
    // arguments — Array EMAS! map/filter ishlamaydi
    const arr = Array.from(arguments) // Array ga aylantirish
    // yoki: [...arguments]
  }

MUHIM: Arrow function da arguments YO'Q!
  const fn = () => console.log(arguments) // ReferenceError (yoki tashqi scope arguments)

Rest parameters arguments o'rnini bosdi:
  const fn = (...args) => args // haqiqiy Array

═══════════════════════════════════════
  RETURN QIYMATI
═══════════════════════════════════════

- return yo'q bo'lsa — undefined qaytaradi
- return; (qiymatsiz) — undefined qaytaradi
- Arrow function da {} yo'q bo'lsa — implicit return
  const double = x => x * 2  // return kerak emas
  const getObj = () => ({ name: 'Ali' }) // object uchun () kerak!`,
  codeExamples: [
    {
      title: 'Funksiya turlari va ularning farqlari',
      language: 'js',
      code: `// 1. Function Declaration — HOISTING bo'ladi
sayHello() // Ishlaydi! Hoisting tufayli
function sayHello() {
  console.log('Salom!')
}

// 2. Function Expression — HOISTING bo'lMAYDI
// sayBye() // TypeError: sayBye is not a function
const sayBye = function() {
  console.log('Xayr!')
}

// 3. Named Function Expression — debug uchun foydali
const factorial = function fact(n) {
  if (n <= 1) return 1
  return n * fact(n - 1) // ichki nom bilan chaqirish
}
// fact(5) — tashqaridan ISHLAMAYDI
factorial(5) // 120

// 4. Arrow Function — qisqa sintaksis
const add = (a, b) => a + b              // bir qator — implicit return
const square = x => x * x                // bitta param — () shart emas
const getUser = () => ({ name: 'Ali' })   // object qaytarish — () kerak
const log = () => {                       // ko'p qator — {} va return kerak
  console.log('salom')
  return true
}

// 5. IIFE — darhol chaqiriladigan
;(function() {
  const secret = 'maxfiy'
  console.log(secret)
})()
// yoki arrow:
;(() => {
  console.log('IIFE arrow')
})()`,
      description: 'Har bir funksiya turining o\'z xususiyatlari va ishlatilish joylari bor.',
    },
    {
      title: 'Rest va Spread — amaliy misollar',
      language: 'js',
      code: `// REST — argumentlarni yig'ish
function sum(...numbers) {
  return numbers.reduce((total, n) => total + n, 0)
}
console.log(sum(1, 2, 3, 4, 5)) // 15

// Birinchi argumentni ajratish, qolganini yig'ish
function logWithLevel(level, ...messages) {
  messages.forEach(msg => {
    console.log(\`[\${level.toUpperCase()}] \${msg}\`)
  })
}
logWithLevel('error', 'Server xatosi', 'Qayta urinib ko\\'ring')

// SPREAD — array yoyish
const nums = [5, 3, 8, 1, 9]
console.log(Math.max(...nums))  // 9
console.log(Math.min(...nums))  // 1

// Array birlashtirish
const fruits = ['olma', 'nok']
const vegs = ['sabzi', 'kartoshka']
const all = [...fruits, 'uzum', ...vegs]
// ['olma', 'nok', 'uzum', 'sabzi', 'kartoshka']

// Object birlashtirish (oxirgi yutadi)
const defaults = { theme: 'light', lang: 'uz', debug: false }
const userPrefs = { theme: 'dark', debug: true }
const config = { ...defaults, ...userPrefs }
// { theme: 'dark', lang: 'uz', debug: true }

// Funksiya argumentlariga spread
function createUser(name, age, city) {
  return { name, age, city }
}
const args = ['Ali', 25, 'Toshkent']
const user = createUser(...args)`,
      description: 'Rest (...) yig\'adi, Spread (...) yoyadi. Kontekst bo\'yicha farqlanadi: parametrda rest, argumentda spread.',
    },
    {
      title: 'Arrow function va this',
      language: 'js',
      code: `// Regular function — this chaqiruv joyiga bog'liq
const user = {
  name: 'Ali',
  // Regular function — this = user
  greet() {
    console.log('Salom, ' + this.name)
  },
  // Arrow function — this = TASHQI scope (window yoki undefined)
  greetArrow: () => {
    console.log('Salom, ' + this.name) // this.name = undefined!
  },
  // Aralash — setTimeout ichida
  greetDelayed() {
    // MUAMMO: regular callback — this yo'qoladi
    setTimeout(function() {
      console.log(this.name) // undefined — this = window
    }, 100)

    // YECHIM 1: arrow function — tashqi this ni oladi
    setTimeout(() => {
      console.log(this.name) // 'Ali' — this = user
    }, 100)

    // YECHIM 2 (eski): bind
    setTimeout(function() {
      console.log(this.name) // 'Ali'
    }.bind(this), 100)

    // YECHIM 3 (eski): const self = this
    const self = this
    setTimeout(function() {
      console.log(self.name) // 'Ali'
    }, 100)
  }
}

// Arrow function ni new bilan ishlatib BO'LMAYDI
const Person = (name) => { this.name = name }
// new Person('Ali') // TypeError: Person is not a constructor`,
      description: 'Arrow function this ni tashqi scope dan oladi — setTimeout callback lar uchun juda qulay.',
    },
    {
      title: 'Default parameters va arguments',
      language: 'js',
      code: `// Default parameters
function createUser(name, role = 'user', active = true) {
  return { name, role, active }
}
createUser('Ali')                // { name: 'Ali', role: 'user', active: true }
createUser('Ali', 'admin')       // { name: 'Ali', role: 'admin', active: true }
createUser('Ali', undefined, false) // undefined = default ishlaydi

// Default expression
function getTimestamp(date = new Date()) {
  return date.toISOString()
}

// Default oldingi parametrga bog'liq bo'lishi mumkin
function createRange(start, end = start + 10) {
  return { start, end }
}
createRange(5) // { start: 5, end: 15 }

// arguments vs rest
function oldWay() {
  console.log(arguments)        // array-like: {0: 'a', 1: 'b'}
  console.log(arguments.length) // 2
  // Array metodlari ISHLAMAYDI:
  // arguments.map(...) — TypeError
  const arr = [...arguments]    // Array ga aylantirish
  arr.map(x => x.toUpperCase()) // endi ishlaydi
}
oldWay('a', 'b')

function newWay(...args) {
  console.log(args)        // haqiqiy Array: ['a', 'b']
  console.log(args.length) // 2
  args.map(x => x.toUpperCase()) // ishlaydi!
}
newWay('a', 'b')`,
      description: 'Default parametrlar undefined uchun ishlaydi. arguments eski usul — rest parametrlar zamonaviyroq.',
    },
  ],
  interviewQA: [
    {
      question: 'Function declaration va function expression farqi nima?',
      answer: `Asosiy farq — HOISTING. Function declaration TO'LIQ hoisting bo'ladi — e'lon qilishdan oldin chaqirish mumkin. Function expression hoisting bo'lMAYDI — faqat var/let/const hoisting qoidalariga bo'ysunadi (var — undefined, let/const — TDZ). Boshqa farqlar: declaration — doim nomlangan, expression — anonim yoki nomlangan bo'lishi mumkin. Expression o'zgaruvchiga tayinlanadi, shuning uchun if/else ichida ishlatilishi mumkin. Amalda expression + const ko'proq ishlatiladi (qayta tayinlashdan himoya).`,
    },
    {
      question: 'Arrow function va regular function ning asosiy farqlari nima?',
      answer: `1) this — arrow leksik (tashqi scope dan), regular — chaqiruv joyiga bog'liq. 2) arguments — arrow da yo'q, regular da bor. 3) new — arrow bilan ishlatib bo'lmaydi (constructor emas), regular mumkin. 4) prototype — arrow da yo'q. 5) yield — arrow generator bo'la olmaydi. 6) super — arrow leksik super ishlatadi. Amalda: callback lar (map, setTimeout) uchun arrow, object metodlari va constructorlar uchun regular ishlatish kerak. React da: event handler lar arrow, class metodlari regular yoki class field arrow.`,
    },
    {
      question: 'Rest va spread operatorning farqi nima?',
      answer: `Ikkalasi ham ... sintaksisini ishlatadi, lekin kontekst farq: REST — funksiya parametrida yoki destructuring da qolgan elementlarni ARRAY ga yig'adi: function sum(...nums) — nums haqiqiy Array. SPREAD — funksiya chaqirishda, array/object literalda elementlarni YOYADI: Math.max(...arr), [...arr1, ...arr2], {...obj1, ...obj2}. Rest yig'adi (ko'pni bitta ga), spread yoyadi (bitta ni ko'pga). Rest DOIM oxirgi parametr bo'lishi kerak, faqat bitta bo'lishi mumkin. Spread istalgan joyda, istalgancha ishlatiladi.`,
    },
    {
      question: 'arguments nima? Nima uchun zamonaviy kodda ishlatilmaydi?',
      answer: `arguments — regular funksiya ichida mavjud bo'lgan barcha argumentlarni o'z ichiga olgan array-like object. Array-LIKE degani: length xususiyati bor, index bilan murojaat qilish mumkin ([0], [1]), LEKIN Array metodlari (map, filter, forEach) ISHLAMAYDI. Array ga aylantirish kerak: Array.from(arguments) yoki [...arguments]. arguments ni rest parametrlar almashdi: (...args) — haqiqiy Array, Array metodlari ishlaydi, nomi tushunarli, arrow function da ham ishlaydi. arguments arrow function da MAVJUD EMAS.`,
    },
    {
      question: 'JavaScript da "first-class functions" nima degani?',
      answer: `"First-class citizens" — funksiyalar boshqa qiymatlar (string, number) kabi muomala qilinadi: 1) O'zgaruvchiga tayinlash mumkin: const fn = function() {}. 2) Funksiya argumenti sifatida berish mumkin: arr.map(fn). 3) Funksiya natijasi sifatida qaytarish mumkin: function outer() { return function inner() {} }. 4) Object property sifatida saqlash mumkin: { method: function() {} }. 5) Array elementu sifatida saqlash mumkin: [fn1, fn2, fn3]. Bu xususiyat higher-order functions, closures, callback pattern, funktsional dasturlash paradigmasining asosi.`,
    },
  ],
  relatedTopics: [
    { techId: 'javascript', sectionId: 'functions-closures', topicId: 'closures', label: 'Closures' },
    { techId: 'javascript', sectionId: 'functions-closures', topicId: 'higher-order-functions', label: 'Higher-Order Functions' },
    { techId: 'javascript', sectionId: 'objects-prototypes', topicId: 'this-keyword', label: 'this kalit so\'zi' },
    { techId: 'javascript', sectionId: 'fundamentals', topicId: 'scope-hoisting', label: 'Scope va Hoisting' },
  ],
}
