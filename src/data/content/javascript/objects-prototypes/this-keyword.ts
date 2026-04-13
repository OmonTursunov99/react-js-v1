import type { Topic } from '../../../types'

export const thisKeyword: Topic = {
  id: 'this-keyword',
  title: 'this Keyword',
  importance: 3,
  status: 'to-learn',
  description: 'this binding qoidalari: default, implicit, explicit, new va arrow function',
  content: `this — JavaScript-da eng chalkash tushunchalardan biri. Boshqa tillardan farqli, JavaScript-da this QAYERDA ANIQLANGANI emas, QANDAY CHAQIRILGANIGA bog'liq. Bu 4 ta binding qoidasi bilan belgilanadi.

═══════════════════════════════════════
  4 TA BINDING QOIDASI (MUHIMLIK TARTIBI)
═══════════════════════════════════════

this qiymati funksiya CHAQIRILISH USULI bilan aniqlanadi:

1. new binding (eng kuchli):
   new Func() → this = yangi yaratilgan object

2. Explicit binding:
   func.call(obj) / func.apply(obj) / func.bind(obj)
   → this = berilgan object

3. Implicit binding:
   obj.method() → this = obj (nuqtadan oldingi object)

4. Default binding (eng zaif):
   func() → this = window (yoki undefined strict mode-da)

MUHIM: Qoidalar YUQORIDAN PASTGA tekshiriladi.
new > explicit > implicit > default

═══════════════════════════════════════
  DEFAULT BINDING
═══════════════════════════════════════

Funksiya oddiy chaqirilganda (hech qanday object-siz):

  function showThis() { console.log(this) }
  showThis()  // window (non-strict) yoki undefined (strict mode)

  'use strict'
  function strictShow() { console.log(this) }
  strictShow()  // undefined

MUHIM: ES modules va class ichida avtomatik strict mode.
Shuning uchun zamonaviy kod-da default this = undefined.

═══════════════════════════════════════
  IMPLICIT BINDING
═══════════════════════════════════════

Funksiya object metodi sifatida chaqirilganda:

  const user = {
    name: 'Ali',
    greet() { return this.name },
  }
  user.greet()  // 'Ali' — this = user (nuqtadan oldingi)

MUHIM: Implicit binding YO'QOLISHI mumkin!

  const greet = user.greet  // metodni ajratib olish
  greet()                    // undefined — this YO'QOLDI!
  // Chunki greet() oddiy funksiya sifatida chaqirildi

Bu "implicit binding loss" deyiladi va eng ko'p
uchraydigan this muammosi.

═══════════════════════════════════════
  EXPLICIT BINDING — CALL, APPLY, BIND
═══════════════════════════════════════

this-ni ANIQ belgilash:

1. call(thisArg, arg1, arg2, ...) — darhol chaqiradi:
   func.call(obj, 1, 2)

2. apply(thisArg, [args]) — darhol chaqiradi (args = array):
   func.apply(obj, [1, 2])

3. bind(thisArg, arg1, ...) — YANGI funksiya qaytaradi:
   const bound = func.bind(obj)
   bound()  // this = obj (doim)

call va apply — bir martalik chaqiruv.
bind — doimiy bog'lash (qayta chaqirganda ham this o'zgarmaydi).

MUHIM: bind qilingan funksiyani qayta bind qilib BO'LMAYDI.
Birinchi bind yutadi:
  const bound = func.bind(obj1)
  const rebound = bound.bind(obj2)
  rebound()  // this = obj1 (birinchi bind!)

═══════════════════════════════════════
  ARROW FUNCTION — LEXICAL this
═══════════════════════════════════════

Arrow function O'ZINING this-i YO'Q!
U tashqi (enclosing) scope-dan this-ni "meros oladi":

  const user = {
    name: 'Ali',
    greet: () => this.name,        // NOTO'G'RI! this = window/undefined
    greetCorrect() {
      const inner = () => this.name // TO'G'RI! this = user
      return inner()
    },
  }

Arrow function xususiyatlari:
- O'z this-i YO'Q — tashqi scope-dan oladi
- call/apply/bind this-ni O'ZGARTIRA OLMAYDI
- new bilan chaqirib BO'LMAYDI
- arguments object-i ham YO'Q

Qachon arrow function ishlatish kerak:
  ✅ Callback ichida (setTimeout, map, filter, event handler)
  ✅ this-ni "qulflab qo'yish" kerak bo'lganda

Qachon ISHLATMASLIK kerak:
  ❌ Object metodi sifatida
  ❌ Prototype metodi sifatida
  ❌ Constructor funksiya sifatida

═══════════════════════════════════════
  EVENT HANDLER DA THIS
═══════════════════════════════════════

DOM event handler-larda this = event target element:

  button.addEventListener('click', function() {
    console.log(this)  // <button> element
  })

  button.addEventListener('click', () => {
    console.log(this)  // window/undefined — arrow function!
  })

React-da event handler-lar boshqacha:
- Class component-da: this.handleClick = this.handleClick.bind(this)
- Yoki arrow function: handleClick = () => { this.setState(...) }
- Function component-da: this muammo umuman yo'q

═══════════════════════════════════════
  CLASS ICHIDA THIS
═══════════════════════════════════════

class ichida this = instance (yangi yaratilgan object):

  class Person {
    constructor(name) {
      this.name = name  // this = yangi instance
    }
    greet() {
      return this.name  // this = chaqiruvchi instance
    }
  }

  const ali = new Person('Ali')
  ali.greet()         // 'Ali' — this = ali

  const greet = ali.greet
  greet()             // TypeError! — implicit binding loss

Yechimlar:
  1. Constructor-da bind: this.greet = this.greet.bind(this)
  2. Arrow function: greet = () => this.name
  3. React-da: function component ishlatish (this muammo yo'q)

═══════════════════════════════════════
  THIS ANIQLASH ALGORITMASI
═══════════════════════════════════════

Funksiya chaqirilganda this-ni aniqlash uchun:

1. Arrow function-mi? → Tashqi scope-dan this (lexical)
2. new bilan chaqirildi-mi? → this = yangi object
3. call/apply/bind bilan-mi? → this = berilgan object
4. Object metodi-mi? (obj.func()) → this = obj
5. Hech biri emas? → window yoki undefined (strict)`,
  codeExamples: [
    {
      title: '4 ta binding qoidasi',
      language: 'js',
      code: `function identify() {
  return this.name
}

const ali = { name: 'Ali' }
const vali = { name: 'Vali' }

// 1. DEFAULT binding
// identify()  // undefined (strict mode) yoki window.name

// 2. IMPLICIT binding — nuqtadan oldingi object
ali.identify = identify
console.log(ali.identify())  // 'Ali' — this = ali

// 3. EXPLICIT binding — call/apply/bind
console.log(identify.call(ali))    // 'Ali' — this = ali
console.log(identify.call(vali))   // 'Vali' — this = vali
console.log(identify.apply(ali))   // 'Ali'

const boundToVali = identify.bind(vali)
console.log(boundToVali())         // 'Vali' — doim vali

// 4. NEW binding — eng kuchli
function Person(name) {
  this.name = name
}
const soli = new Person('Soli')
console.log(soli.name)  // 'Soli' — this = yangi object

// Kuchlilik tartibi: new > bind > implicit > default
const boundPerson = Person.bind(ali)
const toli = new boundPerson('Toli')
console.log(toli.name)  // 'Toli' — new YUTDI (bind emas)`,
      description: 'this qoidalari kuchlilik tartibida: new > explicit (call/apply/bind) > implicit (obj.method) > default (oddiy chaqiruv).',
    },
    {
      title: 'Implicit binding loss — eng keng tarqalgan muammo',
      language: 'js',
      code: `const user = {
  name: 'Ali',
  greet() {
    return \`Salom, \${this.name}\`
  },
}

// Implicit binding — ishlaydi
console.log(user.greet())  // 'Salom, Ali'

// Binding LOSS — metodni ajratish
const greet = user.greet
console.log(greet())  // 'Salom, undefined' — this yo'qoldi!

// Callback-da ham binding yo'qoladi
function callFunction(fn) {
  return fn()  // oddiy chaqiruv — this = undefined
}
console.log(callFunction(user.greet))  // 'Salom, undefined'

// setTimeout-da binding yo'qoladi
setTimeout(user.greet, 100)  // 'Salom, undefined'

// YECHIMLAR:

// 1. bind
setTimeout(user.greet.bind(user), 100)  // 'Salom, Ali'

// 2. Arrow function wrapper
setTimeout(() => user.greet(), 100)  // 'Salom, Ali'

// 3. call/apply
callFunction(user.greet.bind(user))  // 'Salom, Ali'

// Array methods-da ham
const users = [
  { name: 'Ali', greet() { return this.name } },
  { name: 'Vali', greet() { return this.name } },
]

// MUAMMO
const names1 = users.map(u => u.greet())
console.log(names1)  // ['Ali', 'Vali'] — arrow function ichida ishlaydi

// MUAMMO — to'g'ridan-to'g'ri method reference
// users.map(users[0].greet) — this yo'qoladi!`,
      description: 'Implicit binding loss — metod callback sifatida uzatilganda this yo\'qoladi. Yechim: bind(), arrow function wrapper, yoki closure.',
    },
    {
      title: 'call(), apply(), bind() — explicit binding',
      language: 'js',
      code: `function introduce(greeting, punctuation) {
  return \`\${greeting}, men \${this.name}\${punctuation}\`
}

const ali = { name: 'Ali' }
const vali = { name: 'Vali' }

// call — argumentlar alohida-alohida
console.log(introduce.call(ali, 'Salom', '!'))
// 'Salom, men Ali!'

// apply — argumentlar ARRAY sifatida
console.log(introduce.apply(vali, ['Hay', '.']))
// 'Hay, men Vali.'

// bind — YANGI funksiya qaytaradi (chaqirmaydi)
const aliIntro = introduce.bind(ali)
console.log(aliIntro('Salom', '!'))  // 'Salom, men Ali!'
console.log(aliIntro('Hay', '.'))    // 'Hay, men Ali.'

// bind bilan partial application
const aliSalom = introduce.bind(ali, 'Salom')
console.log(aliSalom('!'))   // 'Salom, men Ali!'
console.log(aliSalom('...')) // 'Salom, men Ali...'

// bind QAYTA QILIB BO'LMAYDI
const rebind = aliIntro.bind(vali)
console.log(rebind('Hay', '!'))  // 'Hay, men Ali!' — hali ham ALI

// Amaliy misol: Math.max bilan array
const numbers = [5, 3, 8, 1, 9]
console.log(Math.max.apply(null, numbers))  // 9
// Zamonaviy usul: Math.max(...numbers)

// Amaliy misol: method borrowing
const arrayLike = { 0: 'a', 1: 'b', 2: 'c', length: 3 }
const realArray = Array.prototype.slice.call(arrayLike)
console.log(realArray)  // ['a', 'b', 'c']`,
      description: 'call = darhol chaqirish + alohida args. apply = darhol + array args. bind = yangi funksiya + doimiy this. bind qayta qilinmaydi.',
    },
    {
      title: 'Arrow function — lexical this',
      language: 'js',
      code: `// Arrow function tashqi scope-dan this oladi
const user = {
  name: 'Ali',
  friends: ['Vali', 'Soli'],

  // Regular method — this = user
  showFriends() {
    // Arrow callback — tashqi this = user (ISHLAYDI)
    this.friends.forEach(friend => {
      console.log(\`\${this.name}ning do'sti: \${friend}\`)
    })
  },

  // NOTO'G'RI — arrow method
  badMethod: () => {
    console.log(this.name)  // undefined — this = module/window
  },
}

user.showFriends()
// "Alining do'sti: Vali"
// "Alining do'sti: Soli"

user.badMethod()  // undefined

// Arrow function-da call/apply/bind ISHLAMAYDI
const arrow = () => this
console.log(arrow.call({ name: 'Ali' }))  // window/undefined
console.log(arrow.bind({ name: 'Ali' })()) // window/undefined

// setTimeout bilan taqqoslash
const timer = {
  seconds: 0,

  // NOTO'G'RI — regular function
  startBad() {
    setInterval(function() {
      this.seconds++  // this = window (binding loss!)
      console.log(this.seconds)  // NaN
    }, 1000)
  },

  // TO'G'RI — arrow function
  startGood() {
    setInterval(() => {
      this.seconds++  // this = timer (lexical!)
      console.log(this.seconds)
    }, 1000)
  },
}

// Class ichida arrow function
class Counter {
  count = 0

  // Arrow — this doim instance
  increment = () => {
    this.count++
  }

  // Regular — binding loss xavfi
  decrement() {
    this.count--
  }
}

const counter = new Counter()
const { increment, decrement } = counter

increment()  // this = counter (arrow — doim bog'langan)
// decrement()  // TypeError — this = undefined (binding loss!)`,
      description: 'Arrow function o\'z this-iga EGA EMAS — tashqi scope-dan oladi. call/apply/bind this-ni o\'zgartira olmaydi. Object metod sifatida ishlatmang!',
    },
    {
      title: 'Class ichida this va React class component',
      language: 'js',
      code: `// Class-da this muammosi
class Button {
  constructor(label) {
    this.label = label
  }

  handleClick() {
    console.log(\`\${this.label} bosildi\`)
  }
}

const btn = new Button('Yuborish')
btn.handleClick()  // 'Yuborish bosildi' — implicit binding

// Callback sifatida — MUAMMO
const handler = btn.handleClick
// handler()  // TypeError: Cannot read property 'label' of undefined

// 3 ta YECHIM:

// 1. Constructor-da bind
class Button1 {
  constructor(label) {
    this.label = label
    this.handleClick = this.handleClick.bind(this)  // bind
  }
  handleClick() {
    console.log(\`\${this.label} bosildi\`)
  }
}

// 2. Arrow function (class field)
class Button2 {
  constructor(label) { this.label = label }
  handleClick = () => {  // arrow — this doim instance
    console.log(\`\${this.label} bosildi\`)
  }
}

// 3. Inline arrow (React JSX-da)
// <button onClick={() => this.handleClick()}>Click</button>

// React class component misoli
class MyComponent {
  state = { count: 0 }

  // Arrow field — React-da eng ko'p ishlatiladigan usul
  increment = () => {
    this.state = { count: this.state.count + 1 }
    console.log(this.state.count)
  }
}

const comp = new MyComponent()
const { increment } = comp  // ajratib olish
increment()  // 1 — this yo'qolMADI (arrow!)

// ZAMONAVIY YECHIM: Function component — this muammo UMUMAN yo'q
// function MyComponent() {
//   const [count, setCount] = useState(0)
//   const increment = () => setCount(c => c + 1) // this shart emas
// }`,
      description: 'Class method-lari callback sifatida uzatilganda this yo\'qoladi. Yechim: bind, arrow field, yoki function component (this muammo yo\'q).',
    },
  ],
  interviewQA: [
    {
      question: 'this JavaScript-da qanday aniqlanadi?',
      answer: 'this funksiya CHAQIRILISH USULI bilan aniqlanadi (declaration emas). 4 ta qoida (kuchlilik tartibi): 1) new Func() — this = yangi object. 2) func.call(obj)/apply/bind — this = berilgan obj. 3) obj.method() — this = obj. 4) func() — this = window (non-strict) yoki undefined (strict). Arrow function istisno — o\'z this-i yo\'q, tashqi scope-dan oladi (lexical).',
    },
    {
      question: 'Arrow function-da this qanday ishlaydi?',
      answer: 'Arrow function o\'zining this-iga EGA EMAS. U tashqi (enclosing) scope-dagi this-ni "meros oladi" — bu "lexical this" deyiladi. call(), apply(), bind() arrow function-ning this-ini O\'ZGARTIRA OLMAYDI. new bilan chaqirib bo\'lmaydi. Bu xususiyat callback-larda juda foydali (setTimeout, map, event handler), lekin object metodi sifatida ishlatish NOTO\'G\'RI — tashqi this olinadi.',
    },
    {
      question: 'call(), apply() va bind() farqi nima?',
      answer: 'call(thisArg, arg1, arg2) — funksiyani DARHOL chaqiradi, argumentlar alohida-alohida beriladi. apply(thisArg, [args]) — DARHOL chaqiradi, argumentlar ARRAY sifatida. bind(thisArg, arg1) — YANGI funksiya QAYTARADI (chaqirmaydi), this doimiy bog\'lanadi. bind() partial application ham qiladi. MUHIM: bind qilingan funksiyani qayta bind qilib bo\'lmaydi — birinchi bind yutadi.',
    },
    {
      question: 'Implicit binding loss nima va qanday oldini olinadi?',
      answer: 'Method-ni object-dan ajratib olganda this yo\'qoladi: const fn = obj.method; fn() — this = undefined. Bu callback-larda ko\'p uchraydi: setTimeout(obj.method), arr.map(obj.method). Yechimlar: 1) bind: setTimeout(obj.method.bind(obj)). 2) Arrow wrapper: setTimeout(() => obj.method()). 3) Class-da arrow field: method = () => { this... }. React class component-da bu asosiy muammo edi, function component-da this umuman kerak emas.',
    },
    {
      question: 'React class component-da this muammosi qanday hal qilinadi?',
      answer: 'Class component-da event handler-lar callback sifatida uzatiladi — this yo\'qoladi. 3 ta yechim: 1) Constructor-da bind: this.handleClick = this.handleClick.bind(this). 2) Arrow class field: handleClick = () => {...} — har doim instance-ga bog\'langan. 3) JSX-da inline arrow: onClick={() => this.handleClick()}. Eng yaxshi yechim: Function component ishlatish — this muammo umuman yo\'q, chunki function scope-da this shart emas.',
    },
    {
      question: 'Strict mode this-ga qanday ta\'sir qiladi?',
      answer: 'Non-strict mode-da default binding: this = window (global object). Strict mode-da default binding: this = undefined. Bu muhim farq — chunki non-strict da func() ichida this.someGlobal noto\'g\'ri ishlashi mumkin (global o\'zgaruvchiga murojaat). Strict mode da TypeError beradi — bu xatoni tezroq topishga yordam beradi. ES modules va class ichida avtomatik strict mode. Shuning uchun zamonaviy kod-da default this = undefined.',
    },
  ],
  relatedTopics: [
    { techId: 'javascript', sectionId: 'objects-prototypes', topicId: 'new-keyword', label: 'new Keyword' },
    { techId: 'javascript', sectionId: 'objects-prototypes', topicId: 'prototype-chain', label: 'Prototype Chain' },
    { techId: 'javascript', sectionId: 'objects-prototypes', topicId: 'object-basics', label: 'Object Basics' },
  ],
}
