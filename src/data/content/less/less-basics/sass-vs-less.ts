import type { Topic } from '../../../types'

export const sassVsLess: Topic = {
  id: 'sass-vs-less',
  title: 'Sass vs Less Taqqoslash',
  importance: 2,
  status: 'to-learn',
  description: 'Sass va Less orasidagi farqlar, afzalliklar va migration guide',
  content: `Sass va Less — CSS preprocessor oilasining ikki eng mashhur a'zosi. Ikkisi ham CSS-ga o'zgaruvchilar, nesting, mixin va boshqa imkoniyatlar qo'shadi, lekin muhim farqlari bor.

═══════════════════════════════════════
  SINTAKSIS TAQQOSLASH
═══════════════════════════════════════

O'zgaruvchilar:
  Sass: $primary: #3498db;
  Less: @primary: #3498db;

Mixin yaratish:
  Sass: @mixin name($param) { ... }
  Less: .name(@param) { ... }

Mixin chaqirish:
  Sass: @include name(value);
  Less: .name(value);

Shartli logika:
  Sass: @if / @else / @else if (mixin ichida)
  Less: when guard (mixin tashqarisida)

Tsikl:
  Sass: @for, @each, @while
  Less: rekursiv mixin + when guard

Funksiya:
  Sass: @function + @return
  Less: yo'q (faqat built-in + plugin)

Modul tizimi:
  Sass: @use, @forward (namespace bilan)
  Less: @import (global scope)

═══════════════════════════════════════
  AFZALLIKLAR — SASS
═══════════════════════════════════════

1. Kuchli modul tizimi (@use/@forward, namespace, private)
2. Custom @function yaratish
3. @for, @each, @while tsikllar
4. @if/@else shartli logika (aniqroq)
5. Katta ekosistem va community
6. Dart Sass — tez, faol rivojlanmoqda
7. Ko'proq kutubxonalar va framework qo'llab-quvvatlaydi

═══════════════════════════════════════
  AFZALLIKLAR — LESS
═══════════════════════════════════════

1. JavaScript-da yozilgan — Node.js bilan integratsiya oson
2. Brauzerda runtime kompilyatsiya (less.js)
3. Oddiyroq sintaksis — o'rganish osonroq
4. Guard pattern — ba'zi holatlarda ifodaliroq
5. Detached ruleset — CSS blokni o'zgaruvchiga saqlash
6. Variable variables (@@var)

═══════════════════════════════════════
  BOZOR HOLATI (2024-2025)
═══════════════════════════════════════

Sass:
- Ko'proq loyihalarda ishlatiladi
- Bootstrap 4+ (Sass-ga o'tdi), Tailwind, Material UI
- npm haftalik yuklash: ~15M+
- Faol rivojlanmoqda (Dart Sass)

Less:
- Ant Design (Less ishlatadi)
- Ba'zi legacy loyihalar
- npm haftalik yuklash: ~5M
- Sekinroq rivojlanmoqda

Trend: Sass afzalroq, lekin CSS Custom Properties va PostCSS
ko'plab preprocessor imkoniyatlarini almashtirmoqda.

═══════════════════════════════════════
  MIGRATION: LESS → SASS
═══════════════════════════════════════

1. @ → $ (o'zgaruvchilar)
2. .mixin() → @mixin + @include
3. when guard → @if/@else
4. Rekursiv mixin → @for/@each
5. @import → @use/@forward
6. @{var} → #{$var} (interpolation)
7. @arguments → $args...`,
  codeExamples: [
    {
      title: 'Bir xil natija — Less va Sass',
      language: 'scss',
      description: 'Ikki preprocessor-da bir xil CSS chiqarish',
      code: `// ═══ SASS VERSIYASI ═══

// Variables
$primary: #3498db;
$radius: 4px;
$breakpoints: ('sm': 576px, 'md': 768px, 'lg': 992px);

// Mixin
@mixin respond-to($name) {
  $value: map-get($breakpoints, $name);
  @media (min-width: $value) { @content; }
}

// Function
@function contrast($bg) {
  @if lightness($bg) > 55% { @return #333; }
  @return #fff;
}

// Loop
@each $name, $color in ('primary': #3498db, 'danger': #e74c3c) {
  .btn-#{$name} {
    background: $color;
    color: contrast($color);
    border-radius: $radius;
    padding: 8px 16px;
  }
}

// Component
.card {
  background: white;
  border-radius: $radius;

  &__title { font-weight: bold; }
  &:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.1); }

  @include respond-to('md') {
    padding: 24px;
  }
}`
    },
    {
      title: 'Bir xil natija — Less versiyasi',
      language: 'less',
      description: 'Yuqoridagi Sass kodning Less ekvivalenti',
      code: `// ═══ LESS VERSIYASI ═══

// Variables
@primary: #3498db;
@radius: 4px;
@screen-sm: 576px;
@screen-md: 768px;
@screen-lg: 992px;

// Mixin
.respond-to(@name) when (@name = sm) {
  @media (min-width: @screen-sm) { @content(); }
}
.respond-to(@name) when (@name = md) {
  @media (min-width: @screen-md) { @content(); }
}
.respond-to(@name) when (@name = lg) {
  @media (min-width: @screen-lg) { @content(); }
}

// Less-da @function yo'q — mixin bilan
.set-contrast(@bg) when (lightness(@bg) > 55%) {
  color: #333;
}
.set-contrast(@bg) when (lightness(@bg) <= 55%) {
  color: #fff;
}

// Loop — rekursiv mixin kerak
.btn-primary {
  background: @primary;
  .set-contrast(@primary);
  border-radius: @radius;
  padding: 8px 16px;
}

.btn-danger {
  @danger: #e74c3c;
  background: @danger;
  .set-contrast(@danger);
  border-radius: @radius;
  padding: 8px 16px;
}

// Component — BIR XIL
.card {
  background: white;
  border-radius: @radius;

  &__title { font-weight: bold; }
  &:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.1); }

  .respond-to(md, {
    padding: 24px;
  });
}`
    },
    {
      title: 'Migration checklist',
      language: 'css',
      description: 'Less dan Sass ga o\'tish qadamlari',
      code: `/* ═══ LESS → SASS MIGRATION CHECKLIST ═══ */

/* 1. FAYL KENGAYTMASI */
/*    .less → .scss                                */

/* 2. O'ZGARUVCHILAR */
/*    Less:  @primary: #3498db;                    */
/*    Sass:  $primary: #3498db;                    */

/* 3. INTERPOLATION */
/*    Less:  .@{name} { @{prop}: value; }          */
/*    Sass:  .#{$name} { #{$prop}: value; }        */

/* 4. MIXIN */
/*    Less:  .mixin(@param) { ... }                */
/*    Sass:  @mixin mixin($param) { ... }          */
/*    Less:  .mixin(value);                        */
/*    Sass:  @include mixin(value);                */

/* 5. SHARTLI LOGIKA */
/*    Less:  .mx(@v) when (@v > 10) { ... }        */
/*    Sass:  @mixin mx($v) { @if $v > 10 { ... } } */

/* 6. TSIKL */
/*    Less:  .loop(@i) when (@i > 0) {             */
/*             .loop(@i - 1);                      */
/*           }                                     */
/*    Sass:  @for $i from 1 through 12 { ... }     */
/*           @each $item in $list { ... }          */

/* 7. IMPORT */
/*    Less:  @import "file";                       */
/*    Sass:  @use "file";                          */
/*           @use "file" as *;   (namespace yo'q)  */

/* 8. XUSUSIY FARQLAR */
/*    Less:  @arguments — barcha mixin parametrlari */
/*    Sass:  $args...  — rest parametr              */
/*    Less:  @@var — variable variable              */
/*    Sass:  yo'q (map ishlatish kerak)             */
/*    Less:  e("text") — unquote                   */
/*    Sass:  unquote("text")                       */`
    }
  ],
  interviewQA: [
    {
      question: 'Sass va Less orasidagi eng muhim farqlar qanday?',
      answer: 'Eng muhim farqlar: 1) Modul tizimi — Sass @use/@forward (namespace, private), Less faqat @import (global); 2) Funksiyalar — Sass @function yaratish mumkin, Less-da yo\'q; 3) Tsikllar — Sass @for/@each/@while, Less rekursiv mixin; 4) Shartli logika — Sass @if/@else (mixin ichida), Less when guard (tashqarida); 5) Ekosistem — Sass ancha kattaroq community va kutubxonalar.'
    },
    {
      question: 'Yangi loyihada Sass yoki Less tanlaysizmi va nima uchun?',
      answer: 'Ko\'p hollarda SASS tavsiya etiladi: 1) Kuchli modul tizimi — katta loyihalarda muhim; 2) Custom funksiyalar — design token tizimi uchun; 3) Yaxshi ekosistem — ko\'proq kutubxona, community va resurslar; 4) Faol rivojlanish (Dart Sass); 5) Bootstrap, Tailwind kabi framework-lar qo\'llab-quvvatlaydi. Less tanlash holatlari: Ant Design ekosistemida ishlash, legacy loyihalar, brauzerda runtime kompilyatsiya kerak bo\'lganda.'
    },
    {
      question: 'CSS preprocessor hali ham kerakmi yoki CSS Custom Properties yetarli?',
      answer: 'Hozirgi CSS ko\'p narsani o\'zi qiladi: Custom Properties (--var), nesting (CSS Nesting), :has(), color-mix(). Lekin preprocessor hali ham foydali: 1) Mixin/function — CSS-da yo\'q; 2) Loop — utility class generatsiya; 3) Compile-time hisoblash — runtime yukni kamaytiradi; 4) Modul tizimi — katta loyihalarda fayl tashkil qilish. Trend: preprocessor + CSS Custom Properties BIRGA ishlatish — eng yaxshi natija.'
    },
    {
      question: 'Less-dan Sass-ga qanday migrate qilasiz?',
      answer: 'Asosiy qadamlar: 1) .less → .scss fayl kengaytmasi; 2) @ → $ o\'zgaruvchilar; 3) @{var} → #{$var} interpolation; 4) .mixin() → @mixin + @include; 5) when guard → @if/@else; 6) Rekursiv mixin → @for/@each; 7) @import → @use/@forward; 8) @arguments → $args...; 9) Avtomatik tool-lar: less2sass, sass-convert. Bosqichma-bosqich migrate qilish yaxshiroq — bir fayldan boshlash.'
    }
  ],
  relatedTopics: [
    { techId: 'sass', sectionId: 'sass-basics', topicId: 'variables-nesting', label: 'Sass Variables' },
    { techId: 'sass', sectionId: 'sass-basics', topicId: 'mixins', label: 'Sass Mixins' },
    { techId: 'sass', sectionId: 'sass-basics', topicId: 'modules', label: 'Sass Modules' },
    { techId: 'less', sectionId: 'less-basics', topicId: 'variables-nesting', label: 'Less Variables' },
    { techId: 'less', sectionId: 'less-basics', topicId: 'mixins', label: 'Less Mixins' }
  ]
}
