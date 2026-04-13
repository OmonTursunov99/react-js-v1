import type { Topic } from '../../../types'

export const react1819: Topic = {
    id: 'react-18-19',
    title: 'React 18/19 yangiliklari',
    importance: 3,
    status: 'to-learn',
    description: 'Concurrent features, Server Components, Compiler',
    content: `React 18 va 19 — katta yangiliklar. Concurrent rendering, Server Components, React Compiler — React-ning kelajagi.

═══════════════════════════════════════
  REACT 18 YANGILIKLARI
═══════════════════════════════════════

1. AUTOMATIC BATCHING
   Barcha setState-lar batching qilinadi (setTimeout, Promise ichida ham):
   setState(a); setState(b); setState(c); → BITTA render

2. CONCURRENT FEATURES
   useTransition — past prioritet yangilanish
   useDeferredValue — past prioritet qiymat
   Rendering to'xtatilishi va davom etishi mumkin

3. SUSPENSE YAXSHILANGAN
   SSR Streaming bilan Suspense
   Selective Hydration

4. createRoot
   ReactDOM.render → ReactDOM.createRoot (yangi API)

5. useId
   SSR-safe unique ID yaratish

═══════════════════════════════════════
  REACT 19 YANGILIKLARI
═══════════════════════════════════════

1. REACT COMPILER
   Avtomatik useMemo/useCallback/React.memo
   Build vaqtida optimizatsiya

2. ACTIONS
   useActionState — form action holati
   useFormStatus — form submit holati
   useOptimistic — optimistic update

3. use() HOOK
   Promise va Context-ni o'qish (Suspense bilan)
   if ichida ishlatish MUMKIN (Rules of Hooks istisnosi)

4. SERVER COMPONENTS
   "use client" / "use server" direktivlari
   Server-da render, client-ga HTML yuborish

5. ref PROP
   forwardRef kerak emas — ref oddiy prop sifatida

6. DOCUMENT METADATA
   <title>, <meta> komponent ichida — avtomatik <head>-ga

═══════════════════════════════════════
  MIGRATION
═══════════════════════════════════════

React 17 → 18:
  ReactDOM.render → createRoot
  Automatic batching (breaking change kam)

React 18 → 19:
  ref prop (forwardRef kerak emas)
  React Compiler qo'shish
  use() hook (yangi pattern)`,
    codeExamples: [
      {
        title: 'React 18/19 yangiliklar — amaliy',
        language: 'tsx',
        code: `import { useTransition, useDeferredValue, useId, useState } from 'react'

// React 18: useTransition — past prioritet
function SearchPage() {
  const [query, setQuery] = useState('')
  const [isPending, startTransition] = useTransition()
  const [results, setResults] = useState<string[]>([])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value)  // YUQORI prioritet — input responsive

    startTransition(() => {
      // PAST prioritet — katta ro'yxat filterlash
      setResults(filterLargeList(e.target.value))
    })
  }

  return (
    <div>
      <input value={query} onChange={handleChange} />
      {isPending && <p>Qidirilmoqda...</p>}
      <ul>{results.map(r => <li key={r}>{r}</li>)}</ul>
    </div>
  )
}

// React 18: useDeferredValue
function FilteredList({ items, query }: { items: Item[]; query: string }) {
  const deferredQuery = useDeferredValue(query)
  const isStale = query !== deferredQuery

  const filtered = items.filter(i =>
    i.name.toLowerCase().includes(deferredQuery.toLowerCase())
  )

  return (
    <div style={{ opacity: isStale ? 0.6 : 1 }}>
      {filtered.map(i => <div key={i.id}>{i.name}</div>)}
    </div>
  )
}

// React 18: useId — SSR-safe unique ID
function AccessibleField({ label }: { label: string }) {
  const id = useId()
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input id={id} />
    </div>
  )
}

// React 19: ref oddiy prop (forwardRef kerak emas)
function Input({ ref, ...props }: { ref?: React.Ref<HTMLInputElement> }) {
  return <input ref={ref} {...props} />
}

// React 19: use() hook
// import { use } from 'react'
// function UserName({ userPromise }: { userPromise: Promise<User> }) {
//   const user = use(userPromise)  // Suspense bilan kutadi
//   return <p>{user.name}</p>
// }`,
        description: 'React 18: useTransition (past prioritet), useDeferredValue, useId, automatic batching. React 19: React Compiler, ref prop (forwardRef yo\'q), use() hook, Actions.',
      },
    ],
    interviewQA: [
      {
        question: 'React 18 ning asosiy yangiliklari nima?',
        answer: `1) Automatic batching — BARCHA kontekstda setState batching (setTimeout, Promise ichida ham). 2) Concurrent features — useTransition (past prioritet), useDeferredValue. Rendering to'xtatilishi va davom etishi mumkin. 3) Suspense SSR — streaming, selective hydration. 4) createRoot — yangi render API. 5) useId — SSR-safe unique ID. Eng muhimi: concurrent rendering — React render jarayonini TO'XTATIB, muhimroq ishni bajarishi mumkin.`,
      },
      {
        question: 'React 19 ning asosiy yangiliklari nima?',
        answer: `1) React Compiler — avtomatik useMemo/useCallback. 2) Actions — useActionState, useFormStatus, useOptimistic (form handling). 3) use() hook — Promise va Context o'qish, if ichida mumkin. 4) ref oddiy prop — forwardRef kerak emas. 5) Document metadata — <title> komponent ichida. 6) Server Components — "use client"/"use server" direktivlari. Eng muhimi: React Compiler (qo'lda memoizatsiya yo'q) va Server Components (server-da render).`,
      },
    ],
    relatedTopics: [
      { techId: 'react-js', sectionId: 'theory-questions', topicId: 'concurrent-mode', label: 'Concurrent Features' },
      { techId: 'react-js', sectionId: 'theory-questions', topicId: 'server-components', label: 'Server Components' },
      { techId: 'react-js', sectionId: 'performance', topicId: 'react-compiler', label: 'React Compiler' },
      { techId: 'react-js', sectionId: 'react-core', topicId: 'batching', label: 'Automatic Batching' },
    ],
  }
