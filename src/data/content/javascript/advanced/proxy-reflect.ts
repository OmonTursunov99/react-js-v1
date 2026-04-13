import type { Topic } from '../../../types'

export const proxyReflect: Topic = {
  id: 'proxy-reflect',
  title: 'Proxy va Reflect',
  importance: 3,
  status: 'to-learn',
  description: 'Proxy bilan obyekt operatsiyalarini ushlab olish, Reflect API',
  content: `Proxy — JavaScript-da obyektning asosiy operatsiyalarini (o'qish, yozish, o'chirish va boshqalar) ushlab olib, o'zgartirish imkonini beruvchi maxsus obyekt. ES6 da qo'shilgan.

═══════════════════════════════════════
  PROXY NIMA
═══════════════════════════════════════

Proxy — target obyektga "qobiq" o'rab, uning operatsiyalarini "trap" (tuzoq) funksiyalar orqali boshqarish.

  const proxy = new Proxy(target, handler)

- target — asl obyekt
- handler — trap funksiyalar to'plami

Asosiy trap-lar:
  get(target, prop, receiver) — xususiyatni o'qishda
  set(target, prop, value, receiver) — xususiyatga yozishda
  has(target, prop) — "in" operatorida
  deleteProperty(target, prop) — delete operatorida
  apply(target, thisArg, args) — funksiya chaqirishda
  construct(target, args) — new bilan yaratishda

═══════════════════════════════════════
  REFLECT API
═══════════════════════════════════════

Reflect — Proxy trap-lari bilan bir xil metodlarga ega oddiy obyekt.
Proxy ichida default xatti-harakatni chaqirish uchun ishlatiladi:

  Reflect.get(target, prop)
  Reflect.set(target, prop, value)
  Reflect.has(target, prop)
  Reflect.deleteProperty(target, prop)

Reflect.set() true/false qaytaradi — muvaffaqiyatni bildiradi.

═══════════════════════════════════════
  QACHON ISHLATILADI
═══════════════════════════════════════

1. Validatsiya — set trap bilan qiymatni tekshirish
2. Logging — har bir operatsiyani qayd qilish
3. Default qiymatlar — yo'q xususiyatga default berish
4. Reactive tizimlar — Vue 3 reactivity Proxy-ga asoslangan
5. API wrapping — tashqi API-ni xavfsiz o'rash`,
  codeExamples: [
    {
      title: 'Validatsiya bilan Proxy',
      language: 'js',
      code: `const validator = {
  set(target, prop, value) {
    if (prop === 'age') {
      if (typeof value !== 'number') throw TypeError('age raqam bo\\'lishi kerak')
      if (value < 0 || value > 150) throw RangeError('age 0-150 orasida bo\\'lishi kerak')
    }
    return Reflect.set(target, prop, value)
  }
}

const person = new Proxy({}, validator)
person.name = 'Ali'    // OK
person.age = 25        // OK
// person.age = -5     // RangeError!
// person.age = 'yosh' // TypeError!`,
      description: 'set trap orqali qiymatni yozishdan oldin validatsiya qilish',
    },
    {
      title: 'Reactive obyekt (Vue 3 prinsipi)',
      language: 'js',
      code: `function reactive(target) {
  const subscribers = new Map()

  return new Proxy(target, {
    get(target, prop) {
      // Track: kim bu xususiyatni o'qimoqda
      console.log(\`GET: \${String(prop)}\`)
      return Reflect.get(target, prop)
    },
    set(target, prop, value) {
      const oldValue = target[prop]
      const result = Reflect.set(target, prop, value)
      if (oldValue !== value) {
        // Trigger: xabar berish
        console.log(\`SET: \${String(prop)} = \${value}\`)
      }
      return result
    }
  })
}

const state = reactive({ count: 0 })
state.count       // GET: count
state.count = 1   // SET: count = 1`,
      description: 'Vue 3 reactivity tizimining soddalashtirilgan versiyasi',
    },
  ],
  interviewQA: [
    {
      question: 'Proxy nima va qachon ishlatiladi?',
      answer: 'Proxy — obyekt operatsiyalarini (get, set, delete, has va boshqalar) ushlab olish (intercept) uchun maxsus wrapper obyekt. Target obyekt ustida handler (trap-lar) o\'rnatiladi. Ishlatilish: validatsiya, logging, reactive tizimlar (Vue 3), default qiymatlar, access control. Proxy Reflect bilan birga ishlatiladi — Reflect default operatsiyani bajarish uchun.',
    },
    {
      question: 'Proxy va Object.defineProperty farqi nima?',
      answer: 'Object.defineProperty faqat MAVJUD xususiyatni kuzatadi va faqat get/set. Proxy BARCHA operatsiyalarni (13 ta trap) ushlay oladi — shu jumladan yangi xususiyat qo\'shish, o\'chirish, "in" operatori. Shuning uchun Vue 2 da Object.defineProperty, Vue 3 da Proxy ishlatiladi.',
    },
    {
      question: 'Reflect nima uchun kerak?',
      answer: 'Reflect — Proxy trap-lari bilan bir xil 13 ta statik metodga ega. Proxy ichida default xatti-harakatni chaqirish uchun ishlatiladi: Reflect.get(), Reflect.set() va h.k. Reflect.set() boolean qaytaradi (muvaffaqiyat/muvaffaqiyatsizlik), Object assignment esa xato tashlaydi yoki jimgina o\'tkazib yuboradi.',
    },
  ],
}
