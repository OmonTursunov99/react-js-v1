import type { Topic } from '../../../types'

export const objectBasics: Topic = {
  id: 'object-basics',
  title: 'Object Basics',
  importance: 3,
  status: 'to-learn',
  description: 'Obyekt yaratish, property access, mavjudlikni tekshirish va optional chaining',
  content: `Object — JavaScript-da eng muhim ma'lumot turi. Deyarli hamma narsa (array, function, Date, RegExp) object-dan meros oladi. Object — key-value juftliklarini saqlash uchun universal konteyner.

═══════════════════════════════════════
  OBYEKT YARATISH USULLARI
═══════════════════════════════════════

JavaScript-da object yaratishning 3 ta asosiy usuli bor:

1. Object literal {} — eng ko'p ishlatiladigan usul:
   const user = { name: 'Ali', age: 25 }

2. new Object() — konstruktor bilan (deyarli ishlatilmaydi):
   const user = new Object()
   user.name = 'Ali'

3. Object.create(proto) — prototype-ni to'g'ridan-to'g'ri belgilash:
   const user = Object.create(null)  // prototype-siz "toza" object

MUHIM: Object literal {} va new Object() bir xil natija beradi.
Object.create(null) esa prototype-siz object yaratadi —
toString, hasOwnProperty kabi metodlar bo'lmaydi.
Bu "dictionary" sifatida ishlatish uchun foydali.

═══════════════════════════════════════
  PROPERTY ACCESS — DOT vs BRACKET
═══════════════════════════════════════

Ikki xil yondashuv bor:

1. Dot notation — oddiy, statik kalitlar uchun:
   user.name        // 'Ali'
   user.age         // 25

2. Bracket notation — dinamik yoki maxsus kalitlar uchun:
   user['name']           // 'Ali'
   user['first-name']     // tire bor — dot ishlamaydi
   const key = 'age'
   user[key]              // 25 — dinamik kalit

MUHIM: Bracket notation qachon kerak:
- Kalit o'zgaruvchida saqlangan bo'lsa
- Kalitda maxsus belgilar bo'lsa (tire, bo'shliq)
- Computed property ishlatganda

═══════════════════════════════════════
  COMPUTED PROPERTIES VA SHORTHAND
═══════════════════════════════════════

ES6 dan boshlab object literal-da qisqartmalar mavjud:

1. Property shorthand — o'zgaruvchi nomi = kalit nomi bo'lsa:
   const name = 'Ali', age = 25
   const user = { name, age }
   // { name: 'Ali', age: 25 } bilan bir xil

2. Method shorthand:
   const obj = {
     greet() { return 'Salom' }   // function kalit so'zi shart emas
   }

3. Computed property — kalit dinamik:
   const field = 'email'
   const user = { [field]: 'ali@mail.com' }
   // { email: 'ali@mail.com' }

   const i = 0
   const obj = { [\`item_\${i}\`]: 'birinchi' }
   // { item_0: 'birinchi' }

═══════════════════════════════════════
  PROPERTY MAVJUDLIGINI TEKSHIRISH
═══════════════════════════════════════

4 ta usul bor, har biri o'z o'rnida ishlatiladi:

1. in operatori — prototype chain-ni HAM tekshiradi:
   'name' in user         // true
   'toString' in user     // true (prototype-dan)

2. hasOwnProperty() — FAQAT o'z property-larni tekshiradi:
   user.hasOwnProperty('name')      // true
   user.hasOwnProperty('toString')  // false

3. Object.hasOwn() — ES2022, hasOwnProperty-ning yaxshilangan versiyasi:
   Object.hasOwn(user, 'name')      // true
   // Object.create(null) bilan ham ishlaydi

4. undefined bilan taqqoslash — ISHONCHSIZ:
   user.name !== undefined  // property undefined bo'lsa noto'g'ri natija

MUHIM: Object.hasOwn() — eng zamonaviy va ishonchli usul.
hasOwnProperty() esa Object.create(null) bilan ishlamaydi.

═══════════════════════════════════════
  OPTIONAL CHAINING (?.)
═══════════════════════════════════════

Chuqur ichki property-ga xavfsiz murojaat:

  const city = user?.address?.city    // undefined (xatolik emas)
  const first = users?.[0]?.name      // array element
  const result = user?.getName?.()    // metod chaqirish

?. — agar chap tomon null yoki undefined bo'lsa,
o'ng tomonga O'TMAYDI va undefined qaytaradi.
TypeError o'rniga xavfsiz natija beradi.

═══════════════════════════════════════
  NULLISH COALESCING (??)
═══════════════════════════════════════

  const name = user.name ?? 'Mehmon'

?? — FAQAT null va undefined uchun default qiymat beradi.
|| — esa 0, '', false uchun ham default beradi.

  0 || 10    // 10  (0 falsy)
  0 ?? 10    // 0   (0 null/undefined emas)
  '' || 'default'  // 'default'
  '' ?? 'default'  // ''

MUHIM: ?. va ?? birgalikda juda kuchli:
  const city = user?.address?.city ?? "Noma'lum"

═══════════════════════════════════════
  PROPERTY O'CHIRISH VA SANASH
═══════════════════════════════════════

  delete user.age      // property-ni o'chiradi, true qaytaradi

  Object.keys(user)    // ['name', 'email'] — faqat kalitlar
  Object.values(user)  // ['Ali', 'ali@mail.com'] — faqat qiymatlar
  Object.entries(user)  // [['name','Ali'], ['email','ali@mail.com']]

  for (const key in user) { ... }  // prototype-ni HAM sanaydi
  for (const [key, val] of Object.entries(user)) { ... }  // FAQAT o'zi`,
  codeExamples: [
    {
      title: 'Obyekt yaratish usullari',
      language: 'js',
      code: `// 1. Object literal — eng ko'p ishlatiladigan
const user = {
  name: 'Ali',
  age: 25,
  isActive: true,
}

// 2. new Object() — deyarli ishlatilmaydi
const config = new Object()
config.theme = 'dark'
config.lang = 'uz'

// 3. Object.create(proto)
const base = { greet() { return 'Salom' } }
const child = Object.create(base)
child.name = 'Vali'
console.log(child.greet())  // 'Salom' — prototype-dan

// 4. Object.create(null) — "toza" dictionary
const dict = Object.create(null)
dict.key = 'value'
console.log(dict.toString)        // undefined — prototype yo'q
console.log('key' in dict)        // true
console.log('toString' in dict)   // false`,
      description: 'Object literal eng qulay va tez usul. Object.create(null) esa prototype-siz toza object yaratadi — dictionary pattern uchun ishlatiladi.',
    },
    {
      title: 'Computed properties va shorthand',
      language: 'js',
      code: `// Property shorthand
const name = 'Ali'
const age = 25
const email = 'ali@mail.com'

// ES5 usuli
const userOld = { name: name, age: age, email: email }

// ES6 shorthand — o'zgaruvchi nomi = kalit nomi
const user = { name, age, email }

// Method shorthand
const calculator = {
  value: 0,
  add(n) { this.value += n; return this },     // shorthand
  subtract: function(n) { this.value -= n; return this }, // eski usul
}

// Computed property
const field = 'firstName'
const person = {
  [field]: 'Ali',                    // firstName: 'Ali'
  [\`\${field}Length\`]: 3,             // firstNameLength: 3
  ['get' + field]() { return this[field] },  // computed method
}

console.log(person.firstName)        // 'Ali'
console.log(person.getfirstName())   // 'Ali'

// Dinamik object yaratish
function createError(code, message) {
  return { [\`error_\${code}\`]: message }
}
console.log(createError(404, 'Not found'))
// { error_404: 'Not found' }`,
      description: 'ES6 shorthand va computed property — kodni qisqartiradi va dinamik kalitlar bilan ishlashni osonlashtiradi.',
    },
    {
      title: 'Property mavjudligini tekshirish',
      language: 'js',
      code: `const user = { name: 'Ali', age: 0, email: undefined }

// 1. "in" — prototype chain-ni ham tekshiradi
console.log('name' in user)       // true
console.log('phone' in user)      // false
console.log('toString' in user)   // true (prototype-dan!)

// 2. hasOwnProperty — faqat o'z property-lari
console.log(user.hasOwnProperty('name'))      // true
console.log(user.hasOwnProperty('toString'))  // false

// 3. Object.hasOwn() — ES2022, eng yaxshi usul
console.log(Object.hasOwn(user, 'name'))    // true
console.log(Object.hasOwn(user, 'phone'))   // false

// 4. undefined bilan taqqoslash — ISHONCHSIZ
console.log(user.email !== undefined)  // false! (lekin email MAVJUD)
console.log(user.phone !== undefined)  // false  (phone yo'q)
// Ikkalasini ajrata olmaydi!

// Object.create(null) bilan muammo
const dict = Object.create(null)
dict.key = 'value'
// dict.hasOwnProperty('key')  // TypeError!
Object.hasOwn(dict, 'key')     // true — ishlaydi`,
      description: 'Object.hasOwn() eng ishonchli usul — Object.create(null) bilan ham ishlaydi, hasOwnProperty esa prototype-siz objectda xatolik beradi.',
    },
    {
      title: 'Optional chaining va nullish coalescing',
      language: 'js',
      code: `const user = {
  name: 'Ali',
  address: {
    city: 'Toshkent',
    zip: null,
  },
  getFullName() { return 'Ali Valiyev' },
}

// Optional chaining (?.) — xavfsiz chuqur murojaat
console.log(user?.address?.city)        // 'Toshkent'
console.log(user?.address?.street)      // undefined (xatolik emas)
console.log(user?.phone?.number)        // undefined

// Metod chaqirish
console.log(user?.getFullName?.())      // 'Ali Valiyev'
console.log(user?.getNickname?.())      // undefined

// Array elementiga murojaat
const users = [{ name: 'Ali' }]
console.log(users?.[0]?.name)    // 'Ali'
console.log(users?.[5]?.name)    // undefined

// Nullish coalescing (??) — null/undefined uchun default
console.log(user.address.zip ?? 'N/A')   // 'N/A' (zip === null)
console.log(user.name ?? 'Mehmon')        // 'Ali'

// || vs ?? farqi
const count = 0
console.log(count || 10)   // 10  — 0 falsy!
console.log(count ?? 10)   // 0   — 0 null/undefined emas

const text = ''
console.log(text || 'default')  // 'default' — '' falsy!
console.log(text ?? 'default')  // ''

// Kombinatsiya — eng kuchli pattern
const city = user?.address?.city ?? 'Noma\\'lum'
console.log(city)  // 'Toshkent'

const street = user?.address?.street ?? 'Ko\\'rsatilmagan'
console.log(street)  // 'Ko\\'rsatilmagan'`,
      description: '?. va ?? birgalikda chuqur ichma-ich objectlarda xavfsiz murojaat va default qiymat berish imkonini beradi.',
    },
    {
      title: 'Object sanash va iteratsiya',
      language: 'js',
      code: `const user = { name: 'Ali', age: 25, city: 'Toshkent' }

// Object.keys — kalitlar massivi
console.log(Object.keys(user))    // ['name', 'age', 'city']

// Object.values — qiymatlar massivi
console.log(Object.values(user))  // ['Ali', 25, 'Toshkent']

// Object.entries — [kalit, qiymat] juftliklari
console.log(Object.entries(user))
// [['name', 'Ali'], ['age', 25], ['city', 'Toshkent']]

// for...of + entries — eng qulay iteratsiya
for (const [key, value] of Object.entries(user)) {
  console.log(\`\${key}: \${value}\`)
}

// for...in — prototype-ni HAM sanaydi (ehtiyot bo'ling!)
const parent = { role: 'admin' }
const child = Object.create(parent)
child.name = 'Ali'

for (const key in child) {
  console.log(key)  // 'name', 'role' (prototype-dan!)
}

// Faqat o'z property-lari
for (const key in child) {
  if (Object.hasOwn(child, key)) {
    console.log(key)  // faqat 'name'
  }
}

// delete — property o'chirish
delete user.city
console.log(user)  // { name: 'Ali', age: 25 }
console.log('city' in user)  // false`,
      description: 'for...in prototype-ni ham sanaydi, shuning uchun Object.entries + for...of ishlatish yaxshiroq. delete operatori property-ni to\'liq o\'chiradi.',
    },
  ],
  interviewQA: [
    {
      question: 'Dot notation va bracket notation farqi nima? Qachon qaysi biri ishlatiladi?',
      answer: 'Dot notation (obj.key) — statik, ma\'lum kalitlar uchun ishlatiladi. Bracket notation (obj["key"]) — dinamik kalitlar, maxsus belgilar (tire, bo\'shliq) bo\'lgan kalitlar, va o\'zgaruvchida saqlangan kalitlar uchun ishlatiladi. Masalan: const key = "name"; obj[key] — bu dot bilan mumkin emas. Computed property ham bracket notation-ga asoslangan: { [key]: value }.',
    },
    {
      question: 'Object.hasOwn() va hasOwnProperty() farqi nima?',
      answer: 'Object.hasOwn(obj, key) — ES2022 da qo\'shilgan statik metod. U hasOwnProperty() ning yaxshilangan versiyasi. Asosiy farq: Object.create(null) bilan yaratilgan object-da hasOwnProperty mavjud emas (TypeError beradi), lekin Object.hasOwn() ishlaydi. Bundan tashqari, hasOwnProperty override qilinishi mumkin, Object.hasOwn esa har doim ishonchli.',
    },
    {
      question: 'Optional chaining (?.) qanday ishlaydi va "in" operatoridan farqi nima?',
      answer: '?. — zanjirli property murojaat. Agar chap tomon null yoki undefined bo\'lsa, o\'ng tomonga o\'tmaydi va undefined qaytaradi. "in" operatori esa property MAVJUDLIGINI tekshiradi (true/false qaytaradi) va prototype chain-ni ham ko\'radi. ?. qiymatga MUROJAAT qilish uchun, "in" esa TEKSHIRISH uchun ishlatiladi. Masalan: user?.address?.city — qiymat olish, "city" in address — mavjudlik tekshirish.',
    },
    {
      question: '|| va ?? operatorlari farqi nima?',
      answer: '|| — birinchi truthy qiymatni qaytaradi. 0, "", false, null, undefined — barchasi falsy. ?? — faqat null va undefined uchun default beradi. Farq: 0 || 10 = 10, lekin 0 ?? 10 = 0. "" || "default" = "default", lekin "" ?? "default" = "". ?? ishlatish kerak qachonki 0, "" yoki false qiymatlari YAROQLI bo\'lsa.',
    },
    {
      question: 'for...in va Object.keys() farqi nima?',
      answer: 'for...in — object-ning BARCHA enumerable property-larini sanaydi, shu jumladan PROTOTYPE chain-dagi property-larni ham. Object.keys() esa faqat object-ning O\'Z (own) enumerable property-larini massiv sifatida qaytaradi. Shuning uchun for...in ishlatganda Object.hasOwn() bilan tekshirish kerak. Amalda Object.keys() / Object.entries() + for...of ishlatish yaxshiroq — prototype muammosi yo\'q.',
    },
    {
      question: 'Object.create(null) nima uchun ishlatiladi?',
      answer: 'Object.create(null) prototype-siz "toza" object yaratadi. Undagi toString, hasOwnProperty, constructor kabi meros metodlar yo\'q. Bu "dictionary" yoki "map" sifatida ishlatish uchun foydali — chunki foydalanuvchi kalitlari prototype metodlari bilan to\'qnashmaydi. Masalan, agar kalit "toString" bo\'lsa, oddiy object-da muammo bo\'ladi. Object.create(null) da esa bu xavfsiz.',
    },
  ],
  relatedTopics: [
    { techId: 'javascript', sectionId: 'objects-prototypes', topicId: 'destructuring-spread', label: 'Destructuring & Spread' },
    { techId: 'javascript', sectionId: 'objects-prototypes', topicId: 'property-descriptors', label: 'Property Descriptors' },
    { techId: 'javascript', sectionId: 'objects-prototypes', topicId: 'prototype-chain', label: 'Prototype Chain' },
    { techId: 'javascript', sectionId: 'objects-prototypes', topicId: 'object-create', label: 'Object.create & Object metodlari' },
  ],
}
