import type { Topic } from '../../../types'

export const errorTypes: Topic = {
  id: 'error-types',
  title: 'Error Turlari',
  importance: 3,
  status: 'to-learn',
  description: 'Built-in error turlari: TypeError, RangeError, ReferenceError, SyntaxError, AggregateError',

  content: `═══════════════════════════════════════
  JAVASCRIPT ERROR TURLARI
═══════════════════════════════════════

JavaScript da barcha xatolar Error dan meros oladi. Engine va
dasturchi turli xil xato turlari bilan ishlaydi. Har bir tur
ma'lum bir muammoni ifodalaydi.

Error ierarxiyasi:
  Error (asosiy klass)
  ├── TypeError
  ├── RangeError
  ├── ReferenceError
  ├── SyntaxError
  ├── URIError
  ├── EvalError
  ├── AggregateError (ES2021)
  └── InternalError (faqat Firefox)

Har bir error turi Error dan name, message, stack xususiyatlarini
meros oladi. Farqi — name xususiyati va QACHON throw bo'lishi.

═══════════════════════════════════════
  TYPEERROR
═══════════════════════════════════════

Qiymat kutilgan turda BO'LMAGANDA yuz beradi. Eng ko'p
uchraydigan xato turi.

Qachon throw bo'ladi:
1. undefined/null da property o'qish — null.name
2. Funksiya bo'lmagan narsani chaqirish — "hello"()
3. const ga qayta tayinlash — const x = 1; x = 2
4. Symbol ni string ga aylantirish — "" + Symbol()
5. read-only property ga yozish (strict mode)

MUHIM: typeof operatori HECH QACHON TypeError bermaydi —
u har doim string qaytaradi, hatto undefined o'zgaruvchi uchun.

═══════════════════════════════════════
  RANGEERROR
═══════════════════════════════════════

Qiymat ruxsat etilgan DIAPAZONDAN tashqarida bo'lganda.

Qachon throw bo'ladi:
1. Array(nomanfiy_emas) — new Array(-1)
2. toFixed/toPrecision chegaradan tashqari — (1.5).toFixed(200)
3. Maximum call stack exceeded — cheksiz rekursiya
4. Invalid array length — katta yoki manfiy uzunlik
5. String.prototype.repeat — manfiy yoki Infinity

"Maximum call stack size exceeded" — eng ko'p uchraydigan
RangeError. Cheksiz rekursiya yoki juda chuqur call stack.

═══════════════════════════════════════
  REFERENCEERROR
═══════════════════════════════════════

Mavjud BO'LMAGAN o'zgaruvchiga murojaat qilinganda.

Qachon throw bo'ladi:
1. E'lon qilinmagan o'zgaruvchi — console.log(noVariable)
2. let/const TDZ (Temporal Dead Zone) — ishlatish e'londan oldin
3. Strict mode da e'lonsiz tayinlash — x = 5 (var/let/const siz)

MUHIM: typeof EMAS — typeof undeclaredVar === "undefined"
xato bermaydi. Lekin undeclaredVar === undefined xato beradi.

═══════════════════════════════════════
  SYNTAXERROR
═══════════════════════════════════════

Kod GRAMMATIK jihatdan noto'g'ri bo'lganda. Bu yagona xato
turi bo'lib, odatda PARSE vaqtida (runtime emas) yuz beradi —
shuning uchun try/catch bilan ushlash MUMKIN EMAS (eval va
JSON.parse dan tashqari).

Qachon throw bo'ladi:
1. Noto'g'ri sintaksis — if (true { (qavs yo'q)
2. Takroriy parametr (strict) — function f(a, a) {}
3. Reserved word — let class = 5
4. JSON.parse() noto'g'ri format — JSON.parse("{bad}")
5. eval() noto'g'ri kod — eval("if (")

JSON.parse() SyntaxError ni try/catch bilan ushlash MUMKIN —
bu runtime da yuz beradi.

═══════════════════════════════════════
  URIERROR VA EVALERROR
═══════════════════════════════════════

URIError — URI funksiyalarida noto'g'ri parametr:
  decodeURIComponent("%")  // URIError
  encodeURI("\uD800")       // URIError (lone surrogate)

EvalError — tarixiy xato turi, eval bilan bog'liq. Zamonaviy
JavaScript da deyarli UCHRAMAYDI. Spec da qolgan lekin engine
lar throw qilmaydi. Faqat orqaga moslik uchun mavjud.

═══════════════════════════════════════
  AGGREGATEERROR (ES2021)
═══════════════════════════════════════

Bir nechta xatoni BITTA obyektda saqlaydi. Asosan Promise.any()
barcha Promise reject bo'lganda throw qiladi.

  const errors = [
    new TypeError("Xato 1"),
    new RangeError("Xato 2")
  ]
  throw new AggregateError(errors, "Hammasi xato")

Xususiyatlari:
1. errors — xatolar MASSIVI (iterable)
2. message — umumiy xabar
3. name — "AggregateError"

═══════════════════════════════════════
  ERROR VS EXCEPTION
═══════════════════════════════════════

JavaScript da bu ikki tushuncha ko'pincha aralashtiriladi:

Error — obyekt, xato haqida ma'lumot tashuvchi. new Error()
bilan yaratiladi, lekin hech narsa qilmaydi.

Exception — throw bilan TASHLANGAN Error. throw qilinganda
dastur normal oqimini TO'XTATADI va eng yaqin catch ga o'tadi.

  const err = new Error("Xato")  // Faqat obyekt — exception emas
  throw err                       // Endi EXCEPTION — dastur to'xtaydi

Barcha exception lar error lekin barcha error lar exception
EMAS. Error obyekti yaratib, uni throw qilmasdan logging
yoki return qilish mumkin.`,

  codeExamples: [
    {
      title: 'Har bir error turining namunasi',
      language: 'js',
      description: 'Built-in error turlarini qo"lda ishga tushirish',
      code: `// TypeError — noto'g'ri tur operatsiyasi
try {
  null.toString()
} catch (e) {
  console.log(e.name)  // "TypeError"
}

try {
  const obj = {}
  obj.method()  // method mavjud emas
} catch (e) {
  console.log(e.message)  // "obj.method is not a function"
}

// ReferenceError — mavjud bo'lmagan o'zgaruvchi
try {
  console.log(noSuchVariable)
} catch (e) {
  console.log(e.name)  // "ReferenceError"
}

// let TDZ (Temporal Dead Zone)
try {
  console.log(x)  // TDZ — e'londan oldin
  let x = 5
} catch (e) {
  console.log(e.name)  // "ReferenceError"
}

// RangeError — diapazondan tashqari
try {
  new Array(-1)
} catch (e) {
  console.log(e.name)  // "RangeError"
}

// SyntaxError — JSON.parse da
try {
  JSON.parse("{ invalid }")
} catch (e) {
  console.log(e.name)  // "SyntaxError"
}

// URIError — noto'g'ri URI
try {
  decodeURIComponent("%")
} catch (e) {
  console.log(e.name)  // "URIError"
}`
    },
    {
      title: 'instanceof bilan xato turini aniqlash',
      language: 'js',
      description: 'Xato turini tekshirish va turga qarab qayta ishlash',
      code: `function handleError(error) {
  if (error instanceof TypeError) {
    console.error("Tur xatosi:", error.message)
    // Ko'pincha null/undefined tekshirish kerak
    return { status: 400, message: "Noto'g'ri ma'lumot turi" }
  }

  if (error instanceof RangeError) {
    console.error("Diapazon xatosi:", error.message)
    return { status: 400, message: "Qiymat ruxsat etilgan chegaradan tashqari" }
  }

  if (error instanceof ReferenceError) {
    console.error("Referens xatosi:", error.message)
    // Bu odatda dasturchi xatosi — production da bo'lmasligi kerak
    return { status: 500, message: "Ichki xato" }
  }

  if (error instanceof SyntaxError) {
    console.error("Sintaksis xatosi:", error.message)
    return { status: 400, message: "Noto'g'ri format" }
  }

  // Noma'lum xato
  console.error("Noma'lum xato:", error)
  return { status: 500, message: "Kutilmagan xato" }
}

// Ishlatish
try {
  const data = JSON.parse(userInput)
  processData(data)
} catch (error) {
  const response = handleError(error)
  sendResponse(response)
}

// MUHIM: instanceof ierarxiyani tekshiradi
const typeErr = new TypeError("xato")
console.log(typeErr instanceof TypeError)  // true
console.log(typeErr instanceof Error)      // true — chunki meros
console.log(typeErr instanceof RangeError) // false`
    },
    {
      title: 'AggregateError va Promise.any()',
      language: 'js',
      description: 'Bir nechta xatoni bitta obyektda boshqarish',
      code: `// Promise.any — HAMMASI reject bo'lganda AggregateError
const mirrors = [
  fetch("https://mirror1.example.com/data"),
  fetch("https://mirror2.example.com/data"),
  fetch("https://mirror3.example.com/data"),
]

try {
  // Birinchi muvaffaqiyatli natijani oladi
  const response = await Promise.any(mirrors)
  const data = await response.json()
} catch (error) {
  if (error instanceof AggregateError) {
    console.log("Barcha mirror lar ishlamadi:")
    console.log("Umumiy:", error.message)

    // Har bir xatoni ko'rish
    error.errors.forEach((err, i) => {
      console.log("Mirror " + (i + 1) + ":", err.message)
    })
  }
}

// AggregateError qo'lda yaratish
function validateForm(data) {
  const errors = []

  if (!data.name) {
    errors.push(new Error("Ism kiritilmagan"))
  }
  if (!data.email) {
    errors.push(new Error("Email kiritilmagan"))
  }
  if (data.age < 0) {
    errors.push(new RangeError("Yosh manfiy bo'lishi mumkin emas"))
  }

  if (errors.length > 0) {
    throw new AggregateError(errors, "Validatsiya xatosi")
  }
}

try {
  validateForm({ name: "", email: "", age: -5 })
} catch (error) {
  console.log(error.errors.length)  // 3
  error.errors.forEach(e => console.log(e.message))
}`
    },
    {
      title: 'Error vs Exception farqi',
      language: 'js',
      description: 'Error obyekti va throw qilingan exception farqi',
      code: `// Error obyekti yaratish — bu exception EMAS
const error = new Error("Xato yuz berdi")
console.log(error.message)  // "Xato yuz berdi"
console.log(error.stack)    // Stack trace mavjud
// Dastur to'xtamadi! Error faqat obyekt.

// throw qilganda — EXCEPTION bo'ladi
function riskyOperation() {
  const error = new Error("Kritik xato")
  // Hozircha faqat obyekt...
  throw error  // ENDI exception — dastur oqimi o'zgaradi
}

// Error ni throw qilmasdan ishlatish
function validateAge(age) {
  if (age < 0) {
    // Exception tashlash o'rniga error QAYTARISH
    return { success: false, error: new Error("Manfiy yosh") }
  }
  return { success: true, data: age }
}

const result = validateAge(-5)
if (!result.success) {
  console.log(result.error.message)  // "Manfiy yosh"
  console.log(result.error.stack)    // Stack trace
}

// Go-style error handling pattern
function divide(a, b) {
  if (b === 0) {
    return [null, new Error("Nolga bo'lish mumkin emas")]
  }
  return [a / b, null]
}

const [result2, err] = divide(10, 0)
if (err) {
  console.log(err.message)
} else {
  console.log(result2)
}`
    },
    {
      title: 'Xato turlarini tekshirish usullari',
      language: 'js',
      description: 'instanceof, name, constructor bilan xato aniqlash',
      code: `// 1. instanceof — eng ishonchli
try {
  JSON.parse("bad")
} catch (e) {
  console.log(e instanceof SyntaxError)  // true
  console.log(e instanceof Error)        // true (parent)
}

// 2. name xususiyati — string solishtirish
try {
  null.property
} catch (e) {
  console.log(e.name === "TypeError")  // true
}

// 3. constructor — aniq konstruktorni tekshirish
try {
  undeclaredVar
} catch (e) {
  console.log(e.constructor === ReferenceError)  // true
  // instanceof dan farqi: meros zanjirini tekshirmaydi
}

// Switch bilan xato routing
function errorRouter(error) {
  switch (error.constructor) {
    case TypeError:
      return handleTypeError(error)
    case RangeError:
      return handleRangeError(error)
    case SyntaxError:
      return handleSyntaxError(error)
    default:
      return handleUnknownError(error)
  }
}

// MUHIM: SyntaxError ni try/catch bilan FAQAT
// runtime da throw bo'lganda ushlash mumkin
try {
  JSON.parse("bad")   // ✅ Ushlanadi — runtime
  eval("if (")         // ✅ Ushlanadi — runtime eval
} catch (e) {
  console.log("Ushlandi:", e.name)
}

// Parse-time SyntaxError — USHLAB BO'LMAYDI
// try { if (true { } catch (e) {} — fayl parse bo'lmaydi`
    }
  ],

  interviewQA: [
    {
      question: 'JavaScript da qanday built-in error turlari bor? Har birining farqini ayting.',
      answer: 'Asosiy 7 ta tur: 1) TypeError — qiymat kutilgan turda emas (null.prop, "str"()). 2) RangeError — qiymat chegaradan tashqari (Array(-1), cheksiz rekursiya). 3) ReferenceError — mavjud bo\'lmagan o\'zgaruvchi, TDZ. 4) SyntaxError — grammatik xato, asosan parse vaqtida (JSON.parse va eval da runtime). 5) URIError — noto\'g\'ri URI (decodeURIComponent("%")). 6) EvalError — tarixiy, zamonaviy JS da uchramaydi. 7) AggregateError (ES2021) — bir nechta xatoni saqlaydi, Promise.any() da. Hammasi Error dan meros oladi.'
    },
    {
      question: 'TypeError va ReferenceError farqi nima?',
      answer: 'ReferenceError — o\'zgaruvchi MAVJUD EMAS (e\'lon qilinmagan yoki TDZ da). Misol: console.log(foo) — foo umuman yo\'q. TypeError — o\'zgaruvchi MAVJUD lekin unda kutilgan operatsiya BAJARIB BO\'LMAYDI. Misol: const foo = null; foo.bar — foo mavjud (null), lekin property o\'qib bo\'lmaydi. Yana bir misol: const x = 5; x() — x mavjud (5), lekin funksiya emas. Muhim: typeof undeclared === "undefined" xato bermaydi, lekin undeclared.prop TypeError beradi (ReferenceError emas, chunki typeof tekshiruvdan o\'tadi).'
    },
    {
      question: 'SyntaxError ni try/catch bilan ushlash mumkinmi?',
      answer: 'Ikki holat bor. 1) Parse-time SyntaxError — USHLASH MUMKIN EMAS. JavaScript engine kodni avval parse qiladi, xato bo\'lsa fayl UMUMAN ishga tushmaydi. try/catch ishlashga ulgurmasdan oldin xato beradi. 2) Runtime SyntaxError — USHLASH MUMKIN. Bu faqat ikkita holatda: JSON.parse("bad json") va eval("noto\'g\'ri kod"). Bu funksiyalar runtime da string ni parse qiladi, shuning uchun try/catch ishlaydi. Shuning uchun JSON.parse ni DOIMO try/catch ichida ishlatish kerak.'
    },
    {
      question: 'AggregateError nima va qachon ishlatiladi?',
      answer: 'AggregateError (ES2021) — bir nechta xatoni BITTA obyektda saqlaydi. errors xususiyati — xatolar massivi. Asosiy ishlatilish: Promise.any() — barcha Promise lar reject bo\'lganda AggregateError throw qiladi, har bir Promise ning xatosi errors ichida. Qo\'lda ham yaratish mumkin: new AggregateError([err1, err2], "Umumiy xabar"). Amaliy foydalanish: form validatsiya (barcha xatolarni bir vaqtda ko\'rsatish), parallel operatsiyalar (bir nechta API call xatosi), batch processing (muvaffaqiyatsiz element lar ro\'yxati).'
    },
    {
      question: 'Error va exception farqi nima?',
      answer: 'Error — bu OBYEKT, new Error("msg") bilan yaratiladi. O\'zi hech narsa qilmaydi — faqat xato haqida ma\'lumot saqlaydi (message, name, stack). Exception — bu HODISA, throw bilan Error tashlanganida yuz beradi. Dastur normal oqimini TO\'XTATADI va eng yaqin catch ga o\'tadi. Barcha exception lar error lekin barcha error lar exception EMAS. Error ni throw qilmasdan return qilish mumkin (Go-style: return [null, error]). Bu pattern da dastur oqimi o\'zgarmaydi, chaqiruvchi xatoni o\'zi qayta ishlaydi.'
    },
    {
      question: 'Xato turini qanday aniqlash mumkin? Qaysi usul eng ishonchli?',
      answer: 'Uchta usul: 1) instanceof — eng ishonchli, meros zanjirini ham tekshiradi (typeErr instanceof Error === true). 2) error.name — string solishtirish, lekin qo\'lda o\'zgartirilishi mumkin. 3) error.constructor — aniq konstruktorni tekshiradi, meros zanjirini tekshirmaydi. Best practice: instanceof ishlatish, chunki custom error lar ham to\'g\'ri ishlaydi. switch(true) yoki if/else if zanjiri bilan turga qarab routing qilish: if (e instanceof TypeError) handleType() else if (e instanceof RangeError) handleRange(). Muhim: catch dan keyin noma\'lum xatolarni qayta throw qilish kerak.'
    }
  ],

  relatedTopics: [
    { techId: 'javascript', sectionId: 'error-handling', topicId: 'try-catch', label: 'Try / Catch / Finally' },
    { techId: 'javascript', sectionId: 'error-handling', topicId: 'custom-errors', label: 'Custom Error lar' },
    { techId: 'javascript', sectionId: 'error-handling', topicId: 'async-errors', label: 'Async xatolar' },
    { techId: 'javascript', sectionId: 'async-javascript', topicId: 'promise-methods', label: 'Promise metodlari' }
  ]
}
