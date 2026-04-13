import type { Topic } from '../../../types'

export const mapSet: Topic = {
  id: 'map-set',
  title: 'Map va Set',
  importance: 2,
  status: 'to-learn',
  description: 'Map vs Object, Set vs Array — qachon nima ishlatiladi',
  content: `═══════════════════════════════════════
  MAP — KALIT-QIYMAT XARITASI
═══════════════════════════════════════

Map — har qanday turdagi kalitga ega bo'lgan kalit-qiymat juftliklari
kolleksiyasi. Object dan farqli, Map kaliti string yoki symbol bo'lishi
shart emas — obyekt, funksiya, hatto NaN ham kalit bo'lishi mumkin.

const map = new Map()
map.set('name', 'Ali')         // String kalit
map.set(42, 'answer')          // Number kalit
map.set(true, 'yes')           // Boolean kalit
map.set({ x: 1 }, 'object')   // Object kalit

═══════════════════════════════════════
  MAP METODLARI
═══════════════════════════════════════

Asosiy metodlar:
1. set(key, value) — kalit-qiymat qo'shish (chaining mumkin)
2. get(key) — qiymat olish (yo'q bo'lsa undefined)
3. has(key) — kalit borligini tekshirish (boolean)
4. delete(key) — elementni o'chirish (boolean)
5. clear() — barcha elementlarni o'chirish
6. size — elementlar soni (property, metod emas)

Iteratsiya metodlari:
7. keys() — barcha kalitlar iteratorini qaytaradi
8. values() — barcha qiymatlar iteratorini qaytaradi
9. entries() — [key, value] juftliklar iteratorini qaytaradi
10. forEach(callback) — har bir element uchun callback

MUHIM: Map elementlar KIRITILISH TARTIBINI saqlaydi.
Object ham ES2015+ da tartibni saqlaydi, lekin integer kalitlar
avval tartiblangan holda ko'rsatiladi. Map da bunday muammo yo'q.

═══════════════════════════════════════
  MAP VS OBJECT — QACHON NIMA
═══════════════════════════════════════

MAP tanlang qachon:
1. Kalitlar string/symbol emas (number, object, function)
2. Elementlar soni tez-tez kerak (map.size — O(1))
3. Tez-tez qo'shish/o'chirish operatsiyalari
4. Iteratsiya tartibi muhim
5. Kalit-qiymat juftliklari soni oldindan noma'lum

OBJECT tanlang qachon:
1. JSON bilan ishlash kerak (Map to'g'ridan-to'g'ri serializatsiya qilinmaydi)
2. Kalitlar faqat string/symbol
3. Prototip metodlari kerak
4. Destrukturing ishlatmoqchisiz
5. Record/struct sifatida ishlatiladi

MUHIM: Katta hajmdagi kalit-qiymat ma'lumotlari uchun Map tezroq
ishlaydi — ayniqsa tez-tez qo'shish va o'chirish operatsiyalarida.

═══════════════════════════════════════
  SET — NOYOB QIYMATLAR TO'PLAMI
═══════════════════════════════════════

Set — faqat NOYOB qiymatlarni saqlaydigan kolleksiya. Takroriy
qiymat qo'shilsa, u e'tiborga olinmaydi. Tenglik tekshiruvi
SameValueZero algoritmi bilan amalga oshiriladi (=== ga o'xshash,
lekin NaN === NaN true deb hisoblanadi).

const set = new Set([1, 2, 3, 2, 1])
console.log(set.size)  // 3 — takrorlar olib tashlandi

Asosiy metodlar:
1. add(value) — element qo'shish (chaining mumkin)
2. has(value) — element borligini tekshirish
3. delete(value) — elementni o'chirish
4. clear() — barcha elementlarni o'chirish
5. size — elementlar soni

Iteratsiya:
6. keys() / values() — bir xil (Set da kalit = qiymat)
7. entries() — [value, value] juftliklar
8. forEach(callback)

═══════════════════════════════════════
  SET OPERATSIYALARI
═══════════════════════════════════════

ES2025 dan boshlab Set da o'rnatilgan metodlar:

1. union(other) — birlashma (A ∪ B)
2. intersection(other) — kesishma (A ∩ B)
3. difference(other) — ayirma (A \\ B)
4. symmetricDifference(other) — simmetrik ayirma
5. isSubsetOf(other) — A ⊆ B tekshiruvi
6. isSupersetOf(other) — A ⊇ B tekshiruvi
7. isDisjointFrom(other) — kesishmaydi tekshiruvi

Eski muhitlarda qo'lda amalga oshirish kerak:
- Union: new Set([...a, ...b])
- Intersection: new Set([...a].filter(x => b.has(x)))
- Difference: new Set([...a].filter(x => !b.has(x)))

═══════════════════════════════════════
  AMALIY QO'LLANILISH
═══════════════════════════════════════

Map uchun:
1. Kesh/memo — funksiya natijalarini argument bo'yicha saqlash
2. Hisoblagich — elementlar chastotasini hisoblash
3. Grafik/xarita ma'lumotlari — murakkab kalit tuzilmalar
4. Konfiguratsiya — dinamik sozlamalar

Set uchun:
1. Dublikatlarni olib tashlash — [...new Set(array)]
2. Teglar/kategoriyalar — noyob qiymatlar to'plami
3. Tezkor has() tekshiruvi — Array.includes() dan tezroq
4. Ma'lumotlar filtratsiyasi — union, intersection operatsiyalari`,
  codeExamples: [
    {
      title: 'Map — asosiy operatsiyalar',
      language: 'js',
      code: `// Map yaratish va metodlar
const userRoles = new Map()

// set() — chaining mumkin
userRoles
  .set('ali', 'admin')
  .set('vali', 'editor')
  .set('jasur', 'viewer')

// get(), has(), size
console.log(userRoles.get('ali'))     // 'admin'
console.log(userRoles.has('vali'))    // true
console.log(userRoles.size)           // 3

// Array dan Map yaratish
const fromArray = new Map([
  ['key1', 'value1'],
  ['key2', 'value2']
])

// Object dan Map yaratish
const obj = { a: 1, b: 2, c: 3 }
const fromObj = new Map(Object.entries(obj))
console.log(fromObj.get('b'))  // 2

// Map dan Object ga qaytarish
const backToObj = Object.fromEntries(fromObj)
console.log(backToObj)  // { a: 1, b: 2, c: 3 }

// Iteratsiya
for (const [key, value] of userRoles) {
  console.log(\`\${key}: \${value}\`)
}

// Destrukturing bilan forEach
userRoles.forEach((value, key) => {
  console.log(\`\${key} → \${value}\`)
})`,
      description: 'Map yaratish, o\'qish, yozish va iteratsiya',
    },
    {
      title: 'Map — har qanday kalit turi',
      language: 'js',
      code: `// Object kalitlar — Map ning asosiy afzalligi
const componentState = new Map()

// DOM element kalit sifatida
const btn = document.querySelector('#submit')
componentState.set(btn, { disabled: false, loading: false })

// Function kalit sifatida
function validate() { /* ... */ }
componentState.set(validate, { lastRun: Date.now() })

// Object kalit sifatida
const user = { id: 1, name: 'Ali' }
componentState.set(user, { online: true })

console.log(componentState.get(btn))  // { disabled: false, loading: false }

// ═══════════════════════════════════════

// Chastota hisoblagich
function countWords(text) {
  const freq = new Map()

  for (const word of text.toLowerCase().split(/\\s+/)) {
    freq.set(word, (freq.get(word) || 0) + 1)
  }

  // Eng ko'p uchragan so'zlar (tartiblash)
  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
}

const text = 'the cat sat on the mat the cat'
console.log(countWords(text))
// [['the', 3], ['cat', 2], ['sat', 1], ['on', 1], ['mat', 1]]`,
      description: 'Har qanday turdagi kalit va chastota hisoblagich',
    },
    {
      title: 'Set — noyob qiymatlar va dublikat olib tashlash',
      language: 'js',
      code: `// Set — noyob qiymatlar
const tags = new Set(['react', 'javascript', 'react', 'css', 'javascript'])
console.log(tags.size)      // 3 — dublikatlar olib tashlandi
console.log([...tags])      // ['react', 'javascript', 'css']

// Array dublikatlarni olib tashlash
const numbers = [1, 5, 3, 2, 5, 1, 4, 3]
const unique = [...new Set(numbers)]
console.log(unique)  // [1, 5, 3, 2, 4]

// Tezkor tekshiruv — O(1) vs Array.includes() O(n)
const allowedOrigins = new Set([
  'https://example.com',
  'https://api.example.com',
  'http://localhost:3000'
])

function isAllowed(origin) {
  return allowedOrigins.has(origin)  // O(1) — juda tez
}

// NaN va reference tekshiruvi
const set = new Set()
set.add(NaN)
set.add(NaN)
console.log(set.size)  // 1 — NaN === NaN Set da

const obj1 = { a: 1 }
const obj2 = { a: 1 }
set.add(obj1)
set.add(obj2)
console.log(set.size)  // 3 — ikki turli referens`,
      description: 'Set bilan noyob qiymatlar va tezkor tekshiruv',
    },
    {
      title: 'Set operatsiyalari — union, intersection, difference',
      language: 'js',
      code: `const frontend = new Set(['HTML', 'CSS', 'JavaScript', 'React'])
const backend = new Set(['Node.js', 'Python', 'JavaScript', 'SQL'])

// ES2025 Set metodlari
// (eski muhitda qo'lda qilish)

// Union — birlashma (A ∪ B)
const allSkills = frontend.union(backend)
// yoki: new Set([...frontend, ...backend])
console.log([...allSkills])
// ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'Python', 'SQL']

// Intersection — kesishma (A ∩ B)
const common = frontend.intersection(backend)
// yoki: new Set([...frontend].filter(x => backend.has(x)))
console.log([...common])  // ['JavaScript']

// Difference — ayirma (A \\ B)
const onlyFrontend = frontend.difference(backend)
// yoki: new Set([...frontend].filter(x => !backend.has(x)))
console.log([...onlyFrontend])  // ['HTML', 'CSS', 'React']

// Symmetric difference — simmetrik ayirma
const exclusive = frontend.symmetricDifference(backend)
console.log([...exclusive])
// ['HTML', 'CSS', 'React', 'Node.js', 'Python', 'SQL']

// Subset tekshiruvi
const jsOnly = new Set(['JavaScript'])
console.log(jsOnly.isSubsetOf(frontend))  // true
console.log(frontend.isSupersetOf(jsOnly))  // true`,
      description: 'To\'plam operatsiyalari: birlashma, kesishma, ayirma',
    },
    {
      title: 'Map va Set — amaliy misollar',
      language: 'js',
      code: `// LRU Cache (Map tartibi bilan)
class LRUCache {
  #cache = new Map()
  #maxSize

  constructor(maxSize = 10) {
    this.#maxSize = maxSize
  }

  get(key) {
    if (!this.#cache.has(key)) return undefined

    // Elementni oxiriga ko'chirish (eng yangi)
    const value = this.#cache.get(key)
    this.#cache.delete(key)
    this.#cache.set(key, value)
    return value
  }

  set(key, value) {
    if (this.#cache.has(key)) {
      this.#cache.delete(key)
    } else if (this.#cache.size >= this.#maxSize) {
      // Eng eski (birinchi) elementni o'chirish
      const oldestKey = this.#cache.keys().next().value
      this.#cache.delete(oldestKey)
    }
    this.#cache.set(key, value)
  }
}

const cache = new LRUCache(3)
cache.set('a', 1)
cache.set('b', 2)
cache.set('c', 3)
cache.get('a')      // 'a' ni yangiladi
cache.set('d', 4)   // 'b' o'chirildi (eng eski)

// ═══════════════════════════════════════

// Guruhlashtirish
function groupBy(items, keyFn) {
  const groups = new Map()
  for (const item of items) {
    const key = keyFn(item)
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key).push(item)
  }
  return groups
}

const users = [
  { name: 'Ali', city: 'Toshkent' },
  { name: 'Vali', city: 'Samarqand' },
  { name: 'Jasur', city: 'Toshkent' },
]

const byCity = groupBy(users, u => u.city)
console.log(byCity.get('Toshkent'))
// [{ name: 'Ali', city: 'Toshkent' }, { name: 'Jasur', ... }]`,
      description: 'LRU Cache va guruhlashtirish — Map tartibi asosida',
    },
  ],
  interviewQA: [
    {
      question: 'Map va Object ning asosiy farqlari nimada?',
      answer: '1) Kalit turlari — Object faqat string/symbol, Map har qanday tur (object, function, number). 2) Tartib — Map kiritilish tartibini doim saqlaydi, Object integer kalitlarni tartiblaydi. 3) O\'lcham — Map.size O(1) da, Object uchun Object.keys().length kerak. 4) Ishlash — tez-tez qo\'shish/o\'chirish Map da tezroq. 5) Iteratsiya — Map to\'g\'ridan-to\'g\'ri iterable, Object uchun Object.keys/entries kerak. 6) Prototip — Object da prototype bor (kalit to\'qnashuvi mumkin), Map da yo\'q.',
    },
    {
      question: 'Set nima va Array dan qanday farq qiladi?',
      answer: 'Set — faqat noyob qiymatlarni saqlaydigan kolleksiya. Array dan farqlari: 1) Set dublikatlarga ruxsat bermaydi. 2) Set.has() O(1) tezlikda ishlaydi, Array.includes() O(n). 3) Set da index yo\'q — tartib bor lekin indeks bilan murojaat mumkin emas. 4) Set da push/pop/splice kabi metodlar yo\'q, add/delete bor. Set asosan dublikatlarni olib tashlash, tezkor mavjudlik tekshiruvi va to\'plam operatsiyalari uchun ishlatiladi.',
    },
    {
      question: 'Map ni JSON ga qanday aylantirish mumkin?',
      answer: 'Map to\'g\'ridan-to\'g\'ri JSON.stringify() bilan serializatsiya qilinmaydi — bo\'sh obyekt qaytaradi. Yechimlar: 1) Object ga aylantirish: Object.fromEntries(map) — faqat string kalitlar uchun ishlaydi. 2) Array ga aylantirish: [...map] yoki Array.from(map) — [key, value] juftliklar arrayini beradi, JSON.stringify([...map]) ishlaydi. 3) replacer funksiya: JSON.stringify(map, (key, value) => value instanceof Map ? Object.fromEntries(value) : value). Deserializatsiya: new Map(JSON.parse(json)).',
    },
    {
      question: 'Set yordamida qanday to\'plam operatsiyalarini bajarish mumkin?',
      answer: 'ES2025 dan boshlab Set da o\'rnatilgan metodlar bor: union(other) — birlashma, intersection(other) — kesishma, difference(other) — ayirma, symmetricDifference(other) — simmetrik ayirma, isSubsetOf/isSupersetOf — qism to\'plam tekshiruvi. Eski muhitlarda: Union — new Set([...a, ...b]); Intersection — new Set([...a].filter(x => b.has(x))); Difference — new Set([...a].filter(x => !b.has(x))). Bu operatsiyalar tags, permissions, kategoriyalar bilan ishlashda juda foydali.',
    },
    {
      question: 'Map qaysi holatlarda Object dan afzal?',
      answer: '1) Kalitlar primitiv emas — masalan, DOM element yoki object kalit bo\'lishi kerak bo\'lganda. 2) Katta hajmdagi dinamik ma\'lumotlar — Map qo\'shish/o\'chirish operatsiyalarida tezroq. 3) Tartib muhim — Map doim kiritilish tartibini saqlaydi. 4) O\'lchamni bilish kerak — map.size O(1), Object.keys() O(n). 5) Tez-tez iteratsiya — Map bevosita iterable, for...of ishlaydi. Object faqat JSON operatsiyalari, destrukturing va oddiy record/struct sifatida afzal.',
    },
  ],
}
