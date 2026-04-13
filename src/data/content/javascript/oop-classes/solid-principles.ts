import type { Topic } from '../../../types'

export const solidPrinciplesTopic: Topic = {
  id: 'solid-principles',
  title: 'SOLID Printsiplari',
  importance: 3,
  status: 'to-learn',
  description: 'SRP, OCP, LSP, ISP, DIP — JavaScript kontekstida SOLID tamoyillari',

  content: `
# SOLID Printsiplari — JavaScript kontekstida

## SOLID nima?
SOLID — Robert C. Martin (Uncle Bob) tomonidan taklif qilingan 5 ta OOP dizayn prinsipi. Ular kodni o'qilishi oson, kengaytirish mumkin va maintain qilishga qulay qiladi.

## S — Single Responsibility Principle (SRP)
Har bir class/modul/funksiya **faqat bitta vazifa** uchun javobgar bo'lishi kerak. Agar class-ni o'zgartirish uchun bir nechta sabab bo'lsa — u SRP-ni buzmoqda. JavaScript-da bu funksiyalarga ham tegishli.

## O — Open/Closed Principle (OCP)
Klass kengaytirish uchun **ochiq**, o'zgartirish uchun **yopiq** bo'lishi kerak. Yangi funksionallik qo'shish uchun mavjud kodni o'zgartirmasdan, uni extend qilish kerak. Plugin tizimi — OCP ning eng yaxshi namunasi.

## L — Liskov Substitution Principle (LSP)
Child class parent class o'rnida ishlatilganda dastur **to'g'ri ishlashi** kerak. Ya'ni child parent-ning "kontraktini" buzmasligi kerak — xuddi shu metodlar, xuddi shu turdagi qaytarish qiymatlari.

## I — Interface Segregation Principle (ISP)
Katta, "semiz" interface-lardan ko'ra, kichik va aniq interface-lar yaxshiroq. JavaScript-da rasmiy interface yo'q, lekin bu prinsip class-lar va ob'ektlarga ham tegishli — keraksiz metodlarni majburlamang.

## D — Dependency Inversion Principle (DIP)
Yuqori darajali modullar past darajali modullarga **to'g'ridan-to'g'ri** bog'liq bo'lmasligi kerak. Ikkalasi ham **abstraktsiyaga** bog'liq bo'lishi kerak. JavaScript-da bu dependency injection va callback/interface pattern orqali amalga oshiriladi.

## SOLID JavaScript-da
JavaScript — multi-paradigm til. SOLID faqat class-larga emas, funksiya, modul, hook (React) ga ham tegishli. Masalan:
- SRP: Har bir React hook bitta vazifa
- OCP: Middleware pattern (Express, Redux)
- DIP: Dependency injection (konstruktor, parametr)

## Qachon SOLID kerak emas?
- Kichik skriptlar va utility funksiyalar
- Prototype/MVP bosqichida
- Over-engineering xavfi bo'lganda
SOLID — maqsad emas, vosita. Kodni murakkablashtirish uchun emas, soddalashtiish uchun ishlating.

## SOLID va Clean Code
SOLID + DRY + KISS + YAGNI birgalikda "Clean Code" tamoyillarini tashkil qiladi. Ular bir-birini to'ldiradi.
  `.trim(),

  codeExamples: [
    {
      title: 'SRP — Single Responsibility Principle',
      language: 'js',
      description: 'Har bir class faqat bitta vazifa uchun javobgar',
      code: `// NOTO'G'RI — bitta class ko'p vazifa bajarmoqda
class UserManager {
  createUser(data) { /* DB saqlash */ }
  sendEmail(user) { /* Email jo'natish */ }
  generateReport(user) { /* Hisobot */ }
  validateUser(data) { /* Validatsiya */ }
}

// TO'G'RI — har bir class alohida vazifa
class UserRepository {
  save(user) { /* faqat DB bilan ishlash */ }
  findById(id) { /* faqat qidirish */ }
  delete(id) { /* faqat o'chirish */ }
}

class UserValidator {
  validate(data) {
    const errors = [];
    if (!data.name) errors.push('Ism kiritilmagan');
    if (!data.email?.includes('@')) errors.push('Email noto\\'g\\'ri');
    return { valid: errors.length === 0, errors };
  }
}

class EmailService {
  send(to, subject, body) {
    // faqat email yuborish logikasi
    console.log(\`Email -> \${to}: \${subject}\`);
  }
}

// Ishlatish
const repo = new UserRepository();
const validator = new UserValidator();
const email = new EmailService();

const data = { name: 'Ali', email: 'ali@mail.com' };
const { valid } = validator.validate(data);
if (valid) {
  repo.save(data);
  email.send(data.email, 'Xush kelibsiz!', '...');
}`
    },
    {
      title: 'OCP — Open/Closed Principle',
      language: 'js',
      description: 'Kengaytirish uchun ochiq, o\'zgartirish uchun yopiq',
      code: `// NOTO'G'RI — har safar yangi tip qo'shganda kodni o'zgartirish kerak
function calculateDiscount(type, price) {
  if (type === 'regular') return price * 0.05;
  if (type === 'premium') return price * 0.1;
  if (type === 'vip') return price * 0.2;
  // yangi tip = kodni o'zgartirish kerak!
}

// TO'G'RI — Strategy pattern bilan OCP
class DiscountCalculator {
  #strategies = new Map();

  register(type, strategy) {
    this.#strategies.set(type, strategy);
    return this; // chaining
  }

  calculate(type, price) {
    const strategy = this.#strategies.get(type);
    if (!strategy) throw new Error(\`Noma'lum tur: \${type}\`);
    return strategy(price);
  }
}

const calculator = new DiscountCalculator()
  .register('regular', price => price * 0.05)
  .register('premium', price => price * 0.1)
  .register('vip',     price => price * 0.2);

// Yangi tur qo'shish — mavjud kodni o'zgartirmaymiz!
calculator.register('employee', price => price * 0.3);

console.log(calculator.calculate('vip', 100_000));    // 20000
console.log(calculator.calculate('employee', 100_000)); // 30000`
    },
    {
      title: 'LSP — Liskov Substitution Principle',
      language: 'js',
      description: 'Child class parent o\'rnida to\'g\'ri ishlashi kerak',
      code: `// NOTO'G'RI — LSP buzilgan
class Bird {
  fly() { return 'Uchmoqda'; }
}

class Penguin extends Bird {
  fly() {
    throw new Error('Pingvin ucha olmaydi!'); // LSP buzildi!
  }
}

function makeBirdFly(bird) {
  return bird.fly(); // Penguin bunda xato beradi
}

// TO'G'RI — LSP ga rioya
class Bird2 {
  move() { return 'Harakat qilmoqda'; }
}

class FlyingBird extends Bird2 {
  move() { return 'Uchmoqda'; }
  fly() { return 'Uchmoqda'; }
}

class SwimmingBird extends Bird2 {
  move() { return 'Suzmoqda'; }
  swim() { return 'Suzmoqda'; }
}

class Eagle extends FlyingBird {}
class Penguin2 extends SwimmingBird {}

function makeBirdMove(bird) {
  return bird.move(); // Har qanday Bird2 subclass-i uchun ishlaydi
}

console.log(makeBirdMove(new Eagle()));    // "Uchmoqda"
console.log(makeBirdMove(new Penguin2())); // "Suzmoqda"`
    },
    {
      title: 'DIP — Dependency Inversion Principle',
      language: 'js',
      description: 'Yuqori darajali modul past darajali modulga bog\'liq bo\'lmasin',
      code: `// NOTO'G'RI — to'g'ridan-to'g'ri bog'liqlik
class MySQLDatabase {
  save(data) { console.log('MySQL ga saqlandi:', data); }
}

class UserService {
  constructor() {
    this.db = new MySQLDatabase(); // qattiq bog'liqlik!
  }
  createUser(data) {
    this.db.save(data);
  }
}

// TO'G'RI — DIP (abstraktsiyaga bog'liqlik)
// "Database" interfeysi (duck typing orqali)
class PostgresDB {
  save(data) { console.log('Postgres:', data); }
  find(id)   { return { id, name: 'Test' }; }
}

class MongoDB {
  save(data) { console.log('MongoDB:', data); }
  find(id)   { return { id, name: 'Test' }; }
}

class InMemoryDB {
  #store = new Map();
  save(data) { this.#store.set(data.id, data); }
  find(id)   { return this.#store.get(id); }
}

// Yuqori darajali modul — abstraktsiyaga bog'liq
class UserService2 {
  constructor(database) { // dependency injection
    this.db = database;
  }
  createUser(data) {
    this.db.save(data);
  }
}

// Istalgan DB ni berish mumkin
const service1 = new UserService2(new PostgresDB());
const service2 = new UserService2(new MongoDB());
const service3 = new UserService2(new InMemoryDB()); // test uchun qulay

service1.createUser({ id: 1, name: 'Ali' });
service2.createUser({ id: 2, name: 'Vali' });`
    }
  ],

  interviewQA: [
    {
      question: 'SOLID printsiplarini JavaScript kontekstida tushuntiring.',
      answer: 'S — Single Responsibility: har bir funksiya/modul bitta vazifa. O — Open/Closed: kengaytirish uchun ochiq (plugin, strategy), o\'zgartirish uchun yopiq. L — Liskov Substitution: child parent o\'rnida xatosiz ishlasin. I — Interface Segregation: kichik, aniq API-lar (JS-da duck typing orqali). D — Dependency Inversion: dependency injection, callback orqali bog\'liqlikni kamyatirish. JS-da bu class-larga ham, funksiyalarga ham, React hook-larga ham tegishli.'
    },
    {
      question: 'SRP ni React component-da qanday qo\'llaysiz?',
      answer: 'React-da SRP: 1) Component faqat UI render qiladi — biznes logikani custom hook-ga chiqaring. 2) useAuth() — faqat autentifikatsiya, useFetch() — faqat data fetching. 3) API qatlami alohida (services/), state management alohida (stores/). 4) Form validatsiya alohida util. Masalan: UserProfile componenti faqat ko\'rsatadi, useUser() hook data oladi, userApi.ts server bilan ishlaydi.'
    },
    {
      question: 'OCP ni JavaScript-da qanday amalga oshirish mumkin?',
      answer: 'OCP ni JS-da bir necha usulda: 1) Strategy pattern — algoritmni tashqaridan berish (discount calculator). 2) Plugin system — register/use orqali kengaytirish (Express middleware). 3) Higher-order functions — funksiyani argument sifatida berish. 4) Event system — yangi handler qo\'shish uchun mavjud kodni o\'zgartirmaslik. 5) Composition — kichik funksiyalarni birlashtirish. Asosiy g\'oya: mavjud kodni o\'zgartirmay, yangi kod QOSHISH orqali kengaytirish.'
    },
    {
      question: 'DIP ni frontend loyihada qanday ishlatish mumkin?',
      answer: 'DIP frontend-da: 1) API client-ni abstraktsiya qilish — component to\'g\'ridan-to\'g\'ri fetch/axios chaqirmaydi, apiClient orqali ishlaydi. Test-da mock berish oson. 2) Storage abstraktsiyasi — localStorage, sessionStorage, AsyncStorage uchun bir interface. 3) React Context — dependency injection mexanizmi. 4) Service layer — Component → Hook → Service → API. Har bir qatlam o\'z abstraktsiyasiga bog\'liq, konkret implementatsiyaga emas.'
    },
    {
      question: 'SOLID qachon ortiqcha (over-engineering) bo\'ladi?',
      answer: 'SOLID ortiqcha bo\'ladigan holatlar: 1) Kichik skript yoki bir martalik util — SRP uchun 5 ta fayl yaratish keraksiz. 2) MVP/prototype — tezlik muhimroq. 3) Oddiy CRUD — murakkab abstraktsiya kerak emas. 4) "Kelajakda kerak bo\'lar" deb hozirdan abstraktsiya qilish — YAGNI prinsipi buziladi. Yaxshi mezon: agar refactoring qilinmasa darstur ishlash qiyinlashsa yoki bug ko\'paysa — SOLID kerak. Aks holda KISS (Keep It Simple) yaxshiroq.'
    }
  ],

  relatedTopics: [
    { techId: 'javascript', sectionId: 'oop-classes', topicId: 'classes', label: 'ES6 Classes' },
    { techId: 'javascript', sectionId: 'oop-classes', topicId: 'design-patterns-oop', label: 'Design Patterns' },
    { techId: 'javascript', sectionId: 'oop-classes', topicId: 'inheritance', label: 'Inheritance' }
  ]
}
