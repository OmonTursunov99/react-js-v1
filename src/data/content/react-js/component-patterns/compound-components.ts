import type { Topic } from '../../../types'

export const compoundComponents: Topic = {
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
      { techId: `react-js`, sectionId: `react-core`, topicId: `use-context`, label: `useContext (ichki aloqa)` },
      { techId: `react-js`, sectionId: `component-patterns`, topicId: `children-api`, label: `Children API` },
      { techId: `react-js`, sectionId: `component-patterns`, topicId: `composition-vs-inheritance`, label: `Composition pattern` },
    ],
  }
