import type { Topic } from '../../types'

export const navigationHooks: Topic = {
    id: 'navigation-hooks',
    title: 'useNavigate, useParams, useSearchParams',
    importance: 3,
    status: 'to-learn',
    description: 'Programmatic navigation, URL params',
    content: `React Router-ning asosiy hook-lari — URL bilan ishlash, programmatic navigatsiya, va URL parametrlarini olish uchun.

═══════════════════════════════════════
  useNavigate — PROGRAMMATIC NAVIGATSIYA
═══════════════════════════════════════

Link — foydalanuvchi bosish uchun.
useNavigate — KOD ichidan navigatsiya uchun:

  const navigate = useNavigate()

  // Oddiy navigatsiya
  navigate('/dashboard')

  // Parametrlar bilan
  navigate('/users/123')

  // Replace (orqaga qaytganda bu sahifa ko'rinmasin)
  navigate('/login', { replace: true })

  // State bilan (URL-da ko'rinmaydi)
  navigate('/success', { state: { orderId: '456' } })

  // Relative — orqaga/oldinga
  navigate(-1)   // orqaga (browser back tugmasi kabi)
  navigate(1)    // oldinga
  navigate(-2)   // 2 qadam orqaga

Qachon ishlatiladi:
  ✅ Form submit-dan keyin redirect
  ✅ Login/logout-dan keyin
  ✅ Conditional redirect (if/else asosida)
  ✅ Timer tugagandan keyin

═══════════════════════════════════════
  useParams — DINAMIK URL SEGMENTLARI
═══════════════════════════════════════

Route path-dagi :param segmentlarini olish:

  // Route: path: 'users/:userId'
  // URL:   /users/123

  function UserPage() {
    const { userId } = useParams()
    // userId = '123' (DOIM string!)
  }

  // Bir nechta param:
  // Route: path: 'shop/:category/:productId'
  // URL:   /shop/electronics/456

  const { category, productId } = useParams()
  // category = 'electronics', productId = '456'

MUHIM: useParams DOIM string qaytaradi.
Agar number kerak bo'lsa — o'zingiz convert qiling:
  const id = Number(params.userId)

═══════════════════════════════════════
  useSearchParams — QUERY STRING
═══════════════════════════════════════

URL-dagi ?key=value parametrlari bilan ishlash:

  // URL: /products?category=phones&page=2&sort=price

  const [searchParams, setSearchParams] = useSearchParams()

  // O'qish
  searchParams.get('category')  // 'phones'
  searchParams.get('page')      // '2' (string!)
  searchParams.get('missing')   // null

  // Yangilash
  setSearchParams({ category: 'phones', page: '3' })
  // URL: /products?category=phones&page=3

  // Qisman yangilash (mavjudlarni saqlash)
  setSearchParams(prev => {
    prev.set('page', '3')       // faqat page o'zgaradi
    return prev
  })

useState vs useSearchParams:
  useState — sahifa yangilansa yo'qoladi, bookmark mumkin emas
  useSearchParams — URL-da saqlanadi, bookmark/share mumkin

═══════════════════════════════════════
  useLocation — HOZIRGI URL MA'LUMOTLARI
═══════════════════════════════════════

  const location = useLocation()

  location.pathname   // '/users/123'
  location.search     // '?tab=posts'
  location.hash       // '#section-2'
  location.state      // navigate-dan yuborilgan state
  location.key        // unique key (har navigatsiyada o'zgaradi)

Ishlatish:
  ✅ Aktiv sahifani aniqlash
  ✅ Navigatsiya state-ni olish (redirect back)
  ✅ Analytics (sahifa ko'rishlarni kuzatish)

═══════════════════════════════════════
  useNavigation — NAVIGATSIYA HOLATI
═══════════════════════════════════════

  const navigation = useNavigation()

  navigation.state
    'idle'        — hech narsa yuklanmayapti
    'loading'     — yangi sahifa yuklanmoqda (loader ishlayapti)
    'submitting'  — form submit bo'lmoqda (action ishlayapti)

  // Global loading indicator
  {navigation.state === 'loading' && <ProgressBar />}`,
    codeExamples: [
      {
        title: 'useNavigate — turli xil navigatsiya',
        language: 'tsx',
        code: `import { useNavigate } from 'react-router'

function LoginPage() {
  const navigate = useNavigate()

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    try {
      await api.login({
        email: formData.get('email') as string,
        password: formData.get('password') as string,
      })

      // Muvaffaqiyatli → dashboard-ga
      navigate('/dashboard', { replace: true })
    } catch {
      // Xato → shu yerda qolish (navigate QILMA)
    }
  }

  return <form onSubmit={handleLogin}>...</form>
}

function ProductCard({ id, name }: { id: string; name: string }) {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(\`/products/\${id}\`)}
      className="cursor-pointer hover:shadow-lg"
    >
      <h3>{name}</h3>
      <button onClick={(e) => {
        e.stopPropagation()  // card click-ni to'xtatish
        navigate(\`/products/\${id}/edit\`)
      }}>
        Tahrirlash
      </button>
    </div>
  )
}

function BackButton() {
  const navigate = useNavigate()
  return <button onClick={() => navigate(-1)}>← Orqaga</button>
}`,
        description: 'useNavigate — login redirect (replace), card click navigatsiya, orqaga qaytish (-1). replace: true — login sahifasi history-da qolmasligi uchun.',
      },
      {
        title: 'useParams + useSearchParams — filtrlangan ro\'yxat',
        language: 'tsx',
        code: `import { useParams, useSearchParams, Link } from 'react-router'
import { useQuery } from '@tanstack/react-query'

// Route: /shop/:category
// URL:   /shop/electronics?page=2&sort=price&q=laptop

function ShopPage() {
  // URL path dan
  const { category } = useParams<{ category: string }>()

  // Query string dan
  const [searchParams, setSearchParams] = useSearchParams()
  const page = Number(searchParams.get('page') ?? '1')
  const sort = searchParams.get('sort') ?? 'newest'
  const query = searchParams.get('q') ?? ''

  // TanStack Query — params o'zgarsa avtomatik refetch
  const { data, isLoading } = useQuery({
    queryKey: ['products', category, { page, sort, query }],
    queryFn: () => fetchProducts({ category: category!, page, sort, query }),
  })

  // Filter o'zgartirish
  function handleSortChange(newSort: string) {
    setSearchParams(prev => {
      prev.set('sort', newSort)
      prev.set('page', '1')  // sort o'zgarsa 1-sahifaga qaytish
      return prev
    })
  }

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    setSearchParams(prev => {
      prev.set('q', formData.get('search') as string)
      prev.set('page', '1')
      return prev
    })
  }

  function handlePageChange(newPage: number) {
    setSearchParams(prev => {
      prev.set('page', String(newPage))
      return prev
    })
  }

  return (
    <div>
      <h1>{category} mahsulotlari</h1>

      <form onSubmit={handleSearch}>
        <input name="search" defaultValue={query} placeholder="Qidirish..." />
      </form>

      <select value={sort} onChange={e => handleSortChange(e.target.value)}>
        <option value="newest">Eng yangi</option>
        <option value="price">Narx bo'yicha</option>
        <option value="popular">Mashhur</option>
      </select>

      {data?.products.map(p => <ProductCard key={p.id} product={p} />)}

      <button disabled={page <= 1} onClick={() => handlePageChange(page - 1)}>
        Oldingi
      </button>
      <span>Sahifa {page} / {data?.totalPages}</span>
      <button onClick={() => handlePageChange(page + 1)}>
        Keyingi
      </button>
    </div>
  )
}`,
        description: 'useParams — URL path (:category). useSearchParams — query string (page, sort, q). setSearchParams(prev => ...) — mavjud parametrlarni saqlash. TanStack Query key-ga params qo\'shish — avtomatik refetch.',
      },
      {
        title: 'useLocation — analytics va state',
        language: 'tsx',
        code: `import { useLocation, useNavigate } from 'react-router'
import { useEffect } from 'react'

// Sahifa ko'rishlarni kuzatish
function usePageTracking() {
  const location = useLocation()

  useEffect(() => {
    // Har sahifa o'zgarganda analytics yuborish
    analytics.pageView(location.pathname + location.search)
  }, [location.pathname, location.search])
}

// Scroll to top — sahifa o'zgarganda tepaga qaytish
function useScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
}

// Navigate state bilan ishlash
function OrderSuccessPage() {
  const location = useLocation()
  const navigate = useNavigate()

  // navigate('/success', { state: { orderId: '123' } })
  const orderId = location.state?.orderId

  // State yo'q bo'lsa — bu sahifaga to'g'ridan-to'g'ri kirilgan
  if (!orderId) {
    return (
      <div>
        <p>Buyurtma topilmadi</p>
        <button onClick={() => navigate('/')}>Bosh sahifaga</button>
      </div>
    )
  }

  return (
    <div>
      <h1>Buyurtma qabul qilindi!</h1>
      <p>Buyurtma raqami: {orderId}</p>
    </div>
  )
}`,
        description: 'useLocation — sahifa kuzatish (analytics), scroll to top, navigate state. State URL-da ko\'rinmaydi — bir martalik ma\'lumot uchun (order ID, redirect info).',
      },
    ],
    interviewQA: [
      {
        question: 'useNavigate va Link farqi nima? Qachon qaysi birini ishlatish kerak?',
        answer: `Link — deklarativ, JSX-da foydalanuvchi bosish uchun. <a> tag yaratadi — accessibility va SEO uchun yaxshi. Doim Link ishlatish kerak, agar foydalanuvchi ko'rishi va bosishi mumkin bo'lsa. useNavigate — imperativ, kod ichidan navigatsiya. Form submit, login, timer, conditional redirect uchun. navigate() funksiyasi — UI element yaratMAYDI. Qoida: foydalanuvchi bosadigan narsa = Link/NavLink. Kod logikasi natijasida navigatsiya = useNavigate.`,
      },
      {
        question: 'useParams nima qaytaradi? Tipizatsiya qanday?',
        answer: `useParams() — URL path-dagi dinamik segmentlarni object sifatida qaytaradi. DOIM string yoki undefined qaytaradi. Route: "users/:userId" → {userId: "123"}. TypeScript-da: useParams<{userId: string}>() — tip berish mumkin, lekin runtime-da hali ham string | undefined. Number kerak bo'lsa — Number(params.userId) bilan convert. Optional params uchun: "users/:userId?" — userId undefined bo'lishi mumkin.`,
      },
      {
        question: 'useSearchParams va useState farqi nima?',
        answer: `useState — xotirada saqlanadi, sahifa yangilansa yo'qoladi, bookmark/share mumkin emas, URL-da ko'rinmaydi. useSearchParams — URL-da saqlanadi (?key=value), sahifa yangilansa saqlanadi, bookmark/share mumkin, browser history-da kuzatiladi. Qachon useSearchParams: filter, sort, sahifa raqami, qidiruv so'zi — foydalanuvchi bookmark qilishi yoki link share qilishi kerak bo'lgan holatlar. Qachon useState: modal ochiq/yopiq, tooltip — URL-da ko'rinishi kerak bo'lmagan holatlar.`,
      },
      {
        question: 'useLocation.state nima uchun ishlatiladi?',
        answer: `navigate('/path', { state: {...} }) bilan yuborilgan ma'lumot. URL-da ko'rinMAYDI, faqat xotirada saqlanadi. Ishlatish holatlari: 1) redirect back — oldingi URL-ni saqlash (from: location), 2) bir martalik ma'lumot — orderId, success message, 3) sahifalar orasida vaqtinchalik data uzatish. Cheklovlar: sahifa qayta yuklansa — state yo'qoladi, bookmark bilan saqlab bo'lmaydi. Doimiy ma'lumot uchun URL params yoki store ishlatish kerak.`,
      },
      {
        question: 'navigate(-1) va navigate("/") farqi nima?',
        answer: `navigate(-1) — browser history-da bitta qadam ORQAGA. Oldingi sahifa qaysi bo'lsa — shunga qaytadi. Agar history bo'sh bo'lsa — hech narsa qilmaydi. navigate("/") — DOIM bosh sahifaga boradi, history-dan qat'iy nazar. navigate(-1) = browser-ning back tugmasi. navigate("/") = to'g'ridan-to'g'ri manzil. Qoida: "orqaga" tugmasi uchun navigate(-1), aniq sahifaga yo'naltirish uchun navigate("/path").`,
      },
    ],
    relatedTopics: [
      { sectionId: 'routing', topicId: 'react-router-basics', label: 'Router asoslari' },
      { sectionId: 'routing', topicId: 'protected-routes', label: 'Protected Routes' },
    ],
  }
