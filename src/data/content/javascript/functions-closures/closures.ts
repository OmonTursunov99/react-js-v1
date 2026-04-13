import type { Topic } from '../../../types'

export const closures: Topic = {
  id: 'closures',
  title: 'Closures',
  importance: 3,
  status: 'to-learn',
  description: 'Lexical environment, scope chain, data privacy, stale closure, GC',
  content: `Closure — funksiya o'zi yaratilgan lexical environment-ni "eslab qolishi". Funksiya tashqi scope o'zgaruvchilariga kirish imkonini beradi, hatto tashqi funksiya allaqachon tugagan bo'lsa ham.

═══════════════════════════════════════
  LEXICAL ENVIRONMENT NIMA?
═══════════════════════════════════════

Har bir funksiya yaratilganda u o'zi bilan bog'liq Lexical Environment-ga ega bo'ladi:

1. Environment Record — shu scope-dagi o'zgaruvchilar jadvali
2. Outer Reference — tashqi (parent) scope-ga havola

  function outer() {
    let x = 10         // outer ning environment record-ida
    function inner() {
      console.log(x)   // inner o'z scope-ida x yo'q → outer ga qaraydi
    }
    return inner
  }

inner() chaqirilganda x o'z scope-ida topilmaydi.
JavaScript SCOPE CHAIN bo'ylab yuqoriga qaraydi: inner → outer → global.
Bu mexanizm "lexical scoping" deyiladi.

═══════════════════════════════════════
  CLOSURE QANDAY HOSIL BO'LADI
═══════════════════════════════════════

Closure hosil bo'lish uchun 2 shart kerak:
1. Ichki funksiya tashqi funksiya o'zgaruvchisiga murojaat qiladi
2. Ichki funksiya tashqi funksiyadan TASHQARIDA ishlatiladi

  function createCounter() {
    let count = 0              // bu o'zgaruvchi closure orqali saqlanadi
    return function() {
      count++
      return count
    }
  }

  const counter = createCounter()
  counter()  // 1
  counter()  // 2
  counter()  // 3

createCounter() tugagandan keyin ham count XOTIRADA qoladi,
chunki qaytarilgan funksiya unga HAVOLA qilib turibdi.

═══════════════════════════════════════
  XOTIRA MODELI (SCOPE CHAIN)
═══════════════════════════════════════

JavaScript engine ichki tuzilmasi:

  counter funksiya → [[Environment]] → {
    count: 3,
    outer: → Global Environment
  }

Har bir closure o'zi yaratilgan BUTUN scope chain-ni ushlab turadi.
Bu degani — agar tashqi funksiyada 100 ta o'zgaruvchi bo'lsa,
closure hammasi uchun xotira egallaydi (zamonaviy engine-lar optimizatsiya qiladi).

═══════════════════════════════════════
  AMALIY ISHLATISH
═══════════════════════════════════════

1. DATA PRIVACY (Encapsulation):
   Closure yordamida "private" o'zgaruvchilar yaratish mumkin.
   Tashqaridan to'g'ridan-to'g'ri o'zgartirish imkonsiz.

2. FACTORY FUNCTIONS:
   Har bir chaqiruvda yangi closure — mustaqil state.

3. PARTIAL APPLICATION:
   Funksiya argumentlarini bosqichma-bosqich berish.

4. EVENT HANDLERS:
   Callback funksiyalar tashqi o'zgaruvchilarga kirish.

5. MODULE PATTERN (ES5):
   IIFE + closure = private/public API.

═══════════════════════════════════════
  STALE CLOSURE MUAMMOSI
═══════════════════════════════════════

Closure ESKI qiymatni ushlab turishi mumkin:

  let value = 'original'

  function getClosure() {
    return function() { return value }
  }

  const fn = getClosure()
  value = 'changed'
  fn()  // 'changed' — chunki value global scope-da

LEKIN React hooks-da bu boshqacha:

  function Timer() {
    const [count, setCount] = useState(0)

    useEffect(() => {
      const id = setInterval(() => {
        console.log(count)  // DOIM 0! — stale closure
      }, 1000)
      return () => clearInterval(id)
    }, [])  // [] — faqat mount-da, count o'zgarganda yangilanmaydi
  }

Yechim: updater function — setCount(prev => prev + 1)

═══════════════════════════════════════
  LOOP BILAN CLOSURE (var vs let)
═══════════════════════════════════════

Klassik muammo:

  for (var i = 0; i < 3; i++) {
    setTimeout(() => console.log(i), 100)
  }
  // 3, 3, 3 — chunki var function-scoped, bitta i

Yechimlar:
1. let ishlatish (block scope — har iteratsiyada yangi i):
   for (let i = 0; i < 3; i++) { ... }  // 0, 1, 2

2. IIFE bilan yangi scope yaratish:
   for (var i = 0; i < 3; i++) {
     (function(j) { setTimeout(() => console.log(j), 100) })(i)
   }

═══════════════════════════════════════
  GARBAGE COLLECTION
═══════════════════════════════════════

Closure xotirani USHLAB TURADI:
- Closure mavjud ekan, uning scope chain-idagi o'zgaruvchilar GC tomonidan tozalanMAYDI
- Katta ob'ektlarga closure orqali havola qilsangiz — memory leak bo'lishi mumkin

  function process() {
    const hugeData = new Array(1000000).fill('x')
    return function() {
      return hugeData.length  // hugeData GC ga berilmaydi!
    }
  }

MUHIM: Closure kerak bo'lmasa — null ga o'zgartiring yoki scope-dan chiqaring.
Zamonaviy V8 engine faqat ISHLATILGAN o'zgaruvchilarni saqlaydi (dead variable elimination),
lekin eval() yoki debugger ishlatilsa — butun scope saqlanadi.`,
  codeExamples: [
    {
      title: 'Closure asoslari — counter factory',
      language: 'js',
      code: `function createCounter(initialValue = 0) {
  let count = initialValue  // private o'zgaruvchi

  return {
    increment() { return ++count },
    decrement() { return --count },
    getCount() { return count },
    reset()    { count = initialValue; return count },
  }
}

const counter1 = createCounter(0)
const counter2 = createCounter(100)

counter1.increment()  // 1
counter1.increment()  // 2
counter2.increment()  // 101

// count ga to'g'ridan-to'g'ri kirish imkonsiz!
// counter1.count → undefined
console.log(counter1.getCount())  // 2
console.log(counter2.getCount())  // 101`,
      description: 'Har bir createCounter() chaqiruvi yangi closure yaratadi. counter1 va counter2 MUSTAQIL state-ga ega. count o\'zgaruvchisi tashqaridan ko\'rinmaydi — bu data privacy.',
    },
    {
      title: 'Data privacy — Module pattern',
      language: 'js',
      code: `function createBankAccount(owner, initialBalance) {
  let balance = initialBalance  // private
  const transactions = []       // private

  function log(type, amount) {
    transactions.push({
      type,
      amount,
      date: new Date().toISOString(),
      balance,
    })
  }

  return {
    getOwner() { return owner },
    getBalance() { return balance },

    deposit(amount) {
      if (amount <= 0) throw new Error('Musbat son kiriting')
      balance += amount
      log('deposit', amount)
      return balance
    },

    withdraw(amount) {
      if (amount > balance) throw new Error('Mablag\\' yetarli emas')
      balance -= amount
      log('withdraw', amount)
      return balance
    },

    getHistory() {
      return [...transactions]  // nusxa qaytarish (himoya)
    },
  }
}

const account = createBankAccount('Ali', 1000)
account.deposit(500)    // 1500
account.withdraw(200)   // 1300
// account.balance → undefined (private!)
// account.transactions → undefined (private!)`,
      description: 'Module pattern — closure orqali balance va transactions tashqaridan yashiringan. Faqat qaytarilgan metodlar orqali kirish mumkin. Bu OOP dagi encapsulation ga o\'xshash.',
    },
    {
      title: 'Partial application bilan closure',
      language: 'js',
      code: `// Partial application — argumentlarni bosqichma-bosqich berish
function multiply(a) {
  return function(b) {
    return a * b
  }
}

const double = multiply(2)   // a = 2 closure-da saqlanadi
const triple = multiply(3)   // a = 3 closure-da saqlanadi

double(5)   // 10
triple(5)   // 15

// Amaliy misol — API URL builder
function createAPI(baseURL) {
  return function(endpoint) {
    return function(params) {
      const query = new URLSearchParams(params).toString()
      return \`\${baseURL}\${endpoint}?\${query}\`
    }
  }
}

const api = createAPI('https://api.example.com')
const usersAPI = api('/users')
const productsAPI = api('/products')

usersAPI({ page: 1, limit: 10 })
// 'https://api.example.com/users?page=1&limit=10'

productsAPI({ category: 'electronics' })
// 'https://api.example.com/products?category=electronics'`,
      description: 'Partial application — har bir qaytarilgan funksiya oldingi argumentlarni closure orqali eslab qoladi. Bu kodni qayta ishlatish va konfiguratsiya uchun juda foydali.',
    },
    {
      title: 'Loop + closure klassik muammosi',
      language: 'js',
      code: `// MUAMMO: var bilan
for (var i = 0; i < 3; i++) {
  setTimeout(function() {
    console.log('var:', i)
  }, 100)
}
// Natija: 3, 3, 3
// Sabab: var function-scoped, barcha callback BITTA i ga havola qiladi
// setTimeout ishlagunga qadar loop tugaydi va i = 3 bo'ladi

// YECHIM 1: let (block scope)
for (let i = 0; i < 3; i++) {
  setTimeout(function() {
    console.log('let:', i)
  }, 100)
}
// Natija: 0, 1, 2
// Sabab: let har iteratsiyada YANGI o'zgaruvchi yaratadi

// YECHIM 2: IIFE bilan yangi scope
for (var i = 0; i < 3; i++) {
  (function(j) {
    setTimeout(function() {
      console.log('IIFE:', j)
    }, 100)
  })(i)  // i ning QIYMATI j ga nusxalanadi
}
// Natija: 0, 1, 2

// YECHIM 3: setTimeout ning uchinchi argumenti
for (var i = 0; i < 3; i++) {
  setTimeout(function(j) {
    console.log('arg:', j)
  }, 100, i)  // i qiymat sifatida beriladi
}
// Natija: 0, 1, 2`,
      description: 'Eng klassik closure muammosi. var bilan barcha callback bitta o\'zgaruvchiga havola qiladi. let har iteratsiyada yangi binding yaratadi. IIFE esa yangi scope yaratib, qiymatni nusxalaydi.',
    },
    {
      title: 'Closure va garbage collection',
      language: 'js',
      code: `// MUAMMO: closure katta ob'ektni ushlab turadi
function createHandler() {
  const hugeArray = new Array(1_000_000).fill('data')

  return function handler() {
    // hugeArray ishlatilgan — GC tozalay olmaydi!
    return hugeArray.length
  }
}

const handler = createHandler()
// hugeArray xotirada qoladi, chunki handler unga havola qiladi

// YECHIM: kerakli ma'lumotni ajratib olish
function createHandlerOptimized() {
  const hugeArray = new Array(1_000_000).fill('data')
  const length = hugeArray.length  // faqat kerakli qiymatni olish

  return function handler() {
    return length  // hugeArray ga havola YO'Q — GC tozalaydi
  }
}

// YECHIM 2: closure-ni tozalash
let cachedFn = createHandler()
// Ishlatib bo'lgach:
cachedFn = null  // closure va hugeArray GC ga beriladi

// V8 optimizatsiyasi:
function smart() {
  const big = new Array(1_000_000)
  const small = 'kerakli'

  return function() {
    return small  // V8 faqat small ni saqlaydi, big ni GC qiladi
    // LEKIN: eval() yoki debugger bo'lsa — hammasi saqlanadi!
  }
}`,
      description: 'Closure tashqi scope o\'zgaruvchilarini xotirada ushlab turadi. Memory leak oldini olish uchun: faqat kerakli qiymatlarni ajratish, yoki closure-ni null qilish. V8 engine ishlatilmagan o\'zgaruvchilarni avtomatik tozalaydi.',
    },
  ],
  interviewQA: [
    {
      question: 'Closure nima? Oddiy tilda tushuntiring.',
      answer: 'Closure — funksiya o\'zi yaratilgan muhitni (lexical environment) eslab qolishi. Ichki funksiya tashqi funksiya o\'zgaruvchilariga kirish imkoniga ega, hatto tashqi funksiya allaqachon tugagan bo\'lsa ham. Texnik jihatdan, har bir funksiya closure hisoblanadi (chunki global scope-ga kirishi mumkin), lekin amalda closure deganda ichki funksiya tashqi scope o\'zgaruvchisini "yopib" (close over) olishi tushuniladi.',
    },
    {
      question: 'Closure xotirada qanday saqlanadi? Scope chain nima?',
      answer: 'Har bir funksiya yaratilganda u [[Environment]] ichki xususiyatiga ega bo\'ladi — bu funksiya yaratilgan Lexical Environment-ga havola. Scope chain — bu ichki scope-dan tashqi scope-ga ketadigan havolalar zanjiri: inner → outer → global. O\'zgaruvchi topilmaguncha zanjir bo\'ylab yuqoriga qaraladi. Closure bu zanjirdagi barcha environment-larni ushlab turadi, shuning uchun tashqi o\'zgaruvchilar garbage collect qilinmaydi.',
    },
    {
      question: 'Closure bilan memory leak qanday bo\'ladi va qanday oldini olish mumkin?',
      answer: 'Closure tashqi scope-dagi o\'zgaruvchilarga havola qilib turadi — GC ularni tozalay olmaydi. Masalan, katta array yoki DOM elementiga closure orqali havola qolsa — xotira bo\'shatilmaydi. Oldini olish: 1) faqat kerakli qiymatlarni alohida o\'zgaruvchiga olish, 2) closure kerak bo\'lmaganda null ga o\'zgartirish, 3) event listener-larni removeEventListener bilan tozalash. Zamonaviy V8 faqat closure-da ISHLATILGAN o\'zgaruvchilarni saqlaydi, lekin eval() bo\'lsa butun scope saqlanadi.',
    },
    {
      question: 'for loop bilan var va closure muammosini tushuntiring.',
      answer: 'for (var i = 0; i < 3; i++) { setTimeout(() => console.log(i), 100) } natijasi 3, 3, 3. Sabab: var function-scoped — barcha callback BITTA i o\'zgaruvchisiga havola qiladi. Loop tugagunga qadar i = 3 bo\'ladi. Yechimlar: 1) let ishlatish — har iteratsiyada yangi block-scoped o\'zgaruvchi yaratiladi; 2) IIFE — har iteratsiyada yangi scope yaratib, i qiymatini nusxalash; 3) setTimeout ning uchinchi argumenti orqali qiymatni berish.',
    },
    {
      question: 'Stale closure nima? React-da qanday namoyon bo\'ladi?',
      answer: 'Stale closure — funksiya ESKI qiymatni ushlab turishi. React-da useEffect yoki useCallback dependency array to\'g\'ri berilmasa, callback ichidagi state/props eski render qiymati bo\'lib qoladi. Masalan: useEffect(() => { setInterval(() => console.log(count), 1000) }, []) — count DOIM 0 bo\'ladi, chunki effect faqat mount-da yaratilgan va o\'sha paytdagi count=0 ni closure orqali ushlab turadi. Yechim: dependency array-ga count qo\'shish, yoki updater function (setCount(prev => prev + 1)) ishlatish.',
    },
    {
      question: 'Closure va this kalit so\'zi qanday bog\'liq?',
      answer: 'Closure LEXICAL scope-ni eslab qoladi, lekin this lexical scope-ga tegishli EMAS (arrow function-dan tashqari). Oddiy funksiyada this CHAQIRISH vaqtida aniqlanadi, yaratilish vaqtida emas. Arrow function esa this-ni closure kabi lexical scope-dan oladi. Shuning uchun ES5-da const self = this pattern ishlatilgan — self oddiy o\'zgaruvchi sifatida closure orqali saqlanadi. ES6+ da arrow function bu muammoni hal qildi.',
    },
  ],
  relatedTopics: [
    { techId: 'javascript', sectionId: 'functions-closures', topicId: 'execution-context', label: 'Execution Context' },
    { techId: 'javascript', sectionId: 'functions-closures', topicId: 'iife', label: 'IIFE' },
    { techId: 'javascript', sectionId: 'functions-closures', topicId: 'currying', label: 'Currying va Partial Application' },
    { techId: 'javascript', sectionId: 'fundamentals', topicId: 'scope-hoisting', label: 'Scope va Hoisting' },
    { techId: 'react-js', sectionId: 'theory-questions', topicId: 'closures-in-hooks', label: 'Closures in React Hooks' },
  ],
}
