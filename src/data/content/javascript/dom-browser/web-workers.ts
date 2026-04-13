import type { Topic } from '../../../types'

export const webWorkers: Topic = {
  id: 'web-workers',
  title: 'Web Workers',
  importance: 2,
  status: 'to-learn',
  description: 'Web Workers, SharedWorker, MessageChannel',
  content: `
# Web Workers

## Muammo: Single-threaded JavaScript

JavaScript **bitta thread** da ishlaydi. Agar og'ir hisoblash (masalan, katta array sort, rasm qayta ishlash) bo'lsa, UI **qotib qoladi** — foydalanuvchi hech narsa qila olmaydi.

## Web Worker nima?

Web Worker — bu **alohida thread** da ishlaydigan JavaScript. U main thread ni bloklamaydi, shuning uchun UI silliq ishlashda davom etadi.

## Worker turlari

### 1. Dedicated Worker
- Faqat **bitta sahifa** foydalanadi
- Eng ko'p ishlatiladigan tur
- \`new Worker('worker.js')\`

### 2. Shared Worker
- Bir nechta tab/sahifa **birgalikda** foydalanadi
- \`new SharedWorker('shared.js')\`
- \`port\` orqali muloqot
- Debugging qiyin, brauzer qo'llab-quvvatlashi cheklangan

### 3. Service Worker
- **Proxy** sifatida ishlaydi (network so'rovlarni ushlaydi)
- Offline funksionallik, push notification
- Bu alohida katta mavzu

## Worker cheklovlari

Worker ichida **foydalanib bo'lmaydi:**
- \`document\`, \`window\`, \`DOM\`
- \`alert()\`, \`confirm()\`
- \`localStorage\`, \`sessionStorage\`

Worker ichida **foydalanish mumkin:**
- \`fetch()\`, \`XMLHttpRequest\`
- \`IndexedDB\`
- \`setTimeout\`, \`setInterval\`
- \`WebSocket\`
- \`importScripts()\` (klassik worker da)
- \`self\` (worker ning global obyekti)

## Muloqot (Messaging)

Worker va main thread o'rtasida muloqot \`postMessage()\` va \`onmessage\` orqali bo'ladi. Ma'lumotlar **structured clone algorithm** bilan ko'chiriladi (deep copy).

## Transferable Objects

Katta ma'lumotlarni ko'chirish o'rniga **egalikni o'tkazish** mumkin: \`ArrayBuffer\`, \`MessagePort\`, \`ImageBitmap\`. Transfer qilingan obyekt asl tomondan **foydalanib bo'lmaydi**.

## MessageChannel

\`MessageChannel\` — ikki \`MessagePort\` dan iborat. Bu Worker lar o'rtasida yoki Worker va main thread o'rtasida **to'g'ridan-to'g'ri** muloqot kanal yaratadi.

## Qachon Worker ishlatish kerak?

- Katta ma'lumot set ni sort/filter qilish
- Rasmlarni qayta ishlash (Canvas)
- Kriptografik hisob-kitoblar
- CSV/JSON parsing katta fayl uchun
- Web Assembly bilan ishlash
  `.trim(),
  codeExamples: [
    {
      title: 'Dedicated Worker — asosiy muloqot',
      language: 'js',
      description: 'Main thread va Worker o\'rtasida xabar almashish',
      code: `// === main.js (asosiy thread) ===
const worker = new Worker('worker.js');

// Worker dan xabar olish
worker.onmessage = (e) => {
  console.log('Worker dan javob:', e.data);
};

// Worker da xato bo'lsa
worker.onerror = (e) => {
  console.error('Worker xato:', e.message);
};

// Worker ga xabar yuborish
worker.postMessage({ type: 'SORT', data: [5, 3, 1, 4, 2] });

// Worker ni to'xtatish
// worker.terminate();

// === worker.js (alohida fayl) ===
self.onmessage = (e) => {
  const { type, data } = e.data;

  switch (type) {
    case 'SORT': {
      // Og'ir hisoblash — main thread blokmaydi
      const sorted = data.sort((a, b) => a - b);
      self.postMessage({ type: 'SORTED', result: sorted });
      break;
    }
    case 'FIBONACCI': {
      const result = fibonacci(data);
      self.postMessage({ type: 'FIBONACCI_RESULT', result });
      break;
    }
  }
};

function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}`,
    },
    {
      title: 'Inline Worker va Transferable Objects',
      language: 'js',
      description: 'Worker ni alohida fayl yaratmasdan ishlatish',
      code: `// Inline Worker — Blob URL orqali
function createWorker(fn) {
  const blob = new Blob(
    [\`self.onmessage = \${fn.toString()}\`],
    { type: 'application/javascript' }
  );
  return new Worker(URL.createObjectURL(blob));
}

const sortWorker = createWorker((e) => {
  const sorted = e.data.sort((a, b) => a - b);
  self.postMessage(sorted);
});

sortWorker.onmessage = (e) => console.log('Tartiblangan:', e.data);
sortWorker.postMessage([5, 3, 1, 4, 2]);

// === Transferable Objects ===
// Katta ArrayBuffer ni TRANSFER qilish (ko'chirish emas)
const buffer = new ArrayBuffer(1024 * 1024); // 1 MB
console.log(buffer.byteLength); // 1048576

// Transfer — egalik worker ga o'tadi
worker.postMessage(buffer, [buffer]); // ikkinchi arg = transfer list
console.log(buffer.byteLength); // 0! — endi foydalanib bo'lmaydi

// Worker ichida
self.onmessage = (e) => {
  const buffer = e.data;
  const view = new Uint8Array(buffer);

  // buffer ustida ishlash...

  // Natijani qaytarish (transfer bilan)
  self.postMessage(buffer, [buffer]);
};

// Promise-based Worker wrapper
function workerPromise(worker, data) {
  return new Promise((resolve, reject) => {
    worker.onmessage = (e) => resolve(e.data);
    worker.onerror = (e) => reject(e);
    worker.postMessage(data);
  });
}

const result = await workerPromise(sortWorker, [3, 1, 2]);`,
    },
    {
      title: 'MessageChannel va SharedWorker',
      language: 'js',
      description: 'Ikki Worker o\'rtasida to\'g\'ridan-to\'g\'ri muloqot',
      code: `// === MessageChannel ===
const channel = new MessageChannel();

// Har bir port bir tomonga
channel.port1.onmessage = (e) => {
  console.log('Port1 oldi:', e.data);
};

channel.port2.onmessage = (e) => {
  console.log('Port2 oldi:', e.data);
};

channel.port1.postMessage('Salom port2 ga');
channel.port2.postMessage('Salom port1 ga');

// Ikki Worker o'rtasida muloqot
const worker1 = new Worker('worker1.js');
const worker2 = new Worker('worker2.js');
const channel2 = new MessageChannel();

// Har bir workerga bitta port berish
worker1.postMessage({ port: channel2.port1 }, [channel2.port1]);
worker2.postMessage({ port: channel2.port2 }, [channel2.port2]);

// worker1.js ichida:
// self.onmessage = (e) => {
//   const port = e.data.port;
//   port.postMessage('Worker1 dan salom');
//   port.onmessage = (e) => console.log(e.data);
// };

// === SharedWorker ===
// shared-worker.js
// const connections = [];
// self.onconnect = (e) => {
//   const port = e.ports[0];
//   connections.push(port);
//   port.onmessage = (e) => {
//     // Barcha ulangan tablarga xabar yuborish
//     connections.forEach(p => p.postMessage(e.data));
//   };
// };

// main.js (har bir tabda)
const shared = new SharedWorker('shared-worker.js');
shared.port.start();
shared.port.onmessage = (e) => {
  console.log('Shared worker dan:', e.data);
};
shared.port.postMessage('Tab dan salom');`,
    },
  ],
  interviewQA: [
    {
      question: 'Web Worker nima va nega kerak?',
      answer: 'Web Worker — brauzerda **alohida thread** da JavaScript ishlatish imkoniyati. JS single-threaded bo\'lgani uchun, og\'ir hisoblashlar (sort, parsing, kriptografiya) UI ni bloklaydi. Worker da bu ishlarni bajarib, main thread silliq ishlashini ta\'minlash mumkin. Worker da DOM ga kirish imkoni yo\'q — faqat `postMessage` orqali muloqot.',
    },
    {
      question: 'Worker ichida nimalardan foydalanish mumkin va mumkin emas?',
      answer: 'Mumkin emas: `document`, `window`, DOM elementlar, `localStorage`, `alert/confirm`. Mumkin: `fetch()`, `IndexedDB`, `setTimeout/setInterval`, `WebSocket`, `importScripts()`, `self` (global), `navigator`, `location` (read-only). Worker o\'z global scope-iga ega — `self` yoki `globalThis`.',
    },
    {
      question: 'postMessage() ma\'lumotni qanday uzatadi?',
      answer: 'Default — **structured clone algorithm** bilan deep copy yaratadi. Bu sekin bo\'lishi mumkin katta ma\'lumotlarda. Muqobil — **Transferable Objects** (`ArrayBuffer`, `MessagePort`): egalik o\'tkaziladi (transfer), ko\'chirish emas. Transfer juda tez, lekin asl tomonda obyektdan foydalanib bo\'lmaydi.',
    },
    {
      question: 'Dedicated Worker va SharedWorker farqi nimada?',
      answer: 'Dedicated Worker faqat **bitta sahifa/tab** uchun ishlaydi. SharedWorker **bir nechta tab** o\'rtasida birgalikda ishlaydi — `port` orqali muloqot qiladi. SharedWorker cross-tab muloqot va umumiy resurs boshqarish uchun qulay, lekin debugging qiyin va barcha brauzerlarda qo\'llab-quvvatlanmaydi (Firefox da cheklangan).',
    },
  ],
  relatedTopics: [
    {
      techId: 'javascript',
      sectionId: 'dom-browser',
      topicId: 'fetch-api',
      label: 'Fetch API',
    },
    {
      techId: 'javascript',
      sectionId: 'dom-browser',
      topicId: 'observers',
      label: 'Observers',
    },
  ],
}
