import type { Topic } from '../../../types'

export const arrayMethods: Topic = {
  id: 'array-methods',
  title: 'Array Metodlari',
  importance: 3,
  status: 'to-learn',
  description: 'JavaScript massiv metodlari — mutating, non-mutating, transformation va ES2023+ yangiliklari',
  content: `Array — JavaScript-da eng ko'p ishlatiladigan ma'lumot tuzilmasi. Senior darajada BARCHA metodlarni bilish, ularning mutating/non-mutating farqini tushunish va to'g'ri tanlash muhim.

═══════════════════════════════════════
  MUTATING METODLAR (ASLINI O'ZGARTIRADI)
═══════════════════════════════════════

Bu metodlar ORIGINAL massivni o'zgartiradi:

  push(item)       — oxiriga qo'shadi, yangi length qaytaradi
  pop()            — oxirgisini olib tashlaydi, o'sha elementni qaytaradi
  shift()          — boshidan olib tashlaydi
  unshift(item)    — boshiga qo'shadi
  splice(i, n)     — i-pozitsiyadan n ta olib tashlaydi (va qo'shishi mumkin)
  sort(fn)         — saralaydi (default: string sifatida!)
  reverse()        — teskari tartibga keltiradi
  fill(val, s, e)  — s dan e gacha val bilan to'ldiradi

MUHIM: React va immutable state bilan ishlaganda
bu metodlarni TO'G'RIDAN-TO'G'RI ishlatmang!
Avval nusxa oling: [...arr].sort() yoki toSorted() ishlating.

═══════════════════════════════════════
  NON-MUTATING METODLAR (YANGI QIYMAT QAYTARADI)
═══════════════════════════════════════

Bu metodlar original massivni O'ZGARTIRMAYDI:

  map(fn)        — har bir elementni o'zgartiradi, YANGI massiv qaytaradi
  filter(fn)     — shartga mos elementlar, YANGI massiv
  reduce(fn, init) — massivni bitta qiymatga "yig'adi"
  find(fn)       — shartga mos BIRINCHI elementni qaytaradi
  findIndex(fn)  — shartga mos birinchi element INDEKSINI qaytaradi
  findLast(fn)   — shartga mos OXIRGI element (ES2023)
  findLastIndex  — oxirgi mos element indeksi (ES2023)
  some(fn)       — kamida BIR element shartga mosmi? (boolean)
  every(fn)      — BARCHA elementlar shartga mosmi? (boolean)
  includes(val)  — massivda val bormi? (boolean)
  indexOf(val)   — birinchi topilgan indeks (-1 agar yo'q)
  slice(s, e)    — s dan e gacha kesib oladi (yangi massiv)
  concat(arr)    — ikki massivni birlashtiradi (yangi massiv)
  flat(depth)    — ichki massivlarni "tekislaydi"
  flatMap(fn)    — map + flat(1) birgalikda

═══════════════════════════════════════
  ES2023+ IMMUTABLE ALTERNATIVLAR
═══════════════════════════════════════

ES2023 mutating metodlarning IMMUTABLE versiyalarini qo'shdi:

  toSorted(fn)       — sort() ning immutable versiyasi
  toReversed()       — reverse() ning immutable versiyasi
  toSpliced(i, n)    — splice() ning immutable versiyasi
  with(index, value) — arr[i] = val ning immutable versiyasi

Bu metodlar YANGI massiv qaytaradi, aslini o'zgartirmaydi.
React state bilan ishlashda juda qulay!

═══════════════════════════════════════
  REDUCE — ENG KUCHLI METOD
═══════════════════════════════════════

reduce har qanday massiv transformatsiyasini bajara oladi:

  arr.reduce((accumulator, current, index, array) => {
    return yangiAccumulator
  }, initialValue)

- accumulator — "to'plangan" natija
- current — hozirgi element
- initialValue — boshlang'ich qiymat (DOIM berish kerak!)

MUHIM: initialValue berilmasa, birinchi element
accumulator bo'ladi — bu ko'p xatolarga sabab bo'ladi.

═══════════════════════════════════════
  forEach vs map vs for...of
═══════════════════════════════════════

1. forEach — faqat side-effect uchun (hech narsa qaytarmaydi)
   - break/continue ISHLAMAYDI
   - async/await TO'G'RI ishlamaydi

2. map — YANGI massiv yaratish uchun
   - DOIM return qilish kerak
   - Natijaga kerak bo'lmasa — forEach ishlating

3. for...of — eng moslashuvchan
   - break/continue ishlaydi
   - async/await to'g'ri ishlaydi
   - index kerak bo'lsa: for (const [i, val] of arr.entries())

═══════════════════════════════════════
  ARRAY.FROM VA ARRAY.OF
═══════════════════════════════════════

  Array.from(iterable, mapFn) — iterable-dan massiv yaratadi
  Array.from({length: 5}, (_, i) => i)  // [0, 1, 2, 3, 4]
  Array.from("salom")                   // ["s", "a", "l", "o", "m"]
  Array.from(new Set([1,2,2,3]))        // [1, 2, 3]

  Array.of(1, 2, 3) — argumentlardan massiv yaratadi
  // Array(3) = [empty x 3], lekin Array.of(3) = [3]

  at(index) — manfiy indeks bilan ham ishlaydi:
  arr.at(-1) — oxirgi element (arr[arr.length - 1] o'rniga)`,
  codeExamples: [
    {
      title: 'map, filter, reduce — asosiy trio',
      language: 'js',
      code: `const users = [
  { name: "Ali", age: 25, active: true },
  { name: "Vali", age: 17, active: false },
  { name: "Soli", age: 30, active: true },
  { name: "Gani", age: 15, active: true },
]

// filter — faqat shartga mos elementlar
const adults = users.filter(u => u.age >= 18)
// [{ name: "Ali", ... }, { name: "Soli", ... }]

// map — har bir elementni o'zgartirish
const names = users.map(u => u.name)
// ["Ali", "Vali", "Soli", "Gani"]

// reduce — yig'ish
const totalAge = users.reduce((sum, u) => sum + u.age, 0)
// 87

// Zanjir (chaining) — filter + map + reduce
const activeAdultAvgAge = users
  .filter(u => u.active && u.age >= 18)
  .map(u => u.age)
  .reduce((sum, age, _, arr) => sum + age / arr.length, 0)
// (25 + 30) / 2 = 27.5`,
      description: 'filter shartga mos elementlarni tanlaydi, map o\'zgartiradi, reduce bitta qiymatga yig\'adi. Ularni zanjirlab ishlatish — eng kuchli pattern.',
    },
    {
      title: 'reduce bilan murakkab misollar',
      language: 'js',
      code: `const products = [
  { name: "Olma", category: "meva", price: 5000 },
  { name: "Sabzi", category: "sabzavot", price: 3000 },
  { name: "Banan", category: "meva", price: 8000 },
  { name: "Kartoshka", category: "sabzavot", price: 2000 },
]

// 1. groupBy — kategoriya bo'yicha guruhlash
const grouped = products.reduce((acc, item) => {
  const key = item.category
  if (!acc[key]) acc[key] = []
  acc[key].push(item)
  return acc
}, {})
// { meva: [...], sabzavot: [...] }

// Object.groupBy (ES2024) — yangi standart:
const grouped2 = Object.groupBy(products, p => p.category)

// 2. pipe — funksiyalarni ketma-ket bajarish
const pipe = (...fns) => (val) =>
  fns.reduce((acc, fn) => fn(acc), val)

const process = pipe(
  x => x * 2,
  x => x + 10,
  x => String(x)
)
process(5) // "20"

// 3. Massivni unique qilish
const nums = [1, 2, 2, 3, 3, 4]
const unique = nums.reduce((acc, n) => {
  if (!acc.includes(n)) acc.push(n)
  return acc
}, [])
// [1, 2, 3, 4]  (Set bilan ham bo'ladi: [...new Set(nums)])

// 4. Nested massivni tekislash (flatten)
const nested = [[1, 2], [3, [4, 5]], [6]]
const flatten = (arr) =>
  arr.reduce((acc, val) =>
    acc.concat(Array.isArray(val) ? flatten(val) : val), [])
flatten(nested) // [1, 2, 3, 4, 5, 6]`,
      description: 'reduce — eng universal metod. groupBy, pipe, unique, flatten kabi murakkab operatsiyalarni bajarish mumkin.',
    },
    {
      title: 'ES2023+ immutable metodlar',
      language: 'js',
      code: `const numbers = [3, 1, 4, 1, 5, 9]

// sort() ASLINI o'zgartiradi:
const sorted1 = numbers.sort((a, b) => a - b)
console.log(numbers) // [1, 1, 3, 4, 5, 9] — BUZILDI!

// toSorted() YANGI massiv qaytaradi:
const original = [3, 1, 4, 1, 5, 9]
const sorted2 = original.toSorted((a, b) => a - b)
console.log(original) // [3, 1, 4, 1, 5, 9] — saqlanib qoldi!
console.log(sorted2)  // [1, 1, 3, 4, 5, 9]

// toReversed()
const reversed = original.toReversed()
// [9, 5, 1, 4, 1, 3] — original o'zgarmadi

// toSpliced(start, deleteCount, ...items)
const fruits = ["olma", "banan", "uzum"]
const updated = fruits.toSpliced(1, 1, "anor")
// ["olma", "anor", "uzum"] — fruits o'zgarmadi

// with(index, value) — bitta elementni almashtirish
const colors = ["qizil", "yashil", "ko'k"]
const newColors = colors.with(1, "sariq")
// ["qizil", "sariq", "ko'k"] — colors o'zgarmadi

// React state bilan ishlatish:
// setState(prev => prev.toSorted((a, b) => a - b))
// setState(prev => prev.with(index, newValue))`,
      description: 'ES2023 immutable metodlari — toSorted, toReversed, toSpliced, with. Asl massivni o\'zgartirmaydi, React state uchun ideal.',
    },
    {
      title: 'find, some, every, includes — qidirish',
      language: 'js',
      code: `const users = [
  { id: 1, name: "Ali", role: "admin" },
  { id: 2, name: "Vali", role: "user" },
  { id: 3, name: "Soli", role: "user" },
]

// find — birinchi mos elementni qaytaradi (yoki undefined)
const admin = users.find(u => u.role === "admin")
// { id: 1, name: "Ali", role: "admin" }

// findIndex — birinchi mos element indeksi (-1 agar topilmasa)
const idx = users.findIndex(u => u.name === "Vali")
// 1

// findLast / findLastIndex (ES2023)
const nums = [1, 2, 3, 4, 5, 6]
const lastEven = nums.findLast(n => n % 2 === 0) // 6
const lastEvenIdx = nums.findLastIndex(n => n % 2 === 0) // 5

// some — kamida BITTA element shartga mosmi?
const hasAdmin = users.some(u => u.role === "admin") // true

// every — BARCHA elementlar shartga mosmi?
const allAdmins = users.every(u => u.role === "admin") // false

// includes — oddiy qiymat mavjudmi?
const fruits = ["olma", "banan", "uzum"]
fruits.includes("banan") // true

// MUHIM: includes NaN ni to'g'ri tekshiradi
[1, NaN, 3].includes(NaN)   // true
[1, NaN, 3].indexOf(NaN)    // -1 (indexOf ishlamaydi!)`,
      description: 'Qidirish metodlari: find/findLast element qaytaradi, some/every boolean qaytaradi, includes oddiy qiymatni tekshiradi.',
    },
    {
      title: 'flat, flatMap, Array.from, at()',
      language: 'js',
      code: `// flat — ichki massivlarni tekislash
const nested = [1, [2, 3], [4, [5, 6]]]
nested.flat()     // [1, 2, 3, 4, [5, 6]]  — 1 daraja
nested.flat(2)    // [1, 2, 3, 4, 5, 6]    — 2 daraja
nested.flat(Infinity) // barcha darajalarni tekislaydi

// flatMap — map + flat(1)
const sentences = ["Salom dunyo", "React yaxshi"]
const words = sentences.flatMap(s => s.split(" "))
// ["Salom", "dunyo", "React", "yaxshi"]

// Array.from — iterable/array-like dan massiv
Array.from("salom")           // ["s", "a", "l", "o", "m"]
Array.from({ length: 3 })     // [undefined, undefined, undefined]
Array.from({ length: 5 }, (_, i) => i * 2)  // [0, 2, 4, 6, 8]

// NodeList ni massivga aylantirish (DOM)
const divs = Array.from(document.querySelectorAll("div"))

// Set ni massivga
const unique = Array.from(new Set([1, 2, 2, 3]))  // [1, 2, 3]

// at() — manfiy indeks bilan ishlaydi
const arr = [10, 20, 30, 40, 50]
arr.at(0)   // 10
arr.at(-1)  // 50  (oxirgi)
arr.at(-2)  // 40  (oxirgidan oldingi)
// arr[arr.length - 1] o'rniga arr.at(-1) — toza va qulay`,
      description: 'flat/flatMap ichki massivlarni tekislaydi, Array.from har qanday iterable-dan massiv yaratadi, at() manfiy indeksni qo\'llaydi.',
    },
  ],
  interviewQA: [
    {
      question: 'map va forEach farqi nima? Qachon qaysi biri ishlatiladi?',
      answer: 'map YANGI massiv qaytaradi — har bir elementni o\'zgartirish va natijani saqlash uchun. forEach hech narsa qaytarmaydi (undefined) — faqat side-effect uchun (log, DOM o\'zgartirish). MUHIM farq: map ichida return bo\'lishi SHART, forEach-da return ma\'nosiz. Yana: forEach ichida break/continue ishlamaydi va async/await to\'g\'ri ishlamaydi. Agar natija kerak — map, aks holda — forEach yoki for...of.',
    },
    {
      question: 'sort() metodining default xatti-harakati qanday? Nima uchun xavfli?',
      answer: 'sort() default holatda elementlarni STRING sifatida solishtiradi. Shuning uchun [10, 9, 80].sort() natijasi [10, 80, 9] bo\'ladi — chunki "10" < "80" < "9" (string taqqoslash). Sonlarni to\'g\'ri saralash uchun DOIM comparator berish kerak: sort((a, b) => a - b). Yana bir xavf — sort() MUTATING metod, asl massivni o\'zgartiradi. React state bilan ishlaganda [...arr].sort() yoki toSorted() ishlatish kerak.',
    },
    {
      question: 'reduce bilan qanday murakkab operatsiyalar bajarish mumkin?',
      answer: 'reduce — eng universal massiv metodi. U bilan: 1) groupBy — elementlarni kategoriya bo\'yicha guruhlash, 2) pipe/compose — funksiyalarni zanjirlab bajarish, 3) flatten — nested massivni tekislash, 4) unique — takroriy elementlarni olib tashlash, 5) counting — har bir element necha marta uchrashganini hisoblash, 6) har qanday map+filter kombinatsiyasini bitta o\'tishda bajarish. MUHIM: initialValue ni DOIM berish kerak, aks holda bo\'sh massivda TypeError bo\'ladi.',
    },
    {
      question: 'ES2023 da qanday yangi massiv metodlari qo\'shildi va nima uchun kerak?',
      answer: 'ES2023 to\'rtta immutable metod qo\'shdi: toSorted() — sort() ning nusxa qaytaruvchi versiyasi, toReversed() — reverse() ning, toSpliced() — splice() ning, with(index, value) — index bo\'yicha elementni almashtirishning immutable versiyasi. Bular kerak chunki React, Redux va boshqa framework-lar immutability talab qiladi. Oldin [...arr].sort() yozish kerak edi, endi arr.toSorted() yetarli. findLast() va findLastIndex() ham ES2023 — massivni OXIRIDAN qidirish imkonini beradi.',
    },
    {
      question: 'Array.from qachon ishlatiladi? Oddiy [...iterable] dan farqi nima?',
      answer: 'Array.from uchta holatda [...spread] dan ustun: 1) Ikkinchi argument sifatida mapFn oladi — Array.from({length:5}, (_, i) => i) kabi massiv generatsiya qilish mumkin, spread bilan bunday qilib bo\'lmaydi. 2) Array-LIKE objectlarni (arguments, NodeList, {length: n}) massivga aylantiradi — spread faqat iterable bilan ishlaydi. 3) String-ni to\'g\'ri split qiladi — emoji va surrogate pair-larni to\'g\'ri ajratadi. Performance jihatdan farq yo\'q, lekin funksionallik jihatdan Array.from kengroq.',
    },
    {
      question: 'splice va slice farqini tushuntiring.',
      answer: 'slice(start, end) — YANGI massiv qaytaradi, aslini o\'zgartirMAYDI. start dan end gacha (end kiritilmaydi) kesib oladi. Manfiy indekslar ishlaydi. splice(start, deleteCount, ...items) — ASLINI O\'ZGARTIRADI. start pozitsiyadan deleteCount ta elementni olib tashlaydi va o\'rniga items qo\'yadi. O\'chirilgan elementlar massivini qaytaradi. Qisqa qoida: slice = nusxa olish (xavfsiz), splice = joyida o\'zgartirish (xavfli). React state bilan faqat slice yoki toSpliced() ishlating.',
    },
  ],
  relatedTopics: [
    { techId: 'javascript', sectionId: 'built-in-methods', topicId: 'string-methods', label: 'String metodlari' },
    { techId: 'javascript', sectionId: 'built-in-methods', topicId: 'json-structured-clone', label: 'JSON va structuredClone' },
  ],
}
