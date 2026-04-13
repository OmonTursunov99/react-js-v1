import type { Topic } from '../../../types'

export const webStorage: Topic = {
  id: 'web-storage',
  title: 'Web Storage va Cookies',
  importance: 2,
  status: 'to-learn',
  description: 'localStorage, sessionStorage, cookies, IndexedDB overview',
  content: `
# Web Storage va Cookies

## Ma'lumot saqlash usullari

Brauzerda ma'lumot saqlashning bir necha usuli bor. Har birining o'z maqsadi va cheklovlari bor.

## localStorage

- Ma'lumot **doimiy** saqlanadi (brauzer yopilsa ham qoladi)
- Hajmi: **~5-10 MB** (brauzerga qarab)
- Faqat **string** saqlaydi — obyektni \`JSON.stringify()\` qilish kerak
- **Sinxron** API — katta ma'lumotlarda main thread ni bloklaydi
- Faqat **same-origin** (protocol + domain + port) dan foydalanish mumkin
- \`storage\` eventi orqali boshqa tab-lar o'zgarishni eshitadi

## sessionStorage

localStorage bilan bir xil API, lekin:
- Ma'lumot **tab/sessiya** bilan birga yo'qoladi
- Har bir tab o'z **alohida** sessionStorage-ga ega
- Yangi tab ochilsa — bo'sh sessionStorage

## Cookies

- **Server bilan** har bir HTTP request da yuboriladi
- Hajmi: **~4 KB** per cookie
- \`expires\` yoki \`max-age\` bilan muddatli
- \`HttpOnly\` — JavaScript dan foydalanib bo'lmaydi (XSS dan himoya)
- \`Secure\` — faqat HTTPS orqali yuboriladi
- \`SameSite\` — CSRF dan himoya (Strict, Lax, None)
- \`Path\` va \`Domain\` — qaysi URL larga tegishli

## IndexedDB

- **Asinxron** NoSQL ma'lumotlar bazasi
- Hajmi: **yuzlab MB** (brauzer ruxsati bilan GB)
- Murakkab so'rovlar, indekslar, tranzaksiyalar
- Blob, fayl va strukturali ma'lumotlarni saqlaydi
- Web Worker ichida ham ishlaydi

## Qachon nimani ishlatish?

| Usul | Hajm | Muddati | Server ga | Ishlatish |
|------|------|---------|-----------|-----------|
| localStorage | 5-10 MB | Doimiy | Yo'q | Sozlamalar, kesh |
| sessionStorage | 5-10 MB | Tab | Yo'q | Form draft, vaqtincha |
| Cookies | 4 KB | Sozlanadi | Ha | Auth token, session |
| IndexedDB | 100+ MB | Doimiy | Yo'q | Offline data, katta kesh |

## storage Event

\`localStorage\` o'zgarganda **boshqa tab-larda** \`storage\` eventi ishga tushadi. Bu cross-tab muloqot uchun ishlatiladi. Eslatma: o'zgarish bo'lgan tab da event **ishlamaydi**.

## Xavfsizlik masalalari

- localStorage da **maxfiy ma'lumot saqlamang** (token, parol) — XSS hujumiga ochiqligi
- Cookie \`HttpOnly\` flag — JavaScript orqali o'qib bo'lmaydi
- \`SameSite=Strict\` — CSRF hujumlardan himoya
  `.trim(),
  codeExamples: [
    {
      title: 'localStorage va sessionStorage',
      language: 'js',
      description: 'Web Storage API ning asosiy metodlari',
      code: `// === localStorage ===

// Saqlash
localStorage.setItem('theme', 'dark');
localStorage.setItem('user', JSON.stringify({ name: 'Ali', age: 25 }));

// O'qish
const theme = localStorage.getItem('theme'); // 'dark'
const user = JSON.parse(localStorage.getItem('user')); // { name, age }

// O'chirish
localStorage.removeItem('theme');

// Hammani tozalash
localStorage.clear();

// Barcha kalitlarni ko'rish
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  console.log(key, localStorage.getItem(key));
}

// === sessionStorage === (API bir xil)
sessionStorage.setItem('formDraft', JSON.stringify({ title: 'Draft' }));

// === Xavfsiz wrapper ===
const storage = {
  get(key, fallback = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('Storage to\\'ldi yoki bloklangan:', e);
    }
  },
  remove(key) {
    localStorage.removeItem(key);
  },
};`,
    },
    {
      title: 'Cookie bilan ishlash',
      language: 'js',
      description: 'Cookie o\'qish, yozish va o\'chirish',
      code: `// Cookie yozish
document.cookie = 'username=Ali; max-age=86400; path=/; SameSite=Lax';
document.cookie = 'theme=dark; expires=Fri, 31 Dec 2027 23:59:59 GMT; path=/';

// Cookie o'qish — barcha cookie lar bitta stringda
console.log(document.cookie); // "username=Ali; theme=dark"

// Cookie ni parse qilish
function getCookie(name) {
  const cookies = document.cookie.split('; ');
  const cookie = cookies.find(c => c.startsWith(name + '='));
  return cookie ? decodeURIComponent(cookie.split('=')[1]) : null;
}

console.log(getCookie('username')); // 'Ali'

// Cookie o'chirish — muddatni o'tgan vaqtga qo'yish
document.cookie = 'username=; max-age=0; path=/';

// Xavfsiz cookie (server tomondan o'rnatiladi)
// Set-Cookie: token=abc123; HttpOnly; Secure; SameSite=Strict; Path=/

// JavaScript dan HttpOnly cookie-ni O'QIB BO'LMAYDI
// Bu XSS hujumlardan himoya qiladi

// Cookie Storage API (yangi, hali barcha brauzerlarda yo'q)
// await cookieStore.get('username');
// await cookieStore.set({ name: 'theme', value: 'dark', expires: ... });`,
    },
    {
      title: 'storage eventi va IndexedDB asoslari',
      language: 'js',
      description: 'Cross-tab muloqot va IndexedDB bilan ishlash',
      code: `// === storage event (cross-tab muloqot) ===
window.addEventListener('storage', (e) => {
  console.log('Kalit:', e.key);
  console.log('Eski qiymat:', e.oldValue);
  console.log('Yangi qiymat:', e.newValue);
  console.log('URL:', e.url);

  if (e.key === 'theme') {
    applyTheme(e.newValue);
  }

  // Agar key === null — clear() chaqirilgan
});

// Boshqa tabda o'zgarish qilsak, bu tab eshitadi
// localStorage.setItem('theme', 'light');

// === IndexedDB (soddalashtirilgan) ===
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('MyApp', 1);

    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('users')) {
        const store = db.createObjectStore('users', { keyPath: 'id' });
        store.createIndex('name', 'name', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function addUser(user) {
  const db = await openDB();
  const tx = db.transaction('users', 'readwrite');
  tx.objectStore('users').add(user);
  return new Promise((resolve, reject) => {
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
  });
}

async function getUser(id) {
  const db = await openDB();
  const tx = db.transaction('users', 'readonly');
  const request = tx.objectStore('users').get(id);
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Ishlatish
await addUser({ id: 1, name: 'Ali', email: 'ali@test.com' });
const user = await getUser(1);`,
    },
  ],
  interviewQA: [
    {
      question: 'localStorage va sessionStorage farqi nimada?',
      answer: 'Asosiy farq **muddatida**: `localStorage` doimiy saqlanadi (brauzer yopilsa ham), `sessionStorage` faqat tab/sessiya davomida yashaydi. Har bir tab o\'zining alohida `sessionStorage`-iga ega. API lari bir xil (`setItem`, `getItem`, `removeItem`, `clear`). Ikkalasi ham ~5-10 MB hajm, faqat string saqlaydi.',
    },
    {
      question: 'Cookie va localStorage farqi nimada?',
      answer: 'Asosiy farqlar: 1) Cookie har bir **HTTP request** bilan serverga yuboriladi, localStorage faqat client-da. 2) Cookie ~4 KB, localStorage ~5-10 MB. 3) Cookie `HttpOnly` bo\'lsa JS dan o\'qib bo\'lmaydi (xavfsiz). 4) Cookie `expires`/`max-age` bilan muddatli, localStorage doimiy. 5) Cookie `SameSite`, `Secure` kabi xavfsizlik flaglari bor.',
    },
    {
      question: 'IndexedDB ni qachon ishlatish kerak?',
      answer: 'IndexedDB katta hajmli strukturali ma\'lumotlar uchun: offline-first ilovalar, katta kesh, fayl va blob saqlash. `localStorage` dan farqi: asinxron (main thread ni bloklamaydi), yuzlab MB saqlaydi, indekslar va murakkab so\'rovlar qo\'llab-quvvatlaydi, Web Worker ichida ishlaydi.',
    },
    {
      question: 'storage eventi qanday ishlaydi?',
      answer: '`localStorage` o\'zgarganda **boshqa tab-larda** `window` da `storage` eventi ishga tushadi. O\'zgarish bo\'lgan tab da event ishlamaydi. Event obyektida `key`, `oldValue`, `newValue`, `url` bor. Bu cross-tab muloqot uchun ishlatiladi — masalan, bir tab da chiqish qilganda boshqa tab-larni ham chiqarish.',
    },
  ],
  relatedTopics: [
    {
      techId: 'javascript',
      sectionId: 'dom-browser',
      topicId: 'fetch-api',
      label: 'Fetch API',
    },
  ],
}
