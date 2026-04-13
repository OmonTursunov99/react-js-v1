import type { Topic } from '../../../types'

export const displayPositioning: Topic = {
  id: 'display-positioning',
  title: 'Display va Positioning',
  importance: 3,
  status: 'to-learn',
  description: 'block, inline, flex, grid, position static/relative/absolute/fixed/sticky',
  content: `Display va position — CSS layout ning ikki asosiy xususiyati. Display elementning ICHKI va TASHQI ko'rinishini, position esa sahifadagi JOYLASHUVINI boshqaradi.

═══════════════════════════════════════
  DISPLAY XUSUSIYATI
═══════════════════════════════════════

TASHQI ko'rinish (outer display):
  block        — to'liq qator egallaydi, yangi qatordan boshlanadi
                 (div, p, h1-h6, section, article)
  inline       — kontent qadari joy, qatorda
                 (span, a, strong, em)
  inline-block — qatorda, lekin width/height ishlaydi

ICHKI ko'rinish (inner display):
  flex         — Flexbox layout (1 o'lchamli)
  grid         — Grid layout (2 o'lchamli)
  table        — jadval layout

Boshqa:
  none         — element ko'rinmaydi va joy egaLLAMAYDI
  contents     — element o'zi yo'qoladi, bolalari qoladi

═══════════════════════════════════════
  VISIBILITY VA DISPLAY:NONE FARQI
═══════════════════════════════════════

display: none    — element DOM da, lekin ko'rinmaydi, joy EGABALLAMAYDI
visibility: hidden — ko'rinmaydi, lekin joyni EGALLAYDI
opacity: 0       — shaffof, joy egallaydi, event lar ishlaydi

═══════════════════════════════════════
  POSITION XUSUSIYATI
═══════════════════════════════════════

static (default):
  - Normal flow da joylashadi
  - top/right/bottom/left ISHLAMAYDI
  - z-index ISHLAMAYDI

relative:
  - Normal flow da joyini EGALLAYDI
  - top/right/bottom/left bilan O'Z JOYIDAN siljiydi
  - Boshqa elementlarga ta'sir qilmaydi
  - z-index ishlaydi

absolute:
  - Normal flow dan CHIQADI (joy egaLLAMAYDI)
  - Eng yaqin position:relative ota ga nisbatan joylashadi
  - Agar bunday ota yo'q — viewport ga nisbatan

fixed:
  - Normal flow dan chiqadi
  - VIEWPORT ga nisbatan joylashadi
  - Scroll qilganda harakatlaNMAYDI
  - Navbar, "yuqoriga" tugmasi uchun

sticky:
  - Normal flow da boshlanadi (relative kabi)
  - Scroll belgilangan nuqtaga yetganda YOPISHADI (fixed kabi)
  - Ota elementdan chiqmaydi
  - top/bottom bilan yopishadigan nuqta belgilanadi

═══════════════════════════════════════
  Z-INDEX
═══════════════════════════════════════

z-index — elementlarning qatlam tartibi (ustma-ust).
Faqat position: relative/absolute/fixed/sticky da ishlaydi.

  z-index: 1   — tepada
  z-index: -1  — pastda
  z-index: auto — ota bilan bir xil

STACKING CONTEXT — z-index ning "konteksti":
  Yangi stacking context yaratadigan xususiyatlar:
  - position + z-index
  - opacity < 1
  - transform
  - filter
  - isolation: isolate`,

  codeExamples: [
    {
      title: 'Display turlari',
      language: 'css',
      description: 'block, inline, inline-block, none farqi',
      code: `/* Block — to'liq qator */
div, p, h1, section {
  display: block;
  /* width: 100% (sukut), height: auto */
}

/* Inline — qatorda */
span, a, strong {
  display: inline;
  /* width/height ISHLAMAYDI */
  /* margin-top/bottom ISHLAMAYDI */
}

/* Inline-block — qatorda + blok xususiyatlar */
.tag {
  display: inline-block;
  width: 100px;      /* ISHLAYDI */
  height: 32px;      /* ISHLAYDI */
  padding: 4px 12px; /* to'liq ishlaydi */
  margin: 4px;       /* to'liq ishlaydi */
}

/* None — butunlay yashirish */
.hidden { display: none; }      /* joy egaballamaydi */
.invisible { visibility: hidden; } /* joy egallaydi */
.transparent { opacity: 0; }    /* joy egallaydi + event */

/* Contents — faqat bolalarini ko'rsatish */
.wrapper {
  display: contents;
  /* o'zi yo'qoladi, bolalari ota ga to'g'ridan-to'g'ri tushadi */
}`,
    },
    {
      title: 'Position turlari',
      language: 'css',
      description: 'static, relative, absolute, fixed, sticky',
      code: `/* Relative — o'z joyidan siljish */
.tooltip-trigger {
  position: relative; /* absolute bola uchun anchor */
}

.tooltip {
  position: absolute;
  bottom: 100%;  /* trigger ustida */
  left: 50%;
  transform: translateX(-50%); /* markazlashtirish */
  background: #1f2937;
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  white-space: nowrap;
}

/* Fixed — doim ko'rinadi */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: white;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

/* Sticky — scroll da yopishadi */
.table-header {
  position: sticky;
  top: 0;
  background: white;
  z-index: 10;
}

.sidebar-section {
  position: sticky;
  top: 80px; /* navbar balandligidan keyin */
}`,
    },
    {
      title: 'Markazlashtirish usullari',
      language: 'css',
      description: 'Element markazlashtirish — 5 ta usul',
      code: `/* 1. Flexbox — eng oson va mashhur */
.center-flex {
  display: flex;
  justify-content: center; /* gorizontal */
  align-items: center;     /* vertikal */
}

/* 2. Grid */
.center-grid {
  display: grid;
  place-items: center; /* gorizontal + vertikal */
}

/* 3. Absolute + transform */
.center-absolute {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* 4. Margin auto (gorizontal, block element) */
.center-margin {
  width: 300px;
  margin: 0 auto;
}

/* 5. Matn markazlashtirish (inline kontent) */
.center-text {
  text-align: center;    /* gorizontal */
  line-height: 100px;    /* vertikal (bir qatorli) */
}`,
    },
  ],

  interviewQA: [
    {
      question: 'position: absolute va fixed farqi nima?',
      answer: 'absolute — eng yaqin position:relative/absolute/fixed ota elementga nisbatan joylashadi. Fixed — har doim VIEWPORT (brauzer oynasi) ga nisbatan joylashadi. Asosiy farq: absolute scroll bilan birga harakatlanadi, fixed harakatlaNMAYDI (doim bir joyda turadi). Fixed — navbar, modal overlay uchun, absolute — tooltip, dropdown uchun.',
    },
    {
      question: 'position: sticky qanday ishlaydi?',
      answer: 'Sticky avval relative kabi normal flow da turadi. Scroll qilib belgilangan nuqtaga (top, bottom) yetganda fixed ga aylanadi va "yopishadi". Muhim: 1) top/bottom ko\'rsatish kerak. 2) Ota element chegarasidan chiqmaydi. 3) Ota da overflow: hidden/scroll bo\'lsa ishlamasligi mumkin. Ishlatilish: jadval sarlavhasi, sidebar, kategoriya nomi.',
    },
    {
      question: 'display: none, visibility: hidden va opacity: 0 farqi nima?',
      answer: 'display:none — element to\'liq yo\'qoladi, joy egaballamaydi, DOM da bor lekin render tree da yo\'q. visibility:hidden — element ko\'rinmaydi, lekin joyni egallaydi, event lar ISHLAMAYDI. opacity:0 — shaffof, joyni egallaydi, event lar ISHLAYDI (bosish mumkin). Screen reader: display:none va visibility:hidden da o\'qimaydi, opacity:0 da o\'qiydi.',
    },
    {
      question: 'CSS da elementni gorizontal va vertikal markazlashtirish qanday qilinadi?',
      answer: 'Eng yaxshi usullar: 1) Flexbox: display:flex + justify-content:center + align-items:center. 2) Grid: display:grid + place-items:center. 3) Absolute: position:absolute + top:50% + left:50% + transform:translate(-50%,-50%). 4) Gorizontal block: margin:0 auto (width kerak). Flexbox eng oddiy va keng qo\'llaniladi.',
    },
  ],

  relatedTopics: [
    { techId: 'css', sectionId: 'css-fundamentals', topicId: 'box-model', label: 'Box Model' },
    { techId: 'css', sectionId: 'css-layout', topicId: 'flexbox', label: 'Flexbox' },
    { techId: 'css', sectionId: 'css-layout', topicId: 'grid', label: 'Grid' },
  ],
}
