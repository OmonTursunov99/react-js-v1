import type { Topic } from '../../../types'

export const flexbox: Topic = {
  id: 'flexbox',
  title: 'Flexbox',
  importance: 3,
  status: 'to-learn',
  description: 'Flex container/items, alignment, wrapping, centering patterns',
  content: `FLEXBOX — ONE-DIMENSIONAL LAYOUT
══════════════════════════════════════

Flexbox (Flexible Box Layout) — bir o'lchamli (1D) layout modeli.
Element larni qator (row) yoki ustun (column) bo'ylab joylash,
bo'sh joyni taqsimlash va alignment qilish uchun ishlatiladi.

MUHIM: Flexbox FAQAT bitta o'qda ishlaydi — ya main axis,
ya cross axis. 2D layout kerak bo'lsa — CSS Grid ishlatiladi.

══════════════════════════════════════
1. FLEX CONTAINER XOSSALARI
══════════════════════════════════════

  display: flex | inline-flex;

  /* Yo'nalish */
  flex-direction: row | row-reverse | column | column-reverse;

  /* O'rash */
  flex-wrap: nowrap | wrap | wrap-reverse;

  /* Shorthand */
  flex-flow: row wrap;

  /* Main axis bo'yicha tekislash */
  justify-content: flex-start | flex-end | center
                   | space-between | space-around | space-evenly;

  /* Cross axis bo'yicha tekislash (bitta qator) */
  align-items: stretch | flex-start | flex-end | center | baseline;

  /* Cross axis bo'yicha tekislash (ko'p qator) */
  align-content: flex-start | flex-end | center
                 | space-between | space-around | stretch;

  /* Bo'shliq */
  gap: 16px;
  row-gap: 16px;
  column-gap: 8px;

══════════════════════════════════════
2. FLEX ITEM XOSSALARI
══════════════════════════════════════

  /* O'sish koeffitsienti (bo'sh joy taqsimoti) */
  flex-grow: 0;     /* default — o'smaydi */

  /* Qisqarish koeffitsienti */
  flex-shrink: 1;   /* default — qisqaradi */

  /* Boshlang'ich o'lchami */
  flex-basis: auto;  /* width/height o'rniga */

  /* Shorthand: grow shrink basis */
  flex: 0 1 auto;    /* default */
  flex: 1;           /* = flex: 1 1 0% — teng taqsimlash */
  flex: auto;        /* = flex: 1 1 auto */
  flex: none;        /* = flex: 0 0 auto — qattiq o'lcham */

  /* Tartib */
  order: 0;          /* default, kamroq = oldinda */

  /* Alohida alignment */
  align-self: auto | flex-start | flex-end | center | stretch;

MUHIM: flex-basis vs width farqi — flex-basis faqat main axis
bo'yicha ishlaydi va flex algoritmida prioritet oladi.

══════════════════════════════════════
3. MAIN AXIS vs CROSS AXIS
══════════════════════════════════════

  flex-direction: row
  ┌──────────────────────────────────┐
  │  main axis →                     │
  │  ┌─────┐ ┌─────┐ ┌─────┐       │
  │  │  1  │ │  2  │ │  3  │  ↕    │
  │  └─────┘ └─────┘ └─────┘ cross │
  └──────────────────────────────────┘

  flex-direction: column
  ┌──────────────┐
  │ main axis ↓  │
  │ ┌──────────┐ │
  │ │    1     │ │ ← cross axis →
  │ ├──────────┤ │
  │ │    2     │ │
  │ ├──────────┤ │
  │ │    3     │ │
  │ └──────────┘ │
  └──────────────┘

justify-content — DOIMO main axis bo'yicha ishlaydi.
align-items — DOIMO cross axis bo'yicha ishlaydi.

══════════════════════════════════════
4. CENTERING PATTERNLARI
══════════════════════════════════════

  /* Gorizontal markazlash */
  .parent { display: flex; justify-content: center; }

  /* Vertikal markazlash */
  .parent { display: flex; align-items: center; }

  /* Ikkalasi — eng mashhur pattern */
  .parent {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  /* Yagona child — margin auto */
  .parent { display: flex; }
  .child  { margin: auto; }

══════════════════════════════════════
5. UMUMIY LAYOUTLAR
══════════════════════════════════════

Navbar: justify-content: space-between
Card grid: flex-wrap: wrap + gap + flex: 1 1 300px
Holy grail: ustun flex ichida qator flex
Sticky footer: flex-direction: column, main { flex: 1 }

══════════════════════════════════════
6. FLEXBOX vs GRID
══════════════════════════════════════

Flexbox qachon:
- Bitta qator/ustun layout
- Navbar, toolbar, card row
- Content-driven layout (o'lcham kontentga bog'liq)

Grid qachon:
- 2D layout (qator VA ustun)
- Sahifa tuzilmasi (header/sidebar/main/footer)
- Layout-driven design (o'lcham gridga bog'liq)

MUHIM: Ular raqobatchi EMAS — birgalikda ishlatiladi.
Grid = sahifa tuzilmasi, Flexbox = komponent ichidagi layout.`,
  codeExamples: [
    {
      title: 'Flex Container va Items asosiy xossalari',
      language: 'css',
      code: `/* ═══ FLEX CONTAINER ═══ */
.container {
  display: flex;
  flex-direction: row;       /* default */
  flex-wrap: wrap;           /* yangi qatorga o'tadi */
  justify-content: center;   /* main axis */
  align-items: center;       /* cross axis */
  gap: 16px;                 /* itemlar orasidagi masofa */
}

/* ═══ FLEX ITEMS ═══ */
.item {
  flex: 1 1 200px;
  /* flex-grow: 1    — bo'sh joyni oladi */
  /* flex-shrink: 1  — kerak bo'lsa qisqaradi */
  /* flex-basis: 200px — boshlang'ich kenglik */
}

.item-fixed {
  flex: none;   /* = 0 0 auto — qattiq o'lcham */
  width: 80px;
}

.item-fill {
  flex: 1;      /* = 1 1 0% — teng taqsimot */
}`,
      description: 'Flex container va item xossalarining asosiy kombinatsiyalari',
    },
    {
      title: 'Navbar Layout — space-between pattern',
      language: 'css',
      code: `/* ═══ RESPONSIVE NAVBAR ═══ */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  height: 64px;
}

.navbar__logo {
  flex: none;          /* o'lcham o'zgarmaydi */
}

.navbar__menu {
  display: flex;
  gap: 24px;
  list-style: none;
}

.navbar__actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

/* ═══ MOBILE — ustun layout ═══ */
@media (max-width: 768px) {
  .navbar {
    flex-wrap: wrap;
  }
  .navbar__menu {
    order: 3;            /* eng pastga */
    flex-basis: 100%;    /* alohida qator */
    justify-content: center;
  }
}`,
      description: 'Navbar uchun space-between bilan responsive layout',
    },
    {
      title: 'Card Grid — flex-wrap bilan',
      language: 'css',
      code: `/* ═══ RESPONSIVE CARD GRID ═══ */
.card-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
}

.card {
  flex: 1 1 300px;   /* min 300px, teng o'sadi */
  max-width: 400px;  /* juda katta bo'lmasin */
}

/* ═══ Oxirgi qator tekislash muammosi ═══ */
/* flex-wrap bilan oxirgi qatordagi kamroq */
/* elementlar cho'ziladi — to'g'rilash: */
.card-grid::after {
  content: "";
  flex: 1 1 300px;   /* bo'sh joy egallaydi */
  max-width: 400px;
}

/* ═══ STICKY FOOTER ═══ */
.page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.page__header { flex: none; }
.page__main   { flex: 1; }     /* qolgan joyni oladi */
.page__footer { flex: none; }`,
      description: 'Card grid va sticky footer patternlari',
    },
    {
      title: 'Centering va align-self misollar',
      language: 'css',
      code: `/* ═══ PERFECT CENTERING ═══ */
.center-both {
  display: flex;
  justify-content: center;   /* gorizontal */
  align-items: center;       /* vertikal */
  min-height: 100vh;
}

/* ═══ MARGIN AUTO TRICK ═══ */
.push-right {
  display: flex;
  align-items: center;
}
.push-right .spacer {
  margin-left: auto;  /* chapdan o'ngga itaradi */
}

/* ═══ ALIGN-SELF ═══ */
.cross-positions {
  display: flex;
  align-items: flex-start;
  height: 200px;
}
.cross-positions .top    { align-self: flex-start; }
.cross-positions .middle { align-self: center; }
.cross-positions .bottom { align-self: flex-end; }
.cross-positions .fill   { align-self: stretch; }`,
      description: 'Markazlash va individual alignment usullari',
    },
    {
      title: 'Holy Grail Layout — nested flex',
      language: 'css',
      code: `/* ═══ HOLY GRAIL LAYOUT ═══ */
/*  header
    sidebar | main | aside
    footer                   */

.holy-grail {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.holy-grail__header,
.holy-grail__footer {
  flex: none;
}

.holy-grail__body {
  display: flex;
  flex: 1;
}

.holy-grail__sidebar {
  flex: 0 0 250px;    /* qattiq kenglik */
  order: -1;          /* chapga */
}

.holy-grail__main {
  flex: 1;            /* qolgan joy */
  min-width: 0;       /* overflow oldini olish */
}

.holy-grail__aside {
  flex: 0 0 200px;
}

/* ═══ MOBILE ═══ */
@media (max-width: 768px) {
  .holy-grail__body {
    flex-direction: column;
  }
  .holy-grail__sidebar,
  .holy-grail__aside {
    flex-basis: auto;
  }
}`,
      description: 'Klassik 3-ustunli layout nested flex bilan',
    },
  ],
  interviewQA: [
    {
      question: 'flex: 1 nima degani? flex: 1 va flex: auto farqi?',
      answer: `flex: 1 = flex: 1 1 0% demak. flex-grow: 1, flex-shrink: 1, flex-basis: 0%. Barcha itemlar bo'sh joyni TENG taqsimlaydi, chunki boshlang'ich o'lchami 0.

flex: auto = flex: 1 1 auto. Farqi — flex-basis: auto, ya'ni item avval o'z content o'lchamini oladi, keyin QOLGAN bo'sh joyni teng taqsimlaydi. Natijada katta kontentli item ko'proq joy oladi.

Amaliy farq: 3 ta button — flex: 1 bilan barchasi bir xil kenglikda. flex: auto bilan uzun matnli button kengroq bo'ladi.`,
    },
    {
      question: 'justify-content: space-between, space-around va space-evenly farqlari?',
      answer: `space-between: birinchi item boshida, oxirgi item oxirida, oradagi bo'shliq teng taqsimlanadi. Chetlarda bo'shliq YO'Q.

space-around: har bir item atrofida teng margin. Natijada chetlardagi bo'shliq o'rtadagining YARMI (chunki qo'shni itemlar marginlari qo'shilmaydi, alohida).

space-evenly: BARCHA bo'shliqlar teng — chetlar ham, oraliqlar ham bir xil. Eng "toza" taqsimot.

Misol: 3 item, 300px container, har biri 60px:
- space-between: [60]---60---[60]---60---[60]
- space-around: -30-[60]--60--[60]--60--[60]-30-
- space-evenly: -40-[60]-40-[60]-40-[60]-40-`,
    },
    {
      question: `Nima uchun flex itemda min-width: 0 yoki overflow: hidden kerak bo'ladi?`,
      answer: `Flex itemlarning default min-width qiymati auto — ya'ni item o'z kontentidan kichik bo'la olmaydi. Bu uzun matn yoki katta rasm containerdan toshib ketishiga olib keladi (overflow).

Muammo: flex item ichida ellipsis (text-overflow) yoki scroll ishlatmoqchi bo'lsangiz, item qisqarmaydi.

Yechim: flex itemga min-width: 0 qo'yish. Bu flex algoritmiga "item kontentdan kichikroq bo'lishi mumkin" deydi. overflow: hidden ham ishlaydi, chunki u min-width: auto ni bekor qiladi.

Xuddi shu muammo column layout da min-height: 0 bilan ham bo'ladi.`,
    },
    {
      question: 'Flexbox da order xossasi qanday ishlaydi? Accessibility muammolari bormi?',
      answer: `order xossasi flex itemlarning vizual tartibini o'zgartiradi. Default 0. Kichik qiymat = oldinda. Bir xil order da DOM tartibi saqlanadi.

MUHIM accessibility muammosi: order FAQAT vizual tartibni o'zgartiradi, lekin tab tartibi (keyboard navigation) va screen reader tartibi DOM tartibiga bog'liq bo'lib qoladi. Natijada ko'ruvchi foydalanuvchi va keyboard foydalanuvchi turli tartibda harakat qiladi.

Yechim: order ni faqat vizual optimizatsiya uchun ishlating (masalan, mobile da element tartibini o'zgartirish). Mantiqiy tartib kerak bo'lsa — DOMda o'zgartiring.`,
    },
    {
      question: 'flex-basis va width (yoki height) qanday farqlanadi?',
      answer: `flex-basis — flex item ning main axis bo'yicha boshlang'ich o'lchamini belgilaydi. width/height — har doim tegishli o'lchamni belgilaydi.

Farqlar:
1. flex-basis faqat main axis bo'yicha ishlaydi. row da width o'rnida, column da height o'rnida.
2. Agar flex-basis va width ikkalasi ham berilsa — flex-basis YUTADI (prioritet yuqori).
3. flex-basis: auto bo'lsa, width/height qiymatiga qaraydi, u ham bo'lmasa content o'lchamiga.
4. flex-basis flex-grow/flex-shrink algoritmi uchun boshlang'ich nuqta. width esa bunday emas.
5. flex-basis: 0% bilan item o'lchami 0 dan boshlanadi va bo'sh joy flex-grow orqali taqsimlanadi.

Senior maslahat: flex shorthand doimo flex-basis ni belgilaydi — flex: 1 deganda basis 0% bo'ladi.`,
    },
    {
      question: 'Flexbox bilan Grid ni qachon ishlatish kerak? Real loyihada qanday birgalikda ishlaydi?',
      answer: `Flexbox — 1D layout, ya'ni elementlar BITTA yo'nalishda joylashadi (qator YOKI ustun). Grid — 2D layout, qator VA ustun bir vaqtda boshqariladi.

Flexbox qachon: navbar, toolbar, button group, card ichidagi layout, form row, badge/tag list. Content o'lchami layoutni belgilaydi (content-driven).

Grid qachon: sahifa tuzilmasi (header/sidebar/main), dashboard grid, image gallery, calendar, jadval ko'rinishdagi layout. Layout o'lchami kontentni belgilaydi (layout-driven).

Real loyihada BIRGALIKDA: Grid sahifaning asosiy tuzilmasini belgilaydi (header, sidebar, main). Har bir bo'lim ichida esa Flexbox ishlatiladi (navbar itemlari, card ichidagi elementlar). Bu ikki texnologiya bir-birini to'ldiradi, raqobat qilmaydi.`,
    },
  ],
}
