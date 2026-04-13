import type { Topic } from '../../../types'

export const promisesTopic: Topic = {
  id: 'promises',
  title: 'Promises',
  importance: 3,
  status: 'to-learn',
  description: 'new Promise, then/catch/finally, chaining, error handling va Promise lifecycle',

  content: `
# Promises — Asinxron dasturlashning asosi

## Promise nima?
Promise — kelajakda mavjud bo'ladigan qiymatning **vakili** (placeholder). U asinxron operatsiya natijasini ifodalaydi. Promise uch holatdan birida bo'ladi:
- **pending** — kutilmoqda (boshlang'ich holat)
- **fulfilled** — muvaffaqiyatli bajarildi (resolve)
- **rejected** — xato bilan tugadi (reject)

## Promise yaratish
\`new Promise((resolve, reject) => { ... })\` — executor funksiya darhol bajariladi. resolve() yoki reject() chaqirilganda holat o'zgaradi. Holat o'zgargandan keyin **qaytib o'zgarmaydi** (settled).

## then / catch / finally
- \`.then(onFulfilled, onRejected)\` — muvaffaqiyat yoki xato callback
- \`.catch(onRejected)\` — faqat xato uchun (.then(null, fn) ning qisqartmasi)
- \`.finally(onFinally)\` — har qanday natijada (loading state uchun ideal)

## Promise Chaining
Har bir \`.then()\` **yangi Promise** qaytaradi. Bu zanjirlab yozish imkonini beradi. Return qilingan qiymat keyingi \`.then()\` ga uzatiladi. Agar Promise qaytarilsa — u kutiladi.

## Error Handling
Zanjirdagi **istalgan** joyda xato bo'lsa, eng yaqin \`.catch()\` uni ushlaydi. catch() dan keyin zanjir davom etishi mumkin (recovery pattern).

## Promise va Microtask
Promise callback-lari (.then, .catch, .finally) **microtask queue**-ga tushadi. setTimeout dan oldin bajariladi.

## Unhandled Rejection
Agar Promise reject bo'lib, hech qanday .catch() bo'lmasa — \`unhandledrejection\` event yuz beradi. Brauzer va Node.js buni ogohlantirish sifatida ko'rsatadi.

## Promise vs Callback
1. Chaining — tekis zanjir (callback hell yo'q)
2. Error propagation — xato avtomatik keyingi catch-ga o'tadi
3. Bir marta resolve/reject — callback ko'p marta chaqirilishi mumkin
4. Composition — Promise.all, race, allSettled
5. Har doim asinxron — microtask queue orqali

## Amaliy maslahatlar
- Har doim .catch() qo'ying
- finally() da cleanup qiling (loading = false)
- return qilishni unutmang (aks holda undefined qaytadi)
- new Promise ichida try/catch kerak emas — throw avtomatik reject qiladi
  `.trim(),

  codeExamples: [
    {
      title: 'Promise yaratish va ishlatish',
      language: 'js',
      description: 'new Promise, resolve, reject, then, catch, finally',
      code: `// Promise yaratish
function fetchUser(id) {
  return new Promise((resolve, reject) => {
    // Asinxron operatsiya simulatsiyasi
    setTimeout(() => {
      if (id <= 0) {
        reject(new Error('ID musbat bo\\'lishi kerak'));
        return;
      }

      resolve({
        id,
        name: 'Ali',
        email: 'ali@mail.com'
      });
    }, 1000);
  });
}

// Ishlatish
fetchUser(1)
  .then(user => {
    console.log('Foydalanuvchi:', user.name);
  })
  .catch(error => {
    console.error('Xato:', error.message);
  })
  .finally(() => {
    console.log('So\\'rov tugadi'); // har doim ishlaydi
  });

// Promise holatlari
const p1 = Promise.resolve(42);     // darhol fulfilled
const p2 = Promise.reject('Xato');  // darhol rejected
const p3 = new Promise(() => {});   // forever pending

// then — ikkinchi argument bilan
fetchUser(1).then(
  user => console.log(user),  // onFulfilled
  err => console.error(err)   // onRejected
);`
    },
    {
      title: 'Promise Chaining',
      language: 'js',
      description: 'Zanjirli then — har biri yangi Promise qaytaradi',
      code: `function getUser(id) {
  return new Promise(resolve => {
    setTimeout(() => resolve({ id, name: 'Ali' }), 500);
  });
}

function getOrders(userId) {
  return new Promise(resolve => {
    setTimeout(() => resolve([
      { id: 1, userId, total: 50000 },
      { id: 2, userId, total: 80000 }
    ]), 500);
  });
}

function getOrderDetails(orderId) {
  return new Promise(resolve => {
    setTimeout(() => resolve({
      id: orderId,
      items: ['Kitob', 'Ruchka'],
      status: 'yetkazildi'
    }), 500);
  });
}

// Chaining — tekis va o'qilishi oson
getUser(1)
  .then(user => {
    console.log('User:', user.name);
    return getOrders(user.id);   // Promise qaytarish
  })
  .then(orders => {
    console.log('Buyurtmalar soni:', orders.length);
    return getOrderDetails(orders[0].id);
  })
  .then(details => {
    console.log('Tafsilotlar:', details);
  })
  .catch(error => {
    // Istalgan qadamdagi xatoni ushlaydi
    console.error('Xato:', error.message);
  });

// Oddiy qiymat qaytarish ham ishlaydi
Promise.resolve(5)
  .then(x => x * 2)        // 10
  .then(x => x + 3)        // 13
  .then(x => console.log(x)); // 13`
    },
    {
      title: 'Error Handling va Recovery',
      language: 'js',
      description: 'Xatolarni ushlash, qayta urinish va recovery pattern',
      code: `// Error propagation — xato eng yaqin catch-ga tushadi
Promise.resolve('boshlanish')
  .then(val => {
    throw new Error('Birinchi qadamda xato!');
  })
  .then(val => {
    console.log('Bu ishlamaydi'); // o'tkazib yuboriladi
  })
  .catch(err => {
    console.log('Xato ushlandi:', err.message);
    return 'Qayta tiklandi'; // recovery — zanjir davom etadi
  })
  .then(val => {
    console.log(val); // "Qayta tiklandi"
  });

// Retry pattern
function fetchWithRetry(url, retries = 3) {
  return fetch(url).catch(err => {
    if (retries <= 0) throw err;
    console.log(\`Qayta urinish... (\${retries} qoldi)\`);
    return new Promise(resolve =>
      setTimeout(resolve, 1000) // 1 sek kutish
    ).then(() => fetchWithRetry(url, retries - 1));
  });
}

// Xatoni qayta tashlash
fetch('/api/data')
  .then(res => {
    if (!res.ok) {
      throw new Error(\`HTTP \${res.status}\`);
    }
    return res.json();
  })
  .catch(err => {
    // Logging
    console.error('API xato:', err);
    // Xatoni qayta tashlash — yuqoriga uzatish
    throw err;
  });

// Unhandled rejection
window.addEventListener('unhandledrejection', event => {
  console.warn('Ushlanmagan reject:', event.reason);
  event.preventDefault(); // brauzer warningni yashirish
});`
    },
    {
      title: 'Promise utility va pattern-lar',
      language: 'js',
      description: 'Promisify, delay, timeout va boshqa foydali pattern-lar',
      code: `// Delay utility
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

await delay(2000); // 2 sek kutish
console.log('2 sekunddan keyin');

// Timeout wrapper
function withTimeout(promise, ms) {
  const timeout = new Promise((_, reject) => {
    setTimeout(() => reject(new Error(\`Timeout: \${ms}ms\`)), ms);
  });
  return Promise.race([promise, timeout]);
}

// 3 sekundda tugamaasa xato
try {
  const result = await withTimeout(fetch('/api/slow'), 3000);
} catch (e) {
  console.log(e.message); // "Timeout: 3000ms"
}

// Promisify (callback → promise)
function promisify(fn) {
  return function(...args) {
    return new Promise((resolve, reject) => {
      fn(...args, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  };
}

// Sequential execution
async function sequential(tasks) {
  const results = [];
  for (const task of tasks) {
    results.push(await task());
  }
  return results;
}

// Concurrent with limit
async function parallel(tasks, limit = 5) {
  const results = [];
  const executing = new Set();

  for (const task of tasks) {
    const p = task().then(r => {
      executing.delete(p);
      return r;
    });
    executing.add(p);
    results.push(p);

    if (executing.size >= limit) {
      await Promise.race(executing);
    }
  }

  return Promise.all(results);
}`
    }
  ],

  interviewQA: [
    {
      question: 'Promise qanday ishlaydi? Uning uchta holatini tushuntiring.',
      answer: 'Promise — asinxron natija vakili. 3 holat: 1) pending — boshlang\'ich, natija yo\'q. 2) fulfilled — resolve() chaqirildi, natija bor. 3) rejected — reject() chaqirildi, xato bor. Muhim: holat pending dan faqat fulfilled YOKI rejected ga o\'tadi, qaytib o\'zgarmaydi (settled). resolve/reject faqat birinchi chaqiruv hisobga olinadi. .then() yangi Promise qaytaradi — shuning uchun chaining ishlaydi.'
    },
    {
      question: 'then() va catch() farqi nima? Qachon qaysi birini ishlatish kerak?',
      answer: '.catch(fn) — bu .then(null, fn) ning qisqartmasi. Muhim farq: .then(success, error) da success ichidagi xato ERROR ga tushmaydi (bir xil then). .then(success).catch(error) da success ichidagi xato CATCH ga tushadi (keyingi zanjir). Best practice: .then() dan keyin .catch() alohida yozing. finally() — har qanday natijada (loading = false kabi cleanup uchun).'
    },
    {
      question: 'Promise chaining qanday ishlaydi?',
      answer: 'Har bir .then() YANGI Promise qaytaradi. then callback-da: 1) Oddiy qiymat qaytarsa — keyingi then shu qiymatni oladi. 2) Promise qaytarsa — u kutiladi, natijasi keyingiga uzatiladi. 3) throw qilsa — eng yaqin catch ushlaydi. 4) Hech narsa qaytarmasa — undefined. Shuning uchun return MUHIM — unuting zanjir uziladi. catch() dan keyin ham zanjir davom etishi mumkin (recovery).'
    },
    {
      question: 'Promise va callback farqi nima? Promise nima yechadi?',
      answer: 'Promise yechimlar: 1) Callback hell — zanjirli .then() tekis. 2) Inversion of control — resolve/reject faqat bir marta, har doim asinxron. 3) Error propagation — xato avtomatik catch ga o\'tadi (callback-da har safar if(err) kerak). 4) Composition — Promise.all/race/allSettled. 5) async/await bilan sinxron ko\'rinishda yozish. Kamchiliklari: cancel qilib bo\'lmaydi (AbortController kerak), bir marta resolve (stream uchun Observable kerak).'
    },
    {
      question: 'Promise ichida throw va reject farqi bormi?',
      answer: 'new Promise executor ichida: throw new Error() va reject(new Error()) bir xil natija beradi — Promise rejected bo\'ladi. Lekin farq bor: 1) Asinxron callback ichida (setTimeout) throw ISHLAMAYDI — u catch ga tushmaydi, global error bo\'ladi. Faqat reject() ishlatish kerak. 2) .then() callback ichida throw ISHLAYDI — keyingi catch ushlaydi. Best practice: executor-da reject(), .then() ichida throw.'
    }
  ],

  relatedTopics: [
    { techId: 'javascript', sectionId: 'async-javascript', topicId: 'async-await', label: 'Async/Await' },
    { techId: 'javascript', sectionId: 'async-javascript', topicId: 'promise-methods', label: 'Promise metodlari' },
    { techId: 'javascript', sectionId: 'async-javascript', topicId: 'callbacks', label: 'Callbacks' },
    { techId: 'javascript', sectionId: 'async-javascript', topicId: 'event-loop', label: 'Event Loop' }
  ]
}
