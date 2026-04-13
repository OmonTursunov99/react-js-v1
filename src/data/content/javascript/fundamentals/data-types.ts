import type { Topic } from '../../../types'

export const dataTypes: Topic = {
  id: 'data-types',
  title: 'Ma\'lumot turlari',
  importance: 3,
  status: 'to-learn',
  description: 'Primitive va reference tiplar, typeof, type coercion',
  content: `JavaScript da 8 ta ma'lumot turi bor — 7 ta primitive va 1 ta reference (object). Bu farqni chuqur tushunish — ko'plab buglarning oldini oladi.

═══════════════════════════════════════
  PRIMITIVE TIPLAR (7 ta)
═══════════════════════════════════════

1. string   — matn: 'salom', "dunyo", \`shablon\`
2. number   — son: 42, 3.14, NaN, Infinity, -Infinity
3. bigint   — katta sonlar: 9007199254740991n
4. boolean  — true yoki false
5. undefined — qiymat tayinlanmagan
6. null     — "qiymat yo'q" degan ma'no (qasddan belgilangan)
7. symbol   — noyob identifikator: Symbol('tavsif')

Primitive xususiyatlari:
- IMMUTABLE — qiymatni o'zgartirib bo'lmaydi (yangi qiymat yaratiladi)
- BY VALUE saqlanadi — o'zgaruvchi qiymatning O'ZINI saqlaydi
- Stack xotirada joylashadi

═══════════════════════════════════════
  REFERENCE TIP (1 ta — Object)
═══════════════════════════════════════

Object — barcha murakkab tiplarning onasi:
- Object: { key: value }
- Array: [1, 2, 3]
- Function: function() {}
- Date: new Date()
- RegExp: /pattern/
- Map, Set, WeakMap, WeakSet
- Error, Promise va boshqalar

Reference xususiyatlari:
- MUTABLE — ichki qiymatlarni o'zgartirish mumkin
- BY REFERENCE saqlanadi — o'zgaruvchi xotiradagi MANZILNI saqlaydi
- Heap xotirada joylashadi

═══════════════════════════════════════
  typeof OPERATORI
═══════════════════════════════════════

typeof qiymatning turini string sifatida qaytaradi:

  typeof 'salom'      // 'string'
  typeof 42           // 'number'
  typeof 42n          // 'bigint'
  typeof true         // 'boolean'
  typeof undefined    // 'undefined'
  typeof Symbol()     // 'symbol'
  typeof {}           // 'object'
  typeof []           // 'object'  ← DIQQAT! Array ham 'object'
  typeof function(){} // 'function'
  typeof null         // 'object'  ← BUG! Tarixiy xato, tuzatilmaydi

null uchun tekshirish:
  value === null  // eng ishonchli usul

Array uchun tekshirish:
  Array.isArray([1,2,3])  // true
  Array.isArray({})       // false

═══════════════════════════════════════
  TYPE COERCION (tipni o'zgartirish)
═══════════════════════════════════════

JavaScript — weakly typed til. Turli tipdagi qiymatlarni operatsiya qilganda
engine avtomatik tip o'zgartiradi. Bu implicit coercion deyiladi.

EXPLICIT coercion — dasturchi o'zi o'zgartiradi:
  String(42)     // '42'
  Number('42')   // 42
  Boolean(0)     // false

IMPLICIT coercion — engine avtomatik o'zgartiradi:
  '5' + 3        // '53'  — number → string (concatenation)
  '5' - 3        // 2     — string → number (arifmetik)
  '5' * '3'      // 15    — ikkisi ham number ga aylanadi
  !!'hello'      // true  — string → boolean

═══════════════════════════════════════
  FALSY va TRUTHY
═══════════════════════════════════════

FALSY qiymatlar (boolean ga o'zgartirilganda false):
  false, 0, -0, 0n, '', "", \`\`, null, undefined, NaN

Qolgan HAMMASI truthy:
  'salom', 42, -1, ' ' (bo'sh joy), [], {}, function(){}

DIQQAT: Bo'sh array [] va bo'sh object {} — TRUTHY!
  Boolean([])  // true
  Boolean({})  // true

═══════════════════════════════════════
  PRIMITIVE va REFERENCE FARQI
═══════════════════════════════════════

Primitive — qiymat nusxalanadi:
  let a = 10
  let b = a    // b = 10 (nusxa)
  b = 20       // a hali ham 10

Reference — manzil nusxalanadi:
  let obj1 = { name: 'Ali' }
  let obj2 = obj1   // obj2 ham XUDDI SHU obyektga ishora qiladi
  obj2.name = 'Vali'
  console.log(obj1.name) // 'Vali' — obj1 ham o'zgardi!

═══════════════════════════════════════
  NaN — MAXSUS QIYMAT
═══════════════════════════════════════

NaN (Not a Number) — arifmetik xato natijasi:
  0 / 0          // NaN
  parseInt('abc') // NaN
  Math.sqrt(-1)  // NaN

NaN ning o'ziga xos xususiyati:
  NaN === NaN    // false! — JS da yagona qiymat o'ziga teng EMAS
  NaN !== NaN    // true

Tekshirish usullari:
  Number.isNaN(NaN)     // true — ISHONCHLI
  isNaN('hello')        // true — ISHONCHSIZ (avval Number ga o'zgartiradi)
  Number.isNaN('hello') // false — to'g'ri javob`,
  codeExamples: [
    {
      title: 'Primitive vs Reference — xotira modeli',
      language: 'js',
      code: `// === PRIMITIVE — by value ===
let x = 'salom'
let y = x       // y = 'salom' (nusxa yaratildi)
y = 'dunyo'
console.log(x)  // 'salom' — o'zgarmadi

// === REFERENCE — by reference ===
let arr1 = [1, 2, 3]
let arr2 = arr1  // XUDDI SHU array ga ishora
arr2.push(4)
console.log(arr1) // [1, 2, 3, 4] — arr1 ham o'zgardi!

// Nusxa yaratish usullari (shallow copy):
let arr3 = [...arr1]           // spread operator
let arr4 = arr1.slice()        // slice
let arr5 = Array.from(arr1)    // Array.from

let obj1 = { a: 1, b: { c: 2 } }
let obj2 = { ...obj1 }         // shallow copy
obj2.a = 10                    // obj1.a o'zgarmaydi
obj2.b.c = 20                  // obj1.b.c HAM o'zgaradi! (shallow)

// Deep copy:
let obj3 = structuredClone(obj1) // zamonaviy usul (2022+)
let obj4 = JSON.parse(JSON.stringify(obj1)) // eski usul (function, undefined yo'qoladi)`,
      description: 'Primitive qiymat nusxalanadi, reference manzil nusxalanadi. Shallow vs deep copy farqi muhim.',
    },
    {
      title: 'Type coercion — kutilmagan natijalar',
      language: 'js',
      code: `// + operatori — bitta string bo'lsa, concatenation
'5' + 3         // '53'
'5' + true      // '5true'
'5' + null      // '5null'
'5' + undefined // '5undefined'

// Boshqa operatorlar — number ga o'zgartiradi
'5' - 3         // 2
'5' * '2'       // 10
'5' / '2'       // 2.5
true + true     // 2
true + false    // 1

// == vs === (intervyuda DOIM so'raladi)
0 == false      // true  (coercion: false → 0)
0 === false     // false (tip farq: number vs boolean)
'' == false     // true  (coercion: '' → 0, false → 0)
'' === false    // false
null == undefined  // true  (maxsus qoida)
null === undefined // false
NaN == NaN      // false (NaN hech narsaga teng emas)

// Kutilmagan holatlar
[] + []         // ''       (array → string → '')
[] + {}         // '[object Object]'
{} + []         // 0        (block + array)
null + 1        // 1        (null → 0)
undefined + 1   // NaN      (undefined → NaN)
'3' > '12'      // true     (string taqqoslash: '3' > '1')`,
      description: 'Type coercion — JS ning eng murakkab va xatarga olib keluvchi tomoni. == o\'rniga === ishlatish kerak.',
    },
    {
      title: 'typeof va tip tekshirish',
      language: 'js',
      code: `// typeof natijalari
console.log(typeof 'hello')     // 'string'
console.log(typeof 42)          // 'number'
console.log(typeof 42n)         // 'bigint'
console.log(typeof true)        // 'boolean'
console.log(typeof undefined)   // 'undefined'
console.log(typeof Symbol('x')) // 'symbol'
console.log(typeof {})          // 'object'
console.log(typeof [])          // 'object'  ← array ham object!
console.log(typeof null)        // 'object'  ← BUG!
console.log(typeof function(){})// 'function'

// To'g'ri tekshirish usullari
// 1. null
const isNull = (val) => val === null

// 2. Array
Array.isArray([1, 2, 3]) // true
Array.isArray('hello')   // false

// 3. NaN
Number.isNaN(NaN)        // true
Number.isNaN('hello')    // false (isNaN('hello') true berardi)

// 4. Aniq tip tekshirish
function getType(val) {
  if (val === null) return 'null'
  if (Array.isArray(val)) return 'array'
  return typeof val
}

getType(null)     // 'null'
getType([1,2])    // 'array'
getType({})       // 'object'
getType(42)       // 'number'

// 5. Object.prototype.toString — eng aniq usul
Object.prototype.toString.call([])     // '[object Array]'
Object.prototype.toString.call(null)   // '[object Null]'
Object.prototype.toString.call(/re/)   // '[object RegExp]'`,
      description: 'typeof ning kamchiliklari va to\'g\'ri tip tekshirish usullari.',
    },
  ],
  interviewQA: [
    {
      question: 'JavaScript da qanday ma\'lumot turlari bor?',
      answer: `8 ta ma'lumot turi bor. 7 ta primitive: string, number, bigint, boolean, undefined, null, symbol. 1 ta reference: object (array, function, date, regexp, map, set — hammasi object ning turlari). Primitive — immutable, by value saqlanadi, stack xotirada. Reference — mutable, by reference saqlanadi (o'zgaruvchi heap dagi manzilni saqlaydi).`,
    },
    {
      question: 'typeof null nima qaytaradi va nima uchun?',
      answer: `typeof null === 'object' qaytaradi. Bu JavaScript ning tarixiy bug i — 1995 yilda Brendan Eich 10 kunda til yaratganda, qiymatlar tag bits bilan ifodalangan. Object uchun tag 000 bo'lgan, null esa to'liq 0 (null pointer) bo'lgan. typeof tag bitlarga qarab tip aniqlagan, shuning uchun null ham 'object' deb aniqlangan. TC39 bu bug ni tuzatmoqchi bo'lgan (typeof null === 'null'), lekin ko'p eski kod sinib ketishi mumkinligi uchun bekor qilingan. null ni tekshirish uchun value === null ishlatish kerak.`,
    },
    {
      question: '== va === ning farqi nima? Qachon qaysi biri ishlatiladi?',
      answer: `=== (strict equality) — tipi va qiymatini taqqoslaydi, hech qanday coercion qilmaydi. == (abstract equality) — avval ikkala qiymatni bir tipga keltirib (coercion), keyin taqqoslaydi. Masalan: 0 == false (true, chunki false → 0), 0 === false (false, tip farq). Qoida: DOIM === ishlatish kerak. Yagona istisno: value == null — bu null va undefined ni bir vaqtda tekshiradi (value === null || value === undefined o'rniga).`,
    },
    {
      question: 'Falsy qiymatlar ro\'yxatini ayting. Bo\'sh array falsy mi?',
      answer: `Falsy qiymatlar: false, 0, -0, 0n (bigint nol), '' (bo'sh string), null, undefined, NaN — jami 8 ta. Qolgan HAMMASI truthy. MUHIM: bo'sh array [] va bo'sh object {} — TRUTHY! Boolean([]) === true, Boolean({}) === true. Bu ko'p yangi dasturchilarni chalg'itadi. Array bo'shligini tekshirish uchun arr.length === 0 ishlatish kerak. Object bo'shligini tekshirish uchun Object.keys(obj).length === 0.`,
    },
    {
      question: 'Primitive va reference tiplar qanday farq qiladi? Misollar bering.',
      answer: `Primitive — by value saqlanadi. let a = 5; let b = a; b = 10 — a hali ham 5. Chunki b ga a ning NUSXASI tayinlangan. Reference — by reference saqlanadi. let obj1 = {x: 1}; let obj2 = obj1; obj2.x = 2 — obj1.x ham 2 bo'ladi. Chunki ikkala o'zgaruvchi XUDDI SHU obyektga ishora qiladi. Nusxa yaratish uchun: shallow — spread ({...obj}), Object.assign; deep — structuredClone (zamonaviy) yoki JSON.parse(JSON.stringify(obj)) (eski, lekin function/undefined yo'qoladi). Shallow copy faqat birinchi darajani nusxalaydi, ichki obyektlar hali ham shared bo'ladi.`,
    },
  ],
  relatedTopics: [
    { techId: 'javascript', sectionId: 'fundamentals', topicId: 'operators', label: 'Operatorlar va taqqoslash' },
    { techId: 'javascript', sectionId: 'objects-prototypes', topicId: 'object-basics', label: 'Obyekt asoslari' },
    { techId: 'javascript', sectionId: 'fundamentals', topicId: 'variables', label: 'O\'zgaruvchilar' },
  ],
}
