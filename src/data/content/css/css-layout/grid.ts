import type { Topic } from '../../../types'

export const grid: Topic = {
  id: 'grid',
  title: 'CSS Grid',
  importance: 3,
  status: 'to-learn',
  description: 'Grid template, areas, fr unit, minmax, subgrid, responsive grid',
  content: `CSS GRID — TWO-DIMENSIONAL LAYOUT
══════════════════════════════════════

CSS Grid — ikki o'lchamli (2D) layout tizimi. Bir vaqtning o'zida
qatorlar (rows) VA ustunlar (columns) bo'yicha elementlarni
joylash, o'lchamini boshqarish va tekislash imkonini beradi.

MUHIM: Grid — layout-driven yondashuv. Avval gridni
aniqlaysiz, keyin elementlarni joylashtirasiz. Flexbox esa
content-driven — element o'lchami kontentga bog'liq.

══════════════════════════════════════
1. GRID CONTAINER ASOSLARI
══════════════════════════════════════

  display: grid | inline-grid;

  /* Ustunlar va qatorlar */
  grid-template-columns: 200px 1fr 1fr;
  grid-template-rows: auto 1fr auto;

  /* fr unit — bo'sh joydan ulush */
  grid-template-columns: 1fr 2fr 1fr;
  /* 1-ustun: 25%, 2-ustun: 50%, 3-ustun: 25% */

  /* repeat() — takrorlash */
  grid-template-columns: repeat(3, 1fr);
  grid-template-columns: repeat(4, 200px 1fr);

  /* minmax() — min va max o'lcham */
  grid-template-columns: repeat(3, minmax(200px, 1fr));

  /* Bo'shliq */
  gap: 16px;
  row-gap: 24px;
  column-gap: 16px;

══════════════════════════════════════
2. AUTO-FILL vs AUTO-FIT
══════════════════════════════════════

  /* auto-fill: imkon boricha ko'p ustun yaratadi */
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  /* 1000px container = 4 ustun (250px), bo'sh joylar qoladi */

  /* auto-fit: bo'sh ustunlarni yo'q qiladi, mavjudini cho'zadi */
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  /* 2 ta item + 1000px = 2 ustun, har biri 500px */

MUHIM: auto-fit ko'p hollarda yaxshiroq, chunki
elementlar mavjud joyni to'liq egallaydi.
auto-fill esa "bo'sh katak" kerak bo'lganda ishlatiladi.

══════════════════════════════════════
3. GRID TEMPLATE AREAS
══════════════════════════════════════

  .page {
    display: grid;
    grid-template-areas:
      "header  header  header"
      "sidebar main   aside"
      "footer  footer  footer";
    grid-template-columns: 250px 1fr 200px;
    grid-template-rows: auto 1fr auto;
  }

  .header  { grid-area: header; }
  .sidebar { grid-area: sidebar; }
  .main    { grid-area: main; }
  .aside   { grid-area: aside; }
  .footer  { grid-area: footer; }

  /* Responsive: mobile da ustun layout */
  @media (max-width: 768px) {
    .page {
      grid-template-areas:
        "header"
        "main"
        "sidebar"
        "aside"
        "footer";
      grid-template-columns: 1fr;
    }
  }

MUHIM: "." bilan bo'sh katak belgilanadi:
  grid-template-areas: "header . aside";

══════════════════════════════════════
4. GRID ITEM JOYLASHUVI
══════════════════════════════════════

  /* Chiziq raqamlari bilan */
  .item {
    grid-column: 1 / 3;     /* 1-chiziqdan 3-chiziqgacha */
    grid-row: 2 / 4;        /* 2-qatordan 4-qatorgacha */
  }

  /* span bilan */
  .item {
    grid-column: span 2;    /* 2 ustun egallaydi */
    grid-row: span 3;       /* 3 qator egallaydi */
  }

  /* Shorthand */
  .item {
    grid-area: 2 / 1 / 4 / 3;
    /* row-start / col-start / row-end / col-end */
  }

  /* Named lines */
  .container {
    grid-template-columns:
      [sidebar-start] 250px
      [sidebar-end main-start] 1fr
      [main-end];
  }
  .sidebar { grid-column: sidebar-start / sidebar-end; }
  .content { grid-column: main-start / main-end; }

══════════════════════════════════════
5. ALIGNMENT (TEKISLASH)
══════════════════════════════════════

  /* Container ustunlarini tekislash */
  justify-content: start | end | center | space-between;

  /* Container qatorlarini tekislash */
  align-content: start | end | center | space-between;

  /* BARCHA itemlarni katak ichida */
  justify-items: start | end | center | stretch;
  align-items: start | end | center | stretch;

  /* ALOHIDA item — katak ichida */
  justify-self: start | end | center | stretch;
  align-self: start | end | center | stretch;

  /* Shorthand */
  place-items: center center;
  place-content: center center;
  place-self: center center;

══════════════════════════════════════
6. SUBGRID
══════════════════════════════════════

Subgrid — ichki grid ota gridning chiziqlarini meros oladi.
Kartochka sarlavhalari bir xil balandlikda turishi uchun ideal.

  .parent {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }

  .card {
    display: grid;
    grid-template-rows: subgrid;
    grid-row: span 3;
    /* Endi card ichidagi 3 qator ota grid */
    /* chiziqlari bilan sinxronlashadi */
  }

MUHIM: Subgrid hozir barcha zamonaviy brauzerlarda ishlaydi
(Chrome 117+, Firefox 71+, Safari 16+).

══════════════════════════════════════
7. 12-COLUMN GRID TIZIMI
══════════════════════════════════════

Bootstrap singari 12-ustunli grid CSS Grid bilan:

  .grid-12 {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    gap: 24px;
  }
  .col-4  { grid-column: span 4; }
  .col-6  { grid-column: span 6; }
  .col-12 { grid-column: span 12; }

Bu yondashuv Bootstrap ga bog'lanmasdan 12-column
layout qilish imkonini beradi.`,
  codeExamples: [
    {
      title: 'Responsive Grid — media query siz',
      language: 'css',
      code: `/* ═══ AUTO-FIT + MINMAX = RESPONSIVE ═══ */
.card-grid {
  display: grid;
  grid-template-columns:
    repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  padding: 24px;
}

/* Natija:
   1400px = 4 ustun (350px)
   1000px = 3 ustun (333px)
    600px = 2 ustun (300px)
    400px = 1 ustun (400px)
   Media query kerak EMAS! */

/* ═══ AUTO-FILL bilan farqi ═══ */
.with-auto-fill {
  grid-template-columns:
    repeat(auto-fill, minmax(280px, 1fr));
  /* 2 ta item + 1400px = hali 4 ustun */
  /* 2 tasi to'lgan, 2 tasi BO'SH */
}

.with-auto-fit {
  grid-template-columns:
    repeat(auto-fit, minmax(280px, 1fr));
  /* 2 ta item + 1400px = 2 ustun */
  /* Har biri 700px ga cho'ziladi */
}`,
      description: 'auto-fit + minmax bilan media query siz responsive grid',
    },
    {
      title: 'Grid Template Areas — sahifa layout',
      language: 'css',
      code: `/* ═══ SAHIFA TUZILMASI ═══ */
.page-layout {
  display: grid;
  grid-template-areas:
    "header  header  header"
    "sidebar content aside"
    "footer  footer  footer";
  grid-template-columns: 260px 1fr 220px;
  grid-template-rows: 64px 1fr 80px;
  min-height: 100vh;
  gap: 0;
}

.page-header  { grid-area: header; }
.page-sidebar { grid-area: sidebar; }
.page-content { grid-area: content; }
.page-aside   { grid-area: aside; }
.page-footer  { grid-area: footer; }

/* ═══ TABLET ═══ */
@media (max-width: 1024px) {
  .page-layout {
    grid-template-areas:
      "header  header"
      "sidebar content"
      "footer  footer";
    grid-template-columns: 220px 1fr;
  }
  .page-aside { display: none; }
}

/* ═══ MOBILE ═══ */
@media (max-width: 640px) {
  .page-layout {
    grid-template-areas:
      "header"
      "content"
      "footer";
    grid-template-columns: 1fr;
  }
  .page-sidebar { display: none; }
}`,
      description: 'Grid areas bilan responsive sahifa tuzilmasi',
    },
    {
      title: 'Named Lines va Item Joylashuvi',
      language: 'css',
      code: `/* ═══ NAMED LINES ═══ */
.dashboard {
  display: grid;
  grid-template-columns:
    [full-start sidebar-start] 250px
    [sidebar-end content-start] 1fr
    [content-end panel-start] 300px
    [panel-end full-end];
  grid-template-rows:
    [header-start] 60px
    [header-end body-start] 1fr
    [body-end];
}

/* Named line bilan joylash */
.widget-full {
  grid-column: full-start / full-end;
}
.widget-main {
  grid-column: content-start / content-end;
  grid-row: body-start / body-end;
}

/* ═══ SPAN BILAN JOYLASH ═══ */
.featured-card {
  grid-column: span 2;   /* 2 ustun */
  grid-row: span 2;      /* 2 qator */
}

/* Oxirgi ustundan boshlab */
.sidebar-widget {
  grid-column: -2 / -1;  /* oxirgi ustun */
}`,
      description: 'Named lines va turli joylash usullari',
    },
    {
      title: 'Subgrid — sinxronlashtirilgan kartochkalar',
      language: 'css',
      code: `/* ═══ SUBGRID ═══ */
/* Muammo: card ichidagi sarlavha, matn, tugma
   balandligi turlicha bo'lsa tekislanmaydi */

.card-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

/* Har bir card 3 qator: title, body, actions */
.card {
  display: grid;
  grid-template-rows: subgrid;
  grid-row: span 3;
  gap: 0;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
}

.card__title {
  padding: 16px;
  font-weight: 600;
  /* BARCHA cardlarda bir xil balandlik */
}

.card__body {
  padding: 0 16px;
  /* BARCHA cardlarda sinxron */
}

.card__actions {
  padding: 16px;
  display: flex;
  gap: 8px;
  align-self: end;
}`,
      description: 'Subgrid bilan kartochka elementlarini sinxronlash',
    },
    {
      title: '12-Column Grid tizimi',
      language: 'css',
      code: `/* ═══ 12-COLUMN GRID ═══ */
.grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}

/* Column span klasslari */
.col-1  { grid-column: span 1; }
.col-2  { grid-column: span 2; }
.col-3  { grid-column: span 3; }
.col-4  { grid-column: span 4; }
.col-6  { grid-column: span 6; }
.col-8  { grid-column: span 8; }
.col-12 { grid-column: span 12; }

/* ═══ RESPONSIVE COLUMNS ═══ */
@media (max-width: 1024px) {
  .md-col-6  { grid-column: span 6; }
  .md-col-12 { grid-column: span 12; }
}

@media (max-width: 640px) {
  .grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  /* Mobile da hammasi full-width */
  [class*="col-"] {
    grid-column: span 1;
  }
}`,
      description: 'Bootstrap uslubidagi 12 ustunli grid tizimi',
    },
  ],
  interviewQA: [
    {
      question: 'auto-fill va auto-fit qanday farqlanadi? Qachon qaysi biri kerak?',
      answer: `Ikkalasi ham repeat() ichida ishlatiladi va dinamik ravishda ustun sonini aniqlaydi.

auto-fill: mavjud joyga sig'adigan MAKSIMAL ustun yaratadi, hatto bo'sh bo'lsa ham. Masalan, 3 ta item, 1200px container, minmax(200px, 1fr) — 6 ta ustun yaratadi, 3 tasi bo'sh qoladi.

auto-fit: xuddi shunday ustun yaratadi, lekin bo'sh ustunlarni 0px ga qisqartiradi va mavjud itemlarni cho'zadi. Yuqoridagi misolda 3 ta item har biri 400px bo'ladi.

Qachon: aksariyat hollarda auto-fit yaxshiroq — elementlar mavjud joyni to'liq egallaydi. auto-fill faqat bo'sh joy/katak ko'rinishi kerak bo'lganda ishlatiladi (masalan, calendar grid).`,
    },
    {
      question: 'fr unit qanday ishlaydi? Foiz (%) dan farqi nima?',
      answer: `fr (fraction) — gridda bo'sh joydan ulush olish birligi. 1fr = mavjud bo'sh joyning 1 ulushi.

Foizdan farqi:
1. fr gap ni hisobga oladi, % olmaydi. 3 ta 33.33% + gap = overflow. 3 ta 1fr + gap = mukammal.
2. fr FAQAT bo'sh joyni taqsimlaydi. 200px + 1fr = 200px qattiq, qolgani 1fr.
3. fr minmax bilan ishlaydi: minmax(200px, 1fr) — kamida 200px, qolgani bo'linadi.
4. % ota elementga nisbatan, fr esa FAQAT grid ichidagi bo'sh joyga nisbatan.

Hisoblash: grid-template-columns: 200px 2fr 1fr; container = 800px, gap = 0.
Bo'sh joy = 800 - 200 = 600px. 2fr = 400px, 1fr = 200px.`,
    },
    {
      question: 'Grid bilan implicit va explicit track farqi nima?',
      answer: `Explicit tracks — grid-template-columns/rows bilan aniq belgilangan tracklar. Siz ularning o'lchamini nazorat qilasiz.

Implicit tracks — grid avtomatik yaratgan tracklar. Masalan, 3 ustun belgiladingiz, lekin 5 ta item bor — 2-qator IMPLICIT yaratiladi.

Implicit track o'lchamini boshqarish:
  grid-auto-rows: 200px;
  grid-auto-rows: minmax(100px, auto);
  grid-auto-columns: 1fr;
  grid-auto-flow: row | column | dense;

grid-auto-flow: dense — bo'sh joylarni to'ldirish uchun kichik elementlarni oldinga suradi. Gallery/masonry ko'rinish uchun foydali, lekin tartib buziladi.

MUHIM: implicit tracklarda fr ishlamaydi (bo'sh joy aniq emas), minmax(min, auto) ishlating.`,
    },
    {
      question: 'grid-template-areas ishlatishning afzalliklari va kamchiliklari?',
      answer: `Afzalliklari:
1. Vizual tushunarliligi yuqori — CSS da sahifa tuzilmasini "ko'rish" mumkin.
2. Responsive design oson — media query da areas ni qayta yozish yetarli, elementga tegish shart emas.
3. Nomlash — "header", "sidebar" kabi mantiqiy nomlar, raqamlar emas.
4. Xato qilish qiyin — noto'g'ri area nomi xato beradi.

Kamchiliklari:
1. Faqat to'rtburchak (rectangular) arealar yaratish mumkin — L-shakl, T-shakl bo'lmaydi.
2. Har bir qator bir xil ustun soniga ega bo'lishi SHART.
3. Katta gridlarda string yozish noqulay bo'lishi mumkin.
4. Dinamik grid (noma'lum element soni) uchun yaramaydi — auto-fill/auto-fit yaxshiroq.

Tavsiya: Sahifa tuzilmasi (header/sidebar/main/footer) uchun areas ideal. Dinamik card grid uchun repeat(auto-fit, ...) ishlatiladi.`,
    },
    {
      question: 'Subgrid nima va qanday muammoni hal qiladi?',
      answer: `Subgrid — ichki (nested) grid elementiga ota grid chiziqlarini meros qilib berish.

Muammo: Card grid da har bir card ichidagi sarlavha, tavsif, tugma turli balandlikda — vizual tartibsiz ko'rinadi. Oldin buni faqat JavaScript yoki qattiq balandlik bilan hal qilish mumkin edi.

Yechim: card ga display: grid; grid-template-rows: subgrid; grid-row: span 3; berish. Endi card ichidagi 3 qator ota gridning qator chiziqlari bilan sinxronlashadi — barcha cardlarda sarlavha bir xil balandlikda, tavsif bir xil balandlikda.

Subgrid faqat bir o'qda ham ishlaydi: grid-template-columns: subgrid yoki grid-template-rows: subgrid. Ikkalasini ham berish mumkin.

Browser support: Chrome 117+ (2023), Firefox 71+ (2019), Safari 16+ (2022) — production-ready.`,
    },
  ],
}
