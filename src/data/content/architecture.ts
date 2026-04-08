import type { Topic } from '../types'

export const architectureTopics: Topic[] = [
  {
    id: 'fsd',
    title: 'Feature-Sliced Design (FSD)',
    importance: 3,
    status: 'to-learn',
    description: 'shared → entities → features → widgets → pages → app',
    content: `Feature-Sliced Design (FSD) — frontend loyihalar uchun arxitektura metodologiyasi. Kodni DARAJALAR (layers) va SEGMENTLAR (slices) bo'yicha tartibga soladi. Rossiya/MDH davlatlarida juda mashhur.

═══════════════════════════════════════
  MUAMMO: TARTIBSIZ KOD
═══════════════════════════════════════

Ko'p loyihalarda:
  src/
  ├── components/   ← 200 ta fayl, qaysi qayerga tegishli?
  ├── hooks/        ← hamma hook bir joyda
  ├── utils/        ← dump papka
  └── pages/

Muammolar:
  ❌ Komponent qaysi feature-ga tegishli — noma'lum
  ❌ Import tartibsiz — hamma hamma joydan import qiladi
  ❌ Refactoring qiyin — nima nimaga bog'liq — noma'lum
  ❌ Yangi developer tushunishi qiyin

═══════════════════════════════════════
  FSD DARAJALARI (LAYERS)
═══════════════════════════════════════

Pastdan yuqoriga (qat'iy ierarxiya):

  1. shared    — qayta ishlatiladigan kod (UI kit, utils, API client)
  2. entities  — biznes entitylar (User, Product, Order)
  3. features  — foydalanuvchi harakatlari (AddToCart, Login, Search)
  4. widgets   — mustaqil UI bloklar (Header, Sidebar, ProductList)
  5. pages     — sahifalar (HomePage, ProductPage)
  6. app       — ilova sozlamalari (router, providers, global styles)

QOIDA: Yuqori daraja pastdan IMPORT qilishi mumkin.
Past daraja yuqoridan import qilishi MUMKIN EMAS.

  pages → widgets → features → entities → shared  ✅
  shared → entities  ❌ TAQIQLANGAN!
  features → widgets ❌ TAQIQLANGAN!

═══════════════════════════════════════
  SEGMENT TUZILMASI
═══════════════════════════════════════

Har bir slice (feature/entity) ichida:

  features/add-to-cart/
  ├── ui/          — React komponentlar
  ├── model/       — business logika (store, hooks)
  ├── api/         — server so'rovlar
  ├── lib/         — utility funksiyalar
  ├── config/      — konfiguratsiya
  └── index.ts     — PUBLIC API (faqat shu orqali export)

index.ts — PUBLIC API:
  export { AddToCartButton } from './ui/AddToCartButton'
  export { useCart } from './model/useCart'

Boshqa slice-lar FAQAT index.ts orqali import qiladi.
Ichki fayllarni TO'G'RIDAN-TO'G'RI import TAQIQLANGAN.

═══════════════════════════════════════
  FSD AMALDA
═══════════════════════════════════════

  src/
  ├── app/                    # 6-daraja: ilova
  │   ├── providers/
  │   ├── router.tsx
  │   └── styles/
  ├── pages/                  # 5-daraja: sahifalar
  │   ├── home/
  │   └── product/
  ├── widgets/                # 4-daraja: mustaqil bloklar
  │   ├── header/
  │   └── product-list/
  ├── features/               # 3-daraja: foydalanuvchi harakatlari
  │   ├── auth/
  │   ├── add-to-cart/
  │   └── search/
  ├── entities/               # 2-daraja: biznes entitylar
  │   ├── user/
  │   ├── product/
  │   └── order/
  └── shared/                 # 1-daraja: umumiy kod
      ├── ui/
      ├── api/
      ├── lib/
      └── config/

═══════════════════════════════════════
  FSD AFZALLIKLARI VA KAMCHILIKLARI
═══════════════════════════════════════

Afzalliklari:
  ✅ Aniq tuzilma — yangi developer tez tushunadi
  ✅ Import qoidalari — dependency tartibli
  ✅ Modularlik — feature alohida ishlab chiqish mumkin
  ✅ Katta loyihalar uchun juda yaxshi

Kamchiliklari:
  ❌ Kichik loyihalar uchun ortiqcha (overhead)
  ❌ O'rganish egri chizig'i bor
  ❌ Qaysi daraja — ba'zan noaniq (feature vs widget?)
  ❌ Hali standart emas — har jamoa o'ziga moslaydi`,
    codeExamples: [
      {
        title: 'FSD tuzilmasi — e-commerce',
        language: 'ts',
        code: `// ===== shared/ — umumiy kod =====
// shared/ui/Button.tsx
export function Button({ children, ...props }: ButtonProps) {
  return <button {...props}>{children}</button>
}

// shared/api/client.ts
export const apiClient = {
  get: (url: string) => fetch(url).then(r => r.json()),
  post: (url: string, body: unknown) => fetch(url, {
    method: 'POST',
    body: JSON.stringify(body),
  }).then(r => r.json()),
}

// ===== entities/ — biznes entitylar =====
// entities/product/model/types.ts
export interface Product {
  id: string
  name: string
  price: number
  image: string
}

// entities/product/ui/ProductCard.tsx
export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="border rounded p-4">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>{product.price} so'm</p>
    </div>
  )
}

// entities/product/index.ts — PUBLIC API
export { ProductCard } from './ui/ProductCard'
export type { Product } from './model/types'

// ===== features/ — foydalanuvchi harakatlari =====
// features/add-to-cart/ui/AddToCartButton.tsx
import { Button } from '@/shared/ui'        // ✅ shared dan
import type { Product } from '@/entities/product' // ✅ entities dan

export function AddToCartButton({ product }: { product: Product }) {
  const addItem = useCartStore(s => s.addItem)
  return <Button onClick={() => addItem(product)}>Savatga</Button>
}

// features/add-to-cart/index.ts
export { AddToCartButton } from './ui/AddToCartButton'

// ===== widgets/ — mustaqil bloklar =====
// widgets/product-list/ui/ProductList.tsx
import { ProductCard } from '@/entities/product'     // ✅ entities
import { AddToCartButton } from '@/features/add-to-cart' // ✅ features

export function ProductList({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {products.map(p => (
        <div key={p.id}>
          <ProductCard product={p} />
          <AddToCartButton product={p} />
        </div>
      ))}
    </div>
  )
}

// ===== pages/ — sahifalar =====
// pages/home/ui/HomePage.tsx
import { ProductList } from '@/widgets/product-list' // ✅ widgets
import { useProducts } from '@/entities/product'     // ✅ entities

export function HomePage() {
  const { data: products } = useProducts()
  return <ProductList products={products ?? []} />
}`,
        description: 'FSD amalda: shared (UI kit) → entities (Product) → features (AddToCart) → widgets (ProductList) → pages (HomePage). Har daraja faqat PASTDAGIDAN import qiladi.',
      },
      {
        title: 'FSD — Public API (index.ts)',
        language: 'ts',
        code: `// ❌ NOTO'G'RI — ichki fayldan to'g'ridan-to'g'ri import
import { ProductCard } from '@/entities/product/ui/ProductCard'
import { useProducts } from '@/entities/product/model/useProducts'
import type { Product } from '@/entities/product/model/types'

// ✅ TO'G'RI — faqat index.ts orqali
import { ProductCard, useProducts, type Product } from '@/entities/product'

// entities/product/index.ts — PUBLIC API
export { ProductCard } from './ui/ProductCard'
export { useProducts } from './model/useProducts'
export type { Product } from './model/types'

// ICHKI fayllarni O'ZGARTIRISH — tashqarini ta'sir QILMAYDI
// ProductCard.tsx → ProductCardNew.tsx — faqat index.ts yangilanadi
// Boshqa slice-lar hech narsa o'zgartirmaydi

// ESLint qoida bilan tekshirish:
// eslint-plugin-import — boundaries qoidasi
// @feature-sliced/eslint-config — FSD uchun maxsus`,
        description: 'Public API pattern — har slice faqat index.ts orqali export qiladi. Ichki tuzilma o\'zgarsa — boshqa slice-lar ta\'sirlanmaydi. Encapsulation.',
      },
    ],
    interviewQA: [
      {
        question: 'Feature-Sliced Design nima?',
        answer: `FSD — frontend arxitektura metodologiyasi. Kodni 6 ta DARAJA (layer) bo'yicha tartibga soladi: shared → entities → features → widgets → pages → app. Asosiy qoida: yuqori daraja pastdan import qilishi mumkin, teskari — MUMKIN EMAS. Har slice ichida segmentlar: ui/, model/, api/, lib/. Public API — faqat index.ts orqali eksport. Afzalliklari: aniq tuzilma, import tartibli, modular, katta loyihalar uchun yaxshi.`,
      },
      {
        question: 'FSD da layer qoidalari qanday ishlaydi?',
        answer: `Qat'iy ierarxiya: pages → widgets → features → entities → shared. Yuqori daraja pastdagidan import qilishi MUMKIN. Past daraja yuqoridagidan import qilishi TAQIQLANGAN. Bir xil daraja ichida cross-import TAQIQLANGAN (feature A → feature B emas). Agar 2 ta feature bir-biriga kerak bo'lsa — umumiy logikani entities yoki shared-ga ko'chirish kerak. Bu dependency graphni tartibli saqlaydi — circular dependency bo'lmaydi.`,
      },
      {
        question: 'FSD da entities va features farqi nima?',
        answer: `Entities — biznes ob'ektlar (User, Product, Order). Nima ekanini ko'rsatadi — karta, ro'yxat, tip. Harakat yo'q. Features — foydalanuvchi HARAKATLARI (AddToCart, Login, Search). Nima qilishni ko'rsatadi — tugma, forma, action. Misol: ProductCard (entity) — mahsulotni ko'rsatadi. AddToCartButton (feature) — savatga qo'shish harakati. Widget ikkalasini birlashtiradi: ProductCard + AddToCartButton = ProductWidget.`,
      },
      {
        question: 'FSD kichik loyihalarga kerakmi?',
        answer: `Kichik loyihalar (5-10 sahifa, 1-2 developer) uchun FSD ORTIQCHA — overhead katta, foyda kam. Oddiy tuzilma yetarli: src/components, src/pages, src/hooks, src/utils. FSD kerak: 10+ sahifa, 3+ developer, uzoq muddatli loyiha. O'rta variant: FSD-ning ba'zi elementlarini olish — feature papkalar, public API (index.ts), lekin to'liq 6 darajani majburlamaslik. Loyiha o'sganda asta-sekin FSD-ga o'tish mumkin.`,
      },
    ],
    relatedTopics: [
      { sectionId: 'architecture', topicId: 'atomic-design', label: 'Atomic Design (alternativa)' },
      { sectionId: 'architecture', topicId: 'solid-react', label: 'SOLID printsiplari' },
    ],
  },
  {
    id: 'solid-react',
    title: 'SOLID in React',
    importance: 2,
    status: 'to-learn',
    description: 'Single Responsibility, DI in components, Open/Closed',
    content: `SOLID — 5 ta OOP printsip. React-da ham qo'llaniladi — komponentlar, hook-lar, va arxitektura darajasida.

═══════════════════════════════════════
  S — SINGLE RESPONSIBILITY (SRP)
═══════════════════════════════════════

Har komponent/hook BITTA ish qilishi kerak.

  // ❌ Yomon — hamma narsa bitta komponentda
  function UserPage() {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    // + fetch logikasi
    // + form validatsiya
    // + rendering
    // 300+ qator...
  }

  // ✅ Yaxshi — ajratilgan
  function UserPage() {
    const { user, isLoading } = useUser(userId)  // data hook
    if (isLoading) return <Skeleton />
    return <UserProfile user={user} />            // display
  }

SRP React-da:
  - Komponent → faqat RENDER
  - Custom hook → faqat LOGIKA
  - Utility → faqat HISOBLASH

═══════════════════════════════════════
  O — OPEN/CLOSED PRINCIPLE (OCP)
═══════════════════════════════════════

Kengaytirish uchun OCHIQ, o'zgartirish uchun YOPIQ.

  // ❌ Yomon — har variant uchun if/else
  function Icon({ name }: { name: string }) {
    if (name === 'home') return <HomeIcon />
    if (name === 'user') return <UserIcon />
    // Yangi icon qo'shish uchun BU FAYLNI o'zgartirish kerak
  }

  // ✅ Yaxshi — composition
  function Button({ icon, children }: { icon?: ReactNode; children: ReactNode }) {
    return <button>{icon}{children}</button>
  }
  // Yangi icon uchun Button-ni O'ZGARTIRISH kerak emas
  <Button icon={<NewIcon />}>Click</Button>

OCP React-da:
  - children prop (har qanday content)
  - render prop (custom rendering)
  - Composition (komponentlarni tashqaridan birlashtirish)

═══════════════════════════════════════
  L — LISKOV SUBSTITUTION (LSP)
═══════════════════════════════════════

Bola komponent ota o'rnida ishlatilishi kerak.

  // Agar Button bor va IconButton extends Button
  // IconButton DOIM Button o'rnida ishlashi kerak
  <Button />       // ✅ ishlaydi
  <IconButton />   // ✅ Button o'rnida ishlashi KERAK

React-da: ComponentPropsWithoutRef bilan HTML props-larni kengaytirish.

═══════════════════════════════════════
  I — INTERFACE SEGREGATION (ISP)
═══════════════════════════════════════

Katta interface o'rniga kichik, aniq interface-lar.

  // ❌ Yomon — katta interface
  interface UserCardProps {
    user: User
    onEdit: () => void      // card-da kerak emas
    onDelete: () => void    // card-da kerak emas
    permissions: Permission[] // card-da kerak emas
  }

  // ✅ Yaxshi — faqat kerakli props
  interface UserCardProps {
    name: string
    avatar: string
    role: string
  }

ISP React-da:
  - Pick/Omit bilan faqat kerakli props
  - Kichik, focused komponentlar
  - Har prop haqiqatan KERAK bo'lishi kerak

═══════════════════════════════════════
  D — DEPENDENCY INVERSION (DIP)
═══════════════════════════════════════

Yuqori daraja past darajaga BOG'LIQ bo'lmasligi kerak.

  // ❌ Yomon — komponent to'g'ridan-to'g'ri API chaqiradi
  function UserList() {
    const users = await fetch('/api/users')  // aniq implementatsiyaga bog'liq
  }

  // ✅ Yaxshi — abstraktsiya orqali
  function UserList({ useUsers }: { useUsers: () => User[] }) {
    const users = useUsers()  // qanday olish — tashqarida hal qilinadi
  }

DIP React-da:
  - Custom hook-lar (API abstraktsiyasi)
  - Context (dependency injection)
  - Props orqali callback berish`,
    codeExamples: [
      {
        title: 'SRP — komponent va hook ajratish',
        language: 'tsx',
        code: `// ❌ YOMON — hamma narsa bitta komponentda (500+ qator)
function BadUserPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    fetch('/api/users/1').then(r => r.json()).then(setUser).finally(() => setLoading(false))
  }, [])

  function validate() { /* ... 50 qator ... */ }
  function handleSubmit() { /* ... 30 qator ... */ }

  // + 200 qator JSX...
  return <div>...</div>
}

// ✅ YAXSHI — har bir narsa o'z joyida

// 1. Data hook — faqat data olish
function useUser(userId: string) {
  return useQuery({
    queryKey: ['users', userId],
    queryFn: () => fetchUser(userId),
  })
}

// 2. Form hook — faqat form logikasi
function useUserForm(initialData: User) {
  const [formData, setFormData] = useState({
    name: initialData.name,
    email: initialData.email,
  })

  const errors = useMemo(() => validateUserForm(formData), [formData])
  const isValid = Object.keys(errors).length === 0

  return { formData, setFormData, errors, isValid }
}

// 3. Page — faqat composition
function UserPage({ userId }: { userId: string }) {
  const { data: user, isLoading } = useUser(userId)

  if (isLoading) return <PageSkeleton />
  if (!user) return <NotFound />

  return (
    <div>
      <UserHeader user={user} />
      <UserEditForm user={user} />
    </div>
  )
}

// 4. Form komponent — faqat render
function UserEditForm({ user }: { user: User }) {
  const { formData, setFormData, errors, isValid } = useUserForm(user)
  const updateUser = useUpdateUser()

  return (
    <form onSubmit={() => updateUser.mutate(formData)}>
      <InputField label="Ism" value={formData.name}
        onChange={name => setFormData(prev => ({ ...prev, name }))}
        error={errors.name} />
      <InputField label="Email" value={formData.email}
        onChange={email => setFormData(prev => ({ ...prev, email }))}
        error={errors.email} />
      <button disabled={!isValid}>Saqlash</button>
    </form>
  )
}`,
        description: 'SRP: Page (composition), Hook (data), Hook (form logika), Component (render). Har biri BITTA ish qiladi. 500 qatorli komponent → 4 ta kichik fayl.',
      },
      {
        title: 'OCP va DIP — composition va DI',
        language: 'tsx',
        code: `import type { ReactNode } from 'react'

// ===== OCP — kengaytirish uchun OCHIQ =====

// ❌ Yomon — har variant uchun if/else (o'zgartirish kerak)
function BadNotification({ type }: { type: 'success' | 'error' | 'warning' }) {
  if (type === 'success') return <div className="bg-green-100">✅ Muvaffaqiyat</div>
  if (type === 'error') return <div className="bg-red-100">❌ Xato</div>
  if (type === 'warning') return <div className="bg-yellow-100">⚠️ Ogohlantirish</div>
  return null
  // Yangi variant uchun BU FAYLNI O'ZGARTIRISH kerak
}

// ✅ Yaxshi — composition (kengaytirish uchun ochiq)
interface NotificationProps {
  icon?: ReactNode
  children: ReactNode
  className?: string
}

function Notification({ icon, children, className }: NotificationProps) {
  return (
    <div className={\`flex items-center gap-2 p-3 rounded \${className ?? ''}\`}>
      {icon}
      {children}
    </div>
  )
}

// Yangi variant — Notification-ni O'ZGARTIRMASDAN
<Notification icon="✅" className="bg-green-100">Muvaffaqiyat!</Notification>
<Notification icon="❌" className="bg-red-100">Xato!</Notification>
<Notification icon="🔔" className="bg-blue-100">Yangi xabar!</Notification>

// ===== DIP — dependency injection =====

// ❌ Yomon — aniq implementatsiyaga bog'liq
function BadProductList() {
  const products = useFetchProducts()  // faqat fetch bilan ishlaydi
  return <ul>{products.map(p => <li key={p.id}>{p.name}</li>)}</ul>
}

// ✅ Yaxshi — abstraktsiya orqali (props)
interface ProductListProps {
  products: Product[]
  renderItem?: (product: Product) => ReactNode
}

function ProductList({
  products,
  renderItem = (p) => <span>{p.name}</span>,
}: ProductListProps) {
  return <ul>{products.map(p => <li key={p.id}>{renderItem(p)}</li>)}</ul>
}

// Turli kontekstlarda ishlatish
<ProductList products={allProducts} />
<ProductList products={featured} renderItem={p => <FeaturedCard product={p} />} />
// Test-da: <ProductList products={mockProducts} />`,
        description: 'OCP: Notification — children/icon orqali kengaytiriladi, o\'zgartirish kerak emas. DIP: ProductList — products prop orqali, data qayerdan kelishi muhim emas (fetch, mock, static).',
      },
    ],
    interviewQA: [
      {
        question: 'SOLID nima va React-da qanday qo\'llaniladi?',
        answer: `SOLID — 5 ta printsip: S — Single Responsibility: har komponent/hook bitta ish. O — Open/Closed: composition bilan kengaytirish, o'zgartirmasdan. L — Liskov Substitution: bola komponent ota o'rnida ishlaydi. I — Interface Segregation: kichik, focused props (Pick/Omit). D — Dependency Inversion: custom hook-lar va Context bilan abstraktsiya. React-da eng muhimi SRP (komponent=render, hook=logika) va OCP (composition, children, render prop).`,
      },
      {
        question: 'Single Responsibility React-da qanday ishlaydi?',
        answer: `Har komponent/hook BITTA ish qilishi kerak. Katta komponentni ajratish: 1) Custom hook — data fetching, form logika, state management. 2) Komponent — faqat rendering. 3) Utility — faqat hisoblash (validate, format). Misol: 500 qatorli UserPage → useUser (data), useUserForm (form), UserPage (composition), UserEditForm (render). Har biri alohida test qilinadi, alohida o'zgartiriladi.`,
      },
      {
        question: 'Open/Closed React-da qanday ishlaydi?',
        answer: `Komponent kengaytirish uchun OCHIQ, o'zgartirish uchun YOPIQ. React-da composition bilan: children prop (har qanday content), render prop (custom rendering), icon/header slot-lar. Misol: <Card>{any content}</Card> — Card o'zgartirmasdan har xil content berish mumkin. If/else bilan variant tekshirish — OCP buzadi, chunki yangi variant uchun komponentni O'ZGARTIRISH kerak.`,
      },
    ],
    relatedTopics: [
      { sectionId: 'component-patterns', topicId: 'composition-vs-inheritance', label: 'Composition' },
      { sectionId: 'component-patterns', topicId: 'custom-hooks', label: 'Custom Hooks (SRP)' },
      { sectionId: 'architecture', topicId: 'fsd', label: 'FSD (arxitektura)' },
    ],
  },
  {
    id: 'atomic-design',
    title: 'Atomic Design',
    importance: 2,
    status: 'to-learn',
    description: 'atoms → molecules → organisms → templates → pages',
    content: `Atomic Design — Brad Frost tomonidan yaratilgan komponent tuzilmasi metodologiyasi. Kimyodagi atom → molekula → organizm analogi asosida.

═══════════════════════════════════════
  5 TA DARAJA
═══════════════════════════════════════

1. ATOMS — eng kichik, bo'linmas komponentlar
   Button, Input, Label, Icon, Avatar, Badge
   HTML elementlar ustiga qurilgan, mustaqil ma'noga ega

2. MOLECULES — atom-lardan tuzilgan kichik guruhlar
   SearchInput (Input + Button + Icon)
   FormField (Label + Input + ErrorMessage)
   MenuItem (Icon + Text + Badge)

3. ORGANISMS — molecules-dan tuzilgan mustaqil UI bloklar
   Header (Logo + Navigation + SearchInput + UserMenu)
   ProductCard (Image + Title + Price + AddToCartButton)
   LoginForm (FormField + FormField + Button)

4. TEMPLATES — sahifa layout-i (kontent yo'q)
   DashboardTemplate (Header slot + Sidebar slot + Content slot)
   AuthTemplate (Logo + Form slot)

5. PAGES — template + haqiqiy kontent
   DashboardPage = DashboardTemplate + real data
   LoginPage = AuthTemplate + LoginForm

═══════════════════════════════════════
  AMALDA TUZILMA
═══════════════════════════════════════

  src/components/
  ├── atoms/
  │   ├── Button/
  │   ├── Input/
  │   ├── Badge/
  │   └── Avatar/
  ├── molecules/
  │   ├── SearchInput/
  │   ├── FormField/
  │   └── UserMenu/
  ├── organisms/
  │   ├── Header/
  │   ├── Sidebar/
  │   └── ProductCard/
  └── templates/
      ├── DashboardTemplate/
      └── AuthTemplate/

═══════════════════════════════════════
  FSD vs ATOMIC DESIGN
═══════════════════════════════════════

Atomic Design:
  ✅ UI komponentlar uchun yaxshi tuzilma
  ❌ Business logika uchun yetarli emas
  ❌ Feature-lar qayerda — noaniq

FSD:
  ✅ Business logika uchun yaxshi
  ✅ Feature-lar aniq ajratilgan
  ❌ UI komponent darajalari yo'q

Birlashtirib ishlatish:
  shared/ui/ ichida Atomic Design (atoms, molecules)
  entities, features, widgets — FSD qoidalari
  Bu ENG YAXSHI kombinatsiya.

═══════════════════════════════════════
  QACHON ISHLATISH
═══════════════════════════════════════

Atomic Design TO'G'RI:
  ✅ Design system / UI kit yaratish
  ✅ Storybook bilan birga
  ✅ Katta jamoa (designer + developer)

Atomic Design ortiqcha:
  ❌ Kichik loyiha (3-5 sahifa)
  ❌ Business logika tuzilmasi uchun (FSD yaxshiroq)`,
    codeExamples: [
      {
        title: 'Atomic Design — atom dan page gacha',
        language: 'tsx',
        code: `// ===== ATOMS — eng kichik komponentlar =====
function Button({ children, variant = 'primary', ...props }: ButtonProps) {
  return <button className={\`btn btn-\${variant}\`} {...props}>{children}</button>
}

function Input({ label, error, ...props }: InputProps) {
  return (
    <div>
      {label && <label>{label}</label>}
      <input {...props} className={error ? 'border-red-500' : ''} />
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  )
}

function Avatar({ src, name, size = 'md' }: AvatarProps) {
  return <img src={src} alt={name} className={\`avatar avatar-\${size}\`} />
}

// ===== MOLECULES — atom-lar guruhi =====
function SearchInput({ onSearch }: { onSearch: (q: string) => void }) {
  const [query, setQuery] = useState('')
  return (
    <div className="flex gap-2">
      <Input value={query} onChange={e => setQuery(e.target.value)}
        placeholder="Qidirish..." />
      <Button onClick={() => onSearch(query)}>🔍</Button>
    </div>
  )
}

function UserMenu({ user }: { user: User }) {
  return (
    <div className="flex items-center gap-2">
      <Avatar src={user.avatar} name={user.name} size="sm" />
      <span>{user.name}</span>
    </div>
  )
}

// ===== ORGANISMS — mustaqil UI blok =====
function Header({ user, onSearch }: { user: User; onSearch: (q: string) => void }) {
  return (
    <header className="flex items-center justify-between p-4 border-b">
      <h1>Logo</h1>
      <SearchInput onSearch={onSearch} />
      <UserMenu user={user} />
    </header>
  )
}

// ===== TEMPLATES — layout =====
function DashboardTemplate({ header, sidebar, children }: {
  header: ReactNode
  sidebar: ReactNode
  children: ReactNode
}) {
  return (
    <div className="min-h-screen">
      {header}
      <div className="flex">
        <aside className="w-64">{sidebar}</aside>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}

// ===== PAGES — template + data =====
function DashboardPage() {
  const { data: user } = useCurrentUser()
  return (
    <DashboardTemplate
      header={<Header user={user!} onSearch={handleSearch} />}
      sidebar={<Sidebar />}
    >
      <DashboardContent />
    </DashboardTemplate>
  )
}`,
        description: 'Atomic Design: Atom (Button, Input) → Molecule (SearchInput) → Organism (Header) → Template (DashboardTemplate) → Page (DashboardPage). Har daraja past darajadan quriladi.',
      },
    ],
    interviewQA: [
      {
        question: 'Atomic Design nima?',
        answer: `Brad Frost tomonidan yaratilgan komponent tuzilmasi: 5 ta daraja. 1) Atoms — eng kichik (Button, Input, Icon). 2) Molecules — atom guruhlar (SearchInput = Input + Button). 3) Organisms — mustaqil bloklar (Header = Logo + Search + UserMenu). 4) Templates — sahifa layout (slot-lar bilan). 5) Pages — template + haqiqiy data. Har daraja pastdagidan quriladi. Design system va UI kit uchun juda yaxshi.`,
      },
      {
        question: 'Atomic Design va FSD farqi nima?',
        answer: `Atomic Design — UI KOMPONENTLAR tuzilmasi: atom → molecule → organism. UI uchun yaxshi, lekin business logika qayerda — noaniq. FSD — BUTUN ILOVA arxitekturasi: shared → entities → features → widgets → pages. Business logika aniq ajratilgan, lekin UI komponent darajalari yo'q. ENG YAXSHI: ikkalasini birlashtirish — shared/ui ichida Atomic Design, qolgan daraja FSD qoidalari.`,
      },
      {
        question: 'Atom va molecule farqi qanday aniqlanadi?',
        answer: `Atom — mustaqil ma'no beradi, BOSHQA komponentdan tuzilmagan: Button, Input, Label, Icon, Avatar. Molecule — 2+ atom birlashmasi, BITTA ish qiladi: SearchInput (Input + Button), FormField (Label + Input + Error). Organism — 2+ molecule, MUSTAQIL UI blok: Header (Logo + SearchInput + UserMenu). Amalda chegarani aniqlash qiyin — jamoa ichida convention belgilash muhim.`,
      },
    ],
    relatedTopics: [
      { sectionId: 'architecture', topicId: 'fsd', label: 'FSD (alternativa)' },
      { sectionId: 'component-patterns', topicId: 'composition-vs-inheritance', label: 'Composition' },
    ],
  },
  {
    id: 'monorepo',
    title: 'Monorepo',
    importance: 1,
    status: 'to-learn',
    description: 'Turborepo, Nx — katta loyiha tuzilmasi',
    content: `Monorepo — bir nechta loyiha/paket BITTA git repository-da. Katta jamoalar va tashkilotlar uchun. Google, Meta, Microsoft ishlatadi.

═══════════════════════════════════════
  MONOREPO vs POLYREPO
═══════════════════════════════════════

Polyrepo (an'anaviy):
  repo-1: frontend
  repo-2: admin-panel
  repo-3: shared-ui-library
  repo-4: backend

Muammolari:
  ❌ Shared kod — npm paket qilib publish, versiya boshqarish
  ❌ Dependency sync — frontend va admin farqli React versiya
  ❌ Cross-repo o'zgarish — 4 ta PR, 4 ta review

Monorepo:
  one-repo/
  ├── apps/
  │   ├── frontend/
  │   ├── admin/
  │   └── backend/
  └── packages/
      ├── ui/            # shared UI komponentlar
      ├── utils/         # umumiy utility
      └── config/        # shared config

Afzalliklari:
  ✅ Shared kod — to'g'ridan-to'g'ri import, npm kerak emas
  ✅ Atomic commits — bir PR da barcha o'zgarishlar
  ✅ Dependency sync — bir joyda boshqarish
  ✅ Code reuse oson

═══════════════════════════════════════
  VOSITALAR
═══════════════════════════════════════

Turborepo (Vercel):
  ✅ Tez — remote caching, parallel tasks
  ✅ Sodda setup
  ✅ Vite/Next.js bilan yaxshi
  ❌ Kamroq feature

Nx (Nrwl):
  ✅ Ko'p feature — affected commands, generators
  ✅ Plugin tizimi (React, Next, Node)
  ✅ Vizual dependency graph
  ❌ Murakkabrok

pnpm workspaces:
  ✅ Eng sodda — faqat workspace protocol
  ✅ Tez dependency install (hard link)
  ❌ Build orchestration yo'q (Turbo/Nx qo'shish kerak)

═══════════════════════════════════════
  QACHON KERAK
═══════════════════════════════════════

Monorepo KERAK:
  ✅ 2+ ilova bir xil shared kod ishlatsa
  ✅ Design system / UI kit bo'lsa
  ✅ Full-stack (frontend + backend) bitta jamoada
  ✅ Micro-frontend arxitektura

Monorepo KERAK EMAS:
  ❌ Bitta ilova
  ❌ Kichik jamoa (1-2 developer)
  ❌ Aloqasi bo'lmagan loyihalar`,
    codeExamples: [
      {
        title: 'Turborepo tuzilmasi',
        language: 'ts',
        code: `// Papka tuzilmasi
// my-monorepo/
// ├── apps/
// │   ├── web/           # React frontend (Vite)
// │   │   ├── package.json
// │   │   └── src/
// │   └── admin/          # Admin panel (Vite)
// │       ├── package.json
// │       └── src/
// ├── packages/
// │   ├── ui/             # Shared UI komponentlar
// │   │   ├── package.json
// │   │   └── src/
// │   ├── utils/          # Shared utility
// │   │   ├── package.json
// │   │   └── src/
// │   └── tsconfig/       # Shared TS config
// │       └── base.json
// ├── turbo.json           # Turborepo config
// ├── package.json         # Root
// └── pnpm-workspace.yaml  # Workspace config

// pnpm-workspace.yaml
// packages:
//   - "apps/*"
//   - "packages/*"

// turbo.json
// {
//   "tasks": {
//     "build": {
//       "dependsOn": ["^build"],   // dependency-lar avval build
//       "outputs": ["dist/**"]
//     },
//     "dev": { "persistent": true },
//     "lint": {},
//     "test": {}
//   }
// }

// apps/web/package.json
// {
//   "dependencies": {
//     "@my-org/ui": "workspace:*",     // local paket
//     "@my-org/utils": "workspace:*"
//   }
// }

// Ishlatish — oddiy import
// apps/web/src/App.tsx
import { Button, Card } from '@my-org/ui'
import { formatDate } from '@my-org/utils'

// Buyruqlar
// turbo build        # barcha paketlar parallel build
// turbo dev          # barcha dev serverlar
// turbo lint         # barcha linter-lar
// turbo test         # barcha testlar`,
        description: 'Turborepo: apps/ (ilovalar) + packages/ (shared kod). workspace:* — local paket. turbo build — parallel build, caching. Shared paketlar oddiy import bilan.',
      },
    ],
    interviewQA: [
      {
        question: 'Monorepo nima va nima uchun kerak?',
        answer: `Monorepo — bir nechta loyiha/paket BITTA git repository-da. Afzalliklari: shared kod to'g'ridan-to'g'ri import (npm publish kerak emas), atomic commits (bir PR da barcha o'zgarish), dependency sync (barcha ilovalar bir xil versiya). Kamchiliklari: repo katta, CI/CD murakkab, tooling kerak (Turborepo/Nx). Qachon kerak: 2+ ilova shared kod bilan, design system, full-stack jamoa. Kerak emas: bitta ilova, kichik jamoa.`,
      },
      {
        question: 'Turborepo va Nx farqi nima?',
        answer: `Turborepo (Vercel): sodda setup, remote caching (bir developer build qilsa boshqasi cache dan oladi), parallel task execution. Minimal configuration. Nx (Nrwl): ko'proq feature — affected commands (faqat o'zgargan paketlarni build/test), code generators, plugin tizimi, dependency graph vizualizatsiya. Tanlash: kichik-o'rta monorepo → Turborepo (sodda). Katta enterprise → Nx (ko'p feature). Ikkalasi ham pnpm workspaces ustiga quriladi.`,
      },
    ],
    relatedTopics: [
      { sectionId: 'architecture', topicId: 'ci-cd', label: 'CI/CD' },
    ],
  },
  {
    id: 'ci-cd',
    title: 'CI/CD',
    importance: 2,
    status: 'to-learn',
    description: 'GitHub Actions, deploy pipeline, lint + test + build',
    content: `CI/CD — Continuous Integration / Continuous Deployment. Kod push qilinganda avtomatik test, build, va deploy qilish.

═══════════════════════════════════════
  CI — CONTINUOUS INTEGRATION
═══════════════════════════════════════

Har push/PR da avtomatik:
  1. Lint — kod sifati tekshirish (ESLint)
  2. Type check — TypeScript tekshirish
  3. Test — unit va integration testlar
  4. Build — production build muvaffaqiyatli bo'lishini tekshirish

Maqsad: muammoni ERTA topish (commit qilinganidan keyin darhol).

═══════════════════════════════════════
  CD — CONTINUOUS DEPLOYMENT
═══════════════════════════════════════

CI muvaffaqiyatli bo'lgandan keyin avtomatik:
  - Staging environment-ga deploy
  - Preview URL yaratish (PR uchun)
  - Production-ga deploy (main branch)

═══════════════════════════════════════
  GITHUB ACTIONS
═══════════════════════════════════════

.github/workflows/ci.yml fayli bilan:

  Trigger: push yoki PR → main
  Steps:
    1. checkout — kodni olish
    2. setup-node — Node.js o'rnatish
    3. install — dependency-lar o'rnatish
    4. lint — ESLint
    5. typecheck — tsc --noEmit
    6. test — vitest
    7. build — vite build

═══════════════════════════════════════
  DEPLOY PLATFORMALAR
═══════════════════════════════════════

Vercel:
  ✅ Git push → avtomatik deploy
  ✅ PR preview URL
  ✅ Edge Functions
  ✅ Next.js uchun ideal

Netlify:
  ✅ Static site uchun yaxshi
  ✅ Form handling
  ✅ Git push → deploy

AWS (S3 + CloudFront):
  ✅ To'liq kontrol
  ❌ Sozlash murakkab

Docker + VPS:
  ✅ Har qanday stack
  ❌ O'zingiz boshqarasiz

═══════════════════════════════════════
  BEST PRACTICES
═══════════════════════════════════════

1. Main branch himoyalangan — to'g'ridan-to'g'ri push yo'q
2. PR required — har o'zgarish PR orqali
3. CI majburiy — test o'tmasa merge mumkin emas
4. Preview deploy — PR uchun alohida URL
5. Environment variables — secrets GitHub-da
6. Cache — node_modules va build cache tezlashtirish uchun`,
    codeExamples: [
      {
        title: 'GitHub Actions — CI pipeline',
        language: 'ts',
        code: `// .github/workflows/ci.yml
// name: CI
//
// on:
//   push:
//     branches: [main]
//   pull_request:
//     branches: [main]
//
// jobs:
//   ci:
//     runs-on: ubuntu-latest
//
//     steps:
//       - name: Checkout
//         uses: actions/checkout@v4
//
//       - name: Setup Node.js
//         uses: actions/setup-node@v4
//         with:
//           node-version: 20
//           cache: 'yarn'
//
//       - name: Install dependencies
//         run: yarn install --frozen-lockfile
//
//       - name: Lint
//         run: yarn lint
//
//       - name: Type check
//         run: npx tsc --noEmit
//
//       - name: Test
//         run: yarn test --run
//
//       - name: Build
//         run: yarn build
//
//       - name: Upload build artifact
//         if: github.ref == 'refs/heads/main'
//         uses: actions/upload-artifact@v4
//         with:
//           name: dist
//           path: dist/

// Pipeline:
// Push/PR → Install → Lint → Type Check → Test → Build
// Agar biror qadam XATO bersa — pipeline TO'XTAYDI
// PR merge qilish mumkin EMAS (branch protection)

// Parallellashtirish mumkin:
// jobs:
//   lint:
//     runs-on: ubuntu-latest
//     steps: [checkout, install, lint]
//   test:
//     runs-on: ubuntu-latest
//     steps: [checkout, install, test]
//   build:
//     runs-on: ubuntu-latest
//     needs: [lint, test]  # lint va test o'tgandan keyin
//     steps: [checkout, install, build]`,
        description: 'GitHub Actions CI: push/PR da avtomatik lint → typecheck → test → build. frozen-lockfile — aniq dependency versiyalar. Cache — tezlashtirish. Branch protection — CI o\'tmasa merge yo\'q.',
      },
      {
        title: 'Vercel deploy + preview',
        language: 'ts',
        code: `// Vercel bilan deploy — GIT PUSH YETARLI:

// 1. vercel.com da GitHub repo ulash
// 2. Framework: Vite (avtomatik aniqlaydi)
// 3. Build command: yarn build
// 4. Output directory: dist
// 5. Push → avtomatik deploy!

// Natija:
// main branch push → production deploy (my-app.vercel.app)
// PR ochilsa → preview deploy (my-app-pr-123.vercel.app)

// vercel.json — ixtiyoriy konfiguratsiya
// {
//   "buildCommand": "yarn build",
//   "outputDirectory": "dist",
//   "framework": "vite",
//   "rewrites": [
//     { "source": "/(.*)", "destination": "/index.html" }
//   ]
// }

// SPA uchun MUHIM: rewrites
// Barcha URL-lar index.html-ga yo'naltiriladi
// Aks holda /about sahifada F5 bosilsa — 404

// Environment variables
// Vercel dashboard → Settings → Environment Variables
// VITE_API_URL=https://api.example.com
// VITE_GA_ID=G-XXXXXXXXXX
//
// Kod-da:
// const apiUrl = import.meta.env.VITE_API_URL`,
        description: 'Vercel — git push bilan avtomatik deploy. PR uchun preview URL. SPA rewrites — barcha URL-lar index.html-ga. Environment variables — dashboard orqali.',
      },
    ],
    interviewQA: [
      {
        question: 'CI/CD nima?',
        answer: `CI (Continuous Integration) — har push/PR da avtomatik: lint, type check, test, build. Muammoni erta topish uchun. CD (Continuous Deployment) — CI muvaffaqiyatli bo'lganda avtomatik deploy. Pipeline: push → install → lint → typecheck → test → build → deploy. GitHub Actions, GitLab CI, Jenkins bilan amalga oshiriladi. Best practice: main branch himoyalangan, PR required, CI majburiy (o'tmasa merge yo'q).`,
      },
      {
        question: 'Frontend CI pipeline-da nima bo\'lishi kerak?',
        answer: `Minimal: 1) Lint — ESLint (kod sifati), 2) Type check — tsc --noEmit (TypeScript xatolar), 3) Test — vitest/jest (unit/integration), 4) Build — production build muvaffaqiyatli. Qo'shimcha: E2E test (Playwright), bundle size check (kattalashtirmaslik), lighthouse (performance), preview deploy (PR uchun URL). Tezlashtirish: dependency cache, parallel jobs (lint || test, keyin build).`,
      },
      {
        question: 'SPA deploy qilganda qanday muammo bo\'ladi?',
        answer: `SPA muammo: foydalanuvchi /about sahifada F5 bosilsa — server /about fayl qidiradi va 404 beradi. Chunki barcha routing client-side (JavaScript-da). Yechim: barcha URL-larni index.html-ga yo'naltirish (rewrite/redirect). Vercel: vercel.json-da rewrites. Nginx: try_files $uri /index.html. Netlify: _redirects faylida /* /index.html 200. Apache: .htaccess bilan. Bu SPA deploy-ning eng ko'p uchraydigan muammosi.`,
      },
    ],
    relatedTopics: [
      { sectionId: 'testing', topicId: 'e2e', label: 'E2E (pipeline)' },
      { sectionId: 'architecture', topicId: 'monorepo', label: 'Monorepo' },
    ],
  },
  {
    id: 'accessibility',
    title: 'Accessibility (a11y)',
    importance: 2,
    status: 'to-learn',
    description: 'ARIA attributes, semantic HTML, keyboard navigation',
    content: `Accessibility (a11y) — ilovani BARCHA foydalanuvchilar uchun qulay qilish. Ko'rish, eshitish, harakatlanish qiyinchiliklari bo'lgan kishilar uchun ham ishlashi kerak.

═══════════════════════════════════════
  NIMA UCHUN MUHIM
═══════════════════════════════════════

1. Foydalanuvchilar — 15% odamlar nogironlikka ega (WHO)
2. Qonun — ADA (AQSH), EAA (Yevropa) — majburiy
3. SEO — semantic HTML Google uchun yaxshi
4. UX — yaxshi a11y = yaxshi UX BARCHA foydalanuvchilar uchun
5. Testing — RTL getByRole a11y-ga asoslangan

═══════════════════════════════════════
  SEMANTIC HTML (ENG MUHIM)
═══════════════════════════════════════

  ❌ <div onClick={fn}>Click me</div>
  ✅ <button onClick={fn}>Click me</button>

Semantic elementlar:
  <button>    — click qilinadigan narsa
  <a href>    — navigatsiya
  <input>     — ma'lumot kiritish
  <form>      — forma
  <nav>       — navigatsiya bloki
  <main>      — asosiy kontent
  <header>    — sarlavha
  <footer>    — pastki qism
  <article>   — mustaqil kontent
  <section>   — bo'lim
  <h1>-<h6>   — sarlavhalar (tartibda!)
  <ul>/<ol>   — ro'yxat
  <label>     — input tavsifi

Semantic HTML beradi:
  ✅ Screen reader to'g'ri o'qiydi
  ✅ Keyboard navigatsiya ishlaydi
  ✅ Brauzer default xulq-atvor (form submit, focus)

═══════════════════════════════════════
  ARIA ATTRIBUTES
═══════════════════════════════════════

ARIA — semantic HTML YETARLI BO'LMAGAN holatlar uchun.
Qoida: AVVAL semantic HTML, KEYIN ARIA.

Asosiy ARIA atributlar:
  role="dialog"         — modal oynasi
  role="alert"          — muhim xabar (screen reader darhol o'qiydi)
  role="tab" / "tabpanel" — tab interfeys

  aria-label="Close"     — element tavsifi (matn yo'q bo'lsa)
  aria-labelledby="id"   — boshqa element bilan bog'lash
  aria-describedby="id"  — qo'shimcha tavsif

  aria-hidden="true"     — screen reader dan yashirish
  aria-expanded="true"   — ochilgan/yopilgan (accordion)
  aria-selected="true"   — tanlangan (tab)
  aria-disabled="true"   — o'chirilgan
  aria-live="polite"     — dinamik kontent yangilanishi

═══════════════════════════════════════
  KEYBOARD NAVIGATSIYA
═══════════════════════════════════════

Barcha interaktiv elementlar KLAVIATURA bilan ishlatilishi kerak:

  Tab — keyingi elementga o'tish
  Shift+Tab — oldingi elementga
  Enter/Space — button bosish
  Escape — modal yopish
  Arrow keys — ro'yxat/tab-larda navigatsiya

React-da:
  - tabIndex={0} — fokus qilinishi mumkin
  - tabIndex={-1} — faqat programmatik fokus
  - onKeyDown — keyboard event handling
  - autoFocus — sahifa ochilganda fokus

═══════════════════════════════════════
  FOCUS MANAGEMENT
═══════════════════════════════════════

Modal ochilganda:
  1. Fokus modal ichiga o'tadi
  2. Tab faqat modal ichida yuradi (focus trap)
  3. Escape bilan yopiladi
  4. Yopilganda fokus ESKI joyga qaytadi

React-da:
  useRef — focus qilish
  useEffect — mount/unmount da focus boshqarish
  useId — ARIA id-lar yaratish`,
    codeExamples: [
      {
        title: 'Accessible komponentlar',
        language: 'tsx',
        code: `import { useId, useRef, useEffect, useState } from 'react'

// ✅ Accessible Input
function AccessibleInput({
  label,
  error,
  ...props
}: {
  label: string
  error?: string
} & React.ComponentPropsWithoutRef<'input'>) {
  const id = useId()
  const errorId = useId()

  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        {...props}
      />
      {error && (
        <p id={errorId} role="alert" className="text-red-500 text-sm">
          {error}
        </p>
      )}
    </div>
  )
}

// ✅ Accessible Modal
function Modal({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}) {
  const titleId = useId()
  const closeRef = useRef<HTMLButtonElement>(null)

  // Fokus modal ichiga
  useEffect(() => {
    if (isOpen) closeRef.current?.focus()
  }, [isOpen])

  // Escape bilan yopish
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 bg-black/50 flex items-center justify-center"
      onClick={onClose}
    >
      <div className="bg-white rounded-lg p-6" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between">
          <h2 id={titleId}>{title}</h2>
          <button ref={closeRef} onClick={onClose} aria-label="Yopish">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

// ✅ Accessible Toggle
function Toggle({ label, checked, onChange }: {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <div
        role="switch"
        aria-checked={checked}
        tabIndex={0}
        onClick={() => onChange(!checked)}
        onKeyDown={e => { if (e.key === ' ') { e.preventDefault(); onChange(!checked) } }}
        className={\`w-10 h-6 rounded-full \${checked ? 'bg-blue-500' : 'bg-gray-300'}\`}
      >
        <div className={\`w-4 h-4 rounded-full bg-white transition \${checked ? 'translate-x-5' : 'translate-x-1'}\`} />
      </div>
      {label}
    </label>
  )
}`,
        description: 'A11y: useId (aria-describedby), role="dialog" (modal), aria-modal, aria-label, role="switch", focus management, Escape handler. Semantic HTML + ARIA = accessible.',
      },
    ],
    interviewQA: [
      {
        question: 'Web accessibility nima va nima uchun muhim?',
        answer: `Accessibility (a11y) — ilovani BARCHA foydalanuvchilar uchun ishlatilishi mumkin qilish: ko'rish, eshitish, harakatlanish qiyinchiliklari bo'lgan kishilar uchun ham. Nima uchun muhim: 1) 15% odamlar nogironlikka ega, 2) Qonun — ADA, EAA, 3) SEO — semantic HTML Google uchun yaxshi, 4) UX — yaxshi a11y = yaxshi UX hammaga, 5) Testing — RTL getByRole a11y-ga asoslangan. Asosiy: semantic HTML, ARIA, keyboard navigatsiya, focus management.`,
      },
      {
        question: 'Semantic HTML va ARIA farqi nima?',
        answer: `Semantic HTML — to'g'ri element ishlatish: <button> (div+onClick emas), <nav>, <main>, <h1>-<h6>, <label>. Brauzer avtomatik role, focus, keyboard beradi. ARIA — semantic HTML YETARLI BO'LMAGANDA qo'shimcha ma'lumot: role="dialog", aria-label, aria-expanded, aria-live. Qoida: AVVAL semantic HTML ishlatish, KEYIN ARIA. <button> ishlatsa — role="button" KERAK EMAS (allaqachon bor). ARIA faqat custom komponentlar uchun (tab, accordion, modal).`,
      },
      {
        question: 'React-da keyboard navigatsiya qanday qilinadi?',
        answer: `1) Semantic HTML ishlatish — button, a, input AVTOMATIK fokus va keyboard ishlaydi. 2) tabIndex — 0 (fokus mumkin), -1 (faqat programmatik fokus). 3) onKeyDown — custom keyboard: Enter/Space click, Escape yopish, Arrow navigatsiya. 4) Focus management — modal ochilganda fokus ichiga, yopilganda eski joyga. useRef + focus(). 5) Focus trap — modal ichida Tab faqat modal elementlari orasida yuradi. React-da useId — aria-labelledby/describedby uchun unique ID.`,
      },
    ],
    relatedTopics: [
      { sectionId: 'testing', topicId: 'rtl', label: 'RTL (getByRole)' },
      { sectionId: 'react-core', topicId: 'use-id', label: 'useId (aria-*)' },
    ],
  },

  // ===== YANGI MAVZULAR =====
  {
    id: 'error-handling',
    title: 'Error Handling Strategies',
    importance: 2,
    status: 'to-learn',
    description: 'try/catch, Error Boundary, global error handler, logging',
    content: `Error handling — ilovada xatolarni to'g'ri ushlash, ko'rsatish, va log qilish. Foydalanuvchi tajribasini buzmasdan xatolarni boshqarish.

═══════════════════════════════════════
  XATO TURLARI
═══════════════════════════════════════

1. RENDER XATOLARI — komponent renderda xato
   TypeError, undefined property access
   Yechim: Error Boundary

2. EVENT HANDLER XATOLARI — click/submit da xato
   API xatosi, validatsiya, network
   Yechim: try/catch

3. ASYNC XATOLAR — Promise rejection
   fetch xatosi, timeout
   Yechim: try/catch, TanStack Query onError

4. GLOBAL XATOLAR — kutilmagan xato
   Yechim: window.onerror, unhandledrejection

═══════════════════════════════════════
  ERROR BOUNDARY
═══════════════════════════════════════

Error Boundary — React-ning render xatolarini ushlash mexanizmi.
FAQAT class component bilan (hook versiyasi yo'q).

  class ErrorBoundary extends Component {
    state = { hasError: false }

    static getDerivedStateFromError() {
      return { hasError: true }
    }

    componentDidCatch(error, info) {
      // Xatoni log qilish (Sentry, analytics)
      logError(error, info.componentStack)
    }

    render() {
      if (this.state.hasError) {
        return this.props.fallback
      }
      return this.props.children
    }
  }

Error Boundary USHLAYDI:
  ✅ Render xatolari
  ✅ Lifecycle method xatolari
  ✅ Child komponent xatolari

Error Boundary USHLAMAYDI:
  ❌ Event handler xatolari (try/catch kerak)
  ❌ Async xatolar (setTimeout, fetch)
  ❌ Server-side rendering
  ❌ Error Boundary o'zidagi xato

═══════════════════════════════════════
  STRATEJIYALAR
═══════════════════════════════════════

1. GRANULAR ERROR BOUNDARIES
   Har bo'lim uchun alohida Error Boundary:
   <ErrorBoundary fallback={<SidebarError />}>
     <Sidebar />
   </ErrorBoundary>
   // Sidebar xato bersa — faqat sidebar fallback ko'rsatadi
   // Qolgan ilova ishlaydi!

2. TRY/CATCH (event handler va async)
   async function handleSubmit() {
     try {
       await api.createUser(data)
     } catch (err) {
       setError(err.message)
     }
   }

3. TANSTACK QUERY (server xatolar)
   useQuery bilan — isError, error avtomatik
   useMutation bilan — onError callback

4. GLOBAL ERROR HANDLER
   window.addEventListener('unhandledrejection', ...)
   Sentry, LogRocket — xatolarni kuzatish

═══════════════════════════════════════
  ERROR REPORTING
═══════════════════════════════════════

Production-da xatolarni KUZATISH muhim:

Sentry — eng mashhur:
  ✅ Xatoni stack trace bilan ko'rish
  ✅ User session replay
  ✅ Performance monitoring
  ✅ Release tracking

LogRocket:
  ✅ Session replay (video kabi)
  ✅ Network log
  ✅ Console log

Minimal — o'z API:
  window.onerror = (msg, url, line) => {
    fetch('/api/errors', { body: JSON.stringify({ msg, url, line }) })
  }`,
    codeExamples: [
      {
        title: 'Error Boundary + granular fallback',
        language: 'tsx',
        code: `import { Component, type ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback: ReactNode | ((error: Error, reset: () => void) => ReactNode)
  onError?: (error: Error, componentStack: string) => void
}

interface ErrorBoundaryState {
  error: Error | null
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    this.props.onError?.(error, info.componentStack ?? '')
  }

  reset = () => {
    this.setState({ error: null })
  }

  render() {
    if (this.state.error) {
      const { fallback } = this.props
      if (typeof fallback === 'function') {
        return fallback(this.state.error, this.reset)
      }
      return fallback
    }
    return this.props.children
  }
}

// Ishlatish — granular boundaries
function App() {
  return (
    <ErrorBoundary
      fallback={<FullPageError />}
      onError={(err, stack) => Sentry.captureException(err, { extra: { stack } })}
    >
      <Header />
      <div className="flex">
        <ErrorBoundary fallback={<p>Sidebar xatosi</p>}>
          <Sidebar />
        </ErrorBoundary>
        <ErrorBoundary
          fallback={(error, reset) => (
            <div className="p-6">
              <p className="text-red-500">Xato: {error.message}</p>
              <button onClick={reset}>Qayta urinish</button>
            </div>
          )}
        >
          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </ErrorBoundary>
      </div>
    </ErrorBoundary>
  )
}`,
        description: 'Granular Error Boundary: Sidebar xato bersa — faqat sidebar fallback, qolgan ilova ishlaydi. reset() — xatoni tozalash va qayta render. onError — Sentry-ga yuborish.',
      },
      {
        title: 'Async error handling pattern',
        language: 'tsx',
        code: `import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'

// 1. try/catch — event handler
function ContactForm() {
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    try {
      const formData = new FormData(e.currentTarget)
      const res = await fetch('/api/contact', {
        method: 'POST',
        body: JSON.stringify(Object.fromEntries(formData)),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new Error(data?.message ?? \`Server xatosi: \${res.status}\`)
      }

      alert('Yuborildi!')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kutilmagan xato')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <p role="alert" className="text-red-500">{error}</p>}
      <input name="email" type="email" required />
      <textarea name="message" required />
      <button type="submit">Yuborish</button>
    </form>
  )
}

// 2. TanStack Query — avtomatik error handling
function CreateUserButton() {
  const mutation = useMutation({
    mutationFn: (data: { name: string }) =>
      fetch('/api/users', {
        method: 'POST',
        body: JSON.stringify(data),
      }).then(res => {
        if (!res.ok) throw new Error('Yaratib bo\\'lmadi')
        return res.json()
      }),
    onError: (error) => {
      // Global notification
      toast.error(error.message)
    },
  })

  return (
    <div>
      <button onClick={() => mutation.mutate({ name: 'Ali' })}>
        {mutation.isPending ? 'Yaratilmoqda...' : 'Yaratish'}
      </button>
      {mutation.isError && (
        <p role="alert" className="text-red-500">{mutation.error.message}</p>
      )}
    </div>
  )
}

// 3. Global error handler
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled rejection:', event.reason)
    // Sentry.captureException(event.reason)
  })
}`,
        description: 'Error handling: 1) try/catch — event handler (form submit), 2) TanStack Query — isError/error avtomatik, onError callback, 3) Global handler — kutilmagan Promise rejection.',
      },
    ],
    interviewQA: [
      {
        question: 'React-da xatolarni qanday boshqarish kerak?',
        answer: `4 ta strategiya: 1) Error Boundary — render xatolari uchun (class component, getDerivedStateFromError). Granular qo'yish — har bo'lim alohida fallback. 2) try/catch — event handler va async xatolar uchun. 3) TanStack Query — server xatolar uchun (isError, onError avtomatik). 4) Global handler — window.onerror, unhandledrejection — kutilmagan xatolar. Production-da: Sentry/LogRocket — xatolarni kuzatish va alert.`,
      },
      {
        question: 'Error Boundary nima ushlaydi, nima ushlamaydi?',
        answer: `USHLAYDI: render xatolari (JSX ichida throw), lifecycle method xatolari, child komponent xatolari. USHLAMAYDI: event handler xatolari (try/catch kerak), async xatolar (setTimeout, fetch, Promise), SSR xatolari, Error Boundary O'ZIDAGI xato. Shuning uchun: Error Boundary + try/catch + global handler — BIRGALIKDA ishlatish kerak. Error Boundary faqat CLASS component (hook versiyasi yo'q, lekin react-error-boundary kutubxonasi bor).`,
      },
      {
        question: 'Granular Error Boundary nima?',
        answer: `Bitta global Error Boundary — xato bo'lsa BUTUN ilova fallback ko'rsatadi. Granular — har bo'lim alohida Error Boundary: Sidebar xato bersa faqat sidebar fallback, Header va main kontent ISHLAYDI. Foydalanuvchi qolgan qismni ishlatishi mumkin. Best practice: critical bo'limlar (sidebar, widget) alohida boundary, page-level boundary, global app-level boundary. Nesting — ichki boundary avval ushlaydi, ushlamasa tashqariga ko'tariladi.`,
      },
    ],
    relatedTopics: [
      { sectionId: 'component-patterns', topicId: 'error-boundaries', label: 'Error Boundaries' },
      { sectionId: 'state-management', topicId: 'tanstack-query-deep', label: 'TanStack Query error handling' },
    ],
  },
]
