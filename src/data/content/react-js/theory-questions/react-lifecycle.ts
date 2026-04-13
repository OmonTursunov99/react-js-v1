import type { Topic } from '../../../types'

export const reactLifecycle: Topic = {
    id: 'react-lifecycle',
    title: 'React Lifecycle (functional)',
    importance: 3,
    status: 'to-learn',
    description: 'Mount → render → commit → cleanup',
    content: `React functional komponent lifecycle — mount, update, unmount bosqichlari. Class component-dagi componentDidMount/Update/Unmount o'rniga hook-lar ishlatiladi.

═══════════════════════════════════════
  LIFECYCLE BOSQICHLARI
═══════════════════════════════════════

MOUNT (birinchi marta ekranga chiqish):
  1. Komponent funksiyasi chaqiriladi (render)
  2. useState — boshlang'ich qiymat olinadi
  3. JSX → Virtual DOM
  4. DOM-ga yoziladi (commit)
  5. useLayoutEffect ishlaydi (sinxron, paint OLDIN)
  6. Brauzer PAINT qiladi
  7. useEffect ishlaydi (asinxron, paint KEYIN)

UPDATE (state/props o'zgarishi):
  1. Komponent funksiyasi QAYTA chaqiriladi
  2. useState — mavjud qiymat qaytaradi (boshlang'ich emas)
  3. Yangi JSX → yangi Virtual DOM
  4. Diff → faqat farqlar DOM-ga yoziladi
  5. useLayoutEffect cleanup → useLayoutEffect
  6. Brauzer PAINT
  7. useEffect cleanup → useEffect

UNMOUNT (ekrandan olib tashlash):
  1. useLayoutEffect cleanup
  2. useEffect cleanup
  3. DOM-dan olib tashlash

═══════════════════════════════════════
  HOOK-LAR VA LIFECYCLE
═══════════════════════════════════════

useState — mount-da boshlang'ich qiymat
useRef — mount-da ref yaratish
useMemo — mount/update-da hisoblash
useCallback — mount/update-da funksiya
useEffect — mount/update KEYIN (asinxron)
useLayoutEffect — mount/update KEYIN (sinxron, paint oldin)
Cleanup — keyingi effect oldin yoki unmount-da

═══════════════════════════════════════
  CLASS vs FUNCTIONAL MAPPING
═══════════════════════════════════════

constructor           → useState(initialValue)
componentDidMount     → useEffect(() => {...}, [])
componentDidUpdate    → useEffect(() => {...}, [deps])
componentWillUnmount  → useEffect(() => { return cleanup }, [])
shouldComponentUpdate → React.memo
getDerivedStateFromProps → render ichida hisoblash
componentDidCatch     → Error Boundary (class kerak)`,
    codeExamples: [
      {
        title: 'Lifecycle — mount, update, unmount',
        language: 'tsx',
        code: `import { useState, useEffect, useLayoutEffect, useRef } from 'react'

function LifecycleDemo({ userId }: { userId: string }) {
  console.log('1. Render (mount yoki update)')

  // Mount-da boshlang'ich qiymat
  const [user, setUser] = useState<User | null>(null)
  const renderCount = useRef(0)
  renderCount.current += 1

  // useLayoutEffect — DOM-ga yozilgandan keyin, PAINT OLDIN
  useLayoutEffect(() => {
    console.log('3. useLayoutEffect (paint OLDIN)')
    // DOM o'lchash, scroll pozitsiya — flickering oldini olish

    return () => {
      console.log('3a. useLayoutEffect cleanup')
    }
  }, [userId])

  // useEffect — paint KEYIN
  useEffect(() => {
    console.log('4. useEffect (paint KEYIN)')

    // Side effect — API call, subscription
    const controller = new AbortController()
    fetch(\`/api/users/\${userId}\`, { signal: controller.signal })
      .then(res => res.json())
      .then(setUser)

    // Cleanup — unmount yoki keyingi effect oldin
    return () => {
      console.log('4a. useEffect cleanup')
      controller.abort()  // request bekor qilish
    }
  }, [userId])  // userId o'zgarsa qayta ishlaydi

  // Mount-da 1 marta
  useEffect(() => {
    console.log('MOUNT — faqat 1 marta')
    return () => {
      console.log('UNMOUNT — faqat 1 marta')
    }
  }, [])  // bo'sh deps = mount/unmount

  console.log('2. Render tugadi, DOM-ga yoziladi')

  return <div>Render #{renderCount.current}: {user?.name}</div>
}

// MOUNT tartib:
// 1. Render
// 2. Render tugadi → DOM commit
// 3. useLayoutEffect (sinxron)
// 4. Paint
// 5. useEffect (asinxron)

// UPDATE (userId o'zgarsa):
// 1. Render
// 2. DOM commit
// 3a. useLayoutEffect CLEANUP (eski)
// 3. useLayoutEffect (yangi)
// 4. Paint
// 4a. useEffect CLEANUP (eski)
// 4. useEffect (yangi)`,
        description: 'Lifecycle tartib: render → DOM commit → useLayoutEffect → paint → useEffect. Cleanup — keyingi effect oldin va unmount-da. Console.log bilan tartibni ko\'rish mumkin.',
      },
    ],
    interviewQA: [
      {
        question: 'React functional komponent lifecycle qanday ishlaydi?',
        answer: `3 bosqich: MOUNT — komponent birinchi render, useState init, useEffect ishlaydi. UPDATE — state/props o'zgarsa qayta render, useEffect cleanup → yangi effect. UNMOUNT — komponent o'chirilsa, useEffect cleanup ishlaydi. Tartib: render → DOM commit → useLayoutEffect → paint → useEffect. Class mapping: constructor→useState, componentDidMount→useEffect(,[]), componentWillUnmount→useEffect cleanup.`,
      },
      {
        question: 'useEffect cleanup qachon ishlaydi?',
        answer: `2 ta holat: 1) UNMOUNT — komponent DOM-dan o'chirilsa (faqat bir marta). 2) RE-RUN oldin — dependency o'zgarib, effect qayta ishlashdan OLDIN eski cleanup chaqiriladi. Misol: useEffect(() => { subscribe(id); return () => unsubscribe(id) }, [id]). id o'zgarsa: avval eski id-dan unsubscribe, keyin yangi id-ga subscribe. Bu "stale subscription" muammosini oldini oladi.`,
      },
    ],
    relatedTopics: [
      { techId: 'react-js', sectionId: 'react-core', topicId: 'use-effect', label: 'useEffect (lifecycle)' },
      { techId: 'react-js', sectionId: 'react-core', topicId: 'rendering-cycle', label: 'Rendering Cycle' },
      { techId: 'react-js', sectionId: 'react-core', topicId: 'use-layout-effect', label: 'useLayoutEffect' },
    ],
  }
