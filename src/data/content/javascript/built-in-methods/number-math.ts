import type { Topic } from '../../../types'

export const numberMath: Topic = {
  id: 'number-math',
  title: 'Number va Math',
  importance: 2,
  status: 'to-learn',
  description: 'JavaScript Number tipi, Math metodlari, BigInt, floating point muammosi va Intl.NumberFormat',
  content: `JavaScript-da BARCHA oddiy sonlar 64-bit IEEE 754 floating point formatida saqlanadi. Bu butun sonlar ham, kasrli sonlar ham bitta tip — number. Bu arxitektura ko'p afzalliklarga ega, lekin floating point muammolarini ham olib keladi.

═══════════════════════════════════════
  NUMBER STATIK METODLARI
═══════════════════════════════════════

  Number.parseInt(str, radix)   — stringni butun songa aylantiradi
  Number.parseFloat(str)        — stringni kasrli songa aylantiradi
  Number.isNaN(val)             — qiymat NaN mi? (qat'iy)
  Number.isFinite(val)          — chekli sonmi? (qat'iy)
  Number.isInteger(val)         — butun sonmi?
  Number.isSafeInteger(val)     — xavfsiz butun sonmi?

MUHIM: Number.isNaN vs global isNaN farqi:
  isNaN("hello")         // true  — stringni songa aylantiradi, keyin tekshiradi
  Number.isNaN("hello")  // false — tip tekshiradi, string NaN EMAS
  Number.isNaN(NaN)      // true  — faqat HAQIQIY NaN uchun true

Shuning uchun DOIM Number.isNaN() ishlatish kerak.

═══════════════════════════════════════
  FLOATING POINT MUAMMOSI
═══════════════════════════════════════

  0.1 + 0.2 === 0.3   // false!
  0.1 + 0.2            // 0.30000000000000004

Bu JavaScript-ning xatosi EMAS — barcha IEEE 754 tillarida
(Java, Python, C++) xuddi shunday. Sabab: 0.1 ikkilik sanoq
tizimida cheksiz kasrga ega (xuddi 1/3 o'nlik tizimda).

Yechimlar:
  1. Number.EPSILON bilan taqqoslash:
     Math.abs(0.1 + 0.2 - 0.3) < Number.EPSILON  // true

  2. Butun songa aylantirish (tiyinlarda hisoblash):
     (10 + 20) / 100 === 0.3  // true

  3. toFixed() bilan yaxlitlash:
     (0.1 + 0.2).toFixed(2)   // "0.30" (string!)

═══════════════════════════════════════
  BIGINT — KATTA SONLAR
═══════════════════════════════════════

Number.MAX_SAFE_INTEGER = 2^53 - 1 = 9007199254740991
Bundan katta sonlar uchun BigInt ishlatiladi:

  const big = 9007199254740993n  // n suffiks
  const big2 = BigInt("9007199254740993")

MUHIM cheklovlar:
  - BigInt va number ARALASHTIRIB bo'lmaydi: 1n + 2 → TypeError
  - Math metodlari BigInt bilan ISHLAMAYDI
  - JSON.stringify BigInt ni QABUL QILMAYDI
  - Taqqoslash ishlaydi: 1n === 1 (false), 1n == 1 (true)

Amaliy foydalanish: kriptografiya, katta ID-lar (Twitter snowflake),
moliyaviy hisob-kitoblar.

═══════════════════════════════════════
  MATH METODLARI
═══════════════════════════════════════

Yaxlitlash:
  Math.floor(4.9)    // 4   — pastga
  Math.ceil(4.1)     // 5   — yuqoriga
  Math.round(4.5)    // 5   — yaqiniga (.5 da yuqoriga)
  Math.trunc(4.9)    // 4   — kasr qismini tashlaydi
  Math.trunc(-4.9)   // -4  (floor -5 berardi!)

MUHIM: Manfiy sonlarda floor va trunc FARQ qiladi:
  Math.floor(-4.1)   // -5  (pastga = -5)
  Math.trunc(-4.1)   // -4  (kasr tashlash = -4)

Matematik:
  Math.abs(-5)          // 5     — absolut qiymat
  Math.pow(2, 3)        // 8     — daraja (2 ** 3 ham ishlaydi)
  Math.sqrt(16)         // 4     — kvadrat ildiz
  Math.max(1, 5, 3)     // 5     — eng kattasi
  Math.min(1, 5, 3)     // 1     — eng kichigi
  Math.random()         // 0-1   — tasodifiy son (0 kiritiladi, 1 kiritilmaydi)

═══════════════════════════════════════
  MUHIM KONSTANTALAR
═══════════════════════════════════════

  Number.MAX_SAFE_INTEGER    // 9007199254740991 (2^53 - 1)
  Number.MIN_SAFE_INTEGER    // -9007199254740991
  Number.MAX_VALUE           // ~1.79e308 (eng katta number)
  Number.MIN_VALUE           // ~5e-324 (eng kichik musbat)
  Number.EPSILON             // ~2.22e-16 (eng kichik farq)
  Number.POSITIVE_INFINITY   // Infinity
  Number.NEGATIVE_INFINITY   // -Infinity
  Number.NaN                 // NaN

═══════════════════════════════════════
  INTL.NUMBERFORMAT — FORMATLASH
═══════════════════════════════════════

Intl.NumberFormat — sonlarni lokalizatsiya qilingan formatda
ko'rsatish uchun standart API:

  new Intl.NumberFormat("uz-UZ").format(1234567.89)
  // "1 234 567,89"

  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(1234.5)
  // "$1,234.50"

  new Intl.NumberFormat("uz-UZ", {
    style: "percent"
  }).format(0.85)
  // "85%"

Bu qo'lda format yozishdan ko'ra ANCHA yaxshi — barcha til
va valyuta qoidalarini avtomatik boshqaradi.`,
  codeExamples: [
    {
      title: 'Number metodlari va tip tekshirish',
      language: 'js',
      code: `// parseInt va parseFloat
Number.parseInt("42px")       // 42 (boshidagi sonni oladi)
Number.parseInt("0xFF", 16)   // 255 (16-lik sanoq)
Number.parseInt("111", 2)     // 7 (2-lik sanoq)
Number.parseFloat("3.14abc")  // 3.14

// Number() vs parseInt()
Number("42px")      // NaN (butunlay son bo'lishi kerak)
parseInt("42px")    // 42 (boshidagi sonni oladi)
Number("")          // 0
parseInt("")        // NaN
Number(true)        // 1
Number(null)        // 0
Number(undefined)   // NaN

// isNaN — global vs Number
isNaN("hello")          // true  (XATO natija!)
Number.isNaN("hello")   // false (TO'G'RI)
Number.isNaN(NaN)        // true
Number.isNaN(0 / 0)      // true

// isFinite
Number.isFinite(42)           // true
Number.isFinite(Infinity)     // false
Number.isFinite(NaN)          // false
Number.isFinite("42")         // false (global isFinite true berardi)

// isInteger va isSafeInteger
Number.isInteger(5)           // true
Number.isInteger(5.0)         // true (5.0 === 5)
Number.isInteger(5.1)         // false

const big = 9007199254740992
Number.isSafeInteger(big)     // false (MAX_SAFE_INTEGER dan katta)
// Xavfsiz emas: big === big + 1  // true! (precision yo'qoladi)`,
      description: 'Number.parseInt, parseFloat stringdan son oladi. Number.isNaN — global isNaN dan xavfsizroq. isSafeInteger — katta sonlarni tekshirish.',
    },
    {
      title: 'Floating point va BigInt',
      language: 'js',
      code: `// Floating point muammosi
console.log(0.1 + 0.2)        // 0.30000000000000004
console.log(0.1 + 0.2 === 0.3) // false

// 1-yechim: EPSILON bilan taqqoslash
function almostEqual(a, b) {
  return Math.abs(a - b) < Number.EPSILON
}
almostEqual(0.1 + 0.2, 0.3)   // true

// 2-yechim: Butun sonlarda ishlash (tiyinlar)
const price1 = 1099  // 10.99 so'm = 1099 tiyin
const price2 = 2050  // 20.50 so'm = 2050 tiyin
const total = (price1 + price2) / 100  // 31.49

// 3-yechim: toFixed (string qaytaradi!)
const sum = (0.1 + 0.2).toFixed(2)    // "0.30"
const num = parseFloat(sum)            // 0.3

// BigInt
const bigNum = 9007199254740993n
const bigNum2 = BigInt("9007199254740993")

bigNum + 10n          // 9007199254741003n  (n + n)
// bigNum + 10        // TypeError! (n + number MUMKIN EMAS)
Number(bigNum)        // 9007199254740992 (precision yo'qoladi!)

// BigInt taqqoslash
1n === 1      // false (turli tip)
1n == 1       // true (type coercion)
1n < 2        // true

// JSON bilan muammo
// JSON.stringify({ id: 123n })  // TypeError!
// Yechim: toJSON yoki replacer
const data = { id: 123n }
JSON.stringify(data, (key, val) =>
  typeof val === "bigint" ? val.toString() : val
)
// '{"id":"123"}'`,
      description: 'Floating point muammosining 3 yechimi. BigInt katta sonlar uchun, lekin number bilan aralashtirib bo\'lmaydi va JSON.stringify bilan ishlash maxsus e\'tibor talab qiladi.',
    },
    {
      title: 'Math — yaxlitlash va foydali funksiyalar',
      language: 'js',
      code: `// Yaxlitlash — farqlarni tushunish
Math.floor(4.9)     // 4
Math.floor(-4.1)    // -5 (pastga!)
Math.ceil(4.1)      // 5
Math.ceil(-4.9)     // -4 (yuqoriga!)
Math.round(4.5)     // 5
Math.round(-4.5)    // -4 (0 tomonga!)
Math.trunc(4.9)     // 4
Math.trunc(-4.9)    // -4 (kasr tashlash)

// Tasodifiy son generatsiya
// 0 dan 1 gacha (1 kiritilmaydi)
Math.random()  // 0.7423...

// min dan max gacha (kiritiladi)
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
randomInt(1, 100)  // 1-100 orasida

// Massivdan tasodifiy element
function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}
randomItem(["olma", "banan", "uzum"])

// Massivdan min/max
const nums = [3, 1, 4, 1, 5, 9]
Math.max(...nums)   // 9
Math.min(...nums)   // 1

// MUHIM: katta massivlarda spread xavfli (stack overflow)
// Yechim:
const max = nums.reduce((a, b) => Math.max(a, b), -Infinity)

// Raqamni chegaralash (clamp)
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}
clamp(150, 0, 100)  // 100
clamp(-5, 0, 100)   // 0
clamp(50, 0, 100)   // 50`,
      description: 'Math.floor/ceil/round/trunc — manfiy sonlarda farqli ishlaydi. random bilan tasodifiy son, max/min bilan massivdan eng katta/kichik qiymat.',
    },
    {
      title: 'Intl.NumberFormat — professional formatlash',
      language: 'js',
      code: `// Oddiy formatlash
new Intl.NumberFormat("uz-UZ").format(1234567.89)
// "1 234 567,89"

new Intl.NumberFormat("en-US").format(1234567.89)
// "1,234,567.89"

// Valyuta
const uzFormatter = new Intl.NumberFormat("uz-UZ", {
  style: "currency",
  currency: "UZS",
  maximumFractionDigits: 0,
})
uzFormatter.format(1500000)  // "1 500 000 so'm"

const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
})
usdFormatter.format(1234.5)  // "$1,234.50"

// Foiz
new Intl.NumberFormat("uz-UZ", {
  style: "percent",
  minimumFractionDigits: 1,
}).format(0.8567)
// "85,7%"

// Qisqartirilgan raqamlar (compact)
new Intl.NumberFormat("en-US", {
  notation: "compact",
  compactDisplay: "short",
}).format(1500000)
// "1.5M"

new Intl.NumberFormat("en-US", {
  notation: "compact",
  compactDisplay: "long",
}).format(1500000)
// "1.5 million"

// Birlik (unit)
new Intl.NumberFormat("uz-UZ", {
  style: "unit",
  unit: "kilometer-per-hour",
}).format(120)
// "120 km/soat"

// Qayta ishlatish (performance)
const fmt = new Intl.NumberFormat("uz-UZ")
const prices = [5000, 15000, 1200000]
const formatted = prices.map(p => fmt.format(p))
// ["5 000", "15 000", "1 200 000"]`,
      description: 'Intl.NumberFormat — valyuta, foiz, compact format uchun. Formatter objectni yaratib qayta ishlatish performance uchun yaxshi.',
    },
  ],
  interviewQA: [
    {
      question: '0.1 + 0.2 !== 0.3 bo\'lishining sababi nima? Qanday yechiladi?',
      answer: 'JavaScript (va barcha IEEE 754 tillar) sonlarni ikkilik sanoq tizimida saqlaydi. 0.1 ikkilikda cheksiz kasrga ega (xuddi o\'nlikda 1/3 = 0.333... bo\'lgani kabi). 64-bit joyga sig\'dirish uchun kesiladi va kichik xatolik paydo bo\'ladi. Yechimlar: 1) Number.EPSILON bilan taqqoslash: Math.abs(a - b) < Number.EPSILON, 2) Butun sonlarda ishlash — pul hisob-kitoblarida tiyinlarda saqlash (1099 = 10.99), 3) toFixed() bilan yaxlitlash (lekin string qaytaradi). Moliyaviy ilovalarda maxsus kutubxonalar (decimal.js, big.js) ishlatiladi.',
    },
    {
      question: 'Number.isNaN va global isNaN farqi nima?',
      answer: 'Global isNaN(val) avval val ni Number tipiga aylantiradi, keyin NaN mi tekshiradi. Shuning uchun isNaN("hello") = true (chunki Number("hello") = NaN). Bu ko\'p hollarda NOTO\'G\'RI natija beradi. Number.isNaN(val) TIP AYLANTIRISIZ tekshiradi — faqat val haqiqatan NaN bo\'lsagina true qaytaradi. Number.isNaN("hello") = false (chunki "hello" — string, NaN emas). Qoida: DOIM Number.isNaN() ishlatish kerak. Xuddi shunday Number.isFinite() > global isFinite().',
    },
    {
      question: 'BigInt nima va qachon ishlatiladi?',
      answer: 'BigInt — ixtiyoriy katta butun sonlarni ifodalovchi primitiv tip. Number.MAX_SAFE_INTEGER (2^53 - 1 = 9007199254740991) dan katta sonlar uchun kerak. 123n yoki BigInt("123") sintaksisi. Cheklovlar: 1) number bilan aralashtirib bo\'lmaydi (1n + 2 = TypeError), 2) Math metodlari ishlamaydi, 3) JSON.stringify qabul qilmaydi (maxsus replacer kerak), 4) kasr qismini saqlamaydi. Amaliy foydalanish: katta ID-lar (Twitter snowflake), kriptografiya, moliyaviy hisob-kitoblar, timestamp-lar.',
    },
    {
      question: 'Math.floor, Math.ceil, Math.round, Math.trunc farqi nima?',
      answer: 'Musbat sonlarda farq kam, lekin MANFIY sonlarda jiddiy farq bor: Math.floor — DOIM pastga (manfiy tomonga): floor(-4.1) = -5. Math.ceil — DOIM yuqoriga (musbat tomonga): ceil(-4.9) = -4. Math.round — yaqiniga yaxlitlaydi (.5 da yuqoriga): round(-4.5) = -4. Math.trunc — kasr qismini tashlaydi (nolga qarab): trunc(-4.9) = -4. Eng ko\'p xato floor va trunc ni aralashtirishda — manfiy sonlarda ular farqli natija beradi.',
    },
    {
      question: 'parseInt("08") qanday natija beradi? Nima uchun ehtiyot bo\'lish kerak?',
      answer: 'Zamonaviy JavaScript-da parseInt("08") = 8 (o\'nlik sanoq). Lekin ESKI brauzerlarda 0 bilan boshlanuvchi sonlar SAKKIZLIK (octal) deb talqin qilinishi mumkin edi — parseInt("08") = 0. Shuning uchun DOIM radix parametrini berish kerak: parseInt("08", 10) = 8. Number.parseInt === parseInt (bir xil funksiya). Yana: parseInt("42px") = 42 (boshidagi sonni oladi), lekin Number("42px") = NaN (butunlay son bo\'lishi kerak). Validatsiya uchun Number() xavfsizroq.',
    },
  ],
  relatedTopics: [
    { techId: 'javascript', sectionId: 'built-in-methods', topicId: 'date-intl', label: 'Date va Intl' },
    { techId: 'javascript', sectionId: 'built-in-methods', topicId: 'json-structured-clone', label: 'JSON va structuredClone' },
  ],
}
