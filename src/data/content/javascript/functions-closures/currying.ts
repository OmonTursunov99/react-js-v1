import type { Topic } from '../../../types'

export const currying: Topic = {
  id: 'currying',
  title: 'Currying',
  importance: 2,
  status: 'to-learn',
  description: 'Currying, partial application, auto-curry, amaliy misollar',
  content: `Currying — ko'p argumentli funksiyani ketma-ket BITTADAN argument qabul qiladigan funksiyalar zanjiriga aylantirish. f(a, b, c) → f(a)(b)(c). Bu funksional dasturlashning asosiy texnikalaridan biri.

═══════════════════════════════════════
  CURRYING NIMA?
═══════════════════════════════════════

Oddiy funksiya:
  function add(a, b, c) {
    return a + b + c
  }
  add(1, 2, 3)  // 6

Curried funksiya:
  function addCurried(a) {
    return function(b) {
      return function(c) {
        return a + b + c
      }
    }
  }
  addCurried(1)(2)(3)  // 6

Har bir chaqiruv BITTA argument qabul qiladi va YANGI FUNKSIYA qaytaradi.
Oxirgi argument berilganda — natija qaytaradi.

Arrow function bilan qisqaroq:
  const add = a => b => c => a + b + c

═══════════════════════════════════════
  CURRYING VS PARTIAL APPLICATION
═══════════════════════════════════════

Bu ikki tushuncha ko'p aralashtiriladi:

CURRYING:
  - DOIM bittadan argument qabul qiladi
  - f(a, b, c) → f(a)(b)(c)
  - Har bir bosqichda BITTA argument

PARTIAL APPLICATION:
  - Bir nechta argumentni OLDINDAN berish
  - f(a, b, c) → g(c) (a va b oldindan berilgan)
  - Ixtiyoriy sondagi argument berish mumkin

  // Currying:
  const curriedAdd = a => b => c => a + b + c
  curriedAdd(1)(2)(3)  // 6

  // Partial application:
  function partial(fn, ...presetArgs) {
    return function(...laterArgs) {
      return fn(...presetArgs, ...laterArgs)
    }
  }

  const add5 = partial(add, 2, 3)  // 2 va 3 oldindan berildi
  add5(10)  // 15

MUHIM: Currying partial application-ni OSONLASHTIRADI.
Curried funksiyadan istalgan bosqichda partial versiya olish mumkin:
  const add1 = curriedAdd(1)       // partial — a=1 berildi
  const add1and2 = curriedAdd(1)(2) // partial — a=1, b=2 berildi

═══════════════════════════════════════
  NIMA UCHUN CURRYING ISHLATILADI?
═══════════════════════════════════════

1. QAYTA ISHLATISH (Reusability):
   Umumiy funksiyadan maxsus versiyalar yaratish.

2. COMPOSITION:
   Curried funksiyalar pipe/compose bilan yaxshi ishlaydi.
   compose(filter(isActive), map(getName)) — har bir HOF bitta arg.

3. KONFIGURATSIYA:
   Bir marta sozlab, ko'p marta ishlatish.

4. POINT-FREE STYLE:
   Ma'lumot argumentini ko'rsatmasdan yozish:
   users.map(getName) — getName(user) emas

═══════════════════════════════════════
  AUTO-CURRY IMPLEMENTATSIYASI
═══════════════════════════════════════

Avtomatik curry — oddiy funksiyani curried versiyaga aylantiradi.
Argumentlar yetarli bo'lganda natija qaytaradi,
yetarli bo'lmaganda — yangi funksiya qaytaradi:

  const curry = (fn) => {
    const arity = fn.length  // kerakli argumentlar soni
    return function curried(...args) {
      if (args.length >= arity) {
        return fn(...args)           // argumentlar yetarli → natija
      }
      return (...moreArgs) =>
        curried(...args, ...moreArgs) // yetmasa → yangi funksiya
    }
  }

  const add = curry((a, b, c) => a + b + c)
  add(1)(2)(3)     // 6 — bittadan
  add(1, 2)(3)     // 6 — ikkita + bitta
  add(1)(2, 3)     // 6 — bitta + ikkita
  add(1, 2, 3)     // 6 — hammasi birdan

═══════════════════════════════════════
  AMALIY MISOLLAR
═══════════════════════════════════════

1. EVENT HANDLERS:
   const handleChange = (field) => (e) => {
     setForm(prev => ({ ...prev, [field]: e.target.value }))
   }
   <input onChange={handleChange('name')} />
   <input onChange={handleChange('email')} />

2. API HELPERS:
   const api = (method) => (path) => (data) => fetch(path, { method, body: data })
   const post = api('POST')
   const postUser = post('/api/users')
   postUser({ name: 'Ali' })

3. LOGGING:
   const log = (level) => (module) => (message) =>
     console.log(\`[\${level}] [\${module}] \${message}\`)
   const error = log('ERROR')
   const authError = error('Auth')
   authError('Token expired')  // [ERROR] [Auth] Token expired

4. VALIDATION:
   const validate = (rule) => (message) => (value) => rule(value) ? null : message
   const required = validate(v => v !== '')(''Majburiy maydon')
   const minLen = (n) => validate(v => v.length >= n)(\`Kamida \${n} belgi\`)

═══════════════════════════════════════
  KUTUBXONALARDA CURRYING
═══════════════════════════════════════

- Lodash: _.curry(), _.partial(), _.curryRight()
- Ramda: BARCHA funksiyalar auto-curried
- Redux: connect(mapState)(Component) — currying pattern
- React Router: withRouter(Component) — partial application

MUHIM: Haddan tashqari currying kodni MURAKKABLASHTIRADI.
Faqat aniq foyda bo'lganda ishlatish kerak — reusability yoki composition.`,
  codeExamples: [
    {
      title: 'Currying asoslari',
      language: 'js',
      code: `// Oddiy funksiya
function multiply(a, b) {
  return a * b
}
multiply(3, 4)  // 12

// Curried versiya
function curriedMultiply(a) {
  return function(b) {
    return a * b
  }
}

// Maxsus versiyalar yaratish
const double = curriedMultiply(2)
const triple = curriedMultiply(3)
const tenTimes = curriedMultiply(10)

double(5)    // 10
triple(5)    // 15
tenTimes(5)  // 50

// Arrow function bilan yanada qisqa
const multiply = a => b => a * b
const double = multiply(2)

// Amaliy misol — narx hisoblash
const calculatePrice = currency => taxRate => price => {
  const withTax = price * (1 + taxRate)
  const symbols = { USD: '$', EUR: '€', UZS: 'so\\'m' }
  return \`\${symbols[currency] || currency} \${withTax.toFixed(2)}\`
}

const usdPrice = calculatePrice('USD')(0.1)     // 10% tax
const eurPrice = calculatePrice('EUR')(0.2)     // 20% tax
const uzsPrice = calculatePrice('UZS')(0.12)   // 12% tax

usdPrice(100)   // '$ 110.00'
eurPrice(100)   // '€ 120.00'
uzsPrice(1000)  // 'so\\'m 1120.00'`,
      description: 'Currying — umumiy funksiyadan maxsus versiyalar yaratish. multiply dan double, triple hosil qilish. Narx hisoblashda — valyuta va soliq bir marta beriladi, keyin turli narxlarda qayta ishlatiladi.',
    },
    {
      title: 'Auto-curry implementatsiyasi',
      language: 'js',
      code: `// Universal curry funksiyasi
function curry(fn) {
  const arity = fn.length  // fn qabul qiladigan argumentlar soni

  return function curried(...args) {
    // Argumentlar yetarli — asl funksiyani chaqirish
    if (args.length >= arity) {
      return fn(...args)
    }

    // Yetarli emas — yangi funksiya qaytarish
    return function(...moreArgs) {
      return curried(...args, ...moreArgs)
    }
  }
}

// Ishlatish
const sum = curry((a, b, c) => a + b + c)

// Barcha variantlar ishlaydi:
sum(1)(2)(3)      // 6 — bittadan
sum(1, 2)(3)      // 6 — ikkita + bitta
sum(1)(2, 3)      // 6 — bitta + ikkita
sum(1, 2, 3)      // 6 — hammasi birdan

// Oraliq funksiyalar qayta ishlatiladi
const add1 = sum(1)
const add1and2 = sum(1)(2)
add1(10)(20)      // 31
add1and2(100)     // 103

// Murakkab misol — filter konfiguratsiyasi
const filterBy = curry((prop, value, arr) =>
  arr.filter(item => item[prop] === value)
)

const users = [
  { name: 'Ali', role: 'admin', active: true },
  { name: 'Vali', role: 'user', active: true },
  { name: 'Gani', role: 'admin', active: false },
]

const filterByRole = filterBy('role')
const getAdmins = filterByRole('admin')
const getUsers = filterByRole('user')

getAdmins(users)   // [Ali, Gani]
getUsers(users)    // [Vali]

// filterBy ni to'g'ridan-to'g'ri ham ishlatish mumkin:
filterBy('active', true, users)  // [Ali, Vali]`,
      description: 'Auto-curry — funksiya argumentlar yetarli bo\'lguncha yangi funksiya qaytaradi. fn.length orqali kerakli argumentlar sonini biladi. Barcha chaqirish variantlari ishlaydi: bittadan, guruhlangan, yoki hammasi birdan.',
    },
    {
      title: 'React-da currying — event handlers va konfiguratsiya',
      language: 'js',
      code: `// 1. Event handler factory — ENG ko'p ishlatiladigan pattern
function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', phone: '' })
  const [errors, setErrors] = useState({})

  // Curried handler — field nomini oldindan berish
  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }))
    // Xatolikni tozalash
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }))
    }
  }

  // Curried validator
  const validate = (rule) => (message) => (value) =>
    rule(value) ? null : message

  const required = validate(v => v.trim() !== '')('Majburiy maydon')
  const isEmail = validate(v => /^[^@]+@[^@]+$/.test(v))('Email noto\\'g\\'ri')
  const minLength = (n) =>
    validate(v => v.length >= n)(\`Kamida \${n} belgi bo\\'lishi kerak\`)

  return (
    <form>
      <input
        value={form.name}
        onChange={handleChange('name')}
        placeholder="Ism"
      />
      <input
        value={form.email}
        onChange={handleChange('email')}
        placeholder="Email"
      />
      <input
        value={form.phone}
        onChange={handleChange('phone')}
        placeholder="Telefon"
      />
    </form>
  )
}

// 2. API konfiguratsiya
const createFetcher = (baseURL) => (headers) => async (endpoint, options) => {
  const response = await fetch(\`\${baseURL}\${endpoint}\`, {
    ...options,
    headers: { ...headers, ...options?.headers },
  })
  if (!response.ok) throw new Error(\`HTTP \${response.status}\`)
  return response.json()
}

const apiFetcher = createFetcher('https://api.example.com')
const authFetcher = apiFetcher({
  'Authorization': 'Bearer token123',
  'Content-Type': 'application/json',
})

// Endi istalgan endpoint-ga so'rov yuborish mumkin:
authFetcher('/users')
authFetcher('/posts', { method: 'POST', body: JSON.stringify(data) })

// 3. Styled component pattern
const withStyle = (defaultStyles) => (Component) => (props) => (
  <Component {...props} style={{ ...defaultStyles, ...props.style }} />
)

const withPadding = withStyle({ padding: '16px' })
const PaddedDiv = withPadding('div')`,
      description: 'React-da currying eng ko\'p event handler factory sifatida ishlatiladi. handleChange(\'name\') — field nomini oldindan berib, tayyor handler olish. API konfiguratsiya ham klassik currying: baseURL → headers → endpoint.',
    },
    {
      title: 'Partial application va bind',
      language: 'js',
      code: `// Partial application — bir nechta argumentni oldindan berish
function partial(fn, ...presetArgs) {
  return function(...laterArgs) {
    return fn(...presetArgs, ...laterArgs)
  }
}

function greet(greeting, punctuation, name) {
  return \`\${greeting}, \${name}\${punctuation}\`
}

const sayHello = partial(greet, 'Salom', '!')
const askHowAreYou = partial(greet, 'Qalaysiz', '?')

sayHello('Ali')       // 'Salom, Ali!'
askHowAreYou('Vali')  // 'Qalaysiz, Vali?'

// Function.prototype.bind — built-in partial application
const sayHi = greet.bind(null, 'Hi', '!')
sayHi('Ali')  // 'Hi, Ali!'

// Partial application vs Currying farqi:
// Currying: f(a)(b)(c) — DOIM bittadan
// Partial:  f(a, b)(c) — ixtiyoriy sonda

// Partial application — amaliy misol
function createLogger(level, timestamp, module, message) {
  const time = timestamp ? new Date().toISOString() : ''
  console.log(\`[\${level}] \${time} [\${module}] \${message}\`)
}

// Turli konfiguratsiyalar
const errorLogger = partial(createLogger, 'ERROR', true)
const debugLogger = partial(createLogger, 'DEBUG', false)

const authError = partial(createLogger, 'ERROR', true, 'Auth')
const dbDebug = partial(createLogger, 'DEBUG', false, 'DB')

authError('Token expired')       // [ERROR] 2024-... [Auth] Token expired
dbDebug('Query executed: 15ms')  // [DEBUG]  [DB] Query executed: 15ms

// Placeholder bilan partial (ilg'or)
const _ = Symbol('placeholder')

function partialWithPlaceholders(fn, ...presetArgs) {
  return function(...laterArgs) {
    const args = presetArgs.map(arg =>
      arg === _ ? laterArgs.shift() : arg
    )
    return fn(...args, ...laterArgs)
  }
}

const div = (a, b) => a / b
const half = partialWithPlaceholders(div, _, 2)  // _ = birinchi arg
half(10)  // 5  (10 / 2)`,
      description: 'Partial application — bir nechta argumentni oldindan berish. bind() ham partial application qiladi. Currying dan farqi: partial ixtiyoriy sonda argument beradi, currying DOIM bittadan. Placeholder pattern ilg\'or holatlarda foydali.',
    },
    {
      title: 'Composition bilan currying — pipe pattern',
      language: 'js',
      code: `// Curried utility funksiyalar
const map = (fn) => (arr) => arr.map(fn)
const filter = (fn) => (arr) => arr.filter(fn)
const sort = (fn) => (arr) => [...arr].sort(fn)
const take = (n) => (arr) => arr.slice(0, n)
const prop = (key) => (obj) => obj[key]
const gt = (threshold) => (value) => value > threshold

// pipe — chapdan o'ngga composition
const pipe = (...fns) => (x) => fns.reduce((v, fn) => fn(v), x)

// Ma'lumotlar
const employees = [
  { name: 'Ali', salary: 5000, department: 'IT' },
  { name: 'Vali', salary: 3000, department: 'HR' },
  { name: 'Gani', salary: 7000, department: 'IT' },
  { name: 'Doni', salary: 4000, department: 'IT' },
  { name: 'Eshmat', salary: 6000, department: 'HR' },
]

// Top 3 IT hodimlarning ismlari (maosh bo'yicha)
const getTopITNames = pipe(
  filter(e => e.department === 'IT'),
  sort((a, b) => b.salary - a.salary),
  take(3),
  map(prop('name')),
)

getTopITNames(employees)
// ['Gani', 'Ali', 'Doni']

// Qayta ishlatish — HR uchun
const getTopHRNames = pipe(
  filter(e => e.department === 'HR'),
  sort((a, b) => b.salary - a.salary),
  take(3),
  map(prop('name')),
)

getTopHRNames(employees)
// ['Eshmat', 'Vali']

// Yana bir misol — string processing pipeline
const processText = pipe(
  s => s.trim(),
  s => s.toLowerCase(),
  s => s.replace(/[^a-z0-9\\s-]/g, ''),
  s => s.replace(/\\s+/g, '-'),
  s => s.slice(0, 50),
)

processText('  Salom DUNYO! Bu TEST.  ')
// 'salom-dunyo-bu-test'`,
      description: 'Curried funksiyalar pipe/compose bilan mukammal ishlaydi. Har bir funksiya bitta argument (ma\'lumot) qabul qiladi — bu "point-free" yoki "tacit" programming. Kichik, qayta ishlatiladigan funksiyalardan murakkab pipeline yaratish.',
    },
  ],
  interviewQA: [
    {
      question: 'Currying nima? Oddiy misol keltiring.',
      answer: 'Currying — ko\'p argumentli funksiyani ketma-ket bittadan argument qabul qiladigan funksiyalar zanjiriga aylantirish: f(a, b, c) → f(a)(b)(c). Masalan: const add = a => b => a + b. const add5 = add(5) — bu funksiya. add5(3) → 8. Har bir chaqiruvda bitta argument "eslab qolinadi" (closure orqali) va yangi funksiya qaytariladi. Oxirgi argument berilganda natija hisoblanadi.',
    },
    {
      question: 'Currying va partial application farqi nima?',
      answer: 'Currying — funksiyani DOIM bittadan argument qabul qiladigan zanjirga aylantirish: f(a)(b)(c). Partial application — funksiyaning bir nechta argumentini OLDINDAN berish: f(a, b) → g(c). Currying partial application-ni osonlashtiradi — curried funksiyadan istalgan bosqichda to\'xtab, tayyor funksiya olish mumkin. Lekin partial application currying-siz ham ishlaydi (Function.prototype.bind yoki wrapper funksiya bilan).',
    },
    {
      question: 'Auto-curry qanday ishlaydi?',
      answer: 'Auto-curry funksiyasi fn.length orqali kerakli argumentlar sonini (arity) biladi. Har bir chaqiruvda berilgan argumentlar to\'planadi. Agar to\'plangan argumentlar soni arity ga teng yoki ko\'p bo\'lsa — asl funksiya chaqiriladi. Kamroq bo\'lsa — yangi funksiya qaytariladi. Bu barcha chaqirish variantlarini qo\'llab-quvvatlaydi: sum(1)(2)(3), sum(1, 2)(3), sum(1, 2, 3). Lodash _.curry() va Ramda shu prinsipda ishlaydi.',
    },
    {
      question: 'React-da currying qanday ishlatiladi?',
      answer: 'Eng ko\'p — event handler factory: const handleChange = (field) => (e) => setForm(prev => ({...prev, [field]: e.target.value})). Har bir input uchun handleChange(\'name\'), handleChange(\'email\') — field nomi oldindan beriladi, event keyinroq keladi. Boshqa misollar: HOC pattern (withAuth(Component)), API konfiguratsiya (createApi(baseUrl)(headers)(endpoint)), styled components pattern.',
    },
    {
      question: 'Currying-ning kamchiliklari bormi?',
      answer: 'Ha: 1) O\'qish murakkabligi — yangi dasturchilar uchun f(a)(b)(c) tushunarsiz. 2) Debugging qiyinroq — stack trace-da ko\'p anonymous function. 3) Performance overhead — har bir bosqichda yangi funksiya yaratiladi (closure). 4) TypeScript bilan murakkab tiplar — curried funksiyaning tipini yozish qiyin. 5) rest/spread argumentlar bilan ishlamasligi — fn.length noaniq. Qoida: faqat ANIQ FOYDA bo\'lganda ishlatish — reusability, composition, yoki konfiguratsiya. Haddan tashqari currying kodni keraksiz murakkablashtiradi.',
    },
  ],
  relatedTopics: [
    { techId: 'javascript', sectionId: 'functions-closures', topicId: 'closures', label: 'Closures' },
    { techId: 'javascript', sectionId: 'functions-closures', topicId: 'higher-order-functions', label: 'Higher-Order Functions' },
    { techId: 'javascript', sectionId: 'fundamentals', topicId: 'functions', label: 'Functions asoslari' },
    { techId: 'react-js', sectionId: 'component-patterns', topicId: 'hoc', label: 'Higher-Order Components' },
  ],
}
