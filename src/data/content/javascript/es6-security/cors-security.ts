import type { Topic } from '../../../types'

export const corsSecurity: Topic = {
  id: 'cors-security',
  title: 'CORS va Web Xavfsizlik',
  importance: 3,
  status: 'to-learn',
  description: 'Same-Origin Policy, CORS, CSRF himoyasi, SameSite cookies, CSP asoslari',
  content: `CORS (Cross-Origin Resource Sharing) va boshqa xavfsizlik mexanizmlari — zamonaviy veb-ilovalarning muhim qismi. Brauzer foydalanuvchini zararli saytlardan himoya qilish uchun bir qancha cheklovlar qo'yadi.

═══════════════════════════════════════
  SAME-ORIGIN POLICY (SOP)
═══════════════════════════════════════

Same-Origin Policy — brauzerning asosiy xavfsizlik mexanizmi.
Bir saytdagi skript boshqa saytning ma'lumotlariga KIRA OLMAYDI.

Origin = Protocol + Host + Port
  https://example.com:443

Bir xil origin misollar:
  https://example.com/page1 va https://example.com/page2 → HA
  http://example.com va https://example.com → YO'Q (protocol farq)
  https://example.com va https://api.example.com → YO'Q (host farq)
  https://example.com:443 va https://example.com:8080 → YO'Q (port farq)

SOP nimani cheklaydi:
1. fetch/XMLHttpRequest — boshqa origin ga so'rov javobini o'qish
2. iframe — boshqa origin dagi iframe kontentiga kirish
3. localStorage/cookies — boshqa origin niki o'qilmaydi

SOP nimani CHEKLAMAYDI:
1. <script src> — boshqa saytdan JS yuklash (JSONP asosi)
2. <img src> — boshqa saytdan rasm yuklash
3. <link href> — boshqa saytdan CSS yuklash
4. <form action> — boshqa saytga form yuborish (CSRF xavfi!)

═══════════════════════════════════════
  CORS — CROSS-ORIGIN RESOURCE SHARING
═══════════════════════════════════════

CORS — server tomonidan boshqa origin larga RUXSAT berish.
HTTP header lar orqali ishlaydi.

ODDIY SO'ROVLAR (Simple Request):
- GET, HEAD, POST (Content-Type: text/plain, form-data, form-urlencoded)
- Maxsus header lar yo'q
- Brauzer TO'G'RIDAN-TO'G'RI so'rov yuboradi
- Server javobida Access-Control-Allow-Origin bo'lsa — o'qishga ruxsat

PREFLIGHT SO'ROVLAR (Murakkab so'rovlar):
- PUT, DELETE, PATCH yoki maxsus headerlar
- Brauzer AVVAL OPTIONS so'rov yuboradi (preflight)
- Server ruxsat bersa — haqiqiy so'rov yuboriladi

Asosiy CORS header lari:
  Access-Control-Allow-Origin: https://mysite.com
  Access-Control-Allow-Methods: GET, POST, PUT, DELETE
  Access-Control-Allow-Headers: Content-Type, Authorization
  Access-Control-Allow-Credentials: true
  Access-Control-Max-Age: 86400 (preflight kesh, soniyada)

MUHIM: Access-Control-Allow-Origin: * va
Access-Control-Allow-Credentials: true BIRGA ishlatib bo'lmaydi.
Credentials kerak bo'lsa, aniq origin ko'rsatish shart.

═══════════════════════════════════════
  CSRF — CROSS-SITE REQUEST FORGERY
═══════════════════════════════════════

CSRF — hujumchi foydalanuvchini bilmasdan boshqa saytga
so'rov yuborishga majbur qiladi. Foydalanuvchining cookie lari
avtomatik yuboriladi — server haqiqiy foydalanuvchi deb o'ylaydi.

Misol: foydalanuvchi bank.com ga kirgan, cookie bor.
Hujumchi sahifasida:
  <img src="https://bank.com/transfer?to=hacker&amount=10000">
Brauzer bu so'rovga bank.com cookie sini avtomatik qo'shadi!

Himoya usullari:
1. CSRF Token — server har bir formga yashirin token beradi,
   so'rov bilan tekshiradi. Boshqa sayt bu tokenni bilmaydi.
2. SameSite cookies — brauzer darajasida himoya
3. Origin/Referer header tekshirish
4. Custom header (X-Requested-With) — CORS preflight kerak bo'ladi

═══════════════════════════════════════
  SAMESITE COOKIES
═══════════════════════════════════════

SameSite — cookie ning boshqa saytdan yuborilishini boshqaradi.

1. Strict — FAQAT o'z saytdan so'rovlarda yuboriladi.
   Boshqa saytdan link bosib kelganda HAM yuborilmaydi!
   Eng xavfsiz, lekin UX muammo — tashqi link bilan kelganda
   foydalanuvchi logout ko'rinadi.

2. Lax (DEFAULT) — navigatsiya (GET) so'rovlarida yuboriladi.
   Form POST, fetch, iframe — yuborilMAYDI.
   Ko'pchilik hollarda eng yaxshi balans.

3. None — har doim yuboriladi. Secure flag SHART (faqat HTTPS).
   Uchinchi tomon integratsiyalar uchun (payment, embedding).

═══════════════════════════════════════
  QOSHIMCHA XAVFSIZLIK HEADER LARI
═══════════════════════════════════════

1. Strict-Transport-Security (HSTS)
   Brauzerga faqat HTTPS ishlatishni aytadi.

2. X-Content-Type-Options: nosniff
   MIME type sniffing ni to'xtatadi.

3. X-Frame-Options: DENY / SAMEORIGIN
   Sahifani iframe da ko'rsatishni taqiqlaydi (clickjacking himoya).

4. Referrer-Policy
   Qaysi ma'lumot Referer headerda yuborilishini boshqaradi.

5. Permissions-Policy
   Kamera, mikrofon, geolocation kabi API larga kirishni cheklaydi.`,
  codeExamples: [
    {
      title: 'CORS — oddiy va preflight so\'rovlar',
      language: 'js',
      code: `// ═══ Oddiy so'rov — preflight YO'Q ═══
// GET, Content-Type: application/x-www-form-urlencoded
fetch("https://api.example.com/data")
  .then(r => r.json())
  .then(data => console.log(data))
  .catch(err => console.error("CORS xato:", err))

// Brauzer so'rovi:
// GET /data HTTP/1.1
// Origin: https://mysite.com

// Server javobida CORS header bo'lishi kerak:
// Access-Control-Allow-Origin: https://mysite.com

// ═══ Preflight so'rov — OPTIONS avval ═══
// PUT, maxsus header, yoki application/json
fetch("https://api.example.com/users/1", {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer token123",
  },
  body: JSON.stringify({ name: "Ali" }),
})

// 1-qadam: Brauzer avval OPTIONS yuboradi
// OPTIONS /users/1 HTTP/1.1
// Origin: https://mysite.com
// Access-Control-Request-Method: PUT
// Access-Control-Request-Headers: Content-Type, Authorization

// 2-qadam: Server ruxsat beradi
// Access-Control-Allow-Origin: https://mysite.com
// Access-Control-Allow-Methods: GET, PUT, DELETE
// Access-Control-Allow-Headers: Content-Type, Authorization
// Access-Control-Max-Age: 86400

// 3-qadam: Brauzer haqiqiy PUT so'rov yuboradi

// ═══ Credentials bilan ═══
fetch("https://api.example.com/profile", {
  credentials: "include",  // Cookie larni yuborish
})
// Server: Access-Control-Allow-Credentials: true
// Server: Access-Control-Allow-Origin: https://mysite.com
// ❌ Allow-Origin: * bilan Credentials: true ISHLAMAYDI`,
      description: 'CORS oddiy va preflight so\'rov mexanizmi',
    },
    {
      title: 'Node.js/Express da CORS sozlash',
      language: 'js',
      code: `// ═══ Qo'lda CORS header ═══
app.use((req, res, next) => {
  const allowedOrigins = [
    "https://mysite.com",
    "https://admin.mysite.com"
  ]
  const origin = req.headers.origin

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin)
  }

  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
  res.setHeader("Access-Control-Allow-Credentials", "true")
  res.setHeader("Access-Control-Max-Age", "86400")

  // Preflight so'rovga javob
  if (req.method === "OPTIONS") {
    return res.sendStatus(204)
  }
  next()
})

// ═══ cors kutubxonasi bilan ═══
const cors = require("cors")

// Oddiy — barcha origin larga ruxsat
app.use(cors())

// Sozlangan
app.use(cors({
  origin: ["https://mysite.com", "https://admin.mysite.com"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  maxAge: 86400,
}))

// Dinamik origin
app.use(cors({
  origin: function(origin, callback) {
    const allowed = /\\.mysite\\.com$/.test(origin)
    callback(null, allowed)
  }
}))

// Faqat ma'lum route uchun
app.get("/public", cors(), (req, res) => {
  res.json({ data: "hammaga ochiq" })
})`,
      description: 'Express da CORS ni to\'g\'ri sozlash',
    },
    {
      title: 'CSRF himoyasi',
      language: 'js',
      code: `// ═══ CSRF hujum misoli ═══
// Foydalanuvchi bank.com ga kirgan (cookie bor)
// Hujumchi sahifasida (evil.com):

// 1. img bilan GET so'rov
// <img src="https://bank.com/transfer?to=hacker&amount=10000">

// 2. Form bilan POST so'rov
// <form action="https://bank.com/transfer" method="POST">
//   <input name="to" value="hacker">
//   <input name="amount" value="10000">
// </form>
// <script>document.forms[0].submit()</script>
// Cookie avtomatik yuboriladi — server haqiqiy deb qabul qiladi!

// ═══ CSRF Token himoyasi ═══
// Server har bir session uchun token yaratadi
const csrf = require("csurf")
app.use(csrf())

app.get("/form", (req, res) => {
  // Token ni formga berish
  res.render("transfer", { csrfToken: req.csrfToken() })
})

// HTML:
// <form method="POST" action="/transfer">
//   <input type="hidden" name="_csrf" value="{{csrfToken}}">
//   <input name="to" value="">
//   <input name="amount" value="">
//   <button>Yuborish</button>
// </form>

app.post("/transfer", (req, res) => {
  // csurf avtomatik tekshiradi — token noto'g'ri bo'lsa 403
  processTransfer(req.body)
})

// ═══ SPA da CSRF Token ═══
// 1. Login da server token beradi (cookie yoki header)
// 2. Har bir so'rovda header sifatida yuborish
async function apiRequest(url, options = {}) {
  const csrfToken = document.querySelector(
    "meta[name='csrf-token']"
  )?.content

  return fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      ...options.headers,
      "X-CSRF-Token": csrfToken,
    },
  })
}`,
      description: 'CSRF hujum va CSRF Token bilan himoya',
    },
    {
      title: 'SameSite cookies va xavfsiz cookie sozlamalari',
      language: 'js',
      code: `// ═══ Cookie sozlamalari ═══
// Express da
res.cookie("sessionId", "abc123", {
  httpOnly: true,     // JS dan kirish taqiq (document.cookie)
  secure: true,       // Faqat HTTPS
  sameSite: "lax",    // CSRF himoyasi
  maxAge: 86400000,   // 1 kun (millisekund)
  path: "/",          // Barcha yo'llarda
  domain: ".mysite.com", // Subdomain lar ham
})

// ═══ SameSite turlari ═══

// Strict — eng xavfsiz, lekin UX muammo
res.cookie("session", "abc", {
  sameSite: "strict",
  // Boshqa saytdan link bosib kelganda HAM yuborilmaydi
  // Foydalanuvchi har safar qayta login qilishi kerak
})

// Lax — eng yaxshi balans (default)
res.cookie("session", "abc", {
  sameSite: "lax",
  // GET navigatsiya da yuboriladi (link bosish)
  // POST, fetch, iframe — yuborilMAYDI
  // Ko'pchilik CSRF hujumlarini to'xtatadi
})

// None — uchinchi tomon integratsiya uchun
res.cookie("tracking", "xyz", {
  sameSite: "none",
  secure: true,  // SHART — None + Secure
  // Payment gateway, social login kabi holatlarda
})

// ═══ Xavfsizlik header lari ═══
const helmet = require("helmet")
app.use(helmet())

// Yoki qo'lda:
app.use((req, res, next) => {
  // HTTPS ga majburlash
  res.setHeader("Strict-Transport-Security",
    "max-age=31536000; includeSubDomains; preload")

  // MIME sniffing to'xtatish
  res.setHeader("X-Content-Type-Options", "nosniff")

  // Clickjacking himoya
  res.setHeader("X-Frame-Options", "DENY")

  // Referer cheklash
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin")

  // Kamera, mikrofon cheklash
  res.setHeader("Permissions-Policy",
    "camera=(), microphone=(), geolocation=()")

  next()
})`,
      description: 'SameSite cookie turlari va xavfsizlik header lari',
    },
    {
      title: 'Frontend da CORS xatolarini debug qilish',
      language: 'js',
      code: `// ═══ Eng ko'p uchraydigan CORS xatolari ═══

// 1. "No 'Access-Control-Allow-Origin' header"
// Sabab: server CORS header qaytarmayapti
// Yechim: serverda CORS sozlash

// 2. "Credentials not supported with wildcard origin"
// Sabab: Allow-Origin: * va credentials: include birga
// Yechim: aniq origin ko'rsatish
// ❌ Access-Control-Allow-Origin: *
// ✅ Access-Control-Allow-Origin: https://mysite.com

// 3. "Method not allowed"
// Sabab: preflight da ruxsat berilmagan metod
// Yechim: Access-Control-Allow-Methods ga qo'shish

// ═══ Debug qilish ═══
// Chrome DevTools → Network tab
// OPTIONS so'rovni toping — response headers ni ko'ring

async function debugFetch(url, options = {}) {
  try {
    const response = await fetch(url, options)
    if (!response.ok) {
      console.error(\`HTTP xato: \${response.status}\`)
    }
    return response
  } catch (err) {
    if (err instanceof TypeError && err.message === "Failed to fetch") {
      console.error("CORS yoki tarmoq xatosi!")
      console.error("Tekshiring:")
      console.error("1. Server CORS header qaytaryaptimi?")
      console.error("2. URL to'g'rimi?")
      console.error("3. Server ishlamoqdami?")
    }
    throw err
  }
}

// ═══ Development da proxy ishlatish ═══
// Vite da — CORS muammosiz development

// vite.config.js
export default {
  server: {
    proxy: {
      "/api": {
        target: "https://api.example.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\\/api/, ""),
      }
    }
  }
}
// fetch("/api/users") → https://api.example.com/users
// Brauzer faqat localhost ga so'rov ko'radi — CORS yo'q!`,
      description: 'CORS xatolarini aniqlash va development proxy',
    },
  ],
  interviewQA: [
    {
      question: 'Same-Origin Policy nima va nima uchun kerak?',
      answer: 'Same-Origin Policy (SOP) — brauzerning asosiy xavfsizlik mexanizmi. Bir origin (protocol + host + port) dagi skript boshqa origin ning ma\'lumotlariga kira olmaydi. Masalan, evil.com dagi JS bank.com API javobini o\'qiy olmaydi. SOP himoya qiladi: fetch/XHR javoblari, iframe kontenti, localStorage, cookies. LEKIN cheklamaydi: <script src>, <img src>, <link href>, <form action>. Shuning uchun CORS (serverdan ruxsat) va CSRF himoyasi (form yuborish) alohida kerak.',
    },
    {
      question: 'CORS qanday ishlaydi va preflight so\'rov nima?',
      answer: 'CORS — server boshqa origin larga ruxsat berish mexanizmi. Oddiy so\'rovlar (GET, POST with simple headers) to\'g\'ridan-to\'g\'ri yuboriladi, server Access-Control-Allow-Origin header bilan ruxsat beradi. Murakkab so\'rovlar (PUT, DELETE, custom headers, JSON) uchun brauzer AVVAL OPTIONS so\'rov yuboradi (preflight) — server ruxsat bersa, haqiqiy so\'rov yuboriladi. Preflight javobida: Allow-Origin, Allow-Methods, Allow-Headers, Max-Age. MUHIM: Allow-Origin: * va Credentials: true BIRGA ishlatib bo\'lmaydi.',
    },
    {
      question: 'CSRF nima va qanday himoya qilinadi?',
      answer: 'CSRF (Cross-Site Request Forgery) — hujumchi foydalanuvchini bilmasdan boshqa saytga so\'rov yuborishga majbur qiladi. Brauzer cookie larni avtomatik qo\'shadi — server haqiqiy foydalanuvchi deb o\'ylaydi. Himoya: 1) CSRF Token — har bir formga yashirin token, server tekshiradi, hujumchi bu tokenni bilmaydi. 2) SameSite cookies: Lax — POST so\'rovlarda cookie yuborilmaydi. 3) Origin/Referer header tekshirish. 4) Custom header (X-CSRF-Token) — CORS preflight talab qiladi, boshqa sayt yubora olmaydi.',
    },
    {
      question: 'SameSite cookie ning Strict, Lax, None farqlari nima?',
      answer: 'SameSite — cookie ning cross-site so\'rovlarda yuborilishini boshqaradi. Strict — FAQAT o\'z sayt so\'rovlarida, boshqa saytdan link bilan kelganda HAM yuborilmaydi (UX muammo). Lax (default) — GET navigatsiya da yuboriladi (link bosish), POST/fetch/iframe da yuborilMAYDI — eng yaxshi balans. None — har doim yuboriladi, Secure flag SHART (HTTPS), uchinchi tomon integratsiya uchun (payment, social login). MUHIM: Lax ko\'pchilik CSRF hujumlarini to\'xtatadi, chunki hujumlar odatda POST orqali.',
    },
    {
      question: 'Development da CORS muammosini qanday hal qilish mumkin?',
      answer: 'Development da CORS eng ko\'p uchraydigan muammo. Yechimlar: 1) Vite/Webpack proxy — server.proxy sozlash, brauzer faqat localhost ga so\'rov ko\'radi, CORS muammo yo\'q. 2) Server da development CORS — Allow-Origin: localhost:5173. 3) Backend da cors() middleware. MUHIM: "CORS everywhere" browser extension yoki --disable-web-security flag ishlatmang — xavfsizlik muammolarini yashiradi, production da ishlamaydi. To\'g\'ri yechim: server da CORS ni to\'g\'ri sozlash yoki development proxy ishlatish.',
    },
    {
      question: 'Xavfsizlik header lari (HSTS, X-Frame-Options, Referrer-Policy) nima uchun kerak?',
      answer: 'Har bir header alohida hujum turidan himoya qiladi: 1) Strict-Transport-Security (HSTS) — brauzerga faqat HTTPS ishlatishni aytadi, HTTP downgrade hujumini to\'xtatadi. 2) X-Frame-Options: DENY — sahifani iframe da ko\'rsatishni taqiqlaydi, clickjacking hujumini to\'xtatadi. 3) X-Content-Type-Options: nosniff — MIME type sniffing ni to\'xtatadi, JS sifatida talqin qilinmasligi kerak bo\'lgan fayllarni himoya qiladi. 4) Referrer-Policy — boshqa saytlarga qancha URL ma\'lumoti yuborilishini cheklaydi. 5) Permissions-Policy — kamera, mikrofon kabi API larni cheklaydi. Eng oson usul — helmet kutubxonasi.',
    },
  ],
}
