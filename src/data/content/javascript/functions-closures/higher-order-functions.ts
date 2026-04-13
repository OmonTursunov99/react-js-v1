import type { Topic } from '../../../types'

export const higherOrderFunctions: Topic = {
  id: 'higher-order-functions',
  title: 'Higher-Order Functions',
  importance: 3,
  status: 'to-learn',
  description: 'Funksiya qabul qiluvchi/qaytaruvchi funksiyalar, Array methods, composition',
  content: `Higher-Order Function (HOF) — boshqa funksiyani ARGUMENT sifatida qabul qiladigan YOKI funksiyani QAYTARADIGAN funksiya. Bu JavaScript-ning eng kuchli konsepsiyalaridan biri va funksional dasturlashning asosi.

═══════════════════════════════════════
  HIGHER-ORDER FUNCTION NIMA?
═══════════════════════════════════════

JavaScript-da funksiyalar "first-class citizens" — ularni:
- O'zgaruvchiga saqlash mumkin
- Argument sifatida berish mumkin
- Funksiyadan qaytarish mumkin

HOF ning 2 turi:
1. Funksiyani ARGUMENT sifatida qabul qiladi (callback pattern)
2. Funksiyani QAYTARADI (factory/decorator pattern)

  // 1. Funksiyani qabul qiladi
  function repeat(n, action) {
    for (let i = 0; i < n; i++) action(i)
  }
  repeat(3, console.log)  // 0, 1, 2

  // 2. Funksiyani qaytaradi
  function greeter(greeting) {
    return function(name) {
      return greeting + ', ' + name + '!'
    }
  }
  const hello = greeter('Salom')
  hello('Ali')  // 'Salom, Ali!'

═══════════════════════════════════════
  ARRAY HIGHER-ORDER METHODS
═══════════════════════════════════════

JavaScript Array-ning barcha asosiy metodlari HOF:

1. map(fn) — har bir elementni O'ZGARTIRADI, yangi array qaytaradi
   [1, 2, 3].map(x => x * 2)  // [2, 4, 6]

2. filter(fn) — shartga mos elementlarni TANLAYDI
   [1, 2, 3, 4].filter(x => x > 2)  // [3, 4]

3. reduce(fn, initial) — arrayni BITTA qiymatga YIG'ADI
   [1, 2, 3].reduce((sum, x) => sum + x, 0)  // 6

4. find(fn) — shartga mos BIRINCHI elementni topadi
   [1, 2, 3].find(x => x > 1)  // 2

5. some(fn) — kamida BITTA element shartga mosmi?
   [1, 2, 3].some(x => x > 2)  // true

6. every(fn) — BARCHA elementlar shartga mosmi?
   [1, 2, 3].every(x => x > 0)  // true

7. flatMap(fn) — map + flat(1) birgalikda
   [[1, 2], [3, 4]].flatMap(x => x)  // [1, 2, 3, 4]

8. sort(fn) — JOYIDA tartiblaydi (mutatsiya!)
   [3, 1, 2].sort((a, b) => a - b)  // [1, 2, 3]

9. forEach(fn) — har bir elementda amal bajaradi (hech narsa qaytarMAYDI)
   [1, 2, 3].forEach(x => console.log(x))

MUHIM: map, filter, reduce yangi array YARATADI (immutable).
sort JOYIDA o'zgartiradi (mutable) — [...arr].sort() bilan nusxa qiling.

═══════════════════════════════════════
  REDUCE — ENG KUCHLI METHOD
═══════════════════════════════════════

reduce bilan ISTALGAN boshqa array metodini yozish mumkin:

  array.reduce((accumulator, currentValue, index, array) => {
    return yangiAccumulator
  }, initialValue)

- accumulator — yig'ilgan natija
- currentValue — hozirgi element
- initialValue — boshlang'ich qiymat (DOIM bering!)

MUHIM: initialValue berilmasa — birinchi element accumulator bo'ladi.
Bo'sh array da initialValue yo'q bo'lsa — TypeError!

═══════════════════════════════════════
  FUNCTION COMPOSITION
═══════════════════════════════════════

Composition — kichik funksiyalarni birlashtirib murakkab funksiya yaratish:

  compose(f, g, h)(x)  →  f(g(h(x)))   // o'ngdan chapga
  pipe(f, g, h)(x)     →  h(g(f(x)))    // chapdan o'ngga

  const compose = (...fns) =>
    (x) => fns.reduceRight((acc, fn) => fn(acc), x)

  const pipe = (...fns) =>
    (x) => fns.reduce((acc, fn) => fn(acc), x)

Composition funksional dasturlashning asosiy prinsipi.
React-da HOC-lar ham composition pattern.

═══════════════════════════════════════
  CALLBACK PATTERN
═══════════════════════════════════════

Callback — boshqa funksiyaga argument sifatida beriladigan funksiya:

  function fetchData(url, onSuccess, onError) {
    fetch(url)
      .then(res => res.json())
      .then(onSuccess)
      .catch(onError)
  }

Callback ning muammolari:
1. Callback hell — chuqur joylashma (nesting)
2. Inversion of control — boshqaruvni tashqi funksiyaga berish
3. Error handling murakkab

Zamonaviy yechimlar: Promise, async/await

═══════════════════════════════════════
  AMALIY QO'LLANILISHI
═══════════════════════════════════════

1. EVENT HANDLING:
   button.addEventListener('click', handleClick)

2. REACT PATTERNS:
   - Array.map() bilan list rendering
   - HOC (Higher-Order Components)
   - useCallback, useMemo (callback berish)

3. MIDDLEWARE:
   Redux middleware, Express middleware — HOF zanjiri

4. DEBOUNCE/THROTTLE:
   Funksiyani qabul qilib, yangi funksiya qaytaradi — klassik HOF`,
  codeExamples: [
    {
      title: 'Array methods — map, filter, reduce',
      language: 'js',
      code: `const users = [
  { name: 'Ali', age: 25, active: true },
  { name: 'Vali', age: 17, active: true },
  { name: 'Gani', age: 30, active: false },
  { name: 'Doni', age: 22, active: true },
  { name: 'Eshmat', age: 15, active: false },
]

// map — transformatsiya
const names = users.map(u => u.name)
// ['Ali', 'Vali', 'Gani', 'Doni', 'Eshmat']

// filter — tanlash
const activeAdults = users.filter(u => u.active && u.age >= 18)
// [{ name: 'Ali', ... }, { name: 'Doni', ... }]

// find — birinchi mos
const gani = users.find(u => u.name === 'Gani')
// { name: 'Gani', age: 30, active: false }

// some / every — tekshirish
users.some(u => u.age < 18)   // true (Vali, Eshmat)
users.every(u => u.active)    // false (Gani, Eshmat)

// CHAINING — metodlarni zanjirlab ishlatish
const result = users
  .filter(u => u.active)            // faol foydalanuvchilar
  .filter(u => u.age >= 18)         // 18 dan kattalar
  .map(u => u.name.toUpperCase())   // nomlarini katta harfda
  .sort()                           // alifbo tartibi
// ['ALI', 'DONI']

// flatMap — nested array-larni tekislash
const tags = [
  { name: 'Post 1', tags: ['js', 'react'] },
  { name: 'Post 2', tags: ['css', 'js'] },
]
const allTags = tags.flatMap(post => post.tags)
// ['js', 'react', 'css', 'js']
const uniqueTags = [...new Set(allTags)]
// ['js', 'react', 'css']`,
      description: 'Array HOF-larining amaliy ishlatilishi. Chaining — metodlarni zanjirlab yozish eng kuchli texnika. Har bir metod yangi array qaytaradi, shuning uchun zanjir davom ettirish mumkin.',
    },
    {
      title: 'reduce bilan murakkab transformatsiyalar',
      language: 'js',
      code: `const orders = [
  { product: 'Telefon', category: 'Elektronika', price: 500 },
  { product: 'Laptop', category: 'Elektronika', price: 1200 },
  { product: 'Ko\\'ylak', category: 'Kiyim', price: 50 },
  { product: 'Shim', category: 'Kiyim', price: 80 },
  { product: 'Naushnik', category: 'Elektronika', price: 100 },
]

// 1. Jami narx — oddiy reduce
const total = orders.reduce((sum, order) => sum + order.price, 0)
// 1930

// 2. Kategoriya bo'yicha guruhlash
const grouped = orders.reduce((groups, order) => {
  const key = order.category
  if (!groups[key]) groups[key] = []
  groups[key].push(order)
  return groups
}, {})
// { Elektronika: [...], Kiyim: [...] }

// 3. Kategoriya bo'yicha jami narx
const categoryTotals = orders.reduce((totals, order) => {
  const key = order.category
  totals[key] = (totals[key] || 0) + order.price
  return totals
}, {})
// { Elektronika: 1800, Kiyim: 130 }

// 4. reduce bilan map implementatsiyasi
function myMap(arr, fn) {
  return arr.reduce((result, item, index) => {
    result.push(fn(item, index))
    return result
  }, [])
}

// 5. reduce bilan filter implementatsiyasi
function myFilter(arr, fn) {
  return arr.reduce((result, item, index) => {
    if (fn(item, index)) result.push(item)
    return result
  }, [])
}

// 6. reduce bilan pipe
const pipe = (...fns) => (x) => fns.reduce((v, fn) => fn(v), x)

const process = pipe(
  x => x * 2,
  x => x + 10,
  x => \`Natija: \${x}\`,
)
process(5)  // 'Natija: 20'`,
      description: 'reduce — eng universal array metodi. Guruhlash, hisoblash, transformatsiya — hammasini reduce bilan qilish mumkin. Aslida map, filter, find hammasi reduce bilan ifodalanadi.',
    },
    {
      title: 'Function composition — compose va pipe',
      language: 'js',
      code: `// compose — o'ngdan chapga (matematikadagi f∘g)
const compose = (...fns) =>
  (x) => fns.reduceRight((acc, fn) => fn(acc), x)

// pipe — chapdan o'ngga (o'qishga oson)
const pipe = (...fns) =>
  (x) => fns.reduce((acc, fn) => fn(acc), x)

// Yordamchi funksiyalar
const trim = (s) => s.trim()
const toLowerCase = (s) => s.toLowerCase()
const replaceSpaces = (s) => s.replace(/\\s+/g, '-')
const addPrefix = (prefix) => (s) => \`\${prefix}\${s}\`

// Slug yaratish — pipe bilan (chapdan o'ngga o'qiladi)
const createSlug = pipe(
  trim,
  toLowerCase,
  replaceSpaces,
  addPrefix('/blog/'),
)

createSlug('  Salom Dunyo  ')  // '/blog/salom-dunyo'

// compose bilan ham xuddi shu natija (lekin o'ngdan chapga o'qiladi)
const createSlug2 = compose(
  addPrefix('/blog/'),
  replaceSpaces,
  toLowerCase,
  trim,
)

// Ko'p argumentli composition
const composeAsync = (...fns) =>
  (x) => fns.reduceRight(
    (promise, fn) => promise.then(fn),
    Promise.resolve(x)
  )

const processUser = composeAsync(
  async (id) => fetch(\`/api/users/\${id}\`).then(r => r.json()),
  async (user) => ({ ...user, fullName: user.first + ' ' + user.last }),
  async (user) => { console.log(user); return user },
)`,
      description: 'compose va pipe — funksional dasturlashning asosiy texnikasi. pipe chapdan o\'ngga o\'qiladi (osonroq), compose o\'ngdan chapga (matematikadagi notation). Kichik, qayta ishlatiladigan funksiyalardan murakkab logika yaratish.',
    },
    {
      title: 'HOF — funksiyani qaytaruvchi funksiyalar',
      language: 'js',
      code: `// 1. Debounce — HOF klassik misoli
function debounce(fn, delay) {
  let timerId = null
  return function(...args) {
    clearTimeout(timerId)
    timerId = setTimeout(() => fn.apply(this, args), delay)
  }
}

const searchAPI = debounce((query) => {
  console.log('Qidirilmoqda:', query)
}, 300)

// 2. Once — faqat bir marta chaqiriladi
function once(fn) {
  let called = false
  let result
  return function(...args) {
    if (called) return result
    called = true
    result = fn.apply(this, args)
    return result
  }
}

const initialize = once(() => {
  console.log('Faqat BIR MARTA ishlaydi')
  return { initialized: true }
})

initialize()  // 'Faqat BIR MARTA ishlaydi', { initialized: true }
initialize()  // { initialized: true } — console.log chaqirilMAYDI

// 3. Memoize — natijani keshlaydigan HOF
function memoize(fn) {
  const cache = new Map()
  return function(...args) {
    const key = JSON.stringify(args)
    if (cache.has(key)) return cache.get(key)
    const result = fn.apply(this, args)
    cache.set(key, result)
    return result
  }
}

const expensiveCalc = memoize((n) => {
  console.log('Hisoblanmoqda...')
  return n * n
})

expensiveCalc(5)  // 'Hisoblanmoqda...' → 25
expensiveCalc(5)  // 25 (keshdan, console.log YO'Q)

// 4. Retry — xato bo'lsa qayta urinish
function retry(fn, maxAttempts = 3) {
  return async function(...args) {
    for (let i = 0; i < maxAttempts; i++) {
      try {
        return await fn.apply(this, args)
      } catch (err) {
        if (i === maxAttempts - 1) throw err
        console.log(\`Urinish \${i + 1} muvaffaqiyatsiz, qayta...\`)
      }
    }
  }
}`,
      description: 'HOF ning real-world misollari: debounce (ko\'p chaqiruvni bitta qilish), once (bir martalik), memoize (keshlash), retry (qayta urinish). Bular funksiyani qabul qilib, yangi funksiya qaytaradi — sof HOF.',
    },
    {
      title: 'React-da HOF qo\'llanilishi',
      language: 'js',
      code: `// React-da HOF ko'p joyda ishlatiladi:

// 1. Array.map() bilan list rendering
function UserList({ users }) {
  return (
    <ul>
      {users
        .filter(u => u.active)
        .map(user => (
          <li key={user.id}>{user.name}</li>
        ))
      }
    </ul>
  )
}

// 2. Event handler factory (HOF)
function Form() {
  const [form, setForm] = useState({ name: '', email: '' })

  // HOF — field nomini qabul qilib, handler qaytaradi
  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }))
  }

  return (
    <form>
      <input value={form.name} onChange={handleChange('name')} />
      <input value={form.email} onChange={handleChange('email')} />
    </form>
  )
}

// 3. HOC (Higher-Order Component) — komponent darajasidagi HOF
function withLoading(WrappedComponent) {
  return function WithLoadingComponent({ isLoading, ...props }) {
    if (isLoading) return <div>Yuklanmoqda...</div>
    return <WrappedComponent {...props} />
  }
}

const UserListWithLoading = withLoading(UserList)
// <UserListWithLoading isLoading={true} users={[]} />

// 4. Array transformatsiya zinasi
const processedUsers = rawData
  .filter(Boolean)                        // null/undefined olib tashlash
  .map(normalizeUser)                     // normalizatsiya
  .filter(u => u.role === 'admin')        // filtrlash
  .sort((a, b) => a.name.localeCompare(b.name))  // tartiblash
  .slice(0, 10)                           // faqat birinchi 10 ta`,
      description: 'React-da HOF hamma joyda: .map() bilan rendering, event handler factory, HOC pattern. Array chaining — React-da ma\'lumotlarni qayta ishlashning asosiy usuli.',
    },
  ],
  interviewQA: [
    {
      question: 'Higher-Order Function nima? Misol keltiring.',
      answer: 'HOF — boshqa funksiyani argument sifatida qabul qiladigan YOKI funksiyani qaytaradigan funksiya. JavaScript-da funksiyalar first-class citizens bo\'lgani uchun bu mumkin. Misollar: Array.map(), Array.filter(), Array.reduce() — callback qabul qiladi. setTimeout, addEventListener — callback qabul qiladi. debounce, memoize — funksiya qabul qilib, yangi funksiya qaytaradi.',
    },
    {
      question: 'map, filter, reduce farqini tushuntiring.',
      answer: 'map — har bir elementni transformatsiya qiladi, YANGI array qaytaradi (uzunlik o\'zgarmaydi). filter — shartga mos elementlarni tanlaydi, YANGI array qaytaradi (uzunlik kamayishi mumkin). reduce — butun array-ni BITTA qiymatga yig\'adi (number, string, object, array — istalgan narsa). reduce eng universal — map va filter-ni reduce bilan yozish mumkin. Uchovi ham YANGI array/qiymat qaytaradi, original array-ni O\'ZGARTIRMAYDI (immutable).',
    },
    {
      question: 'reduce bilan qanday murakkab operatsiyalar qilish mumkin?',
      answer: 'reduce bilan deyarli HAR QANDAY array transformatsiyasini qilish mumkin: 1) Guruhlash — ob\'ektlarni biror xususiyat bo\'yicha gruppalash. 2) Hisoblash — elementlar sonini sanash (word frequency). 3) Flatten — nested array-larni tekislash. 4) Pipe/compose — funksiyalar zanjiri yaratish. 5) Unique — takrorlanmaslar ro\'yxati. 6) Object yaratish — array-dan object ga aylantirish. initialValue DOIM berish kerak — bo\'sh array da xato bo\'lmaydi.',
    },
    {
      question: 'compose va pipe nima? Farqi nimada?',
      answer: 'Ikkalasi ham funksiyalar zanjirini yaratadi. compose(f, g, h)(x) = f(g(h(x))) — o\'ngdan chapga bajariladi (matematikadagi notation). pipe(f, g, h)(x) = h(g(f(x))) — chapdan o\'ngga bajariladi (o\'qishga osonroq). compose reduceRight, pipe reduce bilan implementatsiya qilinadi. Amalda pipe ko\'proq ishlatiladi, chunki kod o\'qish tartibi bilan bir xil yo\'nalishda ishlaydi.',
    },
    {
      question: 'forEach va map farqi nima?',
      answer: 'forEach hech narsa qaytarMAYDI (undefined), faqat side-effect uchun ishlatiladi (console.log, DOM o\'zgartirish). map YANGI ARRAY qaytaradi — har bir element uchun callback natijasi. forEach-ni chain qilib bo\'lmaydi, map-ni mumkin. React-da DOIM map ishlatiladi (JSX qaytarish uchun), forEach ishlatib bo\'lmaydi. forEach-dan break/return bilan chiqib bo\'lmaydi (for...of yoki some/every ishlatish kerak).',
    },
    {
      question: 'Callback pattern ning muammolari nima? Qanday hal qilingan?',
      answer: 'Callback ning 3 asosiy muammosi: 1) Callback Hell — chuqur nesting, kodni o\'qib bo\'lmaydi. 2) Inversion of Control — boshqaruvni tashqi funksiyaga berasiz, u callback-ni necha marta chaqirishi noaniq. 3) Error handling — har bir callback-da alohida error handling. Yechimlar: Promise — zanjirlab yozish mumkin (.then().catch()), callback bir marta chaqirilishini kafolatlaydi. async/await — sinxron ko\'rinishda asinxron kod yozish. Bu evolyutsiya: callbacks → Promises → async/await.',
    },
  ],
  relatedTopics: [
    { techId: 'javascript', sectionId: 'functions-closures', topicId: 'closures', label: 'Closures' },
    { techId: 'javascript', sectionId: 'functions-closures', topicId: 'currying', label: 'Currying' },
    { techId: 'javascript', sectionId: 'functions-closures', topicId: 'recursion', label: 'Recursion' },
    { techId: 'javascript', sectionId: 'fundamentals', topicId: 'functions', label: 'Functions asoslari' },
    { techId: 'react-js', sectionId: 'component-patterns', topicId: 'hoc', label: 'Higher-Order Components' },
  ],
}
