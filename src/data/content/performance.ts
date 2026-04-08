import type { Topic } from '../types'

export const performanceTopics: Topic[] = [
  {
    id: 're-render-causes',
    title: 'Re-render sabablari',
    importance: 3,
    status: 'to-learn',
    description: 'Props, state, context, parent re-render',
    content: `Re-render — React komponentning qayta chaqirilishi va virtual DOM-ni qayta hisoblashi. Re-render o'zi yomon EMAS — React tez. Lekin ortiqcha re-render KATTA ro'yxatlar yoki qimmat hisoblashlar bilan muammo bo'ladi.

═══════════════════════════════════════
  RENDER vs RE-RENDER
═══════════════════════════════════════

Initial render — komponent birinchi marta ekranga chiqishi.
Re-render — komponent qayta chaqirilishi (yangi JSX hisoblash).

MUHIM: re-render ≠ DOM yangilash!
  1. Re-render → yangi Virtual DOM hisoblanadi
  2. Diffing → eski va yangi VDOM taqqoslanadi
  3. Faqat FARQLAR haqiqiy DOM-ga yoziladi

Agar re-render natijasi eski bilan bir xil bo'lsa — DOM umuman o'zgarMAYDI.

═══════════════════════════════════════
  RE-RENDER SABABLARI (4 TA)
═══════════════════════════════════════

1. STATE O'ZGARISHI
   setState chaqirilsa — komponent re-render bo'ladi.
   Bu eng asosiy va TO'G'RI sabab.

   const [count, setCount] = useState(0)
   setCount(1) // → re-render

2. PROPS O'ZGARISHI
   Ota komponent yangi props bersa — bola re-render bo'ladi.
   LEKIN aslida bu 3-sabab (parent re-render) tufayli bo'ladi.

3. PARENT RE-RENDER (eng ko'p muammo!)
   Ota komponent re-render bo'lsa — BARCHA bolalar ham re-render bo'ladi.
   Hatto props o'zgarMAGAN bo'lsa ham!

   function Parent() {
     const [count, setCount] = useState(0)
     return (
       <div>
         <p>{count}</p>
         <Child />  {/* count bilan ishi YO'Q, lekin re-render bo'ladi! */}
       </div>
     )
   }

4. CONTEXT O'ZGARISHI
   useContext ishlatgan komponent — context value o'zgarsa re-render.
   React.memo ham YORDAM BERMAYDI.

═══════════════════════════════════════
  PARENT RE-RENDER MUAMMOSI
═══════════════════════════════════════

Ota re-render bo'lganda React JSX-ni qayta baholaydi:

  <Child name="Ali" />

Bu ASLIDA:
  React.createElement(Child, { name: "Ali" })

Har re-render-da YANGI props object yaratiladi:
  { name: "Ali" } !== { name: "Ali" }  // referens farq!

Shuning uchun React bola komponentni ham re-render qiladi.

YECHIMLAR:
  1. React.memo — props o'zgarmasa re-render qilMAYDI
  2. Composition — bolani yuqoriga ko'tarish (children prop)
  3. State-ni pastga tushirish — state kerakli joyda

═══════════════════════════════════════
  COMPOSITION BILAN OPTIMIZATSIYA
═══════════════════════════════════════

React.memo-siz ham optimizatsiya mumkin:

  // MUAMMO: HeavyList har click-da re-render
  function Page() {
    const [count, setCount] = useState(0)
    return (
      <div>
        <button onClick={() => setCount(c => c + 1)}>{count}</button>
        <HeavyList />  {/* keraksiz re-render! */}
      </div>
    )
  }

  // YECHIM 1: state-ni pastga tushirish
  function Page() {
    return (
      <div>
        <Counter />        {/* state shu ichida */}
        <HeavyList />      {/* re-render BO'LMAYDI */}
      </div>
    )
  }

  // YECHIM 2: children pattern
  function CounterWrapper({ children }) {
    const [count, setCount] = useState(0)
    return (
      <div>
        <button onClick={() => setCount(c => c + 1)}>{count}</button>
        {children}  {/* children QAYTA YARATILMAYDI */}
      </div>
    )
  }

  <CounterWrapper>
    <HeavyList />  {/* re-render BO'LMAYDI */}
  </CounterWrapper>

═══════════════════════════════════════
  RE-RENDER EMAS — HAQIQIY MUAMMO
═══════════════════════════════════════

Re-render o'zi tez — oddiy funksiya chaqirish.
Haqiqiy muammo — QIMMAT re-render:
  ❌ Katta ro'yxat (1000+ element) qayta renderlanishi
  ❌ Murakkab hisoblash har render-da ishlashi
  ❌ Qimmat DOM operatsiyalar

Agar re-render tez bo'lsa — optimizatsiya KERAK EMAS.
Premature optimization — vaqt isrof qilish.
Avval PROFILER bilan o'lchang, keyin optimizatsiya qiling.`,
    codeExamples: [
      {
        title: 'Re-render sabablari — demo',
        language: 'tsx',
        code: `import { useState, memo } from 'react'

// Re-render kuzatish uchun
function logRender(name: string) {
  console.log(\`\${name} rendered at \${Date.now()}\`)
}

// 1. PARENT RE-RENDER — bolalar ham re-render bo'ladi
function Parent() {
  const [count, setCount] = useState(0)
  logRender('Parent')

  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>
      <ChildA />      {/* props yo'q, lekin re-render bo'ladi! */}
      <ChildB name="Ali" />  {/* props o'zgarmagan, lekin re-render! */}
    </div>
  )
}

function ChildA() {
  logRender('ChildA')  // har click-da chaqiriladi
  return <p>Child A</p>
}

function ChildB({ name }: { name: string }) {
  logRender('ChildB')  // har click-da chaqiriladi
  return <p>Child B: {name}</p>
}

// 2. YECHIM — React.memo
const MemoChildA = memo(function MemoChildA() {
  logRender('MemoChildA')  // faqat 1 marta
  return <p>Memo Child A</p>
})

const MemoChildB = memo(function MemoChildB({ name }: { name: string }) {
  logRender('MemoChildB')  // name o'zgarmasa — re-render YO'Q
  return <p>Memo Child B: {name}</p>
})`,
        description: 'Parent re-render — barcha bolalar ham re-render. React.memo bilan props o\'zgarmasa re-render to\'xtatiladi. Console.log bilan re-render-larni kuzatish.',
      },
      {
        title: 'Composition pattern — memo-siz optimizatsiya',
        language: 'tsx',
        code: `import { useState, type ReactNode } from 'react'

// ❌ MUAMMO: HeavyComponent har click-da re-render
function BadPage() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>
        Count: {count}
      </button>
      <HeavyComponent />  {/* 1000 element — har click-da re-render! */}
    </div>
  )
}

// ✅ YECHIM 1: State-ni pastga tushirish
function GoodPage() {
  return (
    <div>
      <Counter />          {/* state shu ichida */}
      <HeavyComponent />   {/* re-render BO'LMAYDI */}
    </div>
  )
}

function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>
}

// ✅ YECHIM 2: Children pattern
function CounterLayout({ children }: { children: ReactNode }) {
  const [count, setCount] = useState(0)

  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>
      {children}  {/* ota tomondan yaratilgan — qayta YARATILMAYDI */}
    </div>
  )
}

function BestPage() {
  return (
    <CounterLayout>
      <HeavyComponent />  {/* re-render BO'LMAYDI */}
    </CounterLayout>
  )
}

function HeavyComponent() {
  console.log('HeavyComponent rendered')
  return (
    <ul>
      {Array.from({ length: 1000 }, (_, i) => (
        <li key={i}>Element {i}</li>
      ))}
    </ul>
  )
}`,
        description: 'Memo-siz optimizatsiya: 1) State-ni pastga tushirish — faqat kerakli komponent re-render, 2) Children pattern — children ota tomonidan yaratilgan, qayta yaratilmaydi.',
      },
      {
        title: 'Context re-render muammosi va yechimi',
        language: 'tsx',
        code: `import { createContext, useContext, useState, memo, type ReactNode } from 'react'

// ❌ MUAMMO: bitta katta context — hamma re-render bo'ladi
const AppContext = createContext<{
  user: string
  theme: string
  setUser: (u: string) => void
  setTheme: (t: string) => void
} | null>(null)

function BadProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState('Ali')
  const [theme, setTheme] = useState('light')

  // user O'ZGARSA — theme ishlatgan komponentlar HAM re-render!
  return (
    <AppContext.Provider value={{ user, theme, setUser, setTheme }}>
      {children}
    </AppContext.Provider>
  )
}

// ✅ YECHIM: Context ajratish
const UserContext = createContext<{
  user: string
  setUser: (u: string) => void
} | null>(null)

const ThemeContext = createContext<{
  theme: string
  setTheme: (t: string) => void
} | null>(null)

// user o'zgarsa — faqat UserContext ishlatganlar re-render
// theme o'zgarsa — faqat ThemeContext ishlatganlar re-render

// MUHIM: React.memo Context re-render-dan HIMOYA QILMAYDI!
const MemoChild = memo(function MemoChild() {
  const { theme } = useContext(ThemeContext)!
  // theme o'zgarsa — memo bo'lsa ham RE-RENDER BO'LADI
  return <p>{theme}</p>
})`,
        description: 'Context value o\'zgarsa — useContext ishlatgan BARCHA komponentlar re-render, React.memo ham yordam BERMAYDI. Yechim: context-ni kichik, mustaqil qismlarga ajratish.',
      },
    ],
    interviewQA: [
      {
        question: 'React-da re-render qachon bo\'ladi?',
        answer: `4 ta sabab: 1) State o'zgarishi — setState chaqirilsa, 2) Parent re-render — ota re-render bo'lsa BARCHA bolalar ham re-render (hatto props o'zgarmasa ham), 3) Context o'zgarishi — useContext ishlatgan komponentlar, React.memo ham yordam bermaydi, 4) forceUpdate (class komponent). Eng ko'p muammo — parent re-render: ota-da state o'zgarsa barcha bolalar qayta chaqiriladi. Yechim: React.memo, composition pattern, state-ni pastga tushirish.`,
      },
      {
        question: 'Re-render va DOM yangilash bir xil narsami?',
        answer: `Yo'q! Re-render — komponent funksiyasining qayta chaqirilishi va yangi Virtual DOM hisoblash. DOM yangilash — haqiqiy DOM-ga o'zgarish yozish. Jarayon: re-render → yangi VDOM → diffing (eski vs yangi taqqoslash) → faqat FARQLAR DOM-ga yoziladi. Agar re-render natijasi eski bilan bir xil bo'lsa — DOM umuman o'zgarMAYDI. Shuning uchun re-render o'zi tez — muammo faqat juda ko'p yoki juda qimmat re-render-larda.`,
      },
      {
        question: 'Composition pattern bilan re-render-ni qanday kamaytirish mumkin?',
        answer: `2 ta usul: 1) State-ni pastga tushirish — state kerakli komponent ichiga ko'chirish. Shunda faqat shu komponent re-render bo'ladi, boshqa bolalar ta'sirlanmaydi. 2) Children pattern — children prop ota komponent tomonidan yaratiladi, shuning uchun ichki state o'zgarsa ham children qayta yaratilMAYDI. Bu React.memo-ga qaraganda yaxshiroq — qo'shimcha abstraction qo'shmaydi, kodni osonroq tushunish mumkin.`,
      },
      {
        question: 'Context re-render muammosi nima va qanday hal qilinadi?',
        answer: `Context value o'zgarsa — useContext ishlatgan BARCHA komponentlar re-render bo'ladi. React.memo ham YORDAM BERMAYDI — chunki context ichki subscription orqali ishlaydi. Yechimlar: 1) Context ajratish — har bir concern (user, theme, settings) uchun alohida context, 2) useMemo bilan value memoization — keraksiz value o'zgarishini oldini olish, 3) Tez-tez o'zgaradigan data uchun Zustand/Redux ishlatish — ular selector pattern bilan faqat kerakli qism o'zgarganda re-render qiladi.`,
      },
      {
        question: 'Qachon re-render optimizatsiya qilish kerak, qachon kerak emas?',
        answer: `KERAK EMAS: oddiy komponentlar (tugma, input, karta), kichik ro'yxatlar (<100), tez hisoblashlar. Re-render o'zi tez — premature optimization vaqt isrof. KERAK: katta ro'yxatlar (1000+ element), qimmat hisoblashlar (filtering, sorting), tez-tez o'zgaradigan state (typing, scrolling), Profiler ko'rsatsa. Qoida: AVVAL Profiler bilan o'lchang, muammo BORLIGINI aniqlang, KEYIN optimizatsiya qiling. "O'lchang, keyin optimizatsiya" — boshqacha emas.`,
      },
    ],
    relatedTopics: [
      { sectionId: 'react-core', topicId: 'rendering-cycle', label: 'Rendering Cycle' },
      { sectionId: 'react-core', topicId: 'batching', label: 'Batching' },
      { sectionId: 'performance', topicId: 'memo-usememo-usecallback', label: 'Memoization' },
      { sectionId: 'state-management', topicId: 'context-api', label: 'Context re-render' },
    ],
  },
  {
    id: 'memo-usememo-usecallback',
    title: 'React.memo + useMemo + useCallback',
    importance: 3,
    status: 'to-learn',
    description: 'Qachon ishlatish, qachon ortiqcha',
    content: `React-ning 3 ta memoization vositasi — React.memo, useMemo, useCallback. Har birining aniq maqsadi bor. Noto'g'ri ishlatish — performance-ni yomonlashtirishi mumkin.

═══════════════════════════════════════
  React.memo — KOMPONENT MEMOIZATSIYA
═══════════════════════════════════════

React.memo — HOC. Props o'zgarmasa komponentni RE-RENDER QILMAYDI.

  const MemoChild = memo(function Child({ name }: { name: string }) {
    return <p>{name}</p>
  })

Qanday ishlaydi:
  1. Re-render bo'lsa — oldingi va yangi PROPS taqqoslanadi
  2. Barcha prop-lar === bilan bir xil → RE-RENDER YO'Q
  3. Biror prop farq qilsa → re-render

MUAMMO — object/function props:
  function Parent() {
    const style = { color: 'red' }         // har renderda YANGI object
    const handleClick = () => {}            // har renderda YANGI function
    return <MemoChild style={style} onClick={handleClick} />
    // memo ISHLAMAYDI — chunki har safar yangi referens!
  }

YECHIM — useMemo va useCallback:
  const style = useMemo(() => ({ color: 'red' }), [])
  const handleClick = useCallback(() => {}, [])

═══════════════════════════════════════
  useMemo — QIYMAT MEMOIZATSIYA
═══════════════════════════════════════

useMemo — qimmat hisoblashni keshlash:

  const sortedList = useMemo(
    () => items.sort((a, b) => a.name.localeCompare(b.name)),
    [items]  // faqat items o'zgarganda qayta hisoblash
  )

Qachon kerak:
  ✅ Qimmat hisoblash (sort, filter, reduce katta array-da)
  ✅ Object/array referensni saqlab turish (memo bilan birga)
  ✅ Context value memoizatsiya

Qachon KERAK EMAS:
  ❌ Oddiy hisoblash (string concatenation, oddiy math)
  ❌ Primitive qiymatlar (string, number — referens muammo yo'q)
  ❌ Har renderda o'zgaradigan dependency

═══════════════════════════════════════
  useCallback — FUNKSIYA MEMOIZATSIYA
═══════════════════════════════════════

useCallback — funksiya referensini saqlash:

  const handleClick = useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id))
  }, [])  // dependency yo'q — doim bitta referens

useCallback ≈ useMemo(() => fn, deps)
  // Ikkalasi bir xil natija beradi

Qachon kerak:
  ✅ memo-langan bolaga callback berish
  ✅ useEffect dependency sifatida
  ✅ Custom hook-dan qaytarilgan funksiya

Qachon KERAK EMAS:
  ❌ Bola memo-lanMAGAN bo'lsa (memo-siz useCallback foydasiz)
  ❌ DOM elementga berish (<button onClick={fn}> — memo qilinMaydi)
  ❌ Har renderda o'zgaradigan dependency

═══════════════════════════════════════
  UCHALA BIRGA — TO'LIQ PATTERN
═══════════════════════════════════════

  function Parent({ items }) {
    // useMemo — qimmat hisoblash
    const sortedItems = useMemo(
      () => items.sort((a, b) => a.price - b.price),
      [items]
    )

    // useCallback — funksiya referens
    const handleDelete = useCallback((id: string) => {
      deleteItem(id)
    }, [])

    return <ItemList items={sortedItems} onDelete={handleDelete} />
  }

  // React.memo — props o'zgarmasa re-render yo'q
  const ItemList = memo(function ItemList({ items, onDelete }) {
    return items.map(item => (
      <Item key={item.id} item={item} onDelete={onDelete} />
    ))
  })

═══════════════════════════════════════
  QACHON ISHLATMASLIK KERAK
═══════════════════════════════════════

Ortiqcha memoizatsiya YOMONLASHTIRADI:
  1. Xotira sarfi — memo qilingan qiymatlar xotirada saqlanadi
  2. Dependency taqqoslash — har render-da deps === tekshirish
  3. Kod murakkabligi — o'qish qiyinlashadi

Qoida: AVVAL Profiler bilan muammo borligini tekshiring.
Agar re-render 1-2ms bo'lsa — memo KERAK EMAS.
Agar re-render 16ms+ bo'lsa — optimizatsiya kerak.

React Compiler bularni AVTOMATIK qiladi — kelajakda
useMemo/useCallback qo'lda yozish kamaytadi.`,
    codeExamples: [
      {
        title: 'React.memo — to\'g\'ri ishlatish',
        language: 'tsx',
        code: `import { memo, useState, useCallback, useMemo } from 'react'

interface Product {
  id: string
  name: string
  price: number
}

// memo bilan — props o'zgarmasa re-render YO'Q
const ProductCard = memo(function ProductCard({
  product,
  onDelete,
}: {
  product: Product
  onDelete: (id: string) => void
}) {
  console.log('ProductCard render:', product.name)

  return (
    <div className="border p-4 rounded">
      <h3>{product.name}</h3>
      <p>{product.price} so'm</p>
      <button onClick={() => onDelete(product.id)}>O'chirish</button>
    </div>
  )
})

function ProductList() {
  const [products, setProducts] = useState<Product[]>([
    { id: '1', name: 'Laptop', price: 5000000 },
    { id: '2', name: 'Telefon', price: 3000000 },
    { id: '3', name: 'Naushnik', price: 200000 },
  ])
  const [filter, setFilter] = useState('')

  // useMemo — filterlash qimmat bo'lishi mumkin
  const filteredProducts = useMemo(
    () => products.filter(p =>
      p.name.toLowerCase().includes(filter.toLowerCase())
    ),
    [products, filter]
  )

  // useCallback — ProductCard memo bilan ishlatilgani uchun kerak
  const handleDelete = useCallback((id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id))
  }, [])

  return (
    <div>
      <input
        value={filter}
        onChange={e => setFilter(e.target.value)}
        placeholder="Qidirish..."
      />
      {filteredProducts.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onDelete={handleDelete}  // bir xil referens
        />
      ))}
    </div>
  )
}`,
        description: 'To\'liq pattern: memo(ProductCard) + useCallback(handleDelete) + useMemo(filteredProducts). Filter o\'zgarganda faqat ko\'rinadigan kartalar re-render.',
      },
      {
        title: 'useMemo — qimmat hisoblash',
        language: 'tsx',
        code: `import { useMemo, useState } from 'react'

interface Employee {
  id: string
  name: string
  department: string
  salary: number
}

function EmployeeDashboard({ employees }: { employees: Employee[] }) {
  const [department, setDepartment] = useState('all')
  const [sortBy, setSortBy] = useState<'name' | 'salary'>('name')

  // ✅ useMemo — 10000+ xodim bo'lsa qimmat
  const processedEmployees = useMemo(() => {
    console.log('Filtering and sorting...')

    let result = employees
    if (department !== 'all') {
      result = result.filter(e => e.department === department)
    }

    return result.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      return b.salary - a.salary
    })
  }, [employees, department, sortBy])

  // ✅ useMemo — statistika hisoblash
  const stats = useMemo(() => ({
    total: processedEmployees.length,
    avgSalary: processedEmployees.reduce((s, e) => s + e.salary, 0)
      / (processedEmployees.length || 1),
    maxSalary: Math.max(...processedEmployees.map(e => e.salary), 0),
  }), [processedEmployees])

  // ❌ useMemo KERAK EMAS — oddiy hisoblash
  // const greeting = useMemo(() => 'Salom, ' + userName, [userName])
  // const isEven = useMemo(() => count % 2 === 0, [count])

  return (
    <div>
      <p>Jami: {stats.total}, O'rtacha: {stats.avgSalary.toLocaleString()}</p>
      <select value={department} onChange={e => setDepartment(e.target.value)}>
        <option value="all">Hammasi</option>
        <option value="IT">IT</option>
        <option value="HR">HR</option>
      </select>
      {processedEmployees.map(e => (
        <div key={e.id}>{e.name} — {e.salary.toLocaleString()}</div>
      ))}
    </div>
  )
}`,
        description: 'useMemo — katta array filtering/sorting, statistika hisoblash. Oddiy hisoblashlar uchun (string concat, math) useMemo KERAK EMAS — overhead foydasidan katta.',
      },
      {
        title: 'useCallback — qachon kerak, qachon emas',
        language: 'tsx',
        code: `import { useCallback, memo, useState, useEffect } from 'react'

// ✅ KERAK — memo-langan bolaga callback
const SearchInput = memo(function SearchInput({
  onSearch,
}: {
  onSearch: (query: string) => void
}) {
  console.log('SearchInput render')
  return <input onChange={e => onSearch(e.target.value)} />
})

function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<string[]>([])

  // ✅ useCallback — SearchInput memo bilan
  const handleSearch = useCallback((q: string) => {
    setQuery(q)
  }, [])

  return (
    <div>
      <SearchInput onSearch={handleSearch} />
      <p>Qidiruv: {query}</p>
    </div>
  )
}

// ✅ KERAK — useEffect dependency
function DataFetcher({ userId }: { userId: string }) {
  // useCallback-siz — har render-da fetchUser o'zgaradi
  // → useEffect cheksiz loop!
  const fetchUser = useCallback(async () => {
    const res = await fetch(\`/api/users/\${userId}\`)
    return res.json()
  }, [userId])

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  return <div>...</div>
}

// ❌ KERAK EMAS — oddiy DOM element
function SimpleButton() {
  const [count, setCount] = useState(0)

  // ❌ ortiqcha — button memo qilinMAGAN DOM element
  // const handleClick = useCallback(() => setCount(c => c + 1), [])

  // ✅ oddiy funksiya yetarli
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>
}`,
        description: 'useCallback kerak: memo-langan bolaga callback, useEffect dependency. KERAK EMAS: DOM elementga berish, bola memo qilinmagan bo\'lsa. memo-siz useCallback — foydasiz.',
      },
    ],
    interviewQA: [
      {
        question: 'React.memo, useMemo, useCallback farqi nima?',
        answer: `React.memo — KOMPONENT memoizatsiya. HOC — props o'zgarmasa re-render qilmaydi. useMemo — QIYMAT memoizatsiya. Qimmat hisoblash natijasini keshlaydi, dependency o'zgarganda qayta hisoblaydi. useCallback — FUNKSIYA memoizatsiya. Funksiya referensini saqlab turadi. Aslida useCallback(fn, deps) = useMemo(() => fn, deps). Uchovi birga ishlaydi: memo(Child) + useCallback(handler) + useMemo(data).`,
      },
      {
        question: 'React.memo-da object prop bo\'lsa nima bo\'ladi?',
        answer: `React.memo props-ni === (referens) bilan taqqoslaydi. Har render-da yangi object yaratilsa ({ color: 'red' } !== { color: 'red' }), memo ISHLAMAYDI. Yechim: useMemo bilan object referensni saqlab turish. Custom comparator ham mumkin: memo(Component, (prev, next) => prev.id === next.id) — lekin bu anti-pattern bo'lishi mumkin, chunki boshqa prop-lar e'tibordan qoladi.`,
      },
      {
        question: 'useMemo va oddiy o\'zgaruvchi farqi nima?',
        answer: `Oddiy o'zgaruvchi: const sorted = items.sort(...) — HAR RENDERDA qayta hisoblanadi. useMemo: const sorted = useMemo(() => items.sort(...), [items]) — faqat items o'zgarganda qayta hisoblanadi. Agar hisoblash arzon bo'lsa (1ms) — useMemo overhead (dependency tekshirish, xotira) foydasidan kattaroq. Agar hisoblash qimmat bo'lsa (10ms+, katta array) — useMemo yordam beradi. Qoida: Profiler bilan o'lchang.`,
      },
      {
        question: 'useCallback qachon haqiqatan kerak?',
        answer: `2 ta haqiqiy holat: 1) memo-langan bolaga callback berish — memo props-ni === bilan taqqoslaydi, har renderda yangi funksiya referens memo-ni buzadi. useCallback bir xil referens saqlaydi. 2) useEffect dependency — funksiya useEffect deps-da bo'lsa, useCallback-siz har renderda yangi funksiya → useEffect cheksiz loop. KERAK EMAS: DOM elementga berish (<button onClick>), bola memo qilinmagan, har renderda dependency o'zgaradigan holat.`,
      },
      {
        question: 'Ortiqcha memoizatsiya nima uchun yomon?',
        answer: `Memoizatsiya bepul emas: 1) Xotira — keshlangan qiymatlar xotirada saqlanadi, 2) CPU — har renderda dependency-lar === bilan taqqoslanadi, 3) Kod murakkabligi — o'qish va debug qiyinlashadi, 4) Yanglish xavfsizlik hissi — dependency noto'g'ri bo'lsa stale data. Agar re-render 1-2ms bo'lsa — memo foyda berMAYDI, faqat overhead qo'shadi. Qoida: avval Profiler bilan o'lchang, muammo BOR bo'lsa memo qiling. React Compiler buni avtomatik qiladi.`,
      },
    ],
    relatedTopics: [
      { sectionId: 'react-core', topicId: 'use-memo', label: 'useMemo' },
      { sectionId: 'react-core', topicId: 'use-callback', label: 'useCallback' },
      { sectionId: 'react-core', topicId: 'react-memo', label: 'React.memo' },
      { sectionId: 'performance', topicId: 'react-compiler', label: 'React Compiler (avtomatik)' },
    ],
  },
  {
    id: 'profiler-devtools',
    title: 'React Profiler / DevTools',
    importance: 3,
    status: 'to-learn',
    description: 'Performance bottleneck topish',
    content: `React DevTools va Profiler — performance muammolarni topish va tushunish uchun asosiy vositalar. "Avval o'lchang, keyin optimizatsiya" prinsipi.

═══════════════════════════════════════
  REACT DEVTOOLS
═══════════════════════════════════════

React DevTools — browser extension (Chrome, Firefox).
2 ta asosiy tab:

1. Components tab:
   - Komponent daraxtini ko'rish
   - Props, state, hooks-ni real-time ko'rish
   - Komponentni tanlash va o'zgartirish
   - "Highlight updates" — re-render ko'rsatish

2. Profiler tab:
   - Rendering performansini o'lchash
   - Har bir render-ning vaqtini ko'rish
   - Nima uchun re-render bo'lganini ko'rsatish

═══════════════════════════════════════
  HIGHLIGHT UPDATES
═══════════════════════════════════════

Components → Settings → "Highlight updates when components render"

Re-render bo'lgan komponentlar atrofida rangdor chegara paydo bo'ladi:
  Yashil — tez re-render (yaxshi)
  Sariq — o'rtacha (diqqat)
  Qizil — sekin re-render (muammo!)

Bu vizual tarzda qaysi komponentlar ortiqcha re-render
bo'layotganini ko'rsatadi.

═══════════════════════════════════════
  PROFILER — PERFORMANCE O'LCHASH
═══════════════════════════════════════

1. Profiler tab-ni oching
2. "Record" tugmasini bosing
3. Ilovani ishlatang (click, type, scroll)
4. "Stop" bosing
5. Natijalarni tahlil qiling

Profiler ko'rsatadi:
  - Flamegraph — komponentlar daraxtida har birining render vaqti
  - Ranked — eng sekin komponentlar yuqorida
  - Har komponent nima uchun re-render bo'lgani (props, state, parent)

═══════════════════════════════════════
  REACT PROFILER KOMPONENTI
═══════════════════════════════════════

Kod ichida performance o'lchash:

  import { Profiler } from 'react'

  function onRender(
    id: string,
    phase: 'mount' | 'update',
    actualDuration: number,
    baseDuration: number,
  ) {
    console.log(id, phase, actualDuration + 'ms')
  }

  <Profiler id="UserList" onRender={onRender}>
    <UserList />
  </Profiler>

actualDuration — haqiqiy render vaqti (memoization bilan)
baseDuration — memo-siz bo'lganda qancha vaqt ketishi

═══════════════════════════════════════
  BROWSER PERFORMANCE TOOLS
═══════════════════════════════════════

Chrome DevTools Performance tab:
  - JavaScript execution time
  - Layout/Paint/Composite vaqti
  - Long tasks (50ms+)
  - Memory usage

Lighthouse:
  - Performance score
  - Core Web Vitals
  - Optimization tavsiyalari

React Profiler — React-specific (komponent darajasi)
Chrome Performance — umumiy (JS, DOM, network)

═══════════════════════════════════════
  WHY DID YOU RENDER
═══════════════════════════════════════

@welldone-software/why-did-you-render — kutubxona.
Keraksiz re-render-larni konsolda ko'rsatadi:

  Component re-rendered — props are equal
  Props that caused re-render: onClick (new reference)

Development-da foyda — qaysi props ortiqcha re-render keltirayotganini ko'rsatadi.`,
    codeExamples: [
      {
        title: 'React Profiler komponenti',
        language: 'tsx',
        code: `import { Profiler, type ProfilerOnRenderCallback } from 'react'

// Render ma'lumotlarini yig'ish
const onRender: ProfilerOnRenderCallback = (
  id,            // Profiler id
  phase,         // 'mount' yoki 'update'
  actualDuration, // haqiqiy render vaqti (ms)
  baseDuration,   // memo-siz bo'lganda qancha vaqt ketishi (ms)
  startTime,      // render boshlangan vaqt
  commitTime,     // DOM-ga yozilgan vaqt
) => {
  // Development-da console
  if (actualDuration > 5) {
    console.warn(
      \`[Profiler] \${id} — \${phase} — \${actualDuration.toFixed(1)}ms (sekin!)\`
    )
  }

  // Production-da analytics yuborish
  // analytics.track('render', { id, phase, duration: actualDuration })
}

// Ishlatish — ixtiyoriy komponentni o'rash
function App() {
  return (
    <div>
      <Profiler id="Header" onRender={onRender}>
        <Header />
      </Profiler>

      <Profiler id="ProductList" onRender={onRender}>
        <ProductList />
      </Profiler>

      <Profiler id="Footer" onRender={onRender}>
        <Footer />
      </Profiler>
    </div>
  )
}`,
        description: 'Profiler — kod ichida render vaqtini o\'lchash. actualDuration vs baseDuration — memoization qanchalik yordam berayotganini ko\'rsatadi. Production-da analytics-ga yuborish mumkin.',
      },
      {
        title: 'Performance debugging — qadam-baqadam',
        language: 'tsx',
        code: `import { memo, useMemo, useCallback, useState } from 'react'

// 1. MUAMMONI ANIQLASH — console.log bilan
function SlowComponent({ items }: { items: Item[] }) {
  console.log('SlowComponent render') // qancha chaqirilayotganini ko'rish
  console.time('SlowComponent')

  const sorted = items.sort((a, b) => a.name.localeCompare(b.name))

  console.timeEnd('SlowComponent') // render vaqti

  return <ul>{sorted.map(i => <li key={i.id}>{i.name}</li>)}</ul>
}

// 2. PROFILER BILAN O'LCHASH
// React DevTools → Profiler → Record → Interact → Stop
// Flamegraph-da SlowComponent qizil bo'lsa — muammo BOR

// 3. SABAB ANIQLASH
// DevTools → Profiler → "Why did this render?"
// Props changed? State changed? Parent re-render?

// 4. OPTIMIZATSIYA QILISH
const OptimizedComponent = memo(function OptimizedComponent({
  items,
  onSelect,
}: {
  items: Item[]
  onSelect: (id: string) => void
}) {
  // Qimmat sort — faqat items o'zgarganda
  const sorted = useMemo(
    () => [...items].sort((a, b) => a.name.localeCompare(b.name)),
    [items]
  )

  return (
    <ul>
      {sorted.map(i => (
        <li key={i.id} onClick={() => onSelect(i.id)}>
          {i.name}
        </li>
      ))}
    </ul>
  )
})

// 5. PARENT-DA CALLBACK MEMOIZATSIYA
function Parent() {
  const [items] = useState<Item[]>(generateItems(10000))
  const [selected, setSelected] = useState<string | null>(null)

  const handleSelect = useCallback((id: string) => {
    setSelected(id)
  }, [])

  return (
    <div>
      <p>Tanlangan: {selected}</p>
      <OptimizedComponent items={items} onSelect={handleSelect} />
    </div>
  )
}`,
        description: 'Performance debugging 5 qadam: 1) console.log bilan re-render aniqlash, 2) Profiler bilan o\'lchash, 3) sabab topish, 4) memo/useMemo/useCallback qo\'llash, 5) qayta o\'lchash.',
      },
    ],
    interviewQA: [
      {
        question: 'React DevTools Profiler qanday ishlatiladi?',
        answer: `Profiler tab → Record → ilovani ishlatish → Stop. Flamegraph ko'rsatadi: har komponentning render vaqti (rang bilan — yashil=tez, qizil=sekin). Ranked view — eng sekin komponentlar yuqorida. Har komponentda "Why did this render?" — props, state, yoki parent re-render ekanini ko'rsatadi. actualDuration — haqiqiy vaqt (memo bilan), baseDuration — memo-siz vaqt. Components tab-da "Highlight updates" — real-time re-render-larni vizual ko'rsatadi.`,
      },
      {
        question: 'Performance muammoni qanday topasiz va hal qilasiz?',
        answer: `1) Muammoni sezish — UI sekin, typing lag, scroll tiqilib qolishi. 2) O'lchash — React Profiler bilan qaysi komponent sekin ekanini aniqlash. 3) Sabab topish — "Why did this render?" — props, state, parent? 4) Optimizatsiya — sababga qarab: ortiqcha re-render → React.memo, qimmat hisoblash → useMemo, callback referens → useCallback, katta ro'yxat → virtualization. 5) Qayta o'lchash — optimizatsiya yordam berdimi? Qoida: AVVAL o'lchash, KEYIN optimizatsiya.`,
      },
      {
        question: 'actualDuration va baseDuration farqi nima?',
        answer: `actualDuration — komponent va bolalarining HAQIQIY render vaqti. Memoization hisobga olinadi (memo bilan o'tkazib yuborilgan bolalar hisoblanMAYDI). baseDuration — memoization-SIZ bo'lganda qancha vaqt ketishi. Agar actualDuration << baseDuration — memoization yaxshi ishlayapti. Agar actualDuration ≈ baseDuration — memoization yordam berMAYAPTI (barcha bolalar re-render bo'layapti).`,
      },
      {
        question: 'React Profiler va Chrome Performance tab farqi nima?',
        answer: `React Profiler — React-specific: komponent darajasida render vaqti, re-render sabablari, flamegraph. Faqat React komponentlarni ko'rsatadi. Chrome Performance — umumiy browser: JavaScript execution, layout/paint, memory, network, long tasks. Barcha JS kodni ko'rsatadi. Ikkalasi birga ishlatiladi: React Profiler — qaysi komponent muammo, Chrome Performance — umumiy sahifa performansi (FPS, long tasks).`,
      },
    ],
    relatedTopics: [
      { sectionId: 'performance', topicId: 're-render-causes', label: 'Re-render sabablari' },
      { sectionId: 'performance', topicId: 'web-vitals', label: 'Core Web Vitals' },
    ],
  },
  {
    id: 'virtualization',
    title: 'Virtualization',
    importance: 2,
    status: 'to-learn',
    description: 'Katta ro\'yxatlar — react-window / react-virtuoso',
    content: `Virtualization — katta ro'yxatlarni (1000+ element) samarali ko'rsatish texnikasi. Faqat KO'RINADIGAN elementlar DOM-da bo'ladi, qolganlari yo'q.

═══════════════════════════════════════
  MUAMMO: KATTA RO'YXAT
═══════════════════════════════════════

10,000 element ro'yxat:
  ❌ 10,000 DOM node yaratiladi
  ❌ Initial render sekin (100ms+)
  ❌ Scroll lag
  ❌ Xotira ko'p ishlatiladi
  ❌ Re-render juda sekin

HAQIQIY raqamlar:
  100 element → 2ms render (muammo yo'q)
  1,000 element → 20ms render (seziladi)
  10,000 element → 200ms+ render (foydalanib bo'lmaydi)

═══════════════════════════════════════
  VIRTUALIZATION KONSEPTI
═══════════════════════════════════════

10,000 elementdan faqat ~20 tasi ekranda ko'rinadi.
Virtualization — faqat ko'rinADIGAN elementlarni renderlaydii:

  Oddiy ro'yxat:
  [1] [2] [3] [4] [5] ... [9998] [9999] [10000]
  ← 10,000 DOM node →

  Virtualized:
  [scroll spacer]
  [visible: 15] [16] [17] [18] [19] ... [35]
  [scroll spacer]
  ← ~20 DOM node →

Qanday ishlaydi:
  1. Container — belgilangan balandlik (height: 500px, overflow: auto)
  2. Spacer — scroll hajmini to'g'ri ko'rsatish (total height)
  3. Faqat ko'rinadigan elementlar renderlanadi
  4. Scroll bo'lganda — yangi elementlar renderlanadi, eski o'chiriladi

═══════════════════════════════════════
  KUTUBXONALAR
═══════════════════════════════════════

react-window (Brian Vaughn):
  - Kichik bundle (~6KB)
  - FixedSizeList, VariableSizeList
  - Grid ham bor
  - Oddiy API

react-virtuoso:
  - O'zgaruvchan balandlik avtomatik
  - Grouped list
  - Infinite scroll built-in
  - Table virtualization
  - Kattaroq bundle (~15KB)

@tanstack/react-virtual:
  - Headless (UI yo'q — faqat logika)
  - Har qanday layout bilan ishlaydi
  - TypeScript-first
  - TanStack ekotizimi

═══════════════════════════════════════
  QACHON KERAK
═══════════════════════════════════════

Virtualization KERAK:
  ✅ 500+ element ro'yxat
  ✅ Scroll performance muammosi
  ✅ Har element murakkab (ko'p DOM node)

Virtualization KERAK EMAS:
  ❌ 100 dan kam element (oddiy ro'yxat yetarli)
  ❌ Pagination bilan cheklangan (50 per page)
  ❌ Elementlar balandligi juda farq qilsa (murakkablashadi)

ALTERNATIVALAR:
  - Pagination — sahifalar bo'yicha ko'rsatish
  - Infinite scroll — TanStack Query useInfiniteQuery
  - "Show more" button — bosqichma-bosqich ko'rsatish`,
    codeExamples: [
      {
        title: 'react-window — FixedSizeList',
        language: 'tsx',
        code: `import { FixedSizeList } from 'react-window'
import { memo } from 'react'

interface Item {
  id: string
  name: string
  email: string
}

// Har bir qator — memo bilan
const Row = memo(function Row({
  index,
  style,
  data,
}: {
  index: number
  style: React.CSSProperties
  data: Item[]
}) {
  const item = data[index]

  return (
    <div
      style={style}  // MUHIM: position va top react-window beradi
      className={\`flex items-center px-4 border-b \${
        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
      }\`}
    >
      <span className="w-12 text-gray-400">{index + 1}</span>
      <span className="flex-1 font-medium">{item.name}</span>
      <span className="text-gray-500">{item.email}</span>
    </div>
  )
})

function VirtualizedList({ items }: { items: Item[] }) {
  return (
    <FixedSizeList
      height={500}           // container balandligi
      width="100%"           // kenglik
      itemCount={items.length}  // jami elementlar
      itemSize={48}          // har qator balandligi (px)
      itemData={items}       // data Row-ga uzatiladi
    >
      {Row}
    </FixedSizeList>
  )
}

// 10,000 element — faqat ~12 tasi DOM-da
function App() {
  const items = Array.from({ length: 10000 }, (_, i) => ({
    id: String(i),
    name: \`User \${i}\`,
    email: \`user\${i}@example.com\`,
  }))

  return <VirtualizedList items={items} />
}`,
        description: 'react-window FixedSizeList — belgilangan balandlikdagi qatorlar. style prop MUHIM — position:absolute bilan joylashtiriladi. 10,000 elementdan faqat ~12 tasi DOM-da.',
      },
      {
        title: '@tanstack/react-virtual — headless virtualization',
        language: 'tsx',
        code: `import { useVirtualizer } from '@tanstack/react-virtual'
import { useRef } from 'react'

interface Message {
  id: string
  text: string
  sender: string
}

function VirtualMessageList({ messages }: { messages: Message[] }) {
  const parentRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60,  // taxminiy qator balandligi
    overscan: 5,             // ekran tashqarisida 5 ta qo'shimcha render
  })

  return (
    <div
      ref={parentRef}
      className="h-[500px] overflow-auto border rounded"
    >
      <div
        style={{ height: \`\${virtualizer.getTotalSize()}px\`, position: 'relative' }}
      >
        {virtualizer.getVirtualItems().map(virtualRow => {
          const message = messages[virtualRow.index]

          return (
            <div
              key={virtualRow.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: \`\${virtualRow.size}px\`,
                transform: \`translateY(\${virtualRow.start}px)\`,
              }}
              className="flex items-center px-4 border-b"
            >
              <span className="font-medium mr-2">{message.sender}:</span>
              <span>{message.text}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}`,
        description: '@tanstack/react-virtual — headless (UI bermaydi, faqat logika). O\'zingiz stil berasiz. estimateSize — taxminiy balandlik. overscan — scroll smooth bo\'lishi uchun qo\'shimcha elementlar.',
      },
    ],
    interviewQA: [
      {
        question: 'Virtualization nima va qanday ishlaydi?',
        answer: `Virtualization — katta ro'yxatdan faqat ekranda ko'rinadigan elementlarni DOM-ga qo'yish. 10,000 elementdan faqat ~20 tasi renderlanadi. Qanday ishlaydi: 1) Container belgilangan balandlik (overflow: auto), 2) Umumiy scroll hajmi saqlanadi (spacer/padding), 3) Scroll pozitsiyasiga qarab qaysi elementlar ko'rinishini hisoblaydi, 4) Faqat ko'rinadigan elementlar renderlanadi, 5) Scroll bo'lganda elementlar almashtiriladi. DOM node soni DOIMIY (~20-30), ro'yxat qanchalik katta bo'lishidan qat'iy nazar.`,
      },
      {
        question: 'Virtualization qachon kerak, qachon kerak emas?',
        answer: `KERAK: 500+ element, scroll lag bo'lganda, har element murakkab (ko'p DOM node). KERAK EMAS: 100 dan kam element (oddiy ro'yxat tez), pagination bilan cheklangan (50 per page), faqat bir marta ko'rsatiladigan ro'yxat. Alternativalar: pagination (sahifalar), infinite scroll (TanStack Query useInfiniteQuery bilan — kerak bo'lganda yuklash), "Show more" button. Virtualization murakkablik qo'shadi — faqat haqiqiy muammo bo'lganda ishlatish kerak.`,
      },
      {
        question: 'react-window va @tanstack/react-virtual farqi nima?',
        answer: `react-window — to'liq komponent beradi (FixedSizeList, VariableSizeList). Oddiy API, kichik bundle (~6KB). Cheklov: fixed/variable size, faqat list/grid. @tanstack/react-virtual — headless (faqat logika, UI yo'q). O'zingiz rendering boshqarasiz. Har qanday layout, o'zgaruvchan balandlik, TypeScript-first. Kattaroq flexibility. react-virtuoso — eng ko'p feature: avtomatik balandlik, grouped, infinite scroll built-in. Kattaroq bundle (~15KB).`,
      },
    ],
    relatedTopics: [
      { sectionId: 'performance', topicId: 're-render-causes', label: 'Re-render kamytirish' },
      { sectionId: 'performance', topicId: 'key-prop', label: 'Key Prop (list)' },
    ],
  },
  {
    id: 'code-splitting',
    title: 'Code Splitting',
    importance: 3,
    status: 'to-learn',
    description: 'Dynamic import, lazy loading',
    content: `Code splitting — ilovani kichik bo'laklarga (chunk) ajratish. Foydalanuvchi faqat kerakli kodni yuklaydi. Initial load tezlashadi.

═══════════════════════════════════════
  MUAMMO: BITTA KATTA BUNDLE
═══════════════════════════════════════

Default-da bundler (Vite/Webpack) barcha kodni BITTA faylga qo'shadi:
  bundle.js — 800KB
  ├── React + ReactDOM — 130KB
  ├── Bosh sahifa — 20KB
  ├── Admin panel — 100KB (faqat admin ko'radi)
  ├── Chart kutubxona — 200KB (faqat analytics sahifada)
  └── Boshqa sahifalar — 350KB

Foydalanuvchi faqat bosh sahifani ko'rmoqchi — 800KB yuklaydi!

Code splitting bilan:
  main.js — 170KB (React + bosh sahifa)
  admin.js — 100KB (admin kirganda yuklanadi)
  analytics.js — 200KB (analytics ochganda yuklanadi)

═══════════════════════════════════════
  DYNAMIC IMPORT
═══════════════════════════════════════

  // Static import — bundle-ga qo'shiladi
  import { Chart } from 'chart-library'

  // Dynamic import — alohida chunk bo'ladi
  const module = await import('chart-library')
  const Chart = module.Chart

Vite/Webpack dynamic import-ni ko'rganda:
  1. Alohida .js fayl (chunk) yaratadi
  2. Runtime-da kerak bo'lganda network orqali yuklaydi
  3. Browser keshga saqlaydi

═══════════════════════════════════════
  CODE SPLITTING STRATEGIYALARI
═══════════════════════════════════════

1. Route-based (eng keng tarqalgan):
   Har sahifa alohida chunk
   React.lazy(() => import('./pages/Admin'))

2. Component-based:
   Og'ir komponentlar alohida chunk
   const Chart = lazy(() => import('./components/Chart'))

3. Library-based:
   Katta kutubxonalar alohida
   const { PDFViewer } = await import('pdf-library')

4. Feature-based:
   Feature flag bilan
   if (featureEnabled) {
     const module = await import('./features/newFeature')
   }

═══════════════════════════════════════
  React.lazy + Suspense
═══════════════════════════════════════

  const AdminPage = lazy(() => import('./pages/AdminPage'))

  <Suspense fallback={<Loading />}>
    <AdminPage />
  </Suspense>

Cheklovlar:
  - Faqat default export
  - Server-side rendering bilan murakkab
  - Error handling uchun ErrorBoundary kerak

═══════════════════════════════════════
  VITE CODE SPLITTING
═══════════════════════════════════════

Vite (Rollup/Rolldown) avtomatik:
  - dynamic import() → alohida chunk
  - node_modules → vendor chunk
  - CSS code splitting (har chunk o'z CSS-i)

Manual chunk-lar:
  // vite.config.ts
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router'],
        }
      }
    }
  }`,
    codeExamples: [
      {
        title: 'Route-based code splitting',
        language: 'tsx',
        code: `import { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router'

// Har sahifa — alohida chunk
const HomePage = lazy(() => import('./pages/HomePage'))
const ProductsPage = lazy(() => import('./pages/ProductsPage'))
const AdminPage = lazy(() => import('./pages/AdminPage'))
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'))

// Loading komponent
function PageSkeleton() {
  return (
    <div className="animate-pulse p-6">
      <div className="h-8 bg-gray-200 rounded w-1/3 mb-4" />
      <div className="h-4 bg-gray-200 rounded w-full mb-2" />
      <div className="h-4 bg-gray-200 rounded w-2/3" />
    </div>
  )
}

function lazyPage(Component: React.LazyExoticComponent<React.ComponentType>) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Component />
    </Suspense>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: lazyPage(HomePage) },
      { path: 'products', element: lazyPage(ProductsPage) },
      { path: 'admin', element: lazyPage(AdminPage) },
      { path: 'analytics', element: lazyPage(AnalyticsPage) },
    ],
  },
])

// Build natijasi:
// main.js       — 170KB (React + layout)
// HomePage.js   — 20KB
// Products.js   — 35KB
// Admin.js      — 100KB (admin kirganda yuklaydi)
// Analytics.js  — 200KB (chart library bilan)`,
        description: 'Har sahifa alohida chunk. Foydalanuvchi faqat kiradigan sahifa kodini yuklaydi. Skeleton loading — UX uchun yaxshiroq (spinner o\'rniga).',
      },
      {
        title: 'Component-based code splitting',
        language: 'tsx',
        code: `import { lazy, Suspense, useState } from 'react'

// Og'ir komponent — faqat kerak bo'lganda yuklanadi
const MarkdownEditor = lazy(() => import('./components/MarkdownEditor'))
const PdfViewer = lazy(() => import('./components/PdfViewer'))
const ChartDashboard = lazy(() => import('./components/ChartDashboard'))

function DocumentPage() {
  const [view, setView] = useState<'preview' | 'edit' | 'chart'>('preview')

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <button onClick={() => setView('preview')}>Ko'rish</button>
        <button onClick={() => setView('edit')}>Tahrirlash</button>
        <button onClick={() => setView('chart')}>Grafik</button>
      </div>

      <Suspense fallback={<p>Komponent yuklanmoqda...</p>}>
        {view === 'edit' && <MarkdownEditor />}
        {view === 'chart' && <ChartDashboard />}
      </Suspense>

      {view === 'preview' && <PreviewContent />}
    </div>
  )
}

// Conditional import — feature flag
async function loadExperimentalFeature() {
  if (featureFlags.newDashboard) {
    const { NewDashboard } = await import('./features/NewDashboard')
    return NewDashboard
  }
  return null
}`,
        description: 'Component-level splitting — og\'ir editor/viewer faqat kerak bo\'lganda yuklanadi. Tab o\'zgarganda chunk yuklanadi. Feature flag bilan conditional import.',
      },
    ],
    interviewQA: [
      {
        question: 'Code splitting nima va qanday ishlaydi?',
        answer: `Code splitting — ilovani kichik chunk-larga ajratish. Dynamic import() bilan amalga oshiriladi. Bundler (Vite/Webpack) import() ko'rganda alohida .js fayl yaratadi. Runtime-da chunk kerak bo'lganda network orqali yuklanadi. React-da React.lazy() + Suspense bilan. Foyda: tezroq initial load, kamroq bandwidth, foydalanuvchi faqat kerakli kodni yuklaydi.`,
      },
      {
        question: 'Code splitting-ning turli strategiyalari qanday?',
        answer: `1) Route-based — har sahifa alohida chunk (eng keng tarqalgan, React.lazy bilan), 2) Component-based — og'ir komponentlar alohida (chart, editor, PDF viewer), 3) Library-based — katta kutubxonalar alohida chunk (moment.js, chart.js), 4) Feature-based — feature flag bilan conditional import. Amalda route-based + component-based birga ishlatiladi. Bundler vendor chunk-ni (react, react-dom) avtomatik ajratadi.`,
      },
      {
        question: 'Code splitting va tree shaking farqi nima?',
        answer: `Code splitting — kodni VAQT bo'yicha ajratish. Barcha kod saqlanadi, lekin alohida fayllarga bo'linadi va kerak bo'lganda yuklanadi. Tree shaking — ISHLATILMAGAN kodni O'CHIRISH. Build vaqtida bundler import qilinmagan export-larni olib tashlaydi. Ikkalasi birga ishlaydi: tree shaking keraksiz kodni o'chiradi, code splitting qolgan kodni chunk-larga ajratadi. Natija: kichikroq, tezroq yuklanadigan ilova.`,
      },
    ],
    relatedTopics: [
      { sectionId: 'component-patterns', topicId: 'suspense-lazy', label: 'Suspense + React.lazy' },
      { sectionId: 'routing', topicId: 'lazy-routes', label: 'Lazy Routes' },
      { sectionId: 'performance', topicId: 'bundle-optimization', label: 'Bundle Optimization' },
    ],
  },
  {
    id: 'react-compiler',
    title: 'React Compiler',
    importance: 2,
    status: 'to-learn',
    description: 'Nima qiladi, qanday ishlaydi (loyihada ishlatilmoqda!)',
    content: `React Compiler (eski nomi React Forget) — build vaqtida kodni avtomatik optimizatsiya qiluvchi kompilyator. useMemo, useCallback, React.memo-ni AVTOMATIK qo'shadi. Bu loyihada allaqachon ishlatilmoqda!

═══════════════════════════════════════
  MUAMMO: QO'LDA MEMOIZATSIYA
═══════════════════════════════════════

Hozirgi React-da performance uchun qo'lda:
  - useMemo(value, [deps])
  - useCallback(fn, [deps])
  - React.memo(Component)

Muammolar:
  ❌ Unutish mumkin (memo qo'ymaslik → sekin)
  ❌ Noto'g'ri deps → stale data yoki cheksiz loop
  ❌ Ortiqcha memo → keraksiz overhead
  ❌ Har safar o'ylash kerak: "bu yerda memo kerakmi?"

═══════════════════════════════════════
  REACT COMPILER NIMA QILADI
═══════════════════════════════════════

React Compiler BUILD VAQTIDA kodingizni tahlil qiladi va
avtomatik memoizatsiya qo'shadi:

  // Siz yozasiz:
  function Component({ items }) {
    const sorted = items.sort((a, b) => a.name.localeCompare(b.name))
    const handleClick = () => console.log('click')
    return <List items={sorted} onClick={handleClick} />
  }

  // Compiler natijasi (taxminan):
  function Component({ items }) {
    const sorted = useMemo(
      () => items.sort((a, b) => a.name.localeCompare(b.name)),
      [items]
    )
    const handleClick = useCallback(() => console.log('click'), [])
    return <List items={sorted} onClick={handleClick} />
  }

Siz ODDIY kod yozasiz — Compiler optimizatsiya qiladi.

═══════════════════════════════════════
  QANDAY ISHLAYDI
═══════════════════════════════════════

1. Build vaqtida (Babel/Vite plugin sifatida) har komponentni tahlil qiladi
2. Qaysi qiymatlar/funksiyalar DOIM bir xil ekanini aniqlaydi
3. Kerakli joylarga avtomatik memoizatsiya qo'shadi
4. Keraksiz joylarga QO'SHMAYDI (aqlli)

React Compiler React-ning QOIDALARIGA amal qiladi:
  - Pure components (side effect-siz render)
  - Immutable state (mutatsiya yo'q)
  - Rules of Hooks

Agar kodingiz bu qoidalarga amal qilsa — Compiler ishlaydi.
Agar buzsa — Compiler bu komponentni O'TKAZIB YUBORADI.

═══════════════════════════════════════
  BU LOYIHADA QANDAY ISHLATILMOQDA
═══════════════════════════════════════

vite.config.ts:
  import babel from '@rolldown/plugin-babel'
  import { reactCompilerPreset } from '@vitejs/plugin-react'

  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ]

Bu degani:
  ✅ Barcha komponentlar avtomatik memoizatsiya
  ✅ useMemo/useCallback qo'lda yozish KERAK EMAS
  ✅ React.memo qo'lda yozish KERAK EMAS

Lekin tushunish KERAK — intervyuda so'raladi:
  - useMemo/useCallback nima qiladi
  - Qachon kerak bo'lishini bilish
  - React Compiler nima qilayotganini tushuntira olish

═══════════════════════════════════════
  CHEKLOVLAR
═══════════════════════════════════════

React Compiler ishlaMAYDI:
  ❌ Rules of Hooks buzilsa
  ❌ Render ichida side effect bo'lsa
  ❌ State mutatsiya qilinsa (immutability buzilsa)
  ❌ Custom hook-lar noto'g'ri yozilsa

Bu holatlarda Compiler komponentni O'TKAZIB YUBORADI —
xato berMAYDI, faqat optimizatsiya qilMAYDI.`,
    codeExamples: [
      {
        title: 'Compiler nima qiladi — oldin/keyin',
        language: 'tsx',
        code: `// ===== SIZ YOZASIZ (oddiy, toza kod) =====
function ProductList({ products, category }: Props) {
  const filtered = products.filter(p => p.category === category)
  const sorted = filtered.sort((a, b) => a.price - b.price)
  const total = sorted.reduce((sum, p) => sum + p.price, 0)

  const handleAddToCart = (id: string) => {
    addToCart(id)
  }

  return (
    <div>
      <p>Jami: {total.toLocaleString()} so'm</p>
      {sorted.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onAdd={handleAddToCart}
        />
      ))}
    </div>
  )
}

// ===== COMPILER TAXMINAN SHUNI YARATADI =====
function ProductList({ products, category }: Props) {
  const filtered = useMemo(
    () => products.filter(p => p.category === category),
    [products, category]
  )
  const sorted = useMemo(
    () => filtered.sort((a, b) => a.price - b.price),
    [filtered]
  )
  const total = useMemo(
    () => sorted.reduce((sum, p) => sum + p.price, 0),
    [sorted]
  )

  const handleAddToCart = useCallback((id: string) => {
    addToCart(id)
  }, [])

  return (
    <div>
      <p>Jami: {total.toLocaleString()} so'm</p>
      {sorted.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onAdd={handleAddToCart}
        />
      ))}
    </div>
  )
}`,
        description: 'Compiler SIZ uchun memoizatsiya qo\'shadi. Oddiy, o\'qish oson kod yozasiz — build vaqtida optimizatsiya avtomatik. dependency-larni ham TO\'G\'RI aniqlaydi.',
      },
      {
        title: 'Loyihada Compiler sozlash (Vite)',
        language: 'ts',
        code: `// vite.config.ts — bu loyihadagi haqiqiy konfiguratsiya
import path from 'node:path'
import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    //                 ^ React Compiler shu yerda
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
})

// React Compiler ishlayotganini tekshirish:
// 1. React DevTools → Components → komponent tanlang
// 2. "Memo" badge ko'rinsa — Compiler ishlagan
// 3. Console-da "Compiled" label ko'rinishi mumkin

// package.json-da kerakli paketlar:
// "babel-plugin-react-compiler": "^1.0.0"
// "@rolldown/plugin-babel": "..."`,
        description: 'Bu loyihaning haqiqiy konfiguratsiyasi. reactCompilerPreset babel plugin sifatida ishlaydi. Alohida config kerak emas — plug and play.',
      },
    ],
    interviewQA: [
      {
        question: 'React Compiler nima va nima qiladi?',
        answer: `React Compiler (eski nomi React Forget) — build vaqtida ishlaydigan kompilyator. Komponentlarni tahlil qiladi va avtomatik memoizatsiya qo'shadi: useMemo, useCallback, React.memo ekvivalentlarini. Developer oddiy, toza kod yozadi — Compiler optimizatsiyani o'zi hal qiladi. Babel plugin sifatida ishlaydi. Dependency-larni avtomatik va TO'G'RI aniqlaydi — qo'lda deps yozishdan xavfsizroq.`,
      },
      {
        question: 'React Compiler bo\'lsa useMemo/useCallback kerak emasmi?',
        answer: `Compiler ishlatilsa — qo'lda useMemo/useCallback yozish KERAK EMAS. Compiler avtomatik qo'shadi. Lekin tushunish KERAK — intervyuda so'raladi: useMemo nima uchun kerak, qanday ishlaydi, dependency array nima. Compiler-siz loyihalarda qo'lda yozish hali ham kerak. Compiler cheklovlari bor — Rules of Hooks buzilsa yoki render ichida side effect bo'lsa, Compiler bu komponentni o'tkazib yuboradi va qo'lda memo kerak bo'ladi.`,
      },
      {
        question: 'React Compiler qachon ishlamaydi?',
        answer: `Compiler komponentni o'tkazib yuboradi (xato berMAYDI): 1) Rules of Hooks buzilsa (if ichida hook), 2) Render ichida side effect bo'lsa (fetch, DOM manipulation), 3) State mutatsiya qilinsa (immutability buzilsa), 4) Ref-ga render vaqtida yozilsa. Bu holatlarda Compiler "unsafe" deb belgilaydi va optimizatsiya qilMAYDI. Kod ishlaydi, lekin optimizatsiya yo'q. React qoidalariga amal qilsangiz — Compiler ishlaydi.`,
      },
    ],
    relatedTopics: [
      { sectionId: 'performance', topicId: 'memo-usememo-usecallback', label: 'useMemo/useCallback (eski usul)' },
      { sectionId: 'react-core', topicId: 'jsx-transform', label: 'JSX Transform' },
      { sectionId: 'theory-questions', topicId: 'react-18-19', label: 'React 19 yangiliklari' },
    ],
  },
  {
    id: 'key-prop',
    title: 'Key Prop',
    importance: 3,
    status: 'to-learn',
    description: 'Nima uchun kerak, index key nima uchun yomon',
    content: `Key prop — React-ning reconciliation (diffing) algoritmida elementlarni IDENTIFIKATSIYA qilish uchun ishlatiladigan maxsus prop. Ro'yxatlar (map) uchun MAJBURIY.

═══════════════════════════════════════
  NIMA UCHUN KEY KERAK?
═══════════════════════════════════════

React ro'yxat yangilanganda qaysi element:
  - QOLDI (o'zgarmadi)
  - O'ZGARDI (yangilash kerak)
  - QO'SHILDI (yangi yaratish kerak)
  - O'CHIRILDI (DOM-dan olib tashlash kerak)

Key-siz React TARTIB bo'yicha taqqoslaydi:
  Eski: [A, B, C]
  Yangi: [A, C]    ← B o'chirildi

  Key-siz React o'ylaydi: B→C ga o'zgardi, C o'chirildi (NOTO'G'RI!)
  Key bilan React biladi: B o'chirildi, A va C QOLDI (TO'G'RI)

═══════════════════════════════════════
  INDEX KEY NIMA UCHUN YOMON
═══════════════════════════════════════

  items.map((item, index) => <Item key={index} />)

Muammo: element QO'SHILSA yoki O'CHIRILSA index O'ZGARADI:

  Eski:  [A(0), B(1), C(2)]
  Yangi: [X(0), A(1), B(2), C(3)]  ← boshiga X qo'shildi

  Index key bilan React o'ylaydi:
    0: A→X (o'zgardi — qayta render)
    1: B→A (o'zgardi — qayta render)
    2: C→B (o'zgardi — qayta render)
    3: C (yangi — yaratish kerak)
  → BARCHA element qayta renderlanadi!

  Unique key bilan:
    X: yangi — yaratish kerak
    A, B, C: qoldi — hech narsa qilish kerak emas
  → Faqat X renderlanadi!

Index key XAVFSIZ faqat:
  ✅ Ro'yxat HECH QACHON o'zgarmasa
  ✅ Element tartibi o'zgarMAsa
  ✅ Element qo'shilMAsa va o'chirilMAsa

═══════════════════════════════════════
  KEY QOIDALARI
═══════════════════════════════════════

1. Key UNIQUE bo'lishi kerak (bir ro'yxat ichida)
2. Key DOIMIY bo'lishi kerak (renderlar orasida o'zgarmaydi)
3. Key PREDICTABLE bo'lishi kerak (random/Date.now EMAS)

TO'G'RI key-lar:
  ✅ Database ID (user.id, product.id)
  ✅ Unique identifikator (UUID, slug)
  ✅ Kombinatsiya (category + '-' + id)

NOTO'G'RI key-lar:
  ❌ Math.random() — har renderda o'zgaradi
  ❌ Date.now() — har renderda yangi
  ❌ index — element tartibi o'zgarganda muammo

═══════════════════════════════════════
  KEY BILAN KOMPONENT RESET QILISH
═══════════════════════════════════════

Key o'zgarsa — React eski komponentni O'CHIRADI
va YANGI komponent yaratadi (state TOZALANADI).

Bu trick sifatida ishlatiladi:

  // userId o'zgarsa — ProfileForm QAYTADAN yaratiladi
  // ichidagi useState lar TOZALANADI
  <ProfileForm key={userId} userId={userId} />

Bu useEffect + setState bilan reset qilishdan YAXSHIROQ:
  - State avtomatik tozalanadi
  - Stale data ko'rinmaydi
  - Kod soddaro`,
    codeExamples: [
      {
        title: 'Index key muammosi — demo',
        language: 'tsx',
        code: `import { useState } from 'react'

interface Item {
  id: string
  text: string
}

function KeyDemo() {
  const [items, setItems] = useState<Item[]>([
    { id: 'a', text: 'Olma' },
    { id: 'b', text: 'Banan' },
    { id: 'c', text: 'Gilos' },
  ])

  function addToStart() {
    setItems([
      { id: crypto.randomUUID(), text: 'YANGI' },
      ...items,
    ])
  }

  return (
    <div>
      <button onClick={addToStart}>Boshiga qo'shish</button>

      {/* ❌ INDEX KEY — input qiymatlari aralashib ketadi */}
      <h3>Index key (noto'g'ri):</h3>
      {items.map((item, index) => (
        <div key={index} className="flex gap-2 mb-1">
          <span>{item.text}</span>
          <input defaultValue={item.text} />
          {/* "YANGI" qo'shilganda input-lar BIR POZITSIYA SILJIYDI */}
          {/* Chunki index o'zgaradi — React noto'g'ri elementni yangilaydi */}
        </div>
      ))}

      {/* ✅ UNIQUE KEY — to'g'ri ishlaydi */}
      <h3>Unique key (to'g'ri):</h3>
      {items.map(item => (
        <div key={item.id} className="flex gap-2 mb-1">
          <span>{item.text}</span>
          <input defaultValue={item.text} />
          {/* Yangi element qo'shilsa — faqat YANGI input yaratiladi */}
          {/* Eski input-lar o'z joyida qoladi */}
        </div>
      ))}
    </div>
  )
}`,
        description: 'Index key bilan boshiga element qo\'shilsa — barcha input qiymatlari aralashib ketadi. Unique key bilan — faqat yangi element yaratiladi, eskilar saqlanadi.',
      },
      {
        title: 'Key bilan komponent reset qilish',
        language: 'tsx',
        code: `import { useState } from 'react'

// Form komponent — ichida state bor
function UserForm({ userId }: { userId: string }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  return (
    <form>
      <h3>Foydalanuvchi: {userId}</h3>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Ism" />
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
    </form>
  )
}

function App() {
  const [selectedUser, setSelectedUser] = useState('user-1')

  return (
    <div>
      <button onClick={() => setSelectedUser('user-1')}>User 1</button>
      <button onClick={() => setSelectedUser('user-2')}>User 2</button>
      <button onClick={() => setSelectedUser('user-3')}>User 3</button>

      {/* ❌ KEY-SIZ — user o'zgarsa form state QOLADI (eski qiymatlar) */}
      {/* <UserForm userId={selectedUser} /> */}

      {/* ✅ KEY BILAN — user o'zgarsa form QAYTADAN YARATILADI */}
      <UserForm key={selectedUser} userId={selectedUser} />
      {/* name va email state TOZALANADI — chunki yangi komponent */}
    </div>
  )
}`,
        description: 'Key o\'zgarsa — React eski komponentni O\'CHIRADI va yangi yaratadi. Ichidagi useState lar tozalanadi. User o\'zgarganda form reset bo\'ladi — useEffect kerak emas.',
      },
    ],
    interviewQA: [
      {
        question: 'Key prop nima uchun kerak?',
        answer: `Key — React-ning reconciliation algoritmida elementlarni identifikatsiya qilish uchun. Ro'yxat yangilanganda React key orqali qaysi element qoldi, qo'shildi, o'chirildi yoki o'zgardi — aniq biladi. Key-siz React tartib bo'yicha taqqoslaydi — element qo'shilsa/o'chirilsa noto'g'ri natija beradi. Key unique va doimiy bo'lishi kerak — database ID eng yaxshi variant. Key React-ning ichki mexanizmi — props sifatida komponentga uzatilMAYDI.`,
      },
      {
        question: 'Index key nima uchun yomon?',
        answer: `Index key ro'yxat o'zgarsa muammo: element boshiga qo'shilsa, barcha index-lar siljiydi → React BARCHA elementlarni "o'zgardi" deb hisoblaydi → barchasi qayta renderlanadi. Bundan tashqari: uncontrolled input (defaultValue), animatsiya, ichki state — barchasi aralashib ketadi. Index key xavfsiz FAQAT: ro'yxat hech o'zgarMAsa, tartibi o'zgarMAsa, element qo'shilMAsa. Amalda — deyarli hech qachon. Doim unique ID ishlatish kerak.`,
      },
      {
        question: 'Key bilan komponent reset qilish qanday ishlaydi?',
        answer: `React key o'zgarsa eski komponentni unmount qiladi va YANGI komponent mount qiladi. Ichidagi barcha useState, useRef lar tozalanadi. Bu trick: <UserForm key={userId} /> — userId o'zgarsa form qaytadan yaratiladi, eski state qolmaydi. useEffect + setState bilan reset-dan afzalroq: 1) stale data ko'rinmaydi (bitta render-da), 2) kod soddaro, 3) barcha state avtomatik tozalanadi. Kamchiligi: DOM qaytadan yaratiladi — focus yo'qoladi.`,
      },
      {
        question: 'Math.random() yoki Date.now() key sifatida ishlatsa bo\'ladimi?',
        answer: `YO'Q! Key doimiy bo'lishi kerak — renderlar orasida o'zgarMAsligi kerak. Math.random() va Date.now() har renderda yangi qiymat beradi → React har renderda BARCHA elementlarni "yangi" deb hisoblaydi → barchasi unmount/mount bo'ladi → state yo'qoladi, animatsiya buziladi, performance yomonlashadi. To'g'ri key: database ID, UUID (yaratish vaqtida bir marta generatsiya qilish), yoki tarkibiy unique qiymat.`,
      },
    ],
    relatedTopics: [
      { sectionId: 'react-core', topicId: 'virtual-dom', label: 'Reconciliation' },
      { sectionId: 'theory-questions', topicId: 'key-importance', label: 'Nazariy savol' },
      { sectionId: 'performance', topicId: 'virtualization', label: 'Virtualization' },
    ],
  },
  {
    id: 'debounce-throttle',
    title: 'Debounce / Throttle',
    importance: 2,
    status: 'to-learn',
    description: 'Input va scroll optimizatsiya',
    content: `Debounce va Throttle — tez-tez chaqiriladigan funksiyalarni cheklash texnikalari. Input typing, scroll, resize kabi eventlar soniyada 30-60 marta trigger bo'ladi — har safar API chaqirish yoki qimmat hisoblash qilish MUMKIN EMAS.

═══════════════════════════════════════
  MUAMMO
═══════════════════════════════════════

Qidiruv inputi — har harf yozilganda API chaqirish:
  "R" → fetch('/search?q=R')
  "Re" → fetch('/search?q=Re')
  "Rea" → fetch('/search?q=Rea')
  "Reac" → fetch('/search?q=Reac')
  "React" → fetch('/search?q=React')
  → 5 ta API so'rov — 4 tasi KERAKSIZ!

Scroll event — soniyada 60 marta:
  scroll → handleScroll() × 60/s
  → har birida DOM hisoblash → LAG

═══════════════════════════════════════
  DEBOUNCE
═══════════════════════════════════════

Debounce — foydalanuvchi TO'XTAGANDAN keyin chaqirish.
Har yangi event eski timer-ni BEKOR qiladi.

  "R" → timer 300ms
  "Re" → ESKi timer bekor → YANGI timer 300ms
  "Rea" → ESKi timer bekor → YANGI timer 300ms
  "React" → ESKi timer bekor → YANGI timer 300ms
  ...300ms O'TDI → fetch('/search?q=React')
  → FAQAT 1 TA so'rov!

Qachon ishlatish:
  ✅ Qidiruv input (typing tugagach qidirish)
  ✅ Form validation (typing to'xtagach tekshirish)
  ✅ Window resize (o'zgarish tugagach hisoblash)

═══════════════════════════════════════
  THROTTLE
═══════════════════════════════════════

Throttle — belgilangan intervalda FAQAT 1 MARTA chaqirish.

  scroll event → 60 marta/s
  throttle 100ms → 10 marta/s
  → 6x kam chaqiruv

Qachon ishlatish:
  ✅ Scroll event (pozitsiya hisoblash)
  ✅ Mouse move (kursor kuzatish)
  ✅ Button spam oldini olish

═══════════════════════════════════════
  DEBOUNCE vs THROTTLE
═══════════════════════════════════════

Debounce: to'xtagandan KEYIN chaqirish (oxirgi event)
  Input: R...e...a...c...t...[300ms]...FETCH!

Throttle: interval ICHIDA 1 marta chaqirish
  Scroll: |--call--|--call--|--call--|
          100ms    100ms    100ms

Debounce — natija kerak (qidiruv, validatsiya)
Throttle — jarayon kerak (scroll, drag)

═══════════════════════════════════════
  REACT ALTERNATIVALAR
═══════════════════════════════════════

React 18+ bilan debounce/throttle o'rniga:

useDeferredValue — qiymatni "past prioritet" qilish:
  const deferredQuery = useDeferredValue(query)
  // UI darhol yangilanadi, lekin filterlash keyinroq bo'ladi

useTransition — yangilanishni "past prioritet" belgilash:
  const [isPending, startTransition] = useTransition()
  startTransition(() => setFilteredItems(filter(items)))
  // Input responsive, filterlash background-da

Bu React-ning concurrent feature-lari — debounce-dan YAXSHIROQ:
  ✅ Debounce — 300ms kutish DOIM (hatto tez kompyuterda ham)
  ✅ useDeferredValue — browser bo'sh bo'lsa darhol, band bo'lsa kutadi
  ✅ UX yaxshiroq — input DOIM responsive`,
    codeExamples: [
      {
        title: 'useDebounce custom hook',
        language: 'tsx',
        code: `import { useState, useEffect } from 'react'

// Custom hook — qiymatni debounce qilish
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(timer)  // cleanup — eski timer bekor
  }, [value, delay])

  return debouncedValue
}

// Ishlatish — qidiruv
function SearchPage() {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 300)

  // debouncedQuery faqat 300ms to'xtagandan keyin o'zgaradi
  const { data: results } = useQuery({
    queryKey: ['search', debouncedQuery],
    queryFn: () => searchApi(debouncedQuery),
    enabled: debouncedQuery.length >= 2,  // 2+ harf bo'lganda
  })

  return (
    <div>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Qidirish..."
      />
      {/* query — darhol yangilanadi (input responsive) */}
      {/* debouncedQuery — 300ms keyin (API chaqiruv) */}
      {results?.map(r => <p key={r.id}>{r.title}</p>)}
    </div>
  )
}`,
        description: 'useDebounce — qiymatni delay ms dan keyin yangilaydi. Har o\'zgarishda eski timer bekor, yangi timer boshlanadi. TanStack Query bilan birga — debouncedQuery queryKey-da.',
      },
      {
        title: 'useDeferredValue — React alternativa',
        language: 'tsx',
        code: `import { useState, useDeferredValue, useMemo } from 'react'

interface Product {
  id: string
  name: string
  category: string
}

function ProductFilter({ products }: { products: Product[] }) {
  const [query, setQuery] = useState('')

  // useDeferredValue — past prioritet versiya
  const deferredQuery = useDeferredValue(query)

  // Qimmat filterlash — deferred qiymat bilan
  const filteredProducts = useMemo(
    () => products.filter(p =>
      p.name.toLowerCase().includes(deferredQuery.toLowerCase())
    ),
    [products, deferredQuery]
  )

  // UI stale bo'lganda ko'rsatish
  const isStale = query !== deferredQuery

  return (
    <div>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Filter..."
      />

      <div style={{ opacity: isStale ? 0.6 : 1, transition: 'opacity 0.2s' }}>
        <p>{filteredProducts.length} ta topildi</p>
        {filteredProducts.map(p => (
          <div key={p.id}>{p.name}</div>
        ))}
      </div>
    </div>
  )
}

// Debounce vs useDeferredValue:
// Debounce: DOIM 300ms kutadi (sekin kompyuterda ham, tez kompyuterda ham)
// useDeferredValue: browser bo'sh bo'lsa DARHOL, band bo'lsa keyinroq
// → Tez kompyuterda — instant, sekin kompyuterda — graceful degradation`,
        description: 'useDeferredValue — React 18+ debounce alternativasi. Input darhol responsive, qimmat hisoblash past prioritetda. isStale bilan "yangilanmoqda" ko\'rsatish.',
      },
      {
        title: 'Throttle — scroll event',
        language: 'tsx',
        code: `import { useEffect, useRef, useState, useCallback } from 'react'

// useThrottle hook
function useThrottle<T>(value: T, interval: number): T {
  const [throttledValue, setThrottledValue] = useState(value)
  const lastUpdated = useRef(Date.now())

  useEffect(() => {
    const now = Date.now()

    if (now >= lastUpdated.current + interval) {
      lastUpdated.current = now
      setThrottledValue(value)
    } else {
      const timer = setTimeout(() => {
        lastUpdated.current = Date.now()
        setThrottledValue(value)
      }, interval - (now - lastUpdated.current))

      return () => clearTimeout(timer)
    }
  }, [value, interval])

  return throttledValue
}

// Scroll pozitsiya kuzatish
function useScrollPosition() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    let ticking = false

    function handleScroll() {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrollY(window.scrollY)
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return scrollY
}

// Ishlatish
function Header() {
  const scrollY = useScrollPosition()
  const isScrolled = scrollY > 50

  return (
    <header className={\`sticky top-0 transition-all \${
      isScrolled ? 'shadow-lg bg-white/90' : 'bg-transparent'
    }\`}>
      <h1>Sayt</h1>
    </header>
  )
}`,
        description: 'Throttle — scroll event optimizatsiya. requestAnimationFrame — browser paint sikliga moslashtirish (eng samarali). passive: true — scroll performance uchun muhim.',
      },
    ],
    interviewQA: [
      {
        question: 'Debounce va throttle farqi nima?',
        answer: `Debounce — foydalanuvchi TO'XTAGANDAN keyin chaqirish. Har yangi event eski timer-ni bekor qiladi. Faqat OXIRGI event ishlanadi. Misol: qidiruv input — 300ms to'xtagach fetch. Throttle — belgilangan intervalda faqat 1 MARTA chaqirish. Interval ichida qancha event bo'lsa ham faqat bittasi ishlanadi. Misol: scroll — 100ms da 1 marta. Debounce = natija kerak (qidiruv, validatsiya). Throttle = jarayon kerak (scroll, drag, resize).`,
      },
      {
        question: 'React-da debounce qanday qilinadi?',
        answer: `3 ta usul: 1) useDebounce custom hook — qiymatni setTimeout bilan kechiktirish, cleanup bilan eski timer-ni bekor qilish. 2) useDeferredValue (React 18+) — qiymatni past prioritet qilish, browser bo'sh bo'lganda yangilash. Debounce-dan yaxshiroq — fixed delay emas, adaptive. 3) Kutubxona (lodash/debounce, use-debounce). Eng tavsiya etilgan: useDeferredValue (React native), yoki useDebounce hook (oddiy va tushunarli).`,
      },
      {
        question: 'useDeferredValue debounce-dan nima uchun yaxshiroq?',
        answer: `Debounce — DOIM fixed vaqt kutadi (masalan 300ms). Tez kompyuterda ham 300ms, sekin kompyuterda ham 300ms. useDeferredValue — React concurrent rendering-dan foydalanadi. Tez kompyuterda — deyarli darhol. Sekin kompyuterda — browser bo'sh bo'lganda. Input DOIM responsive — faqat qimmat hisoblash kechiktiriladi. Adaptive — hardware-ga moslashadi. Cheklov: faqat React state uchun ishlaydi, API call-lar uchun debounce kerak.`,
      },
    ],
    relatedTopics: [
      { sectionId: 'react-core', topicId: 'use-deferred-value', label: 'useDeferredValue (React alternativa)' },
      { sectionId: 'component-patterns', topicId: 'custom-hooks', label: 'useDebounce custom hook' },
    ],
  },

  // ===== YANGI MAVZULAR =====
  {
    id: 'web-vitals',
    title: 'Core Web Vitals',
    importance: 2,
    status: 'to-learn',
    description: 'LCP, FID, CLS — Google performance metrikalari',
    content: `Core Web Vitals — Google-ning web sahifa sifatini o'lchaydigan 3 ta asosiy metrika. SEO reytingiga ta'sir qiladi. Real foydalanuvchi tajribasini o'lchaydi.

═══════════════════════════════════════
  3 TA ASOSIY METRIKA
═══════════════════════════════════════

1. LCP (Largest Contentful Paint) — eng katta element qachon ko'rinadi
   YAXSHI: < 2.5s
   O'RTA: 2.5-4s
   YOMON: > 4s

   Eng katta element: rasm, video, katta matn bloki
   Optimizatsiya: lazy loading, image optimization, code splitting, SSR

2. INP (Interaction to Next Paint) — FID o'rniga (2024+)
   Foydalanuvchi click/tap/keypress qilgandan UI javob berguncha vaqt
   YAXSHI: < 200ms
   O'RTA: 200-500ms
   YOMON: > 500ms

   Optimizatsiya: heavy JS tasks bo'lish, Web Worker, React concurrent features

3. CLS (Cumulative Layout Shift) — sahifa "sakrashi"
   YAXSHI: < 0.1
   O'RTA: 0.1-0.25
   YOMON: > 0.25

   Sabab: rasm/shrift yuklanguncha joy egallaMASLIK
   Optimizatsiya: width/height berish, font-display: swap, skeleton

═══════════════════════════════════════
  REACT-GA TA'SIRI
═══════════════════════════════════════

LCP — React SPA da muammo:
  ❌ Butun JS yuklanguncha sahifa BO'SH
  ✅ Code splitting — faqat kerakli kodni yuklash
  ✅ SSR/SSG — server-da HTML yaratish
  ✅ Streaming — bosqichma-bosqich yuborish

INP — React re-render muammosi:
  ❌ Og'ir re-render UI-ni bloklaydi
  ✅ useDeferredValue, useTransition
  ✅ Virtualization (katta ro'yxatlar)
  ✅ React Compiler (avtomatik memoization)

CLS — Dynamic content:
  ❌ Skeleton-siz loading
  ✅ Placeholder/skeleton ko'rsatish
  ✅ Rasm hajmini oldindan belgilash

═══════════════════════════════════════
  O'LCHASH VOSITALARI
═══════════════════════════════════════

Lab (development):
  - Chrome DevTools → Lighthouse
  - Chrome DevTools → Performance tab
  - PageSpeed Insights (web.dev/measure)

Field (real users):
  - Chrome User Experience Report (CrUX)
  - web-vitals kutubxonasi (npm)
  - Google Search Console

web-vitals kutubxonasi:
  import { onLCP, onINP, onCLS } from 'web-vitals'
  onLCP(console.log)
  onINP(console.log)
  onCLS(console.log)`,
    codeExamples: [
      {
        title: 'web-vitals — metrikalarni o\'lchash',
        language: 'tsx',
        code: `import { onLCP, onINP, onCLS, type Metric } from 'web-vitals'

// Metrikalarni analytics-ga yuborish
function sendToAnalytics(metric: Metric) {
  const body = {
    name: metric.name,          // 'LCP', 'INP', 'CLS'
    value: metric.value,        // millisekund yoki score
    rating: metric.rating,      // 'good', 'needs-improvement', 'poor'
    id: metric.id,              // unique ID
    navigationType: metric.navigationType,
  }

  // Beacon API — sahifa yopilayotganda ham yuboradi
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/analytics', JSON.stringify(body))
  }
}

// Barcha Core Web Vitals-ni kuzatish
onLCP(sendToAnalytics)   // Largest Contentful Paint
onINP(sendToAnalytics)   // Interaction to Next Paint
onCLS(sendToAnalytics)   // Cumulative Layout Shift

// Console-da ko'rish (development)
if (import.meta.env.DEV) {
  onLCP(metric => {
    console.log(\`LCP: \${metric.value.toFixed(0)}ms [\${metric.rating}]\`)
  })
  onINP(metric => {
    console.log(\`INP: \${metric.value.toFixed(0)}ms [\${metric.rating}]\`)
  })
  onCLS(metric => {
    console.log(\`CLS: \${metric.value.toFixed(3)} [\${metric.rating}]\`)
  })
}`,
        description: 'web-vitals kutubxonasi — real user metrikalari. sendBeacon — sahifa yopilayotganda ham yuboradi. rating: good/needs-improvement/poor — avtomatik baholash.',
      },
      {
        title: 'CLS optimizatsiya — rasm va skeleton',
        language: 'tsx',
        code: `// ❌ CLS MUAMMO — rasm yuklanguncha joy yo'q
function BadImage() {
  return <img src="/hero.jpg" alt="Hero" />
  // Rasm yuklanguncha 0px — keyin 400px — sahifa SAKRAYDI
}

// ✅ CLS YECHIM — hajm oldindan belgilangan
function GoodImage() {
  return (
    <img
      src="/hero.jpg"
      alt="Hero"
      width={800}
      height={400}
      className="w-full h-auto"  // responsive, lekin aspect ratio saqlanadi
      loading="lazy"              // viewport-dan tashqarida yuklanMAYDI
    />
  )
}

// ✅ Skeleton — loading vaqtida joy egallash
function ProductCard({ product }: { product?: Product }) {
  if (!product) {
    return (
      <div className="animate-pulse border rounded p-4">
        <div className="bg-gray-200 h-48 rounded mb-4" />  {/* rasm joyi */}
        <div className="bg-gray-200 h-6 rounded w-3/4 mb-2" />  {/* title */}
        <div className="bg-gray-200 h-4 rounded w-1/2" />  {/* price */}
      </div>
    )
  }

  return (
    <div className="border rounded p-4">
      <img src={product.image} alt={product.name}
        width={400} height={192} className="w-full h-48 object-cover rounded" />
      <h3 className="text-lg font-bold mt-2">{product.name}</h3>
      <p className="text-gray-500">{product.price} so'm</p>
    </div>
  )
}`,
        description: 'CLS oldini olish: 1) Rasm width/height berish (aspect ratio saqlanadi), 2) Skeleton loading (joy egallash), 3) loading="lazy" (offscreen rasmlarni kechiktirish).',
      },
    ],
    interviewQA: [
      {
        question: 'Core Web Vitals nima?',
        answer: `Google-ning 3 ta asosiy web performance metrikasi: 1) LCP (Largest Contentful Paint) — eng katta element qachon ko'rinadi, yaxshi <2.5s. 2) INP (Interaction to Next Paint) — foydalanuvchi interaksiyasiga javob vaqti, yaxshi <200ms. 3) CLS (Cumulative Layout Shift) — sahifa layout "sakrashi", yaxshi <0.1. SEO reytingiga ta'sir qiladi. Real foydalanuvchi tajribasini o'lchaydi (lab emas, field metrikalari).`,
      },
      {
        question: 'React SPA-da LCP muammosi nima va qanday hal qilinadi?',
        answer: `SPA-da muammo: butun JS bundle yuklanguncha sahifa BO'SH — LCP juda katta. Yechimlar: 1) Code splitting — faqat kerakli sahifa kodini yuklash (React.lazy), 2) SSR — server-da HTML yaratish (Next.js), foydalanuvchi JS yuklanmasdan oldin kontentni ko'radi, 3) Streaming SSR — bosqichma-bosqich HTML yuborish, 4) Critical CSS inline — birinchi paint tezroq, 5) Rasm optimization — WebP, lazy loading, preload hero image.`,
      },
      {
        question: 'CLS nima va React-da qanday oldini olinadi?',
        answer: `CLS — sahifa elementlarining kutilmagan siljishi (layout shift). Sabablari: 1) Rasm/video hajmi belgilanmagan — yuklanguncha 0px, keyin kengayadi, 2) Font yuklanishi — matn o'lchami o'zgaradi, 3) Dynamic content — yuqoridan element qo'shilsa pastdagilar siljiydi. React-da yechim: rasm-ga width/height berish, Skeleton component (loading vaqtida joy egallash), font-display: swap, dynamic content uchun min-height, Suspense fallback to'g'ri o'lchamda.`,
      },
    ],
    relatedTopics: [
      { sectionId: 'performance', topicId: 'profiler-devtools', label: 'React Profiler' },
      { sectionId: 'performance', topicId: 'code-splitting', label: 'Code Splitting (LCP)' },
      { sectionId: 'theory-questions', topicId: 'ssr-csr-ssg', label: 'SSR (performance)' },
    ],
  },
  {
    id: 'bundle-optimization',
    title: 'Bundle Optimization',
    importance: 2,
    status: 'to-learn',
    description: 'Tree shaking, bundle analysis, dynamic imports',
    content: `Bundle optimization — production build hajmini kamaytirish. Kichikroq bundle = tezroq yuklash = yaxshiroq UX va SEO.

═══════════════════════════════════════
  BUNDLE HAJMI NIMA UCHUN MUHIM
═══════════════════════════════════════

Har 100KB JS:
  - ~300ms parse/compile vaqti (o'rtacha mobil qurilma)
  - Network yuklash vaqti (3G: ~3s, 4G: ~0.5s)
  - TTI (Time to Interactive) kechikishi

Target bundle hajmlari:
  Kichik ilova: <200KB (gzipped)
  O'rta ilova: 200-500KB
  Katta ilova: 500KB+ (code splitting SHART)

═══════════════════════════════════════
  TREE SHAKING
═══════════════════════════════════════

Tree shaking — ishlatilMAGAN kodni OLIB TASHLASH.
ES modules (import/export) bilan ishlaydi:

  // lodash — butun kutubxona (70KB)
  import _ from 'lodash'
  _.debounce(fn, 300)

  // lodash-es — faqat kerakli funksiya (2KB)
  import { debounce } from 'lodash-es'
  debounce(fn, 300)

  // Eng yaxshi — alohida import
  import debounce from 'lodash/debounce'

Tree shaking ishlashi uchun:
  ✅ ES modules (import/export) ishlatish
  ✅ Side effect-siz modullar ("sideEffects": false)
  ❌ CommonJS (require) — tree shake bo'lMAYDI

═══════════════════════════════════════
  BUNDLE ANALYSIS
═══════════════════════════════════════

Bundle tarkibini vizual ko'rish:

Vite:
  npx vite-bundle-visualizer
  // Interactive treemap — har chunk va modul hajmi

Webpack:
  npx webpack-bundle-analyzer

Ko'rish kerak:
  - Eng katta dependency-lar
  - Duplicate dependency-lar
  - Ishlatilmagan kutubxonalar

═══════════════════════════════════════
  OPTIMIZATSIYA STRATEGIYALARI
═══════════════════════════════════════

1. Katta kutubxonalarni almashtirish:
   moment.js (300KB) → date-fns (tree-shakeable)
   lodash (70KB) → lodash-es yoki native JS
   axios (13KB) → fetch API (built-in)

2. Dynamic import:
   const Chart = lazy(() => import('chart-library'))
   // Faqat kerak bo'lganda yuklanadi

3. Vendor splitting:
   React, ReactDOM — alohida chunk (kamdan-kam o'zgaradi, keshlanadi)

4. Image optimization:
   WebP format, lazy loading, srcset

5. Compression:
   gzip yoki brotli — 60-80% hajm kamaytirish

═══════════════════════════════════════
  VITE OPTIMIZATSIYA
═══════════════════════════════════════

Vite avtomatik:
  ✅ Tree shaking (Rollup/Rolldown)
  ✅ Code splitting (dynamic import)
  ✅ CSS code splitting
  ✅ Asset hashing (cache busting)
  ✅ Minification (esbuild/terser)

Manual sozlash:
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router'],
        }
      }
    }
  }`,
    codeExamples: [
      {
        title: 'Bundle analysis va optimization',
        language: 'ts',
        code: `// 1. BUNDLE ANALYSIS — hajmni ko'rish
// Terminal: npx vite-bundle-visualizer

// 2. KATTA DEPENDENCY-LARNI ALMASHTIRISH

// ❌ Butun lodash (70KB)
import _ from 'lodash'
_.debounce(fn, 300)
_.throttle(fn, 100)

// ✅ Faqat kerakli funksiyalar (2-3KB)
import debounce from 'lodash/debounce'
import throttle from 'lodash/throttle'

// ✅✅ Native JS (0KB qo'shimcha)
function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

// ❌ moment.js (300KB!)
import moment from 'moment'
moment().format('YYYY-MM-DD')

// ✅ date-fns (tree-shakeable, faqat kerakli funksiya)
import { format } from 'date-fns'
format(new Date(), 'yyyy-MM-dd')

// ✅✅ Intl API (built-in, 0KB)
new Intl.DateTimeFormat('uz', { dateStyle: 'medium' }).format(new Date())`,
        description: 'Bundle hajmini kamaytirish: katta kutubxonalarni kichikroq alternativalar yoki native JS bilan almashtirish. lodash → lodash/specific yoki native, moment → date-fns yoki Intl.',
      },
      {
        title: 'Vite — manual chunks va optimization',
        language: 'ts',
        code: `// vite.config.ts
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    // Chunk hajm ogohlantirish chegarasi
    chunkSizeWarningLimit: 500, // KB

    rollupOptions: {
      output: {
        // Vendor chunk-larni ajratish
        manualChunks(id) {
          // React core — alohida chunk (kamdan-kam o'zgaradi)
          if (id.includes('node_modules/react')) {
            return 'react-vendor'
          }
          // Router — alohida
          if (id.includes('node_modules/react-router')) {
            return 'router'
          }
          // UI kutubxonalar — alohida
          if (id.includes('node_modules/@tanstack')) {
            return 'tanstack'
          }
        },
      },
    },

    // Source map production-da yo'q
    sourcemap: false,

    // Minification
    minify: 'esbuild', // tezroq, yoki 'terser' (kichikroq)
  },
})

// Natija:
// react-vendor.js   — 130KB (React + ReactDOM, kamdan-kam o'zgaradi → cache)
// router.js         — 20KB  (React Router)
// tanstack.js       — 30KB  (TanStack Query)
// index.js          — 50KB  (bizning kod)
// DashboardPage.js  — 15KB  (lazy loaded)`,
        description: 'manualChunks — vendor kutubxonalarni alohida chunk-ga ajratish. Afzallik: ular kamdan-kam o\'zgaradi, browser keshda saqlaydi. Bizning kod o\'zgarsa — vendor qayta yuklanMAYDI.',
      },
    ],
    interviewQA: [
      {
        question: 'Tree shaking nima va qanday ishlaydi?',
        answer: `Tree shaking — build vaqtida ishlatilMAGAN kodni olib tashlash. ES modules (import/export) bilan ishlaydi — bundler statik tahlil qiladi va import qilinmagan export-larni olib tashlaydi. Misol: lodash-es dan faqat debounce import qilsangiz — qolgan 200+ funksiya bundle-ga qo'shilMAYDI. Ishlashi uchun: ES modules ishlatish (CommonJS require emas), sideEffects: false package.json-da, production build (development-da o'chirilgan).`,
      },
      {
        question: 'Bundle hajmini qanday kamaytirish mumkin?',
        answer: `1) Bundle analysis — vite-bundle-visualizer bilan katta dependency-larni topish. 2) Tree shaking — faqat kerakli funksiyalarni import qilish (lodash → lodash/debounce). 3) Katta kutubxonalarni almashtirish (moment→date-fns, axios→fetch). 4) Code splitting — dynamic import bilan alohida chunk. 5) Vendor splitting — react, react-dom alohida chunk (cache). 6) Compression — gzip/brotli (60-80% kamaytirish). 7) Lazy loading — og'ir komponentlar kerak bo'lganda. Qoida: avval o'lchang (analysis), keyin optimizatsiya.`,
      },
      {
        question: 'Vendor chunk nima uchun ajratiladi?',
        answer: `Vendor chunk — node_modules (react, react-dom, router) alohida fayl. Sabab: vendor kod kamdan-kam o'zgaradi (faqat dependency yangilanganda), bizning kod tez-tez o'zgaradi. Ajratilsa: vendor chunk browser keshda UZOQ saqlanadi (months), deploy qilganda faqat o'zgargan chunk qayta yuklanadi (bizning kod). Natija: qayta tashrif buyuruvchilar uchun tezroq yuklash — faqat o'zgargan kichik chunk yuklanadi, 130KB React qayta yuklanMAYDI.`,
      },
    ],
    relatedTopics: [
      { sectionId: 'performance', topicId: 'code-splitting', label: 'Code Splitting' },
      { sectionId: 'component-patterns', topicId: 'suspense-lazy', label: 'Lazy Loading' },
    ],
  },
]
