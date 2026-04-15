import type { Topic } from '../../../types'

export const websocket: Topic = {
  id: 'websocket',
  title: 'WebSocket',
  importance: 2,
  status: 'to-learn',
  description: 'Real-time muloqot, ws://, bidirectional, Socket.IO',
  content: `
# WebSocket

## WebSocket nima?

**WebSocket** — bu client va server o'rtasida **doimiy, ikki tomonlama (full-duplex)** aloqa kanalini ta'minlaydigan protokol. HTTP dan farqli o'laroq, WebSocket bir marta ulanadi va keyin ikkala tomon ham istalgan paytda ma'lumot yuborishi mumkin — so'rov-javob modeli kerak emas.

## HTTP dan farqi

| Xususiyat | HTTP | WebSocket |
|---|---|---|
| Aloqa turi | Bir tomonlama (request → response) | Ikki tomonlama (full-duplex) |
| Ulanish | Har so'rovda yangi (yoki keep-alive) | Bir marta ulanish, doimiy |
| Boshlovchi | Faqat client so'rov yuboradi | Ikkala tomon ham yuborishi mumkin |
| Overhead | Har so'rovda headerlar (katta) | Dastlabki handshake, keyin minimal frame |
| Protokol | http:// / https:// | ws:// / wss:// |
| Foydalanish | REST API, sahifalar, fayllar | Chat, live data, o'yinlar |

## ws:// va wss:// protokol

- \`ws://\` — shifrlanmagan WebSocket (HTTP kabi)
- \`wss://\` — shifrlangan WebSocket (HTTPS kabi, TLS/SSL)
- **Production da doimo \`wss://\` ishlating!** Aks holda man-in-the-middle hujum xavfi bor.

WebSocket ulanishi **HTTP Upgrade** orqali boshlanadi:
1. Client HTTP so'rov yuboradi: \`Upgrade: websocket\`
2. Server \`101 Switching Protocols\` javob beradi
3. Shundan keyin ikki tomonlama kanal ochiq bo'ladi

## WebSocket Lifecycle

\`\`\`
[CONNECTING] → [OPEN] → xabarlar almashish → [CLOSING] → [CLOSED]
    0             1                               2           3
\`\`\`

1. **CONNECTING (0)** — ulanish jarayonida
2. **OPEN (1)** — ulanish tayyor, xabar yuborish/olish mumkin
3. **CLOSING (2)** — yopilish jarayonida
4. **CLOSED (3)** — ulanish to'liq yopilgan

## WebSocket API

### Yaratish

\`\`\`js
const ws = new WebSocket('wss://example.com/socket');
\`\`\`

### Event handlerlar

- \`ws.onopen\` — ulanish ochildi
- \`ws.onmessage\` — xabar keldi (event.data da ma'lumot)
- \`ws.onclose\` — ulanish yopildi (event.code, event.reason)
- \`ws.onerror\` — xatolik yuz berdi

### Metodlar

- \`ws.send(data)\` — xabar yuborish (string, Blob, ArrayBuffer, ArrayBufferView)
- \`ws.close(code?, reason?)\` — ulanishni yopish

### Xususiyatlar

- \`ws.readyState\` — hozirgi holat (0, 1, 2, 3)
- \`ws.bufferedAmount\` — hali yuborilmagan ma'lumotlar hajmi (baytlarda)
- \`ws.protocol\` — server tanlagan sub-protokol
- \`ws.url\` — ulanish URL si

## readyState konstantalar

\`\`\`js
WebSocket.CONNECTING === 0  // Ulanish jarayonida
WebSocket.OPEN       === 1  // Ulanish tayyor
WebSocket.CLOSING    === 2  // Yopilish jarayonida
WebSocket.CLOSED     === 3  // Ulanish yopilgan
\`\`\`

Tekshirish:
\`\`\`js
if (ws.readyState === WebSocket.OPEN) {
  ws.send('Xabar');
}
\`\`\`

## Binary data

WebSocket nafaqat matn, balki **binary ma'lumotlar** ham yuborishi mumkin:

\`\`\`js
// Blob yuborish (fayl)
ws.binaryType = 'blob'; // default
ws.send(new Blob(['binary data']));

// ArrayBuffer yuborish (raw bytes)
ws.binaryType = 'arraybuffer';
const buffer = new ArrayBuffer(8);
ws.send(buffer);
\`\`\`

\`binaryType\` xususiyati qabul qilingan binary ma'lumot turini belgilaydi: \`'blob'\` (default) yoki \`'arraybuffer'\`.

## Heartbeat / Ping-Pong

Ulanish "tirik" ekanligini tekshirish uchun **ping-pong** mexanizmi ishlatiladi:

- **Protokol darajasida:** Server ping frame yuboradi, brauzer avtomatik pong javob beradi (JS da boshqarib bo'lmaydi)
- **Ilova darajasida:** O'zimiz ping/pong xabarlarni yuboramiz

\`\`\`js
// Client tomondan heartbeat
setInterval(() => {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: 'ping' }));
  }
}, 30000); // Har 30 soniyada
\`\`\`

Agar pong javob kelmasa — ulanish uzilgan deb hisoblanadi va reconnect qilish kerak.

## Reconnection strategiya

Ulanish turli sabablarga ko'ra uzilishi mumkin: tarmoq muammosi, server restart, timeout. **Avtomatik reconnect** muhim:

1. **Eksponensial backoff** — har safar kutish vaqtini oshirish (1s → 2s → 4s → 8s → max)
2. **Jitter** — barcha clientlar bir vaqtda reconnect qilmasligi uchun tasodifiy kechikish
3. **Maksimal urinishlar** — cheksiz reconnect qilmaslik uchun limit

## Server-Sent Events (SSE) vs WebSocket vs Long Polling

| Xususiyat | Long Polling | SSE | WebSocket |
|---|---|---|---|
| Yo'nalish | Client → Server (har safar) | Server → Client | Ikki tomonlama |
| Protokol | HTTP | HTTP | ws:// / wss:// |
| Avtomatik reconnect | Yo'q (qo'lda) | Ha (ichki) | Yo'q (qo'lda) |
| Binary data | Ha | Yo'q (faqat matn) | Ha |
| HTTP/2 multiplexing | Yo'q | Ha | Yo'q |
| Murakkablik | Past | Past | O'rta |
| Foydalanish | Legacy, oddiy yangilanishlar | Yangiliklar, live feed | Chat, o'yinlar, trading |

**Qachon nimani tanlash:**
- **Long Polling** — WebSocket/SSE qo'llab-quvvatlanmasa, yoki juda oddiy holatlarda
- **SSE** — faqat server → client ma'lumot kerak bo'lsa (notifikatsiyalar, news feed)
- **WebSocket** — ikki tomonlama real-time aloqa kerak bo'lsa (chat, multiplayer)

## Socket.IO

**Socket.IO** — WebSocket ustiga qurilgan mashhur kutubxona:

- Avtomatik reconnect
- Agar WebSocket ishlamasa — long polling ga fallback
- Xonalar (rooms) va namespace lar
- Acknowledgement (xabar yetib borganini tasdiqlash)
- Binary data qo'llab-quvvatlash

\`\`\`js
// Socket.IO client
import { io } from 'socket.io-client';

const socket = io('https://example.com');
socket.on('connect', () => console.log('Ulandi'));
socket.on('message', (data) => console.log(data));
socket.emit('chat', { text: 'Salom!' });
\`\`\`

**Eslatma:** Socket.IO **standart WebSocket emas** — u o'z protokolini ishlatadi. Oddiy WebSocket server bilan Socket.IO client ishlamaydi.

## Real-world foydalanish holatlari

1. **Chat ilovalari** — WhatsApp, Telegram web
2. **Live notifikatsiyalar** — Facebook, Twitter yangilanishlar
3. **Moliyaviy ma'lumotlar** — aksiya narxlari, kriptovalyuta trading
4. **Multiplayer o'yinlar** — real-time o'yinchi holatini sinxronlash
5. **Collaborative editing** — Google Docs, Figma
6. **IoT dashboardlar** — sensor ma'lumotlarni real-time ko'rsatish
7. **Live sport natijalari** — balllar, statistika
  `.trim(),
  codeExamples: [
    {
      title: 'Asosiy WebSocket connection',
      language: 'js',
      description: 'open, message, close, error eventlarni boshqarish',
      code: `// WebSocket ulanish yaratish
const ws = new WebSocket('wss://echo.websocket.org');

// Ulanish ochildi
ws.onopen = (event) => {
  console.log('Ulanish ochildi!');
  console.log('Protocol:', ws.protocol);
  console.log('ReadyState:', ws.readyState); // 1 (OPEN)

  // Matnli xabar yuborish
  ws.send('Salom, server!');

  // JSON xabar yuborish
  ws.send(JSON.stringify({
    type: 'greeting',
    text: 'Salom!',
    timestamp: Date.now(),
  }));
};

// Xabar keldi
ws.onmessage = (event) => {
  console.log('Kelgan xabar:', event.data);

  // Agar JSON bo'lsa — parse qilish
  try {
    const data = JSON.parse(event.data);
    console.log('Tur:', data.type);
    console.log('Matn:', data.text);
  } catch {
    // Oddiy matn
    console.log('Matn xabar:', event.data);
  }
};

// Ulanish yopildi
ws.onclose = (event) => {
  if (event.wasClean) {
    console.log(\`Toza yopildi: code=\${event.code}, reason=\${event.reason}\`);
  } else {
    // Masalan, server jarayoni to'xtadi yoki tarmoq uzildi
    console.log('Ulanish uzildi (kutilmagan)');
  }
};

// Xatolik
ws.onerror = (error) => {
  console.error('WebSocket xatosi:', error);
  // onerror dan keyin odatda onclose ham chaqiladi
};

// Xabar yuborishdan oldin readyState ni tekshirish
function safeSend(message) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(message);
  } else {
    console.warn('WebSocket ochiq emas. ReadyState:', ws.readyState);
  }
}

// Ulanishni yopish
// ws.close(1000, 'Normal yopilish');

// Binary ma'lumot qabul qilish
ws.binaryType = 'arraybuffer'; // yoki 'blob'
// Endi onmessage da event.data ArrayBuffer bo'ladi`,
    },
    {
      title: 'Reconnection logic + heartbeat ping/pong',
      language: 'js',
      description: 'Eksponensial backoff bilan avtomatik qayta ulanish va heartbeat',
      code: `class ReconnectingWebSocket {
  constructor(url, options = {}) {
    this.url = url;
    this.maxRetries = options.maxRetries || 10;
    this.baseDelay = options.baseDelay || 1000;  // 1 soniya
    this.maxDelay = options.maxDelay || 30000;    // 30 soniya
    this.pingInterval = options.pingInterval || 30000; // 30s
    this.pongTimeout = options.pongTimeout || 5000;    // 5s

    this.retryCount = 0;
    this.ws = null;
    this.pingTimer = null;
    this.pongTimer = null;
    this.isManuallyClosed = false;

    // Tashqi handlerlar
    this.onMessage = options.onMessage || (() => {});
    this.onConnect = options.onConnect || (() => {});
    this.onDisconnect = options.onDisconnect || (() => {});

    this.connect();
  }

  connect() {
    console.log(\`Ulanish... (urinish: \${this.retryCount + 1})\`);
    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      console.log('Ulandi!');
      this.retryCount = 0; // Muvaffaqiyatli — hisoblagichni nollash
      this.startHeartbeat();
      this.onConnect();
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      // Pong javobni tekshirish
      if (data.type === 'pong') {
        this.handlePong();
        return;
      }

      this.onMessage(data);
    };

    this.ws.onclose = (event) => {
      this.stopHeartbeat();
      this.onDisconnect(event);

      if (!this.isManuallyClosed) {
        this.reconnect();
      }
    };

    this.ws.onerror = () => {
      // onerror dan keyin onclose chaqiladi
      // Shuning uchun bu yerda reconnect qilmaymiz
    };
  }

  reconnect() {
    if (this.retryCount >= this.maxRetries) {
      console.error(\`Maksimal urinishlar tugadi (\${this.maxRetries})\`);
      return;
    }

    // Eksponensial backoff + jitter
    const delay = Math.min(
      this.baseDelay * Math.pow(2, this.retryCount),
      this.maxDelay
    );
    const jitter = delay * 0.2 * Math.random(); // 0-20% jitter
    const finalDelay = delay + jitter;

    console.log(\`Qayta ulanish \${(finalDelay / 1000).toFixed(1)}s dan keyin...\`);

    setTimeout(() => {
      this.retryCount++;
      this.connect();
    }, finalDelay);
  }

  // Heartbeat — ulanish tirikligini tekshirish
  startHeartbeat() {
    this.pingTimer = setInterval(() => {
      if (this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'ping' }));

        // Pong kutish — 5 soniya ichida kelmasa — uzilgan
        this.pongTimer = setTimeout(() => {
          console.warn('Pong javob kelmadi — ulanishni yopish');
          this.ws.close();
        }, this.pongTimeout);
      }
    }, this.pingInterval);
  }

  handlePong() {
    clearTimeout(this.pongTimer);
  }

  stopHeartbeat() {
    clearInterval(this.pingTimer);
    clearTimeout(this.pongTimer);
  }

  send(data) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    } else {
      console.warn('WebSocket ochiq emas');
    }
  }

  close() {
    this.isManuallyClosed = true;
    this.stopHeartbeat();
    this.ws?.close(1000, 'Normal yopilish');
  }
}

// Foydalanish
const ws = new ReconnectingWebSocket('wss://api.example.com/ws', {
  maxRetries: 5,
  onMessage: (data) => console.log('Xabar:', data),
  onConnect: () => console.log('Tayyor!'),
  onDisconnect: () => console.log('Uzildi'),
});

ws.send({ type: 'subscribe', channel: 'news' });`,
    },
    {
      title: 'Chat misoli + SSE vs WebSocket taqqoslash',
      language: 'js',
      description: 'Oddiy chat client va SSE bilan solishtirish',
      code: `// ═══════════════════════════════════════
// 1. WebSocket Chat Client
// ═══════════════════════════════════════

class ChatClient {
  constructor(serverUrl, username) {
    this.username = username;
    this.ws = new WebSocket(serverUrl);
    this.listeners = new Map();

    this.ws.onopen = () => {
      // Serverga "kirish" xabari
      this.send('join', { username: this.username });
      this.emit('connected');
    };

    this.ws.onmessage = (event) => {
      const { type, payload } = JSON.parse(event.data);
      this.emit(type, payload);
    };

    this.ws.onclose = () => this.emit('disconnected');
  }

  // Xabar yuborish
  sendMessage(text) {
    this.send('message', {
      text,
      username: this.username,
      timestamp: Date.now(),
    });
  }

  // Yozmoqda... bildirish
  sendTyping() {
    this.send('typing', { username: this.username });
  }

  send(type, payload) {
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, payload }));
    }
  }

  // Oddiy event emitter
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  emit(event, data) {
    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach(cb => cb(data));
  }

  disconnect() {
    this.send('leave', { username: this.username });
    this.ws.close();
  }
}

// Foydalanish
const chat = new ChatClient('wss://chat.example.com', 'Ali');

chat.on('connected', () => {
  console.log('Chatga ulandi!');
});

chat.on('message', (data) => {
  console.log(\`\${data.username}: \${data.text}\`);
});

chat.on('typing', (data) => {
  console.log(\`\${data.username} yozmoqda...\`);
});

chat.on('user-joined', (data) => {
  console.log(\`\${data.username} chatga qo'shildi\`);
});

chat.sendMessage('Hammaga salom!');


// ═══════════════════════════════════════
// 2. SSE (Server-Sent Events) — taqqoslash
// ═══════════════════════════════════════

// SSE — faqat server → client (bir tomonlama)
// Notifikatsiyalar, yangiliklar uchun yetarli

const eventSource = new EventSource('/api/notifications');

eventSource.onopen = () => {
  console.log('SSE ulanish ochildi');
};

// Umumiy xabar
eventSource.onmessage = (event) => {
  console.log('Xabar:', event.data);
};

// Maxsus event turi
eventSource.addEventListener('notification', (event) => {
  const data = JSON.parse(event.data);
  console.log('Notifikatsiya:', data.title);
});

eventSource.addEventListener('news', (event) => {
  const data = JSON.parse(event.data);
  console.log('Yangilik:', data.headline);
});

eventSource.onerror = () => {
  console.log('SSE xato — avtomatik reconnect qiladi');
  // SSE o'zi avtomatik reconnect qiladi!
};

// eventSource.close(); // To'xtatish


// ═══════════════════════════════════════
// 3. Qachon nimani tanlash — xulosa
// ═══════════════════════════════════════

// SSE ishlating — agar:
//   - Faqat serverdan client ga ma'lumot kerak
//   - Yangiliklar, notifikatsiyalar, live feed
//   - Avtomatik reconnect kerak (SSE ichida bor)
//   - HTTP/2 orqali multiplexing kerak

// WebSocket ishlating — agar:
//   - Ikki tomonlama aloqa kerak (chat, o'yinlar)
//   - Binary data yuborish kerak
//   - Minimal latency muhim (trading, gaming)
//   - Server ham client ham xabar boshlashi kerak`,
    },
  ],
  interviewQA: [
    {
      question: 'WebSocket nima va HTTP dan farqi?',
      answer: 'WebSocket — client va server o\'rtasida **doimiy, ikki tomonlama (full-duplex)** aloqa kanali. HTTP dan asosiy farqlari: 1) HTTP da faqat client so\'rov yuboradi, WebSocket da ikkala tomon ham yuborishi mumkin. 2) HTTP da har so\'rov uchun yangi ulanish (yoki keep-alive), WebSocket da bir marta ulanish va doimiy kanal. 3) HTTP da har so\'rovda headerlar yuboriladi (overhead katta), WebSocket da dastlabki handshake dan keyin minimal frame header. 4) WebSocket ws:// va wss:// protokollardan foydalanadi. Ulanish HTTP Upgrade orqali boshlanadi — client `Upgrade: websocket` headeri yuboradi, server `101 Switching Protocols` javob beradi.',
    },
    {
      question: 'WebSocket va SSE (Server-Sent Events) farqi?',
      answer: 'Asosiy farqlar: 1) **Yo\'nalish:** SSE faqat server → client (bir tomonlama), WebSocket ikki tomonlama. 2) **Protokol:** SSE oddiy HTTP ustida ishlaydi, WebSocket o\'z protokoli (ws://). 3) **Reconnect:** SSE avtomatik reconnect qiladi (ichki mexanizm), WebSocket da qo\'lda qilish kerak. 4) **Data turi:** SSE faqat matn (UTF-8), WebSocket matn va binary (Blob, ArrayBuffer). 5) **HTTP/2:** SSE HTTP/2 multiplexing dan foydalanadi, WebSocket foydalanmaydi. **Qachon SSE:** notifikatsiyalar, news feed, faqat serverdan keluvchi yangilanishlar. **Qachon WebSocket:** chat, o\'yinlar, trading — ikki tomonlama aloqa kerak bo\'lganda.',
    },
    {
      question: 'WebSocket connection uzilsa nima qilish kerak?',
      answer: 'WebSocket ulanishi tarmoq muammosi, server restart yoki timeout tufayli uzilishi mumkin. Yechim — **avtomatik reconnection strategiyasi:** 1) **Eksponensial backoff** — har safar kutish vaqtini ikki baravar oshirish (1s → 2s → 4s → 8s). 2) **Jitter** — barcha clientlar bir vaqtda reconnect qilmasligi uchun tasodifiy kechikish qo\'shish. 3) **Maksimal urinishlar** — cheksiz urinishlar o\'rniga limit qo\'yish. 4) **Heartbeat/ping-pong** — ulanish tirikligini muntazam tekshirish. Agar pong javob kelmasa — ulanish uzilgan deb hisoblash. 5) **Foydalanuvchiga xabar berish** — "Ulanish uzildi, qayta ulanmoqda..." ko\'rsatish.',
    },
    {
      question: 'WebSocket qachon ishlatiladi? Qachon REST yetarli?',
      answer: '**WebSocket kerak:** 1) Real-time chat — xabarlar darhol yetishi kerak. 2) Live trading — narxlar millisekundlarda o\'zgaradi. 3) Multiplayer o\'yinlar — o\'yinchi holati real-time sinxronlanadi. 4) Collaborative editing — Google Docs kabi bir vaqtda tahrirlash. 5) IoT dashboardlar — sensor ma\'lumotlari oqimi. **REST yetarli:** 1) CRUD operatsiyalar — foydalanuvchi profili yangilash. 2) Kamdan-kam so\'rovlar — soatiga bir marta ma\'lumot olish. 3) Fayl yuklash — oddiy HTTP yetarli. 4) SEO-muhim sahifalar — statik kontent. **Umumiy qoida:** Agar server client ga tez-tez ma\'lumot "push" qilishi kerak bo\'lsa — WebSocket. Agar client kerak paytda so\'rov yuborsa — REST yetarli.',
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
      topicId: 'web-workers',
      label: 'Web Workers',
    },
    {
      techId: 'javascript',
      sectionId: 'dom-browser',
      topicId: 'events',
      label: 'Events',
    },
  ],
}
