import type { Topic } from '../../../types'

export const hashTable: Topic = {
  id: 'hash-table',
  title: 'Hash Table (Xesh Jadval)',
  importance: 3,
  status: 'to-learn',
  description: 'Hash function, collision, Map/Set, O(1) lookup',
  content: `Hash Table — dasturlashdagi eng muhim data structure lardan biri. U key-value juftliklarini saqlaydi va O(1) vaqtda qidirish, qo'shish va o'chirish imkonini beradi. JavaScript da Object, Map va Set — barchasi hash table asosida ishlaydi.

═══════════════════════════════════════
  HASH TABLE QANDAY ISHLAYDI?
═══════════════════════════════════════

Hash Table ning ishlash prinsipi:

  key → hash function → index → value (massivda)

1. Sizda KEY bor (masalan: "name")
2. Hash function bu key ni RAQAMGA aylantiradi (masalan: 7)
3. Bu raqam — ichki massivdagi INDEX
4. VALUE shu indexga saqlanadi

Misol:
  "name"  → hash("name")  → 7  → arr[7] = "Ali"
  "age"   → hash("age")   → 3  → arr[3] = 25
  "city"  → hash("city")  → 12 → arr[12] = "Toshkent"

Qidirish ham xuddi shunday:
  get("name") → hash("name") → 7 → arr[7] → "Ali"

Shuning uchun qidirish O(1) — massivda indexga murojaat qilish doimiy vaqt oladi.

═══════════════════════════════════════
  HASH FUNCTION
═══════════════════════════════════════

Yaxshi hash function xususiyatlari:
1. DETERMINISTIK — bir xil key doim bir xil natija beradi
2. TEZKOR — hisoblash vaqti O(1) bo'lishi kerak
3. TENG TAQSIMOT — turli key lar turli indexlarga tushishi kerak
4. FIXED RANGE — natija massiv o'lchami ichida bo'lishi kerak

Oddiy hash function misoli:
  function hash(key, size) {
    let total = 0
    for (let char of key) {
      total += char.charCodeAt(0)
    }
    return total % size
  }

Muammo: turli key lar bir xil indexga tushishi mumkin!
"abc" va "cab" — ikkalasi ham bir xil yig'indiga ega.
Bu COLLISION deyiladi.

═══════════════════════════════════════
  COLLISION VA UNI HAL QILISH
═══════════════════════════════════════

Collision — ikki turli key bir xil hash indexga tushganda sodir bo'ladi.

▸ 1. CHAINING (Zanjir usuli)
  Har bir index da massiv yoki linked list saqlanadi.
  Collision bo'lganda yangi element shu ro'yxatga qo'shiladi.

  index 7: [["name", "Ali"], ["hobby", "chess"]]

  + Oddiy implementatsiya
  + Hash table to'lganda ham ishlaydi
  - Xotirada qo'shimcha joy (linked list/massiv)
  - Worst case O(n) — agar barcha elementlar bitta indexga tushsa

▸ 2. OPEN ADDRESSING (Ochiq adreslash)
  Collision bo'lganda boshqa bo'sh joy qidiriladi.

  a) Linear Probing — keyingi bo'sh joyni tekshirish (index+1, index+2, ...)
  b) Quadratic Probing — kvadratik qadamlar (index+1, index+4, index+9, ...)
  c) Double Hashing — ikkinchi hash function bilan yangi index hisoblash

  + Qo'shimcha xotira sarflanmaydi
  - Clustering muammosi (elementlar guruhlashib qoladi)
  - Load factor yuqori bo'lganda sekinlashadi

▸ LOAD FACTOR
  Load factor = elementlar soni / massiv o'lchami
  Odatda 0.7-0.75 dan oshganda massiv kattalashtiriladi (resize).
  JavaScript Map avtomatik resize qiladi.

═══════════════════════════════════════
  JAVASCRIPT DA HASH TABLE LAR
═══════════════════════════════════════

JavaScript da hash table ning 4 ta turi bor:

▸ 1. Object — oddiy key-value
  const obj = { name: 'Ali', age: 25 }
  obj.name      // 'Ali'
  obj['age']    // 25

▸ 2. Map — zamonaviy hash table
  const map = new Map()
  map.set('name', 'Ali')
  map.get('name')  // 'Ali'
  map.has('name')  // true
  map.size         // 1

▸ 3. Set — faqat noyob qiymatlar (value siz)
  const set = new Set([1, 2, 3, 3])
  set.has(2)    // true
  set.size      // 3 (dublikat yo'q)

▸ 4. WeakMap / WeakSet — garbage collection bilan
  Key faqat object bo'lishi kerak.
  Object ga boshqa reference yo'q bo'lsa — avtomatik o'chiriladi.
  Iteration qilib bo'lmaydi.

═══════════════════════════════════════
  OBJECT vs MAP — MUHIM FARQLAR
═══════════════════════════════════════

  | Xususiyat          | Object           | Map                |
  |--------------------|------------------|--------------------|
  | Key turi           | string / symbol  | HAR QANDAY tur     |
  | Tartib             | kafolatlanmagan* | qo'shilish tartibi |
  | O'lcham            | qo'lda hisoblash | map.size            |
  | Iteration          | Object.keys()    | map.forEach()      |
  | Performance        | kam elementlar   | ko'p elementlar    |
  | Prototype          | bor (xavfli)     | yo'q               |
  | JSON serialization | ha               | yo'q (to'g'ridan)  |
  | Default keys       | bor (toString..) | yo'q               |

  * Object da ham ES2015+ dan beri integer key lar tartiblangan,
    keyin string key lar qo'shilish tartibida.

  QACHON MAP ISHLATISH KERAK:
  - Key sifatida object/function kerak bo'lganda
  - Tez-tez qo'shish/o'chirish amalga oshirilganda
  - Elementlar soni ko'p bo'lganda (10,000+)
  - Key lar oldindan noma'lum bo'lganda

  QACHON OBJECT ISHLATISH KERAK:
  - JSON bilan ishlashda
  - Ma'lum strukturali ma'lumot uchun (config, options)
  - Kam elementlar bo'lganda
  - Destructuring kerak bo'lganda

═══════════════════════════════════════
  O(1) — NEGA "AVERAGE"?
═══════════════════════════════════════

Hash Table ning murakkabligi:

  | Operatsiya | Average | Worst Case |
  |------------|---------|------------|
  | Qidirish   | O(1)    | O(n)       |
  | Qo'shish   | O(1)    | O(n)       |
  | O'chirish  | O(1)    | O(n)       |

Nega worst case O(n)?
- Agar hash function yomon bo'lsa — barcha key lar bitta indexga tushadi
- Chaining da bitta joyda linked list o'sib ketadi
- Shu linked list ni traverse qilish O(n) vaqt oladi

Amalda esa yaxshi hash function va to'g'ri resize bilan
DEYARLI DOIM O(1) ishlaydi.

═══════════════════════════════════════
  REAL-WORLD QOLLANISH
═══════════════════════════════════════

1. COUNTING (sanash)
   Har bir elementni necha marta uchrashini hisoblash.
   Masalan: so'zlar chastotasi, symbollar soni.

2. DEDUPLICATION (dublikatlarni olib tashlash)
   Set yoki Map bilan noyob elementlarni ajratish.

3. CACHING / MEMOIZATION
   Hisoblangan natijalarni saqlash — qayta hisoblashning oldini olish.

4. TWO SUM masalasi
   Massivdan ikki son topish — ularning yig'indisi target ga teng.
   Hash table bilan O(n) da yechiladi.

5. GROUPING (guruhlash)
   Elementlarni biror belgisi bo'yicha guruhlash.
   Masalan: anagramlarni guruhlash.

6. INDEX / LOOKUP TABLE
   Tez qidirish uchun ma'lumotlarni indekslash.
   Masalan: ID bo'yicha foydalanuvchini topish.`.trim(),
  codeExamples: [
    {
      title: 'HashTable class — to\'liq implementatsiya',
      language: 'js',
      description: 'Hash function, chaining bilan collision handling, set/get/delete/keys metodlari.',
      code: `class HashTable {
  constructor(size = 53) {
    this.table = new Array(size)
    this.size = size
    this.count = 0
  }

  // Hash function — key ni indexga aylantiradi
  _hash(key) {
    let total = 0
    const PRIME = 31 // Tub son — yaxshiroq taqsimot beradi
    for (let i = 0; i < Math.min(key.length, 100); i++) {
      const char = key[i]
      const value = char.charCodeAt(0) - 96
      total = (total * PRIME + value) % this.size
    }
    return total
  }

  // Qo'shish yoki yangilash — O(1) average
  set(key, value) {
    const index = this._hash(key)
    if (!this.table[index]) {
      this.table[index] = []
    }
    // Agar key mavjud bo'lsa — yangilash
    const existing = this.table[index].find(pair => pair[0] === key)
    if (existing) {
      existing[1] = value
    } else {
      this.table[index].push([key, value])
      this.count++
    }
    return this
  }

  // Qidirish — O(1) average
  get(key) {
    const index = this._hash(key)
    const bucket = this.table[index]
    if (bucket) {
      const pair = bucket.find(pair => pair[0] === key)
      if (pair) return pair[1]
    }
    return undefined
  }

  // O'chirish — O(1) average
  delete(key) {
    const index = this._hash(key)
    const bucket = this.table[index]
    if (bucket) {
      const pairIndex = bucket.findIndex(pair => pair[0] === key)
      if (pairIndex !== -1) {
        bucket.splice(pairIndex, 1)
        this.count--
        return true
      }
    }
    return false
  }

  // Barcha key larni olish
  keys() {
    const allKeys = []
    for (const bucket of this.table) {
      if (bucket) {
        for (const [key] of bucket) {
          allKeys.push(key)
        }
      }
    }
    return allKeys
  }

  // Barcha value larni olish
  values() {
    const allValues = []
    for (const bucket of this.table) {
      if (bucket) {
        for (const [, value] of bucket) {
          allValues.push(value)
        }
      }
    }
    return allValues
  }
}

// Ishlatish
const ht = new HashTable()
ht.set('name', 'Ali')
ht.set('age', 25)
ht.set('city', 'Toshkent')

console.log(ht.get('name'))  // 'Ali'
console.log(ht.get('age'))   // 25

ht.set('name', 'Vali')       // Yangilash
console.log(ht.get('name'))  // 'Vali'

ht.delete('city')
console.log(ht.get('city'))  // undefined

console.log(ht.keys())       // ['name', 'age']
console.log(ht.count)        // 2`,
    },
    {
      title: 'Map vs Object — farqlar va benchmark',
      language: 'js',
      description: 'Map va Object ning amaliy farqlari: key turlari, iteration, performance, prototip xavfsizligi.',
      code: `// ═══════════════════════════════════
// 1. KEY TURLARI
// ═══════════════════════════════════

// Object — faqat string va symbol
const obj = {}
obj[1] = 'bir'          // "1" ga aylanadi
obj[true] = 'ha'        // "true" ga aylanadi
obj[{ a: 1 }] = 'test'  // "[object Object]" ga aylanadi!
console.log(Object.keys(obj)) // ["1", "true", "[object Object]"]

// Map — har qanday tur
const map = new Map()
map.set(1, 'bir')             // number key
map.set(true, 'ha')           // boolean key
map.set({ a: 1 }, 'test')    // object key (reference bo'yicha)

const fn = () => {}
map.set(fn, 'function key')  // function key ham mumkin!

// ═══════════════════════════════════
// 2. TARTIB VA O'LCHAM
// ═══════════════════════════════════

// Map — qo'shilish tartibini kafolatlaydi
const orderedMap = new Map()
orderedMap.set('z', 1)
orderedMap.set('a', 2)
orderedMap.set('m', 3)
console.log([...orderedMap.keys()]) // ['z', 'a', 'm'] — tartib saqlanadi

// Map.size — O(1) da o'lcham
console.log(orderedMap.size) // 3

// Object — qo'lda hisoblash kerak
const myObj = { z: 1, a: 2, m: 3 }
console.log(Object.keys(myObj).length) // 3 — O(n)

// ═══════════════════════════════════
// 3. ITERATION
// ═══════════════════════════════════

// Map — to'g'ridan-to'g'ri iterable
const userMap = new Map([
  ['name', 'Ali'],
  ['age', 25],
  ['city', 'Toshkent'],
])

// for...of bilan
for (const [key, value] of userMap) {
  console.log(\`\${key}: \${value}\`)
}

// forEach bilan
userMap.forEach((value, key) => {
  console.log(\`\${key}: \${value}\`)
})

// Destructuring
const entries = [...userMap]         // [['name','Ali'], ['age',25], ...]
const keys = [...userMap.keys()]     // ['name', 'age', 'city']
const values = [...userMap.values()] // ['Ali', 25, 'Toshkent']

// ═══════════════════════════════════
// 4. PROTOTYPE XAVFSIZLIGI
// ═══════════════════════════════════

// Object — prototype key lari bilan to'qnashish
const config = {}
config['toString'] = 'test'
console.log(config.toString) // 'test' — asl metod YO'QOLDI!

// Xavfsiz variant
const safeObj = Object.create(null) // prototype yo'q
safeObj['toString'] = 'test' // xavfsiz

// Map — bunday muammo yo'q
const safeMap = new Map()
safeMap.set('toString', 'test') // xavfsiz, to'qnashish yo'q

// ═══════════════════════════════════
// 5. PERFORMANCE TAQQOSLASH
// ═══════════════════════════════════

// Ko'p elementlar bilan ishlashda Map tezroq
function benchmark(label, fn) {
  const start = performance.now()
  fn()
  console.log(\`\${label}: \${(performance.now() - start).toFixed(2)}ms\`)
}

const N = 100_000

benchmark('Object set', () => {
  const o = {}
  for (let i = 0; i < N; i++) o['key' + i] = i
})

benchmark('Map set', () => {
  const m = new Map()
  for (let i = 0; i < N; i++) m.set('key' + i, i)
})

benchmark('Object get', () => {
  const o = {}
  for (let i = 0; i < N; i++) o['key' + i] = i
  for (let i = 0; i < N; i++) o['key' + i]
})

benchmark('Map get', () => {
  const m = new Map()
  for (let i = 0; i < N; i++) m.set('key' + i, i)
  for (let i = 0; i < N; i++) m.get('key' + i)
})

// Natija: ko'p elementlarda Map sezilarli tezroq,
// kam elementlarda Object biroz tezroq`,
    },
    {
      title: 'Hash Table bilan masalalar — twoSum, groupAnagrams, firstNonRepeating',
      language: 'js',
      description: 'Hash Table yordamida yechiluvchi klassik intervyu masalalari.',
      code: `// ═══════════════════════════════════
// 1. TWO SUM — O(n) yechim
// ═══════════════════════════════════
// Massivdan ikki son top — yig'indisi target ga teng

function twoSum(nums, target) {
  const map = new Map() // qiymat → index

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i]

    if (map.has(complement)) {
      return [map.get(complement), i]
    }

    map.set(nums[i], i)
  }

  return null // topilmadi
}

console.log(twoSum([2, 7, 11, 15], 9))  // [0, 1] — 2 + 7 = 9
console.log(twoSum([3, 2, 4], 6))       // [1, 2] — 2 + 4 = 6

// Brute force O(n²) o'rniga hash table bilan O(n)!
// Har bir element uchun "menga kerakli son bormi?" deb map dan tekshiramiz

// ═══════════════════════════════════
// 2. GROUP ANAGRAMS
// ═══════════════════════════════════
// So'zlarni anagram guruhlariga ajratish

function groupAnagrams(strs) {
  const map = new Map()

  for (const str of strs) {
    // So'zdagi harflarni tartiblash — anagramlar bir xil key ga ega
    const key = str.split('').sort().join('')

    if (!map.has(key)) {
      map.set(key, [])
    }
    map.get(key).push(str)
  }

  return [...map.values()]
}

console.log(groupAnagrams(['eat', 'tea', 'tan', 'ate', 'nat', 'bat']))
// [['eat', 'tea', 'ate'], ['tan', 'nat'], ['bat']]

// ═══════════════════════════════════
// 3. FIRST NON-REPEATING CHARACTER
// ═══════════════════════════════════
// Birinchi takrorlanmaydigan harfni topish

function firstNonRepeating(str) {
  const charCount = new Map()

  // 1-bosqich: har bir harfni sanash
  for (const char of str) {
    charCount.set(char, (charCount.get(char) || 0) + 1)
  }

  // 2-bosqich: birinchi 1 marta uchragan harfni topish
  for (const char of str) {
    if (charCount.get(char) === 1) {
      return char
    }
  }

  return null
}

console.log(firstNonRepeating('aabcbdce'))  // 'd'
console.log(firstNonRepeating('aabbcc'))    // null

// ═══════════════════════════════════
// 4. FREQUENCY COUNTER (chastota hisoblagich)
// ═══════════════════════════════════
// Ikki massiv bir xil elementlarga egami? (tartib muhim emas)

function sameFrequency(arr1, arr2) {
  if (arr1.length !== arr2.length) return false

  const freq = new Map()

  for (const val of arr1) {
    freq.set(val, (freq.get(val) || 0) + 1)
  }

  for (const val of arr2) {
    if (!freq.has(val) || freq.get(val) === 0) {
      return false
    }
    freq.set(val, freq.get(val) - 1)
  }

  return true
}

console.log(sameFrequency([1, 2, 3], [3, 1, 2]))     // true
console.log(sameFrequency([1, 2, 3], [1, 2, 2]))     // false

// ═══════════════════════════════════
// 5. DEDUPLICATION — Set bilan
// ═══════════════════════════════════

const numbers = [1, 2, 3, 2, 4, 3, 5, 1, 6]
const unique = [...new Set(numbers)]
console.log(unique) // [1, 2, 3, 4, 5, 6]

// Object massivini noyob qilish (id bo'yicha)
const users = [
  { id: 1, name: 'Ali' },
  { id: 2, name: 'Vali' },
  { id: 1, name: 'Ali' },
  { id: 3, name: 'Gani' },
]

const uniqueUsers = [...new Map(users.map(u => [u.id, u])).values()]
console.log(uniqueUsers)
// [{ id: 1, name: 'Ali' }, { id: 2, name: 'Vali' }, { id: 3, name: 'Gani' }]`,
    },
  ],
  interviewQA: [
    {
      question: 'Hash Table qanday ishlaydi? Collision nima?',
      answer: `Hash Table key-value juftliklarini saqlaydi. Ishlash prinsipi: key hash function ga beriladi, hash function uni raqamga (index) aylantiradi, va value shu indexdagi massiv katakchaga saqlanadi. Qidirish ham xuddi shunday — key ni hash qilib, indexdagi qiymatni olamiz. Shuning uchun O(1) da ishlaydi.

COLLISION — ikki turli key bir xil hash indexga tushganda sodir bo'ladi. Masalan hash("abc") = 5 va hash("xyz") = 5. Bu muammoni hal qilishning ikki asosiy usuli bor: 1) Chaining — har bir indexda linked list yoki massiv saqlanadi, collision bo'lganda elementlar shu ro'yxatga qo'shiladi. 2) Open Addressing — collision bo'lganda keyingi bo'sh joyni qidiramiz (linear probing, quadratic probing, double hashing). Chaining oddiyroq va ko'proq ishlatiladi. Yaxshi hash function collision sonini minimallashtirad.`,
    },
    {
      question: 'Object va Map farqi nimada? Qachon qaysi birini ishlatish kerak?',
      answer: `Asosiy farqlar: 1) KEY TURI — Object faqat string/symbol qabul qiladi, Map har qanday turdagi key qabul qiladi (object, function, number). 2) TARTIB — Map qo'shilish tartibini kafolatlaydi, Object da faqat ES2015+ da va shunda ham integer key lar avval keladi. 3) O'LCHAM — Map.size O(1) da, Object uchun Object.keys().length kerak (O(n)). 4) PERFORMANCE — ko'p elementlar bilan ishlashda Map tezroq, ayniqsa tez-tez qo'shish/o'chirish bo'lganda. 5) PROTOTYPE — Object da toString, hasOwnProperty kabi default key lar bor (to'qnashish xavfi), Map da yo'q. 6) ITERATION — Map to'g'ridan-to'g'ri iterable (for...of), Object uchun Object.keys/entries kerak.

Object ishlatish kerak: JSON bilan ishlashda, config/options uchun, kam elementlar bo'lganda. Map ishlatish kerak: key turlari aralash bo'lganda, ko'p elementlar bo'lganda (10K+), tez-tez qo'shish/o'chirish bo'lganda, element soni va tartib muhim bo'lganda.`,
    },
    {
      question: 'twoSum masalasini O(n) da qanday yechish mumkin?',
      answer: `twoSum masalasi: massivdan ikki son topish kerak — ularning yig'indisi target ga teng. Brute force O(n²) — har bir juftlikni tekshirish. Hash table bilan O(n) da yechiladi:

Algoritm: Map yaratamiz (qiymat → index). Massivni aylanamiz: har bir element uchun complement = target - nums[i] hisoblaymiz. Agar complement Map da bor bo'lsa — javob topildi, [map.get(complement), i] qaytaramiz. Agar yo'q bo'lsa — hozirgi element va uning indexini Map ga qo'shamiz.

Misol: nums = [2, 7, 11, 15], target = 9. i=0: complement = 9-2 = 7, Map da yo'q, Map: {2→0}. i=1: complement = 9-7 = 2, Map da BOR (index 0), javob: [0, 1].

Bu ishlaydi chunki har bir element uchun "menga kerakli juft bormi?" deb Map dan O(1) da tekshiramiz. Bitta o'tishda yechim topiladi.`,
    },
    {
      question: 'Hash collision ni qanday hal qilish mumkin? Har bir usulning afzalligi va kamchiligi?',
      answer: `Hash collision ni hal qilishning asosiy usullari:

1) CHAINING (Zanjir usuli): Har bir hash index da massiv yoki linked list saqlanadi. Collision bo'lganda yangi element shu ro'yxatga qo'shiladi. Afzalliklari: oddiy implementatsiya, hash table to'lganda ham ishlaydi, delete oson. Kamchiliklari: qo'shimcha xotira (pointer/reference lar), worst case O(n) (barcha elementlar bitta bucketga tushsa), cache locality yomon.

2) OPEN ADDRESSING: Collision bo'lganda massiv ichida boshqa bo'sh joy qidiriladi. Turlari: a) Linear Probing — ketma-ket tekshirish (index+1, +2, ...). Oddiy, lekin clustering (elementlar guruhlashishi) muammosi bor. b) Quadratic Probing — kvadratik qadamlar (index+1², +2², ...). Clustering kamroq, lekin secondary clustering mumkin. c) Double Hashing — ikkinchi hash function bilan yangi index hisoblash. Eng yaxshi taqsimot, lekin murakkab.

Amalda JavaScript ning Map va Set implementatsiyasi hash table asosida ishlaydi va bu muammolarni ichki optimallashtirish bilan hal qiladi. Load factor 0.7-0.75 dan oshganda avtomatik resize qiladi.`,
    },
  ],
  relatedTopics: [
    { techId: 'javascript', sectionId: 'data-structures-algorithms', topicId: 'big-o', label: 'Big O Notation' },
    { techId: 'javascript', sectionId: 'data-structures-algorithms', topicId: 'array-string-patterns', label: 'Array va String Patterns' },
    { techId: 'javascript', sectionId: 'data-structures-algorithms', topicId: 'linked-list', label: 'Linked List' },
  ],
}
