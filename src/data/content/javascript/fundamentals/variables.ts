import type { Topic } from '../../../types'

export const variables: Topic = {
  id: 'variables',
  title: 'var / let / const',
  importance: 3,
  status: 'to-learn',
  description: 'O\'zgaruvchilarni e\'lon qilish, hoisting, TDZ va scope farqlari',
  content: `JavaScript-da o'zgaruvchi e'lon qilishning 3 ta usuli bor: var, let va const. Ularning farqini chuqur tushunish — intervyuda eng ko'p so'raladigan savollardan biri.

═══════════════════════════════════════
  var — ESKI USUL (ES5)
═══════════════════════════════════════

var bilan e'lon qilingan o'zgaruvchi:
1. Function scope ga ega — faqat funksiya ichida cheklangan
2. Block scope ga EGA EMAS — if/for ichida e'lon qilinsa ham tashqarida ko'rinadi
3. Hoisting bo'ladi — e'lon qilishdan OLDIN ishlatsa bo'ladi (qiymati undefined)
4. Qayta e'lon qilish mumkin — xato bermaydi
5. window obyektiga qo'shiladi (global scope da)

  var x = 10
  var x = 20  // xato yo'q — qayta e'lon
  console.log(window.x) // 20

═══════════════════════════════════════
  let — ZAMONAVIY USUL (ES6+)
═══════════════════════════════════════

let bilan e'lon qilingan o'zgaruvchi:
1. Block scope ga ega — {} ichida cheklangan
2. Hoisting bo'ladi, LEKIN TDZ (Temporal Dead Zone) da bo'ladi
3. TDZ — e'lon qilish qatorigacha o'zgaruvchiga murojaat qilish MUMKIN EMAS
4. Qayta e'lon qilish MUMKIN EMAS — SyntaxError beradi
5. window obyektiga qo'shilMAYDI

  let y = 10
  let y = 20  // SyntaxError: Identifier 'y' has already been declared

═══════════════════════════════════════
  const — O'ZGARMAS USUL (ES6+)
═══════════════════════════════════════

const bilan e'lon qilingan o'zgaruvchi:
1. let ning barcha xususiyatlariga ega (block scope, TDZ, qayta e'lon mumkin emas)
2. Qayta tayinlash (reassignment) MUMKIN EMAS
3. E'lon qilishda ALBATTA boshlang'ich qiymat berish kerak
4. MUHIM: const = immutable EMAS! Object/array ning ICHINI o'zgartirish MUMKIN

  const z = 10
  z = 20  // TypeError: Assignment to constant variable

  const user = { name: 'Ali' }
  user.name = 'Vali'  // ISHLAYDI — ichki qiymat o'zgartirildi
  user = {}           // TypeError — referens o'zgartirib BO'LMAYDI

═══════════════════════════════════════
  HOISTING MEXANIZMI
═══════════════════════════════════════

JavaScript engine kodni ikki bosqichda ishga tushiradi:

1. CREATION PHASE (yaratish bosqichi):
   - var e'lonlari topiladi va undefined qiymat bilan xotiraga joylashadi
   - let/const e'lonlari topiladi va xotiraga joylashadi, LEKIN qiymat berilMAYDI (TDZ)
   - function declaration lar to'liq xotiraga ko'chiriladi

2. EXECUTION PHASE (bajarish bosqichi):
   - Kod qatorma-qator bajariladi
   - O'zgaruvchilarga qiymat tayinlanadi

═══════════════════════════════════════
  TEMPORAL DEAD ZONE (TDZ)
═══════════════════════════════════════

TDZ — block boshlanishidan let/const e'lon qilingan qatorgacha bo'lgan hudud.
Bu hududda o'zgaruvchiga murojaat qilsangiz ReferenceError chiqadi.

  {
    // TDZ boshlanadi
    console.log(x) // ReferenceError: Cannot access 'x' before initialization
    // TDZ davom etmoqda
    let x = 10     // TDZ tugadi
    console.log(x) // 10
  }

TDZ nima uchun kerak?
- Bug larni erta ushlash uchun
- var dagi hoisting muammolarini bartaraf etish uchun
- Kodni o'qilishi va predictable bo'lishi uchun

═══════════════════════════════════════
  SCOPE FARQLARI — JADVAL
═══════════════════════════════════════

  | Xususiyat           | var        | let        | const      |
  |---------------------|------------|------------|------------|
  | Scope               | function   | block      | block      |
  | Hoisting            | ha (undefined) | ha (TDZ) | ha (TDZ) |
  | Qayta e'lon         | mumkin     | mumkin emas | mumkin emas |
  | Qayta tayinlash     | mumkin     | mumkin     | mumkin emas |
  | window ga qo'shish  | ha         | yo'q       | yo'q       |
  | TDZ                 | yo'q       | bor        | bor        |

═══════════════════════════════════════
  BEST PRACTICES
═══════════════════════════════════════

1. DOIM const dan boshlang
2. Agar qayta tayinlash kerak bo'lsa — let ishlatish
3. var ni HECH QACHON ishlatmang (legacy kod bundan mustasno)
4. for loop da let ishlatish (har bir iteratsiyada yangi binding)
5. Object/array uchun ham const — referensni o'zgartirmaysiz`,
  codeExamples: [
    {
      title: 'var vs let — block scope farqi',
      language: 'js',
      code: `// var — block scope YO'Q
if (true) {
  var a = 10
}
console.log(a) // 10 — if dan tashqarida ham ko'rinadi!

// let — block scope BOR
if (true) {
  let b = 20
}
console.log(b) // ReferenceError: b is not defined

// for loop da farq — KLASSIK INTERVYU SAVOLI
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100)
}
// Natija: 3, 3, 3  — chunki var bitta o'zgaruvchi

for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log(j), 100)
}
// Natija: 0, 1, 2  — chunki let har iteratsiyada yangi binding`,
      description: 'var block scope ga ega emas, let ega. for loop dagi setTimeout — intervyuda eng ko\'p so\'raladigan savol.',
    },
    {
      title: 'Hoisting va TDZ',
      language: 'js',
      code: `// var hoisting — undefined qaytaradi
console.log(x) // undefined (xato emas!)
var x = 5
console.log(x) // 5

// Yuqoridagi kod JS engine ko'zida shunday:
// var x = undefined  ← hoisting
// console.log(x)     ← undefined
// x = 5              ← tayinlash
// console.log(x)     ← 5

// let hoisting — TDZ xatosi
console.log(y) // ReferenceError: Cannot access 'y' before initialization
let y = 10

// function hoisting — TO'LIQ ko'tariladi
sayHello() // "Salom!" — xato yo'q
function sayHello() {
  console.log('Salom!')
}

// function expression — hoisting bo'lMAYDI
sayBye() // TypeError: sayBye is not a function
var sayBye = function() {
  console.log('Xayr!')
}`,
      description: `var undefined bilan hoisting bo'ladi, let/const TDZ da bo'ladi, function declaration to'liq hoisting bo'ladi.`,
    },
    {
      title: 'const bilan ishlash',
      language: 'js',
      code: `// Primitiv — o'zgartirib bo'lmaydi
const PI = 3.14159
PI = 3.14 // TypeError: Assignment to constant variable

// Object — ichini o'zgartirish MUMKIN
const config = { debug: false, version: '1.0' }
config.debug = true      // ISHLAYDI
config.port = 3000       // ISHLAYDI — yangi property
delete config.version    // ISHLAYDI — o'chirish ham mumkin
config = {}              // TypeError — referensni O'ZGARTIRIB BO'LMAYDI

// Array — ichini o'zgartirish MUMKIN
const colors = ['qizil', 'yashil']
colors.push('ko\\'k')      // ISHLAYDI
colors[0] = 'sariq'       // ISHLAYDI
colors = ['boshqa']       // TypeError

// Object.freeze bilan haqiqiy immutability
const frozen = Object.freeze({ name: 'Ali', age: 25 })
frozen.name = 'Vali'   // XATO BERMAYDI, lekin O'ZGARMAYDI (silent fail)
// strict mode da TypeError beradi

// DIQQAT: freeze SHALLOW — ichki object o'zgartirsa bo'ladi
const deep = Object.freeze({ user: { name: 'Ali' } })
deep.user.name = 'Vali' // ISHLAYDI — ichki object freeze bo'lmagan`,
      description: 'const referensni o\'zgartirmaydi, ichki qiymatni o\'zgartirishi mumkin. Haqiqiy immutability uchun Object.freeze kerak.',
    },
    {
      title: 'Amaliy best practices',
      language: 'js',
      code: `// 1. DOIM const — kerak bo'lsa let
const MAX_RETRIES = 3
const API_URL = 'https://api.example.com'

let currentRetry = 0
while (currentRetry < MAX_RETRIES) {
  // ... fetch qilish
  currentRetry++
}

// 2. Destructuring bilan const
const { name, age } = getUserData()
const [first, ...rest] = getItems()

// 3. for...of da const ishlatish mumkin
const fruits = ['olma', 'nok', 'uzum']
for (const fruit of fruits) {
  console.log(fruit) // har iteratsiyada yangi binding
}

// 4. IIFE bilan scope yaratish (legacy pattern)
;(function() {
  var secret = 'maxfiy'
  // tashqaridan ko'rinmaydi
})()

// 5. Module scope — var ham global bo'lmaydi
// ES module ichida var ham window ga qo'shilmaydi
// Lekin baribir let/const ishlatish kerak`,
      description: 'Zamonaviy JavaScript da const ni default sifatida, let ni kerak bo\'lganda ishlatish — eng yaxshi amaliyot.',
    },
  ],
  interviewQA: [
    {
      question: 'var, let va const ning asosiy farqlari nimada?',
      answer: `var — function scope, hoisting bilan undefined qaytaradi, qayta e'lon qilish mumkin, window ga qo'shiladi. let — block scope, hoisting bor lekin TDZ da bo'ladi (ReferenceError), qayta e'lon mumkin emas, qayta tayinlash mumkin. const — let ning barcha xususiyatlari + qayta tayinlash mumkin emas. MUHIM: const immutable demak emas — object/array ning ichini o'zgartirish mumkin, faqat referensni o'zgartirib bo'lmaydi.`,
    },
    {
      question: 'Temporal Dead Zone (TDZ) nima va nima uchun kerak?',
      answer: `TDZ — block boshlanishidan let/const e'lon qilingan qatorgacha bo'lgan hudud. Bu hududda o'zgaruvchiga murojaat qilsangiz ReferenceError chiqadi. TDZ nima uchun kerak: 1) Bug larni erta ushlash — e'lon qilinmagan o'zgaruvchini ishlatishning oldini oladi, 2) var dagi hoisting muammosini bartaraf etadi — undefined qaytarish o'rniga aniq xato beradi, 3) Kodni predictable qiladi — o'zgaruvchi faqat e'lon qilingan joydan keyin ishlaydi. let va const texnik jihatdan hoisting bo'ladi (engine ularni biladj), lekin TDZ tufayli murojaat qilib bo'lmaydi.`,
    },
    {
      question: 'for loop da var va let ning farqini tushuntiring (setTimeout misol bilan)',
      answer: `Klassik misol: for(var i=0; i<3; i++) { setTimeout(() => console.log(i), 100) } — natija: 3, 3, 3. Sababi: var function scope — butun loop uchun BITTA i o'zgaruvchisi bor. setTimeout callback chaqirilganda loop tugagan va i = 3. for(let j=0; j<3; j++) { setTimeout(() => console.log(j), 100) } — natija: 0, 1, 2. Sababi: let block scope — HAR ITERATSIYADA yangi j binding yaratiladi. Har bir callback o'z iteratsiyasidagi j ni closure orqali ushlab turadi. var bilan ham ishlash mumkin edi — IIFE yoki closure orqali har iteratsiyada yangi scope yaratib.`,
    },
    {
      question: 'const bilan e\'lon qilingan object ni o\'zgartirish mumkinmi?',
      answer: `Ha, const bilan e'lon qilingan object ning ichki qiymatlarini o'zgartirish MUMKIN: const obj = {a: 1}; obj.a = 2 — ishlaydi. const faqat REFERENSNI o'zgartirishni taqiqlaydi: obj = {} — TypeError. Sababi: const o'zgaruvchi xotiradagi manzilni (referensni) saqlaydi. Object ning ichki qiymatlari boshqa xotira adreslarida — ularni o'zgartirish referensni o'zgartirmaydi. Haqiqiy immutability uchun Object.freeze() ishlatish kerak. Lekin freeze ham SHALLOW — ichki obyektlarga ta'sir qilmaydi. Deep freeze uchun recursive funksiya yoki kutubxona (Immer, Immutable.js) kerak.`,
    },
    {
      question: 'Hoisting qanday ishlaydi? var, let, const va function uchun farqi nima?',
      answer: `JS engine kodni ikki bosqichda ishga tushiradi. Creation phase da: 1) var e'lonlari xotiraga undefined bilan joylashadi, 2) let/const e'lonlari xotiraga joylashadi lekin qiymat BERILMAYDI (TDZ), 3) function declaration lar TO'LIQ xotiraga ko'chiriladi (nomi va tanasi bilan). Execution phase da kod qatorma-qator bajariladi. Shuning uchun: var x dan oldin console.log(x) = undefined, let x dan oldin console.log(x) = ReferenceError, function sayHi() dan oldin sayHi() = ishlaydi. Function expression (var fn = function(){}) uchun faqat var hoisting bo'ladi — fn undefined bo'ladi, chaqirilsa TypeError.`,
    },
  ],
  relatedTopics: [
    { techId: 'javascript', sectionId: 'fundamentals', topicId: 'scope-hoisting', label: 'Scope va Hoisting mexanizmi' },
    { techId: 'javascript', sectionId: 'functions-closures', topicId: 'closures', label: 'Closures' },
    { techId: 'javascript', sectionId: 'functions-closures', topicId: 'execution-context', label: 'Execution Context' },
  ],
}
