import type { Topic } from '../../../types'

export const functionsOperators: Topic = {
  id: 'functions-operators',
  title: 'Functions va Operators',
  importance: 2,
  status: 'to-learn',
  description: 'Built-in funksiyalar, custom @function va matematik operatorlar',
  content: `Sass-da ikki turdagi funksiya bor: built-in (tayyor) va custom (@function bilan yaratilgan). Bundan tashqari matematik operatorlar ham qo'llab-quvvatlanadi.

═══════════════════════════════════════
  BUILT-IN FUNKSIYALAR
═══════════════════════════════════════

RANG funksiyalari:
  lighten($color, $amount)    — rangni ochroq qilish
  darken($color, $amount)     — rangni to'qroq qilish
  mix($color1, $color2, $weight) — ikki rangni aralashtirish
  rgba($color, $alpha)        — shaffoflik berish
  adjust-hue($color, $deg)    — rang tonini o'zgartirish
  saturate / desaturate       — to'yinganlik
  complement($color)          — qarama-qarshi rang

STRING funksiyalari:
  quote($string)    — qo'shtirnoq qo'shish
  unquote($string)  — qo'shtirnoqni olib tashlash
  str-length($str)  — uzunlik
  to-upper-case / to-lower-case

RAQAM funksiyalari:
  percentage($number) — foizga o'girish
  round($number)      — yaxlitlash
  ceil / floor        — yuqoriga/pastga yaxlitlash
  min / max           — eng kichik/katta
  abs($number)        — absolyut qiymat
  math.div($a, $b)    — bo'lish (yangi usul)

LIST funksiyalari:
  length($list), nth($list, $n), append(), join(), index()

MAP funksiyalari:
  map-get($map, $key), map-keys(), map-values(), map-merge(), map-has-key()

═══════════════════════════════════════
  CUSTOM @FUNCTION
═══════════════════════════════════════

@function — qiymat QAYTARADI (CSS property emas!):

  @function double($value) {
    @return $value * 2;
  }

Farq:
  @mixin  → CSS qoidalari qaytaradi (@include bilan)
  @function → BITTA qiymat qaytaradi (to'g'ridan-to'g'ri)

═══════════════════════════════════════
  MATEMATIK OPERATORLAR
═══════════════════════════════════════

  +  qo'shish: 10px + 5px = 15px
  -  ayirish:  10px - 5px = 5px
  *  ko'paytirish: 10px * 2 = 20px
  /  bo'lish:  math.div(10px, 2) = 5px (yangi sintaksis)
  %  qoldiq:   10 % 3 = 1

DIQQAT: / operatori endi deprecated!
@use "sass:math" va math.div() ishlatish kerak.

Birlik qoidalari:
  10px + 5px = 15px    ✅ Bir xil birlik
  10px * 2 = 20px      ✅ Birliksiz ko'paytirish
  10px * 5px = ???      ❌ px*px mantiqsiz
  10px + 2em = ???      ❌ Har xil birliklar

═══════════════════════════════════════
  AMALIY FOYDALANISH
═══════════════════════════════════════

- Responsive tipografiya hisoblash
- Spacing tizimi yaratish
- Rang palitrasi generatsiya qilish
- Grid system hisoblash`,
  codeExamples: [
    {
      title: 'Built-in rang funksiyalari',
      language: 'scss',
      description: 'Sass rang funksiyalari bilan palitra yaratish',
      code: `@use "sass:color";
@use "sass:math";

$primary: #3498db;

// Rang variantlari
$primary-light: lighten($primary, 20%);   // #a3d1f5
$primary-dark: darken($primary, 20%);     // #1a6daa
$primary-10: rgba($primary, 0.1);         // shaffof
$primary-complement: complement($primary); // qarama-qarshi

// Avtomatik palitra generatsiya
$shades: (
  '50':  lighten($primary, 40%),
  '100': lighten($primary, 30%),
  '200': lighten($primary, 20%),
  '300': lighten($primary, 10%),
  '400': $primary,
  '500': darken($primary, 10%),
  '600': darken($primary, 20%),
  '700': darken($primary, 30%),
  '800': darken($primary, 40%),
);

// CSS Custom Properties sifatida chiqarish
:root {
  @each $shade, $color in $shades {
    --primary-#{$shade}: #{$color};
  }
}

// Kontrast rang tanlash
@function contrast-color($bg) {
  $lightness: lightness($bg);
  @if $lightness > 55% {
    @return #333;
  } @else {
    @return #fff;
  }
}

.badge {
  background: $primary;
  color: contrast-color($primary); // #fff
}`
    },
    {
      title: 'Custom @function misollari',
      language: 'scss',
      description: 'O\'zingizning funksiyalaringizni yaratish',
      code: `@use "sass:math";
@use "sass:list";

// px dan rem ga o'girish
@function rem($px, $base: 16) {
  @return math.div($px, $base) * 1rem;
}

// Spacing tizimi: 4px grid
@function space($multiplier) {
  @return $multiplier * 4px;
}

// Fluid typography (clamp generatsiya)
@function fluid($min-size, $max-size, $min-vw: 320, $max-vw: 1200) {
  $slope: math.div($max-size - $min-size, $max-vw - $min-vw);
  $intercept: $min-size - $slope * $min-vw;
  @return clamp(
    #{$min-size}px,
    #{$intercept}px + #{$slope * 100}vw,
    #{$max-size}px
  );
}

// Z-index tizimi
$z-layers: (dropdown: 100, modal: 200, toast: 300, tooltip: 400);

@function z($layer) {
  @if map-has-key($z-layers, $layer) {
    @return map-get($z-layers, $layer);
  }
  @warn "Noma'lum z-index layer: #{$layer}";
  @return 1;
}

// Ishlatish
body {
  font-size: rem(16);      // 1rem
}

h1 {
  font-size: fluid(24, 48); // clamp(24px, ..., 48px)
}

.card {
  padding: space(4);        // 16px
  margin-bottom: space(6);  // 24px
}

.modal {
  z-index: z(modal);        // 200
}`
    },
    {
      title: 'Matematik operatorlar va grid hisoblash',
      language: 'scss',
      description: 'Sass matematik imkoniyatlari bilan grid tizimi',
      code: `@use "sass:math";

// Oddiy grid tizimi
$columns: 12;
$gutter: 20px;

@function col-width($n) {
  @return math.div(100%, $columns) * $n;
}

// Grid class-lar generatsiya
@for $i from 1 through $columns {
  .col-#{$i} {
    width: col-width($i);
    padding: 0 math.div($gutter, 2);
  }
}

// Natija:
// .col-1  { width: 8.333%; }
// .col-6  { width: 50%; }
// .col-12 { width: 100%; }

// Spacing scale generatsiya
$spacing-base: 4px;

@each $name, $multiplier in (
  'xs': 1,   // 4px
  'sm': 2,   // 8px
  'md': 4,   // 16px
  'lg': 6,   // 24px
  'xl': 8,   // 32px
  '2xl': 12  // 48px
) {
  .p-#{$name} { padding: $spacing-base * $multiplier; }
  .m-#{$name} { margin: $spacing-base * $multiplier; }
  .gap-#{$name} { gap: $spacing-base * $multiplier; }
}`
    }
  ],
  interviewQA: [
    {
      question: '@function va @mixin orasidagi asosiy farq nima?',
      answer: '@function BITTA qiymat qaytaradi (@return orqali) — uni CSS property qiymatiga to\'g\'ridan-to\'g\'ri yozish mumkin: width: col-width(6). @mixin esa CSS QOIDALARI blokini qaytaradi — @include bilan chaqiriladi va bir nechta property yozadi. Qoida: agar BITTA qiymat kerak — @function, agar CSS blok kerak — @mixin.'
    },
    {
      question: 'Sass-da / (bo\'lish) operatori nima uchun deprecated va nima ishlatish kerak?',
      answer: 'CSS-da / belgisi font: 12px/1.5, grid: 1fr/2fr kabi kontekstlarda ishlatiladi. Sass bu belgini matematik bo\'lish deb tushunardi, lekin bu CSS bilan ziddiyat keltirar edi. Sass 2.0 dan / faqat CSS qiymati sifatida qoladi. Matematik bo\'lish uchun @use "sass:math" import qilib, math.div($a, $b) ishlatish kerak.'
    },
    {
      question: 'lighten/darken va adjust-color orasidagi farq nima?',
      answer: 'lighten/darken — nisbiy o\'zgartirish: lighten(blue, 20%) hozirgi yorug\'likni 20% ga oshiradi. adjust-color esa absolyut o\'zgartirish: adjust-color(blue, $lightness: 20%) yorug\'likni 20% ga O\'RNATADI. Yangi Sass-da color.adjust() va color.scale() ishlatish tavsiya etiladi. scale() ko\'proq bashorat qilinadigan, chunki u mavjud qiymatdan nisbiy foizda o\'zgartiradi.'
    }
  ],
  relatedTopics: [
    { techId: 'sass', sectionId: 'sass-basics', topicId: 'mixins', label: '@mixin va @include' },
    { techId: 'sass', sectionId: 'sass-basics', topicId: 'control-flow', label: 'Control Flow' },
    { techId: 'less', sectionId: 'less-basics', topicId: 'functions', label: 'Less Functions' }
  ]
}
