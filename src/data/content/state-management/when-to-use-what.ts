import type { Topic } from '../../types'

export const whenToUseWhat: Topic = {
    id: 'when-to-use-what',
    title: 'Qachon nima ishlatish',
    importance: 3,
    status: 'to-learn',
    description: 'Local vs Context vs Redux vs Zustand vs Server state',
    content: `State management tanlash — Senior React developer uchun eng muhim arxitektura qarori. Noto'g'ri tanlov — ortiqcha murakkablik yoki yetishmovchilik olib keladi.

═══════════════════════════════════════
  STATE TURLARI
═══════════════════════════════════════

1. LOCAL STATE — bitta komponent ichida
   useState, useReducer
   Misol: form input, modal ochiq/yopiq, toggle

2. LIFTED STATE — bir necha yaqin komponent orasida
   Ota komponentda state, props orqali pastga
   Misol: filter + ro'yxat, form + preview

3. SHARED/GLOBAL STATE — ko'p komponentlar orasida
   Context, Redux, Zustand
   Misol: auth user, tema, savat (cart)

4. SERVER STATE — backenddan kelgan ma'lumotlar
   TanStack Query, RTK Query
   Misol: foydalanuvchilar ro'yxati, mahsulotlar, postlar

5. URL STATE — URL-da saqlanadigan holat
   React Router (useSearchParams, useParams)
   Misol: filtr, sahifa raqami, tab, qidiruv so'zi

6. FORM STATE — forma holati
   React Hook Form, Formik, yoki useState
   Misol: murakkab validatsiya, multi-step formalar

═══════════════════════════════════════
  QAROR DARAXTI (Decision Tree)
═══════════════════════════════════════

State kerakmi?
  ├── Yo'q → oddiy o'zgaruvchi yoki computed value
  └── Ha
      ├── Faqat bitta komponent uchunmi?
      │   └── Ha → useState / useReducer
      ├── URL-da ko'rinishi kerakmi?
      │   └── Ha → useSearchParams / useParams
      ├── Serverdan kelgan datami?
      │   └── Ha → TanStack Query / RTK Query
      ├── Forma datami?
      │   └── Ha → React Hook Form / useState
      ├── 2-3 ta yaqin komponent orasimi?
      │   └── Ha → lift state up (ota komponentga)
      ├── Ko'p komponentlar, kamdan-kam o'zgaradimi?
      │   └── Ha → Context API
      └── Ko'p komponentlar, tez-tez o'zgaradimi?
          ├── Kichik/o'rta ilova → Zustand
          └── Katta ilova, strict pattern kerak → Redux Toolkit

═══════════════════════════════════════
  HAR BIR YECHIMNING KUCHI VA CHEKLOVI
═══════════════════════════════════════

useState / useReducer:
  ✅ Eng oddiy, React built-in
  ✅ Hech narsa o'rnatish kerak emas
  ❌ Komponentlar orasida sharing qiyin
  ❌ Props drilling muammosi

Context API:
  ✅ React built-in, qo'shimcha kutubxona kerak emas
  ✅ Props drilling hal qiladi
  ❌ Re-render muammosi (value o'zgarsa HAR consumer re-render)
  ❌ State management emas — data passing mexanizmi
  ❌ DevTools yo'q

Redux Toolkit:
  ✅ Predictable (one-way data flow)
  ✅ DevTools (time-travel debugging)
  ✅ Katta jamoalarda yaxshi (strict pattern)
  ✅ Middleware tizimi (async, logging)
  ❌ Boilerplate (Zustand-dan ko'p)
  ❌ Bundle kattaroq (~11KB)
  ❌ Kichik ilovalar uchun ortiqcha

Zustand:
  ✅ Minimal boilerplate
  ✅ Kichik bundle (~1KB)
  ✅ Provider kerak emas
  ✅ Selector pattern (performance)
  ❌ DevTools cheklangan (middleware kerak)
  ❌ Strict pattern yo'q (katta jamoalarda tartib qiyin)

TanStack Query:
  ✅ Server state uchun eng yaxshi
  ✅ Keshlash, refetch, retry, pagination
  ✅ Loading/error holatlari tayyor
  ❌ Faqat server state uchun (client state emas)
  ❌ O'rganish egri chizig'i bor

═══════════════════════════════════════
  REAL-WORLD KOMBINATSIYALAR
═══════════════════════════════════════

Kichik ilova (blog, portfolio):
  - useState + useContext(tema) + fetch/useEffect
  - Yoki: useState + TanStack Query

O'rta ilova (dashboard, e-commerce):
  - Zustand (client state) + TanStack Query (server state)
  - Yoki: Redux Toolkit + RTK Query

Katta ilova (enterprise, katta jamoa):
  - Redux Toolkit (client state) + RTK Query (server state)
  - Yoki: Redux Toolkit + TanStack Query

═══════════════════════════════════════
  ENG KO'P XATOLAR
═══════════════════════════════════════

1. Hamma narsani Redux-ga qo'yish
   ❌ Form input, modal holati — bu LOKAL state
   ❌ API data — bu SERVER state (TanStack Query bilan)
   ✅ Redux faqat haqiqiy GLOBAL client state uchun

2. Context-ni state management deb o'ylash
   ❌ Context tez-tez o'zgaradigan data uchun emas
   ✅ Context = kamdan-kam o'zgaradigan data passing

3. Server state-ni client store-da saqlash
   ❌ Redux-da users[] saqlash va qo'lda sync qilish
   ✅ TanStack Query-ga berish — kesh, refetch avtomatik

4. State kerak emas joyda state ishlatish
   ❌ const [fullName, setFullName] = useState(first + last)
   ✅ const fullName = first + ' ' + last (computed value)`,
    codeExamples: [
      {
        title: 'Zamonaviy stack — Zustand + TanStack Query',
        language: 'tsx',
        code: `// ===== CLIENT STATE — Zustand =====
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AppStore {
  theme: 'light' | 'dark'
  sidebarOpen: boolean
  toggleTheme: () => void
  toggleSidebar: () => void
}

const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      theme: 'light',
      sidebarOpen: true,
      toggleTheme: () => set(s => ({ theme: s.theme === 'light' ? 'dark' : 'light' })),
      toggleSidebar: () => set(s => ({ sidebarOpen: !s.sidebarOpen })),
    }),
    { name: 'app-settings' }
  )
)

// ===== SERVER STATE — TanStack Query =====
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

function ProductList() {
  // Server state — TanStack Query boshqaradi
  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  })

  // Client state — Zustand boshqaradi
  const sidebarOpen = useAppStore(s => s.sidebarOpen)

  if (isLoading) return <p>Yuklanmoqda...</p>

  return (
    <div className={sidebarOpen ? 'with-sidebar' : 'full-width'}>
      {products?.map(p => <ProductCard key={p.id} product={p} />)}
    </div>
  )
}`,
        description: 'Eng mashhur zamonaviy stack: Zustand — client state (tema, sidebar, UI holati), TanStack Query — server state (API data, kesh). Har biri o\'z ishini qiladi.',
      },
      {
        title: 'State turlari — bir sahifada hammasi',
        language: 'tsx',
        code: `import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { create } from 'zustand'

// 1. URL STATE — filter va sahifa raqami
function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const category = searchParams.get('category') ?? 'all'
  const page = Number(searchParams.get('page') ?? '1')

  // 2. SERVER STATE — TanStack Query
  const { data, isLoading } = useQuery({
    queryKey: ['products', { category, page }],
    queryFn: () => fetchProducts({ category, page }),
  })

  // 3. LOCAL STATE — faqat bu komponent uchun
  const [selectedId, setSelectedId] = useState<string | null>(null)

  // 4. GLOBAL STATE — Zustand
  const addToCart = useCartStore(s => s.addItem)

  // Filter o'zgartirish — URL yangilanadi
  function handleCategoryChange(cat: string) {
    setSearchParams({ category: cat, page: '1' })
  }

  // Sahifa o'zgartirish
  function handlePageChange(p: number) {
    setSearchParams({ category, page: String(p) })
  }

  return (
    <div>
      <CategoryFilter value={category} onChange={handleCategoryChange} />
      <ProductGrid
        products={data?.items ?? []}
        selectedId={selectedId}
        onSelect={setSelectedId}
        onAddToCart={addToCart}
      />
      <Pagination page={page} total={data?.totalPages ?? 0} onChange={handlePageChange} />
    </div>
  )
}`,
        description: 'Bitta sahifada 4 xil state turi: URL (filter/page), Server (products), Local (selectedId), Global (cart). Har biri o\'z joyida — bu to\'g\'ri arxitektura.',
      },
      {
        title: 'Anti-pattern va to\'g\'ri yechim',
        language: 'tsx',
        code: `// ❌ ANTI-PATTERN 1: Hamma narsani Redux-ga qo'yish
const badSlice = createSlice({
  name: 'everything',
  initialState: {
    modalOpen: false,        // ❌ LOCAL state bo'lishi kerak
    formData: {},            // ❌ LOCAL state bo'lishi kerak
    users: [],               // ❌ SERVER state — TanStack Query bilan
    searchQuery: '',         // ❌ URL state — useSearchParams bilan
    theme: 'light',          // ✅ Bu global state — Redux/Zustand to'g'ri
  },
  reducers: { /* ... */ },
})

// ✅ TO'G'RI: har bir state o'z joyida
function CorrectComponent() {
  // LOCAL — faqat bu komponent uchun
  const [modalOpen, setModalOpen] = useState(false)
  const [formData, setFormData] = useState({})

  // URL — bookmark/share qilinishi kerak
  const [searchParams] = useSearchParams()
  const search = searchParams.get('q') ?? ''

  // SERVER — kesh + refetch kerak
  const { data: users } = useQuery({
    queryKey: ['users', { search }],
    queryFn: () => fetchUsers(search),
  })

  // GLOBAL — ko'p komponentlar ishlatadi
  const theme = useAppStore(s => s.theme)

  return <div>...</div>
}

// ❌ ANTI-PATTERN 2: Derived state-ni saqlash
function BadComponent() {
  const [items, setItems] = useState<Item[]>([])
  const [total, setTotal] = useState(0)  // ❌ computed bo'lishi kerak

  function addItem(item: Item) {
    setItems(prev => [...prev, item])
    setTotal(prev => prev + item.price)  // ❌ sinxronizatsiya muammosi
  }
}

// ✅ TO'G'RI: computed value
function GoodComponent() {
  const [items, setItems] = useState<Item[]>([])
  const total = items.reduce((sum, i) => sum + i.price, 0)  // ✅ har doim to'g'ri
}`,
        description: 'Anti-patternlar: 1) Hamma narsani global store-ga qo\'yish, 2) Computed (derived) qiymatni state-da saqlash. Har bir state turi o\'z joyida bo\'lishi kerak.',
      },
    ],
    interviewQA: [
      {
        question: 'React ilovada state management qanday tanlaysiz?',
        answer: `Avval state turini aniqlayman: 1) Local (bitta komponent) → useState/useReducer, 2) URL (bookmark/share kerak) → useSearchParams, 3) Server (API data) → TanStack Query, 4) Form (murakkab validatsiya) → React Hook Form, 5) Shared (2-3 yaqin komponent) → lift state up, 6) Global client (ko'p komponent, kamdan-kam o'zgaradi) → Context, 7) Global client (tez-tez o'zgaradi) → Zustand/Redux. Asosiy printsip: har bir state turini o'z vositasi bilan boshqarish, hamma narsani bitta store-ga qo'yMASLIK.`,
      },
      {
        question: 'Redux vs Zustand vs Context — qachon nima ishlatiladi?',
        answer: `Context — kamdan-kam o'zgaradigan data uchun (tema, til, auth). Har value o'zgarishda barcha consumer-lar re-render. State management emas, data passing. Zustand — kichik-o'rta ilovalar uchun. Minimal boilerplate (~1KB), Provider kerak emas, selector performance. Katta jamoalarda strict pattern yo'qligi muammo. Redux — katta ilovalar va jamoalar uchun. Predictable pattern, DevTools (time-travel), middleware tizimi, strict convention. Boilerplate ko'proq, bundle kattaroq. Qoida: agar Redux keraksiz deb hissangiz — kerak emas. Zustand yetarli.`,
      },
      {
        question: 'Server state va client state ni nima uchun ajratish kerak?',
        answer: `Server state xususiyatlari: source of truth serverda, eskirishi mumkin, boshqa foydalanuvchilar o'zgartirishi mumkin, keshlanishi kerak. Client state xususiyatlari: faqat frontendda, foydalanuvchi boshqaradi, sinxronlash kerak emas. Agar server state-ni Redux-da saqlasangiz: keshni qo'lda boshqarish, stale data muammosi, loading/error state yozish, refetch logikasi — bularni o'zingiz yozishingiz kerak. TanStack Query bularni AVTOMATIK hal qiladi. Ajratish = kam kod, kam xato, yaxshiroq UX.`,
      },
      {
        question: 'URL state nima va qachon ishlatiladi?',
        answer: `URL state — URL-da saqlanadigan holat (query params, path params). Qachon ishlatish kerak: foydalanuvchi bookmark qilishi mumkin bo'lsa (filtr, qidiruv), share qilishi mumkin bo'lsa (link bilan), browser back/forward ishlashi kerak bo'lsa. Masalan: ?category=phones&page=2&sort=price. useSearchParams (React Router) bilan boshqariladi. Bu state React state-ga NUSXALANMASLIGI kerak — URL-dan to'g'ridan-to'g'ri o'qish kerak. URL o'zgarsa — TanStack Query queryKey o'zgaradi — avtomatik refetch.`,
      },
      {
        question: 'Eng ko\'p uchraydigan state management xatolari qanday?',
        answer: `1) Hamma narsani Redux-ga qo'yish — modal holati, form input, API data Redux-da. Aslida: modal = local state, API = TanStack Query. 2) Context-ni state management deb ishlatish — tez-tez o'zgaradigan data Context-da re-render muammosi. 3) Derived state saqlash — total = items.reduce(...) bo'lishi kerak, alohida useState emas. 4) Server state-ni sync qilish — Redux-da users[] saqlash va qo'lda refetch. 5) State kerak emas joyda state — computed value-ni state qilish. Qoida: eng kam state, eng to'g'ri joyda.`,
      },
    ],
    relatedTopics: [
      { sectionId: 'react-core', topicId: 'use-state', label: 'useState (local)' },
      { sectionId: 'react-core', topicId: 'use-reducer', label: 'useReducer (complex local)' },
      { sectionId: 'state-management', topicId: 'context-api', label: 'Context (shared)' },
      { sectionId: 'state-management', topicId: 'redux-toolkit', label: 'Redux (global)' },
      { sectionId: 'state-management', topicId: 'zustand', label: 'Zustand (lightweight global)' },
      { sectionId: 'state-management', topicId: 'tanstack-query', label: 'TanStack Query (server)' },
    ],
  }
