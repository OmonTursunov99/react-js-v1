import type { Topic } from '../../../types'

export const newKeyword: Topic = {
  id: 'new-keyword',
  title: 'new Keyword',
  importance: 3,
  status: 'to-learn',
  description: 'new operatori mexanizmi, constructor function, instanceof va factory pattern',
  content: `new operatori — JavaScript-da object yaratishning asosiy mexanizmi. U oddiy funksiyani "constructor" ga aylantiradi va yangi object yaratish jarayonini boshqaradi. class ham ichida new mexanizmini ishlatadi.

═══════════════════════════════════════
  NEW OPERATORI — 4 BOSQICH
═══════════════════════════════════════

new Func(args) chaqirilganda JavaScript 4 ta bosqichni bajaradi:

1. YANGI BO'SH OBJECT YARATILADI:
   const obj = {}

2. PROTOTYPE BOG'LANADI:
   Object.setPrototypeOf(obj, Func.prototype)
   // obj.__proto__ = Func.prototype

3. CONSTRUCTOR CHAQIRILADI:
   Func.call(obj, args)
   // this = obj bo'lib, funksiya ichida property-lar qo'shiladi

4. NATIJA QAYTARILADI:
   - Agar constructor object QAYTARSA → shu object qaytadi
   - Agar primitive qaytarsa yoki return yo'q → obj qaytadi

MUHIM: 4-bosqich — ko'p dasturchilar bilmaydigan narsa.
Agar constructor ichida return { ... } yozilsa,
new yaratgan object TASHLANADI va return qilingan object qaytadi.

═══════════════════════════════════════
  CONSTRUCTOR FUNCTION PATTERN
═══════════════════════════════════════

Konvensiya: constructor nomi BOSH HARF bilan boshlanadi:

  function Person(name, age) {
    // this = yangi bo'sh object (new tomonidan yaratilgan)
    this.name = name
    this.age = age
    this.greet = function() {
      return 'Salom, ' + this.name
    }
    // return this — avtomatik (yozish shart emas)
  }

  const ali = new Person('Ali', 25)

MUHIM: Har bir instance-da greet ALOHIDA funksiya.
Xotirani tejash uchun prototype-ga qo'shish kerak:

  function Person(name) { this.name = name }
  Person.prototype.greet = function() {
    return 'Salom, ' + this.name
  }

  // Endi greet — BIR funksiya, barcha instance-lar ulashadi

═══════════════════════════════════════
  NEW BILAN VA NEW-SIZ FARQI
═══════════════════════════════════════

  function User(name) {
    this.name = name
  }

  const a = new User('Ali')  // a = { name: 'Ali' }
  const b = User('Ali')      // b = undefined, window.name = 'Ali'!

new-siz chaqirilganda:
- this = window (non-strict) yoki undefined (strict)
- Funksiya oddiy funksiya sifatida ishlaydi
- return yo'q bo'lsa undefined qaytadi

Bu xavfli — new yozish unutilsa, global object ifloslanadi.

═══════════════════════════════════════
  INSTANCEOF OPERATORI
═══════════════════════════════════════

Object-ning constructor-ini tekshirish:

  ali instanceof Person         // true
  ali instanceof Object         // true (prototype chain)
  ali instanceof Array          // false

instanceof QANDAY ISHLAYDI:
  Person.prototype === Object.getPrototypeOf(ali) yoki
  uning prototype chain-ida BOR-YO'Q-ligini tekshiradi.

  // Qo'lda tekshirish:
  Object.getPrototypeOf(ali) === Person.prototype  // true

MUHIM: instanceof prototype chain-ni tekshiradi.
Agar prototype o'zgartirilsa, instanceof natijasi ham o'zgaradi.

═══════════════════════════════════════
  NEW.TARGET
═══════════════════════════════════════

ES6 da qo'shilgan — funksiya new bilan chaqirilgan-chaqirilmaganini aniqlash:

  function User(name) {
    if (!new.target) {
      return new User(name)  // new-siz ham ishlaydi
    }
    this.name = name
  }

  const a = new User('Ali')  // normal
  const b = User('Ali')      // ham ishlaydi — new.target tekshiradi

  // class ichida
  class Shape {
    constructor() {
      if (new.target === Shape) {
        throw new Error('Shape to\\'g\\'ridan-to\\'g\\'ri yaratib bo\\'lmaydi')
      }
    }
  }
  class Circle extends Shape { ... }  // OK — new.target = Circle

new.target qiymati:
  - new Func() → new.target = Func
  - Func() → new.target = undefined

═══════════════════════════════════════
  FACTORY FUNCTION PATTERN
═══════════════════════════════════════

new-siz object yaratish — constructor-ga alternativa:

  function createUser(name, age) {
    return {
      name,
      age,
      greet() { return 'Salom, ' + name },  // closure
    }
  }

  const ali = createUser('Ali', 25)  // new KERAK EMAS

═══════════════════════════════════════
  FACTORY VS CONSTRUCTOR — SOLISHTIRISH
═══════════════════════════════════════

CONSTRUCTOR (new bilan):
  ✅ instanceof ishlaydi
  ✅ Prototype orqali metod ulashish (xotira tejash)
  ✅ class sintaksisi bilan ishlaydi
  ❌ new yozish unutilsa xatolik
  ❌ this muammolari

FACTORY (new-siz):
  ✅ new kerak emas — oddiy funksiya
  ✅ this muammosi yo'q (closure ishlatadi)
  ✅ Private ma'lumotlar (closure)
  ❌ instanceof ISHLAMAYDI
  ❌ Har instance-da alohida metod nusxasi (xotira ko'p)
  ❌ Prototype ulashish qiyin

═══════════════════════════════════════
  CLASS — CONSTRUCTOR SUGAR
═══════════════════════════════════════

ES6 class aslida constructor function-ning "syntactic sugar":

  class Person {
    constructor(name) { this.name = name }
    greet() { return 'Salom, ' + this.name }
  }

  // Yuqoridagi class AYNAN shunga teng:
  function Person(name) { this.name = name }
  Person.prototype.greet = function() {
    return 'Salom, ' + this.name
  }

Farq: class-ni new-SIZ chaqirib BO'LMAYDI (TypeError).
Constructor function-ni esa chaqirish mumkin (xavfli).`,
  codeExamples: [
    {
      title: 'new operatori — 4 bosqich amalda',
      language: 'js',
      code: `// Constructor function
function Person(name, age) {
  // 1. Yangi bo'sh object yaratildi (avtomatik)
  // 2. this.__proto__ = Person.prototype (avtomatik)
  // 3. Constructor ishlaydi:
  this.name = name
  this.age = age
  // 4. return this (avtomatik)
}

const ali = new Person('Ali', 25)
console.log(ali)          // Person { name: 'Ali', age: 25 }
console.log(ali.__proto__ === Person.prototype)  // true

// new mexanizmini qo'lda simulatsiya qilish
function myNew(Constructor, ...args) {
  // 1. Yangi bo'sh object
  const obj = {}

  // 2. Prototype bog'lash
  Object.setPrototypeOf(obj, Constructor.prototype)

  // 3. Constructor chaqirish
  const result = Constructor.apply(obj, args)

  // 4. Agar object qaytarsa — shu, aks holda obj
  return result instanceof Object ? result : obj
}

const vali = myNew(Person, 'Vali', 30)
console.log(vali)                    // { name: 'Vali', age: 30 }
console.log(vali instanceof Person)  // true

// 4-bosqich namoyishi — return object
function Strange() {
  this.a = 1
  return { b: 2 }  // OBJECT qaytarsa — this tashlanadi!
}
const s = new Strange()
console.log(s)  // { b: 2 } — this.a yo'qoldi!

// Primitive return — e'tiborga olinmaydi
function Normal() {
  this.a = 1
  return 42  // primitive — e'tiborga olinmaydi
}
const n = new Normal()
console.log(n)  // Normal { a: 1 } — 42 e'tiborga olinmadi`,
      description: 'new 4 bosqichda ishlaydi. Constructor-dan object return qilinsa, u this o\'rniga qaytadi. Primitive return e\'tiborga olinmaydi.',
    },
    {
      title: 'Constructor function va prototype',
      language: 'js',
      code: `// NOTO'G'RI — har instance-da alohida funksiya
function UserBad(name) {
  this.name = name
  this.greet = function() { return 'Salom, ' + this.name }
}

const a = new UserBad('Ali')
const b = new UserBad('Vali')
console.log(a.greet === b.greet)  // false — 2 ta ALOHIDA funksiya!

// TO'G'RI — prototype-da ulashilgan metod
function UserGood(name) {
  this.name = name  // har instance-da o'z qiymati
}
UserGood.prototype.greet = function() {
  return 'Salom, ' + this.name
}

const c = new UserGood('Ali')
const d = new UserGood('Vali')
console.log(c.greet === d.greet)  // true — BIR funksiya!
console.log(c.greet())  // 'Salom, Ali'
console.log(d.greet())  // 'Salom, Vali'

// Prototype chain
console.log(Object.getPrototypeOf(c) === UserGood.prototype)  // true
console.log(c.constructor === UserGood)  // true

// Meros (inheritance)
function Admin(name, level) {
  UserGood.call(this, name)  // super() o'rniga
  this.level = level
}
Admin.prototype = Object.create(UserGood.prototype)
Admin.prototype.constructor = Admin  // constructor-ni tiklash

Admin.prototype.promote = function() {
  this.level++
  return \`\${this.name} endi \${this.level}-darajali\`
}

const admin = new Admin('Soli', 1)
console.log(admin.greet())     // 'Salom, Soli' — UserGood-dan meros
console.log(admin.promote())   // 'Soli endi 2-darajali'
console.log(admin instanceof Admin)     // true
console.log(admin instanceof UserGood)  // true`,
      description: 'Prototype-ga qo\'shilgan metodlar barcha instance-lar orasida ulashiladi — xotira tejaydi. Constructor ichida metod yaratish xotira isrof qiladi.',
    },
    {
      title: 'instanceof va new.target',
      language: 'js',
      code: `// instanceof — prototype chain tekshiradi
function Animal(name) { this.name = name }
function Dog(name, breed) {
  Animal.call(this, name)
  this.breed = breed
}
Dog.prototype = Object.create(Animal.prototype)
Dog.prototype.constructor = Dog

const rex = new Dog('Rex', 'Labrador')
console.log(rex instanceof Dog)     // true
console.log(rex instanceof Animal)  // true
console.log(rex instanceof Object)  // true
console.log(rex instanceof Array)   // false

// instanceof aslida nima tekshiradi:
// Dog.prototype prototype chain-da BOR-mi?
console.log(Dog.prototype.isPrototypeOf(rex))  // true

// new.target — new bilan chaqirilganini tekshirish
function SafeUser(name) {
  if (!new.target) {
    // new-siz chaqirildi — avtomatik new qilish
    return new SafeUser(name)
  }
  this.name = name
}

const user1 = new SafeUser('Ali')   // normal
const user2 = SafeUser('Vali')      // ham ishlaydi!
console.log(user1 instanceof SafeUser)  // true
console.log(user2 instanceof SafeUser)  // true

// Abstract class pattern — new.target bilan
class Shape {
  constructor(color) {
    if (new.target === Shape) {
      throw new Error('Shape abstrakt — to\\'g\\'ridan-to\\'g\\'ri yaratish mumkin emas!')
    }
    this.color = color
  }
}

class Circle extends Shape {
  constructor(color, radius) {
    super(color)   // new.target = Circle (Shape emas)
    this.radius = radius
  }
}

// new Shape('red')          // Error: Shape abstrakt!
const circle = new Circle('qizil', 5)  // OK — new.target = Circle
console.log(circle.color)   // 'qizil'`,
      description: 'instanceof prototype chain-ni tekshiradi. new.target — funksiya new bilan chaqirilganini aniqlaydi, abstract class pattern uchun ishlatiladi.',
    },
    {
      title: 'Factory function vs Constructor',
      language: 'js',
      code: `// FACTORY FUNCTION — new kerak emas
function createUser(name, age) {
  // Private ma'lumot (closure orqali)
  let _loginCount = 0

  return {
    name,
    age,
    login() {
      _loginCount++
      return \`\${name} tizimga kirdi (\${_loginCount}-marta)\`
    },
    getLoginCount() {
      return _loginCount
    },
  }
}

const ali = createUser('Ali', 25)
console.log(ali.login())           // 'Ali tizimga kirdi (1-marta)'
console.log(ali.login())           // 'Ali tizimga kirdi (2-marta)'
console.log(ali._loginCount)       // undefined — PRIVATE!
console.log(ali.getLoginCount())   // 2

// CONSTRUCTOR FUNCTION — new bilan
function User(name, age) {
  this.name = name
  this.age = age
}
User.prototype.login = function() {
  return \`\${this.name} tizimga kirdi\`
}

const vali = new User('Vali', 30)
console.log(vali.login())            // 'Vali tizimga kirdi'
console.log(vali instanceof User)    // true — ishlaydi!

// Factory — instanceof ISHLAMAYDI
console.log(ali instanceof Object)  // true (lekin createUser emas)

// CLASS — zamonaviy constructor
class ModernUser {
  #loginCount = 0  // true private (ES2022)

  constructor(name, age) {
    this.name = name
    this.age = age
  }

  login() {
    this.#loginCount++
    return \`\${this.name} kirdi (\${this.#loginCount}-marta)\`
  }

  get loginCount() { return this.#loginCount }
}

const soli = new ModernUser('Soli', 28)
console.log(soli.login())       // 'Soli kirdi (1-marta)'
// console.log(soli.#loginCount) // SyntaxError: private field
console.log(soli instanceof ModernUser)  // true`,
      description: 'Factory — private closure, this muammo yo\'q, lekin instanceof ishlamaydi. Constructor — prototype ulashish, instanceof ishlaydi. Class — ikkalasining yaxshi tomonlari.',
    },
    {
      title: 'class va constructor function ekvivalentligi',
      language: 'js',
      code: `// ES6 CLASS
class Animal {
  constructor(name, sound) {
    this.name = name
    this.sound = sound
  }

  speak() {
    return \`\${this.name}: \${this.sound}!\`
  }

  static create(name, sound) {
    return new Animal(name, sound)
  }
}

class Dog extends Animal {
  constructor(name) {
    super(name, 'Vov')
    this.tricks = []
  }

  learn(trick) {
    this.tricks.push(trick)
    return this
  }

  showTricks() {
    return \`\${this.name} biladi: \${this.tricks.join(', ')}\`
  }
}

// YUQORIDAGI CLASS AYNAN SHUNGA TENG (ES5):
function AnimalES5(name, sound) {
  this.name = name
  this.sound = sound
}
AnimalES5.prototype.speak = function() {
  return \`\${this.name}: \${this.sound}!\`
}
AnimalES5.create = function(name, sound) {  // static
  return new AnimalES5(name, sound)
}

function DogES5(name) {
  AnimalES5.call(this, name, 'Vov')  // super()
  this.tricks = []
}
DogES5.prototype = Object.create(AnimalES5.prototype)
DogES5.prototype.constructor = DogES5

DogES5.prototype.learn = function(trick) {
  this.tricks.push(trick)
  return this
}

// Ikkalasi ham bir xil ishlaydi
const rex = new Dog('Rex')
rex.learn('o\\'tir').learn('ber').learn('yot')
console.log(rex.speak())       // 'Rex: Vov!'
console.log(rex.showTricks())  // 'Rex biladi: o\\'tir, ber, yot'
console.log(rex instanceof Dog)     // true
console.log(rex instanceof Animal)  // true

// ASOSIY FARQ: class-ni new-siz chaqirib BO'LMAYDI
// Animal('Mushuk', 'Miyov')  // TypeError!
// AnimalES5('Mushuk', 'Miyov')  // ishlaydi (xavfli!)

console.log(typeof Animal)  // 'function' — class = function`,
      description: 'class — constructor function-ning syntactic sugar. Farq: class new-siz chaqirilsa TypeError beradi, constructor function esa jimgina ishlaydi (xavfli).',
    },
  ],
  interviewQA: [
    {
      question: 'new operatori qanday ishlaydi? 4 bosqichni tushuntiring.',
      answer: 'new Func(args) 4 bosqichda ishlaydi: 1) Bo\'sh object yaratiladi: {} 2) Object-ning [[Prototype]]-i Func.prototype-ga bog\'lanadi. 3) Func this=yangiObject bilan chaqiriladi (constructor ishlaydi). 4) Agar constructor OBJECT return qilsa — shu qaytadi. Agar primitive return qilsa yoki return yo\'q — yangi object qaytadi. Ko\'p dasturchilar 4-bosqichni bilmaydi: return {} yozilsa, new yaratgan object tashlanadi.',
    },
    {
      question: 'Constructor function va factory function farqi nima?',
      answer: 'Constructor: new bilan chaqiriladi, this = yangi object, prototype orqali metod ulashish (xotirani tejaydi), instanceof ishlaydi. Factory: oddiy funksiya, new kerak emas, object literal qaytaradi, closure orqali private data, this muammo yo\'q. Kamchiliklari: constructor — new unutilsa xavfli, this binding muammolari. Factory — instanceof ishlamaydi, har instance-da alohida metod nusxasi, xotira ko\'p.',
    },
    {
      question: 'instanceof qanday ishlaydi?',
      answer: 'obj instanceof Func — Func.prototype obj-ning prototype chain-ida BOR-YO\'Q-ligini tekshiradi. Ya\'ni: Object.getPrototypeOf(obj) === Func.prototype, yoki uning prototype-i, yoki uning prototype-ining prototype-i... zanjir oxirigacha. Shuning uchun new Dog("Rex") instanceof Animal = true (agar Dog extends Animal). MUHIM: prototype o\'zgartirilsa, instanceof natijasi ham o\'zgaradi.',
    },
    {
      question: 'new.target nima va qanday ishlatiladi?',
      answer: 'new.target — ES6 meta-property. Funksiya new bilan chaqirilsa, new.target = shu funksiya/class. new-siz chaqirilsa, new.target = undefined. 2 ta asosiy foydalanish: 1) Safe constructor — if (!new.target) return new Func(args) — new-siz ham ishlaydi. 2) Abstract class — if (new.target === Shape) throw Error — to\'g\'ridan-to\'g\'ri yaratishni taqiqlash, faqat extends orqali.',
    },
    {
      question: 'class va constructor function farqi nima?',
      answer: 'class — constructor function-ning "syntactic sugar". typeof class === "function". Lekin muhim farqlar bor: 1) class-ni new-SIZ chaqirib bo\'lmaydi (TypeError). Constructor function-ni esa chaqirish mumkin (xavfli). 2) class metodlari non-enumerable (for...in da ko\'rinmaydi). 3) class ichida avtomatik strict mode. 4) class hoisting qilinmaydi (TDZ). 5) class ichida #private field va static qo\'llab-quvvatlanadi.',
    },
    {
      question: 'Nima uchun constructor ichida metod yaratish yomon?',
      answer: 'function User(name) { this.greet = function() {...} } — har bir new User() chaqiruvida greet funksiyasining YANGI NUSXASI yaratiladi. 1000 ta user = 1000 ta alohida funksiya = xotira isrof. Yechim: User.prototype.greet = function() {...} — BIR funksiya, barcha instance-lar prototype chain orqali ulashadi. class-da ham xuddi shunday: class ichidagi metodlar avtomatik prototype-ga qo\'shiladi.',
    },
  ],
  relatedTopics: [
    { techId: 'javascript', sectionId: 'objects-prototypes', topicId: 'this-keyword', label: 'this Keyword' },
    { techId: 'javascript', sectionId: 'objects-prototypes', topicId: 'prototype-chain', label: 'Prototype Chain' },
    { techId: 'javascript', sectionId: 'objects-prototypes', topicId: 'object-create', label: 'Object.create & Object metodlari' },
  ],
}
