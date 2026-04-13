import type { Topic } from '../../../types'

export const decoratorPattern: Topic = {
  id: 'decorator-pattern',
  title: 'Decorator Pattern',
  importance: 2,
  status: 'to-learn',
  description: 'Decorator funksiyalar, method decorators',
  content: `
# Decorator Pattern

## Decorator nima?

Decorator — mavjud obyekt yoki funksiyaga **qo'shimcha funksionallik** beruvchi pattern, asl kodni o'zgartirmasdan. Funksiyani "o'rab" (wrap) oladi va yangi imkoniyat qo'shadi.

## Hayotiy o'xshatish

Kofe misolida: oddiy kofe + sut = sutli kofe, + shakar = shirin sutli kofe. Har bir qo'shimcha — decorator. Asosiy kofe o'zgarmaydi.

## JavaScript da Decorator

JS da decorator ikkita shaklda:
1. **Funksiya decorator** — funksiyani o'rab, yangi funksiya qaytaradi (higher-order function)
2. **TC39 Decorators** — \`@decorator\` sintaksisi (Stage 3, TypeScript 5+)

## Funksiya Decorator

\`\`\`js
function withLogging(fn) {
  return function(...args) {
    console.log(\`Chaqirildi: \${fn.name}\`);
    return fn.apply(this, args);
  };
}
\`\`\`

Bu **higher-order function** — funksiyani qabul qiladi va yangi funksiya qaytaradi.

## Qachon ishlatish?

1. **Logging** — funksiya chaqiruvlarini loglash
2. **Caching/Memoization** — natijani keshda saqlash
3. **Debounce/Throttle** — chaqiruvni cheklash
4. **Authentication** — ruxsatni tekshirish
5. **Retry** — xatoda qayta urinish
6. **Validation** — argumentlarni tekshirish
7. **Performance** — bajarilish vaqtini o'lchash

## Decorator chaining

Bir nechta decorator ni **ketma-ket** qo'llash mumkin:
\`\`\`js
const enhancedFn = withLogging(withRetry(withCache(originalFn)));
\`\`\`
Har bir decorator bitta mas'uliyat — **Single Responsibility Principle**.

## TC39 Decorators (Stage 3)

\`@decorator\` sintaksisi — class va method larga dekoratsiya:
\`\`\`ts
class API {
  @logged
  @cached(60)
  async getUser(id) { ... }
}
\`\`\`
TypeScript 5+ da \`experimentalDecorators\` yoki yangi Stage 3 decorators bilan ishlatiladi.

## Decorator vs Mixin vs Inheritance

| | Decorator | Mixin | Inheritance |
|--|-----------|-------|-------------|
| Vaqt | Runtime | Define-time | Define-time |
| Moslashuvchanlik | Eng yuqori | O'rtacha | Past |
| Almashtirib bo'ladi | Ha | Yo'q | Yo'q |
| Chaining | Oson | Qiyin | Yo'q |
  `.trim(),
  codeExamples: [
    {
      title: 'Funksiya Decorator-lar',
      language: 'js',
      description: 'Logging, timing, retry, memoize decorator-lar',
      code: `// Logging decorator
function withLogging(fn) {
  return function(...args) {
    console.log(\`➡️ \${fn.name}(\${args.map(a => JSON.stringify(a)).join(', ')})\`);
    const result = fn.apply(this, args);
    console.log(\`⬅️ \${fn.name} → \${JSON.stringify(result)}\`);
    return result;
  };
}

// Timing decorator — bajarilish vaqtini o'lchash
function withTiming(fn) {
  return function(...args) {
    const start = performance.now();
    const result = fn.apply(this, args);
    const duration = (performance.now() - start).toFixed(2);
    console.log(\`⏱️ \${fn.name}: \${duration}ms\`);
    return result;
  };
}

// Memoize decorator — natijani keshlash
function withMemoize(fn) {
  const cache = new Map();
  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      console.log(\`📦 Cache hit: \${fn.name}\`);
      return cache.get(key);
    }
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

// Retry decorator — xatoda qayta urinish
function withRetry(fn, maxRetries = 3, delay = 1000) {
  return async function(...args) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await fn.apply(this, args);
      } catch (error) {
        console.log(\`❌ Urinish \${attempt}/\${maxRetries} muvaffaqiyatsiz\`);
        if (attempt === maxRetries) throw error;
        await new Promise(r => setTimeout(r, delay * attempt));
      }
    }
  };
}

// Ishlatish
function add(a, b) { return a + b; }
function fibonacci(n) { return n <= 1 ? n : fibonacci(n - 1) + fibonacci(n - 2); }

const loggedAdd = withLogging(add);
loggedAdd(2, 3); // ➡️ add(2, 3) → ⬅️ add → 5

const fastFib = withMemoize(withTiming(fibonacci));
fastFib(35); // Birinchi marta — sekin
fastFib(35); // Ikkinchi marta — Cache hit!`,
    },
    {
      title: 'Debounce va Throttle — amaliy decorator-lar',
      language: 'js',
      description: 'UI event larni optimallashtiruvchi decorator-lar',
      code: `// Debounce — oxirgi chaqiruvdan keyin kutadi
function debounce(fn, delay = 300) {
  let timeoutId;
  const debounced = function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };

  debounced.cancel = () => clearTimeout(timeoutId);
  debounced.flush = (...args) => {
    clearTimeout(timeoutId);
    fn.apply(this, args);
  };

  return debounced;
}

// Throttle — belgilangan vaqtda faqat bir marta
function throttle(fn, limit = 300) {
  let inThrottle = false;
  let lastArgs = null;
  let lastThis = null;

  return function(...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
        if (lastArgs) {
          fn.apply(lastThis, lastArgs);
          lastArgs = null;
          lastThis = null;
        }
      }, limit);
    } else {
      lastArgs = args;
      lastThis = this;
    }
  };
}

// Ishlatish
const search = debounce((query) => {
  console.log('Qidirilmoqda:', query);
  // API call...
}, 500);

const input = document.getElementById('search');
input.addEventListener('input', (e) => search(e.target.value));
// Foydalanuvchi yozishni to'xtatgandan 500ms keyin chaqiriladi

const handleScroll = throttle(() => {
  console.log('Scroll pozitsiyasi:', window.scrollY);
}, 200);

window.addEventListener('scroll', handleScroll);
// Har 200ms da faqat bir marta chaqiriladi

// === Decorator chaining ===
function pipe(...decorators) {
  return (fn) => decorators.reduceRight((acc, decorator) => decorator(acc), fn);
}

// Bitta qatorda bir nechta decorator
const enhancedFetch = pipe(
  withLogging,
  (fn) => withRetry(fn, 3, 1000),
)(fetch);`,
    },
    {
      title: 'TC39 Decorators (Stage 3) va Class decorator',
      language: 'ts',
      description: 'Zamonaviy decorator sintaksisi',
      code: `// TC39 Stage 3 Decorators (TypeScript 5+)

// Method decorator — logging
function logged(originalMethod: any, context: ClassMethodDecoratorContext) {
  const methodName = String(context.name);

  function replacementMethod(this: any, ...args: any[]) {
    console.log(\`LOG: \${methodName}(\${args.join(', ')})\`);
    const result = originalMethod.call(this, ...args);
    console.log(\`LOG: \${methodName} → \${result}\`);
    return result;
  }

  return replacementMethod;
}

// Method decorator — performance timing
function timed(originalMethod: any, context: ClassMethodDecoratorContext) {
  const methodName = String(context.name);

  async function replacementMethod(this: any, ...args: any[]) {
    const start = performance.now();
    const result = await originalMethod.call(this, ...args);
    const ms = (performance.now() - start).toFixed(2);
    console.log(\`⏱️ \${methodName}: \${ms}ms\`);
    return result;
  }

  return replacementMethod;
}

// Cached decorator — parametrli
function cached(ttl: number = 60000) {
  const cache = new Map<string, { value: any; expires: number }>();

  return function(originalMethod: any, context: ClassMethodDecoratorContext) {
    return function(this: any, ...args: any[]) {
      const key = JSON.stringify(args);
      const cached = cache.get(key);

      if (cached && Date.now() < cached.expires) {
        return cached.value;
      }

      const result = originalMethod.call(this, ...args);
      cache.set(key, { value: result, expires: Date.now() + ttl });
      return result;
    };
  };
}

// Ishlatish
class UserService {
  @logged
  @timed
  async getUser(id: string) {
    const res = await fetch(\`/api/users/\${id}\`);
    return res.json();
  }

  @cached(30000) // 30 soniya kesh
  @logged
  getPermissions(role: string) {
    // Og'ir hisoblash...
    return ['read', 'write'];
  }
}

const service = new UserService();
await service.getUser('123');
// LOG: getUser(123)
// ⏱️ getUser: 150.32ms
// LOG: getUser → {...}`,
    },
  ],
  interviewQA: [
    {
      question: 'Decorator pattern nima?',
      answer: 'Decorator — mavjud funksiya yoki obyektga **qo\'shimcha funksionallik** beruvchi pattern, asl kodni o\'zgartirmasdan. Funksiyani "o\'rab" oladi (wrap) va yangi imkoniyat qo\'shadi. JS da bu higher-order function orqali amalga oshiriladi: funksiyani qabul qilib, kengaytirilgan funksiya qaytaradi.',
    },
    {
      question: 'Debounce va Throttle farqi nimada?',
      answer: '**Debounce** — chaqiruvdan keyin belgilangan vaqt kutadi. Agar bu vaqtda yana chaqirilsa, timer qayta boshlanadi. Faqat **oxirgi** chaqiruv bajariladi. Misol: search input. **Throttle** — belgilangan vaqt oralig\'ida faqat **bir marta** bajariladi. Misol: scroll event. Debounce — "tugashini kutish", Throttle — "chastotani cheklash".',
    },
    {
      question: 'Decorator chaining qanday ishlaydi?',
      answer: 'Bir nechta decorator ni ketma-ket qo\'llash: `withLogging(withRetry(withCache(fn)))`. Ichki decorator birinchi qo\'llanadi. Har bir decorator bitta mas\'uliyat oladi (SRP). `pipe()` utility bilan qulay yozish mumkin: `pipe(withLogging, withRetry, withCache)(fn)`. Bu **composition** ning kuchli namunasi.',
    },
    {
      question: 'TC39 Decorators (Stage 3) nima?',
      answer: '`@decorator` sintaksisi — class, method, field, accessor larga dekoratsiya qo\'shish. TypeScript 5+ da qo\'llab-quvvatlanadi. Masalan `@logged` method oldiga qo\'yiladi va har bir chaqiruvni avtomatik loglaydi. Bu Python/Java decorator lardan ilhomlangan. Legacy `experimentalDecorators` dan farqli — yangi Stage 3 standart.',
    },
    {
      question: 'Decorator va Mixin farqi nimada?',
      answer: 'Decorator **runtime** da qo\'llanadi, almashtirish mumkin, chaining oson. Mixin **define-time** da class ga xususiyat qo\'shadi, qaytarib olib bo\'lmaydi. Decorator bitta funksionallik beradi (SRP), Mixin bir nechta. Decorator moslashuvchanroq, lekin Mixin class ga property va method qo\'shish uchun qulayroq.',
    },
  ],
  relatedTopics: [
    {
      techId: 'javascript',
      sectionId: 'design-patterns',
      topicId: 'strategy-pattern',
      label: 'Strategy Pattern',
    },
    {
      techId: 'javascript',
      sectionId: 'design-patterns',
      topicId: 'observer-pattern',
      label: 'Observer Pattern',
    },
  ],
}
