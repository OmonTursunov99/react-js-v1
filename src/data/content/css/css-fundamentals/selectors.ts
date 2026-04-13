import type { Topic } from '../../../types'

export const selectors: Topic = {
  id: 'selectors',
  title: 'CSS Selektorlar',
  importance: 3,
  status: 'to-learn',
  description: 'Element, class, id, atribut, pseudo-class, pseudo-element va specificity',
  content: `CSS selektorlar — HTML elementlarni tanlash va ularga stil berish uchun ishlatiladi. Selektorlarni yaxshi bilish — CSS ning asosi. Specificity (ustunlik) qoidasini tushunish xatolarni oldini oladi.

═══════════════════════════════════════
  ASOSIY SELEKTORLAR
═══════════════════════════════════════

*           — barcha elementlar (universal)
div         — element nomi bo'yicha
.card       — class bo'yicha
#header     — id bo'yicha (yagona element)
div, p      — guruhlash (bir nechta selektor)

═══════════════════════════════════════
  KOMBINATOR SELEKTORLAR
═══════════════════════════════════════

div p       — avlod (descendant) — div ichidagi barcha p
div > p     — to'g'ridan-to'g'ri bola (child)
div + p     — birinchi keyingi aka-uka (adjacent sibling)
div ~ p     — barcha keyingi aka-ukalar (general sibling)

═══════════════════════════════════════
  ATRIBUT SELEKTORLAR
═══════════════════════════════════════

[href]           — href atributi bor
[type="text"]    — aniq qiymat
[class~="card"]  — so'z sifatida o'z ichiga oladi
[href^="https"]  — boshlanishi
[href$=".pdf"]   — tugashi
[href*="google"] — ichida bor
[data-theme="dark" i] — katta-kichik harfni e'tiborsiz

═══════════════════════════════════════
  PSEUDO-CLASSLAR
═══════════════════════════════════════

Holat (state):
  :hover     — sichqoncha ustida
  :focus     — fokusda
  :active    — bosilayotganda
  :visited   — tashrif buyurilgan havola
  :focus-visible — klaviatura fokusi (sichqoncha emas)
  :focus-within  — ichidagi element fokusda

Tuzilma (structural):
  :first-child   — birinchi bola
  :last-child    — oxirgi bola
  :nth-child(n)  — n-chi bola (2n — juft, 2n+1 — toq)
  :nth-of-type(n) — n-chi turdagi element
  :only-child    — yagona bola
  :empty         — bo'sh element
  :not(selector) — inkor

Forma:
  :checked    — belgilangan checkbox/radio
  :disabled   — o'chirilgan
  :required   — majburiy
  :valid      — validatsiyadan o'tgan
  :invalid    — validatsiyadan o'tmagan

═══════════════════════════════════════
  PSEUDO-ELEMENTLAR
═══════════════════════════════════════

::before      — element oldiga kontent
::after       — element ortiga kontent
::first-line  — birinchi qator
::first-letter — birinchi harf
::placeholder — placeholder matni
::selection   — tanlangan matn
::marker      — ro'yxat markeri

═══════════════════════════════════════
  SPECIFICITY (USTUNLIK)
═══════════════════════════════════════

Qaysi stil qo'llanishini belgilovchi qoida:

  Inline style    → 1,0,0,0
  #id             → 0,1,0,0
  .class, [attr], :pseudo-class → 0,0,1,0
  element, ::pseudo-element    → 0,0,0,1
  *               → 0,0,0,0

Ko'proq specificity = ustunlik.
Teng bo'lsa — oxirgi yozilgan qo'llanadi (cascade).
!important — barchasini yengadi (ISHLATMANG).`,

  codeExamples: [
    {
      title: 'Selektor turlari',
      language: 'css',
      description: 'Turli CSS selektorlar namunasi',
      code: `/* Element selektor */
p { color: #333; }

/* Class selektor */
.card { border: 1px solid #e5e7eb; border-radius: 8px; }

/* ID selektor */
#hero { background: linear-gradient(to right, #3b82f6, #8b5cf6); }

/* Kombinator: to'g'ridan-to'g'ri bola */
.nav > li { display: inline-block; }

/* Kombinator: birinchi keyingi aka-uka */
h2 + p { font-size: 1.2em; margin-top: 0; }

/* Atribut selektor */
a[href^="https"] { color: green; }
input[type="email"] { border-color: #3b82f6; }

/* Guruhlash */
h1, h2, h3 {
  font-family: 'Inter', sans-serif;
  line-height: 1.2;
}`,
    },
    {
      title: 'Pseudo-class va pseudo-element',
      language: 'css',
      description: 'Holat, tuzilma va kontent selektorlari',
      code: `/* Holat pseudo-classlari */
a:hover { text-decoration: underline; }
button:active { transform: scale(0.98); }
input:focus-visible { outline: 2px solid #3b82f6; }

/* Tuzilma pseudo-classlari */
li:first-child { font-weight: bold; }
li:last-child { border-bottom: none; }
tr:nth-child(2n) { background: #f9fafb; } /* juft qatorlar */
.list > :not(:last-child) { margin-bottom: 8px; }

/* Forma pseudo-classlari */
input:invalid { border-color: #ef4444; }
input:required::after { content: ' *'; color: red; }
input:disabled { opacity: 0.5; cursor: not-allowed; }

/* Pseudo-elementlar */
.quote::before {
  content: '\\201C'; /* ochuvchi qo'shtirnoq */
  font-size: 2em;
  color: #9ca3af;
}

.badge::after {
  content: attr(data-count);
  background: #ef4444;
  color: white;
  border-radius: 50%;
  padding: 2px 6px;
  font-size: 0.75em;
}

::selection {
  background: #3b82f6;
  color: white;
}`,
    },
    {
      title: 'Specificity hisoblash',
      language: 'css',
      description: 'Qaysi stil qo\'llanishini aniqlash',
      code: `/* Specificity: 0,0,0,1 — element */
p { color: black; }

/* Specificity: 0,0,1,0 — class */
.text { color: blue; }

/* Specificity: 0,0,1,1 — class + element */
p.text { color: green; }

/* Specificity: 0,1,0,0 — id */
#main { color: red; }

/* Specificity: 0,1,1,1 — id + class + element */
div#main .text { color: purple; }

/*
  Natija: <p class="text" id="main"> uchun:
  - p → 0,0,0,1 → black
  - .text → 0,0,1,0 → blue (ustun)
  - p.text → 0,0,1,1 → green (ustun)
  - #main → 0,1,0,0 → red (ustun)

  YUTADI: #main → red (0,1,0,0 eng katta)
*/

/* !important — ISHLATMANG (debug uchun ham yo'q) */
p { color: gold !important; } /* barchasini yengadi */`,
    },
  ],

  interviewQA: [
    {
      question: 'CSS specificity qanday hisoblanadi?',
      answer: 'Specificity 4 xonali son sifatida hisoblanadi: (inline, id, class, element). Inline style = 1,0,0,0. #id = 0,1,0,0. .class, [attr], :pseudo-class = 0,0,1,0. element, ::pseudo-element = 0,0,0,1. * = 0. Katta son ustun. Teng bo\'lsa — keyingi yozilgan yutadi. !important barchasini yengadi (lekin ishlatmang — kaskadni buzadi).',
    },
    {
      question: ':nth-child va :nth-of-type farqi nima?',
      answer: ':nth-child(n) — OTA ichidagi BARCHA bolalar orasidan n-chisini tanlaydi (turidan qat\'iy nazar). :nth-of-type(n) — faqat SHU TUR elementlar orasidan n-chisini tanlaydi. Masalan: p:nth-child(2) — ikkinchi BOLA p bo\'lsa tanlaydi. p:nth-of-type(2) — ikkinchi P ni tanlaydi (orada boshqa elementlar bo\'lsa ham).',
    },
    {
      question: 'Pseudo-class va pseudo-element farqi nima?',
      answer: 'Pseudo-class (:) — element HOLATI bo\'yicha tanlaydi (hover, focus, first-child, checked). DOM ga yangi element qo\'shmaydi. Pseudo-element (::) — element ichida VIRTUAL kontent yaratadi (::before, ::after, ::first-line). DOM da mavjud bo\'lmagan narsa yaratadi. Yozuvi ham farq qiladi: bitta ikki nuqta (:hover) va ikkita (::before).',
    },
    {
      question: '!important nima uchun ishlatilmasligi kerak?',
      answer: '!important CSS kaskad (cascade) qoidasini buzadi — specificity va tartibni e\'tiborsiz qoldiradi. Muammolari: 1) Debug qilish juda qiyin — qaysi stil qo\'llanganini topish murakkab. 2) Override qilishning yagona yo\'li — yana !important, bu esa "!important urushi" boshlaydi. 3) Kodni kengaytirish qiyin. Yechim: specificity ni to\'g\'ri boshqarish, CSS layers (@layer) ishlatish.',
    },
  ],

  relatedTopics: [
    { techId: 'css', sectionId: 'css-fundamentals', topicId: 'box-model', label: 'Box Model' },
    { techId: 'css', sectionId: 'css-advanced', topicId: 'methodologies', label: 'CSS Metodologiyalar' },
  ],
}
