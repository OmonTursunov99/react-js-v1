import type { Topic } from '../../../types'

export const useMemo: Topic = {
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
        title: `Katta ro'yxatni filterlash — 10000 element`,
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
        description: `Katta ro'yxat filter + sort. useMemo-siz har renderda 10000 ta elementni qayta filter/sort qiladi. useMemo bilan faqat query, sortBy yoki minPrice o'zgarganda ishlaydi. Boshqa state o'zgarsa — eski natija qaytadi.`,
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
        description: `React.memo + useMemo kombinatsiyasi. useMemo-siz har renderda yangi { backgroundColor: ... } object yaratiladi — React.memo buni o'zgardi deb hisoblaydi. useMemo bilan object referensi saqlanadi — child renderlanmaydi.`,
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
        description: `Qimmat hisoblash misoli. fibonacci(35) bir necha soniya olishi mumkin. useMemo-siz tema o'zgarganda ham fibonacci qayta hisoblanadi. useMemo bilan faqat num o'zgarganda ishlaydi — tema o'zgarishi tezkor bo'ladi.`,
      },
    ],
    interviewQA: [
      {
        question: 'useMemo qachon kerak, qachon ortiqcha (premature optimization)?',
        answer: `useMemo kerak bo'lgan holatlar: 1) Katta array filter/sort/map (1000+ element), 2) Murakkab matematik hisoblash, 3) React.memo-langan child-ga object/array props berish. useMemo ORTIQCHA bo'lgan holatlar: oddiy hisoblash (a + b, string concatenation), primitive qiymatlar (number, string — referens muammosi yo'q), dependency har renderda o'zgarsa (kesh hech qachon ishlatilmaydi). Qoida: avval profiling qiling, keyin optimize qiling. Premature optimization — barcha yomonliklarning ildizi.`,
      },
      {
        question: 'useMemo vs useCallback farqi nima?',
        answer: `useMemo — QIYMAT (natija) ni keshlaydi: const value = useMemo(() => compute(), [deps]). useCallback — FUNKSIYA referensini keshlaydi: const fn = useCallback(() => doSomething(), [deps]). Aslida useCallback(fn, deps) === useMemo(() => fn, deps). useCallback faqat qulaylik uchun — funksiya uchun useMemo yozish uzunroq bo'lardi. useMemo funksiyani CHAQIRADI va NATIJAsini saqlaydi. useCallback funksiyani chaqirMAYDI, O'ZINi saqlaydi.`,
      },
      {
        question: 'useMemo garantiya beradimi? Cache eviction nima?',
        answer: `React rasmiy hujjatlari aytadi: useMemo — "performance optimization, not a semantic guarantee". Ya'ni React keshni istalgan vaqtda tashlashi MUMKIN (masalan, offscreen component uchun). Kelajakda React kesh hajmini cheklashi mumkin. Shuning uchun useMemo-ga bog'liq mantiq yozish NOTO'G'RI: masalan, useMemo ichida faqat bir marta ishlaydigan side effect qo'yish xavfli. useMemo faqat PERFORMANCE uchun ishlatish kerak, TO'G'RILIK uchun emas.`,
      },
      {
        question: 'React Compiler useMemo-ni almashtira oladimi?',
        answer: `Ha, React 19 Compiler (bu loyihada yoqilgan) avtomatik memoizatsiya qiladi. Compiler kodni tahlil qilib, qayerda memoizatsiya kerakligini aniqlaydi va build vaqtida useMemo/useCallback ni avtomatik qo'shadi. Lekin hozircha Compiler hali barcha holatlarni 100% qamrab olmagan. Shuningdek, eski loyihalarda Compiler yo'q — u yerda qo'lda useMemo yozish kerak. Interview uchun useMemo bilish SHART — chunki tushunchani bilish muhim, hatto Compiler avtomatik qilsa ham.`,
      },
    ],
    relatedTopics: [
      { techId: 'react-js', sectionId: 'performance', topicId: 'memo-usememo-usecallback', label: 'memo vs useMemo vs useCallback' },
      { techId: 'react-js', sectionId: 'performance', topicId: 're-render-causes', label: 'Re-render sabablari' },
      { techId: 'react-js', sectionId: 'performance', topicId: 'react-compiler', label: 'React Compiler (avtomatik)' },
    ],
  }
