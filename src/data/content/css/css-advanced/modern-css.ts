import type { Topic } from '../../../types'

export const modernCss: Topic = {
  id: 'modern-css',
  title: 'Zamonaviy CSS',
  importance: 2,
  status: 'to-learn',
  description: ':has(), CSS Nesting, @layer, :is(), :where(), @scope, color-mix()',
  content: `ZAMONAVIY CSS — YANGI IMKONIYATLAR (2023-2025)
══════════════════════════════════════

CSS so'nggi yillarda jiddiy rivojlandi. Avval faqat
preprocessorlar (SCSS) bilan mumkin bo'lgan narsalar
endi native CSS da ishlaydi.

MUHIM: Bu xossalar barcha zamonaviy brauzerlarda
qo'llab-quvvatlanadi (Chrome, Firefox, Safari, Edge).
Eski brauzer kerak bo'lmasa — ishlatish mumkin.

══════════════════════════════════════
1. :has() — PARENT SELECTOR
══════════════════════════════════════

CSS tarixidagi eng katta yangilik. Ota elementni
child holatiga qarab stil berish.

  /* img bor card */
  .card:has(img) {
    grid-template-rows: 200px 1fr;
  }

  /* img YO'Q card */
  .card:not(:has(img)) {
    padding: 24px;
  }

  /* checked input bor label */
  label:has(input:checked) {
    background: #dbeafe;
    border-color: #3b82f6;
  }

  /* valid form — barcha required to'ldirilgan */
  form:has(:invalid) .submit-btn {
    opacity: 0.5;
    pointer-events: none;
  }

  /* Empty state */
  .list:has(> :first-child:last-child) {
    /* faqat 1 ta child bor */
  }

  .list:not(:has(*)) {
    /* bo'sh list — empty state ko'rsatish */
  }

MUHIM: :has() JUDA kuchli, lekin performance muammosi
bo'lishi mumkin. Murakkab :has() selectorlar layout
recalculation ni sekinlashtiradi. Oddiy selectorlar bilan ishlating.

══════════════════════════════════════
2. CSS NESTING
══════════════════════════════════════

SCSS kabi ichma-ich yozish — endi native CSS da:

  .card {
    padding: 16px;
    border-radius: 8px;

    .title {
      font-size: 1.25rem;
      font-weight: 600;
    }

    .body {
      color: var(--text-muted);
    }

    &:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    &.card--featured {
      border: 2px solid var(--primary);
    }

    @media (min-width: 768px) {
      padding: 24px;
    }
  }

Qoidalar:
  - & ixtiyoriy (element selectorlarda kerak emas)
  - .class, #id, [attr] to'g'ridan-to'g'ri yozish mumkin
  - Element nomlari (div, p) uchun & kerak: & p { }
  - @media, @container ichida ishlaydi

══════════════════════════════════════
3. @layer — CASCADE LAYERS
══════════════════════════════════════

CSS specificity muammolarini hal qilish — stillar
QATLAMLAR bo'yicha tartiblash:

  /* Tartib e'lon qilish */
  @layer reset, base, components, utilities;

  @layer reset {
    * { margin: 0; padding: 0; box-sizing: border-box; }
  }

  @layer base {
    body { font-family: "Inter", sans-serif; }
    a { color: var(--primary); }
  }

  @layer components {
    .btn { padding: 8px 16px; border-radius: 8px; }
    .card { padding: 16px; border: 1px solid var(--border); }
  }

  @layer utilities {
    .text-center { text-align: center; }
    .hidden { display: none; }
  }

Tartib muhim: KEYINGI layer YUQORI prioritet.
utilities > components > base > reset

@layer da specificity qoidasi:
  1. Unlayered stillar DOIM layered stillardan yuqori
  2. Layer tartibi specificity dan MUHIMROQ
  3. !important ters ishlaydi — birinchi layer yuqori

══════════════════════════════════════
4. :is() va :where() — SPECIFICITY CONTROL
══════════════════════════════════════

  /* :is() — selector ro'yxat (max specificity) */
  :is(h1, h2, h3, h4) {
    line-height: 1.2;
    font-weight: 700;
  }

  /* :where() — selector ro'yxat (0 specificity) */
  :where(h1, h2, h3, h4) {
    line-height: 1.2;
    font-weight: 700;
  }

Farqi: :is() ichidagi ENG YUQORI specificity ni oladi.
:where() DOIMO 0 specificity beradi — oson override qilish mumkin.

  /* :is() specificity = .class (0,1,0) */
  :is(.header, .footer) a { color: blue; }

  /* :where() specificity = element (0,0,0) */
  :where(.header, .footer) a { color: blue; }

Qachon :where(): default stillar, reset, base — oson override uchun.
Qachon :is(): aniq stillar, specificity muhim bo'lganda.

══════════════════════════════════════
5. @scope
══════════════════════════════════════

Stillarni ma'lum DOM subtree ga cheklash:

  @scope (.card) {
    .title { font-weight: 700; }
    .body { color: var(--text-muted); }
    img { border-radius: 8px; }
  }

  /* to limit — nested komponentga ta'sir qilmaydi */
  @scope (.card) to (.card__nested) {
    p { margin-bottom: 1em; }
    /* .card__nested ICHIDAGI p ga ta'sir QILMAYDI */
  }

MUHIM: @scope proximity (yaqinlik) bo'yicha ishlaydi.
Agar element ikkita scope ichida bo'lsa — eng yaqin scope
yutadi. Bu CSS Modules ga muqobil native yechim.

══════════════════════════════════════
6. color-mix() VA OKLCH
══════════════════════════════════════

  /* Ikki rangni aralashtirish */
  color-mix(in srgb, #3b82f6, white 20%)
  /* #3b82f6 ning 80% + white 20% = ochroq ko'k */

  color-mix(in oklch, var(--primary), black 30%)
  /* 30% qoraytirilgan primary */

  /* Hover rang yaratish */
  .btn {
    --bg: #3b82f6;
    background: var(--bg);
  }
  .btn:hover {
    background: color-mix(in oklch, var(--bg), black 15%);
  }

OKLCH — yangi rang modeli:
  color: oklch(70% 0.15 250);
  /* L: lightness (0-100%), C: chroma, H: hue */

Nima uchun oklch:
  - Perceptual uniformity — 50% lightness haqiqatan o'rtacha
  - HSL da 50% turli ranglar uchun turlicha ko'rinadi
  - Keng rang gamuti — P3 display qo'llab-quvvati

══════════════════════════════════════
7. ANCHOR POSITIONING
══════════════════════════════════════

Tooltip, popover, dropdown ni boshqa elementga
"bog'lash" — avval JavaScript kerak edi:

  .trigger {
    anchor-name: --my-trigger;
  }

  .tooltip {
    position: fixed;
    position-anchor: --my-trigger;
    top: anchor(bottom);
    left: anchor(center);
    translate: -50% 8px;
  }

MUHIM: Anchor positioning hali Chrome 125+ da.
Safari va Firefox da to'liq qo'llab-quvvatlanmagan.
Production da hali ehtiyot bo'ling.`,
  codeExamples: [
    {
      title: ':has() — parent selector amaliy misollar',
      language: 'css',
      code: `/* ═══ :has() — PARENT SELECTOR ═══ */

/* Rasm bor card — boshqacha layout */
.card:has(img) {
  display: grid;
  grid-template-rows: 200px 1fr auto;
}

.card:not(:has(img)) {
  display: flex;
  flex-direction: column;
  padding: 24px;
}

/* ═══ FORM VALIDATION ═══ */
/* Invalid input bor fieldni qizil qilish */
.field:has(input:invalid:not(:placeholder-shown)) {
  --field-color: #ef4444;
}

.field:has(input:valid) {
  --field-color: #22c55e;
}

/* ═══ EMPTY STATE ═══ */
.list:not(:has(*)) {
  display: grid;
  place-items: center;
  min-height: 200px;
}

.list:not(:has(*))::after {
  content: "Hech narsa topilmadi";
  color: var(--text-muted);
}

/* ═══ SIBLING AWARENESS ═══ */
/* Checked checkbox yonidagi label */
label:has(+ input:checked),
label:has(> input:checked) {
  background: var(--primary);
  color: white;
}`,
      description: ':has() bilan parent va sibling ga stil berish',
    },
    {
      title: 'CSS Nesting — SCSS dan farqi',
      language: 'css',
      code: `/* ═══ NATIVE CSS NESTING ═══ */
.card {
  padding: 16px;
  border-radius: 12px;
  border: 1px solid var(--border);

  /* Child element — & ixtiyoriy */
  .card__title {
    font-size: 1.25rem;
    font-weight: 700;
    margin-bottom: 8px;
  }

  .card__body {
    color: var(--text-muted);
    line-height: 1.6;
  }

  /* Pseudo-class — & KERAK */
  &:hover {
    border-color: var(--primary);
    box-shadow: 0 4px 12px var(--shadow);
  }

  /* Modifier */
  &.card--featured {
    border-color: var(--primary);
    border-width: 2px;
  }

  /* Nested media query */
  @media (min-width: 768px) {
    padding: 24px;

    .card__title {
      font-size: 1.5rem;
    }
  }

  /* Element selector — & kerak */
  & p {
    margin-bottom: 1em;
  }

  & > img {
    border-radius: 8px 8px 0 0;
  }
}`,
      description: 'Native CSS nesting sintaksisi va qoidalari',
    },
    {
      title: '@layer — Cascade qatlamlari',
      language: 'css',
      code: `/* ═══ LAYER TARTIBI ═══ */
/* Keyingi = yuqori prioritet */
@layer reset, base, components, utilities;

/* ═══ RESET ═══ */
@layer reset {
  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  img, picture, video {
    display: block;
    max-width: 100%;
  }
}

/* ═══ BASE ═══ */
@layer base {
  body {
    font-family: "Inter", system-ui, sans-serif;
    line-height: 1.6;
    color: var(--text);
    background: var(--bg);
  }

  a {
    color: var(--primary);
    text-decoration: none;
  }
}

/* ═══ COMPONENTS ═══ */
@layer components {
  .btn {
    display: inline-flex;
    align-items: center;
    padding: 8px 16px;
    border-radius: var(--radius-md);
    font-weight: 600;
  }
}

/* ═══ UTILITIES ═══ */
@layer utilities {
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
  }
  .text-center { text-align: center; }
}

/* Unlayered — BARCHA layerlardan yuqori */
.override { color: red; }`,
      description: '@layer bilan CSS specificity muammolarini hal qilish',
    },
    {
      title: ':is(), :where() va color-mix()',
      language: 'css',
      code: `/* ═══ :is() — SELECTOR SHORTHAND ═══ */
/* Oldin: */
.header a:hover,
.footer a:hover,
.nav a:hover {
  color: var(--primary);
}

/* Keyin: */
:is(.header, .footer, .nav) a:hover {
  color: var(--primary);
}

/* ═══ :where() — 0 SPECIFICITY ═══ */
/* Base stillar — oson override uchun */
:where(h1, h2, h3, h4, h5, h6) {
  line-height: 1.2;
  font-weight: 700;
}

/* Bu qoida yuqoridagini oson override qiladi */
h2 {
  font-weight: 400;  /* ishlaydi, chunki :where = 0 */
}

/* ═══ color-mix() ═══ */
.btn {
  --bg: var(--primary);
  background: var(--bg);
}

.btn:hover {
  /* 15% qoraytirish */
  background: color-mix(in oklch, var(--bg), black 15%);
}

.btn:active {
  /* 25% qoraytirish */
  background: color-mix(in oklch, var(--bg), black 25%);
}

/* Shaffof variant */
.badge {
  background: color-mix(in srgb, var(--primary), transparent 85%);
  color: var(--primary);
}`,
      description: ':is() qisqartirish, :where() specificity, color-mix() ranglar',
    },
  ],
  interviewQA: [
    {
      question: ':has() selektori nima va CSS tarixida nima uchun inqilob hisoblanadi?',
      answer: `CSS da avval FAQAT pastga qarab (child, descendant) stil berish mumkin edi. Ota elementga child holatiga qarab stil berish — IMKONSIZ edi. :has() bu muammoni hal qildi.

Misol: .card:has(img) — rasmi bor kartochkaga boshqa layout berish. Avval bu faqat JavaScript yoki qo'shimcha klass bilan mumkin edi.

Qo'shimcha imkoniyatlar:
- Form validation: form:has(:invalid) .submit { opacity: 0.5 }
- Empty state: .list:not(:has(*)) — bo'sh list
- Quantity query: .grid:has(:nth-child(4)) — 4+ item bor grid
- Previous sibling: h2:has(+ p) — p dan oldingi h2

Performance ogohlantirishi: :has() bilan murakkab selectorlar brauzer uchun qimmat. :has(.a .b .c:hover) kabi chuqur selectorlardan saqlaning. Oddiy, bir darajali :has() ishlating.

Browser support: Chrome 105+, Safari 15.4+, Firefox 121+ — production-ready.`,
    },
    {
      question: '@layer qanday ishlaydi va qanday muammoni hal qiladi?',
      answer: `Muammo: katta loyihalarda CSS specificity "urushi" bo'ladi. !important ko'payib ketadi. Uchinchi tomon kutubxona stillarini override qilish qiyin.

@layer yechimi: stillarni QATLAMLARGA ajratish. Layer tartibi specificitydan MUHIMROQ — keyingi layer yutadi, hatto specificity past bo'lsa ham.

@layer reset, base, components, utilities;
reset = eng past prioritet, utilities = eng yuqori.

utilities layerdagi .text-center (specificity 0,1,0) components layerdagi .card .title (0,2,0) dan YUQORI, chunki layer tartibi specificitydan ustun.

!important teskari ishlaydi: reset layerdagi !important utilities layerdagi !important dan YUQORI. Bu CSS cascade spetsifikatsiyasiga mos.

Unlayered stillar BARCHA layerlardan yuqori. Bu mavjud kodni bosqichma-bosqich @layer ga ko'chirish imkonini beradi.

Real foyda: Tailwind CSS @layer bilan ishlaydi — base, components, utilities tartibi.`,
    },
    {
      question: ':is() va :where() qanday farqlanadi? Qachon qaysi birini ishlatish kerak?',
      answer: `:is() va :where() — ikkalasi ham selector ro'yxat qisqartirish uchun. Funktsional jihatdan bir xil. YAGONA farq — specificity.

:is(.a, .b) — ichidagi ENG YUQORI specificity ni oladi. :is(#id, .class) = #id specificity (1,0,0).

:where(.a, .b) — DOIMO 0 specificity (0,0,0). Qanchalik murakkab selector bo'lsa ham.

Qachon :is():
- Aniq, kuchli selectorlar kerak bo'lganda
- Oddiy qisqartirish: :is(h1, h2, h3) { color: blue }
- Specificity muhim bo'lganda

Qachon :where():
- Reset/base stillar — keyinchalik oson override qilish uchun
- Kutubxona/framework default stillar
- "Bu stilni har qanday selector override qila olsin" degan holat

Real misol: CSS framework :where() bilan default stillar yozadi. Loyiha kodi oddiy .class bilan override qiladi — !important kerak emas.`,
    },
    {
      question: 'CSS Nesting native va SCSS nesting qanday farqlanadi?',
      answer: `Umumiy jihat: ikkalasida ham ichma-ich yozish, & operator, nested media query ishlaydi.

Farqlar:

1. Element selector: SCSS da h1 { p { } } to'g'ridan-to'g'ri ishlaydi. Native CSS da & p { } yoki p { } (& boshida) kerak. Sabab: brauzer parser muammosi — element nomi bilan property nomi chalkashishi.

2. @extend: SCSS da bor, native CSS da yo'q.

3. Mixins: SCSS da @mixin/@include. Native CSS da yo'q (lekin custom properties bilan o'xshash pattern mumkin).

4. Compile vs Runtime: SCSS build vaqtida tekis CSS ga aylanadi. Native nesting brauzerda runtime da ishlaydi.

5. Nesting depth: ikkalasida ham chuqur nesting yomon amaliyot. 3+ daraja specificity oshiradi va kodni murakkablashtiradi.

Amaliy maslahat: SCSS ni preprocessor sifatida ishlatishda uning nesting SCSS ga compile bo'ladi (tekis). Native CSS nesting esa brauzerga nesting holida yuboriladi — brauzer tushunadi.`,
    },
    {
      question: '@scope nima va CSS Modules dan qanday farqlanadi?',
      answer: `@scope — stillarni ma'lum DOM subtree ga cheklash. Native CSS xossasi, build tool kerak emas.

@scope (.card) { .title { font-weight: 700 } }
Bu .title FAQAT .card ichida ishlaydi.

@scope (.card) to (.card__nested) — proximity scoping. .card ichida ishlaydi, lekin .card__nested ga KIRMAYDI. Bu nested komponentlarni himoya qiladi.

CSS Modules dan farqi:
1. CSS Modules: build tool (webpack/vite) kerak, class nomlarni hash qiladi (.title_abc123). Runtime da unique nomlar.
2. @scope: native CSS, build tool kerak emas. Class nomlar oddiy qoladi.
3. CSS Modules: JavaScript import kerak (import styles from "./card.module.css").
4. @scope: oddiy CSS fayl, import kerak emas.

@scope ning afzalligi: proximity — ikki scope orasida ENG YAQIN scope yutadi (specificity emas). Bu komponent tizimlar uchun intuitiv.

Hozirgi holat: @scope Chrome 118+, Safari 17.4+ da ishlaydi. Firefox hali qo'llab-quvvatlamaydi.`,
    },
  ],
}
