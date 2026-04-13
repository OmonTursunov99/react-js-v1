import type { Topic } from '../../../types'

export const asyncErrors: Topic = {
  id: 'async-errors',
  title: 'Async Xatolar',
  importance: 3,
  status: 'to-learn',
  description: 'Promise rejection, try/catch + await, unhandledrejection, AbortController, fetch xatolar',

  content: `═══════════════════════════════════════
  ASINXRON XATOLARNI BOSHQARISH
═══════════════════════════════════════

Asinxron kodda xatolarni boshqarish sinxron koddan FARQ qiladi.
Oddiy try/catch setTimeout yoki Promise callback ichidagi
xatolarni USHLAMAYDI. Har bir asinxron mexanizm uchun o'z
xato ushlash usuli bor.

Asinxron xato manbalari:
1. Promise rejection — .catch() yoki try/catch + await
2. setTimeout/setInterval — callback ichida try/catch
3. Event handler — handler ichida try/catch
4. fetch — network xato + HTTP status tekshirish
5. WebSocket — error event listener

MUHIM: Sinxron try/catch asinxron xatoni USHLAMAYDI:
  try {
    setTimeout(() => { throw new Error("Xato") }, 100)
  } catch (e) {
    // BU ISHLAMAYDI! setTimeout callback boshqa call stack da
  }

═══════════════════════════════════════
  PROMISE REJECTION HANDLING
═══════════════════════════════════════

Promise xatolarini ushlashning ikki usuli:

1. .catch() metodi:
   fetchData()
     .then(data => process(data))
     .catch(error => handleError(error))

2. try/catch + await:
   try {
     const data = await fetchData()
     process(data)
   } catch (error) {
     handleError(error)
   }

Ikkalasi ham bir xil natija beradi. async/await + try/catch
ko'proq ishlatiladi — sinxron kodga o'xshash va o'qilishi oson.

MUHIM: await siz Promise rejection catch ga TUSHMAYDI:
  async function bad() {
    try {
      fetchData()  // await yo'q! catch ishlamaydi
    } catch (e) { }
  }

═══════════════════════════════════════
  UNHANDLED REJECTION
═══════════════════════════════════════

Promise reject bo'lib, hech qanday catch bo'lmasa —
unhandled rejection yuz beradi. Bu xavfli, chunki xato
YASHIRINCHA yo'qoladi.

Brauzerda:
  window.addEventListener("unhandledrejection", event => {
    console.error("Ushlanmagan:", event.reason)
    event.preventDefault()  // Brauzer warningni yashirish
  })

Node.js da:
  process.on("unhandledRejection", (reason, promise) => {
    console.error("Ushlanmagan:", reason)
  })

MUHIM: Node.js 15+ da unhandled rejection dasturni TO'XTATADI
(--unhandled-rejections=throw). Shuning uchun DOIMO catch
qo'yish kerak.

═══════════════════════════════════════
  PROMISE.ALLSETTLED — XATOGA CHIDAMLI
═══════════════════════════════════════

Promise.all() — bitta xato bo'lsa HAMMASI bekor bo'ladi.
Promise.allSettled() — BARCHA natijalarni kutadi, xato bo'lsa
ham to'xtamaydi.

Har bir natija obyekti:
  { status: "fulfilled", value: ... }  — muvaffaqiyatli
  { status: "rejected", reason: ... }  — xato bilan

Qachon ishlatiladi:
1. Parallel API call lar — biri xato bo'lsa ham qolganini olish
2. Batch operatsiyalar — muvaffaqiyatli va muvaffaqiyatsizlarni
   alohida qayta ishlash
3. Dashboard — bir nechta data source dan ma'lumot olish,
   biri ishlamasa ham qolganini ko'rsatish

═══════════════════════════════════════
  ASYNC FUNCTION ERROR PROPAGATION
═══════════════════════════════════════

async funksiya DOIMO Promise qaytaradi. Ichida throw qilinsa —
Promise reject bo'ladi. Bu xatoni chaqiruvchi funksiyada
await + try/catch yoki .catch() bilan ushlash mumkin.

Xato propagation zanjiri:
  async function a() { throw new Error("xato") }
  async function b() { await a() }  // xato b ga o'tadi
  async function c() { await b() }  // xato c ga o'tadi

Agar hech kim catch qilmasa — unhandled rejection bo'ladi.

MUHIM: async funksiyada return qilingan Promise ning xatosi
ham catch ga tushadi:
  async function f() { return Promise.reject("xato") }
  // f().catch(e => ...) — ishlaydi

═══════════════════════════════════════
  ABORTCONTROLLER — OPERATSIYANI BEKOR QILISH
═══════════════════════════════════════

AbortController — asinxron operatsiyalarni bekor qilish uchun
standart mexanizm. fetch, addEventListener va boshqa API lar
bilan ishlaydi.

Ishlash prinsipi:
1. const controller = new AbortController()
2. signal ni operatsiyaga uzatish: fetch(url, { signal })
3. controller.abort() — operatsiyani bekor qilish
4. AbortError throw bo'ladi — catch da ushlash kerak

Ishlatish holatlari:
1. fetch — uzoq davom etayotgan so'rovni bekor qilish
2. React useEffect cleanup — komponent unmount da
3. Timeout pattern — ma'lum vaqtdan keyin bekor qilish
4. User cancel — foydalanuvchi "Bekor" tugmasini bosganida

═══════════════════════════════════════
  FETCH ERROR HANDLING PATTERNS
═══════════════════════════════════════

fetch — ikki bosqichli xato tekshirish kerak:

1. NETWORK XATO — fetch reject bo'ladi (catch ga tushadi)
   Internet yo'q, DNS xato, CORS, server javob bermadi

2. HTTP XATO — fetch RESOLVE bo'ladi! Lekin response.ok === false
   404, 500, 403 — bular xato EMAS fetch uchun.

Shuning uchun response.ok tekshirish MAJBURIY:
  const res = await fetch(url)
  if (!res.ok) throw new Error("HTTP " + res.status)

MUHIM: fetch faqat network xatoda reject bo'ladi. HTTP 404,
500 kabi status kodlari XATO HISOBLANMAYDI — response obyekti
qaytadi, faqat ok: false bo'ladi.`,

  codeExamples: [
    {
      title: 'Promise rejection handling usullari',
      language: 'js',
      description: '.catch() va try/catch + await bilan xato ushlash',
      code: `// 1. .catch() usuli
function fetchUser(id) {
  return fetch("/api/users/" + id)
    .then(res => {
      if (!res.ok) throw new Error("HTTP " + res.status)
      return res.json()
    })
    .catch(error => {
      console.error("Xato:", error.message)
      return null  // Fallback qiymat
    })
}

// 2. try/catch + await — tavsiya etiladi
async function fetchUserAsync(id) {
  try {
    const res = await fetch("/api/users/" + id)
    if (!res.ok) throw new Error("HTTP " + res.status)
    return await res.json()
  } catch (error) {
    console.error("Xato:", error.message)
    return null
  }
}

// ⚠️ XATO — await yo'q, catch ishlamaydi!
async function buggyFunction() {
  try {
    fetch("/api/data")  // await YO'Q!
    // fetch Promise qaytaradi lekin await qilinmagan
    // Promise reject bo'lsa — catch ISHLAMAYDI
  } catch (error) {
    console.log("Bu hech qachon ishlamaydi")
  }
}

// ⚠️ setTimeout ichida throw — catch ISHLAMAYDI
async function anotherBug() {
  try {
    setTimeout(() => {
      throw new Error("Bu catch ga TUSHMAYDI")
    }, 100)
  } catch (error) {
    console.log("Ishlamaydi")
  }
}`
    },
    {
      title: 'Promise.allSettled — xatoga chidamli parallel',
      language: 'js',
      description: 'Barcha natijalarni olish — xatolar bilan birga',
      code: `// Promise.all — bitta xato bo'lsa HAMMASI bekor
try {
  const [users, orders, stats] = await Promise.all([
    fetchUsers(),    // ✅ muvaffaqiyatli
    fetchOrders(),   // ❌ xato
    fetchStats()     // ❓ kutib bo'lmaydi — all bekor qildi
  ])
} catch (error) {
  // Bitta xato — hamma natija yo'q
}

// Promise.allSettled — BARCHASI tugashini kutadi
const results = await Promise.allSettled([
  fetchUsers(),    // ✅
  fetchOrders(),   // ❌
  fetchStats()     // ✅
])

// Natijalarni ajratish
const successful = results
  .filter(r => r.status === "fulfilled")
  .map(r => r.value)

const failed = results
  .filter(r => r.status === "rejected")
  .map(r => r.reason)

console.log(successful.length + " ta muvaffaqiyatli")
console.log(failed.length + " ta xato")

// Dashboard pattern — mavjud ma'lumotni ko'rsatish
async function loadDashboard() {
  const [usersResult, ordersResult, statsResult] =
    await Promise.allSettled([
      fetchUsers(),
      fetchOrders(),
      fetchStats(),
    ])

  return {
    users: usersResult.status === "fulfilled"
      ? usersResult.value : [],
    orders: ordersResult.status === "fulfilled"
      ? ordersResult.value : [],
    stats: statsResult.status === "fulfilled"
      ? statsResult.value : null,
    errors: [usersResult, ordersResult, statsResult]
      .filter(r => r.status === "rejected")
      .map(r => r.reason.message),
  }
}`
    },
    {
      title: 'AbortController bilan bekor qilish',
      language: 'js',
      description: 'fetch, timeout va React cleanup uchun AbortController',
      code: `// Oddiy fetch bekor qilish
const controller = new AbortController()

fetch("/api/large-data", { signal: controller.signal })
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(error => {
    if (error.name === "AbortError") {
      console.log("So'rov bekor qilindi")
    } else {
      console.error("Xato:", error)
    }
  })

// 5 sekunddan keyin bekor qilish
setTimeout(() => controller.abort(), 5000)

// Timeout wrapper
async function fetchWithTimeout(url, timeoutMs = 5000) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(url, { signal: controller.signal })
    return await response.json()
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("So'rov " + timeoutMs + "ms ichida tugamadi")
    }
    throw error
  } finally {
    clearTimeout(timeoutId)
  }
}

// React useEffect da AbortController
function UserProfile({ userId }) {
  const [user, setUser] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    async function loadUser() {
      try {
        const res = await fetch(
          "/api/users/" + userId,
          { signal: controller.signal }
        )
        if (!res.ok) throw new Error("HTTP " + res.status)
        const data = await res.json()
        setUser(data)
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message)
        }
      }
    }

    loadUser()
    return () => controller.abort()  // Cleanup
  }, [userId])
}`
    },
    {
      title: 'fetch error handling — to"liq pattern',
      language: 'js',
      description: 'Network xato, HTTP xato va response parsing ni to"g"ri boshqarish',
      code: `// fetch IKKI bosqichli xato tekshirish kerak

// Yordamchi funksiya
async function safeFetch(url, options = {}) {
  let response

  // 1-BOSQICH: Network xato
  try {
    response = await fetch(url, options)
  } catch (error) {
    // Internet yo'q, DNS xato, CORS, server javob bermadi
    if (error.name === "AbortError") {
      throw new Error("So'rov bekor qilindi")
    }
    throw new Error("Tarmoq xatosi: " + error.message)
  }

  // 2-BOSQICH: HTTP xato (fetch buni XATO deb hisoblamaydi!)
  if (!response.ok) {
    let errorBody = null
    try {
      errorBody = await response.json()
    } catch {
      // Response JSON emas — body ni o'qib bo'lmaydi
    }

    const error = new Error(
      errorBody?.message || "HTTP xato: " + response.status
    )
    error.status = response.status
    error.body = errorBody
    throw error
  }

  // 3-BOSQICH: Response parsing
  try {
    return await response.json()
  } catch (error) {
    throw new Error("JSON parse xatosi: " + error.message)
  }
}

// Ishlatish
async function getUsers() {
  try {
    const users = await safeFetch("/api/users")
    return users
  } catch (error) {
    if (error.status === 401) {
      redirectToLogin()
    } else if (error.status === 404) {
      return []
    } else {
      showNotification("Xato: " + error.message)
      throw error
    }
  }
}`
    },
    {
      title: 'Unhandled rejection va global xato ushlash',
      language: 'js',
      description: 'Ushlanmagan Promise xatolarini global darajada ushlash',
      code: `// Brauzerda unhandled rejection
window.addEventListener("unhandledrejection", event => {
  console.error("Ushlanmagan Promise rejection:")
  console.error("Sabab:", event.reason)

  // Xatoni log servisga yuborish
  reportError({
    type: "unhandled_rejection",
    message: event.reason?.message || String(event.reason),
    stack: event.reason?.stack,
  })

  event.preventDefault()  // Brauzer console warningni yashirish
})

// Handled rejection — Promise.catch() qo'shilganda
window.addEventListener("rejectionhandled", event => {
  console.log("Rejection keyin ushlandi:", event.reason)
})

// Ko'p uchraydigan unhandled rejection sabablari:

// 1. .catch() unutilgan
async function forgetCatch() {
  fetchData()  // ❌ await ham yo'q, catch ham yo'q
}

// 2. async event handler
button.addEventListener("click", async () => {
  // ❌ Agar fetchData reject bo'lsa — unhandled
  const data = await fetchData()
})

// ✅ To'g'ri
button.addEventListener("click", async () => {
  try {
    const data = await fetchData()
  } catch (error) {
    showNotification(error.message)
  }
})

// 3. Promise zanjirda catch yo'q
Promise.resolve()
  .then(() => riskyOperation())
  // ❌ .catch() yo'q

// ✅ Har doim catch qo'ying
Promise.resolve()
  .then(() => riskyOperation())
  .catch(error => handleError(error))`
    }
  ],

  interviewQA: [
    {
      question: 'Asinxron kodda try/catch qanday ishlaydi? Qanday cheklovlari bor?',
      answer: 'try/catch + await — asinxron xatolarni sinxron ko\'rinishda ushlaydi. await qilingan Promise reject bo\'lsa — catch ga tushadi. Cheklovlar: 1) await SHART — await yo\'q Promise rejection catch ga TUSHMAYDI. 2) setTimeout/setInterval callback ichidagi throw — catch ga tushmaydi (boshqa call stack). 3) Parallel await — ketma-ket await sekin, Promise.all/allSettled tezroq lekin xato handling farq qiladi. Best practice: asinxron operatsiyalarni DOIM try/catch ichida await qilish yoki .catch() qo\'shish.'
    },
    {
      question: 'Promise.all va Promise.allSettled xato boshqarishda qanday farq qiladi?',
      answer: 'Promise.all() — birinchi rejection da DARHOL reject bo\'ladi, qolgan Promise lar natijasi yo\'qoladi (cancel qilinmaydi, lekin natijasi e\'tiborga olinmaydi). Bitta xato — hamma bekor. Promise.allSettled() — BARCHA Promise lar tugashini kutadi, har biri uchun { status, value/reason } obyekti qaytaradi. Xato bo\'lsa ham to\'xtamaydi. Qachon nima: all — barcha natija kerak, bitta xato qabul qilinmas (tranzaksiya). allSettled — mavjud natijalarni olish, xato bo\'lsa ham davom etish (dashboard, batch).'
    },
    {
      question: 'fetch xato handling qanday ishlaydi? Nima uchun response.ok tekshirish kerak?',
      answer: 'fetch FAQAT network xatoda (internet yo\'q, DNS, CORS) reject bo\'ladi. HTTP 404, 500, 403 xatolari RESOLVE bo\'ladi — fetch uchun bular xato EMAS, server javob berdi. Shuning uchun ikki bosqichli tekshirish: 1) try/catch — network xatoni ushlash. 2) if (!response.ok) — HTTP xatoni tekshirish. response.ok — status 200-299 oralig\'ida true. Ko\'p dasturchilar fetch("url").then(r => r.json()) yozadi — bu 404 da ham json() ni chaqiradi va boshqa xato beradi. To\'g\'ri: avval ok tekshirish, keyin json() parse qilish, keyin business logic.'
    },
    {
      question: 'AbortController nima va qanday ishlatiladi?',
      answer: 'AbortController — asinxron operatsiyalarni bekor qilish uchun standart Web API. Ishlash: 1) new AbortController() yaratish. 2) controller.signal ni operatsiyaga uzatish (fetch, addEventListener). 3) controller.abort() chaqirish — operatsiya bekor bo\'ladi. 4) AbortError throw bo\'ladi — catch da error.name === "AbortError" tekshirish. Ishlatish joylari: React useEffect cleanup — komponent unmount da so\'rovni bekor qilish. Timeout — ma\'lum vaqtdan keyin abort(). User cancel — foydalanuvchi bekor qilganda. Muhim: abort() chaqirilgandan keyin signal qayta ishlatib BO\'LMAYDI — yangi controller kerak.'
    },
    {
      question: 'Unhandled rejection nima? Nima uchun xavfli?',
      answer: 'Unhandled rejection — Promise reject bo\'lib, hech qanday .catch() yoki try/catch ushlamagan holat. Xavfli sabablari: 1) Xato YASHIRINCHA yo\'qoladi — dastur noto\'g\'ri natija beradi lekin xato ko\'rinmaydi. 2) Node.js 15+ da dasturni TO\'XTATADI (UnhandledPromiseRejection). 3) Memory leak — reject bo\'lgan Promise va uning closure si xotirada qoladi. Global ushlash: window.addEventListener("unhandledrejection", handler) — backup sifatida, lekin asosiy yechim EMAS. Best practice: HAR DOIM .catch() qo\'yish, async event handler larda try/catch ishlatish, eslint no-floating-promises qoidasini yoqish.'
    },
    {
      question: 'Async funksiyada xato propagation qanday ishlaydi?',
      answer: 'async funksiya DOIMO Promise qaytaradi. Ichida throw qilinsa — qaytarilgan Promise REJECT bo\'ladi. Xato avtomatik propagate bo\'ladi: a() throw → b() da await a() xato beradi → c() da await b() xato beradi. Agar hech kim catch qilmasa — unhandled rejection. Muhim nuanslar: 1) return Promise.reject() ham catch ga tushadi. 2) async ichida return throw qilingan Promise — reject bo\'ladi. 3) catch ichida throw — xato yuqoriga davom etadi. 4) catch ichida return — xato TO\'XTAYDI, normal qiymat qaytadi. Pattern: har bir qatlamda o\'z xatosiga o\'rab (wrap) qayta throw qilish — error chain yaratish.'
    }
  ],

  relatedTopics: [
    { techId: 'javascript', sectionId: 'error-handling', topicId: 'try-catch', label: 'Try / Catch / Finally' },
    { techId: 'javascript', sectionId: 'error-handling', topicId: 'global-error-handling', label: 'Global Error Handling' },
    { techId: 'javascript', sectionId: 'async-javascript', topicId: 'promises', label: 'Promises' },
    { techId: 'javascript', sectionId: 'async-javascript', topicId: 'async-await', label: 'Async/Await' },
    { techId: 'javascript', sectionId: 'async-javascript', topicId: 'promise-methods', label: 'Promise metodlari' }
  ]
}
