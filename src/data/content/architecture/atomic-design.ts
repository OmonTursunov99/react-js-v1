import type { Topic } from '../../types'

export const atomicDesign: Topic = {
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
  }
