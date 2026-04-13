import type { Topic } from '../../../types'

export const strategyPattern: Topic = {
  id: 'strategy-pattern',
  title: 'Strategy Pattern',
  importance: 2,
  status: 'to-learn',
  description: 'Strategy pattern, form validation example',
  content: `
# Strategy Pattern

## Strategy nima?

Strategy pattern — algoritmni **alohida obyektga** chiqarish va uni **almashtirib** ishlatish imkoniyati. Masalan, saralash algoritmini (bubble sort, quick sort, merge sort) tanlash — strategiya o'zgaradi, lekin asosiy kod o'zgarmaydi.

## Muammo

Katta \`if/else\` yoki \`switch\` bloklari turli algoritmni tanlash uchun ishlatilsa:
- Yangi variant qo'shish qiyin
- Kod o'sib ketadi
- Har bir variant ni alohida test qilib bo'lmaydi

## Yechim

Har bir algoritmni **alohida funksiya/obyekt** ga chiqarish va **context** ga berish:

\`\`\`
Context → Strategy (almashtiriladigan)
          ├── StrategyA
          ├── StrategyB
          └── StrategyC
\`\`\`

## JavaScript da Strategy

JS da funksiyalar **first-class citizen** — ularni o'zgaruvchiga saqlash, parametr sifatida berish mumkin. Shuning uchun Strategy pattern JS da juda tabiiy ishlaydi — alohida class shart emas, **funksiya** yetarli.

## Qachon ishlatish kerak?

- **Bir nechta algoritm** mavjud va runtime da tanlash kerak
- Algoritmlar tez-tez **o'zgaradi** yoki yangilari **qo'shiladi**
- Katta \`if/else\` / \`switch\` ni tozalash kerak
- Algoritmni **alohida test** qilish kerak

## Real-world misollar

1. **Form validation** — turli validatsiya qoidalari
2. **Sorting** — turli saralash usullari
3. **Payment** — turli to'lov tizimlari (PayMe, Click, Visa)
4. **Compression** — turli siqish algoritmlari
5. **Pricing** — turli narx strategiyalari (VIP, oddiy, aksiya)
6. **Authentication** — turli auth usullari (JWT, OAuth, API Key)
7. **Array.sort(compareFn)** — comparator funksiya bu strategiya

## Open/Closed Principle

Strategy pattern **OCP** (Open/Closed Principle) ni amalga oshiradi: kod **kengaytirish uchun ochiq** (yangi strategiya qo'shish), lekin **o'zgartirish uchun yopiq** (mavjud kodni o'zgartirish shart emas).
  `.trim(),
  codeExamples: [
    {
      title: 'Form Validation — Strategy bilan',
      language: 'js',
      description: 'Har bir validatsiya qoidasi alohida strategiya',
      code: `// Validatsiya strategiyalari
const validationStrategies = {
  required(value) {
    return value.trim().length > 0
      ? null
      : 'Bu maydon majburiy';
  },

  minLength(min) {
    return (value) => value.length >= min
      ? null
      : \`Kamida \${min} ta belgi bo'lishi kerak\`;
  },

  maxLength(max) {
    return (value) => value.length <= max
      ? null
      : \`Maksimal \${max} ta belgi\`;
  },

  email(value) {
    return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(value)
      ? null
      : 'Email formati noto\\'g\\'ri';
  },

  phone(value) {
    return /^\\+998\\d{9}$/.test(value)
      ? null
      : 'Telefon: +998XXXXXXXXX';
  },

  pattern(regex, message) {
    return (value) => regex.test(value) ? null : message;
  },

  match(fieldName, getValue) {
    return (value) => value === getValue()
      ? null
      : \`\${fieldName} bilan mos kelmaydi\`;
  },
};

// Validator — strategiyalarni qo'llaydi
class FormValidator {
  #rules = new Map();

  addRule(field, ...strategies) {
    if (!this.#rules.has(field)) {
      this.#rules.set(field, []);
    }
    this.#rules.get(field).push(...strategies);
    return this; // chaining
  }

  validate(data) {
    const errors = {};

    for (const [field, strategies] of this.#rules) {
      for (const strategy of strategies) {
        const error = strategy(data[field] ?? '');
        if (error) {
          errors[field] = error;
          break; // birinchi xato yetarli
        }
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }
}

// Ishlatish
const validator = new FormValidator()
  .addRule('name', validationStrategies.required, validationStrategies.minLength(2))
  .addRule('email', validationStrategies.required, validationStrategies.email)
  .addRule('phone', validationStrategies.phone);

const result = validator.validate({
  name: 'A',
  email: 'wrong',
  phone: '+998901234567',
});
// { isValid: false, errors: { name: 'Kamida 2 ta belgi...', email: 'Email formati...' } }`,
    },
    {
      title: 'Payment Strategy va Pricing',
      language: 'js',
      description: 'To\'lov va narxlash strategiyalari',
      code: `// Payment strategiyalari
const paymentStrategies = {
  payme: {
    name: 'PayMe',
    fee: 0, // komissiya yo'q
    process(amount) {
      console.log(\`PayMe orqali \${amount} so'm to'lanmoqda...\`);
      return { success: true, transactionId: 'PM-' + Date.now() };
    },
  },

  click: {
    name: 'Click',
    fee: 0.005, // 0.5% komissiya
    process(amount) {
      const total = amount + amount * this.fee;
      console.log(\`Click orqali \${total} so'm to'lanmoqda...\`);
      return { success: true, transactionId: 'CL-' + Date.now() };
    },
  },

  visa: {
    name: 'Visa',
    fee: 0.02, // 2% komissiya
    process(amount) {
      const total = amount + amount * this.fee;
      console.log(\`Visa orqali $\${(total / 12500).toFixed(2)} to'lanmoqda...\`);
      return { success: true, transactionId: 'VS-' + Date.now() };
    },
  },
};

// Checkout — strategiyani qo'llaydi
class Checkout {
  #strategy = null;

  setPaymentMethod(strategyName) {
    const strategy = paymentStrategies[strategyName];
    if (!strategy) throw new Error(\`Noma'lum to'lov usuli: \${strategyName}\`);
    this.#strategy = strategy;
    return this;
  }

  pay(amount) {
    if (!this.#strategy) throw new Error('To\\'lov usulini tanlang');
    return this.#strategy.process(amount);
  }

  getFee(amount) {
    return amount * (this.#strategy?.fee ?? 0);
  }
}

const checkout = new Checkout();
checkout.setPaymentMethod('payme').pay(100000);
checkout.setPaymentMethod('visa').pay(100000);

// === Pricing Strategy ===
const pricingStrategies = {
  regular: (price) => price,
  vip: (price) => price * 0.8,        // 20% chegirma
  wholesale: (price) => price * 0.6,   // 40% chegirma
  promo: (code) => (price) => {
    const promos = { SALE10: 0.1, SALE20: 0.2, HALF: 0.5 };
    const discount = promos[code] ?? 0;
    return price * (1 - discount);
  },
};

function calculatePrice(items, strategy) {
  return items.reduce((total, item) => {
    return total + strategy(item.price) * item.qty;
  }, 0);
}

const items = [
  { name: 'Kitob', price: 50000, qty: 2 },
  { name: 'Ruchka', price: 5000, qty: 10 },
];

console.log(calculatePrice(items, pricingStrategies.regular));   // 150000
console.log(calculatePrice(items, pricingStrategies.vip));       // 120000
console.log(calculatePrice(items, pricingStrategies.promo('SALE20'))); // 120000`,
    },
    {
      title: 'Sorting Strategy va Array.sort()',
      language: 'js',
      description: 'Array.sort() — built-in strategy pattern',
      code: `// Array.sort() — comparator funksiya bu STRATEGIYA
const users = [
  { name: 'Ali', age: 25, rating: 4.5 },
  { name: 'Vali', age: 30, rating: 3.8 },
  { name: 'Gani', age: 22, rating: 4.9 },
  { name: 'Doni', age: 28, rating: 4.2 },
];

// Sorting strategiyalari
const sortStrategies = {
  byName: (a, b) => a.name.localeCompare(b.name),
  byAge: (a, b) => a.age - b.age,
  byAgeDesc: (a, b) => b.age - a.age,
  byRating: (a, b) => b.rating - a.rating,
  byMultiple: (...strategies) => (a, b) => {
    for (const strategy of strategies) {
      const result = strategy(a, b);
      if (result !== 0) return result;
    }
    return 0;
  },
};

// Strategiyani tanlash
console.log([...users].sort(sortStrategies.byName));
console.log([...users].sort(sortStrategies.byRating));

// Ko'p mezonli saralash
const multiSort = sortStrategies.byMultiple(
  sortStrategies.byRating,
  sortStrategies.byAge
);
console.log([...users].sort(multiSort));

// === Dynamic strategy tanlash (UI dan) ===
class DataTable {
  #data;
  #sortStrategy;

  constructor(data) {
    this.#data = data;
    this.#sortStrategy = null;
  }

  setSortStrategy(strategy) {
    this.#sortStrategy = strategy;
    return this;
  }

  getData() {
    if (this.#sortStrategy) {
      return [...this.#data].sort(this.#sortStrategy);
    }
    return [...this.#data];
  }
}

const table = new DataTable(users);

// Foydalanuvchi "Yoshiga ko'ra" bosganda
table.setSortStrategy(sortStrategies.byAge);
console.log(table.getData());

// "Reytingga ko'ra" bosganda — strategiya almashdi
table.setSortStrategy(sortStrategies.byRating);
console.log(table.getData());`,
    },
  ],
  interviewQA: [
    {
      question: 'Strategy pattern nima?',
      answer: 'Strategy — algoritmni **alohida obyekt/funksiyaga** chiqarish va runtime da **almashtirib** ishlatish imkoniyati. Context (asosiy kod) strategiyani qo\'llaydi, qaysi strategiya ishlatilayotganini bilishi shart emas. Bu katta `if/else` bloklarini tozalaydi va yangi algoritm qo\'shishni osonlashtiradi.',
    },
    {
      question: 'JavaScript da Strategy pattern qanday implement qilinadi?',
      answer: 'JS da funksiyalar first-class citizen bo\'lgani uchun, strategiya oddiy **funksiya** bo\'lishi mumkin — class shart emas. Masalan, `Array.sort(compareFn)` da comparator funksiya bu strategiya. Yoki obyekt ichida funksiyalar to\'plami: `{ byName: (a,b) => ..., byAge: (a,b) => ... }` va kerakligini tanlash.',
    },
    {
      question: 'Strategy pattern qaysi SOLID printsipiga amal qiladi?',
      answer: '**Open/Closed Principle (OCP)** — kod kengaytirish uchun ochiq (yangi strategiya qo\'shish — faqat yangi funksiya yozish), lekin o\'zgartirish uchun yopiq (mavjud context kodni o\'zgartirish shart emas). Shuningdek, **Single Responsibility** — har bir strategiya bitta vazifaga javobgar.',
    },
    {
      question: 'Strategy va Factory pattern farqi nimada?',
      answer: 'Factory — **obyekt yaratish** haqida: qaysi tipni yaratishni hal qiladi. Strategy — **xatti-harakat** haqida: qanday algoritm bilan ishlashni hal qiladi. Factory yaratishdan keyin ish tugaydi. Strategy esa runtime da **almashtirilishi** mumkin. Ko\'pincha birgalikda ishlatiladi — Factory strategiyani yaratadi.',
    },
    {
      question: 'Real-world misollar keltiring.',
      answer: '1) **Form validation** — turli qoidalar (required, email, minLength). 2) **Payment** — turli to\'lov usullari (PayMe, Click, Visa). 3) **Array.sort(compareFn)** — turli saralash. 4) **Compression** — gzip, brotli, deflate. 5) **Authentication** — JWT, OAuth, API key. 6) **Pricing** — VIP, aksiya, oddiy narx.',
    },
  ],
  relatedTopics: [
    {
      techId: 'javascript',
      sectionId: 'design-patterns',
      topicId: 'factory-pattern',
      label: 'Factory Pattern',
    },
    {
      techId: 'javascript',
      sectionId: 'design-patterns',
      topicId: 'observer-pattern',
      label: 'Observer Pattern',
    },
  ],
}
