import type { Topic } from '../../../types'

export const bigO: Topic = {
  id: 'big-o',
  title: 'Big O — Vaqt va Xotira Murakkabligi',
  importance: 3,
  status: 'to-learn',
  description: 'Time complexity, space complexity, Big O notation',
  content: `
═══════════════════════════════════════
  BIG O NIMA VA NEGA KERAK
═══════════════════════════════════════

Big O notation — algoritmning ISHLASH TEZLIGI va XOTIRA SARFI ni
kirish ma'lumotlari hajmi (n) ga nisbatan ifodalovchi matematik yozuv.

Nega kerak?
1. Algoritmlarni SOLISHTIRISH — qaysi yechim tezroq?
2. MASSHTABLILIK — n=100 da ishlaydi, n=1,000,000 da-chi?
3. Intervyuda HAR DOIM so'raladi — "Bu yechimning murakkabligi qancha?"
4. Real loyihalarda — noto'g'ri algoritm production da sezilarli sekinlashadi

Big O DOIM eng yomon holat (worst case) ni ko'rsatadi.
Doimiy koeffitsientlar va kichik qo'shimchalar tashlab yuboriladi:
  O(2n + 5) → O(n)
  O(n² + n) → O(n²)
  O(500) → O(1)

═══════════════════════════════════════
  ASOSIY MURAKKABLIK TURLARI
═══════════════════════════════════════

1. O(1) — DOIMIY (Constant)
   Kirish hajmi o'zgarmaydi — doim bir xil vaqt.
   Misol: array[0], object.key, Map.get(), Set.has()

2. O(log n) — LOGARIFMIK
   Har qadamda ma'lumotlar YARMIGA qisqaradi.
   Misol: Binary Search, Balanced BST qidiruv
   n=1000 → ~10 qadam, n=1,000,000 → ~20 qadam

3. O(n) — CHIZIQLI (Linear)
   Har bir elementni BIR MARTA ko'rish kerak.
   Misol: Array.forEach(), Array.find(), Array.includes()
   n=1000 → 1000 operatsiya

4. O(n log n) — CHIZIQLI-LOGARIFMIK
   Samarali tartiblash algoritmlarining murakkabligi.
   Misol: Array.sort() (Timsort), Merge Sort, Quick Sort (o'rtacha)
   n=1000 → ~10,000 operatsiya

5. O(n²) — KVADRATIK
   Har bir element boshqa HAR BIR element bilan solishtiriladi.
   Misol: Nested loop, Bubble Sort, Selection Sort
   n=1000 → 1,000,000 operatsiya — SEKIN!

6. O(2^n) — EKSPONENSIAL
   Har qadamda imkoniyatlar IKKI BARAVAR oshadi.
   Misol: Fibonachchi (rekursiv, memoizatsiyasiz), qism to'plamlar
   n=30 → ~1,000,000,000 — JUDA SEKIN!

7. O(n!) — FAKTORIAL
   Barcha PERMUTATSIYALARNI tekshirish.
   Misol: Travelling Salesman (brute force)
   n=20 → 2,432,902,008,176,640,000 — AMALDA ISHLAMAYDI

═══════════════════════════════════════
  SPACE COMPLEXITY — XOTIRA SARFI
═══════════════════════════════════════

Time complexity — vaqt, Space complexity — xotira.
Ikkalasi ham Big O bilan ifodalanadi.

O(1) Space — qo'shimcha xotira DOIMIY:
  - Faqat bir nechta o'zgaruvchi (counter, pointer)
  - In-place algoritmlar (masalan, Two Pointers)

O(n) Space — kirish hajmiga proporsional xotira:
  - Yangi array yaratish (map, filter natijalari)
  - Hash Map / frequency counter
  - Rekursiya call stack (n chuqurlik)

O(n²) Space — matritsa yoki 2D array:
  - Dynamic Programming jadvallari
  - Grafik adjacency matrix

Trade-off: Ko'pincha VAQTNI TEJASH uchun XOTIRA SARFLANADI.
  Misol: Memoizatsiya — natijalarni keshlab, qayta hisoblashdan qochish.

═══════════════════════════════════════
  MURAKKABLIKNI QANDAY ANIQLASH
═══════════════════════════════════════

1. ODDIY TSIKL — O(n)
   for (let i = 0; i < n; i++) { ... }

2. NESTED TSIKL — O(n²)
   for (let i = 0; i < n; i++)
     for (let j = 0; j < n; j++) { ... }

3. TSIKL + YARMLASH — O(log n)
   while (n > 1) { n = Math.floor(n / 2) }

4. TSIKL ICHIDA YARMLASH — O(n log n)
   for (let i = 0; i < n; i++)      // n marta
     binarySearch(arr, target)        // log n

5. REKURSIYA — chaqiruvlar soni × har bir chaqiruv ishi
   fib(n) = fib(n-1) + fib(n-2) → O(2^n)
   mergeSort(arr) → O(n log n)

6. KO'P OPERATSIYALAR — eng kattasi g'olib
   O(n) + O(n²) = O(n²)
   O(n) + O(n) = O(n) (koeffitsient tashlanadi)

═══════════════════════════════════════
  AMALIY JADVAL — TEZKOR MA'LUMOTNOMA
═══════════════════════════════════════

Operatsiya                | Vaqt         | Xotira
─────────────────────────┼──────────────┼────────
Array[index]             | O(1)         | —
Array.push/pop           | O(1)*        | —
Array.shift/unshift      | O(n)         | —
Array.includes/indexOf   | O(n)         | —
Array.sort()             | O(n log n)   | O(n)
Array.map/filter         | O(n)         | O(n)
Object.key / obj[key]    | O(1)         | —
Map.get/set/has          | O(1)         | —
Set.add/has/delete       | O(1)         | —
Binary Search            | O(log n)     | O(1)
Merge Sort               | O(n log n)   | O(n)
Quick Sort (o'rtacha)    | O(n log n)   | O(log n)
Bubble/Selection Sort    | O(n²)        | O(1)

* amortized — ba'zan O(n) bo'ladi (array kengaytirilganda)`.trim(),
  codeExamples: [
    {
      title: 'Har xil complexity misollari',
      language: 'js',
      description: 'O(1), O(n), O(n²), O(log n) — kodda ko\'rsatish',
      code: `// ═══ O(1) — Doimiy vaqt ═══
// Kirish hajmi muhim emas — doim bir xil tezlik
function getFirst(arr) {
  return arr[0]  // Har doim 1 operatsiya
}

function getByKey(map, key) {
  return map.get(key)  // Hash lookup — O(1)
}

// ═══ O(log n) — Logarifmik ═══
// Har qadamda ma'lumotlar yarmiga qisqaradi
function binarySearch(sortedArr, target) {
  let left = 0
  let right = sortedArr.length - 1

  while (left <= right) {
    const mid = Math.floor((left + right) / 2)

    if (sortedArr[mid] === target) return mid
    if (sortedArr[mid] < target) left = mid + 1
    else right = mid - 1
  }

  return -1  // Topilmadi
}

// n=1,000,000 bo'lsa ham ~20 ta qadam yetarli!
const arr = Array.from({ length: 1_000_000 }, (_, i) => i)
console.log(binarySearch(arr, 750_000))  // Tez topadi

// ═══ O(n) — Chiziqli ═══
// Har bir elementni bir marta ko'rish
function findMax(arr) {
  let max = -Infinity
  for (const num of arr) {  // n marta aylanadi
    if (num > max) max = num
  }
  return max
}

function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i  // Eng yomon holat — oxirida
  }
  return -1
}

// ═══ O(n²) — Kvadratik ═══
// Ichma-ich tsikllar — har bir element boshqasi bilan
function hasDuplicate(arr) {
  // YOMON usul — O(n²)
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j]) return true
    }
  }
  return false
}

function hasDuplicateOptimal(arr) {
  // YAXSHI usul — O(n) vaqt, O(n) xotira
  const seen = new Set()
  for (const item of arr) {
    if (seen.has(item)) return true
    seen.add(item)
  }
  return false
}

// ═══ O(n log n) — Samarali tartiblash ═══
const nums = [5, 2, 8, 1, 9, 3]
nums.sort((a, b) => a - b)  // Timsort — O(n log n)`,
    },
    {
      title: 'Space Complexity misollari',
      language: 'js',
      description: 'O(1) space vs O(n) space — xotira sarfini solishtirish',
      code: `// ═══ O(1) Space — Qo'shimcha xotira doimiy ═══

// In-place teskari aylantirish — yangi array yaratMASdan
function reverseInPlace(arr) {
  let left = 0
  let right = arr.length - 1

  while (left < right) {
    // Faqat bitta temp o'zgaruvchi — O(1) xotira
    const temp = arr[left]
    arr[left] = arr[right]
    arr[right] = temp
    left++
    right--
  }

  return arr  // O'sha array qaytariladi
}

// Yig'indi topish — faqat bir o'zgaruvchi
function sum(arr) {
  let total = 0  // O(1) — bitta raqam
  for (const n of arr) {
    total += n
  }
  return total
}

// ═══ O(n) Space — Kirish hajmiga proporsional ═══

// Yangi array yaratish — O(n) xotira
function reverseNew(arr) {
  const result = []  // n ta element uchun joy
  for (let i = arr.length - 1; i >= 0; i--) {
    result.push(arr[i])
  }
  return result
}

// Hash Map — O(n) xotira
function twoSum(nums, target) {
  const map = new Map()  // Eng ko'pi n ta element saqlaydi

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i]
    if (map.has(complement)) {
      return [map.get(complement), i]
    }
    map.set(nums[i], i)
  }

  return null
}

// Rekursiya — O(n) call stack xotirasi
function factorial(n) {
  if (n <= 1) return 1
  return n * factorial(n - 1)
  // n=5: factorial(5) → factorial(4) → ... → factorial(1)
  // Call stack da 5 ta frame — O(n) space
}

// Tail-optimized — O(1) space (ba'zi engine larda)
function factorialTail(n, acc = 1) {
  if (n <= 1) return acc
  return factorialTail(n - 1, n * acc)
}

// ═══ TRADE-OFF: Vaqt vs Xotira ═══

// Yomon vaqt, yaxshi xotira — O(n²) vaqt, O(1) xotira
function findDuplicateSlow(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j]) return arr[i]
    }
  }
}

// Yaxshi vaqt, ko'proq xotira — O(n) vaqt, O(n) xotira
function findDuplicateFast(arr) {
  const seen = new Set()
  for (const num of arr) {
    if (seen.has(num)) return num
    seen.add(num)
  }
}`,
    },
    {
      title: 'Real-world — JavaScript built-in metodlar murakkabligi',
      language: 'js',
      description: 'Array.sort(), Map lookup, nested loop muammolari',
      code: `// ═══ Array.sort() — O(n log n) ═══
// V8 Timsort ishlatadi — Merge Sort + Insertion Sort gibridi
const products = [
  { name: 'Laptop', price: 999 },
  { name: 'Phone', price: 699 },
  { name: 'Tablet', price: 499 },
  { name: 'Watch', price: 299 },
]

// O(n log n) — samarali, lekin katta array larda seziladi
products.sort((a, b) => a.price - b.price)

// XATO: sort() ichida qimmat operatsiya qilish
// Har bir solishtiruvda O(n) ish = umumiy O(n² log n)!
// items.sort((a, b) => {
//   return expensiveCalculation(a) - expensiveCalculation(b) // YOMON
// })

// TO'G'RI: Avval hisoblash, keyin tartiblash (Schwartzian transform)
const sorted = products
  .map(p => ({ ...p, sortKey: p.price * 0.9 }))  // O(n) — bir marta
  .sort((a, b) => a.sortKey - b.sortKey)            // O(n log n)
  .map(({ sortKey, ...p }) => p)                     // O(n)
// Jami: O(n) + O(n log n) + O(n) = O(n log n)

// ═══ Map Lookup vs Array.find() ═══
const users = Array.from({ length: 10000 }, (_, i) => ({
  id: i,
  name: \`User_\${i}\`,
}))

// YOMON: Har safar Array.find() — O(n)
function getUserSlow(id) {
  return users.find(u => u.id === id)  // 10000 element ichidan qidirish
}

// Agar 1000 marta chaqirilsa: 1000 × O(n) = O(n × m) = O(10,000,000)

// YAXSHI: Map yaratib oling — O(1) lookup
const userMap = new Map(users.map(u => [u.id, u]))  // O(n) — bir marta

function getUserFast(id) {
  return userMap.get(id)  // O(1) — har safar
}

// 1000 marta chaqirilsa: O(n) + 1000 × O(1) = O(n + m) = O(11,000)

// ═══ Nested Loop Muammosi ═══
const orders = [/* 5000 ta buyurtma */]
const items = [/* 10000 ta mahsulot */]

// YOMON: O(n × m) = O(50,000,000) operatsiya!
// orders.forEach(order => {
//   order.items.forEach(itemId => {
//     const item = items.find(i => i.id === itemId) // O(m) har safar
//   })
// })

// YAXSHI: Avval Map yarating — O(n + m)
const itemMap = new Map(items.map(i => [i.id, i]))  // O(m)

orders.forEach(order => {
  order.items.forEach(itemId => {
    const item = itemMap.get(itemId)  // O(1) — tez!
  })
})

// ═══ Array metodlari chaining — yashirin O(n × k) ═══
const data = Array.from({ length: 100000 }, (_, i) => i)

// Har bir metod O(n) — 4 ta chain = 4 × O(n) = O(4n) = O(n)
// Lekin xotirada 4 ta yangi array yaratiladi!
const result = data
  .filter(x => x % 2 === 0)     // O(n) → yangi array
  .map(x => x * 2)               // O(n/2) → yangi array
  .filter(x => x > 1000)         // O(n/2) → yangi array
  .slice(0, 10)                   // O(1) — lekin 99% ish behuda

// YAXSHI: Bitta tsiklda bajarish
const resultOptimal = []
for (const x of data) {
  if (x % 2 !== 0) continue
  const doubled = x * 2
  if (doubled <= 1000) continue
  resultOptimal.push(doubled)
  if (resultOptimal.length === 10) break  // Keragini oldik — to'xtatdik
}`,
    },
  ],
  interviewQA: [
    {
      question: 'Big O nima va nega kerak?',
      answer: 'Big O notation — algoritmning ishlash tezligini kirish hajmiga (n) nisbatan ifodalovchi matematik yozuv. U eng yomon holatni (worst case) ko\'rsatadi va doimiy koeffitsientlarni tashlab yuboradi (O(3n) → O(n)). Nega kerak: 1) Algoritmlarni SOLISHTIRISH — qaysi yechim katta ma\'lumotlarda tezroq ishlashini aniqlash. 2) MASSHTABLILIK — n=100 da ikki yechim ham tez, lekin n=1,000,000 da O(n) va O(n²) orasida million baravar farq. 3) Intervyuda har doim so\'raladi — yechim yozganingizdan keyin "murakkabligi qancha?" degan savol keladi. 4) Real loyihalarda noto\'g\'ri algoritm tanlash production da performance muammolariga olib keladi — masalan, Array.find() o\'rniga Map.get() ishlatish 1000x tezroq bo\'lishi mumkin.',
    },
    {
      question: 'O(n log n) va O(n²) farqi — qachon muhim bo\'ladi?',
      answer: 'Kichik n da farq sezilmaydi, lekin n oshganda keskin farqlanadi. Raqamlarda: n=1,000 da O(n log n)≈10,000 operatsiya, O(n²)=1,000,000 — 100 baravar farq. n=1,000,000 da O(n log n)≈20,000,000, O(n²)=1,000,000,000,000 — 50,000 baravar farq! Real holat: Array.sort() O(n log n) Timsort ishlatadi — 1 million elementni ~1 sekundda tartiblaydi. Agar Bubble Sort (O(n²)) ishlatilsa, bir necha SOAT ketadi. Frontend da qachon muhim: 1) Katta ro\'yxatlarni tartiblash — doim Array.sort() ishlatish (O(n log n)). 2) Nested loop dan qochish — ichki Array.find() o\'rniga Map/Set ishlatish. 3) 10,000+ element bo\'lgan jadvallar, filterlar. Qoida: n < 100 bo\'lsa O(n²) ham yaxshi, n > 1000 bo\'lsa optimizatsiya shart.',
    },
    {
      question: 'Space complexity ni qanday kamaytirasiz?',
      answer: 'Asosiy strategiyalar: 1) IN-PLACE algoritmlar — yangi array yaratish o\'rniga mavjud arrayni o\'zgartirish. Masalan, reverse uchun two pointers — O(1) space. 2) STREAMING — barcha ma\'lumotni xotirada saqlamasdan, bittadan qayta ishlash. .reduce() yoki generator/iterator ishlatish. 3) Keraksiz nusxalardan qochish — array.map().filter().slice() har birida yangi array yaratadi. Bitta for tsiklida barchasini bajarish mumkin. 4) WeakMap/WeakSet — katta obyektlar uchun kesh. Referens yo\'qolsa, garbage collector avtomatik tozalaydi. 5) Pagination/virtualization — 100,000 ta elementni bir vaqtda yuklamasdan, 50 talab qilingan qismini ko\'rsatish (react-window). 6) Rekursiyani iteratsiyaga aylantirish — call stack O(n) o\'rniga while loop O(1). MUHIM trade-off: space ni kamaytirsangiz, ko\'pincha vaqt oshadi. Masalan, memoizatsiya O(n) xotira sarflaydi, lekin vaqtni O(2^n) dan O(n) ga tushiradi.',
    },
    {
      question: 'Array.prototype.sort() ning murakkabligi qancha?',
      answer: 'V8 (Chrome, Node.js) da Array.sort() TIMSORT algoritmini ishlatadi: Vaqt: O(n log n) o\'rtacha va eng yomon holat, O(n) eng yaxshi holat (deyarli tartiblangan array). Xotira: O(n) — qo\'shimcha buffer kerak. Timsort — Merge Sort va Insertion Sort gibridi. Kichik qismlarni (run) Insertion Sort bilan tartiblaydi (kichik n da tez), keyin Merge Sort bilan birlashtiradi. MUHIM nuanslar: 1) sort() comparator berilmasa STRING bo\'yicha tartiblaydi — [10, 9, 2].sort() → [10, 2, 9]! Har doim (a, b) => a - b yozing. 2) sort() MUTATSIYA qiladi — original arrayni o\'zgartiradi. Immutable kerak bo\'lsa: [...arr].sort() yoki arr.toSorted() (ES2023). 3) sort() STABLE — teng elementlar o\'z tartibini saqlaydi (ES2019+). 4) Comparator ichida qimmat operatsiya qilmang — har bir solishtiruvda chaqiriladi, O(n log n) marta. Oldindan hisoblang (Schwartzian transform).',
    },
  ],
  relatedTopics: [
    {
      techId: 'javascript',
      sectionId: 'data-structures-algorithms',
      topicId: 'sorting-algorithms',
      label: 'Sorting Algorithms',
    },
    {
      techId: 'javascript',
      sectionId: 'data-structures-algorithms',
      topicId: 'searching-algorithms',
      label: 'Searching Algorithms',
    },
    {
      techId: 'javascript',
      sectionId: 'data-structures-algorithms',
      topicId: 'linked-list',
      label: 'Linked List',
    },
  ],
}
