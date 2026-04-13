import type { Topic } from '../../../types'

export const eventLoopTopic: Topic = {
  id: 'event-loop',
  title: 'Event Loop',
  importance: 3,
  status: 'to-learn',
  description: 'Call stack, task queue, microtask queue, rendering va Event Loop mexanizmi',

  content: `
# Event Loop — JavaScript-ning yurak urishi

## Event Loop nima?
Event Loop — JavaScript-ning **asinxron** vazifalarni boshqarish mexanizmi. JS **single-threaded**, ya'ni bir vaqtda faqat bitta operatsiya bajaradi. Event Loop tufayli asinxron kodlar (setTimeout, fetch, Promise) blokirovkasiz ishlaydi.

## Call Stack
Call Stack — hozir bajarilayotgan funksiyalar to'plami (LIFO). Funksiya chaqirilganda stack-ga qo'shiladi, tugaganda chiqariladi. Agar stack to'lib ketsa — **Stack Overflow**.

## Web APIs / Node APIs
setTimeout, fetch, DOM events — bular JavaScript engine-ning ishi emas, **brauzer (yoki Node.js)** tomonidan boshqariladi. JS bu API-larni chaqiradi va natijani kutadi.

## Task Queue (Macrotask Queue)
setTimeout, setInterval, I/O, UI events callback-lari shu yerga tushadi. Event Loop call stack bo'shagandan keyin task queue-dan **bitta** vazifani oladi.

## Microtask Queue
Promise.then/catch/finally, queueMicrotask, MutationObserver callback-lari shu yerga tushadi. Microtask-lar **har bir macrotask-dan keyin, keyingi macrotask-dan OLDIN** to'liq bajariladi.

## Event Loop algoritmi
1. Call Stack bo'sh bo'lguncha kut
2. Microtask queue-ni **to'liq** bo'shat (barcha microtask-lar)
3. Agar rendering kerak bo'lsa — render (requestAnimationFrame)
4. Task queue-dan **bitta** macrotask ol va bajat
5. 1-chi qadamga qaytar

## Rendering
Brauzer odatda 60fps (har 16.6ms) render qiladi. Render microtask-lardan keyin, keyingi macrotask-dan oldin bo'ladi. requestAnimationFrame — render oldidan chaqiriladi.

## Starvation muammosi
Agar microtask ichida yangi microtask qo'shilsa, task queue hech qachon navbat olmaydi — bu **starvation**. Brauzer "hang" bo'ladi.

## Amaliy ahamiyati
- setTimeout(fn, 0) — haqiqatda 0ms emas, kamida 4ms (brauzer limiti) + macrotask queue kutishi
- Promise.then() har doim setTimeout-dan OLDIN ishlaydi
- UI yangilanishi uchun macrotask kerak (microtask yetarli emas)
- Og'ir hisob-kitob main thread-ni bloklaydi — Web Worker ishlating

## Node.js Event Loop
Node.js-da qo'shimcha fazalar bor: timers, pending callbacks, idle, poll, check (setImmediate), close callbacks. Lekin asosiy konsept bir xil — single-threaded + event-driven.
  `.trim(),

  codeExamples: [
    {
      title: 'Event Loop tartibi — microtask vs macrotask',
      language: 'js',
      description: 'Konsolga chiqish tartibini oldindan aytish — intervyu klassikasi',
      code: `console.log('1 — Sinxron');

setTimeout(() => {
  console.log('2 — setTimeout (macrotask)');
}, 0);

Promise.resolve()
  .then(() => {
    console.log('3 — Promise.then (microtask)');
  })
  .then(() => {
    console.log('4 — Promise.then zanjir (microtask)');
  });

queueMicrotask(() => {
  console.log('5 — queueMicrotask (microtask)');
});

console.log('6 — Sinxron');

// NATIJA (tartib):
// 1 — Sinxron
// 6 — Sinxron
// 3 — Promise.then (microtask)
// 5 — queueMicrotask (microtask)
// 4 — Promise.then zanjir (microtask)
// 2 — setTimeout (macrotask)

// Sabab: Avval sinxron kod, keyin BARCHA microtask-lar,
// keyin bitta macrotask`
    },
    {
      title: 'Murakkab Event Loop savoli',
      language: 'js',
      description: 'Ichma-ich setTimeout va Promise — tartibni aniqlang',
      code: `console.log('start');

setTimeout(() => {
  console.log('timeout 1');
  Promise.resolve().then(() => {
    console.log('promise inside timeout');
  });
}, 0);

setTimeout(() => {
  console.log('timeout 2');
}, 0);

Promise.resolve()
  .then(() => {
    console.log('promise 1');
    setTimeout(() => {
      console.log('timeout inside promise');
    }, 0);
  })
  .then(() => {
    console.log('promise 2');
  });

console.log('end');

// NATIJA:
// start
// end
// promise 1
// promise 2
// timeout 1
// promise inside timeout    ← microtask, timeout 2 dan OLDIN
// timeout 2
// timeout inside promise`
    },
    {
      title: 'Call Stack va Stack Overflow',
      language: 'js',
      description: 'Stack ishlash prinsipi va overflow xatosi',
      code: `// Call Stack vizualizatsiyasi
function a() {
  console.log('a boshlanishi');
  b();
  console.log('a tugashi');
}

function b() {
  console.log('b boshlanishi');
  c();
  console.log('b tugashi');
}

function c() {
  console.log('c');
}

a();
// Stack holati:
// a() → stack: [a]
// b() → stack: [a, b]
// c() → stack: [a, b, c]
// c tugadi → stack: [a, b]
// b tugadi → stack: [a]
// a tugadi → stack: []

// Natija:
// a boshlanishi → b boshlanishi → c → b tugashi → a tugashi

// Stack Overflow
function infinite() {
  infinite(); // cheksiz rekursiya
}
// infinite(); // RangeError: Maximum call stack size exceeded

// Yechim: trampoline pattern
function trampoline(fn) {
  let result = fn();
  while (typeof result === 'function') {
    result = result();
  }
  return result;
}

function factorial(n, acc = 1) {
  if (n <= 1) return acc;
  return () => factorial(n - 1, n * acc); // funksiya qaytaradi
}

console.log(trampoline(() => factorial(100000))); // Infinity, lekin stack overflow yo'q`
    },
    {
      title: 'requestAnimationFrame va rendering',
      language: 'js',
      description: 'Render cycle va rAF o\'rni Event Loop-da',
      code: `// requestAnimationFrame — render oldidan chaqiriladi
// setTimeout — keyingi macrotask siklida

const box = document.getElementById('box');

// NOTO'G'RI — microtask-da DOM o'zgartish
// DOM yangilanadi, lekin render KEYIN bo'ladi
Promise.resolve().then(() => {
  box.style.left = '100px';
  // bu microtask — render hali bo'lmagan
});

// TO'G'RI — animatsiya uchun rAF
let position = 0;
function animate() {
  position += 2;
  box.style.transform = \`translateX(\${position}px)\`;

  if (position < 300) {
    requestAnimationFrame(animate);
  }
}
requestAnimationFrame(animate);

// Event Loop + Render tartibi:
// 1. Macrotask (1 ta)
// 2. Microtask queue (to'liq)
// 3. requestAnimationFrame callbacks
// 4. Render (Layout, Paint)
// 5. requestIdleCallback (agar vaqt qolsa)
// 6. Keyingi macrotask

// setTimeout vs rAF
// setTimeout(fn, 16) — aniq 16ms emas, macrotask queue kutadi
// rAF — render bilan sinxronlashgan, aniq 60fps`
    }
  ],

  interviewQA: [
    {
      question: 'Event Loop qanday ishlaydi? Qadamma-qadam tushuntiring.',
      answer: '1) Sinxron kod call stack-da bajariladi. 2) Asinxron API-lar (setTimeout, fetch) brauzer/Node API-ga uzatiladi. 3) Callback tayyor bo\'lganda tegishli queue-ga qo\'yiladi. 4) Call stack bo\'shaganda Event Loop: avval microtask queue-ni TO\'LIQ bo\'shatadi (Promise.then, queueMicrotask). 5) Keyin render (rAF + paint). 6) Keyin macrotask queue-dan BITTA task oladi. 7) Yana microtask queue tekshiriladi. Bu tsikl cheksiz davom etadi.'
    },
    {
      question: 'Microtask va Macrotask farqi nima? Misollar keltiring.',
      answer: 'Microtask: Promise.then/catch/finally, queueMicrotask, MutationObserver. Macrotask: setTimeout, setInterval, setImmediate (Node), I/O, UI events. Farq: microtask-lar har bir macrotask-dan KEYIN, keyingi macrotask-dan OLDIN to\'liq bajariladi. Ya\'ni microtask prioriteti yuqori. setTimeout(fn,0) dan oldin Promise.then ishlaydi. Microtask ichida yangi microtask qo\'shsa — u ham shu siklda bajariladi (starvation xavfi).'
    },
    {
      question: 'setTimeout(fn, 0) haqiqatda 0ms keyin ishlaydimi?',
      answer: 'Yo\'q. Sabablari: 1) HTML spec bo\'yicha nested setTimeout minimum 4ms (clamping). 2) Call stack bo\'shashi kerak. 3) Barcha microtask-lar tugashi kerak. 4) Task queue-dagi oldingi macrotask-lar tugashi kerak. Amalda setTimeout(fn, 0) ~4-10ms keyin ishlaydi. Bu "asinxron, lekin imkon qadar tez" degani — hozirgi sinxron kodni tugating, keyin ishga tushiring. UI blocking-ni oldini olish uchun ishlatiladi.'
    },
    {
      question: 'Quyidagi kod natijasini ayting: setTimeout, Promise, console.log aralashgan holda.',
      answer: 'Algoritm: 1) Barcha sinxron console.log — darhol. 2) Promise.then — microtask queue. 3) setTimeout — macrotask queue. Tartib: SINXRON → MICROTASK (barcha) → MACROTASK (bitta). Agar macrotask ichida Promise bo\'lsa — u keyingi macrotask-dan oldin ishlaydi. Agar microtask ichida setTimeout bo\'lsa — u keyingi macrotask siklida ishlaydi. Kalit: har doim "hozirgi task tugasin, microtask-lar tugasin, keyin keyingi macrotask".'
    },
    {
      question: 'JavaScript single-threaded bo\'lsa, qanday qilib asinxron ishlaydi?',
      answer: 'JS ENGINE (V8) single-threaded — faqat bitta call stack. Lekin BRAUZER multi-threaded: Network thread (fetch), Timer thread (setTimeout), DOM/UI thread. JS faqat callback-ni queue-ga qo\'yishni buyuradi, haqiqiy ish brauzer thread-larida bajariladi. Natija tayyor bo\'lganda callback queue-ga tushadi, Event Loop uni stack-ga uzatadi. Shuning uchun "JS asinxron" — bu aslida "JS + brauzer/Node runtime birgalikda asinxron".'
    }
  ],

  relatedTopics: [
    { techId: 'javascript', sectionId: 'async-javascript', topicId: 'promises', label: 'Promises' },
    { techId: 'javascript', sectionId: 'async-javascript', topicId: 'microtasks-macrotasks', label: 'Microtasks va Macrotasks' },
    { techId: 'javascript', sectionId: 'async-javascript', topicId: 'callbacks', label: 'Callbacks' }
  ]
}
