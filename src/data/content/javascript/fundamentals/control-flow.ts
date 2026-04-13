import type { Topic } from '../../../types'

export const controlFlow: Topic = {
  id: 'control-flow',
  title: 'Boshqaruv oqimi',
  importance: 2,
  status: 'to-learn',
  description: 'if/else, switch, for/while, for...in vs for...of, labeled statements',
  content: `Boshqaruv oqimi (control flow) — dastur bajarilish tartibini boshqarish. JavaScript da shartli operatorlar va sikllar orqali amalga oshiriladi.

═══════════════════════════════════════
  IF / ELSE / ELSE IF
═══════════════════════════════════════

  if (shart) {
    // shart truthy bo'lsa
  } else if (boshqaShart) {
    // birinchi shart falsy, ikkinchi truthy
  } else {
    // hech biri truthy emas
  }

MUHIM: if shart ni Boolean() ga aylantiradi:
  if (0)         — false
  if ('')        — false
  if (null)      — false
  if (undefined) — false
  if ([])        — TRUE! (bo'sh array truthy)
  if ({})        — TRUE! (bo'sh object truthy)

═══════════════════════════════════════
  SWITCH
═══════════════════════════════════════

switch — ko'p shartlar uchun if/else dan toza:

  switch (expression) {
    case value1:
      // ...
      break
    case value2:
    case value3:
      // value2 yoki value3
      break
    default:
      // hech biri mos kelmadi
  }

MUHIM: switch === (strict equality) bilan taqqoslaydi!
  switch ('5') { case 5: ... } — ISHLAMAYDI ('5' !== 5)

break ni unutsangiz — fall-through bo'ladi:
  switch (day) {
    case 1: case 2: case 3: case 4: case 5:
      console.log('Ish kuni')
      break
    case 6: case 7:
      console.log('Dam olish')
      break
  }

═══════════════════════════════════════
  FOR SIKLLARI
═══════════════════════════════════════

1. Klassik for:
  for (let i = 0; i < arr.length; i++) {
    console.log(arr[i])
  }

2. for...in — OBJECT KEY larni iteratsiya qiladi:
  for (const key in obj) {
    console.log(key, obj[key])
  }
  DIQQAT: prototype chain dagi key lar ham kiradi!
  hasOwnProperty bilan tekshirish kerak.

3. for...of — ITERABLE VALUE larni iteratsiya qiladi (ES6):
  for (const item of array) { }
  for (const char of 'salom') { }
  for (const [key, val] of map) { }

for...in vs for...of — INTERVYU SAVOLI:
  - for...in — OBJECT uchun (key lar)
  - for...of — ITERABLE uchun (value lar: array, string, Map, Set)
  - Object for...of bilan iteratsiya qilib BO'LMAYDI (iterable emas)
  - Array uchun for...in ishlatmang — index larni string sifatida qaytaradi

═══════════════════════════════════════
  WHILE va DO...WHILE
═══════════════════════════════════════

while — shart rost ekan takrorlaydi:
  while (shart) {
    // shart truthy ekan ishlaydi
  }

do...while — AVVAL 1 marta bajaradi, KEYIN shart tekshiradi:
  do {
    // KAMIDA 1 MARTA ishlaydi
  } while (shart)

Farq: do...while shart false bo'lsa ham 1 marta ishlaydi.

═══════════════════════════════════════
  BREAK va CONTINUE
═══════════════════════════════════════

break — siklni TO'LLATIB to'xtatadi:
  for (let i = 0; i < 10; i++) {
    if (i === 5) break  // 0,1,2,3,4 — 5 da to'xtaydi
  }

continue — hozirgi iteratsiyani TASHLAB keyingisiga o'tadi:
  for (let i = 0; i < 10; i++) {
    if (i % 2 === 0) continue  // juft sonlarni tashlab ketadi
    console.log(i)  // 1, 3, 5, 7, 9
  }

═══════════════════════════════════════
  LABELED STATEMENTS
═══════════════════════════════════════

Ichma-ich sikllarda tashqi siklni boshqarish uchun:

  outer: for (let i = 0; i < 3; i++) {
    inner: for (let j = 0; j < 3; j++) {
      if (i === 1 && j === 1) break outer  // TASHQI siklni to'xtatadi
    }
  }

Kamdan-kam ishlatiladi, lekin intervyuda so'ralishi mumkin.

═══════════════════════════════════════
  FOR...AWAIT...OF
═══════════════════════════════════════

Async iterablelar uchun (ES2018):
  for await (const item of asyncIterable) {
    console.log(item)
  }

Masalan: ReadableStream, async generator natijalarini iteratsiya qilish.`,
  codeExamples: [
    {
      title: 'for...in vs for...of — asosiy farq',
      language: 'js',
      code: `const arr = ['olma', 'nok', 'uzum']

// for...in — INDEX (key) larni beradi (string!)
for (const index in arr) {
  console.log(index, typeof index)
  // '0' string, '1' string, '2' string
}

// for...of — VALUE larni beradi
for (const fruit of arr) {
  console.log(fruit)
  // 'olma', 'nok', 'uzum'
}

// Object uchun
const user = { name: 'Ali', age: 25 }

// for...in — object KEY larni beradi
for (const key in user) {
  console.log(key, user[key])
  // 'name' 'Ali', 'age' 25
}

// for...of — Object bilan ISHLAMAYDI!
// for (const val of user) {} // TypeError: user is not iterable

// Object ni for...of bilan iteratsiya qilish usullari:
for (const [key, val] of Object.entries(user)) {
  console.log(key, val) // 'name' 'Ali', 'age' 25
}

// XATAR: for...in prototype key larni ham iteratsiya qiladi!
function Person(name) { this.name = name }
Person.prototype.greet = function() {}

const person = new Person('Ali')
for (const key in person) {
  console.log(key) // 'name', 'greet' ← prototype dan!
}
// Yechim:
for (const key in person) {
  if (person.hasOwnProperty(key)) {
    console.log(key) // faqat 'name'
  }
}`,
      description: 'for...in object KEY lar uchun, for...of iterable VALUE lar uchun. Array uchun for...in ishlatmang!',
    },
    {
      title: 'Switch — pattern matching usullari',
      language: 'js',
      code: `// Oddiy switch
function getStatusText(code) {
  switch (code) {
    case 200: return 'OK'
    case 301: return 'Moved Permanently'
    case 404: return 'Not Found'
    case 500: return 'Internal Server Error'
    default:  return 'Unknown Status'
  }
}

// Fall-through — bir nechta case uchun bitta amal
function isWeekend(day) {
  switch (day.toLowerCase()) {
    case 'shanba':
    case 'yakshanba':
    case 'saturday':
    case 'sunday':
      return true
    default:
      return false
  }
}

// Switch vs Object lookup (zamonaviy alternativa)
// Switch:
function getColor(status) {
  switch (status) {
    case 'success': return 'green'
    case 'warning': return 'yellow'
    case 'error': return 'red'
    default: return 'gray'
  }
}

// Object lookup — tezroq va tozaroq:
const colorMap = {
  success: 'green',
  warning: 'yellow',
  error: 'red',
}
const getColor2 = (status) => colorMap[status] ?? 'gray'`,
      description: 'Switch pattern matching va zamonaviy alternativasi — object lookup. Ko\'p holda object lookup tezroq va tozaroq.',
    },
    {
      title: 'Sikllarning turli usullari',
      language: 'js',
      code: `const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// 1. Klassik for — eng tez, to'liq nazorat
for (let i = 0; i < numbers.length; i++) {
  if (numbers[i] > 5) break // erta to'xtash mumkin
}

// 2. for...of — toza sintaksis, break mumkin
for (const num of numbers) {
  if (num > 5) break
}

// 3. forEach — break MUMKIN EMAS (return faqat iteratsiyani o'tkazadi)
numbers.forEach((num) => {
  // break — SyntaxError
  // return — faqat shu callback dan chiqadi, sikl davom etadi
})

// 4. while — shart asosida
let i = 0
while (i < numbers.length) {
  console.log(numbers[i])
  i++
}

// 5. do...while — kamida 1 marta ishlaydi
let input
do {
  input = prompt('Son kiriting (0 — chiqish):')
} while (input !== '0')

// 6. Array metodlari — har biri o'z vazifasi bor
const doubled = numbers.map(n => n * 2)        // yangi array
const evens = numbers.filter(n => n % 2 === 0) // filtrlangan array
const sum = numbers.reduce((a, b) => a + b, 0) // bitta qiymat
const hasNeg = numbers.some(n => n < 0)         // boolean
const allPos = numbers.every(n => n > 0)        // boolean
const first = numbers.find(n => n > 5)          // birinchi mos element

// 7. Labeled break — ichma-ich sikllar
outer: for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    if (i + j === 3) break outer
    console.log(i, j)
  }
}`,
      description: 'Har bir sikl turining o\'z afzalligi bor. for — to\'liq nazorat, for...of — toza sintaksis, array metodlari — funktsional.',
    },
  ],
  interviewQA: [
    {
      question: 'for...in va for...of ning farqi nima?',
      answer: `for...in — object ning ENUMERABLE KEY (kalit) larini iteratsiya qiladi. STRING qaytaradi. PROTOTYPE CHAIN dagi key lar ham kiradi (hasOwnProperty bilan filtrlash kerak). Array uchun tavsiya etilMAYDI (index string bo'ladi, tartib kafolatlanmaydi). for...of — ITERABLE ning VALUE (qiymat) larini iteratsiya qiladi. Array, String, Map, Set, NodeList, generator kabi iterable obyektlar bilan ishlaydi. Object iterable EMAS — for...of bilan ishlatib bo'lmaydi (Object.entries() bilan mumkin). Qoida: object uchun for...in, array/string uchun for...of.`,
    },
    {
      question: 'forEach va for...of farqi nima? Qachon qaysi birini ishlatish kerak?',
      answer: `Asosiy farqlar: 1) break/continue — for...of da ishlaydi, forEach da ISHLAMAYDI (return faqat shu callback dan chiqadi, sikl davom etadi). 2) async/await — for...of da ishlaydi, forEach da ISHLAMAYDI (forEach callback larni parallel chaqiradi, kutmaydi). 3) Performance — for...of biroz tezroq (callback overhead yo'q). 4) Qulaylik — forEach index va array ni ham beradi: arr.forEach((item, index, arr) => ...). Qoida: erta to'xtash yoki async kerak bo'lsa — for...of, oddiy iteratsiya uchun — forEach yoki map/filter/reduce.`,
    },
    {
      question: `switch da break unutilsa nima bo'ladi?`,
      answer: `Fall-through bo'ladi — mos case topilgandan keyin keyingi case lar ham break gacha bajariladi. Bu ba'zan qasddan ishlatiladi: bir nechta case uchun bitta amal. Masalan: case 'shanba': case 'yakshanba': return true. Lekin aksariyat hollarda bu BUG. ESLint da no-fallthrough qoidasi bilan xato berish mumkin. TypeScript da --noFallthroughCasesInSwitch flag bilan kompilyatsiya xatosi beradi.`,
    },
    {
      question: 'Labeled statement nima? Qachon ishlatiladi?',
      answer: `Label — siklga nom berish: outer: for(...). Keyin break outer yoki continue outer bilan TASHQI siklni boshqarish mumkin. Ichma-ich siklda ichki sikldan tashqi siklni to'xtatish kerak bo'lganda ishlatiladi. Amalda kamdan-kam uchraydi — ko'pincha alohida funksiyaga ajratib, return ishlatish tezroq va o'qilishi osonroq. Lekin intervyuda so'ralishi mumkin.`,
    },
  ],
  relatedTopics: [
    { techId: 'javascript', sectionId: 'fundamentals', topicId: 'operators', label: 'Operatorlar' },
    { techId: 'javascript', sectionId: 'functions-closures', topicId: 'higher-order-functions', label: 'Higher-Order Functions' },
  ],
}
