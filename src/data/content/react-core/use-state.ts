import type { Topic } from '../../types'

export const useState: Topic = {
    id: 'use-state',
    title: 'useState',
    importance: 3,
    status: 'to-learn',
    description: 'Komponent ichida lokal state boshqarish hooki',
    content: `useState — React-da eng asosiy va ko'p ishlatiladigan hook. U komponent ichida o'zgaruvchan (reactive) ma'lumot saqlash uchun ishlatiladi.

═══════════════════════════════════════
  SINTAKSIS
═══════════════════════════════════════

  const [state, setState] = useState(initialValue)

- state — hozirgi qiymat
- setState — qiymatni o'zgartirish funksiyasi
- initialValue — boshlang'ich qiymat (faqat birinchi renderda ishlatiladi)

═══════════════════════════════════════
  QANDAY ISHLAYDI (ICHKI MEXANIZM)
═══════════════════════════════════════

1. React har bir komponent uchun "fiber node" yaratadi
2. Bu fiber node ichida hooklar LINKED LIST sifatida saqlanadi
3. useState chaqirilganda React hozirgi hook indeksiga qaraydi
4. Agar birinchi render bo'lsa — yangi state yaratadi
5. Agar qayta render bo'lsa — mavjud state-ni qaytaradi

Shu sababli hooklar DOIM bir xil tartibda chaqirilishi SHART:
- if/else ichida hook ishlatib BO'LMAYDI
- loop ichida hook ishlatib BO'LMAYDI
- Bu "Rules of Hooks" deyiladi

═══════════════════════════════════════
  setState QANDAY ISHLAYDI
═══════════════════════════════════════

setState chaqirilganda React:
1. Yangi qiymatni navbatga (queue) qo'yadi
2. Komponentni "dirty" deb belgilaydi
3. Keyingi render siklida yangi qiymat bilan renderlayadii

MUHIM: setState SINXRON EMAS!
setState chaqirilgandan keyin state darhol o'zgarmaydi.
Yangi qiymat KEYINGI renderda ko'rinadi.

═══════════════════════════════════════
  FUNCTIONAL UPDATE (updater function)
═══════════════════════════════════════

Agar yangi state eski state-ga bog'liq bo'lsa,
DOIM updater function ishlatish kerak:

  // NOTO'G'RI — stale closure muammosi bo'lishi mumkin:
  setCount(count + 1)

  // TO'G'RI — doim eng yangi qiymatni oladi:
  setCount(prev => prev + 1)

Nima uchun? Chunki count o'zgaruvchisi closure orqali
ESKi render-dagi qiymatni ushlab turishi mumkin.
prev esa React-dan DOIM eng yangi qiymatni beradi.

═══════════════════════════════════════
  LAZY INITIALIZATION
═══════════════════════════════════════

Agar boshlang'ich qiymatni hisoblash "qimmat" bo'lsa,
funksiya bering — faqat BIR MARTA chaqiriladi:

  // NOTO'G'RI — har renderda JSON.parse ishlaydi:
  const [data, setData] = useState(JSON.parse(localStorage.getItem('data')))

  // TO'G'RI — faqat birinchi renderda ishlaydi:
  const [data, setData] = useState(() => JSON.parse(localStorage.getItem('data')))

═══════════════════════════════════════
  OBJECT VA ARRAY STATE
═══════════════════════════════════════

React state-ni === (referense equality) bilan taqqoslaydi.
Shuning uchun object/array-ni DOIM yangi nusxa bilan yangilash kerak:

  // NOTO'G'RI — React o'zgarishni sezmaydi:
  user.name = 'Ali'
  setUser(user)

  // TO'G'RI — yangi object yaratiladi:
  setUser({ ...user, name: 'Ali' })

  // Array uchun:
  setItems([...items, newItem])           // qo'shish
  setItems(items.filter(i => i.id !== id)) // o'chirish
  setItems(items.map(i => i.id === id ? {...i, done: true} : i)) // yangilash

═══════════════════════════════════════
  BATCHING (React 18+)
═══════════════════════════════════════

React 18 dan boshlab BARCHA setState-lar batching qilinadi:

  function handleClick() {
    setCount(c => c + 1)  // render YO'Q
    setName('Ali')         // render YO'Q
    setAge(25)             // render YO'Q
    // Faqat SHU YERDA 1 TA render bo'ladi
  }

Bu setTimeout, Promise, va native event handler ichida ham ishlaydi.
React 17 da faqat React event handler-larda batching bor edi.

═══════════════════════════════════════
  QACHON useState, QACHON useReducer
═══════════════════════════════════════

useState ishlatish kerak:
  ✅ Oddiy qiymatlar (string, number, boolean)
  ✅ Mustaqil state-lar (bir-biriga bog'liq emas)
  ✅ Oddiy yangilash logikasi

useReducer ishlatish kerak:
  ✅ Murakkab object state
  ✅ Bir-biriga bog'liq state-lar
  ✅ Murakkab yangilash logikasi (action pattern)

═══════════════════════════════════════
  ANTI-PATTERNS (NOTO'G'RI ISHLATISH)
═══════════════════════════════════════

1. Props-ni state-ga nusxalash:
   // NOTO'G'RI:
   const [value, setValue] = useState(props.value)
   // props o'zgarganda state yangilanMAYDI!

   // TO'G'RI — props-ni to'g'ridan-to'g'ri ishlatish:
   const value = props.value

2. Derived state (hisoblangan qiymat):
   // NOTO'G'RI:
   const [fullName, setFullName] = useState(first + ' ' + last)

   // TO'G'RI — render vaqtida hisoblash:
   const fullName = first + ' ' + last

3. Har bir input uchun alohida state:
   // Ko'p input bo'lsa — bitta object state yoki useReducer ishlatish`,
    codeExamples: [
      {
        title: 'Asosiy ishlatish — Counter',
        language: 'tsx',
        code: `import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>Hisob: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
      <button onClick={() => setCount(prev => prev - 1)}>-1</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  )
}`,
        description: `Eng oddiy useState misoli. "+" bosilganda count + 1 bo'ladi, "-" bosilganda prev => prev - 1 (updater function).`,
      },
      {
        title: 'Object state — Form boshqaruvi',
        language: 'tsx',
        code: `import { useState } from 'react'

interface FormData {
  name: string
  email: string
  age: number
}

function UserForm() {
  const [form, setForm] = useState<FormData>({
    name: '',
    email: '',
    age: 0,
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,              // eski maydonlarni saqlash
      [name]: value,        // faqat o'zgarganni yangilash
    }))
  }

  return (
    <form>
      <input name="name" value={form.name} onChange={handleChange} />
      <input name="email" value={form.email} onChange={handleChange} />
      <input name="age" type="number" value={form.age} onChange={handleChange} />
      <p>Salom, {form.name}! Email: {form.email}</p>
    </form>
  )
}`,
        description: `Object state — spread operator (...prev) bilan yangilash. DOIM yangi object yaratish kerak, aks holda React o'zgarishni sezmaydi.`,
      },
      {
        title: 'Array state — Todo list',
        language: 'tsx',
        code: `import { useState } from 'react'

interface Todo {
  id: number
  text: string
  done: boolean
}

function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [input, setInput] = useState('')

  function addTodo() {
    if (!input.trim()) return
    setTodos(prev => [
      ...prev,
      { id: Date.now(), text: input, done: false },
    ])
    setInput('')
  }

  function toggleTodo(id: number) {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      )
    )
  }

  function deleteTodo(id: number) {
    setTodos(prev => prev.filter(todo => todo.id !== id))
  }

  return (
    <div>
      <input value={input} onChange={e => setInput(e.target.value)} />
      <button onClick={addTodo}>Qo'shish</button>
      {todos.map(todo => (
        <div key={todo.id}>
          <span
            style={{ textDecoration: todo.done ? 'line-through' : 'none' }}
            onClick={() => toggleTodo(todo.id)}
          >
            {todo.text}
          </span>
          <button onClick={() => deleteTodo(todo.id)}>O'chirish</button>
        </div>
      ))}
    </div>
  )
}`,
        description: `Array state pattern — qo'shish ([...prev, new]), o'chirish (filter), yangilash (map). Hech qachon push/splice ishlatmang!`,
      },
      {
        title: 'Lazy initialization',
        language: 'tsx',
        code: `import { useState } from 'react'

// Qimmat hisoblash funksiyasi
function getInitialData() {
  console.log('Bu faqat 1 marta ishlaydi!')
  const saved = localStorage.getItem('settings')
  return saved ? JSON.parse(saved) : { theme: 'light', lang: 'uz' }
}

function Settings() {
  // Funksiya BERISH — har renderda chaqirilmaydi
  const [settings, setSettings] = useState(getInitialData)
  //                                       ^ () yo'q!

  // NOTO'G'RI bo'lardi:
  // useState(getInitialData())  ← har renderda chaqiriladi

  return <div>Tema: {settings.theme}</div>
}`,
        description: `Lazy initialization — boshlang'ich qiymatni hisoblash qimmat bo'lsa, funksiya bering (chaqirmang). React faqat birinchi renderda chaqiradi.`,
      },
      {
        title: 'Functional update — Stale closure oldini olish',
        language: 'tsx',
        code: `import { useState } from 'react'

function StaleClosureDemo() {
  const [count, setCount] = useState(0)

  function handleClick() {
    // MUAMMO: 3 marta bosilsa ham faqat +1 bo'ladi
    // Chunki count har uchta qatorda 0 (eski render qiymati)
    setCount(count + 1)  // 0 + 1 = 1
    setCount(count + 1)  // 0 + 1 = 1 (hali ham 0!)
    setCount(count + 1)  // 0 + 1 = 1 (hali ham 0!)
  }

  function handleClickCorrect() {
    // TO'G'RI: har safar eng yangi qiymatni oladi
    setCount(prev => prev + 1)  // 0 + 1 = 1
    setCount(prev => prev + 1)  // 1 + 1 = 2
    setCount(prev => prev + 1)  // 2 + 1 = 3
  }

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={handleClick}>+3 (noto'g'ri)</button>
      <button onClick={handleClickCorrect}>+3 (to'g'ri)</button>
    </div>
  )
}`,
        description: `Stale closure muammosi. count o'zgaruvchisi eski render qiymatini ushlab turadi. prev => prev + 1 DOIM eng yangi qiymatni beradi.`,
      },
      {
        title: 'TypeScript bilan useState',
        language: 'tsx',
        code: `import { useState } from 'react'

// 1. Oddiy tiplar — avtomatik aniqlanadi
const [count, setCount] = useState(0)        // number
const [name, setName] = useState('')          // string
const [active, setActive] = useState(false)   // boolean

// 2. Union type
const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')

// 3. Null bo'lishi mumkin
const [user, setUser] = useState<User | null>(null)

// 4. Interface bilan
interface Product {
  id: number
  name: string
  price: number
}
const [products, setProducts] = useState<Product[]>([])

// 5. Generic tip — boshlang'ich qiymat bilan aniqlanadi
const [data, setData] = useState({ x: 0, y: 0 }) // { x: number, y: number }`,
        description: 'TypeScript-da useState tipizatsiyasi. Oddiy qiymatlar avtomatik aniqlanadi. Murakkab tiplar uchun generic <Type> ishlatiladi.',
      },
    ],
    interviewQA: [
      {
        question: 'useState qanday ishlaydi? Har renderda yangi state yaratadimi?',
        answer: `Yo'q. React har bir komponent uchun fiber node yaratadi. Bu fiber ichida hooklar linked list sifatida saqlanadi. Birinchi renderda useState yangi state node yaratadi va boshlang'ich qiymatni saqlaydi. Keyingi renderlarda React hook indeksiga qarab mavjud state-ni qaytaradi. Shuning uchun hooklar doim bir xil tartibda chaqirilishi shart (Rules of Hooks).`,
      },
      {
        question: 'setState sinxronmi yoki asinxronmi?',
        answer: `setState asinxron — to'g'rirog'i, u "batched". setState chaqirilganda React darhol renderlaMAYDI. Yangi qiymatni navbatga qo'yadi va bir nechta setState-ni birlashtirib, BITTA render qiladi. Bu React 18 dan boshlab BARCHA kontekstlarda (event handler, setTimeout, Promise) ishlaydi. Yangi qiymatni ko'rish uchun keyingi render-ni kutish kerak.`,
      },
      {
        question: 'setCount(count + 1) va setCount(prev => prev + 1) farqi nima?',
        answer: `setCount(count + 1) — closure orqali SHU renderdagi count qiymatini ishlatadi. Agar bitta event ichida 3 marta chaqirilsa, har uchovi bir xil eski qiymatni ishlatadi. setCount(prev => prev + 1) — updater function. React har safar ENG YANGI qiymatni prev ga beradi. Shuning uchun 3 marta chaqirilsa, har biri oldingi natijaga +1 qiladi. Qoida: agar yangi state eski state-ga bog'liq bo'lsa, DOIM updater function ishlatish kerak.`,
      },
      {
        question: 'useState(value) va useState(() => value) farqi nima?',
        answer: `useState(value) — value HAR RENDERDA hisoblanadi, lekin faqat birinchi renderda ishlatiladi. useState(() => value) — funksiya faqat BIRINCHI RENDERDA chaqiriladi. Bu "lazy initialization" deyiladi. Qimmat operatsiyalar (JSON.parse, localStorage, katta array yaratish) uchun DOIM funksiya berish kerak, aks holda har renderda keraksiz hisoblash bo'ladi.`,
      },
      {
        question: `React state o'zgarganini qanday aniqlaydi?`,
        answer: `React Object.is() algoritmini ishlatadi (=== bilan deyarli bir xil). Primitiv tiplar uchun (string, number, boolean) qiymat taqqoslanadi. Object va array uchun REFERENS taqqoslanadi — yangi object yaratilmasa, React o'zgarish bo'lmagan deb hisoblaydi. Shuning uchun setState(sameObject) render qilMAYDI, setState({...sameObject}) render QILADI — chunki yangi referens.`,
      },
      {
        question: `Nima uchun useState ichida object/array-ni mutatsiya qilib bo'lmaydi?`,
        answer: `React state-ni referens bo'yicha taqqoslaydi (Object.is). user.name = "Ali"; setUser(user) desangiz, React uchun user hali ham ESKI referens — o'zgarish yo'q deb render qilmaydi. DOIM yangi object/array yaratish kerak: setUser({...user, name: "Ali"}). Bu "immutability" prinsipi — React-ning butun rendering tizimi shunga asoslangan.`,
      },
      {
        question: 'useState vs useReducer — qachon nima ishlatiladi?',
        answer: `useState — oddiy, mustaqil qiymatlar uchun (counter, toggle, input value). useReducer — murakkab, bog'liq state logikasi uchun (form validation, multi-step wizard, state machine). Qoida: agar setState ichida ko'p mantiq bo'lsa (if/else, switch), useReducer-ga o'tish kerak. Redux-ga o'xshash action/reducer pattern beradi, lekin global emas — faqat komponent ichida.`,
      },
      {
        question: 'Props-ni state-ga nusxalash nima uchun yomon?',
        answer: `const [value, setValue] = useState(props.value) — boshlang'ich qiymat faqat BIRINCHI renderda ishlatiladi. Keyingi renderlarda props o'zgarsa ham, state eski qiymatda qoladi. Bu "stale props" muammosi. To'g'ri usul — props-ni to'g'ridan-to'g'ri ishlatish, yoki useEffect bilan sinxronlash. Agar props-ni lokal o'zgartirish kerak bo'lsa, key prop orqali komponentni qayta yaratish mumkin.`,
      },
    ],
    relatedTopics: [
      { sectionId: 'react-core', topicId: 'batching', label: 'setState Batching' },
      { sectionId: 'react-core', topicId: 'rendering-cycle', label: 'Rendering Cycle' },
      { sectionId: 'performance', topicId: 're-render-causes', label: 'Re-render sabablari' },
      { sectionId: 'component-patterns', topicId: 'controlled-vs-uncontrolled', label: 'Controlled vs Uncontrolled' },
      { sectionId: 'theory-questions', topicId: 'closures-in-hooks', label: 'Stale Closures' },
    ],
  }
