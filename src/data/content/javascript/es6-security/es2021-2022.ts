import type { Topic } from '../../../types'

export const es2021_2022: Topic = {
  id: 'es2021-2022',
  title: 'ES2021-2022 Yangiliklari',
  importance: 2,
  status: 'to-learn',
  description: 'replaceAll, Promise.any, private fields, at(), top-level await, Error.cause',
  content: `ES2021 va ES2022 — JavaScript tilini yanada qulay va xavfsiz qilgan muhim yangilanishlar. Class lar, xatolarni boshqarish va massivlar bilan ishlashda katta yaxshilanishlar kiritildi.

═══════════════════════════════════════
  ES2021 (ES12) YANGILIKLARI
═══════════════════════════════════════

1. String.replaceAll()
   Barcha mos keluvchi qismlarni almashtiradi.
   Oldin global regex kerak edi: str.replace(/foo/g, "bar")
   Endi: str.replaceAll("foo", "bar")

2. Promise.any()
   Birinchi MUVAFFAQIYATLI promise natijasini qaytaradi.
   Hammasi reject bo'lsa — AggregateError.

   Promise.race — birinchi TUGAGAN (resolve yoki reject)
   Promise.any — birinchi MUVAFFAQIYATLI (faqat resolve)

3. WeakRef va FinalizationRegistry
   WeakRef — zaif referens, GC ga ta'sir qilmaydi.
   FinalizationRegistry — obyekt GC qilinganda callback.
   (Batafsil: memory-management mavzusida)

4. Logical assignment operatorlari:
   x ??= 5   — x null/undefined bo'lsa, 5 ga tenglashadi
   x ||= 5   — x falsy bo'lsa, 5 ga tenglashadi
   x &&= 5   — x truthy bo'lsa, 5 ga tenglashadi

5. Numeric separators:
   1_000_000 — o'qishni osonlashtiradi (qiymatga ta'sir qilmaydi)

═══════════════════════════════════════
  ES2022 (ES13) YANGILIKLARI
═══════════════════════════════════════

1. Array.at() va String.at()
   Manfiy indeks bilan oxiridan kirish:
   arr.at(-1) — oxirgi element (arr[arr.length-1] o'rniga)
   arr.at(-2) — oxirgidan oldingi

2. Top-level await
   await ni modul darajasida async funksiysiz ishlatish:
   const data = await fetch("/api/config").then(r => r.json())
   MUHIM: faqat ES modules da ishlaydi (type="module")

3. Private class fields va metodlar
   # belgisi bilan haqiqiy private xususiyatlar:
   class MyClass {
     #count = 0        // private field
     #increment() {}   // private metod
     static #total = 0 // static private
   }
   Tashqaridan kirib bo'lmaydi — SyntaxError.

4. Object.hasOwn(obj, prop)
   obj.hasOwnProperty(prop) ning xavfsiz muqobili.
   Object.create(null) bilan yaratilgan obyektlarda ham ishlaydi.

5. Error.cause
   Xatoning asl sababini saqlash:
   throw new Error("Yuklash xatosi", { cause: originalError })
   Xato zanjirini (error chain) yaratish imkonini beradi.

6. Static class blocks
   Class ichida bir martalik boshlang'ich kod:
   class DB {
     static connection
     static {
       DB.connection = initDB()
     }
   }

7. RegExp /d flag (hasIndices)
   Har bir guruh uchun boshlanish va tugash indekslarini beradi.`,
  codeExamples: [
    {
      title: 'ES2021 — replaceAll, Promise.any, logical assignment',
      language: 'js',
      code: `// ═══ replaceAll ═══
const text = "foo bar foo baz foo"

// Eskicha — regex kerak edi
text.replace(/foo/g, "qux")  // "qux bar qux baz qux"

// ✅ replaceAll
text.replaceAll("foo", "qux")  // "qux bar qux baz qux"

// ═══ Promise.any ═══
const fastest = await Promise.any([
  fetch("https://cdn1.example.com/data.json"),
  fetch("https://cdn2.example.com/data.json"),
  fetch("https://cdn3.example.com/data.json"),
])
// Birinchi muvaffaqiyatli javobni qaytaradi
// Hammasi xato bersa — AggregateError

try {
  await Promise.any([
    Promise.reject("xato1"),
    Promise.reject("xato2"),
  ])
} catch (err) {
  console.log(err instanceof AggregateError) // true
  console.log(err.errors) // ["xato1", "xato2"]
}

// ═══ Logical assignment ═══
let config = { theme: null, retries: 0, debug: true }

config.theme ??= "dark"     // "dark" (null edi)
config.retries ??= 3        // 0 (null/undefined emas)
config.debug &&= false       // false (truthy edi, yangilandi)

// Amaliy misol
function initUser(user) {
  user.name ??= "Mehmon"
  user.settings ??= {}
  user.settings.lang ??= "uz"
  return user
}`,
      description: 'ES2021 ning asosiy yangiliklari: replaceAll, Promise.any, logical assignment',
    },
    {
      title: 'Array.at() — manfiy indeks bilan kirish',
      language: 'js',
      code: `const fruits = ["olma", "banan", "uzum", "anor", "gilos"]

// Eskicha — oxirgi elementni olish
fruits[fruits.length - 1]   // "gilos"
fruits[fruits.length - 2]   // "anor"

// ✅ at() — manfiy indeks bilan
fruits.at(0)    // "olma"
fruits.at(-1)   // "gilos"
fruits.at(-2)   // "anor"

// String da ham ishlaydi
"Salom".at(-1)  // "m"
"Salom".at(0)   // "S"

// Amaliy misol: oxirgi element bilan ishlash
function getLastItem(arr) {
  return arr.at(-1)  // Qisqa va tushunarli
}

// Stack pattern
class Stack {
  #items = []

  push(item) { this.#items.push(item) }
  peek() { return this.#items.at(-1) }  // ✅ Oxirgi elementni ko'rish
  pop() { return this.#items.pop() }
  get size() { return this.#items.length }
}

const stack = new Stack()
stack.push("A")
stack.push("B")
console.log(stack.peek())  // "B"`,
      description: 'at() metodi bilan manfiy indeks — massiv va string uchun',
    },
    {
      title: 'Private fields va Error.cause',
      language: 'js',
      code: `// ═══ Private class fields ═══
class BankAccount {
  #balance = 0         // private field
  #owner               // private field

  constructor(owner, initial) {
    this.#owner = owner
    this.#balance = initial
  }

  #validate(amount) {  // private metod
    if (amount <= 0) throw new Error("Noto'g'ri summa")
    if (amount > this.#balance) throw new Error("Mablag' yetarli emas")
  }

  deposit(amount) {
    if (amount <= 0) throw new Error("Noto'g'ri summa")
    this.#balance += amount
    return this.#balance
  }

  withdraw(amount) {
    this.#validate(amount)
    this.#balance -= amount
    return this.#balance
  }

  get balance() { return this.#balance }

  static #bankName = "MyBank"  // static private
  static getBankName() { return BankAccount.#bankName }
}

const acc = new BankAccount("Ali", 1000)
acc.deposit(500)      // 1500
acc.withdraw(200)     // 1300
// acc.#balance        // SyntaxError! Private
// acc.#validate(100)  // SyntaxError! Private

// ═══ Error.cause ═══
async function fetchUserData(id) {
  try {
    const response = await fetch(\`/api/users/\${id}\`)
    if (!response.ok) {
      throw new Error(\`HTTP \${response.status}\`)
    }
    return await response.json()
  } catch (err) {
    // Asl xatoni cause ga saqlash
    throw new Error("Foydalanuvchi ma'lumotini yuklash xatosi", {
      cause: err
    })
  }
}

try {
  await fetchUserData(123)
} catch (err) {
  console.log(err.message) // "Foydalanuvchi ma'lumotini yuklash xatosi"
  console.log(err.cause)   // Error: "HTTP 404" — asl sabab
}`,
      description: 'Haqiqiy private maydonlar va Error.cause bilan xato zanjiri',
    },
    {
      title: 'Top-level await va Object.hasOwn',
      language: 'js',
      code: `// ═══ Top-level await ═══
// Oldin — IIFE kerak edi
;(async () => {
  const config = await loadConfig()
  startApp(config)
})()

// ✅ ES2022 — bevosita modul darajasida
// config.js (type="module")
const response = await fetch("/api/config")
export const config = await response.json()

// app.js
import { config } from "./config.js"
// config allaqachon tayyor — kutish avtomatik

// MUHIM: top-level await modul yuklanishini to'sib turadi
// Shuning uchun faqat zarur bo'lganda ishlatish kerak

// ═══ Object.hasOwn ═══
const user = { name: "Ali", age: 25 }

// ❌ Eskicha
user.hasOwnProperty("name")     // true
// Lekin Object.create(null) da ishlamaydi!
const dict = Object.create(null)
dict.key = "value"
// dict.hasOwnProperty("key")   // TypeError!

// ✅ Object.hasOwn — har doim ishlaydi
Object.hasOwn(user, "name")     // true
Object.hasOwn(user, "toString") // false (prototype da)
Object.hasOwn(dict, "key")      // true ✅

// ═══ Static class blocks ═══
class Database {
  static connection
  static isReady = false

  static {
    // Class yaratilganda bir marta ishlaydi
    try {
      Database.connection = connectToDatabase()
      Database.isReady = true
      console.log("DB tayyor")
    } catch (err) {
      Database.isReady = false
      console.error("DB xato:", err)
    }
  }
}`,
      description: 'Top-level await bilan modul darajasida async va Object.hasOwn xavfsizligi',
    },
  ],
  interviewQA: [
    {
      question: 'Promise.any va Promise.race farqi nima?',
      answer: 'Promise.race — birinchi TUGAGAN promise ni qaytaradi, muvaffaqiyatli yoki muvaffaqiyatsiz farqsiz. Promise.any — birinchi MUVAFFAQIYATLI (fulfilled) promise ni qaytaradi, reject qilinganlarni o\'tkazib yuboradi. Faqat BARCHA promise lar reject bo\'lganda AggregateError chiqaradi. Ishlatish: Promise.race — timeout qo\'yish (fetch va setTimeout poygasi). Promise.any — eng tez javob bergan serverdan ma\'lumot olish (CDN tanlash).',
    },
    {
      question: 'Private class fields (#) nima va nima uchun kerak?',
      answer: 'ES2022 da # belgisi bilan haqiqiy private xususiyatlar qo\'shildi: #field, #method(), static #prop. Oldingi usullar (underscore _field, Symbol, WeakMap) faqat KONVENTSIYA edi — tashqaridan kirishni to\'xtatmas edi. # bilan esa tashqaridan kirishga urinish SyntaxError beradi. Bu real encapsulation — ichki holatni tashqaridan o\'zgartirib bo\'lmaydi. Masalan, BankAccount.#balance ni faqat class ichidagi metodlar o\'zgartira oladi.',
    },
    {
      question: 'Top-level await nima va qanday cheklovlari bor?',
      answer: 'Top-level await — ES modules da await ni async funksiysiz modul darajasida ishlatish imkoniyati. Masalan: export const data = await fetch(url).then(r => r.json()). Bu modulni import qilgan boshqa modul ham avtomatik kutadi. Cheklovlari: 1) Faqat ES modules da ishlaydi (type="module"). 2) CommonJS (require) da ishlamaydi. 3) Modul yuklanishini to\'sib turadi — shuning uchun faqat zarur holatlarda ishlatish kerak. 4) Xatoni catch qilmasangiz, modul yuklanishi muvaffaqiyatsiz bo\'ladi.',
    },
    {
      question: 'Error.cause nima va nima uchun foydali?',
      answer: 'Error.cause (ES2022) — yangi xatoga asl sababni biriktirish: throw new Error("Yuqori daraja xatosi", { cause: originalError }). Bu xato zanjiri (error chain) yaratadi — har bir daraja o\'z kontekstini qo\'shadi lekin asl sabab saqlanadi. Foydasi: 1) Debug osonlashadi — catch da err.cause orqali asl xatoni ko\'rish. 2) Foydalanuvchiga tushunarli xabar, log ga texnik tafsilot. 3) Middleware va abstraction qatlamlarida xato ma\'lumoti yo\'qolmaydi. Java va C# dagi exception chaining ga o\'xshash.',
    },
    {
      question: 'Logical assignment operatorlari (??=, ||=, &&=) nima?',
      answer: `??= — faqat null/undefined bo'lganda yangi qiymat beradi: x ??= 5 teng x = x ?? 5. ||= — falsy bo'lganda beradi: x ||= 5 teng x = x || 5. &&= — truthy bo'lganda beradi: x &&= 5 teng x = x && 5. Amaliy ishlatish: config.theme ??= "dark" — tema berilmagan bo'lsa default qo'yish. user.name ||= "Mehmon" — bo'sh string ham almashtiriladi. cache.data &&= processData(cache.data) — faqat data mavjud bo'lsa qayta ishlash.`,
    },
  ],
}
