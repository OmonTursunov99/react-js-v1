import type { Topic } from '../../types'

export const useCallback: Topic = {
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
    { id: 1, text: 'React o'rganish', done: false },
    { id: 2, text: 'TypeScript o'rganish', done: true },
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
        description: `Eng asosiy useCallback use case. TodoItem — React.memo bilan o'ralgan. handleToggle va handleDelete useCallback bilan keshlanadi. Natija: input yozganda 100 ta TodoItem renderlanMAYDI — faqat input render bo'ladi.`,
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
        description: `useCallback useEffect dependency sifatida. useCallback bo'lmasa, fetchResults har renderda yangi referens oladi va useEffect cheksiz ishlaydi. useCallback bilan faqat apiUrl o'zgarganda yangi funksiya yaratiladi — effect barqaror ishlaydi.`,
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
        description: `List pattern — bitta useCallback barcha list item-lar uchun ishlaydi. id parameter orqali qaysi element ekanini aniqlaydi. Har element uchun alohida callback yaratish NOTO'G'RI — bitta umumiy callback + id pattern eng yaxshi.`,
      },
    ],
    interviewQA: [
      {
        question: `useCallback yolg'iz (React.memo-siz) ishlatsa foyda bormi?`,
        answer: `Deyarli yo'q. useCallback funksiya REFERENSINI saqlaydi, lekin agar child komponent React.memo bilan o'ralmagan bo'lsa, u baribir har renderda renderlanadi — funksiya referensi bir xil bo'lsa ham. Yagona foyda: useEffect dependency sifatida — useCallback bo'lmasa useEffect cheksiz ishlashi mumkin. Qolgan hollarda useCallback YOLG'IZ ishlatish faqat ortiqcha overhead qo'shadi. Qoida: useCallback = React.memo bilan JUFTLIKDA ishlatish.`,
      },
      {
        question: 'React.memo + useCallback qachon kerak?',
        answer: `Kerak bo'lgan holatlar: 1) Katta list render (100+ element) — har element uchun callback, 2) Og'ir child komponent (ko'p DOM element, murakkab hisoblash), 3) Child tez-tez renderlanmasligi kerak (animatsiya, chart, canvas). KERAK EMAS: oddiy button onClick, kichik komponentlar, yagona child. Qoida: avval React DevTools Profiler bilan tekshiring — muammo bormi? Muammo bo'lsa — memo + useCallback qo'shing. Muammo yo'q bo'lsa — keraksiz murakkablik.`,
      },
      {
        question: `useCallback ichida stale closure qanday bo'ladi?`,
        answer: `useCallback dependency noto'g'ri berilsa, ichidagi o'zgaruvchilar ESKi qiymatda qoladi. Masalan: useCallback(() => console.log(count), []) — count doim 0 bo'lib qoladi. Yechim: 1) Barcha ishlatilgan o'zgaruvchilarni dependency-ga qo'shish, 2) setState updater function ishlatish: useCallback(() => setCount(prev => prev + 1), []) — prev doim yangi. ESLint react-hooks/exhaustive-deps qoidasi bu muammoni avtomatik topadi.`,
      },
      {
        question: `Performance optimization strategiyasi qanday bo'lishi kerak?`,
        answer: `To'g'ri tartib: 1) Avval kodni TO'G'RI yozing — premature optimization qilmang, 2) Muammo bo'lsa — React DevTools Profiler bilan ANIQ joyni toping, 3) State-ni ko'tarish o'rniga TUSHIRISH (lifting state down), 4) Katta komponentni BO'LISH (composition), 5) Eng oxirida — React.memo + useCallback/useMemo. Ko'p hollarda 3-4 qadam yetarli bo'ladi. memo/useCallback/useMemo — eng OXIRGI qadam, eng birinchi emas.`,
      },
    ],
    relatedTopics: [
      { sectionId: 'performance', topicId: 'memo-usememo-usecallback', label: 'memo vs useMemo vs useCallback' },
      { sectionId: 'performance', topicId: 're-render-causes', label: 'Re-render sabablari' },
      { sectionId: 'react-core', topicId: 'react-memo', label: 'React.memo bilan birga' },
    ],
  }
