import type { Topic } from '../../../types'

export const weakmapWeakset: Topic = {
  id: 'weakmap-weakset',
  title: 'WeakMap va WeakSet',
  importance: 2,
  status: 'to-learn',
  description: 'Zaif referenslar, garbage collection bilan ishlash',
  content: `═══════════════════════════════════════
  WEAKMAP — ZAIF KALITLI XARITA
═══════════════════════════════════════

WeakMap — Map ga o'xshash kolleksiya, lekin kalitlari FAQAT obyektlar
(yoki Symbol) bo'lishi mumkin. Asosiy farq — kalit bo'lgan obyektga
boshqa referens bo'lmasa, garbage collector uni xotiradan o'chiradi.

const wm = new WeakMap()
let obj = { data: 'hello' }
wm.set(obj, 'metadata')

obj = null  // Endi obj ga referens yo'q
// GC obj ni va WeakMap dagi yozuvni o'chiradi

Mavjud metodlar (faqat 4 ta):
1. set(key, value) — qiymat qo'shish
2. get(key) — qiymat olish
3. has(key) — kalit borligini tekshirish
4. delete(key) — yozuvni o'chirish

MUHIM: WeakMap da size, keys(), values(), entries(), forEach() YO'Q.
Sababi — GC istalgan vaqtda elementlarni o'chirishi mumkin, shuning
uchun aniq o'lcham va iteratsiya kafolatlanmaydi.

═══════════════════════════════════════
  WEAKSET — ZAIF QIYMATLI TO'PLAM
═══════════════════════════════════════

WeakSet — Set ga o'xshash, lekin faqat obyektlarni saqlaydi.
Obyektga boshqa referens yo'q bo'lsa, GC uni o'chiradi.

const ws = new WeakSet()
let user = { name: 'Ali' }
ws.add(user)
ws.has(user)     // true

user = null      // GC o'chiradi
// ws da ham element yo'qoladi

Mavjud metodlar (faqat 3 ta):
1. add(value) — element qo'shish
2. has(value) — element borligini tekshirish
3. delete(value) — elementni o'chirish

═══════════════════════════════════════
  MAP/SET BILAN FARQLARI
═══════════════════════════════════════

Map vs WeakMap:
┌──────────────────────┬────────────┬─────────────┐
│ Xususiyat            │ Map        │ WeakMap      │
├──────────────────────┼────────────┼─────────────┤
│ Kalit turlari        │ Har qanday │ Faqat object │
│ GC ta'siri           │ Yo'q       │ Zaif referens│
│ size                 │ Bor        │ Yo'q         │
│ Iteratsiya           │ Bor        │ Yo'q         │
│ keys/values/entries  │ Bor        │ Yo'q         │
│ forEach              │ Bor        │ Yo'q         │
│ clear()              │ Bor        │ Yo'q         │
└──────────────────────┴────────────┴─────────────┘

MUHIM: Map kalit bo'lgan obyektni KUCHLI ushlab turadi (strong reference).
Agar Map ga katta obyekt qo'shsangiz va keyin o'sha obyektni boshqa
joyda null qilsangiz ham, Map ichida qolib ketadi — memory leak bo'ladi.
WeakMap da bu muammo yo'q.

═══════════════════════════════════════
  USE CASE: PRIVATE DATA
═══════════════════════════════════════

WeakMap class ning xususiy ma'lumotlarini saqlash uchun ishlatiladi.
ES2022 dagi #private fields dan oldin bu eng yaxshi yechim edi.

Afzalligi: class instance garbage collect qilinganda, WeakMap dagi
ma'lumot ham avtomatik o'chadi — memory leak bo'lmaydi.

═══════════════════════════════════════
  USE CASE: DOM METADATA
═══════════════════════════════════════

DOM elementlarga qo'shimcha ma'lumot biriktirish uchun WeakMap ideal.
Element DOM dan o'chirilsa, metadata ham avtomatik GC qilinadi.

const elementData = new WeakMap()
const button = document.querySelector('#btn')
elementData.set(button, { clicks: 0, lastClicked: null })

Bu dataset attribute dan afzal — murakkab obyektlarni saqlash mumkin
va DOM ni ifloslantirmaydi.

═══════════════════════════════════════
  USE CASE: CACHING
═══════════════════════════════════════

WeakMap bilan kesh yaratish — obyekt kerak bo'lmaganida kesh ham
avtomatik tozalanadi.

const cache = new WeakMap()
function heavyCompute(obj) {
  if (cache.has(obj)) return cache.get(obj)
  const result = /* og'ir hisoblash */ obj
  cache.set(obj, result)
  return result
}

Agar obj ga referens yo'q bo'lsa, kesh yozuvi ham o'chadi.
Oddiy Map/Object bilan buni qo'lda boshqarish kerak edi.

═══════════════════════════════════════
  USE CASE: OBJECT TRACKING
═══════════════════════════════════════

WeakSet obyektlarni "belgilash" uchun qulay — masalan, qaysi
obyektlar allaqachon qayta ishlangan, qaysilar tasdiqlangan.

const visited = new WeakSet()
function processNode(node) {
  if (visited.has(node)) return  // Takroriy qayta ishlashdan himoya
  visited.add(node)
  // ... qayta ishlash
}

Obyekt GC qilinganda, WeakSet dan ham o'chadi — xotira oqmaydi.`,
  codeExamples: [
    {
      title: 'WeakMap asosiy ishlatilishi',
      language: 'js',
      code: `// WeakMap — faqat object key, GC friendly
const metadata = new WeakMap()

let user = { name: 'Ali', age: 25 }
let post = { title: 'JS Tips' }

// Metadata biriktirish
metadata.set(user, { visits: 10, lastSeen: new Date() })
metadata.set(post, { views: 150, likes: 23 })

console.log(metadata.get(user))  // { visits: 10, lastSeen: ... }
console.log(metadata.has(post))  // true

// Primitiv kalit — XATO
// metadata.set('key', 'value')  // TypeError!

// Referens yo'qolsa — GC tozalaydi
user = null
// Endi user obyekti va uning metadata si GC ga tayyor
// metadata.get(user) — undefined (user = null)

// Map bilan farqi:
const map = new Map()
let obj = { data: 'test' }
map.set(obj, 'info')
obj = null
// Map hali ham obj ni ushlab turadi — memory leak!
console.log(map.size)  // 1 — hali ham bor`,
      description: 'WeakMap asosiy operatsiyalari va GC xatti-harakati',
    },
    {
      title: 'WeakMap bilan private data',
      language: 'js',
      code: `// Private data pattern — ES2022 dan oldingi eng yaxshi yechim
const _balance = new WeakMap()
const _pin = new WeakMap()

class BankAccount {
  constructor(owner, initialBalance, pin) {
    this.owner = owner  // Public
    _balance.set(this, initialBalance)  // Private
    _pin.set(this, pin)                 // Private
  }

  getBalance(pin) {
    if (_pin.get(this) !== pin) {
      throw new Error('Noto\\'g\\'ri PIN')
    }
    return _balance.get(this)
  }

  deposit(amount) {
    const current = _balance.get(this)
    _balance.set(this, current + amount)
  }
}

const account = new BankAccount('Ali', 1000, '1234')
console.log(account.owner)           // 'Ali' — public
console.log(account.getBalance('1234'))  // 1000

// Private ma'lumotlarga tashqaridan kirish mumkin emas
console.log(account._balance)  // undefined
console.log(account._pin)      // undefined

// Instance GC qilinganda, WeakMap dagi data ham o'chadi
// Memory leak yo'q!`,
      description: 'WeakMap yordamida class xususiy ma\'lumotlarini saqlash',
    },
    {
      title: 'WeakMap bilan DOM metadata va caching',
      language: 'js',
      code: `// DOM element metadata
const clickData = new WeakMap()

document.querySelectorAll('.btn').forEach(btn => {
  clickData.set(btn, { count: 0, firstClick: null })

  btn.addEventListener('click', () => {
    const data = clickData.get(btn)
    data.count++
    if (!data.firstClick) data.firstClick = new Date()
    console.log(\`Bosildi: \${data.count} marta\`)
  })
})
// Element DOM dan o'chirilsa — metadata ham GC qilinadi

// ═══════════════════════════════════════

// Caching pattern
const cache = new WeakMap()

function processConfig(configObj) {
  // Keshda bormi?
  if (cache.has(configObj)) {
    console.log('Keshdan olindi')
    return cache.get(configObj)
  }

  // Og'ir hisoblash
  const result = {
    parsed: JSON.parse(JSON.stringify(configObj)),
    timestamp: Date.now(),
    hash: Object.keys(configObj).join(':')
  }

  cache.set(configObj, result)
  console.log('Yangi hisoblandi')
  return result
}

const config = { theme: 'dark', lang: 'uz' }
processConfig(config)  // "Yangi hisoblandi"
processConfig(config)  // "Keshdan olindi"
// config = null bo'lsa, kesh ham avtomatik tozalanadi`,
      description: 'DOM metadata va avtomatik tozalanadigan kesh',
    },
    {
      title: 'WeakSet — obyektlarni belgilash',
      language: 'js',
      code: `// WeakSet — obyektlarni "belgilash" uchun
const visited = new WeakSet()

// Circular reference bilan ishlash
function deepClone(obj, seen = new WeakSet()) {
  if (obj === null || typeof obj !== 'object') return obj

  // Circular reference tekshiruvi
  if (seen.has(obj)) {
    return '[Circular]'
  }
  seen.add(obj)

  const clone = Array.isArray(obj) ? [] : {}
  for (const key of Object.keys(obj)) {
    clone[key] = deepClone(obj[key], seen)
  }
  return clone
}

// Test
const a = { name: 'a' }
const b = { name: 'b', ref: a }
a.ref = b  // Circular reference!

console.log(deepClone(a))
// { name: 'a', ref: { name: 'b', ref: '[Circular]' } }

// ═══════════════════════════════════════

// Foydalanuvchi sessiya tracking
const loggedInUsers = new WeakSet()

class User {
  constructor(name) { this.name = name }
  login() { loggedInUsers.add(this) }
  logout() { loggedInUsers.delete(this) }
  get isLoggedIn() { return loggedInUsers.has(this) }
}

const user = new User('Ali')
user.login()
console.log(user.isLoggedIn)  // true
user.logout()
console.log(user.isLoggedIn)  // false`,
      description: 'WeakSet bilan circular reference va obyekt tracking',
    },
  ],
  interviewQA: [
    {
      question: 'WeakMap va Map ning asosiy farqi nima?',
      answer: 'Asosiy farq — referens turi. Map kalit obyektni KUCHLI (strong) ushlab turadi — Map mavjud ekan, kalit GC qilinmaydi. WeakMap esa ZAIF (weak) referens yaratadi — kalit obyektga boshqa referens yo\'qolsa, GC uni xotiradan o\'chiradi, WeakMap dagi yozuv ham yo\'qoladi. Shuning uchun WeakMap da size, keys(), values(), forEach() yo\'q — GC istalgan paytda element o\'chirishi mumkin. WeakMap kaliti faqat obyekt bo\'lishi mumkin (primitiv emas).',
    },
    {
      question: 'Nega WeakMap ni iterate qilib bo\'lmaydi?',
      answer: 'Garbage collector istalgan vaqtda WeakMap elementlarini o\'chirishi mumkin — bu jarayon deterministik emas va dasturchi nazorat qila olmaydi. Agar iteratsiya mavjud bo\'lsa, ikki ketma-ket chaqiruv turli natijalar berishi mumkin edi. Bu noaniqlik JavaScript specification da xavfsizlik va bashorat qilish sabablariga ko\'ra taqiqlangan. Shuning uchun size, keys(), values(), entries(), forEach() metodlari yo\'q — faqat aniq kalit bo\'yicha get/set/has/delete ishlaydi.',
    },
    {
      question: 'WeakMap ning amaliy qo\'llanilish holatlari qanday?',
      answer: '1) Private data — class instance ga xususiy ma\'lumot biriktirish. Instance GC qilinganda data ham o\'chadi. 2) DOM metadata — elementlarga qo\'shimcha ma\'lumot. Element o\'chirilganda metadata ham tozalanadi. 3) Caching — og\'ir hisoblash natijalarini keshlash. Kalit obyekt kerak bo\'lmaganida kesh ham tozalanadi. 4) Object tracking — qaysi obyektlar qayta ishlangan. Barchada umumiy afzallik: memory leak xavfi yo\'q, chunki GC avtomatik tozalaydi.',
    },
    {
      question: 'WeakSet qachon ishlatiladi?',
      answer: 'WeakSet obyektlarni "belgilash" uchun ishlatiladi: 1) Circular reference aniqlash — deepClone, JSON serialization da obyektni qayta ko\'rmaslik uchun. 2) Tasdiqlash — qaysi obyektlar validatsiyadan o\'tgan. 3) Tracking — qaysi foydalanuvchilar online, qaysi elementlar ko\'rilgan. WeakSet faqat "bu obyekt to\'plamda bormi?" savoliga javob beradi (has metodi). Map/Set dan farqli, WeakSet da size va iteratsiya yo\'q. Obyektga boshqa referens yo\'qolsa, WeakSet dan ham o\'chadi.',
    },
    {
      question: 'Memory leak ni oldini olishda WeakMap qanday yordam beradi?',
      answer: 'Oddiy Map yoki Object da kalit sifatida obyekt ishlatilsa, Map o\'sha obyektga KUCHLI referens yaratadi. Hatto dasturning boshqa qismida o\'sha obyekt null qilinsa ham, Map ichida qolib ketadi va GC uni o\'chira olmaydi — bu memory leak. WeakMap esa ZAIF referens yaratadi: agar kalit obyektga boshqa kuchli referens qolmasa, GC uni erkin o\'chiradi. Masalan, DOM element WeakMap kaliti bo\'lsa va element DOM dan o\'chirilsa, WeakMap dagi yozuv ham avtomatik tozalanadi.',
    },
  ],
}
