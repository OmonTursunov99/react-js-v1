import type { Topic } from '../../../types'

export const controlFlow: Topic = {
  id: 'control-flow',
  title: '@if, @for, @each, @while',
  importance: 2,
  status: 'to-learn',
  description: 'Sass control flow direktivlari: shartli va takroriy operatorlar',
  content: `Sass-da dasturlash tillariga o'xshash control flow direktivlari bor. Ular CSS-ni dinamik generatsiya qilish uchun ishlatiladi.

═══════════════════════════════════════
  @IF / @ELSE IF / @ELSE
═══════════════════════════════════════

Shartli CSS yozish:

  @mixin theme($mode) {
    @if $mode == 'dark' {
      background: #1a1a1a;
      color: white;
    } @else if $mode == 'light' {
      background: white;
      color: #333;
    } @else {
      @warn "Noma'lum tema: #{$mode}";
    }
  }

Taqqoslash operatorlari:
  == tenglik, != teng emas
  > < >= <= katta/kichik
  and, or, not mantiqiy

═══════════════════════════════════════
  @FOR TSIKLI
═══════════════════════════════════════

Raqamli tsikl — class-lar generatsiya uchun:

  @for $i from 1 through 12 { ... }  // 1-12 (12 DAHIL)
  @for $i from 1 to 12 { ... }       // 1-11 (12 dahil EMAS)

Ko'p ishlatiladigan holatlar:
- Grid column-lar
- Spacing utility-lar
- Animation delay-lar
- Font size scale

═══════════════════════════════════════
  @EACH TSIKLI
═══════════════════════════════════════

List yoki map bo'yicha iteratsiya:

  // List
  @each $color in red, green, blue {
    .text-#{$color} { color: $color; }
  }

  // Map
  @each $name, $value in ('sm': 576px, 'md': 768px) {
    @media (min-width: $value) { ... }
  }

  // Destructuring
  @each $name, $size, $weight in (h1, 32px, 700), (h2, 24px, 600) {
    #{$name} { font-size: $size; font-weight: $weight; }
  }

═══════════════════════════════════════
  @WHILE TSIKLI
═══════════════════════════════════════

Shart to'g'ri bo'lguncha takrorlash:

  $i: 6;
  @while $i > 0 {
    .col-#{$i} { width: 100% / 6 * $i; }
    $i: $i - 1;
  }

Kam ishlatiladi — ko'pincha @for yoki @each yetarli.
Cheksiz tsiklga EHTIYOT bo'ling!

═══════════════════════════════════════
  AMALIY QOIDALAR
═══════════════════════════════════════

- @each — eng ko'p ishlatiladi (map/list iteratsiya)
- @for — raqamli ketma-ketlik uchun (grid, scale)
- @if — mixin/function ichida shartli logika
- @while — juda kam kerak (har doim @for bilan almashtirish mumkin)
- Generatsiya qilingan class-lar soniga EHTIYOT bo'ling — CSS hajmi o'sadi!`,
  codeExamples: [
    {
      title: '@if/@else bilan shartli CSS',
      language: 'scss',
      description: 'Shartli logika mixin va funksiyalar ichida',
      code: `// Responsive mixin — breakpoint nomidan @media yaratish
$breakpoints: (
  'sm': 576px,
  'md': 768px,
  'lg': 992px,
  'xl': 1200px,
);

@mixin respond-to($name) {
  @if not map-has-key($breakpoints, $name) {
    @warn "Breakpoint '#{$name}' topilmadi!";
  } @else {
    $value: map-get($breakpoints, $name);
    @media (min-width: $value) {
      @content;
    }
  }
}

// Button variant mixin
@mixin btn-variant($style: 'filled', $color: #3498db) {
  @if $style == 'filled' {
    background: $color;
    color: white;
    border: none;
  } @else if $style == 'outlined' {
    background: transparent;
    color: $color;
    border: 2px solid $color;
  } @else if $style == 'ghost' {
    background: transparent;
    color: $color;
    border: none;
  } @else {
    @error "Noma'lum button style: #{$style}";
  }

  &:hover {
    @if $style == 'filled' {
      background: darken($color, 10%);
    } @else {
      background: rgba($color, 0.1);
    }
  }
}

.btn-primary { @include btn-variant('filled'); }
.btn-outlined { @include btn-variant('outlined'); }
.btn-ghost { @include btn-variant('ghost', #e74c3c); }`
    },
    {
      title: '@for va @each bilan utility generatsiya',
      language: 'scss',
      description: 'Tsikllar bilan CSS class-larini avtomatik yaratish',
      code: `@use "sass:math";

// === @FOR — spacing utility-lar ===
// .mt-0 ... .mt-12 (margin-top)
@for $i from 0 through 12 {
  .mt-#{$i} { margin-top: $i * 4px; }
  .mb-#{$i} { margin-bottom: $i * 4px; }
  .pt-#{$i} { padding-top: $i * 4px; }
  .pb-#{$i} { padding-bottom: $i * 4px; }
}

// Animation delay (stagger effect)
@for $i from 1 through 8 {
  .fade-in-#{$i} {
    animation: fadeIn 0.3s ease forwards;
    animation-delay: $i * 0.05s;
    opacity: 0;
  }
}

// === @EACH — rang utility-lar ===
$colors: (
  'primary': #3498db,
  'success': #2ecc71,
  'warning': #f39c12,
  'danger': #e74c3c,
  'info': #17a2b8,
);

@each $name, $color in $colors {
  .text-#{$name} { color: $color; }
  .bg-#{$name} { background-color: $color; }
  .border-#{$name} { border-color: $color; }

  // Hover variant
  .hover\\:bg-#{$name}:hover {
    background-color: $color;
  }
}

// === @EACH — responsive display utility ===
$displays: none, block, flex, grid, inline-flex;

@each $display in $displays {
  .d-#{$display} { display: $display; }
}

@each $bp-name, $bp-value in $breakpoints {
  @media (min-width: $bp-value) {
    @each $display in $displays {
      .d-#{$bp-name}-#{$display} { display: $display; }
    }
  }
}`
    },
    {
      title: 'Map bilan konfiguratsion tizim',
      language: 'scss',
      description: 'Map va @each bilan design token tizimi yaratish',
      code: `// Design token map
$font-sizes: (
  'xs': 12px,
  'sm': 14px,
  'base': 16px,
  'lg': 18px,
  'xl': 20px,
  '2xl': 24px,
  '3xl': 30px,
  '4xl': 36px,
);

$font-weights: (
  'light': 300,
  'normal': 400,
  'medium': 500,
  'semibold': 600,
  'bold': 700,
);

$border-radii: (
  'none': 0,
  'sm': 2px,
  'md': 4px,
  'lg': 8px,
  'xl': 12px,
  'full': 9999px,
);

// Generatsiya
@each $name, $size in $font-sizes {
  .text-#{$name} { font-size: $size; }
}

@each $name, $weight in $font-weights {
  .font-#{$name} { font-weight: $weight; }
}

@each $name, $radius in $border-radii {
  .rounded-#{$name} { border-radius: $radius; }
}

// Nested map — component tokenlari
$components: (
  'card': (
    'padding': 16px,
    'radius': 8px,
    'shadow': '0 2px 8px rgba(0,0,0,0.1)',
  ),
  'badge': (
    'padding': 4px 8px,
    'radius': 4px,
    'shadow': 'none',
  ),
);

@each $component, $tokens in $components {
  .#{$component} {
    padding: map-get($tokens, 'padding');
    border-radius: map-get($tokens, 'radius');
    box-shadow: unquote(map-get($tokens, 'shadow'));
  }
}`
    }
  ],
  interviewQA: [
    {
      question: '@for tsiklidagi through va to orasidagi farq nima?',
      answer: 'through — oxirgi raqamni HAM O\'Z ICHIGA OLADI: @for $i from 1 through 3 → 1, 2, 3. to — oxirgi raqamni O\'Z ICHIGA OLMAYDI: @for $i from 1 to 3 → 1, 2. Ko\'pincha through ishlatiladi, masalan grid column-lar: @for $i from 1 through 12.'
    },
    {
      question: 'Control flow direktivlari bilan CSS generatsiya qilishning qanday xavfi bor?',
      answer: 'Asosiy xavf — CSS hajmining boshqarib bo\'lmas darajada o\'sishi. Masalan, 12 column * 4 breakpoint * 4 property = 192 ta class faqat grid uchun. Yechimlar: 1) Faqat KERAKLI class-larni generatsiya qilish; 2) PurgeCSS/Tailwind kabi tool ishlatish; 3) @each da map-ni kichik saqlash; 4) CSS Custom Properties-ga o\'tish (bitta class, o\'zgaruvchan qiymat).'
    },
    {
      question: '@warn, @error va @debug orasidagi farq nima?',
      answer: '@warn — ogohlantirish chiqaradi, compilatsiya DAVOM ETADI. Noto\'g\'ri, lekin halokatli bo\'lmagan parametr uchun. @error — xato chiqaradi, compilatsiya TO\'XTAYDI. Qat\'iy tekshirish uchun (noma\'lum breakpoint nomi). @debug — debug ma\'lumot chiqaradi, development vaqtida qiymatlarni ko\'rish uchun. Production-da @debug olib tashlanishi kerak.'
    }
  ],
  relatedTopics: [
    { techId: 'sass', sectionId: 'sass-basics', topicId: 'functions-operators', label: 'Functions va Operators' },
    { techId: 'sass', sectionId: 'sass-basics', topicId: 'mixins', label: 'Mixins' },
    { techId: 'sass', sectionId: 'sass-basics', topicId: 'modules', label: '@use va @forward' }
  ]
}
