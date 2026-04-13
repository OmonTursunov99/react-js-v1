import type { Topic } from '../../../types'

export const animations: Topic = {
  id: 'animations',
  title: 'Animatsiyalar',
  importance: 2,
  status: 'to-learn',
  description: 'Transitions, @keyframes, transform, GPU acceleration, View Transitions',
  content: `CSS ANIMATSIYALAR — HARAKATLANUVCHI INTERFEYSLAR
══════════════════════════════════════

CSS animatsiyalar ikki turga bo'linadi:
1. Transition — A holatdan B holatga silliq o'tish
2. Animation (@keyframes) — murakkab, ko'p bosqichli animatsiya

MUHIM: Animatsiya foydalanuvchi tajribasini yaxshilash uchun.
Ortiqcha animatsiya saytni sekinlashtiradi va bezovta qiladi.

══════════════════════════════════════
1. TRANSITION
══════════════════════════════════════

  /* To'liq sintaksis */
  transition: property duration timing-function delay;

  /* Misollar */
  transition: all 0.3s ease;
  transition: opacity 0.2s ease-in-out;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  /* Bir nechta xossa */
  transition:
    background-color 0.3s ease,
    transform 0.2s ease-out,
    box-shadow 0.3s ease;

Timing functions:
  ease        — sekin boshlaydi, tezlashadi, sekin tugaydi (default)
  linear      — bir xil tezlik
  ease-in     — sekin boshlaydi
  ease-out    — sekin tugaydi
  ease-in-out — sekin boshlanadi va tugaydi
  cubic-bezier(x1,y1,x2,y2) — maxsus egri chiziq

MUHIM: transition: all ishlatishdan SAQLANING — barcha
xossalar animatsiya bo'ladi (layout shift, rang, shadow).
Faqat kerakli xossalarni ko'rsating.

══════════════════════════════════════
2. @KEYFRAMES VA ANIMATION
══════════════════════════════════════

  /* Keyframe aniqlash */
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  @keyframes slideUp {
    0%   { transform: translateY(20px); opacity: 0; }
    60%  { opacity: 1; }
    100% { transform: translateY(0); }
  }

  /* Animation xossalari */
  animation-name: fadeIn;
  animation-duration: 0.3s;
  animation-timing-function: ease-out;
  animation-delay: 0s;
  animation-iteration-count: 1;      /* infinite */
  animation-direction: normal;        /* reverse, alternate */
  animation-fill-mode: forwards;      /* backwards, both */
  animation-play-state: running;      /* paused */

  /* Shorthand */
  animation: slideUp 0.5s ease-out forwards;
  animation: pulse 2s ease-in-out infinite alternate;

animation-fill-mode MUHIM:
  none     — animatsiyadan oldin/keyin stil yo'q
  forwards — oxirgi kadr holatida qoladi
  backwards — delay vaqtida birinchi kadr ko'rinadi
  both     — ikkalasi ham

══════════════════════════════════════
3. TRANSFORM
══════════════════════════════════════

  /* Asosiy transformatsiyalar */
  transform: translateX(100px);
  transform: translateY(-50%);
  transform: translate(10px, 20px);

  transform: rotate(45deg);
  transform: rotateX(180deg);     /* 3D */
  transform: rotateY(90deg);      /* 3D */

  transform: scale(1.2);
  transform: scaleX(0.5);

  transform: skew(10deg, 5deg);

  /* Bir nechta — tartib muhim! */
  transform: translateX(100px) rotate(45deg) scale(1.1);

  /* Transform markazi */
  transform-origin: center center;  /* default */
  transform-origin: top left;
  transform-origin: 50% 100%;

MUHIM: translate, rotate, scale, skew — LAYOUT ga
ta'sir QILMAYDI. Element o'z joyida qoladi, faqat
vizual ko'rinishi o'zgaradi. Bu GPU acceleration uchun muhim.

══════════════════════════════════════
4. GPU ACCELERATION VA PERFORMANCE
══════════════════════════════════════

GPU da ishlaydi (TEZKOR — reflow/repaint yo'q):
  transform    — translate, rotate, scale
  opacity      — shaffoflik

CPU da ishlaydi (SEKIN — layout/paint kerak):
  width, height, margin, padding
  top, left, right, bottom
  background-color, border
  font-size, box-shadow

  /* will-change — brauzerga tayyorgarlik */
  .card:hover { transform: scale(1.05); }
  .card { will-change: transform; }

MUHIM will-change qoidalari:
  - Faqat haqiqatan animatsiya bo'ladigan elementlarga
  - Juda ko'p elementga bermang — xotira sarflaydi
  - Animatsiya tugagandan keyin olib tashlash yaxshi

══════════════════════════════════════
5. PREFERS-REDUCED-MOTION
══════════════════════════════════════

Ba'zi foydalanuvchilar animatsiyadan bezovtalanadi (vestibular
disorder, motion sickness). OS da "Reduce motion" yoqilgan bo'ladi.

  /* Animatsiyalarni o'chirish */
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }

MUHIM: Bu accessibility talabi. Senior darajadagi
loyihalarda prefers-reduced-motion MAJBURIY.

══════════════════════════════════════
6. VIEW TRANSITIONS API
══════════════════════════════════════

Sahifalar orasidagi silliq o'tish — avval faqat
JavaScript framework larda (Framer Motion, GSAP) mumkin edi.

  /* CSS da */
  @view-transition {
    navigation: auto;
  }

  ::view-transition-old(root) {
    animation: fade-out 0.3s ease;
  }
  ::view-transition-new(root) {
    animation: fade-in 0.3s ease;
  }

  /* Alohida element uchun */
  .card { view-transition-name: card-hero; }

  ::view-transition-old(card-hero) {
    animation: scale-down 0.3s ease;
  }
  ::view-transition-new(card-hero) {
    animation: scale-up 0.3s ease;
  }

MUHIM: View Transitions hozir Chrome 111+ da ishlaydi.
Safari va Firefox da hali to'liq qo'llab-quvvatlanmagan.`,
  codeExamples: [
    {
      title: 'Transition — button hover va focus effektlari',
      language: 'css',
      code: `/* ═══ BUTTON TRANSITIONS ═══ */
.btn {
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;

  /* Aniq xossalarni ko'rsating */
  transition:
    background-color 0.2s ease,
    transform 0.15s ease-out,
    box-shadow 0.2s ease;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn:active {
  transform: translateY(0);
  box-shadow: none;
  transition-duration: 0.05s;  /* tezroq qaytadi */
}

/* ═══ FOCUS RING (Accessibility) ═══ */
.btn:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
  /* transition: outline uchun yo'q */
}

/* ═══ DISABLED STATE ═══ */
.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;  /* hover effekti yo'q */
}`,
      description: 'Button uchun hover, active, focus, disabled transition',
    },
    {
      title: '@keyframes — murakkab animatsiyalar',
      language: 'css',
      code: `/* ═══ FADE + SLIDE ANIMATSIYA ═══ */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card {
  animation: slideInUp 0.5s ease-out forwards;
}

/* Har bir card kechikish bilan */
.card:nth-child(1) { animation-delay: 0ms; }
.card:nth-child(2) { animation-delay: 100ms; }
.card:nth-child(3) { animation-delay: 200ms; }
.card:nth-child(4) { animation-delay: 300ms; }

/* ═══ PULSE / BREATHING ═══ */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50%      { opacity: 0.5; }
}

.skeleton-loader {
  background: #e5e7eb;
  animation: pulse 1.5s ease-in-out infinite;
}

/* ═══ SPINNER ═══ */
@keyframes spin {
  to { transform: rotate(360deg); }
}

.spinner {
  width: 24px;
  height: 24px;
  border: 3px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}`,
      description: 'SlideIn, pulse, spinner kabi umumiy animatsiya patternlari',
    },
    {
      title: 'Transform + Transition — karta va modal',
      language: 'css',
      code: `/* ═══ CARD HOVER EFFECT ═══ */
.card {
  border-radius: 12px;
  overflow: hidden;
  transition:
    transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
}

.card__image {
  transition: transform 0.5s ease;
}

.card:hover .card__image {
  transform: scale(1.1);  /* zoom effekt */
}

/* ═══ MODAL ANIMATION ═══ */
.modal-overlay {
  opacity: 0;
  visibility: hidden;
  transition:
    opacity 0.3s ease,
    visibility 0.3s;
}

.modal-overlay.active {
  opacity: 1;
  visibility: visible;
}

.modal-content {
  transform: translateY(20px) scale(0.95);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-overlay.active .modal-content {
  transform: translateY(0) scale(1);
}`,
      description: 'Card hover zoom va modal ochilish animatsiyalari',
    },
    {
      title: 'GPU Performance — will-change va composite layers',
      language: 'css',
      code: `/* ═══ PERFORMANT ANIMATSIYALAR ═══ */
/* YAXSHI — faqat transform va opacity */
.performant {
  transition: transform 0.3s, opacity 0.3s;
}
.performant:hover {
  transform: scale(1.05);
  opacity: 0.9;
}

/* YOMON — layout shift chaqiradi */
.slow {
  transition: width 0.3s, margin 0.3s;
}
.slow:hover {
  width: 120%;      /* REFLOW! */
  margin-left: -10%; /* REFLOW! */
}

/* ═══ WILL-CHANGE ═══ */
/* Hover da will-change qo'shish */
.card {
  transition: transform 0.3s;
}
.card:hover {
  will-change: transform;
  transform: translateY(-4px);
}

/* ═══ PREFERS-REDUCED-MOTION ═══ */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}`,
      description: 'GPU-friendly animatsiyalar va accessibility',
    },
    {
      title: 'View Transitions API',
      language: 'css',
      code: `/* ═══ VIEW TRANSITIONS ═══ */
/* Sahifalar orasidagi o'tish */
@view-transition {
  navigation: auto;
}

/* Default crossfade */
::view-transition-old(root) {
  animation: fade-out 0.25s ease-in;
}
::view-transition-new(root) {
  animation: fade-in 0.25s ease-out;
}

@keyframes fade-out {
  from { opacity: 1; }
  to   { opacity: 0; }
}

@keyframes fade-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}

/* ═══ ELEMENT-LEVEL TRANSITION ═══ */
/* Alohida element o'z holatida animatsiya */
.product-image {
  view-transition-name: product-hero;
}

::view-transition-old(product-hero) {
  animation: shrink 0.3s ease-in;
}
::view-transition-new(product-hero) {
  animation: grow 0.3s ease-out;
}

/* MUHIM: view-transition-name UNIQUE bo'lishi kerak */
/* Bir sahifada ikki element bir xil nom olmaydi */`,
      description: 'CSS View Transitions bilan sahifalar arasi animatsiya',
    },
  ],
  interviewQA: [
    {
      question: 'Transition va Animation (keyframes) qanday farqlanadi? Qachon qaysi birini ishlatish kerak?',
      answer: `Transition: A holatdan B holatga o'tish. Faqat 2 ta holat — boshlang'ich va yakuniy. Trigger kerak (hover, focus, class o'zgarishi). Avtomatik boshlanmaydi.

Animation (@keyframes): ko'p bosqichli animatsiya (0%, 25%, 50%, 100%). Trigger shart emas — sahifa yuklanganda boshlanishi mumkin. infinite, alternate, delay kabi boshqaruv imkoniyatlari.

Qachon transition: hover effektlar, menu ochilish/yopilish, modal ko'rinish, rang o'zgarishi — A dan B ga oddiy o'tish kerak bo'lganda.

Qachon animation: loading spinner, skeleton pulse, sahifaga kirish animatsiyasi, murakkab ko'p bosqichli effektlar, doimiy takrorlanadigan animatsiyalar.

Qoida: oddiy interaktiv o'zgarishlar uchun transition, murakkab yoki mustaqil animatsiyalar uchun @keyframes.`,
    },
    {
      question: `Nima uchun width/height o'rniga transform ishlatish kerak? GPU acceleration qanday ishlaydi?`,
      answer: `Brauzer rendering pipeline: Style > Layout > Paint > Composite.

width/height o'zgarsa: Layout (reflow) + Paint + Composite — BARCHA bosqichlar qayta ishlaydi. Atrofdagi elementlar ham qayta joylashadi. Juda sekin.

transform/opacity o'zgarsa: FAQAT Composite bosqich. Element alohida GPU layerda bo'ladi, boshqa elementlarga ta'sir qilmaydi. Juda tezkor.

GPU acceleration: brauzer transform/opacity bilan ishlayotgan elementni alohida compositing layer ga ko'chiradi. Bu layer GPU da ishlaydi — 60fps (16ms per frame) ni oson ta'minlaydi.

will-change: transform; — brauzerga "bu element yaqinda transform qiladi" deydi, u oldindan GPU layer yaratadi. Lekin ortiqcha ishlatmang — har bir layer GPU xotirasini sarflaydi.

Amaliy qoida: FAQAT transform, opacity, filter animatsiya qiling. width, height, margin, padding animatsiyadan saqlaning.`,
    },
    {
      question: 'animation-fill-mode ning none, forwards, backwards, both qiymatlari qanday ishlaydi?',
      answer: `animation-fill-mode animatsiyadan OLDIN va KEYIN element qanday ko'rinishini belgilaydi.

none (default): animatsiyadan oldin va keyin element o'z oddiy stilida. Animatsiya tugaganda element "qaytib ketadi" (jump back).

forwards: animatsiya tugagandan keyin element OXIRGI KADR holatida QOLADI. Masalan, fadeIn tugaganda opacity: 1 saqlanadi.

backwards: animatsiya delay vaqtida element BIRINCHI KADR holatini oladi. Masalan, 1s delay bilan slideIn — delay vaqtida element allaqachon translateY(30px) da turadi.

both: forwards + backwards ikkalasi ham. Delay vaqtida birinchi kadr, tugaganda oxirgi kadr.

Eng ko'p ishlatiladigan: forwards — "animatsiya natijasini saqla". both — delay bor animatsiyalarda.

MUHIM: forwards bilan element inline stilga ega bo'lgandek ishlaydi — specificity yuqori bo'ladi.`,
    },
    {
      question: 'prefers-reduced-motion nima va nima uchun muhim?',
      answer: `prefers-reduced-motion — foydalanuvchi operatsion tizimda "harakatni kamaytirish" (Reduce Motion) sozlamasini yoqqanini aniqlash uchun media query.

Nima uchun muhim:
1. Vestibular disorder — ba'zi odamlarda animatsiya bosh aylanishi va ko'ngil aynishiga sabab bo'ladi.
2. Epilepsiya — tez miltillovchi animatsiyalar xuruj chaqirishi mumkin.
3. Accessibility standarti — WCAG 2.1 (2.3.3) talab qiladi.

Implementatsiya:
@media (prefers-reduced-motion: reduce) — animatsiya va transitionlarni o'chirish yoki juda tezlashtirish (0.01ms).

Lekin HAMMA animatsiyani o'chirish shart emas. Muhim feedback animatsiyalarini (masalan, toggle holati) saqlab, dekorativ animatsiyalarni (parallax, sahifaga kirish) o'chirish yaxshiroq.

MUHIM: Bu faqat CSS emas — JavaScript animatsiyalar (Framer Motion, GSAP) ham tekshirishi kerak: window.matchMedia("(prefers-reduced-motion: reduce)").matches.`,
    },
    {
      question: 'cubic-bezier timing function qanday ishlaydi? Custom easing qachon kerak?',
      answer: `cubic-bezier(x1, y1, x2, y2) — Bezier egri chizig'i bilan animatsiya tezlik grafikini belgilaydi. 4 ta qiymat — 2 ta nazorat nuqtasi (P1 va P2) koordinatalari.

Standart easinglar aslida cubic-bezier:
- ease = cubic-bezier(0.25, 0.1, 0.25, 1.0)
- linear = cubic-bezier(0, 0, 1, 1)
- ease-in = cubic-bezier(0.42, 0, 1, 1)
- ease-out = cubic-bezier(0, 0, 0.58, 1)

Custom easing qachon kerak:
1. Material Design motion: cubic-bezier(0.4, 0, 0.2, 1) — standart "deceleration"
2. "Bounce" effekt: y qiymatlari 1 dan oshadi, masalan cubic-bezier(0.34, 1.56, 0.64, 1)
3. "Elastic" effekt: salbiy y qiymatlari
4. Brand-specific motion — kompaniyaning o'ziga xos harakat uslubi

Asboblar: cubic-bezier.com — vizual editor. Chrome DevTools da animation paneli.

MUHIM: ortiqcha murakkab easing UX ni yomonlashtiradi. Aksariyat hollarda ease-out (elementlar paydo bo'lish uchun) va ease-in (yo'qolish uchun) yetarli.`,
    },
  ],
}
