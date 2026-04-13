import type { Topic } from '../../../types'

export const operators: Topic = {
  id: 'operators',
  title: 'Operatorlar',
  importance: 2,
  status: 'to-learn',
  description: 'Taqqoslash (== vs ===), mantiqiy, nullish coalescing, optional chaining',
  content: `JavaScript operatorlari — qiymatlar ustida amallar bajarish uchun. Intervyuda ayniqsa taqqoslash operatorlari, nullish coalescing va optional chaining ko'p so'raladi.

═══════════════════════════════════════
  TAQQOSLASH OPERATORLARI
═══════════════════════════════════════

== (abstract equality) — coercion bilan taqqoslaydi:
  5 == '5'     // true — string → number
  0 == false   // true — false → 0
  null == undefined // true — maxsus qoida

=== (strict equality) — tipi VA qiymati teng bo'lishi kerak:
  5 === '5'    // false — tiplar farq
  0 === false  // false — number vs boolean

!= va !== — yuqoridagilarning teskarisi

QOIDA: DOIM === ishlatish kerak. == faqat null tekshirish uchun:
  if (value == null) — null va undefined ni bir vaqtda tekshiradi

Object taqqoslash — REFERENS bo'yicha:
  {} === {}     // false — har biri yangi obyekt
  [] === []     // false
  const a = {}
  const b = a
  a === b       // true — bir xil referens

═══════════════════════════════════════
  MANTIQIY OPERATORLAR
═══════════════════════════════════════

&& (AND) — chap qiymat falsy bo'lsa, chapni qaytaradi;
           aks holda o'ngni qaytaradi:
  true && 'salom'    // 'salom'
  false && 'salom'   // false
  0 && 'salom'       // 0
  'Ali' && 'Vali'    // 'Vali'

|| (OR) — chap qiymat truthy bo'lsa, chapni qaytaradi;
          aks holda o'ngni qaytaradi:
  '' || 'default'       // 'default'
  'Ali' || 'default'    // 'Ali'
  0 || 42               // 42
  null || undefined || 'oxirgi' // 'oxirgi'

! (NOT) — boolean ga aylantiradi va teskarisini qaytaradi:
  !true       // false
  !0          // true
  !''         // true
  !!''        // false (double NOT = Boolean() ga teng)
  !!'hello'   // true

═══════════════════════════════════════
  NULLISH COALESCING (??) — ES2020
═══════════════════════════════════════

?? — FAQAT null va undefined uchun ishlaydi (falsy emas!):

  value ?? default

|| bilan farqi:
  0 || 42      // 42 — 0 falsy, shuning uchun 42
  0 ?? 42      // 0  — 0 null/undefined EMAS

  '' || 'default'   // 'default' — '' falsy
  '' ?? 'default'   // ''  — '' null/undefined EMAS

  false || true     // true — false falsy
  false ?? true     // false — false null/undefined EMAS

  null ?? 'default'      // 'default' — null uchun ishladi
  undefined ?? 'default' // 'default' — undefined uchun ishladi

Qachon ishlatish kerak?
- 0, '', false qiymatlar KERAKLI bo'lganda
- API dan kelgan null/undefined ni default bilan almashtirish

Nullish assignment (??=):
  let x = null
  x ??= 42  // x = 42 (x null edi)
  let y = 0
  y ??= 42  // y = 0 (0 null/undefined EMAS)

═══════════════════════════════════════
  OPTIONAL CHAINING (?.) — ES2020
═══════════════════════════════════════

?. — null/undefined bo'lsa xato bermay undefined qaytaradi:

  user?.name              // user null bo'lsa → undefined (xato emas)
  user?.address?.city     // nested — har qadamda tekshiradi
  user?.hobbies?.[0]      // array elementiga murojaat
  user?.getName?.()       // metod chaqirish

Eskisi (optional chaining SIZ):
  user && user.address && user.address.city

Yangisi (optional chaining BILAN):
  user?.address?.city

DIQQAT: ?. faqat O'QISH uchun — yozish uchun ishlatib BO'LMAYDI:
  user?.name = 'Ali'  // SyntaxError

═══════════════════════════════════════
  TERNARY OPERATOR
═══════════════════════════════════════

shart ? rost_qiymat : yolg'on_qiymat

  const status = age >= 18 ? 'katta' : 'bola'
  const color = score > 90 ? 'yashil' : score > 50 ? 'sariq' : 'qizil'

Nested ternary o'qilishi qiyin — if/else afzal:
  // YOMON:
  const x = a ? b ? c : d : e
  // YAXSHI:
  if (a) { ... } else if (b) { ... }

═══════════════════════════════════════
  COMMA OPERATOR
═══════════════════════════════════════

Virgul operatori — barcha ifodalarni bajaradi, OXIRGISINI qaytaradi:
  const x = (1, 2, 3)  // x = 3
  for (let i = 0, j = 10; i < j; i++, j--) { ... }

═══════════════════════════════════════
  SPREAD va REST
═══════════════════════════════════════

Spread (...) — array/object ni yoyadi:
  const arr = [1, 2, 3]
  console.log(...arr)      // 1 2 3
  const obj = { ...a, ...b } // birlashtirish

Rest (...) — qolgan elementlarni yig'adi:
  function sum(...nums) { } // barcha argumentlar
  const [first, ...rest] = [1, 2, 3] // rest = [2, 3]`,
  codeExamples: [
    {
      title: '?? va || farqi — amaliy misol',
      language: 'js',
      code: `// API dan kelgan konfiguratsiya
const serverConfig = {
  port: 0,        // 0 — valid port
  timeout: '',    // '' — valid (disabled)
  retries: null,  // null — belgilanmagan
  debug: false,   // false — valid qiymat
}

// || — falsy qiymatlarni ham almashtiradi (NOTO'G'RI)
const port1 = serverConfig.port || 3000     // 3000 ← XATO! 0 kerak edi
const timeout1 = serverConfig.timeout || 30 // 30 ← XATO! '' kerak edi
const debug1 = serverConfig.debug || true   // true ← XATO! false kerak edi

// ?? — faqat null/undefined ni almashtiradi (TO'G'RI)
const port2 = serverConfig.port ?? 3000     // 0 ← TO'G'RI
const timeout2 = serverConfig.timeout ?? 30 // '' ← TO'G'RI
const retries2 = serverConfig.retries ?? 3  // 3 ← null edi, default ishladi
const debug2 = serverConfig.debug ?? true   // false ← TO'G'RI

// Nullish assignment
let config = { theme: null, lang: 'uz' }
config.theme ??= 'dark'   // theme = 'dark' (null edi)
config.lang ??= 'en'      // lang = 'uz' (null/undefined EMAS)`,
      description: `|| barcha falsy qiymatlarni almashtiradi, ?? faqat null va undefined ni. Real loyihalarda ?? ko'p hollarda to'g'riroq.`,
    },
    {
      title: 'Optional chaining — chuqur nested obyekt',
      language: 'js',
      code: `const user = {
  name: 'Ali',
  address: {
    city: 'Toshkent',
    coordinates: { lat: 41.2, lng: 69.2 }
  },
  hobbies: ['dasturlash', 'kitob'],
  getFullName() { return this.name }
}

// Optional chaining — xavfsiz murojaat
console.log(user?.address?.city)          // 'Toshkent'
console.log(user?.address?.zip)           // undefined (xato emas)
console.log(user?.phone?.number)          // undefined
console.log(user?.hobbies?.[0])           // 'dasturlash'
console.log(user?.hobbies?.[10])          // undefined
console.log(user?.getFullName?.())        // 'Ali'
console.log(user?.getNickname?.())        // undefined

// ?? bilan birgalikda — ENG KO'P ISHLATILADIGAN PATTERN
const city = user?.address?.city ?? 'Noma'lum'
const phone = user?.phone?.number ?? 'Telefon yo'q'

// Eski usul — ko'p && kerak edi
const oldCity = user && user.address && user.address.city
// Yangi usul — toza va o'qilishi oson
const newCity = user?.address?.city

// Real misol — API response
function getUserCity(response) {
  return response?.data?.user?.address?.city ?? 'N/A'
}`,
      description: 'Optional chaining (?.) va nullish coalescing (??) birgalikda — zamonaviy JS ning eng foydali xususiyatlari.',
    },
    {
      title: 'Mantiqiy operatorlar — short-circuit evaluation',
      language: 'js',
      code: `// && — short-circuit: chap falsy bo'lsa, to'xtaydi
false && console.log('chop etilmaydi') // false — o'ng bajarilMAYDI
true && console.log('chop etiladi')    // chop etiladi

// || — short-circuit: chap truthy bo'lsa, to'xtaydi
true || console.log('chop etilmaydi')  // true — o'ng bajarilMAYDI
false || console.log('chop etiladi')   // chop etiladi

// React da ko'p ishlatiladigan pattern
const isLoggedIn = true
const greeting = isLoggedIn && 'Xush kelibsiz!' // 'Xush kelibsiz!'
// JSX da: {isLoggedIn && <Dashboard />}

// Default qiymat berish
function greet(name) {
  name = name || 'Mehmon'  // eski usul
  // name = name ?? 'Mehmon'  // yangi usul (0, '', false uchun to'g'ri)
  return 'Salom, ' + name
}

// Mantiqiy tayinlash operatorlari (ES2021)
let a = null
a ||= 'default'   // a = 'default' (a falsy edi)
a &&= 'yangi'     // a = 'yangi' (a truthy edi)

let b = 0
b ||= 42          // b = 42 (0 falsy)
b ??= 42          // b = 0 (0 null/undefined EMAS — ?? to'g'riroq)`,
      description: `Short-circuit — chap tomon natijaviy bo'lsa, o'ng tomon bajarilmaydi. Bu xususiyat ko'p pattern larda ishlatiladi.`,
    },
  ],
  interviewQA: [
    {
      question: '== va === ning farqi nima? Qachon == ishlatish kerak?',
      answer: `=== strict equality — tip va qiymat ikkalasi ham teng bo'lishi kerak. Hech qanday coercion qilmaydi. == abstract equality — avval ikkala qiymatni bir tipga keltirib (Abstract Equality Comparison Algorithm), keyin taqqoslaydi. Masalan: '5' == 5 → true (string → number). Qoida: DOIM === ishlatish. == ishlatish mumkin bo'lgan yagona joy: value == null — bu null VA undefined ni bir vaqtda tekshiradi. ESLint da eqeqeq qoidasi bilan === majburlash mumkin.`,
    },
    {
      question: '?? va || farqi nima? Qachon qaysi biri ishlatiladi?',
      answer: `|| — chap operand FALSY bo'lsa o'ng operandni qaytaradi. Falsy: false, 0, '', null, undefined, NaN. ?? (nullish coalescing) — chap operand faqat NULL yoki UNDEFINED bo'lsa o'ng operandni qaytaradi. Farq: 0 || 42 = 42 (0 falsy), lekin 0 ?? 42 = 0 (0 null/undefined emas). '' || 'default' = 'default', '' ?? 'default' = ''. Qoida: agar 0, '', false kabi qiymatlar VALID bo'lsa — ?? ishlatish kerak. ?? ES2020 da qo'shilgan.`,
    },
    {
      question: 'Optional chaining (?.) qanday ishlaydi? Cheklovlari bormi?',
      answer: `?. — null yoki undefined ga duch kelganda xato bermay undefined qaytaradi. Ishlash: obj?.prop → obj null/undefined bo'lsa undefined, aks holda obj.prop. Variantlari: obj?.prop (property), obj?.[expr] (computed), func?.() (method). Cheklovlar: 1) Faqat O'QISH uchun — obj?.prop = value SyntaxError beradi. 2) Short-circuit — birinchi null/undefined dan keyin hamma narsa tashlanadi. 3) O'ng tomonda mavjud bo'lmagan property undefined qaytaradi, xato emas. Amalda ko'pincha ?? bilan ishlatiladi: user?.name ?? 'Anonim'.`,
    },
    {
      question: 'Short-circuit evaluation nima? Misol bering.',
      answer: `Short-circuit — mantiqiy operatorlarning chap operanddan keyin to'xtash xususiyati. && da: chap falsy bo'lsa, o'ng operand BAJARILMAYDI, chap qaytariladi. || da: chap truthy bo'lsa, o'ng operand BAJARILMAYDI, chap qaytariladi. Amaliy foyda: 1) Shart bilan bajarish: isAdmin && deleteUser() — faqat admin bo'lsa o'chiradi. 2) Default qiymat: name || 'Mehmon'. 3) React JSX: {data && <Component />}. 4) Xavfsiz murojaat: callback && callback() (optional chaining dan oldingi usul).`,
    },
  ],
  relatedTopics: [
    { techId: 'javascript', sectionId: 'fundamentals', topicId: 'data-types', label: `Ma'lumot turlari va coercion` },
    { techId: 'javascript', sectionId: 'fundamentals', topicId: 'control-flow', label: 'Boshqaruv oqimi' },
  ],
}
