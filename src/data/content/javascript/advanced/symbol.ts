import type { Topic } from '../../../types'

export const symbol: Topic = {
  id: 'symbol',
  title: 'Symbol',
  importance: 2,
  status: 'to-learn',
  description: 'Symbol primitiv tipi va well-known symbollar',
  content: `═══════════════════════════════════════
  SYMBOL — NOYOB PRIMITIV TIP
═══════════════════════════════════════

Symbol — ES6 da qo'shilgan 7-chi primitiv tip bo'lib, har bir Symbol
qiymati NOYOB va takrorlanmasdir. U asosan object property key sifatida
nomlar to'qnashuvini (name collision) oldini olish uchun ishlatiladi.

═══════════════════════════════════════
  SYMBOL YARATISH
═══════════════════════════════════════

1. Symbol() konstruktorsiz chaqiriladi (new Symbol() xato beradi)
2. Ixtiyoriy description parametr faqat debugging uchun ishlatiladi
3. Ikki Symbol hech qachon teng bo'lmaydi — hatto description bir xil bo'lsa ham

const s1 = Symbol('id')
const s2 = Symbol('id')
console.log(s1 === s2)  // false — har doim noyob

MUHIM: Symbol avtomatik string ga aylanmaydi. console.log() ishlaydi,
lekin string concatenation xato beradi. Aniq toString() yoki description
ishlatish kerak.

═══════════════════════════════════════
  SYMBOL.FOR() — GLOBAL REGISTRY
═══════════════════════════════════════

Symbol.for(key) global symbol registry dan symbol qidiradi.
Agar topilmasa — yangi yaratadi va registryga qo'shadi.
Bu turli modullar o'rtasida BITTA symbolni ulashish imkonini beradi.

const s1 = Symbol.for('app.id')
const s2 = Symbol.for('app.id')
console.log(s1 === s2)  // true — bir xil global symbol

Symbol.keyFor(symbol) — global registrydan symbol kalitini qaytaradi.
Oddiy Symbol() bilan yaratilganlarda undefined qaytaradi.

═══════════════════════════════════════
  WELL-KNOWN SYMBOLS
═══════════════════════════════════════

JavaScript ichki mexanizmlarini sozlash uchun o'rnatilgan symbollar:

1. Symbol.iterator — obyektni for...of bilan iterable qiladi
2. Symbol.toPrimitive — obyektni primitiv qiymatga aylantirish logikasi
3. Symbol.hasInstance — instanceof operatori xatti-harakatini o'zgartiradi
4. Symbol.toStringTag — Object.prototype.toString() natijasini sozlaydi
5. Symbol.species — derived obyekt konstruktorini belgilaydi
6. Symbol.isConcatSpreadable — Array.concat() da spread qilish/qilmaslik

MUHIM: Well-known symbollar orqali JavaScript engine ning ichki
protokollarini customize qilish mumkin — bu metaprogramming ning asosi.

═══════════════════════════════════════
  SYMBOL OBJECT KEY SIFATIDA
═══════════════════════════════════════

Symbol kalitlar oddiy property enumeration dan yashiringan:

1. for...in — symbol kalitlarni ko'rsatmaydi
2. Object.keys() — symbol kalitlarni qaytarmaydi
3. JSON.stringify() — symbol kalitlarni o'tkazib yuboradi
4. Object.getOwnPropertySymbols() — FAQAT symbol kalitlarni qaytaradi
5. Reflect.ownKeys() — barcha kalitlarni qaytaradi (string + symbol)

Bu xususiyat symbollarni "yarim-xususiy" (semi-private) property
sifatida ishlatish imkonini beradi. To'liq private emas (chunki
getOwnPropertySymbols orqali topish mumkin), lekin oddiy iteratsiyada
ko'rinmaydi.

═══════════════════════════════════════
  AMALIY QO'LLANILISH HOLATLARI
═══════════════════════════════════════

1. Unique property keys — kutubxona yoki framework yaratganda boshqa
   kod bilan property nomlari to'qnashmasligi uchun
2. Enum-like constants — Symbol qiymatlar takrorlanmas, shuning uchun
   xavfsiz konstanta sifatida ishlatiladi
3. Protocol implementation — well-known symbols orqali obyekt
   xatti-harakatini sozlash (iterable, toPrimitive va h.k.)
4. Meta-information — obyektga ko'rinmas metadata biriktirish`,
  codeExamples: [
    {
      title: 'Symbol yaratish va noyoblik',
      language: 'js',
      code: `// Symbol yaratish
const id = Symbol('id')
const name = Symbol('name')

// Hatto description bir xil bo'lsa ham — noyob
const s1 = Symbol('key')
const s2 = Symbol('key')
console.log(s1 === s2)  // false

// Obyektda ishlatish
const user = {
  [id]: 1,
  [name]: 'Ali',
  age: 25
}

console.log(user[id])    // 1
console.log(user[name])  // 'Ali'

// Oddiy enumeration da ko'rinmaydi
console.log(Object.keys(user))                  // ['age']
console.log(Object.getOwnPropertySymbols(user))  // [Symbol(id), Symbol(name)]
console.log(Reflect.ownKeys(user))               // ['age', Symbol(id), Symbol(name)]`,
      description: 'Symbol noyobligi va object key sifatida ishlatilishi',
    },
    {
      title: 'Symbol.for() — global registry',
      language: 'js',
      code: `// Global symbol registry
const globalId = Symbol.for('app.userId')

// Boshqa faylda ham bir xil symbol olinadi
const sameId = Symbol.for('app.userId')
console.log(globalId === sameId)  // true

// Symbol.keyFor — faqat global symbollar uchun
console.log(Symbol.keyFor(globalId))  // 'app.userId'

const localSymbol = Symbol('local')
console.log(Symbol.keyFor(localSymbol))  // undefined

// Amaliy misol — modullar aro symbol ulashish
// module-a.js
export const EVENT_TYPE = Symbol.for('myLib.eventType')

// module-b.js
const TYPE = Symbol.for('myLib.eventType')
// EVENT_TYPE === TYPE  →  true`,
      description: 'Symbol.for() yordamida global symbol yaratish va ulashish',
    },
    {
      title: 'Symbol.toPrimitive — tur konvertatsiyasi',
      language: 'js',
      code: `const currency = {
  value: 1500,
  unit: 'UZS',

  [Symbol.toPrimitive](hint) {
    switch (hint) {
      case 'number':
        return this.value                    // Matematik operatsiyalarda
      case 'string':
        return \`\${this.value} \${this.unit}\`  // String kontekstda
      default:
        return this.value                    // Default (== operatori)
    }
  }
}

console.log(+currency)          // 1500
console.log(\`Narx: \${currency}\`) // "Narx: 1500 UZS"
console.log(currency + 100)     // 1600
console.log(currency == 1500)   // true`,
      description: 'Symbol.toPrimitive orqali obyekt konvertatsiyasini boshqarish',
    },
    {
      title: 'Symbol.iterator — custom iterable',
      language: 'js',
      code: `const range = {
  from: 1,
  to: 5,

  [Symbol.iterator]() {
    let current = this.from
    const last = this.to

    return {
      next() {
        if (current <= last) {
          return { value: current++, done: false }
        }
        return { done: true }
      }
    }
  }
}

// Endi for...of ishlaydi
for (const num of range) {
  console.log(num)  // 1, 2, 3, 4, 5
}

// Spread ham ishlaydi
console.log([...range])  // [1, 2, 3, 4, 5]

// Destructuring ham
const [a, b, c] = range
console.log(a, b, c)  // 1 2 3`,
      description: 'Symbol.iterator yordamida custom iterable obyekt yaratish',
    },
    {
      title: 'Symbol.hasInstance — instanceof sozlash',
      language: 'js',
      code: `// Symbol.hasInstance — instanceof xatti-harakatini o'zgartirish
class EvenNumber {
  static [Symbol.hasInstance](num) {
    return typeof num === 'number' && num % 2 === 0
  }
}

console.log(2 instanceof EvenNumber)   // true
console.log(3 instanceof EvenNumber)   // false
console.log(100 instanceof EvenNumber) // true

// Symbol.toStringTag — toString() ni sozlash
class Validator {
  get [Symbol.toStringTag]() {
    return 'Validator'
  }
}

const v = new Validator()
console.log(Object.prototype.toString.call(v))  // [object Validator]`,
      description: 'Symbol.hasInstance va Symbol.toStringTag yordamida meta-xatti-harakat',
    },
  ],
  interviewQA: [
    {
      question: 'Symbol nima va nega u JavaScript ga qo\'shildi?',
      answer: 'Symbol — ES6 da qo\'shilgan noyob va o\'zgarmas primitiv tip. U asosan ikki maqsadda qo\'shildi: 1) property name collision larni oldini olish — kutubxonalar va framework lar bir-birining property larini tasodifan qayta yozmasligi uchun, 2) well-known symbols orqali JavaScript engine ning ichki protokollarini (iteration, type conversion) customize qilish imkoniyati berish uchun. Har bir Symbol() chaqiruvi noyob qiymat yaratadi — ikki Symbol hech qachon teng bo\'lmaydi.',
    },
    {
      question: 'Symbol() va Symbol.for() ning farqi nima?',
      answer: 'Symbol() har safar yangi NOYOB symbol yaratadi — hatto description bir xil bo\'lsa ham ular teng bo\'lmaydi. Symbol.for(key) esa GLOBAL symbol registry dan qidiradi: agar shu key bilan symbol bor bo\'lsa uni qaytaradi, yo\'q bo\'lsa yangi yaratib registryga qo\'shadi. Symbol.for() turli fayllar va modullar o\'rtasida bitta symbolni ulashish uchun ishlatiladi. Symbol.keyFor() orqali global symbol ning key ini olish mumkin.',
    },
    {
      question: 'Symbol property lar nega Object.keys() da ko\'rinmaydi?',
      answer: 'Symbol kalitli property lar for...in, Object.keys(), Object.values(), Object.entries() va JSON.stringify() da ko\'rinmaydi — bu specification da belgilangan xatti-harakat. Bu symbollarni "yarim-xususiy" (semi-private) qiladi. Lekin ular to\'liq yashirin emas: Object.getOwnPropertySymbols() faqat symbol kalitlarni qaytaradi, Reflect.ownKeys() esa barcha kalitlarni (string + symbol) qaytaradi. Bu xususiyat meta-ma\'lumotlarni oddiy iteratsiyadan yashirish uchun juda qulay.',
    },
    {
      question: 'Well-known symbollardan 3 tasini misol bilan tushuntiring.',
      answer: 'Symbol.iterator — obyektni for...of loop bilan iterable qiladi. Obyektga [Symbol.iterator]() metodni qo\'shsangiz, u iterator qaytaradi va for...of ishlaydi. Symbol.toPrimitive — obyektni primitiv qiymatga konvertatsiya qilishni boshqaradi. Hint parametri "number", "string" yoki "default" bo\'ladi. Symbol.hasInstance — instanceof operatorining xatti-harakatini o\'zgartiradi. Masalan, static [Symbol.hasInstance](val) metod orqali ixtiyoriy tekshiruv logikasini yozish mumkin.',
    },
    {
      question: 'Symbol larning amaliy qo\'llanilish holatlari qanday?',
      answer: '1) Unique property keys — kutubxona yaratganda foydalanuvchi kodi bilan nom to\'qnashuvini oldini olish. 2) Enum pattern — symbollar takrorlanmas, shuning uchun holat konstantalari sifatida xavfsiz: const STATUS = { ACTIVE: Symbol("active"), INACTIVE: Symbol("inactive") }. 3) Private-like fields — WeakMap + Symbol kombinatsiyasi bilan ma\'lumotni yashirish. 4) Protocol sozlash — well-known symbols orqali iteration, serialization va boshqa xatti-harakatlarni customize qilish.',
    },
  ],
}
