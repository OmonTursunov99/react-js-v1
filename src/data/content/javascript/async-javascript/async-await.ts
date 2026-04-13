import type { Topic } from '../../../types'

export const asyncAwaitTopic: Topic = {
  id: 'async-await',
  title: 'Async/Await',
  importance: 3,
  status: 'to-learn',
  description: 'async funksiyalar, await, error handling, parallel execution va best practices',

  content: `
# Async/Await — Zamonaviy asinxron dasturlash

## Async/Await nima?
\`async/await\` — Promise ustidagi **syntactic sugar**. Asinxron kodni sinxron ko'rinishda yozish imkonini beradi. ES2017 (ES8) da qo'shilgan.

## async funksiya
\`async function\` har doim **Promise** qaytaradi. Agar oddiy qiymat qaytarilsa, u avtomatik \`Promise.resolve(value)\` ga o'raladi. Agar throw qilsa — \`Promise.reject(error)\`.

## await kalit so'zi
\`await\` — Promise **tugashini kutadi** va natijasini qaytaradi. Faqat \`async\` funksiya ichida ishlatiladi (yoki top-level await — ES2022 modules). await ketayotganda JS boshqa ishlarni bajaradi (non-blocking).

## Error Handling
\`try/catch\` — async/await bilan xatolarni ushlash. Xuddi sinxron koddek ishlaydi. catch blokida reject qilingan Promise-ning error-ini olasiz.

## Parallel Execution
\`await\` ketma-ket bo'lsa, operatsiyalar **birma-bir** bajariladi. Parallel bajarish uchun \`Promise.all()\` ishlatish kerak. Bu juda muhim optimizatsiya!

## Top-level await
ES2022 dan boshlab modul (type="module") ichida await to'g'ridan-to'g'ri ishlatish mumkin — async funksiya shart emas.

## async/await vs .then()
Ikkalasi ham Promise bilan ishlaydi. async/await afzalliklari:
- O'qish oson (sinxron ko'rinish)
- Debug oson (breakpoint qo'yish mumkin)
- try/catch bilan xato ushlash
- Loop ichida await (for...of + await)

.then() afzalliklari:
- Qisqa operatsiyalar uchun ixcham
- Functional composition

## Async Iteration
\`for await...of\` — async iterable'larni iteratsiya qilish. Stream, paginated API uchun ideal.

## Common Mistakes
1. await ni unutish — Promise ob'ekti qaytadi, natija emas
2. Loop ichida await — sequential bo'lib qoladi
3. try/catch ni unutish — unhandled rejection
4. async funksiyada return await — keraksiz (lekin try/catch ichida kerak)
  `.trim(),

  codeExamples: [
    {
      title: 'Async/Await asoslari',
      language: 'js',
      description: 'async funksiya, await va error handling',
      code: `// async funksiya har doim Promise qaytaradi
async function greet(name) {
  return \`Salom, \${name}!\`; // Promise.resolve() ga o'raladi
}
greet('Ali').then(msg => console.log(msg)); // "Salom, Ali!"

// await — Promise natijasini kutadi
async function fetchUserData(userId) {
  try {
    const response = await fetch(\`/api/users/\${userId}\`);

    if (!response.ok) {
      throw new Error(\`HTTP xato: \${response.status}\`);
    }

    const user = await response.json();
    console.log('Foydalanuvchi:', user.name);
    return user;

  } catch (error) {
    console.error('Xato:', error.message);
    throw error; // qayta tashlash (yuqoriga uzatish)
  } finally {
    console.log('So\\'rov tugadi');
  }
}

// async funksiyani chaqirish
async function main() {
  const user = await fetchUserData(1);
  console.log(user);
}
main();

// yoki .then() bilan
fetchUserData(1)
  .then(user => console.log(user))
  .catch(err => console.error(err));`
    },
    {
      title: 'Sequential vs Parallel execution',
      language: 'js',
      description: 'Ketma-ket va parallel asinxron operatsiyalar — muhim optimizatsiya',
      code: `function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchUser(id) {
  await delay(1000);
  return { id, name: \`User_\${id}\` };
}

async function fetchOrders(userId) {
  await delay(1000);
  return [{ id: 1, userId }];
}

async function fetchProducts() {
  await delay(1000);
  return [{ id: 1, name: 'Telefon' }];
}

// YOMON — Sequential (3 sekund)
async function loadSequential() {
  console.time('sequential');
  const user = await fetchUser(1);      // 1 sek
  const orders = await fetchOrders(1);  // 1 sek
  const products = await fetchProducts(); // 1 sek
  console.timeEnd('sequential'); // ~3000ms
  return { user, orders, products };
}

// YAXSHI — Parallel (1 sekund!)
async function loadParallel() {
  console.time('parallel');
  const [user, orders, products] = await Promise.all([
    fetchUser(1),
    fetchOrders(1),
    fetchProducts(),
  ]);
  console.timeEnd('parallel'); // ~1000ms
  return { user, orders, products };
}

// Qisman parallel — bog'liq va mustaqil
async function loadSmart() {
  // user kerak orders uchun, lekin products mustaqil
  const [user, products] = await Promise.all([
    fetchUser(1),
    fetchProducts(), // parallel
  ]);
  const orders = await fetchOrders(user.id); // user kerak
  return { user, orders, products };
  // Jami: ~2000ms (3000ms emas)
}`
    },
    {
      title: 'Loop ichida await',
      language: 'js',
      description: 'for...of va Promise.all — loop-da to\'g\'ri asinxron ishlash',
      code: `const userIds = [1, 2, 3, 4, 5];

async function fetchUser(id) {
  const response = await fetch(\`/api/users/\${id}\`);
  return response.json();
}

// YOMON — Sequential (har biri kutadi)
async function loadSequential() {
  const users = [];
  for (const id of userIds) {
    const user = await fetchUser(id); // birma-bir
    users.push(user);
  }
  return users; // 5 x 1sek = 5 sek
}

// YAXSHI — Parallel
async function loadParallel() {
  const users = await Promise.all(
    userIds.map(id => fetchUser(id))
  );
  return users; // 1 sek (barchasi parallel)
}

// EHTIYOT — forEach bilan await ISHLAMAYDI
userIds.forEach(async (id) => {
  const user = await fetchUser(id);
  console.log(user); // Tartib kafolatlanmagan!
});
// forEach async callback-ni KUTMAYDI

// TO'G'RI — for...of sequential kerak bo'lganda
async function processSequential() {
  for (const id of userIds) {
    const user = await fetchUser(id);
    await saveToDb(user); // tartib muhim!
  }
}

// Parallel with limit (5 tadan ortiq bir vaqtda emas)
async function parallelLimit(items, fn, limit = 5) {
  const results = [];
  for (let i = 0; i < items.length; i += limit) {
    const batch = items.slice(i, i + limit);
    const batchResults = await Promise.all(batch.map(fn));
    results.push(...batchResults);
  }
  return results;
}`
    },
    {
      title: 'Error handling pattern-lar',
      language: 'js',
      description: 'try/catch, wrapper funksiya va global handling',
      code: `// Pattern 1: try/catch — standart
async function loadData() {
  try {
    const data = await fetchAPI('/data');
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Pattern 2: Go-style error handling
async function to(promise) {
  try {
    const result = await promise;
    return [null, result];
  } catch (error) {
    return [error, null];
  }
}

// Ishlatish
const [err, user] = await to(fetchUser(1));
if (err) {
  console.error('Xato:', err.message);
} else {
  console.log('User:', user);
}

// Pattern 3: Wrapper HOF
function withErrorHandler(fn) {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      console.error(\`\${fn.name} xato:\`, error);
      // Sentry, LogRocket ga yuborish
      throw error;
    }
  };
}

const safeLoadData = withErrorHandler(loadData);
await safeLoadData();

// Pattern 4: .catch() bilan
async function main() {
  const result = await fetchData().catch(err => {
    console.error(err);
    return defaultValue; // fallback
  });
}

// XATO — async funksiyada return await
async function bad() {
  return await fetchData(); // keraksiz await
}
// TO'G'RI
async function good() {
  return fetchData(); // Promise to'g'ridan-to'g'ri qaytadi
}
// ISTISNO — try/catch ichida return await KERAK
async function correct() {
  try {
    return await fetchData(); // catch ishlashi uchun await kerak!
  } catch (e) {
    // await bo'lmasa, bu catch ishlamaydi
  }
}`
    }
  ],

  interviewQA: [
    {
      question: 'async/await qanday ishlaydi? Bu Promise-ga qanday bog\'liq?',
      answer: 'async/await — Promise ustidagi syntactic sugar. async funksiya har doim Promise qaytaradi. await Promise tugashini kutadi va natijani qaytaradi. await qo\'yilganda JS execution-ni to\'xtatadi (shu funksiyada), boshqa kodni bajaradi (non-blocking). Ichki mexanizm: generator + Promise yoki coroutine. Kompilyatsiya qilinganda .then() zanjiriga aylanadi.'
    },
    {
      question: 'Sequential va parallel execution farqi nima? Qanday optimallashtirish mumkin?',
      answer: 'Sequential: await ketma-ket → har biri oldingi tugashini kutadi (N * T vaqt). Parallel: Promise.all([...]) → barchasi bir vaqtda boshlanadi (max(T) vaqt). Optimallashtirish: 1) Mustaqil so\'rovlarni Promise.all() ga o\'rang. 2) Bog\'liq so\'rovlarni sequential qoldiring. 3) Aralash holda: mustaqillarni parallel, natijaga bog\'liqlarni sequential. 4) Ko\'p so\'rovda parallel limit qo\'ying (batch processing).'
    },
    {
      question: 'forEach ichida await nima uchun ishlamaydi?',
      answer: 'forEach callback-ni chaqiradi lekin qaytgan Promise-ni KUTMAYDI (return qiymatini ignore qiladi). Natija: barcha iteratsiyalar darhol boshlanadi, tartib kafolatlanmagan, forEach tugagandan keyin hech biri tugamagan bo\'lishi mumkin. Yechimlar: 1) for...of + await — sequential. 2) Promise.all(arr.map(async item => ...)) — parallel. 3) for await...of — async iterable uchun. forEach — sinxron array metodi, asinxron uchun mos emas.'
    },
    {
      question: 'try/catch bilan async/await error handling qanday ishlaydi?',
      answer: 'try ichidagi await reject bo\'lsa — catch blokiga tushadi, xuddi sinxron throw kabi. Muhim: 1) try/catch faqat await qilingan Promise-ni ushlaydi — await-siz Promise catch-ga tushmaydi. 2) return await vs return — try/catch ichida return await KERAK (aks holda catch ishlamaydi). 3) Har bir async funksiyada try/catch yozish shart emas — xato yuqoriga propagate bo\'ladi. 4) Global handler: window.onunhandledrejection.'
    },
    {
      question: 'Top-level await nima va qanday ishlaydi?',
      answer: 'ES2022 — modul (type="module") ichida await to\'g\'ridan-to\'g\'ri ishlatish mumkin, async funksiyaga o\'ramasdan. Ishlash: modul baholanishi await tugagunicha to\'xtaydi, import qilgan modullar kutadi. Foydalanish: config yuklash, DB ulanish, dynamic import. Ehtiyot: top-level await moddul yuklanishini sekinlashtiradi, faqat kerak joyda ishlating. CommonJS-da ishlamaydi, faqat ESM.'
    }
  ],

  relatedTopics: [
    { techId: 'javascript', sectionId: 'async-javascript', topicId: 'promises', label: 'Promises' },
    { techId: 'javascript', sectionId: 'async-javascript', topicId: 'promise-methods', label: 'Promise metodlari' },
    { techId: 'javascript', sectionId: 'async-javascript', topicId: 'event-loop', label: 'Event Loop' }
  ]
}
