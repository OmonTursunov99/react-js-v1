import type { Topic } from '../../../types'

export const boxModel: Topic = {
  id: 'box-model',
  title: 'Box Model',
  importance: 3,
  status: 'to-learn',
  description: 'Content, padding, border, margin, box-sizing va margin collapse',
  content: `CSS Box Model — har bir HTML element "quti" (box) sifatida ko'riladi. Bu qutining 4 ta qatlami bor: content, padding, border, margin. Box Model ni tushunish — layout qurishning asosi.

═══════════════════════════════════════
  4 TA QATLAM
═══════════════════════════════════════

Ichkaridan tashqariga:

1. CONTENT — element kontenti (matn, rasm)
   width va height faqat shu qismga tegishli (content-box da)

2. PADDING — content va border orasidagi bo'sh joy
   padding: 16px; (barcha tomondan)
   padding: 10px 20px; (vertikal | gorizontal)
   padding-top, padding-right, padding-bottom, padding-left

3. BORDER — quti chegarasi
   border: 1px solid #e5e7eb;
   border-width, border-style, border-color
   border-radius — burchak yumaloqlash

4. MARGIN — elementlar orasidagi tashqi bo'sh joy
   margin: 16px; (barcha tomondan)
   margin: 0 auto; — gorizontal markazlashtirish
   Salbiy margin ham mumkin: margin-top: -10px;

═══════════════════════════════════════
  BOX-SIZING
═══════════════════════════════════════

Juda MUHIM xususiyat — width/height nimani hisoblashini belgilaydi:

content-box (default):
  width = faqat content
  Haqiqiy kenglik = width + padding + border
  Misol: width:200px + padding:20px + border:1px = 242px

border-box:
  width = content + padding + border
  Haqiqiy kenglik = width (ko'rsatilgan qiymat)
  Misol: width:200px = hammasi birgalikda 200px

GLOBAL QOIDA (deyarli BARCHA loyihalarda):
  *, *::before, *::after { box-sizing: border-box; }

═══════════════════════════════════════
  MARGIN COLLAPSE
═══════════════════════════════════════

FAQAT vertikal marginlar birlashadi (collapse):
  <div> margin-bottom: 30px </div>
  <div> margin-top: 20px </div>
  Natija: oraliq 30px (EMAS 50px)

Qoidalar:
  - Faqat VERTIKAL marginlar (top/bottom)
  - Faqat BLOCK elementlar
  - Katta margin qo'llanadi
  - Flexbox va Grid ichida collapse YO'Q

Collapse SODIR BO'LMAYDI:
  - Gorizontal marginlar
  - Flex/Grid elementlar
  - Float elementlar
  - Orada padding/border bo'lsa

═══════════════════════════════════════
  DISPLAY VA BOX MODEL
═══════════════════════════════════════

block  — to'liq qator egallaydi, width/height ishlaydi
inline — kontent qadari joy, width/height ISHLAMAYDI
inline-block — qatorda, lekin width/height ishlaydi

═══════════════════════════════════════
  OUTLINE VA BOX-SHADOW
═══════════════════════════════════════

outline — border ga o'xshash, lekin layout ni O'ZGARTIRMAYDI
  (accessibility uchun focus outline muhim!)
box-shadow — quti soyasi (layout ga ta'sir qilmaydi)`,

  codeExamples: [
    {
      title: 'box-sizing: border-box',
      language: 'css',
      description: 'Global border-box va content-box farqi',
      code: `/* GLOBAL QOIDA — har bir loyihada qo'ying */
*, *::before, *::after {
  box-sizing: border-box;
}

/* === FARQ NAMUNASI === */

/* content-box (default) */
.content-box {
  box-sizing: content-box;
  width: 200px;
  padding: 20px;
  border: 2px solid #333;
  /* Haqiqiy kenglik: 200 + 40 + 4 = 244px */
}

/* border-box */
.border-box {
  box-sizing: border-box;
  width: 200px;
  padding: 20px;
  border: 2px solid #333;
  /* Haqiqiy kenglik: 200px (padding va border ichida) */
  /* Content kengligi: 200 - 40 - 4 = 156px */
}`,
    },
    {
      title: 'Margin collapse',
      language: 'css',
      description: 'Vertikal margin birlashishi va oldini olish',
      code: `/* Margin collapse MISOLI */
.block-a {
  margin-bottom: 30px;
  background: #3b82f6;
  padding: 16px;
  color: white;
}

.block-b {
  margin-top: 20px;
  background: #ef4444;
  padding: 16px;
  color: white;
}
/* Natija: oraliq 30px (kattasi), 50px EMAS */

/* Collapse ni OLDINI OLISH usullari: */

/* 1. Flex container */
.container-flex {
  display: flex;
  flex-direction: column;
  gap: 20px; /* margin o'rniga gap */
}

/* 2. Padding yoki border qo'shish */
.container-padding {
  padding-top: 1px; /* collapse buzadi */
}

/* 3. overflow */
.container-overflow {
  overflow: hidden; /* yangi BFC yaratadi */
}`,
    },
    {
      title: 'Box Model qatlamlari',
      language: 'css',
      description: 'Content, padding, border, margin qo\'llanishi',
      code: `.card {
  /* Content */
  width: 300px;
  min-height: 200px;

  /* Padding — ichki bo'sh joy */
  padding: 24px;

  /* Border — chegara */
  border: 1px solid #e5e7eb;
  border-radius: 12px;

  /* Margin — tashqi bo'sh joy */
  margin: 16px;
  margin: 0 auto; /* gorizontal markazlashtirish */

  /* Qo'shimcha */
  outline: none; /* focus uchun alohida boshqarish */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  /* Box sizing */
  box-sizing: border-box;
  /* width: 300px = content + padding + border */
}

/* Inline element — width/height ISHLAMAYDI */
span {
  width: 200px;  /* e'tiborsiz */
  height: 100px; /* e'tiborsiz */
  padding: 4px 8px; /* faqat gorizontal ishlaydi to'g'ri */
}

/* Inline-block — qatorda + width/height ishlaydi */
span.badge {
  display: inline-block;
  width: 100px;  /* ISHLAYDI */
  height: 30px;  /* ISHLAYDI */
}`,
    },
  ],

  interviewQA: [
    {
      question: 'CSS Box Model nima va qanday qatlamlari bor?',
      answer: 'Har bir HTML element quti (box) sifatida ko\'riladi. 4 qatlam (ichkaridan tashqariga): 1) Content — kontent maydoni (matn, rasm). 2) Padding — content va border orasidagi bo\'sh joy. 3) Border — quti chegarasi. 4) Margin — elementlar orasidagi tashqi bo\'sh joy. width/height sukut bo\'yicha faqat content ga tegishli (content-box), border-box da esa padding va border ham kiradi.',
    },
    {
      question: 'box-sizing: border-box nima uchun ishlatiladi?',
      answer: 'Sukut bo\'yicha (content-box) width faqat content ga tegishli — padding va border qo\'shilganda element kattaroq bo\'ladi. border-box da width = content + padding + border, ya\'ni ko\'rsatilgan qiymat haqiqiy o\'lcham bo\'ladi. Bu layout hisoblashni soddalashtiradi. Shuning uchun global * { box-sizing: border-box } deyarli barcha loyihalarda ishlatiladi.',
    },
    {
      question: 'Margin collapse nima va qanday oldini olish mumkin?',
      answer: 'Margin collapse — ikkita vertikal margin birlashib, kattasi qo\'llanishi. Faqat block elementlarning vertikal (top/bottom) marginlarida sodir bo\'ladi. Oldini olish: 1) Flexbox yoki Grid ishlatish (collapse yo\'q). 2) gap xususiyati. 3) Padding yoki border qo\'shish. 4) overflow: hidden (yangi BFC). Gorizontal marginlar hech qachon collapse bo\'lmaydi.',
    },
  ],

  relatedTopics: [
    { techId: 'css', sectionId: 'css-fundamentals', topicId: 'display-positioning', label: 'Display va Positioning' },
    { techId: 'css', sectionId: 'css-layout', topicId: 'flexbox', label: 'Flexbox' },
  ],
}
