import type { Topic } from '../../../types'

export const responsive: Topic = {
  id: 'responsive',
  title: 'Responsive Design',
  importance: 3,
  status: 'to-learn',
  description: 'Media queries, container queries, fluid typography, viewport units',
  content: `RESPONSIVE DESIGN — HAR QANDAY EKRANGA MOSLASHUV
══════════════════════════════════════

Responsive design — veb-sahifa turli ekran o'lchamlarida
to'g'ri ko'rinishi va ishlashi. Buning uchun media queries,
flexible layout, fluid typography va responsive images ishlatiladi.

MUHIM: Mobile-first yondashuv standart hisoblanadi — avval
kichik ekran uchun yoziladi, keyin min-width bilan kattalashtriladi.

══════════════════════════════════════
1. MEDIA QUERIES
══════════════════════════════════════

  /* MOBILE-FIRST (min-width) — TAVSIYA */
  /* Avval mobile stil, keyin kattalashtirish */
  .container { padding: 16px; }

  @media (min-width: 640px)  { /* tablet */
    .container { padding: 24px; }
  }
  @media (min-width: 1024px) { /* desktop */
    .container { padding: 32px; max-width: 1200px; }
  }

  /* DESKTOP-FIRST (max-width) — eski yondashuv */
  @media (max-width: 1023px) { /* tablet va kichik */ }
  @media (max-width: 639px)  { /* faqat mobile */ }

MUHIM: min-width va max-width ni aralashtirib ishlatmang.
Bitta strategiya tanlang — MOBILE-FIRST tavsiya etiladi.

══════════════════════════════════════
2. BREAKPOINT STRATEGIYASI
══════════════════════════════════════

Standart breakpointlar (Tailwind CSS asos):
  sm:  640px   — katta telefonlar, kichik tabletlar
  md:  768px   — tabletlar
  lg:  1024px  — kichik desktoplar
  xl:  1280px  — desktoplar
  2xl: 1536px  — katta ekranlar

CSS Variables bilan:
  :root {
    --bp-sm: 640px;
    --bp-md: 768px;
    --bp-lg: 1024px;
  }

MUHIM: Breakpointlarni qurilma emas, KONTENT asosida
tanlang. Kontent buzilgan joyda breakpoint qo'shing.

══════════════════════════════════════
3. CONTAINER QUERIES — @container
══════════════════════════════════════

Media query — VIEWPORT o'lchamiga qaraydi.
Container query — OTA ELEMENT o'lchamiga qaraydi.

  /* 1. Container belgilash */
  .card-wrapper {
    container-type: inline-size;
    container-name: card;
  }

  /* 2. Container o'lchamiga qarab stil */
  @container card (min-width: 400px) {
    .card {
      display: grid;
      grid-template-columns: 200px 1fr;
    }
  }

  @container card (max-width: 399px) {
    .card {
      display: flex;
      flex-direction: column;
    }
  }

Nima uchun muhim:
- Komponent qaerga joylashganiga qarab moslashadi
- Sidebar da 300px, main da 800px — bir xil komponent turlicha
- Component-driven design uchun ideal

Container query turlari:
  container-type: inline-size;  /* kenglik bo'yicha */
  container-type: size;         /* kenglik VA balandlik */
  container-type: normal;       /* default, query yo'q */

══════════════════════════════════════
4. FLUID TYPOGRAPHY — clamp()
══════════════════════════════════════

Matn o'lchami viewport bilan birga muammosiz o'sadi/kichrayadi:

  /* clamp(min, preferred, max) */
  h1 { font-size: clamp(1.5rem, 4vw, 3rem); }
  /* 1.5rem dan kichik bo'lmaydi */
  /* 4vw = viewport kengligining 4% */
  /* 3rem dan katta bo'lmaydi */

  p { font-size: clamp(1rem, 2.5vw, 1.25rem); }

  /* Spacing uchun ham */
  .section {
    padding: clamp(16px, 5vw, 64px);
  }

MUHIM: clamp() media querylarni KAMAYTIRADI —
ko'p hollarda breakpoint kerak bo'lmaydi.

══════════════════════════════════════
5. RESPONSIVE IMAGES
══════════════════════════════════════

  /* CSS bilan */
  img {
    max-width: 100%;    /* containerdan oshmaydi */
    height: auto;       /* proporsiya saqlanadi */
    display: block;
  }

  /* HTML srcset — brauzer tanlaydi */
  <img
    src="image-800.jpg"
    srcset="image-400.jpg 400w,
            image-800.jpg 800w,
            image-1200.jpg 1200w"
    sizes="(max-width: 640px) 100vw,
           (max-width: 1024px) 50vw,
           33vw"
    alt="..."
  />

  /* picture — format va art direction */
  <picture>
    <source media="(min-width: 1024px)"
            srcset="hero-wide.avif" type="image/avif">
    <source media="(min-width: 640px)"
            srcset="hero-medium.webp" type="image/webp">
    <img src="hero-small.jpg" alt="...">
  </picture>

══════════════════════════════════════
6. VIEWPORT UNITS
══════════════════════════════════════

Klassik:
  vw  — viewport width ning 1%
  vh  — viewport height ning 1%
  vmin — vw va vh ning kichigi
  vmax — vw va vh ning kattasi

Yangi (mobile muammolarni hal qiladi):
  dvh — dynamic viewport height (address bar hisobga oladi)
  svh — small viewport height (address bar ochiq)
  lvh — large viewport height (address bar yashirin)

  /* Mobile hero section */
  .hero {
    min-height: 100dvh;  /* address bar bilan to'g'ri */
  }

MUHIM: Mobile Safari da 100vh muammo chiqaradi — address bar
hisobga olinmaydi. 100dvh bu muammoni hal qiladi (2023+).

  /* Keyboard muammosi */
  /* 100dvh keyboard ochilganda qisqaradi */
  /* 100svh keyboard ochilganda O'ZGARMAYDI */
  .chat-input {
    position: fixed;
    bottom: 0;
    height: env(keyboard-inset-height, 0);
  }`,
  codeExamples: [
    {
      title: 'Mobile-First Responsive Layout',
      language: 'css',
      code: `/* ═══ MOBILE-FIRST BREAKPOINTS ═══ */
/* Avval MOBILE (default) */
.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  padding: 16px;
}

.sidebar { display: none; }

/* ═══ TABLET (640px+) ═══ */
@media (min-width: 640px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
    padding: 24px;
  }
}

/* ═══ DESKTOP (1024px+) ═══ */
@media (min-width: 1024px) {
  .grid {
    grid-template-columns: 260px repeat(3, 1fr);
    max-width: 1400px;
    margin: 0 auto;
  }
  .sidebar { display: block; }
}

/* ═══ KATTA EKRAN (1536px+) ═══ */
@media (min-width: 1536px) {
  .grid {
    grid-template-columns: 300px repeat(4, 1fr);
    max-width: 1800px;
  }
}`,
      description: 'Mobile-first yondashuv bilan responsive layout',
    },
    {
      title: 'Container Queries — komponent moslashuvi',
      language: 'css',
      code: `/* ═══ CONTAINER QUERY ═══ */
/* Ota elementni container deb belgilash */
.widget-wrapper {
  container-type: inline-size;
  container-name: widget;
}

/* Default: vertikal layout */
.widget {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.widget__image {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  border-radius: 8px;
}

/* Container 500px+ bo'lganda: gorizontal */
@container widget (min-width: 500px) {
  .widget {
    flex-direction: row;
    align-items: center;
  }
  .widget__image {
    width: 200px;
    aspect-ratio: 1;
  }
}

/* Container 800px+ bo'lganda: katta layout */
@container widget (min-width: 800px) {
  .widget {
    gap: 24px;
  }
  .widget__image {
    width: 300px;
  }
  .widget__title {
    font-size: 1.5rem;
  }
}`,
      description: 'Komponent viewport emas, ota element o`lchamiga moslashadi',
    },
    {
      title: 'Fluid Typography va Spacing — clamp()',
      language: 'css',
      code: `/* ═══ FLUID TYPOGRAPHY ═══ */
:root {
  /* clamp(min, preferred, max) */
  --fs-h1: clamp(2rem, 5vw + 1rem, 4rem);
  --fs-h2: clamp(1.5rem, 3vw + 0.5rem, 2.5rem);
  --fs-h3: clamp(1.25rem, 2vw + 0.5rem, 1.75rem);
  --fs-body: clamp(1rem, 1.5vw, 1.125rem);
  --fs-small: clamp(0.875rem, 1vw, 1rem);
}

h1 { font-size: var(--fs-h1); }
h2 { font-size: var(--fs-h2); }
h3 { font-size: var(--fs-h3); }
body { font-size: var(--fs-body); }

/* ═══ FLUID SPACING ═══ */
:root {
  --space-xs: clamp(4px, 1vw, 8px);
  --space-sm: clamp(8px, 2vw, 16px);
  --space-md: clamp(16px, 4vw, 32px);
  --space-lg: clamp(24px, 6vw, 64px);
  --space-xl: clamp(48px, 10vw, 120px);
}

.section {
  padding: var(--space-lg) var(--space-md);
}

.card {
  padding: var(--space-md);
  gap: var(--space-sm);
}`,
      description: 'clamp() bilan media querysiz fluid o`lchamlar',
    },
    {
      title: 'Responsive Images — srcset va picture',
      language: 'css',
      code: `/* ═══ RESPONSIVE IMAGE BASE ═══ */
img {
  max-width: 100%;
  height: auto;
  display: block;
}

/* ═══ ASPECT RATIO CONTAINER ═══ */
.image-wrapper {
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border-radius: 12px;
}

.image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* ═══ ART DIRECTION ═══ */
/* Mobile: vertikal rasm */
/* Desktop: gorizontal rasm */
.hero-image {
  width: 100%;
  aspect-ratio: 3 / 4;   /* mobile: vertikal */
  object-fit: cover;
}

@media (min-width: 768px) {
  .hero-image {
    aspect-ratio: 21 / 9;  /* desktop: keng */
  }
}

/* ═══ LAZY LOADING ═══ */
/* HTML: <img loading="lazy" decoding="async"> */
img[loading="lazy"] {
  background: #f3f4f6;
  transition: opacity 0.3s;
}`,
      description: 'Responsive image patternlari va lazy loading',
    },
    {
      title: 'Viewport Units — dvh/svh muammolari',
      language: 'css',
      code: `/* ═══ MOBILE HERO — dvh ═══ */
.hero {
  min-height: 100dvh;  /* dynamic — address bar bilan */
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Fallback eski brauzerlar uchun */
.hero {
  min-height: 100vh;
  min-height: 100dvh;
}

/* ═══ SAFE AREA (iPhone notch) ═══ */
.header {
  padding-top: env(safe-area-inset-top);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}

.bottom-nav {
  padding-bottom: env(safe-area-inset-bottom);
}

/* ═══ VIEWPORT UNITS COMPARISON ═══ */
/*
  100vh  = doimo bir xil (address bar hisobga olinmaydi)
  100dvh = address bar ochiq/yopiq — o'zgaradi
  100svh = eng kichik viewport (address bar ochiq)
  100lvh = eng katta viewport (address bar yopiq)
*/

.sticky-banner {
  height: 100svh;  /* keyboard/address bar ta'sir qilmaydi */
}`,
      description: 'dvh, svh, safe-area va mobile viewport muammolari',
    },
  ],
  interviewQA: [
    {
      question: 'Mobile-first va Desktop-first yondashuvlar qanday farqlanadi? Nima uchun mobile-first tavsiya etiladi?',
      answer: `Mobile-first: default stillar mobile uchun yoziladi, keyin min-width media querylar bilan kattaroq ekranlarga moslashtiriladi.

Desktop-first: default stillar desktop uchun, keyin max-width bilan kichraytiriladi.

Mobile-first nima uchun yaxshi:
1. Performance — mobile qurilmalar kamroq CSS parse qiladi (faqat zarur stillar).
2. Progressive enhancement — avval minimal, keyin kengaytirish.
3. Sodda kod — oddiydan murakkabga o'tish osonroq.
4. Kontent fokus — mobile da faqat muhim kontent ko'rinadi.
5. Standart — Tailwind, Bootstrap 5+ default mobile-first.

Kamchilik: desktop UI murakkab bo'lsa, ko'p media query kerak bo'ladi. Lekin bu kamchilik responsive design ning tabiiy narxi.`,
    },
    {
      question: 'Container queries (CQ) va media queries (MQ) qanday farqlanadi? CQ qachon kerak?',
      answer: `Media queries — VIEWPORT (brauzer oynasi) o'lchamiga qaraydi. Butun sahifa bir xil breakpointda o'zgaradi.

Container queries — OTA ELEMENT o'lchamiga qaraydi. Komponent joylashgan konteyner o'lchamiga qarab moslashadi.

CQ qachon kerak:
1. Bir xil komponent turli joylarda turli o'lchamda — sidebar da 300px, main da 800px.
2. Design system — komponent mustaqil bo'lishi kerak, sahifaga bog'liq emas.
3. Micro-frontend — komponent qaysi app ga joylashganini bilmaydi.

Misol: .card sidebar da vertikal ko'rinadi, main area da gorizontal. MQ bilan sidebar/main ni tekshirish mumkin emas — viewport bir xil. CQ bilan ota container o'lchamiga qarab o'zgaradi.

MUHIM: CQ MQ ni almashTIRMAYDI — ular birga ishlaydi. Sahifa tuzilmasi MQ bilan, komponent ichidagi layout CQ bilan.`,
    },
    {
      question: 'clamp() funksiyasi qanday ishlaydi? Qanday muammolarni hal qiladi?',
      answer: `clamp(min, preferred, max) — uchta qiymat oladi:
- min: eng kichik ruxsat etilgan qiymat
- preferred: ideal qiymat (odatda vw yoki % ishlatiladi)
- max: eng katta ruxsat etilgan qiymat

Misol: font-size: clamp(1rem, 2.5vw, 2rem)
- 400px viewport: 2.5vw = 10px, lekin min 1rem(16px) — 16px
- 800px viewport: 2.5vw = 20px — 20px
- 1200px viewport: 2.5vw = 30px, lekin max 2rem(32px) — 32px

Hal qiladigan muammolar:
1. Media query soni kamayadi — ko'p hollarda breakpoint kerak emas.
2. Smooth transition — sakrash yo'q, o'lcham muammosiz o'zgaradi.
3. Accessibility — foydalanuvchi brauzer font-size ni o'zgartirsa, rem orqali ishlaydi.

MUHIM: clamp() ichida faqat vw emas, vw + rem aralashtiriladi: clamp(1rem, 2vw + 0.5rem, 2rem) — bu foydalanuvchi font-size sozlamalarini hurmat qiladi.`,
    },
    {
      question: 'Mobile Safari da 100vh muammosi nima? Qanday hal qilinadi?',
      answer: `Muammo: Mobile Safari da address bar va toolbar mavjud. 100vh DOIMO viewport ning to'liq balandligini oladi — address bar hisobga olinmaydi. Natijada element ekrandan toshadi va foydalanuvchi scroll qilishi kerak bo'ladi.

Eski yechimlar:
1. -webkit-fill-available — faqat WebKit, standart emas.
2. JavaScript: window.innerHeight — resize event bilan.
3. CSS variable: document.documentElement.style.setProperty("--vh", window.innerHeight * 0.01 + "px") — har resize da yangilash kerak.

Zamonaviy yechim (2023+):
- dvh (dynamic viewport height) — address bar ochiq/yopiq holatga qarab o'zgaradi. Animatsiya bo'ladi.
- svh (small viewport height) — doimo kichik variant (address bar ochiq). O'zgarmaydi.
- lvh (large viewport height) — doimo katta variant (address bar yashirin).

Tavsiya: Hero section uchun min-height: 100dvh. Fallback: min-height: 100vh; min-height: 100dvh; — eski brauzerlar 100vh ni oladi.`,
    },
    {
      question: 'srcset va sizes atributlari qanday ishlaydi? Brauzer qaysi rasmni tanlaydi?',
      answer: `srcset — brauzerga rasmlarning turli o'lchamdagi versiyalarini taqdim etadi. Brauzer eng mosini AVTOMATIK tanlaydi.

srcset="small.jpg 400w, medium.jpg 800w, large.jpg 1200w"
w = rasmning haqiqiy pixel kengligi.

sizes — brauzerga rasm ekranda QANCHA joy egallashini aytadi:
sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
- Mobile: rasm viewport kengligining 100%
- Tablet: 50%
- Desktop: 33%

Brauzer tanlash algoritmi:
1. sizes dan rasm o'lchamini aniqlaydi (masalan, 640px ekran = 100vw = 640px)
2. Device pixel ratio ni hisobga oladi (2x Retina = 1280px kerak)
3. srcset dan eng mos rasmni tanlaydi (1200w ni oladi)
4. Tarmoq holati ham ta'sir qilishi mumkin (sekin internet = kichikroq)

MUHIM: sizes berilmasa, brauzer 100vw deb hisoblaydi — kichik joyda ham katta rasm yuklanadi. Doimo sizes bering.`,
    },
    {
      question: 'Responsive design testing uchun qanday strategiya ishlatiladi?',
      answer: `Testing strategiyasi:

1. DevTools Device Mode: Chrome/Firefox da turli qurilmalar simulyatsiya. Touch eventlar, viewport o'lchami. LEKIN bu 100% aniq emas — haqiqiy qurilma bilan farq bor.

2. Haqiqiy qurilma testing: eng muhim. iOS Safari va Android Chrome turlicha ishlaydi (100vh muammosi, font-size, safe-area).

3. Breakpoint testing: har bir breakpointda va breakpoint CHEGARASIDA (639px, 640px, 641px) tekshirish. Edge case lar shu yerda paydo bo'ladi.

4. Content testing: juda qisqa va juda uzun kontent bilan tekshirish. Bo'sh holatlar, overflow muammolari.

5. Accessibility: zoom 200% da layout buzilmasligi. prefers-reduced-motion, prefers-color-scheme test.

6. Performance: Lighthouse mobile audit. Rasm o'lchamlari, font-display, CLS (Cumulative Layout Shift).

Asboblar: BrowserStack (haqiqiy qurilmalar), Responsively (bir vaqtda ko'p o'lcham), Chrome DevTools Lighthouse.`,
    },
  ],
}
