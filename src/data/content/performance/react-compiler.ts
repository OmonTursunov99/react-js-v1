import type { Topic } from '../../types'

export const reactCompiler: Topic = {
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
  }
