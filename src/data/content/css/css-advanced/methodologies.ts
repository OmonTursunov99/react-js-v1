import type { Topic } from '../../../types'

export const methodologies: Topic = {
  id: 'methodologies',
  title: 'CSS Metodologiyalar',
  importance: 2,
  status: 'to-learn',
  description: 'BEM, CSS Modules, CSS-in-JS, Tailwind, Atomic CSS — qachon nima',
  content: `CSS METODOLOGIYALAR — STILLARNI BOSHQARISH
══════════════════════════════════════

Katta loyihalarda CSS ni tartibli saqlash uchun
metodologiya kerak. Har bir yondashuv muayyan
muammoni hal qiladi — universal "eng yaxshi" yo'q.

MUHIM: Loyiha va jamoa uchun eng mos birini tanlash
muhim. Loyiha davomida metodologiyani o'zgartirish
juda qimmat — boshidanoq to'g'ri tanlang.

══════════════════════════════════════
1. BEM — BLOCK ELEMENT MODIFIER
══════════════════════════════════════

Nomlash konventsiyasi: .block__element--modifier

  Block: mustaqil komponent (.card, .menu, .form)
  Element: block ning qismi (.card__title, .card__body)
  Modifier: holat/variant (.card--featured, .card--dark)

  .card { }
  .card__title { }
  .card__body { }
  .card__footer { }
  .card--featured { }
  .card--compact { }
  .card__title--large { }

Qoidalar:
  1. Element faqat blockga tegishli (card__title, card__body)
  2. Element ichida element BO'LMAYDI (card__title__icon NOTO'G'RI)
  3. Modifier alohida ishlatilMASYDI (class="card card--featured")
  4. Flat specificity — har doim BITTA klass

Afzalliklari:
  - Flat specificity — barcha selectorlar (0,1,0)
  - O'z-o'zini hujjatlovchi — nom tuzilmani ko'rsatadi
  - Collision yo'q — block nomi unique
  - Framework-independent — har qanday stekda ishlaydi

Kamchiliklari:
  - Uzun class nomlari
  - HTML da ko'p klasslar
  - Murakkab komponentlarda noqulay

══════════════════════════════════════
2. CSS MODULES
══════════════════════════════════════

Build tool (Webpack/Vite) class nomlarni hash qiladi:
  .title → .card_title_abc123

  /* card.module.css */
  .title { font-weight: 700; }
  .body { color: #6b7280; }

  /* Component.tsx */
  import styles from './card.module.css'
  <h2 className={styles.title}>...</h2>
  /* Natija: <h2 class="card_title_abc123">...</h2> */

composes — klasslarni birlashtirish:
  .base {
    padding: 16px;
    border-radius: 8px;
  }
  .primary {
    composes: base;
    background: blue;
    color: white;
  }

Afzalliklari:
  - Avtomatik scoping — nom konflikti mumkin EMAS
  - Oddiy CSS yozish (preprocessor kerak emas)
  - Dead code elimination — ishlatilmagan stillar o'chiriladi
  - TypeScript bilan ishlaydi (typed-css-modules)

Kamchiliklari:
  - Build tool kerak
  - Dynamic stillar qiyin (class bilan toggle)
  - Global stil berish alohida sintaksis: :global(.class)

══════════════════════════════════════
3. CSS-IN-JS
══════════════════════════════════════

Stillarni JavaScript ichida yozish.

styled-components:
  const Button = styled.button\`
    background: \${props => props.primary ? 'blue' : 'gray'};
    padding: 8px 16px;
    border-radius: 8px;
  \`
  <Button primary>Click</Button>

Emotion:
  const buttonStyle = css\`
    background: blue;
    padding: 8px 16px;
  \`
  <button css={buttonStyle}>Click</button>

Afzalliklari:
  - Dynamic stillar — props ga qarab
  - Avtomatik scoping
  - Co-location — stil va komponent birga
  - Tema tizimi (ThemeProvider)

Kamchiliklari:
  - Runtime performance — stillar JS da yaratiladi
  - Bundle size oshadi (kutubxona og'irligi)
  - SSR murakkabligi
  - React 19/Server Components bilan muammo

MUHIM: CSS-in-JS trendi pasaymoqda. styled-components
maintenance mode da. Zamonaviy alternativlar:
zero-runtime kutubxonalar (Vanilla Extract, Panda CSS).

══════════════════════════════════════
4. UTILITY-FIRST — TAILWIND CSS
══════════════════════════════════════

Har bir CSS xossa uchun alohida utility klass:

  <button class="bg-blue-500 text-white px-4 py-2
                 rounded-lg hover:bg-blue-600
                 transition-colors duration-200">
    Click me
  </button>

Tailwind afzalliklari:
  - CSS fayl yozish kerak emas (ko'p hollarda)
  - Design system built-in (spacing, colors, typography)
  - Responsive: sm:, md:, lg: prefixlar
  - Dark mode: dark: prefix
  - Purge — faqat ishlatilgan klasslar production da
  - Performance — runtime JS yo'q

Tailwind kamchiliklari:
  - HTML "iflos" ko'rinadi (ko'p klasslar)
  - Custom dizayn uchun konfiguratsiya
  - O'rganish egri chizig'i
  - HTML/JSX dan tashqarida stil qiyin

Tailwind v4 yangiliklari:
  - CSS-first konfiguratsiya (@theme)
  - Vite plugin (PostCSS emas)
  - Automatic content detection
  - @apply o'rniga CSS variables

══════════════════════════════════════
5. ATOMIC CSS
══════════════════════════════════════

Har bir CSS qoida faqat BITTA xossa belgilaydi:

  .d-flex { display: flex; }
  .p-4 { padding: 16px; }
  .bg-blue { background: blue; }

Tailwind = Atomic CSS ning eng mashhur implementatsiyasi.
Boshqa misollar: Tachyons, Basscss.

Farqi klassik yondashuvdan:
  Semantic: .card { display: flex; padding: 16px; }
  Atomic: class="d-flex p-4"

Atomic ning afzalligi: CSS fayl o'lchami O'SMAYDI.
10 000 komponent bo'lsa ham, atomic klasslar soni cheklangan.
Oddiy yondashuvda har yangi komponent CSS qo'shadi.

══════════════════════════════════════
6. TAQQOSLASH — QACHON NIMA
══════════════════════════════════════

BEM: kichik-o'rta loyihalar, framework-agnostic,
tushunarlilk muhim bo'lganda. Jamoa yangi bo'lganda.

CSS Modules: React/Vue loyihalar, komponent-based
arxitektura, avtomatik scoping kerak bo'lganda.

CSS-in-JS: dynamic stillar ko'p bo'lganda, tema
tizimi kerak bo'lganda. LEKIN performance muhim emas.

Tailwind: tez prototiplash, design system kerak,
jamoa CSS yozishni kamaytirmoqchi. Eng tez rivojlanish.

Aralash: ko'p loyihalarda aralash ishlatiladi.
Masalan: Tailwind + CSS Modules (murakkab komponentlar uchun).

MUHIM: "eng yaxshi" metodologiya YO'Q. Loyiha hajmi,
jamoa tajribasi va talablar hal qiladi.`,
  codeExamples: [
    {
      title: 'BEM — komponent misoli',
      language: 'css',
      code: `/* ═══ BEM NAMING ═══ */
/* Block */
.card {
  display: flex;
  flex-direction: column;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
}

/* Elements */
.card__image {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
}

.card__content {
  padding: 16px;
  flex: 1;
}

.card__title {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 8px;
}

.card__description {
  color: #6b7280;
  line-height: 1.6;
}

.card__footer {
  padding: 12px 16px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
}

/* Modifiers */
.card--featured {
  border-color: #3b82f6;
  border-width: 2px;
}

.card--compact .card__content {
  padding: 12px;
}

.card--horizontal {
  flex-direction: row;
}

.card--horizontal .card__image {
  width: 200px;
  aspect-ratio: auto;
}`,
      description: 'BEM konventsiyasi bilan card komponent',
    },
    {
      title: 'CSS Modules — scoped stillar',
      language: 'css',
      code: `/* ═══ button.module.css ═══ */

/* Asosiy stil */
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
}

.button:active {
  transform: scale(0.98);
}

/* Variantlar */
.primary {
  composes: button;
  background: #3b82f6;
  color: white;
}

.primary:hover {
  background: #2563eb;
}

.secondary {
  composes: button;
  background: transparent;
  color: #3b82f6;
  border: 1px solid #3b82f6;
}

/* O'lchamlar */
.small {
  padding: 4px 12px;
  font-size: 0.875rem;
}

.large {
  padding: 12px 24px;
  font-size: 1.125rem;
}

/* Global klass bilan birga */
.button :global(.icon) {
  width: 16px;
  height: 16px;
}

/* JSX: <button className={styles.primary}>
         Natija: class="button_abc12 primary_def34" */`,
      description: 'CSS Modules bilan scoped komponent stillari',
    },
    {
      title: 'Tailwind CSS — utility-first yondashuv',
      language: 'css',
      code: `/* ═══ TAILWIND KONFIGURATSIYA (v4) ═══ */
@import "tailwindcss";

@theme {
  --color-primary: #3b82f6;
  --color-primary-hover: #2563eb;
  --font-family-body: "Inter", sans-serif;
  --radius-card: 12px;
}

/* ═══ CUSTOM COMPONENT (kerak bo'lganda) ═══ */
/* Tailwind bilan ko'p hollarda CSS yozish kerak emas */
/* Lekin murakkab komponentlar uchun: */

@layer components {
  .btn {
    @apply inline-flex items-center justify-center
           gap-2 rounded-lg px-4 py-2 font-semibold
           transition-colors duration-200;
  }

  .btn-primary {
    @apply bg-primary text-white hover:bg-primary-hover;
  }
}

/* ═══ RESPONSIVE HTML MISOL ═══ */
/*
<div class="grid grid-cols-1 gap-4 p-4
            sm:grid-cols-2
            lg:grid-cols-3 lg:gap-6 lg:p-6">
  <div class="rounded-xl border p-4
              dark:border-gray-700 dark:bg-gray-800
              hover:shadow-lg transition-shadow">
    <h3 class="text-lg font-bold
               sm:text-xl">Title</h3>
    <p class="mt-2 text-gray-600
              dark:text-gray-400">Body</p>
  </div>
</div>
*/

/* Yuqoridagi HTML uchun alohida CSS kerak EMAS */`,
      description: 'Tailwind CSS v4 konfiguratsiya va utility patternlar',
    },
    {
      title: 'Metodologiyalar taqqoslash — bir xil komponent',
      language: 'css',
      code: `/* ═══ BEM ═══ */
.alert { padding: 16px; border-radius: 8px; border: 1px solid; }
.alert__icon { width: 20px; height: 20px; }
.alert__message { margin-left: 12px; }
.alert--success { border-color: #22c55e; background: #f0fdf4; }
.alert--error { border-color: #ef4444; background: #fef2f2; }
/* HTML: <div class="alert alert--success"> */

/* ═══ CSS MODULES (alert.module.css) ═══ */
.alert { padding: 16px; border-radius: 8px; border: 1px solid; }
.icon { width: 20px; height: 20px; }
.message { margin-left: 12px; }
.success { composes: alert; border-color: #22c55e; background: #f0fdf4; }
.error { composes: alert; border-color: #ef4444; background: #fef2f2; }
/* JSX: <div className={styles.success}> */

/* ═══ TAILWIND ═══ */
/* CSS fayl kerak EMAS */
/* HTML:
<div class="flex items-center gap-3 rounded-lg border
            border-green-500 bg-green-50 p-4">
  <svg class="h-5 w-5 text-green-600">...</svg>
  <p class="text-green-800">Success message</p>
</div>
*/

/* ═══ ATOMIC CSS (Tailwind siz) ═══ */
.d-flex { display: flex; }
.items-center { align-items: center; }
.gap-3 { gap: 12px; }
.p-4 { padding: 16px; }
.rounded-lg { border-radius: 8px; }
.border { border: 1px solid; }
.border-green { border-color: #22c55e; }
.bg-green-light { background: #f0fdf4; }`,
      description: 'Bir xil alert komponentni 4 metodologiya bilan yozish',
    },
  ],
  interviewQA: [
    {
      question: 'BEM metodologiyasini tushuntiring. Nima uchun element ichida element bo`lmaydi?',
      answer: `BEM: Block__Element--Modifier. Block = mustaqil komponent. Element = block ning qismi. Modifier = variant/holat.

Element ichida element nima uchun bo'lmaydi (.card__header__title NOTO'G'RI):
1. Flat tuzilma — selector doimo 1 daraja: .card__title (0,1,0 specificity)
2. DOM tuzilma o'zgarsa, CSS o'zgarmaydi. title header dan body ga ko'chsa, klass bir xil qoladi.
3. O'qilishi oson — .card__title tushunarliroq .card__header__title dan.

To'g'ri yondashuv: .card__title — element DOIMO blockga tegishli, oraliq elementga emas. Agar ichki tuzilma murakkab bo'lsa — ichki block yarating: .card-header (alohida block) va .card-header__title.

BEM ning asosiy kuchi: FLAT specificity. Barcha selectorlar (0,1,0). Specificity muammolari deyarli yo'q. !important kerak emas.`,
    },
    {
      question: 'CSS Modules qanday ishlaydi? Build vaqtida nima sodir bo`ladi?',
      answer: `CSS Modules — build tool (Webpack/Vite) tomonidan ishlatiladigan tizim.

Build vaqtida:
1. .module.css faylini o'qiydi
2. Har bir class nomga unique hash qo'shadi: .title -> .title_abc123
3. JS modulga mapping object export qiladi: { title: "title_abc123" }
4. CSS faylda ham nomni almashtiradi

Natija: bir xil nom boshqa komponentda ishlatilsa ham HECH QACHON to'qnashmaydi.

composes: klasslarni birlashtirish (SCSS @extend ga o'xshash, lekin build vaqtida ishlaydi):
.primary { composes: base; background: blue; }
-> class="base_xyz primary_abc" (ikki klass)

:global(.class) — hash qo'shilMASLIGINI bildiradi. Uchinchi tomon kutubxona klasslari uchun.

:local(.class) — default. Hash qo'shiladi.

Vite da CSS Modules default qo'llab-quvvatlanadi — faylga .module.css qo'shish yetarli. Alohida konfiguratsiya kerak emas.`,
    },
    {
      question: 'CSS-in-JS nima uchun kamroq ishlatilmoqda? Muqobillari qanday?',
      answer: `CSS-in-JS (styled-components, Emotion) kamchiliklari:

1. Runtime cost: stillar JS da generatsiya qilinadi va DOM ga inject qilinadi. Har render da style tag yangilanadi. Bu 10-20ms qo'shimcha vaqt olishi mumkin.

2. Bundle size: styled-components ~12KB gzip, Emotion ~7KB. SSR da ham qo'shimcha overhead.

3. React Server Components: RSC da CSS-in-JS ISHLAMAYDI — server da "document" yo'q, style inject qilib bo'lmaydi. Bu React 19 bilan katta muammo.

4. Hydration mismatch: SSR da client va server stillari farq qilishi mumkin.

Zamonaviy muqobillar (zero-runtime):
- Vanilla Extract: TypeScript da stillar, build vaqtida CSS ga compile. Runtime cost 0.
- Panda CSS: utility-first + CSS-in-JS DX, zero-runtime.
- StyleX (Meta): atomic CSS, compile time.
- Tailwind CSS: eng mashhur alternativa.

Trend: runtime CSS-in-JS -> zero-runtime yoki utility-first (Tailwind). styled-components rasmiy maintenance mode da (2024).`,
    },
    {
      question: 'Tailwind CSS ning afzalliklari va kamchiliklarini batafsil tushuntiring.',
      answer: `Afzalliklari:

1. Tezlik: CSS fayl yozmasdan UI qurish. Prototipdan productionga tez yo'l.
2. Consistency: built-in design system (spacing: 4px scale, ranglar, typography). Jamoa bir xil qiymatlar ishlatadi.
3. No dead CSS: faqat ishlatilgan klasslar production CSS ga kiradi. Odatda 10-30KB.
4. Responsive/Dark: sm:, md:, dark: prefixlar — alohida media query yozmasdan.
5. Performance: runtime JS yo'q. Build vaqtida CSS generatsiya.
6. Ecosystem: Tailwind UI, Headless UI, ko'p komponent kutubxonalar.

Kamchiliklari:

1. HTML readability: class="flex items-center gap-3 rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow dark:border-gray-700" — uzun.
2. Abstraction: murakkab komponentlar uchun @apply kerak, bu Tailwind falsafasiga zid.
3. Custom dizayn: standart classlardan tashqari qiymat kerak bo'lsa, arbitrary values: w-[137px] — lekin bu design system ni buzadi.
4. Team knowledge: barcha jamoa a'zolari Tailwind bilishi kerak.
5. Vendor lock-in: Tailwind dan boshqa tizimga o'tish qiyin.

Mening fikrim: 2024-2025 da eng mashhur CSS yondashduv. React + Tailwind + shadcn/ui = eng keng tarqalgan stek.`,
    },
    {
      question: 'Yangi loyiha boshlamoqchisiz. CSS metodologiyasini qanday tanlaysiz?',
      answer: `Tanlov mezonlari:

1. Jamoa tajribasi: jamoa nima biladi? BEM bilsa — BEM dan boshlang. Tailwind bilsa — Tailwind.

2. Loyiha turi:
   - Marketing sahifa / blog: Tailwind (tez, ko'p unique layout)
   - SaaS dashboard: CSS Modules + Tailwind (komponent tizim + utility)
   - Design system / UI kit: CSS Modules yoki Vanilla Extract (strict scoping)
   - Legacy loyihani yangilash: BEM (framework-agnostic)

3. Framework:
   - Next.js / React: CSS Modules default, Tailwind eng mashhur
   - Vue: Scoped styles built-in (<style scoped>)
   - Svelte: Scoped styles built-in

4. Performance talablari:
   - Eng tezkor: Tailwind (static CSS, runtime 0)
   - Yaxshi: CSS Modules (static CSS)
   - O'rtacha: CSS-in-JS zero-runtime (Vanilla Extract)
   - Eng sekin: CSS-in-JS runtime (styled-components)

5. Aralash strategiya: ko'p zamonaviy loyihalarda Tailwind asosiy + CSS Modules murakkab komponentlar uchun. Bu eng moslashuvchan yondashuv.

MUHIM: bir xil loyihada 3+ metodologiyani ARALASHIRMANG — chaos bo'ladi. Maksimum 2 ta: asosiy + qo'shimcha.`,
    },
    {
      question: 'Atomic CSS nima? Tailwind dan farqi bormi?',
      answer: `Atomic CSS — har bir CSS klass FAQAT BITTA xossa belgilaydi. d-flex = display: flex. p-4 = padding: 16px.

Tailwind = Atomic CSS ning eng mashhur implementatsiyasi + qo'shimchalar:
- Design token tizimi (ranglar, spacing, typography)
- Responsive prefixlar (sm:, md:, lg:)
- State prefixlar (hover:, focus:, dark:)
- JIT compiler (faqat ishlatilgan klasslar)
- Konfiguratsiya tizimi (tailwind.config)

Atomic CSS ning asosiy afzalligi: CSS FAYL O'LCHAMI O'SMAYDI.

Oddiy yondashuvda: 100 komponent = 100x CSS qoidalar. 1000 komponent = 1000x.
Atomic da: 100 komponent va 1000 komponent DEYARLI bir xil CSS o'lcham — atomic klasslar qayta ishlatiladi.

Facebook bu tamoyil asosida StyleX yaratdi: 100,000+ komponent, lekin CSS fayl atigi 100-200KB.

Kamchilik: HTML da ko'p klasslar. Lekin zamonaviy framework larda (React) komponent abstraksiyasi bu muammoni hal qiladi — uzun klass faqat komponent ichida ko'rinadi, ishlatish joy da <Button variant="primary" /> ko'rinadi.`,
    },
  ],
}
