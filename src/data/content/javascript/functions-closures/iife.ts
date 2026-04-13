import type { Topic } from '../../../types'

export const iife: Topic = {
  id: 'iife',
  title: 'IIFE',
  importance: 2,
  status: 'to-learn',
  description: 'Immediately Invoked Function Expression — sintaksis, module pattern, zamonaviy alternativlar',
  content: `IIFE (Immediately Invoked Function Expression) — e'lon qilingan zahoti darhol chaqiriladigan funksiya ifodasi. ES5 davrida module yaratish va scope izolyatsiyasi uchun keng ishlatilgan.

═══════════════════════════════════════
  ASOSIY SINTAKSIS
═══════════════════════════════════════

  (function() {
    // bu kod darhol bajariladi
    console.log('IIFE ishladi!')
  })()

Tuzilmasi:
1. function() { ... } — funksiya e'loni
2. ( ... ) — uni EXPRESSION ga aylantirish (grouping operator)
3. () — darhol chaqirish

Nima uchun qavslar kerak?
JavaScript "function" kalit so'zini ko'rsa — DECLARATION deb o'ylaydi.
Declaration-ni darhol chaqirib bo'lmaydi. Qavslar uni EXPRESSION ga aylantiradi.

  // Bu XATO beradi:
  function() { console.log('xato') }()
  // SyntaxError: Function statements require a function name

  // Bu ishlaydi:
  (function() { console.log('ishlaydi') })()

═══════════════════════════════════════
  IIFE TURLARI
═══════════════════════════════════════

1. Klassik IIFE (ikkita variant):
   (function() { ... })()   // Crockford uslubi
   (function() { ... }())   // Muqobil variant

2. Arrow function IIFE:
   (() => {
     console.log('arrow IIFE')
   })()

3. Parametrli IIFE:
   (function(name, version) {
     console.log(name + ' v' + version)
   })('MyApp', '1.0')

4. Qaytaruvchi IIFE:
   const result = (function() {
     return 42
   })()
   // result === 42

5. Async IIFE:
   (async function() {
     const data = await fetch('/api')
     console.log(data)
   })()

   // yoki arrow bilan:
   (async () => {
     const data = await fetch('/api')
   })()

═══════════════════════════════════════
  UNARY OPERATOR IIFE
═══════════════════════════════════════

Qavslar o'rniga unary operatorlar ham funksiyani expression ga aylantiradi:

  !function() { console.log('!') }()
  +function() { console.log('+') }()
  -function() { console.log('-') }()
  ~function() { console.log('~') }()
  void function() { console.log('void') }()

MUHIM: Bu operatorlar qaytarilgan qiymatni o'zgartiradi:
  !function() { return 42 }()   // false (42 → !42)
  +function() { return '5' }()  // 5 (string → number)
  void function() { return 42 }()  // undefined

void IIFE eng xavfsiz — doim undefined qaytaradi.
Minification tool-lar ko'pincha (function(){})() ni !function(){}() ga aylantiradi
(1 bayt tejash uchun).

═══════════════════════════════════════
  NIMA UCHUN ISHLATILGAN (ES5 DAVRI)
═══════════════════════════════════════

ES5 da faqat IKKITA scope bor edi:
1. Global scope
2. Function scope

Block scope YO'Q edi (let/const yo'q edi).
IIFE yagona usul edi yangi scope yaratish uchun:

1. GLOBAL SCOPE IFLOSLANISHINI OLDINI OLISH:
   Barcha o'zgaruvchilar function ichida — global ga chiqmaydi.

2. MODULE PATTERN:
   Private o'zgaruvchilar + public API.

3. LIBRARY/FRAMEWORK WRAPPING:
   jQuery, Lodash kabi kutubxonalar IIFE ichida yozilgan.

═══════════════════════════════════════
  MODULE PATTERN (IIFE + CLOSURE)
═══════════════════════════════════════

ES5 davrining eng muhim patterni:

  var MyModule = (function() {
    // PRIVATE
    var count = 0
    function log(msg) { console.log('[Module]', msg) }

    // PUBLIC (Revealing Module Pattern)
    return {
      increment: function() { count++; log('incremented') },
      getCount: function() { return count },
    }
  })()

  MyModule.increment()  // [Module] incremented
  MyModule.getCount()   // 1
  MyModule.count        // undefined — private!

═══════════════════════════════════════
  ZAMONAVIY ALTERNATIVLAR (ES6+)
═══════════════════════════════════════

ES6 modullari IIFE ning aksariyat ishlatish holatlarini almashtirib yubordi:

1. Scope izolyatsiyasi:
   ES5: IIFE        →  ES6: { let x = 10 } (block scope)

2. Module pattern:
   ES5: IIFE + closure  →  ES6: import/export

3. Async top-level:
   ES5: async IIFE  →  ES2022: top-level await

MUHIM: IIFE hali ham ishlatiladi:
  - Legacy kod bilan ishlashda
  - Script tag-da (module type bo'lmasa)
  - Inline expression kerak bo'lganda
  - Ayrim build tool konfiguratsiyalarida`,
  codeExamples: [
    {
      title: 'IIFE sintaksis turlari',
      language: 'js',
      code: `// 1. Klassik IIFE
(function() {
  console.log('Klassik IIFE')
})()

// 2. Parametr bilan
(function(window, document) {
  // window va document lokal o'zgaruvchi
  // Minifikatsiyada qisqartirilishi mumkin
  console.log(document.title)
})(window, document)

// 3. Arrow function IIFE
(() => {
  const secret = 'maxfiy'
  console.log(secret)
})()
// secret bu yerda mavjud EMAS

// 4. Qiymat qaytaruvchi IIFE
const config = (() => {
  const env = process.env.NODE_ENV
  return {
    apiUrl: env === 'production'
      ? 'https://api.real.com'
      : 'http://localhost:3000',
    debug: env !== 'production',
  }
})()

console.log(config.apiUrl)  // muhitga qarab
console.log(config.debug)   // muhitga qarab

// 5. Async IIFE
(async () => {
  const response = await fetch('/api/users')
  const users = await response.json()
  console.log(users)
})()`,
      description: 'IIFE ning turli ko\'rinishlari. Klassik, parametrli, arrow, qiymat qaytaruvchi va async variantlari. config misoli amalda ko\'p ishlatiladi — bir martalik hisoblash natijasini saqlash uchun.',
    },
    {
      title: 'Module Pattern — Revealing Module',
      language: 'js',
      code: `// Revealing Module Pattern
const UserService = (function() {
  // ═══ PRIVATE ═══
  const users = []
  let nextId = 1

  function validate(user) {
    if (!user.name) throw new Error('Name is required')
    if (!user.email) throw new Error('Email is required')
    return true
  }

  function generateId() {
    return nextId++
  }

  // ═══ PUBLIC API ═══
  function addUser(name, email) {
    validate({ name, email })
    const user = { id: generateId(), name, email }
    users.push(user)
    return user
  }

  function getUser(id) {
    return users.find(u => u.id === id) || null
  }

  function getAllUsers() {
    return [...users]  // nusxa qaytarish — ichki array himoyalangan
  }

  function removeUser(id) {
    const index = users.findIndex(u => u.id === id)
    if (index === -1) return false
    users.splice(index, 1)
    return true
  }

  // Faqat shu metodlar tashqaridan ko'rinadi
  return { addUser, getUser, getAllUsers, removeUser }
})()

UserService.addUser('Ali', 'ali@mail.com')     // { id: 1, ... }
UserService.addUser('Vali', 'vali@mail.com')   // { id: 2, ... }
UserService.getAllUsers()                         // [{ id: 1, ... }, ...]
UserService.removeUser(1)                         // true

// Private ga kirish imkonsiz:
UserService.users      // undefined
UserService.validate   // undefined
UserService.nextId     // undefined`,
      description: 'Revealing Module Pattern — ES5 davrining eng mashhur arxitektura patterni. IIFE ichida barcha logika private, faqat return qilingan metodlar public. jQuery plugins va ko\'plab kutubxonalar shu pattern bilan yozilgan.',
    },
    {
      title: 'Unary operator IIFE va minifikatsiya',
      language: 'js',
      code: `// Unary operatorlar — funksiyani expression ga aylantiradi
!function() {
  console.log('! operator IIFE')
}()  // consolega yozadi, lekin QAYTARADI: false

void function() {
  console.log('void operator IIFE')
}()  // consolega yozadi, QAYTARADI: undefined (eng xavfsiz)

// Minifikatsiya misoli:
// Oddiy IIFE — 25 belgili wrapper:
// (function(){...})()

// ! IIFE — 11 belgili wrapper:
// !function(){...}()

// UglifyJS, Terser va boshqa minifier-lar shu transformatsiyani qiladi

// Amaliy ishlatish — void bilan
void function main() {
  const app = document.getElementById('app')
  // ... butun dastur shu yerda
  // main funksiya global scope-ga chiqmaydi
}()

// Ikki IIFE ketma-ket — ; kerak!
// (Yo'qsa birinchi natija funksiya sifatida chaqiriladi)
(function() { console.log(1) })()  // OK
;(function() { console.log(2) })() // ; muhim!

// Bu xato beradi (ASI muammosi):
// (function() { ... })()
// (function() { ... })()
// Chunki: (result)(function...) deb o'qiladi`,
      description: 'Unary operatorlar 1 bayt tejaydi. void eng xavfsiz — qaytarish qiymatini o\'zgartirmaydi. Ketma-ket IIFE yozganda nuqtali vergul (;) qo\'yish muhim — aks holda ASI (Automatic Semicolon Insertion) xato beradi.',
    },
    {
      title: 'IIFE ning zamonaviy ekvivalentlari',
      language: 'js',
      code: `// ═══ ES5 USLUBI (IIFE) ═══

// 1. Scope izolyatsiyasi
(function() {
  var temp = 'faqat shu yerda'
  // temp global ga chiqmaydi
})()

// ═══ ES6+ EKVIVALENTI ═══

// 1. Block scope (let/const)
{
  const temp = 'faqat shu yerda'
  // temp block tashqarisida mavjud emas
}

// ═══ ES5 MODULE PATTERN ═══
var Logger = (function() {
  var logs = []
  return {
    add: function(msg) { logs.push(msg) },
    print: function() { console.log(logs) },
  }
})()

// ═══ ES6 MODULE EKVIVALENTI ═══
// logger.js
const logs = []  // module scope — private
export function add(msg) { logs.push(msg) }
export function print() { console.log(logs) }

// ═══ ASYNC IIFE → TOP-LEVEL AWAIT ═══

// ES5/ES2017 — async IIFE kerak:
(async () => {
  const data = await fetch('/api')
  console.log(await data.json())
})()

// ES2022 — to'g'ridan-to'g'ri (module type script da):
// const data = await fetch('/api')
// console.log(await data.json())

// IIFE HALI HAM FOYDALI:
// 1. Inline computed value
const supports = (() => {
  try {
    document.querySelector(':has(div)')
    return true
  } catch {
    return false
  }
})()

// 2. Switch expression (JS da expression switch yo'q)
const label = (() => {
  switch (status) {
    case 'active':  return 'Faol'
    case 'paused':  return 'To\\'xtatilgan'
    default:        return 'Noma\\'lum'
  }
})()`,
      description: 'ES6+ modullari IIFE ning aksariyat ishlatish holatlarini almashtirib yubordi. Lekin IIFE hali ham inline computed value va expression-ga aylantirish uchun foydali.',
    },
  ],
  interviewQA: [
    {
      question: 'IIFE nima va nima uchun ishlatiladi?',
      answer: 'IIFE (Immediately Invoked Function Expression) — e\'lon qilingan zahoti darhol chaqiriladigan funksiya. Asosiy maqsad: yangi scope yaratish va global namespace-ni ifloslantirmaslik. ES5 davrida faqat function scope bor edi (let/const yo\'q), shuning uchun IIFE yagona usul edi o\'zgaruvchilarni izolyatsiya qilish uchun. Bugungi kunda ES6 modules va block scope (let/const) ko\'p hollarda IIFE o\'rnini bosgan.',
    },
    {
      question: 'IIFE da qavslar nima uchun kerak?',
      answer: 'JavaScript parser "function" kalit so\'zini ko\'rsa uni Function Declaration deb tushunadi. Declaration-ni darhol chaqirib bo\'lmaydi — SyntaxError beradi. Qavslar (grouping operator) funksiyani Function Expression ga aylantiradi. Expression-ni esa darhol chaqirish mumkin. Shuningdek unary operatorlar ham expression ga aylantiradi: !function(){}(), void function(){}(), +function(){}().',
    },
    {
      question: 'Module Pattern nima? IIFE bilan qanday bog\'liq?',
      answer: 'Module Pattern — IIFE va closure kombinatsiyasi orqali private/public API yaratish usuli. IIFE ichida e\'lon qilingan o\'zgaruvchilar tashqaridan ko\'rinmaydi (private), faqat return qilingan object orqali tanlangan funksiyalar ochiladi (public). Bu ES5 davrining encapsulation usuli edi. Revealing Module Pattern — barcha logikani private qilish va faqat kerakli nomlarni return object-da expose qilish. jQuery plugins, Lodash va ko\'plab kutubxonalar shu pattern bilan yozilgan.',
    },
    {
      question: 'IIFE ning zamonaviy alternativlari qanday?',
      answer: 'ES6+ da IIFE ning aksariyat ishlatish holatlari uchun yaxshiroq yechimlar bor: 1) Scope izolyatsiyasi: { let x = 10 } — block scope yetarli. 2) Module pattern: import/export — haqiqiy module tizimi. 3) Async IIFE: ES2022 top-level await. 4) Namespace: ES modules har bir fayl o\'z scope-iga ega. Lekin IIFE hali ham foydali: inline computed values, legacy kod bilan integratsiya, script tag-larda (module type bo\'lmasa).',
    },
    {
      question: 'void function(){}() va (function(){})() farqi nima?',
      answer: 'Ikkalasi ham IIFE, lekin farqi qaytarish qiymatida. (function(){ return 42 })() → 42. void function(){ return 42 }() → undefined. void operatori DOIM undefined qaytaradi, bu ba\'zi hollarda xavfsizroq. Minifikatsiya jihatidan: !function(){}() 1 bayt tejaydi (qavslar o\'rniga 1 belgi). Ko\'pgina minifier-lar (Terser, UglifyJS) avtomatik bu transformatsiyani qiladi.',
    },
  ],
  relatedTopics: [
    { techId: 'javascript', sectionId: 'functions-closures', topicId: 'closures', label: 'Closures' },
    { techId: 'javascript', sectionId: 'functions-closures', topicId: 'execution-context', label: 'Execution Context' },
    { techId: 'javascript', sectionId: 'fundamentals', topicId: 'scope-hoisting', label: 'Scope va Hoisting' },
    { techId: 'javascript', sectionId: 'advanced', topicId: 'modules', label: 'ES Modules' },
  ],
}
