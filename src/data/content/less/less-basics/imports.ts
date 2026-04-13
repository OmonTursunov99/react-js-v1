import type { Topic } from '../../../types'

export const imports: Topic = {
  id: 'imports',
  title: '@import, Reference, Inline',
  importance: 2,
  status: 'to-learn',
  description: '@import turlari: reference, inline, less vs css import',
  content: `Less-da @import — fayllarni birlashtirish va modul tizimi yaratish. Sass-dagi @use/@forward dan farqli ravishda, Less hali ham @import ishlatadi, lekin turli xil parametrlari bor.

═══════════════════════════════════════
  ASOSIY @IMPORT
═══════════════════════════════════════

  @import "variables.less";
  @import "mixins";           // .less kengaytmasi ixtiyoriy

Fayl turlari:
  @import "file.less";  — Less fayl sifatida kompilyatsiya qiladi
  @import "file.css";   — CSS @import sifatida qoldiradi
  @import "file";       — .less kengaytmasini qo'shib yuklaydi

═══════════════════════════════════════
  IMPORT PARAMETRLARI
═══════════════════════════════════════

  @import (keyword) "file";

Mavjud keyword-lar:

1. (reference) — FAQAT mixin/variable uchun, CSS chiqarilMAYDI:
   @import (reference) "bootstrap.less";
   // Bootstrap CSS-ga yozilmaydi, lekin
   // uning mixin va variable-larini ishlatish mumkin

2. (inline) — faylni o'zgarishsiz CSS-ga qo'yadi:
   @import (inline) "legacy.css";
   // Less parse qilmaydi, OLDINDAN qo'shadi

3. (less) — har qanday faylni Less sifatida parse qiladi:
   @import (less) "styles.css";

4. (css) — har qanday faylni CSS @import sifatida qoldiradi:
   @import (css) "styles.less";
   // Natija: @import "styles.less"; (CSS-da)

5. (once) — DEFAULT! Fayl faqat BIR MARTA yuklanadi:
   @import (once) "variables"; // bir necha marta yozsangiz ham 1 marta

6. (multiple) — faylni HAR SAFAR qayta yuklaydi:
   @import (multiple) "utilities";

7. (optional) — fayl topilmasa XATO bermaydi:
   @import (optional) "theme-custom";

Bir nechta parametr birga:
   @import (reference, optional) "external-lib";

═══════════════════════════════════════
  FAYL TUZILMASI (BEST PRACTICE)
═══════════════════════════════════════

  styles/
  ├── variables.less    — o'zgaruvchilar
  ├── mixins.less       — mixin-lar
  ├── reset.less        — CSS reset
  ├── base.less         — asosiy stillar
  ├── components/
  │   ├── button.less
  │   ├── card.less
  │   └── modal.less
  ├── layouts/
  │   ├── header.less
  │   └── footer.less
  └── main.less         — entry point (barcha import)

═══════════════════════════════════════
  LESS vs SASS MODUL TIZIMI
═══════════════════════════════════════

Less: faqat @import (namespace yo'q, global scope)
Sass: @use (namespace), @forward (re-export), private a'zolar

Bu Less-ning kamchiligi — katta loyihalarda nom to'qnashuvi xavfi yuqori.
Yechim: BEM nomlash, namespace mixin (#utils), izchil fayl tuzilmasi.`,
  codeExamples: [
    {
      title: 'Loyiha @import tuzilmasi',
      language: 'less',
      description: 'Professional Less loyiha fayl tashkil qilish',
      code: `// === main.less (entry point) ===

// 1. Variables va mixins — boshqa fayllar uchun kerak
@import "variables";
@import "mixins";

// 2. Reset va base
@import "reset";
@import "base";
@import "typography";

// 3. Layout
@import "layouts/header";
@import "layouts/sidebar";
@import "layouts/footer";

// 4. Components
@import "components/button";
@import "components/card";
@import "components/modal";
@import "components/form";

// 5. Utilities (eng oxirda — specificity uchun)
@import "utilities";

// 6. Ixtiyoriy custom tema (topilmasa xato bermaydi)
@import (optional) "theme-custom";

// === variables.less ===
@primary: #3498db;
@secondary: #2ecc71;
@danger: #e74c3c;
@font-stack: 'Inter', sans-serif;
@spacing: 8px;
@border-radius: 4px;
@transition-speed: 0.2s;

// Breakpoints
@screen-sm: 576px;
@screen-md: 768px;
@screen-lg: 992px;
@screen-xl: 1200px;`
    },
    {
      title: '(reference) import',
      language: 'less',
      description: 'Kutubxona mixin va variable larini CSS ga chiqarmasdan ishlatish',
      code: `// (reference) — eng foydali parametr!
// Faylning CSS-ini chiqarmaydi, faqat mixin/variable oladi

// Masalan, Bootstrap-dan faqat kerakli narsalarni olish:
@import (reference) "bootstrap/less/variables";
@import (reference) "bootstrap/less/mixins";

// Endi Bootstrap mixin-larini ishlatish mumkin,
// lekin Bootstrap CSS-i loyihangizga QOSHILMAYDI

.my-container {
  .make-container(); // Bootstrap mixin
  max-width: @screen-md-max; // Bootstrap variable
}

.my-row {
  .make-row(); // Bootstrap mixin
}

// Amaliy namuna — utility kutubxonasi
// utils.less da 1000+ class bor, lekin
// faqat mixin sifatida kerak:
@import (reference) "utils";

.card {
  .flex-center();  // utils dan mixin
  .rounded(8px);   // utils dan mixin
  // Natija: FAQAT .card CSS-ga yoziladi
  // utils.less ning 1000 class-i YOZILMAYDI
}

// (inline) — CSS faylni o'zgarishsiz qo'shish
// (legacy kod yoki third-party CSS)
@import (inline) "vendor/legacy-styles.css";

// (multiple) — bir faylni bir necha marta import
// Har bir import da har xil o'zgaruvchi berish
@theme-color: red;
@import (multiple) "theme-component";
@theme-color: blue;
@import (multiple) "theme-component";`
    },
    {
      title: 'Import guard pattern',
      language: 'less',
      description: 'Shartli import va environment asosida konfiguratsiya',
      code: `// Environment o'zgaruvchisi
@env: production; // yoki "development"

// Development-da qo'shimcha stillar
& when (@env = development) {
  @import "debug";        // debug grid overlay
  @import "dev-helpers";  // helper classlar
}

// Tema konfiguratsiyasi
@theme: dark; // yoki "light"

@import "variables";     // umumiy o'zgaruvchilar

// Temaga qarab import
& when (@theme = dark) {
  @import "themes/dark";
}
& when (@theme = light) {
  @import "themes/light";
}

@import "base";
@import "components";

// === themes/dark.less ===
@bg-color: #1a1a1a;
@text-color: #e0e0e0;
@border-color: #333;
@card-bg: #2d2d2d;

// === themes/light.less ===
@bg-color: #ffffff;
@text-color: #333333;
@border-color: #e0e0e0;
@card-bg: #ffffff;

// === base.less ===
body {
  background: @bg-color;
  color: @text-color;
}

.card {
  background: @card-bg;
  border: 1px solid @border-color;
}`
    }
  ],
  interviewQA: [
    {
      question: '@import (reference) nima qiladi va qachon ishlatiladi?',
      answer: '(reference) — import qilingan faylning CSS-ini CHIQARMAYDI, faqat mixin va o\'zgaruvchilarini oladi. Ishlatiladi: 1) Katta kutubxonadan (Bootstrap, Foundation) faqat kerakli narsalarni olishda; 2) Utility kutubxonasini mixin sifatida ishlatishda; 3) CSS hajmini optimallashtirish — faqat ishlatilgan qoidalar chiqadi. Bu Sass-dagi @use bilan placeholder (%)-ning anologi.'
    },
    {
      question: 'Less modul tizimining Sass-ga nisbatan qanday kamchiliklari bor?',
      answer: 'Less kamchiliklari: 1) Namespace YO\'Q — barcha import global scope-da, nom to\'qnashuvi xavfi; 2) @use/@forward analogi yo\'q — faqat @import; 3) Private a\'zolar (_ prefiksi) yo\'q; 4) Fayl faqat (once) bilan bir marta yuklanishini nazorat qilish kerak; 5) Re-export mexanizmi yo\'q. Yechim: BEM nomlash, namespace mixin (#utils), qat\'iy fayl tuzilmasi konventsiyasi.'
    },
    {
      question: '@import (once) va @import (multiple) qachon ishlatiladi?',
      answer: '(once) — DEFAULT xulq. Fayl bir necha marta import qilinsa ham, faqat BIR MARTA yuklanadi. Bu CSS takrorlanishni oldini oladi. (multiple) — faylni HAR SAFAR qayta yuklaydi. Qachon kerak: 1) Fayl har xil o\'zgaruvchilar bilan har xil natija berishi kerak bo\'lganda; 2) Parametrik tema generatsiya qilishda. Ko\'pincha (once) yetarli.'
    }
  ],
  relatedTopics: [
    { techId: 'less', sectionId: 'less-basics', topicId: 'variables-nesting', label: 'Less Variables' },
    { techId: 'less', sectionId: 'less-basics', topicId: 'sass-vs-less', label: 'Sass vs Less' },
    { techId: 'sass', sectionId: 'sass-basics', topicId: 'modules', label: 'Sass Modules' }
  ]
}
