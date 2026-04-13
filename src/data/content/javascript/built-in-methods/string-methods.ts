import type { Topic } from '../../../types'

export const stringMethods: Topic = {
  id: 'string-methods',
  title: 'String Metodlari',
  importance: 3,
  status: 'to-learn',
  description: 'JavaScript string metodlari — qidirish, o\'zgartirish, kesish, template literals va Unicode',
  content: `String — JavaScript-da primitive tip, lekin metodlar chaqirilganda vaqtincha String wrapper object-ga aylanadi (autoboxing). Stringlar IMMUTABLE — hech bir metod asl stringni o'zgartirmaydi, DOIM yangi string qaytaradi.

═══════════════════════════════════════
  QIDIRISH METODLARI
═══════════════════════════════════════

  indexOf(str, from)     — birinchi topilgan pozitsiya (-1 agar yo'q)
  lastIndexOf(str, from) — oxirgi topilgan pozitsiya
  includes(str, from)    — mavjudmi? (boolean)
  startsWith(str, pos)   — shu bilan boshlanadimi?
  endsWith(str, length)  — shu bilan tugaydimi?
  search(regexp)         — RegExp bilan qidirish (birinchi pozitsiya)
  match(regexp)          — RegExp natijalarini qaytaradi (massiv)
  matchAll(regexp)       — BARCHA mosliklarni iterator sifatida qaytaradi

MUHIM: includes, startsWith, endsWith — BOOLEAN qaytaradi.
indexOf — POZITSIYA qaytaradi (-1 yoki index).
if ichida indexOf ishlatganda !== -1 tekshirish kerak.

═══════════════════════════════════════
  O'ZGARTIRISH METODLARI
═══════════════════════════════════════

  replace(search, replacement)    — BIRINCHI moslikni almashtiradi
  replaceAll(search, replacement) — BARCHA mosliklarni almashtiradi
  toUpperCase()   — KATTA harfga
  toLowerCase()   — kichik harfga
  trim()          — bosh va oxiridagi bo'shliqlarni olib tashlaydi
  trimStart()     — faqat boshdagi
  trimEnd()       — faqat oxiridagi
  repeat(count)   — stringni count marta takrorlaydi
  normalize(form) — Unicode normalizatsiya

MUHIM: replace birinchi argumenti string bo'lsa — faqat
BIRINCHI moslikni almashtiradi. Barchasini almashtirish uchun:
  str.replaceAll("a", "b")     // ES2021
  str.replace(/a/g, "b")      // RegExp bilan (eski usul)

═══════════════════════════════════════
  KESISH METODLARI
═══════════════════════════════════════

  slice(start, end)     — start dan end gacha kesadi
  substring(start, end) — slice ga o'xshash, lekin manfiy indeks olmaydi

  slice vs substring:
  - slice(-3) — oxirgi 3 ta belgi (manfiy indeks ishlaydi)
  - substring(-3) — 0 deb qabul qiladi (manfiy ISHLAMAYDI)
  - slice(5, 2) — bo'sh string qaytaradi
  - substring(5, 2) — argumentlarni almashtiradi: substring(2, 5)

MUHIM: substr() — ESKIRGAN (deprecated). Ishlatmang!
Faqat slice() ishlatish tavsiya etiladi.

═══════════════════════════════════════
  PADDING METODLARI
═══════════════════════════════════════

  padStart(targetLength, padString) — boshiga to'ldiradi
  padEnd(targetLength, padString)   — oxiriga to'ldiradi

  "5".padStart(3, "0")    // "005"
  "42".padStart(5, " ")   // "   42"
  "hi".padEnd(10, ".")    // "hi........"

Amaliy foydalanish: vaqt formatlash, jadval chizish,
raqamlarni bir xil uzunlikda ko'rsatish.

═══════════════════════════════════════
  SPLIT VA JOIN
═══════════════════════════════════════

  str.split(separator, limit)  — stringni massivga bo'ladi
  arr.join(separator)          — massivni stringga birlashtiradi

  "a,b,c".split(",")         // ["a", "b", "c"]
  "salom".split("")           // ["s", "a", "l", "o", "m"]
  ["a", "b", "c"].join("-")  // "a-b-c"
  ["a", "b", "c"].join("")   // "abc"

split + join — oddiy almashtirish uchun:
  "salom dunyo".split(" ").join("-")  // "salom-dunyo"

═══════════════════════════════════════
  TEMPLATE LITERALS
═══════════════════════════════════════

Template literal (backtick) — ES6 dan boshlab:

  1. Interpolatsiya: \`Salom, \${name}!\`
  2. Ko'p qatorli: \`birinchi
     ikkinchi\`
  3. Expression: \`Natija: \${a + b}\`
  4. Nested: \`\${isAdmin ? "Admin" : "User"}\`

═══════════════════════════════════════
  TAGGED TEMPLATES
═══════════════════════════════════════

Tagged template — template literal oldiga funksiya qo'yish:

  function tag(strings, ...values) {
    // strings — statik qismlar massivi
    // values — interpolatsiya qiymatlari
  }

  tag\`Salom \${name}, yoshing \${age}\`
  // strings: ["Salom ", ", yoshing ", ""]
  // values: [name, age]

Amaliy foydalanish: CSS-in-JS (styled-components),
SQL injection himoya, i18n, HTML sanitization.

═══════════════════════════════════════
  UNICODE VA MAXSUS HOLATLAR
═══════════════════════════════════════

  codePointAt(pos)         — Unicode code point qaytaradi
  String.fromCodePoint(cp) — code point dan belgi yaratadi
  normalize(form)          — Unicode normalizatsiya ("NFC", "NFD")

  MUHIM: length — UTF-16 code unit soni, belgilar soni EMAS!
  Emoji va ba'zi belgilar 2 ta code unit egallaydi:

  "a]".length              // 2 (emoji 2 code unit)
  [..."].length            // 1 (spread to'g'ri hisoblaydi)
  Array.from(").length    // 1`,
  codeExamples: [
    {
      title: 'Qidirish metodlari — includes, startsWith, match',
      language: 'js',
      code: `const text = "JavaScript — eng mashhur dasturlash tili"

// includes — mavjudmi?
text.includes("mashhur")        // true
text.includes("Python")         // false
text.includes("eng", 20)        // false (20-pozitsiyadan qidiradi)

// startsWith / endsWith
text.startsWith("Java")         // true
text.startsWith("Script", 4)    // true (4-pozitsiyadan)
text.endsWith("tili")           // true

// indexOf — pozitsiya
text.indexOf("eng")             // 15
text.indexOf("yo'q")            // -1

// search — RegExp bilan
text.search(/\\d+/)              // -1 (raqam yo'q)
"abc123".search(/\\d+/)          // 3

// match — mosliklarni olish
const email = "user@mail.com va admin@site.org"
email.match(/\\w+@\\w+\\.\\w+/)    // ["user@mail.com"]  (birinchi)
email.match(/\\w+@\\w+\\.\\w+/g)   // ["user@mail.com", "admin@site.org"]

// matchAll — to'liq ma'lumot bilan
const iter = email.matchAll(/(?<name>\\w+)@(?<domain>\\w+\\.\\w+)/g)
for (const m of iter) {
  console.log(m.groups.name, m.groups.domain)
  // "user" "mail.com", keyin "admin" "site.org"
}`,
      description: 'includes boolean qaytaradi, indexOf pozitsiya, match/matchAll RegExp natijalari. matchAll named groups bilan eng kuchli.',
    },
    {
      title: 'replace, replaceAll va RegExp bilan ishlash',
      language: 'js',
      code: `const str = "salom dunyo, salom JavaScript"

// replace — faqat BIRINChI moslik
str.replace("salom", "hello")
// "hello dunyo, salom JavaScript"

// replaceAll — BARCHA mosliklar (ES2021)
str.replaceAll("salom", "hello")
// "hello dunyo, hello JavaScript"

// RegExp bilan /g flag
str.replace(/salom/g, "hello")
// "hello dunyo, hello JavaScript"

// Callback funksiya bilan
const prices = "Olma 5000 so'm, Banan 8000 so'm"
const updated = prices.replace(/\\d+/g, (match) => {
  return String(Number(match) * 1.1) // 10% qimmatlashtirish
})
// "Olma 5500 so'm, Banan 8800 so'm"

// $1, $2 — guruhlarni ishlatish
const name = "Tursunov Ali"
name.replace(/(\\w+) (\\w+)/, "$2 $1")
// "Ali Tursunov"

// camelCase ga o'tkazish
const kebab = "my-component-name"
const camel = kebab.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
// "myComponentName"

// HTML taglarni tozalash
const html = "<b>Salom</b> <i>dunyo</i>"
const clean = html.replace(/<[^>]*>/g, "")
// "Salom dunyo"`,
      description: 'replace birinchi moslikni, replaceAll barchasini almashtiradi. Callback bilan dynamic almashtirish — eng kuchli pattern.',
    },
    {
      title: 'slice, split, join — kesish va birlashtirish',
      language: 'js',
      code: `const str = "JavaScript"

// slice — kesish (manfiy indeks ishlaydi)
str.slice(0, 4)    // "Java"
str.slice(4)       // "Script"
str.slice(-6)      // "Script"  (oxiridan 6 ta)
str.slice(-6, -3)  // "Scr"

// split — massivga bo'lish
"a,b,c".split(",")          // ["a", "b", "c"]
"a,b,c".split(",", 2)       // ["a", "b"]  (limit)
"salom".split("")            // ["s", "a", "l", "o", "m"]

// join — massivdan stringga
["2024", "01", "15"].join("-")   // "2024-01-15"

// Amaliy misollar
// 1. Capitalize (birinchi harfni katta)
const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1)
capitalize("salom")  // "Salom"

// 2. Title Case
const titleCase = (s) =>
  s.split(" ").map(w => capitalize(w)).join(" ")
titleCase("salom dunyo")  // "Salom Dunyo"

// 3. Slug yaratish
const slugify = (s) =>
  s.toLowerCase().trim()
   .replace(/[^\\w\\s-]/g, "")
   .replace(/\\s+/g, "-")
slugify("Salom Dunyo 2024!")  // "salom-dunyo-2024"

// 4. Teskari qilish
const reverse = (s) => [...s].reverse().join("")
reverse("salom")  // "molas"`,
      description: 'slice kesadi, split massivga bo\'ladi, join birlashtiradi. Ularni birgalikda capitalize, titleCase, slugify kabi utility funksiyalar yasash mumkin.',
    },
    {
      title: 'Template literals va tagged templates',
      language: 'js',
      code: `// 1. Oddiy interpolatsiya
const name = "Ali"
const age = 25
console.log(\`Salom, \${name}! Yoshingiz: \${age}\`)

// 2. Expression
console.log(\`Narx: \${1000 * 1.12} so'm\`)       // "Narx: 1120 so'm"
console.log(\`Status: \${age >= 18 ? "katta" : "kichik"}\`)

// 3. Ko'p qatorli
const html = \`
  <div class="card">
    <h2>\${name}</h2>
    <p>Yoshi: \${age}</p>
  </div>
\`

// 4. Tagged template — maxsus ishlov
function highlight(strings, ...values) {
  return strings.reduce((result, str, i) => {
    const val = values[i] !== undefined
      ? \`<mark>\${values[i]}</mark>\`
      : ""
    return result + str + val
  }, "")
}

const result = highlight\`Salom \${name}, yoshingiz \${age}\`
// "Salom <mark>Ali</mark>, yoshingiz <mark>25</mark>"

// 5. SQL injection himoya (tagged template)
function sql(strings, ...values) {
  const escaped = values.map(v =>
    typeof v === "string" ? v.replace(/'/g, "''") : v
  )
  return strings.reduce((q, str, i) =>
    q + str + (escaped[i] !== undefined ? escaped[i] : ""), "")
}

const userInput = "Ali'; DROP TABLE users; --"
const query = sql\`SELECT * FROM users WHERE name = '\${userInput}'\`
// Xavfsiz: "...WHERE name = 'Ali''; DROP TABLE users; --'"`,
      description: 'Template literals interpolatsiya va ko\'p qatorli stringlar uchun. Tagged templates CSS-in-JS, SQL himoya, HTML sanitization kabi vazifalar uchun.',
    },
    {
      title: 'Padding, trim va Unicode',
      language: 'js',
      code: `// padStart — boshiga to'ldirish
"5".padStart(2, "0")           // "05"
"42".padStart(5, " ")          // "   42"
String(7).padStart(2, "0")     // "07"

// Vaqt formatlash
const h = 9, m = 5, s = 3
const time = [h, m, s]
  .map(n => String(n).padStart(2, "0"))
  .join(":")
// "09:05:03"

// padEnd — oxiriga to'ldirish
"Narx".padEnd(15, ".")         // "Narx..........."

// trim — bo'shliqlarni olib tashlash
"  salom  ".trim()             // "salom"
"  salom  ".trimStart()        // "salom  "
"  salom  ".trimEnd()          // "  salom"

// Amaliy: foydalanuvchi inputini tozalash
const clean = (input) => input.trim().replace(/\\s+/g, " ")
clean("  salom   dunyo  ")     // "salom dunyo"

// Unicode
"A".codePointAt(0)             // 65
String.fromCodePoint(65)       // "A"
String.fromCodePoint(0x1F600)  // smiley emoji

// Emoji length muammosi
const emoji = "salom"
emoji.length                   // 7 (har bir emoji 2 code unit)
[...emoji].length              // 6 (spread to'g'ri hisoblaydi)

// normalize — turli ko'rinishdagi bir xil belgilarni solishtirish
const a1 = "\\u00e9"      // e bilan aksent (1 belgi)
const a2 = "e\\u0301"     // e + aksent (2 belgi)
a1 === a2                 // false
a1.normalize() === a2.normalize()  // true`,
      description: 'padStart/padEnd formatlash uchun, trim foydalanuvchi inputini tozalash uchun. Unicode — emoji va maxsus belgilar bilan ishlashda length muammosi bor.',
    },
  ],
  interviewQA: [
    {
      question: 'slice va substring farqi nima? Qaysi birini ishlatish kerak?',
      answer: 'Ikkala metod ham stringdan bo\'lak kesib oladi va YANGI string qaytaradi. Asosiy farqlar: 1) slice MANFIY indeksni qabul qiladi — slice(-3) oxirgi 3 belgi, substring esa manfiy qiymatni 0 ga aylantiradi. 2) slice(5, 2) bo\'sh string qaytaradi, substring(5, 2) argumentlarni almashtirib substring(2, 5) sifatida ishlaydi. 3) substr() — ESKIRGAN (deprecated), ishlatmang. Tavsiya: DOIM slice() ishlatish — u mantiqiyroq va massiv slice bilan bir xil ishlaydi.',
    },
    {
      question: 'Template literal (backtick) oddiy stringdan qanday farq qiladi?',
      answer: 'Template literal uchta asosiy imkoniyat beradi: 1) Interpolatsiya — ${expression} orqali o\'zgaruvchi va ifodalarni string ichiga qo\'yish (konkatenatsiya kerak emas), 2) Ko\'p qatorli — \\n yozmay, shunchaki Enter bosish mumkin, 3) Tagged templates — template literal oldiga funksiya qo\'yib, maxsus ishlov berish (masalan, styled-components CSS-in-JS, SQL injection himoya, HTML sanitization). Tagged template funksiya (strings, ...values) argumentlari oladi: strings — statik qismlar, values — interpolatsiya qiymatlari.',
    },
    {
      question: 'replaceAll qachon qo\'shildi? Undan oldin qanday qilinardi?',
      answer: 'replaceAll ES2021 (ES12) da qo\'shildi. Undan oldin barcha mosliklarni almashtirish uchun: 1) RegExp bilan /g flag: str.replace(/salom/g, "hello"), 2) split + join: str.split("salom").join("hello"). replaceAll-ning afzalligi — oddiy string bilan ishlaydi, RegExp yozish shart emas. MUHIM: replaceAll-ga RegExp bersangiz, /g flag MAJBURIY, aks holda TypeError bo\'ladi.',
    },
    {
      question: 'JavaScript-da string length nima uchun ba\'zan noto\'g\'ri natija beradi?',
      answer: 'JavaScript stringlari UTF-16 kodlashda saqlanadi. length UTF-16 code unit sonini qaytaradi, belgilar sonini EMAS. Ko\'pchilik belgilar 1 code unit, lekin emoji va ba\'zi belgilar (surrogate pair) 2 code unit egallaydi. Shuning uchun emoji.length 2 beradi. To\'g\'ri hisoblash usullari: [...str].length (spread), Array.from(str).length, yoki Intl.Segmenter. for...of tsikli ham code point bo\'yicha iteratsiya qiladi (to\'g\'ri ishlaydi).',
    },
    {
      question: 'match va matchAll farqi nima?',
      answer: 'match(regexp) — /g flag bo\'lsa barcha mosliklarni STRING massivi sifatida qaytaradi (groups, index yo\'q). /g flag yo\'q bo\'lsa — faqat birinchi moslikni to\'liq ma\'lumot bilan (groups, index) qaytaradi. matchAll(regexp) — DOIM /g flag talab qiladi va ITERATOR qaytaradi. Har bir element to\'liq match objecti — groups, index bilan. Named capture groups (/(?<name>\\w+)/) bilan matchAll eng kuchli — har bir moslikning tarkibiy qismlarini olish mumkin. matchAll ES2020 da qo\'shildi.',
    },
  ],
  relatedTopics: [
    { techId: 'javascript', sectionId: 'built-in-methods', topicId: 'array-methods', label: 'Array metodlari' },
    { techId: 'javascript', sectionId: 'built-in-methods', topicId: 'json-structured-clone', label: 'JSON va structuredClone' },
  ],
}
