import type { Topic } from '../../../types'

export const fetchApi: Topic = {
  id: 'fetch-api',
  title: 'Fetch API',
  importance: 3,
  status: 'to-learn',
  description: 'fetch, Request/Response, headers, AbortController',
  content: `
# Fetch API

## fetch() nima?

\`fetch()\` — brauzerning zamonaviy HTTP so'rov API si. U \`XMLHttpRequest\` o'rnini bosgan. Promise-based, oson va kuchli.

## Asosiy sintaksis

\`\`\`js
const response = await fetch(url, options);
const data = await response.json();
\`\`\`

## Response obyekti

- \`response.ok\` — status 200-299 oralig'ida (boolean)
- \`response.status\` — HTTP status kodi (200, 404, 500)
- \`response.statusText\` — status matni
- \`response.headers\` — Headers obyekti
- \`response.url\` — yakuniy URL (redirect bo'lgan bo'lsa)

## Response body usullari

Har biri Promise qaytaradi, **faqat bir marta** chaqirish mumkin:
- \`response.json()\` — JSON parse
- \`response.text()\` — oddiy matn
- \`response.blob()\` — ikkilik fayl (rasm, PDF)
- \`response.arrayBuffer()\` — raw binary data
- \`response.formData()\` — FormData

## Request options

- \`method\` — HTTP metod (GET, POST, PUT, DELETE, PATCH)
- \`headers\` — so'rov headerlari
- \`body\` — so'rov tanasi (JSON.stringify, FormData, Blob)
- \`mode\` — CORS rejimi (cors, no-cors, same-origin)
- \`credentials\` — cookie yuborish (include, same-origin, omit)
- \`signal\` — AbortController signali

## Muhim nuanslar

1. **fetch() faqat tarmoq xatosida reject bo'ladi** — 404, 500 kabi HTTP xatolar reject emas! \`response.ok\` ni tekshirish shart.
2. **Body faqat bir marta o'qiladi** — \`response.json()\` ni ikki marta chaqirib bo'lmaydi. Kerak bo'lsa, \`response.clone()\` ishlating.
3. **Cookie default yuborilmaydi** cross-origin so'rovlarda — \`credentials: 'include'\` kerak.

## AbortController

So'rovni bekor qilish uchun \`AbortController\` ishlatiladi. Bu timeout, sahifadan chiqish, yoki foydalanuvchi bekor qilganda kerak.

## Headers

\`Headers\` obyekti HTTP headerlarni boshqaradi:
- \`headers.get(name)\`, \`headers.set(name, value)\`
- \`headers.has(name)\`, \`headers.delete(name)\`
- \`headers.forEach()\`, \`headers.entries()\`

## Request va Response konstruktorlari

\`new Request(url, options)\` va \`new Response(body, options)\` — qo'lda yaratish mumkin. Bu Service Worker da ko'p ishlatiladi.
  `.trim(),
  codeExamples: [
    {
      title: 'fetch() bilan CRUD operatsiyalari',
      language: 'js',
      description: 'GET, POST, PUT, DELETE so\'rovlar',
      code: `// GET — ma'lumot olish
async function getUsers() {
  const response = await fetch('https://api.example.com/users');

  // HTTP xatoni tekshirish (MUHIM!)
  if (!response.ok) {
    throw new Error(\`HTTP xato: \${response.status}\`);
  }

  return response.json();
}

// POST — yangi ma'lumot yaratish
async function createUser(userData) {
  const response = await fetch('https://api.example.com/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer token123',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return response.json();
}

// PUT — to'liq yangilash
async function updateUser(id, data) {
  const response = await fetch(\`https://api.example.com/users/\${id}\`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(\`Xato: \${response.status}\`);
  return response.json();
}

// DELETE — o'chirish
async function deleteUser(id) {
  const response = await fetch(\`https://api.example.com/users/\${id}\`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error(\`Xato: \${response.status}\`);
  return response.status === 204 ? null : response.json();
}`,
    },
    {
      title: 'AbortController bilan so\'rovni bekor qilish',
      language: 'js',
      description: 'Timeout va qo\'lda bekor qilish',
      code: `// Oddiy abort
const controller = new AbortController();

fetch('https://api.example.com/data', {
  signal: controller.signal,
})
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => {
    if (err.name === 'AbortError') {
      console.log('So\\'rov bekor qilindi');
    } else {
      console.error('Tarmoq xatosi:', err);
    }
  });

// 5 soniyadan keyin bekor qilish
setTimeout(() => controller.abort(), 5000);

// Timeout bilan fetch wrapper
async function fetchWithTimeout(url, options = {}, timeout = 5000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

// AbortSignal.timeout() — zamonaviy brauzerlar
const response = await fetch('https://api.example.com/data', {
  signal: AbortSignal.timeout(5000), // 5 soniya timeout
});

// Bir nechta so'rovni bitta controller bilan boshqarish
const searchController = new AbortController();

async function search(query) {
  // Oldingi so'rovni bekor qilish
  searchController.abort();
  const newController = new AbortController();

  try {
    const res = await fetch(\`/api/search?q=\${query}\`, {
      signal: newController.signal,
    });
    return res.json();
  } catch (err) {
    if (err.name !== 'AbortError') throw err;
  }
}`,
    },
    {
      title: 'FormData, Blob va Response klonlash',
      language: 'js',
      description: 'Fayl yuklash va murakkab holatlar',
      code: `// FormData bilan fayl yuklash
async function uploadFile(file) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('description', 'Rasm yuklash');

  // Content-Type ni O'RNATMANG — brauzer o'zi boundary qo'shadi
  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  return response.json();
}

// Blob — rasm yuklab olish
async function downloadImage(url) {
  const response = await fetch(url);
  const blob = await response.blob();

  // Rasm URL yaratish
  const imageUrl = URL.createObjectURL(blob);
  const img = document.createElement('img');
  img.src = imageUrl;
  document.body.appendChild(img);

  // Xotirani tozalash
  // URL.revokeObjectURL(imageUrl);
}

// Response.clone() — body ni bir nechta marta o'qish
async function fetchAndLog(url) {
  const response = await fetch(url);

  // Body faqat bir marta o'qiladi! Shuning uchun clone
  const clone = response.clone();

  // Birinchisini log uchun
  const text = await clone.text();
  console.log('Raw response:', text);

  // Ikkinchisini parse uchun
  const data = await response.json();
  return data;
}

// Headers bilan ishlash
const headers = new Headers();
headers.set('Content-Type', 'application/json');
headers.set('Authorization', 'Bearer token');
headers.append('Accept', 'application/json');

console.log(headers.has('Content-Type')); // true
headers.forEach((value, key) => {
  console.log(\`\${key}: \${value}\`);
});`,
    },
  ],
  interviewQA: [
    {
      question: 'fetch() 404 qaytarganda reject bo\'ladimi?',
      answer: 'Yo\'q! `fetch()` faqat **tarmoq xatosida** (DNS xato, server javob bermasa) reject bo\'ladi. HTTP 404, 500 kabi xatolar reject emas — ular muvaffaqiyatli response hisoblanadi. Shuning uchun har doim `response.ok` yoki `response.status` ni tekshirish **majburiy**.',
    },
    {
      question: 'AbortController nima va qachon ishlatiladi?',
      answer: 'AbortController — fetch so\'rovini bekor qilish mexanizmi. `signal` ni fetch ga berish va kerak paytda `controller.abort()` chaqirish. Ishlatilish hollari: 1) Timeout (sekin server). 2) Foydalanuvchi sahifadan chiqsa. 3) Yangi search query kiritilganda oldingi so\'rovni bekor qilish. 4) React useEffect cleanup da.',
    },
    {
      question: 'fetch() da credentials qanday ishlaydi?',
      answer: '`credentials` opsiyasi cookie yuborishni boshqaradi: `"same-origin"` (default) — faqat o\'z domeni uchun cookie yuboradi. `"include"` — cross-origin so\'rovlarda ham cookie yuboradi (CORS server `Access-Control-Allow-Credentials: true` qaytarishi kerak). `"omit"` — hech qachon cookie yubormaydi.',
    },
    {
      question: 'Response body ni nega faqat bir marta o\'qish mumkin?',
      answer: 'Response body — bu **ReadableStream**, ya\'ni bir marta o\'qilganda tugaydi (consumed bo\'ladi). Bu xotira samaradorligi uchun qilingan — katta response ni butunlay xotirada saqlash shart emas. Agar body ni bir nechta marta o\'qish kerak bo\'lsa, avval `response.clone()` bilan nusxa yaratish kerak.',
    },
    {
      question: 'fetch() va XMLHttpRequest farqi nimada?',
      answer: 'Asosiy farqlar: 1) fetch Promise-based, XHR callback-based. 2) fetch stream API ni qo\'llab-quvvatlaydi. 3) fetch da upload progress yo\'q (XHR da bor). 4) fetch cookie ni default yubormaydi cross-origin da. 5) fetch yanada sodda va zamonaviy API. 6) fetch ServiceWorker da ishlaydi, XHR ishlamaydi.',
    },
  ],
  relatedTopics: [
    {
      techId: 'javascript',
      sectionId: 'dom-browser',
      topicId: 'web-workers',
      label: 'Web Workers',
    },
    {
      techId: 'javascript',
      sectionId: 'dom-browser',
      topicId: 'web-storage',
      label: 'Web Storage',
    },
  ],
}
