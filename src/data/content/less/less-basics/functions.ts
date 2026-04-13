import type { Topic } from '../../../types'

export const functions: Topic = {
  id: 'functions',
  title: 'Built-in va Color Functions',
  importance: 2,
  status: 'to-learn',
  description: 'Less built-in funksiyalar, color functions va custom funksiyalar',
  content: `Less ko'plab built-in funksiyalar taqdim etadi — rang manipulyatsiyasi, matematik, string va tur tekshirish funksiyalari.

═══════════════════════════════════════
  RANG FUNKSIYALARI
═══════════════════════════════════════

O'zgartirish:
  lighten(@color, 10%)     — rangni ochriroq qilish
  darken(@color, 10%)      — rangni to'qroq qilish
  saturate(@color, 20%)    — to'yinganlikni oshirish
  desaturate(@color, 20%)  — to'yinganlikni kamaytirish
  fadein(@color, 10%)      — shaffoflikni kamaytirish
  fadeout(@color, 10%)     — shaffoflikni oshirish
  fade(@color, 50%)        — shaffoflikni o'rnatish
  spin(@color, 10)         — rang tonini (hue) o'zgartirish

Aralashtirish:
  mix(@color1, @color2, 50%) — ikkita rangni aralashtirish

Ma'lumot olish:
  hue(@color)        — rang toni (0-360)
  saturation(@color) — to'yinganlik (0-100%)
  lightness(@color)  — yorug'lik (0-100%)
  alpha(@color)      — shaffoflik (0-1)

Kontrast:
  contrast(@bg, @dark, @light, @threshold)
  — fon rangiga qarab qora yoki oq tanlaydi

═══════════════════════════════════════
  MATEMATIK FUNKSIYALAR
═══════════════════════════════════════

  ceil(2.4)       → 3      (yuqoriga yaxlitlash)
  floor(2.6)      → 2      (pastga yaxlitlash)
  round(1.67, 1)  → 1.7    (yaxlitlash)
  percentage(0.5) → 50%    (foizga o'girish)
  sqrt(25)        → 5      (ildiz)
  abs(-5)         → 5      (absolyut)
  min(3, 5)       → 3
  max(3, 5)       → 5
  mod(5, 2)       → 1      (qoldiq)

═══════════════════════════════════════
  STRING FUNKSIYALAR
═══════════════════════════════════════

  e("string")        — unquote (qo'shtirnoqni olib tashlash)
  escape("a=1&b=2")  — URL encode
  replace("Hi", "H", "B") — almashtirish

═══════════════════════════════════════
  TUR TEKSHIRISH FUNKSIYALAR
═══════════════════════════════════════

  iscolor(@val)     — rang ekanini tekshirish
  isnumber(@val)    — raqam
  isstring(@val)    — string
  iskeyword(@val)   — keyword
  isurl(@val)       — url()
  ispixel(@val)     — px birlikda
  isem(@val)        — em birlikda
  ispercentage(@val) — foiz

═══════════════════════════════════════
  LESS vs SASS FUNKSIYALAR
═══════════════════════════════════════

Less-da CUSTOM @function yaratib BO'LMAYDI (faqat plugin orqali).
Sass-da @function bilan o'z funksiyangizni yaratish mumkin.

Less-da buning o'rniga:
1. Mixin + parametr ishlatish
2. Plugin yozish (JavaScript)
3. Built-in funksiyalarni kombinatsiya qilish`,
  codeExamples: [
    {
      title: 'Color functions bilan palitra yaratish',
      language: 'less',
      description: 'Rang funksiyalari bilan avtomatik rang variatsiyalari',
      code: `@primary: #3498db;
@success: #2ecc71;
@danger: #e74c3c;

// Rang variatsiyalari
@primary-light: lighten(@primary, 20%);
@primary-dark: darken(@primary, 20%);
@primary-fade: fade(@primary, 20%);    // 20% shaffof

// Avtomatik hover ranglari
.generate-button(@name, @color) {
  .btn-@{name} {
    background: @color;
    color: contrast(@color, #333, #fff, 55%);

    &:hover {
      background: darken(@color, 10%);
    }

    &:active {
      background: darken(@color, 15%);
    }

    &:focus {
      box-shadow: 0 0 0 3px fade(@color, 30%);
    }

    // Outlined variant
    &.outlined {
      background: transparent;
      color: @color;
      border: 2px solid @color;

      &:hover {
        background: fade(@color, 10%);
      }
    }
  }
}

.generate-button(primary, @primary);
.generate-button(success, @success);
.generate-button(danger, @danger);

// Rang palitrasi generatsiya
.shade-generator(@color, @name) {
  .bg-@{name}-50  { background: lighten(@color, 40%); }
  .bg-@{name}-100 { background: lighten(@color, 30%); }
  .bg-@{name}-200 { background: lighten(@color, 20%); }
  .bg-@{name}-300 { background: lighten(@color, 10%); }
  .bg-@{name}-400 { background: @color; }
  .bg-@{name}-500 { background: darken(@color, 10%); }
  .bg-@{name}-600 { background: darken(@color, 20%); }
}

.shade-generator(@primary, primary);`
    },
    {
      title: 'Matematik va utility funksiyalar',
      language: 'less',
      description: 'Matematik funksiyalar bilan hisob-kitoblar',
      code: `// Grid tizimi
@columns: 12;
@gutter: 20px;

// Har bir column uchun class
.generate-grid(@i) when (@i > 0) {
  .col-@{i} {
    width: percentage(@i / @columns);
    padding: 0 (@gutter / 2);
    float: left;
  }
  .generate-grid(@i - 1); // rekursiya
}
.generate-grid(@columns); // .col-1 dan .col-12 gacha

// Spacing utility-lar
.generate-spacing(@i: 0) when (@i <= 12) {
  @value: @i * 4px;

  .mt-@{i} { margin-top: @value; }
  .mb-@{i} { margin-bottom: @value; }
  .ml-@{i} { margin-left: @value; }
  .mr-@{i} { margin-right: @value; }
  .pt-@{i} { padding-top: @value; }
  .pb-@{i} { padding-bottom: @value; }

  .generate-spacing(@i + 1);
}
.generate-spacing();

// px dan rem ga "funksiya" (mixin orqali)
// Less-da custom function yo'q, shuning uchun:
@base-font-size: 16px;

.font-size-rem(@px) {
  font-size: (@px / @base-font-size) * 1rem;
}

h1 { .font-size-rem(32); } // font-size: 2rem
h2 { .font-size-rem(24); } // font-size: 1.5rem
p  { .font-size-rem(16); } // font-size: 1rem`
    },
    {
      title: 'Tur tekshirish va kontrast',
      language: 'less',
      description: 'Tur tekshirish funksiyalari va kontrast rang tanlash',
      code: `// contrast() — eng muhim funksiya
// Fon rangiga qarab oq yoki qora matn tanlaydi
.badge(@bg) {
  background: @bg;
  // Agar @bg yorug' — qora matn, to'q — oq matn
  color: contrast(@bg, #333, #fff, 43%);
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.badge-blue    { .badge(#3498db); } // oq matn
.badge-yellow  { .badge(#f1c40f); } // qora matn
.badge-green   { .badge(#2ecc71); } // qora matn
.badge-dark    { .badge(#2c3e50); } // oq matn

// Tur tekshirish guard bilan
.size(@value) when (ispixel(@value)) {
  width: @value;
  height: @value;
}
.size(@value) when (ispercentage(@value)) {
  width: @value;
  height: auto; // foizda faqat width
}
.size(@value) when (isnumber(@value)) and (default()) {
  // birliksiz raqam — px deb hisoblaymiz
  width: unit(@value, px);
  height: unit(@value, px);
}

.icon-sm { .size(16px); }       // 16px x 16px
.icon-lg { .size(32px); }       // 32px x 32px
.full-width { .size(100%); }    // 100% x auto
.avatar { .size(48); }          // 48px x 48px

// unit() funksiyasi — birlik almashtirish
.example {
  width: unit(5, rem);          // 5rem
  height: unit(100, px);        // 100px
  opacity: unit(0.5);           // 0.5 (birliksiz)
}`
    }
  ],
  interviewQA: [
    {
      question: 'Less-da custom function yaratish mumkinmi?',
      answer: 'Less-da Sass kabi @function yaratib BO\'LMAYDI. Built-in funksiyalar va mixin-lar bilan ishlash kerak. Agar custom funksiya zarur bo\'lsa: 1) Mixin + property ishlatish (to\'g\'ridan-to\'g\'ri qiymat emas, lekin CSS yozadi); 2) Less plugin yozish (JavaScript-da); 3) PostCSS bilan birga ishlatish. Bu Less-ning Sass-ga nisbatan eng katta kamchiliklaridan biri.'
    },
    {
      question: 'contrast() funksiyasi qanday ishlaydi va nima uchun muhim?',
      answer: 'contrast(@background, @dark, @light, @threshold) — fon rangining yorug\'lik darajasiga qarab ikki rangdan birini tanlaydi. @threshold (default 43%) dan yorug\'roq fonlar @dark rangni, to\'qroq fonlar @light rangni oladi. Bu accessibility (WCAG kontrast ratio) uchun juda muhim — har doim o\'qiladigan matn rangini ta\'minlaydi. Dinamik rang tizimlarida (tema, badge, alert) doimiy kontrast uchun ishlatiladi.'
    },
    {
      question: 'Less-da loop qanday yaratiladi?',
      answer: 'Less-da @for yoki @each YO\'Q. Loop yaratish uchun REKURSIV MIXIN ishlatiladi: 1) Mixin o\'zini qayta chaqiradi; 2) when guard bilan to\'xtatish sharti qo\'yiladi. Masalan: .loop(@i) when (@i > 0) { .item-@{i} { ... } .loop(@i - 1); } .loop(5); Bu Sass-dagi @for ga nisbatan murakkabroq va o\'qish qiyinroq — Less-ning kamchiliklaridan biri.'
    }
  ],
  relatedTopics: [
    { techId: 'less', sectionId: 'less-basics', topicId: 'mixins', label: 'Less Mixins' },
    { techId: 'less', sectionId: 'less-basics', topicId: 'variables-nesting', label: 'Less Variables' },
    { techId: 'sass', sectionId: 'sass-basics', topicId: 'functions-operators', label: 'Sass Functions' }
  ]
}
