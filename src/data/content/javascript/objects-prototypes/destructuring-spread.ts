import type { Topic } from '../../../types'

export const destructuringSpread: Topic = {
  id: 'destructuring-spread',
  title: 'Destructuring & Spread',
  importance: 3,
  status: 'to-learn',
  description: 'Object/Array destructuring, spread/rest operatorlari va deep copy muammosi',
  content: `Destructuring — object yoki array ichidan qiymatlarni ajratib olish uchun qisqa sintaksis. Spread (...) — elementlarni yoyish. Rest (...) — qolgan elementlarni yig'ish. Bu uchta tushuncha zamonaviy JavaScript va React-ning asosi.

═══════════════════════════════════════
  OBJECT DESTRUCTURING
═══════════════════════════════════════

Object destructuring — kalit nomi bo'yicha qiymatlarni ajratib olish:

  const user = { name: 'Ali', age: 25, city: 'Toshkent' }
  const { name, age } = user
  // name = 'Ali', age = 25

1. Rename (qayta nomlash):
   const { name: userName } = user   // userName = 'Ali'

2. Default qiymat:
   const { phone = 'N/A' } = user   // phone = 'N/A'

3. Rename + default:
   const { phone: tel = 'N/A' } = user  // tel = 'N/A'

4. Nested destructuring (ichma-ich):
   const data = { address: { city: 'Toshkent', zip: 100000 } }
   const { address: { city, zip } } = data
   // city = 'Toshkent', zip = 100000

MUHIM: Nested destructuring-da address o'zgaruvchisi YARATILMAYDI!
Faqat city va zip yaratiladi.

═══════════════════════════════════════
  ARRAY DESTRUCTURING
═══════════════════════════════════════

Array destructuring — TARTIB bo'yicha qiymatlarni ajratib olish:

  const colors = ['qizil', 'yashil', "ko'k"]
  const [first, second] = colors
  // first = 'qizil', second = 'yashil'

1. Element o'tkazib yuborish:
   const [, , third] = colors   // third = "ko'k"

2. Default qiymat:
   const [a, b, c, d = 'sariq'] = colors   // d = 'sariq'

3. O'zgaruvchilarni almashtirish (swap):
   let a = 1, b = 2;
   [a, b] = [b, a]   // a = 2, b = 1

4. Funksiyadan qaytarilgan massiv:
   const [state, setState] = useState(0)  // React pattern!

═══════════════════════════════════════
  REST OPERATOR (...)
═══════════════════════════════════════

Rest — qolgan elementlarni YIGADI (doim oxirida bo'lishi SHART):

1. Object rest:
   const { name, ...rest } = { name: 'Ali', age: 25, city: 'Toshkent' }
   // name = 'Ali', rest = { age: 25, city: 'Toshkent' }

2. Array rest:
   const [first, ...others] = [1, 2, 3, 4, 5]
   // first = 1, others = [2, 3, 4, 5]

3. Function parameters:
   function sum(...nums) { return nums.reduce((a, b) => a + b, 0) }
   sum(1, 2, 3)  // 6

MUHIM: Rest vs arguments:
- ...rest — haqiqiy array (map, filter ishlaydi)
- arguments — array-like object (Array.from kerak)
- Arrow function-da arguments YO'Q, faqat rest ishlaydi

═══════════════════════════════════════
  SPREAD OPERATOR (...)
═══════════════════════════════════════

Spread — elementlarni YOYADI (rest-ning teskarisi):

1. Array copy va birlashtirish:
   const copy = [...original]
   const merged = [...arr1, ...arr2]
   const added = [...arr, newItem]

2. Object copy va birlashtirish:
   const copy = { ...original }
   const merged = { ...obj1, ...obj2 }
   const updated = { ...user, name: 'Vali' }  // name QAYTA YOZILADI

3. Funksiya argumentlari:
   const nums = [1, 2, 3]
   Math.max(...nums)  // 3

MUHIM: Keyingi spread oldingi property-ni QAYTA YOZADI:
  { ...a, ...b } — agar a va b da bir xil kalit bo'lsa, b yutadi.

═══════════════════════════════════════
  SHALLOW COPY MUAMMOSI
═══════════════════════════════════════

Spread va Object.assign FAQAT 1-chi darajani nusxalaydi.
Ichki (nested) objectlar hali ham REFERENS bo'yicha bog'liq:

  const original = { name: 'Ali', address: { city: 'Toshkent' } }
  const copy = { ...original }

  copy.name = 'Vali'               // original.name = 'Ali' (alohida)
  copy.address.city = 'Samarqand'  // original.address.city = 'Samarqand'!
  // address — bir xil referens!

═══════════════════════════════════════
  DEEP COPY USULLARI
═══════════════════════════════════════

1. structuredClone() — zamonaviy, eng yaxshi usul:
   const deep = structuredClone(original)

2. JSON trick — cheklovlar bor:
   const deep = JSON.parse(JSON.stringify(original))
   // Function, undefined, Symbol, Date, Map, Set — YO'QOLADI

3. Recursive funksiya — to'liq kontrol

MUHIM: structuredClone ES2022 da standart bo'ldi.
Function va Symbol-ni nusxalamaydi, lekin Date, Map, Set,
ArrayBuffer, RegExp — barchasini TO'G'RI nusxalaydi.

═══════════════════════════════════════
  DESTRUCTURING FUNKSIYA PARAMETRLARIDA
═══════════════════════════════════════

React-da juda ko'p ishlatiladigan pattern:

  function UserCard({ name, age, role = 'user' }) {
    return <div>{name} ({age}) - {role}</div>
  }

  // Props-ni destructure qilish — aniq va qulay
  // Default qiymatlar ham shu yerda beriladi`,
  codeExamples: [
    {
      title: 'Object destructuring — rename, default, nested',
      language: 'js',
      code: `const response = {
  status: 200,
  data: {
    user: {
      id: 1,
      name: 'Ali Valiyev',
      contacts: { email: 'ali@mail.com', phone: null },
    },
    token: 'abc123',
  },
}

// Oddiy destructuring
const { status, data } = response
console.log(status)  // 200

// Rename
const { data: responseData } = response
console.log(responseData.token)  // 'abc123'

// Nested destructuring
const {
  data: {
    user: { name, id },
    token,
  },
} = response
console.log(name)   // 'Ali Valiyev'
console.log(token)  // 'abc123'

// Default qiymat
const {
  data: {
    user: {
      contacts: { email, phone = 'N/A' },
    },
  },
} = response
console.log(email)  // 'ali@mail.com'
console.log(phone)  // null (default ISHLAMADI — null !== undefined!)

// Default faqat UNDEFINED uchun ishlaydi
const { address = 'Noma\\'lum' } = { address: undefined }
console.log(address)  // 'Noma\\'lum'

const { city = 'Noma\\'lum' } = { city: null }
console.log(city)     // null (default ISHLAMADI)`,
      description: 'Default qiymat faqat undefined uchun ishlaydi, null uchun ISHLAMAYDI. Bu ko\'p dasturchilar yo\'l qo\'yadigan xato.',
    },
    {
      title: 'Array destructuring va swap',
      language: 'js',
      code: `// Asosiy destructuring
const [a, b, c] = [10, 20, 30]
console.log(a, b, c)  // 10 20 30

// Element o'tkazib yuborish
const [first, , third] = ['olma', 'banan', 'uzum']
console.log(first, third)  // 'olma' 'uzum'

// Rest bilan
const [head, ...tail] = [1, 2, 3, 4, 5]
console.log(head)  // 1
console.log(tail)  // [2, 3, 4, 5]

// Swap — vaqtinchalik o'zgaruvchisiz
let x = 'birinchi'
let y = 'ikkinchi'
;[x, y] = [y, x]
console.log(x, y)  // 'ikkinchi' 'birinchi'

// Funksiyadan array qaytarish (React pattern)
function useToggle(initial = false) {
  let state = initial
  const toggle = () => { state = !state }
  return [state, toggle]
}
const [isOpen, toggle] = useToggle()

// String destructuring ham ishlaydi
const [ch1, ch2, ch3] = 'ABC'
console.log(ch1, ch2, ch3)  // 'A' 'B' 'C'

// Set destructuring
const [s1, s2] = new Set([1, 2, 3])
console.log(s1, s2)  // 1 2`,
      description: 'Array destructuring tartib bo\'yicha ishlaydi. Swap pattern, funksiyadan array qaytarish (React hooks pattern) va iterable destructuring.',
    },
    {
      title: 'Spread operator — copy, merge, update',
      language: 'js',
      code: `// Array spread
const fruits = ['olma', 'banan']
const vegs = ['sabzi', 'pomidor']

const all = [...fruits, ...vegs]
console.log(all)  // ['olma', 'banan', 'sabzi', 'pomidor']

const withNew = [...fruits, 'uzum']
console.log(withNew)  // ['olma', 'banan', 'uzum']
console.log(fruits)   // ['olma', 'banan'] — o'zgarmagan!

// Object spread
const defaults = { theme: 'light', lang: 'uz', fontSize: 14 }
const userPrefs = { theme: 'dark', fontSize: 18 }

const config = { ...defaults, ...userPrefs }
console.log(config)
// { theme: 'dark', lang: 'uz', fontSize: 18 }
// userPrefs keyingi — u yutadi

// React-da state yangilash
const user = { name: 'Ali', age: 25, city: 'Toshkent' }
const updated = { ...user, age: 26 }  // faqat age o'zgaradi
console.log(updated)
// { name: 'Ali', age: 26, city: 'Toshkent' }

// Funksiya argumentlari sifatida
const numbers = [5, 3, 8, 1, 9]
console.log(Math.max(...numbers))  // 9
console.log(Math.min(...numbers))  // 1

// Array-dan dublikatlarni olib tashlash
const arr = [1, 2, 2, 3, 3, 4]
const unique = [...new Set(arr)]
console.log(unique)  // [1, 2, 3, 4]`,
      description: 'Spread operatori SHALLOW copy qiladi. Keyingi spread oldingi property-ni qayta yozadi — bu merge/override pattern uchun ishlatiladi.',
    },
    {
      title: 'Rest operator — parametrlar va destructuring',
      language: 'js',
      code: `// Funksiya parametrlarida rest
function sum(...numbers) {
  return numbers.reduce((total, n) => total + n, 0)
}
console.log(sum(1, 2, 3, 4))  // 10

// Rest + oddiy parametrlar
function logFirst(first, second, ...rest) {
  console.log('Birinchi:', first)
  console.log('Ikkinchi:', second)
  console.log('Qolganlari:', rest)
}
logFirst('a', 'b', 'c', 'd', 'e')
// Birinchi: a
// Ikkinchi: b
// Qolganlari: ['c', 'd', 'e']

// Object rest — property olib tashlash uchun
const user = { name: 'Ali', password: '12345', age: 25, city: 'Toshkent' }
const { password, ...safeUser } = user
console.log(safeUser)
// { name: 'Ali', age: 25, city: 'Toshkent' }
// password olib tashlandi — REST PATTERN

// React-da props forwarding
function Input({ label, ...inputProps }) {
  return (
    \`<label>\${label}<input \${JSON.stringify(inputProps)} /></label>\`
  )
}
// <Input label="Ism" type="text" placeholder="..." required />
// label ajratiladi, qolganlari input-ga beriladi

// Rest vs arguments
function oldWay() {
  console.log(arguments)        // array-LIKE (map yo'q)
  console.log([...arguments])   // haqiqiy array
}

const arrowWay = (...args) => {
  console.log(args)  // haqiqiy array
  // arguments bu yerda YO'Q (arrow function!)
}`,
      description: 'Rest operatori qolgan elementlarni array/object-ga yig\'adi. Arguments eski usul — arrow function-da ishlamaydi.',
    },
    {
      title: 'Shallow vs Deep copy — muammo va yechim',
      language: 'js',
      code: `// SHALLOW COPY muammosi
const original = {
  name: 'Ali',
  scores: [90, 85, 92],
  address: { city: 'Toshkent', zip: 100000 },
}

// Spread — SHALLOW copy
const shallow = { ...original }

shallow.name = 'Vali'              // OK — alohida
shallow.scores.push(100)           // MUAMMO!
shallow.address.city = 'Samarqand' // MUAMMO!

console.log(original.name)           // 'Ali' (o'zgarmagan)
console.log(original.scores)         // [90, 85, 92, 100] — O'ZGARGAN!
console.log(original.address.city)   // 'Samarqand' — O'ZGARGAN!

// === DEEP COPY YECHIMLARI ===

// 1. structuredClone — eng yaxshi (ES2022)
const deep1 = structuredClone(original)
deep1.address.city = 'Buxoro'
console.log(original.address.city)  // 'Samarqand' (o'zgarmagan)

// 2. JSON trick — cheklovlari bor
const deep2 = JSON.parse(JSON.stringify(original))
// MUAMMO: function, undefined, Symbol, Infinity yo'qoladi
// Date → string ga aylanadi, Map/Set → {} bo'ladi

// structuredClone nimalarni nusxalaydi:
// ✅ Object, Array, Date, Map, Set, RegExp, ArrayBuffer
// ✅ Nested structures (chuqur)
// ❌ Function — Error beradi
// ❌ DOM nodes — Error beradi
// ❌ Symbol — Error beradi

// 3. Qo'lda nested spread (faqat oddiy holatlar uchun)
const manual = {
  ...original,
  scores: [...original.scores],
  address: { ...original.address },
}`,
      description: 'Spread FAQAT 1-darajani nusxalaydi. Ichki objectlar referens bo\'yicha bog\'liq qoladi. structuredClone() — eng ishonchli deep copy usuli.',
    },
  ],
  interviewQA: [
    {
      question: 'Spread va Rest operatori farqi nima?',
      answer: 'Ikkalasi ham ... sintaksisini ishlatadi, lekin vazifalari teskari. Spread — elementlarni YOYADI (array/object ichidagilarni tashqariga chiqaradi): [...arr], {...obj}. Rest — elementlarni YIGADI (qolganlarini bitta o\'zgaruvchiga to\'playdi): const {a, ...rest} = obj. Spread ishlatilish joyi: function argument, array/object literal ichida. Rest ishlatilish joyi: destructuring va function parameter definition-da.',
    },
    {
      question: 'Shallow copy va deep copy farqi nima? Qanday deep copy qilish mumkin?',
      answer: 'Shallow copy — faqat 1-chi daraja nusxalanadi. Ichki objectlar hali ham ESKI referens-ga bog\'liq. Spread (...) va Object.assign() shallow copy qiladi. Deep copy — barcha darajalar to\'liq nusxalanadi, hech qanday referens bog\'lanish qolmaydi. Usullari: 1) structuredClone() — eng yaxshi, Date/Map/Set-ni ham nusxalaydi. 2) JSON.parse(JSON.stringify()) — function/undefined/Symbol yo\'qoladi. 3) Recursive funksiya — to\'liq kontrol.',
    },
    {
      question: 'Destructuring-da default qiymat qachon ishlaydi?',
      answer: 'Default qiymat FAQAT undefined uchun ishlaydi. null, 0, "", false uchun ISHLAMAYDI. Masalan: const { x = 10 } = { x: null } — x = null bo\'ladi, 10 emas. const { x = 10 } = { x: undefined } — x = 10. const { x = 10 } = {} — x = 10 (yo\'q = undefined). Bu JavaScript spetsifikatsiyasi — default faqat === undefined tekshiradi.',
    },
    {
      question: 'Object rest bilan property olib tashlash qanday ishlaydi?',
      answer: 'const { password, ...safeUser } = user — password alohida o\'zgaruvchiga chiqariladi, qolgan barcha property-lar safeUser-ga yig\'iladi. Bu immutable tarzda property olib tashlashning eng qulay usuli. delete operatoridan farqli — original object O\'ZGARMAYDI. React-da ko\'p ishlatiladi: props-dan ma\'lum property-larni ajratib, qolganlarini child-ga uzatish uchun.',
    },
    {
      question: 'Nested destructuring xavflari nimada?',
      answer: 'Nested destructuring juda chuqur bo\'lsa: 1) O\'qish qiyinlashadi — const { a: { b: { c: { d } } } } = obj. 2) Agar oraliq property undefined bo\'lsa TypeError beradi — obj.a undefined bo\'lsa a.b da xatolik. 3) Debug qilish qiyin — breakpoint qo\'yib bo\'lmaydi. Yechim: chuqur nestingdan qochish, optional chaining bilan avval tekshirish, yoki bosqichma-bosqich destructure qilish.',
    },
    {
      question: 'structuredClone() va JSON.parse(JSON.stringify()) farqi nima?',
      answer: 'JSON usuli: 1) Function, undefined, Symbol — yo\'qoladi. 2) Date — string-ga aylanadi, qaytib Date bo\'lmaydi. 3) Map, Set — bo\'sh object {} bo\'ladi. 4) Infinity, NaN — null bo\'ladi. 5) Circular reference — Error beradi. structuredClone: 1) Date, Map, Set, RegExp, ArrayBuffer — TO\'G\'RI nusxalaydi. 2) Circular reference — ishlaydi. 3) Lekin Function va Symbol — Error beradi. structuredClone ancha ishonchli va zamonaviy usul.',
    },
  ],
  relatedTopics: [
    { techId: 'javascript', sectionId: 'objects-prototypes', topicId: 'object-basics', label: 'Object Basics' },
    { techId: 'javascript', sectionId: 'objects-prototypes', topicId: 'object-create', label: 'Object.create & Object metodlari' },
    { techId: 'javascript', sectionId: 'objects-prototypes', topicId: 'property-descriptors', label: 'Property Descriptors' },
  ],
}
