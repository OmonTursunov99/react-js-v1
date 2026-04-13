import type { Topic } from '../../../types'

export const solidReact: Topic = {
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
      { techId: 'react-js', sectionId: 'component-patterns', topicId: 'composition-vs-inheritance', label: 'Composition' },
      { techId: 'react-js', sectionId: 'component-patterns', topicId: 'custom-hooks', label: 'Custom Hooks (SRP)' },
      { techId: 'react-js', sectionId: 'architecture', topicId: 'fsd', label: 'FSD (arxitektura)' },
    ],
  }
