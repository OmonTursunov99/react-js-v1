import type { Topic } from '../../../types'

export const errorBoundaries: Topic = {
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
      { techId: `react-js`, sectionId: `component-patterns`, topicId: `suspense-lazy`, label: `Suspense (fallback)` },
      { techId: `react-js`, sectionId: `architecture`, topicId: `error-handling`, label: `Error Handling strategiyasi` },
    ],
  }
