import type { Topic } from '../../../types'

export const classesTopic: Topic = {
  id: 'classes',
  title: 'ES6 Classes',
  importance: 3,
  status: 'to-learn',
  description: 'ES6 class sintaksisi, constructor, metodlar, static xususiyatlar va private maydonlar (#)',

  content: `
# ES6 Classes — JavaScript-da OOP asoslari

## Class nima?
ES6 \`class\` — bu konstruktor funksiyalar ustidagi **syntactic sugar**. Ichki mexanizm hali ham prototype-based, lekin sintaksis ancha toza va o'qilishi oson.

## Constructor
\`constructor()\` — class instantsiyasi yaratilganda avtomatik chaqiriladigan maxsus metod. Har bir class-da faqat **bitta** constructor bo'lishi mumkin.

## Instance metodlar
Class tanasida yozilgan funksiyalar **prototype**-ga qo'shiladi. Ya'ni barcha instantsiyalar bir xil metodni bo'lishadi (xotira tejash).

## Static metodlar va xususiyatlar
\`static\` kalit so'zi bilan belgilangan metodlar **class-ning o'ziga** tegishli, instantsiyalarga emas. Utility funksiyalar, factory pattern uchun ishlatiladi.

## Private maydonlar (#)
ES2022 dan boshlab \`#\` prefiksi bilan haqiqiy private maydonlar yaratish mumkin. Bu maydonlarga class tashqarisidan murojaat qilib bo'lmaydi — \`TypeError\` beradi.

## Getter va Setter
\`get\` va \`set\` kalit so'zlari bilan computed property yaratish mumkin. Bu property-ga o'xshab ishlaydi, lekin ichida logika bor.

## Class Expression
Class-ni o'zgaruvchiga tayinlash ham mumkin — anonymous yoki named class expression.

## Class Fields (Public)
Constructor-dan tashqarida ham maydonlar e'lon qilish mumkin. Bu ES2022 standartida rasmiy qo'shilgan.

## Class va Hoisting
\`class\` deklaratsiyalari **hoist qilinmaydi** (temporal dead zone). \`function\` dan farqli ravishda, class-ni e'lon qilishdan oldin ishlatib bo'lmaydi.

## Prototype bilan aloqasi
\`class\` ichidagi metodlar aslida \`ClassName.prototype\`-ga qo'shiladi. \`typeof ClassName\` natijasi \`'function'\`. Ya'ni class — bu maxsus konstruktor funksiya.

## "use strict"
Class tanasi avtomatik **strict mode**-da ishlaydi. Bu xavfsizlik va xatolarni erta aniqlash uchun foydali.

## Best Practices
- Private maydonlar uchun \`#\` prefiksini ishlating (WeakMap emas)
- Static metodlarni utility/factory uchun ishlating
- Getter/Setter-ni validatsiya va computed qiymatlar uchun ishlating
- Class-ni faqat kerak joyda ishlating — JavaScript-da funksional yondashuv ham kuchli
  `.trim(),

  codeExamples: [
    {
      title: 'Class asoslari — constructor, metodlar',
      language: 'js',
      description: 'Oddiy class yaratish, constructor va instance metodlari',
      code: `class User {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  greet() {
    return \`Salom, men \${this.name}, \${this.age} yoshdaman\`;
  }

  isAdult() {
    return this.age >= 18;
  }
}

const user = new User('Ali', 25);
console.log(user.greet());   // "Salom, men Ali, 25 yoshdaman"
console.log(user.isAdult()); // true

// Class aslida funksiya
console.log(typeof User); // "function"
console.log(user instanceof User); // true`
    },
    {
      title: 'Static metodlar va xususiyatlar',
      language: 'js',
      description: 'Static a\'zolar class-ning o\'ziga tegishli, instantsiyaga emas',
      code: `class MathUtils {
  static PI = 3.14159;

  static circle(radius) {
    return MathUtils.PI * radius ** 2;
  }

  static max(...nums) {
    return nums.reduce((a, b) => a > b ? a : b);
  }
}

// Static — class orqali chaqiriladi
console.log(MathUtils.PI);          // 3.14159
console.log(MathUtils.circle(5));   // 78.53975
console.log(MathUtils.max(3, 7, 1)); // 7

// Instantsiyada YO'Q
const m = new MathUtils();
// m.circle(5); // TypeError: m.circle is not a function`
    },
    {
      title: 'Private maydonlar (#) va getter/setter',
      language: 'js',
      description: 'Haqiqiy private maydonlar va encapsulation',
      code: `class BankAccount {
  #balance = 0;       // private field
  #owner;             // private field
  static #bankName = 'Ketmon Bank'; // private static

  constructor(owner, initialBalance) {
    this.#owner = owner;
    if (initialBalance > 0) {
      this.#balance = initialBalance;
    }
  }

  // Getter — property sifatida ishlatiladi
  get balance() {
    return this.#balance;
  }

  get info() {
    return \`\${this.#owner} — \${this.#balance} UZS\`;
  }

  deposit(amount) {
    if (amount <= 0) throw new Error('Noto\\'g\\'ri summa');
    this.#balance += amount;
    return this;  // chaining uchun
  }

  withdraw(amount) {
    if (amount > this.#balance) throw new Error('Mablag\\' yetarli emas');
    this.#balance -= amount;
    return this;
  }

  static getBankName() {
    return BankAccount.#bankName;
  }
}

const acc = new BankAccount('Ali', 100_000);
acc.deposit(50_000).withdraw(30_000); // chaining
console.log(acc.balance); // 120000 (getter orqali)
console.log(acc.info);    // "Ali — 120000 UZS"

// acc.#balance; // SyntaxError: Private field
console.log(BankAccount.getBankName()); // "Ketmon Bank"`
    },
    {
      title: 'Class Fields va Class Expression',
      language: 'js',
      description: 'Zamonaviy class xususiyatlari',
      code: `// Class fields — constructor shart emas
class Counter {
  count = 0;  // public field, har bir instantsiyada alohida

  increment = () => {  // arrow function — this muammosi yo'q
    this.count++;
  };

  decrement = () => {
    this.count--;
  };
}

const c = new Counter();
const { increment } = c; // destrukturlash
increment(); // this to'g'ri ishlaydi (arrow function tufayli)
console.log(c.count); // 1

// Class Expression
const Animal = class {
  constructor(name) {
    this.name = name;
  }
  speak() {
    return \`\${this.name} ovoz chiqarmoqda\`;
  }
};

const cat = new Animal('Mushuk');
console.log(cat.speak()); // "Mushuk ovoz chiqarmoqda"`
    }
  ],

  interviewQA: [
    {
      question: 'ES6 class va oddiy constructor funksiya o\'rtasidagi farq nima?',
      answer: 'Class — constructor funksiya ustidagi syntactic sugar. Lekin farqlari bor: 1) Class hoist qilinmaydi (TDZ). 2) Class ichidagi kod avtomatik strict mode-da. 3) Class metodlari non-enumerable. 4) Class-ni new-siz chaqirib bo\'lmaydi (TypeError). 5) Class ichida private fields (#) va static mumkin. Prototype-based meros ikkalasida ham bir xil ishlaydi.'
    },
    {
      question: 'Private field (#) va underscore convention (_) o\'rtasidagi farq?',
      answer: 'Underscore (_this.name) — bu faqat **konventsiya**, hech qanday himoya bermaydi, tashqaridan erkin murojaat qilish mumkin. Private field (#this.#name) — bu **haqiqiy** til darajasidagi encapsulation. Class tashqarisidan murojaat qilishga urinish SyntaxError beradi. Reflection orqali ham ko\'rib bo\'lmaydi. V8 engine darajasida himoyalangan.'
    },
    {
      question: 'Static metod qachon ishlatiladi? Misol keltiring.',
      answer: 'Static metodlar instantsiyaga bog\'liq bo\'lmagan utility/helper funksiyalar uchun ishlatiladi. Misollar: 1) Factory method: User.fromJSON(data) — yangi instantsiya yaratish. 2) Utility: MathUtils.clamp(val, min, max). 3) Singleton: Database.getInstance(). 4) Validatsiya: Email.isValid(str). Static metodda this — class-ning o\'ziga ishora qiladi, instantsiyaga emas.'
    },
    {
      question: 'Arrow function class field va oddiy metod o\'rtasidagi farq nima?',
      answer: 'Oddiy metod prototype-ga qo\'shiladi — barcha instantsiyalar bir xil funksiyani bo\'lishadi (xotira tejaydi). Arrow function field har bir instantsiyada yangi funksiya yaratadi (ko\'proq xotira), lekin this har doim to\'g\'ri bo\'ladi. Arrow function-ni event handler sifatida destrukturlash kerak bo\'lganda ishlating. React-da class component-larda arrow field method ko\'p ishlatilgan.'
    },
    {
      question: 'typeof class nima qaytaradi va nima uchun?',
      answer: 'typeof MyClass "function" qaytaradi, chunki class ichki implementatsiyada constructor funksiya. new MyClass() chaqirganda prototype chain yaratiladi. MyClass.prototype.constructor === MyClass. Lekin class-ni oddiy funksiya sifatida (new-siz) chaqirish mumkin emas — TypeError beradi. Bu class va funksiya o\'rtasidagi muhim farq.'
    }
  ],

  relatedTopics: [
    { techId: 'javascript', sectionId: 'oop-classes', topicId: 'inheritance', label: 'Inheritance (extends, super)' },
    { techId: 'javascript', sectionId: 'oop-classes', topicId: 'solid-principles', label: 'SOLID printsiplari' },
    { techId: 'javascript', sectionId: 'oop-classes', topicId: 'design-patterns-oop', label: 'Design Patterns' }
  ]
}
