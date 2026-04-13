import type { Topic } from '../../../types'

export const dateIntl: Topic = {
  id: 'date-intl',
  title: 'Date va Intl',
  importance: 2,
  status: 'to-learn',
  description: 'JavaScript Date objecti, get/set metodlari, Intl.DateTimeFormat va Temporal API',
  content: `Date — JavaScript-da vaqt bilan ishlash uchun built-in object. 1970-yil 1-yanvardan boshlab millisekundlarda hisoblangan timestamp asosida ishlaydi. Date ko'p muammolarga ega (mutable, month 0-indexed, timezone), lekin hali ham eng ko'p ishlatiladigan API.

═══════════════════════════════════════
  DATE YARATISH
═══════════════════════════════════════

  new Date()                    — hozirgi vaqt
  new Date(milliseconds)        — timestamp dan
  new Date("2024-01-15")        — ISO string dan (UTC)
  new Date("2024-01-15T10:30")  — vaqt bilan
  new Date(2024, 0, 15, 10, 30) — alohida qiymatlar (MONTH 0-INDEXED!)
  Date.now()                    — hozirgi timestamp (ms)
  Date.parse("2024-01-15")      — stringni ms ga aylantiradi

MUHIM: new Date(2024, 0, 15) — bu YANVAR 15!
  Month: 0 = Yanvar, 1 = Fevral, ... 11 = Dekabr
  Bu JavaScript-ning eng mashhur "gotcha" laridan biri.

MUHIM: new Date("2024-01-15") — UTC sifatida talqin qilinadi,
lekin new Date("2024/01/15") — LOCAL vaqt sifatida!
DOIM ISO format (YYYY-MM-DD) ishlatish kerak.

═══════════════════════════════════════
  GET METODLARI
═══════════════════════════════════════

  d.getFullYear()    — yil (4 raqam)
  d.getMonth()       — oy (0-11!)
  d.getDate()        — kun (1-31)
  d.getDay()         — hafta kuni (0=Yakshanba, 6=Shanba)
  d.getHours()       — soat (0-23)
  d.getMinutes()     — daqiqa (0-59)
  d.getSeconds()     — soniya (0-59)
  d.getMilliseconds() — millisekund (0-999)
  d.getTime()        — timestamp (ms)
  d.getTimezoneOffset() — UTC dan farq (daqiqada)

UTC versiyalari ham bor: getUTCFullYear(), getUTCMonth()...

═══════════════════════════════════════
  SET METODLARI
═══════════════════════════════════════

  d.setFullYear(2025)
  d.setMonth(5)         — Iyun (0-indexed!)
  d.setDate(20)
  d.setHours(14, 30, 0) — soat, daqiqa, soniya

MUHIM: Date MUTABLE — set metodlari ASLINI o'zgartiradi!
  const d = new Date()
  d.setMonth(5)  // d o'zgardi, YANGI Date yaratilmadi!

Immutable ishlash uchun:
  const newDate = new Date(d.getTime())
  newDate.setMonth(5)  // faqat nusxa o'zgardi

═══════════════════════════════════════
  DATE ARIFMETIKASI
═══════════════════════════════════════

Ikki sana orasidagi farq:
  const start = new Date("2024-01-01")
  const end = new Date("2024-03-15")
  const diffMs = end - start               // millisekundlarda
  const diffDays = diffMs / (1000 * 60 * 60 * 24)  // kunlarda

Sanaga kun/oy qo'shish:
  const d = new Date()
  d.setDate(d.getDate() + 7)    // 7 kun qo'shish
  d.setMonth(d.getMonth() + 1)  // 1 oy qo'shish (overflow boshqariladi)

MUHIM: setDate(32) — avtomatik keyingi oyga o'tadi.
  new Date(2024, 0, 32) → 2024-02-01 (Fevral 1)

═══════════════════════════════════════
  INTL.DATETIMEFORMAT
═══════════════════════════════════════

Intl.DateTimeFormat — sanani lokalizatsiya qilingan formatda
ko'rsatish uchun standart API:

  new Intl.DateTimeFormat("uz-UZ").format(new Date())
  // "15.01.2024"

  new Intl.DateTimeFormat("uz-UZ", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(new Date())
  // "dushanba, 15-yanvar 2024"

Nisbiy vaqt:
  new Intl.RelativeTimeFormat("uz", { numeric: "auto" })
    .format(-1, "day")   // "kecha"
    .format(2, "hour")   // "2 soatdan keyin"

═══════════════════════════════════════
  DATE MUAMMOLARI
═══════════════════════════════════════

1. Mutable — set metodlari aslini o'zgartiradi
2. Month 0-indexed — 0 = Yanvar (eng katta xato manbai)
3. Timezone — lokale va UTC aralashishi
4. Parsing — turli formatlar turlicha talqin qilinadi
5. DST (daylight saving) — soat o'zgarishi muammolari
6. Yil 2-digit — new Date(24, 0, 1) → 1924-01-01!

═══════════════════════════════════════
  TEMPORAL API (KELAJAK)
═══════════════════════════════════════

Temporal — Date-ni almashtirish uchun yangi API (Stage 3 proposal):

  - Immutable (o'zgarmas)
  - Month 1-indexed (1 = Yanvar)
  - Timezone-ni aniq boshqarish
  - Duration, PlainDate, PlainTime, ZonedDateTime
  - Turli kalendarlar qo'llab-quvvatlanadi

  Temporal.PlainDate.from("2024-01-15")
  Temporal.Now.plainDateTimeISO()
  date.add({ days: 7 })  // yangi object qaytaradi

Hozircha polyfill orqali ishlatish mumkin.
Brauzerlarda native qo'llab-quvvatlash bosqichma-bosqich kelmoqda.`,
  codeExamples: [
    {
      title: 'Date yaratish va get metodlari',
      language: 'js',
      code: `// Turli usullar bilan Date yaratish
const now = new Date()                      // hozirgi vaqt
const fromISO = new Date("2024-06-15")      // ISO string (UTC)
const fromParts = new Date(2024, 5, 15)     // Iyun 15 (month 0-indexed!)
const fromTimestamp = new Date(1718409600000) // timestamp dan

// MUHIM: month 0-indexed!
const january = new Date(2024, 0, 1)   // Yanvar 1
const december = new Date(2024, 11, 31) // Dekabr 31
// new Date(2024, 12, 1) → Yanvar 1, 2025! (overflow)

// Get metodlari
const d = new Date("2024-06-15T14:30:45")
d.getFullYear()      // 2024
d.getMonth()         // 5 (Iyun = 5, YANVAR EMAS!)
d.getDate()          // 15
d.getDay()           // 6 (Shanba, 0=Yakshanba)
d.getHours()         // 14
d.getMinutes()       // 30
d.getTime()          // 1718458245000 (timestamp ms)

// Timestamp
Date.now()           // hozirgi vaqt ms da (Date yaratmasdan)
+new Date()          // xuddi shunday (lekin Date yaratiladi)

// String ga aylantirish
d.toISOString()      // "2024-06-15T14:30:45.000Z"
d.toLocaleDateString("uz-UZ")  // "15.06.2024"
d.toLocaleTimeString("uz-UZ")  // "14:30:45"`,
      description: 'Date yaratishning turli usullari. MUHIM: month 0-indexed (0=Yanvar). getDay() ham 0-indexed (0=Yakshanba).',
    },
    {
      title: 'Date arifmetikasi va farq hisoblash',
      language: 'js',
      code: `// Ikki sana orasidagi farq
const start = new Date("2024-01-01")
const end = new Date("2024-06-15")

const diffMs = end - start
const diffSeconds = diffMs / 1000
const diffMinutes = diffMs / (1000 * 60)
const diffHours = diffMs / (1000 * 60 * 60)
const diffDays = diffMs / (1000 * 60 * 60 * 24)
// 166 kun

// Sanaga qo'shish
function addDays(date, days) {
  const result = new Date(date)  // nusxa!
  result.setDate(result.getDate() + days)
  return result
}

function addMonths(date, months) {
  const result = new Date(date)
  result.setMonth(result.getMonth() + months)
  return result
}

const today = new Date()
const nextWeek = addDays(today, 7)
const nextMonth = addMonths(today, 1)

// Yosh hisoblash
function getAge(birthDate) {
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  return age
}
getAge("1995-03-20")  // yosh

// Oyning oxirgi kunini topish
function lastDayOfMonth(year, month) {
  // Keyingi oyning 0-kuni = shu oyning oxirgi kuni
  return new Date(year, month + 1, 0).getDate()
}
lastDayOfMonth(2024, 1)  // 29 (2024 — kabisa yili)
lastDayOfMonth(2023, 1)  // 28`,
      description: 'Date arifmetikasi timestamp (ms) orqali ishlaydi. DOIM yangi Date nusxasi yarating (mutable ekanini unutmang).',
    },
    {
      title: 'Intl.DateTimeFormat — lokalizatsiya',
      language: 'js',
      code: `const date = new Date("2024-06-15T14:30:00")

// Oddiy formatlash
new Intl.DateTimeFormat("uz-UZ").format(date)
// "15.06.2024"

// To'liq format
new Intl.DateTimeFormat("uz-UZ", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
}).format(date)
// "shanba, 15-iyun 2024"

// Faqat vaqt
new Intl.DateTimeFormat("uz-UZ", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
}).format(date)
// "14:30:00"

// Turli tillar
const formatters = {
  uz: new Intl.DateTimeFormat("uz-UZ", { dateStyle: "full" }),
  ru: new Intl.DateTimeFormat("ru-RU", { dateStyle: "full" }),
  en: new Intl.DateTimeFormat("en-US", { dateStyle: "full" }),
}
formatters.uz.format(date)  // "shanba, 15-iyun 2024-yil"
formatters.ru.format(date)  // "суббота, 15 июня 2024 г."
formatters.en.format(date)  // "Saturday, June 15, 2024"

// RelativeTimeFormat — nisbiy vaqt
const rtf = new Intl.RelativeTimeFormat("uz", { numeric: "auto" })
rtf.format(-1, "day")     // "kecha"
rtf.format(0, "day")      // "bugun"
rtf.format(1, "day")      // "ertaga"
rtf.format(-2, "hour")    // "2 soat oldin"
rtf.format(3, "month")    // "3 oydan keyin"

// Amaliy: "qancha vaqt oldin" funksiya
function timeAgo(date) {
  const rtf = new Intl.RelativeTimeFormat("uz", { numeric: "auto" })
  const diffMs = date - new Date()
  const diffSec = Math.round(diffMs / 1000)
  const diffMin = Math.round(diffSec / 60)
  const diffHour = Math.round(diffMin / 60)
  const diffDay = Math.round(diffHour / 24)

  if (Math.abs(diffSec) < 60) return rtf.format(diffSec, "second")
  if (Math.abs(diffMin) < 60) return rtf.format(diffMin, "minute")
  if (Math.abs(diffHour) < 24) return rtf.format(diffHour, "hour")
  return rtf.format(diffDay, "day")
}`,
      description: 'Intl.DateTimeFormat va RelativeTimeFormat — sanani turli tillarda formatlash. timeAgo funksiyasi — "5 daqiqa oldin" ko\'rsatish.',
    },
    {
      title: 'Date muammolari va yechimlar',
      language: 'js',
      code: `// MUAMMO 1: Mutable
const date1 = new Date("2024-01-15")
const date2 = date1  // REFERENCE! nusxa EMAS
date2.setMonth(5)
console.log(date1)   // Iyun 15! date1 HAM o'zgardi

// YECHIM: DOIM nusxa yaratish
const date3 = new Date("2024-01-15")
const date4 = new Date(date3.getTime())  // mustaqil nusxa
date4.setMonth(5)
console.log(date3)   // Yanvar 15 — saqlanib qoldi

// MUAMMO 2: Month 0-indexed
new Date(2024, 1, 1)   // Fevral 1 (1 = Fevral!)
new Date(2024, 12, 1)  // Yanvar 1, 2025 (overflow!)

// YECHIM: doim izoh yozing yoki helper
function createDate(year, month, day) {
  return new Date(year, month - 1, day) // 1-indexed qabul qiladi
}
createDate(2024, 6, 15)  // Iyun 15 (aniq va tushunarli)

// MUAMMO 3: String parsing
new Date("2024-01-15")     // UTC (00:00 UTC)
new Date("2024-01-15T00:00") // LOCAL vaqt
new Date("01/15/2024")     // LOCAL (US format)
new Date("15/01/2024")     // Invalid Date! (ko'p brauzerlarda)

// YECHIM: DOIM ISO format + aniq timezone
new Date("2024-01-15T00:00:00Z")       // UTC
new Date("2024-01-15T00:00:00+05:00")  // UTC+5

// MUAMMO 4: Taqqoslash
const a = new Date("2024-01-15")
const b = new Date("2024-01-15")
a === b   // false! (turli object referensi)
a == b    // false!

// YECHIM: timestamp bilan taqqoslash
a.getTime() === b.getTime()  // true
+a === +b                     // true (unary + timestamp beradi)`,
      description: 'Date-ning 4 ta asosiy muammosi: mutable, 0-indexed month, parsing xilma-xillik, referens taqqoslash. Har birining yechimi ko\'rsatilgan.',
    },
    {
      title: 'Temporal API — kelajak standart',
      language: 'js',
      code: `// MUHIM: Temporal hali Stage 3 proposal.
// Brauzerlarda native qo'llab-quvvatlash bosqichma-bosqich.
// Hozircha @js-temporal/polyfill orqali ishlatish mumkin.

// PlainDate — faqat sana (vaqtsiz, timezonesiz)
const date = Temporal.PlainDate.from("2024-06-15")
// yoki: Temporal.PlainDate.from({ year: 2024, month: 6, day: 15 })

date.year       // 2024
date.month      // 6 (1-indexed! Iyun = 6)
date.day        // 15
date.dayOfWeek  // 6 (1=Dushanba, 7=Yakshanba — ISO 8601)

// Immutable — har bir operatsiya YANGI object qaytaradi
const nextWeek = date.add({ days: 7 })
// date o'zgarmadi, nextWeek = 2024-06-22

const prevMonth = date.subtract({ months: 1 })
// 2024-05-15

// Duration — vaqt davomiyligi
const duration = Temporal.Duration.from({ hours: 2, minutes: 30 })
// yoki: date1.until(date2)

// ZonedDateTime — timezone bilan
const zoned = Temporal.ZonedDateTime.from({
  timeZone: "Asia/Tashkent",
  year: 2024, month: 6, day: 15,
  hour: 14, minute: 30,
})

// Taqqoslash
const a = Temporal.PlainDate.from("2024-01-15")
const b = Temporal.PlainDate.from("2024-06-15")
Temporal.PlainDate.compare(a, b)  // -1 (a < b)

// Nima uchun Temporal yaxshiroq:
// 1. Immutable (mutable emas)
// 2. Month 1-indexed (1 = Yanvar)
// 3. Aniq timezone boshqaruvi
// 4. Duration — vaqt farqini ifodalash uchun maxsus tip
// 5. PlainDate vs ZonedDateTime — aniq ajratish`,
      description: 'Temporal API — Date-ni almashtiradigan yangi standart. Immutable, 1-indexed months, aniq timezone. Hali proposal bosqichida.',
    },
  ],
  interviewQA: [
    {
      question: 'JavaScript Date objectining asosiy muammolari nimalar?',
      answer: 'Date-ning 6 ta asosiy muammosi: 1) MUTABLE — setMonth() aslini o\'zgartiradi, funksiyaga bersangiz tashqarida ham o\'zgaradi. 2) Month 0-INDEXED — 0=Yanvar, bu eng katta xato manbai. 3) TIMEZONE muammolari — constructor string formatiga qarab UTC yoki local vaqt beradi. 4) PARSING — "01/15/2024" va "15/01/2024" turli brauzerda turlicha ishlaydi. 5) DST — daylight saving vaqtida soat o\'zgarishi kutilmagan natijalarga olib keladi. 6) new Date(24, 0, 1) — 2024 emas, 1924 beradi (2-digit yil 1900 ga qo\'shiladi). Shuning uchun ko\'pchilik loyihalarda date-fns, dayjs yoki Temporal polyfill ishlatiladi.',
    },
    {
      question: 'Intl.DateTimeFormat va toLocaleDateString farqi nima?',
      answer: 'toLocaleDateString ichida Intl.DateTimeFormat ni ishlatadi — natija bir xil. LEKIN muhim farq bor: Intl.DateTimeFormat objectini BIR MARTA yaratib, KO\'P MARTA ishlatish mumkin — bu performance uchun juda muhim (har safar formatter yaratmaslik). 1000 ta sanani formatlashda Intl.DateTimeFormat 10-50x tezroq. Yana: formatToParts() metodi bor — sana qismlarini alohida olish mumkin (masalan, faqat oy nomi yoki kun). Ko\'p sanani formatlash kerak bo\'lganda DOIM formatter objectini qayta ishlating.',
    },
    {
      question: 'Date.now() va new Date().getTime() farqi nima?',
      answer: 'Natija BIR XIL — hozirgi vaqtning timestamp-i (ms). Lekin Date.now() SAMARALIROQ: u Date objecti YARATMAYDI, to\'g\'ridan-to\'g\'ri raqam qaytaradi. new Date().getTime() esa avval Date objecti yaratadi, keyin getTime() chaqiradi — keraksiz xotira sarflanadi. Performance-critical kodda (loop ichida, animation frame) DOIM Date.now() ishlatish kerak. Yana: +new Date() ham ishlaydi (unary + operator valueOf() ni chaqiradi), lekin Date.now() eng aniq va tez usul.',
    },
    {
      question: 'Temporal API nima va u Date-dan qanday yaxshiroq?',
      answer: 'Temporal — JavaScript-da Date objectini almashtirishga mo\'ljallangan yangi API (TC39 Stage 3 proposal). Asosiy afzalliklari: 1) IMMUTABLE — har bir metod yangi object qaytaradi, aslini o\'zgartirmaydi. 2) Month 1-INDEXED — 1=Yanvar (Date-dagi 0-indexed muammo yo\'q). 3) Aniq TIMEZONE — PlainDate (timezonesiz) va ZonedDateTime (timezone bilan) alohida tiplar. 4) DURATION tipi — vaqt farqini ifodalash uchun maxsus tip. 5) compare() metodi — taqqoslash oson. Hozircha @js-temporal/polyfill orqali ishlatish mumkin. Senior sifatida Temporal-ni bilish kerak — kelajak standart.',
    },
    {
      question: 'Ikki Date objectini qanday taqqoslash mumkin?',
      answer: 'Date objectlari reference type, shuning uchun === va == ISHLAMAYDI (new Date("2024-01-15") === new Date("2024-01-15") = false). To\'g\'ri usullar: 1) getTime() bilan: a.getTime() === b.getTime(), 2) Unary + bilan: +a === +b (timestamp ga aylantiradi), 3) < va > operatorlari TO\'G\'RIDAN-TO\'G\'RI ishlaydi: date1 < date2 (valueOf() chaqiriladi). Sort uchun: dates.sort((a, b) => a - b). MUHIM: null va undefined bilan ehtiyot bo\'ling — new Date(null) = 1970-01-01, lekin new Date(undefined) = Invalid Date.',
    },
  ],
  relatedTopics: [
    { techId: 'javascript', sectionId: 'built-in-methods', topicId: 'number-math', label: 'Number va Math' },
    { techId: 'javascript', sectionId: 'built-in-methods', topicId: 'string-methods', label: 'String metodlari' },
  ],
}
