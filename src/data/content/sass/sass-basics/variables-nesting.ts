import type { Topic } from '../../../types'

export const variablesNesting: Topic = {
  id: 'variables-nesting',
  title: '$variables, Nesting, & Parent Selector',
  importance: 3,
  status: 'to-learn',
  description: 'Sass o\'zgaruvchilari, nesting va & parent selector',
  content: `Sass — CSS preprocessor bo'lib, oddiy CSS-ga quvvatli imkoniyatlar qo'shadi. Eng asosiy xususiyatlari: o'zgaruvchilar ($variables), ichma-ich yozish (nesting) va & (parent selector).

═══════════════════════════════════════
  $VARIABLES (O'ZGARUVCHILAR)
═══════════════════════════════════════

Sass-da o'zgaruvchilar $ belgisi bilan boshlanadi.
Ular ranglar, o'lchamlar, fontlar kabi qayta ishlatiladigan qiymatlarni saqlaydi:

  $primary-color: #3498db;
  $font-size-base: 16px;
  $spacing-unit: 8px;

O'zgaruvchilar SCOPE-ga ega:
- Global scope: fayl darajasida e'lon qilingan
- Local scope: {} ichida e'lon qilingan (faqat shu blokda ko'rinadi)
- !global flag: lokal o'zgaruvchini global qiladi
- !default flag: agar o'zgaruvchi MAVJUD bo'lmasa, shu qiymatni beradi

CSS Custom Properties (--var) dan farqi:
- Sass variables COMPILE vaqtida hisoblanadi (static)
- CSS variables RUNTIME da ishlaydi (dynamic)
- Sass variables cascading qilmaydi
- CSS variables DOM ierarxiyasiga bog'liq

═══════════════════════════════════════
  NESTING (ICHMA-ICH YOZISH)
═══════════════════════════════════════

Sass HTML ierarxiyasiga o'xshab CSS yozish imkonini beradi:

  .nav {
    background: white;
    &__list { display: flex; }
    &__item { padding: 10px; }
  }

MUHIM QOIDA: 3 darajadan chuqurroq nesting QILMANG!
Chuqur nesting:
- CSS specificity-ni oshiradi
- Kodni o'qish qiyinlashadi
- Performance-ga salbiy ta'sir qiladi

═══════════════════════════════════════
  & (PARENT SELECTOR)
═══════════════════════════════════════

& belgisi tashqi selectorni ifodalaydi:

1. BEM uslubida: &__element, &--modifier
2. Pseudo-class: &:hover, &:focus, &:first-child
3. Pseudo-element: &::before, &::after
4. Teskari tartib: .dark & — tashqi kontekstda ishlatish
5. Birlashtirish: &.active — qo'shimcha class qo'shish

& aslida STRINGNI almashtirishdir — tashqi selectorning to'liq matni & o'rniga qo'yiladi.

═══════════════════════════════════════
  AMALIY MASLAHATLAR
═══════════════════════════════════════

- O'zgaruvchilarni alohida _variables.scss faylida saqlang
- Design token sifatida rang, spacing, font o'lchamlarini markazlashtiring
- Nesting-ni BEM metodologiyasi bilan birgalikda ishlating
- & parent selector-ni pseudo-class va BEM uchun faol foydalaning`,
  codeExamples: [
    {
      title: '$variables va scope',
      language: 'scss',
      description: 'Sass o\'zgaruvchilari va ularning scope qoidalari',
      code: `// _variables.scss — global o'zgaruvchilar
$primary: #3498db;
$secondary: #2ecc71;
$danger: #e74c3c;
$font-stack: 'Inter', sans-serif;
$spacing: 8px;
$border-radius: 4px;

// !default — agar oldin e'lon qilinmagan bo'lsa
$theme-color: blue !default;

// Scope namunasi
.card {
  $card-padding: 16px; // LOCAL — faqat .card ichida
  padding: $card-padding;
  color: $primary;      // GLOBAL — hamma joyda

  .card__body {
    padding: $card-padding; // LOCAL ham ichki bloklarda ishlaydi
  }
}

// .card tashqarisida $card-padding ISHLAMAYDI!

// !global flag
.theme-dark {
  $primary: #1a73e8 !global; // global $primary ni o'zgartiradi
  background: #1a1a1a;
}`
    },
    {
      title: 'Nesting va & parent selector',
      language: 'scss',
      description: 'Ichma-ich yozish va parent selector misollari',
      code: `// BEM + Nesting
.nav {
  display: flex;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  // BEM Element: .nav__list
  &__list {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  // BEM Element: .nav__item
  &__item {
    padding: 12px 16px;

    // Pseudo-class: .nav__item:hover
    &:hover {
      background: #f5f5f5;
    }

    // BEM Modifier: .nav__item--active
    &--active {
      color: $primary;
      border-bottom: 2px solid $primary;
    }
  }

  // BEM Element: .nav__link
  &__link {
    text-decoration: none;
    color: inherit;

    // Pseudo-element: .nav__link::after
    &::after {
      content: '';
      display: block;
      height: 2px;
      transform: scaleX(0);
      transition: transform 0.3s;
    }

    &:hover::after {
      transform: scaleX(1);
    }
  }
}

// Teskari tartib (context selector)
.button {
  background: white;
  color: black;

  // .dark .button
  .dark & {
    background: #333;
    color: white;
  }

  // .button.is-loading
  &.is-loading {
    opacity: 0.6;
    pointer-events: none;
  }
}`
    },
    {
      title: 'CSS Custom Properties bilan birgalikda',
      language: 'scss',
      description: 'Sass variables va CSS variables ni birga ishlatish',
      code: `// Sass variables -> CSS Custom Properties
$colors: (
  'primary': #3498db,
  'secondary': #2ecc71,
  'danger': #e74c3c,
);

:root {
  @each $name, $color in $colors {
    --color-#{$name}: #{$color};
  }
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
}

// Foydalanish
.card {
  // Sass variable — compile vaqtida
  border-radius: $border-radius;

  // CSS variable — runtime da (tema almashtirish uchun)
  background: var(--color-primary);
  padding: var(--spacing-md);
}`
    }
  ],
  interviewQA: [
    {
      question: 'Sass $variable va CSS Custom Property (--var) orasidagi farq nima?',
      answer: 'Sass $variable compile vaqtida hisoblanadi va yakuniy CSS-da qiymat sifatida yoziladi — runtime da o\'zgartirib bo\'lmaydi. CSS Custom Property (--var) esa runtime da ishlaydi, JavaScript orqali o\'zgartiriladi, cascading va inheritance qiladi. Tema almashtirish uchun CSS variables, static dizayn tokenlari uchun Sass variables mos keladi.'
    },
    {
      question: 'Nesting-ning qanday kamchiliklari bor va qanday oldini olasiz?',
      answer: 'Chuqur nesting (4+ daraja) natijasida: 1) CSS specificity oshadi va override qilish qiyinlashadi; 2) Yakuniy CSS hajmi kattalashadi; 3) Kod o\'qilishi yomonlashadi. Oldini olish: BEM metodologiyasi ishlatish, 3 darajadan oshirmaslik, & parent selector bilan tekis tuzilma yaratish.'
    },
    {
      question: '& (parent selector) qanday ishlaydi va qanday holatlarda ishlatiladi?',
      answer: '& tashqi selector-ning to\'liq matnini ifodalaydi. Ishlatilish holatlari: 1) BEM — &__element, &--modifier; 2) Pseudo-class — &:hover, &:focus; 3) Pseudo-element — &::before; 4) Context — .dark & (teskari tartib); 5) Qo\'shimcha class — &.active. & aslida string interpolation — tashqi selector matni & o\'rniga qo\'yiladi.'
    }
  ],
  relatedTopics: [
    { techId: 'sass', sectionId: 'sass-basics', topicId: 'mixins', label: 'Mixins' },
    { techId: 'sass', sectionId: 'sass-basics', topicId: 'modules', label: '@use va @forward' },
    { techId: 'less', sectionId: 'less-basics', topicId: 'variables-nesting', label: 'Less Variables va Nesting' }
  ]
}
