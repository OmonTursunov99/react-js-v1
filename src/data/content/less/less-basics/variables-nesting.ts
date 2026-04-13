import type { Topic } from '../../../types'

export const variablesNesting: Topic = {
  id: 'variables-nesting',
  title: '@variables, Nesting, &',
  importance: 3,
  status: 'to-learn',
  description: 'Less o\'zgaruvchilari, ichma-ich yozish va & parent selector',
  content: `Less (Leaner Style Sheets) — CSS preprocessor bo'lib, o'zgaruvchilar, nesting, mixin va boshqa imkoniyatlar beradi. Sass-ga o'xshaydi, lekin sintaksisi farq qiladi.

═══════════════════════════════════════
  @VARIABLES (O'ZGARUVCHILAR)
═══════════════════════════════════════

Less-da o'zgaruvchilar @ belgisi bilan boshlanadi:

  @primary-color: #3498db;
  @font-size-base: 16px;
  @spacing: 8px;

MUHIM FARQ SASS DAN:
- Less: @variable (@ belgisi)
- Sass: $variable ($ belgisi)
- CSS: --variable (-- prefiksi)

Less o'zgaruvchilari LAZY EVALUATION qiladi:
- O'zgaruvchi KEYIN e'lon qilinsa ham oldin ishlatish mumkin
- Oxirgi e'lon qilingan qiymat olinadi (last wins)

  .element { color: @color; }
  @color: red;     // e'lon qilish keyin ham bo'lishi mumkin
  @color: blue;    // OXIRGI qiymat olinadi — blue

═══════════════════════════════════════
  VARIABLE INTERPOLATION
═══════════════════════════════════════

O'zgaruvchini selector yoki property nomida ishlatish:

  @property: color;
  @selector: banner;

  .@{selector} {        // .banner
    @{property}: red;   // color: red
  }

Bu dynamic selector va property yaratish uchun qulay.

═══════════════════════════════════════
  NESTING (ICHMA-ICH YOZISH)
═══════════════════════════════════════

Less ham Sass kabi nesting qo'llab-quvvatlaydi:

  .nav {
    display: flex;
    .nav-item {
      padding: 10px;
      &:hover { background: #f5f5f5; }
      &.active { font-weight: bold; }
    }
  }

Nesting qoidalari Sass bilan BIR XIL:
- 3 darajadan chuqurroq nesting qilmang
- & parent selector BEM uchun qulay
- & teskari tartibda ham ishlaydi: .dark &

═══════════════════════════════════════
  & (PARENT SELECTOR)
═══════════════════════════════════════

Sass-dagi kabi & tashqi selectorni ifodalaydi:
  &__element — BEM element
  &--modifier — BEM modifier
  &:hover — pseudo-class
  &::before — pseudo-element
  .dark & — kontekst selector

═══════════════════════════════════════
  VARIABLE SCOPE
═══════════════════════════════════════

Less-da o'zgaruvchi scope qoidalari:
1. Lokal scope — {} ichida aniqlangan
2. Tashqi scope — agar lokal topilmasa, tashqariga qaraydi
3. Lazy evaluation — scope ichidagi oxirgi e'lon olinadi
4. Import qilingan fayllar ham scope-ga kiritiladi`,
  codeExamples: [
    {
      title: '@variables va lazy evaluation',
      language: 'less',
      description: 'Less o\'zgaruvchilari va ularning xususiyatlari',
      code: `// Asosiy o'zgaruvchilar
@primary: #3498db;
@secondary: #2ecc71;
@danger: #e74c3c;
@font-stack: 'Inter', sans-serif;
@spacing-unit: 8px;
@border-radius: 4px;

// Computed o'zgaruvchilar
@spacing-sm: @spacing-unit;         // 8px
@spacing-md: @spacing-unit * 2;     // 16px
@spacing-lg: @spacing-unit * 3;     // 24px

// Lazy evaluation — oxirgi qiymat olinadi
@theme-color: red;
.element-a { color: @theme-color; }  // blue!
@theme-color: blue;                   // oxirgi qiymat

// Variable interpolation
@prefix: app;
@property: margin;

.@{prefix}-container {          // .app-container
  @{property}-top: @spacing-md; // margin-top: 16px
}

// URL va import-da interpolation
@images: "../img";
.hero {
  background: url("@{images}/hero.jpg");
}

// O'zgaruvchini o'zgaruvchi sifatida (variable variables)
@primary-name: "primary";
@primary: #3498db;

.button {
  color: @@primary-name; // @primary qiymatini oladi = #3498db
}`
    },
    {
      title: 'Nesting va & parent selector',
      language: 'less',
      description: 'Ichma-ich yozish va parent selector Less-da',
      code: `// BEM + Nesting
.card {
  background: white;
  border-radius: @border-radius;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: @spacing-md;

  // .card__header
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: @spacing-md;

    // .card__header--sticky
    &--sticky {
      position: sticky;
      top: 0;
    }
  }

  // .card__body
  &__body {
    line-height: 1.6;
  }

  // .card__footer
  &__footer {
    display: flex;
    gap: @spacing-sm;
    margin-top: @spacing-md;
    padding-top: @spacing-sm;
    border-top: 1px solid #eee;
  }

  // .card:hover
  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }

  // .dark .card
  .dark & {
    background: #2d2d2d;
    color: #eee;
  }

  // .card.is-featured
  &.is-featured {
    border-left: 4px solid @primary;
  }
}

// Media query nesting
.container {
  width: 100%;
  padding: 0 @spacing-md;

  @media (min-width: 768px) {
    max-width: 720px;
    margin: 0 auto;
  }

  @media (min-width: 1200px) {
    max-width: 1140px;
  }
}`
    },
    {
      title: 'Scope va detached ruleset',
      language: 'less',
      description: 'O\'zgaruvchi scope qoidalari va detached ruleset',
      code: `// Scope namunasi
@color: red;        // global

.parent {
  @color: blue;     // lokal — faqat .parent ichida

  .child {
    color: @color;  // blue — eng yaqin scope dan oladi
  }
}

.sibling {
  color: @color;    // red — global scope dan
}

// Detached Ruleset — CSS blokni o'zgaruvchiga saqlash
@card-styles: {
  background: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
};

.product-card {
  @card-styles(); // detached ruleset-ni chaqirish
  border: 1px solid #eee;
}

.user-card {
  @card-styles();
  border-left: 3px solid @primary;
}

// Map-ga o'xshash pattern (Less-da native map yo'q)
#colors() {
  primary: #3498db;
  success: #2ecc71;
  danger: #e74c3c;
}

.alert {
  color: #colors[danger];         // #e74c3c
  border-color: #colors[danger];
}`
    }
  ],
  interviewQA: [
    {
      question: 'Less @variable va Sass $variable orasidagi farq nima?',
      answer: 'Asosiy farqlar: 1) Sintaksis: Less — @, Sass — $; 2) Evaluation: Less LAZY evaluation (oxirgi qiymat olinadi, keyin e\'lon qilinsa ham ishlaydi), Sass — EAGER (e\'lon qilingan nuqtadagi qiymat); 3) Scope: Less-da scope Sass-ga o\'xshash, lekin lazy evaluation tufayli kutilmagan natijalar bo\'lishi mumkin; 4) Interpolation: Less — @{var}, Sass — #{$var}.'
    },
    {
      question: 'Less-da variable interpolation nima va qachon ishlatiladi?',
      answer: 'Variable interpolation — @{variable} sintaksisi bilan o\'zgaruvchini string ichiga qo\'yish. Ishlatilish holatlari: 1) Dynamic selector: .@{prefix}-btn; 2) Property nomi: @{prop}: value; 3) URL: url("@{path}/img.jpg"); 4) @import: @import "@{theme}/base.less". Bu Sass-dagi #{$var} ning analogi. Oddiy CSS qiymatlarida interpolation kerak EMAS — to\'g\'ridan-to\'g\'ri @var yozish yetarli.'
    },
    {
      question: 'Less-da lazy evaluation nima va qanday muammo keltirib chiqarishi mumkin?',
      answer: 'Lazy evaluation — Less o\'zgaruvchini ishlatilgan joyda emas, SCOPE ning oxiridagi qiymatni oladi. Masalan: @x: 1; .a { val: @x; } @x: 2; — natija 2. Bu Sass-dan farq qiladi (Sass-da 1 bo\'lardi). Muammo: kutilmagan qiymatlar, debug qiyinligi. Yechim: o\'zgaruvchilarni scope boshida e\'lon qilish, qayta e\'lon qilmaslik.'
    }
  ],
  relatedTopics: [
    { techId: 'less', sectionId: 'less-basics', topicId: 'mixins', label: 'Less Mixins' },
    { techId: 'less', sectionId: 'less-basics', topicId: 'imports', label: 'Less @import' },
    { techId: 'sass', sectionId: 'sass-basics', topicId: 'variables-nesting', label: 'Sass Variables va Nesting' }
  ]
}
