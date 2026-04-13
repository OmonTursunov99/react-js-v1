import type { Topic } from '../../../types'

export const modules: Topic = {
  id: 'modules',
  title: '@use, @forward, Partials',
  importance: 3,
  status: 'to-learn',
  description: '@use, @forward, partials va namespace bilan modul tizimi',
  content: `Sass Module System — @use va @forward orqali fayllarni tashkil qilish tizimi. Bu @import-ning zamonaviy almashtirilishi bo'lib, namespace va encapsulation taqdim etadi.

═══════════════════════════════════════
  @IMPORT MUAMMOLARI (ESKI USUL)
═══════════════════════════════════════

@import endi DEPRECATED:
1. Barcha o'zgaruvchilar GLOBAL — nom to'qnashuvi
2. Bir fayl bir necha marta import qilinsa, CSS takrorlanadi
3. Qaysi fayldan kelganini bilish qiyin
4. Circular dependency xavfi

═══════════════════════════════════════
  @USE (YANGI USUL)
═══════════════════════════════════════

@use — faylni NAMESPACE bilan yuklaydi:

  @use 'variables';           // variables.$primary
  @use 'mixins';              // @include mixins.flex-center
  @use 'sass:math';           // math.div(10, 3)

XUSUSIYATLARI:
- Har bir fayl faqat BIR MARTA yuklanadi
- Avtomatik namespace (fayl nomi bo'yicha)
- O'zgaruvchilar private bo'lishi mumkin (_ prefiksi)
- Faylning boshida yozilishi SHART

Namespace o'zgartirish:
  @use 'variables' as vars;   // vars.$primary
  @use 'variables' as *;      // $primary (namespace yo'q)

═══════════════════════════════════════
  PARTIALS (QISMAN FAYLLAR)
═══════════════════════════════════════

_ bilan boshlanadigan fayllar "partial" deyiladi:
  _variables.scss
  _mixins.scss
  _reset.scss

Partials mustaqil CSS fayliga compilatsiya QILINMAYDI.
@use da _ va .scss yozish SHART EMAS:
  @use 'variables';  // _variables.scss ni yuklaydi

═══════════════════════════════════════
  @FORWARD (QAYTA EKSPORT)
═══════════════════════════════════════

@forward — boshqa faylning tarkibini o'zidan "qayta eksport" qiladi:

  // _index.scss
  @forward 'variables';
  @forward 'mixins';
  @forward 'functions';

Endi boshqa fayllar bitta @use bilan hammasini oladi:
  @use 'utils';  // utils/_index.scss orqali hammasi keladi

@forward parametrlari:
  @forward 'vars' show $primary, $secondary;  // faqat shularni
  @forward 'vars' hide $private-var;          // bularni emas
  @forward 'vars' as color-*;                 // prefiks qo'shish

═══════════════════════════════════════
  PRIVATE A'ZOLAR
═══════════════════════════════════════

_ yoki - bilan boshlangan nomlar PRIVATE:
  $_internal-spacing: 4px;  // boshqa faylda @use qilib bo'lmaydi
  $spacing: 8px;            // public — boshqa fayllar ko'radi

═══════════════════════════════════════
  BUILT-IN MODULLAR
═══════════════════════════════════════

Sass tayyor modullar beradi:
  @use 'sass:math'   — math.div(), math.round(), math.ceil()
  @use 'sass:color'  — color.adjust(), color.scale()
  @use 'sass:string' — string.index(), string.slice()
  @use 'sass:list'   — list.append(), list.nth()
  @use 'sass:map'    — map.get(), map.merge()
  @use 'sass:meta'   — meta.type-of(), meta.inspect()`,
  codeExamples: [
    {
      title: '@use va namespace',
      language: 'scss',
      description: 'Fayllarni @use bilan import qilish va namespace ishlatish',
      code: `// === _variables.scss ===
$primary: #3498db;
$secondary: #2ecc71;
$font-stack: 'Inter', sans-serif;
$_internal-base: 4px; // PRIVATE — tashqarida ko'rinmaydi
$spacing-sm: $_internal-base * 2;
$spacing-md: $_internal-base * 4;

// === _mixins.scss ===
@use 'variables' as vars;

@mixin button($bg: vars.$primary) {
  background: $bg;
  color: white;
  padding: vars.$spacing-sm vars.$spacing-md;
  border-radius: 4px;
}

@mixin respond-to($bp) {
  @media (min-width: $bp) {
    @content;
  }
}

// === main.scss ===
@use 'variables' as vars;   // vars.$primary
@use 'mixins';               // @include mixins.button
@use 'sass:math';            // math.div()

body {
  font-family: vars.$font-stack;
  font-size: math.div(16px, 1);
}

.btn {
  @include mixins.button;
}

.btn-danger {
  @include mixins.button(#e74c3c);
}

// Namespace yo'q qilish
@use 'variables' as *;
body { color: $primary; } // namespace kerak emas`
    },
    {
      title: '@forward bilan barrel fayl',
      language: 'scss',
      description: 'Fayllarni bitta nuqtadan qayta eksport qilish',
      code: `// === utils/_variables.scss ===
$primary: #3498db;
$secondary: #2ecc71;
$font-size: 16px;

// === utils/_mixins.scss ===
@use 'variables' as vars;
@mixin flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

// === utils/_functions.scss ===
@use 'sass:math';
@function rem($px) {
  @return math.div($px, 16) * 1rem;
}

// === utils/_index.scss (barrel fayl) ===
@forward 'variables';
@forward 'mixins';
@forward 'functions';

// === components/_card.scss ===
// BITTA @use bilan hammasiga kirish
@use '../utils';

.card {
  background: white;
  padding: utils.rem(24);
  color: utils.$primary;

  &__header {
    @include utils.flex-center;
    border-bottom: 1px solid lighten(utils.$primary, 30%);
  }
}

// === @forward with prefiks ===
// utils/_index.scss
@forward 'colors' as color-*;
@forward 'spacing' as space-*;

// Natija:
// utils.$color-primary (colors.$primary edi)
// utils.$space-md (spacing.$md edi)`
    },
    {
      title: 'Loyiha fayl tuzilmasi',
      language: 'scss',
      description: 'Professional Sass loyiha arxitekturasi',
      code: `// === TAVSIYA ETILADIGAN TUZILMA ===
//
// styles/
// ├── abstracts/
// │   ├── _variables.scss
// │   ├── _mixins.scss
// │   ├── _functions.scss
// │   └── _index.scss       (@forward)
// ├── base/
// │   ├── _reset.scss
// │   ├── _typography.scss
// │   └── _index.scss
// ├── components/
// │   ├── _button.scss
// │   ├── _card.scss
// │   ├── _modal.scss
// │   └── _index.scss
// ├── layouts/
// │   ├── _header.scss
// │   ├── _sidebar.scss
// │   └── _index.scss
// └── main.scss              (bitta entry point)

// === main.scss ===
@use 'abstracts';
@use 'base';
@use 'layouts';
@use 'components';

// === abstracts/_index.scss ===
@forward 'variables';
@forward 'mixins';
@forward 'functions';

// === components/_button.scss ===
@use '../abstracts' as *; // namespace yo'q

.btn {
  padding: $spacing-sm $spacing-md;
  border-radius: $border-radius;
  @include transition(all);

  &--primary { background: $primary; }
  &--secondary { background: $secondary; }
}`
    }
  ],
  interviewQA: [
    {
      question: '@use va @import orasidagi farq nima?',
      answer: '@use: 1) Namespace beradi — nom to\'qnashuvi yo\'q; 2) Fayl faqat BIR MARTA yuklanadi; 3) Private a\'zolar (_ prefiksi); 4) Faylning BOSHIDA yozilishi shart. @import: 1) Hamma narsa global; 2) Bir fayl bir necha marta yuklanishi mumkin — CSS takrorlanadi; 3) Private mexanizm yo\'q; 4) Har joyda yozish mumkin. @import endi deprecated — @use ishlatish kerak.'
    },
    {
      question: '@forward nima uchun kerak va qachon ishlatiladi?',
      answer: '@forward — "barrel file" yaratish uchun. Masalan, utils/ papkasida 5 ta fayl bor. @forward har birini _index.scss da qayta eksport qiladi. Natijada boshqa fayllar bitta @use \'utils\' bilan hammasiga kiradi. @forward parametrlari: show (faqat ko\'rsatilganlarni), hide (ko\'rsatilganlarni yashirish), as prefix-* (prefiks qo\'shish). Bu katta loyihalarda API-ni boshqarish uchun muhim.'
    },
    {
      question: 'Sass-da private a\'zolarni qanday yaratiladi?',
      answer: 'Sass-da _ (underscore) yoki - (hyphen) bilan boshlanadigan o\'zgaruvchilar, funksiyalar va mixin-lar PRIVATE hisoblanadi. Ularni @use bilan import qilgan boshqa fayl ko\'rmaydi. Masalan: $_base-unit: 4px — faqat shu fayl ichida ishlaydi. Bu encapsulation mexanizmi bo\'lib, ichki implementatsiya tafsilotlarini yashirish uchun ishlatiladi.'
    },
    {
      question: 'Sass built-in modullardan qaysilarini bilasiz?',
      answer: 'Sass 7 ta built-in modul beradi: 1) sass:math — div(), round(), ceil(), floor(), percentage(); 2) sass:color — adjust(), scale(), mix(), complement(); 3) sass:string — index(), slice(), to-upper-case(); 4) sass:list — append(), nth(), join(), length(); 5) sass:map — get(), merge(), has-key(), keys(), values(); 6) sass:meta — type-of(), inspect(), content-exists(); 7) sass:selector — nest(), replace().'
    }
  ],
  relatedTopics: [
    { techId: 'sass', sectionId: 'sass-basics', topicId: 'variables-nesting', label: '$variables va Nesting' },
    { techId: 'sass', sectionId: 'sass-basics', topicId: 'mixins', label: 'Mixins' },
    { techId: 'less', sectionId: 'less-basics', topicId: 'imports', label: 'Less @import' }
  ]
}
