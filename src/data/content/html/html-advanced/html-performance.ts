import type { Topic } from '../../../types'

export const htmlPerformance: Topic = {
  id: 'html-performance',
  title: 'HTML Performance',
  importance: 3,
  status: 'to-learn',
  description: 'defer/async, preload/prefetch, lazy loading, critical rendering path',
  content: `HTML darajasida performance optimallashtirish — sahifa tezligining asosi. CSS va JS qanday yuklanishi, resurslar qachon so'ralishi, rasmlar qanday ko'rsatilishi — barchasi HTML atributlari bilan boshqariladi.

═══════════════════════════════════════
  CRITICAL RENDERING PATH
═══════════════════════════════════════

Brauzer sahifani ko'rsatish bosqichlari:

  HTML → DOM (Document Object Model)
  CSS  → CSSOM (CSS Object Model)
  DOM + CSSOM → Render Tree
  Render Tree → Layout (elementlar joylashuvi)
  Layout → Paint (piksellar chizish)
  Paint → Composite (qatlamlarni birlashtirish)

Maqsad: bu zanjirni iloji boricha TEZROQ bajarish.
Blokirovchi resurslar (CSS, JS) bu jarayonni sekinlashtiradi.

═══════════════════════════════════════
  SCRIPT LOADING STRATEGIYALARI
═══════════════════════════════════════

1. Normal script (hech narxsiz):
   <script src="app.js"></script>
   - HTML parsing TO'XTAYDI
   - Script yuklanadi va bajariladi
   - Keyin parsing davom etadi
   → PARSER-BLOCKING — eng sekin usul

2. defer:
   <script defer src="app.js"></script>
   - HTML parsing DAVOM ETADI
   - Script parallel yuklanadi
   - DOMContentLoaded DAN OLDIN bajariladi
   - Tartib SAQLANADI (1.js → 2.js → 3.js)
   → Ko'p hollarda ENG YAXSHI tanlov

3. async:
   <script async src="app.js"></script>
   - HTML parsing DAVOM ETADI
   - Script parallel yuklanadi
   - Yuklanishi BILANOQ bajariladi (parsing to'xtaydi)
   - Tartib YO'Q — qaysi biri oldin yuklansa, o'sha bajariladi
   → Analytics, reklama kabi mustaqil scriptlar uchun

4. type="module":
   <script type="module" src="app.js"></script>
   - Default defer xatti-harakati
   - async qo'shish mumkin
   - CORS kerak (cross-origin)

Taqqoslash:
  ┌──────────┬───────────┬──────────┬───────────┐
  │          │ Parsing   │ Tartib   │ Bajarish  │
  ├──────────┼───────────┼──────────┼───────────┤
  │ normal   │ to'xtaydi │ ha       │ darhol    │
  │ defer    │ davom     │ ha       │ DOM tayyor│
  │ async    │ davom     │ yo'q     │ yuklangach│
  │ module   │ davom     │ ha       │ DOM tayyor│
  └──────────┴───────────┴──────────┴───────────┘

═══════════════════════════════════════
  RESOURCE HINTS
═══════════════════════════════════════

Brauzerga resurslarni OLDINDAN tayyorlash haqida ko'rsatma berish:

1. preload — joriy sahifa uchun MUHIM resurs
   <link rel="preload" href="font.woff2" as="font" crossorigin>
   - Yuqori prioritet bilan darhol yuklanadi
   - Font, muhim CSS, LCP rasm uchun

2. prefetch — KEYINGI sahifa uchun resurs
   <link rel="prefetch" href="next-page.js">
   - Past prioritet — brauzer bo'sh vaqtida yuklaydi
   - Foydalanuvchi keyingi sahifaga o'tganda tayyor

3. preconnect — serverga OLDINDAN ulanish
   <link rel="preconnect" href="https://api.example.com">
   - DNS + TCP + TLS handshake oldindan
   - API, CDN, font serverlari uchun

4. dns-prefetch — faqat DNS so'rovi
   <link rel="dns-prefetch" href="https://cdn.example.com">
   - preconnect dan yengilroq
   - Ko'p domenlar uchun

5. modulepreload — ES module oldindan yuklash
   <link rel="modulepreload" href="./utils.js">
   - Module grafini oldindan parse va compile qiladi

6. Speculation Rules API (yangi) — sahifani oldindan render
   <script type="speculationrules">
   { "prerender": [{ "urls": ["/next-page"] }] }
   </script>
   - Butun sahifani oldindan render qiladi
   - Instant navigation — 0 ms kutish

═══════════════════════════════════════
  LAZY LOADING
═══════════════════════════════════════

loading atributi — rasm va iframe uchun:

  loading="lazy"  — viewport ga yaqinlashganda yuklaydi
  loading="eager" — darhol yuklaydi (default)

Muhim: above the fold (sahifa yuqori qismi) rasmlarga loading="lazy" QOYMASLIK kerak — ular darhol ko'rinishi kerak.

fetchpriority — yuklash prioritetini boshqarish:
  fetchpriority="high" — LCP rasm uchun (eng muhim rasm)
  fetchpriority="low"  — muhim bo'lmagan rasmlar
  fetchpriority="auto" — brauzer o'zi hal qiladi (default)

═══════════════════════════════════════
  IMAGE OPTIMIZATION IN HTML
═══════════════════════════════════════

1. srcset va sizes — responsive images:
   Brauzerga turli o'lchamdagi rasmlar taklif qilish.
   Brauzer ekran o'lcham va piksel zichligiga qarab tanlaydi.

2. picture + source — format tanlash:
   Zamonaviy format (avif, webp) bilan fallback (jpg/png).
   Brauzer qo'llab-quvvatlaydigan birinchi formatni tanlaydi.

3. width va height atributlari:
   DOIM ko'rsatish kerak — layout shift (CLS) oldini oladi.
   Brauzer rasm yuklanmasdan oldin joy ajratadi.

4. decoding="async":
   Rasm dekodlashni main thread dan ajratadi.
   Katta rasmlar uchun UI blokirovkasini kamaytiradi.

═══════════════════════════════════════
  DOMContentLoaded VS LOAD
═══════════════════════════════════════

DOMContentLoaded — HTML to'liq parse bo'lganda (DOM tayyor).
  Rasmlar, stillar hali yuklanmagan bo'lishi mumkin.

load — BARCHA resurslar yuklanganda (rasmlar, CSS, iframe).
  Sahifa to'liq tayyor.

document.readyState:
  "loading"     — HTML hali parse bo'lmoqda
  "interactive" — DOM tayyor (≈ DOMContentLoaded)
  "complete"    — hammasi yuklandi (≈ load)`.trim(),

  codeExamples: [
    {
      title: 'Script loading: normal vs defer vs async',
      language: 'html',
      description: 'Turli script yuklash usullari va ularning tartib/timing farqlari',
      code: `<!DOCTYPE html>
<html>
<head>
  <!--
    1. NORMAL — parsing to'xtaydi, script bajariladi, keyin davom etadi
    Muammo: sahifa ko'rinishi kechikadi
  -->
  <script src="blocking.js"></script>

  <!--
    2. DEFER — parallel yuklanadi, DOM tayyor bo'lganda bajariladi
    Tartib saqlanadi: analytics.js → app.js → init.js
  -->
  <script defer src="analytics.js"></script>
  <script defer src="app.js"></script>
  <script defer src="init.js"></script>

  <!--
    3. ASYNC — parallel yuklanadi, yuklanishi bilanoq bajariladi
    Tartib KAFOLATLANMAYDI — mustaqil scriptlar uchun
  -->
  <script async src="google-analytics.js"></script>
  <script async src="hotjar.js"></script>

  <!--
    4. MODULE — default defer, ES import/export ishlaydi
  -->
  <script type="module" src="main.js"></script>
</head>
<body>
  <h1>Sahifa kontenti</h1>

  <!-- Inline script — DOMContentLoaded va load farqi -->
  <script>
    // DOM tayyor — rasmlar hali yuklanmagan bo'lishi mumkin
    document.addEventListener('DOMContentLoaded', () => {
      console.log('DOM tayyor:', document.readyState) // "interactive"
    })

    // Hammasi yuklandi — rasmlar, CSS, iframe
    window.addEventListener('load', () => {
      console.log('Hammasi yuklandi:', document.readyState) // "complete"
    })

    // readyState o'zgarishini kuzatish
    document.addEventListener('readystatechange', () => {
      console.log('readyState:', document.readyState)
      // "loading" → "interactive" → "complete"
    })
  </script>
</body>
</html>`,
    },
    {
      title: 'Resource hints: preload, prefetch, preconnect',
      language: 'html',
      description: 'Resurslarni oldindan yuklash va ulanish strategiyalari',
      code: `<head>
  <!--
    ═══ PRECONNECT — serverga oldindan ulanish ═══
    DNS + TCP + TLS handshake oldindan bajariladi
  -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://api.example.com" crossorigin>

  <!--
    ═══ DNS-PREFETCH — faqat DNS so'rovi ═══
    Preconnect dan yengilroq, ko'p domenlar uchun
  -->
  <link rel="dns-prefetch" href="https://cdn.example.com">
  <link rel="dns-prefetch" href="https://analytics.example.com">

  <!--
    ═══ PRELOAD — joriy sahifadagi MUHIM resurslar ═══
    Yuqori prioritet — darhol yuklanadi
    "as" atributi MAJBURIY — brauzerga resurs turini aytadi
  -->
  <!-- Font — sahifada ko'rinadigan shrift -->
  <link rel="preload" href="/fonts/Inter.woff2" as="font"
        type="font/woff2" crossorigin>

  <!-- Muhim CSS — above the fold uchun -->
  <link rel="preload" href="/css/critical.css" as="style">

  <!-- LCP rasm — sahifadagi eng katta rasm -->
  <link rel="preload" href="/hero.webp" as="image"
        fetchpriority="high">

  <!-- Muhim JS moduli -->
  <link rel="modulepreload" href="/js/app.js">

  <!--
    ═══ PREFETCH — keyingi sahifa uchun resurslar ═══
    Past prioritet — brauzer bo'sh vaqtida yuklaydi
  -->
  <link rel="prefetch" href="/js/dashboard.js">
  <link rel="prefetch" href="/css/dashboard.css">
  <link rel="prefetch" href="/api/user-data.json" as="fetch">

  <!--
    ═══ SPECULATION RULES — sahifani oldindan render ═══
    Brauzer sahifani to'liq oldindan tayyorlaydi
  -->
  <script type="speculationrules">
  {
    "prerender": [
      { "urls": ["/dashboard", "/profile"] }
    ],
    "prefetch": [
      {
        "where": { "href_matches": "/products/*" },
        "eagerness": "moderate"
      }
    ]
  }
  </script>
</head>`,
    },
    {
      title: 'Image optimization: responsive, lazy, priority',
      language: 'html',
      description: 'srcset, sizes, picture, loading="lazy", fetchpriority, width/height',
      code: `<!--
  ═══ LCP RASM — sahifadagi eng muhim rasm ═══
  loading="eager" (default) — darhol yuklash
  fetchpriority="high" — brauzerga muhimligini aytish
  width/height — layout shift oldini olish (CLS = 0)
  decoding="async" — main thread ni bloklamaslik
-->
<img
  src="/hero-800.webp"
  srcset="
    /hero-400.webp   400w,
    /hero-800.webp   800w,
    /hero-1200.webp 1200w,
    /hero-1600.webp 1600w
  "
  sizes="(max-width: 768px) 100vw, 800px"
  alt="Bosh sahifa rasmi"
  width="800"
  height="450"
  fetchpriority="high"
  decoding="async"
>

<!--
  ═══ PICTURE — format tanlash (avif > webp > jpg) ═══
  Brauzer birinchi qo'llab-quvvatlaydigan formatni tanlaydi
  AVIF: eng kichik, zamonaviy brauzerlar
  WebP: kichik, ko'p brauzerlar
  JPEG: fallback, barcha brauzerlar
-->
<picture>
  <source
    type="image/avif"
    srcset="/product-400.avif 400w, /product-800.avif 800w"
    sizes="(max-width: 768px) 100vw, 50vw"
  >
  <source
    type="image/webp"
    srcset="/product-400.webp 400w, /product-800.webp 800w"
    sizes="(max-width: 768px) 100vw, 50vw"
  >
  <img
    src="/product-800.jpg"
    alt="Mahsulot rasmi"
    width="800"
    height="600"
    loading="lazy"
    decoding="async"
  >
</picture>

<!--
  ═══ LAZY LOADING — pastdagi rasmlar ═══
  Viewport ga yaqinlashganda yuklanadi
  fetchpriority="low" — muhim emas, keyin yuklansa ham bo'ladi
-->
<img
  src="/gallery-1.webp"
  alt="Galereya rasmi 1"
  width="400"
  height="300"
  loading="lazy"
  fetchpriority="low"
  decoding="async"
>

<!--
  ═══ IFRAME LAZY LOADING ═══
  Video, xarita kabi og'ir iframelarga loading="lazy"
-->
<iframe
  src="https://www.youtube.com/embed/VIDEO_ID"
  title="Video sarlavhasi"
  width="560"
  height="315"
  loading="lazy"
  allow="accelerometer; autoplay; encrypted-media"
  allowfullscreen
></iframe>`,
    },
  ],

  interviewQA: [
    {
      question: 'defer va async farqi nima? Qachon qaysi biri ishlatiladi?',
      answer: 'defer — script parallel yuklanadi, HTML parsing davom etadi, DOMContentLoaded dan OLDIN bajariladi, tartib SAQLANADI. async — parallel yuklanadi, lekin yuklanishi BILANOQ bajariladi (parsing to\'xtaydi), tartib KAFOLATLANMAYDI. defer — asosiy ilova scriptlari uchun (app.js, framework), chunki DOM tayyor bo\'lganda va to\'g\'ri tartibda bajariladi. async — mustaqil scriptlar uchun (analytics, reklama), chunki boshqa scriptlarga bog\'liq emas. type="module" default holatda defer kabi ishlaydi.',
    },
    {
      question: 'preload va prefetch farqi nima?',
      answer: 'preload — JORIY sahifa uchun muhim resurs. Yuqori prioritet bilan darhol yuklanadi. Masalan: font, critical CSS, LCP rasm. "as" atributi majburiy (font, style, image, script). prefetch — KEYINGI sahifa uchun resurs. Past prioritet — brauzer bo\'sh vaqtida yuklaydi. Foydalanuvchi keyingi sahifaga o\'tganda resurs allaqachon keshda bo\'ladi. preconnect esa resurs emas, server ulanishini (DNS+TCP+TLS) oldindan tayyorlaydi.',
    },
    {
      question: 'loading="lazy" qanday ishlaydi? Qachon ishlatmaslik kerak?',
      answer: 'loading="lazy" — rasm yoki iframe viewport ga yaqinlashganda yuklanadi (Intersection Observer asosida). Brauzer avtomatik boshqaradi — JS kerak emas. ISHLATMASLIK kerak: 1) Above the fold (sahifa yuqori qismi) rasmlar — ular darhol ko\'rinishi kerak, lazy loading kechiktiradi. 2) LCP rasm — eng muhim rasm, fetchpriority="high" bilan darhol yuklash kerak. 3) Juda kichik rasmlar — lazy loading overhead qo\'shadi. Qoida: ekranda darhol ko\'rinadigan narsaga lazy QOYMASLIK, pastdagi kontentga DOIM lazy qo\'yish.',
    },
    {
      question: 'Critical Rendering Path nima? Qanday optimize qilish mumkin?',
      answer: 'Critical Rendering Path — brauzer HTML dan pikselgacha bo\'lgan yo\'l: HTML→DOM, CSS→CSSOM, DOM+CSSOM→Render Tree→Layout→Paint→Composite. Optimizatsiya: 1) CSS ni head ga qo\'yish (render-blocking, lekin kerak). 2) JS ga defer/async qo\'yish (parser-blocking oldini olish). 3) Critical CSS ni inline qilish (above the fold uchun). 4) Font ga preload berish (FOUT/FOIT oldini olish). 5) Rasmlarni lazy loading qilish. 6) Resource hints (preconnect, prefetch). 7) HTML ni minify qilish. Maqsad — First Contentful Paint (FCP) va Largest Contentful Paint (LCP) ni kamaytirish.',
    },
  ],

  relatedTopics: [
    { techId: 'html', sectionId: 'html-advanced', topicId: 'canvas', label: 'Canvas API' },
    { techId: 'html', sectionId: 'html-advanced', topicId: 'web-components', label: 'Web Components' },
  ],
}
