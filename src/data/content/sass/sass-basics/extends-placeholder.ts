import type { Topic } from '../../../types'

export const extendsPlaceholder: Topic = {
  id: 'extends-placeholder',
  title: '@extend va %placeholder',
  importance: 2,
  status: 'to-learn',
  description: '@extend bilan selector-larni birlashtirish va %placeholder selectors',
  content: `@extend — bitta selector-ning barcha CSS qoidalarini boshqa selector-ga "meros" sifatida berish. %placeholder — faqat extend uchun mo'ljallangan, o'zi CSS-ga compilatsiya qilinmaydigan selector.

═══════════════════════════════════════
  @EXTEND ASOSLARI
═══════════════════════════════════════

  .message {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  .success { @extend .message; color: green; }
  .error   { @extend .message; color: red; }

Natija CSS:
  .message, .success, .error {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  .success { color: green; }
  .error { color: red; }

Selectorlar GURUHLANADI — CSS takrorlanmaydi!

═══════════════════════════════════════
  %PLACEHOLDER SELECTOR
═══════════════════════════════════════

% bilan boshlangan selector CSS-ga compilatsiya QILINMAYDI —
faqat @extend orqali ishlatiladi:

  %visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
  }

  .sr-only { @extend %visually-hidden; }

Agar %visually-hidden hech joyda extend qilinmasa,
CSS-da umuman ko'rinmaydi — bu juda foydali!

═══════════════════════════════════════
  @EXTEND CHEKLOVLARI VA MUAMMOLARI
═══════════════════════════════════════

1. @media ichida ISHLAMAYDI:
   @media print {
     .footer { @extend .no-print; } // XATO!
   }

2. Kutilmagan selector guruhlash:
   Agar .message boshqa joylarda ham ishlatilsa,
   extend barcha o'sha selectorlarga ham qo'shiladi

3. Source order muammolari:
   Extend qilingan selector oldinroq joylashishi kerak

═══════════════════════════════════════
  @EXTEND vs @MIXIN
═══════════════════════════════════════

@extend:
  + CSS hajmi kichikroq (selectorlar guruhlanadi)
  - Parametr qabul qilmaydi
  - @media ichida ishlamaydi
  - Kutilmagan nojo'ya ta'sirlar

@mixin:
  + Parametr qabul qiladi
  + Har joyda ishlaydi
  + Bashorat qilinadigan natija
  - CSS takrorlanadi (har include-da nusxa)

Umumiy maslahat: MIXIN afzalroq, chunki bashorat qilinadigan va moslashuvchan.
%placeholder — faqat oddiy, o'zgarmas CSS bloklari uchun yaxshi.`,
  codeExamples: [
    {
      title: '%placeholder va @extend',
      language: 'scss',
      description: 'Placeholder selectorlar va ularni extend qilish',
      code: `// %placeholder — CSS ga compilatsiya qilinmaydi
%flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

%card-base {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 16px;
}

%reset-button {
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  font: inherit;
  color: inherit;
}

// Ishlatish
.hero {
  @extend %flex-center;
  min-height: 100vh;
}

.modal-overlay {
  @extend %flex-center;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
}

// Natija CSS:
// .hero, .modal-overlay {
//   display: flex;
//   justify-content: center;
//   align-items: center;
// }

.product-card {
  @extend %card-base;
  border: 1px solid #eee;
}

.user-card {
  @extend %card-base;
  border-left: 4px solid #3498db;
}

.icon-btn {
  @extend %reset-button;
  width: 40px;
  height: 40px;
}`
    },
    {
      title: '@extend bilan komponent variantlari',
      language: 'scss',
      description: 'Extend yordamida alert va button variantlari',
      code: `// Alert komponent
.alert {
  padding: 12px 16px;
  border-radius: 4px;
  border: 1px solid transparent;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.alert-success {
  @extend .alert;
  background: #d4edda;
  border-color: #c3e6cb;
  color: #155724;
}

.alert-warning {
  @extend .alert;
  background: #fff3cd;
  border-color: #ffc107;
  color: #856404;
}

.alert-error {
  @extend .alert;
  background: #f8d7da;
  border-color: #f5c6cb;
  color: #721c24;
}

// Natija CSS (selectorlar guruhlangan):
// .alert, .alert-success, .alert-warning, .alert-error {
//   padding: 12px 16px;
//   border-radius: 4px;
//   ...
// }
// .alert-success { background: #d4edda; ... }
// .alert-warning { background: #fff3cd; ... }
// .alert-error   { background: #f8d7da; ... }`
    },
    {
      title: '@extend vs @mixin amaliy taqqoslash',
      language: 'scss',
      description: 'Bir xil natijani extend va mixin bilan olish',
      code: `// === @EXTEND YONDASHUVI ===
%btn-base {
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-primary { @extend %btn-base; background: #3498db; }
.btn-secondary { @extend %btn-base; background: #95a5a6; }
// Natija: selectorlar guruhlangan, CSS kichik

// === @MIXIN YONDASHUVI ===
@mixin btn-base($bg, $color: white) {
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: 500;
  transition: all 0.2s;
  background: $bg;
  color: $color;

  &:hover {
    background: darken($bg, 10%);
  }
}

.btn-primary { @include btn-base(#3498db); }
.btn-secondary { @include btn-base(#95a5a6); }
// Natija: CSS takrorlanadi, lekin PARAMETERLI!

// XULOSA: Mixin moslashuvchan, extend — faqat
// statik, parametrsiz CSS bloklari uchun`
    }
  ],
  interviewQA: [
    {
      question: '@extend qachon muammo keltirib chiqaradi?',
      answer: '@extend muammolari: 1) @media ichida ishlamaydi — compilatsiya xatosi beradi; 2) Kutilmagan selector guruhlash — agar extend qilinayotgan class boshqa nested selectorlarda ham ishlatilsa, barcha joylarga qo\'shiladi; 3) Source order — extend qilingan selector oldin e\'lon qilinishi kerak; 4) Debug qiyinligi — yakuniy CSS-da qaysi selectorlar guruhlanganini kuzatish mushkul.'
    },
    {
      question: '%placeholder va oddiy class orasidagi farq nima?',
      answer: '%placeholder (masalan, %flex-center) CSS-ga compilatsiya qilinmaydi — faqat @extend orqali ishlatilganda paydo bo\'ladi. Agar hech joyda extend qilinmasa, CSS-da umuman ko\'rinmaydi. Oddiy class esa (masalan, .flex-center) doim CSS-ga yoziladi, extend qilinsa ham qilinmasa ham. Shuning uchun @extend uchun mo\'ljallangan CSS bloklarini doim % bilan yozish tavsiya etiladi.'
    },
    {
      question: 'Zamonaviy loyihalarda @extend ishlatish tavsiya etiladimi?',
      answer: 'Ko\'pchilik Sass qo\'llanmalari MIXIN-ni afzal ko\'radi, chunki: 1) Mixin bashorat qilinadigan — har include joyda nima chiqishini bilasiz; 2) Parametr qabul qiladi — moslashuvchan; 3) @media ichida ishlaydi; 4) gzip siqish tufayli CSS takrorlanish hajmi ahamiyatsiz. Extend faqat sodda, parametrsiz va keng tarqalgan pattern uchun mos: %visually-hidden, %reset-list, %clearfix.'
    }
  ],
  relatedTopics: [
    { techId: 'sass', sectionId: 'sass-basics', topicId: 'mixins', label: '@mixin va @include' },
    { techId: 'sass', sectionId: 'sass-basics', topicId: 'variables-nesting', label: '$variables va Nesting' }
  ]
}
