import type { Topic } from '../../../types'

export const mixins: Topic = {
  id: 'mixins',
  title: 'Mixins, Parametric Mixins, Guards',
  importance: 3,
  status: 'to-learn',
  description: '.mixin(), parametric mixins va mixin guards',
  content: `Less-da mixin — qayta ishlatiladigan CSS bloklari. Sass-dan farqli ravishda Less-da mixin ODDIY CLASS sifatida ham yozilishi mumkin.

═══════════════════════════════════════
  ASOSIY MIXIN SINTAKSISI
═══════════════════════════════════════

Less-da har qanday class mixin sifatida ishlatilishi mumkin:

  .bordered {
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  .card {
    .bordered(); // .bordered ning CSS-ini nusxalaydi
  }

() qavslar qo'shilsa, mixin CSS-ga chiqarilMAYDI:

  .bordered() {        // CSS-ga yozilmaydi
    border: 1px solid #ccc;
  }

═══════════════════════════════════════
  PARAMETRIC MIXINS
═══════════════════════════════════════

Parametrli mixin — funksiyaga o'xshaydi:

  .button(@bg: #3498db, @color: white) {
    background: @bg;
    color: @color;
    padding: 8px 16px;
  }

  .btn-primary { .button(); }
  .btn-danger  { .button(#e74c3c); }

@arguments — barcha parametrlarni birdaniga olish:
  .box-shadow(@x: 0, @y: 2px, @blur: 4px, @color: rgba(0,0,0,.1)) {
    box-shadow: @arguments;
  }

Rest parametr (...):
  .transition(@props...) {
    transition: @props;
  }

═══════════════════════════════════════
  MIXIN GUARDS (SHARTLI MIXIN)
═══════════════════════════════════════

Guard — mixin-ga SHART qo'shish (Sass-dagi @if ga o'xshash):

  .button(@bg) when (lightness(@bg) > 50%) {
    color: black;   // och fon — qora matn
  }
  .button(@bg) when (lightness(@bg) <= 50%) {
    color: white;   // to'q fon — oq matn
  }

Guard operatorlari:
  when (...)           — bitta shart
  when (...) and (...) — VA (ikkala shart)
  when (...), (...)    — YOKI (birontasi)
  when not (...)       — TESKARI
  when (default())     — agar boshqa guard mos kelmasa

Tur tekshirish funksiyalari:
  iscolor(@val), isnumber(@val), isstring(@val),
  iskeyword(@val), isurl(@val), ispixel(@val),
  isem(@val), ispercentage(@val), isunit(@val, px)

═══════════════════════════════════════
  NAMESPACES
═══════════════════════════════════════

Mixin-larni guruhlab, namespace yaratish mumkin:

  #utils() {
    .flex-center() {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .truncate() {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .hero {
    #utils.flex-center();
  }

═══════════════════════════════════════
  LESS vs SASS MIXIN FARQLARI
═══════════════════════════════════════

Less: .mixin(), oddiy class ham mixin
Sass: @mixin + @include, alohida kalit so'zlar

Less: when guard (shartli mixin)
Sass: @if/@else (mixin ichida)

Less: @arguments (barcha parametrlar)
Sass: $args... (rest parametr)`,
  codeExamples: [
    {
      title: 'Asosiy va parametric mixinlar',
      language: 'less',
      description: 'Less mixin turlari va ularning ishlatilishi',
      code: `// Oddiy mixin — () bilan CSS-ga chiqarilmaydi
.reset-list() {
  list-style: none;
  margin: 0;
  padding: 0;
}

.flex-center() {
  display: flex;
  justify-content: center;
  align-items: center;
}

// Parametric mixin
.button(@bg: @primary, @color: white, @radius: 4px) {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: @bg;
  color: @color;
  border: none;
  border-radius: @radius;
  padding: 8px 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: darken(@bg, 10%);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

// Ishlatish
.nav-list { .reset-list(); }
.hero { .flex-center(); min-height: 100vh; }

.btn-primary { .button(); }
.btn-danger { .button(@danger); }
.btn-success { .button(@bg: @secondary, @radius: 20px); }

// @arguments ishlatish
.border(@width: 1px, @style: solid, @color: #ccc) {
  border: @arguments; // 1px solid #ccc
}

.card { .border(); }
.input { .border(2px, solid, @primary); }`
    },
    {
      title: 'Mixin Guards va shartli logika',
      language: 'less',
      description: 'when guard bilan shartli mixin-lar',
      code: `// Kontrastli rang tanlov
.set-text-color(@bg) when (lightness(@bg) > 55%) {
  color: #333;
}
.set-text-color(@bg) when (lightness(@bg) <= 55%) {
  color: #fff;
}

// Responsive mixin — guard bilan
.respond(@size) when (@size = sm) {
  @media (min-width: 576px) { @content(); }
}
.respond(@size) when (@size = md) {
  @media (min-width: 768px) { @content(); }
}
.respond(@size) when (@size = lg) {
  @media (min-width: 992px) { @content(); }
}

// Tur tekshirish guard
.spacing(@value) when (isnumber(@value)) {
  margin: @value;
  padding: @value;
}
.spacing(@value) when (iskeyword(@value)) and (@value = auto) {
  margin: auto;
}

// and, or, not
.grid-item(@cols) when (@cols > 0) and (@cols <= 12) {
  width: percentage(@cols / 12);
  float: left;
}
.grid-item(@cols) when (default()) {
  width: 100%; // agar 0 yoki 12 dan katta
}

// Ishlatish
.badge-success {
  @bg: #2ecc71;
  background: @bg;
  .set-text-color(@bg); // color: #333 (och fon)
}

.badge-danger {
  @bg: #c0392b;
  background: @bg;
  .set-text-color(@bg); // color: #fff (to'q fon)
}

.col-6 { .grid-item(6); }  // width: 50%
.col-20 { .grid-item(20); } // width: 100% (default)`
    },
    {
      title: 'Namespace va amaliy mixin to\'plami',
      language: 'less',
      description: 'Mixin-larni namespace bilan tashkil qilish',
      code: `// Namespace — mixin-larni guruhlab boshqarish
#typography() {
  .heading(@size: 24px, @weight: 700) {
    font-size: @size;
    font-weight: @weight;
    line-height: 1.2;
    margin-bottom: 0.5em;
  }

  .body-text(@size: 16px) {
    font-size: @size;
    line-height: 1.6;
    color: #555;
  }

  .truncate(@lines: 1) when (@lines = 1) {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .truncate(@lines) when (@lines > 1) {
    display: -webkit-box;
    -webkit-line-clamp: @lines;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}

#layout() {
  .flex-center() {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .absolute-center() {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .sticky-top(@offset: 0) {
    position: sticky;
    top: @offset;
    z-index: 100;
  }
}

// Ishlatish
h1 { #typography.heading(36px); }
h2 { #typography.heading(28px, 600); }
p  { #typography.body-text(); }

.card-title {
  #typography.truncate(2); // 2 qatorli truncate
}

.modal-overlay {
  #layout.flex-center();
  position: fixed;
  inset: 0;
}

.header {
  #layout.sticky-top();
  background: white;
}`
    }
  ],
  interviewQA: [
    {
      question: 'Less mixin va Sass mixin orasidagi asosiy farq nima?',
      answer: 'Less-da har qanday class mixin bo\'lib xizmat qiladi — .my-class() yozish kifoya. Sass-da esa alohida @mixin kalit so\'zi bilan e\'lon qilib, @include bilan chaqirish kerak. Less-da shartli logika when guard orqali mixin TASHQARISIDA yoziladi. Sass-da @if/@else mixin ICHIDA yoziladi. Less-da @arguments barcha parametrlarni birlashtiradi. Sass-da $args... rest parametr ishlatiladi.'
    },
    {
      question: 'Mixin guard nima va @if dan qanday farqi bor?',
      answer: 'Guard — Less-da mixin-ga qo\'shilgan shart (when kalit so\'zi). Guard mixin e\'lonidan TASHQARIDA yoziladi va bir xil nomdagi bir nechta mixin variant bo\'ladi. Sass @if esa mixin ICHIDA yoziladi, bitta mixin ichida turli variantlarni boshqaradi. Guard yondashuvi pattern matching-ga o\'xshaydi (Haskell, Erlang kabi), @if esa oddiy shartli operator.'
    },
    {
      question: 'Less-da namespace nima uchun kerak?',
      answer: 'Namespace (#name()) — mixin-larni mantiqiy guruhlarga bo\'lish. Afzalliklari: 1) Nom to\'qnashuvini oldini oladi; 2) Kodni tashkil qilish osonlashadi; 3) Qaysi mixin qaysi guruhga tegishli ekanini ko\'rsatadi; 4) IDE autocomplete yaxshilanadi. Chaqirish: #namespace.mixin(). Sass-da bunga @use namespace modullar mos keladi.'
    }
  ],
  relatedTopics: [
    { techId: 'less', sectionId: 'less-basics', topicId: 'variables-nesting', label: 'Less Variables' },
    { techId: 'less', sectionId: 'less-basics', topicId: 'functions', label: 'Less Functions' },
    { techId: 'sass', sectionId: 'sass-basics', topicId: 'mixins', label: 'Sass Mixins' }
  ]
}
