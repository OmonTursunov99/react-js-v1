import type { Topic } from '../../../types'

export const tryCatch: Topic = {
  id: 'try-catch',
  title: 'Try / Catch / Finally',
  importance: 3,
  status: 'to-learn',
  description: 'try/catch/finally mexanizmi, Error object, nested try/catch, finally xususiyatlari',

  content: `═══════════════════════════════════════
  TRY / CATCH / FINALLY MEXANIZMI
═══════════════════════════════════════

JavaScript da xatolarni boshqarish uchun try/catch/finally bloki
ishlatiladi. Bu runtime xatolarini ushlash va dastur ishini
to'xtatmasdan davom ettirish imkonini beradi.

Asosiy tuzilma:
  try {
    // Xato bo'lishi mumkin bo'lgan kod
  } catch (error) {
    // Xato ushlandi — qayta ishlash
  } finally {
    // HAR DOIM ishlaydi
  }

Ishlash tartibi:
1. try blokidagi kod bajariladi
2. Xato bo'lmasa — catch O'TKAZILADI, finally ishlaydi
3. Xato bo'lsa — try to'xtaydi, catch ishlaydi, keyin finally
4. finally HAR QANDAY holatda ishlaydi

═══════════════════════════════════════
  ERROR OBJECT
═══════════════════════════════════════

catch blokiga Error obyekti tushadi. Uning asosiy xususiyatlari:

1. message — xato matni ("Cannot read properties of undefined")
2. name — xato turi nomi ("TypeError", "RangeError")
3. stack — chaqiruvlar zanjiri (call stack) — debugging uchun
4. cause — xatoning sababi (ES2022, new Error("msg", { cause }))

MUHIM: catch parametri ixtiyoriy — catch {} (parametrsiz) yozish
mumkin (ES2019). Lekin odatda error obyekti kerak bo'ladi.

Stack trace — xato qayerda va qanday zanjir orqali yuz berganini
ko'rsatadi. Production da source map lar orqali asl faylga
xaritalanadi.

═══════════════════════════════════════
  NESTED TRY / CATCH
═══════════════════════════════════════

try/catch bloklar ichma-ich (nested) joylashishi mumkin. Ichki
catch xatoni ushlamasa yoki qayta throw qilsa — tashqi catch
ishlaydi.

  try {
    try {
      throw new Error("Ichki xato")
    } catch (e) {
      // Ichki catch ushladi
      throw e  // Qayta throw — tashqiga uzatish
    }
  } catch (e) {
    // Tashqi catch — ichkidan uzatilgan xatoni ushladi
  }

Pattern: Har bir abstraction darajasida o'z catch bloki —
ichki qatlam texnik xatoni ushlaydi, tashqi qatlam foydalanuvchiga
tushunarli xabar beradi.

═══════════════════════════════════════
  FINALLY — HAR DOIM ISHLAYDI
═══════════════════════════════════════

finally bloki QANDAY HOLATDA BO'LMASIN ishlaydi:
- Xato bo'lmasa — ishlaydi
- Xato bo'lsa — ishlaydi
- return bilan chiqsa — ishlaydi
- throw bilan chiqsa — ishlaydi
- break/continue bilan chiqsa — ishlaydi

MUHIM: finally ichida return yozilsa — try/catch ning return
qiymati BEKOR bo'ladi! Bu juda xavfli xato va ESLint buni
ogohlantiradi (no-unsafe-finally).

finally ishlatish holatlari:
1. Faylni yopish (file handle)
2. Database ulanishni qaytarish (connection pool)
3. Loading holatini o'chirish (loading = false)
4. Vaqtinchalik resurslarni tozalash (cleanup)

═══════════════════════════════════════
  THROW OPERATORI
═══════════════════════════════════════

throw — ixtiyoriy qiymatni xato sifatida tashlaydi. Eng yaxshi
amaliyot — doimo Error obyekti tashlash (stack trace uchun).

  throw new Error("Xato xabari")
  throw new TypeError("Noto'g'ri tur")
  throw new Error("Xato", { cause: originalError })

throw istalgan qiymatni tashlashi mumkin: string, number, object.
Lekin Error EMAS qiymat throw qilish — YOMON amaliyot, chunki
stack trace va name xususiyati bo'lmaydi.

═══════════════════════════════════════
  PERFORMANCE — TRY/CATCH QIMMATMI?
═══════════════════════════════════════

Zamonaviy V8 engine da try/catch deyarli performance ta'sir
qilMAYDI. Xato TASHLANMAGUNCHA overhead yo'q.

1. try bloki — oddiy kod bilan deyarli bir xil tezlikda ishlaydi
2. catch bloki — faqat xato bo'lganda ishlaydi, overhead minimal
3. V8 optimization — try/catch ichidagi kod optimizatsiya qilinadi
4. Asosiy cost — Error stack trace yaratishda (throw paytida)

MUHIM: try/catch ni loop ichiga qo'ymaslik kerak (agar mumkin
bo'lsa). Loop ni try/catch ICHIGA qo'yish tezroq:
  // Yaxshi: try { for (...) { ... } }
  // Yomon: for (...) { try { ... } catch { ... } }

Lekin premature optimization qilmang — o'qilishi muhimroq.`,

  codeExamples: [
    {
      title: 'try/catch/finally asoslari',
      language: 'js',
      description: 'Xatolarni ushlash va qayta ishlash asosiy pattern lari',
      code: `// Oddiy try/catch
try {
  const data = JSON.parse("noto'g'ri json")
} catch (error) {
  console.log(error.name)     // "SyntaxError"
  console.log(error.message)  // "Unexpected token..."
  console.log(error.stack)    // Stack trace
}

// try/catch/finally
function readConfig(path) {
  let file = null
  try {
    file = openFile(path)
    return parseConfig(file.content)
  } catch (error) {
    console.error("Config o'qib bo'lmadi:", error.message)
    return getDefaultConfig()  // Fallback
  } finally {
    // Fayl HAR DOIM yopiladi
    if (file) file.close()
  }
}

// catch parametrsiz (ES2019)
function isValidJSON(str) {
  try {
    JSON.parse(str)
    return true
  } catch {
    return false  // Xato tafsilotlari kerak emas
  }
}

// Error object xususiyatlari
try {
  null.property
} catch (e) {
  console.log(e.name)     // "TypeError"
  console.log(e.message)  // "Cannot read properties of null"
  console.log(typeof e.stack)  // "string" — chaqiruvlar zanjiri
}`
    },
    {
      title: 'Error cause va nested try/catch',
      language: 'js',
      description: 'ES2022 cause xususiyati va ichma-ich xato ushlash',
      code: `// Error cause (ES2022) — xato sababini saqlash
async function fetchUserData(userId) {
  try {
    const response = await fetch("/api/users/" + userId)
    if (!response.ok) {
      throw new Error("HTTP " + response.status)
    }
    return await response.json()
  } catch (error) {
    // Asl xatoni cause ga saqlash
    throw new Error("Foydalanuvchi ma'lumoti olinmadi", {
      cause: error
    })
  }
}

// Cause zanjirini tekshirish
try {
  await fetchUserData(123)
} catch (error) {
  console.log(error.message)        // "Foydalanuvchi ma'lumoti olinmadi"
  console.log(error.cause.message)  // "HTTP 404"
}

// Nested try/catch — qatlamli xato ushlash
function processOrder(order) {
  try {
    try {
      validateOrder(order)
    } catch (validationError) {
      // Validatsiya xatosini maxsus qayta ishlash
      logValidationError(validationError)
      throw new Error("Buyurtma noto'g'ri", {
        cause: validationError
      })
    }

    try {
      chargePayment(order.payment)
    } catch (paymentError) {
      // To'lov xatosini qayta urinish
      retryPayment(order.payment)
    }
  } catch (error) {
    // Tashqi catch — barcha qayta tashlangan xatolarni ushlaydi
    notifyAdmin(error)
  }
}`
    },
    {
      title: 'finally ning maxsus xulqi',
      language: 'js',
      description: 'finally har doim ishlaydi — hatto return va throw bilan ham',
      code: `// finally return ni bekor qiladi — XAVFLI!
function dangerousFinally() {
  try {
    return "try natijasi"
  } finally {
    return "finally natijasi"  // ⚠️ try ning return BEKOR!
  }
}
console.log(dangerousFinally())  // "finally natijasi"

// finally throw ni ham bekor qiladi
function anotherDanger() {
  try {
    throw new Error("try xatosi")
  } finally {
    return "hammasi yaxshi"  // ⚠️ Xato YUTILDI!
  }
}
console.log(anotherDanger())  // "hammasi yaxshi" (xato yo'qoldi)

// TO'G'RI finally ishlatish — return/throw YOZMANG
function safeFinally() {
  let loading = true
  try {
    const result = riskyOperation()
    return result
  } catch (error) {
    console.error("Xato:", error)
    throw error  // Qayta tashlash
  } finally {
    loading = false  // ✅ Faqat cleanup — return yo'q
    console.log("Loading:", loading)
  }
}

// finally bilan resurs boshqarish
function processFile(path) {
  const connection = db.connect()
  try {
    const data = connection.query("SELECT * FROM users")
    return transform(data)
  } finally {
    connection.close()  // HAR DOIM yopiladi
  }
}`
    },
    {
      title: 'throw best practices',
      language: 'js',
      description: 'To"g"ri throw qilish va xatolarni qayta tashlash',
      code: `// ✅ Doim Error obyekti throw qiling
throw new Error("Foydalanuvchi topilmadi")
throw new TypeError("ID raqam bo'lishi kerak")
throw new RangeError("Yosh 0 dan 150 gacha bo'lishi kerak")

// ❌ Yomon — stack trace yo'q
throw "Xato yuz berdi"        // string
throw 404                      // number
throw { code: "NOT_FOUND" }   // oddiy object

// Xatoni qayta tashlash (re-throw)
function parseUserInput(input) {
  try {
    return JSON.parse(input)
  } catch (error) {
    if (error instanceof SyntaxError) {
      // Faqat SyntaxError ni qayta ishlash
      return { raw: input }  // Fallback
    }
    throw error  // Boshqa xatolarni QAYTA TASHLASH
  }
}

// Shartli xato tashlash
function divide(a, b) {
  if (typeof a !== "number" || typeof b !== "number") {
    throw new TypeError("Argumentlar raqam bo'lishi kerak")
  }
  if (b === 0) {
    throw new RangeError("Nolga bo'lish mumkin emas")
  }
  return a / b
}

// Error wrapping pattern
function saveUser(userData) {
  try {
    validate(userData)
    db.insert(userData)
  } catch (error) {
    // Kontekst qo'shib qayta tashlash
    throw new Error(
      "Foydalanuvchi saqlanmadi: " + error.message,
      { cause: error }
    )
  }
}`
    },
    {
      title: 'Performance va amaliy pattern lar',
      language: 'js',
      description: 'try/catch performance va real-world pattern lar',
      code: `// Performance — loop ni try ichiga qo'yish yaxshiroq
// ✅ Yaxshi
function processItems(items) {
  try {
    for (const item of items) {
      transform(item)
    }
  } catch (error) {
    console.error("Qayta ishlashda xato:", error)
  }
}

// ❌ Sekinroq — har bir iteratsiyada try/catch
function processItemsSlow(items) {
  for (const item of items) {
    try {
      transform(item)
    } catch (error) {
      console.error("Xato:", item, error)
    }
  }
}

// Lekin: xatoga chidamli qayta ishlash kerak bo'lsa
// loop ichida try/catch TO'G'RI yechim
function processAllItems(items) {
  const errors = []
  for (const item of items) {
    try {
      transform(item)
    } catch (error) {
      errors.push({ item, error })
      // Davom etish — bitta xato boshqalarni to'xtatmaydi
    }
  }
  if (errors.length > 0) {
    console.warn(errors.length + " ta xato yuz berdi")
  }
}

// try/catch o'rniga shartli tekshirish (agar mumkin bo'lsa)
// ✅ Tezroq — xatoni oldini olish
function getNestedValue(obj, path) {
  return path.split(".").reduce((current, key) => {
    return current != null ? current[key] : undefined
  }, obj)
}

// ❌ Sekinroq — xatoga tayanish
function getNestedValueSlow(obj, path) {
  try {
    return path.split(".").reduce((c, k) => c[k], obj)
  } catch {
    return undefined
  }
}`
    }
  ],

  interviewQA: [
    {
      question: 'try/catch/finally qanday ishlaydi? Har bir blok vazifasini tushuntiring.',
      answer: 'try bloki — xato bo\'lishi mumkin bo\'lgan kodni o\'rab turadi. Xato yuz berganda try ning qolgan qismi o\'tkaziladi va boshqaruv catch ga o\'tadi. catch bloki — xato obyektini qabul qiladi (error.name, error.message, error.stack) va uni qayta ishlaydi. finally bloki — HAR QANDAY holatda ishlaydi: xato bo\'lsa ham, bo\'lmasa ham, hatto return yoki throw bilan chiqilsa ham. finally asosan resurslarni tozalash uchun ishlatiladi: fayl yopish, connection qaytarish, loading = false qilish. Muhim: finally ichida return yozmang — try/catch ning return qiymatini bekor qiladi.'
    },
    {
      question: 'Error obyektining qanday xususiyatlari bor? cause nima?',
      answer: 'Error obyektining asosiy xususiyatlari: 1) name — xato turi nomi ("TypeError", "RangeError"). 2) message — xato matni. 3) stack — chaqiruvlar zanjiri (call stack trace), debugging uchun muhim. 4) cause (ES2022) — xatoning asl sababi. new Error("msg", { cause: originalError }) bilan yaratiladi. cause xato zanjirini saqlash imkonini beradi — yuqori qatlam o\'z xabarini beradi, lekin asl sabab yo\'qolmaydi. Bu ayniqsa ko\'p qatlamli arxitekturada muhim: network xato → service xato → UI xato zanjiri.'
    },
    {
      question: 'finally bloki qachon ishlamaydi? return ni bekor qiladimi?',
      answer: 'finally DEYARLI har doim ishlaydi. Ishlamaydigan yagona holat — dastur to\'liq o\'chirilsa (process.exit(), brauzer tab yopilsa) yoki cheksiz loop bo\'lsa. finally ichida return yozilsa — try va catch ning return qiymati BEKOR bo\'ladi, bu juda xavfli! Misol: try { return 1 } finally { return 2 } natija 2. Xuddi shunday throw ham bekor bo\'ladi: try { throw error } finally { return "ok" } — xato yutiladi. Best practice: finally da FAQAT cleanup qiling, HECH QACHON return yoki throw yozmang. ESLint no-unsafe-finally qoidasi buni tekshiradi.'
    },
    {
      question: 'Nima uchun throw "string" yomon amaliyot? Nima throw qilish kerak?',
      answer: 'throw "string" yomon, chunki: 1) stack trace yo\'q — xato QAYERDA yuz berganini bilish imkonsiz. 2) name xususiyati yo\'q — xato TURINI aniqlash qiyin. 3) instanceof bilan tekshirib bo\'lmaydi. 4) catch da error.message ishlamaydi. Doimo new Error() yoki uning subclass larini throw qiling: new TypeError(), new RangeError(). ES2022 dan beri cause option ham bor: new Error("msg", { cause: originalError }). Custom Error class yaratish ham mumkin: class AppError extends Error {}. Bu stack trace, name, instanceof hammasini beradi.'
    },
    {
      question: 'try/catch performance ga ta"sir qiladimi?',
      answer: 'Zamonaviy V8 da try/catch deyarli performance ta\'sir QILMAYDI — xato TASHLANMAGUNCHA overhead yo\'q. V8 try ichidagi kodni oddiy kod kabi optimizatsiya qiladi. Asosiy cost — Error obyekti yaratishda (stack trace generatsiyasi). Amaliy maslahatlar: 1) Loop ni try ichiga qo\'ying (try { for } yaxshiroq, for { try } sekinroq). 2) Lekin xatoga chidamli qayta ishlash kerak bo\'lsa — loop ichida try/catch to\'g\'ri. 3) Imkon bo\'lsa xatoni OLDINI OLING (if tekshirish) — try/catch ga tayanmang. 4) Premature optimization qilmang — o\'qilishi muhimroq.'
    },
    {
      question: 'Nested try/catch qachon ishlatiladi? Qanday pattern lar bor?',
      answer: 'Nested try/catch — har bir abstraction darajasida o\'z xato ushlash qatlami kerak bo\'lganda ishlatiladi. Pattern lar: 1) Selective handling — ichki catch faqat ma\'lum xato turini ushlaydi, qolganini qayta throw qiladi. 2) Error wrapping — ichki catch texnik xatoni ushlaydi, tashqi catch foydalanuvchiga tushunarli xabar beradi. 3) Recovery — ichki blokda xatoni tuzatib davom etish, tashqi blokda umumiy xatoni ushlash. 4) Multi-step operations — har bir qadamda alohida xato ushlash (validate, process, save). Masalan: try { try { validate() } catch { throw new ValidationError(...) } try { save() } catch { retry() } } catch { notifyAdmin() }.'
    }
  ],

  relatedTopics: [
    { techId: 'javascript', sectionId: 'error-handling', topicId: 'error-types', label: 'Error turlari' },
    { techId: 'javascript', sectionId: 'error-handling', topicId: 'custom-errors', label: 'Custom Error lar' },
    { techId: 'javascript', sectionId: 'error-handling', topicId: 'async-errors', label: 'Async xatolar' },
    { techId: 'javascript', sectionId: 'async-javascript', topicId: 'promises', label: 'Promises' }
  ]
}
