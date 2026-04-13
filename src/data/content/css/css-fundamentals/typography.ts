import type { Topic } from '../../../types'

export const typography: Topic = {
  id: 'typography',
  title: 'Tipografiya',
  importance: 2,
  status: 'to-learn',
  description: 'Shrift xususiyatlari, matn xususiyatlari, @font-face va variable fonts',
  content: `Tipografiya — veb-dizaynning eng muhim qismlaridan biri. Yaxshi tipografiya o'qilishni osonlashtiradi, vizual ierarxiya yaratadi va sayt professional ko'rinishini ta'minlaydi.

═══════════════════════════════════════
  SHRIFT XUSUSIYATLARI
═══════════════════════════════════════

font-family — shrift oilasi:
  font-family: 'Inter', 'Segoe UI', sans-serif;
  Birinchi topilgan shrift ishlatiladi (fallback zanjir)

  Generic oilalar (oxirgi fallback sifatida):
    serif       — serifli (Times)
    sans-serif  — serifsiz (Arial)
    monospace   — teng kenglikli (Courier)
    cursive     — qo'lyozma
    system-ui   — tizim shrifti

font-size — shrift hajmi:
  font-size: 1rem;    — asosiy hajm
  font-size: clamp(1rem, 2.5vw, 2rem); — responsive

font-weight — qalinlik:
  normal (400), bold (700)
  100-900 oraliq (100 = eng ingichka, 900 = eng qalin)

font-style — stil:
  normal, italic, oblique

font-variant — variant:
  small-caps — kichik bosh harflar

line-height — qator balandligi:
  line-height: 1.5; — font-size ning 1.5 barobari
  Asosiy matn uchun 1.4-1.6 optimal

letter-spacing — harflar orasidagi masofa:
  letter-spacing: 0.05em;

font shorthand:
  font: italic 700 1.2rem/1.5 'Inter', sans-serif;
  (style weight size/line-height family)

═══════════════════════════════════════
  MATN XUSUSIYATLARI
═══════════════════════════════════════

text-align     — matn joylashuvi: left, center, right, justify
text-decoration — bezak: underline, line-through, none
text-transform  — harf: uppercase, lowercase, capitalize
text-indent    — birinchi qator boshi
text-overflow  — to'lib ketgan matn: ellipsis, clip
white-space    — bo'sh joy: nowrap, pre, pre-wrap
word-break     — so'z uzish: break-all, break-word
overflow-wrap  — uzun so'zlar: break-word

═══════════════════════════════════════
  @FONT-FACE — MAXSUS SHRIFT YUKLASH
═══════════════════════════════════════

@font-face — tashqi shrift fayllarini yuklash:
  @font-face {
    font-family: 'MyFont';
    src: url('/fonts/myfont.woff2') format('woff2');
    font-weight: 400;
    font-display: swap;
  }

font-display qiymatlari:
  auto   — brauzer tanlaydi
  swap   — darhol fallback ko'rsatadi, keyin almashtiradi (TAVSIYA)
  block  — qisqa vaqt kutadi
  fallback — juda qisqa kutish
  optional — tarmoq tez bo'lsa yuklaydi, aks holda fallback

═══════════════════════════════════════
  VARIABLE FONTS
═══════════════════════════════════════

Variable font — BITTA fayl ichida barcha qalinlik,
kenglik, kursiv variantlari:

  @font-face {
    font-family: 'Inter';
    src: url('Inter-Variable.woff2') format('woff2-variations');
    font-weight: 100 900; /* barcha qalinliklar */
  }

  font-variation-settings: 'wght' 450, 'wdth' 85;

Afzalliklari:
  - Kamroq fayl (10 ta alohida fayldan ko'ra 1 ta)
  - Istalgan qiymat (450, 375, ...)
  - Animatsiya mumkin`,

  codeExamples: [
    {
      title: 'Tipografiya tizimi',
      language: 'css',
      description: 'Responsive va izchil tipografiya sozlamalari',
      code: `/* Asosiy tipografiya */
:root {
  --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;

  /* Type scale (Major Third — 1.25) */
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.5rem;    /* 24px */
  --text-3xl: 1.875rem;  /* 30px */
  --text-4xl: 2.25rem;   /* 36px */
}

body {
  font-family: var(--font-sans);
  font-size: var(--text-base);
  line-height: 1.6;
  color: #1f2937;
  -webkit-font-smoothing: antialiased;
}

h1 {
  font-size: clamp(var(--text-2xl), 4vw, var(--text-4xl));
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

h2 {
  font-size: var(--text-2xl);
  font-weight: 700;
  line-height: 1.2;
}

code {
  font-family: var(--font-mono);
  font-size: 0.9em; /* ota shriftga nisbatan */
  background: #f3f4f6;
  padding: 0.1em 0.3em;
  border-radius: 3px;
}`,
    },
    {
      title: 'Matn stilizatsiyasi',
      language: 'css',
      description: 'Matn joylashuvi, to\'lib ketish va chiziq',
      code: `/* Matn qirqish — ellipsis */
.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Ko'p qatorli qirqish */
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Havola stillari */
a {
  color: #3b82f6;
  text-decoration: none;
  text-underline-offset: 3px;
}
a:hover {
  text-decoration: underline;
  text-decoration-thickness: 2px;
}

/* Matn tanlash */
::selection {
  background: #3b82f6;
  color: white;
}

/* Bosh harf katta */
.drop-cap::first-letter {
  font-size: 3.5em;
  float: left;
  line-height: 0.8;
  margin-right: 0.1em;
  font-weight: bold;
}`,
    },
    {
      title: '@font-face va variable font',
      language: 'css',
      description: 'Maxsus shrift yuklash va variable font ishlatish',
      code: `/* Oddiy @font-face */
@font-face {
  font-family: 'Inter';
  src: url('/fonts/Inter-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'Inter';
  src: url('/fonts/Inter-Bold.woff2') format('woff2');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

/* Variable Font — bitta faylda barcha qalinliklar */
@font-face {
  font-family: 'Inter Variable';
  src: url('/fonts/InterVariable.woff2')
       format('woff2') tech('variations');
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}

/* Istalgan qalinlik */
.light { font-weight: 300; }
.regular { font-weight: 400; }
.medium { font-weight: 500; }
.semibold { font-weight: 600; }
.bold { font-weight: 700; }

/* Animatsiya (faqat variable font) */
.animate-weight {
  transition: font-weight 0.3s ease;
}
.animate-weight:hover {
  font-weight: 700;
}`,
    },
  ],

  interviewQA: [
    {
      question: 'font-display: swap nima qiladi?',
      answer: 'font-display: swap — shrift yuklanmaguncha darhol fallback (tizim) shriftini ko\'rsatadi, shrift yuklanganida almashtiradi. Bu FOUT (Flash of Unstyled Text) yaratadi, lekin matn darhol ko\'rinadi — yaxshi UX. Alternativlar: block — qisqa vaqt bo\'sh joy ko\'rsatadi (FOIT), optional — tez tarmoqda yuklaydi, sekin da fallback qoladi. swap eng ko\'p tavsiya etiladi.',
    },
    {
      question: 'Variable fonts nima va oddiy shriftlardan farqi?',
      answer: 'Variable font — bitta fayl ichida barcha qalinlik, kenglik, kursiv variatsiyalari. Oddiy shrift: har bir variant (Regular, Bold, Italic) alohida fayl = ko\'p HTTP so\'rov va katta hajm. Variable font afzalliklari: 1) Kamroq fayl = tezroq yuklash. 2) Istalgan oraliq qiymat (450, 550). 3) CSS transition bilan animatsiya mumkin. 4) font-variation-settings bilan nozik sozlash.',
    },
    {
      question: 'Matnni qanday qirqish (truncate) mumkin?',
      answer: 'Bir qatorli: white-space: nowrap + overflow: hidden + text-overflow: ellipsis. Ko\'p qatorli: display: -webkit-box + -webkit-line-clamp: N + -webkit-box-orient: vertical + overflow: hidden. Hozirda -webkit- prefiksi hamma joyda ishlaydi. Yaqinda CSS da line-clamp standart xususiyat sifatida qo\'shilmoqda.',
    },
  ],

  relatedTopics: [
    { techId: 'css', sectionId: 'css-fundamentals', topicId: 'colors-units', label: 'Ranglar va birliklar' },
    { techId: 'css', sectionId: 'css-advanced', topicId: 'custom-properties', label: 'CSS Variables' },
  ],
}
