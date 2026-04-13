import type { Topic } from '../../../types'

export const es2020Features: Topic = {
  id: 'es2020-features',
  title: 'ES2020 Yangiliklari',
  importance: 3,
  status: 'to-learn',
  description: 'Optional chaining, nullish coalescing, BigInt, Promise.allSettled, dynamic import',
  content: `ES2020 (ES11) — JavaScript ning eng muhim yangilanishlaridan biri. Bu versiyada kundalik dasturlashni sezilarli osonlashtiradigan operatorlar va metodlar qo'shildi.

═══════════════════════════════════════
  OPTIONAL CHAINING (?.)
═══════════════════════════════════════

?. operatori — chuqur joylashgan xususiyatga xavfsiz kirish.
Agar zanjirning biror qismi null yoki undefined bo'lsa,
xato chiqarish o'rniga undefined qaytaradi.

  obj?.prop          — xususiyatga kirish
  obj?.[expr]        — dinamik kalitga kirish
  obj?.method()      — metod chaqirish
  arr?.[index]       — massiv elementiga kirish

MUHIM: ?. faqat null va undefined ni tekshiradi.
0, false, "" — bu qiymatlar "mavjud" hisoblanadi.

Qachon ishlatish kerak:
1. API javobida ma'lumot yo'q bo'lishi mumkin
2. DOM elementni topish — element mavjud bo'lmasligi mumkin
3. Ixtiyoriy konfiguratsiya parametrlari
4. Chuqur joylashgan obyekt xususiyatlari

═══════════════════════════════════════
  NULLISH COALESCING (??)
═══════════════════════════════════════

?? operatori — FAQAT null va undefined uchun default qiymat.
|| operatoridan FARQI: || barcha falsy qiymatlarni tekshiradi
(0, false, "", NaN), ?? esa FAQAT null/undefined ni.

  value ?? defaultValue

Qachon ishlatish kerak:
- 0 yoki false haqiqiy qiymat bo'lishi mumkin bo'lganda
- Foydalanuvchi sozlamalarini o'qishda
- API dan kelgan ma'lumotni qayta ishlashda

??= — nullish assignment operatori (ES2021 dan):
  x ??= 5  // x null/undefined bo'lsa, 5 ga tenglashadi

═══════════════════════════════════════
  GLOBALTHIS
═══════════════════════════════════════

globalThis — barcha muhitlarda global obyektga kirish:
- Brauzerda: window
- Node.js da: global
- Web Worker da: self
- Deno da: globalThis

Oldin har bir muhitda alohida tekshirish kerak edi.
Endi globalThis universaldir.

═══════════════════════════════════════
  BIGINT
═══════════════════════════════════════

BigInt — Number.MAX_SAFE_INTEGER (2^53 - 1) dan katta
sonlar bilan ishlash uchun yangi primitive tur.

  const big = 9007199254740993n     // literal
  const big2 = BigInt("9007199254740993")  // konstruktor

MUHIM cheklovlar:
- BigInt va Number aralashtirib bo'lmaydi: 1n + 1 → TypeError
- Math funksiyalari ishlamaydi: Math.max(1n) → TypeError
- JSON.stringify BigInt ni qo'llab-quvvatlamaydi
- Taqqoslash ishlaydi: 1n === 1 → false, 1n == 1 → true

═══════════════════════════════════════
  PROMISE.ALLSETTLED
═══════════════════════════════════════

Promise.allSettled — BARCHA promise lar tugashini kutadi,
muvaffaqiyatli yoki muvaffaqiyatsiz — farqi yo'q.

Promise.all dan farqi:
- Promise.all — birinchi reject da to'xtaydi
- Promise.allSettled — HAMMASI tugashini kutadi

Natija: { status: "fulfilled", value } yoki { status: "rejected", reason }

Qachon ishlatish: bir nechta API chaqiruv, ba'zilari muvaffaqiyatsiz
bo'lishi mumkin, lekin barchasi haqida ma'lumot kerak.

═══════════════════════════════════════
  STRING.MATCHALL VA DYNAMIC IMPORT
═══════════════════════════════════════

String.prototype.matchAll — global regex natijalarini
iterator sifatida qaytaradi. Har bir natijada groups, index bor.

Dynamic import() — modulni runtime da yuklash:
  const module = await import("./utils.js")

Bu lazy loading uchun muhim — faqat kerak bo'lganda yuklash.
React.lazy() ichida ham import() ishlatiladi.`,
  codeExamples: [
    {
      title: 'Optional chaining — chuqur xavfsiz kirish',
      language: 'js',
      code: `// ❌ Eskicha — har bir darajani tekshirish kerak
const city = user && user.address && user.address.city

// ✅ Optional chaining
const city = user?.address?.city

// Metod chaqirish
const result = api?.getData?.()

// Massiv elementi
const first = users?.[0]?.name

// DOM da
const text = document.querySelector("#title")?.textContent

// ❌ ?. keraksiz joyda ishlatmang
const name = props?.name  // props har doim mavjud bo'lsa — keraksiz

// Amaliy misol: API javobini qayta ishlash
function getUserCity(response) {
  // API javobida data, user, address yo'q bo'lishi mumkin
  return response?.data?.user?.address?.city ?? "Noma'lum"
}

getUserCity({ data: { user: { address: { city: "Toshkent" } } } })
// "Toshkent"
getUserCity({ data: { user: {} } })
// "Noma'lum"
getUserCity(null)
// "Noma'lum"`,
      description: 'Optional chaining bilan chuqur joylashgan xususiyatlarga xavfsiz kirish',
    },
    {
      title: 'Nullish coalescing — || dan farqi',
      language: 'js',
      code: `// || — BARCHA falsy qiymatlarni tekshiradi
0 || 10         // 10  ← 0 yo'qoldi!
"" || "default" // "default"  ← bo'sh string yo'qoldi!
false || true   // true  ← false yo'qoldi!

// ?? — FAQAT null va undefined
0 ?? 10         // 0  ✅
"" ?? "default" // ""  ✅
false ?? true   // false  ✅
null ?? 10      // 10
undefined ?? 10 // 10

// Amaliy misol: sozlamalar
function getConfig(options) {
  return {
    // ❌ || bilan — foydalanuvchi 0 bersa, default ishlatiladi
    timeout: options.timeout || 3000,

    // ✅ ?? bilan — faqat berilmagan bo'lsa default
    timeout: options.timeout ?? 3000,
    retries: options.retries ?? 3,
    verbose: options.verbose ?? false,
  }
}

getConfig({ timeout: 0, retries: 0, verbose: false })
// || bilan: { timeout: 3000, retries: 3, verbose: true } ← NOTO'G'RI
// ?? bilan: { timeout: 0, retries: 0, verbose: false } ← TO'G'RI

// ??= assignment
let config = {}
config.theme ??= "dark"    // "dark" (undefined edi)
config.theme ??= "light"   // "dark" (allaqachon bor)`,
      description: '?? va || operatorlarining muhim farqi — 0, false, "" qiymatlari',
    },
    {
      title: 'BigInt — katta sonlar',
      language: 'js',
      code: `// Number ning chegarasi
console.log(Number.MAX_SAFE_INTEGER) // 9007199254740991
console.log(9007199254740992 === 9007199254740993) // true! ← xato!

// BigInt bilan — aniq natija
console.log(9007199254740992n === 9007199254740993n) // false ✅

// Yaratish
const a = 100n               // literal
const b = BigInt(100)         // konstruktordan
const c = BigInt("999999999999999999")  // stringdan

// Arifmetika
console.log(10n + 20n)   // 30n
console.log(10n * 20n)   // 200n
console.log(10n ** 3n)   // 1000n
console.log(7n / 2n)     // 3n (butun qismi, qoldiq tashlanadi)

// ❌ Number bilan aralashtirib bo'lmaydi
// 10n + 5  → TypeError

// ✅ Aniq konvertatsiya kerak
const big = 10n
const num = 5
console.log(big + BigInt(num))  // 15n
console.log(Number(big) + num)  // 15 (katta sonlarda aniqlik yo'qolishi mumkin)

// JSON bilan ishlash
// ❌ JSON.stringify({ value: 10n })  → TypeError
// ✅ Yechim:
const data = { value: 10n }
JSON.stringify(data, (key, val) =>
  typeof val === "bigint" ? val.toString() : val
) // '{"value":"10"}'`,
      description: 'BigInt bilan katta sonlarni xavfsiz boshqarish',
    },
    {
      title: 'Promise.allSettled — barchasi tugashini kutish',
      language: 'js',
      code: `const api1 = fetch("/api/users").then(r => r.json())
const api2 = fetch("/api/posts").then(r => r.json())
const api3 = fetch("/api/broken-endpoint").then(r => r.json())

// ❌ Promise.all — birinchi xato da to'xtaydi
try {
  const [users, posts, data] = await Promise.all([api1, api2, api3])
} catch (err) {
  // api3 xato berdi — users va posts ham yo'qoldi!
  console.log("Xato:", err.message)
}

// ✅ Promise.allSettled — hammasi tugashini kutadi
const results = await Promise.allSettled([api1, api2, api3])

results.forEach((result, i) => {
  if (result.status === "fulfilled") {
    console.log(\`API \${i + 1}: muvaffaqiyatli\`, result.value)
  } else {
    console.log(\`API \${i + 1}: xato\`, result.reason)
  }
})

// Faqat muvaffaqiyatli natijalarni olish
const successful = results
  .filter(r => r.status === "fulfilled")
  .map(r => r.value)

// Faqat xatolarni olish
const failed = results
  .filter(r => r.status === "rejected")
  .map(r => r.reason)

console.log(\`\${successful.length} muvaffaqiyatli, \${failed.length} xato\`)`,
      description: 'Promise.allSettled bilan barcha natijalarni yig\'ish',
    },
    {
      title: 'Dynamic import va matchAll',
      language: 'js',
      code: `// ═══ Dynamic import() ═══

// Oddiy import — doim yuklanadi
import { heavyChart } from "./chart-lib.js"

// Dynamic import — faqat kerak bo'lganda
async function showChart(data) {
  const { heavyChart } = await import("./chart-lib.js")
  heavyChart.render(data)
}

// React.lazy() ichida
const LazyComponent = React.lazy(() => import("./HeavyComponent"))

// Shartli yuklash
async function loadLocale(lang) {
  const module = await import(\`./locales/\${lang}.js\`)
  return module.default
}

// ═══ String.matchAll() ═══

const text = "Narx: $100, chegirma: $25, jami: $75"
const regex = /\\$(\\d+)/g

// ❌ Eskicha — exec loop
let match
while ((match = regex.exec(text)) !== null) {
  console.log(match[1])
}

// ✅ matchAll — iterator qaytaradi
const matches = [...text.matchAll(regex)]
matches.forEach(m => {
  console.log(\`Topildi: \${m[0]}, raqam: \${m[1]}, index: \${m.index}\`)
})
// Topildi: $100, raqam: 100, index: 6
// Topildi: $25, raqam: 25, index: 22
// Topildi: $75, raqam: 75, index: 35

// Named groups bilan
const dateRegex = /(?<year>\\d{4})-(?<month>\\d{2})-(?<day>\\d{2})/g
const dates = "2024-01-15, 2024-06-30"
for (const m of dates.matchAll(dateRegex)) {
  console.log(m.groups) // { year: "2024", month: "01", day: "15" }
}`,
      description: 'Dynamic import bilan lazy loading va matchAll bilan regex natijalar',
    },
  ],
  interviewQA: [
    {
      question: 'Optional chaining (?.) qanday ishlaydi va qachon ishlatish kerak?',
      answer: '?. operatori chuqur joylashgan xususiyatga xavfsiz kirishni ta\'minlaydi. Agar zanjirning biror qismi null yoki undefined bo\'lsa, xato chiqarish o\'rniga undefined qaytaradi. 3 ta shakli bor: obj?.prop (xususiyat), obj?.[expr] (dinamik kalit), obj?.method() (metod). Ishlatish kerak: API javobida ma\'lumot yo\'q bo\'lishi mumkin bo\'lganda, ixtiyoriy konfiguratsiya parametrlari, DOM elementni topishda. MUHIM: keraksiz joyda ishlatmang — props har doim mavjud bo\'lsa props?.name yozish noto\'g\'ri, chunki bu kodni o\'quvchiga "props undefined bo\'lishi mumkin" degan noto\'g\'ri signal beradi.',
    },
    {
      question: '?? va || operatorlarining farqi nima?',
      answer: '|| operatori barcha falsy qiymatlarni tekshiradi: 0, false, "", NaN, null, undefined. ?? operatori FAQAT null va undefined ni tekshiradi. Bu muhim farq: agar foydalanuvchi timeout ni 0 qilib bersa, || bilan 0 || 3000 = 3000 bo\'ladi (noto\'g\'ri), ?? bilan 0 ?? 3000 = 0 bo\'ladi (to\'g\'ri). Shuning uchun konfiguratsiya default qiymatlarini berish uchun ?? ishlatish kerak. ??= operatori (ES2021) — faqat null/undefined bo\'lganda yangi qiymat beradi.',
    },
    {
      question: 'Promise.all va Promise.allSettled farqi nima?',
      answer: 'Promise.all — birinchi reject bo\'lgan promise da TO\'XTAYDI va butun natijani reject qiladi. Muvaffaqiyatli bo\'lgan boshqa promise lar natijasi yo\'qoladi. Promise.allSettled — BARCHA promise lar tugashini kutadi (resolve yoki reject farqsiz). Har bir natija { status, value/reason } obyekti. Ishlatish: bir nechta API chaqiruv, ba\'zilari xato berishi mumkin, lekin muvaffaqiyatli natijalar kerak bo\'lganda. Masalan, dashboard da 5 ta API chaqirsangiz, 1 tasi xato bersa ham qolgan 4 tani ko\'rsatish kerak.',
    },
    {
      question: 'BigInt nima va qanday cheklovlari bor?',
      answer: 'BigInt — Number.MAX_SAFE_INTEGER (2^53-1) dan katta butun sonlar bilan ishlash uchun yangi primitive tur. Yaratish: 123n literal yoki BigInt("123"). Cheklovlari: 1) Number bilan aralashtirib bo\'lmaydi — 1n + 1 TypeError. 2) Math funksiyalari ishlamaydi. 3) JSON.stringify qo\'llab-quvvatlamaydi — custom serializer kerak. 4) Taqqoslash: 1n === 1 false (tur farqi), lekin 1n == 1 true. 5) Faqat butun sonlar — kasr bo\'lmaydi, bo\'lish natijasi kesiladi (7n / 2n = 3n). Ishlatish: katta ID lar, kriptografiya, moliyaviy hisob-kitoblar.',
    },
    {
      question: 'Dynamic import() nima va qanday afzalliklari bor?',
      answer: 'Dynamic import() — modulni runtime da (kod ishlash paytida) yuklash. Oddiy import statik — har doim yuklanadi. Dynamic import() esa Promise qaytaradi va faqat chaqirilganda modulni yuklaydi. Afzalliklari: 1) Code splitting — faqat kerakli kodni yuklash. 2) Shartli yuklash — tilga qarab modul yuklash. 3) Lazy loading — React.lazy() ichida ishlatiladi. 4) Performance — dastlabki bundle hajmini kamaytiradi. Misol: const { Chart } = await import("./chart.js"). Webpack va Vite bu import() ni avtomatik code splitting nuqtasi sifatida taniydi.',
    },
  ],
}
