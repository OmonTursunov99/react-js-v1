import type { Topic } from '../../../types'

export const modulePattern: Topic = {
  id: 'module-pattern',
  title: 'Module Pattern',
  importance: 2,
  status: 'to-learn',
  description: 'Module pattern, IIFE modules, revealing module pattern',
  content: `
# Module Pattern

## Nima uchun modullar kerak?

JavaScript da dastlab modul tizimi yo'q edi. Global scope "ifloslangan" — turli fayllar bir-birining o'zgaruvchilarini qayta yozishi mumkin edi. Module pattern bu muammoni **closure** yordamida hal qiladi.

## IIFE (Immediately Invoked Function Expression)

IIFE — bu o'zini o'zi chaqiruvchi funksiya. U **private scope** yaratadi:

\`\`\`js
(function() {
  // Bu yerda hamma narsa private
  var secret = 'maxfiy';
})();
// secret — tashqarida mavjud emas
\`\`\`

## Classic Module Pattern

IIFE ichida private o'zgaruvchilar va funksiyalar, tashqariga faqat kerakli API qaytariladi:

\`\`\`js
const module = (function() {
  // private
  let count = 0;

  // public API
  return {
    increment() { count++; },
    getCount() { return count; }
  };
})();
\`\`\`

## Revealing Module Pattern

Barcha funksiyalar private, faqat oxirida qaysilarini "ochish" kerakligini belgilaysiz. Kodni o'qish osonroq bo'ladi.

## ES Modules (ESM) — zamonaviy yondashuv

ES2015 dan boshlab JavaScript da rasmiy modul tizimi bor:
- \`export\` / \`export default\` — eksport
- \`import\` — import
- Har bir fayl o'z scope-iga ega (avtomatik encapsulation)
- **Static** — import/export faqat top-level da
- Tree-shaking imkoniyati (foydalanilmagan kodni o'chirish)

## CommonJS (CJS) vs ESM

| Xususiyat | CommonJS | ES Modules |
|-----------|----------|------------|
| Sintaksis | \`require()\` / \`module.exports\` | \`import\` / \`export\` |
| Yuklash | **Sinxron** | **Asinxron** |
| Environment | Node.js | Brauzer + Node.js |
| Static analiz | Yo'q | Bor (tree-shaking) |
| Top-level await | Yo'q | Bor |

## Namespace Pattern

Bitta global obyekt ichiga barcha funksionallikni joylashtirish — module pattern ning sodda versiyasi:

\`\`\`js
const MyApp = MyApp || {};
MyApp.utils = { ... };
MyApp.models = { ... };
\`\`\`

## Amaliy maslahatlar

1. Zamonaviy loyihalarda **ES Modules** ishlating
2. IIFE module pattern — legacy kod va kutubxona yaratishda hali ishlatiladi
3. **Barrel exports** — papka ichidagi barcha modullarni bitta index.js orqali eksport qilish
  `.trim(),
  codeExamples: [
    {
      title: 'Classic Module Pattern va IIFE',
      language: 'js',
      description: 'Closure orqali private state yaratish',
      code: `// Classic Module Pattern
const Counter = (function() {
  // Private state — tashqaridan ko'rib bo'lmaydi
  let count = 0;
  const MAX = 100;

  // Private funksiya
  function validate(value) {
    return value >= 0 && value <= MAX;
  }

  // Public API
  return {
    increment() {
      if (validate(count + 1)) {
        count++;
      }
      return this;
    },
    decrement() {
      if (validate(count - 1)) {
        count--;
      }
      return this;
    },
    getCount() {
      return count;
    },
    reset() {
      count = 0;
      return this;
    },
  };
})();

Counter.increment().increment().increment();
console.log(Counter.getCount()); // 3
console.log(Counter.count);     // undefined — private!

// Parametrli modul
const Logger = (function(prefix) {
  const logs = [];

  return {
    log(message) {
      const entry = \`[\${prefix}] \${new Date().toISOString()}: \${message}\`;
      logs.push(entry);
      console.log(entry);
    },
    getLogs() {
      return [...logs]; // nusxa qaytarish
    },
    clear() {
      logs.length = 0;
    },
  };
})('APP');

Logger.log('Ilova ishga tushdi');`,
    },
    {
      title: 'Revealing Module Pattern',
      language: 'js',
      description: 'Barcha funksiyalar private, keraklilari ochiladi',
      code: `// Revealing Module Pattern
const UserService = (function() {
  // Barcha funksiya va o'zgaruvchilar private
  const users = [];

  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2);
  }

  function findIndex(id) {
    return users.findIndex(u => u.id === id);
  }

  function addUser(name, email) {
    const user = { id: generateId(), name, email, createdAt: new Date() };
    users.push(user);
    return { ...user }; // nusxa qaytarish
  }

  function removeUser(id) {
    const index = findIndex(id);
    if (index === -1) return false;
    users.splice(index, 1);
    return true;
  }

  function getUsers() {
    return users.map(u => ({ ...u })); // nusxalar qaytarish
  }

  function getUserById(id) {
    const user = users.find(u => u.id === id);
    return user ? { ...user } : null;
  }

  // Faqat kerakli funksiyalarni "ochish"
  return {
    add: addUser,
    remove: removeUser,
    getAll: getUsers,
    getById: getUserById,
  };

  // generateId va findIndex — tashqaridan foydalanib bo'lmaydi
})();

const user = UserService.add('Ali', 'ali@mail.com');
console.log(UserService.getAll());
console.log(UserService.generateId); // undefined — private`,
    },
    {
      title: 'ES Modules — zamonaviy yondashuv',
      language: 'js',
      description: 'import/export bilan modullar',
      code: `// === math.js (named exports) ===
export const PI = 3.14159;

export function add(a, b) {
  return a + b;
}

export function multiply(a, b) {
  return a * b;
}

// === logger.js (default export) ===
class Logger {
  #prefix; // private field

  constructor(prefix) {
    this.#prefix = prefix;
  }

  log(msg) {
    console.log(\`[\${this.#prefix}] \${msg}\`);
  }
}

export default Logger;

// === utils/index.js (barrel export) ===
export { add, multiply, PI } from './math.js';
export { default as Logger } from './logger.js';
export { formatDate } from './date.js';

// === app.js (import) ===
// Named import
import { add, PI } from './math.js';

// Default import
import Logger from './logger.js';

// Barrel import — bitta joydan hammasi
import { add, Logger, formatDate } from './utils/index.js';

// Namespace import
import * as MathUtils from './math.js';
console.log(MathUtils.add(1, 2));

// Dynamic import (lazy loading)
async function loadChart() {
  const { Chart } = await import('./chart.js');
  return new Chart('#canvas');
}

// Re-export with rename
export { add as sum } from './math.js';`,
    },
  ],
  interviewQA: [
    {
      question: 'Module pattern nima va qanday muammoni hal qiladi?',
      answer: 'Module pattern — IIFE va closure yordamida **private scope** yaratish usuli. U global scope ifloslanishini oldini oladi, encapsulation ta\'minlaydi (private o\'zgaruvchilar), va aniq public API beradi. ES Modules paydo bo\'lishidan oldin bu yagona modul tizimi edi.',
    },
    {
      question: 'Revealing Module Pattern oddiy Module Pattern dan nimasi bilan farq qiladi?',
      answer: 'Oddiy Module Pattern da ba\'zi funksiyalar return obyekti ichida aniqlanadi. Revealing Module Pattern da **barcha** funksiya va o\'zgaruvchilar private scope da aniqlanadi, oxirida faqat keraklilarning **reference** lari return qilinadi. Bu kodni toza va o\'qishli qiladi — barcha logika bir joyda, API alohida ko\'rinadi.',
    },
    {
      question: 'CommonJS va ES Modules farqi nimada?',
      answer: 'CommonJS (`require`/`module.exports`): sinxron, runtime da yuklanadi, Node.js uchun. ES Modules (`import`/`export`): asinxron, static (compile-time analiz), tree-shaking mumkin, top-level await bor, brauzer va Node.js da ishlaydi. ESM static bo\'lgani uchun bundler lar foydalanilmagan kodni olib tashlay oladi.',
    },
    {
      question: 'Dynamic import qachon ishlatiladi?',
      answer: '`import()` — runtime da modulni asinxron yuklash. Ishlatilishi: 1) **Code splitting** — katta bundledan faqat kerakli qismini yuklash. 2) **Lazy loading** — sahifa/komponent kerak bo\'lganda yuklash. 3) **Conditional import** — shart bo\'yicha turli modul yuklash. 4) **Route-based splitting** — har bir sahifa uchun alohida chunk.',
    },
  ],
  relatedTopics: [
    {
      techId: 'javascript',
      sectionId: 'design-patterns',
      topicId: 'singleton',
      label: 'Singleton Pattern',
    },
    {
      techId: 'javascript',
      sectionId: 'design-patterns',
      topicId: 'factory-pattern',
      label: 'Factory Pattern',
    },
  ],
}
