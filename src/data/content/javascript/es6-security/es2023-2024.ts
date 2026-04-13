import type { Topic } from '../../../types'

export const es2023_2024: Topic = {
  id: 'es2023-2024',
  title: 'ES2023-2025 Yangiliklari',
  importance: 2,
  status: 'to-learn',
  description: 'Immutable array methods, Object.groupBy, Set methods, Promise.withResolvers',
  content: `ES2023, ES2024 va ES2025 — JavaScript ning eng so'nggi yangilanishlari. Asosiy yo'nalish: immutable (o'zgarmas) operatsiyalar, guruhlash, Set operatsiyalari.

═══════════════════════════════════════
  ES2023 — IMMUTABLE ARRAY METODLARI
═══════════════════════════════════════

ES2023 ning eng katta yangiligi — massivni O'ZGARTIRMAYDIGAN metodlar.
Oldingi sort(), reverse(), splice() ASLINI o'zgartirardi (mutate).
Yangi metodlar YANGI massiv qaytaradi:

  arr.toSorted()    — sort() ning immutable versiyasi
  arr.toReversed()  — reverse() ning immutable versiyasi
  arr.toSpliced()   — splice() ning immutable versiyasi
  arr.with(i, val)  — arr[i] = val ning immutable versiyasi

Nima uchun muhim:
1. React/Vue da state ni mutate qilmaslik KERAK
2. Funksional dasturlashda immutability asosiy printsip
3. Redux reducer larda yangi massiv qaytarish osonlashdi
4. Xatolarni oldini oladi — asl ma'lumot o'zgarmaydi

Yana qo'shilgan:
  arr.findLast()       — oxiridan qidirish
  arr.findLastIndex()  — oxiridan indeks topish

═══════════════════════════════════════
  ES2023 — FINDLAST VA FINDLASTINDEX
═══════════════════════════════════════

findLast() — find() ga o'xshash, lekin OXIRIDAN qidiradi.
findLastIndex() — findIndex() ning teskari versiyasi.

Nima uchun kerak:
- Oxirgi mos keluvchi elementni topish
- Vaqt bo'yicha tartiblangan ma'lumotlarda oxirgi yozuvni olish
- reverse().find() dan ko'ra samaraliroq — yangi massiv yaratmaydi

Hashbang (#!):
  #!/usr/bin/env node  — fayl boshida, Node.js skriptlari uchun
  Bu ECMAScript standarti tomonidan rasman tan olindi.

═══════════════════════════════════════
  ES2024 — OBJECT.GROUPBY VA MAP.GROUPBY
═══════════════════════════════════════

Object.groupBy(iterable, callback) — elementlarni guruhlash.
Lodash _.groupBy() ga o'xshash, lekin native.

  Object.groupBy(people, p => p.city)
  // { "Toshkent": [...], "Samarqand": [...] }

Map.groupBy — natijani Map sifatida qaytaradi.
Object.groupBy dan farqi: kalit har qanday tur bo'lishi mumkin
(object, function va h.k.), Object.groupBy da faqat string.

═══════════════════════════════════════
  ES2024 — PROMISE.WITHRESOLVERS
═══════════════════════════════════════

Promise.withResolvers() — resolve va reject ni tashqarida
olish. Oldin "deferred pattern" qo'lda yozilardi:

  const { promise, resolve, reject } = Promise.withResolvers()

Bu pattern event-based kodda juda foydali — masalan,
WebSocket javobini kutish, foydalanuvchi harakatini kutish.

═══════════════════════════════════════
  ES2024 — BOSHQA YANGILIKLAR
═══════════════════════════════════════

1. ArrayBuffer.transfer() — buferni yangi hajmga ko'chirish
2. Atomics.waitAsync() — SharedArrayBuffer uchun async kutish
3. String.isWellFormed() — UTF-16 to'g'riligini tekshirish
4. String.toWellFormed() — noto'g'ri surrogate larni tuzatish

═══════════════════════════════════════
  ES2025 — SET METHODS
═══════════════════════════════════════

Matematikadagi to'plam operatsiyalari endi native:

  setA.union(setB)         — birlashma (A ∪ B)
  setA.intersection(setB)  — kesishma (A ∩ B)
  setA.difference(setB)    — ayirma (A \\ B)
  setA.symmetricDifference(setB) — simmetrik ayirma (A △ B)
  setA.isSubsetOf(setB)    — A ⊆ B tekshirish
  setA.isSupersetOf(setB)  — A ⊇ B tekshirish
  setA.isDisjointFrom(setB) — kesishmaydi (A ∩ B = ∅)

MUHIM: Barcha metodlar YANGI Set qaytaradi — asl Set o'zgarmaydi.`,
  codeExamples: [
    {
      title: 'Immutable array metodlari — toSorted, toReversed, with',
      language: 'js',
      code: `const numbers = [3, 1, 4, 1, 5, 9]

// ❌ Eskicha — aslini O'ZGARTIRADI (mutate)
const sorted = numbers.sort()
console.log(numbers) // [1, 1, 3, 4, 5, 9] ← asl o'zgardi!

// ✅ toSorted — YANGI massiv, asl o'zgarmaydi
const numbers2 = [3, 1, 4, 1, 5, 9]
const sorted2 = numbers2.toSorted()
console.log(numbers2) // [3, 1, 4, 1, 5, 9] ← asl saqlanib qoldi
console.log(sorted2)  // [1, 1, 3, 4, 5, 9]

// toReversed
const arr = [1, 2, 3]
const reversed = arr.toReversed()
console.log(arr)      // [1, 2, 3] ← o'zgarmadi
console.log(reversed) // [3, 2, 1]

// toSpliced — splice ning immutable versiyasi
const colors = ["qizil", "yashil", "ko'k"]
const updated = colors.toSpliced(1, 1, "sariq", "pushti")
console.log(colors)  // ["qizil", "yashil", "ko'k"] ← o'zgarmadi
console.log(updated) // ["qizil", "sariq", "pushti", "ko'k"]

// with — elementni almashtirish
const items = ["a", "b", "c", "d"]
const changed = items.with(2, "X")
console.log(items)   // ["a", "b", "c", "d"] ← o'zgarmadi
console.log(changed) // ["a", "b", "X", "d"]

// React state da ishlatish
function TodoList() {
  const [todos, setTodos] = useState(initialTodos)

  const sortByDate = () => {
    // ✅ Yangi massiv — React o'zgarishni sezadi
    setTodos(prev => prev.toSorted((a, b) => a.date - b.date))
  }

  const toggleDone = (index) => {
    setTodos(prev => prev.with(index, {
      ...prev[index],
      done: !prev[index].done
    }))
  }
}`,
      description: 'Immutable array metodlari — asl massivni o\'zgartirmaydi',
    },
    {
      title: 'findLast va findLastIndex',
      language: 'js',
      code: `const transactions = [
  { id: 1, type: "income",  amount: 500,  date: "2024-01-01" },
  { id: 2, type: "expense", amount: 200,  date: "2024-01-05" },
  { id: 3, type: "income",  amount: 1000, date: "2024-01-10" },
  { id: 4, type: "expense", amount: 300,  date: "2024-01-15" },
  { id: 5, type: "income",  amount: 750,  date: "2024-01-20" },
]

// Oxirgi daromadni topish
const lastIncome = transactions.findLast(t => t.type === "income")
console.log(lastIncome) // { id: 5, amount: 750, date: "2024-01-20" }

// Oxirgi daromad indeksi
const lastIncomeIndex = transactions.findLastIndex(t => t.type === "income")
console.log(lastIncomeIndex) // 4

// ❌ Eskicha — reverse() massivni buzadi yoki nusxa kerak
const lastExpense = [...transactions].reverse().find(t => t.type === "expense")

// ✅ findLast — samarali, nusxa yaratmaydi
const lastExpense2 = transactions.findLast(t => t.type === "expense")

// Amaliy misol: log dagi oxirgi xatoni topish
const logs = [
  { level: "info", msg: "Server boshlandi" },
  { level: "error", msg: "DB ulanish xatosi" },
  { level: "info", msg: "Qayta ulanish" },
  { level: "error", msg: "Timeout" },
  { level: "info", msg: "Muvaffaqiyat" },
]

const lastError = logs.findLast(l => l.level === "error")
console.log(lastError) // { level: "error", msg: "Timeout" }`,
      description: 'findLast va findLastIndex — oxiridan qidirish',
    },
    {
      title: 'Object.groupBy va Map.groupBy',
      language: 'js',
      code: `const people = [
  { name: "Ali", city: "Toshkent", age: 25 },
  { name: "Vali", city: "Samarqand", age: 30 },
  { name: "Gani", city: "Toshkent", age: 35 },
  { name: "Hasan", city: "Buxoro", age: 28 },
  { name: "Husan", city: "Samarqand", age: 22 },
]

// Shahar bo'yicha guruhlash
const byCity = Object.groupBy(people, p => p.city)
console.log(byCity)
// {
//   "Toshkent": [{ name: "Ali", ... }, { name: "Gani", ... }],
//   "Samarqand": [{ name: "Vali", ... }, { name: "Husan", ... }],
//   "Buxoro": [{ name: "Hasan", ... }]
// }

// Yosh kategoriyasi bo'yicha
const byAge = Object.groupBy(people, p => {
  if (p.age < 25) return "yosh"
  if (p.age < 30) return "o'rta"
  return "tajribali"
})

// Map.groupBy — kalit har qanday tur bo'lishi mumkin
const products = [
  { name: "Olma", category: { id: 1, label: "Meva" } },
  { name: "Sabzi", category: { id: 2, label: "Sabzavot" } },
  { name: "Banan", category: { id: 1, label: "Meva" } },
]

const categories = [
  { id: 1, label: "Meva" },
  { id: 2, label: "Sabzavot" },
]

const byCategory = Map.groupBy(products, p =>
  categories.find(c => c.id === p.category.id)
)
// Map { {id:1,label:"Meva"} => [{...Olma}, {...Banan}], ... }`,
      description: 'Object.groupBy va Map.groupBy bilan ma\'lumotlarni guruhlash',
    },
    {
      title: 'Promise.withResolvers va Set methods',
      language: 'js',
      code: `// ═══ Promise.withResolvers ═══

// ❌ Eskicha — deferred pattern
let resolve, reject
const promise = new Promise((res, rej) => {
  resolve = res
  reject = rej
})

// ✅ ES2024 — bitta qatorda
const { promise: p, resolve: res, reject: rej } = Promise.withResolvers()

// Amaliy misol: WebSocket javobini kutish
function sendMessage(ws, data) {
  const { promise, resolve, reject } = Promise.withResolvers()
  const id = crypto.randomUUID()

  ws.send(JSON.stringify({ id, data }))

  const handler = (event) => {
    const response = JSON.parse(event.data)
    if (response.id === id) {
      ws.removeEventListener("message", handler)
      resolve(response.result)
    }
  }
  ws.addEventListener("message", handler)

  setTimeout(() => reject(new Error("Timeout")), 5000)
  return promise
}

// ═══ ES2025 — Set methods ═══
const frontend = new Set(["HTML", "CSS", "JS", "React", "Vue"])
const backend = new Set(["Node", "Python", "JS", "Go"])
const fullstack = new Set(["JS", "React", "Node", "SQL"])

// Union — birlashma
frontend.union(backend)
// Set {"HTML", "CSS", "JS", "React", "Vue", "Node", "Python", "Go"}

// Intersection — kesishma
frontend.intersection(backend)
// Set {"JS"}

// Difference — ayirma
frontend.difference(backend)
// Set {"HTML", "CSS", "React", "Vue"}

// Symmetric difference
frontend.symmetricDifference(backend)
// Set {"HTML", "CSS", "React", "Vue", "Node", "Python", "Go"}

// Subset/Superset tekshirish
fullstack.isSubsetOf(frontend)     // false
frontend.isSupersetOf(new Set(["JS", "CSS"]))  // true
frontend.isDisjointFrom(backend)   // false (JS umumiy)`,
      description: 'Promise.withResolvers bilan deferred pattern va ES2025 Set operatsiyalari',
    },
  ],
  interviewQA: [
    {
      question: 'toSorted(), toReversed() va boshqa immutable array metodlari nima uchun muhim?',
      answer: 'ES2023 da qo\'shilgan toSorted(), toReversed(), toSpliced(), with() metodlari YANGI massiv qaytaradi — aslini o\'zgartirmaydi. Bu muhim chunki: 1) React/Vue da state ni mutate qilish taqiqlangan — useState va reactive tizimlar YANGI referens kutadi. 2) Funksional dasturlashda immutability asosiy printsip. 3) Bug larni oldini oladi — asl ma\'lumot o\'zgarmaydi. Oldin sort() massivni buzardi, [...arr].sort() yoki structuredClone kerak edi. Endi toSorted() bitta qatorda yechadi.',
    },
    {
      question: 'Object.groupBy qanday ishlaydi va Map.groupBy dan farqi nima?',
      answer: 'Object.groupBy(iterable, callback) — elementlarni callback qaytargan kalit bo\'yicha guruhlaydi. Natija: oddiy object. Lodash _.groupBy() ning native versiyasi. Map.groupBy — natijani Map sifatida qaytaradi. Asosiy farq: Object.groupBy da kalit faqat string bo\'lishi mumkin (object avtomatik stringga aylanadi). Map.groupBy da kalit HAR QANDAY tur — object, function va h.k. Shuning uchun murakkab kalitlar kerak bo\'lganda Map.groupBy ishlatish kerak.',
    },
    {
      question: 'Promise.withResolvers nima va qachon ishlatiladi?',
      answer: 'Promise.withResolvers() — { promise, resolve, reject } qaytaradi. Bu "deferred" pattern — resolve/reject ni promise tashqarisida olish. Oldin let resolve; new Promise(r => resolve = r) yozish kerak edi. Qachon kerak: 1) Event-based kod — WebSocket javobini kutish, foydalanuvchi harakatini kutish. 2) Callback-based API ni Promise ga o\'rash. 3) Test larda — ma\'lum paytda resolve/reject qilish. 4) Queue/Pool pattern larda — tashqi signal bilan promise ni hal qilish.',
    },
    {
      question: 'ES2025 Set methods (union, intersection, difference) qanday ishlaydi?',
      answer: 'ES2025 da Set ga matematikadagi to\'plam operatsiyalari qo\'shildi: union() — birlashma (A ∪ B), intersection() — kesishma (A ∩ B), difference() — ayirma (A \\ B), symmetricDifference() — simmetrik ayirma (faqat bitta to\'plamda bor elementlar). Tekshirish: isSubsetOf(), isSupersetOf(), isDisjointFrom(). MUHIM: barcha metodlar YANGI Set qaytaradi — asl o\'zgarmaydi. Oldin bu operatsiyalarni qo\'lda yoki Lodash bilan yozish kerak edi. Amaliy ishlatish: permission tekshirish, tag filtrlash, dublikatlarni aniqlash.',
    },
    {
      question: 'findLast() va findLastIndex() nima uchun qo\'shildi?',
      answer: 'findLast() — find() ga o\'xshash, lekin OXIRIDAN qidiradi. findLastIndex() — findIndex() ning teskari versiyasi. Nima uchun kerak: 1) Oxirgi mos keluvchi elementni topish — masalan, log dagi oxirgi xato. 2) Vaqt bo\'yicha tartiblangan ma\'lumotlarda eng so\'nggi yozuv. 3) Performance — [...arr].reverse().find() yangi massiv yaratadi (O(n) xotira), findLast() esa joyida ishlaydi (O(1) xotira). 4) Kod o\'qilishi — findLast niyatni aniq ifodalaydi.',
    },
  ],
}
