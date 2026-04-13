import type { Topic } from '../../../types'

export const promiseMethodsTopic: Topic = {
  id: 'promise-methods',
  title: 'Promise Methods',
  importance: 3,
  status: 'to-learn',
  description: 'Promise.all, allSettled, race, any — amaliy misollar bilan',

  content: `
# Promise Methods — Ko'p Promise-larni boshqarish

## Nima uchun kerak?
Ko'p asinxron operatsiyalarni birgalikda boshqarish uchun 4 ta statik metod mavjud. Har birining o'z ishlatilish holati bor.

## Promise.all()
Barcha Promise-lar **muvaffaqiyatli** tugashini kutadi. Birontasi reject bo'lsa — **butun natija reject**. Natija: barcha natijalar massivi (tartib saqlanadi).
- Ishlatilish: barcha ma'lumotlar kerak bo'lganda (dashboard data)
- Xavfi: bitta xato hamma narsani buzadi

## Promise.allSettled()
Barcha Promise-lar **tugashini** kutadi (muvaffaqiyatli yoki xato). Hech qachon reject bo'lmaydi. Natija: \`{status, value/reason}\` ob'ektlar massivi.
- Ishlatilish: barcha natijalar kerak, xatolarga toqat (batch operations)
- ES2020 da qo'shilgan

## Promise.race()
**Birinchi** tugagan Promise natijasini qaytaradi (muvaffaqiyat yoki xato). Qolganlari e'tiborga olinmaydi (lekin bajarilishda davom etadi).
- Ishlatilish: timeout, eng tez javob

## Promise.any()
**Birinchi muvaffaqiyatli** Promise natijasini qaytaradi. Xato bo'lganlarni e'tiborga olmaydi. Agar BARCHASI reject bo'lsa — AggregateError.
- Ishlatilish: eng tez muvaffaqiyatli javob (CDN, mirror)
- ES2021 da qo'shilgan

## Farqlari jadvali
| Metod | Kutadi | Reject bo'lish sharti |
|---|---|---|
| all | Barchasini | Birontasi reject bo'lsa |
| allSettled | Barchasini | Hech qachon reject bo'lmaydi |
| race | Birinchisini | Birinchisi reject bo'lsa |
| any | Birinchi muvaffaqiyatni | BARCHASI reject bo'lsa |

## Amaliy maslahatlar
- \`Promise.all\` — bog'liq bo'lmagan parallel so'rovlar uchun eng ko'p ishlatiladi
- \`Promise.allSettled\` — partial failure OK bo'lganda (email batch)
- \`Promise.race\` — timeout implement qilish
- \`Promise.any\` — fallback server tanlash
- Tartib: all/allSettled natija tartibini input tartibiga mos qaytaradi (qaysi biri oldin tugashidan qat'iy nazar)
  `.trim(),

  codeExamples: [
    {
      title: 'Promise.all — barcha so\'rovlar parallel',
      language: 'js',
      description: 'Barchasi tugashini kutish, bitta xato = butun xato',
      code: `// Dashboard uchun barcha ma'lumotlarni parallel yuklash
async function loadDashboard(userId) {
  try {
    const [user, orders, notifications, stats] = await Promise.all([
      fetch(\`/api/users/\${userId}\`).then(r => r.json()),
      fetch(\`/api/orders?userId=\${userId}\`).then(r => r.json()),
      fetch(\`/api/notifications?userId=\${userId}\`).then(r => r.json()),
      fetch(\`/api/stats?userId=\${userId}\`).then(r => r.json()),
    ]);

    // Tartib saqlanadi — input tartibiga mos
    console.log('User:', user.name);
    console.log('Orders:', orders.length);
    console.log('Notifications:', notifications.length);
    console.log('Stats:', stats);

    return { user, orders, notifications, stats };
  } catch (error) {
    // BIRONTASI xato bo'lsa — barchasi fail
    console.error('Dashboard yuklanmadi:', error.message);
    throw error;
  }
}

// Oddiy qiymatlar ham ishlaydi
const results = await Promise.all([
  Promise.resolve(1),
  42,                    // avtomatik Promise.resolve(42)
  Promise.resolve('ok'),
]);
console.log(results); // [1, 42, 'ok']

// Xato holati
try {
  await Promise.all([
    Promise.resolve('A'),
    Promise.reject(new Error('B xato!')),
    Promise.resolve('C'), // bu ham cancel (natijasi yo'qoladi)
  ]);
} catch (e) {
  console.log(e.message); // "B xato!"
}`
    },
    {
      title: 'Promise.allSettled — partial failure OK',
      language: 'js',
      description: 'Barchasi tugashini kutish, xatolar bilan birga',
      code: `// Bir nechta foydalanuvchiga email yuborish
async function sendEmails(users) {
  const results = await Promise.allSettled(
    users.map(user =>
      sendEmail(user.email, 'Yangilik', 'Salom!')
    )
  );

  // Har bir natija: { status: 'fulfilled', value } yoki { status: 'rejected', reason }
  const sent = results.filter(r => r.status === 'fulfilled');
  const failed = results.filter(r => r.status === 'rejected');

  console.log(\`Yuborildi: \${sent.length}, Xato: \${failed.length}\`);

  // Xatolarni log qilish
  failed.forEach(r => {
    console.error('Email xato:', r.reason.message);
  });

  return { sent: sent.length, failed: failed.length };
}

// Misol natijasi
const results = await Promise.allSettled([
  Promise.resolve('A'),
  Promise.reject(new Error('B xato')),
  Promise.resolve('C'),
]);

console.log(results);
// [
//   { status: 'fulfilled', value: 'A' },
//   { status: 'rejected', reason: Error('B xato') },
//   { status: 'fulfilled', value: 'C' }
// ]

// allSettled HECH QACHON reject bo'lmaydi
// try/catch kerak emas (lekin qo'yish yaxshi amaliyot)`
    },
    {
      title: 'Promise.race — birinchi natija',
      language: 'js',
      description: 'Eng tez javobni olish va timeout implementatsiyasi',
      code: `// Timeout pattern — eng ko'p ishlatiladigan race holati
function withTimeout(promise, ms) {
  const timeout = new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(\`So'rov \${ms}ms dan oshdi\`));
    }, ms);
  });

  return Promise.race([promise, timeout]);
}

// Ishlatish
try {
  const data = await withTimeout(
    fetch('/api/heavy-data').then(r => r.json()),
    5000 // 5 sekund timeout
  );
  console.log('Ma\\'lumot:', data);
} catch (e) {
  console.error(e.message); // "So'rov 5000ms dan oshdi"
}

// Eng tez server
async function fetchFastest(urls) {
  return Promise.race(
    urls.map(url => fetch(url).then(r => r.json()))
  );
}

const data = await fetchFastest([
  'https://server1.example.com/api',
  'https://server2.example.com/api',
  'https://server3.example.com/api',
]);
// Eng tez javob bergan server natijasi

// MUHIM: race da birinchi TUGAGAN (fulfilled YOKI rejected)
const result = await Promise.race([
  new Promise((_, reject) => setTimeout(() => reject('xato'), 100)),
  new Promise(resolve => setTimeout(() => resolve('ok'), 200)),
]);
// 100ms da reject bo'ladi — "xato" ushlanadi`
    },
    {
      title: 'Promise.any — birinchi muvaffaqiyat',
      language: 'js',
      description: 'Birinchi muvaffaqiyatli natija, xatolar ignore',
      code: `// CDN fallback — birinchi ishlaganini ishlatish
async function loadFromCDN(resource) {
  try {
    const result = await Promise.any([
      fetch(\`https://cdn1.example.com/\${resource}\`),
      fetch(\`https://cdn2.example.com/\${resource}\`),
      fetch(\`https://cdn3.example.com/\${resource}\`),
    ]);
    return result.json();
  } catch (error) {
    // AggregateError — BARCHASI reject bo'lganda
    console.error('Barcha CDN ishlamadi:', error.errors);
    throw error;
  }
}

// race vs any farqi
// race: birinchi TUGAGAN (xato bo'lsa ham)
// any: birinchi MUVAFFAQIYATLI (xatolarni o'tkazib yuboradi)

const result = await Promise.any([
  Promise.reject('xato 1'),    // o'tkazib yuboriladi
  Promise.reject('xato 2'),    // o'tkazib yuboriladi
  Promise.resolve('natija!'),  // BU qaytadi
]);
console.log(result); // "natija!"

// AggregateError — barchasi reject
try {
  await Promise.any([
    Promise.reject(new Error('A xato')),
    Promise.reject(new Error('B xato')),
    Promise.reject(new Error('C xato')),
  ]);
} catch (error) {
  console.log(error instanceof AggregateError); // true
  console.log(error.errors.length); // 3
  error.errors.forEach(e => console.log(e.message));
  // "A xato", "B xato", "C xato"
}

// Amaliy: API health check
async function findWorkingAPI(endpoints) {
  try {
    const response = await Promise.any(
      endpoints.map(url =>
        fetch(url).then(r => {
          if (!r.ok) throw new Error(\`\${r.status}\`);
          return { url, data: r.json() };
        })
      )
    );
    console.log(\`Ishlaydigan API: \${response.url}\`);
    return response;
  } catch {
    throw new Error('Hech bir API ishlamayapti');
  }
}`
    }
  ],

  interviewQA: [
    {
      question: 'Promise.all va Promise.allSettled farqi nima?',
      answer: 'Promise.all: barchasi fulfilled bo\'lishini kutadi, BIRONTASI reject bo\'lsa — butun natija reject (fail-fast). Promise.allSettled: barchasi settled (fulfilled yoki rejected) bo\'lishini kutadi, HECH QACHON reject bo\'lmaydi, har bir natija {status, value/reason}. all — barchasi kerak bo\'lganda (dashboard). allSettled — partial failure OK (batch email, multi-API). allSettled ES2020, all ES2015.'
    },
    {
      question: 'Promise.race va Promise.any farqi nima?',
      answer: 'Promise.race: birinchi TUGAGAN (fulfilled YOKI rejected) natijasini qaytaradi. Birinchisi xato bo\'lsa — xato. Promise.any: birinchi MUVAFFAQIYATLI natijani qaytaradi, xatolarni o\'tkazib yuboradi. Faqat BARCHASI reject bo\'lsa — AggregateError. race — timeout uchun ideal (race between fetch va timer). any — fallback uchun ideal (birinchi ishlaydigan CDN/server). any ES2021, race ES2015.'
    },
    {
      question: 'Promise.all() da natija tartibi qanday?',
      answer: 'Tartib INPUT tartibiga mos — qaysi Promise birinchi tugashidan qat\'iy nazar. Promise.all([p1, p2, p3]) → [result1, result2, result3]. Bu destructuring qilishga qulay: const [user, orders] = await Promise.all([getUser(), getOrders()]). allSettled ham xuddi shu tartibda qaytaradi. Bu muhim kafolat — tartib oldindan ma\'lum.'
    },
    {
      question: 'Promise.race() bilan timeout qanday implement qilish mumkin?',
      answer: 'Promise.race([actualPromise, timeoutPromise]) — ikkisidan qaysi biri oldin tugasa, shu qaytadi. timeoutPromise: new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), ms)). Agar actual tezroq — natija. Agar timeout tezroq — xato. MUHIM: timeout bo\'lganda actual CANCEL bo\'lmaydi — bajarilishda davom etadi. Haqiqiy cancel uchun AbortController ishlatish kerak: fetch(url, { signal: controller.signal }).'
    },
    {
      question: 'Qachon qaysi Promise metodini ishlatish kerak?',
      answer: 'all — barcha so\'rovlar parallel, barchasi kerak, bitta xato = hammasi fail (dashboard load). allSettled — barcha natijalar kerak, xatolar bilan birga (batch processing, multi-API). race — birinchi natija yetarli, timeout implement (health check + timeout). any — birinchi muvaffaqiyat yetarli, xatolarga toqat (CDN fallback, mirror selection). Eng ko\'p ishlatiladi: Promise.all (parallel so\'rovlar).'
    }
  ],

  relatedTopics: [
    { techId: 'javascript', sectionId: 'async-javascript', topicId: 'promises', label: 'Promises' },
    { techId: 'javascript', sectionId: 'async-javascript', topicId: 'async-await', label: 'Async/Await' },
    { techId: 'javascript', sectionId: 'async-javascript', topicId: 'event-loop', label: 'Event Loop' }
  ]
}
