import type { Topic } from '../../../types'

export const inheritanceTopic: Topic = {
  id: 'inheritance',
  title: 'Inheritance (Meros)',
  importance: 3,
  status: 'to-learn',
  description: 'extends, super, method override, instanceof va prototype chain',

  content: `
# Inheritance — JavaScript-da Meros olish

## Meros nima?
Meros (inheritance) — bir class boshqa class-dan xususiyat va metodlarni olishi. JavaScript-da bu **prototype chain** orqali ishlaydi. ES6 \`extends\` kalit so'zi bu jarayonni soddalashtiradi.

## extends kalit so'zi
\`class Child extends Parent\` — Child class Parent-ning barcha metodlarini meros qilib oladi. Child instantsiyasida Parent metodi topilmasa, JavaScript prototype chain bo'ylab yuqoriga qidiradi.

## super() chaqiruvi
Child class-da \`constructor\` yozilsa, **albatta** \`super()\` chaqirilishi kerak — bu Parent-ning constructor-ini ishga tushiradi. \`super()\` chaqirilmaguncha \`this\` ishlatib bo'lmaydi (ReferenceError).

## super.method()
Child ichidan parent-ning metodini \`super.methodName()\` orqali chaqirish mumkin. Bu method override qilganda parent logikasini saqlab qolish uchun ishlatiladi.

## Method Override
Child class parent-dagi metodni qayta yozishi (override) mumkin. Bunda child-dagi metod prototype chain-da birinchi topiladi va ishlatiladi.

## instanceof operatori
\`obj instanceof Class\` — obj ning prototype chain-ida Class.prototype borligini tekshiradi. Meros zanjiridagi barcha parent-lar uchun \`true\` qaytaradi.

## Prototype Chain
\`child → Child.prototype → Parent.prototype → Object.prototype → null\`. Bu zanjirda metod qidiriladi. Eng birinchi topilgan metod ishlatiladi.

## Multi-level Inheritance
\`A extends B\`, \`B extends C\` — JavaScript-da ko'p darajali meros mumkin. Lekin **multiple inheritance** (bir vaqtda ikki class-dan meros) yo'q — buning o'rniga mixin pattern ishlatiladi.

## Abstraction pattern
JavaScript-da rasmiy \`abstract class\` yo'q. Lekin pattern sifatida base class-da metodni throw Error bilan yozib, child-da override qilishni majburlash mumkin.

## Built-in class-lardan meros
Array, Error, Map kabi built-in class-lardan ham meros olish mumkin. \`class MyArray extends Array\` — to'liq ishlovchi custom massiv yaratadi.

## Composition vs Inheritance
"Favor composition over inheritance" — ko'p hollarda meros o'rniga kompozitsiya (ob'ekt ichida boshqa ob'ektni saqlash) yaxshiroq. Meros — "is-a" munosabat, kompozitsiya — "has-a" munosabat.

## Best Practices
- Meros darajasini 2-3 dan oshirmang (deep hierarchy — anti-pattern)
- Composition-ni inheritance-dan afzal ko'ring
- Liskov Substitution Principle-ga rioya qiling
- super() ni constructor-ning birinchi qatorida chaqiring
  `.trim(),

  codeExamples: [
    {
      title: 'extends va super — asosiy meros',
      language: 'js',
      description: 'Parent va child class yaratish, constructor meros, super chaqiruvi',
      code: `class Animal {
  constructor(name, sound) {
    this.name = name;
    this.sound = sound;
  }

  speak() {
    return \`\${this.name}: \${this.sound}!\`;
  }

  toString() {
    return \`[Animal: \${this.name}]\`;
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    // super() — Parent constructor-ini chaqiradi
    // this ishlatishdan OLDIN chaqirilishi shart!
    super(name, 'Hav-hav');
    this.breed = breed;
  }

  fetch(item) {
    return \`\${this.name} \${item}ni olib keldi!\`;
  }
}

class Cat extends Animal {
  constructor(name) {
    super(name, 'Miyov');
  }

  purr() {
    return \`\${this.name} g'irillayapti...\`;
  }
}

const dog = new Dog('Bobik', 'Labrador');
console.log(dog.speak());   // "Bobik: Hav-hav!"
console.log(dog.fetch("to'p")); // "Bobik to'pni olib keldi!"
console.log(dog.breed);     // "Labrador"

const cat = new Cat('Murka');
console.log(cat.speak());   // "Murka: Miyov!"
console.log(cat.purr());    // "Murka g'irillayapti..."`
    },
    {
      title: 'Method override va super.method()',
      language: 'js',
      description: 'Parent metodini qayta yozish va super orqali parent logikasini saqlash',
      code: `class Shape {
  constructor(color = 'qora') {
    this.color = color;
  }

  area() {
    throw new Error('area() metodini child class-da override qiling!');
  }

  describe() {
    return \`\${this.color} rangli shakl, yuza: \${this.area()}\`;
  }
}

class Rectangle extends Shape {
  constructor(width, height, color) {
    super(color);
    this.width = width;
    this.height = height;
  }

  // Method override
  area() {
    return this.width * this.height;
  }

  // super.describe() — parent metodini chaqirib, ustiga qo'shish
  describe() {
    return super.describe() + \` (to'rtburchak \${this.width}x\${this.height})\`;
  }
}

class Circle extends Shape {
  constructor(radius, color) {
    super(color);
    this.radius = radius;
  }

  area() {
    return Math.round(Math.PI * this.radius ** 2);
  }

  describe() {
    return super.describe() + \` (aylana r=\${this.radius})\`;
  }
}

const rect = new Rectangle(10, 5, "ko'k");
console.log(rect.describe());
// "ko'k rangli shakl, yuza: 50 (to'rtburchak 10x5)"

const circle = new Circle(7, 'qizil');
console.log(circle.describe());
// "qizil rangli shakl, yuza: 154 (aylana r=7)"`
    },
    {
      title: 'instanceof va prototype chain',
      language: 'js',
      description: `Prototype chain bo'ylab tip tekshirish`,
      code: `class Vehicle {
  move() { return 'Harakat qilmoqda'; }
}

class Car extends Vehicle {
  drive() { return 'Haydamoqda'; }
}

class ElectricCar extends Car {
  charge() { return 'Zaryadlanmoqda'; }
}

const tesla = new ElectricCar();

// instanceof — prototype chain bo'ylab tekshiradi
console.log(tesla instanceof ElectricCar); // true
console.log(tesla instanceof Car);         // true
console.log(tesla instanceof Vehicle);     // true
console.log(tesla instanceof Object);      // true

// Prototype chain ko'rish
console.log(Object.getPrototypeOf(tesla) === ElectricCar.prototype); // true
console.log(Object.getPrototypeOf(ElectricCar.prototype) === Car.prototype); // true
console.log(Object.getPrototypeOf(Car.prototype) === Vehicle.prototype); // true

// Barcha metodlar mavjud
console.log(tesla.move());   // "Harakat qilmoqda"
console.log(tesla.drive());  // "Haydamoqda"
console.log(tesla.charge()); // "Zaryadlanmoqda"

// isPrototypeOf — teskari tekshirish
console.log(Vehicle.prototype.isPrototypeOf(tesla)); // true`
    },
    {
      title: 'Built-in class-lardan meros olish',
      language: 'js',
      description: 'Array va Error-dan meros olish',
      code: `// Custom Error
class ValidationError extends Error {
  constructor(field, message) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

class RequiredFieldError extends ValidationError {
  constructor(field) {
    super(field, \`"\${field}" maydoni to'ldirilishi shart\`);
    this.name = 'RequiredFieldError';
  }
}

try {
  throw new RequiredFieldError('email');
} catch (e) {
  console.log(e.name);    // "RequiredFieldError"
  console.log(e.field);   // "email"
  console.log(e.message); // '"email" maydoni to'ldirilishi shart'
  console.log(e instanceof RequiredFieldError); // true
  console.log(e instanceof ValidationError);    // true
  console.log(e instanceof Error);              // true
}

// Custom Array
class ObservableArray extends Array {
  #listeners = [];

  onChange(fn) {
    this.#listeners.push(fn);
  }

  push(...items) {
    super.push(...items);
    this.#listeners.forEach(fn => fn('push', items));
    return this.length;
  }
}

const arr = new ObservableArray();
arr.onChange((action, items) => console.log(\`\${action}: \${items}\`));
arr.push(1, 2, 3); // "push: 1,2,3"
console.log(arr.length);   // 3
console.log(arr.filter(x => x > 1)); // [2, 3] — Array metodlari ishlaydi`
    }
  ],

  interviewQA: [
    {
      question: `super() nima uchun kerak va qachon chaqirilishi shart?`,
      answer: `super() parent class-ning constructor-ini chaqiradi. Child class-da constructor yozilgan bo'lsa, super() ni this ishlatishdan OLDIN chaqirish SHART — aks holda ReferenceError. Agar child class-da constructor yozilmasa, JavaScript avtomatik super(...args) chaqiradi. super.method() esa parent-ning ustiga yozilgan (overridden) metodini chaqirish uchun ishlatiladi.`
    },
    {
      question: `JavaScript-da multiple inheritance (ko'p meroslik) mumkinmi?`,
      answer: `Yo'q, JavaScript-da class faqat BITTA parent-dan extends qila oladi. Ko'p meroslikni mixin pattern orqali amalga oshirish mumkin: const Mix = (Base) => class extends Base { ... }. Yoki Object.assign() bilan prototype-ga metodlar qo'shish. Lekin haqiqiy multiple inheritance emas — bu workaround. Diamond problem muammosi yo'q, chunki bitta prototype chain bor.`
    },
    {
      question: `Composition vs Inheritance — qachon qaysi birini ishlatish kerak?`,
      answer: `"Is-a" munosabat bo'lsa inheritance: Dog is-a Animal. "Has-a" munosabat bo'lsa composition: Car has-a Engine. Inheritance muammolari: 1) Tight coupling — parent o'zgarsa child buziladi. 2) Fragile base class problem. 3) Deep hierarchy murakkab. Composition afzalliklari: 1) Loose coupling. 2) Oson test qilish. 3) Moslashuvchan. Maslahat: avval composition-ni o'ylang, faqat aniq "is-a" bo'lganda inheritance ishlating.`
    },
    {
      question: `instanceof qanday ishlaydi va qachon noto'g'ri natija berishi mumkin?`,
      answer: `instanceof obj-ning prototype chain-ida Class.prototype borligini tekshiradi. Noto'g'ri natijalar: 1) iframe/window-lar orasida — har bir iframe o'z Array constructori bor, shuning uchun Array.isArray() ishlatish kerak. 2) Object.create(null) — prototype chain uzilgan. 3) Symbol.hasInstance — class-da bu symbol-ni override qilsa, instanceof xulqi o'zgaradi. Primitive qiymatlar uchun har doim false qaytaradi (42 instanceof Number === false).`
    },
    {
      question: `Prototype chain-da metod qidiruv tartibi qanday?`,
      answer: `obj.method() chaqirilganda: 1) Avval obj-ning o'zida qidiriladi (own property). 2) Keyin obj.__proto__ (ya'ni Class.prototype). 3) Keyin Parent.prototype. 4) ... zanjir bo'ylab. 5) Object.prototype. 6) null ga yetganda — undefined. Birinchi topilgan metod ishlatiladi (shadowing). hasOwnProperty() yoki Object.hasOwn() bilan faqat own property-ni tekshirish mumkin.`
    }
  ],

  relatedTopics: [
    { techId: 'javascript', sectionId: 'oop-classes', topicId: 'classes', label: 'ES6 Classes' },
    { techId: 'javascript', sectionId: 'oop-classes', topicId: 'mixins', label: 'Mixins' },
    { techId: 'javascript', sectionId: 'oop-classes', topicId: 'solid-principles', label: 'SOLID printsiplari' }
  ]
}
