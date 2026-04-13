import type { Topic } from '../../../types'

export const singleton: Topic = {
  id: 'singleton',
  title: 'Singleton Pattern',
  importance: 2,
  status: 'to-learn',
  description: 'Singleton in JS, class-based, closure-based',
  content: `
# Singleton Pattern

## Singleton nima?

Singleton — bu **faqat bitta instance** (nusxa) bo'lishini kafolatlovchi pattern. Qanchalik ko'p marta yaratishga urinmasangiz, har doim **bir xil obyekt** qaytadi.

## Qachon ishlatiladi?

- **Global state** boshqarish (masalan, konfiguratsiya)
- **Database connection** — bitta ulanish
- **Logger** — bitta logging instance
- **Cache** — bitta umumiy kesh
- **Event bus** — global event tizimi

## JavaScript da Singleton

JS da singleton yaratish oson, chunki:
1. **Oddiy obyekt** — allaqachon singleton (\`const config = { ... }\`)
2. **ES Module** — har safar import qilganda **bir xil** obyekt qaytadi
3. **Closure** — IIFE ichida instance saqlash
4. **Class** — static metod orqali

## ES Module singleton

Bu eng sodda va zamonaviy usul. ES Module spetsifikatsiyasi bo'yicha modul faqat **bir marta** bajariladi va natija **keshlanadi**:

\`\`\`js
// config.js
class Config { ... }
export const config = new Config(); // faqat bir marta yaratiladi
\`\`\`

## Class-based Singleton

\`getInstance()\` static metodi orqali:
- Birinchi chaqiruvda instance yaratiladi
- Keyingi chaqiruvlarda **bir xil** instance qaytadi

## Closure-based Singleton

IIFE ichida instance saqlanadi, tashqaridan \`new\` bilan yangi yaratib bo'lmaydi.

## Singleton muammolari

1. **Testing qiyinlashadi** — global state testlar orasida "oqib" ketishi mumkin
2. **Tight coupling** — ko'p joy singleton ga bog'lanadi
3. **Hidden dependencies** — singleton dan foydalanish aniq ko'rinmaydi
4. **Concurrency** — (boshqa tillarda) thread-safety muammolari

## Anti-pattern holati

Ko'p hollarda singleton o'rniga **dependency injection** ishlatish yaxshiroq. Lekin konfiguratsiya, logger, cache kabi hollarda singleton hali ham foydali.
  `.trim(),
  codeExamples: [
    {
      title: 'Class-based Singleton',
      language: 'js',
      description: 'Static metod orqali bitta instance kafolatlash',
      code: `// Class-based Singleton
class Database {
  static #instance = null;

  // Private constructor emulyatsiyasi
  constructor(connectionString) {
    if (Database.#instance) {
      throw new Error('Database allaqachon yaratilgan! getInstance() ishlating.');
    }
    this.connectionString = connectionString;
    this.connected = false;
    Database.#instance = this;
  }

  static getInstance(connectionString) {
    if (!Database.#instance) {
      Database.#instance = new Database(connectionString);
    }
    return Database.#instance;
  }

  connect() {
    if (!this.connected) {
      console.log(\`Ulanilmoqda: \${this.connectionString}\`);
      this.connected = true;
    }
    return this;
  }

  query(sql) {
    if (!this.connected) throw new Error('Avval connect qiling');
    console.log(\`Query: \${sql}\`);
    return [];
  }

  // Test uchun reset
  static _resetInstance() {
    Database.#instance = null;
  }
}

// Ishlatish
const db1 = Database.getInstance('mongodb://localhost/app');
const db2 = Database.getInstance('postgresql://other'); // ignored

console.log(db1 === db2); // true — bir xil instance!
console.log(db2.connectionString); // 'mongodb://localhost/app'`,
    },
    {
      title: 'Closure-based Singleton va ES Module Singleton',
      language: 'js',
      description: 'IIFE closure va modul orqali singleton',
      code: `// === Closure-based Singleton ===
const Logger = (function() {
  let instance = null;

  class LoggerClass {
    constructor() {
      this.logs = [];
    }

    log(level, message) {
      const entry = {
        level,
        message,
        timestamp: new Date().toISOString(),
      };
      this.logs.push(entry);
      console.log(\`[\${level.toUpperCase()}] \${entry.timestamp}: \${message}\`);
    }

    info(msg) { this.log('info', msg); }
    warn(msg) { this.log('warn', msg); }
    error(msg) { this.log('error', msg); }

    getLogs() { return [...this.logs]; }
    clear() { this.logs.length = 0; }
  }

  return {
    getInstance() {
      if (!instance) {
        instance = new LoggerClass();
      }
      return instance;
    },
  };
})();

const logger1 = Logger.getInstance();
const logger2 = Logger.getInstance();
console.log(logger1 === logger2); // true

logger1.info('Ilova ishga tushdi');
console.log(logger2.getLogs().length); // 1

// === ES Module Singleton (eng sodda!) ===
// config.js
class AppConfig {
  #settings = {};

  set(key, value) {
    this.#settings[key] = value;
  }

  get(key) {
    return this.#settings[key];
  }

  getAll() {
    return { ...this.#settings };
  }
}

// Modul faqat bir marta bajariladi — avtomatik singleton
export const config = new AppConfig();

// Boshqa faylda:
// import { config } from './config.js';
// config.set('theme', 'dark');
// Qayerda import qilsangiz — BIR XIL obyekt`,
    },
    {
      title: 'Singleton — amaliy misollar',
      language: 'js',
      description: 'EventBus va Cache singleton',
      code: `// EventBus Singleton — global event tizimi
class EventBus {
  static #instance = null;
  #events = new Map();

  static getInstance() {
    if (!EventBus.#instance) {
      EventBus.#instance = new EventBus();
    }
    return EventBus.#instance;
  }

  on(event, callback) {
    if (!this.#events.has(event)) {
      this.#events.set(event, new Set());
    }
    this.#events.get(event).add(callback);
    return () => this.off(event, callback); // unsubscribe funksiyasi
  }

  off(event, callback) {
    this.#events.get(event)?.delete(callback);
  }

  emit(event, data) {
    this.#events.get(event)?.forEach(cb => cb(data));
  }
}

const bus = EventBus.getInstance();
const unsub = bus.on('user:login', (user) => {
  console.log('Kirdi:', user.name);
});
bus.emit('user:login', { name: 'Ali' });
unsub(); // obunani bekor qilish

// Cache Singleton — oddiy TTL kesh
class Cache {
  static #instance = null;
  #store = new Map();

  static getInstance() {
    if (!Cache.#instance) {
      Cache.#instance = new Cache();
    }
    return Cache.#instance;
  }

  set(key, value, ttl = 60000) {
    this.#store.set(key, {
      value,
      expires: Date.now() + ttl,
    });
  }

  get(key) {
    const item = this.#store.get(key);
    if (!item) return undefined;
    if (Date.now() > item.expires) {
      this.#store.delete(key);
      return undefined;
    }
    return item.value;
  }

  clear() {
    this.#store.clear();
  }
}

const cache = Cache.getInstance();
cache.set('user:1', { name: 'Ali' }, 5000); // 5 soniya
console.log(cache.get('user:1')); // { name: 'Ali' }`,
    },
  ],
  interviewQA: [
    {
      question: 'Singleton pattern nima?',
      answer: 'Singleton — faqat **bitta instance** bo\'lishini kafolatlovchi pattern. Qanchalik ko\'p marta yaratishga urinmang, har doim bir xil obyekt qaytadi. JS da eng sodda usul — ES Module (`export const instance = new Class()`) chunki modul faqat bir marta bajariladi va natija keshlanadi.',
    },
    {
      question: 'JavaScript da singleton yaratishning qanday usullari bor?',
      answer: 'To\'rtta asosiy usul: 1) **Oddiy obyekt literal** — `const config = { ... }` allaqachon singleton. 2) **ES Module** — `export const x = new X()` modul bir marta bajariladi. 3) **Class static** — `getInstance()` metodi bilan. 4) **Closure/IIFE** — private scope da instance saqlash. Zamonaviy loyihalarda ES Module eng sodda va to\'g\'ri usul.',
    },
    {
      question: 'Singleton pattern ning muammolari nimada?',
      answer: 'Asosiy muammolar: 1) **Testing qiyin** — global state testlar orasida o\'zgaradi, izolatsiya yo\'q. 2) **Tight coupling** — ko\'p modul singleton ga bog\'lanadi. 3) **Hidden dependencies** — funksiya singleton ni ichki ishlatsa, tashqaridan ko\'rinmaydi. Ko\'p hollarda **dependency injection** yaxshiroq alternativa. Lekin config, logger, cache uchun singleton hali ham foydali.',
    },
  ],
  relatedTopics: [
    {
      techId: 'javascript',
      sectionId: 'design-patterns',
      topicId: 'module-pattern',
      label: 'Module Pattern',
    },
    {
      techId: 'javascript',
      sectionId: 'design-patterns',
      topicId: 'observer-pattern',
      label: 'Observer Pattern',
    },
  ],
}
