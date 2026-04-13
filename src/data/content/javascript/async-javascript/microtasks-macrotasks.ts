import type { Topic } from '../../../types'

export const microtasksMacrotasksTopic: Topic = {
  id: 'microtasks-macrotasks',
  title: 'Microtasks va Macrotasks',
  importance: 2,
  status: 'to-learn',
  description: 'Microtask vs macrotask queue, execution order, queueMicrotask va batafsil tahlil',

  content: `
# Microtasks va Macrotasks — Chuqur tushuncha

## Ikki queue
JavaScript Event Loop-da **ikki xil** vazifa navbati bor:
1. **Macrotask queue** (task queue) — "katta" vazifalar
2. **Microtask queue** — "kichik", yuqori prioritetli vazifalar

## Macrotask-lar
- \`setTimeout\` / \`setInterval\`
- \`setImmediate\` (Node.js)
- I/O operatsiyalari
- UI rendering events
- \`MessageChannel\`
- \`requestAnimationFrame\` (ba'zi manbalarda alohida queue)

## Microtask-lar
- \`Promise.then()\` / \`.catch()\` / \`.finally()\`
- \`queueMicrotask()\`
- \`MutationObserver\`
- \`process.nextTick()\` (Node.js — microtask-dan ham oldin)

## Bajarilish tartibi
Har bir Event Loop iteratsiyasida:
1. Call stack-dagi **sinxron kodni** tugatish
2. **Barcha microtask**-larni bajarish (queue to'liq bo'shaguncha)
3. **Bitta macrotask** ni bajarish
4. Yana microtask queue-ni tekshirish
5. Render (agar kerak bo'lsa)

## queueMicrotask()
ES2019 da qo'shilgan. To'g'ridan-to'g'ri microtask queue-ga vazifa qo'shish. Promise.resolve().then(fn) dan tozaroq va semantik aniqroq.

## Microtask ichida microtask
Microtask ichida yangi microtask qo'shilsa — u ham **shu siklda** bajariladi. Bu **starvation** xavfi tug'diradi — macrotask va render hech qachon navbat olmaydi.

## process.nextTick (Node.js)
Node.js-da \`process.nextTick()\` — microtask-dan ham OLDIN bajariladi. Bu eng yuqori prioritet. Ko'p ishlatish tavsiya etilmaydi (starvation xavfi).

## Amaliy ahamiyati
- DOM o'zgartirish + ko'rish uchun macrotask kerak (microtask yetarli emas)
- Promise.then() har doim setTimeout-dan oldin
- Batch DOM updates uchun queueMicrotask foydali
- Performance: microtask tez, lekin ko'p bo'lsa UI freeze qiladi
  `.trim(),

  codeExamples: [
    {
      title: 'Microtask vs Macrotask tartibi',
      language: 'js',
      description: 'Qaysi biri oldin bajarilishini ko\'rish',
      code: `// Tartibni aniqlash
console.log('1 — sinxron');

setTimeout(() => {
  console.log('2 — setTimeout (macrotask)');
}, 0);

Promise.resolve().then(() => {
  console.log('3 — Promise (microtask)');
});

queueMicrotask(() => {
  console.log('4 — queueMicrotask (microtask)');
});

console.log('5 — sinxron');

// NATIJA:
// 1 — sinxron
// 5 — sinxron
// 3 — Promise (microtask)
// 4 — queueMicrotask (microtask)
// 2 — setTimeout (macrotask)

// Sabab:
// 1) Sinxron kod — darhol (1, 5)
// 2) Microtask queue — to'liq (3, 4)
// 3) Macrotask queue — bitta (2)

// Isbot: microtask macrotask-dan OLDIN
setTimeout(() => console.log('macro 1'), 0);
setTimeout(() => console.log('macro 2'), 0);
Promise.resolve().then(() => console.log('micro 1'));
Promise.resolve().then(() => console.log('micro 2'));
// micro 1, micro 2, macro 1, macro 2`
    },
    {
      title: 'Murakkab tartib — ichma-ich microtask va macrotask',
      language: 'js',
      description: 'Macrotask ichidagi microtask va aksincha',
      code: `setTimeout(() => {
  console.log('A — macrotask 1');

  Promise.resolve().then(() => {
    console.log('B — micro ichida macro 1');
  });

  console.log('C — macrotask 1 davomi');
}, 0);

setTimeout(() => {
  console.log('D — macrotask 2');
}, 0);

Promise.resolve().then(() => {
  console.log('E — microtask 1');

  setTimeout(() => {
    console.log('F — macro ichida micro');
  }, 0);

  Promise.resolve().then(() => {
    console.log('G — micro ichida micro');
  });
});

console.log('H — sinxron');

// NATIJA:
// H — sinxron        (sinxron, darhol)
// E — microtask 1    (micro queue)
// G — micro ichida micro (micro ichida yangi micro — shu siklda)
// A — macrotask 1    (birinchi macro)
// C — macrotask 1 davomi (sinxron — macro ichida)
// B — micro ichida macro 1 (macro tugadi, micro tekshir)
// D — macrotask 2    (ikkinchi macro)
// F — macro ichida micro (uchinchi macro — E dan qo'shilgan)`
    },
    {
      title: 'queueMicrotask va amaliy ishlatish',
      language: 'js',
      description: 'queueMicrotask() ishlatish holatlari',
      code: `// queueMicrotask — microtask queue-ga to'g'ridan-to'g'ri
// Promise.resolve().then(fn) dan tozaroq

// Batch DOM updates
let batchedUpdates = [];
let isBatching = false;

function batchUpdate(update) {
  batchedUpdates.push(update);

  if (!isBatching) {
    isBatching = true;
    queueMicrotask(() => {
      // Barcha sinxron update-lar tugagandan keyin bir marta
      const updates = [...batchedUpdates];
      batchedUpdates = [];
      isBatching = false;

      console.log(\`Batch: \${updates.length} ta yangilanish\`);
      updates.forEach(fn => fn());
    });
  }
}

// Bir nechta sinxron chaqiruv — bitta batch
batchUpdate(() => console.log('Update 1'));
batchUpdate(() => console.log('Update 2'));
batchUpdate(() => console.log('Update 3'));
// Konsol:
// Batch: 3 ta yangilanish
// Update 1
// Update 2
// Update 3

// Starvation xavfi
function starvation() {
  queueMicrotask(() => {
    console.log('Microtask...');
    starvation(); // cheksiz microtask — UI freeze!
  });
}
// starvation(); // BUNI ISHLATMANG! Brauzer hang bo'ladi

// TO'G'RI — og'ir ish uchun macrotask
function heavyWork(items, index = 0) {
  const BATCH_SIZE = 100;
  const end = Math.min(index + BATCH_SIZE, items.length);

  for (let i = index; i < end; i++) {
    processItem(items[i]);
  }

  if (end < items.length) {
    setTimeout(() => heavyWork(items, end), 0); // macrotask — UI yangilanadi
  }
}`
    },
    {
      title: 'Node.js — process.nextTick vs queueMicrotask',
      language: 'js',
      description: 'Node.js dagi qo\'shimcha microtask prioritetlari',
      code: `// Node.js da microtask ichida ham prioritet bor:
// 1. process.nextTick queue (eng yuqori)
// 2. Microtask queue (Promise, queueMicrotask)
// 3. Macrotask queue (setTimeout, setImmediate)

process.nextTick(() => {
  console.log('1 — nextTick');
});

Promise.resolve().then(() => {
  console.log('2 — Promise');
});

queueMicrotask(() => {
  console.log('3 — queueMicrotask');
});

setTimeout(() => {
  console.log('4 — setTimeout');
}, 0);

setImmediate(() => {
  console.log('5 — setImmediate');
});

console.log('6 — sinxron');

// NATIJA (Node.js):
// 6 — sinxron
// 1 — nextTick        (nextTick — eng yuqori prioritet)
// 2 — Promise          (microtask)
// 3 — queueMicrotask   (microtask)
// 4 — setTimeout       (macrotask — timers phase)
// 5 — setImmediate     (macrotask — check phase)

// Node.js Event Loop fazalari:
// ┌─ timers (setTimeout, setInterval)
// ├─ pending callbacks (I/O)
// ├─ idle, prepare
// ├─ poll (incoming I/O)
// ├─ check (setImmediate)
// └─ close callbacks

// Har bir faza orasida: nextTick + microtask queue bo'shatiladi`
    }
  ],

  interviewQA: [
    {
      question: 'Microtask va macrotask farqi nima? Misollar keltiring.',
      answer: 'Microtask: Promise.then, queueMicrotask, MutationObserver. Macrotask: setTimeout, setInterval, I/O, setImmediate. Farq: 1) Microtask har bir macrotask-dan KEYIN, keyingi macrotask-dan OLDIN TO\'LIQ bajariladi. 2) Microtask prioriteti yuqori. 3) Microtask ichida yangi microtask — shu siklda bajariladi (starvation xavfi). 4) Macrotask — har siklda faqat BITTA. Promise.then() har doim setTimeout(fn,0) dan oldin ishlaydi.'
    },
    {
      question: 'queueMicrotask() nima uchun kerak? Promise.resolve().then() dan farqi?',
      answer: 'queueMicrotask() — microtask queue-ga to\'g\'ridan-to\'g\'ri vazifa qo\'shadi. Promise.resolve().then(fn) ham microtask, lekin: 1) Semantik jihatdan noto\'g\'ri — Promise yaratish "asinxron natija" uchun, microtask queue uchun emas. 2) queueMicrotask tozaroq va niyatni aniq ko\'rsatadi. 3) Performance farqi ahamiyatsiz. Ishlatilish: batch updates, deferred work, cleanup. ES2019.'
    },
    {
      question: 'Microtask starvation nima va qanday oldini olish mumkin?',
      answer: 'Starvation — microtask ichida yangi microtask qo\'shilganda, macrotask va render HECH QACHON navbat olmaydi. Brauzer "hang" bo\'ladi, UI javob bermaydi. Oldini olish: 1) Microtask ichida recursive microtask qo\'shmang. 2) Og\'ir ish uchun setTimeout (macrotask) ishlatib, har batch-da UI yangilanishiga imkon bering. 3) Web Worker — alohida thread. 4) requestIdleCallback — brauzer bo\'sh bo\'lganda. 5) Scheduler API (kelajak).'
    },
    {
      question: 'setTimeout(fn, 0) va queueMicrotask(fn) farqi nima?',
      answer: 'setTimeout(fn, 0): macrotask queue-ga qo\'shadi, microtask-lardan KEYIN, minimum 4ms delay (nested timeout-larda). queueMicrotask(fn): microtask queue-ga qo\'shadi, sinxron kod tugagandan DARHOL (macrotask-dan oldin). Amaliy: agar sinxron kod tugagandan darhol kerak — queueMicrotask. Agar UI yangilanishi kerak bo\'lsa oldin — setTimeout. Agar render kerak — requestAnimationFrame.'
    }
  ],

  relatedTopics: [
    { techId: 'javascript', sectionId: 'async-javascript', topicId: 'event-loop', label: 'Event Loop' },
    { techId: 'javascript', sectionId: 'async-javascript', topicId: 'promises', label: 'Promises' },
    { techId: 'javascript', sectionId: 'async-javascript', topicId: 'callbacks', label: 'Callbacks' }
  ]
}
