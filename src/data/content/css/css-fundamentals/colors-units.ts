import type { Topic } from '../../../types'

export const colorsUnits: Topic = {
  id: 'colors-units',
  title: 'Ranglar va birliklar',
  importance: 2,
  status: 'to-learn',
  description: 'Ranglar (hex, rgb, hsl), birliklar (px, em, rem, vw, vh, %), calc()',
  content: `CSS da ranglar va o'lchov birliklarini to'g'ri tanlash — dizayn sifati va responsive layout uchun muhim. Har bir birlik va rang formatining o'z qo'llanilish joyi bor.

═══════════════════════════════════════
  RANG FORMATLARI
═══════════════════════════════════════

Nomlangan ranglar:
  color: red; blue; transparent;

HEX (#RRGGBB):
  color: #ff0000;     — qizil
  color: #f00;        — qisqartma (RR=ff, GG=00, BB=00)
  color: #ff000080;   — alpha bilan (80 = 50%)

RGB / RGBA:
  color: rgb(255, 0, 0);        — qizil
  color: rgba(255, 0, 0, 0.5);  — 50% shaffof
  color: rgb(255 0 0 / 50%);    — zamonaviy sintaksis

HSL / HSLA:
  color: hsl(0, 100%, 50%);     — qizil
  H = Hue (rang, 0-360 daraja)
  S = Saturation (to'yinganlik, 0-100%)
  L = Lightness (yorqinlik, 0-100%)

HSL AFZALLIGI: rangni o'zgartirish oson:
  hsl(0, 100%, 50%)   — qizil
  hsl(120, 100%, 50%) — yashil
  hsl(240, 100%, 50%) — ko'k
  Faqat H ni o'zgartiring — boshqa rang olasiz.

Zamonaviy:
  color: oklch(0.7 0.15 150);  — perseptual rang fazosi

═══════════════════════════════════════
  MUTLAQ BIRLIKLAR
═══════════════════════════════════════

px   — piksel (eng keng tarqalgan)
cm   — santimetr (chop etish uchun)
mm   — millimetr
in   — dyuym
pt   — nuqta (1pt = 1/72in)

═══════════════════════════════════════
  NISBIY BIRLIKLAR
═══════════════════════════════════════

em   — OTA element shrift hajmiga nisbatan
       (agar font-size: 16px, keyin 2em = 32px)
       Ichma-ich ishlatilsa kaskadlanadi!

rem  — ROOT (:root/html) shrift hajmiga nisbatan
       (html { font-size: 16px }, keyin 2rem = 32px)
       Kaskadlanmaydi — BAROYATLI va bashorat qilinadi

%    — ota elementga nisbatan
       (width: 50% — ota kengligining yarmi)

vw   — viewport kengligi (1vw = 1%)
vh   — viewport balandligi (1vh = 1%)
vmin — viewport kichik o'lchami
vmax — viewport katta o'lchami

dvh  — dynamic viewport height (mobil brauzer toolbar)
svh  — small viewport height
lvh  — large viewport height

═══════════════════════════════════════
  QACHON NIMANI ISHLATISH?
═══════════════════════════════════════

font-size  → rem (bashorat qilinadigan, accessible)
padding    → rem yoki em
border     → px (aniq, o'zgarmaydi)
width      → %, vw, yoki maxsus birlik
gap        → rem
media query → em yoki rem (brauzer settings bilan ishlaydi)

═══════════════════════════════════════
  CALC() FUNKSIYASI
═══════════════════════════════════════

calc() — turli birliklarni ARALASHTIRIB hisoblash:
  width: calc(100% - 300px);
  height: calc(100vh - 80px);
  font-size: calc(1rem + 0.5vw);

Arifmetik operatsiyalar: +, -, *, /
+ va - atrofida BO'SH JOY kerak: calc(100% - 20px)`,

  codeExamples: [
    {
      title: 'Rang formatlari',
      language: 'css',
      description: 'Turli rang formatlarini ishlatish',
      code: `/* HEX */
.hex { color: #3b82f6; }
.hex-alpha { color: #3b82f680; } /* 50% shaffof */

/* RGB */
.rgb { color: rgb(59, 130, 246); }
.rgba { color: rgb(59 130 246 / 50%); }

/* HSL — ranglarni boshqarish oson */
:root {
  --primary-h: 217;
  --primary-s: 91%;
  --primary-l: 60%;
}
.hsl {
  color: hsl(var(--primary-h), var(--primary-s), var(--primary-l));
}
.hsl-light {
  /* Faqat lightness o'zgartiriladi */
  color: hsl(var(--primary-h), var(--primary-s), 80%);
}
.hsl-dark {
  color: hsl(var(--primary-h), var(--primary-s), 30%);
}

/* currentColor — hozirgi matn rangini meros qiladi */
.icon {
  border: 2px solid currentColor;
  fill: currentColor;
}`,
    },
    {
      title: 'O\'lchov birliklari',
      language: 'css',
      description: 'px, em, rem, vw, vh amaliy qo\'llanishi',
      code: `/* rem — asosiy birlik (root ga nisbatan) */
html { font-size: 16px; } /* 1rem = 16px */

h1 { font-size: 2.5rem; }    /* 40px */
h2 { font-size: 2rem; }      /* 32px */
p  { font-size: 1rem; }      /* 16px */
small { font-size: 0.875rem; } /* 14px */

/* em — ota ga nisbatan (ehtiyot bo'ling!) */
.parent { font-size: 20px; }
.parent .child { font-size: 1.5em; }  /* 30px */
.parent .child .grandchild {
  font-size: 1.5em; /* 45px! (kaskad) */
}

/* Viewport birliklar */
.hero {
  height: 100vh;        /* to'liq ekran */
  height: 100dvh;       /* mobil da to'g'ri ishlaydi */
}

.full-width {
  width: 100vw;
  margin-left: calc(-50vw + 50%);
}

/* % — ota ga nisbatan */
.sidebar { width: 25%; }
.content { width: 75%; }`,
    },
    {
      title: 'calc() bilan hisoblash',
      language: 'css',
      description: 'Turli birliklarni aralashtirish',
      code: `/* Sidebar chegirib qolgan joy */
.main-content {
  width: calc(100% - 280px);
  margin-left: 280px;
}

/* Navbar balandligini chegirib */
.page {
  min-height: calc(100vh - 64px);
  padding-top: 64px;
}

/* Responsive font-size */
h1 {
  font-size: calc(1.5rem + 2vw);
  /* 320px ekranda: 24px + 6.4px = ~30px */
  /* 1200px ekranda: 24px + 24px = 48px */
}

/* clamp() — min, ideal, max */
.title {
  font-size: clamp(1.5rem, 2.5vw + 1rem, 3rem);
  /* Minimum: 1.5rem (24px) */
  /* Ideal: 2.5vw + 1rem */
  /* Maximum: 3rem (48px) */
}

/* Grid gap bilan calc */
.grid {
  --columns: 3;
  --gap: 16px;
  display: grid;
  gap: var(--gap);
  grid-template-columns: repeat(
    var(--columns),
    calc((100% - (var(--columns) - 1) * var(--gap)) / var(--columns))
  );
}`,
    },
  ],

  interviewQA: [
    {
      question: 'em va rem farqi nima?',
      answer: 'em — OTA element shrift hajmiga nisbatan hisoblanadi. Ichma-ich ishlatilganda kaskadlanadi (16px > 1.5em=24px > 1.5em=36px). rem — ROOT (html) shrift hajmiga nisbatan. Har doim bir xil asosga ega — bashorat qilinadigan. Tavsiya: font-size uchun rem, padding/margin uchun rem yoki em. em faqat komponent ichida proporsional o\'lcham kerak bo\'lganda.',
    },
    {
      question: 'vw, vh, dvh farqi nima?',
      answer: 'vw — viewport kengligi 1%. vh — viewport balandligi 1%. Muammo: mobil brauzerda URL bar ochilsa/yopilsa viewport o\'zgaradi, 100vh noto\'g\'ri bo\'ladi. dvh (dynamic) — URL bar holatiga qarab o\'zgaradi. svh (small) — eng kichik viewport (URL bar ochiq). lvh (large) — eng katta viewport (URL bar yopiq). Mobil uchun 100dvh ishlatish tavsiya etiladi.',
    },
    {
      question: 'calc() va clamp() nima?',
      answer: 'calc() — CSS da turli birliklarni aralashtirib hisoblash: calc(100% - 300px), calc(1rem + 0.5vw). +, -, *, / operatorlari, + va - atrofida bo\'sh joy kerak. clamp(min, ideal, max) — qiymatni chegaralar ichida ushlab turadi: clamp(1rem, 2.5vw, 3rem). Responsive tipografiya va layout uchun juda qulay — media query kerak emas.',
    },
  ],

  relatedTopics: [
    { techId: 'css', sectionId: 'css-fundamentals', topicId: 'typography', label: 'Tipografiya' },
    { techId: 'css', sectionId: 'css-layout', topicId: 'responsive', label: 'Responsive dizayn' },
    { techId: 'css', sectionId: 'css-advanced', topicId: 'custom-properties', label: 'CSS Variables' },
  ],
}
