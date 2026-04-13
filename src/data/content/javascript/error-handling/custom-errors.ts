import type { Topic } from '../../../types'

export const customErrors: Topic = {
  id: 'custom-errors',
  title: 'Custom Error lar',
  importance: 2,
  status: 'to-learn',
  description: 'Custom Error class yaratish, error hierarchy, instanceof, serialization',

  content: `═══════════════════════════════════════
  CUSTOM ERROR YARATISH
═══════════════════════════════════════

Built-in Error turlari (TypeError, RangeError) ko'pincha
yetarli emas. Real loyihalarda o'z xato klasslarini yaratish
kerak — bu xatolarni ANIQLASH va QAYTA ISHLASH ni osonlashtiradi.

Custom Error yaratish qoidalari:
1. Error dan extends qilish (yoki boshqa Error subclass dan)
2. super(message) chaqirish — message va stack ni o'rnatadi
3. this.name = "ClassName" — xato turini belgilash
4. Qo'shimcha xususiyatlar qo'shish (code, statusCode, details)

MUHIM: this.name ni o'rnatmaslik eng keng tarqalgan xato —
bu holda name "Error" bo'lib qoladi va debugging qiyinlashadi.

═══════════════════════════════════════
  ERROR HIERARCHY PATTERN
═══════════════════════════════════════

Katta loyihalarda error hierarchy quriladi — har bir qatlam
o'z xato turlariga ega.

Asosiy tuzilma:
  AppError (bazaviy)
  ├── ValidationError
  │   ├── RequiredFieldError
  │   └── InvalidFormatError
  ├── HttpError
  │   ├── NotFoundError (404)
  │   ├── UnauthorizedError (401)
  │   └── ForbiddenError (403)
  ├── DatabaseError
  │   ├── ConnectionError
  │   └── QueryError
  └── BusinessError
      ├── InsufficientFundsError
      └── OutOfStockError

Hierarchy afzalliklari:
1. instanceof bilan turli darajalarda ushlash mumkin
2. Har bir qatlamda maxsus xususiyatlar (statusCode, fields)
3. Markazlashgan error handling osonlashadi
4. API response avtomatik generatsiya qilish mumkin

═══════════════════════════════════════
  NAME, MESSAGE, STACK, CAUSE
═══════════════════════════════════════

Custom Error da to'rtta muhim xususiyat:

1. name — xato turi nomi (constructor.name bilan bir xil qilish)
   Debugging da eng birinchi ko'rinadigan narsa.

2. message — inson uchun tushunarli xabar
   Foydalanuvchiga ko'rsatish yoki log qilish uchun.

3. stack — avtomatik yaratiladi (super() da)
   Xato QAYERDA yuz berganini ko'rsatadi.

4. cause (ES2022) — asl xato sababi
   super(message, { cause }) orqali uzatiladi.

MUHIM: stack trace super() chaqirilgan joydan boshlanadi.
Agar super() chaqirilmasa — stack trace bo'lmaydi.

═══════════════════════════════════════
  INSTANCEOF BILAN XATO TURINI ANIQLASH
═══════════════════════════════════════

instanceof operatori meros zanjirini tekshiradi:

  const err = new ValidationError("Ism bo'sh")
  err instanceof ValidationError  // true
  err instanceof AppError         // true (parent)
  err instanceof Error            // true (grandparent)
  err instanceof TypeError        // false

Bu catch blokda SELECTIVE HANDLING imkonini beradi — turli
xato turlarini turlicha qayta ishlash.

MUHIM: instanceof cross-realm (iframe, Worker) da ISHLAMAYDI.
Bu holatlarda error.name yoki error.code bilan tekshirish kerak.

═══════════════════════════════════════
  ERROR SERIALIZATION (toJSON)
═══════════════════════════════════════

Error obyekti JSON.stringify() da bo'sh obyekt beradi — chunki
name, message, stack enumerable EMAS. toJSON() metodi qo'shish
yoki maxsus serializer yozish kerak.

API response uchun serialization muhim:
1. toJSON() — JSON.stringify() avtomatik chaqiradi
2. message — foydalanuvchiga ko'rsatiladigan xabar
3. code — dasturiy tekshirish uchun
4. details — qo'shimcha ma'lumot (validatsiya xatolari)
5. stack — faqat DEVELOPMENT da (production da yo'q!)

═══════════════════════════════════════
  BEST PRACTICES
═══════════════════════════════════════

1. Har bir module/domain uchun bazaviy Error class yarating
2. name ni DOIM o'rnating — debugging uchun muhim
3. cause ni ishlatib asl xatoni saqlang
4. Error code ishlatib programmatic tekshirish osonlashtiring
5. toJSON() bilan API response uchun serialization qo'shing
6. TypeScript da discriminated union sifatida ishlatish mumkin
7. Production da stack trace ni foydalanuvchiga ko'rsatmang
8. Error hierarchy ni haddan tashqari chuqur qilmang (2-3 daraja)`,

  codeExamples: [
    {
      title: 'Asosiy Custom Error yaratish',
      language: 'js',
      description: 'Error dan extends qilib custom error class yaratish',
      code: `// Bazaviy Custom Error
class AppError extends Error {
  constructor(message, options = {}) {
    super(message, { cause: options.cause })
    this.name = "AppError"
    this.code = options.code || "APP_ERROR"
    this.statusCode = options.statusCode || 500
    this.timestamp = new Date().toISOString()
  }
}

// Ishlatish
try {
  throw new AppError("Kutilmagan xato", {
    code: "UNEXPECTED",
    statusCode: 500
  })
} catch (error) {
  console.log(error.name)        // "AppError"
  console.log(error.code)        // "UNEXPECTED"
  console.log(error.statusCode)  // 500
  console.log(error.message)     // "Kutilmagan xato"
  console.log(error.stack)       // Stack trace mavjud
}

// MUHIM: this.name o'rnatmaslik — keng tarqalgan xato
class BadError extends Error {
  constructor(message) {
    super(message)
    // name o'rnatilmagan!
  }
}
const bad = new BadError("xato")
console.log(bad.name)  // "Error" — "BadError" emas!`
    },
    {
      title: 'Error hierarchy — loyiha uchun',
      language: 'js',
      description: 'Katta loyihalar uchun xato ierarxiyasi',
      code: `// Bazaviy xato
class AppError extends Error {
  constructor(message, options = {}) {
    super(message, { cause: options.cause })
    this.name = this.constructor.name
    this.code = options.code || "INTERNAL_ERROR"
    this.statusCode = options.statusCode || 500
  }
}

// Validatsiya xatolari
class ValidationError extends AppError {
  constructor(message, fields = [], options = {}) {
    super(message, { ...options, code: "VALIDATION_ERROR", statusCode: 400 })
    this.fields = fields  // Qaysi fieldlar noto'g'ri
  }
}

// HTTP xatolari
class NotFoundError extends AppError {
  constructor(resource, id) {
    super(resource + " #" + id + " topilmadi", {
      code: "NOT_FOUND",
      statusCode: 404
    })
    this.resource = resource
    this.resourceId = id
  }
}

class UnauthorizedError extends AppError {
  constructor(message = "Avtorizatsiya kerak") {
    super(message, { code: "UNAUTHORIZED", statusCode: 401 })
  }
}

// instanceof bilan selective handling
function handleError(error) {
  if (error instanceof ValidationError) {
    return {
      status: 400,
      body: {
        message: error.message,
        fields: error.fields
      }
    }
  }
  if (error instanceof NotFoundError) {
    return { status: 404, body: { message: error.message } }
  }
  if (error instanceof AppError) {
    return { status: error.statusCode, body: { message: error.message } }
  }
  // Noma'lum xato
  return { status: 500, body: { message: "Ichki xato" } }
}`
    },
    {
      title: 'Error cause bilan xato zanjiri',
      language: 'js',
      description: 'ES2022 cause xususiyati bilan asl xatoni saqlash',
      code: `// Database qatlami
class DatabaseError extends Error {
  constructor(message, options) {
    super(message, options)
    this.name = "DatabaseError"
  }
}

// Service qatlami — database xatosini o'rab olish
class ServiceError extends Error {
  constructor(message, options) {
    super(message, options)
    this.name = "ServiceError"
  }
}

// Amaliy misol — xato zanjiri
async function getUserFromDB(id) {
  try {
    return await db.query("SELECT * FROM users WHERE id = " + id)
  } catch (error) {
    throw new DatabaseError("Foydalanuvchi so'rovi bajarilmadi", {
      cause: error  // Asl DB xatosi saqlanadi
    })
  }
}

async function getUserService(id) {
  try {
    return await getUserFromDB(id)
  } catch (error) {
    throw new ServiceError("Foydalanuvchi xizmati xatosi", {
      cause: error  // DatabaseError saqlanadi
    })
  }
}

// Xato zanjirini ko'rish
try {
  await getUserService(123)
} catch (error) {
  console.log(error.message)
  // "Foydalanuvchi xizmati xatosi"

  console.log(error.cause.message)
  // "Foydalanuvchi so'rovi bajarilmadi"

  console.log(error.cause.cause.message)
  // "ECONNREFUSED" — asl network xatosi
}

// Butun zanjirni chiqarish
function getErrorChain(error) {
  const chain = []
  let current = error
  while (current) {
    chain.push({ name: current.name, message: current.message })
    current = current.cause
  }
  return chain
}`
    },
    {
      title: 'Error serialization — toJSON',
      language: 'js',
      description: 'Error ni JSON ga aylantirish (API response uchun)',
      code: `// Muammo: Error JSON.stringify da bo'sh
const err = new Error("Xato")
console.log(JSON.stringify(err))  // "{}" — bo'sh!
// Sabab: name, message, stack — enumerable emas

// Yechim: toJSON metodi
class ApiError extends Error {
  constructor(message, options = {}) {
    super(message, { cause: options.cause })
    this.name = this.constructor.name
    this.code = options.code || "INTERNAL_ERROR"
    this.statusCode = options.statusCode || 500
    this.details = options.details || null
  }

  toJSON() {
    const json = {
      name: this.name,
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
    }

    if (this.details) {
      json.details = this.details
    }

    // Stack faqat development da
    if (process.env.NODE_ENV !== "production") {
      json.stack = this.stack
    }

    // Cause zanjirini ham serialize qilish
    if (this.cause) {
      json.cause = this.cause instanceof ApiError
        ? this.cause.toJSON()
        : { message: this.cause.message }
    }

    return json
  }
}

// Ishlatish
const error = new ApiError("Validatsiya xatosi", {
  code: "VALIDATION_ERROR",
  statusCode: 400,
  details: {
    email: "Email formati noto'g'ri",
    age: "Yosh 0 dan katta bo'lishi kerak"
  }
})

console.log(JSON.stringify(error, null, 2))
// {
//   "name": "ApiError",
//   "code": "VALIDATION_ERROR",
//   "message": "Validatsiya xatosi",
//   "statusCode": 400,
//   "details": { "email": "...", "age": "..." }
// }`
    },
    {
      title: 'Amaliy Error factory pattern',
      language: 'js',
      description: 'Factory funksiya bilan error yaratishni soddalashtirish',
      code: `// Error factory — ko'p ishlatiladigan xatolarni tez yaratish
class AppError extends Error {
  constructor(message, options = {}) {
    super(message, { cause: options.cause })
    this.name = this.constructor.name
    this.code = options.code
    this.statusCode = options.statusCode || 500
    this.details = options.details
  }

  // Static factory metodlari
  static badRequest(message, details) {
    return new AppError(message, {
      code: "BAD_REQUEST", statusCode: 400, details
    })
  }

  static unauthorized(message = "Avtorizatsiya kerak") {
    return new AppError(message, {
      code: "UNAUTHORIZED", statusCode: 401
    })
  }

  static notFound(resource, id) {
    return new AppError(resource + " topilmadi", {
      code: "NOT_FOUND",
      statusCode: 404,
      details: { resource, id }
    })
  }

  static internal(message, cause) {
    return new AppError(message || "Ichki server xatosi", {
      code: "INTERNAL", statusCode: 500, cause
    })
  }
}

// Ishlatish — juda toza va o'qilishi oson
function getUser(id) {
  if (!id) throw AppError.badRequest("ID kiritilmagan")

  const user = db.findById(id)
  if (!user) throw AppError.notFound("User", id)

  return user
}

function updateProfile(userId, data) {
  if (!isAuthenticated()) {
    throw AppError.unauthorized()
  }

  const errors = validateProfile(data)
  if (errors.length > 0) {
    throw AppError.badRequest("Validatsiya xatosi", errors)
  }
}`
    }
  ],

  interviewQA: [
    {
      question: 'Custom Error qanday yaratiladi? Qanday qoidalarga rioya qilish kerak?',
      answer: 'Custom Error yaratish qadamlari: 1) Error (yoki uning subclass i) dan extends qilish. 2) super(message, { cause }) chaqirish — bu message, stack, cause ni o\'rnatadi. 3) this.name = this.constructor.name yoki "ClassName" — MUHIM, aks holda name "Error" bo\'lib qoladi. 4) Qo\'shimcha xususiyatlar: code (programmatic), statusCode (HTTP), details (tafsilotlar). Best practice: this.name ni DOIM constructor.name ga tenglashtiring — refactoring da avtomatik yangilanadi. cause ni doim uzating — asl xato yo\'qolmasin.'
    },
    {
      question: 'Error hierarchy (ierarxiya) nima uchun kerak?',
      answer: 'Error hierarchy — xatolarni darajalarga bo\'lish. Afzalliklari: 1) instanceof bilan turli darajada ushlash: catch (e) { if (e instanceof ValidationError) } — faqat validatsiya, if (e instanceof AppError) — barcha app xatolari. 2) Har bir qatlam o\'z xususiyatlari: ValidationError.fields, NotFoundError.resource. 3) Markazlashgan error handling: Express middleware yoki React ErrorBoundary da xato turiga qarab response qaytarish. 4) Kodni o\'qish oson: throw new NotFoundError("User", 123) — nima bo\'lganini darhol tushunish. Optimal chuqurlik: 2-3 daraja, haddan tashqari chuqur qilmang.'
    },
    {
      question: 'Error ni JSON.stringify() qilganda nima uchun bo"sh obyekt beradi?',
      answer: 'Error ning name, message, stack xususiyatlari enumerable: false — JSON.stringify() faqat enumerable xususiyatlarni serialize qiladi. Yechimlar: 1) toJSON() metodi qo\'shish — JSON.stringify avtomatik chaqiradi. 2) Object.getOwnPropertyNames() bilan barcha xususiyatlarni olish. 3) Custom replacer funksiya: JSON.stringify(error, Object.getOwnPropertyNames(error)). Best practice: toJSON() metodi — aniq nazorat beradi, production da stack ni yashirish, cause zanjirini ham serialize qilish mumkin. MUHIM: production da stack trace ni foydalanuvchiga ko\'rsatmang — xavfsizlik muammosi.'
    },
    {
      question: 'instanceof cross-realm (iframe) da nima uchun ishlamaydi?',
      answer: 'Har bir realm (iframe, Worker, vm module) o\'z GLOBAL obyektiga ega — shu jumladan o\'z Error konstruktori. iframe ichida yaratilgan Error — asosiy sahifaning Error konstruktoridan BOSHQA. Shuning uchun: iframeError instanceof Error === false. Yechimlar: 1) error.name bilan tekshirish (string solishtirish). 2) error.code bilan tekshirish (custom xususiyat). 3) Duck typing: "message" in error && "stack" in error. 4) structuredClone() yoki JSON bilan serialization. Amalda bu muammo kam uchraydi, lekin library yozayotganda hisobga olish kerak.'
    },
    {
      question: 'Error factory pattern nima va qanday afzalliklari bor?',
      answer: 'Error factory — static metodlar orqali error yaratish pattern i. Misol: AppError.notFound("User", 123) o\'rniga new AppError("User topilmadi", { code: "NOT_FOUND", statusCode: 404, details: {...} }). Afzalliklari: 1) Qisqa va o\'qilishi oson — throw AppError.unauthorized(). 2) Standartlashtirish — har bir tur uchun code va statusCode avtomatik. 3) DRY — bir xil xatoni turli joylarda bir xil tarzda yaratish. 4) IDE autocomplete — static metodlar ro\'yxatini ko\'rish. 5) Refactoring oson — error tuzilmasini bir joyda o\'zgartirish. Bu pattern Express, NestJS, Fastify kabi framework larda keng ishlatiladi.'
    },
    {
      question: 'Error cause (ES2022) nima va nima uchun muhim?',
      answer: 'cause — xatoning ASL SABABINI saqlash uchun. new Error("msg", { cause: originalError }). Nima uchun muhim: 1) Xato zanjiri (error chain) — database xato → service xato → API xato, har birida cause orqali asl sabab saqlanadi. 2) Debugging osonlashadi — foydalanuvchi "Buyurtma saqlanmadi" ko\'radi, developer cause.cause orqali "ECONNREFUSED" (database ulanish xatosi) ni topadi. 3) Abstraction darajalarini saqlaydi — har bir qatlam o\'z xabarini beradi, lekin asl sabab yo\'qolmaydi. Oldin dasturchilar error.originalError yoki error.inner kabi nom standartlashtirish bilan ovora edi — cause buni standart qildi.'
    }
  ],

  relatedTopics: [
    { techId: 'javascript', sectionId: 'error-handling', topicId: 'error-types', label: 'Error turlari' },
    { techId: 'javascript', sectionId: 'error-handling', topicId: 'try-catch', label: 'Try / Catch / Finally' },
    { techId: 'javascript', sectionId: 'error-handling', topicId: 'async-errors', label: 'Async xatolar' },
    { techId: 'javascript', sectionId: 'oop-classes', topicId: 'classes', label: 'Classes' }
  ]
}
