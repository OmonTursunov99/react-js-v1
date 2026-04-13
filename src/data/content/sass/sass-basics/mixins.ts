import type { Topic } from '../../../types'

export const mixins: Topic = {
  id: 'mixins',
  title: '@mixin, @include, Parameters',
  importance: 3,
  status: 'to-learn',
  description: '@mixin va @include bilan qayta ishlatiladigan CSS bloklari yaratish',
  content: `@mixin — Sass-da qayta ishlatiladigan CSS bloklari yaratish mexanizmi. Funksiyaga o'xshaydi, lekin CSS qoidalarini qaytaradi, qiymat emas.

═══════════════════════════════════════
  ASOSIY SINTAKSIS
═══════════════════════════════════════

  @mixin nom($param1, $param2) {
    // CSS qoidalari
  }

  .selector {
    @include nom(qiymat1, qiymat2);
  }

@mixin — yaratish (e'lon qilish)
@include — chaqirish (ishlatish)

═══════════════════════════════════════
  PARAMETRLAR VA DEFAULT QIYMATLAR
═══════════════════════════════════════

Mixin-lar parametr qabul qiladi:
- Oddiy parametr: @mixin box($size) { ... }
- Default qiymatli: @mixin box($size: 100px) { ... }
- Nomlangan argument: @include box($size: 200px)
- Rest parametr: @mixin shadows($shadows...) { ... }

Default qiymat berilgan parametrlarni tashlab ketish mumkin:
  @include box(); // default ishlatiladi

═══════════════════════════════════════
  @content DIRECTIVE
═══════════════════════════════════════

@content — mixin ichiga tashqaridan CSS blok uzatish:

  @mixin responsive($bp) {
    @media (min-width: $bp) { @content; }
  }

  .card {
    width: 100%;
    @include responsive(768px) {
      width: 50%; // @content o'rniga qo'yiladi
    }
  }

Bu media query, animation, hover state kabi
bloklarni qayta ishlatish uchun juda qulay.

═══════════════════════════════════════
  MIXIN vs FUNCTION vs EXTEND
═══════════════════════════════════════

@mixin — CSS qoidalari blokini qaytaradi
@function — BITTA qiymat qaytaradi (return)
@extend — selector-larni birlashtiradi (grouping)

Qachon mixin ishlatish:
- Bir nechta CSS property kerak bo'lganda
- Parametrga qarab CSS o'zgarishi kerak bo'lganda
- @content bilan flexible bloklar kerak bo'lganda

═══════════════════════════════════════
  AMALIY MASLAHATLAR
═══════════════════════════════════════

- Mixin-larni _mixins.scss faylida saqlang
- Ko'p ishlatiladigan pattern-lar: responsive, flexbox, grid, typography
- Juda oddiy mixin yaratmang — agar 1-2 qator bo'lsa, oddiy CSS yozing
- Mixin nomini vazifasiga qarab bering: respond-to, flex-center, truncate`,
  codeExamples: [
    {
      title: 'Asosiy mixin misollari',
      language: 'scss',
      description: 'Parametrli mixin-lar va default qiymatlar',
      code: `// Oddiy mixin — parametrsiz
@mixin flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

// Parametrli mixin
@mixin size($width, $height: $width) {
  width: $width;
  height: $height;
}

// Default qiymatli mixin
@mixin button-variant($bg: #3498db, $color: white, $radius: 4px) {
  background-color: $bg;
  color: $color;
  border: none;
  border-radius: $radius;
  padding: 8px 16px;
  cursor: pointer;

  &:hover {
    background-color: darken($bg, 10%);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

// Ishlatish
.hero {
  @include flex-center;
  @include size(100vw, 100vh);
}

.btn-primary {
  @include button-variant; // barcha default
}

.btn-danger {
  @include button-variant($bg: #e74c3c); // faqat bg o'zgardi
}

.btn-custom {
  @include button-variant(#2ecc71, black, 8px); // barchasi
}`
    },
    {
      title: '@content va responsive mixin',
      language: 'scss',
      description: 'Media query va boshqa @content misollari',
      code: `// Responsive breakpoint mixin
$breakpoints: (
  'sm': 576px,
  'md': 768px,
  'lg': 992px,
  'xl': 1200px,
);

@mixin respond-to($breakpoint) {
  $value: map-get($breakpoints, $breakpoint);
  @if $value {
    @media (min-width: $value) {
      @content;
    }
  } @else {
    @warn "Noma'lum breakpoint: #{$breakpoint}";
  }
}

// Ishlatish
.container {
  width: 100%;
  padding: 0 16px;

  @include respond-to('md') {
    max-width: 720px;
    margin: 0 auto;
  }

  @include respond-to('lg') {
    max-width: 960px;
  }

  @include respond-to('xl') {
    max-width: 1140px;
  }
}

// Hover mixin (touch qurilmalarda hover yo'q)
@mixin hover-supported {
  @media (hover: hover) {
    &:hover {
      @content;
    }
  }
}

.card {
  transition: transform 0.2s;

  @include hover-supported {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
}`
    },
    {
      title: 'Rest parametrlar va amaliy mixin-lar',
      language: 'scss',
      description: 'Spread/rest parametrlar va ko\'p ishlatiladigan mixin-lar',
      code: `// Rest parametr (...) — cheksiz argument
@mixin box-shadow($shadows...) {
  box-shadow: $shadows;
}

.card {
  @include box-shadow(
    0 2px 4px rgba(0, 0, 0, 0.1),
    0 4px 8px rgba(0, 0, 0, 0.05)
  );
}

// Matn qirqish (truncate)
@mixin truncate($lines: 1) {
  @if $lines == 1 {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  } @else {
    display: -webkit-box;
    -webkit-line-clamp: $lines;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}

.title {
  @include truncate; // 1 qator
}

.description {
  @include truncate(3); // 3 qator
}

// Aspect ratio mixin
@mixin aspect-ratio($width, $height) {
  aspect-ratio: #{$width} / #{$height};
  object-fit: cover;
}

.video-wrapper {
  @include aspect-ratio(16, 9);
}`
    }
  ],
  interviewQA: [
    {
      question: '@mixin va @extend orasidagi farq nima? Qachon qaysi birini ishlatish kerak?',
      answer: '@mixin har bir chaqirilgan joyda CSS kodini NUSXALAYDI — bu parametrlar bilan moslashuvchanlikni ta\'minlaydi. @extend esa selectorlarni GURUHLAYDI — bitta CSS blokiga bir nechta selector yoziladi. Mixin — parametr kerak bo\'lganda, har xil CSS kerak bo\'lganda. Extend — bir xil CSS-ni bir nechta selector ulashganda. Ammo extend-ning kamchiligi — kutilmagan selector guruhlash va media query ichida ishlamaslik.'
    },
    {
      question: '@content directive nima va qanday ishlatiladi?',
      answer: '@content — mixin ichiga tashqaridan CSS blok uzatish imkonini beradi. Mixin ichida @content yozilgan joyga @include paytida {} ichida berilgan CSS qo\'yiladi. Eng ko\'p ishlatiladigan holatlar: 1) Media query wrapper; 2) Hover/focus state; 3) Dark mode; 4) Keyframes wrapper. Masalan: @mixin respond-to($bp) { @media (min-width: $bp) { @content; } }'
    },
    {
      question: 'Mixin-larni loyihada qanday tashkil qilasiz?',
      answer: 'Yaxshi amaliyot: 1) _mixins.scss alohida faylda saqlash; 2) Kategoriyalash — layout (flex-center, grid), responsive (breakpoints), typography (truncate, font-face), utilities (size, clearfix); 3) @use bilan import qilish; 4) Juda oddiy mixin yaratmaslik — 1-2 qator uchun oddiy CSS yozish yaxshiroq; 5) Parametrlarga default qiymat berish; 6) Mixin-ni vazifasiga qarab nomlash.'
    }
  ],
  relatedTopics: [
    { techId: 'sass', sectionId: 'sass-basics', topicId: 'variables-nesting', label: '$variables va Nesting' },
    { techId: 'sass', sectionId: 'sass-basics', topicId: 'extends-placeholder', label: '@extend va %placeholder' },
    { techId: 'sass', sectionId: 'sass-basics', topicId: 'functions-operators', label: '@function' },
    { techId: 'less', sectionId: 'less-basics', topicId: 'mixins', label: 'Less Mixins' }
  ]
}
