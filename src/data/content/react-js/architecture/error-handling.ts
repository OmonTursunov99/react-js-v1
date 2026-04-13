import type { Topic } from '../../../types'

export const errorHandling: Topic = {
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
      { techId: 'react-js', sectionId: 'component-patterns', topicId: 'error-boundaries', label: 'Error Boundaries' },
      { techId: 'react-js', sectionId: 'state-management', topicId: 'tanstack-query-deep', label: 'TanStack Query error handling' },
    ],
  }
