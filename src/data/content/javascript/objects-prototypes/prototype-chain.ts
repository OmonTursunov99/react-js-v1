import type { Topic } from '../../../types'

export const prototypeChain: Topic = {
  id: 'prototype-chain',
  title: 'Prototype Chain',
  importance: 3,
  status: 'to-learn',
  description: '[[Prototype]] zanjiri, meros mexanizmi va property lookup',
  content: `JavaScript — prototype-based (prototipga asoslangan) til. Class-based tillardan (Java, C++) farqli, JavaScript-da meros PROTOTYPE CHAIN orqali ishlaydi. Har bir object boshqa object-ga bog'langan va undan property/metod meros olishi mumkin.

═══════════════════════════════════════
  [[PROTOTYPE]] — ICHKI SLOT
═══════════════════════════════════════

Har bir object-da yashirin [[Prototype]] ichki slot mavjud.
Bu slot boshqa object-ga (yoki null-ga) referens saqlaydi:

1. __proto__ — eski usul (getter/setter):
   const obj = {}
   obj.__proto__ === Object.prototype  // true

2. Object.getPrototypeOf() — STANDART usul:
   Object.getPrototypeOf(obj) === Object.prototype  // true

3. Object.setPrototypeOf() — prototype-ni o'zgartirish:
   Object.setPrototypeOf(child, parent)

MUHIM: __proto__ — standart emas (legacy). Doim
Object.getPrototypeOf / Object.setPrototypeOf ishlatish kerak.
setPrototypeOf — juda SEKIN, ishlatmaslik tavsiya etiladi.

═══════════════════════════════════════
  PROTOTYPE CHAIN LOOKUP MEXANIZMI
═══════════════════════════════════════

Property qidirilganda JavaScript quyidagi tartibda izlaydi:

1. Object-ning O'Z property-larida qidiradi
2. Topilmasa — [[Prototype]] ga o'tadi
3. Topilmasa — prototype-ning prototype-iga o'tadi
4. ... va hokazo, ZANJIR oxirigacha
5. Oxiri — Object.prototype (null ga bog'langan)
6. null — ZANJIR TUGADI, undefined qaytaradi

  child -> parent -> grandparent -> Object.prototype -> null

Misol:
  const animal = { eats: true }
  const rabbit = Object.create(animal)
  rabbit.jumps = true

  rabbit.jumps   // true — O'Z property
  rabbit.eats    // true — prototype-dan (animal)
  rabbit.toString // function — Object.prototype-dan

═══════════════════════════════════════
  OBJECT.PROTOTYPE — ZANJIR OXIRI
═══════════════════════════════════════

Barcha oddiy objectlar zanjirining oxiri Object.prototype:

  Object.prototype.toString()
  Object.prototype.hasOwnProperty()
  Object.prototype.valueOf()
  Object.prototype.constructor

  Object.getPrototypeOf(Object.prototype) === null  // true
  // Object.prototype-ning prototype-i NULL — zanjir tugadi

Maxsus holatlar:
  Object.create(null)  // prototype YO'Q — toString ham yo'q
  // "Toza" dictionary — hech qanday meros yo'q

═══════════════════════════════════════
  PROPERTY SHADOWING
═══════════════════════════════════════

Agar child va prototype-da BIR XIL nomdagi property bo'lsa,
child-niki "shadow" qiladi (yashiradi) — prototype-dagi ko'rinmaydi:

  const parent = { name: 'Parent', greet() { return 'Salom' } }
  const child = Object.create(parent)
  child.name = 'Child'  // SHADOWING — parent.name yashirildi

  child.name     // 'Child' — o'z property
  parent.name    // 'Parent' — o'zgarmagan

  delete child.name
  child.name     // 'Parent' — endi prototype-dan ko'rinadi

MUHIM: Shadowing faqat O'QISH uchun ishlaydi.
YOZISH har doim object-ning O'ZIGA yozadi (prototype-ga EMAS).

═══════════════════════════════════════
  PROTOTYPE VA CONSTRUCTOR FUNCTION
═══════════════════════════════════════

new bilan chaqirilgan funksiyaning .prototype property-si
yaratilgan object-ning [[Prototype]]-iga aylanadi:

  function Person(name) { this.name = name }
  Person.prototype.greet = function() {
    return 'Salom, ' + this.name
  }

  const ali = new Person('Ali')
  ali.greet()  // 'Salom, Ali'

  Object.getPrototypeOf(ali) === Person.prototype  // true
  ali.constructor === Person  // true

═══════════════════════════════════════
  PERFORMANCE: OWN vs PROTOTYPE LOOKUP
═══════════════════════════════════════

1. Own property — ENG TEZ. To'g'ridan-to'g'ri murojaat
2. Prototype lookup — har bir zanjir bo'g'ini +1 qidiruv
3. Chuqur zanjir = sekin qidiruv

Optimizatsiya:
- Ko'p ishlatiladigan property-larni O'Z property sifatida saqlash
- Prototype zanjirini keraksiz chuqurlashtirmaslik
- hasOwnProperty/Object.hasOwn bilan tekshirish

V8 engine optimizatsiyasi:
- Hidden class (shape) — bir xil tuzilmadagi objectlar uchun
  bir xil lookup mexanizm ishlatiladi (inline caching)
- Prototype lookup ham keshlanadi (prototype chain integrity check)

═══════════════════════════════════════
  FOR...IN VA PROTOTYPE
═══════════════════════════════════════

for...in — prototype chain-dagi BARCHA enumerable
property-larni sanaydi. Bu ko'pincha kutilmagan:

  for (const key in child) { ... }
  // O'z property-lari + prototype property-lari

Yechim:
  for (const key in child) {
    if (Object.hasOwn(child, key)) { ... }
  }

  // Yoki Object.keys — FAQAT o'z property-lari:
  Object.keys(child).forEach(key => { ... })`,
  codeExamples: [
    {
      title: 'Prototype chain va property lookup',
      language: 'js',
      code: `// Prototype chain yaratish
const grandparent = {
  family: 'Valiyevlar',
  toString() { return \`[\${this.family}]\` },
}

const parent = Object.create(grandparent)
parent.role = 'ota'

const child = Object.create(parent)
child.name = 'Ali'

// Property lookup — zanjir bo'ylab qidiradi
console.log(child.name)    // 'Ali'         — O'Z property
console.log(child.role)    // 'ota'         — parent-dan
console.log(child.family)  // 'Valiyevlar'  — grandparent-dan

// Zanjirni tekshirish
console.log(Object.getPrototypeOf(child) === parent)            // true
console.log(Object.getPrototypeOf(parent) === grandparent)      // true
console.log(Object.getPrototypeOf(grandparent) === Object.prototype) // true
console.log(Object.getPrototypeOf(Object.prototype) === null)   // true

// child -> parent -> grandparent -> Object.prototype -> null

// hasOwn bilan tekshirish
console.log(Object.hasOwn(child, 'name'))    // true — o'z
console.log(Object.hasOwn(child, 'role'))    // false — prototype-dan
console.log(Object.hasOwn(child, 'family'))  // false — prototype-dan

// "in" — prototype-ni HAM tekshiradi
console.log('name' in child)    // true
console.log('role' in child)    // true
console.log('family' in child)  // true`,
      description: 'Property topilmaguncha JavaScript prototype zanjirini oxirigacha bosib o\'tadi. hasOwn faqat o\'z property-ni, "in" esa zanjirni ham tekshiradi.',
    },
    {
      title: 'Property shadowing va delete',
      language: 'js',
      code: `const animal = {
  type: 'Animal',
  speak() { return \`\${this.type} gapiradi\` },
}

const dog = Object.create(animal)
dog.type = 'Dog'     // SHADOWING — animal.type yashirildi
dog.bark = function() { return 'Vov!' }

console.log(dog.type)      // 'Dog' — o'z property (shadow)
console.log(animal.type)   // 'Animal' — o'zgarmagan
console.log(dog.speak())   // 'Dog gapiradi' — this = dog

// Shadowing-ni olib tashlash
delete dog.type
console.log(dog.type)      // 'Animal' — endi prototype-dan

// YOZISH doim O'ZIGA yozadi
dog.type = 'Puppy'         // yangi own property yaratildi
console.log(dog.type)      // 'Puppy'

// Prototype-dagi property-ni O'ZGARTIRISH
animal.type = 'Creature'
delete dog.type
console.log(dog.type)      // 'Creature' — prototype o'zgardi

// MUHIM: yozish prototype-ga TA'SIR QILMAYDI
const base = { count: 0 }
const obj = Object.create(base)
obj.count++                // obj.count = obj.count + 1
                           // O'QISH: base-dan 0
                           // YOZISH: obj-ga 1

console.log(obj.count)    // 1 — o'z property
console.log(base.count)   // 0 — o'zgarmagan!
console.log(Object.hasOwn(obj, 'count'))  // true — yangi own property`,
      description: 'Shadowing — o\'z property prototype-dagini yashiradi. YOZISH doim object-ning O\'ZIGA yozadi, prototype-ni o\'zgartirmaydi. delete bilan shadow olib tashlanadi.',
    },
    {
      title: 'Constructor function va prototype',
      language: 'js',
      code: `// Constructor function
function Person(name, age) {
  this.name = name   // har bir instance-da O'Z property
  this.age = age
}

// Prototype-ga metod qo'shish — barcha instance-lar ULASHADI
Person.prototype.greet = function() {
  return \`Salom, men \${this.name}, \${this.age} yoshdaman\`
}

Person.prototype.species = 'Homo sapiens'

const ali = new Person('Ali', 25)
const vali = new Person('Vali', 30)

console.log(ali.greet())   // 'Salom, men Ali, 25 yoshdaman'
console.log(vali.greet())  // 'Salom, men Vali, 30 yoshdaman'

// Metod BIR XIL referens — xotirani tejaydi
console.log(ali.greet === vali.greet)  // true — prototype-dan

// O'z property-lar ALOHIDA
console.log(ali.name === vali.name)    // false

// Prototype chain
console.log(Object.getPrototypeOf(ali) === Person.prototype)  // true
console.log(ali.constructor === Person)   // true
console.log(ali instanceof Person)        // true

// Prototype zanjiri
// ali -> Person.prototype -> Object.prototype -> null

// class — prototype-ning "syntactic sugar"
class Animal {
  constructor(name) { this.name = name }  // O'Z property
  speak() { return \`\${this.name} gapiradi\` } // prototype-ga qo'shiladi
}

const cat = new Animal('Mushuk')
console.log(Object.getPrototypeOf(cat) === Animal.prototype) // true
console.log(typeof Animal)  // 'function' — class aslida function`,
      description: 'Constructor prototype-ga qo\'shilgan metodlar barcha instance-lar orasida ULASHILADI — xotira tejaydi. class aslida prototype-ning syntactic sugar-i.',
    },
    {
      title: 'Prototype chain bilan meros',
      language: 'js',
      code: `// Prototype chain bilan meros (ES5 usul)
function Animal(name) {
  this.name = name
}
Animal.prototype.speak = function() {
  return \`\${this.name} ovoz chiqaradi\`
}

function Dog(name, breed) {
  Animal.call(this, name)  // super() o'rniga
  this.breed = breed
}

// Meros zanjirini o'rnatish
Dog.prototype = Object.create(Animal.prototype)
Dog.prototype.constructor = Dog  // constructor-ni tiklash

Dog.prototype.bark = function() {
  return \`\${this.name} vov deydi!\`
}

const rex = new Dog('Rex', 'Labrador')
console.log(rex.speak())  // 'Rex ovoz chiqaradi' (Animal-dan)
console.log(rex.bark())   // 'Rex vov deydi!'     (Dog-dan)

// Zanjir: rex -> Dog.prototype -> Animal.prototype -> Object.prototype -> null
console.log(rex instanceof Dog)     // true
console.log(rex instanceof Animal)  // true

// ES6 class bilan (osonroq)
class Shape {
  constructor(color) { this.color = color }
  describe() { return \`\${this.color} shakl\` }
}

class Circle extends Shape {
  constructor(color, radius) {
    super(color)          // Shape.call(this, color) o'rniga
    this.radius = radius
  }
  area() { return Math.PI * this.radius ** 2 }
}

const c = new Circle('qizil', 5)
console.log(c.describe())  // 'qizil shakl'
console.log(c.area())      // 78.54...

// Zanjir: c -> Circle.prototype -> Shape.prototype -> Object.prototype -> null`,
      description: 'ES5-da meros qo\'lda yaratiladi (Object.create + constructor). ES6 class/extends — syntactic sugar, lekin ichida prototype chain ishlatiladi.',
    },
    {
      title: 'Performance — own property vs prototype lookup',
      language: 'js',
      code: `// Prototype lookup narxi
const deep3 = { z: 'found' }
const deep2 = Object.create(deep3)
const deep1 = Object.create(deep2)
const obj = Object.create(deep1)

// obj.z topish uchun 3 ta zanjir bosqichi kerak
// obj -> deep1 -> deep2 -> deep3 (TOPILDI: z)

// Own property — tezroq
obj.z = 'own'     // O'z property — lookup 0 bosqich

// hasOwn bilan optimallashtirish
function getProperty(obj, key) {
  // Avval o'zida qidirish — tezroq
  if (Object.hasOwn(obj, key)) {
    return obj[key]
  }
  // Keyin prototype chain
  return obj[key]
}

// V8 optimizatsiyasi — hidden class
// Bir xil tartibda yaratilgan objectlar bir xil "shape"ga ega
const user1 = { name: 'Ali', age: 25 }   // shape: {name, age}
const user2 = { name: 'Vali', age: 30 }  // AYNI shape — inline cache ishlaydi

// NOTO'G'RI — har xil tartib = har xil shape = sekin
const user3 = { age: 35, name: 'Soli' }  // shape: {age, name} — BOSHQA

// for...in performance muammosi
const parent = {}
for (let i = 0; i < 100; i++) {
  parent[\`method_\${i}\`] = function() {}
}
const child = Object.create(parent)
child.ownProp = 'value'

// for...in — 101 ta property sanaydi (1 own + 100 prototype)
// Object.keys — faqat 1 ta (own property)
console.log(Object.keys(child).length)  // 1 — tezroq`,
      description: 'Own property lookup tezroq. Prototype zanjiri chuqur bo\'lsa, qidiruv sekinlashadi. V8 inline caching va hidden class bilan optimallashtiradi.',
    },
  ],
  interviewQA: [
    {
      question: '[[Prototype]] nima va __proto__ dan farqi nima?',
      answer: '[[Prototype]] — har bir object-dagi ICHKI (internal) slot. Unga to\'g\'ridan-to\'g\'ri murojaat qilib bo\'lmaydi. __proto__ — bu [[Prototype]]-ga getter/setter orqali murojaat qilish usuli (legacy, non-standard). Standart usullar: Object.getPrototypeOf(obj) — o\'qish, Object.setPrototypeOf(obj, proto) — yozish. __proto__ brauzerlarda ishlaydi, lekin spetsifikatsiya buni majburiy qilmaydi.',
    },
    {
      question: 'Prototype chain qanday ishlaydi? Property qanday topiladi?',
      answer: 'JavaScript property-ni quyidagi tartibda izlaydi: 1) Object-ning O\'Z (own) property-larida. 2) Topilmasa — [[Prototype]] (parent) ga o\'tadi. 3) Parent-da topilmasa — parent-ning prototype-iga. 4) Zanjir oxiri — Object.prototype (uning prototype-i null). 5) null — zanjir tugadi, undefined qaytariladi. Bu jarayon har qanday property o\'qishda avtomatik sodir bo\'ladi.',
    },
    {
      question: 'Property shadowing nima?',
      answer: 'Agar child object-da va uning prototype-da BIR XIL nomdagi property bo\'lsa, child-niki "shadow" (yashiradi) qiladi — prototype-dagi ko\'rinmaydi. O\'qishda — doim child-niki qaytadi. Yozishda — doim child-ga yoziladi (prototype o\'zgarmaydi). delete bilan child-dagi shadow olib tashlansa, prototype-dagi qaytadan ko\'rinadi. Bu muhim: obj.count++ aslida O\'QISH + YOZISH, ya\'ni prototype-dan o\'qib, child-ga yangi own property yozadi.',
    },
    {
      question: 'class va prototype farqi nima? class syntactic sugar degani nimani anglatadi?',
      answer: 'ES6 class — prototype-based meros ustiga qurilgan "syntactic sugar" (qulay sintaksis). class Person { greet() {} } yozganingizda, JavaScript aslida: 1) Person funksiyasi yaratadi (constructor). 2) greet metodini Person.prototype-ga qo\'shadi. extends esa Object.create bilan prototype chain yaratadi. typeof class === "function". class faqat sintaksis farqi — ichki mexanizm bir xil prototype chain.',
    },
    {
      question: 'Object.create(null) va oddiy {} farqi nima?',
      answer: 'Oddiy {} — Object.prototype-dan meros oladi (toString, hasOwnProperty, constructor va boshqalar mavjud). Object.create(null) — prototype UMUMAN yo\'q. toString, hasOwnProperty ham yo\'q. Bu "toza" dictionary sifatida ishlatiladi — foydalanuvchi kalitlari prototype metodlari bilan to\'qnashmaydi. Masalan: obj["toString"] = "test" oddiy object-da muammo bo\'lishi mumkin, Object.create(null) da xavfsiz.',
    },
    {
      question: 'Prototype lookup performance-ga qanday ta\'sir qiladi?',
      answer: 'Own property lookup — eng tez (to\'g\'ridan-to\'g\'ri). Har bir prototype zanjir bo\'g\'ini +1 qidiruv qo\'shadi. Chuqur zanjir = sekin. Lekin V8 engine bu muammoni optimallashtiradi: 1) Inline caching — bir xil tuzilmadagi objectlar uchun lookup natijasini keshlab qo\'yadi. 2) Hidden class (shape) — bir xil tartibda yaratilgan objectlar bir xil optimizatsiya oladi. Amalda prototype lookup juda tez, lekin hot path-da own property yaxshiroq.',
    },
  ],
  relatedTopics: [
    { techId: 'javascript', sectionId: 'objects-prototypes', topicId: 'object-basics', label: 'Object Basics' },
    { techId: 'javascript', sectionId: 'objects-prototypes', topicId: 'object-create', label: 'Object.create & Object metodlari' },
    { techId: 'javascript', sectionId: 'objects-prototypes', topicId: 'new-keyword', label: 'new Keyword' },
    { techId: 'javascript', sectionId: 'objects-prototypes', topicId: 'this-keyword', label: 'this Keyword' },
  ],
}
