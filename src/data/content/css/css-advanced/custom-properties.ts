import type { Topic } from '../../../types'

export const customProperties: Topic = {
  id: 'custom-properties',
  title: 'CSS Variables',
  importance: 3,
  status: 'to-learn',
  description: 'Custom properties, cascade, themes, @property, JS integration',
  content: `CSS CUSTOM PROPERTIES (VARIABLES)
══════════════════════════════════════

CSS o'zgaruvchilari (custom properties) — CSS da qayta
ishlatiladigan qiymatlarni saqlash va boshqarish mexanizmi.
SCSS variablellardan farqli, ular runtime da ishlaydi va
cascade/inheritance qoidalariga bo'ysunadi.

MUHIM: CSS variables — faqat "o'zgaruvchi" emas, ular
CSS cascade tizimining to'liq a'zosi. Bu ularni SCSS
variablelardan tubdan farqlaydi.

══════════════════════════════════════
1. ASOSIY SINTAKSIS
══════════════════════════════════════

  /* Aniqlash (e'lon qilish) */
  :root {
    --color-primary: #3b82f6;
    --color-text: #1f2937;
    --spacing-md: 16px;
    --font-body: "Inter", sans-serif;
    --border-radius: 8px;
  }

  /* Ishlatish */
  .button {
    background: var(--color-primary);
    padding: var(--spacing-md);
    font-family: var(--font-body);
    border-radius: var(--border-radius);
  }

  /* Fallback qiymat */
  color: var(--color-accent, #f59e0b);
  /* --color-accent bo'lmasa, #f59e0b ishlatiladi */

  /* Nested fallback */
  color: var(--theme-color, var(--color-primary, blue));

MUHIM: --variable nomi case-sensitive.
--Color va --color — IKKI TURLI o'zgaruvchi.

══════════════════════════════════════
2. CASCADE VA INHERITANCE
══════════════════════════════════════

CSS variables oddiy CSS xossalar kabi cascade qoidalariga
bo'ysunadi va inheritance orqali child elementlarga o'tadi.

  :root {
    --color: blue;       /* global */
  }

  .sidebar {
    --color: green;      /* sidebar ichida override */
  }

  .sidebar .link {
    color: var(--color);  /* green — inheritance */
  }

  .main .link {
    color: var(--color);  /* blue — root dan */
  }

Scope bilan ishlash:
  /* Komponent o'z scopeida variable belgilaydi */
  .card {
    --card-padding: 16px;
    --card-radius: 8px;
    padding: var(--card-padding);
    border-radius: var(--card-radius);
  }

  .card--large {
    --card-padding: 24px;
    --card-radius: 12px;
    /* Boshqa CSS o'zgartirish kerak emas! */
  }

MUHIM: Bu pattern — API surface. Komponent ichki
qiymatlarini variables orqali expose qiladi.

══════════════════════════════════════
3. DYNAMIC THEMES — LIGHT/DARK
══════════════════════════════════════

  /* Light tema (default) */
  :root {
    --bg: #ffffff;
    --bg-secondary: #f3f4f6;
    --text: #1f2937;
    --text-secondary: #6b7280;
    --border: #e5e7eb;
    --primary: #3b82f6;
    --shadow: rgba(0, 0, 0, 0.1);
  }

  /* Dark tema */
  [data-theme="dark"] {
    --bg: #111827;
    --bg-secondary: #1f2937;
    --text: #f9fafb;
    --text-secondary: #9ca3af;
    --border: #374151;
    --primary: #60a5fa;
    --shadow: rgba(0, 0, 0, 0.4);
  }

  /* System preference */
  @media (prefers-color-scheme: dark) {
    :root:not([data-theme]) {
      --bg: #111827;
      --text: #f9fafb;
      /* ... dark qiymatlari ... */
    }
  }

Komponentlar FAQAT variable ishlatadi:
  .card {
    background: var(--bg-secondary);
    color: var(--text);
    border: 1px solid var(--border);
    box-shadow: 0 2px 8px var(--shadow);
  }
  /* Tema o'zgarganda card AVTOMATIK yangilanadi */

══════════════════════════════════════
4. MEDIA QUERY BILAN O'ZGARTIRISH
══════════════════════════════════════

  :root {
    --container-width: 100%;
    --font-size-h1: 1.75rem;
    --grid-columns: 1;
    --sidebar-width: 0px;
  }

  @media (min-width: 768px) {
    :root {
      --container-width: 720px;
      --font-size-h1: 2.25rem;
      --grid-columns: 2;
      --sidebar-width: 260px;
    }
  }

  @media (min-width: 1280px) {
    :root {
      --container-width: 1200px;
      --font-size-h1: 3rem;
      --grid-columns: 3;
      --sidebar-width: 300px;
    }
  }

  /* Ishlatish — media query qayta yozish SHART EMAS */
  .container { max-width: var(--container-width); }
  h1 { font-size: var(--font-size-h1); }
  .grid { grid-template-columns: repeat(var(--grid-columns), 1fr); }

══════════════════════════════════════
5. JAVASCRIPT BILAN ISHLASH
══════════════════════════════════════

  /* O'qish */
  getComputedStyle(element).getPropertyValue('--color-primary')

  /* Yozish (inline) */
  element.style.setProperty('--color-primary', '#ef4444')

  /* Global yozish */
  document.documentElement.style.setProperty('--primary', '#ef4444')

  /* O'chirish */
  element.style.removeProperty('--color-primary')

Amaliy misollar:
  - Sichqoncha pozitsiyasi: --mouse-x, --mouse-y
  - Scroll pozitsiyasi: --scroll-y
  - Tema switcher: data-theme atributini o'zgartirish
  - Foydalanuvchi sozlamalari: font-size, spacing

══════════════════════════════════════
6. @PROPERTY — TYPED CUSTOM PROPERTIES
══════════════════════════════════════

  @property --gradient-angle {
    syntax: "<angle>";
    initial-value: 0deg;
    inherits: false;
  }

  .gradient-box {
    background: linear-gradient(
      var(--gradient-angle), #3b82f6, #8b5cf6
    );
    transition: --gradient-angle 0.5s ease;
  }

  .gradient-box:hover {
    --gradient-angle: 180deg;
    /* ENDI gradient burchagi ANIMATSIYA bo'ladi! */
  }

MUHIM: @property siz gradient animatsiya bo'lmaydi,
chunki brauzer custom property turini bilmaydi.
@property turni e'lon qiladi va animatsiyaga imkon beradi.

syntax qiymatlari:
  "<color>"      — rang
  "<length>"     — px, rem, em
  "<percentage>" — %
  "<angle>"      — deg, rad
  "<number>"     — son
  "<integer>"    — butun son`,
  codeExamples: [
    {
      title: 'Design Token tizimi — CSS Variables bilan',
      language: 'css',
      code: `/* ═══ DESIGN TOKENS ═══ */
:root {
  /* Primitive tokens */
  --blue-50: #eff6ff;
  --blue-500: #3b82f6;
  --blue-600: #2563eb;
  --blue-700: #1d4ed8;
  --gray-50: #f9fafb;
  --gray-200: #e5e7eb;
  --gray-700: #374151;
  --gray-900: #111827;

  /* Semantic tokens */
  --color-primary: var(--blue-500);
  --color-primary-hover: var(--blue-600);
  --color-bg: white;
  --color-bg-secondary: var(--gray-50);
  --color-text: var(--gray-900);
  --color-text-muted: var(--gray-700);
  --color-border: var(--gray-200);

  /* Spacing scale */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;

  /* Typography */
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;

  /* Border radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-full: 9999px;
}`,
      description: 'Primitive va semantic token tizimi',
    },
    {
      title: 'Dark/Light Theme Switcher',
      language: 'css',
      code: `/* ═══ LIGHT THEME (default) ═══ */
:root {
  --bg: #ffffff;
  --bg-card: #f9fafb;
  --text: #111827;
  --text-muted: #6b7280;
  --border: #e5e7eb;
  --primary: #3b82f6;
  --primary-text: #ffffff;
  --shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* ═══ DARK THEME ═══ */
[data-theme="dark"] {
  --bg: #0f172a;
  --bg-card: #1e293b;
  --text: #f1f5f9;
  --text-muted: #94a3b8;
  --border: #334155;
  --primary: #60a5fa;
  --primary-text: #0f172a;
  --shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
}

/* ═══ SYSTEM PREFERENCE ═══ */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --bg: #0f172a;
    --bg-card: #1e293b;
    --text: #f1f5f9;
    --text-muted: #94a3b8;
    --border: #334155;
    --primary: #60a5fa;
    --primary-text: #0f172a;
    --shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
  }
}

/* Komponentlar faqat variable ishlatadi */
body {
  background: var(--bg);
  color: var(--text);
}

.card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
}`,
      description: 'data-theme atributi va system preference bilan dark mode',
    },
    {
      title: 'Component-level Variables — API pattern',
      language: 'css',
      code: `/* ═══ BUTTON COMPONENT API ═══ */
.btn {
  /* Public API — tashqaridan o'zgartirish mumkin */
  --btn-bg: var(--primary);
  --btn-color: white;
  --btn-padding-x: 16px;
  --btn-padding-y: 8px;
  --btn-radius: var(--radius-md);
  --btn-font-size: var(--text-base);

  /* Implementation */
  background: var(--btn-bg);
  color: var(--btn-color);
  padding: var(--btn-padding-y) var(--btn-padding-x);
  border-radius: var(--btn-radius);
  font-size: var(--btn-font-size);
  border: none;
  cursor: pointer;
}

/* Variantlar — faqat variableni o'zgartirish */
.btn--secondary {
  --btn-bg: transparent;
  --btn-color: var(--primary);
}

.btn--danger {
  --btn-bg: #ef4444;
}

.btn--lg {
  --btn-padding-x: 24px;
  --btn-padding-y: 12px;
  --btn-font-size: var(--text-lg);
}

/* ═══ CONTEXT OVERRIDE ═══ */
.dark-section .btn {
  --btn-bg: #60a5fa;
  --btn-color: #0f172a;
}`,
      description: 'Komponent public API sifatida CSS variables',
    },
    {
      title: '@property — animatsiyali gradient va rang',
      language: 'css',
      code: `/* ═══ GRADIENT ANGLE ANIMATSIYA ═══ */
@property --angle {
  syntax: "<angle>";
  initial-value: 0deg;
  inherits: false;
}

.gradient-border {
  --angle: 0deg;
  border: 2px solid transparent;
  background:
    linear-gradient(var(--bg), var(--bg)) padding-box,
    linear-gradient(var(--angle), #3b82f6, #8b5cf6) border-box;
  transition: --angle 0.5s ease;
}

.gradient-border:hover {
  --angle: 180deg;
}

/* ═══ RANG ANIMATSIYA ═══ */
@property --glow-color {
  syntax: "<color>";
  initial-value: #3b82f6;
  inherits: false;
}

.glow-button {
  --glow-color: #3b82f6;
  box-shadow: 0 0 20px var(--glow-color);
  transition: --glow-color 0.3s ease;
}

.glow-button:hover {
  --glow-color: #8b5cf6;
  /* shadow rangi SILLIQ o'zgaradi */
}

/* ═══ PROGRESS BAR ═══ */
@property --progress {
  syntax: "<percentage>";
  initial-value: 0%;
  inherits: false;
}

.progress {
  --progress: 0%;
  background: linear-gradient(
    90deg,
    #3b82f6 var(--progress),
    #e5e7eb var(--progress)
  );
  transition: --progress 0.5s ease;
}`,
      description: '@property bilan gradient, rang va foiz animatsiyalari',
    },
  ],
  interviewQA: [
    {
      question: 'CSS custom properties va SCSS variables qanday farqlanadi?',
      answer: `SCSS variables ($variable) — compile time da ishlaydi. Build vaqtida oddiy CSS qiymatlarga almashtiriladi. Runtime da o'zgartirish MUMKIN EMAS.

CSS custom properties (--variable) — runtime da ishlaydi. Brauzerda haqiqiy qiymat sifatida mavjud. JavaScript bilan o'zgartirish mumkin. Cascade va inheritance qoidalariga bo'ysunadi.

Asosiy farqlar:
1. Scope: SCSS global/local, CSS — cascade (selector bo'yicha).
2. Dynamic: CSS variables media query, hover, JS bilan o'zgaradi.
3. Inheritance: CSS variables child elementlarga meros o'tadi.
4. Fallback: var(--x, fallback) — runtime fallback.
5. Tema: CSS variables bilan dark mode almashtirish oson.

Amalda: SCSS mixinlar, looplar, hisob-kitoblar uchun. CSS variables — tema, dynamic qiymatlar, component API uchun. Ko'p loyihalarda ikkalasi birga ishlatiladi.`,
    },
    {
      question: 'CSS Variables bilan dark/light theme qilishning eng yaxshi usuli qanday?',
      answer: `Eng yaxshi pattern — semantic token tizimi + data atribut:

1. Primitive tokens: --blue-500, --gray-900 (ranglar pallitasi)
2. Semantic tokens: --color-bg, --color-text, --color-primary (ma'no bo'yicha)
3. :root da light, [data-theme="dark"] da dark qiymatlari
4. prefers-color-scheme bilan system preference

Komponentlar FAQAT semantic tokenlar ishlatadi: background: var(--color-bg). Tema o'zgarganda barcha komponentlar avtomatik yangilanadi.

JavaScript vazifasi: data-theme atributini o'zgartirish va localStorage ga saqlash. CSS transition bilan silliq o'tish: transition: background-color 0.3s, color 0.3s.

MUHIM: har bir rang uchun IKKI qiymat belgilash — light va dark. Yangi rang qo'shsangiz, ikkalasiga ham qo'shing. Aks holda dark modeda kontrast muammolari paydo bo'ladi.`,
    },
    {
      question: 'var() da fallback qanday ishlaydi? Nested fallback qachon kerak?',
      answer: `var(--property, fallback) — agar --property aniqlanmagan (undefined) bo'lsa, fallback ishlatiladi.

MUHIM: "aniqlanmagan" va "noto'g'ri qiymat" farqli. Agar --color: banana; bo'lsa, bu ANQLANGAN lekin noto'g'ri — fallback ishlamaydi, xossa invalid bo'ladi.

Nested fallback:
var(--theme-primary, var(--color-primary, #3b82f6))
1. --theme-primary bormi? Ha = ishlatadi
2. Yo'q = --color-primary bormi? Ha = ishlatadi
3. Yo'q = #3b82f6 ishlatadi

Qachon kerak:
1. Component API: komponent o'z defaultini beradi, lekin tashqaridan override qilish mumkin: color: var(--btn-color, var(--color-primary))
2. Tema fallback: yangi variable qo'shilganda eski kodda fallback ishlaydi
3. Progressive enhancement: yangi feature bor-yo'qligini tekshirish

Ogohlantirish: 3+ daraja nested fallback kodni murakkablashtiradi. 2 daraja odatda yetarli.`,
    },
    {
      question: '@property nima va qanday muammolarni hal qiladi?',
      answer: `@property — CSS Houdini ning bir qismi. Custom propertyga TUR (type) beradi: <color>, <length>, <angle>, <percentage>, <number>.

Hal qiladigan muammolar:

1. ANIMATSIYA: Oddiy custom property ANIMATSIYA bo'lmaydi — brauzer turini bilmaydi. @property bilan tur belgilansa, transition/animation ishlaydi. Masalan, gradient angle yoki rang o'zgarishi.

2. INITIAL VALUE: @property da initial-value belgilash mumkin. Oddiy custom property uchun fallback har joyda yozish kerak.

3. INHERITANCE CONTROL: inherits: false; bilan child elementlarga meros o'tishini to'xtatish.

4. TYPE SAFETY: noto'g'ri qiymat berilsa, initial-value ga qaytadi (oddiy custom property da esa butun xossa invalid bo'ladi).

Misol: gradient angle animatsiya — @property siz mumkin emas, chunki brauzer "0deg" dan "180deg" ga qanday o'tishni bilmaydi. @property syntax: "<angle>" bilan bu ishlaydi.

Browser support: Chrome 85+, Edge 85+, Safari 15.4+, Firefox 128+.`,
    },
    {
      question: 'CSS Variables bilan component API pattern qanday ishlaydi?',
      answer: `Component API pattern — komponent ichki qiymatlarini CSS variables orqali "expose" qilish. Tashqi kod faqat variableni o'zgartiradi, komponent CSS ga tegmaydi.

Misol:
.btn { --btn-bg: blue; --btn-size: 14px; background: var(--btn-bg); font-size: var(--btn-size); }
.btn--danger { --btn-bg: red; } — faqat variable o'zgaradi.

Afzalliklari:
1. Encapsulation: ichki CSS implementation yashirin, faqat API ochiq.
2. Variantlar: modifier klasslari oddiy — faqat variable override.
3. Context override: .dark-section .btn { --btn-bg: lightblue; }
4. Theming: global variable o'zgarsa, barcha komponentlar yangilanadi.

Kamchilik: ko'p variable bilan "API bloat" bo'lishi mumkin. Faqat haqiqatan tashqaridan o'zgartirish kerak bo'lgan qiymatlarni expose qiling.

Bu pattern Web Components (Shadow DOM) da ayniqsa muhim — CSS variables Shadow DOM dan o'tadi, oddiy selectorlar esa o'tmaydi.`,
    },
    {
      question: 'JavaScript dan CSS Variables bilan ishlashning real use-case lari qanday?',
      answer: `Real use-case lar:

1. Theme Switcher: document.documentElement.setAttribute("data-theme", "dark") yoki to'g'ridan-to'g'ri style.setProperty("--bg", "#111").

2. Mouse Tracking: mousemove eventda --mouse-x, --mouse-y ni yangilash. CSS da bu variablelar bilan gradient, shadow, transform boshqarish.

3. Scroll Progress: scroll eventda --scroll-progress: 0-100 yangilash. CSS da progress bar kengligi: width: calc(var(--scroll-progress) * 1%).

4. User Preferences: font-size slider — localStorage dan o'qib, --base-font-size yangilash.

5. Dynamic Spacing: resize observer bilan container o'lchamini --container-width ga yozish.

Performance MUHIM: JavaScript dan variable o'zgartirganda brauzer qayta render qiladi. Tez-tez o'zgaradigan variablelar (mouse, scroll) uchun requestAnimationFrame yoki throttle ishlatish kerak. Yaxshiroq variant: CSS alone yechim mavjudmi tekshiring — scroll-driven animations kabi.`,
    },
  ],
}
