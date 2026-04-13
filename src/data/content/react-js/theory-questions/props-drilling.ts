import type { Topic } from '../../../types'

export const propsDrilling: Topic = {
    id: 'props-drilling',
    title: 'Props Drilling muammosi',
    importance: 3,
    status: 'to-learn',
    description: 'Context, composition, state management yechimlar',
    content: `Props drilling — ma'lumotni chuqur komponentga yetkazish uchun oraliq komponentlardan o'tkazish. 1-2 daraja normal, 3+ daraja — muammo.

═══════════════════════════════════════
  MUAMMO
═══════════════════════════════════════

  App (user state) → Header → Nav → UserMenu → Avatar
  user prop 4 ta komponentdan o'tadi, faqat Avatar ishlatadi.

  ❌ Oraliq komponentlar keraksiz props oladi
  ❌ Refactoring qiyin — prop o'zgarsa butun zanjir o'zgartish kerak
  ❌ Kodni tushunish qiyin

═══════════════════════════════════════
  YECHIMLAR
═══════════════════════════════════════

1. COMPOSITION (eng oddiy):
   <Header>
     <Avatar user={user} />   {/* to'g'ridan-to'g'ri */}
   </Header>

2. CONTEXT API:
   <UserContext.Provider value={user}>
     <Header />  {/* user prop kerak emas */}
   </UserContext.Provider>

   function Avatar() {
     const user = useContext(UserContext)
   }

3. STATE MANAGEMENT (Zustand/Redux):
   const user = useUserStore(s => s.user)

4. COMPONENT COMPOSITION (render prop / children):
   <DataProvider>{(data) => <Display data={data} />}</DataProvider>

Qoida:
  1-2 daraja → props (normal, explicit)
  3+ daraja → composition yoki Context
  Ko'p komponent + tez o'zgaradigan data → Zustand/Redux`,
    codeExamples: [
      {
        title: 'Props drilling vs yechimlar',
        language: 'tsx',
        code: `// ❌ PROPS DRILLING
function App() {
  const [user, setUser] = useState<User>(currentUser)
  return <Header user={user} />  // 1
}
function Header({ user }: { user: User }) {
  return <Nav user={user} />  // 2 — Header user ishlatMAYDI
}
function Nav({ user }: { user: User }) {
  return <UserMenu user={user} />  // 3 — Nav user ishlatMAYDI
}
function UserMenu({ user }: { user: User }) {
  return <span>{user.name}</span>  // 4 — faqat SHU ishlatadi
}

// ✅ YECHIM 1: Composition
function App() {
  const [user] = useState<User>(currentUser)
  return (
    <Header>
      <UserMenu user={user} />  {/* to'g'ridan-to'g'ri */}
    </Header>
  )
}
function Header({ children }: { children: ReactNode }) {
  return <header><nav>{children}</nav></header>
}

// ✅ YECHIM 2: Context
const UserContext = createContext<User | null>(null)

function App() {
  const [user] = useState<User>(currentUser)
  return (
    <UserContext.Provider value={user}>
      <Header />  {/* user prop KERAK EMAS */}
    </UserContext.Provider>
  )
}
function UserMenu() {
  const user = useContext(UserContext)  // qayerda bo'lsa ham oladi
  return <span>{user?.name}</span>
}`,
        description: 'Props drilling: 4 ta komponentdan o\'tadi. Composition: children bilan to\'g\'ridan-to\'g\'ri. Context: Provider + useContext — oraliq komponentlar bilmaydi.',
      },
    ],
    interviewQA: [
      {
        question: 'Props drilling nima va qanday hal qilinadi?',
        answer: `Props drilling — ma'lumotni chuqur komponentga oraliq komponentlar orqali o'tkazish. Oraliq komponentlar props-ni faqat uzatadi, ishlatmaydi. Yechimlar: 1) Composition — children prop bilan to'g'ridan-to'g'ri berish, 2) Context API — Provider + useContext, 3) State management (Zustand/Redux) — global store. Qoida: 1-2 daraja props normal, 3+ daraja — composition yoki Context. Context kamdan-kam o'zgaradigan data uchun, tez-tez o'zgarsa Zustand.`,
      },
      {
        question: 'Props drilling doim yomonmi?',
        answer: `Yo'q! 1-2 daraja props — React-ning normal ishlash usuli. Props explicit va kuzatish oson. Props afzalliklari: komponent nimaga bog'liq — aniq ko'rinadi, TypeScript tekshiradi, refactoring oson. Props drilling MUAMMO faqat: 3+ daraja, oraliq komponentlar ishlatmaydi, ko'p komponentlar bir xil data kerak. Ortiqcha abstraction (Context har joyda) ham muammo — kodni murakkablashtiradi.`,
      },
    ],
    relatedTopics: [
      { techId: 'react-js', sectionId: 'react-core', topicId: 'use-context', label: 'useContext (yechim)' },
      { techId: 'react-js', sectionId: 'state-management', topicId: 'context-api', label: 'Context API' },
      { techId: 'react-js', sectionId: 'state-management', topicId: 'when-to-use-what', label: 'Qachon nima ishlatish' },
      { techId: 'react-js', sectionId: 'component-patterns', topicId: 'composition-vs-inheritance', label: 'Composition (yechim)' },
    ],
  }
