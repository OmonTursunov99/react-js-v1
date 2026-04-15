import type { Topic } from '../../../types'

export const serviceWorkers: Topic = {
  id: 'service-workers',
  title: 'Service Workers',
  importance: 2,
  status: 'to-learn',
  description: 'Offline support, caching strategies, push notifications, PWA',
  content: `
# Service Workers

## Service Worker nima?

Service Worker — bu brauzer va tarmoq o'rtasida ishlaydigan **proxy skript**. U alohida thread da ishlaydi (main thread ni bloklamaydi), DOM ga kirish imkoni yo'q, lekin barcha **network so'rovlarni ushlab** (intercept) turli strategiyalar bilan javob qaytara oladi.

Asosiy imkoniyatlari:
- **Offline support** — internet bo'lmasa ham ilova ishlaydi
- **Cache boshqarish** — resurslarni saqlash va qaytarish
- **Push Notifications** — server dan bildirishnoma olish
- **Background Sync** — tarmoq qaytganda ma'lumot yuborish
- **PWA** (Progressive Web App) asosi

## HTTPS talab

Service Worker **faqat HTTPS** da ishlaydi. Buning sababi — u barcha network so'rovlarni intercept qila oladi, shuning uchun xavfsizlik muhim. Yagona istisno — \`localhost\` (development uchun).

## Lifecycle (Hayot sikli)

Service Worker ning hayot sikli boshqa Worker lardan farq qiladi:

### 1. Registration (Ro'yxatdan o'tkazish)
\`navigator.serviceWorker.register('/sw.js')\` chaqiriladi. Brauzer SW faylni yuklab oladi.

### 2. Install (O'rnatish)
SW birinchi marta yuklanganida yoki yangilangan versiya topilganida \`install\` event ishga tushadi. Bu yerda odatda **precaching** qilinadi — muhim resurslar oldindan keshga yuklanadi.

### 3. Waiting (Kutish)
Agar eski versiya hali faol bo'lsa, yangi SW **kutish holatida** turadi. Faqat barcha eski tablar yopilganda yoki \`skipWaiting()\` chaqirilganda faollashadi.

### 4. Activate (Faollashtirish)
Yangi SW faollashadi. Bu yerda odatda **eski keshlarni tozalash** amalga oshiriladi.

### 5. Fetch (So'rovlarni ushlash)
Faol SW barcha network so'rovlarni \`fetch\` event orqali ushlaydi va turli caching strategiyalari qo'llaydi.

### 6. Idle / Terminate
SW ishlamay turganda brauzer uni **to'xtatadi** (terminate). Kerak bo'lganda qayta ishga tushiradi. Shuning uchun SW da global o'zgaruvchilar saqlanmaydi — har safar yangi kontekst.

## Scope (Qamrov)

SW faqat o'zi ro'yxatdan o'tgan **papka va uning ichidagi** so'rovlarni ushlaydi:

- \`/sw.js\` → butun sayt (\`/\` scope)
- \`/app/sw.js\` → faqat \`/app/\` ichidagi so'rovlar
- Scope ni \`register()\` da maxsus belgilash mumkin (lekin SW fayl joylashgan papkadan yuqoriga chiqa olmaydi)

## Caching strategiyalari

### 1. Cache First (Cache, keyin Network)
Avval keshdan qidiradi. Topilmasa — tarmoqdan oladi va keshga saqlaydi.
**Qachon:** statik resurslar (CSS, JS, rasmlar, shriftlar).

### 2. Network First (Network, keyin Cache)
Avval tarmoqdan olishga harakat qiladi. Xato bo'lsa — keshdan qaytaradi.
**Qachon:** API so'rovlar, tez-tez o'zgaradigan ma'lumotlar.

### 3. Stale While Revalidate
Keshdan **darhol** qaytaradi (tezlik), lekin **fonda** tarmoqdan yangi versiyani yuklab keshni yangilaydi.
**Qachon:** tez-tez o'zgarmaydigan, lekin yangilik muhim bo'lgan resurslar (avatar, profil).

### 4. Cache Only
Faqat keshdan qaytaradi. Tarmoqqa murojaat qilmaydi.
**Qachon:** precache qilingan statik resurslar, offline ilova shell.

### 5. Network Only
Faqat tarmoqdan oladi. Kesh ishlatilmaydi.
**Qachon:** analytics, login so'rovlar, real-time ma'lumot.

## Background Sync

Foydalanuvchi offline bo'lganida qilingan amallarni **tarmoq qaytganda avtomatik** bajarish:

1. Ilova \`SyncManager.register('sync-tag')\` bilan sync ro'yxatga oladi
2. Tarmoq qaytganda brauzer SW da \`sync\` event ishga tushiradi
3. SW kutilgan so'rovlarni yuboradi

Bu xabar yuborish, forma jo'natish kabi amallarda juda foydali.

## Push Notifications

Server dan foydalanuvchiga bildirishnoma yuborish:

1. Ilova \`PushManager.subscribe()\` bilan push obunaga yoziladi
2. Server \`push subscription\` endpoint ga xabar yuboradi
3. Brauzer SW da \`push\` event ishga tushiradi
4. SW \`self.registration.showNotification()\` bilan bildirishnoma ko'rsatadi

**Muhim:** Foydalanuvchidan \`Notification.requestPermission()\` orqali ruxsat olish kerak.

## Service Worker vs Web Worker

| Xususiyat | Service Worker | Web Worker |
|---|---|---|
| **Vazifa** | Network proxy, offline, push | Og'ir hisoblashlar |
| **Hayot sikli** | Brauzer boshqaradi (install → activate) | Dasturchi boshqaradi (terminate) |
| **DOM** | Yo'q | Yo'q |
| **Davomiylik** | Tab yopilsa ham ishlaydi | Tab bilan birga tugaydi |
| **HTTPS** | Talab qilinadi | Talab qilinmaydi |
| **Scope** | Network so'rovlarni ushlaydi | Faqat postMessage |
| **Cache API** | Ha | Yo'q (odatda) |

## PWA (Progressive Web App)

PWA — bu web ilova bo'lib, native ilova kabi tajriba beradi:

- **Offline ishlaydi** — Service Worker + Cache
- **O'rnatiladi** — Home screen ga qo'shish mumkin (\`manifest.json\`)
- **Push notification** — bildirishnomalar
- **Tez yuklanadi** — precaching

PWA uchun kerak:
1. \`manifest.json\` — ilova nomi, ikonkalar, ranglar
2. \`Service Worker\` — offline support, caching
3. \`HTTPS\` — xavfsiz ulanish

## SW Update Lifecycle

1. Brauzer har safar sahifa ochilganida SW faylni tekshiradi (byte-by-byte taqqoslash)
2. Yangi versiya topilsa — \`install\` event ishga tushadi
3. Yangi SW **waiting** holatiga o'tadi (eski SW hali faol)
4. Barcha tablar yopilganda — yangi SW **activate** bo'ladi
5. \`skipWaiting()\` + \`clients.claim()\` bilan darhol yangilash mumkin (ehtiyot bo'lish kerak)
  `.trim(),
  codeExamples: [
    {
      title: 'Service Worker registration + install (precaching)',
      language: 'js',
      description: 'SW ni ro\'yxatdan o\'tkazish va muhim resurslarni oldindan keshlash',
      code: `// === main.js (asosiy ilova) ===
// SW ni ro'yxatdan o'tkazish
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/', // ixtiyoriy — default SW fayl joylashgan papka
      });

      console.log('SW registered:', registration.scope);

      // Yangilanish borligini tekshirish
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        console.log('Yangi SW topildi, holati:', newWorker.state);

        newWorker.addEventListener('statechange', () => {
          console.log('SW holati o\\'zgardi:', newWorker.state);
        });
      });
    } catch (error) {
      console.error('SW registration xato:', error);
    }
  });
}

// === sw.js (Service Worker fayl) ===
const CACHE_NAME = 'app-cache-v1';
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/styles/main.css',
  '/scripts/app.js',
  '/images/logo.png',
  '/offline.html', // offline sahifa
];

// INSTALL — resurslarni oldindan keshlash
self.addEventListener('install', (event) => {
  console.log('[SW] Install bosqichi');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Precaching:', PRECACHE_URLS.length, 'ta fayl');
        return cache.addAll(PRECACHE_URLS);
      })
      .then(() => {
        // Kutmasdan darhol faollashtirish
        return self.skipWaiting();
      })
  );
});

// ACTIVATE — eski keshlarni tozalash
self.addEventListener('activate', (event) => {
  console.log('[SW] Activate bosqichi');

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => {
              console.log('[SW] Eski kesh o\\'chirildi:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => {
        // Barcha ochiq tablarga darhol nazorat qilish
        return self.clients.claim();
      })
  );
});`,
    },
    {
      title: 'Fetch event — caching strategiyalari',
      language: 'js',
      description: 'Cache First, Network First, Stale While Revalidate strategiyalarini qo\'llash',
      code: `// === sw.js davomi — Fetch event ===

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Faqat GET so'rovlarni keshlash
  if (request.method !== 'GET') return;

  // Strategiyani URL ga qarab tanlash
  if (isStaticAsset(url)) {
    // CACHE FIRST — statik resurslar (CSS, JS, rasmlar)
    event.respondWith(cacheFirst(request));
  } else if (isApiRequest(url)) {
    // NETWORK FIRST — API so'rovlar
    event.respondWith(networkFirst(request));
  } else {
    // STALE WHILE REVALIDATE — boshqa sahifalar
    event.respondWith(staleWhileRevalidate(request));
  }
});

// --- Yordamchi funksiyalar ---

function isStaticAsset(url) {
  return /\\.(css|js|png|jpg|jpeg|svg|woff2?|ttf)$/.test(url.pathname);
}

function isApiRequest(url) {
  return url.pathname.startsWith('/api/');
}

// 1. CACHE FIRST
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) {
    return cached; // Keshda bor — darhol qaytarish
  }

  // Keshda yo'q — tarmoqdan olish va keshlash
  try {
    const response = await fetch(request);
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, response.clone());
    return response;
  } catch (error) {
    return new Response('Offline', { status: 503 });
  }
}

// 2. NETWORK FIRST
async function networkFirst(request) {
  try {
    const response = await fetch(request);

    // Muvaffaqiyatli bo'lsa — keshga saqlash
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, response.clone());
    return response;
  } catch (error) {
    // Tarmoq xato — keshdan qaytarish
    const cached = await caches.match(request);
    if (cached) return cached;

    return new Response(
      JSON.stringify({ error: 'Offline va keshda yo\\'q' }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// 3. STALE WHILE REVALIDATE
async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);

  // Fonda yangilash (natijani kutmaymiz)
  const fetchPromise = fetch(request)
    .then((response) => {
      cache.put(request, response.clone());
      return response;
    })
    .catch(() => null); // xato bo'lsa e'tiborsiz

  // Keshda bor bo'lsa — darhol qaytarish, yo'q bo'lsa — tarmoqdan kutish
  return cached || fetchPromise || caches.match('/offline.html');
}`,
    },
    {
      title: 'Push Notification va Background Sync',
      language: 'js',
      description: 'Server dan bildirishnoma olish va offline so\'rovlarni sync qilish',
      code: `// === main.js — Push Notification obuna ===

async function subscribeToPush() {
  // 1. Ruxsat so'rash
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    console.log('Bildirishnoma ruxsati berilmadi');
    return;
  }

  // 2. SW registration olish
  const registration = await navigator.serviceWorker.ready;

  // 3. Push obuna
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true, // faqat ko'rinadigan bildirishnomalar
    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
  });

  // 4. Obunani serverga yuborish
  await fetch('/api/push-subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(subscription),
  });

  console.log('Push obuna muvaffaqiyatli');
}

// VAPID kalitni Uint8Array ga aylantirish
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map(ch => ch.charCodeAt(0)));
}

// === sw.js — Push event ===

self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {
    title: 'Bildirishnoma',
    body: 'Yangi xabar bor!',
  };

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/images/icon-192.png',
      badge: '/images/badge-72.png',
      vibrate: [200, 100, 200],
      data: { url: data.url || '/' },
      actions: [
        { action: 'open', title: 'Ochish' },
        { action: 'close', title: 'Yopish' },
      ],
    })
  );
});

// Bildirishnoma bosilganda
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  }
});

// === Background Sync ===

// main.js — offline xabar yuborish
async function sendMessage(message) {
  try {
    await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    });
  } catch (error) {
    // Offline — IndexedDB ga saqlash va sync ro'yxatga olish
    await saveToIndexedDB('outbox', message);

    const registration = await navigator.serviceWorker.ready;
    await registration.sync.register('send-messages');
    console.log('Background sync ro\\'yxatga olindi');
  }
}

// sw.js — sync event
self.addEventListener('sync', (event) => {
  if (event.tag === 'send-messages') {
    event.waitUntil(syncMessages());
  }
});

async function syncMessages() {
  const messages = await getFromIndexedDB('outbox');

  for (const message of messages) {
    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(message),
      });
      await removeFromIndexedDB('outbox', message.id);
    } catch (error) {
      // Hali ham offline — keyingi sync da qayta urinadi
      console.log('Sync xato, qayta uriniladi');
    }
  }
}`,
    },
  ],
  interviewQA: [
    {
      question: 'Service Worker nima va qanday ishlaydi?',
      answer: 'Service Worker — bu brauzer va tarmoq o\'rtasida ishlaydigan **proxy skript** bo\'lib, alohida thread da ishlaydi. U barcha network so\'rovlarni intercept qiladi va turli caching strategiyalar bilan javob qaytaradi. Asosiy vazifalari: offline support, resurslarni keshlash, push notification va background sync. DOM ga kirish imkoni yo\'q, faqat HTTPS da ishlaydi (localhost istisno). Lifecycle: register → install (precaching) → activate (eski kesh tozalash) → fetch (so\'rovlarni ushlash). Tab yopilsa ham ishlashda davom etadi — brauzer kerak bo\'lganda ishga tushiradi.',
    },
    {
      question: 'Cache First va Network First strategiyalari orasidagi farq nima?',
      answer: '**Cache First** — avval keshdan qidiradi, topilmasa tarmoqdan oladi. Tez ishlaydi, lekin ma\'lumot eskirishi mumkin. Statik resurslar (CSS, JS, rasmlar, shriftlar) uchun ideal. **Network First** — avval tarmoqdan olishga harakat qiladi, xato bo\'lsa keshdan qaytaradi. Har doim yangi ma\'lumot oladi, lekin sekinroq. API so\'rovlar va tez-tez o\'zgaradigan kontent uchun mos. Uchinchi variant — **Stale While Revalidate**: keshdan darhol qaytaradi (tezlik), lekin fonda tarmoqdan yangilab qo\'yadi (yangilik). Bu tezlik va yangilik o\'rtasida muvozanat.',
    },
    {
      question: 'Service Worker lifecycle bosqichlarini tushuntiring.',
      answer: '1. **Register** — `navigator.serviceWorker.register(\'/sw.js\')` chaqiriladi, brauzer SW faylni yuklab oladi. 2. **Install** — birinchi marta yoki yangi versiyada ishga tushadi, bu yerda precaching qilinadi (`event.waitUntil` bilan). 3. **Waiting** — agar eski SW faol bo\'lsa, yangi SW kutadi. `skipWaiting()` bilan o\'tkazib yuborish mumkin. 4. **Activate** — yangi SW faollashadi, eski keshlarni tozalash uchun ideal joy. `clients.claim()` bilan barcha tablarga nazorat qilish. 5. **Fetch** — faol SW barcha so\'rovlarni ushlaydi. 6. **Idle/Terminate** — ishlamay tursa brauzer to\'xtatadi, kerak bo\'lganda qayta ishga tushiradi. Muhim: SW global o\'zgaruvchilari saqlanmaydi.',
    },
    {
      question: 'Service Worker va Web Worker farqi nimada?',
      answer: 'Asosiy farqlar: 1) **Vazifa** — SW network proxy (offline, caching, push), Web Worker og\'ir hisoblashlar uchun. 2) **Lifecycle** — SW ni brauzer boshqaradi (install → activate → terminate), Web Worker ni dasturchi yaratadi va to\'xtatadi. 3) **Davomiylik** — SW tab yopilsa ham ishlaydi (push notification olishi mumkin), Web Worker tab bilan birga tugaydi. 4) **HTTPS** — SW faqat HTTPS da, Web Worker da bu talab yo\'q. 5) **Network** — SW fetch event orqali barcha so\'rovlarni ushlaydi, Web Worker faqat postMessage orqali muloqot qiladi. 6) **Cache API** — SW da to\'liq, Web Worker da odatda ishlatilmaydi. Ikkisida ham DOM ga kirish imkoni yo\'q.',
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
      topicId: 'fetch-api',
      label: 'Fetch API',
    },
    {
      techId: 'javascript',
      sectionId: 'dom-browser',
      topicId: 'web-storage',
      label: 'Web Storage',
    },
  ],
}
