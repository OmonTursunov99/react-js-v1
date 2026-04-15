import type { Topic } from '../../../types'

export const svgBasics: Topic = {
  id: 'svg-basics',
  title: 'SVG Asoslari',
  importance: 2,
  status: 'to-learn',
  description: 'Inline SVG, viewBox, asosiy shakllar, SVG vs Canvas',
  content: `SVG (Scalable Vector Graphics) — vektor grafika formati. Rasmlar piksellar emas, matematik formulalar (nuqtalar, chiziqlar, egri chiziqlar) bilan tasvirlanadi. Shuning uchun har qanday o'lchamda sifat yo'qolmaydi.

═══════════════════════════════════════
  SVG VS CANVAS
═══════════════════════════════════════

  Xususiyat        │ SVG                │ Canvas
  ─────────────────┼────────────────────┼──────────────────
  Grafika turi     │ Vektor             │ Raster (piksel)
  DOM              │ Har element DOM da │ Bitta <canvas> element
  Masshtablash     │ Sifat yo'qolmaydi  │ Piksellanadi
  Interaktivlik    │ Oson (event/CSS)   │ Qiyin (manual hit-test)
  Katta grafik     │ Ko'p DOM = sekin   │ Tez (piksel darajasi)
  Accessibility    │ DOM orqali mumkin  │ Qiyin
  Qo'llanilishi   │ Ikonkalar, logolar │ O'yinlar, grafik editor

═══════════════════════════════════════
  SVG QO'SHISH USULLARI
═══════════════════════════════════════

1. Inline SVG — to'g'ridan-to'g'ri HTML ichida
   <svg width="100" height="100">...</svg>
   Afzallik: CSS styling, JS manipulation, accessibility

2. <img> tegi bilan
   <img src="icon.svg" alt="Icon" />
   Cheklov: CSS/JS bilan ichki elementlarga kirish mumkin emas

3. CSS background-image
   background-image: url('icon.svg')
   Cheklov: ilovadan boshqarib bo'lmaydi

4. <object> tegi
   <object data="icon.svg" type="image/svg+xml"></object>
   Afzallik: alohida fayl, lekin DOM ga kirish mumkin

TAVSIYA: Interaktiv SVG uchun inline, dekorativ uchun img/bg.

═══════════════════════════════════════
  VIEWBOX ATRIBUTI
═══════════════════════════════════════

viewBox="min-x min-y width height" — ichki koordinata tizimi.

  <svg width="200" height="200" viewBox="0 0 100 100">

Bu degani:
  - SVG ekranda 200x200 piksel
  - Lekin ichki koordinata tizimi 0,0 dan 100,100 gacha
  - Barcha shakllar shu koordinatada chiziladi
  - SVG avtomatik masshtablanadi

viewBox yo'q bo'lsa — width/height piksel sifatida ishlatiladi.
viewBox bilan — responsive SVG yaratish mumkin.

preserveAspectRatio — masshtablash xulqi:
  "xMidYMid meet"  — proporsiya saqlash (default)
  "none"           — cho'zish (proporsiya buziladi)

═══════════════════════════════════════
  ASOSIY SHAKLLAR
═══════════════════════════════════════

<rect>     — to'rtburchak (x, y, width, height, rx, ry)
<circle>   — doira (cx, cy, r)
<ellipse>  — ellips (cx, cy, rx, ry)
<line>     — chiziq (x1, y1, x2, y2)
<polyline> — ochiq ko'pburchak (points="x1,y1 x2,y2 ...")
<polygon>  — yopiq ko'pburchak (points, oxirgi nuqta birinchiga ulanadi)
<path>     — murakkab shakllar (eng kuchli element)

═══════════════════════════════════════
  PATH ELEMENTI
═══════════════════════════════════════

<path d="..."> — d atributidagi buyruqlar:

  M x y    — Move to (qalam ko'chirish)
  L x y    — Line to (to'g'ri chiziq)
  H x      — Horizontal line
  V y      — Vertical line
  C x1 y1 x2 y2 x y — Cubic Bezier (egri chiziq)
  Q x1 y1 x y       — Quadratic Bezier
  A rx ry ... x y    — Arc (yoy)
  Z        — Close path (yo'lni yopish)

Katta harf = absolyut koordinata, kichik harf = nisbiy.

═══════════════════════════════════════
  SVG + CSS STYLING
═══════════════════════════════════════

Inline SVG elementlarini CSS bilan stillashtirish mumkin:

  fill           — to'ldirish rangi
  stroke         — chiziq rangi
  stroke-width   — chiziq qalinligi
  opacity        — shaffoflik
  fill-opacity   — to'ldirish shaffofligi
  stroke-dasharray — punktir chiziq

CSS transitions va animations ham ishlaydi:
  svg circle:hover { fill: red; transition: fill 0.3s; }

@keyframes bilan murakkab SVG animatsiyalar yaratish mumkin.

═══════════════════════════════════════
  SVG + JAVASCRIPT
═══════════════════════════════════════

Inline SVG elementlariga:
  - Event listeners qo'shish mumkin (click, hover, drag)
  - Atributlarni dinamik o'zgartirish mumkin
  - Yangi elementlarni yaratish: document.createElementNS()

MUHIM: SVG namespace kerak:
  document.createElementNS('http://www.w3.org/2000/svg', 'circle')
  (createElement emas!)

═══════════════════════════════════════
  SVG ACCESSIBILITY
═══════════════════════════════════════

SVG ni screen reader uchun tushunarli qilish:

  <svg role="img" aria-label="Qidiruv ikonkasi">
    <title>Qidiruv</title>
    <desc>Kattalashtiruvchi oyna shaklidagi ikonka</desc>
    ...
  </svg>

  - role="img" — bu rasm ekanini bildiradi
  - aria-label — qisqa tavsif
  - <title> — birinchi bola element sifatida
  - <desc> — batafsil tavsif (ixtiyoriy)

Dekorativ SVG uchun: aria-hidden="true"

═══════════════════════════════════════
  SVG SPRITE — SYMBOL + USE
═══════════════════════════════════════

Ko'p ikonkalarni bitta SVG faylda saqlash:

  <svg style="display:none">
    <symbol id="icon-home" viewBox="0 0 24 24">...</symbol>
    <symbol id="icon-search" viewBox="0 0 24 24">...</symbol>
  </svg>

Keyin istalgan joyda ishlatish:
  <svg><use href="#icon-home" /></svg>

Afzalliklari:
  - Bitta HTTP so'rov
  - Ikonkalar qayta ishlatiladi
  - CSS bilan ranglash mumkin (fill: currentColor)

═══════════════════════════════════════
  SVG OPTIMIZATSIYA
═══════════════════════════════════════

SVG fayllar gereksiz metadata, editor ma'lumotlari, keraksiz atributlar saqlaydi.

Vositalar:
  - SVGO — SVG optimizatsiya tool (npm paketi)
  - SVGOMG — onlayn versiya (jakearchibald.github.io/svgomg/)

SVGO nima qiladi:
  - Gereksiz metadatani olib tashlaydi
  - Koordinatalarni qisqartiradi
  - Bo'sh guruhlarni olib tashlaydi
  - Stillarni optimallashtiradi
  - O'rtacha 20-60% fayl hajmi kamayadi`.trim(),

  codeExamples: [
    {
      title: 'Asosiy SVG shakllar',
      language: 'html',
      description: 'rect, circle, path va viewBox ishlatilishi',
      code: `<!-- viewBox: ichki koordinata 0,0 dan 200,200 gacha -->
<svg width="400" height="300" viewBox="0 0 200 150"
     xmlns="http://www.w3.org/2000/svg"
     role="img" aria-label="SVG shakllar namoyishi">
  <title>SVG asosiy shakllar</title>

  <!-- To'rtburchak (yumaloq burchakli) -->
  <rect x="10" y="10" width="60" height="40"
        rx="8" ry="8"
        fill="#3b82f6" stroke="#1d4ed8" stroke-width="2" />

  <!-- Doira -->
  <circle cx="130" cy="30" r="25"
          fill="#10b981" opacity="0.8" />

  <!-- Ellips -->
  <ellipse cx="50" cy="100" rx="35" ry="20"
           fill="#f59e0b" stroke="#d97706" stroke-width="1.5" />

  <!-- Chiziq -->
  <line x1="100" y1="70" x2="190" y2="70"
        stroke="#ef4444" stroke-width="2"
        stroke-dasharray="5,3" />

  <!-- Path — uchburchak -->
  <path d="M 130 90 L 170 140 L 90 140 Z"
        fill="none" stroke="#8b5cf6" stroke-width="2" />

  <!-- Path — egri chiziq (Bezier) -->
  <path d="M 10 140 C 40 80, 80 80, 100 140"
        fill="none" stroke="#ec4899" stroke-width="2" />
</svg>`,
    },
    {
      title: 'SVG + CSS animatsiya va hover',
      language: 'html',
      description: 'Gradient, transition, keyframe animatsiya',
      code: `<style>
  /* SVG elementlariga CSS transition */
  .icon-circle {
    fill: #3b82f6;
    transition: fill 0.3s ease, r 0.3s ease;
    cursor: pointer;
  }
  .icon-circle:hover {
    fill: #ef4444;
    /* r atributini CSS bilan o'zgartirish */
    r: 45;
  }

  /* Keyframe animatsiya — aylanuvchi chiziq */
  .spinner {
    animation: spin 2s linear infinite;
    transform-origin: center;
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }

  /* stroke-dashoffset animatsiya — chiziq "chizilishi" */
  .draw-line {
    stroke-dasharray: 200;
    stroke-dashoffset: 200;
    animation: draw 2s ease forwards;
  }
  @keyframes draw {
    to { stroke-dashoffset: 0; }
  }
</style>

<svg width="300" height="200" viewBox="0 0 300 200">
  <!-- Gradient ta'rifi -->
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3b82f6" />
      <stop offset="100%" stop-color="#8b5cf6" />
    </linearGradient>

    <radialGradient id="grad2" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#fbbf24" />
      <stop offset="100%" stop-color="#f59e0b" stop-opacity="0.3" />
    </radialGradient>
  </defs>

  <!-- Gradient to'rtburchak -->
  <rect x="10" y="10" width="120" height="80" rx="10"
        fill="url(#grad1)" />

  <!-- Hover effektli doira -->
  <circle class="icon-circle" cx="220" cy="50" r="35" />

  <!-- Aylanuvchi chiziq -->
  <g class="spinner">
    <circle cx="70" cy="150" r="20"
            fill="none" stroke="#10b981" stroke-width="3"
            stroke-dasharray="40 80" />
  </g>

  <!-- "Chiziluvchi" path -->
  <path class="draw-line"
        d="M 130 120 C 160 100, 200 180, 280 130"
        fill="none" stroke="#ef4444" stroke-width="2" />
</svg>`,
    },
    {
      title: 'SVG sprite va JavaScript bilan dinamik SVG',
      language: 'html',
      description: 'Symbol + use pattern va JS bilan SVG yaratish',
      code: `<!-- ═══ SVG SPRITE (odatda sahifa boshida yashirin) ═══ -->
<svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
  <!-- Uy ikonkasi -->
  <symbol id="icon-home" viewBox="0 0 24 24">
    <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1"
          fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round" />
  </symbol>

  <!-- Qidiruv ikonkasi -->
  <symbol id="icon-search" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8"
            fill="none" stroke="currentColor" stroke-width="2" />
    <line x1="21" y1="21" x2="16.65" y2="16.65"
          stroke="currentColor" stroke-width="2"
          stroke-linecap="round" />
  </symbol>
</svg>

<!-- ═══ SPRITE DAN FOYDALANISH ═══ -->
<nav>
  <!-- currentColor orqali rang meros oladi -->
  <a href="/" style="color: #3b82f6;">
    <svg width="24" height="24"><use href="#icon-home" /></svg>
    Bosh sahifa
  </a>
  <a href="/search" style="color: #10b981;">
    <svg width="24" height="24"><use href="#icon-search" /></svg>
    Qidiruv
  </a>
</nav>

<!-- ═══ JAVASCRIPT BILAN DINAMIK SVG ═══ -->
<div id="chart"></div>

<script>
  // SVG namespace — majburiy!
  const NS = 'http://www.w3.org/2000/svg'

  // SVG element yaratish
  const svg = document.createElementNS(NS, 'svg')
  svg.setAttribute('width', '300')
  svg.setAttribute('height', '200')
  svg.setAttribute('viewBox', '0 0 300 200')

  // Ma'lumotlar asosida ustunli diagramma
  const data = [
    { label: 'React', value: 85, color: '#61dafb' },
    { label: 'Vue',   value: 70, color: '#42b883' },
    { label: 'Svelte', value: 45, color: '#ff3e00' },
  ]

  const barWidth = 60
  const gap = 30
  const maxHeight = 150

  data.forEach((item, i) => {
    const barHeight = (item.value / 100) * maxHeight
    const x = gap + i * (barWidth + gap)
    const y = maxHeight - barHeight + 20

    // Ustun (rect)
    const rect = document.createElementNS(NS, 'rect')
    rect.setAttribute('x', x)
    rect.setAttribute('y', y)
    rect.setAttribute('width', barWidth)
    rect.setAttribute('height', barHeight)
    rect.setAttribute('fill', item.color)
    rect.setAttribute('rx', '4')

    // Hover event
    rect.addEventListener('mouseenter', () => {
      rect.setAttribute('opacity', '0.7')
    })
    rect.addEventListener('mouseleave', () => {
      rect.setAttribute('opacity', '1')
    })

    // Label (matn)
    const text = document.createElementNS(NS, 'text')
    text.setAttribute('x', x + barWidth / 2)
    text.setAttribute('y', maxHeight + 40)
    text.setAttribute('text-anchor', 'middle')
    text.setAttribute('font-size', '12')
    text.textContent = item.label

    svg.appendChild(rect)
    svg.appendChild(text)
  })

  document.getElementById('chart').appendChild(svg)
</script>`,
    },
  ],

  interviewQA: [
    {
      question: 'SVG va Canvas farqi nima? Qachon qaysi birini ishlatish kerak?',
      answer: 'SVG — vektor grafika, har bir element DOM da alohida node, CSS va event listener bilan ishlaydi, har qanday masshtabda sifat saqlanadi. Canvas — raster (piksel) grafika, bitta <canvas> element, JavaScript bilan piksel darajasida chiziladi. SVG ishlatish kerak: ikonkalar, logolar, diagrammalar, interaktiv grafik, kam elementli infografika. Canvas ishlatish kerak: o\'yinlar, rasm tahrirlash, real-time vizualizatsiya, ko\'p piksel bilan ishlash. Qoida: interaktivlik + accessibility kerak = SVG, tezlik + ko\'p piksel = Canvas.',
    },
    {
      question: 'viewBox atributi nima va qanday ishlaydi?',
      answer: 'viewBox="min-x min-y width height" — SVG ichki koordinata tizimini belgilaydi. Masalan, viewBox="0 0 100 100" deganda SVG ning ichki maydoni 100x100 birlik, lekin tashqi o\'lchami (width/height atributi) boshqacha bo\'lishi mumkin. Bu responsive SVG yaratish imkonini beradi — SVG konteyner o\'lchamiga moslashadi. preserveAspectRatio atributi masshtablash xulqini boshqaradi: "xMidYMid meet" (default) proporsiyani saqlaydi, "none" esa cho\'zadi.',
    },
    {
      question: 'SVG ni qanday optimize qilish mumkin?',
      answer: 'SVG optimizatsiya usullari: 1) SVGO tool — gereksiz metadata, editor ma\'lumotlari, bo\'sh guruhlar, keraksiz atributlarni olib tashlaydi (20-60% hajm kamayadi). 2) Koordinatalarni qisqartirish — kasrlarni kamaytirish. 3) SVG sprite — ko\'p ikonkalarni bitta faylda symbol + use bilan saqlash (kamroq HTTP so\'rov). 4) Oddiy shakllarni path o\'rniga rect, circle bilan ifodalash. 5) Inline SVG faqat kerak joyda, qolganlari img yoki background-image orqali. 6) Gzip/Brotli kompressiya server tomondan.',
    },
    {
      question: 'Inline SVG ning afzalliklari nima?',
      answer: 'Inline SVG afzalliklari: 1) CSS bilan to\'liq stillashtirish — fill, stroke, animatsiya, hover, transition. 2) JavaScript bilan manipulyatsiya — event listener, atribut o\'zgartirish, dinamik yaratish. 3) Accessibility — role, aria-label, title, desc elementlari qo\'shish mumkin. 4) Qo\'shimcha HTTP so\'rov yo\'q — HTML bilan birga keladi. 5) currentColor bilan ota elementdan rang meros oladi. Kamchiliklari: HTML hajmini oshiradi, brauzer keshlamaydi (alohida fayl bo\'lganda keshlaydi), murakkab SVG lar kodni o\'qishni qiyinlashtiradi.',
    },
  ],

  relatedTopics: [
    { techId: 'html', sectionId: 'html-advanced', topicId: 'canvas', label: 'Canvas API' },
    { techId: 'html', sectionId: 'html-advanced', topicId: 'drag-drop', label: 'Drag and Drop API' },
  ],
}
