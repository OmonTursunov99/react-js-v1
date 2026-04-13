import type { Topic } from '../../types'

export const compositionVsInheritance: Topic = {
    id: `composition-vs-inheritance`,
    title: `Composition vs Inheritance`,
    importance: 3,
    status: `to-learn`,
    description: `Nima uchun React-da inheritance ishlatilmaydi`,
    content: `React-da komponentlar orasidagi munosabatni tashkil qilishning asosiy usuli — COMPOSITION (tarkiblash). OOP-dan farqli o'laroq, React-da inheritance (meros olish) ISHLATILMAYDI. Keling, nima uchun ekanini tushunamiz.

═══════════════════════════════════════
  INHERITANCE MUAMMOSI
═══════════════════════════════════════

OOP-da inheritance (extends) ko'p ishlatiladi:
  class Animal → class Dog extends Animal → class Puppy extends Dog

Lekin React-da inheritance ishlatilMAYDI. Nima uchun?
Chunki UI komponentlar "is-a" emas, "has-a" munosabatda.

  Button "is-a" Component emas —
  Button "has-a" children, icon, onClick

Inheritance muammolari:
  1) Chuqur ierarxiya — o'zgartirish qiyin
  2) Diamond problem — bir nechta parent-dan meros olish
  3) Tight coupling — parent o'zgarsa, barcha child-lar buziladi
  4) God class — base class haddan tashqari katta bo'lib ketadi

═══════════════════════════════════════
  COMPOSITION NIMA
═══════════════════════════════════════

Composition — kichik komponentlarni birlashtirish orqali
katta komponent yasash. Lego g'ishtlari kabi.

  <Page>
    <Header />
    <Sidebar />
    <Content>
      <Article />
      <Comments />
    </Content>
    <Footer />
  </Page>

Har bir komponent mustaqil, qayta ishlatilishi mumkin,
va boshqa komponentlar haqida bilmaydi.

═══════════════════════════════════════
  CHILDREN PROP
═══════════════════════════════════════

React-da children prop — eng asosiy composition usuli.
JSX tag-lar orasiga yozilgan narsa avtomatik children bo'ladi:

  <Card>
    <p>Bu matn</p>        ← children prop
  </Card>

Card komponent ichida:
  function Card({ children }) {
    return <div className="card">{children}</div>
  }

Bu Vue-dagi <slot /> ga o'xshaydi, lekin React-da
children oddiy prop — hech qanday maxsus sintaksis yo'q.

═══════════════════════════════════════
  SPECIALIZATION
═══════════════════════════════════════

Umumiy komponentdan maxsus komponent yasash.
Props orqali, extends orqali EMAS:

  Dialog → AlertDialog → DeleteConfirmDialog
  Button → PrimaryButton, DangerButton
  Input → SearchInput, PasswordInput

  function AlertDialog({ title, message }) {
    return (
      <Dialog>
        <h2>⚠️ {title}</h2>
        <p>{message}</p>
      </Dialog>
    )
  }

AlertDialog Dialog-dan meros OLMAYDI —
u Dialog-ni ICHIGA OLADI (composition).

═══════════════════════════════════════
  CONTAINMENT
═══════════════════════════════════════

Komponent ichidagi "bo'sh joy" — children yoki
named slots (header, footer props):

  function Layout({ header, sidebar, children }) {
    return (
      <div className="layout">
        <div className="header">{header}</div>
        <div className="sidebar">{sidebar}</div>
        <div className="content">{children}</div>
      </div>
    )
  }

Bu Vue-dagi named slots-ga o'xshaydi:
  Vue: <slot name="header" />
  React: {header} (prop sifatida)

═══════════════════════════════════════
  REACT JAMOASI TAVSIYASI
═══════════════════════════════════════

"At Facebook, we use React in thousands of components,
and we haven't found any use cases where we would
recommend creating component inheritance hierarchies."

— React rasmiy dokumentatsiyasi

Xulosa: React-da DOIM composition ishlatiladi.
Inheritance faqat Error Boundary uchun class component
yaratishda ishlatiladi (extends React.Component).`,
    codeExamples: [
      {
        title: `Children composition — Card component`,
        language: `tsx`,
        code: `// Card — umumiy konteyner komponent
interface CardProps {
  children: React.ReactNode
  variant?: 'default' | 'outlined' | 'elevated'
}

function Card({ children, variant = 'default' }: CardProps) {
  const styles: Record<string, string> = {
    default: 'bg-white p-4 rounded',
    outlined: 'bg-white p-4 rounded border border-gray-300',
    elevated: 'bg-white p-4 rounded shadow-lg',
  }

  return <div className={styles[variant]}>{children}</div>
}

// UserCard — Card-ni ICHIGA OLADI (composition)
interface UserCardProps {
  name: string
  email: string
  avatar: string
}

function UserCard({ name, email, avatar }: UserCardProps) {
  return (
    <Card variant="elevated">
      <img src={avatar} alt={name} className="w-16 h-16 rounded-full" />
      <h3>{name}</h3>
      <p>{email}</p>
    </Card>
  )
}

// ProductCard — xuddi shu Card, boshqa kontent
function ProductCard({ title, price }: { title: string; price: number }) {
  return (
    <Card variant="outlined">
      <h3>{title}</h3>
      <p className="text-green-600">\${price}</p>
      <button>Sotib olish</button>
    </Card>
  )
}

// Ishlatish
function App() {
  return (
    <div>
      <UserCard name="Ali" email="ali@mail.uz" avatar="/ali.jpg" />
      <ProductCard title="React kitobi" price={50000} />
    </div>
  )
}`,
        description: `Card — umumiy komponent, children orqali istalgan kontentni qabul qiladi. UserCard va ProductCard Card-dan meros OLMAYDI — uni ICHIGA OLADI. Bu composition.`,
      },
      {
        title: `Specialization — Dialog → AlertDialog → DeleteConfirmDialog`,
        language: `tsx`,
        code: `import { useState } from 'react'

// 1. Eng umumiy — Dialog
interface DialogProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
}

function Dialog({ isOpen, onClose, children, title }: DialogProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}
        {children}
        <button onClick={onClose} className="mt-4 text-gray-500">
          Yopish
        </button>
      </div>
    </div>
  )
}

// 2. Maxsusroq — AlertDialog (Dialog + ogohlantirish uslubi)
interface AlertDialogProps {
  isOpen: boolean
  onClose: () => void
  message: string
}

function AlertDialog({ isOpen, onClose, message }: AlertDialogProps) {
  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="⚠️ Ogohlantirish">
      <p className="text-amber-600">{message}</p>
    </Dialog>
  )
}

// 3. Eng maxsus — DeleteConfirmDialog
interface DeleteConfirmProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  itemName: string
}

function DeleteConfirmDialog({ isOpen, onClose, onConfirm, itemName }: DeleteConfirmProps) {
  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="🗑️ O'chirishni tasdiqlang">
      <p>Haqiqatan ham <strong>{itemName}</strong> ni o'chirmoqchimisiz?</p>
      <p className="text-red-500 text-sm mt-2">Bu amalni qaytarib bo'lmaydi!</p>
      <div className="flex gap-2 mt-4">
        <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">
          Bekor qilish
        </button>
        <button onClick={onConfirm} className="px-4 py-2 bg-red-500 text-white rounded">
          O'chirish
        </button>
      </div>
    </Dialog>
  )
}

// Ishlatish
function App() {
  const [showDelete, setShowDelete] = useState(false)

  return (
    <>
      <button onClick={() => setShowDelete(true)}>O'chirish</button>
      <DeleteConfirmDialog
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={() => { console.log('O\\'chirildi!'); setShowDelete(false) }}
        itemName="React loyihasi"
      />
    </>
  )
}`,
        description: `Specialization pattern — har bir keyingi komponent avvalgisini o'z ichiga oladi va maxsuslashtiradi. Hech qanday extends yo'q — faqat composition.`,
      },
      {
        title: `Named slots pattern — Layout component`,
        language: `tsx`,
        code: `// Layout — named slots pattern (Vue-dagi <slot name="..."> ga o'xshaydi)
interface LayoutProps {
  header: React.ReactNode      // <slot name="header" />
  sidebar: React.ReactNode     // <slot name="sidebar" />
  children: React.ReactNode    // <slot /> (default)
  footer?: React.ReactNode     // <slot name="footer" /> (ixtiyoriy)
}

function Layout({ header, sidebar, children, footer }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-600 text-white p-4">
        {header}
      </header>

      <div className="flex flex-1">
        <aside className="w-64 bg-gray-100 p-4">
          {sidebar}
        </aside>

        <main className="flex-1 p-6">
          {children}
        </main>
      </div>

      {footer && (
        <footer className="bg-gray-800 text-white p-4">
          {footer}
        </footer>
      )}
    </div>
  )
}

// Ishlatish — har bir "slot" ga turli kontent berish
function DashboardPage() {
  return (
    <Layout
      header={
        <nav className="flex justify-between">
          <h1>Boshqaruv paneli</h1>
          <button>Chiqish</button>
        </nav>
      }
      sidebar={
        <ul>
          <li>Asosiy</li>
          <li>Foydalanuvchilar</li>
          <li>Sozlamalar</li>
        </ul>
      }
      footer={<p>© 2024 Mening ilovam</p>}
    >
      {/* children — default slot */}
      <h2>Xush kelibsiz!</h2>
      <p>Bu boshqaruv paneli sahifasi.</p>
    </Layout>
  )
}

// Boshqa sahifa — boshqa kontent, XUDDI SHU layout
function SettingsPage() {
  return (
    <Layout
      header={<h1>Sozlamalar</h1>}
      sidebar={<p>Sozlamalar menyusi</p>}
    >
      <h2>Profil sozlamalari</h2>
      <form>
        <input placeholder="Ism" />
        <input placeholder="Email" />
      </form>
    </Layout>
  )
}`,
        description: `Named slots — props orqali turli joyga turli kontent berish. Vue-dagi <slot name="header" /> ga teng. React-da bu oddiy props — maxsus sintaksis shart emas.`,
      },
    ],
    interviewQA: [
      {
        question: `Nima uchun React-da inheritance ishlatilmaydi?`,
        answer: `React-da UI komponentlar "is-a" emas, "has-a" munosabatda. Button Component-dan meros olmaydi — u children, icon, onClick-ga EGA. Inheritance chuqur ierarxiya, tight coupling va diamond problem keltiradi. React jamoasi Facebook-da minglab komponentlarda birorta ham inheritance ishlatish kerak bo'lgan holat TOPMAGAN. Yagona istisno — Error Boundary uchun class komponent (extends React.Component).`,
      },
      {
        question: `Composition va inheritance farqi nimada?`,
        answer: `Inheritance — "is-a" munosabat: Dog IS-A Animal. Composition — "has-a" munosabat: Car HAS-A Engine. React-da composition kichik, mustaqil komponentlarni birlashtirish orqali katta komponent yaratadi. Har bir komponent o'z ishini qiladi, boshqalarga bog'liq emas. Inheritance-da parent o'zgarsa BARCHA child-lar buziladi, composition-da esa komponentlar mustaqil — birini o'zgartirsangiz, boshqasiga ta'sir qilmaydi.`,
      },
      {
        question: `children prop qanday ishlaydi?`,
        answer: `JSX tag-lar orasiga yozilgan har qanday narsa avtomatik children prop sifatida uzatiladi. <Card><p>Matn</p></Card> — bu aslida Card({ children: <p>Matn</p> }). children React.ReactNode tipida — string, number, element, array, null bo'lishi mumkin. Bu Vue-dagi default <slot />-ga o'xshaydi. Lekin React-da children maxsus narsa emas — oddiy prop. Shuning uchun named slots uchun alohida props ishlatiladi (header, footer).`,
      },
      {
        question: `Specialization pattern nima?`,
        answer: `Specialization — umumiy komponentdan maxsusroq komponent yasash. Masalan: Dialog → AlertDialog → DeleteConfirmDialog. AlertDialog Dialog-dan meros OLMAYDI — u Dialog-ni o'z ichiga oladi va qo'shimcha props beradi (severity, icon). Bu composition orqali amalga oshiriladi. Natijada har bir komponent mustaqil, test qilish oson, va umumiy komponent o'zgarsa maxsus komponentlar buzilmaydi (chunki ular faqat props orqali bog'langan).`,
      },
    ],
    relatedTopics: [
      { sectionId: `component-patterns`, topicId: `compound-components`, label: `Compound Components` },
      { sectionId: `component-patterns`, topicId: `children-api`, label: `Children API` },
      { sectionId: `architecture`, topicId: `solid-react`, label: `SOLID in React` },
    ],
  }
