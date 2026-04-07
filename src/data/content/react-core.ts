import type { Topic } from '../types'

export const reactCoreTopics: Topic[] = [
  // ===== HOOKLAR =====
  {
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
        description: 'Eng oddiy useState misoli. "+" bosilganda count + 1 bo\'ladi, "-" bosilganda prev => prev - 1 (updater function).',
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
        description: 'Object state — spread operator (...prev) bilan yangilash. DOIM yangi object yaratish kerak, aks holda React o\'zgarishni sezmaydi.',
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
        description: 'Array state pattern — qo\'shish ([...prev, new]), o\'chirish (filter), yangilash (map). Hech qachon push/splice ishlatmang!',
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
        description: 'Lazy initialization — boshlang\'ich qiymatni hisoblash qimmat bo\'lsa, funksiya bering (chaqirmang). React faqat birinchi renderda chaqiradi.',
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
        description: 'Stale closure muammosi. count o\'zgaruvchisi eski render qiymatini ushlab turadi. prev => prev + 1 DOIM eng yangi qiymatni beradi.',
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
        answer: 'Yo\'q. React har bir komponent uchun fiber node yaratadi. Bu fiber ichida hooklar linked list sifatida saqlanadi. Birinchi renderda useState yangi state node yaratadi va boshlang\'ich qiymatni saqlaydi. Keyingi renderlarda React hook indeksiga qarab mavjud state-ni qaytaradi. Shuning uchun hooklar doim bir xil tartibda chaqirilishi shart (Rules of Hooks).',
      },
      {
        question: 'setState sinxronmi yoki asinxronmi?',
        answer: 'setState asinxron — to\'g\'rirog\'i, u "batched". setState chaqirilganda React darhol renderlaMAYDI. Yangi qiymatni navbatga qo\'yadi va bir nechta setState-ni birlashtirib, BITTA render qiladi. Bu React 18 dan boshlab BARCHA kontekstlarda (event handler, setTimeout, Promise) ishlaydi. Yangi qiymatni ko\'rish uchun keyingi render-ni kutish kerak.',
      },
      {
        question: 'setCount(count + 1) va setCount(prev => prev + 1) farqi nima?',
        answer: 'setCount(count + 1) — closure orqali SHU renderdagi count qiymatini ishlatadi. Agar bitta event ichida 3 marta chaqirilsa, har uchovi bir xil eski qiymatni ishlatadi. setCount(prev => prev + 1) — updater function. React har safar ENG YANGI qiymatni prev ga beradi. Shuning uchun 3 marta chaqirilsa, har biri oldingi natijaga +1 qiladi. Qoida: agar yangi state eski state-ga bog\'liq bo\'lsa, DOIM updater function ishlatish kerak.',
      },
      {
        question: 'useState(value) va useState(() => value) farqi nima?',
        answer: 'useState(value) — value HAR RENDERDA hisoblanadi, lekin faqat birinchi renderda ishlatiladi. useState(() => value) — funksiya faqat BIRINCHI RENDERDA chaqiriladi. Bu "lazy initialization" deyiladi. Qimmat operatsiyalar (JSON.parse, localStorage, katta array yaratish) uchun DOIM funksiya berish kerak, aks holda har renderda keraksiz hisoblash bo\'ladi.',
      },
      {
        question: 'React state o\'zgarganini qanday aniqlaydi?',
        answer: 'React Object.is() algoritmini ishlatadi (=== bilan deyarli bir xil). Primitiv tiplar uchun (string, number, boolean) qiymat taqqoslanadi. Object va array uchun REFERENS taqqoslanadi — yangi object yaratilmasa, React o\'zgarish bo\'lmagan deb hisoblaydi. Shuning uchun setState(sameObject) render qilMAYDI, setState({...sameObject}) render QILADI — chunki yangi referens.',
      },
      {
        question: 'Nima uchun useState ichida object/array-ni mutatsiya qilib bo\'lmaydi?',
        answer: 'React state-ni referens bo\'yicha taqqoslaydi (Object.is). user.name = "Ali"; setUser(user) desangiz, React uchun user hali ham ESKI referens — o\'zgarish yo\'q deb render qilmaydi. DOIM yangi object/array yaratish kerak: setUser({...user, name: "Ali"}). Bu "immutability" prinsipi — React-ning butun rendering tizimi shunga asoslangan.',
      },
      {
        question: 'useState vs useReducer — qachon nima ishlatiladi?',
        answer: 'useState — oddiy, mustaqil qiymatlar uchun (counter, toggle, input value). useReducer — murakkab, bog\'liq state logikasi uchun (form validation, multi-step wizard, state machine). Qoida: agar setState ichida ko\'p mantiq bo\'lsa (if/else, switch), useReducer-ga o\'tish kerak. Redux-ga o\'xshash action/reducer pattern beradi, lekin global emas — faqat komponent ichida.',
      },
      {
        question: 'Props-ni state-ga nusxalash nima uchun yomon?',
        answer: 'const [value, setValue] = useState(props.value) — boshlang\'ich qiymat faqat BIRINCHI renderda ishlatiladi. Keyingi renderlarda props o\'zgarsa ham, state eski qiymatda qoladi. Bu "stale props" muammosi. To\'g\'ri usul — props-ni to\'g\'ridan-to\'g\'ri ishlatish, yoki useEffect bilan sinxronlash. Agar props-ni lokal o\'zgartirish kerak bo\'lsa, key prop orqali komponentni qayta yaratish mumkin.',
      },
    ],
    relatedTopics: [
      { sectionId: 'react-core', topicId: 'batching', label: 'setState Batching' },
      { sectionId: 'react-core', topicId: 'rendering-cycle', label: 'Rendering Cycle' },
      { sectionId: 'performance', topicId: 're-render-causes', label: 'Re-render sabablari' },
      { sectionId: 'component-patterns', topicId: 'controlled-vs-uncontrolled', label: 'Controlled vs Uncontrolled' },
      { sectionId: 'theory-questions', topicId: 'closures-in-hooks', label: 'Stale Closures' },
    ],
  },
  {
    id: 'use-effect',
    title: 'useEffect',
    importance: 3,
    status: 'to-learn',
    description: 'Side effectlar va lifecycle boshqaruvi',
    content: `useEffect — React komponentida "side effect" (yon ta'sir) bajarish uchun ishlatiladigan hook. Side effect — bu renderdan tashqari narsalar: API so'rov, DOM manipulyatsiya, timer, subscription, localStorage bilan ishlash.

═══════════════════════════════════════
  SINTAKSIS
═══════════════════════════════════════

  useEffect(setup, dependencies?)

- setup — effect funksiyasi (nima bajariladi)
- dependencies — qachon qayta ishlashi kerakligini aytuvchi massiv (ixtiyoriy)
- setup funksiya cleanup funksiyasini QAYTARISHI mumkin

═══════════════════════════════════════
  3 TA VARIANT
═══════════════════════════════════════

1. Har renderda ishlaydi (dependency yo'q):

  useEffect(() => {
    console.log('Har renderda')
  })

2. Faqat MOUNT-da ishlaydi (bo'sh massiv):

  useEffect(() => {
    console.log('Faqat 1 marta — mount')
  }, [])

3. Dependency o'zgarganda ishlaydi:

  useEffect(() => {
    console.log('count o'zgarganda')
  }, [count])

═══════════════════════════════════════
  LIFECYCLE BILAN TAQQOSLASH
═══════════════════════════════════════

Class component-larda 3 ta lifecycle metod bor edi:
- componentDidMount — komponent DOM-ga qo'shilganda
- componentDidUpdate — state/props o'zgarganda
- componentWillUnmount — komponent DOM-dan o'chirilganda

useEffect bularning HAMMASINI bitta hook-da qiladi:

  useEffect(() => {
    // componentDidMount + componentDidUpdate
    // (mount va har dependency o'zgarganda ishlaydi)

    return () => {
      // componentWillUnmount
      // (komponent o'chirilganda yoki keyingi effect oldidan ishlaydi)
    }
  }, [dependency])

═══════════════════════════════════════
  CLEANUP FUNKSIYASI
═══════════════════════════════════════

Cleanup — effect qaytargan funksiya. U 2 ta holatda ishlaydi:
1. Komponent unmount bo'lganda (DOM-dan o'chirilganda)
2. Keyingi effect ishga tushishidan OLDIN (eski effect tozalanadi)

Cleanup SHART bo'lgan holatlar:
- setInterval / setTimeout — tozalamasangiz memory leak
- addEventListener — tozalamasangiz event ko'payib ketadi
- WebSocket subscription — tozalamasangiz connection qoladi
- AbortController — tozalamasangiz eski API so'rovlar keladi

Cleanup KERAK EMAS holatlar:
- Oddiy console.log
- State yangilash (agar komponent hali mount)
- Bir martalik API so'rov (cleanup ixtiyoriy)

═══════════════════════════════════════
  DEPENDENCY ARRAY QOIDALARI
═══════════════════════════════════════

Effect ichida ishlatilgan BARCHA tashqi o'zgaruvchilar dependency-ga kiritilishi SHART.

  const [count, setCount] = useState(0)
  const [name, setName] = useState('')

  // NOTO'G'RI — count ishlatilgan lekin dependency-da yo'q:
  useEffect(() => {
    document.title = count + ' marta'
  }, [])  // count eskiradi — stale closure!

  // TO'G'RI:
  useEffect(() => {
    document.title = count + ' marta'
  }, [count])

ESLint react-hooks/exhaustive-deps qoidasi buni avtomatik tekshiradi.

═══════════════════════════════════════
  QACHON ISHLAYDI (TIMING)
═══════════════════════════════════════

useEffect ASINXRON — brauzer paint-dan KEYIN ishlaydi:

1. React komponentni renderlydi (Virtual DOM)
2. React DOM-ni yangilaydi (commit)
3. Brauzer ekranga chizadi (paint)
4. useEffect ishlaydi <-- SHU YERDA

Bu degani — useEffect ekranga chizilgan KEYIN ishlaydi.
Agar DOM o'lchash kerak bo'lsa — useLayoutEffect ishlatish kerak (paint OLDIDAN).

═══════════════════════════════════════
  STRICT MODE XULQI
═══════════════════════════════════════

React StrictMode-da (dev rejim) har bir effectni 2 MARTA ishlaydi:
- Mount → effect → cleanup → effect

Bu nima uchun? Cleanup to'g'ri yozilganini tekshirish uchun.
Agar 2 marta ishlanganda muammo bo'lsa — cleanup noto'g'ri yozilgan.

Production-da faqat 1 marta ishlaydi.

═══════════════════════════════════════
  ANTI-PATTERNS
═══════════════════════════════════════

1. Keraksiz effect — render vaqtida hisoblash mumkin bo'lgan narsalar:

  // NOTO'G'RI:
  useEffect(() => {
    setFullName(first + ' ' + last)
  }, [first, last])

  // TO'G'RI — render vaqtida hisoblash:
  const fullName = first + ' ' + last

2. Effect ichida boshqa state yangilash (zanjirli effect):

  // NOTO'G'RI — 2 ta render:
  useEffect(() => {
    setFiltered(items.filter(i => i.active))
  }, [items])

  // TO'G'RI — render vaqtida:
  const filtered = items.filter(i => i.active)

3. Object/array dependency:

  // NOTO'G'RI — har renderda yangi object = cheksiz loop:
  useEffect(() => {
    fetch(options.url)
  }, [options])  // options = { url: '...' } — har renderda yangi referens!

  // TO'G'RI — primitive qiymatlarni olish:
  useEffect(() => {
    fetch(url)
  }, [url])

4. Fetch uchun useEffect — TanStack Query ishlatish yaxshiroq:

  // Ishlaydi, lekin ko'p muammo: loading, error, cache, race condition
  useEffect(() => {
    fetch('/api/data').then(r => r.json()).then(setData)
  }, [])

  // YAXSHIROQ — TanStack Query:
  const { data } = useQuery({ queryKey: ['data'], queryFn: fetchData })

═══════════════════════════════════════
  useEffect vs useLayoutEffect
═══════════════════════════════════════

- useEffect — paint KEYIN (asinxron, ko'p hollarda kerak)
- useLayoutEffect — paint OLDIDAN (sinxron, faqat DOM o'lchash uchun)

useLayoutEffect ishlatish kerak:
- Element o'lchamini o'lchash (getBoundingClientRect)
- Scroll pozitsiyasini o'rnatish
- Tooltip/popover pozitsiyasini hisoblash

Qolgan BARCHA holatlar uchun useEffect ishlatish kerak.`,
    codeExamples: [
      {
        title: 'Document title yangilash',
        language: 'tsx',
        code: `import { useState, useEffect } from 'react'

function Counter() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    // Har safar count o'zgarganda title yangilanadi
    document.title = \`Hisob: \${count}\`
  }, [count])  // <-- faqat count o'zgarganda

  return (
    <button onClick={() => setCount(c => c + 1)}>
      {count}
    </button>
  )
}`,
        description: 'Eng oddiy useEffect misoli. count o\'zgarganda brauzer title-ni yangilaydi. Dependency array-da [count] bo\'lgani uchun faqat count o\'zgarganda ishlaydi.',
      },
      {
        title: 'API dan ma\'lumot olish (fetch)',
        language: 'tsx',
        code: `import { useState, useEffect } from 'react'

interface User {
  id: number
  name: string
  email: string
}

function UserProfile({ userId }: { userId: number }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // AbortController — komponent unmount bo'lsa so'rovni bekor qiladi
    const controller = new AbortController()

    async function fetchUser() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(
          \`https://api.example.com/users/\${userId}\`,
          { signal: controller.signal }
        )
        if (!res.ok) throw new Error('Xatolik: ' + res.status)
        const data = await res.json()
        setUser(data)
      } catch (err) {
        // AbortError — komponent unmount bo'lganda, xato emas
        if (err instanceof Error && err.name !== 'AbortError') {
          setError(err.message)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchUser()

    // Cleanup: userId o'zgarganda yoki unmount-da eski so'rovni bekor qilish
    return () => controller.abort()
  }, [userId])  // userId o'zgarganda qaytadan fetch

  if (loading) return <p>Yuklanmoqda...</p>
  if (error) return <p>Xatolik: {error}</p>
  if (!user) return null

  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  )
}`,
        description: 'API fetch pattern — AbortController bilan. userId o\'zgarganda eski so\'rov bekor qilinadi (race condition oldini oladi). Production-da TanStack Query ishlatish yaxshiroq.',
      },
      {
        title: 'Event listener (cleanup bilan)',
        language: 'tsx',
        code: `import { useState, useEffect } from 'react'

function WindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })

  useEffect(() => {
    function handleResize() {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener('resize', handleResize)

    // Cleanup — listener-ni olib tashlash
    // Aks holda har renderda yangi listener qo'shiladi = memory leak
    return () => window.removeEventListener('resize', handleResize)
  }, [])  // Bo'sh massiv — faqat mount/unmount

  return (
    <p>{size.width} x {size.height}</p>
  )
}`,
        description: 'addEventListener + cleanup pattern. Bo\'sh dependency [] — faqat mount-da qo\'shiladi, unmount-da olib tashlanadi. Cleanup yo\'q bo\'lsa memory leak bo\'ladi.',
      },
      {
        title: 'setInterval (timer) + cleanup',
        language: 'tsx',
        code: `import { useState, useEffect } from 'react'

function Timer() {
  const [seconds, setSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    if (!isRunning) return  // Timer to'xtatilgan bo'lsa hech narsa qilma

    const id = setInterval(() => {
      setSeconds(prev => prev + 1)  // updater function — stale closure yo'q
    }, 1000)

    // Cleanup — isRunning o'zgarganda yoki unmount-da timer tozalanadi
    return () => clearInterval(id)
  }, [isRunning])  // isRunning o'zgarganda qayta ishlaydi

  return (
    <div>
      <p>{seconds} soniya</p>
      <button onClick={() => setIsRunning(r => !r)}>
        {isRunning ? 'To\\'xtatish' : 'Boshlash'}
      </button>
      <button onClick={() => { setIsRunning(false); setSeconds(0) }}>
        Reset
      </button>
    </div>
  )
}`,
        description: 'setInterval pattern. MUHIM: clearInterval cleanup-da bo\'lishi SHART, aks holda timerlar ko\'payib ketadi. setSeconds(prev => prev + 1) — stale closure muammosini oldini oladi.',
      },
      {
        title: 'localStorage bilan sinxronizatsiya',
        language: 'tsx',
        code: `import { useState, useEffect } from 'react'

function useLocalStorage<T>(key: string, initialValue: T) {
  // Lazy initialization — localStorage faqat 1 marta o'qiladi
  const [value, setValue] = useState<T>(() => {
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : initialValue
  })

  // value o'zgarganda localStorage-ga yozish
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue] as const
}

// Ishlatish:
function Settings() {
  const [theme, setTheme] = useLocalStorage('theme', 'light')
  const [lang, setLang] = useLocalStorage('lang', 'uz')

  return (
    <div>
      <select value={theme} onChange={e => setTheme(e.target.value)}>
        <option value="light">Yorug'</option>
        <option value="dark">Qorong'u</option>
      </select>
      <select value={lang} onChange={e => setLang(e.target.value)}>
        <option value="uz">O'zbekcha</option>
        <option value="en">English</option>
      </select>
    </div>
  )
}`,
        description: 'Custom hook pattern — useLocalStorage. useState bilan useEffect birgalikda ishlaydi. Bu Real loyihalarda juda ko\'p ishlatiladi.',
      },
      {
        title: 'Debounced search (cleanup + dependency)',
        language: 'tsx',
        code: `import { useState, useEffect } from 'react'

function Search() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<string[]>([])

  useEffect(() => {
    // Bo'sh query — hech narsa qilma
    if (!query.trim()) {
      setResults([])
      return
    }

    // 300ms kutish — har harf bosilganda emas, yozib bo'lgandan keyin
    const timerId = setTimeout(async () => {
      const res = await fetch(\`/api/search?q=\${query}\`)
      const data = await res.json()
      setResults(data)
    }, 300)

    // Cleanup: yangi harf bosilganda eski timer bekor qilinadi
    return () => clearTimeout(timerId)
  }, [query])  // Har safar query o'zgarganda

  // Natija:
  // "React" yozganda: R → [cleanup] → Re → [cleanup] → Rea → ... → React → 300ms → fetch!
  // Faqat 1 ta API so'rov yuboriladi, 5 ta emas

  return (
    <div>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Qidirish..."
      />
      {results.map((r, i) => <p key={i}>{r}</p>)}
    </div>
  )
}`,
        description: 'Debounce pattern — useEffect + setTimeout + cleanup. Foydalanuvchi yozayotganda har harfda emas, 300ms to\'xtagandan keyin fetch qiladi. Cleanup eski timer-ni tozalaydi.',
      },
    ],
    interviewQA: [
      {
        question: 'useEffect qachon ishlaydi? Rendering cycle-da qayerda turadi?',
        answer: 'useEffect brauzer PAINT-dan KEYIN asinxron ishlaydi. Tartib: 1) React komponentni render qiladi (Virtual DOM), 2) React DOM-ni yangilaydi (commit fazasi), 3) Brauzer ekranga chizadi (paint), 4) useEffect ishlaydi. Shuning uchun useEffect ichida DOM o\'zgartirsangiz, foydalanuvchi bir lahzalik "miltillash" ko\'rishi mumkin — chunki avval eski holat chiziladi, keyin effect yangilaydi.',
      },
      {
        question: 'useEffect cleanup funksiyasi qachon ishlaydi?',
        answer: 'Cleanup 2 ta holatda ishlaydi: 1) Komponent unmount bo\'lganda (DOM-dan o\'chirilganda) — bu componentWillUnmount-ga teng. 2) Dependency o\'zgarib, keyingi effect ishga tushishidan OLDIN — avval eski effect tozalanadi, keyin yangi effect ishlaydi. Bu muhim chunki aks holda subscription-lar, timer-lar, listener-lar ko\'payib ketadi (memory leak).',
      },
      {
        question: 'useEffect dependency array-da [] va hech narsa bermaslik farqi nima?',
        answer: '[] (bo\'sh massiv) — effect faqat MOUNT-da 1 marta ishlaydi, cleanup faqat UNMOUNT-da ishlaydi. componentDidMount + componentWillUnmount-ga teng. Dependency bermaslik — effect HAR RENDERDA ishlaydi (state yoki props o\'zgarganda). Bu odatda NOTO\'G\'RI va keraksiz — ko\'pincha dependency qo\'yish kerak. Har renderda ishlash kerak bo\'lgan holat juda kam.',
      },
      {
        question: 'useEffect ichida async funksiya to\'g\'ridan-to\'g\'ri ishlatish mumkinmi?',
        answer: 'Yo\'q! useEffect(() => async () => {}) deb yozsangiz, async funksiya Promise qaytaradi — lekin React cleanup uchun funksiya (yoki undefined) kutadi, Promise emas. To\'g\'ri usul: useEffect ichida alohida async funksiya e\'lon qilib chaqirish: useEffect(() => { async function fetchData() { await ... } fetchData() }, []). Yoki IIFE: useEffect(() => { (async () => { ... })() }, []).',
      },
      {
        question: 'useEffect dependency-da object/array bersa nima bo\'ladi?',
        answer: 'Cheksiz loop! React dependency-larni Object.is() bilan taqqoslaydi. Object/array har renderda YANGI referens oladi (hatto qiymati bir xil bo\'lsa ham). Natija: effect har renderda ishlaydi → state yangilaydi → qayta render → effect yana ishlaydi → cheksiz. Yechim: 1) Primitive qiymatlarni dependency qilish (url, id), 2) useMemo bilan object-ni memoizatsiya qilish, 3) JSON.stringify bilan taqqoslash.',
      },
      {
        question: 'React StrictMode-da useEffect nima uchun 2 marta ishlaydi?',
        answer: 'StrictMode (faqat dev rejimda) har effect-ni mount → cleanup → mount qilib ishlaydi. Maqsad: cleanup to\'g\'ri yozilganini tekshirish. Agar 2 marta ishlanganda muammo bo\'lsa — cleanup-da subscription/timer/listener tozalanmagan. Bu production-da BO\'LMAYDI — faqat development-da. Masalan: WebSocket-ga 2 marta connect bo\'lsa, cleanup-da disconnect yo\'q degani.',
      },
      {
        question: 'useEffect vs useLayoutEffect — qachon nima ishlatiladi?',
        answer: 'useEffect — asinxron, paint KEYIN. 95% hollarda shu ishlatiladi: API fetch, subscription, timer, localStorage. useLayoutEffect — sinxron, paint OLDIDAN. Faqat DOM o\'lchash kerak bo\'lganda: getBoundingClientRect, scroll pozitsiya, tooltip pozitsiya hisoblash. useLayoutEffect sekin ishlaydi (paint-ni bloklaydi), shuning uchun faqat zarurat bo\'lganda ishlatish kerak.',
      },
      {
        question: 'useEffect ichida state yangilash xavflimi? Qanday anti-pattern-lar bor?',
        answer: 'O\'zi xavfli emas, lekin keraksiz effect ko\'p. Anti-pattern-lar: 1) Props-dan derived state — effect bilan emas, render vaqtida hisoblash kerak (const fullName = first + " " + last). 2) Zanjirli effect-lar — bitta effect state yangilaydi, u boshqa effect-ni trigger qiladi = ortiqcha render. 3) Event handler logikasini effect-ga qo\'yish — onClick ichida qilish kerak, effect-da emas. Qoida: "Bu render vaqtida hisoblanishi mumkinmi?" — agar ha, effect KERAK EMAS.',
      },
      {
        question: 'Race condition nima va useEffect-da qanday oldini olish mumkin?',
        answer: 'Race condition — 2 ta asinxron so\'rov yuborilganda, birinchisi ikkinchisidan KEYIN javob qaytarishi. Masalan: userId 1 uchun fetch, keyin userId 2 uchun fetch — lekin 2-ning javobi avval keladi, 1-niki keyin. Natija: ekranda noto\'g\'ri ma\'lumot. Yechim: 1) AbortController — eski so\'rovni bekor qilish (eng yaxshi). 2) Boolean flag — let cancelled = false; return () => { cancelled = true }. 3) TanStack Query — avtomatik boshqaradi.',
      },
    ],
    relatedTopics: [
      { sectionId: 'react-core', topicId: 'use-layout-effect', label: 'useLayoutEffect farqi' },
      { sectionId: 'theory-questions', topicId: 'react-lifecycle', label: 'React Lifecycle' },
      { sectionId: 'theory-questions', topicId: 'closures-in-hooks', label: 'Stale Closures' },
      { sectionId: 'theory-questions', topicId: 'rules-of-hooks', label: 'Rules of Hooks' },
    ],
  },  // ===== HOOKLAR (useRef - useReducer) =====
  {
    id: 'use-ref',
    title: 'useRef',
    importance: 3,
    status: 'to-learn' as const,
    description: 'DOM elementga murojaat va o\'zgarmas qiymat saqlash',
    content: `useRef — React-da ikki xil maqsadda ishlatiladigan hook: 1) DOM elementga to'g'ridan-to'g'ri murojaat qilish, 2) Renderlar orasida qiymat saqlash (lekin render QILMAYDI).

═══════════════════════════════════════
  SINTAKSIS
═══════════════════════════════════════

  const ref = useRef(initialValue)

- ref — { current: initialValue } shaklidagi object qaytaradi
- ref.current — hozirgi qiymatni o'qish/yozish
- initialValue — boshlang'ich qiymat (faqat birinchi renderda o'rnatiladi)
- useRef HAR RENDERDA BIR XIL object qaytaradi (yangi yaratmaydi)

═══════════════════════════════════════
  2 TA ASOSIY VAZIFASI
═══════════════════════════════════════

1) DOM ELEMENTGA MUROJAAT:
   Input-ga focus qilish, scroll qilish, video play/pause,
   canvas bilan ishlash — bular uchun real DOM element kerak.

   const inputRef = useRef<HTMLInputElement>(null)
   // ...
   <input ref={inputRef} />
   // Keyin:
   inputRef.current?.focus()

2) RENDER-LAR ORASIDA QIYMAT SAQLASH:
   Timer ID, oldingi state qiymati, WebSocket instance,
   flag-lar — bularni saqlash kerak lekin o'zgarganda
   RENDER BO'LMASLIGI kerak.

   const timerRef = useRef<number | null>(null)
   timerRef.current = setInterval(...)
   // timerRef.current o'zgarsa — RENDER YO'Q!

═══════════════════════════════════════
  useState vs useRef FARQI
═══════════════════════════════════════

  useState:
  - O'zgarganda komponent QAYTA RENDERLANADI
  - Qiymat keyingi renderda yangilanadi
  - Immutable — setState orqali o'zgartirish kerak

  useRef:
  - O'zgarganda komponent RENDERLANNMAYDI
  - Qiymat DARHOL yangilanadi (sinxron)
  - Mutable — ref.current = newValue to'g'ridan-to'g'ri

  Qoida: Agar qiymat EKRANDA ko'rinishi kerak — useState.
  Agar faqat SAQLASH kerak — useRef.

═══════════════════════════════════════
  DOM REF PATTERN
═══════════════════════════════════════

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Mount bo'lgandan KEYIN ref.current tayyor
    inputRef.current?.focus()
  }, [])

  return <input ref={inputRef} />

MUHIM: ref.current RENDER VAQTIDA null bo'lishi mumkin.
DOM ref faqat komponent mount bo'lgandan keyin tayyor bo'ladi.
Shuning uchun useEffect ichida ishlatish kerak.

═══════════════════════════════════════
  CALLBACK REF
═══════════════════════════════════════

Oddiy ref={myRef} o'rniga FUNKSIYA berish mumkin:

  function MyComponent() {
    const handleRef = (node: HTMLDivElement | null) => {
      if (node) {
        // Element DOM-ga qo'shildi (mount)
        console.log('Element balandligi:', node.offsetHeight)
      } else {
        // Element DOM-dan o'chirildi (unmount)
      }
    }

    return <div ref={handleRef}>Salom</div>
  }

Callback ref QACHON KERAK:
- Dynamic element-lar (conditional rendering, list)
- Element o'lchamini mount vaqtida bilish kerak
- Bir nechta ref-ni birlashtirib ishlatish

═══════════════════════════════════════
  TYPESCRIPT BILAN
═══════════════════════════════════════

DOM ref uchun HTML element tiplarini ishlatish kerak:

  useRef<HTMLInputElement>(null)    // <input>
  useRef<HTMLDivElement>(null)      // <div>
  useRef<HTMLButtonElement>(null)   // <button>
  useRef<HTMLFormElement>(null)     // <form>
  useRef<HTMLCanvasElement>(null)   // <canvas>
  useRef<HTMLVideoElement>(null)    // <video>

Qiymat saqlash uchun:

  useRef<number>(0)                 // oddiy son
  useRef<NodeJS.Timeout | null>(null) // timer ID
  useRef<boolean>(false)            // flag

MUHIM TypeScript farq:
  useRef<HTMLInputElement>(null)  // tip: RefObject — readonly current
  useRef<number>(0)               // tip: MutableRefObject — yozish mumkin

═══════════════════════════════════════
  ANTI-PATTERNS
═══════════════════════════════════════

1. RENDER VAQTIDA ref.current O'QISH/YOZISH:

   // NOTO'G'RI — concurrent mode-da xavfli:
   function MyComponent() {
     const ref = useRef(0)
     ref.current += 1  // RENDER VAQTIDA yozish!
     return <p>{ref.current}</p>  // RENDER VAQTIDA o'qish!
   }

   // TO'G'RI — useEffect yoki event handler ichida:
   useEffect(() => {
     ref.current += 1
   })

2. ref.current NI DEPENDENCY ARRAY-GA QO'YISH:

   // FOYDASIZ — ref.current o'zgarsa trigger bo'lmaydi:
   useEffect(() => {
     console.log(ref.current)
   }, [ref.current])  // ESLint warning!

3. DOM ref-ni RENDER VAQTIDA ishlatish:

   // NOTO'G'RI — mount bo'lmagan, null bo'ladi:
   function MyComponent() {
     const ref = useRef<HTMLInputElement>(null)
     ref.current?.focus()  // Bu yerda hali null!
     return <input ref={ref} />
   }`,
    codeExamples: [
      {
        title: 'Input focus — button bosilganda focus',
        language: 'tsx' as const,
        code: `import { useRef } from 'react'

function FocusInput() {
  const inputRef = useRef<HTMLInputElement>(null)

  function handleClick() {
    // DOM elementga to'g'ridan-to'g'ri murojaat
    inputRef.current?.focus()
  }

  return (
    <div>
      <input ref={inputRef} placeholder="Yozing..." />
      <button onClick={handleClick}>Focus qilish</button>
    </div>
  )
}`,
        description: 'Eng ko\'p ishlatiladigan useRef pattern. inputRef.current input DOM elementiga teng. .focus() — brauzer API. ref={inputRef} orqali React DOM elementni ref.current ga yozadi.',
      },
      {
        title: 'Oldingi qiymatni eslab qolish (previous value)',
        language: 'tsx' as const,
        code: `import { useState, useRef, useEffect } from 'react'

function Counter() {
  const [count, setCount] = useState(0)
  const prevCountRef = useRef<number>(0)

  useEffect(() => {
    // Har renderdan KEYIN oldingi qiymatni saqlash
    prevCountRef.current = count
  }) // dependency yo'q — har renderda ishlaydi

  return (
    <div>
      <p>Hozirgi: {count}</p>
      <p>Oldingi: {prevCountRef.current}</p>
      <button onClick={() => setCount(c => c + 1)}>+1</button>
    </div>
  )
}

// Custom hook sifatida:
function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined)
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}`,
        description: 'useRef render qilmaydi, shuning uchun oldingi qiymatni saqlash uchun ideal. useEffect har renderdan keyin ishlaydi va hozirgi qiymatni ref-ga yozadi. Keyingi renderda ref.current ESKI qiymatni qaytaradi.',
      },
      {
        title: 'Timer ID saqlash — setInterval bilan',
        language: 'tsx' as const,
        code: `import { useState, useRef } from 'react'

function Stopwatch() {
  const [seconds, setSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  function start() {
    if (isRunning) return
    setIsRunning(true)
    intervalRef.current = setInterval(() => {
      setSeconds(prev => prev + 1)
    }, 1000)
  }

  function stop() {
    if (!isRunning) return
    setIsRunning(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  function reset() {
    stop()
    setSeconds(0)
  }

  return (
    <div>
      <p>{seconds} soniya</p>
      <button onClick={start}>Boshlash</button>
      <button onClick={stop}>To'xtatish</button>
      <button onClick={reset}>Reset</button>
    </div>
  )
}`,
        description: 'Timer ID ni useRef da saqlash — eng to\'g\'ri pattern. useState da saqlash NOTO\'G\'RI chunki clearInterval uchun render kerak emas. intervalRef.current o\'zgarganda qayta render bo\'lmaydi — bu to\'g\'ri xulq.',
      },
      {
        title: 'Scroll to element',
        language: 'tsx' as const,
        code: `import { useRef } from 'react'

function ScrollDemo() {
  const section1Ref = useRef<HTMLDivElement>(null)
  const section2Ref = useRef<HTMLDivElement>(null)
  const section3Ref = useRef<HTMLDivElement>(null)

  function scrollTo(ref: React.RefObject<HTMLDivElement | null>) {
    ref.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  return (
    <div>
      <nav>
        <button onClick={() => scrollTo(section1Ref)}>Bo'lim 1</button>
        <button onClick={() => scrollTo(section2Ref)}>Bo'lim 2</button>
        <button onClick={() => scrollTo(section3Ref)}>Bo'lim 3</button>
      </nav>

      <div ref={section1Ref} style={{ height: '100vh', background: '#f0f0f0' }}>
        <h2>Bo'lim 1</h2>
      </div>
      <div ref={section2Ref} style={{ height: '100vh', background: '#e0e0e0' }}>
        <h2>Bo'lim 2</h2>
      </div>
      <div ref={section3Ref} style={{ height: '100vh', background: '#d0d0d0' }}>
        <h2>Bo'lim 3</h2>
      </div>
    </div>
  )
}`,
        description: 'scrollIntoView — brauzer API. useRef orqali har bir section-ga ref berib, button bosilganda o\'sha joyga smooth scroll qilish. Navigation komponentlarida ko\'p ishlatiladi.',
      },
    ],
    interviewQA: [
      {
        question: 'useRef vs useState farqi nima?',
        answer: 'useState qiymat o\'zgarganda komponentni QAYTA RENDERLAYDI va yangi qiymat keyingi renderda ko\'rinadi. useRef qiymat o\'zgarganda render BO\'LMAYDI va qiymat DARHOL (sinxron) yangilanadi. useState immutable — faqat setState orqali o\'zgartirish mumkin. useRef mutable — ref.current = newValue to\'g\'ridan-to\'g\'ri yozish mumkin. Qoida: ekranda ko\'rsatish kerak bo\'lsa useState, faqat saqlash kerak bo\'lsa useRef.',
      },
      {
        question: 'Nima uchun ref.current o\'zgarganda render bo\'lmaydi?',
        answer: 'Chunki useRef oddiy JavaScript object qaytaradi: { current: value }. React bu object-ni kuzatmaydi (track qilmaydi). ref.current = newValue — bu oddiy JS property assignment, React buni bilmaydi. useState esa React-ning ichki tizimi orqali ishlaydi — setState chaqirilganda React maxsus navbatga qo\'yadi va render rejalashtiradi. Ref esa React rendering tizimidan TASHQARIDA ishlaydi.',
      },
      {
        question: 'DOM ref qachon null bo\'ladi?',
        answer: 'DOM ref boshlang\'ich qiymati null. Komponent mount bo\'lgandan KEYIN React DOM elementni ref.current ga yozadi. Komponent unmount bo\'lganda yana null bo\'ladi. Shuning uchun render vaqtida ref.current null bo\'lishi mumkin — DOM hali tayyor emas. Xavfsiz ishlatish uchun useEffect ichida yoki event handler ichida murojaat qilish kerak. TypeScript-da ref.current?.focus() deb optional chaining ishlatish tavsiya etiladi.',
      },
      {
        question: 'Callback ref nima va oddiy ref-dan farqi?',
        answer: 'Callback ref — ref prop-ga object o\'rniga FUNKSIYA berish. React element mount bo\'lganda bu funksiyani DOM node bilan chaqiradi, unmount bo\'lganda null bilan chaqiradi. Oddiy ref={myRef} static element-lar uchun yaxshi. Callback ref dynamic element-lar uchun kerak: conditional rendering, list item-lar, element o\'lchami kerak bo\'lganda. Callback ref har render-da chaqirilishi mumkin, shuning uchun useCallback bilan o\'rash tavsiya etiladi.',
      },
      {
        question: 'Nima uchun render vaqtida ref.current o\'qish/yozish noto\'g\'ri?',
        answer: 'React Concurrent Mode-da render bir necha marta ishga tushishi, to\'xtatilishi yoki bekor qilinishi mumkin. Agar render vaqtida ref.current ga yozsangiz, React renderni bekor qilsa — noto\'g\'ri qiymat yoziladi. O\'qish ham xavfli — boshqa renderlar ref-ni o\'zgartirgan bo\'lishi mumkin. Shuning uchun ref.current ni faqat useEffect, useLayoutEffect yoki event handler-lar ichida o\'qish/yozish kerak. Bu React-ning "pure rendering" tamoyiliga mos keladi.',
      },
    ],
    relatedTopics: [
      { sectionId: 'react-core', topicId: 'use-imperative-handle', label: 'useImperativeHandle' },
      { sectionId: 'react-core', topicId: 'react-memo', label: 'forwardRef' },
      { sectionId: 'typescript-react', topicId: 'hooks-typing', label: 'Ref tipizatsiyasi' },
    ],
  },
  {
    id: 'use-memo',
    title: 'useMemo',
    importance: 2,
    status: 'to-learn' as const,
    description: 'Qimmat hisob-kitoblarni keshlashtirish',
    content: `useMemo — qimmat (og'ir) hisoblashni keshlashtirish uchun hook. Faqat dependency o'zgarganda qayta hisoblanadi, qolgan renderlarda ESKi natijani qaytaradi.

═══════════════════════════════════════
  SINTAKSIS
═══════════════════════════════════════

  const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b])

- Birinchi argument — hisoblash funksiyasi (SINXRON bo'lishi kerak)
- Ikkinchi argument — dependency array
- Qaytargan qiymat — hisoblash natijasi (keshlanadi)

Ishlash tartibi:
1. Birinchi renderda — funksiya chaqiriladi, natija saqlanadi
2. Keyingi renderlarda — dependency o'zgarganmi tekshiriladi
3. O'zgargan bo'lsa — qayta hisoblaydi
4. O'zgarMAGAN bo'lsa — eski natijani qaytaradi

═══════════════════════════════════════
  NIMA UCHUN KERAK
═══════════════════════════════════════

React komponent qayta renderlanganda, funksiya BUTUNLAY qayta ishlaydi.
Bu degani — ichidagi BARCHA hisoblashlar qayta bajariladi:

  function ProductList({ products, query }) {
    // HAR RENDERDA 10000 ta elementni filter qiladi!
    const filtered = products.filter(p =>
      p.name.toLowerCase().includes(query.toLowerCase())
    )
    // ...
  }

useMemo bilan faqat products yoki query o'zgarganda filter ishlaydi:

  const filtered = useMemo(() =>
    products.filter(p =>
      p.name.toLowerCase().includes(query.toLowerCase())
    ),
    [products, query]
  )

═══════════════════════════════════════
  QACHON ISHLATISH KERAK
═══════════════════════════════════════

1. KATTA ARRAY FILTER/SORT/MAP:
   10000+ element bo'lsa, har renderda filter qilish sezilarli sekinlashtiradi.

2. MURAKKAB HISOBLASH:
   Matematik formulalar, ma'lumotlarni qayta ishlash,
   tree traversal — bu operatsiyalar og'ir bo'lsa kerak.

3. OBJECT/ARRAY REFERENS SAQLASH:
   Child component-ga props sifatida berish uchun.
   useMemo-siz har renderda yangi referens yaratiladi,
   bu React.memo-langan child-ni bekor qiladi.

   const style = useMemo(() => ({
     color: theme === 'dark' ? 'white' : 'black'
   }), [theme])

═══════════════════════════════════════
  QACHON ISHLATISH KERAK EMAS
═══════════════════════════════════════

1. ODDIY HISOBLASH:
   const fullName = first + ' ' + last  // useMemo KERAK EMAS
   const total = price * quantity        // useMemo KERAK EMAS
   // Bu hisoblashlar juda tez — memoizatsiya overhead ko'proq

2. PRIMITIVE QIYMATLAR:
   Stringlar, raqamlar — referens muammosi yo'q,
   shuning uchun memoizatsiya foydasiz.

3. HAR DOIM O'ZGARADIGAN DEPENDENCY:
   Agar dependency har renderda o'zgarsa,
   useMemo hech qachon kesh ishlatmaydi — faqat overhead qo'shadi.

4. PREMATURE OPTIMIZATION:
   Avval profiling qiling (React DevTools).
   Muammo aniq bo'lgandan KEYIN useMemo qo'shing.

═══════════════════════════════════════
  useMemo vs useCallback
═══════════════════════════════════════

useMemo — QIYMAT keshlar:
  const value = useMemo(() => computeExpensive(), [deps])

useCallback — FUNKSIYA keshlar:
  const fn = useCallback(() => doSomething(), [deps])

Ular aslida bir xil:
  useCallback(fn, deps) === useMemo(() => fn, deps)

useCallback — useMemo-ning funksiyalar uchun qisqartirilgan versiyasi.

═══════════════════════════════════════
  REACT COMPILER
═══════════════════════════════════════

React 19 Compiler (bu loyihada yoqilgan!) avtomatik memoize qiladi.
Kelajakda useMemo qo'lda yozish kamroq kerak bo'ladi.

Lekin hozircha:
- Compiler hali barcha holatlarni qamrab olmagan
- Interview uchun useMemo bilish SHART
- Eski loyihalarda Compiler yo'q — qo'lda memoizatsiya kerak

Compiler nima qiladi:
  // Yozasiz:
  const filtered = items.filter(i => i.active)

  // Compiler avtomatik qiladi:
  const filtered = useMemo(() => items.filter(i => i.active), [items])`,
    codeExamples: [
      {
        title: 'Katta ro\'yxatni filterlash — 10000 element',
        language: 'tsx' as const,
        code: `import { useState, useMemo } from 'react'

interface Product {
  id: number
  name: string
  price: number
  category: string
}

function ProductList({ products }: { products: Product[] }) {
  const [query, setQuery] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'price'>('name')
  const [minPrice, setMinPrice] = useState(0)

  // useMemo — faqat dependency o'zgarganda qayta ishlaydi
  const filteredAndSorted = useMemo(() => {
    console.log('Filter va sort ishladi!') // Qachon ishlaganini ko'rish uchun
    return products
      .filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) &&
        p.price >= minPrice
      )
      .sort((a, b) =>
        sortBy === 'name'
          ? a.name.localeCompare(b.name)
          : a.price - b.price
      )
  }, [products, query, sortBy, minPrice])

  return (
    <div>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Qidirish..."
      />
      <select value={sortBy} onChange={e => setSortBy(e.target.value as 'name' | 'price')}>
        <option value="name">Nom bo'yicha</option>
        <option value="price">Narx bo'yicha</option>
      </select>
      <input
        type="number"
        value={minPrice}
        onChange={e => setMinPrice(Number(e.target.value))}
        placeholder="Min narx"
      />
      <p>{filteredAndSorted.length} ta mahsulot topildi</p>
      {filteredAndSorted.map(p => (
        <div key={p.id}>{p.name} — {p.price} so'm</div>
      ))}
    </div>
  )
}`,
        description: 'Katta ro\'yxat filter + sort. useMemo-siz har renderda 10000 ta elementni qayta filter/sort qiladi. useMemo bilan faqat query, sortBy yoki minPrice o\'zgarganda ishlaydi. Boshqa state o\'zgarsa — eski natija qaytadi.',
      },
      {
        title: 'Object referens saqlash — child re-render oldini olish',
        language: 'tsx' as const,
        code: `import { useState, useMemo, memo } from 'react'

// React.memo — props o'zgarmasa render qilmaydi
const ExpensiveChild = memo(function ExpensiveChild({ style, data }: {
  style: React.CSSProperties
  data: { items: string[] }
}) {
  console.log('ExpensiveChild renderlanadi')
  return (
    <div style={style}>
      {data.items.map((item, i) => (
        <p key={i}>{item}</p>
      ))}
    </div>
  )
})

function Parent() {
  const [count, setCount] = useState(0)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  // useMemo — har renderda yangi object yaratilMAYDI
  const style = useMemo(() => ({
    backgroundColor: theme === 'dark' ? '#333' : '#fff',
    color: theme === 'dark' ? '#fff' : '#333',
    padding: '20px',
  }), [theme]) // faqat theme o'zgarganda yangi object

  const data = useMemo(() => ({
    items: ['React', 'TypeScript', 'Vite']
  }), []) // hech qachon o'zgarmaydi

  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>
        Count: {count}
      </button>
      <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>
        Tema: {theme}
      </button>
      {/* count o'zgarganda ExpensiveChild RENDERLANMAYDI */}
      {/* chunki style va data referensi o'zgarmagan */}
      <ExpensiveChild style={style} data={data} />
    </div>
  )
}`,
        description: 'React.memo + useMemo kombinatsiyasi. useMemo-siz har renderda yangi { backgroundColor: ... } object yaratiladi — React.memo buni o\'zgardi deb hisoblaydi. useMemo bilan object referensi saqlanadi — child renderlanmaydi.',
      },
      {
        title: 'Qimmat hisoblash — Fibonacci',
        language: 'tsx' as const,
        code: `import { useState, useMemo } from 'react'

// Ataylab sekin funksiya — O(2^n) murakkablik
function fibonacci(n: number): number {
  if (n <= 1) return n
  return fibonacci(n - 1) + fibonacci(n - 2)
}

function FibCalculator() {
  const [num, setNum] = useState(30)
  const [theme, setTheme] = useState('light')

  // useMemo — faqat num o'zgarganda qayta hisoblanadi
  // theme o'zgarganda fibonacci QAYTA ISHLAMAYDI
  const result = useMemo(() => {
    console.log('Fibonacci hisoblanmoqda...')
    return fibonacci(num)
  }, [num])

  return (
    <div style={{ background: theme === 'dark' ? '#333' : '#fff' }}>
      <input
        type="number"
        value={num}
        onChange={e => setNum(Number(e.target.value))}
        max={40}
      />
      <p>fibonacci({num}) = {result}</p>
      <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>
        Tema o'zgartirish (fibonacci qayta hisoblanMAYDI)
      </button>
    </div>
  )
}`,
        description: 'Qimmat hisoblash misoli. fibonacci(35) bir necha soniya olishi mumkin. useMemo-siz tema o\'zgarganda ham fibonacci qayta hisoblanadi. useMemo bilan faqat num o\'zgarganda ishlaydi — tema o\'zgarishi tezkor bo\'ladi.',
      },
    ],
    interviewQA: [
      {
        question: 'useMemo qachon kerak, qachon ortiqcha (premature optimization)?',
        answer: 'useMemo kerak bo\'lgan holatlar: 1) Katta array filter/sort/map (1000+ element), 2) Murakkab matematik hisoblash, 3) React.memo-langan child-ga object/array props berish. useMemo ORTIQCHA bo\'lgan holatlar: oddiy hisoblash (a + b, string concatenation), primitive qiymatlar (number, string — referens muammosi yo\'q), dependency har renderda o\'zgarsa (kesh hech qachon ishlatilmaydi). Qoida: avval profiling qiling, keyin optimize qiling. Premature optimization — barcha yomonliklarning ildizi.',
      },
      {
        question: 'useMemo vs useCallback farqi nima?',
        answer: 'useMemo — QIYMAT (natija) ni keshlaydi: const value = useMemo(() => compute(), [deps]). useCallback — FUNKSIYA referensini keshlaydi: const fn = useCallback(() => doSomething(), [deps]). Aslida useCallback(fn, deps) === useMemo(() => fn, deps). useCallback faqat qulaylik uchun — funksiya uchun useMemo yozish uzunroq bo\'lardi. useMemo funksiyani CHAQIRADI va NATIJAsini saqlaydi. useCallback funksiyani chaqirMAYDI, O\'ZINi saqlaydi.',
      },
      {
        question: 'useMemo garantiya beradimi? Cache eviction nima?',
        answer: 'React rasmiy hujjatlari aytadi: useMemo — "performance optimization, not a semantic guarantee". Ya\'ni React keshni istalgan vaqtda tashlashi MUMKIN (masalan, offscreen component uchun). Kelajakda React kesh hajmini cheklashi mumkin. Shuning uchun useMemo-ga bog\'liq mantiq yozish NOTO\'G\'RI: masalan, useMemo ichida faqat bir marta ishlaydigan side effect qo\'yish xavfli. useMemo faqat PERFORMANCE uchun ishlatish kerak, TO\'G\'RILIK uchun emas.',
      },
      {
        question: 'React Compiler useMemo-ni almashtira oladimi?',
        answer: 'Ha, React 19 Compiler (bu loyihada yoqilgan) avtomatik memoizatsiya qiladi. Compiler kodni tahlil qilib, qayerda memoizatsiya kerakligini aniqlaydi va build vaqtida useMemo/useCallback ni avtomatik qo\'shadi. Lekin hozircha Compiler hali barcha holatlarni 100% qamrab olmagan. Shuningdek, eski loyihalarda Compiler yo\'q — u yerda qo\'lda useMemo yozish kerak. Interview uchun useMemo bilish SHART — chunki tushunchani bilish muhim, hatto Compiler avtomatik qilsa ham.',
      },
    ],
    relatedTopics: [
      { sectionId: 'performance', topicId: 'memo-usememo-usecallback', label: 'memo vs useMemo vs useCallback' },
      { sectionId: 'performance', topicId: 're-render-causes', label: 'Re-render sabablari' },
      { sectionId: 'performance', topicId: 'react-compiler', label: 'React Compiler (avtomatik)' },
    ],
  },
  {
    id: 'use-callback',
    title: 'useCallback',
    importance: 2,
    status: 'to-learn' as const,
    description: 'Funksiya referensini keshlashtirish',
    content: `useCallback — funksiya referensini saqlash (keshlashtirish) uchun hook. Har renderda yangi funksiya yaratilishining oldini oladi.

═══════════════════════════════════════
  SINTAKSIS
═══════════════════════════════════════

  const memoizedFn = useCallback(() => {
    doSomething(a, b)
  }, [a, b])

- Birinchi argument — keshlanadigan funksiya
- Ikkinchi argument — dependency array
- Qaytaradi — funksiyaning O'ZI (keshlanadi)

Ishlash tartibi:
1. Birinchi renderda — funksiya saqlanadi
2. Keyingi renderlarda — dependency tekshiriladi
3. O'zgargan bo'lsa — YANGI funksiya saqlanadi
4. O'zgarMAGAN bo'lsa — ESKI funksiya qaytariladi

═══════════════════════════════════════
  NIMA UCHUN KERAK
═══════════════════════════════════════

JavaScript-da funksiya — OBJECT. Har renderda yangi funksiya
yaratiladi, hatto kodi bir xil bo'lsa ham:

  function Parent() {
    // Har renderda YANGI funksiya:
    const handleClick = () => console.log('clicked')
    // handleClick !== oldingi handleClick (yangi referens)

    return <Child onClick={handleClick} />
  }

Agar Child — React.memo bilan o'ralgan bo'lsa,
har renderda yangi handleClick = Child QAYTA RENDERLANADI.
useCallback bilan eski referens saqlanadi = Child renderlaNMAYDI.

═══════════════════════════════════════
  ASOSIY USE CASE: React.memo BILAN BIRGA
═══════════════════════════════════════

useCallback YOLG'IZ ishlatish FOYDASIZ:

  // FOYDASIZ — child memo-lanmagan:
  const handleClick = useCallback(() => {
    setCount(c => c + 1)
  }, [])
  return <Child onClick={handleClick} />  // Child memo EMAS — baribir renderlanadi

useCallback + React.memo BIRGALIKDA ishlaydi:

  // Parent:
  const handleClick = useCallback(() => setCount(c => c + 1), [])
  return <MemoizedChild onClick={handleClick} />

  // Child:
  const MemoizedChild = memo(function Child({ onClick }) { ... })

═══════════════════════════════════════
  React.memo + useCallback PATTERN
═══════════════════════════════════════

Bu ikkalasi BIRGALIKDA bo'lmasa foyda yo'q:

  ✅ Parent: useCallback + Child: React.memo — ISHLAYDI
  ❌ Parent: useCallback + Child: oddiy — FOYDASIZ
  ❌ Parent: oddiy funksiya + Child: React.memo — memo BUZILADI

Chunki:
1. useCallback — funksiya REFERENSINI saqlaydi
2. React.memo — props REFERENSINI taqqoslaydi
3. Ikkalasi birgalikda — child keraksiz renderlanmaydi

═══════════════════════════════════════
  QACHON KERAK EMAS
═══════════════════════════════════════

1. CHILD MEMO-LANMAGAN BO'LSA:
   Agar child oddiy komponent bo'lsa, useCallback foyda bermaydi.
   Child baribir har renderda renderlanadi.

2. DEPENDENCY HAR RENDERDA O'ZGARSA:
   useCallback([dep1, dep2, dep3]) — agar har renderda o'zgarsa,
   har safar yangi funksiya yaratiladi — foyda yo'q + overhead bor.

3. ODDIY KOMPONENTLARDA:
   Agar komponent tez renderlanayotgan bo'lsa,
   useCallback qo'shish keraksiz murakkablik.
   Premature optimization — yomon.

4. EVENT HANDLER TO'G'RIDAN-TO'G'RI:
   <button onClick={() => setCount(c => c + 1)}>
   Bu yerda useCallback kerak EMAS — button-ni memo-lamaymiz.

═══════════════════════════════════════
  useCallback vs useMemo
═══════════════════════════════════════

  useCallback(fn, deps)  ===  useMemo(() => fn, deps)

- useCallback — funksiyani O'ZI qaytaradi (keshlanadi)
- useMemo — funksiyani CHAQIRADI va NATIJAsini qaytaradi

  // Bir xil natija:
  const handleClick = useCallback(() => doSomething(), [])
  const handleClick = useMemo(() => () => doSomething(), [])

  // FARQLI:
  const value = useMemo(() => expensiveCalc(), [])  // natija keshlanadi
  const fn = useCallback(() => expensiveCalc(), [])  // funksiya keshlanadi, chaqirilMAYDI`,
    codeExamples: [
      {
        title: 'React.memo + useCallback — child re-render oldini olish',
        language: 'tsx' as const,
        code: `import { useState, useCallback, memo } from 'react'

// React.memo — props o'zgarmaganda render qilmaydi
const TodoItem = memo(function TodoItem({ todo, onToggle, onDelete }: {
  todo: { id: number; text: string; done: boolean }
  onToggle: (id: number) => void
  onDelete: (id: number) => void
}) {
  console.log('TodoItem render:', todo.text) // Qachon renderlanganini ko'rish
  return (
    <div>
      <span
        style={{ textDecoration: todo.done ? 'line-through' : 'none' }}
        onClick={() => onToggle(todo.id)}
      >
        {todo.text}
      </span>
      <button onClick={() => onDelete(todo.id)}>O'chirish</button>
    </div>
  )
})

function TodoList() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'React o\\'rganish', done: false },
    { id: 2, text: 'TypeScript o\\'rganish', done: true },
  ])
  const [input, setInput] = useState('')

  // useCallback — funksiya referensi saqlanadi
  const handleToggle = useCallback((id: number) => {
    setTodos(prev => prev.map(t =>
      t.id === id ? { ...t, done: !t.done } : t
    ))
  }, []) // dependency yo'q — setTodos updater ishlatamiz

  const handleDelete = useCallback((id: number) => {
    setTodos(prev => prev.filter(t => t.id !== id))
  }, [])

  function handleAdd() {
    if (!input.trim()) return
    setTodos(prev => [...prev, { id: Date.now(), text: input, done: false }])
    setInput('')
  }

  // input yozganda — faqat shu komponent renderlanadi
  // TodoItem-lar RENDERLANMAYDI (memo + useCallback tufayli)
  return (
    <div>
      <input value={input} onChange={e => setInput(e.target.value)} />
      <button onClick={handleAdd}>Qo'shish</button>
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={handleToggle}
          onDelete={handleDelete}
        />
      ))}
    </div>
  )
}`,
        description: 'Eng asosiy useCallback use case. TodoItem — React.memo bilan o\'ralgan. handleToggle va handleDelete useCallback bilan keshlanadi. Natija: input yozganda 100 ta TodoItem renderlanMAYDI — faqat input render bo\'ladi.',
      },
      {
        title: 'useEffect dependency sifatida useCallback',
        language: 'tsx' as const,
        code: `import { useState, useCallback, useEffect } from 'react'

function SearchComponent({ apiUrl }: { apiUrl: string }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<string[]>([])

  // useCallback — funksiya referensi faqat apiUrl o'zgarganda yangilanadi
  const fetchResults = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }
    const res = await fetch(\`\${apiUrl}/search?q=\${searchQuery}\`)
    const data = await res.json()
    setResults(data)
  }, [apiUrl]) // apiUrl o'zgarganda yangi funksiya

  // fetchResults dependency — useCallback tufayli barqaror
  useEffect(() => {
    const timerId = setTimeout(() => {
      fetchResults(query)
    }, 300)
    return () => clearTimeout(timerId)
  }, [query, fetchResults]) // fetchResults useCallback bo'lmasa — cheksiz loop!

  return (
    <div>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Qidirish..."
      />
      {results.map((r, i) => <p key={i}>{r}</p>)}
    </div>
  )
}`,
        description: 'useCallback useEffect dependency sifatida. useCallback bo\'lmasa, fetchResults har renderda yangi referens oladi va useEffect cheksiz ishlaydi. useCallback bilan faqat apiUrl o\'zgarganda yangi funksiya yaratiladi — effect barqaror ishlaydi.',
      },
      {
        title: 'Event handler-larni keshlashtirish — list bilan',
        language: 'tsx' as const,
        code: `import { useState, useCallback, memo } from 'react'

interface User {
  id: number
  name: string
  role: 'admin' | 'user'
}

const UserCard = memo(function UserCard({ user, onRoleChange, onRemove }: {
  user: User
  onRoleChange: (id: number, role: 'admin' | 'user') => void
  onRemove: (id: number) => void
}) {
  console.log('UserCard render:', user.name)
  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', margin: '5px' }}>
      <strong>{user.name}</strong> — {user.role}
      <button onClick={() => onRoleChange(
        user.id,
        user.role === 'admin' ? 'user' : 'admin'
      )}>
        {user.role === 'admin' ? 'User qilish' : 'Admin qilish'}
      </button>
      <button onClick={() => onRemove(user.id)}>O'chirish</button>
    </div>
  )
})

function UserList() {
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: 'Ali', role: 'admin' },
    { id: 2, name: 'Vali', role: 'user' },
    { id: 3, name: 'Guli', role: 'user' },
  ])

  // BIR funksiya BARCHA card-lar uchun — id orqali farqlash
  const handleRoleChange = useCallback((id: number, role: 'admin' | 'user') => {
    setUsers(prev => prev.map(u =>
      u.id === id ? { ...u, role } : u
    ))
  }, [])

  const handleRemove = useCallback((id: number) => {
    setUsers(prev => prev.filter(u => u.id !== id))
  }, [])

  return (
    <div>
      <h2>Foydalanuvchilar ({users.length})</h2>
      {users.map(user => (
        <UserCard
          key={user.id}
          user={user}
          onRoleChange={handleRoleChange}
          onRemove={handleRemove}
        />
      ))}
    </div>
  )
}`,
        description: 'List pattern — bitta useCallback barcha list item-lar uchun ishlaydi. id parameter orqali qaysi element ekanini aniqlaydi. Har element uchun alohida callback yaratish NOTO\'G\'RI — bitta umumiy callback + id pattern eng yaxshi.',
      },
    ],
    interviewQA: [
      {
        question: 'useCallback yolg\'iz (React.memo-siz) ishlatsa foyda bormi?',
        answer: 'Deyarli yo\'q. useCallback funksiya REFERENSINI saqlaydi, lekin agar child komponent React.memo bilan o\'ralmagan bo\'lsa, u baribir har renderda renderlanadi — funksiya referensi bir xil bo\'lsa ham. Yagona foyda: useEffect dependency sifatida — useCallback bo\'lmasa useEffect cheksiz ishlashi mumkin. Qolgan hollarda useCallback YOLG\'IZ ishlatish faqat ortiqcha overhead qo\'shadi. Qoida: useCallback = React.memo bilan JUFTLIKDA ishlatish.',
      },
      {
        question: 'React.memo + useCallback qachon kerak?',
        answer: 'Kerak bo\'lgan holatlar: 1) Katta list render (100+ element) — har element uchun callback, 2) Og\'ir child komponent (ko\'p DOM element, murakkab hisoblash), 3) Child tez-tez renderlanmasligi kerak (animatsiya, chart, canvas). KERAK EMAS: oddiy button onClick, kichik komponentlar, yagona child. Qoida: avval React DevTools Profiler bilan tekshiring — muammo bormi? Muammo bo\'lsa — memo + useCallback qo\'shing. Muammo yo\'q bo\'lsa — keraksiz murakkablik.',
      },
      {
        question: 'useCallback ichida stale closure qanday bo\'ladi?',
        answer: 'useCallback dependency noto\'g\'ri berilsa, ichidagi o\'zgaruvchilar ESKi qiymatda qoladi. Masalan: useCallback(() => console.log(count), []) — count doim 0 bo\'lib qoladi. Yechim: 1) Barcha ishlatilgan o\'zgaruvchilarni dependency-ga qo\'shish, 2) setState updater function ishlatish: useCallback(() => setCount(prev => prev + 1), []) — prev doim yangi. ESLint react-hooks/exhaustive-deps qoidasi bu muammoni avtomatik topadi.',
      },
      {
        question: 'Performance optimization strategiyasi qanday bo\'lishi kerak?',
        answer: 'To\'g\'ri tartib: 1) Avval kodni TO\'G\'RI yozing — premature optimization qilmang, 2) Muammo bo\'lsa — React DevTools Profiler bilan ANIQ joyni toping, 3) State-ni ko\'tarish o\'rniga TUSHIRISH (lifting state down), 4) Katta komponentni BO\'LISH (composition), 5) Eng oxirida — React.memo + useCallback/useMemo. Ko\'p hollarda 3-4 qadam yetarli bo\'ladi. memo/useCallback/useMemo — eng OXIRGI qadam, eng birinchi emas.',
      },
    ],
    relatedTopics: [
      { sectionId: 'performance', topicId: 'memo-usememo-usecallback', label: 'memo vs useMemo vs useCallback' },
      { sectionId: 'performance', topicId: 're-render-causes', label: 'Re-render sabablari' },
      { sectionId: 'react-core', topicId: 'react-memo', label: 'React.memo bilan birga' },
    ],
  },
  {
    id: 'use-context',
    title: 'useContext',
    importance: 3,
    status: 'to-learn' as const,
    description: 'Global state props drilling-siz',
    content: `useContext — React Context API bilan ishlash uchun hook. Props drilling muammosini hal qiladi — chuqur nested komponentlarga ma'lumotni bevosita yetkazadi.

═══════════════════════════════════════
  SINTAKSIS: createContext -> Provider -> useContext
═══════════════════════════════════════

  // 1-qadam: Context yaratish
  const MyContext = createContext(defaultValue)

  // 2-qadam: Provider bilan o'rash
  <MyContext.Provider value={actualValue}>
    <App />
  </MyContext.Provider>

  // 3-qadam: Istalgan child-da ishlatish
  const value = useContext(MyContext)

═══════════════════════════════════════
  3 QADAM BATAFSIL
═══════════════════════════════════════

1. createContext(defaultValue):
   - Context object yaratadi
   - defaultValue — Provider TOPILMAGANDA ishlatiladigan qiymat
   - Odatda null yoki sensible default berish

2. <Context.Provider value={...}>:
   - Barcha children-larga value yetkazadi
   - value o'zgarganda — barcha consumer-lar RE-RENDER bo'ladi
   - Bir nechta Provider nesting mumkin

3. useContext(Context):
   - Eng yaqin Provider-dan value oladi
   - Provider yo'q bo'lsa — defaultValue qaytaradi
   - Context value o'zgarganda — komponent RE-RENDER bo'ladi

═══════════════════════════════════════
  NIMA UCHUN KERAK
═══════════════════════════════════════

Props drilling muammosi:

  <App>                    // theme state
    <Layout theme={theme}> // faqat pastga uzatadi
      <Sidebar theme={theme}> // faqat pastga uzatadi
        <Menu theme={theme}> // faqat pastga uzatadi
          <MenuItem theme={theme}> // ASLIDA faqat SHU kerak
          </MenuItem>
        </Menu>
      </Sidebar>
    </Layout>
  </App>

Context bilan:

  <ThemeContext.Provider value={theme}>
    <App>
      <Layout>
        <Sidebar>
          <Menu>
            <MenuItem /> // useContext(ThemeContext) — TO'G'RIDAN-TO'G'RI
          </Menu>
        </Sidebar>
      </Layout>
    </App>
  </ThemeContext.Provider>

Props drilling yo'q — MenuItem to'g'ridan-to'g'ri theme oladi!

═══════════════════════════════════════
  PERFORMANCE MUAMMOSI
═══════════════════════════════════════

Context value o'zgarganda BARCHA consumer-lar re-render bo'ladi.
Bu katta muammo bo'lishi mumkin:

  // MUAMMO: user O'ZGARGANDA barcha consumer-lar renderlanadi
  <AppContext.Provider value={{ user, theme, settings, notifications }}>

YECHIMLAR:

1. CONTEXT-NI BO'LISH (eng yaxshi):
   <UserContext.Provider value={user}>
   <ThemeContext.Provider value={theme}>
   <SettingsContext.Provider value={settings}>
   // Endi user o'zgarsa — faqat UserContext consumer-lari renderlanadi

2. VALUE-NI useMemo BILAN O'RASH:
   const value = useMemo(() => ({ user, theme }), [user, theme])
   <AppContext.Provider value={value}>
   // Object referens saqlanadi — keraksiz render kamayadi

3. ZUSTAND/REDUX ISHLATISH:
   Tez-tez o'zgaradigan ma'lumot uchun Context EMAS,
   Zustand yoki Redux ishlatish kerak — ular selector orqali
   faqat KERAKLI qismni kuzatadi.

═══════════════════════════════════════
  PATTERN: Custom Hook Yaratish
═══════════════════════════════════════

Context-ni to'g'ridan-to'g'ri ishlatish o'rniga,
custom hook yaratish BEST PRACTICE:

  // context.ts
  const ThemeContext = createContext<ThemeContextType | null>(null)

  function useTheme() {
    const context = useContext(ThemeContext)
    if (!context) {
      throw new Error('useTheme must be used within ThemeProvider')
    }
    return context
  }

  // Ishlatish:
  const { theme, setTheme } = useTheme()

Foydalari:
- Null check avtomatik
- Import qilish oson
- TypeScript tiplar aniq
- Provider yo'q bo'lsa — aniq xato xabari

═══════════════════════════════════════
  QACHON ISHLATISH, QACHON ISHLATMASLIK
═══════════════════════════════════════

ISHLATISH KERAK:
  ✅ Tema (light/dark) — kam o'zgaradi
  ✅ Til (locale) — kam o'zgaradi
  ✅ Autentifikatsiya (user, login/logout) — kam o'zgaradi
  ✅ Feature flags
  ✅ Router ma'lumotlari

ISHLATMASLIK KERAK:
  ❌ Tez-tez o'zgaradigan ma'lumot (input value, mouse position)
  ❌ Server state (API dan kelgan data) — TanStack Query ishlatish
  ❌ Global state manager o'rniga — Zustand/Redux yaxshiroq
  ❌ Props drilling MUAMMO BO'LMASA — oddiy props yetarli

Qoida: Context = kam o'zgaradigan, ko'p joyda kerak bo'lgan ma'lumot uchun.`,
    codeExamples: [
      {
        title: 'Theme context — createContext + Provider + useContext',
        language: 'tsx' as const,
        code: `import { createContext, useContext, useState, type ReactNode } from 'react'

// 1. Tip va Context yaratish
interface ThemeContextType {
  theme: 'light' | 'dark'
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | null>(null)

// 2. Custom hook — null check bilan
function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme ThemeProvider ichida ishlatilishi kerak!')
  }
  return context
}

// 3. Provider komponent
function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light')

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

// 4. Ishlatish — istalgan chuqurlikda
function Header() {
  const { theme, toggleTheme } = useTheme()
  return (
    <header style={{
      background: theme === 'dark' ? '#333' : '#fff',
      color: theme === 'dark' ? '#fff' : '#333',
    }}>
      <h1>Saytim</h1>
      <button onClick={toggleTheme}>
        {theme === 'dark' ? 'Yorug\\' rejim' : 'Qorong\\'u rejim'}
      </button>
    </header>
  )
}

// 5. App — Provider bilan o'rash
function App() {
  return (
    <ThemeProvider>
      <Header />
      {/* Boshqa komponentlar ham useTheme() ishlatishi mumkin */}
    </ThemeProvider>
  )
}`,
        description: 'To\'liq Theme Context pattern: createContext → Provider → useContext. Custom hook (useTheme) — null check va yaxshi xato xabari bilan. Bu pattern haqiqiy loyihalarda standart hisoblanadi.',
      },
      {
        title: 'Auth context — user, login, logout',
        language: 'tsx' as const,
        code: `import { createContext, useContext, useState, type ReactNode } from 'react'

interface User {
  id: number
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth AuthProvider ichida ishlatilishi kerak!')
  }
  return context
}

function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  async function login(email: string, password: string) {
    // API ga so'rov
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    setUser(data.user)
  }

  function logout() {
    setUser(null)
    // Token tozalash, redirect va boshqalar
  }

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

// Ishlatish:
function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()

  if (!isAuthenticated) return <a href="/login">Kirish</a>

  return (
    <nav>
      <span>Salom, {user?.name}!</span>
      <button onClick={logout}>Chiqish</button>
    </nav>
  )
}

function App() {
  return (
    <AuthProvider>
      <Navbar />
      {/* Barcha child-lar useAuth() ishlatishi mumkin */}
    </AuthProvider>
  )
}`,
        description: 'Auth context — login/logout boshqaruvi. user null bo\'lsa — kirish tugmasi, bo\'lmasa — foydalanuvchi ismi va chiqish. Haqiqiy loyihada token boshqaruvi, localStorage va redirect ham qo\'shiladi.',
      },
      {
        title: 'Multi-context — ikki alohida context',
        language: 'tsx' as const,
        code: `import { createContext, useContext, useState, type ReactNode } from 'react'

// ===== THEME CONTEXT =====
interface ThemeContextType {
  theme: 'light' | 'dark'
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | null>(null)
const useTheme = () => {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('ThemeProvider kerak')
  return ctx
}

// ===== LANGUAGE CONTEXT =====
interface LangContextType {
  lang: 'uz' | 'en' | 'ru'
  setLang: (lang: 'uz' | 'en' | 'ru') => void
  t: (key: string) => string
}

const translations: Record<string, Record<string, string>> = {
  uz: { greeting: 'Salom', goodbye: 'Xayr' },
  en: { greeting: 'Hello', goodbye: 'Goodbye' },
  ru: { greeting: 'Privet', goodbye: 'Poka' },
}

const LangContext = createContext<LangContextType | null>(null)
const useLang = () => {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('LangProvider kerak')
  return ctx
}

// ===== PROVIDERLAR =====
function AppProviders({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [lang, setLang] = useState<'uz' | 'en' | 'ru'>('uz')

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light')
  const t = (key: string) => translations[lang][key] ?? key

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <LangContext.Provider value={{ lang, setLang, t }}>
        {children}
      </LangContext.Provider>
    </ThemeContext.Provider>
  )
}

// ===== ISHLATISH =====
function Settings() {
  const { theme, toggleTheme } = useTheme()  // faqat tema
  const { lang, setLang, t } = useLang()     // faqat til

  return (
    <div style={{ background: theme === 'dark' ? '#333' : '#fff' }}>
      <p>{t('greeting')}!</p>
      <button onClick={toggleTheme}>Tema: {theme}</button>
      <select value={lang} onChange={e => setLang(e.target.value as 'uz' | 'en' | 'ru')}>
        <option value="uz">O'zbekcha</option>
        <option value="en">English</option>
        <option value="ru">Russkiy</option>
      </select>
    </div>
  )
}`,
        description: 'Multi-context pattern — har bir concern alohida context. Foyda: til o\'zgarganda faqat useLang consumer-lari renderlanadi, tema consumer-lari RENDERLANMAYDI. Context-ni bo\'lish — performance uchun eng yaxshi yechim.',
      },
    ],
    interviewQA: [
      {
        question: 'Context vs Redux/Zustand — qachon nima ishlatish kerak?',
        answer: 'Context — kam o\'zgaradigan, keng tarqalgan ma\'lumot uchun (tema, til, auth). Redux/Zustand — tez-tez o\'zgaradigan, murakkab state uchun (server data, form state, UI state). Asosiy farq: Context value o\'zgarganda BARCHA consumer-lar renderlanadi, Redux/Zustand esa selector orqali faqat KERAKLI qismni kuzatadi. Shuning uchun input value yoki mouse position uchun Context ishlatish — performance muammo. Zustand bunday holatlarda 10x tezroq.',
      },
      {
        question: 'Context performance muammosi nima va qanday hal qilinadi?',
        answer: 'Muammo: Provider value o\'zgarganda BARCHA useContext(MyContext) ishlatgan komponentlar re-render bo\'ladi — hatto ular faqat value ning bir qismini ishlatsa ham. Yechimlar: 1) Context-ni bo\'lish — UserContext, ThemeContext alohida (eng samarali), 2) Provider value-ni useMemo bilan o\'rash — keraksiz re-render oldini olish, 3) memo bilan child-larni o\'rash — lekin Context o\'zgarsa memo yordam bermaydi, 4) Zustand/Redux-ga o\'tish — selector pattern bilan faqat kerakli qism kuzatiladi.',
      },
      {
        question: 'createContext defaultValue qachon ishlatiladi?',
        answer: 'defaultValue faqat bitta holatda ishlatiladi: komponent HECH QANDAY Provider ichida bo\'lmaganda. Ya\'ni Provider yo\'q bo\'lsa — defaultValue qaytariladi. Amalda bu juda kam bo\'ladi chunki odatda Provider App darajasida qo\'yiladi. Ko\'p dasturchilar defaultValue ga null beradi va custom hook ichida null check qiladi — Provider yo\'q bo\'lsa aniq xato xabari chiqaradi. Bu yondoshuv yaxshiroq chunki xato tezda topiladi.',
      },
      {
        question: 'Context nesting tartib muhimmi?',
        answer: 'Ha, nesting tartibi muhim. Ichki Provider tashqi Provider-ni override qiladi. Masalan: <ThemeContext.Provider value="dark"> ichida <ThemeContext.Provider value="light"> bo\'lsa — ichidagi komponentlar "light" oladi. Bu feature — tree ning bir qismi uchun boshqa qiymat berish mumkin. Lekin turli context-lar (ThemeContext, AuthContext) tartibi muhim emas — ular mustaqil. Faqat BIR XIL context nesting qilganda tartib ahamiyatli.',
      },
    ],
    relatedTopics: [
      { sectionId: 'state-management', topicId: 'context-api', label: 'Context API pattern' },
      { sectionId: 'theory-questions', topicId: 'props-drilling', label: 'Props Drilling muammosi' },
      { sectionId: 'state-management', topicId: 'when-to-use-what', label: 'Qachon nima ishlatish' },
      { sectionId: 'component-patterns', topicId: 'provider-pattern', label: 'Provider Pattern' },
    ],
  },
  {
    id: 'use-reducer',
    title: 'useReducer',
    importance: 2,
    status: 'to-learn' as const,
    description: 'Murakkab state logikasi action-lar bilan',
    content: `useReducer — murakkab state boshqaruvi uchun hook. Redux-ga o'xshash pattern — action dispatch qilasiz, reducer yangi state qaytaradi.

═══════════════════════════════════════
  SINTAKSIS
═══════════════════════════════════════

  const [state, dispatch] = useReducer(reducer, initialState)

- reducer — (state, action) => newState funksiya
- initialState — boshlang'ich state qiymati
- state — hozirgi state
- dispatch — action yuborish funksiyasi

Ixtiyoriy uchinchi argument — lazy initialization:
  const [state, dispatch] = useReducer(reducer, initialArg, init)
  // init(initialArg) — faqat birinchi renderda chaqiriladi

═══════════════════════════════════════
  REDUCER NIMA
═══════════════════════════════════════

Reducer — PURE FUNCTION:
- Kirish: (hozirgi state, action)
- Chiqish: yangi state
- State-ni TO'G'RIDAN-TO'G'RI o'zgartirmaydi
- DOIM yangi state QAYTARADI
- Side effect yo'q (API so'rov, console.log EMAS)

  function reducer(state: State, action: Action): State {
    switch (action.type) {
      case 'INCREMENT':
        return { ...state, count: state.count + 1 }
      case 'DECREMENT':
        return { ...state, count: state.count - 1 }
      case 'RESET':
        return { ...state, count: 0 }
      default:
        return state
    }
  }

MUHIM: reducer KOMPONENTDAN TASHQARIDA joylashishi kerak.
Chunki u pure function — komponent state-ga bog'liq emas.

═══════════════════════════════════════
  useState vs useReducer
═══════════════════════════════════════

useState ishlatish kerak:
  ✅ Oddiy qiymatlar (string, number, boolean)
  ✅ Mustaqil state-lar (bir-biriga bog'liq emas)
  ✅ Oddiy yangilash logikasi (set, toggle)

useReducer ishlatish kerak:
  ✅ Murakkab object state (ko'p field)
  ✅ Bir-biriga BOG'LIQ state-lar
  ✅ Ko'p turdagi yangilanishlar (action-lar)
  ✅ Yangilash logikasi murakkab (if/else, switch)
  ✅ Keyingi state oldingi state-ga bog'liq

Misol — form validation:
  useState bilan — 5-6 ta alohida state + murakkab mantiq
  useReducer bilan — 1 ta state + aniq action-lar

═══════════════════════════════════════
  REDUX BILAN O'XSHASHLIK
═══════════════════════════════════════

useReducer = Redux-ning LOCAL versiyasi:

  Redux pattern:
    store → dispatch(action) → reducer → new state → UI

  useReducer pattern:
    state → dispatch(action) → reducer → new state → re-render

FARQLAR:
- Redux — GLOBAL (butun app uchun bitta store)
- useReducer — LOCAL (faqat shu komponent uchun)
- Redux — middleware bor (thunk, saga)
- useReducer — middleware YO'Q
- Redux — DevTools bor
- useReducer — DevTools YO'Q (lekin yozish mumkin)

═══════════════════════════════════════
  useReducer + useContext
═══════════════════════════════════════

useReducer + useContext = mini Redux:

  // 1. Reducer va Context yaratish
  const AppContext = createContext(...)

  function AppProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, initialState)
    return (
      <AppContext.Provider value={{ state, dispatch }}>
        {children}
      </AppContext.Provider>
    )
  }

  // 2. Istalgan child-da ishlatish
  const { state, dispatch } = useContext(AppContext)
  dispatch({ type: 'ADD_TODO', payload: { text: 'Yangi' } })

Bu pattern KICHIK loyihalar uchun Redux o'rniga ishlaydi.
Lekin KATTA loyihalarda Redux/Zustand yaxshiroq:
- Performance (Context re-render muammosi)
- DevTools
- Middleware
- Ecosystem

═══════════════════════════════════════
  TYPESCRIPT BILAN
═══════════════════════════════════════

Discriminated union — eng kuchli TypeScript pattern:

  // Action tiplar — har biri aniq
  type Action =
    | { type: 'SET_NAME'; payload: string }
    | { type: 'SET_AGE'; payload: number }
    | { type: 'RESET' }

  // Reducer — TypeScript har case-ni tekshiradi
  function reducer(state: State, action: Action): State {
    switch (action.type) {
      case 'SET_NAME':
        // TypeScript biladi: action.payload — string
        return { ...state, name: action.payload }
      case 'SET_AGE':
        // TypeScript biladi: action.payload — number
        return { ...state, age: action.payload }
      case 'RESET':
        // TypeScript biladi: payload YO'Q
        return initialState
    }
  }

Discriminated union FOYDALARI:
- Har action uchun aniq payload tipi
- Noto'g'ri action type yozib bo'lmaydi
- IDE autocomplete ishlaydi
- switch exhaustive check mumkin`,
    codeExamples: [
      {
        title: 'Counter — INCREMENT, DECREMENT, RESET action-lar',
        language: 'tsx' as const,
        code: `import { useReducer } from 'react'

// 1. State va Action tiplari
interface CounterState {
  count: number
  step: number
}

type CounterAction =
  | { type: 'INCREMENT' }
  | { type: 'DECREMENT' }
  | { type: 'RESET' }
  | { type: 'SET_STEP'; payload: number }
  | { type: 'INCREMENT_BY'; payload: number }

// 2. Boshlang'ich state
const initialState: CounterState = { count: 0, step: 1 }

// 3. Reducer — pure function, komponentdan TASHQARIDA
function counterReducer(state: CounterState, action: CounterAction): CounterState {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, count: state.count + state.step }
    case 'DECREMENT':
      return { ...state, count: state.count - state.step }
    case 'RESET':
      return initialState
    case 'SET_STEP':
      return { ...state, step: action.payload }
    case 'INCREMENT_BY':
      return { ...state, count: state.count + action.payload }
    default:
      return state
  }
}

// 4. Komponent
function Counter() {
  const [state, dispatch] = useReducer(counterReducer, initialState)

  return (
    <div>
      <p>Hisob: {state.count} (qadam: {state.step})</p>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>+</button>
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>-</button>
      <button onClick={() => dispatch({ type: 'RESET' })}>Reset</button>
      <button onClick={() => dispatch({ type: 'INCREMENT_BY', payload: 10 })}>
        +10
      </button>
      <input
        type="number"
        value={state.step}
        onChange={e => dispatch({ type: 'SET_STEP', payload: Number(e.target.value) })}
      />
    </div>
  )
}`,
        description: 'Oddiy counter — lekin useReducer bilan. Ko\'p action-lar bo\'lganda useReducer aniqroq. dispatch({ type: \'INCREMENT\' }) — nima bo\'layotgani ANIQ ko\'rinadi. TypeScript discriminated union — har action uchun to\'g\'ri payload tipi.',
      },
      {
        title: 'Form state — murakkab form boshqaruvi (validation bilan)',
        language: 'tsx' as const,
        code: `import { useReducer } from 'react'

// State tipi
interface FormState {
  values: {
    name: string
    email: string
    password: string
  }
  errors: {
    name?: string
    email?: string
    password?: string
  }
  isSubmitting: boolean
  isValid: boolean
}

// Action tiplari
type FormAction =
  | { type: 'SET_FIELD'; field: keyof FormState['values']; value: string }
  | { type: 'SET_ERROR'; field: keyof FormState['errors']; error: string }
  | { type: 'CLEAR_ERRORS' }
  | { type: 'SUBMIT_START' }
  | { type: 'SUBMIT_SUCCESS' }
  | { type: 'SUBMIT_ERROR'; errors: FormState['errors'] }
  | { type: 'RESET' }

const initialState: FormState = {
  values: { name: '', email: '', password: '' },
  errors: {},
  isSubmitting: false,
  isValid: false,
}

function validate(values: FormState['values']): FormState['errors'] {
  const errors: FormState['errors'] = {}
  if (!values.name.trim()) errors.name = 'Ism kerak'
  if (!values.email.includes('@')) errors.email = 'Email noto\\'g\\'ri'
  if (values.password.length < 6) errors.password = 'Kamida 6 belgi'
  return errors
}

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'SET_FIELD': {
      const newValues = { ...state.values, [action.field]: action.value }
      const errors = validate(newValues)
      return {
        ...state,
        values: newValues,
        errors,
        isValid: Object.keys(errors).length === 0,
      }
    }
    case 'SET_ERROR':
      return { ...state, errors: { ...state.errors, [action.field]: action.error } }
    case 'CLEAR_ERRORS':
      return { ...state, errors: {} }
    case 'SUBMIT_START':
      return { ...state, isSubmitting: true }
    case 'SUBMIT_SUCCESS':
      return initialState
    case 'SUBMIT_ERROR':
      return { ...state, isSubmitting: false, errors: action.errors }
    case 'RESET':
      return initialState
    default:
      return state
  }
}

function RegistrationForm() {
  const [state, dispatch] = useReducer(formReducer, initialState)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!state.isValid) return

    dispatch({ type: 'SUBMIT_START' })
    try {
      await fetch('/api/register', {
        method: 'POST',
        body: JSON.stringify(state.values),
      })
      dispatch({ type: 'SUBMIT_SUCCESS' })
    } catch {
      dispatch({ type: 'SUBMIT_ERROR', errors: { name: 'Server xatosi' } })
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={state.values.name}
        onChange={e => dispatch({ type: 'SET_FIELD', field: 'name', value: e.target.value })}
        placeholder="Ism"
      />
      {state.errors.name && <span style={{ color: 'red' }}>{state.errors.name}</span>}

      <input
        value={state.values.email}
        onChange={e => dispatch({ type: 'SET_FIELD', field: 'email', value: e.target.value })}
        placeholder="Email"
      />
      {state.errors.email && <span style={{ color: 'red' }}>{state.errors.email}</span>}

      <input
        type="password"
        value={state.values.password}
        onChange={e => dispatch({ type: 'SET_FIELD', field: 'password', value: e.target.value })}
        placeholder="Parol"
      />
      {state.errors.password && <span style={{ color: 'red' }}>{state.errors.password}</span>}

      <button type="submit" disabled={!state.isValid || state.isSubmitting}>
        {state.isSubmitting ? 'Yuborilmoqda...' : 'Ro\\'yxatdan o\\'tish'}
      </button>
      <button type="button" onClick={() => dispatch({ type: 'RESET' })}>
        Tozalash
      </button>
    </form>
  )
}`,
        description: 'Murakkab form — useReducer ideal. values, errors, isSubmitting, isValid — barchasi bir state-da. Har bir action aniq: SET_FIELD, SUBMIT_START, SUBMIT_SUCCESS. useState bilan 6-7 ta alohida state kerak bo\'lardi.',
      },
      {
        title: 'useReducer + useContext — mini Redux',
        language: 'tsx' as const,
        code: `import { createContext, useContext, useReducer, type ReactNode } from 'react'

// ===== TIPLAR =====
interface Todo {
  id: number
  text: string
  done: boolean
}

interface TodoState {
  todos: Todo[]
  filter: 'all' | 'active' | 'done'
}

type TodoAction =
  | { type: 'ADD_TODO'; payload: string }
  | { type: 'TOGGLE_TODO'; payload: number }
  | { type: 'DELETE_TODO'; payload: number }
  | { type: 'SET_FILTER'; payload: TodoState['filter'] }
  | { type: 'CLEAR_DONE' }

// ===== REDUCER =====
const initialState: TodoState = {
  todos: [],
  filter: 'all',
}

function todoReducer(state: TodoState, action: TodoAction): TodoState {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        ...state,
        todos: [...state.todos, {
          id: Date.now(),
          text: action.payload,
          done: false,
        }],
      }
    case 'TOGGLE_TODO':
      return {
        ...state,
        todos: state.todos.map(t =>
          t.id === action.payload ? { ...t, done: !t.done } : t
        ),
      }
    case 'DELETE_TODO':
      return {
        ...state,
        todos: state.todos.filter(t => t.id !== action.payload),
      }
    case 'SET_FILTER':
      return { ...state, filter: action.payload }
    case 'CLEAR_DONE':
      return { ...state, todos: state.todos.filter(t => !t.done) }
    default:
      return state
  }
}

// ===== CONTEXT =====
interface TodoContextType {
  state: TodoState
  dispatch: React.Dispatch<TodoAction>
}

const TodoContext = createContext<TodoContextType | null>(null)

function useTodos() {
  const context = useContext(TodoContext)
  if (!context) throw new Error('TodoProvider kerak!')
  return context
}

function TodoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(todoReducer, initialState)
  return (
    <TodoContext.Provider value={{ state, dispatch }}>
      {children}
    </TodoContext.Provider>
  )
}

// ===== KOMPONENTLAR =====
function AddTodo() {
  const { dispatch } = useTodos()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const input = form.elements.namedItem('todo') as HTMLInputElement
    if (!input.value.trim()) return
    dispatch({ type: 'ADD_TODO', payload: input.value })
    input.value = ''
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="todo" placeholder="Yangi vazifa..." />
      <button type="submit">Qo'shish</button>
    </form>
  )
}

function TodoList() {
  const { state, dispatch } = useTodos()
  const filtered = state.todos.filter(t => {
    if (state.filter === 'active') return !t.done
    if (state.filter === 'done') return t.done
    return true
  })

  return (
    <div>
      <div>
        {(['all', 'active', 'done'] as const).map(f => (
          <button key={f} onClick={() => dispatch({ type: 'SET_FILTER', payload: f })}
            style={{ fontWeight: state.filter === f ? 'bold' : 'normal' }}>
            {f}
          </button>
        ))}
      </div>
      {filtered.map(todo => (
        <div key={todo.id}>
          <span
            style={{ textDecoration: todo.done ? 'line-through' : 'none' }}
            onClick={() => dispatch({ type: 'TOGGLE_TODO', payload: todo.id })}
          >
            {todo.text}
          </span>
          <button onClick={() => dispatch({ type: 'DELETE_TODO', payload: todo.id })}>
            x
          </button>
        </div>
      ))}
    </div>
  )
}

// ===== APP =====
function App() {
  return (
    <TodoProvider>
      <h1>Vazifalar</h1>
      <AddTodo />
      <TodoList />
    </TodoProvider>
  )
}`,
        description: 'useReducer + useContext = mini Redux. Global state — Context orqali uzatiladi, dispatch orqali boshqariladi. AddTodo va TodoList alohida komponentlar — lekin bir xil state-ga ega. Kichik-o\'rta loyihalar uchun Redux o\'rniga yetarli.',
      },
    ],
    interviewQA: [
      {
        question: 'useState vs useReducer — qachon nima ishlatish kerak?',
        answer: 'useState — oddiy, mustaqil qiymatlar: counter, toggle, input, boolean flag. useReducer — murakkab, bog\'liq state: form (values + errors + isSubmitting), todo list (items + filter), wizard (step + data + validation). Qoida: agar bitta event handler ichida 2-3 ta setState chaqirsangiz — useReducer-ga o\'tish vaqti kelgan. useReducer barcha logikani reducer-ga ajratadi — komponent toza qoladi, testing oson bo\'ladi.',
      },
      {
        question: 'Reducer pure function bo\'lishi nima uchun muhim?',
        answer: 'Pure function — bir xil kirish uchun DOIM bir xil natija qaytaradi va side effect yo\'q. Bu muhim chunki: 1) Predictable — har bir action uchun natija aniq, debug oson, 2) Testable — faqat input-output tekshirish yetarli, mock kerak emas, 3) React StrictMode reducer-ni 2 marta chaqirishi mumkin — pure bo\'lmasa natija buziladi, 4) Kelajakda React reducer-ni optimize qilishi mumkin (parallel execution). Side effect (API, console.log) reducer ICHIDA emas, useEffect yoki event handler-da bo\'lishi kerak.',
      },
      {
        question: 'useReducer + useContext vs Redux — farqi nima?',
        answer: 'useReducer + useContext — kichik loyihalar uchun yetarli: oddiy setup, qo\'shimcha kutubxona kerak emas. Lekin kamchiliklari: 1) Context re-render muammosi — value o\'zgarganda BARCHA consumer-lar renderlanadi, 2) Middleware yo\'q — async logic uchun qo\'shimcha kod kerak, 3) DevTools yo\'q — debug qiyinroq, 4) Selector yo\'q — kerakli qismni ajratib olish imkoni yo\'q. Redux/Zustand katta loyihalarda yaxshiroq: selector, middleware, DevTools, ecosystem. Qoida: 5-10 ta component — Context yetarli, 50+ component — Redux/Zustand.',
      },
      {
        question: 'Lazy initialization — useReducer(reducer, arg, init) nima?',
        answer: 'Uchinchi argument — init funksiya. useReducer(reducer, initialArg, init) bo\'lsa, boshlang\'ich state init(initialArg) natijasi bo\'ladi. Faqat BIRINCHI renderda chaqiriladi (lazy). Bu useState(() => value) ga o\'xshash. Qachon kerak: 1) Boshlang\'ich state hisoblash qimmat bo\'lsa (localStorage, complex calculation), 2) RESET action uchun — dispatch({ type: \'RESET\' }) da init(initialArg) qayta chaqiriladi. Misol: useReducer(reducer, userId, (id) => loadFromStorage(id)) — faqat 1 marta localStorage o\'qiladi.',
      },
    ],
    relatedTopics: [
      { sectionId: 'state-management', topicId: 'redux-toolkit', label: 'Redux Toolkit (o\'xshash pattern)' },
      { sectionId: 'state-management', topicId: 'when-to-use-what', label: 'useState vs useReducer' },
      { sectionId: 'react-core', topicId: 'use-context', label: 'useContext bilan birga' },
    ],
  },
  // ===== HOOKLAR (useLayoutEffect - useImperativeHandle) =====
  // TEMPORARY FILE — raw objects for 4 hooks (no imports, no exports, no array wrapper)

// ===== useLayoutEffect =====
{
    id: 'use-layout-effect',
    title: 'useLayoutEffect',
    importance: 2,
    status: 'to-learn' as const,
    description: 'DOM paint-dan OLDIN sinxron bajariladigan effect hook — o\'lcham hisoblash va miltillashsiz DOM o\'zgartirishlar uchun',
    content: `useLayoutEffect — useEffect bilan deyarli bir xil sintaksisga ega, lekin TIMING (bajarilish vaqti) butunlay boshqa. Bu hook DOM-ga yozilgandan keyin, lekin brauzer ekranga chizishdan (paint) OLDIN ishlaydi.

═══════════════════════════════════════
  SINTAKSIS
═══════════════════════════════════════

  useLayoutEffect(() => {
    // DOM bilan ishlash kodi
    return () => {
      // cleanup (ixtiyoriy)
    }
  }, [dependencies])

Sintaksis useEffect bilan 100% bir xil.
Farq faqat QACHON ishlashida.

═══════════════════════════════════════
  useEffect vs useLayoutEffect TIMING
═══════════════════════════════════════

  React RENDER SIKLI:
  1. React komponentni chaqiradi (render)
  2. React DOM-ni yangilaydi (commit)
  3. ▶ useLayoutEffect ISHLAYDI (sinxron)
  4. Brauzer ekranga chizadi (paint)
  5. ▶ useEffect ISHLAYDI (asinxron)

  useEffect — paint KEYIN (asinxron):
    Foydalanuvchi avval ESKi holatni ko\\'radi,
    keyin useEffect ishlaydi va yangi holat ko\\'rinadi.

  useLayoutEffect — paint OLDIDAN (sinxron):
    Foydalanuvchi FAQAT YANGI holatni ko\\'radi.
    DOM commit-dan keyin, paint-dan oldin ishlaydi.

═══════════════════════════════════════
  QACHON ISHLATISH
═══════════════════════════════════════

1. DOM o\\'lcham o\\'lchash (getBoundingClientRect)
   — element kengligi, balandligi, pozitsiyasini bilish

2. Scroll pozitsiya boshqarish
   — scroll-ni ma\\'lum joyga o\\'rnatish

3. Tooltip / Popover pozitsiya hisoblash
   — target elementga qarab tooltip qo\\'yish

4. Animatsiya boshlang\\'ich holati
   — animatsiya boshlanishidan oldin CSS qiymatlarini o\\'rnatish

═══════════════════════════════════════
  NIMA UCHUN ODDIY useEffect YETARLI EMAS
═══════════════════════════════════════

useEffect-da DOM o\\'zgartirsangiz "miltillash" (flicker) ko\\'rinadi:

  // useEffect bilan — MILTILLASH bor:
  useEffect(() => {
    ref.current.style.left = \\\`\${position}px\\\`
  }, [position])
  // Foydalanuvchi: eski pozitsiya -> paint -> yangi pozitsiya

  // useLayoutEffect bilan — MILTILLASH yo\\'q:
  useLayoutEffect(() => {
    ref.current.style.left = \\\`\${position}px\\\`
  }, [position])
  // Foydalanuvchi: faqat yangi pozitsiya ko\\'radi

Sabab: useEffect paint-dan KEYIN ishlaydi, shuning uchun
brauzer avval eski holatni chizib, keyin yangilaydi.
useLayoutEffect paint-dan OLDIN ishlaydi — faqat to\\'g\\'ri holat chiziladi.

═══════════════════════════════════════
  OGOHLANTIRISH
═══════════════════════════════════════

useLayoutEffect SINXRON ishlaydi:
- Agar sekin kod yozsangiz, paint BLOKLANADI
- Foydalanuvchi interfeysning "qotib qolganini" ko\\'radi
- Faqat DOM o\\'lchash/o\\'zgartirish uchun ishlatish kerak

NOTO\\'G\\'RI ishlatish:
  useLayoutEffect(() => {
    fetch('/api/data')  // ❌ Fetch — useEffect-da bo\\'lishi kerak
    setTimeout(...)      // ❌ Timer — useEffect-da bo\\'lishi kerak
  }, [])

TO\\'G\\'RI ishlatish:
  useLayoutEffect(() => {
    const rect = ref.current.getBoundingClientRect()  // ✅ DOM o\\'lchash
    setWidth(rect.width)
  }, [dependency])`,
    codeExamples: [
      {
        title: 'Tooltip pozitsiya hisoblash',
        language: 'tsx' as const,
        code: `import { useState, useRef, useLayoutEffect } from 'react'

interface TooltipProps {
  targetRef: React.RefObject<HTMLElement | null>
  children: React.ReactNode
}

function Tooltip({ targetRef, children }: TooltipProps) {
  const tooltipRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ top: 0, left: 0 })

  useLayoutEffect(() => {
    if (!targetRef.current || !tooltipRef.current) return

    const targetRect = targetRef.current.getBoundingClientRect()
    const tooltipRect = tooltipRef.current.getBoundingClientRect()

    // Tooltip-ni target USTIGA joylash
    setPosition({
      top: targetRect.top - tooltipRect.height - 8,
      left: targetRect.left + (targetRect.width - tooltipRect.width) / 2,
    })
    // useLayoutEffect-da qilganimiz uchun
    // foydalanuvchi noto'g'ri pozitsiyani KO'RMAYDI
  }, [targetRef])

  return (
    <div
      ref={tooltipRef}
      style={{
        position: 'fixed',
        top: position.top,
        left: position.left,
        background: '#333',
        color: 'white',
        padding: '4px 8px',
        borderRadius: 4,
      }}
    >
      {children}
    </div>
  )
}

// Ishlatish:
function App() {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <div>
      <button
        ref={buttonRef}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        Hover qiling
      </button>
      {showTooltip && (
        <Tooltip targetRef={buttonRef}>
          Bu tooltip matni
        </Tooltip>
      )}
    </div>
  )
}`,
        description: 'Tooltip pozitsiyasini target elementga qarab hisoblash. useLayoutEffect ishlatiladi chunki avval noto\'g\'ri pozitsiyada paydo bo\'lib, keyin sakrashi mumkin (flicker). useLayoutEffect bilan foydalanuvchi faqat to\'g\'ri pozitsiyani ko\'radi.',
      },
      {
        title: 'Element kengligi o\'lchash',
        language: 'tsx' as const,
        code: `import { useState, useRef, useLayoutEffect } from 'react'

function MeasuredBox() {
  const boxRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
  })

  useLayoutEffect(() => {
    if (!boxRef.current) return

    const rect = boxRef.current.getBoundingClientRect()
    setDimensions({
      width: Math.round(rect.width),
      height: Math.round(rect.height),
    })
  }) // dependency yo'q — har renderda o'lchaydi

  return (
    <div>
      <div
        ref={boxRef}
        style={{
          padding: '20px',
          background: '#e0e7ff',
          borderRadius: 8,
          resize: 'both',       // foydalanuvchi o'lchamini o'zgartirishi mumkin
          overflow: 'auto',
        }}
      >
        Bu qutini o'lchamini o'zgartiring!
        <br />
        Kenglik: {dimensions.width}px
        <br />
        Balandlik: {dimensions.height}px
      </div>
    </div>
  )
}

// Custom hook versiya:
function useElementSize(ref: React.RefObject<HTMLElement | null>) {
  const [size, setSize] = useState({ width: 0, height: 0 })

  useLayoutEffect(() => {
    if (!ref.current) return

    const observer = new ResizeObserver(([entry]) => {
      setSize({
        width: Math.round(entry.contentRect.width),
        height: Math.round(entry.contentRect.height),
      })
    })

    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [ref])

  return size
}`,
        description: 'Element o\'lchamlarini o\'lchab state-ga saqlash. useLayoutEffect paint-dan oldin ishlaydi, shuning uchun foydalanuvchi 0 qiymatlarni ko\'rmaydi. ResizeObserver bilan custom hook versiya ham ko\'rsatilgan.',
      },
    ],
    interviewQA: [
      {
        question: 'useEffect va useLayoutEffect o\'rtasidagi asosiy farq nima? Timing qanday?',
        answer: 'Asosiy farq BAJARILISH VAQTIDA. useEffect brauzer ekranga chizgandan (paint) KEYIN asinxron ishlaydi. useLayoutEffect esa DOM yangilangandan keyin, lekin paint-dan OLDIN sinxron ishlaydi. Siklda ko\'rsak: render -> DOM commit -> useLayoutEffect -> paint -> useEffect. Bu farq muhim chunki useLayoutEffect-da DOM o\'zgartirish qilsangiz foydalanuvchi faqat yakuniy natijani ko\'radi, useEffect-da esa avval eski holat ko\'rinib keyin yangilanadi (flicker/miltillash).',
      },
      {
        question: 'Qachon useLayoutEffect ishlatish SHART bo\'ladi? Misol bering.',
        answer: 'useLayoutEffect ishlatish SHART bo\'ladigan holatlar: 1) DOM element o\'lchamlarini o\'lchash (getBoundingClientRect) — masalan tooltip yoki dropdown pozitsiya hisoblash. 2) Scroll pozitsiyani o\'zgartirish — masalan yangi xabar kelganda pastga scroll qilish. 3) DOM-ni vizual o\'zgartirish — masalan element pozitsiyasi yoki o\'lchamini dinamik o\'rnatish. Bu holatlarda useEffect ishlatilsa "miltillash" ko\'rinadi, chunki brauzer avval eski holatni chizadi. useLayoutEffect esa paint-dan oldin o\'zgartiradi — foydalanuvchi faqat to\'g\'ri holatni ko\'radi.',
      },
      {
        question: 'SSR (Server-Side Rendering) da useLayoutEffect bilan qanday muammo bor?',
        answer: 'SSR da useLayoutEffect WARNING beradi chunki serverda brauzer DOM yo\'q — paint tushunchasi umuman mavjud emas. useLayoutEffect faqat client-da ishlaydi, serverda esa hech narsa qilmaydi va React console-da ogohlantirish chiqaradi. Yechim: SSR loyihalarda useLayoutEffect o\'rniga useEffect ishlatish kerak, yoki typeof window tekshiruvi qo\'yish. Next.js yoki Remix kabi SSR framework-larda bu ayniqsa muhim. Agar useLayoutEffect SHART bo\'lsa, uni faqat client-da ishlaydigan komponentga joylashtirish kerak ("use client" direktivasi bilan).',
      },
    ],
    relatedTopics: [
      { sectionId: 'react-core', topicId: 'use-effect', label: 'useEffect farqi' },
      { sectionId: 'theory-questions', topicId: 'effect-vs-layout-effect', label: 'Nazariy taqqoslash' },
      { sectionId: 'react-core', topicId: 'rendering-cycle', label: 'Rendering Cycle' },
    ],
},

// ===== useTransition =====
{
    id: 'use-transition',
    title: 'useTransition',
    importance: 2,
    status: 'to-learn' as const,
    description: 'Og\'ir state yangilanishlarni past prioritetli qilib, UI responsiv saqlash uchun React 18+ concurrent hook',
    content: `useTransition — React 18 da qo'shilgan concurrent hook. U og'ir (sekin) state yangilanishlarni PAST prioritetli qiladi, shunda UI responsiv (javob beradigan) qoladi.

═══════════════════════════════════════
  SINTAKSIS
═══════════════════════════════════════

  const [isPending, startTransition] = useTransition()

  - isPending: boolean — transition hali tugamaganmi?
  - startTransition: (callback) => void — past prioritetli yangilanish boshlash

═══════════════════════════════════════
  NIMA UCHUN KERAK
═══════════════════════════════════════

Muammo: Ba\\'zi state yangilanishlar OG\\'IR bo\\'lishi mumkin:
- Katta ro\\'yxatni filterlash (10,000+ element)
- Murakkab komponentni qayta renderlash
- Katta data-ni qayta hisoblash

Bu vaqtda UI "qotib qoladi" — foydalanuvchi boshqa
tugmalarni bosa olmaydi, input-ga yoza olmaydi.

Yechim: startTransition ichidagi setState PAST prioritetli.
React avval TEZKOR yangilanishlarni bajaradi (input, click),
keyin transition-ni.

═══════════════════════════════════════
  QANDAY ISHLAYDI
═══════════════════════════════════════

  function handleTabChange(tab: string) {
    setActiveTab(tab)                    // TEZKOR — darhol yangilanadi

    startTransition(() => {
      setTabContent(loadHeavyContent(tab)) // SEKIN — past prioritet
    })
  }

  1. setActiveTab — yuqori prioritet, darhol bajariladi
  2. startTransition ichidagi setTabContent — past prioritet
  3. React avval tab-ni o\\'zgartiradi
  4. Keyin content-ni yangilaydi
  5. Agar yangi tezkor yangilanish kelsa — transition-ni TO\\'XTATADI

═══════════════════════════════════════
  isPending — LOADING INDICATOR
═══════════════════════════════════════

isPending = true bo\\'ladi transition boshlanganidan to
tugagunicha. Bu vaqtda loading indicator ko\\'rsatish mumkin:

  {isPending && <Spinner />}
  {isPending ? <Skeleton /> : <Content />}

isPending UI-ni bloklaMASlik bilan loading holatini
ko\\'rsatish imkonini beradi.

═══════════════════════════════════════
  startTransition vs useDeferredValue
═══════════════════════════════════════

  startTransition — ACTION-ni kechiktiradi:
    Siz setState chaqiruvini o\\'zingiz wrap qilasiz.
    Qachon transition boshlashni SIZ hal qilasiz.

  useDeferredValue — QIYMAT-ni kechiktiradi:
    Tashqaridan kelgan value-ning eski versiyasini ushlab turadi.
    Props yoki boshqa qiymatlar uchun qulay.

  Qoida: Agar setState-ga kirishingiz bor — useTransition.
  Agar faqat value bor (props) — useDeferredValue.

═══════════════════════════════════════
  REACT 18 CONCURRENT FEATURE
═══════════════════════════════════════

useTransition — concurrent rendering-ning bir qismi:
- React ish-ni kichik BO\\'LAKLARGA bo\\'ladi
- Har bo\\'lak orasida foydalanuvchi interaksiyasini tekshiradi
- Agar yangi input/click bo\\'lsa — transition-ni TO\\'XTATIB,
  tezkor yangilanishni bajaradi
- Keyin transition-ni DAVOM ettiradi

Bu "time slicing" deyiladi — React vaqtni bo\\'laklarga bo\\'ladi.`,
    codeExamples: [
      {
        title: 'Tab almashtirish — isPending bilan loading',
        language: 'tsx' as const,
        code: `import { useState, useTransition } from 'react'

interface TabContentProps {
  tab: string
}

// Og'ir komponent — ko'p elementlarni renderlaydigan
function HeavyTabContent({ tab }: TabContentProps) {
  const items = Array.from({ length: 5000 }, (_, i) => (
    <div key={i} style={{ padding: '2px 0' }}>
      {tab} — element #{i + 1}
    </div>
  ))
  return <div>{items}</div>
}

function TabsExample() {
  const [activeTab, setActiveTab] = useState('tab1')
  const [contentTab, setContentTab] = useState('tab1')
  const [isPending, startTransition] = useTransition()

  const tabs = ['tab1', 'tab2', 'tab3']

  function handleTabClick(tab: string) {
    // TEZKOR — tab darhol active bo'ladi
    setActiveTab(tab)

    // SEKIN — content past prioritetda yangilanadi
    startTransition(() => {
      setContentTab(tab)
    })
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => handleTabClick(tab)}
            style={{
              padding: '8px 16px',
              background: activeTab === tab ? '#3b82f6' : '#e5e7eb',
              color: activeTab === tab ? 'white' : 'black',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
            }}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* isPending — transition davom etyapti */}
      <div style={{ opacity: isPending ? 0.5 : 1, transition: 'opacity 0.2s' }}>
        {isPending && <p>Yuklanmoqda...</p>}
        <HeavyTabContent tab={contentTab} />
      </div>
    </div>
  )
}`,
        description: 'Tab bosilganda activeTab darhol o\'zgaradi (tezkor), lekin og\'ir content past prioritetda yangilanadi. isPending=true bo\'lganda opacity 0.5 va "Yuklanmoqda..." ko\'rsatiladi. Foydalanuvchi boshqa tab-larga bosishi mumkin — UI qotmaydi.',
      },
      {
        title: 'Katta ro\'yxat filterlash — input tezkor, list transition',
        language: 'tsx' as const,
        code: `import { useState, useTransition, useMemo } from 'react'

// 10,000 ta mahsulot generatsiya qilish
const allProducts = Array.from({ length: 10000 }, (_, i) => ({
  id: i + 1,
  name: \\\`Mahsulot #\${i + 1}\\\`,
  category: ['Elektronika', 'Kiyim', 'Oziq-ovqat', 'Kitob'][i % 4],
  price: Math.round(Math.random() * 100000) / 100,
}))

function ProductFilter() {
  const [query, setQuery] = useState('')
  const [filterQuery, setFilterQuery] = useState('')
  const [isPending, startTransition] = useTransition()

  // Og'ir filterlash — faqat filterQuery o'zgarganda ishlaydi
  const filteredProducts = useMemo(() => {
    if (!filterQuery) return allProducts.slice(0, 100)
    return allProducts.filter(p =>
      p.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(filterQuery.toLowerCase())
    )
  }, [filterQuery])

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value

    // TEZKOR — input darhol yangilanadi
    setQuery(value)

    // SEKIN — filterlash past prioritetda
    startTransition(() => {
      setFilterQuery(value)
    })
  }

  return (
    <div style={{ padding: 16 }}>
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Mahsulot qidiring..."
        style={{ padding: '8px 12px', width: 300, fontSize: 16 }}
      />

      {isPending && (
        <p style={{ color: '#6b7280' }}>Qidirilmoqda...</p>
      )}

      <p>{filteredProducts.length} ta natija</p>

      <div style={{ maxHeight: 400, overflow: 'auto' }}>
        {filteredProducts.map(p => (
          <div key={p.id} style={{ padding: '4px 0', borderBottom: '1px solid #eee' }}>
            {p.name} — {p.category} — {p.price} so'm
          </div>
        ))}
      </div>
    </div>
  )
}`,
        description: 'Input-ga yozganda query darhol yangilanadi (input responsive), lekin 10,000 ta mahsulotni filterlash startTransition ichida past prioritetda bajariladi. Foydalanuvchi input-ga tez yoza oladi, UI qotmaydi.',
      },
    ],
    interviewQA: [
      {
        question: 'useTransition nima uchun kerak? Oddiy setState-dan farqi nima?',
        answer: 'useTransition og\'ir (sekin) state yangilanishlarni past prioritetli qilish uchun kerak. Oddiy setState-da barcha yangilanishlar bir xil prioritetda — agar bittasi sekin bo\'lsa, UI qotib qoladi. useTransition bilan siz setState-ni startTransition ichiga o\'raysiz va React uni past prioritetli deb belgilaydi. Natijada React avval tezkor yangilanishlarni (input yozish, tugma bosish) bajaradi, keyin sekin transition-ni. Agar yangi tezkor yangilanish kelsa, React transition-ni to\'xtatib, avval tezkor ishni bajaradi.',
      },
      {
        question: 'isPending qanday ishlatiladi? Nima uchun kerak?',
        answer: 'isPending — useTransition qaytaradigan boolean qiymat. U transition boshlanganidan to tugaguncha true bo\'ladi. isPending yordamida foydalanuvchiga "ish bajarilmoqda" deb ko\'rsatish mumkin: loading spinner, skeleton, opacity kamaytirish, "Yuklanmoqda..." matni. Masalan: {isPending && <Spinner />} yoki style={{ opacity: isPending ? 0.5 : 1 }}. isPending muhim chunki u UI-ni bloklaMASdan foydalanuvchiga feedback beradi — yangilanish ketayotganini bildiradi.',
      },
      {
        question: 'useTransition va useDeferredValue o\'rtasidagi farq nima? Qachon qaysi birini ishlatish kerak?',
        answer: 'Asosiy farq: useTransition ACTION-ni (setState chaqiruvi) kechiktiradi, useDeferredValue esa QIYMAT-ni kechiktiradi. useTransition-da siz startTransition ichiga setState-ni o\'zingiz o\'raysiz — setState-ga to\'g\'ridan-to\'g\'ri kirishingiz bor. useDeferredValue-da esa tashqaridan kelgan value-ning (masalan props) eski versiyasini vaqtincha ushlab turadi. Qoida: agar setState-ga kirishingiz bor — useTransition, agar faqat props yoki boshqa qiymatni kechiktirish kerak — useDeferredValue. Ikkalasi ham React 18 concurrent feature.',
      },
    ],
    relatedTopics: [
      { sectionId: 'react-core', topicId: 'use-deferred-value', label: 'useDeferredValue' },
      { sectionId: 'theory-questions', topicId: 'concurrent-mode', label: 'Concurrent Features' },
      { sectionId: 'performance', topicId: 're-render-causes', label: 'Re-render prioritetlari' },
    ],
},

// ===== useDeferredValue =====
{
    id: 'use-deferred-value',
    title: 'useDeferredValue',
    importance: 2,
    status: 'to-learn' as const,
    description: 'Qiymat yangilanishini kechiktirish uchun concurrent hook — tezkor UI bilan og\'ir hisoblashni ajratadi',
    content: `useDeferredValue — React 18 da qo'shilgan concurrent hook. U qiymat yangilanishini kechiktiradi: asl qiymat o'zgarganda, deferred versiya "keyinroq" yangilanadi.

═══════════════════════════════════════
  SINTAKSIS
═══════════════════════════════════════

  const deferredValue = useDeferredValue(value)

  - value — kechiktirmoqchi bo\\'lgan qiymat (state, props, yoki boshqa)
  - deferredValue — value-ning "kechiktirilgan" versiyasi

  Birinchi renderda deferredValue = value (bir xil).
  Keyingi yangilanishlarda deferredValue eski qiymatni ushlab turadi,
  yangi qiymat past prioritetda yangilanadi.

═══════════════════════════════════════
  NIMA UCHUN KERAK
═══════════════════════════════════════

Muammo: Input-ga yozganda har harf uchun og\\'ir hisoblash
bo\\'lsa (filterlash, rendering), UI sekinlashadi.

Yechim: Input TEZDA yangilanadi, lekin og\\'ir qism
KECHIKTIRILGAN qiymat bilan ishlaydi.

  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)

  // query — input-da ko\\'rinadigan (tezkor)
  // deferredQuery — filterlash uchun (kechiktirilgan)

═══════════════════════════════════════
  QANDAY ISHLAYDI
═══════════════════════════════════════

  1. query o\\'zgaradi: 'a' -> 'ab' -> 'abc'
  2. React har safar avval TEZKOR yangilanishlarni qiladi
  3. Keyin deferredQuery-ni yangilaydi
  4. Agar yangi tezkor yangilanish kelsa —
     deferred yangilanishni TO\\'XTATADI
  5. Faqat foydalanuvchi to\\'xtab turganda
     deferred to\\'liq yangilanadi

  Vaqt chizig\\'i:
  query:         'a' → 'ab' → 'abc'  (DARHOL)
  deferredQuery: 'a' →  'a' → 'abc'  ('ab' ni O\\'TKAZIB yuboradi)

═══════════════════════════════════════
  ASOSIY USE CASE
═══════════════════════════════════════

Search input + natijalar ro\\'yxati:
- Input tezda yangilanadi (foydalanuvchi erkin yozadi)
- Natijalar ro\\'yxati kechiktirilgan qiymat bilan ishlaydi
- Og\\'ir rendering foydalanuvchini TO\\'SLAMAYDI

═══════════════════════════════════════
  useTransition vs useDeferredValue
═══════════════════════════════════════

  useTransition:
    - setState-ni O\\'ZINGIZ wrap qilasiz
    - Action-ni kechiktiradi
    - isPending bor
    - setState-ga to\\'g\\'ridan-to\\'g\\'ri kirish bor

  useDeferredValue:
    - Tashqaridan kelgan VALUE-ni kechiktiradi
    - Props yoki boshqa qiymatlar uchun
    - isPending YO\\'Q (lekin value !== deferredValue tekshirish mumkin)
    - setState-ga kirish shart emas

═══════════════════════════════════════
  DEBOUNCE BILAN TAQQOSLASH
═══════════════════════════════════════

  Debounce:
    - Belgilangan vaqt kutadi (masalan 300ms)
    - Qurilma tezligidan qat\\'iy nazar DOIM kutadi
    - Tezkor qurilmada ham 300ms kutadi — bekorga

  useDeferredValue:
    - React O\\'ZI boshqaradi
    - Qurilma tezligiga MOSLANADI
    - Tezkor qurilmada deyarli darhol
    - Sekin qurilmada ko\\'proq kechiktiradi
    - Vaqtni BELGILASH shart emas`,
    codeExamples: [
      {
        title: 'Search input + natijalar — input tezkor, natijalar deferred',
        language: 'tsx' as const,
        code: `import { useState, useDeferredValue, useMemo } from 'react'

// Katta ma'lumotlar bazasi
const database = Array.from({ length: 10000 }, (_, i) => ({
  id: i + 1,
  title: \\\`Maqola #\${i + 1}: \${['React', 'TypeScript', 'JavaScript', 'Node.js', 'CSS'][i % 5]} bo\\'yicha\\\`,
}))

function SearchResults({ query }: { query: string }) {
  // Og'ir filterlash
  const results = useMemo(() => {
    if (!query.trim()) return []
    return database.filter(item =>
      item.title.toLowerCase().includes(query.toLowerCase())
    )
  }, [query])

  return (
    <div>
      <p style={{ color: '#6b7280' }}>{results.length} ta natija</p>
      <ul style={{ maxHeight: 300, overflow: 'auto' }}>
        {results.slice(0, 200).map(item => (
          <li key={item.id} style={{ padding: '4px 0' }}>
            {item.title}
          </li>
        ))}
      </ul>
    </div>
  )
}

function SearchPage() {
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)

  // query !== deferredQuery — yangilanish davom etyapti
  const isStale = query !== deferredQuery

  return (
    <div style={{ padding: 16 }}>
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Qidirish..."
        style={{ padding: '8px 12px', width: 300, fontSize: 16 }}
      />

      {/* Natijalar kechiktirilgan qiymat bilan ishlaydi */}
      <div style={{
        opacity: isStale ? 0.6 : 1,
        transition: 'opacity 0.15s',
      }}>
        <SearchResults query={deferredQuery} />
      </div>
    </div>
  )
}`,
        description: 'Input-ga yozganda query darhol yangilanadi — input responsive. Lekin SearchResults komponenti deferredQuery bilan ishlaydi — kechiktirilgan. query !== deferredQuery bo\'lganda natijalar xiralashadi (opacity 0.6) — yangilanish davom etyaptini ko\'rsatadi.',
      },
      {
        title: 'Og\'ir komponent lazy yangilanish',
        language: 'tsx' as const,
        code: `import { useState, useDeferredValue, memo } from 'react'

// Og'ir komponent — ko'p elementlarni chizadi
const HeavyChart = memo(function HeavyChart({ value }: { value: number }) {
  // Simulatsiya: og'ir rendering
  const bars = Array.from({ length: 500 }, (_, i) => {
    const height = Math.sin((i + value) * 0.1) * 50 + 50
    return (
      <div
        key={i}
        style={{
          display: 'inline-block',
          width: 2,
          height,
          background: \\\`hsl(\${(i + value) % 360}, 70%, 50%)\\\`,
          marginRight: 1,
        }}
      />
    )
  })

  return (
    <div style={{ overflow: 'hidden', height: 120 }}>
      {bars}
    </div>
  )
})

function SliderWithChart() {
  const [value, setValue] = useState(0)
  const deferredValue = useDeferredValue(value)

  const isStale = value !== deferredValue

  return (
    <div style={{ padding: 16 }}>
      <input
        type="range"
        min={0}
        max={1000}
        value={value}
        onChange={e => setValue(Number(e.target.value))}
        style={{ width: '100%' }}
      />
      <p>Hozirgi qiymat: {value}</p>

      {/* Chart kechiktirilgan qiymat bilan ishlaydi */}
      <div style={{ opacity: isStale ? 0.7 : 1 }}>
        <HeavyChart value={deferredValue} />
      </div>
    </div>
  )
}`,
        description: 'Slider tezda harakatlanadi (value darhol yangilanadi), lekin og\'ir HeavyChart komponenti deferredValue bilan ishlaydi. memo bilan o\'ralgan — faqat deferredValue o\'zgarganda qayta renderlanadi. Slider silliq ishlaydi, chart "keyinroq" yangilanadi.',
      },
    ],
    interviewQA: [
      {
        question: 'useDeferredValue qanday ishlaydi? Ichki mexanizmi qanday?',
        answer: 'useDeferredValue qiymatning "kechiktirilgan" versiyasini yaratadi. Asl qiymat o\'zgarganda, React avval barcha tezkor (yuqori prioritetli) yangilanishlarni bajaradi — input, click va boshqalar. Keyin deferred qiymatni past prioritetda yangilaydi. Agar yangi tezkor yangilanish kelsa, React deferred yangilanishni TO\'XTATADI va avval tezkor ishni bajaradi. Bu concurrent rendering-ning bir qismi — React ish-ni bo\'laklarga bo\'lib bajaradi va foydalanuvchi interaksiyasiga doim javob beradi.',
      },
      {
        question: 'Debounce va useDeferredValue o\'rtasidagi farq nima? Qaysi biri yaxshiroq?',
        answer: 'Debounce belgilangan vaqt kutadi (masalan 300ms) — qurilma tezligidan qat\'iy nazar DOIM kutadi. Tezkor qurilmada ham 300ms kutadi, bu bekorga kechikish. useDeferredValue esa React tomonidan boshqariladi va qurilma tezligiga moslanadi: tezkor qurilmada deyarli darhol yangilanadi, sekin qurilmada ko\'proq kechiktiradi. Bundan tashqari useDeferredValue concurrent rendering bilan integratsiyalangan — React ish-ni bo\'laklaydi va foydalanuvchi interaksiyasini uzmasdan bajaradi. Debounce esa oddiy timer — React rendering siklidan xabarsiz.',
      },
      {
        question: 'Qachon useTransition, qachon useDeferredValue ishlatish kerak?',
        answer: 'Qoida oddiy: agar siz setState-ni chaqirayotgan bo\'lsangiz va unga to\'g\'ridan-to\'g\'ri kirishingiz bor — useTransition ishlatish yaxshiroq, chunki startTransition ichiga setState-ni wrap qilasiz va isPending ham olasiz. Agar esa value tashqaridan kelsa (props, context) va siz setState-ni chaqirmayapsiz — useDeferredValue ishlatish kerak. Masalan: child komponent props orqali query olsa, u useDeferredValue ishlatadi. Parent komponent esa o\'zining setState-ini useTransition bilan wrap qilishi mumkin.',
      },
    ],
    relatedTopics: [
      { sectionId: 'react-core', topicId: 'use-transition', label: 'useTransition' },
      { sectionId: 'performance', topicId: 'debounce-throttle', label: 'Debounce/Throttle bilan taqqoslash' },
      { sectionId: 'theory-questions', topicId: 'concurrent-mode', label: 'Concurrent Features' },
    ],
},

// ===== useImperativeHandle =====
{
    id: 'use-imperative-handle',
    title: 'useImperativeHandle',
    importance: 2,
    status: 'to-learn' as const,
    description: 'Parent komponentga child-ning custom API-sini ochish uchun hook — forwardRef bilan birga ishlatiladi',
    content: `useImperativeHandle — parent komponentga child komponentning ichki funksiyalarini (API) ochish uchun ishlatiladi. forwardRef bilan birga keladi.

═══════════════════════════════════════
  SINTAKSIS
═══════════════════════════════════════

  useImperativeHandle(ref, () => ({
    // parent ko\\'ra oladigan metodlar
    focus() { ... },
    clear() { ... },
    scrollTo(pos: number) { ... },
  }), [dependencies])

  - ref — forwardRef orqali olingan ref
  - createHandle — parent-ga beriladigan API object
  - dependencies — qachon API yangilanishi kerak (ixtiyoriy)

═══════════════════════════════════════
  NIMA UCHUN KERAK
═══════════════════════════════════════

Odatda React-da ma\\'lumot YUQORIDAN PASTGA oqadi (props).
Lekin ba\\'zan parent child-ning ICHKI funksiyalarini chaqirishi kerak:

  - Input-ga focus berish
  - Modal-ni ochish/yopish
  - Scroll pozitsiyani o\\'zgartirish
  - Form-ni reset qilish
  - Animatsiyani boshlash

Bu holatlarda parent ref orqali child-ga murojaat qiladi.
useImperativeHandle esa child-ning QAYSI funksiyalarini
parent ko\\'rishini NAZORAT QILADI.

═══════════════════════════════════════
  forwardRef BILAN BIRGA
═══════════════════════════════════════

React 19 da ref oddiy prop sifatida keladi,
lekin oldingi versiyalarda forwardRef SHART edi:

  // React 19+ — ref oddiy prop:
  function MyInput({ ref, ...props }) {
    useImperativeHandle(ref, () => ({
      focus() { inputRef.current?.focus() },
    }))
    // ...
  }

  // React 18 va oldin — forwardRef kerak:
  const MyInput = forwardRef(function MyInput(props, ref) {
    useImperativeHandle(ref, () => ({
      focus() { inputRef.current?.focus() },
    }))
    // ...
  })

═══════════════════════════════════════
  QACHON ISHLATILADI
═══════════════════════════════════════

1. Custom input komponent — focus(), clear(), select()
2. Modal komponent — open(), close()
3. Scroll container — scrollTo(), scrollToTop()
4. Video/Audio player — play(), pause(), seek()
5. Form komponent — reset(), validate(), submit()

═══════════════════════════════════════
  OGOHLANTIRISH
═══════════════════════════════════════

useImperativeHandle-ni ko\\'p ishlatMANG:
- React-da asosiy pattern: PROPS orqali boshqarish
- ref + useImperativeHandle — faqat IMPERATIVE amallar uchun
  (focus, scroll, animatsiya)
- Agar props bilan qilib bo\\'lsa — props ishlatish yaxshiroq
- Bu hook "escape hatch" — oddiy emas, MAXSUS holat uchun`,
    codeExamples: [
      {
        title: 'Custom input — focus/clear metodlarini parent-ga ochish',
        language: 'tsx' as const,
        code: `import { useState, useRef, useImperativeHandle, forwardRef } from 'react'

// Custom input API turi
interface CustomInputHandle {
  focus: () => void
  clear: () => void
  getValue: () => string
  select: () => void
}

// Custom input komponenti
const CustomInput = forwardRef<CustomInputHandle, { placeholder?: string }>(
  function CustomInput({ placeholder }, ref) {
    const inputRef = useRef<HTMLInputElement>(null)
    const [value, setValue] = useState('')

    // Parent-ga faqat KERAKLI metodlarni ochamiz
    useImperativeHandle(ref, () => ({
      focus() {
        inputRef.current?.focus()
      },
      clear() {
        setValue('')
        inputRef.current?.focus()
      },
      getValue() {
        return value
      },
      select() {
        inputRef.current?.select()
      },
    }), [value]) // value o'zgarganda API yangilanadi

    return (
      <input
        ref={inputRef}
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder={placeholder}
        style={{
          padding: '8px 12px',
          border: '2px solid #d1d5db',
          borderRadius: 8,
          fontSize: 16,
          outline: 'none',
        }}
      />
    )
  }
)

// Parent komponent — child-ning API-sini ishlatadi
function SearchForm() {
  const inputRef = useRef<CustomInputHandle>(null)

  function handleSearch() {
    const value = inputRef.current?.getValue()
    if (value) {
      alert(\\\`Qidirilmoqda: \${value}\\\`)
    } else {
      inputRef.current?.focus()
    }
  }

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <CustomInput ref={inputRef} placeholder="Qidirish..." />
      <button onClick={handleSearch}>Qidirish</button>
      <button onClick={() => inputRef.current?.clear()}>Tozalash</button>
      <button onClick={() => inputRef.current?.select()}>Tanlash</button>
    </div>
  )
}`,
        description: 'CustomInput komponenti useImperativeHandle orqali parent-ga focus, clear, getValue, select metodlarini ochadi. Parent bu metodlarni ref orqali chaqiradi. Ichki input ref va state parent-ga ko\'rinMAYDI — faqat ochilgan API ko\'rinadi.',
      },
    ],
    interviewQA: [
      {
        question: 'useImperativeHandle nima uchun kerak? Qachon ishlatiladi?',
        answer: 'useImperativeHandle parent komponentga child-ning ichki funksiyalarini (API) ochish uchun kerak. React-da asosan ma\'lumot yuqoridan pastga oqadi (props), lekin ba\'zan parent child-ning IMPERATIVE amallarini chaqirishi kerak: input-ga focus berish, modal ochish/yopish, scroll pozitsiya o\'zgartirish. Bu holatlarda child useImperativeHandle bilan maxsus API ochadi va parent ref orqali bu API-ga murojaat qiladi. Bu hook forwardRef bilan birga ishlatiladi (React 19-da ref oddiy prop bo\'lishi ham mumkin).',
      },
      {
        question: 'useImperativeHandle va oddiy ref forwarding o\'rtasidagi farq nima?',
        answer: 'Oddiy ref forwarding-da parent child-ning DOM elementiga TO\'LIQDAN-TO\'LIQ kirish oladi — barcha DOM metodlari va xossalari ochiq. Bu xavfli bo\'lishi mumkin chunki parent child-ning ichki DOM-ini o\'zgartirishi mumkin. useImperativeHandle esa parent-ga faqat SIZ tanlagan metodlarni ochadi — bu "controlled API" yaratadi. Masalan input uchun faqat focus() va clear() ochib, boshqa hamma narsani yashirish mumkin. Bu encapsulation printsipi — child o\'z ichki implementatsiyasini himoya qiladi.',
      },
    ],
    relatedTopics: [
      { sectionId: 'react-core', topicId: 'react-memo', label: 'forwardRef' },
      { sectionId: 'react-core', topicId: 'use-ref', label: 'useRef' },
    ],
},
  // ===== ARXITEKTURA, KONSEPTLAR, QOLGAN HOOKLAR =====
  // ═══════════════════════════════════════
//   VIRTUAL DOM & RECONCILIATION
// ═══════════════════════════════════════
{
    id: 'virtual-dom',
    title: 'Virtual DOM & Reconciliation',
    importance: 3,
    status: 'to-learn' as const,
    description: 'Virtual DOM tushunchasi, diffing algoritmi va reconciliation jarayoni',
    content: `Virtual DOM — React-ning eng muhim tushunchalaridan biri. U React-ni tez va samarali qiladi.

═══════════════════════════════════════
  VIRTUAL DOM NIMA
═══════════════════════════════════════

Virtual DOM — bu JavaScript object bo\\'lib, haqiqiy DOM-ning yengil nusxasi hisoblanadi.
React bu object-ni xotirada saqlaydi va u bilan ishlaydi.

Oddiy qilib aytganda:
- Haqiqiy DOM = brauzer ko\\'rsatadigan HTML daraxti
- Virtual DOM = JavaScript-da saqlangan o\\'sha daraxtning NUSXASI (copy)

Misol:
<div class="card">
  <h1>Salom</h1>
  <p>Matn</p>
</div>

Virtual DOM-da bu shunday ko\\'rinadi:
{
  type: \\'div\\',
  props: { className: \\'card\\' },
  children: [
    { type: \\'h1\\', props: {}, children: [\\'Salom\\'] },
    { type: \\'p\\', props: {}, children: [\\'Matn\\'] }
  ]
}

═══════════════════════════════════════
  NIMA UCHUN KERAK
═══════════════════════════════════════

Haqiqiy DOM bilan ishlash SEKIN:
- Har bir o\\'zgarishda brauzer REFLOW (layout qayta hisoblash) va REPAINT (qayta chizish) qiladi
- Bu ayniqsa ko\\'p elementli sahifalarda og\\'ir bo\\'ladi

Virtual DOM bilan ishlash TEZROQ:
- JavaScript object-da o\\'zgarish qilish — juda tez
- React faqat FARQNI (diff) haqiqiy DOM-ga qo\\'llaydi
- Minimal DOM operatsiyalari = maximum tezlik

═══════════════════════════════════════
  RECONCILIATION (SOLISHTIRISH)
═══════════════════════════════════════

State o\\'zgarganda React quyidagilarni qiladi:

1. Yangi Virtual DOM yaratadi (yangi state asosida)
2. Eski Virtual DOM bilan TAQQOSLAYDI (diffing)
3. Faqat FARQLARNI haqiqiy DOM-ga yozadi

Bu jarayon RECONCILIATION deyiladi.

Masalan:
- Eski: <h1>Salom</h1>
- Yangi: <h1>Xayr</h1>
- React faqat matn node-ni o\\'zgartiradi, h1 elementni qaytadan yaratmaydi

═══════════════════════════════════════
  DIFFING ALGORITHM
═══════════════════════════════════════

React-ning diffing algoritmi O(n) murakkablikda ishlaydi.
(Oddiy daraxt solishtirish — O(n^3), bu juda sekin bo\\'lardi)

React 2 ta TAXMIN (heuristic) ishlatadi:

1. BOSHQA TIP = BUTUN SUBTREE QAYTA YARATILADI
   - <div> dan <span> ga o\\'zgarsa — eski daraxt o\\'chiriladi, yangi yaratiladi
   - <ComponentA> dan <ComponentB> ga o\\'zgarsa — ham shunday

2. KEY PROP — ro\\'yxatda elementlarni aniqlash
   - key orqali React qaysi element qaysi ekanligini biladi
   - key bilan React elementni QAYTA ISHLATADI, key-siz QAYTA YARATADI

═══════════════════════════════════════
  KEY PROP ROLI
═══════════════════════════════════════

key — React-ga ro\\'yxatda qaysi element qaysi ekanligini aytadi.

KEY YO\\'Q holat:
- React index bo\\'yicha taqqoslaydi
- Tartib o\\'zgarsa — XATO yangilanadi (input qiymatlari aralashadi)

KEY BOR holat:
- React har bir elementni key bo\\'yicha topadi
- Tartib o\\'zgarsa ham TO\\'G\\'RI yangilanadi

QOIDA: key UNIKAL va BARQAROR bo\\'lishi kerak.
- id ishlatish — TO\\'G\\'RI
- index ishlatish — ko\\'p hollarda XATO (tartib o\\'zgarsa)
- Math.random() — HAR DOIM XATO (har renderda yangi key = har renderda qayta yaratiladi)

═══════════════════════════════════════
  FIBER ARXITEKTURA
═══════════════════════════════════════

React 16+ da Fiber arxitektura joriy etildi.

ESKI (Stack Reconciler):
- Rendering bir martalik — boshlangan bo\\'lsa to\\'xtab bo\\'lmaydi
- Og\\'ir komponentlar brauzer-ni "muzlatadi"

YANGI (Fiber Reconciler):
- Rendering ish-ni kichik bo\\'laklarga bo\\'ladi
- To\\'xtatib, davom ettirishi mumkin
- Muhimroq ishlarni (masalan, foydalanuvchi inputi) oldin bajaradi

Bu CONCURRENT RENDERING-ning asosi:
- useTransition, useDeferredValue — shu tufayli mumkin
- Brauzer hech qachon "qotib" qolmaydi`,
    codeExamples: [
        {
            title: 'Key prop ahamiyati',
            language: 'tsx' as const,
            code: `import { useState } from 'react'

// ❌ NOTO'G'RI — index key sifatida
function BadList() {
  const [items, setItems] = useState(['Olma', 'Nok', 'Uzum'])

  const addToStart = () => {
    setItems(['Banan', ...items])
  }

  return (
    <div>
      <button onClick={addToStart}>Boshiga qo'shish</button>
      {items.map((item, index) => (
        // index key = tartib o'zgarsa input qiymatlari aralashadi!
        <div key={index}>
          <span>{item}</span>
          <input placeholder="Narx kiriting" />
        </div>
      ))}
    </div>
  )
}

// ✅ TO'G'RI — unikal id key sifatida
function GoodList() {
  const [items, setItems] = useState([
    { id: 1, name: 'Olma' },
    { id: 2, name: 'Nok' },
    { id: 3, name: 'Uzum' },
  ])

  const addToStart = () => {
    setItems([{ id: Date.now(), name: 'Banan' }, ...items])
  }

  return (
    <div>
      <button onClick={addToStart}>Boshiga qo'shish</button>
      {items.map((item) => (
        // Unikal id = tartib o'zgarsa ham input to'g'ri qoladi
        <div key={item.id}>
          <span>{item.name}</span>
          <input placeholder="Narx kiriting" />
        </div>
      ))}
    </div>
  )
}`,
            description: 'index key ishlatilganda tartib o\'zgarsa input qiymatlari aralashib ketadi. Unikal id key ishlatilsa — React har elementni to\'g\'ri kuzatadi.',
        },
        {
            title: 'Reconciliation — tip o\'zgarganda',
            language: 'tsx' as const,
            code: `import { useState } from 'react'

// React bir xil tip bo'lsa — YANGILAYDI
// Boshqa tip bo'lsa — O'CHIRIB QAYTA YARATADI

function ReconciliationDemo() {
  const [isAdmin, setIsAdmin] = useState(false)

  return (
    <div>
      <button onClick={() => setIsAdmin(!isAdmin)}>
        Rolni almashtirish
      </button>

      {/*
        1-holat: Bir xil tip — React faqat props-ni yangilaydi
        Input ichidagi matn SAQLANADI
      */}
      {isAdmin ? (
        <input placeholder="Admin qidiruv" style={{ border: '2px solid red' }} />
      ) : (
        <input placeholder="Oddiy qidiruv" style={{ border: '2px solid blue' }} />
      )}

      {/*
        2-holat: Boshqa tip — React butun subtree-ni qayta yaratadi
        Input ichidagi matn YO'QOLADI
      */}
      {isAdmin ? (
        <div>
          <input placeholder="Admin panel" />
        </div>
      ) : (
        <section>
          <input placeholder="Foydalanuvchi panel" />
        </section>
      )}
    </div>
  )
}`,
            description: 'Bir xil HTML tip (input → input) bo\'lsa React faqat props-ni yangilaydi (state saqlanadi). Boshqa tip (div → section) bo\'lsa butun subtree qayta yaratiladi (state yo\'qoladi).',
        },
    ],
    interviewQA: [
        {
            question: 'Virtual DOM nima va nima uchun kerak?',
            answer: 'Virtual DOM — JavaScript object bo\'lib, haqiqiy DOM-ning yengil nusxasi. React uni xotirada saqlaydi. State o\'zgarganda React yangi Virtual DOM yaratadi, eski bilan solishtiradi (diffing), va faqat FARQLARNI haqiqiy DOM-ga qo\'llaydi. Bu haqiqiy DOM bilan to\'g\'ridan-to\'g\'ri ishlashdan tezroq, chunki DOM operatsiyalari og\'ir (reflow, repaint), JavaScript object bilan ishlash esa yengil.',
        },
        {
            question: 'React diffing algoritmi qanday ishlaydi?',
            answer: 'React diffing algoritmi O(n) murakkablikda ishlaydi (odatda daraxt solishtirish O(n^3)). Bu 2 ta taxmin (heuristic) tufayli: 1) Agar element tipi o\'zgarsa (masalan, div dan span ga) — butun subtree o\'chiriladi va qayta yaratiladi, 2) key prop orqali ro\'yxatda elementlar aniqlanadi — React qaysi element yangi, qaysi eski ekanini biladi. Shu ikki qoida tufayli React juda tez solishtirish amalga oshiradi.',
        },
        {
            question: 'Key nima uchun kerak va nima uchun index key sifatida yomon?',
            answer: 'key — React-ga ro\'yxatdagi har bir elementni aniqlash uchun kerak. Key bo\'lmaganda React index bo\'yicha taqqoslaydi. Muammo: agar elementlar tartibi o\'zgarsa (qo\'shish, o\'chirish, saralash), index-lar ham o\'zgaradi va React XATO elementni yangilaydi. Masalan, ro\'yxat boshiga element qo\'shsangiz, barcha input-lar bir pozitsiyaga siljiydi va qiymatlar aralashadi. Unikal id ishlatilsa — React har elementni to\'g\'ri kuzatadi. Math.random() ham yomon — har renderda yangi key = har renderda qayta yaratish.',
        },
        {
            question: 'Fiber nima va qanday afzallik beradi?',
            answer: 'Fiber — React 16+ da joriy etilgan yangi reconciliation arxitektura. Eski Stack Reconciler rendering-ni bir martalik bajarar edi — boshlanganini to\'xtatib bo\'lmas edi, bu esa og\'ir komponentlarda brauzer-ni "muzlatar" edi. Fiber esa rendering ishini kichik bo\'laklarga (fiber unit) bo\'ladi. React istalgan vaqtda to\'xtatib, muhimroq ishni (masalan, foydalanuvchi inputi) bajarib, keyin davom ettirishi mumkin. Bu Concurrent Rendering-ning asosi — useTransition, useDeferredValue kabi hooklar shu tufayli ishlaydi.',
        },
    ],
    relatedTopics: [
        { sectionId: 'react-core', topicId: 'rendering-cycle', label: 'Rendering Cycle' },
        { sectionId: 'theory-questions', topicId: 'fiber-architecture', label: 'Fiber Architecture' },
        { sectionId: 'theory-questions', topicId: 'key-importance', label: 'Key nima uchun kerak' },
        { sectionId: 'theory-questions', topicId: 'virtual-dom-theory', label: 'Nazariy savol' },
    ],
},
// ═══════════════════════════════════════
//   REACT RENDERING CYCLE
// ═══════════════════════════════════════
{
    id: 'rendering-cycle',
    title: 'React Rendering Cycle',
    importance: 3,
    status: 'to-learn' as const,
    description: 'React rendering jarayoni — Render fazasi, Commit fazasi, trigger sabablari',
    content: `React rendering — bu React komponentlarni chaqirib, Virtual DOM yaratish jarayoni. Bu haqiqiy DOM yangilanishi EMAS!

═══════════════════════════════════════
  2 TA FAZA
═══════════════════════════════════════

React rendering 2 fazadan iborat:

1. RENDER FAZASI (Render Phase):
   - React komponentni chaqiradi (funksiyani ishga tushiradi)
   - Virtual DOM yaratadi
   - Bu faza PURE bo\\'lishi kerak — side-effect yo\\'q!
   - DOM-ga TEGMAYDI

2. COMMIT FAZASI (Commit Phase):
   - React Virtual DOM farqlarni haqiqiy DOM-ga qo\\'llaydi
   - Bu faza haqiqiy DOM-ni o\\'zgartiradi

═══════════════════════════════════════
  RENDER FAZASI BATAFSIL
═══════════════════════════════════════

React tree-ni yuqoridan pastga yuradi:
1. "Dirty" (o\\'zgargan) komponentni topadi
2. Bu komponentni CHAQIRADI (funksiyani ishlatadi)
3. Barcha BOLALARINI ham render qiladi
4. Virtual DOM natijasini qaytaradi

MUHIM: "Rendering" = komponent funksiyasi chaqirildi.
Bu haqiqiy DOM yangilandi degani EMAS!

Komponent "render bo\\'ldi" deyilsa:
- Funksiya ishladi ✅
- DOM o\\'zgardi ❌ (balki o\\'zgarmagan — agar farq yo\\'q bo\\'lsa)

═══════════════════════════════════════
  COMMIT FAZASI BATAFSIL
═══════════════════════════════════════

Render fazasidan keyin React commit qiladi:

1. Virtual DOM farqlarni haqiqiy DOM-ga QOLLAYDI
2. useLayoutEffect ishlaydi (DOM tayyor, lekin brauzer chizmagan)
3. Brauzer PAINT qiladi (ekranga chizadi)
4. useEffect ishlaydi (paint-dan keyin)

Ketma-ketlik:
Render → DOM yangilanadi → useLayoutEffect → Paint → useEffect

═══════════════════════════════════════
  TRIGGER — RENDERING NIMA SABABDAN BOSHLANADI
═══════════════════════════════════════

Rendering 3 ta sababdan boshlanadi:

1. INITIAL RENDER — komponent birinchi marta DOM-ga qo\\'yilganda
2. setState CHAQIRILGANDA — state o\\'zgarganda
3. PARENT RE-RENDER — ota-komponent renderlaganda BARCHA bolalari ham renderlanadi

3-chi sabab eng muhimi:
- Parent renderlanadi → Child ham renderlanadi (props o\\'zgarmasam ham!)
- Bu React-ning default xatti-harakati
- React.memo bilan oldini olish mumkin

═══════════════════════════════════════
  BATCHING
═══════════════════════════════════════

Bir event ichidagi barcha setState-lar birlashtiriladi — BITTA render.

setState(a)  // render yo\\'q
setState(b)  // render yo\\'q
setState(c)  // render yo\\'q
// event tugadi → BITTA render

React 18+ dan boshlab BARCHA kontekstlarda batching ishlaydi:
- Event handler ✅
- setTimeout ✅
- Promise.then ✅
- Native event listener ✅

═══════════════════════════════════════
  BAIL OUT (RENDER QILMASLIK)
═══════════════════════════════════════

React ba\\'zi hollarda renderni O\\'TKAZIB YUBORADI:

1. setState eski qiymat bilan chaqirilsa:
   - Object.is(eskiQiymat, yangiQiymat) === true bo\\'lsa
   - React renderlaMAYDI

2. React.memo bilan:
   - Props o\\'zgarmasam — child renderlaMAYDI`,
    codeExamples: [
        {
            title: 'Render vs Commit — render sonini kuzatish',
            language: 'tsx' as const,
            code: `import { useState, useEffect, useRef } from 'react'

function RenderCounter() {
  const [count, setCount] = useState(0)
  const [text, setText] = useState('')
  const renderCount = useRef(0)

  // Har renderda oshadi
  renderCount.current += 1

  useEffect(() => {
    // Bu faqat COMMIT fazasidan keyin ishlaydi
    console.log('useEffect: DOM yangilandi, brauzer paint qildi')
  })

  console.log('Render fazasi: funksiya chaqirildi. Render #', renderCount.current)

  return (
    <div>
      <p>Render soni: {renderCount.current}</p>
      <p>Count: {count}</p>

      <button onClick={() => setCount(count + 1)}>
        Count oshirish (render bo'ladi)
      </button>

      <button onClick={() => setCount(count)}>
        Eski qiymat (render BO'LMAYDI — bail out)
      </button>

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Har harf — yangi render"
      />
    </div>
  )
}`,
            description: 'Har bir render fazasida console.log ishlaydi. useEffect faqat commit fazasidan keyin ishlaydi. setState eski qiymat bilan chaqirilsa — render bo\'lmaydi (bail out).',
        },
        {
            title: 'Bail out — setState eski qiymat bilan',
            language: 'tsx' as const,
            code: `import { useState } from 'react'

function BailOutDemo() {
  const [name, setName] = useState('Ali')

  console.log('Render bo\\'ldi!') // Bu chiqmasa = bail out ishladi

  return (
    <div>
      <p>Ism: {name}</p>

      {/* Bu render QILADI — yangi qiymat */}
      <button onClick={() => setName('Vali')}>
        Ismni o'zgartirish
      </button>

      {/* Bu render QILMAYDI — eski qiymat (Object.is) */}
      <button onClick={() => setName('Ali')}>
        Eski ismni qo'yish (bail out)
      </button>

      {/* ⚠️ EHTIYOT: object uchun ISHLAMAYDI! */}
      {/* Chunki {} !== {} (referens boshqa) */}
      {/* setUser({ name: 'Ali' }) — HAR DOIM render qiladi */}
    </div>
  )
}`,
            description: 'setState eski qiymat bilan chaqirilganda React Object.is() bilan taqqoslaydi. Agar teng bo\'lsa — render qilmaydi (bail out). Lekin object/array uchun bu ishlamaydi — chunki yangi object yaratiladi va referens boshqa bo\'ladi.',
        },
    ],
    interviewQA: [
        {
            question: 'Render va Commit fazasi orasidagi farq nima?',
            answer: 'Render fazasida React komponent funksiyasini chaqiradi va Virtual DOM yaratadi — bu faza PURE bo\'lishi kerak, hech qanday side-effect bo\'lmasligi kerak, DOM-ga tegmaydi. Commit fazasida esa React Virtual DOM dagi farqlarni haqiqiy DOM-ga qo\'llaydi, keyin useLayoutEffect ishlaydi, brauzer paint qiladi, va useEffect ishlaydi. Qisqasi: Render = hisoblash, Commit = DOM yangilash.',
        },
        {
            question: 'Rendering deganda DOM yangilanadimi?',
            answer: 'Yo\'q! "Rendering" — bu faqat komponent funksiyasini chaqirish va Virtual DOM yaratish. DOM ga tegmaydi. DOM faqat Commit fazasida yangilanadi, va u ham faqat farq bo\'lsa. Masalan, komponent render bo\'lishi mumkin, lekin agar Virtual DOM-da farq yo\'q bo\'lsa — DOM umuman o\'zgarmaydi.',
        },
        {
            question: 'Qanday holatda komponent renderlanadi?',
            answer: '3 ta holat: 1) Initial render — komponent birinchi marta mount bo\'lganda, 2) setState chaqirilganda — agar yangi qiymat eskisidan farq qilsa (Object.is bilan tekshiriladi), 3) Parent re-render — ota-komponent re-render bo\'lganda BARCHA bolalari ham re-render bo\'ladi (props o\'zgarmasam ham!). 3-chi holatni React.memo bilan oldini olish mumkin.',
        },
        {
            question: 'Batching qanday ishlaydi va nima uchun kerak?',
            answer: 'Batching — bir event ichidagi barcha setState chaqiruvlarni birlashtirib bitta render qilish. Masalan, 3 ta setState chaqirilsa — 3 ta render emas, BITTA render bo\'ladi. React 17 da faqat event handler-larda ishlardi. React 18+ dan boshlab BARCHA kontekstlarda ishlaydi: setTimeout, Promise.then, native eventlarda ham. Bu performance uchun juda muhim — keraksiz re-render-lar oldini oladi. flushSync() bilan batching-ni o\'chirib, har bir setState-ni alohida render qilish mumkin.',
        },
    ],
    relatedTopics: [
        { sectionId: 'react-core', topicId: 'batching', label: 'Batching' },
        { sectionId: 'react-core', topicId: 'virtual-dom', label: 'Virtual DOM' },
        { sectionId: 'theory-questions', topicId: 'react-lifecycle', label: 'React Lifecycle' },
        { sectionId: 'performance', topicId: 're-render-causes', label: 'Re-render sabablari' },
    ],
},
// ═══════════════════════════════════════
//   REACT.MEMO / FORWARDREF
// ═══════════════════════════════════════
{
    id: 'react-memo',
    title: 'React.memo / forwardRef',
    importance: 3,
    status: 'to-learn' as const,
    description: 'React.memo bilan keraksiz re-render oldini olish, forwardRef bilan ref uzatish',
    content: `React.memo — Higher Order Component (HOC) bo\\'lib, props o\\'zgarmaganda komponentni re-render qilmaydi.
forwardRef — parent-dan child-ga ref uzatish imkonini beradi.

═══════════════════════════════════════
  React.memo SINTAKSIS
═══════════════════════════════════════

const MemoComponent = React.memo(Component)

// yoki inline
const MemoComponent = React.memo(function MyComponent(props) {
  return <div>{props.name}</div>
})

═══════════════════════════════════════
  QANDAY ISHLAYDI
═══════════════════════════════════════

React.memo SHALLOW COMPARISON qiladi:
- Oldingi props bilan yangi props-ni taqqoslaydi
- Agar TENG bo\\'lsa — render qilMAYDI
- Agar FARQ bo\\'lsa — render QILADI

Shallow comparison qoidalari:
- Primitive (string, number, boolean): QIYMAT taqqoslanadi
  "hello" === "hello" → teng → render yo\\'q ✅

- Object/Array/Function: REFERENS taqqoslanadi
  { name: "Ali" } !== { name: "Ali" } → teng EMAS → render bo\\'ladi ❌

Shu sababli object/function prop bilan React.memo yolg\\'iz ISHLAMAYDI!
useMemo/useCallback kerak.

═══════════════════════════════════════
  CUSTOM COMPARATOR
═══════════════════════════════════════

O\\'zingiz taqqoslash funksiyasini berishingiz mumkin:

React.memo(Component, (prevProps, nextProps) => {
  // true qaytarsa = RENDER QILMA (teng)
  // false qaytarsa = RENDER QIL (farq bor)
  return prevProps.id === nextProps.id
})

═══════════════════════════════════════
  QACHON ISHLATISH KERAK
═══════════════════════════════════════

✅ Ishlatish kerak:
1. Komponent og\\'ir — ko\\'p elementli ro\\'yxat, murakkab hisoblashlar
2. Tez-tez re-render bo\\'ladigan parent ichida
3. Props kamdan-kam o\\'zgaradi

❌ Ishlatish KERAK EMAS:
1. Props har renderda o\\'zgarsa — memo foydasiz
2. Juda yengil komponentlarda — memo xarajati > render xarajati
3. Object/function prop bilan (useCallback/useMemo kerak, aks holda referens o\\'zgaradi)

═══════════════════════════════════════
  forwardRef
═══════════════════════════════════════

Oddiy holatda parent child-ning DOM elementiga to\\'g\\'ridan-to\\'g\\'ri kira olmaydi.
forwardRef bu imkonni beradi:

// React 18 va oldingi
const MyInput = forwardRef((props, ref) => {
  return <input ref={ref} {...props} />
})

// React 19 DA YANGI — ref oddiy prop sifatida keladi
function MyInput({ ref, ...props }) {
  return <input ref={ref} {...props} />
}

React 19 da forwardRef KERAK EMAS — ref to\\'g\\'ridan-to\\'g\\'ri props ichida keladi.

═══════════════════════════════════════
  TO\\'LIQ OPTIMIZATION PATTERN
═══════════════════════════════════════

React.memo + useCallback + useMemo — uchala birga to\\'liq optimization:

1. React.memo — child re-render oldini oladi
2. useCallback — function prop referensini saqlaydi
3. useMemo — object prop referensini saqlaydi

Bu uchtasi BIRGA ishlatilishi kerak, biri yolg\\'iz foyda bermaydi.`,
    codeExamples: [
        {
            title: 'React.memo — child re-render oldini olish',
            language: 'tsx' as const,
            code: `import { useState, memo } from 'react'

// ❌ MEMO-SIZ: Parent har render bo'lganda Child ham renderlanadi
function SlowChild({ name }: { name: string }) {
  console.log('SlowChild render bo\\'ldi!') // Har safar chiqadi
  // Og'ir hisoblash simulyatsiyasi
  const items = Array.from({ length: 1000 }, (_, i) => (
    <div key={i}>{name} - element {i}</div>
  ))
  return <div>{items}</div>
}

// ✅ MEMO BILAN: Props o'zgarmasam render BO'LMAYDI
const MemoSlowChild = memo(function SlowChild({ name }: { name: string }) {
  console.log('MemoSlowChild render bo\\'ldi!') // Faqat name o'zgarganda
  const items = Array.from({ length: 1000 }, (_, i) => (
    <div key={i}>{name} - element {i}</div>
  ))
  return <div>{items}</div>
})

function Parent() {
  const [count, setCount] = useState(0)
  const [name] = useState('Ali')

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>+1</button>

      {/* count o'zgarganda Parent renderlanadi,
          lekin name o'zgarmagan — MemoSlowChild renderlanMAYDI */}
      <MemoSlowChild name={name} />
    </div>
  )
}`,
            description: 'React.memo bilan o\'ralgan komponent props o\'zgarmaganda re-render bo\'lmaydi. Bu ayniqsa og\'ir komponentlarda juda foydali.',
        },
        {
            title: 'React.memo + useCallback — function prop bilan',
            language: 'tsx' as const,
            code: `import { useState, memo, useCallback } from 'react'

const Button = memo(function Button({
  onClick,
  label,
}: {
  onClick: () => void
  label: string
}) {
  console.log(\`Button "\${label}" render bo'ldi\`)
  return <button onClick={onClick}>{label}</button>
})

function App() {
  const [count, setCount] = useState(0)
  const [text, setText] = useState('')

  // ❌ XATO: har renderda yangi funksiya = memo ishlamaydi
  // const handleClick = () => setCount(c => c + 1)

  // ✅ TO'G'RI: useCallback referensni saqlaydi = memo ishlaydi
  const handleClick = useCallback(() => {
    setCount(c => c + 1)
  }, []) // Bo'sh dependency = funksiya hech qachon o'zgarmaydi

  return (
    <div>
      <p>Count: {count}</p>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Yozing... Button renderlanmaydi"
      />
      {/* text o'zgarsa ham Button renderlanMAYDI
          chunki handleClick referensi o'zgarmagan */}
      <Button onClick={handleClick} label="Oshirish" />
    </div>
  )
}`,
            description: 'React.memo yolg\'iz function prop bilan ishlamaydi — chunki har renderda yangi funksiya yaratiladi. useCallback bilan funksiya referensini saqlab, memo to\'g\'ri ishlashini ta\'minlash kerak.',
        },
        {
            title: 'forwardRef — parent-dan child input-ga focus',
            language: 'tsx' as const,
            code: `import { useRef, forwardRef } from 'react'

// React 18: forwardRef ishlatish kerak
const CustomInput18 = forwardRef<HTMLInputElement, { label: string }>(
  function CustomInput({ label }, ref) {
    return (
      <div>
        <label>{label}</label>
        <input ref={ref} type="text" />
      </div>
    )
  }
)

// React 19: ref oddiy prop — forwardRef kerak emas!
function CustomInput19({
  label,
  ref,
}: {
  label: string
  ref?: React.Ref<HTMLInputElement>
}) {
  return (
    <div>
      <label>{label}</label>
      <input ref={ref} type="text" />
    </div>
  )
}

function Form() {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFocus = () => {
    // Parent child-ning input-iga to'g'ridan-to'g'ri kira oladi
    inputRef.current?.focus()
  }

  return (
    <div>
      <CustomInput19 ref={inputRef} label="Ism:" />
      <button onClick={handleFocus}>Input-ga focus</button>
    </div>
  )
}`,
            description: 'forwardRef orqali parent child ichidagi DOM elementiga ref uzatishi mumkin. React 19 da ref oddiy prop bo\'lib keladi — forwardRef kerak emas.',
        },
    ],
    interviewQA: [
        {
            question: 'React.memo nima va qanday ishlaydi?',
            answer: 'React.memo — Higher Order Component (HOC) bo\'lib, komponentni props o\'zgarmaganda re-render qilmaydi. U shallow comparison qiladi: oldingi va yangi props-ni taqqoslaydi. Primitive (string, number) uchun qiymat taqqoslanadi, object/array/function uchun referens taqqoslanadi. Agar props teng bo\'lsa — render o\'tkazib yuboriladi. Custom comparator funksiya ham berish mumkin.',
        },
        {
            question: 'Shallow comparison nima degani?',
            answer: 'Shallow comparison — props-ni faqat "birinchi daraja"da taqqoslash. Primitive qiymatlar uchun: "hello" === "hello" — teng. Object uchun faqat REFERENS tekshiriladi: { name: "Ali" } !== { name: "Ali" } — teng EMAS, chunki 2 ta boshqa object. Nested object-lar ichiga KIRMAYDI. Shu sababli React.memo object prop bilan yolg\'iz ishlamaydi — useMemo kerak.',
        },
        {
            question: 'React.memo + useCallback nima uchun birga kerak?',
            answer: 'React.memo yolg\'iz function prop bilan ishlamaydi. Sabab: har render-da komponent ichida yaratilgan funksiya YANGI referensga ega bo\'ladi (const fn = () => {} har safar yangi object). Shallow comparison: eskiFn !== yangiFn — render bo\'ladi. useCallback funksiya referensini dependency o\'zgarmaguncha SAQLAYDI. Shunda React.memo shallow comparison-da eskiFn === yangiFn ko\'radi va render qilmaydi.',
        },
        {
            question: 'forwardRef nima uchun kerak va React 19 da qanday o\'zgardi?',
            answer: 'forwardRef — parent-dan child komponent ichidagi DOM elementiga ref uzatish uchun kerak. Masalan, parent child ichidagi input-ga focus berishi kerak. Oddiy holda ref child-ga prop sifatida kelmaydi (React uni maxsus prop deb hisoblaydi). forwardRef bu muammoni hal qiladi. React 19 da esa ref oddiy prop bo\'lib keladi — forwardRef wrapper kerak emas, to\'g\'ridan-to\'g\'ri destructuring qilish mumkin: function Child({ ref }) { ... }.',
        },
    ],
    relatedTopics: [
        { sectionId: 'performance', topicId: 'memo-usememo-usecallback', label: 'memo vs useMemo vs useCallback' },
        { sectionId: 'react-core', topicId: 'use-imperative-handle', label: 'useImperativeHandle' },
        { sectionId: 'react-core', topicId: 'use-ref', label: 'useRef' },
    ],
},
// ═══════════════════════════════════════
//   useId
// ═══════════════════════════════════════
{
    id: 'use-id',
    title: 'useId',
    importance: 1,
    status: 'to-learn' as const,
    description: 'Unikal ID generatsiya qilish hooki — SSR va accessibility uchun',
    content: `useId — React 18+ da qo\\'shilgan hook bo\\'lib, komponent ichida unikal va barqaror ID yaratadi.

═══════════════════════════════════════
  SINTAKSIS
═══════════════════════════════════════

const id = useId()
// Qaytaradi: ":r1:", ":r2:", ":r3:" kabi unikal string

═══════════════════════════════════════
  NIMA UCHUN KERAK
═══════════════════════════════════════

1. SSR (Server-Side Rendering) da CLIENT va SERVER bir xil ID ishlatishi kerak.
   Math.random() yoki counter ishlatsa — server-da bitta, client-da boshqa ID bo\\'ladi = HYDRATION MISMATCH xato.
   useId esa server va client-da BIR XIL ID beradi.

2. ACCESSIBILITY uchun:
   - aria-describedby, aria-labelledby, htmlFor — bularga unikal ID kerak
   - Bir sahifada bir xil komponent bir nechta marta ishlatilsa — ID-lar TAKRORLANMASLIGI kerak

═══════════════════════════════════════
  MATH.RANDOM() NIMA UCHUN ISHLATIB BO\\'LMAYDI
═══════════════════════════════════════

- Server: id = "abc123"
- Client: id = "xyz789" (boshqa!)
- React: "Hydration mismatch!" ❌
- useId: server va client BIR XIL id beradi ✅

═══════════════════════════════════════
  MUHIM ESLATMA
═══════════════════════════════════════

- useId ro\\'yxat key-lari uchun ISHLATMANG! Key uchun ma\\'lumot ichidagi id ishlatiladi.
- useId faqat HTML atributlari (id, htmlFor, aria-*) uchun mo\\'ljallangan.`,
    codeExamples: [
        {
            title: 'Form label + input id — accessibility',
            language: 'tsx' as const,
            code: `import { useId } from 'react'

function FormField({ label, type = 'text' }: { label: string; type?: string }) {
  const id = useId()
  const hintId = \`\${id}-hint\`

  return (
    <div>
      {/* htmlFor va id bog'langan — label bosilsa input fokuslanadi */}
      <label htmlFor={id}>{label}</label>
      <input id={id} type={type} aria-describedby={hintId} />
      <p id={hintId} style={{ fontSize: '12px', color: 'gray' }}>
        {label} kiriting
      </p>
    </div>
  )
}

// Bir sahifada bir nechta marta ishlatish — ID-lar takrorlanMAYDI
function RegistrationForm() {
  return (
    <form>
      <FormField label="Ism" />        {/* id=":r1:", hint=":r1:-hint" */}
      <FormField label="Email" type="email" /> {/* id=":r2:", hint=":r2:-hint" */}
      <FormField label="Parol" type="password" /> {/* id=":r3:", hint=":r3:-hint" */}
    </form>
  )
}`,
            description: 'useId har bir FormField uchun unikal ID yaratadi. Bir sahifada bir nechta marta ishlatilsa ham ID-lar hech qachon takrorlanmaydi. SSR da ham to\'g\'ri ishlaydi.',
        },
    ],
    interviewQA: [
        {
            question: 'useId nima uchun kerak va Math.random() dan nima farqi?',
            answer: 'useId unikal va barqaror ID yaratadi. Asosiy farq SSR-da ko\'rinadi: Math.random() server-da bitta, client-da boshqa ID beradi — bu hydration mismatch xatosiga olib keladi. useId esa server va client-da BIR XIL ID kafolatlaydi. Shuningdek, useId bir komponent bir nechta marta ishlatilganda har biri uchun unikal ID beradi — accessibility (aria-describedby, htmlFor) uchun muhim.',
        },
        {
            question: 'useId ni ro\'yxat key sifatida ishlatish mumkinmi?',
            answer: 'Yo\'q! useId ro\'yxat key-lari uchun ISHLATILMAYDI. Key uchun ma\'lumot ichidagi unikal id (masalan, user.id, product.id) ishlatiladi. useId faqat HTML atributlari (id, htmlFor, aria-describedby) uchun mo\'ljallangan. Key va HTML id — boshqa-boshqa narsalar.',
        },
    ],
    relatedTopics: [
        { sectionId: 'theory-questions', topicId: 'ssr-csr-ssg', label: 'SSR va hydration' },
        { sectionId: 'architecture', topicId: 'accessibility', label: 'Accessibility (aria-*)' },
    ],
},
// ═══════════════════════════════════════
//   useSyncExternalStore
// ═══════════════════════════════════════
{
    id: 'use-sync-external-store',
    title: 'useSyncExternalStore',
    importance: 2,
    status: 'to-learn' as const,
    description: 'Tashqi store-larga ulanish hooki — Redux, Zustand va browser API uchun',
    content: `useSyncExternalStore — React 18+ da qo\\'shilgan hook bo\\'lib, React TASHQARIDAGI (external) ma\\'lumot manbalariga ulanish uchun ishlatiladi.

═══════════════════════════════════════
  SINTAKSIS
═══════════════════════════════════════

const snapshot = useSyncExternalStore(
  subscribe,    // store o\\'zgarganda chaqiriladigan callback-ni ro\\'yxatga olish
  getSnapshot,  // hozirgi qiymatni qaytarish (client)
  getServerSnapshot? // SSR uchun (ixtiyoriy)
)

═══════════════════════════════════════
  NIMA UCHUN KERAK
═══════════════════════════════════════

React o\\'z state-ini (useState, useReducer) boshqaradi.
Lekin ba\\'zi ma\\'lumotlar React TASHQARISIDA:
- Redux store
- Zustand store
- Browser API: navigator.onLine, matchMedia, localStorage
- WebSocket, EventSource

Bu hook ularni React bilan xavfsiz sinxronlaydi.

MUHIM: Redux (useSelector) va Zustand (useStore) ICHIDA shu hook ishlatadi!
Siz bevosita kamdan-kam ishlatasiz — lekin qanday ishlashini bilish muhim.

═══════════════════════════════════════
  BROWSER API BILAN ISHLATISH
═══════════════════════════════════════

navigator.onLine, window.matchMedia, document.visibilityState —
bularning barchasi React tashqarisidagi ma\\'lumot manbalari.
useSyncExternalStore ular bilan xavfsiz ishlash imkonini beradi.`,
    codeExamples: [
        {
            title: 'Online/Offline status hook',
            language: 'tsx' as const,
            code: `import { useSyncExternalStore } from 'react'

// Tashqi store: navigator.onLine
function subscribe(callback: () => void) {
  window.addEventListener('online', callback)
  window.addEventListener('offline', callback)
  return () => {
    window.removeEventListener('online', callback)
    window.removeEventListener('offline', callback)
  }
}

function getSnapshot() {
  return navigator.onLine
}

// SSR uchun (serverda navigator yo'q)
function getServerSnapshot() {
  return true // Server-da har doim "online" deb faraz qilamiz
}

// Custom hook
function useOnlineStatus() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

// Ishlatish
function StatusBar() {
  const isOnline = useOnlineStatus()

  return (
    <div style={{
      padding: '10px',
      background: isOnline ? '#4caf50' : '#f44336',
      color: 'white',
    }}>
      {isOnline ? '🟢 Internetga ulangan' : '🔴 Internet yo\\'q'}
    </div>
  )
}`,
            description: 'navigator.onLine — React tashqarisidagi ma\'lumot. useSyncExternalStore orqali online/offline holatini kuzatish va React bilan sinxronlash.',
        },
    ],
    interviewQA: [
        {
            question: 'useSyncExternalStore nima uchun kerak?',
            answer: 'React tashqarisidagi (external) ma\'lumot manbalariga ulanish uchun kerak. React o\'z state-ini useState/useReducer bilan boshqaradi, lekin ba\'zi ma\'lumotlar React tashqarisida: Redux/Zustand store, browser API (navigator.onLine, matchMedia), WebSocket. Bu hook ularni React bilan xavfsiz sinxronlaydi va concurrent rendering bilan to\'g\'ri ishlashini ta\'minlaydi.',
        },
        {
            question: 'Redux va Zustand bu hook bilan qanday bog\'liq?',
            answer: 'Redux (useSelector) va Zustand (useStore) ICHIDA useSyncExternalStore ishlatadi. Ular tashqi store bo\'lgani uchun React-ga o\'zgarishlarni xabar qilish uchun shu hook kerak. Siz bevosita kamdan-kam ishlatasiz — ko\'pincha kutubxonalar ichida ishlaydi. Lekin browser API (navigator.onLine, matchMedia, localStorage) bilan ishlashda to\'g\'ridan-to\'g\'ri ishlatish mumkin.',
        },
    ],
    relatedTopics: [
        { sectionId: 'state-management', topicId: 'zustand', label: 'Zustand (ichki ishlatadi)' },
        { sectionId: 'state-management', topicId: 'redux-toolkit', label: 'Redux (ichki ishlatadi)' },
    ],
},
// ═══════════════════════════════════════
//   use() HOOK
// ═══════════════════════════════════════
{
    id: 'use-hook',
    title: 'use() hook',
    importance: 2,
    status: 'to-learn' as const,
    description: 'React 19 yangi hook — Promise va Context o\'qish, if ichida ishlatish mumkin',
    content: `use() — React 19 da qo\\'shilgan yangi hook. U Promise va Context o\\'qish uchun ishlatiladi.

═══════════════════════════════════════
  SINTAKSIS
═══════════════════════════════════════

// Promise o'qish
const data = use(fetchPromise)

// Context o'qish (useContext o'rniga)
const theme = use(ThemeContext)

═══════════════════════════════════════
  BOSHQA HOOKLARDAN FARQI
═══════════════════════════════════════

Boshqa hooklar (useState, useEffect):
- if/else ichida ishlatib BO\\'LMAYDI
- Loop ichida ishlatib BO\\'LMAYDI
- Faqat komponent YUQORISIDA

use() hook:
- if ichida ishlatish MUMKIN ✅
- Loop ichida ishlatish MUMKIN ✅
- Bu unga maxsus moslashuvchanlik beradi

═══════════════════════════════════════
  PROMISE BILAN — SUSPENSE
═══════════════════════════════════════

use(promise) chaqirilganda:
1. Promise hali tugamagan bo\\'lsa — komponent SUSPEND bo\\'ladi
2. Suspense fallback ko\\'rsatadi (loading)
3. Promise tugaganda — ma\\'lumot ko\\'rsatiladi

MUHIM: Promise TASHQARIDA yaratilishi kerak (render ichida emas!)
Aks holda har renderda yangi promise = cheksiz loop.

═══════════════════════════════════════
  CONTEXT BILAN
═══════════════════════════════════════

use(SomeContext) = useContext(SomeContext) bilan bir xil.
Farqi: use() if ichida ishlatish mumkin — shartli context o\\'qish.`,
    codeExamples: [
        {
            title: 'Promise o\'qish — Suspense bilan data fetch',
            language: 'tsx' as const,
            code: `import { use, Suspense } from 'react'

// API funksiyasi — promise TASHQARIDA yaratiladi
function fetchUser(id: number): Promise<{ name: string; email: string }> {
  return fetch(\`https://jsonplaceholder.typicode.com/users/\${id}\`)
    .then(res => res.json())
}

// Promise-ni TASHQARIDA yaratamiz (render ichida EMAS!)
const userPromise = fetchUser(1)

function UserCard() {
  // use() promise tugaguncha suspend qiladi
  // Suspense fallback ko'rsatadi
  const user = use(userPromise)

  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  )
}

// Shartli context o'qish — boshqa hooklarda MUMKIN EMAS
function ConditionalRead({ showTheme }: { showTheme: boolean }) {
  if (showTheme) {
    const theme = use(ThemeContext) // if ichida — faqat use() bilan mumkin!
    return <p>Tema: {theme}</p>
  }
  return <p>Tema yashirin</p>
}

function App() {
  return (
    <Suspense fallback={<p>Yuklanmoqda...</p>}>
      <UserCard />
    </Suspense>
  )
}`,
            description: 'use() Promise kutish uchun ishlatiladi — Suspense bilan birga loading holatini boshqaradi. Boshqa hooklardan farqli ravishda if ichida ham ishlatish mumkin.',
        },
    ],
    interviewQA: [
        {
            question: 'use() hook nima va boshqa hooklardan nima farqi?',
            answer: 'use() — React 19 dagi yangi hook. U Promise va Context o\'qish uchun ishlatiladi. Boshqa hooklardan asosiy farqi: if/else va loop ichida ishlatish MUMKIN. Boshqa hooklar (useState, useEffect) faqat komponent yuqorisida, shartlarsiz chaqirilishi shart. use() bu cheklovdan ozod.',
        },
        {
            question: 'use() bilan Promise qanday ishlaydi?',
            answer: 'use(promise) chaqirilganda, agar promise hali tugamagan bo\'lsa — komponent "suspend" bo\'ladi va Suspense fallback ko\'rsatiladi (masalan, loading spinner). Promise tugaganda — natija qaytariladi va komponent renderlanadi. MUHIM: Promise komponent tashqarisida yaratilishi kerak — render ichida yaratilsa har renderda yangi promise bo\'ladi va cheksiz loop hosil bo\'ladi.',
        },
    ],
    relatedTopics: [
        { sectionId: 'react-core', topicId: 'use-context', label: 'useContext (eski usul)' },
        { sectionId: 'theory-questions', topicId: 'react-18-19', label: 'React 19 yangiliklari' },
        { sectionId: 'component-patterns', topicId: 'suspense-lazy', label: 'Suspense bilan ishlaydi' },
    ],
},
// ═══════════════════════════════════════
//   useOptimistic
// ═══════════════════════════════════════
{
    id: 'use-optimistic',
    title: 'useOptimistic',
    importance: 2,
    status: 'to-learn' as const,
    description: 'React 19 — server javob bermay turib UI-ni optimistik yangilash',
    content: `useOptimistic — React 19 da qo\\'shilgan hook. Optimistic UI pattern-ni amalga oshirish uchun ishlatiladi.

═══════════════════════════════════════
  OPTIMISTIC UI NIMA
═══════════════════════════════════════

Optimistic UI — server javob qaytarmasdan OLDIN UI-ni yangilash.
Foydalanuvchi harakatni darhol ko\\'radi, server javob kelganda tasdiqlanadi.

Masalan:
- Like bosish → darhol +1 ko\\'rinadi → server javob kelganda tasdiqlaydi
- Xabar yuborish → darhol ro\\'yxatda ko\\'rinadi → server saqlaydi

Agar xato bo\\'lsa — eski holatga qaytadi (rollback).

═══════════════════════════════════════
  SINTAKSIS
═══════════════════════════════════════

const [optimisticState, addOptimistic] = useOptimistic(
  actualState,          // haqiqiy state (server-dan)
  updateFn              // (currentState, optimisticValue) => newState
)

- optimisticState — ko\\'rsatiladigan qiymat (optimistik yoki haqiqiy)
- addOptimistic — optimistik yangilanishni qo\\'shish
- async action tugaganda avtomatik haqiqiy state-ga qaytadi

═══════════════════════════════════════
  QANDAY ISHLAYDI
═══════════════════════════════════════

1. Foydalanuvchi harakat qiladi (like bosadi)
2. addOptimistic chaqiriladi → UI darhol yangilanadi
3. Server-ga so\\'rov yuboriladi (async)
4. Server javob beradi → haqiqiy state yangilanadi
5. Agar xato bo\\'lsa → optimistik qiymat bekor, eski state qaytadi`,
    codeExamples: [
        {
            title: 'Like button — optimistik yangilash',
            language: 'tsx' as const,
            code: `import { useOptimistic, useState, useTransition } from 'react'

// Server-ga like yuborish simulyatsiyasi
async function sendLike(postId: number): Promise<{ likes: number }> {
  const res = await fetch(\`/api/posts/\${postId}/like\`, { method: 'POST' })
  return res.json()
}

function LikeButton({ postId, initialLikes }: { postId: number; initialLikes: number }) {
  const [likes, setLikes] = useState(initialLikes)
  const [isPending, startTransition] = useTransition()

  const [optimisticLikes, addOptimisticLike] = useOptimistic(
    likes,
    (currentLikes: number, _newLike: number) => currentLikes + 1
  )

  const handleLike = () => {
    startTransition(async () => {
      // 1. Darhol UI-ni yangilash (optimistik)
      addOptimisticLike(1)

      // 2. Server-ga yuborish
      try {
        const result = await sendLike(postId)
        // 3. Haqiqiy state yangilash
        setLikes(result.likes)
      } catch {
        // 4. Xato bo'lsa — optimistik qiymat avtomatik bekor bo'ladi
        console.error('Like yuborishda xato!')
      }
    })
  }

  return (
    <button onClick={handleLike} disabled={isPending}>
      ❤️ {optimisticLikes} {isPending && '(yuborilmoqda...)'}
    </button>
  )
}`,
            description: 'Like bosilganda darhol +1 ko\'rsatiladi (optimistic). Server javob qaytarganda haqiqiy qiymatga almashadi. Xato bo\'lsa — eski qiymatga qaytadi.',
        },
    ],
    interviewQA: [
        {
            question: 'useOptimistic nima va qachon ishlatiladi?',
            answer: 'useOptimistic — React 19 dagi hook. Optimistic UI pattern uchun: server javob bermay turib UI-ni darhol yangilash. Like bosish, xabar yuborish, forma submit kabi holatlarda ishlatiladi. Foydalanuvchi kutmasdan natijani ko\'radi. Xato bo\'lsa avtomatik eski holatga qaytadi (rollback).',
        },
        {
            question: 'useOptimistic va oddiy setState dan farqi nima?',
            answer: 'setState bilan qiymatni o\'zgartirsangiz — u doimiy. Xato bo\'lsa o\'zingiz qo\'lda qaytarishingiz kerak. useOptimistic VAQTINCHALIK o\'zgartiradi — async action tugaguncha optimistik qiymat ko\'rsatadi, keyin haqiqiy state-ga avtomatik qaytadi. Server xato qaytarsa, rollback avtomatik ishlaydi. Shuningdek, useOptimistic useTransition bilan birga ishlaydi.',
        },
    ],
    relatedTopics: [
        { sectionId: 'state-management', topicId: 'tanstack-query-deep', label: 'TanStack Optimistic Updates' },
        { sectionId: 'theory-questions', topicId: 'react-18-19', label: 'React 19 yangiliklari' },
    ],
},
// ═══════════════════════════════════════
//   useActionState
// ═══════════════════════════════════════
{
    id: 'use-action-state',
    title: 'useActionState',
    importance: 2,
    status: 'to-learn' as const,
    description: 'React 19 — form action-larni boshqarish (state + pending + progressive enhancement)',
    content: `useActionState — React 19 da qo\\'shilgan hook. Form action-larni boshqarish uchun ishlatiladi.

═══════════════════════════════════════
  SINTAKSIS
═══════════════════════════════════════

const [state, formAction, isPending] = useActionState(
  actionFn,      // async (prevState, formData) => newState
  initialState   // boshlang'ich state
)

- state — hozirgi holat (success, error, data)
- formAction — <form action={formAction}> ga berish
- isPending — form submit bo\\'lyaptimi (loading holat)

═══════════════════════════════════════
  NIMA UCHUN KERAK
═══════════════════════════════════════

Oddiy form boshqaruvi murakkab:
- loading state uchun useState
- error state uchun useState
- success state uchun useState
- preventDefault, fetch, try/catch...

useActionState HAMMASINI BITTA hook-da hal qiladi.

═══════════════════════════════════════
  PROGRESSIVE ENHANCEMENT
═══════════════════════════════════════

<form action={formAction}> — brauzer native submit.
JavaScript yuklanmasdan HAM ishlaydi (SSR/Next.js da).
Bu "progressive enhancement" deyiladi.

═══════════════════════════════════════
  SERVER ACTIONS BILAN
═══════════════════════════════════════

Next.js da Server Actions bilan bevosita ishlaydi:
- action funksiya server-da ishlaydi
- Client-da faqat form ko\\'rsatiladi
- JavaScript yo\\'q bo\\'lsa ham form ishlaydi`,
    codeExamples: [
        {
            title: 'Form submit — loading + error + success',
            language: 'tsx' as const,
            code: `import { useActionState } from 'react'

type FormState = {
  message: string
  status: 'idle' | 'success' | 'error'
}

async function submitForm(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const name = formData.get('name') as string
  const email = formData.get('email') as string

  // Validatsiya
  if (!name || !email) {
    return { message: 'Barcha maydonlarni to\\'ldiring!', status: 'error' }
  }

  // Server-ga yuborish simulyatsiyasi
  await new Promise(resolve => setTimeout(resolve, 1500))

  // Tasodifiy xato simulyatsiyasi
  if (Math.random() > 0.7) {
    return { message: 'Server xatosi! Qayta urinib ko\\'ring.', status: 'error' }
  }

  return { message: \`Rahmat, \${name}! Ma'lumot saqlandi.\`, status: 'success' }
}

function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitForm, {
    message: '',
    status: 'idle' as const,
  })

  return (
    <form action={formAction}>
      <div>
        <label htmlFor="name">Ism:</label>
        <input id="name" name="name" type="text" disabled={isPending} />
      </div>

      <div>
        <label htmlFor="email">Email:</label>
        <input id="email" name="email" type="email" disabled={isPending} />
      </div>

      <button type="submit" disabled={isPending}>
        {isPending ? 'Yuborilmoqda...' : 'Yuborish'}
      </button>

      {state.status === 'error' && (
        <p style={{ color: 'red' }}>{state.message}</p>
      )}
      {state.status === 'success' && (
        <p style={{ color: 'green' }}>{state.message}</p>
      )}
    </form>
  )
}`,
            description: 'useActionState form submit-ni boshqaradi: loading (isPending), error va success holatlari bitta hook-da. form action orqali progressive enhancement ham ishlaydi.',
        },
    ],
    interviewQA: [
        {
            question: 'useActionState nima va qanday ishlaydi?',
            answer: 'useActionState — React 19 dagi hook, form action-larni boshqarish uchun. U 3 ta narsa beradi: state (hozirgi holat — success/error/data), formAction (form action-ga berish), isPending (loading holat). Oddiy useState + fetch + try/catch o\'rniga BITTA hook ishlatiladi. Progressive enhancement — JS yo\'q bo\'lsa ham form ishlaydi.',
        },
        {
            question: 'useActionState va oddiy onSubmit handler farqi nima?',
            answer: 'Oddiy onSubmit bilan: preventDefault, useState(loading), useState(error), fetch, try/catch — ko\'p boilerplate. useActionState bularni HAMMASINI bitta hook-da hal qiladi. Yana muhim farq: form action={formAction} — bu native HTML form submit, JS yuklanmasdan ham ishlaydi (progressive enhancement). Next.js da Server Actions bilan bevosita integratsiya ham bor.',
        },
    ],
    relatedTopics: [
        { sectionId: 'theory-questions', topicId: 'server-components', label: 'Server Components' },
        { sectionId: 'theory-questions', topicId: 'react-18-19', label: 'React 19 yangiliklari' },
        { sectionId: 'component-patterns', topicId: 'controlled-vs-uncontrolled', label: 'Form boshqaruvi' },
    ],
},
// ═══════════════════════════════════════
//   STATE BATCHING
// ═══════════════════════════════════════
{
    id: 'batching',
    title: 'State Batching',
    importance: 3,
    status: 'to-learn' as const,
    description: 'Bir nechta setState-ni birlashtirib bitta render qilish — performance uchun muhim',
    content: `Batching — React-ning bir nechta setState chaqiruvlarni BIRLASHTIRIB bitta render qilish mexanizmi.

═══════════════════════════════════════
  BATCHING NIMA
═══════════════════════════════════════

Tasavvur qiling: bitta funksiya ichida 3 ta setState chaqirdingiz.
Batching-SIZ: 3 ta render (sekin)
Batching BILAN: 1 ta render (tez)

setState(a)  // render YO'Q
setState(b)  // render YO'Q
setState(c)  // render YO'Q
// funksiya tugadi → BITTA render

═══════════════════════════════════════
  REACT 17 vs REACT 18 FARQI
═══════════════════════════════════════

REACT 17 — faqat event handler-larda batching:
✅ onClick ichida — batching ISHLAYDI
❌ setTimeout ichida — batching ISHLAMAYDI
❌ Promise.then ichida — batching ISHLAMAYDI
❌ Native event ichida — batching ISHLAMAYDI

REACT 18+ — AUTOMATIC BATCHING — HAMMASI:
✅ onClick ichida — batching ISHLAYDI
✅ setTimeout ichida — batching ISHLAYDI
✅ Promise.then ichida — batching ISHLAYDI
✅ Native event ichida — batching ISHLAYDI

Bu React 18-ning eng muhim yangiliklaridam biri — createRoot() orqali yoqiladi.

═══════════════════════════════════════
  flushSync — BATCHING-NI O\\'CHIRISH
═══════════════════════════════════════

import { flushSync } from 'react-dom'

flushSync(() => {
  setState(a) // DARHOL render
})
flushSync(() => {
  setState(b) // DARHOL render
})
// 2 ta alohida render bo'ladi

flushSync kamdan-kam kerak — faqat DOM o\\'lchamlarini o\\'qish kerak bo\\'lganda.

═══════════════════════════════════════
  NIMA UCHUN KERAK (PERFORMANCE)
═══════════════════════════════════════

Har bir render = Virtual DOM yaratish + diff + commit.
3 ta state o\\'zgarsa va 3 ta render bo\\'lsa — 3 MARTA bu jarayon.
Batching bilan 1 MARTA — 3x tezroq.`,
    codeExamples: [
        {
            title: '3 ta setState — 1 ta render',
            language: 'tsx' as const,
            code: `import { useState } from 'react'
import { flushSync } from 'react-dom'

function BatchingDemo() {
  const [count, setCount] = useState(0)
  const [text, setText] = useState('')
  const [flag, setFlag] = useState(false)

  let renderCount = 0
  renderCount++ // Har renderda oshadi
  console.log('Render #', renderCount)

  // ✅ BATCHING — 3 ta setState, lekin BITTA render
  const handleBatched = () => {
    setCount(c => c + 1)   // render yo'q
    setText('yangilandi')   // render yo'q
    setFlag(f => !f)        // render yo'q
    // funksiya tugadi → BITTA render
    console.log('3 ta setState — 1 render!')
  }

  // ✅ React 18: setTimeout ichida ham batching ishlaydi
  const handleAsync = () => {
    setTimeout(() => {
      setCount(c => c + 1)  // React 17: darhol render | React 18: batch
      setText('async')       // React 17: darhol render | React 18: batch
      // React 18: BITTA render
    }, 100)
  }

  // ❌ flushSync — batching-ni o'chirish (kamdan-kam kerak)
  const handleFlushSync = () => {
    flushSync(() => {
      setCount(c => c + 1) // DARHOL render (1-render)
    })
    // Shu yerda DOM yangilangan — o'lcham o'qish mumkin
    flushSync(() => {
      setText('flush')      // DARHOL render (2-render)
    })
    // 2 ta alohida render bo'ldi
  }

  return (
    <div>
      <p>Count: {count} | Text: {text} | Flag: {String(flag)}</p>
      <button onClick={handleBatched}>Batching (1 render)</button>
      <button onClick={handleAsync}>Async batching</button>
      <button onClick={handleFlushSync}>flushSync (2 render)</button>
    </div>
  )
}`,
            description: 'React 18+ da barcha kontekstlarda automatic batching ishlaydi. 3 ta setState = 1 ta render. flushSync bilan batching-ni o\'chirish mumkin (kamdan-kam kerak).',
        },
    ],
    interviewQA: [
        {
            question: 'State batching nima?',
            answer: 'Batching — React-ning bir nechta setState chaqiruvlarni birlashtirib BITTA render qilish mexanizmi. Masalan, 3 ta setState chaqirilsa — 3 ta render emas, 1 ta render bo\'ladi. Bu performance uchun juda muhim — har render Virtual DOM yaratish + diff + commit degani.',
        },
        {
            question: 'React 17 va React 18 da batching qanday farq qiladi?',
            answer: 'React 17 da batching FAQAT event handler-larda ishlardi. setTimeout, Promise.then, native event-larda har setState alohida render qilardi. React 18 da AUTOMATIC BATCHING joriy etildi — BARCHA kontekstlarda batching ishlaydi: event handler, setTimeout, Promise, native event. Bu createRoot() orqali yoqiladi (eski ReactDOM.render() bilan ishlamaydi).',
        },
        {
            question: 'flushSync nima va qachon ishlatiladi?',
            answer: 'flushSync — batching-ni o\'chirib, setState-ni darhol render qilish funksiyasi (react-dom dan import). Kamdan-kam kerak — faqat DOM o\'zgarishini DARHOL ko\'rish kerak bo\'lganda. Masalan, setState-dan keyin element o\'lchamini o\'qish kerak bo\'lsa. Oddiy hollarda ishlatish TAVSIYA ETILMAYDI — batching performance uchun yaxshi.',
        },
    ],
    relatedTopics: [
        { sectionId: 'react-core', topicId: 'use-state', label: 'useState' },
        { sectionId: 'react-core', topicId: 'rendering-cycle', label: 'Rendering Cycle' },
        { sectionId: 'performance', topicId: 're-render-causes', label: 'Re-render sabablari' },
    ],
},
// ═══════════════════════════════════════
//   STRICT MODE
// ═══════════════════════════════════════
{
    id: 'strict-mode',
    title: 'StrictMode',
    importance: 2,
    status: 'to-learn' as const,
    description: 'Development rejimida xatolarni topish uchun React StrictMode',
    content: `StrictMode — React-ning development rejimida xatolarni topish vositasi. Production-da HECH NARSA qilmaydi.

═══════════════════════════════════════
  NIMA QILADI (FAQAT DEV MODE)
═══════════════════════════════════════

1. 2x RENDER: Har komponentni IKKI MARTA render qiladi
   - Nima uchun: Pure bo\\'lmagan komponentlarni topish (side-effect render ichida)

2. 2x EFFECT: useEffect setup+cleanup-ni IKKI MARTA ishlaydi
   - Nima uchun: Cleanup to\\'g\\'ri yozilganini tekshirish

3. DEPRECATED API WARNING: Eskirgan API ishlatilsa ogohlantiradi
   - componentWillMount, componentWillReceiveProps va boshqalar

═══════════════════════════════════════
  NIMA UCHUN KERAK
═══════════════════════════════════════

- Render ichidagi side-effect-larni topadi
- Effect cleanup xatolarini topadi
- Eskirgan pattern-larni aniqlaydi
- Concurrent rendering uchun tayyorgarlik

═══════════════════════════════════════
  PRODUCTION-DA BO\\'LMAYDI
═══════════════════════════════════════

StrictMode faqat development build-da ishlaydi.
yarn build qilganda StrictMode kodi butunlay OLIB TASHLANADI.
Foydalanuvchilar hech qanday farqni sezmaydi.

═══════════════════════════════════════
  QANDAY YOQISH
═══════════════════════════════════════

// Butun ilova uchun (main.tsx da)
<StrictMode>
  <App />
</StrictMode>

// Faqat ma'lum qism uchun
<StrictMode>
  <ProblematicComponent />
</StrictMode>`,
    codeExamples: [
        {
            title: 'StrictMode — effect ikki marta ishlashi',
            language: 'tsx' as const,
            code: `import { StrictMode, useState, useEffect } from 'react'

function Timer() {
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    console.log('Effect SETUP — timer boshlandi')
    const id = setInterval(() => {
      setSeconds(s => s + 1)
    }, 1000)

    // ✅ Cleanup TO'G'RI yozilgan — StrictMode buni tekshiradi
    return () => {
      console.log('Effect CLEANUP — timer to\\'xtatildi')
      clearInterval(id)
    }
  }, [])

  // StrictMode da console:
  // 1. "Effect SETUP — timer boshlandi"
  // 2. "Effect CLEANUP — timer to'xtatildi"  (darhol cleanup)
  // 3. "Effect SETUP — timer boshlandi"       (qayta setup)
  // Production da faqat 1-qadamni ko'rasiz

  return <p>Sekundlar: {seconds}</p>
}

// ❌ XATO: cleanup yo'q — StrictMode 2 ta timer yaratadi
function BadTimer() {
  useEffect(() => {
    const id = setInterval(() => {
      console.log('tick')
    }, 1000)
    // cleanup YO'Q — StrictMode xatoni ko'rsatadi
    // 2 ta timer ishlaydi, lekin 1 ta tozalanmaydi!
  }, [])

  return <p>Buzilgan timer</p>
}

function App() {
  return (
    <StrictMode>
      <Timer />
    </StrictMode>
  )
}`,
            description: 'StrictMode development-da effect-ni ikki marta ishlaydi (setup → cleanup → setup). Bu cleanup to\'g\'ri yozilganini tekshiradi. Cleanup bo\'lmasa — xato aniqlanadi.',
        },
    ],
    interviewQA: [
        {
            question: 'React StrictMode nima qiladi?',
            answer: 'StrictMode faqat development rejimida ishlaydi va 3 ta narsa qiladi: 1) Har komponentni 2 marta render qiladi — pure bo\'lmagan komponentlarni topish uchun, 2) useEffect setup+cleanup-ni 2 marta ishlaydi — cleanup to\'g\'ri yozilganini tekshirish uchun, 3) Eskirgan API ishlatilsa ogohlantiradi. Production-da StrictMode kodi butunlay olib tashlanadi.',
        },
        {
            question: 'Nima uchun useEffect StrictMode da ikki marta ishlaydi?',
            answer: 'StrictMode effect-ni ikki marta ishlatadi (setup → cleanup → setup) cleanup funksiyasi TO\'G\'RI yozilganini tekshirish uchun. Masalan, setInterval boshlasangiz lekin cleanup-da clearInterval qilmasangiz — StrictMode da 2 ta timer ishlaydi va xato aniq ko\'rinadi. Bu concurrent rendering uchun tayyorgarlik ham — React istalgan vaqtda effect-ni qayta ishlashi mumkin.',
        },
    ],
    relatedTopics: [
        { sectionId: 'react-core', topicId: 'use-effect', label: 'useEffect (ikki marta chaqiriladi)' },
        { sectionId: 'react-core', topicId: 'rendering-cycle', label: 'Rendering Cycle' },
    ],
},
// ═══════════════════════════════════════
//   REACT EVENT SYSTEM
// ═══════════════════════════════════════
{
    id: 'event-system',
    title: 'React Event System',
    importance: 2,
    status: 'to-learn' as const,
    description: 'SyntheticEvent, Event Delegation, React event tizimi ishlash prinsipi',
    content: `React o\\'zining event tizimiga ega — SyntheticEvent. Bu brauzerlar orasidagi farqlarni yo\\'qotadi va performance-ni oshiradi.

═══════════════════════════════════════
  SYNTHETICEVENT NIMA
═══════════════════════════════════════

SyntheticEvent — React-ning cross-browser event wrapper-i.
Barcha brauzerlarda BIR XIL ishlaydi.

React native brauzer event-ni o\\'rab oladi:
onClick → SyntheticEvent(MouseEvent)
onChange → SyntheticEvent(InputEvent)
onKeyDown → SyntheticEvent(KeyboardEvent)

Native event-ga kirish: event.nativeEvent

═══════════════════════════════════════
  EVENT DELEGATION
═══════════════════════════════════════

React BARCHA event-larni root elementga qo\\'yadi (bitta listener).
Har bir button-ga alohida listener qo\\'yMAYDI.

1000 ta button = 1000 ta listener ❌ (oddiy JS)
1000 ta button = 1 ta listener ✅ (React)

Bu "Event Delegation" deyiladi — performance uchun yaxshi.

React 17+: root container-ga (document emas)
React 16: document-ga qo\\'yardi

═══════════════════════════════════════
  onClick vs addEventListener
═══════════════════════════════════════

React: <button onClick={handler}> — JSX ichida, declarative
JS: element.addEventListener(\\'click\\', handler) — imperative

React usulining afzalliklari:
- Avtomatik cleanup (unmount-da listener olib tashlanadi)
- Cross-browser muvofiqlik
- Event delegation performance

═══════════════════════════════════════
  event.preventDefault() va event.stopPropagation()
═══════════════════════════════════════

preventDefault(): Brauzer default harakatni to\\'xtatish
- Form submit → sahifa yangilanishini to\\'xtatish
- Link click → sahifa o\\'tishini to\\'xtatish

stopPropagation(): Event yuqoriga (parent-ga) ko\\'tarilishini to\\'xtatish
- Child onClick ishlaydi, Parent onClick ISHLAMAYDI

═══════════════════════════════════════
  EVENT POOLING (OLIB TASHLANGAN)
═══════════════════════════════════════

React 16 da event QAYTA ISHLATILARDI (pooling).
event.persist() chaqirish kerak edi async funksiyada.

React 17+ da event pooling OLIB TASHLANDI.
event.persist() kerak EMAS. Intervyu da eslating.`,
    codeExamples: [
        {
            title: 'Form submit va input change — event ishlatish',
            language: 'tsx' as const,
            code: `import { useState, type FormEvent, type ChangeEvent } from 'react'

function EventDemo() {
  const [name, setName] = useState('')
  const [submitted, setSubmitted] = useState(false)

  // FormEvent — form submit uchun tip
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault() // Sahifa yangilanishini to'xtatish
    console.log('Form yuborildi:', name)
    setSubmitted(true)
  }

  // ChangeEvent — input o'zgarishi uchun tip
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
    console.log('Native event:', e.nativeEvent) // Brauzer native event
  }

  // stopPropagation — parent-ga event ko'tarilishini to'xtatish
  const handleChildClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    console.log('Faqat child bosildi, parent bilMAYDI')
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={name}
        onChange={handleChange}
        placeholder="Ismingiz"
      />

      {/* Event Delegation misoli */}
      <div onClick={() => console.log('Parent bosildi')}>
        <button type="button" onClick={handleChildClick}>
          Child (stopPropagation)
        </button>
      </div>

      <button type="submit">Yuborish</button>
      {submitted && <p>Yuborildi: {name}</p>}
    </form>
  )
}`,
            description: 'preventDefault form submit-ni, stopPropagation event bubbling-ni to\'xtatadi. TypeScript bilan FormEvent, ChangeEvent, MouseEvent tiplarini ishlatish.',
        },
    ],
    interviewQA: [
        {
            question: 'SyntheticEvent nima?',
            answer: 'SyntheticEvent — React-ning cross-browser event wrapper-i. React native brauzer eventni o\'rab oladi va barcha brauzerlarda BIR XIL interfeys beradi. Masalan, onClick SyntheticEvent(MouseEvent) qaytaradi. Native event-ga event.nativeEvent orqali kirish mumkin. React 17+ da event pooling olib tashlangan — event.persist() kerak emas.',
        },
        {
            question: 'React Event Delegation qanday ishlaydi?',
            answer: 'React BARCHA event listener-larni root elementga qo\'yadi (bitta listener). Har bir elementga alohida listener qo\'ymaydi. 1000 ta button bo\'lsa ham React faqat 1 ta listener ishlatadi — bu Event Delegation. Event sodir bo\'lganda React uni root-da ushlaydi va to\'g\'ri komponentga yo\'naltiradi. React 17+ dan boshlab listener document emas, root container-ga qo\'yiladi.',
        },
        {
            question: 'preventDefault va stopPropagation farqi nima?',
            answer: 'preventDefault — brauzer default harakatini to\'xtatadi. Masalan, form submit-da sahifa yangilanishini, link click-da sahifa o\'tishini to\'xtatadi. stopPropagation — event bubbling-ni to\'xtatadi, ya\'ni event parent elementlarga ko\'tarilmaydi. Masalan, child onClick ishlaydi, lekin parent onClick ISHLAMAYDI. Ikkalasi ham turli muammolarni hal qiladi.',
        },
    ],
    relatedTopics: [
        { sectionId: 'typescript-react', topicId: 'event-types', label: 'Event tipizatsiyasi' },
        { sectionId: 'component-patterns', topicId: 'controlled-vs-uncontrolled', label: 'Form eventlari' },
    ],
},
// ═══════════════════════════════════════
//   JSX TRANSFORM
// ═══════════════════════════════════════
{
    id: 'jsx-transform',
    title: 'JSX Transform',
    importance: 2,
    status: 'to-learn' as const,
    description: 'JSX nima, qanday JavaScript-ga aylanadi, old va new transform farqi',
    content: `JSX — JavaScript-ning kengaytmasi bo\\'lib, HTML-ga o\\'xshash sintaksis bilan UI yozish imkonini beradi. Brauzer JSX-ni TUSHMAYDI — u avval JavaScript-ga aylantiriladi.

═══════════════════════════════════════
  JSX NIMA
═══════════════════════════════════════

JSX = JavaScript XML — syntax sugar.
Bu HTML EMAS, JavaScript EMAS — ikkalasi orasidagi ko\\'prik.

const element = <h1 className="title">Salom</h1>

Bu brauzerga TUSHMAYDI. Build vaqtida JavaScript-ga aylanadi.

═══════════════════════════════════════
  OLD TRANSFORM (React 16 gacha)
═══════════════════════════════════════

// JSX
const element = <h1 className="title">Salom</h1>

// Aylanadi:
const element = React.createElement(\\'h1\\', { className: \\'title\\' }, \\'Salom\\')

MUAMMO: Har bir faylda "import React from \\'react\\'" yozish SHART edi.
Chunki React.createElement() ishlatiladi.

═══════════════════════════════════════
  NEW TRANSFORM (React 17+)
═══════════════════════════════════════

// JSX
const element = <h1 className="title">Salom</h1>

// Aylanadi:
import { jsx as _jsx } from \\'react/jsx-runtime\\'
const element = _jsx(\\'h1\\', { className: \\'title\\', children: \\'Salom\\' })

AFZALLIGI:
- "import React" yozish KERAK EMAS — avtomatik import
- Bundle hajmi bir oz kichikroq
- tsconfig.json da: "jsx": "react-jsx" (eski: "react")

═══════════════════════════════════════
  JSX QOIDALARI
═══════════════════════════════════════

1. BITTA ROOT element: <div>...</div> yoki <Fragment> yoki <>...</>
2. className (class emas — JS da class kalit so\\'z)
3. htmlFor (for emas — JS da for kalit so\\'z)
4. camelCase atributlar: onClick, onChange, tabIndex
5. style object: style={{ color: \\'red\\', fontSize: 16 }}
6. {expression} — JS ifodalar: {name}, {1 + 2}, {isAdmin && <Admin />}

═══════════════════════════════════════
  FRAGMENT (<> </>)
═══════════════════════════════════════

Qo\\'shimcha DOM element yaratmasdan bir nechta elementni qaytarish:

// Keraksiz div
<div><h1>A</h1><p>B</p></div>

// Fragment — DOM-da qo'shimcha element YO'Q
<><h1>A</h1><p>B</p></>

// Key kerak bo'lsa:
<Fragment key={item.id}><h1>A</h1><p>B</p></Fragment>`,
    codeExamples: [
        {
            title: 'JSX → createElement aylanishi',
            language: 'tsx' as const,
            code: `// ===== JSX YOZASIZ: =====

function Greeting({ name }: { name: string }) {
  return (
    <div className="card">
      <h1>Salom, {name}!</h1>
      {name === 'Admin' && <p style={{ color: 'red' }}>Maxsus kirish</p>}
      <ul>
        {['React', 'Vue', 'Angular'].map(fw => (
          <li key={fw}>{fw}</li>
        ))}
      </ul>
    </div>
  )
}

// ===== REACT 17+ (NEW TRANSFORM) GA AYLANADI: =====
// import { jsx, jsxs } from 'react/jsx-runtime'
//
// function Greeting({ name }) {
//   return jsxs('div', {
//     className: 'card',
//     children: [
//       jsx('h1', { children: ['Salom, ', name, '!'] }),
//       name === 'Admin' && jsx('p', {
//         style: { color: 'red' },
//         children: 'Maxsus kirish'
//       }),
//       jsx('ul', {
//         children: ['React', 'Vue', 'Angular'].map(fw =>
//           jsx('li', { children: fw }, fw)
//         )
//       })
//     ]
//   })
// }

// MUHIM: "import React" yo'q — avtomatik import!
// tsconfig.json: "jsx": "react-jsx"`,
            description: 'JSX build vaqtida jsx() funksiya chaqiruvlariga aylanadi. React 17+ da import avtomatik — "import React" yozish kerak emas. Bu new JSX transform deyiladi.',
        },
    ],
    interviewQA: [
        {
            question: 'JSX nima va brauzer uni tushuna oladimi?',
            answer: 'JSX — JavaScript XML — syntax sugar bo\'lib, HTML-ga o\'xshash sintaksis bilan UI yozish imkonini beradi. Brauzer JSX-ni TUSHMAYDI. Build vaqtida (Babel/TypeScript orqali) oddiy JavaScript-ga aylantiriladi. <h1>Salom</h1> → jsx(\'h1\', { children: \'Salom\' }) ga aylanadi.',
        },
        {
            question: 'Old va New JSX transform farqi nima?',
            answer: 'Old transform (React 16-): JSX React.createElement() ga aylanardi, shu sababli har faylda "import React from \'react\'" yozish SHART edi. New transform (React 17+): JSX jsx() funksiyaga aylanadi va import AVTOMATIK qo\'shiladi — "import React" yozish kerak emas. tsconfig.json da "jsx": "react-jsx" qo\'yiladi. Bundle hajmi ham bir oz kichikroq bo\'ladi.',
        },
        {
            question: 'JSX-ning asosiy qoidalari qanday?',
            answer: 'JSX qoidalari: 1) Bitta root element kerak (<div>, <Fragment>, yoki <>), 2) class emas className (JS da class kalit so\'z), 3) for emas htmlFor, 4) camelCase atributlar (onClick, onChange, tabIndex), 5) style object sifatida: style={{ color: \'red\' }}, 6) {expression} ichida JS yozish mumkin. Fragment (<></>) qo\'shimcha DOM element yaratmasdan bir nechta elementni qaytaradi.',
        },
    ],
    relatedTopics: [
        { sectionId: 'react-core', topicId: 'virtual-dom', label: 'Virtual DOM' },
        { sectionId: 'performance', topicId: 'react-compiler', label: 'React Compiler' },
    ],
}
]
