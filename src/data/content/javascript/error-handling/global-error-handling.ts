import type { Topic } from '../../../types'

export const globalErrorHandling: Topic = {
  id: 'global-error-handling',
  title: 'Global Error Handling',
  importance: 2,
  status: 'to-learn',
  description: 'window.onerror, unhandledrejection, Error reporting, React ErrorBoundary, source maps',

  content: `═══════════════════════════════════════
  GLOBAL ERROR HANDLING — NIMA UCHUN KERAK?
═══════════════════════════════════════

Har bir try/catch faqat O'Z blokidagi xatolarni ushlaydi.
Lekin ba'zi xatolar hech qanday catch ga TUSHMAYDI:
- Event handler ichidagi xatolar
- setTimeout/setInterval callback xatolari
- Async funksiyada catch qilinmagan rejection
- Third-party library xatolari

Global error handler — bu OXIRGI HIMOYA chizig'i. U barcha
ushlanmagan xatolarni ushlaydi va log qiladi. Bu production
da xatolarni KUZATISH uchun muhim.

MUHIM: Global handler asosiy xato boshqarish EMAS — u BACKUP.
Har bir funksiyada o'z try/catch bo'lishi kerak. Global handler
faqat ushlanmagan xatolarni LOG qilish uchun.

═══════════════════════════════════════
  WINDOW.ONERROR
═══════════════════════════════════════

Eng eski global xato ushlash usuli. Barcha ushlanmagan
sinxron xatolarni ushlaydi.

  window.onerror = function(message, source, line, col, error) {
    // message — xato matni
    // source — fayl URL
    // line — qator raqami
    // col — ustun raqami
    // error — Error obyekti (zamonaviy brauzerlar)
    return true  // Brauzer console xatosini yashirish
  }

Cheklovlari:
1. Promise rejection ni USHLAMAYDI
2. Bir vaqtda faqat BITTA handler (oxirgi yozilgan)
3. Cross-origin script xatolari — "Script error." (tafsilot yo'q)
4. error parametri eski brauzer larda null

═══════════════════════════════════════
  WINDOW.ADDEVENTLISTENER("ERROR")
═══════════════════════════════════════

addEventListener — onerror dan yaxshiroq:
1. Bir nechta handler qo'shish mumkin
2. ErrorEvent obyekti to'liq ma'lumot beradi
3. Resurs yuklash xatolarini ham ushlaydi (capture fazada)

  window.addEventListener("error", event => {
    console.error("Xato:", event.error)
    console.error("Fayl:", event.filename)
    console.error("Qator:", event.lineno)
  })

Resurs yuklash xatosi (img, script, css):
  window.addEventListener("error", event => {
    if (event.target !== window) {
      // Resurs xatosi — img, script, link
      console.error("Resurs yuklanmadi:", event.target.src)
    }
  }, true)  // CAPTURE faza — MUHIM!

MUHIM: Resurs xatolari faqat CAPTURE fazada ushlanadi
(uchinchi argument true). Bubbling fazada ushlanmaydi.

═══════════════════════════════════════
  UNHANDLEDREJECTION EVENT
═══════════════════════════════════════

Promise rejection catch qilinmaganda yuz beradi.
Bu zamonaviy JavaScript da eng ko'p uchraydigan global xato.

  window.addEventListener("unhandledrejection", event => {
    console.error("Ushlanmagan rejection:", event.reason)
    // event.reason — reject qilingan qiymat (odatda Error)
    // event.promise — reject bo'lgan Promise
    event.preventDefault()  // Brauzer console warningni yashirish
  })

Teskari hodisa — rejection keyin ushlanganda:
  window.addEventListener("rejectionhandled", event => {
    console.log("Rejection keyin ushlandi")
  })

═══════════════════════════════════════
  ERROR REPORTING (SENTRY PATTERN)
═══════════════════════════════════════

Production da xatolarni kuzatish — Sentry, Bugsnag, DataDog
kabi servislar orqali. Ular global handler o'rnatib, xatolarni
serverga yuboradi.

Error reporting tizimining asosiy qismlari:
1. CAPTURE — global handler orqali barcha xatolarni ushlash
2. ENRICH — kontekst qo'shish (user, URL, brauzer, version)
3. BATCH — xatolarni to'plab yuborish (har birini alohida emas)
4. DEDUPLICATE — takroriy xatolarni birlashtirish
5. ALERT — muhim xatolarda bildirishnoma yuborish

Sentry ishlash prinsipi:
  Sentry.init({ dsn: "https://..." })
  // Avtomatik: window.onerror, unhandledrejection
  // Qo'lda: Sentry.captureException(error)
  // Breadcrumbs: console, click, navigation, fetch — kontekst

═══════════════════════════════════════
  REACT ERRORBOUNDARY ALOQASI
═══════════════════════════════════════

React ErrorBoundary — RENDER xatolarini ushlaydi.
Global handler lar — RUNTIME xatolarini ushlaydi.
Bular bir-birini TO'LDIRADI.

ErrorBoundary nima ushlamaydi:
1. Event handler xatolari — window.onerror ushlaydi
2. Asinxron xatolar — unhandledrejection ushlaydi
3. Server-side rendering xatolari
4. ErrorBoundary o'zidagi xatolar

To'liq himoya uchun IKKISI ham kerak:
  <ErrorBoundary>   → render xatolari
  window.onerror    → sinxron runtime xatolari
  unhandledrejection → asinxron xatolar

═══════════════════════════════════════
  SOURCE MAPS VA PRODUCTION DEBUGGING
═══════════════════════════════════════

Production da kod minified — stack trace o'qib bo'lmaydi:
  Error at e.render (app.min.js:1:28456)

Source map — minified kodni asl kodga xaritalaydigan fayl.
  app.min.js → app.min.js.map → asl fayl va qator

Source map strategiyalari:
1. PUBLIC — .map fayllar serverda (DevTools ishlatishi mumkin)
   Kamchiligi: har kim asl kodni ko'radi
2. HIDDEN — .map fayllar faqat error reporting serverda
   Sentry/Bugsnag source map yuklash imkonini beradi
3. INLINE — map kod ichida (faqat development)

MUHIM: Production da source map ni PUBLIC qilmang —
asl kodni yashirish xavfsizlik uchun muhim. Sentry ga
upload qiling, serverdan o'chiring.

═══════════════════════════════════════
  BEST PRACTICES
═══════════════════════════════════════

1. Global handler lar — BACKUP, asosiy himoya emas
2. Har bir async operatsiyada try/catch yoki .catch()
3. Error reporting servis (Sentry) — production monitoring
4. Source maps — hidden mode da, faqat error servisda
5. User context — xato bilan birga user/session ma'lumoti
6. Breadcrumbs — xatogacha bo'lgan harakatlar tarixi
7. Rate limiting — bir xil xatoni ko'p marta yubormaslik
8. Environment — dev/staging/production farqlash`,

  codeExamples: [
    {
      title: 'Global error handler lar — to"liq setup',
      language: 'js',
      description: 'window.onerror, error event va unhandledrejection ni sozlash',
      code: `// 1. Sinxron xatolar — window.onerror
window.onerror = function(message, source, line, col, error) {
  console.error("GLOBAL XATO:")
  console.error("Xabar:", message)
  console.error("Fayl:", source)
  console.error("Qator:", line, "Ustun:", col)
  console.error("Error:", error)

  reportToServer({
    type: "uncaught_error",
    message,
    source,
    line,
    col,
    stack: error?.stack
  })

  return true  // console.error ni yashirish (ixtiyoriy)
}

// 2. addEventListener bilan — bir nechta handler mumkin
window.addEventListener("error", event => {
  // Resurs xatosi yoki runtime xato
  if (event.target !== window) {
    // Resurs yuklanmadi (img, script, css)
    const element = event.target
    console.error("Resurs xatosi:", element.tagName, element.src)
    return
  }

  // Runtime xato
  console.error("Runtime xato:", event.error)
}, true)  // capture: true — resurs xatolari uchun MUHIM

// 3. Promise rejection
window.addEventListener("unhandledrejection", event => {
  const reason = event.reason

  reportToServer({
    type: "unhandled_rejection",
    message: reason?.message || String(reason),
    stack: reason?.stack,
  })

  event.preventDefault()
})

// 4. Rejection keyin ushlanganda
window.addEventListener("rejectionhandled", event => {
  console.log("Rejection keyin ushlandi — monitoring dan o'chirish")
})`
    },
    {
      title: 'Error reporting tizimi',
      language: 'js',
      description: 'Sentry-ga o"xshash oddiy error reporting',
      code: `class ErrorReporter {
  constructor(config) {
    this.endpoint = config.endpoint
    this.appVersion = config.version
    this.queue = []
    this.flushInterval = 5000  // 5 sek
    this.maxBatchSize = 10

    this.setupGlobalHandlers()
    this.startFlushing()
  }

  setupGlobalHandlers() {
    // Sinxron xatolar
    window.addEventListener("error", event => {
      this.capture(event.error || new Error(event.message))
    })

    // Asinxron xatolar
    window.addEventListener("unhandledrejection", event => {
      const error = event.reason instanceof Error
        ? event.reason
        : new Error(String(event.reason))
      this.capture(error)
    })
  }

  capture(error, context = {}) {
    this.queue.push({
      name: error.name,
      message: error.message,
      stack: error.stack,
      timestamp: Date.now(),
      url: location.href,
      userAgent: navigator.userAgent,
      appVersion: this.appVersion,
      ...context,
    })

    // Queue to'lsa — darhol yuborish
    if (this.queue.length >= this.maxBatchSize) {
      this.flush()
    }
  }

  async flush() {
    if (this.queue.length === 0) return

    const batch = this.queue.splice(0, this.maxBatchSize)
    try {
      await fetch(this.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ errors: batch }),
      })
    } catch {
      // Yuborib bo'lmasa — qaytarish
      this.queue.unshift(...batch)
    }
  }

  startFlushing() {
    setInterval(() => this.flush(), this.flushInterval)
  }
}

// Ishlatish
const reporter = new ErrorReporter({
  endpoint: "/api/errors",
  version: "1.2.3"
})`
    },
    {
      title: 'React ErrorBoundary + global handler',
      language: 'js',
      description: 'React render xatolari va runtime xatolarni birga ushlash',
      code: `// React ErrorBoundary — RENDER xatolarini ushlaydi
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    // Error reporting servisga yuborish
    reportError({
      type: "react_render_error",
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    })
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div>
          <h2>Xato yuz berdi</h2>
          <button onClick={() => this.setState({ hasError: false })}>
            Qayta urinish
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

// ErrorBoundary USHLAMAYDI — global handler kerak:
function handleClick() {
  // Event handler xatosi — ErrorBoundary ushlamaydi
  // window.onerror ushlaydi
  throw new Error("Click xatosi")
}

async function loadData() {
  // Async xato — ErrorBoundary ushlamaydi
  // unhandledrejection ushlaydi
  const res = await fetch("/api/data")
  if (!res.ok) throw new Error("API xato")
}

// To'liq himoya
function App() {
  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <MainContent />
    </ErrorBoundary>
  )
}

// + global handler lar alohida sozlanadi`
    },
    {
      title: 'Cross-origin xatolar va source maps',
      language: 'js',
      description: 'Script error muammosi va source map strategiyalari',
      code: `// Muammo: Cross-origin script xatolari
// Boshqa domendagi script xatosi — tafsilot yo'q:
window.onerror = function(message) {
  console.log(message)  // "Script error." — faqat shu!
  // source, line, col, error — hammasi null/0
}

// Yechim 1: CORS header
// Server: Access-Control-Allow-Origin: *
// HTML: <script src="https://cdn.example.com/app.js" crossorigin>

// Yechim 2: try/catch wrapper
function wrapHandler(fn) {
  return function(...args) {
    try {
      return fn.apply(this, args)
    } catch (error) {
      // Bu yerda to'liq error obyekti bor
      reportError(error)
      throw error
    }
  }
}

button.addEventListener("click", wrapHandler(function() {
  // Xato bo'lsa — to'liq stack trace olinadi
  riskyOperation()
}))

// Source map — production da debugging
// vite.config.js
export default defineConfig({
  build: {
    // Development
    sourcemap: true,

    // Production — hidden (faqat error servis uchun)
    sourcemap: "hidden",  // .map yaratadi, lekin kodda referens yo'q
  }
})

// Sentry ga source map yuklash
// sentry-cli releases files upload-sourcemaps ./dist

// Production stack trace (source map BILAN):
// Error: User not found
//   at getUserById (src/services/user.ts:45:11)
//   at handleRequest (src/api/routes.ts:123:5)

// Production stack trace (source map SRIZ):
// Error: User not found
//   at e.r (app.3f8a2b.js:1:28456)
//   at t.handleRequest (app.3f8a2b.js:1:45123)`
    },
    {
      title: 'To"liq error monitoring setup',
      language: 'js',
      description: 'Breadcrumbs, context va rate limiting bilan monitoring',
      code: `class ErrorMonitor {
  #breadcrumbs = []
  #errorCounts = new Map()  // Deduplicate uchun
  #maxBreadcrumbs = 50

  // Breadcrumb — xatogacha bo'lgan harakatlar tarixi
  addBreadcrumb(category, message, data = {}) {
    this.#breadcrumbs.push({
      category,  // "ui.click", "navigation", "fetch"
      message,
      data,
      timestamp: Date.now(),
    })

    // Oxirgi N ta saqlash
    if (this.#breadcrumbs.length > this.#maxBreadcrumbs) {
      this.#breadcrumbs.shift()
    }
  }

  // Avtomatik breadcrumb lar
  setupAutoBreadcrumbs() {
    // Click lar
    document.addEventListener("click", event => {
      const target = event.target
      this.addBreadcrumb("ui.click", target.tagName, {
        text: target.textContent?.slice(0, 50),
        id: target.id,
      })
    })

    // Navigation
    window.addEventListener("popstate", () => {
      this.addBreadcrumb("navigation", location.href)
    })

    // Console
    const originalLog = console.log
    console.log = (...args) => {
      this.addBreadcrumb("console", args.join(" "))
      originalLog.apply(console, args)
    }
  }

  // Rate limiting — bir xil xatoni ko'p yubormaslik
  shouldReport(error) {
    const key = error.message + (error.stack?.split("\\n")[1] || "")
    const count = this.#errorCounts.get(key) || 0

    if (count >= 5) return false  // 5 martadan ko'p yubormaslik

    this.#errorCounts.set(key, count + 1)

    // 1 minutdan keyin reset
    setTimeout(() => this.#errorCounts.delete(key), 60000)
    return true
  }

  report(error) {
    if (!this.shouldReport(error)) return

    const payload = {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
      breadcrumbs: [...this.#breadcrumbs],
      context: {
        url: location.href,
        userAgent: navigator.userAgent,
        timestamp: Date.now(),
      },
    }

    // Beacon API — sahifa yopilayotganda ham yuboradi
    navigator.sendBeacon("/api/errors", JSON.stringify(payload))
  }
}`
    }
  ],

  interviewQA: [
    {
      question: 'window.onerror va addEventListener("error") farqi nima?',
      answer: 'window.onerror — eski usul, faqat BITTA handler, parametrlar alohida (message, source, line, col, error). addEventListener("error") — zamonaviy, BIR NECHTA handler, ErrorEvent obyekti beradi. Muhim farq: addEventListener capture: true bilan resurs xatolarini ham ushlaydi (img, script yuklanmasa). onerror buni USHLAMAYDI. Ikkisi ham Promise rejection ni ushlamaydi — buning uchun "unhandledrejection" event kerak. Best practice: addEventListener ishlatish, chunki bir nechta handler va resurs xatolari qo\'llab-quvvatlanadi.'
    },
    {
      question: 'React ErrorBoundary nima ushlamaydi? Bu bo"shliqni qanday to"ldirish mumkin?',
      answer: 'ErrorBoundary faqat RENDER xatolarini ushlaydi (lifecycle, constructor, render). Ushlamaydigan xatolar: 1) Event handler xatolari — try/catch yoki window.onerror. 2) Asinxron xatolar (setTimeout, Promise) — unhandledrejection. 3) Server-side rendering. 4) ErrorBoundary o\'zidagi xatolar. To\'liq himoya: ErrorBoundary (render) + window.addEventListener("error") (sinxron) + unhandledrejection (asinxron). Production da Sentry kabi servis global handler larni avtomatik o\'rnatadi va ErrorBoundary bilan integratsiya qiladi.'
    },
    {
      question: '"Script error." xatosi nima? Qanday yechiladi?',
      answer: '"Script error." — cross-origin script xatosi. Xavfsizlik sababli brauzer boshqa domendagi script xato tafsilotlarini YASHIRADI (message, source, line — hammasi bo\'sh). Yechimlar: 1) Server da CORS header: Access-Control-Allow-Origin. 2) script tag da crossorigin attribute: <script src="cdn.js" crossorigin>. 3) try/catch wrapper — xatoni O\'Z domeningizda ushlash va to\'liq ma\'lumot olish. 4) Proxy — CDN o\'rniga o\'z serveringiz orqali yuklash. Sentry kabi servislar bu muammoni avtomatik hal qiladi (wrapper lar orqali).'
    },
    {
      question: 'Source maps production da qanday ishlatiladi?',
      answer: 'Production da kod minified — stack trace o\'qib bo\'lmaydi. Source map minified kodni asl kodga xaritaydi. Strategiyalar: 1) PUBLIC — .map fayllar serverda, DevTools ishlatadi. Kamchiligi: har kim asl kodni ko\'radi. 2) HIDDEN — Vite/Webpack "hidden-source-map" mode: .map yaratadi lekin kodda referens yo\'q. Faqat error reporting servisga yuklash. 3) NOSOURCES — map bor lekin asl kod yo\'q, faqat fayl nomi va qator. Best practice: hidden mode + Sentry ga upload. Production serverdan .map fayllarni O\'CHIRISH — xavfsizlik uchun muhim.'
    },
    {
      question: 'Error reporting tizimining asosiy komponentlari qanday?',
      answer: 'Professional error reporting 5 qismdan iborat: 1) CAPTURE — global handler lar (onerror, unhandledrejection), React ErrorBoundary, qo\'lda captureException(). 2) ENRICH — kontekst qo\'shish: user, URL, brauzer, app version, breadcrumbs (xatogacha bo\'lgan harakatlar). 3) BATCH — xatolarni to\'plab yuborish (har birini alohida emas), navigator.sendBeacon — sahifa yopilayotganda. 4) DEDUPLICATE — bir xil xatoni birlashtirish, rate limiting (5 marta dan ko\'p yubormaslik). 5) ALERT — muhim/yangi xatolarda bildirishnoma (email, Slack). Sentry, Bugsnag bularning hammasini tayyor beradi.'
    },
    {
      question: 'Breadcrumbs nima va nima uchun muhim?',
      answer: 'Breadcrumbs — xatogacha bo\'lgan foydalanuvchi HARAKATLARI tarixi. Xato yuz berganda faqat stack trace emas, balki QANDAY QADAMLAR orqali shu xatoga kelinganini ko\'rsatadi. Turlari: 1) UI — click, input, scroll harakatlari. 2) Navigation — sahifa o\'tishlari. 3) Console — console.log/warn/error xabarlari. 4) HTTP — fetch/XHR so\'rovlari va javoblari. 5) Custom — dasturchi qo\'shgan (addBreadcrumb). Odatda oxirgi 50-100 ta breadcrumb saqlanadi. Nima uchun muhim: "User login sahifaga o\'tdi → email kiritdi → submit bosdi → 500 xato" — xatoni qayta yaratish oson bo\'ladi.'
    }
  ],

  relatedTopics: [
    { techId: 'javascript', sectionId: 'error-handling', topicId: 'try-catch', label: 'Try / Catch / Finally' },
    { techId: 'javascript', sectionId: 'error-handling', topicId: 'async-errors', label: 'Async xatolar' },
    { techId: 'javascript', sectionId: 'error-handling', topicId: 'custom-errors', label: 'Custom Error lar' },
    { techId: 'javascript', sectionId: 'dom-browser', topicId: 'events', label: 'Events' }
  ]
}
