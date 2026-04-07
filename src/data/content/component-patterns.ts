import type { Topic } from '../types'

export const componentPatternsTopics: Topic[] = [
  // ===== COMPOSITION VS INHERITANCE =====
  {
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
  },

  // ===== COMPOUND COMPONENTS =====
  {
    id: `compound-components`,
    title: `Compound Components`,
    importance: 3,
    status: `to-learn`,
    description: `<Select><Option/></Select> pattern`,
    content: `Compound Components — bir nechta komponent birgalikda ishlaydi va ichki state ulashadi. HTML-dagi <select> + <option> ga o'xshaydi.

═══════════════════════════════════════
  NIMA BU
═══════════════════════════════════════

Bir nechta komponent birgalikda ishlaydi,
ichki state ulashadi:

  <Select>
    <Option value="react">React</Option>
    <Option value="vue">Vue</Option>
  </Select>

Select va Option bir-birini "biladi" — lekin
tashqi kod ichki logikani bilishi SHART EMAS.
Foydalanuvchi faqat tuzilmani (structure) yozadi,
logika ichida yashiringan.

═══════════════════════════════════════
  NIMA UCHUN KERAK
═══════════════════════════════════════

1) API chiroyli va tushunarli:
   // Compound (chiroyli):
   <Accordion>
     <Accordion.Item title="Savol 1">Javob 1</Accordion.Item>
     <Accordion.Item title="Savol 2">Javob 2</Accordion.Item>
   </Accordion>

   // Oddiy props (chirkin):
   <Accordion items={[
     { title: 'Savol 1', content: 'Javob 1' },
     { title: 'Savol 2', content: 'Javob 2' },
   ]} />

2) Ichki logika yashirin — foydalanuvchi state boshqarmaydi
3) Moslashuvchan — foydalanuvchi tuzilmani o'zi belgilaydi

═══════════════════════════════════════
  CONTEXT BILAN PATTERN
═══════════════════════════════════════

Ichki komponentlar Context orqali parent state-ga kiradi:

1. Parent (Accordion):
   - createContext() bilan context yaratadi
   - Provider bilan state ulashadi
   - O'z children-larini renderlayd

2. Child (Accordion.Item):
   - useContext() bilan parent state-ni oladi
   - O'zini boshqaradi (ochiq/yopiq)

Bu eng zamonaviy va tavsiya etiladigan usul.

═══════════════════════════════════════
  REAL MISOL
═══════════════════════════════════════

Compound component ishlatiladigan joylar:
  - Accordion (ochiq/yopiq bo'limlar)
  - Tabs (tab + panel)
  - Select / Dropdown
  - Menu (trigger + items)
  - Modal (trigger + overlay + content)
  - Table (header + body + row + cell)

Mashhur kutubxonalar:
  - Radix UI
  - Headless UI
  - Reach UI
  Hammasi compound component pattern ishlatadi.

═══════════════════════════════════════
  DOT NOTATION
═══════════════════════════════════════

Import chiroyli bo'lishi uchun dot notation ishlatiladi:

  Accordion.Item
  Accordion.Trigger
  Accordion.Content

Qanday qilinadi:
  function Accordion({ children }) { ... }
  function Item({ children }) { ... }

  Accordion.Item = Item    // funksiyaga property qo'shish
  export { Accordion }

Yoki object.assign:
  export const Accordion = Object.assign(AccordionRoot, {
    Item: AccordionItem,
    Trigger: AccordionTrigger,
    Content: AccordionContent,
  })`,
    codeExamples: [
      {
        title: `Accordion — Compound Component (Context bilan)`,
        language: `tsx`,
        code: `import { createContext, useContext, useState, type ReactNode } from 'react'

// 1. Context yaratish
interface AccordionContextType {
  activeIndex: number | null
  toggle: (index: number) => void
}

const AccordionContext = createContext<AccordionContextType | null>(null)

function useAccordion() {
  const context = useContext(AccordionContext)
  if (!context) {
    throw new Error('Accordion.Item must be used within <Accordion>')
  }
  return context
}

// 2. Root component — state va Provider
interface AccordionProps {
  children: ReactNode
  defaultIndex?: number | null
}

function AccordionRoot({ children, defaultIndex = null }: AccordionProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(defaultIndex)

  const toggle = (index: number) => {
    setActiveIndex(prev => (prev === index ? null : index))
  }

  return (
    <AccordionContext.Provider value={{ activeIndex, toggle }}>
      <div className="border rounded-lg divide-y">{children}</div>
    </AccordionContext.Provider>
  )
}

// 3. Child component — Context ishlatadi
interface ItemProps {
  children: ReactNode
  title: string
  index: number
}

function AccordionItem({ children, title, index }: ItemProps) {
  const { activeIndex, toggle } = useAccordion()
  const isOpen = activeIndex === index

  return (
    <div>
      <button
        className="w-full text-left p-4 font-medium flex justify-between"
        onClick={() => toggle(index)}
      >
        {title}
        <span>{isOpen ? '▲' : '▼'}</span>
      </button>
      {isOpen && (
        <div className="p-4 bg-gray-50">{children}</div>
      )}
    </div>
  )
}

// 4. Dot notation — chiroyli API
const Accordion = Object.assign(AccordionRoot, {
  Item: AccordionItem,
})

// 5. Ishlatish
function FAQ() {
  return (
    <Accordion defaultIndex={0}>
      <Accordion.Item index={0} title="React nima?">
        <p>React — UI kutubxonasi</p>
      </Accordion.Item>
      <Accordion.Item index={1} title="Composition nima?">
        <p>Kichik komponentlarni birlashtirib katta komponent yasash</p>
      </Accordion.Item>
      <Accordion.Item index={2} title="Hook nima?">
        <p>Funksiya komponentlarda state va lifecycle ishlatish</p>
      </Accordion.Item>
    </Accordion>
  )
}`,
        description: `Accordion — klassik compound component. AccordionRoot state boshqaradi va Context orqali ulashadi. AccordionItem Context orqali parent state-ga kiradi. Dot notation API chiroyli qiladi.`,
      },
      {
        title: `Tabs — Compound Component`,
        language: `tsx`,
        code: `import { createContext, useContext, useState, type ReactNode } from 'react'

// Context
interface TabsContextType {
  activeTab: string
  setActiveTab: (id: string) => void
}

const TabsContext = createContext<TabsContextType | null>(null)

function useTabs() {
  const ctx = useContext(TabsContext)
  if (!ctx) throw new Error('Tabs components must be used within <Tabs>')
  return ctx
}

// Root
function TabsRoot({ children, defaultTab }: { children: ReactNode; defaultTab: string }) {
  const [activeTab, setActiveTab] = useState(defaultTab)

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div>{children}</div>
    </TabsContext.Provider>
  )
}

// Tab list (konteyner)
function TabList({ children }: { children: ReactNode }) {
  return <div className="flex border-b">{children}</div>
}

// Alohida tab button
function Tab({ id, children }: { id: string; children: ReactNode }) {
  const { activeTab, setActiveTab } = useTabs()
  const isActive = activeTab === id

  return (
    <button
      className={\`px-4 py-2 \${isActive ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}\`}
      onClick={() => setActiveTab(id)}
    >
      {children}
    </button>
  )
}

// Tab panel (kontent)
function TabPanel({ id, children }: { id: string; children: ReactNode }) {
  const { activeTab } = useTabs()
  if (activeTab !== id) return null

  return <div className="p-4">{children}</div>
}

// Dot notation
const Tabs = Object.assign(TabsRoot, {
  List: TabList,
  Tab: Tab,
  Panel: TabPanel,
})

// Ishlatish
function SettingsPage() {
  return (
    <Tabs defaultTab="profile">
      <Tabs.List>
        <Tabs.Tab id="profile">Profil</Tabs.Tab>
        <Tabs.Tab id="security">Xavfsizlik</Tabs.Tab>
        <Tabs.Tab id="notifications">Bildirishnomalar</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel id="profile">
        <h2>Profil sozlamalari</h2>
        <input placeholder="Ism" />
      </Tabs.Panel>
      <Tabs.Panel id="security">
        <h2>Parol o'zgartirish</h2>
        <input type="password" placeholder="Yangi parol" />
      </Tabs.Panel>
      <Tabs.Panel id="notifications">
        <h2>Bildirishnoma sozlamalari</h2>
        <label><input type="checkbox" /> Email bildirishnomalar</label>
      </Tabs.Panel>
    </Tabs>
  )
}`,
        description: `Tabs — 4 ta komponentdan iborat compound component: Tabs (root + context), Tabs.List (tab tugmalari konteyneri), Tabs.Tab (alohida tugma), Tabs.Panel (kontent). Barchasi bitta context orqali bog'langan.`,
      },
    ],
    interviewQA: [
      {
        question: `Compound components nima va qachon ishlatiladi?`,
        answer: `Compound components — bir nechta komponent birgalikda ishlaydigan va ichki state ulashadigan pattern. HTML-dagi <select> + <option> ga o'xshaydi. Qachon ishlatiladi: komponent murakkab tuzilmaga ega bo'lsa (Accordion, Tabs, Select, Menu), foydalanuvchiga moslashuvchan API berish kerak bo'lsa, va ichki logikani yashirish kerak bo'lsa. Context orqali parent state child-larga uzatiladi. Radix UI, Headless UI kabi kutubxonalar aynan shu pattern-ni ishlatadi.`,
      },
      {
        question: `Context-siz compound components mumkinmi?`,
        answer: `Ha, React.Children.map + cloneElement bilan mumkin. Parent children-larni iterate qiladi va har biriga qo'shimcha props beradi (cloneElement orqali). Lekin bu eski usul va kamchiliklari bor: 1) Faqat birinchi darajali children-lar bilan ishlaydi (nested emas), 2) cloneElement React jamoasi tomonidan tavsiya qilinMAYDI — zamonaviy React-da Context yaxshiroq, 3) TypeScript tipizatsiyasi murakkab. Shuning uchun Context bilan pattern afzal.`,
      },
      {
        question: `Dot notation qanday qilinadi?`,
        answer: `Dot notation — Accordion.Item, Tabs.Tab kabi chiroyli API. Ikki usul bor: 1) Object.assign — const Accordion = Object.assign(AccordionRoot, { Item: AccordionItem }). 2) To'g'ridan-to'g'ri property: function Accordion() {...}; Accordion.Item = function Item() {...}. Object.assign toza va TypeScript bilan yaxshi ishlaydi. Bu pattern import-ni soddalashtiradi: bitta Accordion import qilsangiz, barcha sub-komponentlar ham keladi.`,
      },
    ],
    relatedTopics: [
      { sectionId: `react-core`, topicId: `use-context`, label: `useContext (ichki aloqa)` },
      { sectionId: `component-patterns`, topicId: `children-api`, label: `Children API` },
      { sectionId: `component-patterns`, topicId: `composition-vs-inheritance`, label: `Composition pattern` },
    ],
  },

  // ===== RENDER PROPS =====
  {
    id: `render-props`,
    title: `Render Props`,
    importance: 2,
    status: `to-learn`,
    description: `Funksiya orqali child render qilish`,
    content: `Render Props — komponentga funksiya prop berish, u funksiya JSX qaytaradi. Komponent logikani boshqaradi, render qilishni tashqi kodga topshiradi.

═══════════════════════════════════════
  NIMA BU
═══════════════════════════════════════

Komponentga funksiya prop beriladi — u funksiya JSX qaytaradi.
Komponent logikani beradi, render qilishni tashqariga chiqaradi:

  <DataFetcher
    url="/api/users"
    render={({ data, loading }) => (
      loading ? <Spinner /> : <UserList users={data} />
    )}
  />

DataFetcher — fetch logikasini boshqaradi
render prop — natijani QANDAY ko'rsatishni belgilaydi

═══════════════════════════════════════
  SINTAKSIS
═══════════════════════════════════════

Ikki usul bor:

1. render prop:
   <Mouse render={({ x, y }) => <p>Pozitsiya: {x}, {y}</p>} />

2. children as function:
   <Mouse>
     {({ x, y }) => <p>Pozitsiya: {x}, {y}</p>}
   </Mouse>

Ikkalasi bir xil ishlaydi. children as function
ko'proq tarqalgan.

═══════════════════════════════════════
  NIMA UCHUN KERAK
═══════════════════════════════════════

Logikani qayta ishlatish — bir xil logika, turli UI:

  // Mouse tracking — xar xil joyda boshqacha ko'rsatish
  <MouseTracker>
    {({ x, y }) => <Tooltip x={x} y={y} />}
  </MouseTracker>

  <MouseTracker>
    {({ x, y }) => <Cursor x={x} y={y} />}
  </MouseTracker>

Bir xil logika (mouse kuzatish), turli UI (Tooltip va Cursor).
Logika bir marta yoziladi, UI moslashtiriladi.

═══════════════════════════════════════
  CUSTOM HOOKS ALMASHTIRDI
═══════════════════════════════════════

React 16.8 dan hook-lar paydo bo'ldi — render props
KAMROQ kerak bo'lib qoldi:

  // Render props (eski):
  <MouseTracker>
    {({ x, y }) => <p>{x}, {y}</p>}
  </MouseTracker>

  // Custom hook (yangi, oddiyroq):
  function MyComponent() {
    const { x, y } = useMousePosition()
    return <p>{x}, {y}</p>
  }

Hook — toza, o'qish oson, nesting yo'q.
Lekin render props hali ham ba'zi kutubxonalarda
ishlatiladi (Formik eski versiya, React Router <Route>).

═══════════════════════════════════════
  MUAMMO
═══════════════════════════════════════

Wrapper hell — ko'p render props = chuqur nesting:

  <ThemeConsumer>
    {theme => (
      <AuthConsumer>
        {user => (
          <LanguageConsumer>
            {lang => (
              <MyComponent theme={theme} user={user} lang={lang} />
            )}
          </LanguageConsumer>
        )}
      </AuthConsumer>
    )}
  </ThemeConsumer>

Bu o'qish va boshqarish juda qiyin.
Hook-lar bu muammoni to'liq hal qiladi.`,
    codeExamples: [
      {
        title: `Mouse tracker — render prop bilan`,
        language: `tsx`,
        code: `import { useState, useEffect, type ReactNode } from 'react'

// 1. Render prop komponent — logikani boshqaradi
interface MousePosition {
  x: number
  y: number
}

interface MouseTrackerProps {
  children: (pos: MousePosition) => ReactNode
}

function MouseTracker({ children }: MouseTrackerProps) {
  const [position, setPosition] = useState<MousePosition>({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // children FUNKSIYA — uni chaqiramiz va natijani renderlaydi
  return <>{children(position)}</>
}

// 2. Ishlatish — bir xil logika, turli UI
function App() {
  return (
    <div>
      {/* Matn ko'rinishda */}
      <MouseTracker>
        {({ x, y }) => (
          <p>Mouse pozitsiyasi: {x}, {y}</p>
        )}
      </MouseTracker>

      {/* Kursor izlash */}
      <MouseTracker>
        {({ x, y }) => (
          <div
            style={{
              position: 'fixed',
              left: x - 10,
              top: y - 10,
              width: 20,
              height: 20,
              borderRadius: '50%',
              background: 'red',
              pointerEvents: 'none',
            }}
          />
        )}
      </MouseTracker>
    </div>
  )
}`,
        description: `MouseTracker logikani boshqaradi (mouse pozitsiyasini kuzatadi), lekin uni QANDAY ko'rsatishni bilmaydi. children funksiyasi render qilishni belgilaydi. Bir xil logika — turli UI.`,
      },
      {
        title: `Custom hook alternativa — xuddi shu logika`,
        language: `tsx`,
        code: `import { useState, useEffect } from 'react'

// Custom hook — render props O'RNIGA
function useMousePosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return position
}

// Ishlatish — ancha oddiy va toza
function MouseDisplay() {
  const { x, y } = useMousePosition()

  return <p>Mouse: {x}, {y}</p>
}

function CustomCursor() {
  const { x, y } = useMousePosition()

  return (
    <div
      style={{
        position: 'fixed',
        left: x - 10,
        top: y - 10,
        width: 20,
        height: 20,
        borderRadius: '50%',
        background: 'blue',
        pointerEvents: 'none',
      }}
    />
  )
}

// Farqni solishtiring:
// Render props: <MouseTracker>{({x,y}) => ...}</MouseTracker>
// Custom hook:  const {x, y} = useMousePosition()
//
// Hook — toza, o'qish oson, nesting yo'q.
// Shuning uchun zamonaviy React-da hook afzal.`,
        description: `Xuddi shu mouse tracking logikasi, lekin custom hook bilan. Hook-lar render props-ni ko'p hollarda ALMASHTIRDI — oddiyroq, nesting yo'q, TypeScript bilan yaxshiroq ishlaydi.`,
      },
    ],
    interviewQA: [
      {
        question: `Render props nima?`,
        answer: `Render props — komponentga funksiya prop berish pattern-i. Bu funksiya JSX qaytaradi. Komponent logikani boshqaradi (masalan, mouse pozitsiyasi, form holati), lekin natijani QANDAY render qilishni tashqi kodga qoldiradi. Ikki sintaksis bor: render prop (<Mouse render={fn} />) va children as function (<Mouse>{fn}</Mouse>). Bu pattern logikani qayta ishlatish imkonini beradi — bir xil logika, turli UI.`,
      },
      {
        question: `Render props vs Custom Hooks — qaysi yaxshiroq?`,
        answer: `Custom hooks ko'p hollarda yaxshiroq: 1) Oddiyroq sintaksis — const {x,y} = useMousePosition() vs <MouseTracker>{({x,y}) => ...}</MouseTracker>. 2) Nesting muammosi yo'q — ko'p render props "wrapper hell" yaratadi. 3) TypeScript tipizatsiyasi toza. 4) Composition oson — hook ichida boshqa hook chaqirish mumkin. Lekin render props hali ham kerak: dynamik render logikasi (runtime-da boshqa komponent berish), ba'zi kutubxonalar (React Router v5), va inversion of control pattern-larda.`,
      },
      {
        question: `Qachon render props hali ham kerak?`,
        answer: `Render props hali ham kerak bo'ladigan holatlar: 1) Runtime-da render logikasini o'zgartirish kerak bo'lganda — hook-lar compile-time, render props runtime. 2) Headless komponentlar — logika beradi, UI tashqarida (Downshift kutubxonasi). 3) Inversion of control — komponent ichki holatini tashqariga chiqaradi, lekin render nazoratini bermaydi. 4) Legacy kodda — eski kutubxonalar bilan ishlashda. Yangi kod uchun avval hook, kerak bo'lsa render props.`,
      },
    ],
    relatedTopics: [
      { sectionId: `component-patterns`, topicId: `hoc`, label: `HOC (alternativa)` },
      { sectionId: `component-patterns`, topicId: `custom-hooks`, label: `Custom Hooks (zamonaviy alternativa)` },
    ],
  },

  // ===== HOC =====
  {
    id: `hoc`,
    title: `Higher-Order Components (HOC)`,
    importance: 2,
    status: `to-learn`,
    description: `withAuth(Component) pattern, qachon ishlatiladi`,
    content: `Higher-Order Component (HOC) — funksiya bo'lib, komponentni oladi va YANGI komponent qaytaradi. Komponentga qo'shimcha funksionallik beradi.

═══════════════════════════════════════
  NIMA BU
═══════════════════════════════════════

HOC — funksiya bo'lib, komponentni oladi va
YANGI komponent qaytaradi:

  const EnhancedComponent = withSomething(OriginalComponent)

Masalan:
  const ProtectedDashboard = withAuth(Dashboard)
  // Dashboard — oddiy komponent
  // ProtectedDashboard — auth tekshiruvi bor

HOC komponentni "o'ramaydi" (wrap) —
qo'shimcha logika qo'shadi.

═══════════════════════════════════════
  SINTAKSIS
═══════════════════════════════════════

  function withAuth<P>(Component: React.ComponentType<P>) {
    return function AuthComponent(props: P) {
      const isAuthenticated = useAuth()

      if (!isAuthenticated) {
        return <Navigate to="/login" />
      }

      return <Component {...props} />
    }
  }

  // Ishlatish:
  const ProtectedDashboard = withAuth(Dashboard)

HOC — oddiy funksiya:
  Kirish: Component
  Chiqish: Yangi Component (qo'shimcha logika bilan)

═══════════════════════════════════════
  REAL MISOLLAR
═══════════════════════════════════════

1. withAuth — autentifikatsiya tekshirish
2. withTheme — tema berish (dark/light)
3. withLoading — loading holat qo'shish
4. withErrorBoundary — xato ushlash
5. withLogger — render log qilish (debugging)
6. React.memo — ham HOC! Memoizatsiya qo'shadi

═══════════════════════════════════════
  QOIDALAR
═══════════════════════════════════════

1) Original komponentni o'zgartirMANG:
   // NOTO'G'RI:
   Component.prototype.render = ...

   // TO'G'RI:
   return <Component {...props} />

2) Props-ni pass through qiling:
   // Barcha props-ni original komponentga uzating
   return <Component {...props} extraProp={value} />

3) Display name bering (debugging uchun):
   AuthComponent.displayName =
     \`withAuth(\${Component.displayName || Component.name})\`

4) Render ichida HOC yaratMANG:
   // NOTO'G'RI — har renderda yangi komponent!
   function App() {
     const Enhanced = withAuth(Dashboard) // ← har render!
     return <Enhanced />
   }

   // TO'G'RI — tashqarida yaratish:
   const Enhanced = withAuth(Dashboard)
   function App() {
     return <Enhanced />
   }

═══════════════════════════════════════
  MUAMMOLARI
═══════════════════════════════════════

1) Wrapper hell — ko'p HOC qo'yilsa:
   withAuth(withTheme(withLoading(withLogger(Component))))

2) Props conflict — HOC-lar bir xil nom bilan prop bersa

3) Ref forward qilinmaydi — forwardRef kerak

4) Static methods yo'qoladi — hoist-non-react-statics kerak

═══════════════════════════════════════
  CUSTOM HOOKS ALMASHTIRDI
═══════════════════════════════════════

Ko'p HOC-lar endi custom hook bilan oddiyroq qilinadi:

  // HOC:
  const ProtectedPage = withAuth(Dashboard)

  // Hook (oddiyroq):
  function Dashboard() {
    const { user, isAuthenticated } = useAuth()
    if (!isAuthenticated) return <Navigate to="/login" />
    return <div>Salom, {user.name}</div>
  }

Lekin HOC hali ham kerak bo'ladigan holatlar bor:
  - Cross-cutting concerns (logging, error boundary)
  - Har bir sahifaga bir xil logika qo'shish
  - 3rd party kutubxonalar bilan integratsiya`,
    codeExamples: [
      {
        title: `withAuth — autentifikatsiya HOC`,
        language: `tsx`,
        code: `import { type ComponentType } from 'react'

// Sodda auth hook (misol uchun)
function useAuth() {
  // Real ilovada Context yoki state management-dan keladi
  return {
    isAuthenticated: true,
    user: { name: 'Ali', role: 'admin' },
  }
}

// HOC — komponentni oladi, yangi komponent qaytaradi
function withAuth<P extends object>(Component: ComponentType<P>) {
  function AuthenticatedComponent(props: P) {
    const { isAuthenticated, user } = useAuth()

    if (!isAuthenticated) {
      return (
        <div className="text-center p-8">
          <h2>Ruxsat yo'q!</h2>
          <p>Iltimos, tizimga kiring</p>
          <a href="/login" className="text-blue-500">Kirish</a>
        </div>
      )
    }

    // Barcha props + user props uzatish
    return <Component {...props} user={user} />
  }

  // Debug uchun nom berish (React DevTools-da ko'rinadi)
  AuthenticatedComponent.displayName =
    \`withAuth(\${Component.displayName || Component.name || 'Component'})\`

  return AuthenticatedComponent
}

// Oddiy komponent
interface DashboardProps {
  user?: { name: string; role: string }
}

function Dashboard({ user }: DashboardProps) {
  return (
    <div>
      <h1>Boshqaruv paneli</h1>
      <p>Xush kelibsiz, {user?.name}!</p>
      <p>Rolingiz: {user?.role}</p>
    </div>
  )
}

// HOC bilan o'rash
const ProtectedDashboard = withAuth(Dashboard)

// Ishlatish
function App() {
  return <ProtectedDashboard />
  // Agar auth bo'lmasa — "Ruxsat yo'q" ko'rsatadi
  // Agar auth bo'lsa — Dashboard + user props beradi
}`,
        description: `withAuth — eng keng tarqalgan HOC. Komponent render bo'lishdan OLDIN autentifikatsiyani tekshiradi. Auth bo'lmasa fallback ko'rsatadi, bo'lsa original komponentni user bilan renderlayd.`,
      },
      {
        title: `withLoading — loading state HOC`,
        language: `tsx`,
        code: `import { type ComponentType } from 'react'

// Loading spinner
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      <span className="ml-2">Yuklanmoqda...</span>
    </div>
  )
}

// withLoading HOC
interface WithLoadingProps {
  isLoading: boolean
}

function withLoading<P extends object>(Component: ComponentType<P>) {
  function LoadingComponent(props: P & WithLoadingProps) {
    const { isLoading, ...rest } = props

    if (isLoading) {
      return <LoadingSpinner />
    }

    return <Component {...(rest as P)} />
  }

  LoadingComponent.displayName =
    \`withLoading(\${Component.displayName || Component.name || 'Component'})\`

  return LoadingComponent
}

// Oddiy komponent
interface UserListProps {
  users: Array<{ id: number; name: string }>
}

function UserList({ users }: UserListProps) {
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}

// HOC bilan
const UserListWithLoading = withLoading(UserList)

// Ishlatish
function App() {
  const isLoading = false
  const users = [
    { id: 1, name: 'Ali' },
    { id: 2, name: 'Vali' },
  ]

  return (
    <UserListWithLoading
      isLoading={isLoading}  // true bo'lsa — spinner
      users={users}           // false bo'lsa — ro'yxat
    />
  )
}`,
        description: `withLoading — isLoading prop qo'shadi. true bo'lganda spinner ko'rsatadi, false bo'lganda original komponentni renderlaydi. Har qanday komponentga loading holat qo'shish mumkin.`,
      },
    ],
    interviewQA: [
      {
        question: `HOC nima va qanday ishlaydi?`,
        answer: `Higher-Order Component — funksiya bo'lib, komponentni argument sifatida oladi va YANGI komponent qaytaradi. const Enhanced = withAuth(Dashboard). Yangi komponent original komponentni o'z ichiga oladi va qo'shimcha logika qo'shadi (auth tekshirish, loading state, tema berish). HOC original komponentni O'ZGARTIRMAYDI — uni "o'raydi". Bu funksional dasturlashdagi function composition-ga o'xshaydi. React.memo ham HOC — memoizatsiya qo'shadi.`,
      },
      {
        question: `HOC muammolari nimada?`,
        answer: `HOC ning asosiy muammolari: 1) Wrapper hell — ko'p HOC qo'yilsa withAuth(withTheme(withLoading(Component))) — debug qiyin, DevTools-da ko'p nesting. 2) Props collision — ikki HOC bir xil nomli prop bersa, biri yutiladi. 3) Ref forwarding — HOC ref-ni to'xtatadi, forwardRef kerak. 4) Static methods yo'qoladi — wrapper komponentda original component-ning static method-lari bo'lmaydi. 5) Render ichida yaratilsa har safar yangi komponent hosil bo'ladi — state yo'qoladi.`,
      },
      {
        question: `HOC vs Custom Hooks vs Render Props — qaysi qachon?`,
        answer: `Custom Hooks — KO'P HOLLARDA eng yaxshi tanlov. Oddiy, toza, TypeScript bilan yaxshi, nesting yo'q. 90% logika qayta ishlatish hook bilan qilinadi. HOC — cross-cutting concerns uchun: auth wrapper, error boundary, logging, permission check — komponentni "o'rash" kerak bo'lganda. Render Props — runtime-da render logikasini o'zgartirish kerak bo'lganda, headless komponentlar. Zamonaviy React-da: avval hook, kerak bo'lsa HOC, oxirgi chora render props.`,
      },
    ],
    relatedTopics: [
      { sectionId: `component-patterns`, topicId: `render-props`, label: `Render Props (alternativa)` },
      { sectionId: `component-patterns`, topicId: `custom-hooks`, label: `Custom Hooks (zamonaviy alternativa)` },
      { sectionId: `react-core`, topicId: `react-memo`, label: `React.memo (HOC misoli)` },
    ],
  },

  // ===== CUSTOM HOOKS =====
  {
    id: `custom-hooks`,
    title: `Custom Hooks`,
    importance: 3,
    status: `to-learn`,
    description: `O'z hooklarini yozish, logikani ajratish`,
    content: `Custom Hooks — React-da logikani qayta ishlatishning eng zamonaviy va ENG KO'P ishlatiladigan usuli. "use" bilan boshlanadigan oddiy JavaScript funksiya bo'lib, ichida boshqa hook-lar chaqiriladi.

═══════════════════════════════════════
  NIMA BU
═══════════════════════════════════════

Custom Hook — "use" bilan boshlanadigan oddiy
JavaScript funksiya. Ichida useState, useEffect va
boshqa hook-lar ishlatiladi:

  function useToggle(initial = false) {
    const [value, setValue] = useState(initial)
    const toggle = () => setValue(v => !v)
    return [value, toggle] as const
  }

Bu oddiy funksiya — lekin ichida hook-lar bor,
shuning uchun u "custom hook".

═══════════════════════════════════════
  QOIDALAR
═══════════════════════════════════════

1) Nomi "use" bilan boshlaSIN:
   useToggle, useFetch, useLocalStorage
   React "use" prefiksini ko'rsa, hook qoidalarini
   tekshiradi (eslint-plugin-react-hooks)

2) Ichida boshqa hook-lar chaqirish mumkin:
   useState, useEffect, useRef, boshqa custom hook-lar

3) Top level-da chaqirish:
   // TO'G'RI:
   function Component() {
     const [value, toggle] = useToggle()
   }

   // NOTO'G'RI:
   function Component() {
     if (condition) {
       const [value, toggle] = useToggle() // ← XATO!
     }
   }

═══════════════════════════════════════
  NIMA UCHUN KERAK
═══════════════════════════════════════

1) Logikani qayta ishlatish (DRY):
   useLocalStorage — har qanday komponentda
   localStorage bilan ishlash

2) Komponentni soddalashtirish:
   Murakkab logikani hook-ga chiqarib, komponentni
   faqat UI ga aylantirish

3) Testing osonlashadi:
   Hook-ni alohida test qilish mumkin
   (renderHook utility)

4) Separation of concerns:
   UI logikasi — komponentda
   Business logikasi — hook-da

═══════════════════════════════════════
  POPULAR CUSTOM HOOKS
═══════════════════════════════════════

  useLocalStorage  — localStorage bilan sinxron state
  useDebounce      — qiymatni kechiktirish (search input)
  useFetch         — API so'rov (loading, error, data)
  useMediaQuery    — ekran o'lchamini kuzatish
  useOnClickOutside — tashqi click-ni ushlash (dropdown)
  usePrevious      — oldingi render qiymatini saqlash
  useToggle        — boolean toggle (modal ochish/yopish)
  useInterval      — setInterval hook versiyasi
  useEventListener — event listener hook versiyasi

═══════════════════════════════════════
  TYPESCRIPT BILAN
═══════════════════════════════════════

Return type annotatsiya:
  function useToggle(initial: boolean): [boolean, () => void]

Generics:
  function useLocalStorage<T>(key: string, initial: T): [T, (v: T) => void]

as const:
  return [value, toggle] as const
  // [boolean, () => void] emas, [false, () => void] qaytaradi

═══════════════════════════════════════
  COMPOSITION
═══════════════════════════════════════

Custom hook ichida boshqa custom hook chaqirish:

  function useAuth() {
    const user = useFetch('/api/me')        // boshqa custom hook
    const [token] = useLocalStorage('token') // yana boshqa
    return { user, token, isLoggedIn: !!token }
  }

Hook-lar COMPOSITION orqali murakkab logika yaratadi —
xuddi komponentlar composition orqali murakkab UI yasagandek.`,
    codeExamples: [
      {
        title: `useToggle — oddiy toggle hook`,
        language: `tsx`,
        code: `import { useState, useCallback } from 'react'

// Custom hook
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue)

  const toggle = useCallback(() => setValue(v => !v), [])
  const setTrue = useCallback(() => setValue(true), [])
  const setFalse = useCallback(() => setValue(false), [])

  return { value, toggle, setTrue, setFalse }
}

// Ishlatish — Modal
function ModalExample() {
  const modal = useToggle()

  return (
    <div>
      <button onClick={modal.setTrue}>Modalni ochish</button>

      {modal.value && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <h2>Modal oynasi</h2>
            <p>Bu modal kontent</p>
            <button onClick={modal.setFalse}>Yopish</button>
          </div>
        </div>
      )}
    </div>
  )
}

// Ishlatish — Dark mode toggle
function ThemeToggle() {
  const darkMode = useToggle(false)

  return (
    <div className={darkMode.value ? 'bg-gray-900 text-white' : 'bg-white text-black'}>
      <button onClick={darkMode.toggle}>
        {darkMode.value ? '☀️ Yorug' : '🌙 Qorong\\'u'} rejim
      </button>
    </div>
  )
}`,
        description: `useToggle — eng oddiy custom hook. Boolean state + toggle/setTrue/setFalse funksiyalari. Modal, dropdown, dark mode — har qanday ochish/yopish logikasida qayta ishlatiladi.`,
      },
      {
        title: `useLocalStorage — localStorage bilan sinxron state`,
        language: `tsx`,
        code: `import { useState, useEffect } from 'react'

function useLocalStorage<T>(key: string, initialValue: T) {
  // 1. Lazy initialization — localStorage-dan o'qish
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : initialValue
    } catch {
      return initialValue
    }
  })

  // 2. State o'zgarganda localStorage-ga yozish
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(storedValue))
    } catch (error) {
      console.error('localStorage yozishda xato:', error)
    }
  }, [key, storedValue])

  return [storedValue, setStoredValue] as const
}

// Ishlatish
function Settings() {
  const [theme, setTheme] = useLocalStorage('theme', 'light')
  const [language, setLanguage] = useLocalStorage('language', 'uz')
  const [fontSize, setFontSize] = useLocalStorage('fontSize', 16)

  return (
    <div>
      <h2>Sozlamalar</h2>

      <label>
        Tema:
        <select value={theme} onChange={e => setTheme(e.target.value)}>
          <option value="light">Yorug'</option>
          <option value="dark">Qorong'u</option>
        </select>
      </label>

      <label>
        Til:
        <select value={language} onChange={e => setLanguage(e.target.value)}>
          <option value="uz">O'zbekcha</option>
          <option value="en">Inglizcha</option>
        </select>
      </label>

      <label>
        Shrift hajmi: {fontSize}px
        <input
          type="range"
          min={12}
          max={24}
          value={fontSize}
          onChange={e => setFontSize(Number(e.target.value))}
        />
      </label>

      <p>Sahifani yangilang — sozlamalar saqlanadi!</p>
    </div>
  )
}`,
        description: `useLocalStorage — useState + localStorage sinxronizatsiyasi. Generic tip <T> bilan har qanday qiymatni saqlash mumkin. Sahifa yangilanganda state tiklanadi.`,
      },
      {
        title: `useDebounce — qiymatni kechiktirish`,
        language: `tsx`,
        code: `import { useState, useEffect } from 'react'

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    // Delay vaqtdan keyin yangilash
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Har safar value o'zgarganda oldingi timer-ni tozalash
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}

// Ishlatish — qidiruv input
function SearchPage() {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 500) // 500ms kechiktirish
  const [results, setResults] = useState<string[]>([])

  // API so'rov faqat debouncedQuery o'zgarganda
  useEffect(() => {
    if (!debouncedQuery) {
      setResults([])
      return
    }

    // Fetch simulation
    const fetchResults = async () => {
      const response = await fetch(
        \`/api/search?q=\${encodeURIComponent(debouncedQuery)}\`
      )
      const data = await response.json()
      setResults(data)
    }

    fetchResults()
  }, [debouncedQuery]) // query emas, debouncedQuery!

  return (
    <div>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Qidiruv..."
      />
      <p>Qidirilmoqda: {debouncedQuery || '...'}</p>
      <ul>
        {results.map((r, i) => <li key={i}>{r}</li>)}
      </ul>
    </div>
  )
}`,
        description: `useDebounce — har harf bosilganda API so'rov jo'natish o'rniga, foydalanuvchi yozishni TO'XTATGANDAN keyin (500ms) bitta so'rov jo'natadi. Performance uchun muhim.`,
      },
      {
        title: `useFetch — API fetch hook`,
        language: `tsx`,
        code: `import { useState, useEffect } from 'react'

interface UseFetchResult<T> {
  data: T | null
  loading: boolean
  error: string | null
  refetch: () => void
}

function useFetch<T>(url: string): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [fetchIndex, setFetchIndex] = useState(0)

  const refetch = () => setFetchIndex(i => i + 1)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(\`HTTP \${res.status}\`)
        return res.json()
      })
      .then((json: T) => {
        if (!cancelled) {
          setData(json)
          setLoading(false)
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError(err.message)
          setLoading(false)
        }
      })

    // Cleanup — unmount bo'lsa state yangilamaslik
    return () => { cancelled = true }
  }, [url, fetchIndex])

  return { data, loading, error, refetch }
}

// Ishlatish
interface User {
  id: number
  name: string
  email: string
}

function UserProfile({ userId }: { userId: number }) {
  const { data: user, loading, error, refetch } = useFetch<User>(
    \`https://jsonplaceholder.typicode.com/users/\${userId}\`
  )

  if (loading) return <p>Yuklanmoqda...</p>
  if (error) return (
    <div>
      <p>Xato: {error}</p>
      <button onClick={refetch}>Qayta urinish</button>
    </div>
  )
  if (!user) return null

  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <button onClick={refetch}>Yangilash</button>
    </div>
  )
}`,
        description: `useFetch — loading, error, data, refetch bilan to'liq API hook. cancelled flag race condition-ni oldini oladi. Generic <T> bilan har qanday API javobini tipizatsiya qilish mumkin.`,
      },
    ],
    interviewQA: [
      {
        question: `Custom hook nima va qanday yaratiladi?`,
        answer: `Custom hook — "use" prefiksi bilan boshlanadigan oddiy JavaScript funksiya bo'lib, ichida boshqa React hook-lar (useState, useEffect, useRef va boshqa custom hook-lar) chaqiriladi. Yaratish uchun: 1) Funksiya nomi "use" bilan boshlansIN — useToggle, useFetch. 2) Ichida hook-lar chaqiring. 3) Kerakli qiymat va funksiyalarni return qiling. Custom hook logikani komponentdan AJRATADI — komponent faqat UI bilan shug'ullanadi, business logika hook-da.`,
      },
      {
        question: `Nima uchun "use" prefiksi kerak?`,
        answer: `"use" prefiksi ikki sabab uchun kerak: 1) React va ESLint uchun signal — eslint-plugin-react-hooks "use" bilan boshlangan funksiyani hook deb biladi va Rules of Hooks-ni tekshiradi (shart ichida chaqirmaslik, loop ichida chaqirmaslik). "use" siz bu tekshiruvlar ishlamaydi. 2) Dasturchilar uchun signal — kod o'qiyotgan kishi "use" ko'rsa, bu funksiya ichida hook-lar borligini va uni faqat komponent yoki boshqa hook ichida chaqirish kerakligini biladi.`,
      },
      {
        question: `Custom hook vs utility function farqi nima?`,
        answer: `Custom hook ichida React hook-lar (useState, useEffect, useRef) chaqiriladi — shuning uchun u React lifecycle-ga BOG'LIQ va faqat komponent yoki boshqa hook ichida chaqirilishi mumkin. Utility function — oddiy funksiya, hook chaqirmaydi, istalgan joyda chaqirish mumkin. Masalan: formatDate() — utility, useDebounce() — custom hook. Agar funksiya ichida hech qanday React hook bo'lmasa, "use" prefiks qo'yish SHART EMAS va u utility function bo'ladi.`,
      },
      {
        question: `Custom hook-larni qanday test qilish mumkin?`,
        answer: `Custom hook-lar @testing-library/react dan renderHook utility bilan test qilinadi. renderHook(() => useToggle()) — hook-ni alohida render qiladi. result.current — hozirgi hook qiymati. act(() => { result.current.toggle() }) — hook funksiyalarini chaqirish. Hook-larni test qilish komponentni test qilishdan OSONROQ — UI yo'q, faqat logika. Shuning uchun logikani hook-ga chiqarish testing uchun ham foydali. Integration test uchun hook-ni ishlatadigan oddiy komponent yozish ham mumkin.`,
      },
    ],
    relatedTopics: [
      { sectionId: `theory-questions`, topicId: `rules-of-hooks`, label: `Rules of Hooks` },
      { sectionId: `typescript-react`, topicId: `hooks-typing`, label: `Hook tipizatsiyasi` },
      { sectionId: `component-patterns`, topicId: `render-props`, label: `Render Props (eski usul)` },
    ],
  },

  // ===== CONTROLLED VS UNCONTROLLED =====
  {
    id: `controlled-vs-uncontrolled`,
    title: `Controlled vs Uncontrolled`,
    importance: 3,
    status: `to-learn`,
    description: `Input/form boshqaruvi farqi`,
    content: `React-da form elementlarini boshqarishning ikki usuli bor: Controlled (React boshqaradi) va Uncontrolled (DOM boshqaradi). Bu React-dagi eng muhim tushunchalardan biri.

═══════════════════════════════════════
  CONTROLLED
═══════════════════════════════════════

React state boshqaradi. Har bir o'zgarish React orqali:

  const [name, setName] = useState('')
  <input value={name} onChange={e => setName(e.target.value)} />

Qanday ishlaydi:
  1. Foydalanuvchi harf yozadi
  2. onChange chaqiriladi
  3. setName yangi qiymatni saqlaydi
  4. React qayta renderlaydi
  5. input yangi value ko'rsatadi

React — "single source of truth".
Input qiymati DOIM state-ga teng.

Afzalliklari:
  ✅ Real-time validation
  ✅ Conditional disable (submit tugmasini boshqarish)
  ✅ Format input (telefon raqam, karta raqam)
  ✅ Bir nechta input-ni bir joydan boshqarish

═══════════════════════════════════════
  UNCONTROLLED
═══════════════════════════════════════

DOM o'zi boshqaradi. React aralashmaydi:

  const inputRef = useRef<HTMLInputElement>(null)
  <input defaultValue="" ref={inputRef} />

  // Qiymatni olish:
  const value = inputRef.current?.value

Qanday ishlaydi:
  1. Foydalanuvchi harf yozadi
  2. DOM o'zi yangilaydi (React bilmaydi!)
  3. Kerak bo'lganda ref orqali qiymat olinadi

Afzalliklari:
  ✅ Oddiyroq kod (state va onChange shart emas)
  ✅ Kamroq re-render (har harf uchun render yo'q)
  ✅ 3rd party kutubxonalar bilan integratsiya oson

═══════════════════════════════════════
  FARQLARI JADVAL
═══════════════════════════════════════

  Controlled:
    - React boshqaradi (value + onChange)
    - Har o'zgarishda re-render
    - Real-time validation mumkin
    - Format input mumkin
    - Ko'proq kod

  Uncontrolled:
    - DOM boshqaradi (defaultValue + ref)
    - Re-render yo'q
    - Submit-da validation
    - Format qiyin
    - Kamroq kod

═══════════════════════════════════════
  QACHON NIMA
═══════════════════════════════════════

Controlled ishlatish kerak (KO'P HOLLARDA):
  ✅ Form validation (real-time xato ko'rsatish)
  ✅ Dynamic form (bir input boshqasiga bog'liq)
  ✅ Format input (telefon: +998 XX XXX-XX-XX)
  ✅ Submit tugmasini enable/disable

Uncontrolled ishlatish kerak:
  ✅ Oddiy form (login, ro'yxatdan o'tish)
  ✅ File input (FAQAT uncontrolled!)
  ✅ 3rd party DOM kutubxonalari
  ✅ Performance-critical (juda ko'p inputlar)

═══════════════════════════════════════
  FILE INPUT
═══════════════════════════════════════

File input DOIM uncontrolled — React value bera olmaydi:

  // NOTO'G'RI — ishlamaydi:
  <input type="file" value={file} />

  // TO'G'RI — faqat ref yoki onChange:
  <input type="file" onChange={e => setFile(e.target.files?.[0])} />
  <input type="file" ref={fileRef} />

Nima uchun? Browser security — JavaScript faylni
to'g'ridan-to'g'ri input-ga set qila olmaydi.

═══════════════════════════════════════
  REACT HOOK FORM
═══════════════════════════════════════

React Hook Form — uncontrolled approach ishlatadi:
  register + ref bilan input-larni kuzatadi

Performance yaxshi — har harf uchun re-render yo'q.
Ko'p inputli formlar uchun juda samarali.

Lekin React rasmiy jamoasi CONTROLLED tavsiya qiladi —
chunki u React falsafasiga mos keladi
(React — single source of truth).`,
    codeExamples: [
      {
        title: `Controlled form — login form (validation bilan)`,
        language: `tsx`,
        code: `import { useState, type FormEvent } from 'react'

interface FormErrors {
  email?: string
  password?: string
}

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitted, setSubmitted] = useState(false)

  // Real-time validation
  function validate(): FormErrors {
    const newErrors: FormErrors = {}

    if (!email) {
      newErrors.email = 'Email kiritish shart'
    } else if (!/\\S+@\\S+\\.\\S+/.test(email)) {
      newErrors.email = 'Email formati noto\\'g\\'ri'
    }

    if (!password) {
      newErrors.password = 'Parol kiritish shart'
    } else if (password.length < 6) {
      newErrors.password = 'Parol kamida 6 ta belgi'
    }

    return newErrors
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const newErrors = validate()
    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      setSubmitted(true)
      console.log('Yuborildi:', { email, password })
    }
  }

  // Submit tugmasi faqat ikkala maydon to'ldirilganda aktiv
  const isFormValid = email.length > 0 && password.length >= 6

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
      <h2>Tizimga kirish</h2>

      <div className="mb-4">
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="email"
          value={email}                           // React boshqaradi
          onChange={e => setEmail(e.target.value)} // Har o'zgarishda
          className={errors.email ? 'border-red-500' : 'border-gray-300'}
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
      </div>

      <div className="mb-4">
        <label htmlFor="password">Parol:</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className={errors.password ? 'border-red-500' : 'border-gray-300'}
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
      </div>

      <button
        type="submit"
        disabled={!isFormValid}   // Dynamic disable — controlled afzalligi
        className={isFormValid ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-500'}
      >
        Kirish
      </button>

      {submitted && <p className="text-green-500 mt-2">Muvaffaqiyatli!</p>}
    </form>
  )
}`,
        description: `Controlled form — React barcha input qiymatlarini boshqaradi. Real-time validation, dynamic disable, xato ko'rsatish — barchasi controlled approach afzalliklari.`,
      },
      {
        title: `Uncontrolled form — useRef bilan`,
        language: `tsx`,
        code: `import { useRef, type FormEvent } from 'react'

function UncontrolledForm() {
  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const messageRef = useRef<HTMLTextAreaElement>(null)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()

    // Qiymatlarni ref orqali olish — faqat submit-da
    const data = {
      name: nameRef.current?.value ?? '',
      email: emailRef.current?.value ?? '',
      message: messageRef.current?.value ?? '',
    }

    console.log('Forma ma\\'lumotlari:', data)

    // Formani tozalash
    if (nameRef.current) nameRef.current.value = ''
    if (emailRef.current) emailRef.current.value = ''
    if (messageRef.current) messageRef.current.value = ''
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
      <h2>Aloqa formasi (Uncontrolled)</h2>

      <div className="mb-4">
        <label htmlFor="name">Ism:</label>
        <input
          id="name"
          ref={nameRef}
          defaultValue=""     // value EMAS, defaultValue!
        />
      </div>

      <div className="mb-4">
        <label htmlFor="uc-email">Email:</label>
        <input
          id="uc-email"
          type="email"
          ref={emailRef}
          defaultValue=""
        />
      </div>

      <div className="mb-4">
        <label htmlFor="message">Xabar:</label>
        <textarea
          id="message"
          ref={messageRef}
          defaultValue=""
          rows={4}
        />
      </div>

      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Yuborish
      </button>

      {/* Bu formada re-render BO'LMAYDI — har harf uchun render yo'q */}
    </form>
  )
}`,
        description: `Uncontrolled form — DOM o'zi input qiymatlarini boshqaradi. React aralashmaydi — re-render yo'q. Qiymat faqat submit-da ref orqali olinadi. Oddiy formalar uchun mos.`,
      },
      {
        title: `Mixed — controlled inputs + uncontrolled file upload`,
        language: `tsx`,
        code: `import { useState, type FormEvent, type ChangeEvent } from 'react'

function ProfileForm() {
  // Controlled — text input-lar
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')

  // File — doim uncontrolled (browser security)
  const [avatar, setAvatar] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null
    setAvatar(file)

    // Preview yaratish
    if (file) {
      const reader = new FileReader()
      reader.onload = () => setPreview(reader.result as string)
      reader.readAsDataURL(file)
    } else {
      setPreview(null)
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()

    const formData = new FormData()
    formData.append('name', name)
    formData.append('bio', bio)
    if (avatar) formData.append('avatar', avatar)

    console.log('Yuborilmoqda:', { name, bio, avatar: avatar?.name })
    // fetch('/api/profile', { method: 'POST', body: formData })
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
      <h2>Profil tahrirlash</h2>

      {/* Controlled — real-time ko'rish */}
      <div className="mb-4">
        <label>Ism:</label>
        <input value={name} onChange={e => setName(e.target.value)} />
        {name && <p>Salom, {name}!</p>}
      </div>

      <div className="mb-4">
        <label>Bio:</label>
        <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} />
        <p className="text-sm text-gray-500">{bio.length}/200 belgi</p>
      </div>

      {/* Uncontrolled — file input */}
      <div className="mb-4">
        <label>Avatar:</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          // value={...} BERA OLMAYSIZ — browser security!
        />
        {preview && (
          <img src={preview} alt="Preview" className="w-20 h-20 rounded-full mt-2" />
        )}
      </div>

      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Saqlash
      </button>
    </form>
  )
}`,
        description: `Amaliy misol — text input-lar controlled (real-time preview), file input uncontrolled (browser cheklovi). Ko'p real ilovalarda aynan shunday mix ishlatiladi.`,
      },
    ],
    interviewQA: [
      {
        question: `Controlled va uncontrolled component farqi nima?`,
        answer: `Controlled component — React state boshqaradi: value={state} + onChange={setState}. Har bir o'zgarish React orqali — React "single source of truth". Re-render har o'zgarishda. Uncontrolled component — DOM o'zi boshqaradi: defaultValue + ref. React aralashmaydi — qiymat faqat kerak bo'lganda ref.current.value orqali olinadi. Re-render yo'q. Controlled ko'proq nazorat beradi (validation, format), uncontrolled oddiyroq va tezroq.`,
      },
      {
        question: `Qachon controlled, qachon uncontrolled ishlatiladi?`,
        answer: `Controlled — KO'P HOLLARDA: real-time validation kerak bo'lganda, input formatini o'zgartirish kerak bo'lganda (telefon, karta raqam), submit tugmasini dynamic enable/disable qilish kerak bo'lganda, bir input boshqasiga bog'liq bo'lganda. Uncontrolled — oddiy formalar, file input (DOIM uncontrolled), 3rd party DOM kutubxonalari bilan integratsiya, va juda ko'p inputli formalar (performance). React rasmiy jamoasi CONTROLLED tavsiya qiladi.`,
      },
      {
        question: `File input nima uchun doim uncontrolled?`,
        answer: `Browser security sababli JavaScript file input-ning value-sini set qila OLMAYDI. <input type="file" value={file} /> ISHLAMAYDI. Bu browser cheklovi — aks holda JavaScript foydalanuvchi kompyuteridan ixtiyoriy faylni o'qiy olardi. Shuning uchun file input faqat onChange event orqali (e.target.files) yoki ref orqali boshqariladi. Bu barcha framework-larda bir xil — Vue, Angular, React — hammasi file input-ni uncontrolled sifatida ishlatadi.`,
      },
      {
        question: `React Hook Form qaysi approach ishlatadi?`,
        answer: `React Hook Form UNCONTROLLED approach ishlatadi — register funksiyasi input-ga ref beradi va DOM-da to'g'ridan-to'g'ri kuzatadi. Bu sabab bilan u juda tez — har harf uchun re-render BO'LMAYDI. Ko'p inputli murakkab formalar uchun ideal. Lekin zarur bo'lganda controlled rejimga o'tish mumkin (Controller component orqali). React rasmiy jamoasi controlled tavsiya qilsa ham, real loyihalarda React Hook Form ko'p ishlatiladi — chunki performance va DX (developer experience) yaxshi.`,
      },
    ],
    relatedTopics: [
      { sectionId: `react-core`, topicId: `use-state`, label: `useState (controlled)` },
      { sectionId: `react-core`, topicId: `use-ref`, label: `useRef (uncontrolled)` },
      { sectionId: `react-core`, topicId: `event-system`, label: `Event System` },
      { sectionId: `theory-questions`, topicId: `controlled-uncontrolled-theory`, label: `Nazariy savol` },
    ],
  },

  // ===== ERROR BOUNDARIES =====
  {
    id: `error-boundaries`,
    title: `Error Boundaries`,
    importance: 3,
    status: `to-learn`,
    description: `componentDidCatch, class component kerak`,
    content: `Error Boundary — komponent daraxtida xato bo'lganda butun ilovani CRASH qilish o'rniga, xatoni USHLASH va fallback UI ko'rsatish. Bu React-dagi "try/catch" — lekin komponentlar uchun.

═══════════════════════════════════════
  NIMA BU
═══════════════════════════════════════

Komponent daraxtida xato bo'lganda React butun
ilovani olib tashlaydi — oq ekran ko'rsatadi.
Error Boundary bu xatoni USHLAYDI va fallback UI
(xato xabari, retry tugmasi) ko'rsatadi.

  Xatosiz:
  <App>
    <Header />
    <Content />    ← xato bo'lsa butun App crash
    <Footer />
  </App>

  Error Boundary bilan:
  <App>
    <Header />
    <ErrorBoundary fallback={<p>Xato!</p>}>
      <Content />  ← xato bo'lsa faqat Content o'rnida fallback
    </ErrorBoundary>
    <Footer />     ← ishlayveradi
  </App>

═══════════════════════════════════════
  CLASS COMPONENT KERAK
═══════════════════════════════════════

Error boundary faqat CLASS component bilan ishlaydi.
Ikki lifecycle method kerak:

1. static getDerivedStateFromError(error):
   - Xato bo'lganda state yangilash
   - Fallback UI render qilish uchun
   - Render fazasida chaqiriladi

2. componentDidCatch(error, errorInfo):
   - Xatoni LOG qilish (Sentry, LogRocket)
   - Side effect-lar uchun (commit fazasida)

Hook analog hozircha YO'Q — React jamoasi
kelajakda qo'shishi mumkin, lekin hozir
faqat class component bilan ishlaydi.

═══════════════════════════════════════
  NIMA USHLAYDI
═══════════════════════════════════════

  ✅ Render vaqtidagi xatolar (return <... /> da)
  ✅ Lifecycle method xatolari
  ✅ Constructor xatolari
  ✅ Child komponentlar xatolari (butun daraxt)

═══════════════════════════════════════
  NIMA USHLAMAYDI
═══════════════════════════════════════

  ❌ Event handler xatolari (try/catch kerak)
  ❌ Async kod (setTimeout, Promise, async/await)
  ❌ Server-side rendering (SSR)
  ❌ Error boundary O'ZINING xatosi (faqat child-lar)

Event handler uchun:
  function handleClick() {
    try {
      riskyOperation()
    } catch (error) {
      setError(error.message)
    }
  }

═══════════════════════════════════════
  PATTERN
═══════════════════════════════════════

ErrorBoundary wrapper qilib, har bir sahifa yoki
bo'lim uchun alohida qo'yish — granular error handling:

  <App>
    <ErrorBoundary fallback={<HeaderError />}>
      <Header />
    </ErrorBoundary>

    <ErrorBoundary fallback={<ContentError />}>
      <Content />       ← shu crash bo'lsa
    </ErrorBoundary>    ← faqat shu o'rnida xato

    <ErrorBoundary fallback={<SidebarError />}>
      <Sidebar />       ← bu ishlayveradi
    </ErrorBoundary>
  </App>

═══════════════════════════════════════
  react-error-boundary KUTUBXONASI
═══════════════════════════════════════

Functional component bilan Error Boundary:

  import { ErrorBoundary } from 'react-error-boundary'

  <ErrorBoundary
    FallbackComponent={ErrorFallback}
    onReset={() => setRetryCount(c => c + 1)}
    resetKeys={[retryCount]}
  >
    <MyComponent />
  </ErrorBoundary>

useErrorBoundary hook ham bor — event handler va
async xatolarni ham ushlash mumkin.`,
    codeExamples: [
      {
        title: `ErrorBoundary class component — fallback UI + retry`,
        language: `tsx`,
        code: `import { Component, type ErrorInfo, type ReactNode } from 'react'

// Error Boundary state tipi
interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

// Props tipi
interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  // 1. Xato bo'lganda state yangilash — fallback render uchun
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  // 2. Xatoni log qilish (Sentry, LogRocket va h.k.)
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary xatoni ushladi:', error)
    console.error('Component stack:', errorInfo.componentStack)
    // Sentry.captureException(error, { extra: errorInfo })
  }

  // Retry — state-ni tozalash
  handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback berilgan bo'lsa
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default fallback
      return (
        <div className="p-8 text-center bg-red-50 rounded-lg">
          <h2 className="text-red-600 text-xl font-bold">Xatolik yuz berdi!</h2>
          <p className="text-red-500 mt-2">
            {this.state.error?.message || 'Noma\\'lum xato'}
          </p>
          <button
            onClick={this.handleRetry}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Qayta urinish
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

// Xato chiqaradigan komponent (test uchun)
function BuggyComponent() {
  const [shouldError, setShouldError] = useState(false)

  if (shouldError) {
    throw new Error('Bu test xatosi!')
  }

  return (
    <button onClick={() => setShouldError(true)}>
      Xato chiqarish
    </button>
  )
}

// useState importi kerak
import { useState } from 'react'

// Ishlatish
function App() {
  return (
    <div>
      <h1>Mening ilovam</h1>

      <ErrorBoundary>
        <BuggyComponent />
        {/* Xato bo'lganda faqat shu qism fallback ko'rsatadi */}
      </ErrorBoundary>

      <p>Bu qism ishlayveradi!</p>
    </div>
  )
}`,
        description: `ErrorBoundary — class component. getDerivedStateFromError fallback UI uchun, componentDidCatch xatoni log qilish uchun. retry tugmasi state-ni tozalab, child-larni qayta renderlaydi.`,
      },
      {
        title: `Sahifalarni ErrorBoundary bilan o'rash`,
        language: `tsx`,
        code: `import { Component, type ReactNode, type ErrorInfo } from 'react'

// Qayta foydalanish mumkin bo'lgan ErrorBoundary
interface Props {
  children: ReactNode
  name: string // Qaysi bo'lim — debugging uchun
}

interface State {
  hasError: boolean
}

class SectionErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(\`[\${this.props.name}] xato:\`, error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 border border-red-300 bg-red-50 rounded">
          <p className="text-red-600">
            "{this.props.name}" bo'limida xato yuz berdi.
          </p>
          <button
            className="text-blue-500 underline mt-2"
            onClick={() => this.setState({ hasError: false })}
          >
            Qayta yuklash
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

// Sahifa tuzilishi — har bir bo'lim alohida ErrorBoundary
function DashboardPage() {
  return (
    <div className="grid grid-cols-3 gap-4">
      <SectionErrorBoundary name="Statistika">
        <StatsWidget />
        {/* Bu crash bo'lsa — faqat statistika qismi xato ko'rsatadi */}
      </SectionErrorBoundary>

      <SectionErrorBoundary name="Grafik">
        <ChartWidget />
        {/* Bu crash bo'lsa — faqat grafik qismi xato ko'rsatadi */}
      </SectionErrorBoundary>

      <SectionErrorBoundary name="Yangiliklar">
        <NewsWidget />
        {/* Bu crash bo'lsa — faqat yangiliklar qismi xato ko'rsatadi */}
      </SectionErrorBoundary>
    </div>
  )
}

// Oddiy widget-lar
function StatsWidget() {
  return <div className="p-4 bg-white rounded shadow">Statistika: 1,234 foydalanuvchi</div>
}

function ChartWidget() {
  return <div className="p-4 bg-white rounded shadow">Grafik shu yerda</div>
}

function NewsWidget() {
  return <div className="p-4 bg-white rounded shadow">So'nggi yangiliklar</div>
}`,
        description: `Granular error handling — har bir bo'lim alohida ErrorBoundary bilan o'ralgan. Bir bo'lim crash bo'lsa, boshqalari ishlayveradi. Real ilovalarda har bir sahifa va widget uchun alohida boundary qo'yish kerak.`,
      },
    ],
    interviewQA: [
      {
        question: `Error boundary nima va nima uchun kerak?`,
        answer: `Error boundary — React komponent daraxtidagi xatolarni ushlash mexanizmi. Xatosiz React xato bo'lganda BUTUN ilovani olib tashlaydi (oq ekran). Error boundary xatoni ushlaydi va fallback UI ko'rsatadi (xato xabari, retry tugmasi), boshqa qismlar ishlayveradi. Bu JavaScript-dagi try/catch-ga o'xshaydi, lekin komponentlar uchun. Har bir muhim bo'lim alohida ErrorBoundary bilan o'ralishi kerak — granular error handling.`,
      },
      {
        question: `Nima uchun Error Boundary faqat class component?`,
        answer: `Error boundary ikkita lifecycle method-ga tayanadi: static getDerivedStateFromError() va componentDidCatch(). Bu method-lar FAQAT class component-larda mavjud — hook analog hozircha YO'Q. React jamoasi kelajakda hook versiyasini qo'shishi mumkin, lekin hozirgi architectural sabablar bilan bu murakkab. Amalda bu muammo emas — bitta ErrorBoundary class yozib, butun loyihada qayta ishlatiladi. Yoki react-error-boundary kutubxonasini ishlatish mumkin.`,
      },
      {
        question: `Error Boundary nima ushlaydi, nima ushlamaydi?`,
        answer: `USHLAYDI: render vaqtidagi xatolar (JSX return qilishda), lifecycle method xatolari, constructor xatolari, butun child daraxt xatolari. USHLAMAYDI: 1) Event handler xatolari — chunki ular render vaqtida emas, foydalanuvchi amalida chaqiriladi (try/catch kerak). 2) Async kod — setTimeout, Promise, async/await. 3) SSR. 4) Error boundary O'ZINING xatosi. Event handler uchun useState bilan xato state saqlash yoki react-error-boundary dan useErrorBoundary ishlatish mumkin.`,
      },
      {
        question: `Event handler xatolarini qanday ushlash mumkin?`,
        answer: `Event handler xatolari Error Boundary orqali USHLALMAYDI. Uchta usul bor: 1) Oddiy try/catch: try { riskyOperation() } catch(e) { setError(e.message) } — eng oddiy va keng tarqalgan. 2) react-error-boundary kutubxonasidan useErrorBoundary hook: const { showBoundary } = useErrorBoundary(); catch ichida showBoundary(error) chaqirsangiz, eng yaqin ErrorBoundary fallback ko'rsatadi. 3) Global error handler: window.addEventListener('error', handler) — lekin bu faqat log uchun, UI boshqarish qiyin.`,
      },
    ],
    relatedTopics: [
      { sectionId: `component-patterns`, topicId: `suspense-lazy`, label: `Suspense (fallback)` },
      { sectionId: `architecture`, topicId: `error-handling`, label: `Error Handling strategiyasi` },
    ],
  },

  // ===== SUSPENSE + REACT.LAZY =====
  {
    id: `suspense-lazy`,
    title: `Suspense + React.lazy`,
    importance: 3,
    status: `to-learn`,
    description: `Code splitting, lazy loading`,
    content: `React.lazy va Suspense — ilovani bo'laklarga bo'lish (code splitting) va lazy loading qilish uchun. Foydalanuvchi boshida BUTUN ilovani yuklamaydi — faqat kerakli qismni yuklaydi.

═══════════════════════════════════════
  React.lazy
═══════════════════════════════════════

Dynamic import — komponent faqat KERAK BO'LGANDA
yuklanadi. Bundle-ni bo'lish (code splitting):

  // Oddiy import — bundlega kiradi:
  import Dashboard from './Dashboard'

  // Lazy import — alohida chunk:
  const Dashboard = React.lazy(() => import('./Dashboard'))

Dashboard faqat render qilinganDA yuklanadi.
Bundler (Vite/Webpack) uni alohida .js faylga chiqaradi.

═══════════════════════════════════════
  Suspense
═══════════════════════════════════════

Lazy component yuklanayotganda fallback UI ko'rsatish:

  <Suspense fallback={<Loading />}>
    <Dashboard />     ← yuklanayotganda Loading ko'rinadi
  </Suspense>

fallback — istalgan React element:
  - <p>Yuklanmoqda...</p>
  - <Spinner />
  - <Skeleton /> (placeholder UI)

═══════════════════════════════════════
  NIMA UCHUN KERAK
═══════════════════════════════════════

Bundle hajmini kamaytirish:

  Kod splitting YO'Q:
    app.js — 500KB (BUTUN ilova)
    Foydalanuvchi 500KB yuklab kutadi

  Kod splitting BILAN:
    app.js — 100KB (asosiy qism)
    dashboard.js — 150KB (faqat kerak bo'lganda)
    settings.js — 50KB (faqat kerak bo'lganda)
    Foydalanuvchi 100KB yuklab boshlaydi

  Birinchi yuklash tezroq!

═══════════════════════════════════════
  ROUTE BASED SPLITTING
═══════════════════════════════════════

Har bir sahifani lazy import — eng keng tarqalgan pattern:

  const Home = lazy(() => import('./pages/Home'))
  const Dashboard = lazy(() => import('./pages/Dashboard'))
  const Settings = lazy(() => import('./pages/Settings'))

Bu eng samarali chunki:
  - Foydalanuvchi har doim bitta sahifada
  - Boshqa sahifalar kerak emas
  - Sahifalar odatda katta komponentlar

═══════════════════════════════════════
  DATA FETCHING BILAN
═══════════════════════════════════════

React 19 — Suspense data fetching bilan ham ishlaydi.
use() hook + Promise:

  function UserProfile({ userId }) {
    const user = use(fetchUser(userId))  // Promise!
    return <p>{user.name}</p>
  }

  <Suspense fallback={<Loading />}>
    <UserProfile userId={1} />
  </Suspense>

use() hook Promise resolve bo'lguncha Suspense
fallback ko'rsatadi. Bu YANGI React 19 xususiyati.

═══════════════════════════════════════
  NAMED EXPORTS
═══════════════════════════════════════

React.lazy faqat DEFAULT EXPORT bilan ishlaydi:

  // TO'G'RI — default export:
  const Dashboard = lazy(() => import('./Dashboard'))

  // Named export uchun wrapper kerak:
  const Dashboard = lazy(() =>
    import('./Dashboard').then(module => ({
      default: module.Dashboard
    }))
  )

Shuning uchun lazy qilinadigan komponentlarni
default export qilish tavsiya etiladi.`,
    codeExamples: [
      {
        title: `Route-based code splitting — React.lazy + Suspense`,
        language: `tsx`,
        code: `import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'

// Lazy import — har biri alohida chunk bo'ladi
const Home = lazy(() => import('./pages/Home'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Settings = lazy(() => import('./pages/Settings'))
const Profile = lazy(() => import('./pages/Profile'))

// Loading component
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="mt-4 text-gray-500">Sahifa yuklanmoqda...</p>
      </div>
    </div>
  )
}

// Navigation
function Nav() {
  return (
    <nav className="bg-gray-800 text-white p-4 flex gap-4">
      <Link to="/">Asosiy</Link>
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/settings">Sozlamalar</Link>
      <Link to="/profile">Profil</Link>
    </nav>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Nav />

      {/* Suspense BARCHA lazy komponentlarni o'raydi */}
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

// pages/Home.tsx — DOIM default export!
// export default function Home() {
//   return <h1>Asosiy sahifa</h1>
// }`,
        description: `Route-based code splitting — eng keng tarqalgan pattern. Har bir sahifa alohida chunk. Foydalanuvchi /dashboard ga o'tganda Dashboard chunk yuklana boshlaydi, shu vaqt PageLoader ko'rinadi.`,
      },
      {
        title: `Component-level lazy — og'ir komponentni lazy yuklash`,
        language: `tsx`,
        code: `import { lazy, Suspense, useState } from 'react'

// Og'ir komponent — faqat kerak bo'lganda yuklanadi
// (masalan: chart kutubxonasi, rich text editor, 3D viewer)
const HeavyChart = lazy(() => import('./components/HeavyChart'))
const RichTextEditor = lazy(() => import('./components/RichTextEditor'))

// Skeleton loader
function ChartSkeleton() {
  return (
    <div className="animate-pulse bg-gray-200 rounded-lg h-64 flex items-center justify-center">
      <p className="text-gray-400">Grafik yuklanmoqda...</p>
    </div>
  )
}

function EditorSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-200 h-10 rounded mb-2" />
      <div className="bg-gray-200 h-40 rounded" />
    </div>
  )
}

function Dashboard() {
  const [showChart, setShowChart] = useState(false)
  const [showEditor, setShowEditor] = useState(false)

  return (
    <div className="p-6">
      <h1>Boshqaruv paneli</h1>

      {/* Grafik — tugma bosilganda yuklanadi */}
      <button
        onClick={() => setShowChart(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
      >
        Grafikni ko'rsatish
      </button>

      {showChart && (
        <Suspense fallback={<ChartSkeleton />}>
          <HeavyChart data={[10, 20, 30, 40, 50]} />
        </Suspense>
      )}

      {/* Editor — tugma bosilganda yuklanadi */}
      <button
        onClick={() => setShowEditor(true)}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Muharrirni ochish
      </button>

      {showEditor && (
        <Suspense fallback={<EditorSkeleton />}>
          <RichTextEditor />
        </Suspense>
      )}
    </div>
  )
}`,
        description: `Component-level lazy loading — og'ir komponentlar (chart, editor, 3D) faqat tugma bosilganda yuklanadi. Skeleton loader professional ko'rinish beradi. Bu initial bundle hajmini sezilarli kamaytiradi.`,
      },
    ],
    interviewQA: [
      {
        question: `React.lazy va Suspense nima?`,
        answer: `React.lazy — dynamic import orqali komponentni faqat KERAK BO'LGANDA yuklash. const Page = lazy(() => import('./Page')). Bundler (Vite/Webpack) bu komponentni alohida chunk (.js fayl) sifatida chiqaradi. Suspense — lazy component yuklanayotganda fallback UI (spinner, skeleton) ko'rsatadi: <Suspense fallback={<Loading />}><Page /></Suspense>. Birgalikda ular code splitting amalga oshiradi — ilova bir katta fayl emas, bir nechta kichik bo'laklar bo'ladi.`,
      },
      {
        question: `Code splitting nima uchun kerak?`,
        answer: `Code splitting — ilovani kichik bo'laklarga (chunk) bo'lish. Sabablar: 1) Birinchi yuklash tezligi — 500KB bitta fayl o'rniga 100KB asosiy + kerakli chunk-lar. 2) Foydalanuvchi ishlatmaydigan kodni yuklamaslik — Settings sahifasiga hech kirmasa, u yuklanmaydi. 3) Caching — bitta chunk o'zgarsa, boshqalari cache-dan keladi. Eng samarali usul — route-based splitting: har bir sahifa alohida chunk. Component-level splitting ham mumkin — og'ir komponentlar (chart, editor) uchun.`,
      },
      {
        question: `Suspense data fetching bilan ishlaydi mi?`,
        answer: `Ha! React 19 da use() hook bilan Suspense data fetching uchun ishlaydi. use() hook Promise qabul qiladi — resolve bo'lguncha Suspense fallback ko'rsatadi: const user = use(fetchUser(id)). Bu "render-as-you-fetch" pattern — komponent render bo'lishga URINADI, ma'lumot tayyor bo'lmasa Suspense ushlaydi. Oldingi versiyalarda bu faqat React Server Components va kutubxonalar (Relay, SWR) orqali mumkin edi. React 19 buni rasmiy API qildi.`,
      },
    ],
    relatedTopics: [
      { sectionId: `performance`, topicId: `code-splitting`, label: `Code Splitting` },
      { sectionId: `routing`, topicId: `lazy-routes`, label: `Lazy Routes` },
      { sectionId: `component-patterns`, topicId: `error-boundaries`, label: `Error Boundaries` },
      { sectionId: `theory-questions`, topicId: `server-components`, label: `Server Components` },
    ],
  },

  // ===== PORTAL =====
  {
    id: `portal`,
    title: `Portal`,
    importance: 2,
    status: `to-learn`,
    description: `createPortal — modal, tooltip, dropdown`,
    content: `Portal — createPortal orqali komponentni DOM tree-da BOSHQA JOYGA render qilish. React tree-da parent-da qoladi, lekin DOM-da boshqa joyda ko'rinadi.

═══════════════════════════════════════
  NIMA BU
═══════════════════════════════════════

createPortal — komponentni DOM tree-da BOSHQA JOYGA
render qilish:

  React tree:
  <App>
    <Card>
      <Modal />    ← React-da Card ichida
    </Card>
  </App>

  DOM tree (portal bilan):
  <div id="root">
    <div class="card">
      ...            ← Modal shu yerda YO'Q
    </div>
  </div>
  <div id="modal-root">
    <div class="modal">...</div>  ← Modal SHU YERDA
  </div>

Modal React-da Card ichida, lekin DOM-da body-da.

═══════════════════════════════════════
  NIMA UCHUN KERAK
═══════════════════════════════════════

Modal, tooltip, dropdown — parent-ning CSS-dan
chiqishi kerak:

1. overflow: hidden — parent-da overflow hidden bo'lsa,
   child undan chiqib ko'rinmaydi. Portal hal qiladi.

2. z-index — parent-da z-index cheklansa, child
   tepalik ola olmaydi. Portal body-ga render qilib,
   z-index muammosini hal qiladi.

3. Stacking context — CSS stacking context muammolari.
   Portal DOM-ning eng yuqori darajasida render qilib,
   barcha muammolarni bartaraf qiladi.

═══════════════════════════════════════
  EVENT BUBBLING
═══════════════════════════════════════

MUHIM FARQ: Portal ichidagi event React tree bo'yicha
YUQORIGA ko'tariladi — DOM tree bo'yicha EMAS!

  <Card onClick={() => console.log('Card bosildi!')}>
    <Modal />  {/* Portal orqali body-ga render */}
  </Card>

  Modal ichida button bosilsa → Card onClick HAM ishlaydi!
  Chunki React event bubbling React tree bo'yicha ishlaydi.

  DOM-da Modal body-da, Card-da emas.
  Lekin React uchun Modal Card ichida.
  Shuning uchun event Card-ga ko'tariladi.

  Bu xususiyat ba'zan foydali, ba'zan kutilmagan.
  Ehtiyot bo'lish kerak!

═══════════════════════════════════════
  SINTAKSIS
═══════════════════════════════════════

  import { createPortal } from 'react-dom'

  createPortal(children, domNode)

  - children — render qilinadigan React element
  - domNode — DOM-dagi manzil (document.getElementById)

  index.html-da:
  <body>
    <div id="root"></div>
    <div id="portal-root"></div>   ← portal manzili
  </body>`,
    codeExamples: [
      {
        title: `Modal — createPortal bilan body-ga render`,
        language: `tsx`,
        code: `import { useState, useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

// Modal component — Portal orqali body-ga render
interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  title?: string
}

function Modal({ isOpen, onClose, children, title }: ModalProps) {
  // ESC tugmasi bilan yopish
  useEffect(() => {
    if (!isOpen) return

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleEsc)
    // Body scroll-ni bloklash
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  // createPortal — DOM-da document.body-ga render
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      {/* Overlay — tashqi click bilan yopish */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal content */}
      <div
        className="relative bg-white rounded-lg shadow-xl p-6 max-w-lg w-full mx-4"
        onClick={e => e.stopPropagation()} // Ichki click overlay-ga ketmasin
      >
        {title && (
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              &times;
            </button>
          </div>
        )}
        {children}
      </div>
    </div>,
    document.body  // ← DOM-da body-ga render!
  )
}

// Ishlatish
function App() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="p-8">
      <h1>Asosiy sahifa</h1>

      {/* Bu div overflow:hidden bo'lsa ham, Modal chiqadi! */}
      <div style={{ overflow: 'hidden', height: 200 }}>
        <p>Bu konteyner overflow: hidden</p>
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Modalni ochish
        </button>

        {/* React-da shu yerda, DOM-da body-da */}
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Salom!">
          <p>Bu modal kontent. ESC yoki overlay bosilsa yopiladi.</p>
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Yopish
            </button>
            <button className="px-4 py-2 bg-blue-500 text-white rounded">
              Tasdiqlash
            </button>
          </div>
        </Modal>
      </div>
    </div>
  )
}`,
        description: `Portal bilan Modal — DOM-da body-ga render, shuning uchun parent-ning overflow:hidden va z-index muammolari ta'sir qilmaydi. ESC, overlay click, body scroll lock — to'liq modal pattern.`,
      },
    ],
    interviewQA: [
      {
        question: `Portal nima va qachon kerak?`,
        answer: `Portal — createPortal(children, domNode) orqali React komponentni DOM tree-da boshqa joyga render qilish. Komponent React tree-da parent ichida qoladi (state, context, event ishlaydi), lekin DOM-da boshqa joyda ko'rinadi. Qachon kerak: 1) Modal/dialog — body-ga render, parent-ning overflow:hidden ta'sir qilmasligi uchun. 2) Tooltip — z-index muammolarini bartaraf qilish. 3) Dropdown menu — stacking context muammolarini hal qilish. Barcha "floating" UI elementlar uchun portal kerak.`,
      },
      {
        question: `Event bubbling portal-da qanday ishlaydi?`,
        answer: `Portal-da event bubbling React tree bo'yicha ishlaydi, DOM tree bo'yicha EMAS. Masalan: <Card onClick={handler}><Modal /></Card> — Modal DOM-da body-da, lekin React tree-da Card ichida. Modal ichida button bosilsa, event React tree bo'yicha yuqoriga ko'tariladi va Card onClick ham ishlaydi. Bu ba'zan foydali (parent event-larni ushlash), ba'zan kutilmagan. Kerak bo'lmasa e.stopPropagation() bilan to'xtatish mumkin. Bu React-ning muhim xususiyati — DOM strukturasidan mustaqil event propagation.`,
      },
    ],
    relatedTopics: [
      { sectionId: `react-core`, topicId: `event-system`, label: `Event bubbling portal-da` },
    ],
  },

  // ===== CHILDREN API =====
  {
    id: `children-api`,
    title: `Children API`,
    importance: 2,
    status: `to-learn`,
    description: `React.Children, cloneElement, children manipulation`,
    content: `React.Children — children ustida xavfsiz iteratsiya qilish uchun utility funksiyalar. cloneElement — child-ga qo'shimcha props berish. Lekin zamonaviy React-da boshqa usullar AFZAL.

═══════════════════════════════════════
  React.Children UTILITIES
═══════════════════════════════════════

React.Children — children ustida xavfsiz ishlash:

  React.Children.map(children, fn)
    — har bir child ustida funksiya chaqirish
    — null/undefined xavfsiz (skip qilinadi)

  React.Children.forEach(children, fn)
    — map kabi, lekin natija qaytarmaydi

  React.Children.count(children)
    — children soni (nested array-larni ham hisoblaydi)

  React.Children.toArray(children)
    — children-ni yassi (flat) massivga aylantiradi
    — key avtomatik qo'shiladi

  React.Children.only(children)
    — faqat BITTA child borligini tekshiradi
    — ko'p bo'lsa throw error

═══════════════════════════════════════
  cloneElement
═══════════════════════════════════════

Child-ga qo'shimcha props berish:

  React.cloneElement(child, { extraProp: 'value' })

  // Masalan: har bir child-ga active prop berish:
  React.Children.map(children, (child, index) =>
    React.cloneElement(child, { active: index === activeIndex })
  )

Lekin React jamoasi cloneElement-ni TAVSIYA QILMAYDI!
Sabablar:
  1. Props nomlar to'qnashuvi mumkin
  2. Child ichki tuzilmasini buzishi mumkin
  3. TypeScript tipizatsiyasi murakkab
  4. Yashirin data flow — debug qiyin

Yaxshiroq alternativalar:
  - Render props
  - Context (Provider pattern)
  - Compound components + Context

═══════════════════════════════════════
  NIMA UCHUN React.Children KERAK
═══════════════════════════════════════

children har xil bo'lishi mumkin:
  — string: <Card>Matn</Card>
  — element: <Card><p>Matn</p></Card>
  — array: <Card><p>1</p><p>2</p></Card>
  — null: <Card>{null}</Card>
  — number: <Card>{42}</Card>

Oddiy children.map() ishlamaydi — chunki children
DOIM array emas. React.Children bu farqlarni
xavfsiz boshqaradi.

  // NOTO'G'RI — children string bo'lsa crash:
  children.map(child => ...)

  // TO'G'RI — har qanday children bilan ishlaydi:
  React.Children.map(children, child => ...)`,
    codeExamples: [
      {
        title: `React.Children.map — har bir child-ga props berish`,
        language: `tsx`,
        code: `import { Children, cloneElement, useState, isValidElement, type ReactNode } from 'react'

// Stepper — qadamli form
interface StepperProps {
  children: ReactNode
}

function Stepper({ children }: StepperProps) {
  const [activeStep, setActiveStep] = useState(0)
  const steps = Children.toArray(children)
  const totalSteps = steps.length

  return (
    <div className="max-w-md mx-auto">
      {/* Progress */}
      <div className="flex mb-4">
        {steps.map((_, index) => (
          <div
            key={index}
            className={\`flex-1 h-2 mx-1 rounded \${
              index <= activeStep ? 'bg-blue-500' : 'bg-gray-200'
            }\`}
          />
        ))}
      </div>

      {/* Hozirgi qadam — cloneElement bilan props berish */}
      {Children.map(children, (child, index) => {
        if (!isValidElement(child)) return null
        if (index !== activeStep) return null

        return cloneElement(child as React.ReactElement<StepProps>, {
          stepNumber: index + 1,
          isActive: true,
        })
      })}

      {/* Navigation */}
      <div className="flex justify-between mt-4">
        <button
          onClick={() => setActiveStep(s => s - 1)}
          disabled={activeStep === 0}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Orqaga
        </button>
        <span>{activeStep + 1} / {totalSteps}</span>
        <button
          onClick={() => setActiveStep(s => s + 1)}
          disabled={activeStep === totalSteps - 1}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Keyingisi
        </button>
      </div>
    </div>
  )
}

// Step component
interface StepProps {
  children: ReactNode
  title: string
  stepNumber?: number
  isActive?: boolean
}

function Step({ children, title, stepNumber }: StepProps) {
  return (
    <div className="p-4 border rounded">
      <h3 className="font-bold mb-2">
        Qadam {stepNumber}: {title}
      </h3>
      {children}
    </div>
  )
}

// Ishlatish
function SignupForm() {
  return (
    <Stepper>
      <Step title="Shaxsiy ma'lumotlar">
        <input placeholder="Ism" className="w-full p-2 border rounded mb-2" />
        <input placeholder="Familiya" className="w-full p-2 border rounded" />
      </Step>
      <Step title="Aloqa">
        <input placeholder="Email" className="w-full p-2 border rounded mb-2" />
        <input placeholder="Telefon" className="w-full p-2 border rounded" />
      </Step>
      <Step title="Parol">
        <input type="password" placeholder="Parol" className="w-full p-2 border rounded mb-2" />
        <input type="password" placeholder="Tasdiqlash" className="w-full p-2 border rounded" />
      </Step>
    </Stepper>
  )
}`,
        description: `Stepper — React.Children.map va cloneElement bilan qadamli form. Har bir Step-ga stepNumber va isActive props dinamik beriladi. Lekin zamonaviy React-da Context bilan qilish tavsiya etiladi.`,
      },
    ],
    interviewQA: [
      {
        question: `React.Children nima uchun kerak?`,
        answer: `React.Children — children prop ustida xavfsiz iteratsiya qilish uchun utility. children har xil bo'lishi mumkin: string, element, array, null, number. Oddiy children.map() crash bo'lishi mumkin (agar children string yoki null bo'lsa). React.Children.map() har qanday children bilan xavfsiz ishlaydi. Boshqa utility-lar: count (soni), toArray (massivga aylantirish), only (faqat bitta child borligini tekshirish), forEach (side effect uchun iteratsiya).`,
      },
      {
        question: `cloneElement nima uchun tavsiya qilinmaydi?`,
        answer: `React rasmiy jamoasi cloneElement-ni TAVSIYA QILMAYDI sabablari: 1) Yashirin data flow — child qayerdan props olayotgani nomalum, debug qiyin. 2) Props nomlar to'qnashuvi — parent va cloneElement bir xil prop nom bersa, biri yutiladi. 3) TypeScript tipizatsiyasi murakkab — child tipi nomalum. 4) Faqat birinchi darajali children bilan ishlaydi (nested emas). Yaxshiroq alternativalar: Context (compound components), render props, yoki oddiy props orqali ma'lumot uzatish.`,
      },
    ],
    relatedTopics: [
      { sectionId: `component-patterns`, topicId: `compound-components`, label: `Compound Components` },
      { sectionId: `component-patterns`, topicId: `composition-vs-inheritance`, label: `Composition` },
      { sectionId: `typescript-react`, topicId: `children-types`, label: `Children tipizatsiyasi` },
    ],
  },

  // ===== PROVIDER PATTERN =====
  {
    id: `provider-pattern`,
    title: `Provider Pattern`,
    importance: 2,
    status: `to-learn`,
    description: `Context + Provider — global ma'lumot ulashish pattern`,
    content: `Provider Pattern — Context + Provider + custom hook orqali global ma'lumotni komponentlar daraxtida ulashish. Bu React-dagi eng keng tarqalgan state sharing pattern.

═══════════════════════════════════════
  NIMA BU
═══════════════════════════════════════

Context + Provider + custom hook — global ma'lumot ulashish:

  1. createContext — context yaratish
  2. Provider component — state + logic saqlash
  3. Custom hook — useContext wrapper + null check

Bu pattern barcha katta React ilovalarida ishlatiladi:
  - Auth (foydalanuvchi ma'lumotlari)
  - Theme (dark/light rejim)
  - Toast/Notification
  - Language/i18n
  - Shopping Cart

═══════════════════════════════════════
  PATTERN
═══════════════════════════════════════

1) Context yaratish:
   const MyContext = createContext<MyContextType | null>(null)

2) Provider component (state + logic):
   function MyProvider({ children }) {
     const [state, setState] = useState(...)
     // Logic funksiyalar
     const value = { state, action1, action2 }
     return (
       <MyContext.Provider value={value}>
         {children}
       </MyContext.Provider>
     )
   }

3) Custom hook (useContext wrapper + null check):
   function useMyContext() {
     const ctx = useContext(MyContext)
     if (!ctx) {
       throw new Error('useMyContext must be used within MyProvider')
     }
     return ctx
   }

Bu 3 qadam DOIM birga ishlatiladi. Custom hook null
check qiladi — Provider yo'q bo'lsa, tushunarli xato
beradi (runtime-da debug oson).

═══════════════════════════════════════
  MULTIPLE PROVIDERS
═══════════════════════════════════════

Har bir concern uchun alohida Provider:
  ThemeProvider — tema
  AuthProvider — autentifikatsiya
  ToastProvider — bildirishnomalar
  CartProvider — savdo savati

App-da nesting:
  <ThemeProvider>
    <AuthProvider>
      <ToastProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </ToastProvider>
    </AuthProvider>
  </ThemeProvider>

Bu "Provider hell" deyiladi — ko'p nesting.
Yechimlar:
  1. composeProviders utility funksiya
  2. Zustand/Jotai ishlatish (Context emas)
  3. Har bir Provider faqat kerakli joyda`,
    codeExamples: [
      {
        title: `ToastProvider — toast notification context + provider + hook`,
        language: `tsx`,
        code: `import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

// 1. Tiplar
interface Toast {
  id: number
  message: string
  type: 'success' | 'error' | 'info'
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (message: string, type?: Toast['type']) => void
  removeToast: (id: number) => void
}

// 2. Context yaratish (null — Provider yo'q bo'lganda)
const ToastContext = createContext<ToastContextType | null>(null)

// 3. Custom hook — null check bilan
function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within <ToastProvider>')
  }
  return context
}

// 4. Provider component — state + logic
let toastId = 0

function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((message: string, type: Toast['type'] = 'info') => {
    const id = ++toastId
    setToasts(prev => [...prev, { id, message, type }])

    // 3 sekunddan keyin avtomatik o'chirish
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3000)
  }, [])

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}

      {/* Toast UI — portal bilan qilish ham mumkin */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={\`px-4 py-3 rounded shadow-lg text-white flex justify-between items-center min-w-[300px] \${
              toast.type === 'success' ? 'bg-green-500' :
              toast.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
            }\`}
          >
            <span>{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-4 text-white/70 hover:text-white"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

// 5. Ishlatish
function SaveButton() {
  const { addToast } = useToast()

  const handleSave = () => {
    // ... save logic
    addToast('Muvaffaqiyatli saqlandi!', 'success')
  }

  const handleError = () => {
    addToast('Xatolik yuz berdi!', 'error')
  }

  return (
    <div className="flex gap-2">
      <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded">
        Saqlash
      </button>
      <button onClick={handleError} className="bg-red-500 text-white px-4 py-2 rounded">
        Xato test
      </button>
    </div>
  )
}

// App-da Provider o'rash
function App() {
  return (
    <ToastProvider>
      <div className="p-8">
        <h1>Mening ilovam</h1>
        <SaveButton />
        {/* Istalgan nested komponent useToast() chaqira oladi */}
      </div>
    </ToastProvider>
  )
}

export { ToastProvider, useToast }`,
        description: `To'liq Provider pattern: 1) Context yaratish, 2) Provider component (state + auto-dismiss logic), 3) Custom hook (null check). Har qanday nested komponent useToast() bilan toast chiqara oladi — prop drilling yo'q.`,
      },
    ],
    interviewQA: [
      {
        question: `Provider pattern nima?`,
        answer: `Provider pattern — Context API asosidagi ma'lumot ulashish pattern. Uch qismdan iborat: 1) createContext — context yaratish. 2) Provider component — state va logic saqlaydi, children-ni Context.Provider bilan o'raydi. 3) Custom hook — useContext wrapper + null check (Provider yo'q bo'lsa tushunarli xato beradi). Bu pattern prop drilling muammosini hal qiladi — har qanday darajadagi komponent to'g'ridan-to'g'ri ma'lumotga kiradi. Auth, Theme, Toast, Cart kabi global state uchun ishlatiladi.`,
      },
      {
        question: `Ko'p Provider nesting muammosi va yechimi nima?`,
        answer: `Ko'p Provider "Provider hell" yaratadi: <ThemeProvider><AuthProvider><ToastProvider><CartProvider><App/></...>. Muammolar: 1) O'qish qiyin, 2) Har bir Provider re-render qilishi mumkin, 3) Provider tartib muhim bo'lishi mumkin. Yechimlar: 1) composeProviders utility: function composeProviders(...providers) — flatten qiladi. 2) Provider-larni faqat KERAKLI joyda qo'yish — CartProvider faqat shop sahifasida. 3) Zustand/Jotai ishlatish — Context-siz global state, Provider kerak emas. 4) Single AppProvider — barcha context-larni birlashtirish.`,
      },
    ],
    relatedTopics: [
      { sectionId: `react-core`, topicId: `use-context`, label: `useContext` },
      { sectionId: `state-management`, topicId: `context-api`, label: `Context API` },
      { sectionId: `component-patterns`, topicId: `compound-components`, label: `Compound Components` },
    ],
  },

  // ===== POLYMORPHIC COMPONENTS =====
  {
    id: `polymorphic-components`,
    title: `Polymorphic Components`,
    importance: 2,
    status: `to-learn`,
    description: `"as" prop pattern — <Button as="a" href="/"> qilib ishlatish`,
    content: `Polymorphic Components — "as" prop orqali komponent qaysi HTML element yoki komponent sifatida renderlanishini tanlash. UI kutubxonalarida keng tarqalgan pattern.

═══════════════════════════════════════
  NIMA BU
═══════════════════════════════════════

"as" prop — komponent qaysi HTML element yoki komponent
sifatida renderlanishini tanlash:

  <Button as="a" href="/">Asosiy sahifa</Button>
  // Renderlanadi: <a href="/" class="btn">Asosiy sahifa</a>

  <Button as="button" onClick={save}>Saqlash</Button>
  // Renderlanadi: <button class="btn" onclick="...">Saqlash</button>

  <Text as="h1">Sarlavha</Text>
  // Renderlanadi: <h1>Sarlavha</h1>

  <Text as="p">Oddiy matn</Text>
  // Renderlanadi: <p>Oddiy matn</p>

Komponent KO'RINISHI bir xil, lekin HTML elementi turli.

═══════════════════════════════════════
  NIMA UCHUN KERAK
═══════════════════════════════════════

UI library-larda — Button ba'zan link, ba'zan button,
ba'zan div bo'lishi kerak:

  1. Accessibility: <a> tag SEO va screen reader uchun
     muhim, lekin ko'rinishi button kabi bo'lishi kerak

  2. Semantic HTML: <h1>, <h2>, <p>, <span> — turli
     vazifa, bir xil stil

  3. Moslashuvchanlik: Bir komponent — ko'p ishlatish

Mashhur kutubxonalar bu pattern ishlatadi:
  - Chakra UI: <Box as="section">
  - Mantine: <Button component="a">
  - Headless UI: <Menu.Button as={Fragment}>

═══════════════════════════════════════
  TYPESCRIPT BILAN
═══════════════════════════════════════

Murakkab generic tiplar kerak:
  - ComponentPropsWithoutRef<T> — element props-larini olish
  - as prop — ElementType (string yoki component)
  - Props merge — komponent o'z props + element props

TypeScript-da to'liq tipizatsiya qiyin, lekin
foydalanuvchiga to'g'ri autocomplete beradi:

  <Button as="a" href="/">  ← href faqat "a" uchun!
  <Button as="button" type="submit"> ← type faqat "button" uchun!`,
    codeExamples: [
      {
        title: `Box component — as prop bilan har xil element`,
        language: `tsx`,
        code: `import { type ElementType, type ComponentPropsWithoutRef, type ReactNode } from 'react'

// Polymorphic component tipi
type BoxProps<T extends ElementType> = {
  as?: T
  children?: ReactNode
  className?: string
} & ComponentPropsWithoutRef<T>

// Box component — "as" prop bilan istalgan element
function Box<T extends ElementType = 'div'>({
  as,
  children,
  className,
  ...props
}: BoxProps<T>) {
  const Component = as || 'div'

  return (
    // @ts-expect-error — polymorphic props spread
    <Component className={className} {...props}>
      {children}
    </Component>
  )
}

// Text component — tipografiya uchun
type TextProps<T extends ElementType> = BoxProps<T> & {
  variant?: 'heading' | 'body' | 'caption'
}

function Text<T extends ElementType = 'p'>({
  variant = 'body',
  className = '',
  ...props
}: TextProps<T>) {
  const variantStyles = {
    heading: 'text-2xl font-bold',
    body: 'text-base',
    caption: 'text-sm text-gray-500',
  }

  return <Box className={\`\${variantStyles[variant]} \${className}\`} {...props} />
}

// Button component — polymorphic
type ButtonProps<T extends ElementType> = BoxProps<T> & {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

function Button<T extends ElementType = 'button'>({
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: ButtonProps<T>) {
  const variantStyles = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    ghost: 'bg-transparent text-blue-500 hover:bg-blue-50',
  }

  const sizeStyles = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  }

  return (
    <Box
      className={\`rounded font-medium \${variantStyles[variant]} \${sizeStyles[size]} \${className}\`}
      {...props}
    />
  )
}

// Ishlatish
function App() {
  return (
    <div className="p-8 space-y-4">
      {/* Box — turli elementlar */}
      <Box as="section" className="p-4 border rounded">
        Section element
      </Box>
      <Box as="article" className="p-4 bg-gray-50">
        Article element
      </Box>

      {/* Text — tipografiya */}
      <Text as="h1" variant="heading">Sarlavha (h1)</Text>
      <Text as="h2" variant="heading">Kichik sarlavha (h2)</Text>
      <Text as="p" variant="body">Oddiy matn (p)</Text>
      <Text as="span" variant="caption">Izoh matni (span)</Text>

      {/* Button — button yoki link */}
      <div className="flex gap-2">
        <Button as="button" onClick={() => alert('Bosildi!')}>
          Tugma (button)
        </Button>
        <Button as="a" href="https://react.dev" variant="secondary">
          Havola (a)
        </Button>
        <Button as="a" href="/settings" variant="ghost" size="sm">
          Sozlamalar
        </Button>
      </div>
    </div>
  )
}`,
        description: `Polymorphic Box, Text, Button — "as" prop orqali istalgan HTML element sifatida render. TypeScript generic-lar bilan element-ga mos props autocomplete beradi (href faqat "a" uchun, onClick faqat "button" uchun).`,
      },
    ],
    interviewQA: [
      {
        question: `Polymorphic component nima?`,
        answer: `Polymorphic component — "as" prop orqali qaysi HTML element yoki React komponent sifatida renderlanishini tanlash imkonini beradigan komponent. Masalan: <Button as="a" href="/"> — button ko'rinishida, lekin aslida <a> tag render bo'ladi. Bu UI kutubxonalarda (Chakra UI, Mantine) keng tarqalgan. Afzalliklari: 1) Semantic HTML — to'g'ri element ishlatish. 2) Accessibility — <a>, <button>, <h1> to'g'ri ishlatiladi. 3) Bir komponent — ko'p vazifa.`,
      },
      {
        question: `TypeScript-da polymorphic component qanday tipizatsiya qilinadi?`,
        answer: `TypeScript-da generic tip kerak: function Box<T extends ElementType = 'div'>(props: BoxProps<T>). BoxProps<T> = { as?: T } & ComponentPropsWithoutRef<T> — bu "as" ga berilgan element-ning barcha props-larini avtomatik qo'shadi. Masalan: as="a" bo'lsa href, target paydo bo'ladi; as="button" bo'lsa type, disabled paydo bo'ladi. Bu murakkab tipizatsiya, lekin foydalanuvchiga ajoyib autocomplete beradi. ComponentPropsWithoutRef ref-siz props oladi, ref kerak bo'lsa ComponentPropsWithRef ishlatiladi.`,
      },
    ],
    relatedTopics: [
      { sectionId: `typescript-react`, topicId: `generic-components`, label: `Generic Components` },
      { sectionId: `component-patterns`, topicId: `composition-vs-inheritance`, label: `Composition` },
    ],
  },
]
