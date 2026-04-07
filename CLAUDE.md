# CLAUDE.md

## Buyruqlar

- `yarn dev` — Vite dev server (HMR)
- `yarn build` — `tsc -b && vite build` → `dist/`
- `yarn lint` — ESLint tekshirish
- `yarn preview` — production build preview
- `yarn` — dependency o'rnatish

## Loyiha maqsadi

Bu **React Interview Prep Platform** — Senior React Frontend suxbatiga tayyorgarlik uchun interactive o'quv platformasi. Foydalanuvchi 9 bo'lim, 91 mavzuni o'rganadi. Har bir mavzuda dokumentatsiya, kod misollari, intervyu savollari bor. Progress localStorage-da saqlanadi.

## Stek

| Texnologiya | Versiya | Vazifasi |
|---|---|---|
| React | 19.2 | UI framework |
| React Router | 7.13 | Routing (createBrowserRouter) |
| TypeScript | 5.9 | Tipizatsiya (strict mode) |
| Tailwind CSS | 4.2 | Styling |
| Zustand | 5.0 | State management (progress, sidebar) |
| Vite | 8.0 | Build tool |
| React Compiler | 1.0 | Avtomatik memoizatsiya |

Loyihada Redux Toolkit va TanStack Query ham o'rnatilgan (package.json), lekin hozirgi ilovada ishlatilmaydi — keyinchalik demo sifatida qo'shilishi mumkin.

## Arxitektura

### Kirish nuqtasi
```
index.html → src/main.tsx → <App /> → ThemeProvider → AppRouter → RootLayout → Outlet
```

### src/ tuzilmasi
```
src/
├── main.tsx                          # Kirish nuqtasi
├── app/
│   ├── App.tsx                       # ThemeProvider + AppRouter
│   ├── router.tsx                    # Barcha routelar (lazy loading)
│   ├── layouts/
│   │   └── RootLayout.tsx            # Header + Sidebar + Outlet
│   ├── providers/
│   │   ├── ThemeProvider.tsx          # Dark/light tema (Context + localStorage)
│   │   └── theme-context.ts          # ThemeContext (alohida fayl — ESLint react-refresh)
│   └── styles/
│       └── index.css                 # @import "tailwindcss"
├── components/
│   ├── ui/                           # Qayta ishlatiladigan UI komponentlar
│   │   ├── Accordion.tsx             # Ochiluvchi savol-javob
│   │   ├── Badge.tsx                 # "Bilasiz" / "O'rganish kerak" (learned: boolean)
│   │   ├── Card.tsx                  # Dashboard section kartochka
│   │   ├── Checkbox.tsx              # "O'rgandim" toggle
│   │   ├── CodeBlock.tsx             # Kod ko'rsatish + nusxalash
│   │   ├── ProgressBar.tsx           # Gradient progress bar
│   │   ├── StarRating.tsx            # Muhimlik darajasi (1-3 yulduz)
│   │   └── Tabs.tsx                  # Tab komponent
│   ├── sidebar/
│   │   ├── Sidebar.tsx               # 9 bo'limli sidebar
│   │   ├── SidebarSection.tsx        # Ochiluvchi bo'lim
│   │   └── SidebarTopic.tsx          # Topic NavLink
│   └── layout/
│       └── Header.tsx                # Logo, progress bar, tema toggle
├── data/
│   ├── types.ts                      # Section, Topic, RelatedTopic, CodeExample, InterviewQA
│   ├── sections.ts                   # 9 bo'limning master indeksi
│   └── content/                      # Har bir bo'lim uchun topic ma'lumotlari
│       ├── react-core.ts             # 1. React Core (23 mavzu)
│       ├── component-patterns.ts     # 2. Component Patterns (12 mavzu)
│       ├── state-management.ts       # 3. State Management (8 mavzu)
│       ├── routing.ts                # 4. Routing (6 mavzu)
│       ├── performance.ts            # 5. Performance (10 mavzu)
│       ├── typescript-react.ts       # 6. TypeScript + React (8 mavzu)
│       ├── testing.ts                # 7. Testing (5 mavzu)
│       ├── architecture.ts           # 8. Architecture (7 mavzu)
│       └── theory-questions.ts       # 9. Nazariy Savollar (15 mavzu)
├── stores/
│   ├── progress-store.ts             # Zustand + persist (learnedTopics[])
│   └── sidebar-store.ts              # Zustand (expandedSections[])
├── pages/
│   ├── DashboardPage.tsx             # Bosh sahifa — 3x3 grid kartochkalar
│   ├── SectionPage.tsx               # Bo'lim — topic grid
│   ├── TopicPage.tsx                 # Mavzu — tablar + bog'liq mavzular
│   └── NotFoundPage.tsx              # 404
└── hooks/
    ├── useProgress.ts                # learnedTopics dan derived: isLearned, getSectionPercent
    ├── useSectionData.ts             # Bo'limni ID bo'yicha topish
    ├── useTopicData.ts               # Mavzuni sectionId+topicId bo'yicha topish
    └── useTheme.ts                   # ThemeContext dan theme, toggleTheme
```

### Routing
```
/                              → DashboardPage (3x3 section kartochkalar)
/section/:sectionId            → SectionPage (topic grid)
/section/:sectionId/:topicId   → TopicPage (tablar: Ma'lumot, Kod, Intervyu savollari)
*                              → NotFoundPage
```
Barcha sahifalar `React.lazy()` + `Suspense` bilan lazy-loaded.

### Ma'lumotlar tuzilmasi

**Topic** — asosiy birlik:
```typescript
interface Topic {
  id: string                     // URL slug: "use-state"
  title: string                  // Ko'rinish: "useState"
  importance: 1 | 2 | 3          // Yulduzlar
  status: 'known' | 'to-learn'   // Dastlabki holat (hozir hammasi to-learn)
  description: string             // Qisqacha
  content: string                 // To'liq dokumentatsiya (bo'sh = hali yozilmagan)
  codeExamples: CodeExample[]     // Kod misollari
  interviewQA: InterviewQA[]      // Savol-javoblar
  relatedTopics?: RelatedTopic[]  // Cross-reference boshqa mavzularga
}
```

**Yangi mavzu qo'shish:** Faqat `src/data/content/<section>.ts` ga yangi topic object qo'shish yetarli — routing, sidebar, sahifalar avtomatik yangilanadi.

**Kontent to'ldirish:** Har bir topic-da `content`, `codeExamples`, `interviewQA` maydonlarini to'ldirish. Skeleton tuzilma tayyor — kontent bosqichma-bosqich qo'shiladi.

### Zustand pattern

**MUHIM:** Zustand store-da `get()` ishlatgan derived metodlar (`isExpanded()`, `isLearned()`) reaktiv EMAS — komponentni qayta renderlaMaydi. Store-dan faqat DATA select qilish kerak, derived logikani hook/komponent ichida hisoblash kerak:

```typescript
// NOTO'G'RI — re-render bermaydi:
const isLearned = useStore(s => s.isLearned(id))

// TO'G'RI — learnedTopics o'zgarganda re-render beradi:
const learnedTopics = useStore(s => s.learnedTopics)
const isLearned = learnedTopics.includes(key)
```

### Path alias
`@/` → `src/` (vite.config.ts va tsconfig.app.json da sozlangan)

### docs/ papka
`docs/` — o'rganilgan mavzular haqida .md fayllar va `interview-prep.md` — tayyorgarlik rejasi. Bu fayllar ilovada ishlatilmaydi, mustaqil hujjatlar.
