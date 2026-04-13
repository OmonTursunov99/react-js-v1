import type { Topic } from '../../../types'

export const callbacksTopic: Topic = {
  id: 'callbacks',
  title: 'Callbacks',
  importance: 2,
  status: 'to-learn',
  description: 'Callback pattern, callback hell, error-first callbacks va asinxron dasturlash asoslari',

  content: `
# Callbacks — Asinxron dasturlashning boshlanishi

## Callback nima?
Callback — boshqa funksiyaga **argument** sifatida beriladigan funksiya. U ma'lum bir vazifa tugagandan keyin **chaqiriladi** (call back — "qayta chaqirish"). JavaScript-da funksiyalar first-class, shuning uchun callback tabiiy pattern.

## Sinxron va Asinxron callback
- **Sinxron callback**: darhol chaqiriladi — \`array.map(fn)\`, \`array.filter(fn)\`
- **Asinxron callback**: keyinroq chaqiriladi — \`setTimeout(fn, 1000)\`, \`fs.readFile(path, fn)\`

## Error-First Callback (Node.js pattern)
Node.js-da standart: callback-ning birinchi argumenti **error**, ikkinchisi **natija**. Agar xato bo'lmasa, error = null. Bu pattern barcha Node.js API-larida ishlatiladi.

## Callback Hell (Pyramid of Doom)
Ko'p asinxron operatsiyalarni ketma-ket bajarish uchun callback-lar ichma-ich yoziladi. Natijada kod o'qib bo'lmaydigan "piramida" shaklini oladi. Bu anti-pattern.

## Callback Hell yechimi
1. **Nomli funksiyalar** — anonymous o'rniga nomli funksiyalar
2. **Modullashtirish** — har bir qadam alohida funksiya
3. **Promise** — callback o'rniga .then() zanjiri
4. **async/await** — sinxron ko'rinishdagi asinxron kod

## Inversion of Control muammosi
Callback berganda, boshqaruvni **tashqi kodga** berasiz. Tashqi kod callback-ni chaqirmasligi, ko'p marta chaqirishi, xato bilan chaqirishi mumkin. Promise bu muammoni hal qiladi.

## Callback amalda
Hozirgi zamonaviy JS-da callback kamroq ishlatiladi — o'rniga Promise va async/await. Lekin tushunish muhim, chunki:
- Event listener-lar callback
- Array metodlari (map, filter, reduce) callback
- setTimeout/setInterval callback
- Ko'p kutubxonalar callback API beradi

## Higher-Order Functions
Callback qabul qiluvchi funksiya — **higher-order function** (HOF). Bu funksional dasturlashning asosiy konsepti.
  `.trim(),

  codeExamples: [
    {
      title: 'Callback asoslari — sinxron va asinxron',
      language: 'js',
      description: 'Sinxron callback (array methods) va asinxron callback (setTimeout)',
      code: `// Sinxron callback — darhol bajariladi
const numbers = [1, 2, 3, 4, 5];

const doubled = numbers.map(function(n) {
  return n * 2;
});
console.log(doubled); // [2, 4, 6, 8, 10]

const evens = numbers.filter(n => n % 2 === 0);
console.log(evens); // [2, 4]

// Custom HOF with callback
function repeat(n, callback) {
  for (let i = 0; i < n; i++) {
    callback(i);
  }
}
repeat(3, i => console.log(\`Qadam \${i}\`));
// Qadam 0, Qadam 1, Qadam 2

// Asinxron callback — keyinroq bajariladi
console.log('Oldin');

setTimeout(() => {
  console.log('2 sekunddan keyin');
}, 2000);

console.log('Keyin');
// Oldin → Keyin → (2s) → 2 sekunddan keyin

// Event listener — asinxron callback
document.addEventListener('click', function handleClick(event) {
  console.log(\`Bosildi: \${event.clientX}, \${event.clientY}\`);
});`
    },
    {
      title: 'Error-First Callback pattern',
      language: 'js',
      description: 'Node.js standart callback formati — birinchi argument xato',
      code: `// Error-first callback pattern
function fetchUserData(userId, callback) {
  // Asinxron operatsiyani simulatsiya
  setTimeout(() => {
    if (!userId) {
      callback(new Error('userId kiritilmagan'), null);
      return;
    }

    if (userId === 999) {
      callback(new Error('Foydalanuvchi topilmadi'), null);
      return;
    }

    // Muvaffaqiyat — error = null
    callback(null, {
      id: userId,
      name: 'Ali',
      email: 'ali@mail.com'
    });
  }, 1000);
}

// Ishlatish
fetchUserData(1, (error, user) => {
  if (error) {
    console.error('Xato:', error.message);
    return;
  }
  console.log('Foydalanuvchi:', user);
});

// Node.js fs misoli (real pattern)
// const fs = require('fs');
// fs.readFile('file.txt', 'utf8', (err, data) => {
//   if (err) {
//     console.error('Fayl o\\'qishda xato:', err);
//     return;
//   }
//   console.log(data);
// });`
    },
    {
      title: 'Callback Hell va uning yechimi',
      language: 'js',
      description: 'Ichma-ich callback-lar muammosi va yechimi',
      code: `// CALLBACK HELL — o'qib bo'lmaydigan kod
function getUser(id, callback) {
  setTimeout(() => callback(null, { id, name: 'Ali' }), 100);
}
function getOrders(userId, callback) {
  setTimeout(() => callback(null, [{ id: 1, total: 50000 }]), 100);
}
function getOrderDetails(orderId, callback) {
  setTimeout(() => callback(null, { id: orderId, items: ['Kitob'] }), 100);
}

// Piramida shakli — YOMON
getUser(1, (err, user) => {
  if (err) return console.error(err);
  getOrders(user.id, (err, orders) => {
    if (err) return console.error(err);
    getOrderDetails(orders[0].id, (err, details) => {
      if (err) return console.error(err);
      console.log('Natija:', details);
      // Yana ichma-ich...
    });
  });
});

// YECHIM 1: Nomli funksiyalar
function handleUser(err, user) {
  if (err) return console.error(err);
  getOrders(user.id, handleOrders);
}

function handleOrders(err, orders) {
  if (err) return console.error(err);
  getOrderDetails(orders[0].id, handleDetails);
}

function handleDetails(err, details) {
  if (err) return console.error(err);
  console.log('Natija:', details);
}

getUser(1, handleUser); // Tekis va o'qilishi oson

// YECHIM 2: Promise-ga o'girish (promisify)
function promisify(fn) {
  return (...args) => new Promise((resolve, reject) => {
    fn(...args, (err, result) => {
      err ? reject(err) : resolve(result);
    });
  });
}

const getUserAsync = promisify(getUser);
const getOrdersAsync = promisify(getOrders);`
    }
  ],

  interviewQA: [
    {
      question: 'Callback nima va uni qanday ishlatiladi?',
      answer: 'Callback — boshqa funksiyaga argument sifatida beriladigan funksiya. Vazifa tugaganda "qayta chaqiriladi". Ikki turi: 1) Sinxron — darhol bajariladi (map, filter, forEach). 2) Asinxron — keyinroq bajariladi (setTimeout, event listener, I/O). JS-da funksiyalar first-class object, shuning uchun callback tabiiy va asosiy pattern. Higher-order function — callback qabul qiluvchi funksiya.'
    },
    {
      question: 'Callback Hell nima va qanday hal qilish mumkin?',
      answer: 'Callback Hell — ko\'p asinxron callback-larning ichma-ich joylashishi, "piramida" shaklida o\'qib bo\'lmaydigan kod. Yechimlar: 1) Nomli funksiyalar — anonymous o\'rniga nomli. 2) Modullashtirish — har bir qadam alohida funksiya. 3) Promise — .then() zanjiri tekis. 4) async/await — eng yaxshi yechim, sinxron ko\'rinishda. 5) Utility kutubxonalar (async.js). Zamonaviy JS-da async/await standart.'
    },
    {
      question: 'Error-first callback pattern nima?',
      answer: 'Node.js standart pattern: callback(error, result). Birinchi argument — xato ob\'ekti (yoki null), ikkinchisi — natija. Afzalliklari: 1) Barcha API-larda bir xil format. 2) Error handling unutilmaydi. 3) if (err) return — oddiy pattern. Kamchiliklari: 1) Har safar if (err) yozish kerak. 2) Callback hell xavfi. 3) Try/catch ishlamaydi (asinxron). Promise va async/await bu muammolarni hal qiladi.'
    },
    {
      question: 'Inversion of Control nima va callback-da bu muammo qanday namoyon bo\'ladi?',
      answer: 'Inversion of Control — callback berganda boshqaruvni tashqi kodga berasiz. Muammolar: 1) Callback chaqirilmasligi mumkin. 2) Ko\'p marta chaqirilishi mumkin. 3) Xato argument bilan chaqirilishi mumkin. 4) Sinxron chaqirilishi mumkin (kutilganda asinxron). Promise bu muammoni hal qiladi: resolve/reject faqat BIR MARTA chaqiriladi, har doim asinxron (microtask), .then()/.catch() bilan aniq boshqaruv. Shuning uchun Promise "callback-lardan yaxshiroq".'
    }
  ],

  relatedTopics: [
    { techId: 'javascript', sectionId: 'async-javascript', topicId: 'promises', label: 'Promises' },
    { techId: 'javascript', sectionId: 'async-javascript', topicId: 'async-await', label: 'Async/Await' },
    { techId: 'javascript', sectionId: 'async-javascript', topicId: 'event-loop', label: 'Event Loop' }
  ]
}
