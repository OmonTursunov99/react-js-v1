import type { Topic } from '../../../types'

export const iframeEmbedding: Topic = {
  id: 'iframe-embedding',
  title: 'iframe va Embedding',
  importance: 2,
  status: 'to-learn',
  description: 'iframe, sandbox, postMessage, security, embedding strategies',
  content: `<iframe> — boshqa HTML hujjatni joriy sahifa ichiga embed (joylashtirish) qilish uchun element. YouTube video, xarita, boshqa sayt yoki micro-frontend joylashtirish mumkin.

═══════════════════════════════════════
  ASOSIY ATRIBUTLAR
═══════════════════════════════════════

  <iframe
    src="https://example.com"     — yuklanadigan URL
    width="600"                   — kenglik
    height="400"                  — balandlik
    loading="lazy"                — lazy loading (viewport ga yaqinlashganda yuklash)
    title="Example sahifasi"      — accessibility uchun majburiy
    allow="fullscreen; camera"    — ruxsatlar (Permission Policy)
    sandbox="allow-scripts"       — xavfsizlik cheklovlari
    referrerpolicy="no-referrer"  — referrer ma'lumotini boshqarish
  ></iframe>

MUHIM: title atributi screen readerlar uchun kerak!

═══════════════════════════════════════
  SANDBOX ATRIBUTI
═══════════════════════════════════════

sandbox — iframe ichidagi kontentga cheklovlar qo'yadi:

  sandbox=""                  — HAMMASI bloklangan (eng xavfsiz)
  sandbox="allow-scripts"     — JavaScript ishlashiga ruxsat
  sandbox="allow-same-origin" — same-origin sifatida ko'rish
  sandbox="allow-forms"       — form yuborishga ruxsat
  sandbox="allow-popups"      — popup ochishga ruxsat
  sandbox="allow-modals"      — alert/confirm/prompt ruxsat
  sandbox="allow-top-navigation" — parent sahifani navigatsiya

Bir nechta ruxsatni birlashtirish:
  sandbox="allow-scripts allow-forms"

XAVF: allow-scripts + allow-same-origin birga berish xavfli!
  Chunki iframe script parent DOM ga kira oladi.
  Bu ikkalasini birga faqat ishonchli manbalar uchun ishlating.

sandbox="" (bo'sh) qachon:
  - Foydalanuvchi kontenti (UGC) ko'rsatishda
  - Ishonchsiz HTML render qilishda
  - Xavfsizlik eng muhim bo'lganda

═══════════════════════════════════════
  SAME-ORIGIN POLICY VA IFRAME
═══════════════════════════════════════

Same-origin: protocol + host + port bir xil.

Same-origin iframe:
  - parent dan iframe DOM ga kirish mumkin
  - iframe dan parent DOM ga kirish mumkin
  - contentWindow, contentDocument ishlaydi

Cross-origin iframe:
  - DOM ga kirish BLOKLANGAN
  - contentDocument = null
  - Faqat postMessage orqali muloqot
  - Brauzer xavfsizlik sababli bloklaydii

═══════════════════════════════════════
  POSTMESSAGE API
═══════════════════════════════════════

Cross-origin iframe va parent orasida xavfsiz muloqot usuli.

Parent → iframe:
  iframe.contentWindow.postMessage(data, targetOrigin)

iframe → Parent:
  window.parent.postMessage(data, targetOrigin)

Qabul qilish:
  window.addEventListener('message', (event) => {
    // MAJBURIY: origin tekshirish!
    if (event.origin !== 'https://trusted.com') return
    console.log(event.data)
  })

XAVFSIZLIK QOIDALARI:
  1. targetOrigin ni aniq bering ('*' ishlatmang production da!)
  2. event.origin ni DOIMO tekshiring
  3. event.data ni validatsiya qiling
  4. Maxfiy ma'lumot yubormang xavfsiz bo'lmasa

═══════════════════════════════════════
  ALLOW ATRIBUTI (PERMISSION POLICY)
═══════════════════════════════════════

allow atributi — iframe ichida qaysi API larga ruxsat berilishini boshqaradi:

  allow="camera"        — kamera
  allow="microphone"    — mikrofon
  allow="fullscreen"    — to'liq ekran
  allow="payment"       — Payment Request API
  allow="geolocation"   — joylashuv
  allow="autoplay"      — avtomatik audio/video

Misol:
  <iframe src="..." allow="camera; microphone; fullscreen"></iframe>

Default: ko'p ruxsatlar bloklangan (xavfsiz).

═══════════════════════════════════════
  XAVFSIZLIK MUAMMOLARI
═══════════════════════════════════════

1. CLICKJACKING
   Hujumchi sizning saytingizni shaffof iframe ichiga joylashtiradi.
   Foydalanuvchi boshqa narsani bosgandek ko'rinadi, lekin aslida
   sizning saytingiz tugmalarini bosadi.

   Himoya:
   a) X-Frame-Options header:
      X-Frame-Options: DENY          — hech kimga ruxsat yo'q
      X-Frame-Options: SAMEORIGIN    — faqat o'z domeni

   b) CSP frame-ancestors (yangi, kuchliroq):
      Content-Security-Policy: frame-ancestors 'none'
      Content-Security-Policy: frame-ancestors 'self' https://trusted.com

2. XSS (Cross-Site Scripting)
   iframe ichidagi zararli script parent sahifaga ta'sir qilishi.
   Himoya: sandbox atributi, CSP headerlar.

═══════════════════════════════════════
  IFRAME MUQOBILLARI
═══════════════════════════════════════

1. Web Components — Custom Elements bilan izolyatsiyalangan komponent
   Shadow DOM orqali CSS izolyatsiya

2. Micro-frontends — alohida deploy qilinadigan frontend qismlar
   Module Federation, Single-SPA

3. Portals (eksperimental) — iframe ga o'xshash, lekin navigatsiya qiladi

4. Server-side includes — SSI, ESI

Iframe hamon kerak bo'ladigan holatlar:
  - Uchinchi tomon widget (YouTube, xarita, to'lov)
  - Sandboxed foydalanuvchi kontenti
  - Legacy tizim integratsiyasi

═══════════════════════════════════════
  IFRAME PERFORMANCE
═══════════════════════════════════════

iframe — "og'ir" element:
  - Alohida browsing context (memory)
  - Alohida DOM, JavaScript environment
  - Har bir iframe alohida network so'rovlar

Optimizatsiya:
  1. loading="lazy" — viewport ga yaqinlashganda yuklash
  2. srcdoc="<p>HTML</p>" — alohida so'rov kerak emas
  3. Kerak bo'lmaguncha iframe yaratmang (lazy render)
  4. Kam iframe ishlatish — har biri resource sarflaydi`.trim(),

  codeExamples: [
    {
      title: 'iframe asosiy misol',
      language: 'html',
      description: 'sandbox, allow, loading="lazy" va srcdoc ishlatilishi',
      code: `<!-- ═══ ODDIY IFRAME ═══ -->
<iframe
  src="https://example.com"
  width="600"
  height="400"
  title="Namuna sahifa"
  loading="lazy"
></iframe>

<!-- ═══ XAVFSIZ IFRAME (sandbox bilan) ═══ -->
<!-- Foydalanuvchi kontentini ko'rsatish uchun -->
<iframe
  src="https://untrusted-content.com"
  width="600"
  height="400"
  title="Foydalanuvchi kontenti"
  loading="lazy"
  sandbox="allow-scripts allow-forms"
  referrerpolicy="no-referrer"
></iframe>

<!-- ═══ YOUTUBE VIDEO (allow bilan) ═══ -->
<iframe
  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
  width="560"
  height="315"
  title="YouTube video"
  loading="lazy"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; fullscreen"
  sandbox="allow-scripts allow-same-origin allow-popups"
></iframe>

<!-- ═══ SRCDOC — HTML TO'G'RIDAN-TO'G'RI ═══ -->
<!-- Alohida HTTP so'rov kerak emas -->
<iframe
  srcdoc="
    <style>
      body { font-family: Arial; padding: 20px; background: #f0f9ff; }
      h2 { color: #1e40af; }
    </style>
    <h2>Salom!</h2>
    <p>Bu kontent to'g'ridan-to'g'ri HTML da berilgan.</p>
  "
  width="400"
  height="200"
  title="Inline kontent"
  sandbox=""
></iframe>

<!-- ═══ SANDBOX DARAJALARI ═══ -->

<!-- 1. Eng qattiq — hech narsaga ruxsat yo'q -->
<iframe src="..." sandbox="" title="Bloklangan"></iframe>

<!-- 2. Faqat scriptlar -->
<iframe src="..." sandbox="allow-scripts" title="Faqat JS"></iframe>

<!-- 3. Script + form -->
<iframe src="..." sandbox="allow-scripts allow-forms" title="JS va formlar"></iframe>

<!-- 4. To'liq (lekin ehtiyot bo'ling!) -->
<iframe src="..."
  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
  title="Ko'p ruxsat"
></iframe>`,
    },
    {
      title: 'postMessage — xavfsiz muloqot',
      language: 'html',
      description: 'Parent va iframe orasida origin tekshirish bilan xavfsiz xabar almashish',
      code: `<!-- ═══════════════════════════════════ -->
<!--  PARENT SAHIFA (parent.html)       -->
<!-- ═══════════════════════════════════ -->

<!DOCTYPE html>
<html lang="uz">
<head><title>Parent sahifa</title></head>
<body>
  <h1>Parent sahifa</h1>
  <button id="sendBtn">iframe ga xabar yuborish</button>
  <div id="response"></div>

  <iframe
    id="myFrame"
    src="https://child.example.com/frame.html"
    width="500"
    height="300"
    title="Bola sahifa"
    sandbox="allow-scripts allow-same-origin"
  ></iframe>

  <script>
    const iframe = document.getElementById('myFrame')
    const responseDiv = document.getElementById('response')

    // ═══ XABAR YUBORISH (parent → iframe) ═══
    document.getElementById('sendBtn').addEventListener('click', () => {
      // Aniq origin bering — '*' ishlatmang!
      iframe.contentWindow.postMessage(
        { type: 'GREETING', text: 'Salom, iframe!' },
        'https://child.example.com' // faqat shu origin ga
      )
    })

    // ═══ XABAR QABUL QILISH (iframe → parent) ═══
    window.addEventListener('message', (event) => {
      // 1. MAJBURIY: origin tekshirish
      if (event.origin !== 'https://child.example.com') {
        console.warn('Noma\'lum origin:', event.origin)
        return
      }

      // 2. Ma'lumot turini tekshirish
      if (event.data?.type === 'RESPONSE') {
        responseDiv.textContent = 'iframe javobi: ' + event.data.text
      }
    })
  </script>
</body>
</html>


<!-- ═══════════════════════════════════ -->
<!--  IFRAME SAHIFA (frame.html)        -->
<!-- ═══════════════════════════════════ -->

<!DOCTYPE html>
<html lang="uz">
<head><title>iframe sahifa</title></head>
<body>
  <h2>iframe ichidagi sahifa</h2>
  <div id="message"></div>

  <script>
    // ═══ XABAR QABUL QILISH (parent → iframe) ═══
    window.addEventListener('message', (event) => {
      // Origin tekshirish — faqat ishonchli parent
      if (event.origin !== 'https://parent.example.com') {
        console.warn('Ishonchsiz origin:', event.origin)
        return
      }

      if (event.data?.type === 'GREETING') {
        document.getElementById('message').textContent =
          'Parent dan xabar: ' + event.data.text

        // ═══ JAVOB YUBORISH (iframe → parent) ═══
        window.parent.postMessage(
          { type: 'RESPONSE', text: 'Rahmat, parent! Men tayyorman.' },
          'https://parent.example.com'
        )
      }
    })
  </script>
</body>
</html>`,
    },
    {
      title: 'Clickjacking himoyasi va sandbox kombinatsiyalari',
      language: 'html',
      description: 'X-Frame-Options, CSP frame-ancestors, xavfsiz sandbox',
      code: `<!-- ═══════════════════════════════════ -->
<!--  SERVER HEADERLARI (himoya)        -->
<!-- ═══════════════════════════════════ -->

<!--
  Saytingizni iframe ga joylashtirilishidan himoya:

  1) X-Frame-Options (eski usul, lekin keng qo'llaniladi):
     X-Frame-Options: DENY           — hech qayerda iframe qilib bo'lmaydi
     X-Frame-Options: SAMEORIGIN     — faqat o'z domenida ruxsat

  2) CSP frame-ancestors (yangi, kuchliroq):
     Content-Security-Policy: frame-ancestors 'none'
     Content-Security-Policy: frame-ancestors 'self'
     Content-Security-Policy: frame-ancestors 'self' https://trusted.com

  Express.js misol:
-->

<!--
  // Node.js/Express da headerlar o'rnatish
  app.use((req, res, next) => {
    // Eski brauzerlar uchun
    res.setHeader('X-Frame-Options', 'DENY')

    // Zamonaviy brauzerlar uchun
    res.setHeader(
      'Content-Security-Policy',
      "frame-ancestors 'none'"
    )

    next()
  })
-->

<!-- ═══════════════════════════════════ -->
<!--  JAVASCRIPT BILAN HIMOYA           -->
<!-- ═══════════════════════════════════ -->

<script>
  // Framebusting — sayt iframe ichida ochilganini aniqlash
  if (window.top !== window.self) {
    // Sayt iframe ichida — chiqarib yuborish
    window.top.location = window.self.location
  }
</script>

<!-- ═══════════════════════════════════ -->
<!--  XAVFSIZ SANDBOX KOMBINATSIYALARI  -->
<!-- ═══════════════════════════════════ -->

<!-- Foydalanuvchi UGC ko'rsatish (eng xavfsiz) -->
<!-- Hech narsa ruxsat yo'q — faqat statik HTML ko'rinadi -->
<iframe
  srcdoc="<p style='color: green;'>Foydalanuvchi yozgan xabar</p>"
  sandbox=""
  width="400" height="100"
  title="Foydalanuvchi xabari"
></iframe>

<!-- Widget/calculator — script kerak, lekin navigatsiya yo'q -->
<iframe
  src="https://widget.example.com/calc"
  sandbox="allow-scripts"
  width="400" height="300"
  title="Kalkulyator"
></iframe>

<!-- To'lov tizimi — script + form + popup kerak -->
<iframe
  src="https://payment.example.com/checkout"
  sandbox="allow-scripts allow-forms allow-popups allow-same-origin"
  allow="payment"
  width="500" height="400"
  title="To'lov sahifasi"
></iframe>

<!-- ═══════════════════════════════════ -->
<!--  SRCDOC — XAVFSIZ RENDER           -->
<!-- ═══════════════════════════════════ -->

<script>
  // Foydalanuvchi kiritgan HTML ni xavfsiz ko'rsatish
  function renderUserContent(htmlContent) {
    const iframe = document.createElement('iframe')
    iframe.setAttribute('sandbox', '') // hammasi bloklangan
    iframe.setAttribute('title', 'Foydalanuvchi kontenti')
    iframe.style.width = '100%'
    iframe.style.height = '300px'
    iframe.style.border = '1px solid #e5e7eb'

    // srcdoc orqali — alohida so'rov yo'q
    // sandbox="" tufayli script ishlamaydi
    iframe.srcdoc = htmlContent

    document.getElementById('preview').appendChild(iframe)
  }

  // Xavfsiz — script bloklanadi
  renderUserContent(\`
    <h2>Foydalanuvchi posti</h2>
    <p>Bu oddiy matn.</p>
    <script>alert('XSS!')<\/script>
    <!-- Yuqoridagi script ISHLAMAYDI (sandbox tufayli) -->
  \`)
</script>

<div id="preview"></div>`,
    },
  ],

  interviewQA: [
    {
      question: 'iframe sandbox atributi nima va qanday ishlaydi?',
      answer: 'sandbox — iframe ichidagi kontentga qo\'shimcha xavfsizlik cheklovlari qo\'yadi. sandbox="" (bo\'sh qiymat) hammani bloklaydi: scriptlar, formlar, popup, navigatsiya. Keyin kerakli ruxsatlarni qo\'shiladi: allow-scripts (JS), allow-forms (form yuborish), allow-same-origin (same-origin sifatida ko\'rish), allow-popups (popup), allow-top-navigation (parent navigatsiya). MUHIM: allow-scripts + allow-same-origin birga xavfli — iframe parent DOM ga kira oladi. Foydalanuvchi kontenti (UGC) uchun sandbox="" eng xavfsiz variant.',
    },
    {
      question: 'postMessage qanday ishlaydi? Xavfsizlik qoidalari qanday?',
      answer: 'postMessage — cross-origin iframe va parent orasida xavfsiz muloqot API. Yuborish: targetWindow.postMessage(data, targetOrigin). Qabul qilish: window.addEventListener("message", callback). Xavfsizlik qoidalari: 1) targetOrigin ni aniq bering — "*" ishlatmang, chunki har kim xabarni o\'qiy oladi. 2) event.origin ni DOIMO tekshiring — faqat ishonchli manbadan xabar qabul qiling. 3) event.data ni validatsiya qiling — kutilgan format va qiymatlarni tekshiring. 4) Maxfiy ma\'lumot (token, parol) yubormaslik tavsiya etiladi.',
    },
    {
      question: 'Clickjacking nima va qanday himoyalanish mumkin?',
      answer: 'Clickjacking — hujumchi sizning saytingizni shaffof (opacity: 0) iframe ichiga joylashtiradi va foydalanuvchini aldab sizning saytingizdagi tugmalarni bosishga majbur qiladi. Himoya usullari: 1) X-Frame-Options header: DENY (hech qayerda) yoki SAMEORIGIN (faqat o\'z domeni). 2) CSP frame-ancestors (yangi, kuchliroq): frame-ancestors \'none\' yoki frame-ancestors \'self\' https://trusted.com. 3) JavaScript framebusting: if (window.top !== window.self) window.top.location = window.self.location. Eng yaxshi: CSP frame-ancestors + X-Frame-Options birga ishlatish (eski brauzerlar uchun).',
    },
    {
      question: 'iframe ning performance muammolari va yechimlari qanday?',
      answer: 'iframe har biri alohida browsing context — alohida DOM, JS environment, memory, network so\'rovlar. Muammolar: 1) Har bir iframe qo\'shimcha memory sarflaydi. 2) Alohida network so\'rovlar (HTML, CSS, JS yuklash). 3) Parent sahifa yuklash vaqtini oshiradi. 4) Mobile da ayniqsa og\'ir. Yechimlar: 1) loading="lazy" — faqat viewport yaqinida yuklash. 2) srcdoc — oddiy kontent uchun alohida so\'rov kerak emas. 3) Lazy render — iframe ni faqat kerak bo\'lganda yaratish. 4) Iloji boricha kam iframe ishlatish. 5) IntersectionObserver bilan src ni dinamik o\'rnatish.',
    },
  ],

  relatedTopics: [
    { techId: 'html', sectionId: 'html-advanced', topicId: 'canvas', label: 'Canvas API' },
    { techId: 'html', sectionId: 'html-advanced', topicId: 'web-components', label: 'Web Components' },
  ],
}
