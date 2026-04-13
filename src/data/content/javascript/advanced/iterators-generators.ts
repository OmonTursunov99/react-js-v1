import type { Topic } from '../../../types'

export const iteratorsGenerators: Topic = {
  id: 'iterators-generators',
  title: 'Iteratorlar va Generatorlar',
  importance: 2,
  status: 'to-learn',
  description: 'Symbol.iterator, generator funksiyalar, yield',
  content: `═══════════════════════════════════════
  ITERATION PROTOKOLLARI
═══════════════════════════════════════

JavaScript da ikki asosiy protokol mavjud:

1. ITERABLE PROTOKOL — obyektda Symbol.iterator metodi bo'lishi kerak.
   Bu metod iterator obyektini qaytaradi. Array, String, Map, Set —
   barchasi iterable.

2. ITERATOR PROTOKOL — obyektda next() metodi bo'lishi kerak.
   Har safar next() chaqirilganda { value, done } obyektini qaytaradi.
   done: true bo'lganda iteratsiya tugaydi.

MUHIM: for...of, spread (...), destructuring, Array.from() —
bularning barchasi iterable protokolga asoslangan. Agar obyekt
iterable bo'lsa, bu operatsiyalar avtomatik ishlaydi.

═══════════════════════════════════════
  FOR...OF ISHLASH MEXANIZMI
═══════════════════════════════════════

for...of loop ichki mexanizmi:

1. Obyektning [Symbol.iterator]() metodini chaqiradi
2. Iterator obyektini oladi
3. Har bir iteratsiyada iterator.next() ni chaqiradi
4. { value, done } dan value ni oladi
5. done === true bo'lganda to'xtaydi

for...of vs for...in farqi:
- for...of — QIYMATLAR ustida iteratsiya (iterable kerak)
- for...in — KALITLAR ustida iteratsiya (har qanday obyekt)

═══════════════════════════════════════
  GENERATOR FUNKSIYALAR
═══════════════════════════════════════

Generator — function* kalit so'zi bilan yaratilgan maxsus funksiya.
U chaqirilganda KOD ISHLAMAYDI, balki generator obyekti qaytaradi.
next() chaqirilganda kod keyingi yield gacha ishlaydi.

function* generatorName() {
  yield qiymat1
  yield qiymat2
  return yakuniyQiymat
}

Asosiy xususiyatlar:
1. yield — funksiya bajarilishini TO'XTATADI va qiymat qaytaradi
2. next() — funksiyani keyingi yield gacha DAVOM ETTIRADI
3. next(val) — yield o'rniga val qiymatini uzatish mumkin
4. return(val) — generatorni majburan tugatish
5. throw(err) — generator ichiga xato yuborish

MUHIM: yield faqat generator funksiya ichida ishlatilishi mumkin.
Ichki callback yoki arrow function ichida yield yozish XATO beradi.

═══════════════════════════════════════
  YIELD* — DELEGATSIYA
═══════════════════════════════════════

yield* boshqa iterable yoki generator ga delegatsiya qiladi.
Bu kodni modullarga ajratish va generatorlarni kompozitsiya
qilish imkonini beradi.

function* inner() { yield 'a'; yield 'b' }
function* outer() { yield* inner(); yield 'c' }
// outer: 'a', 'b', 'c'

yield* har qanday iterable bilan ishlaydi: array, string, Set, Map,
boshqa generator va hokazo.

═══════════════════════════════════════
  LAZY EVALUATION
═══════════════════════════════════════

Generator ning eng kuchli tomoni — DANGASA HISOBLASH. Qiymatlar
faqat so'ralganda hisoblanadi, hammasi bir vaqtda emas.

Afzalliklari:
1. Cheksiz ketma-ketliklar bilan ishlash mumkin (masalan, Fibonacci)
2. Xotira tejamkor — barcha qiymatlarni birdaniga saqlamaydi
3. Og'ir hisoblashlarni zarur bo'lgandagina bajaradi
4. Pipeline pattern — ma'lumotlarni bosqichma-bosqich qayta ishlash

═══════════════════════════════════════
  ASYNC GENERATORLAR
═══════════════════════════════════════

async function* — asinxron generatorlar. Har bir yield Promise
qaytarishi mumkin. for await...of loop bilan ishlatiladi.

async function* fetchPages(url) {
  let page = 1
  while (true) {
    const res = await fetch(url + '?page=' + page)
    const data = await res.json()
    if (data.length === 0) return
    yield data
    page++
  }
}

Qo'llanilish holatlari:
1. Paginatsiya — sahifama-sahifa ma'lumot olish
2. WebSocket stream — xabarlarni ketma-ket qayta ishlash
3. Fayl o'qish — katta fayllarni qismlarga bo'lib o'qish
4. Real-time data — doimiy yangilanuvchi ma'lumotlar oqimi`,
  codeExamples: [
    {
      title: 'Custom iterable obyekt yaratish',
      language: 'js',
      code: `// Custom iterable — Iterable va Iterator protokollari
const alphabet = {
  from: 'A'.charCodeAt(0),  // 65
  to: 'Z'.charCodeAt(0),    // 90

  // Iterable protokol
  [Symbol.iterator]() {
    let current = this.from
    const last = this.to

    // Iterator protokol
    return {
      next() {
        if (current <= last) {
          return { value: String.fromCharCode(current++), done: false }
        }
        return { done: true, value: undefined }
      }
    }
  }
}

// for...of ishlaydi
for (const letter of alphabet) {
  process.stdout.write(letter + ' ')
}
// A B C D ... Z

// Spread ishlaydi
const letters = [...alphabet]
console.log(letters.length)  // 26

// Destructuring ishlaydi
const [a, b, c] = alphabet
console.log(a, b, c)  // A B C`,
      description: 'Symbol.iterator va next() bilan custom iterable yaratish',
    },
    {
      title: 'Generator funksiya — asosiy mexanizm',
      language: 'js',
      code: `// Generator funksiya
function* counter(start = 0) {
  console.log('Boshlandi')

  const reset = yield start       // 1-to'xtash
  console.log('Reset:', reset)

  yield start + 1                  // 2-to'xtash
  yield start + 2                  // 3-to'xtash

  return 'Tugadi'                  // Yakuniy qiymat
}

const gen = counter(10)

// Chaqirish — hech narsa ishlamaydi, generator obyekt qaytadi
console.log(gen.next())
// "Boshlandi"
// { value: 10, done: false }

console.log(gen.next(true))   // yield ga qiymat uzatish
// "Reset: true"
// { value: 11, done: false }

console.log(gen.next())
// { value: 12, done: false }

console.log(gen.next())
// { value: 'Tugadi', done: true }

// return() — generatorni majburan tugatish
function* nums() {
  yield 1; yield 2; yield 3
}
const g = nums()
console.log(g.next())      // { value: 1, done: false }
console.log(g.return(99))  // { value: 99, done: true }
console.log(g.next())      // { value: undefined, done: true }`,
      description: 'Generator funksiya yaratish, yield va next() bilan ishlash',
    },
    {
      title: 'Cheksiz ketma-ketlik — Lazy evaluation',
      language: 'js',
      code: `// Cheksiz Fibonacci ketma-ketligi
function* fibonacci() {
  let a = 0, b = 1
  while (true) {
    yield a
    ;[a, b] = [b, a + b]
  }
}

// Faqat kerakli miqdorni olish
function take(n, iterable) {
  const result = []
  for (const item of iterable) {
    result.push(item)
    if (result.length >= n) break
  }
  return result
}

console.log(take(10, fibonacci()))
// [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]

// Pipeline pattern — generatorlar zanjiri
function* map(iterable, fn) {
  for (const item of iterable) {
    yield fn(item)
  }
}

function* filter(iterable, fn) {
  for (const item of iterable) {
    if (fn(item)) yield item
  }
}

// Juft Fibonacci sonlar, 100 dan kichik
const result = take(5,
  filter(
    map(fibonacci(), x => x * 2),
    x => x < 100
  )
)
console.log(result)  // [0, 2, 2, 4, 6]`,
      description: 'Generator yordamida cheksiz ketma-ketlik va pipeline pattern',
    },
    {
      title: 'yield* — delegatsiya va kompozitsiya',
      language: 'js',
      code: `// yield* — boshqa generator/iterable ga delegatsiya
function* generateNames() {
  yield 'Ali'
  yield 'Vali'
}

function* generateNumbers() {
  yield 1
  yield 2
}

// Kompozitsiya
function* generateAll() {
  yield '--- Ismlar ---'
  yield* generateNames()      // Generator ga delegatsiya
  yield '--- Raqamlar ---'
  yield* generateNumbers()    // Generator ga delegatsiya
  yield '--- Array ---'
  yield* [10, 20, 30]         // Array ga delegatsiya
  yield '--- String ---'
  yield* 'ABC'                // String ga delegatsiya
}

for (const item of generateAll()) {
  console.log(item)
}
// --- Ismlar ---
// Ali
// Vali
// --- Raqamlar ---
// 1
// 2
// --- Array ---
// 10, 20, 30
// --- String ---
// A, B, C

// yield* return qiymatini olish
function* inner() {
  yield 'a'
  return 'INNER_RESULT'
}

function* outer() {
  const result = yield* inner()
  console.log('Inner natijasi:', result)  // 'INNER_RESULT'
  yield 'b'
}`,
      description: 'yield* orqali generatorlarni kompozitsiya qilish',
    },
    {
      title: 'Async generator — paginatsiya',
      language: 'js',
      code: `// Async generator — API paginatsiya
async function* fetchUsers(baseUrl) {
  let page = 1

  while (true) {
    const response = await fetch(\`\${baseUrl}?page=\${page}&limit=10\`)
    const users = await response.json()

    if (users.length === 0) return  // Ma'lumot tugadi

    for (const user of users) {
      yield user  // Har bir userni alohida yield qilish
    }

    page++
  }
}

// for await...of bilan ishlatish
async function processAllUsers() {
  let count = 0

  for await (const user of fetchUsers('/api/users')) {
    console.log(user.name)
    count++

    if (count >= 50) break  // 50 ta yetarli
  }
}

// Real-time events stream
async function* eventStream(url) {
  const eventSource = new EventSource(url)

  try {
    while (true) {
      const event = await new Promise((resolve, reject) => {
        eventSource.onmessage = e => resolve(JSON.parse(e.data))
        eventSource.onerror = reject
      })
      yield event
    }
  } finally {
    eventSource.close()  // Cleanup
  }
}`,
      description: 'Async generator bilan asinxron ma\'lumot oqimini boshqarish',
    },
  ],
  interviewQA: [
    {
      question: 'Iterable va Iterator protokollari nima?',
      answer: 'Iterable protokol — obyektda [Symbol.iterator]() metodi bo\'lishi kerak, u iterator qaytaradi. Iterator protokol — obyektda next() metodi bo\'lishi kerak, u har safar { value, done } qaytaradi. for...of, spread, destructuring, Array.from() — barchasi iterable protokolga asoslangan. Array, String, Map, Set o\'rnatilgan iterable lar. Custom obyektni iterable qilish uchun [Symbol.iterator]() metodini implement qilish kerak.',
    },
    {
      question: 'Generator funksiya oddiy funksiyadan qanday farq qiladi?',
      answer: 'Generator function* bilan yaratiladi va chaqirilganda kod ishlamaydi — generator obyekti qaytaradi. Kod faqat next() chaqirilganda keyingi yield gacha ishlaydi. Oddiy funksiya bir marta ishga tushib, oxirigacha bajariladi va bitta qiymat qaytaradi. Generator esa ko\'p marta to\'xtaydi va davom etadi, har safar yangi qiymat beradi. next(val) orqali generator ichiga qiymat ham uzatish mumkin.',
    },
    {
      question: 'Lazy evaluation nima va generator bilan qanday bog\'liq?',
      answer: 'Lazy evaluation — qiymatlarni oldindan emas, KERAK BO\'LGANDA hisoblash strategiyasi. Generator bu paradigmani tabiiy implement qiladi: yield qilingan qiymat faqat next() chaqirilganda hisoblanadi. Afzalliklari: 1) cheksiz ketma-ketliklar bilan ishlash (Fibonacci, tub sonlar), 2) xotira tejash — barcha qiymatlar birdaniga xotirada saqlanmaydi, 3) og\'ir hisoblashlarni kechiktirish, 4) pipeline pattern — generatorlar zanjiri orqali ma\'lumotlarni bosqichma-bosqich filtratsiya/transformatsiya qilish.',
    },
    {
      question: 'yield va yield* ning farqi nima?',
      answer: 'yield bitta qiymatni qaytaradi va generatorni to\'xtatadi. yield* esa boshqa iterable yoki generator ga DELEGATSIYA qiladi — uning barcha qiymatlarini ketma-ket yield qiladi. Masalan: yield [1,2,3] — array ni bitta qiymat sifatida qaytaradi. yield* [1,2,3] — 1, 2, 3 ni alohida-alohida qaytaradi. yield* bilan generator kompozitsiya qilish va katta generatorni kichik qismlarga bo\'lish mumkin. yield* ning return qiymati ham olinishi mumkin: const result = yield* otherGen().',
    },
    {
      question: 'Async generatorlar qachon ishlatiladi?',
      answer: 'Async generatorlar (async function*) asinxron ma\'lumot oqimlari uchun ishlatiladi: 1) API paginatsiya — sahifama-sahifa fetch qilib, har bir elementni yield qilish, 2) WebSocket/SSE stream — real-time xabarlarni ketma-ket qayta ishlash, 3) fayl stream — katta fayllarni qismlarga bo\'lib o\'qish, 4) database cursor — katta natijalar to\'plamini qismlarga bo\'lish. for await...of loop bilan ishlatiladi. Har bir yield Promise qaytarishi mumkin va u avtomatik await qilinadi.',
    },
    {
      question: 'for...of va for...in ning farqi nima?',
      answer: 'for...in — obyektning KALITLARI (keys) ustida iteratsiya qiladi, prototype chain dagi kalitlarni ham o\'z ichiga oladi, barcha enumerable property larni ko\'rsatadi. for...of — iterable ning QIYMATLARI (values) ustida iteratsiya qiladi, faqat [Symbol.iterator] metodi bor obyektlarda ishlaydi. Oddiy obyekt { a: 1 } da for...of ishlamaydi (TypeError beradi), chunki u iterable emas. Array da for...in index larni beradi ("0","1","2"), for...of esa qiymatlarni beradi.',
    },
  ],
}
