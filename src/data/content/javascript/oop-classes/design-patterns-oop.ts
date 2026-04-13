import type { Topic } from '../../../types'

export const designPatternsOopTopic: Topic = {
  id: 'design-patterns-oop',
  title: 'Design Patterns (OOP)',
  importance: 2,
  status: 'to-learn',
  description: 'Singleton, Factory, Observer, Strategy — JavaScript-da OOP design pattern-lar',

  content: `
# Design Patterns — JavaScript-da OOP pattern-lar

## Design Pattern nima?
Design pattern — takrorlanuvchi muammolarga **tayyor yechim**. Bu kod emas, balki **shablon** — uni vaziyatga moslashtirib ishlatish kerak. Gang of Four (GoF) tomonidan 23 ta pattern tasniflangan.

## Pattern turlari
1. **Creational** — ob'ekt yaratish: Singleton, Factory, Builder, Prototype
2. **Structural** — ob'ektlar tuzilmasi: Adapter, Decorator, Facade, Proxy
3. **Behavioral** — ob'ektlar o'zaro aloqasi: Observer, Strategy, Command, Iterator

## Singleton
Faqat **bitta** instantsiya bo'lishini kafolatlaydi va unga global kirish nuqtasi beradi. JavaScript-da module system tufayli singleton tabiiy ravishda ishlaydi — har bir modul faqat bir marta baholanadi.

## Factory
Ob'ekt yaratish logikasini **markazlashtiradi**. Client qaysi aniq class yaratilishini bilmasligi kerak. Shartga qarab turli xil ob'ektlar qaytaradi.

## Observer (Event Emitter)
Bir ob'ekt (subject) holatini kuzatuvchi boshqa ob'ektlarga (observers) avtomatik xabar beradi. JavaScript-da bu DOM events, EventEmitter, RxJS, Zustand subscribe — hammasi Observer pattern.

## Strategy
Algoritmni almashtirish mumkin bo'lgan ob'ektga o'raydi. Runtime-da turli algoritmlarni almashtirish imkonini beradi. JavaScript-da funksiyalar first-class, shuning uchun strategy — oddiy callback.

## JavaScript-da pattern-larning xususiyatlari
JS — multi-paradigm til. Ko'p pattern-lar funksional usulda ham amalga oshiriladi:
- Strategy → higher-order function
- Observer → callback/Promise
- Factory → oddiy funksiya
- Singleton → module scope

## Anti-patterns
- **God Object** — bitta ob'ekt hamma narsani biladi
- **Spaghetti Code** — tartibsiz bog'liqliklar
- **Golden Hammer** — har joyda bitta pattern ishlatish
  `.trim(),

  codeExamples: [
    {
      title: 'Singleton Pattern',
      language: 'js',
      description: 'Faqat bitta instantsiya yaratish — class va module usullari',
      code: `// Usul 1: Class bilan Singleton
class Database {
  static #instance = null;

  constructor(config) {
    if (Database.#instance) {
      return Database.#instance;
    }
    this.config = config;
    this.connections = 0;
    Database.#instance = this;
  }

  connect() {
    this.connections++;
    console.log(\`Ulandi. Jami: \${this.connections}\`);
  }

  static getInstance(config) {
    if (!Database.#instance) {
      new Database(config);
    }
    return Database.#instance;
  }
}

const db1 = Database.getInstance({ host: 'localhost' });
const db2 = Database.getInstance({ host: 'remote' });
console.log(db1 === db2); // true — bitta instantsiya
db1.connect(); // "Ulandi. Jami: 1"
db2.connect(); // "Ulandi. Jami: 2"

// Usul 2: Module bilan Singleton (tabiiy)
// config.js
// const config = { apiUrl: '...', debug: false };
// export default config;
// Har joyda import qilganda BIR XİL ob'ekt keladi`
    },
    {
      title: 'Factory Pattern',
      language: 'js',
      description: 'Ob\'ekt yaratish logikasini markazlashtirish',
      code: `// Turli xil notification class-lar
class EmailNotification {
  send(message) {
    return \`Email yuborildi: \${message}\`;
  }
}

class SMSNotification {
  send(message) {
    return \`SMS yuborildi: \${message}\`;
  }
}

class PushNotification {
  send(message) {
    return \`Push yuborildi: \${message}\`;
  }
}

class TelegramNotification {
  send(message) {
    return \`Telegram yuborildi: \${message}\`;
  }
}

// Factory — turga qarab to'g'ri class yaratadi
class NotificationFactory {
  static #types = new Map([
    ['email', EmailNotification],
    ['sms', SMSNotification],
    ['push', PushNotification],
    ['telegram', TelegramNotification],
  ]);

  static create(type) {
    const NotifClass = this.#types.get(type);
    if (!NotifClass) {
      throw new Error(\`Noma'lum notification turi: \${type}\`);
    }
    return new NotifClass();
  }

  // Yangi tur qo'shish oson (OCP)
  static register(type, NotifClass) {
    this.#types.set(type, NotifClass);
  }
}

// Ishlatish — client aniq class-ni bilmaydi
const notif = NotificationFactory.create('telegram');
console.log(notif.send('Salom!')); // "Telegram yuborildi: Salom!"

// Yangi tur qo'shish
class SlackNotification {
  send(message) { return \`Slack: \${message}\`; }
}
NotificationFactory.register('slack', SlackNotification);`
    },
    {
      title: 'Observer Pattern (EventEmitter)',
      language: 'js',
      description: 'Hodisalarga obuna bo\'lish va xabar berish',
      code: `class EventEmitter {
  #events = new Map();

  on(event, listener) {
    if (!this.#events.has(event)) {
      this.#events.set(event, []);
    }
    this.#events.get(event).push(listener);
    // Unsubscribe funksiya qaytarish
    return () => this.off(event, listener);
  }

  once(event, listener) {
    const wrapper = (...args) => {
      listener(...args);
      this.off(event, wrapper);
    };
    return this.on(event, wrapper);
  }

  off(event, listener) {
    const listeners = this.#events.get(event);
    if (listeners) {
      this.#events.set(event, listeners.filter(l => l !== listener));
    }
  }

  emit(event, ...args) {
    const listeners = this.#events.get(event) ?? [];
    listeners.forEach(listener => listener(...args));
  }
}

// Ishlatish
class Store extends EventEmitter {
  #state = {};

  setState(key, value) {
    const old = this.#state[key];
    this.#state[key] = value;
    this.emit('change', { key, old, new: value });
    this.emit(\`change:\${key}\`, value, old);
  }

  getState(key) {
    return this.#state[key];
  }
}

const store = new Store();

// Observer-lar
const unsub = store.on('change:count', (newVal, oldVal) => {
  console.log(\`count: \${oldVal} → \${newVal}\`);
});

store.setState('count', 0);   // count: undefined → 0
store.setState('count', 1);   // count: 0 → 1
unsub(); // obunani bekor qilish
store.setState('count', 2);   // hech narsa chiqmaydi`
    },
    {
      title: 'Strategy Pattern',
      language: 'js',
      description: 'Algoritmni runtime-da almashtirish',
      code: `// Turli tartiblash strategiyalari
const sortStrategies = {
  byName: (a, b) => a.name.localeCompare(b.name),
  byPrice: (a, b) => a.price - b.price,
  byPriceDesc: (a, b) => b.price - a.price,
  byRating: (a, b) => b.rating - a.rating,
};

class ProductList {
  #products = [];
  #sortStrategy = sortStrategies.byName;

  constructor(products) {
    this.#products = [...products];
  }

  setSortStrategy(strategy) {
    if (typeof strategy === 'string') {
      this.#sortStrategy = sortStrategies[strategy];
    } else {
      this.#sortStrategy = strategy;
    }
    return this;
  }

  sort() {
    return [...this.#products].sort(this.#sortStrategy);
  }

  display() {
    return this.sort().map(p =>
      \`\${p.name} — \${p.price} UZS (★\${p.rating})\`
    );
  }
}

const products = [
  { name: 'Telefon', price: 3_000_000, rating: 4.5 },
  { name: 'Noutbuk', price: 8_000_000, rating: 4.8 },
  { name: 'Quloqchin', price: 500_000, rating: 4.2 },
];

const list = new ProductList(products);

console.log(list.setSortStrategy('byPrice').display());
// ["Quloqchin — 500000 UZS", "Telefon — 3000000 UZS", "Noutbuk — 8000000 UZS"]

console.log(list.setSortStrategy('byRating').display());
// ["Noutbuk — 8000000 UZS (★4.8)", ...]

// Custom strategy
list.setSortStrategy((a, b) => a.name.length - b.name.length);`
    }
  ],

  interviewQA: [
    {
      question: 'Singleton pattern-ni JavaScript-da qanday yaratish mumkin va qachon ishlatiladi?',
      answer: 'Singleton-ning uchta usuli: 1) Class + static #instance — new qilganda mavjud instance qaytadi. 2) Module pattern — ES module o\'zi singleton, chunki bir marta baholanadi. 3) Closure — IIFE ichida instance saqlash. Ishlatilishi: Database connection pool, Configuration manager, Logger, Cache. Muammo: global state yaratadi, test qilish qiyinlashadi, tight coupling. Zamonaviy JS-da module pattern eng ko\'p ishlatiladi.'
    },
    {
      question: 'Observer pattern va JavaScript event system qanday bog\'langan?',
      answer: 'Observer pattern JS-ning asosida turadi: 1) DOM Events: addEventListener/removeEventListener. 2) Node.js EventEmitter. 3) Custom events. 4) RxJS Observables. 5) Zustand subscribe, Redux listener middleware. Har birida subject (event emitter) va observer (listener) bor. JS-da Observer juda tabiiy, chunki funksiyalar first-class — callback sifatida berish oson. Promise ham Observer-ning bir ko\'rinishi.'
    },
    {
      question: 'Factory pattern-ni qachon ishlatish kerak?',
      answer: 'Factory kerak bo\'lganda: 1) Ob\'ekt yaratish logikasi murakkab (config, shartlar). 2) Runtime-da turli ob\'ektlar kerak — turdagi noma\'lum (API response-ga qarab). 3) Ob\'ekt yaratishni markazlashtirish — bitta joyda o\'zgartirish yetarli. 4) Testing — factory-ni mock qilish oson. JS misollar: React.createElement (element factory), document.createElement (DOM factory), express() (server factory). Abstract Factory — bir nechta bog\'liq ob\'ektlar oilasini yaratish.'
    },
    {
      question: 'Strategy pattern-ni funksional usulda qanday yozish mumkin?',
      answer: 'JS-da funksiyalar first-class, shuning uchun Strategy — oddiy callback: const sort = (arr, strategy) => [...arr].sort(strategy). Array.sort(), Array.filter(), Array.map() — hammasi Strategy pattern. React-da: render props, custom comparator (React.memo(Comp, areEqual)), form validation strategy. Class kerak emas — funksiya yetarli. Lekin murakkab strategy-da class qulay (state, multiple methods).'
    },
    {
      question: 'JavaScript-da qaysi design pattern-lar eng ko\'p ishlatiladi?',
      answer: 'Eng ko\'p: 1) Module — ES modules (import/export). 2) Observer — events, state management. 3) Factory — React.createElement, document.createElement. 4) Singleton — module scope. 5) Strategy — callbacks, HOF. 6) Decorator — @decorator (TC39 Stage 3), HOC. 7) Proxy — ES6 Proxy, reactive systems (Vue, MobX). 8) Iterator — for...of, generators. 9) Facade — jQuery, axios. 10) Middleware — Express, Redux. Ko\'pchiligi JS-da funksional ko\'rinishda ishlatiladi.'
    }
  ],

  relatedTopics: [
    { techId: 'javascript', sectionId: 'oop-classes', topicId: 'classes', label: 'ES6 Classes' },
    { techId: 'javascript', sectionId: 'oop-classes', topicId: 'solid-principles', label: 'SOLID Printsiplari' },
    { techId: 'javascript', sectionId: 'advanced', topicId: 'proxy-reflect', label: 'Proxy & Reflect' }
  ]
}
