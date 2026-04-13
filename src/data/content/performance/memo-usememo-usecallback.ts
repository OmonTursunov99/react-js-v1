import type { Topic } from '../../types'

export const memoUsememoUsecallback: Topic = {
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
  }
