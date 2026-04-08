import type { Topic } from '../types'

export const theoryQuestionsTopics: Topic[] = [
  {
    id: 'virtual-dom-theory',
    title: 'Virtual DOM nima va qanday ishlaydi?',
    importance: 3,
    status: 'to-learn',
    description: 'Diffing algorithm, fiber, reconciliation',
    content: `Virtual DOM — React-ning eng asosiy arxitektura qarorlari. Haqiqiy DOM bilan ishlash o'rniga, JavaScript-da "virtual" nusxasi bilan ishlaydi.

═══════════════════════════════════════
  MUAMMO: DOM SEKIN
═══════════════════════════════════════

Haqiqiy DOM operatsiyalari qimmat:
  document.createElement() — yangi element
  element.appendChild() — qo'shish
  element.innerHTML = '...' — o'zgartirish

Har birida brauzer:
  1. DOM tree yangilaydi
  2. CSSOM qayta hisoblanadi
  3. Layout (reflow) — pozitsiya hisoblash
  4. Paint — piksellar chizish
  5. Composite — qatlamlar birlashtirish

1000 ta element o'zgartirsa → 1000 ta reflow + repaint = SEKIN.

═══════════════════════════════════════
  VIRTUAL DOM YECHIMI
═══════════════════════════════════════

Virtual DOM — DOM-ning JavaScript ob'ektdagi NUSXASI:

  // Haqiqiy DOM:
  <div class="card">
    <h1>Salom</h1>
    <p>Dunyo</p>
  </div>

  // Virtual DOM (oddiy JS object):
  {
    type: 'div',
    props: { className: 'card' },
    children: [
      { type: 'h1', props: {}, children: ['Salom'] },
      { type: 'p', props: {}, children: ['Dunyo'] },
    ]
  }

═══════════════════════════════════════
  RECONCILIATION (DIFFING)
═══════════════════════════════════════

State o'zgarsa React:
  1. YANGI Virtual DOM yaratadi (render funksiyani chaqiradi)
  2. ESKI Virtual DOM bilan TAQQOSLAYDI (diffing)
  3. Faqat FARQLARNI haqiqiy DOM-ga yozadi (commit)

  Eski VDOM:    Yangi VDOM:     Farq:
  <div>         <div>
    <h1>A</h1>    <h1>B</h1>    ← h1 matn o'zgardi
    <p>C</p>      <p>C</p>      ← o'zgarmagan
  </div>        </div>

  → Faqat h1 matn yangilanadi. p ga TEGMAYDI.

═══════════════════════════════════════
  DIFFING ALGORITM QOIDALARI
═══════════════════════════════════════

React O(n) diffing (O(n3) emas):

1. TURLI TIP = BUTUNLAY ALMASHTIRISH
   <div> → <span> = div o'chiriladi, span yaratiladi
   <Component1 /> → <Component2 /> = unmount/mount

2. BIR XIL TIP = FAQAT PROPS YANGILASH
   <div className="old"> → <div className="new">
   Faqat className o'zgaradi, div SAQLANADI

3. RO'YXATLAR = KEY BO'YICHA
   key bilan qaysi element qoldi/qo'shildi/o'chirildi — aniqlaydi
   key yo'q = tartib bo'yicha taqqoslash (NOTO'G'RI natija mumkin)

═══════════════════════════════════════
  VIRTUAL DOM = TEZ EMASMI?
═══════════════════════════════════════

Virtual DOM haqiqiy DOM-dan TEZROQ EMAS.
Qo'shimcha qadam — avval VDOM yaratish, keyin diff, keyin DOM.

LEKIN Virtual DOM:
  ✅ Minimal DOM operatsiyalar (faqat farqlar)
  ✅ Batching (bir nechta o'zgarish → bitta DOM yangilash)
  ✅ Developer uchun qulay (deklarativ)
  ✅ Cross-platform (React Native, SSR)

React-ning haqiqiy foyda: DEKLARATIV dasturlash.
Siz "nima ko'rsatish" aytasiz, React "qanday" hal qiladi.`,
    codeExamples: [
      {
        title: 'Virtual DOM jarayoni — vizual',
        language: 'tsx',
        code: `// 1. Komponent render → Virtual DOM (JS object)
function Greeting({ name }: { name: string }) {
  return (
    <div className="greeting">
      <h1>Salom, {name}!</h1>
      <p>Xush kelibsiz</p>
    </div>
  )
}

// React ichida taxminan shunday bo'ladi:
// {
//   type: 'div',
//   props: { className: 'greeting' },
//   children: [
//     { type: 'h1', children: ['Salom, ', 'Ali', '!'] },
//     { type: 'p', children: ['Xush kelibsiz'] }
//   ]
// }

// 2. name = "Ali" → "Vali" o'zgarsa:
// ESKI VDOM:                    YANGI VDOM:
// { type: 'h1',                 { type: 'h1',
//   children: ['Salom, Ali!'] }   children: ['Salom, Vali!'] }
//
// DIFF: h1 text node o'zgardi
// DOM: textNode.nodeValue = 'Salom, Vali!'
// p ga TEGMAYDI — o'zgarmagan

// 3. Turli tip — butunlay almashtirish
function App({ showProfile }: { showProfile: boolean }) {
  if (showProfile) {
    return <UserProfile />  // ← mount
  }
  return <LoginForm />      // ← mount
}
// showProfile true→false:
// React UserProfile-ni UNMOUNT (destroy) qiladi
// LoginForm-ni MOUNT (create) qiladi
// Ichki state TOZALANADI`,
        description: 'VDOM jarayoni: render → JS object → diff (eski vs yangi) → minimal DOM update. Bir xil tip = props yangilash, turli tip = unmount/mount.',
      },
    ],
    interviewQA: [
      {
        question: 'Virtual DOM nima va qanday ishlaydi?',
        answer: `Virtual DOM — haqiqiy DOM-ning JavaScript ob'ektdagi yengil nusxasi. State o'zgarsa: 1) React yangi Virtual DOM yaratadi (render chaqirish), 2) Eski VDOM bilan taqqoslaydi (diffing/reconciliation), 3) Faqat FARQLARNI haqiqiy DOM-ga yozadi. O(n) algoritm — ikkita daraxtni element bo'yicha taqqoslaydi. Foyda: minimal DOM operatsiyalar, batching, deklarativ dasturlash, cross-platform.`,
      },
      {
        question: 'React diffing algoritm qanday ishlaydi?',
        answer: `3 ta qoida: 1) Turli tip (div→span, ComponentA→ComponentB) — eski unmount, yangi mount, ichki state yo'qoladi. 2) Bir xil tip — faqat o'zgargan props/atribut yangilanadi, element saqlanadi. 3) Ro'yxatlar — key bo'yicha: qaysi qoldi, qo'shildi, o'chirildi. Key yo'q = tartib bo'yicha (noto'g'ri natija). Bu O(n) — har elementni bir marta tekshiradi (O(n3) umumiy daraxt diffing o'rniga).`,
      },
      {
        question: 'Virtual DOM haqiqiy DOM-dan tezroqmi?',
        answer: `Yo'q. Virtual DOM qo'shimcha qadam: VDOM yaratish + diff + DOM yangilash. To'g'ridan-to'g'ri DOM o'zgartirish tezroq BO'LISHI mumkin. LEKIN Virtual DOM foydalari: 1) Minimal DOM operatsiyalar (faqat farqlar yoziladi), 2) Batching (ko'p o'zgarish → bitta yangilash), 3) Deklarativ — developer "nima" aytadi, React "qanday" hal qiladi, 4) Cross-platform (DOM, Native, SSR). React-ning haqiqiy foyda — tezlik emas, developer tajribasi va maintainability.`,
      },
    ],
    relatedTopics: [
      { sectionId: 'react-core', topicId: 'virtual-dom', label: 'Virtual DOM (amaliy)' },
      { sectionId: 'theory-questions', topicId: 'fiber-architecture', label: 'Fiber Architecture' },
    ],
  },
  {
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
      { sectionId: 'react-core', topicId: 'use-effect', label: 'useEffect (lifecycle)' },
      { sectionId: 'react-core', topicId: 'rendering-cycle', label: 'Rendering Cycle' },
      { sectionId: 'react-core', topicId: 'use-layout-effect', label: 'useLayoutEffect' },
    ],
  },
  {
    id: 'rules-of-hooks',
    title: 'Hooks qoidalari (Rules of Hooks)',
    importance: 3,
    status: 'to-learn',
    description: 'Nima uchun shart ichida hook ishlatib bo\'lmaydi',
    content: `Rules of Hooks — 2 ta qat'iy qoida. Buzilsa React noto'g'ri ishlaydi yoki xato beradi.

═══════════════════════════════════════
  QOIDA 1: FAQAT TOP LEVEL-DA
═══════════════════════════════════════

Hook-lar FAQAT komponent yoki custom hook-ning ENG YUQORI darajasida chaqirilishi kerak.

  ❌ if ichida:
  if (condition) {
    const [state, setState] = useState(0)  // TAQIQLANGAN!
  }

  ❌ loop ichida:
  for (let i = 0; i < n; i++) {
    useEffect(() => {})  // TAQIQLANGAN!
  }

  ❌ nested function ichida:
  function handleClick() {
    const ref = useRef(null)  // TAQIQLANGAN!
  }

  ✅ TO'G'RI — faqat top level:
  function Component() {
    const [state, setState] = useState(0)     // ✅
    const ref = useRef(null)                  // ✅
    useEffect(() => {}, [])                   // ✅

    if (condition) {
      // hook-siz logika OK
    }
  }

NIMA UCHUN? React hook-larni TARTIB (index) bo'yicha saqlaydi.
Agar if ichida hook bo'lsa — tartib o'zgarishi mumkin:

  // Birinchi render:
  useState(0)    → hook[0]
  useEffect(fn)  → hook[1]
  useState('')   → hook[2]

  // Agar if tushib qolsa:
  // useState(0)    → hook[0]  ✅
  // [useEffect TUSHIB QOLDI]
  // useState('')   → hook[1]  ❌ Bu useEffect bo'lishi kerak edi!

═══════════════════════════════════════
  QOIDA 2: FAQAT REACT FUNKSIYALARDA
═══════════════════════════════════════

Hook-lar faqat:
  ✅ React komponent funksiyasi ichida
  ✅ Custom hook ichida (use* bilan boshlanadigan)

  ❌ Oddiy JavaScript funksiya ichida
  ❌ Class component ichida
  ❌ Event handler ichida (top level emas)

═══════════════════════════════════════
  ICHKI MEXANIZM
═══════════════════════════════════════

React har komponent uchun Fiber node yaratadi.
Fiber ichida hook-lar LINKED LIST sifatida saqlanadi:

  hook[0] → hook[1] → hook[2] → null

Har render-da React hook-larni TARTIB BO'YICHA o'qiydi:
  1-chi hook chaqiruv → hook[0]
  2-chi hook chaqiruv → hook[1]
  3-chi hook chaqiruv → hook[2]

Agar tartib o'zgarsa (if tufayli) — React NOTO'G'RI hook-ni qaytaradi.

═══════════════════════════════════════
  SHARTLI LOGIKA QANDAY QILINADI?
═══════════════════════════════════════

  // ❌ NOTO'G'RI:
  if (shouldFetch) {
    useEffect(() => { fetch(url) }, [url])
  }

  // ✅ TO'G'RI — hook ichida shart:
  useEffect(() => {
    if (shouldFetch) {
      fetch(url)
    }
  }, [url, shouldFetch])

  // ✅ TO'G'RI — enabled pattern:
  const { data } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    enabled: shouldFetch,  // false bo'lsa so'rov yuborMAYDI
  })

  // ✅ TO'G'RI — early return HOOKDAN KEYIN:
  const [data, setData] = useState(null)
  useEffect(() => { fetch(url) }, [url])

  if (!data) return <Loading />  // hook-lardan KEYIN`,
    codeExamples: [
      {
        title: 'Rules of Hooks — to\'g\'ri va noto\'g\'ri',
        language: 'tsx',
        code: `import { useState, useEffect } from 'react'

// ❌ NOTO'G'RI — shartli hook
function BadComponent({ showExtra }: { showExtra: boolean }) {
  const [name, setName] = useState('')

  // ❌ showExtra false bo'lsa — hook tartib buziladi!
  if (showExtra) {
    const [extra, setExtra] = useState('')  // TAQIQLANGAN
  }

  useEffect(() => { console.log('effect') }, [])

  return <div>{name}</div>
}

// ✅ TO'G'RI — barcha hook-lar top level
function GoodComponent({ showExtra }: { showExtra: boolean }) {
  const [name, setName] = useState('')
  const [extra, setExtra] = useState('')  // DOIM chaqiriladi
  useEffect(() => { console.log('effect') }, [])

  return (
    <div>
      <input value={name} onChange={e => setName(e.target.value)} />
      {showExtra && (
        <input value={extra} onChange={e => setExtra(e.target.value)} />
      )}
    </div>
  )
}

// ✅ TO'G'RI — shartli logika hook ICHIDA
function SearchComponent({ enabled }: { enabled: boolean }) {
  const [query, setQuery] = useState('')

  useEffect(() => {
    if (!enabled) return        // ✅ hook ichida shart
    if (!query) return

    const timer = setTimeout(() => {
      fetchResults(query)
    }, 300)

    return () => clearTimeout(timer)
  }, [query, enabled])

  return <input value={query} onChange={e => setQuery(e.target.value)} />
}

// ✅ TO'G'RI — early return hookdan KEYIN
function UserProfile({ userId }: { userId: string | null }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return
    fetchUser(userId).then(setUser).finally(() => setLoading(false))
  }, [userId])

  // Early return — barcha hook-lar YUQORIDA
  if (!userId) return <p>User tanlanmagan</p>
  if (loading) return <p>Yuklanmoqda...</p>

  return <h1>{user?.name}</h1>
}`,
        description: 'Hook-lar DOIM top level-da, DOIM bir xil tartibda. Shartli logika: hook ICHIDA if, yoki early return hook-lardan KEYIN. if ichida hook = XATO.',
      },
    ],
    interviewQA: [
      {
        question: 'Rules of Hooks nima?',
        answer: `2 ta qoida: 1) Hook-lar FAQAT top level-da — if, for, nested function ichida EMAS. 2) Hook-lar faqat React komponent yoki custom hook ichida. Sabab: React hook-larni TARTIB (index) bo'yicha linked list-da saqlaydi. Har render-da bir xil tartibda chaqirilishi kerak — aks holda React noto'g'ri hook qaytaradi. eslint-plugin-react-hooks bu qoidalarni tekshiradi.`,
      },
      {
        question: 'Nima uchun hook-ni if ichida ishlatib bo\'lmaydi?',
        answer: `React hook-larni TARTIB bo'yicha saqlaydi (linked list): 1-chi chaqiruv → hook[0], 2-chi → hook[1]. Agar if ichida hook bo'lsa va shart false bo'lsa — hook tushib qoladi, tartib siljiydi. React hook[1]-da useEffect kutadi, lekin aslida useState keladi — NOTO'G'RI natija. Yechim: hook DOIM top level-da, shartli logika hook ICHIDA: useEffect(() => { if (condition) {...} }, [condition]).`,
      },
    ],
    relatedTopics: [
      { sectionId: 'component-patterns', topicId: 'custom-hooks', label: 'Custom Hooks' },
      { sectionId: 'theory-questions', topicId: 'closures-in-hooks', label: 'Closures in Hooks' },
      { sectionId: 'theory-questions', topicId: 'fiber-architecture', label: 'Fiber (linked list)' },
    ],
  },
  {
    id: 'controlled-uncontrolled-theory',
    title: 'Controlled vs Uncontrolled',
    importance: 3,
    status: 'to-learn',
    description: 'Farqi, qachon nima ishlatiladi',
    content: `Controlled va Uncontrolled — React-da form elementlarni boshqarishning 2 ta usuli. "Kim boshqaradi?" — React yoki DOM.

═══════════════════════════════════════
  CONTROLLED KOMPONENT
═══════════════════════════════════════

React STATE boshqaradi — "single source of truth":

  function ControlledInput() {
    const [value, setValue] = useState('')
    return <input value={value} onChange={e => setValue(e.target.value)} />
  }

  - value — React state-dan keladi
  - onChange — har o'zgarishda setState
  - React har lahzada qiymatni BILADI
  - Input React-siz o'zgarMAYDI

═══════════════════════════════════════
  UNCONTROLLED KOMPONENT
═══════════════════════════════════════

DOM O'ZI boshqaradi — ref bilan o'qiladi:

  function UncontrolledInput() {
    const inputRef = useRef<HTMLInputElement>(null)

    function handleSubmit() {
      console.log(inputRef.current?.value)  // DOM-dan o'qish
    }

    return <input ref={inputRef} defaultValue="boshlangich" />
  }

  - defaultValue — boshlang'ich qiymat (keyin DOM boshqaradi)
  - ref — kerak bo'lganda DOM-dan o'qish
  - React har lahzadagi qiymatni BILMAYDI
  - Input DOM orqali erkin o'zgaradi

═══════════════════════════════════════
  QACHON NIMA
═══════════════════════════════════════

Controlled (ko'p hollarda):
  ✅ Real-time validatsiya
  ✅ Shartli submit button (disabled)
  ✅ Input format (masalan telefon raqam)
  ✅ Bir nechta input bog'liq (form state)
  ✅ Dynamic form

Uncontrolled (maxsus holatlar):
  ✅ File input (<input type="file"> — FAQAT uncontrolled)
  ✅ Oddiy form (submit-da o'qish yetarli)
  ✅ Third-party DOM kutubxonalari
  ✅ Performance (har keystroke-da setState yo'q)

═══════════════════════════════════════
  ANTI-PATTERN
═══════════════════════════════════════

  // ❌ Ikkalasini aralashtirish — value + defaultValue
  <input value={state} defaultValue="default" />
  // React ogohlantiradi!

  // ❌ value bersiz, onChange bermaslik
  <input value="fixed" />
  // Input o'zgarMAYDI — foydalanuvchi yoza OLMAYDI`,
    codeExamples: [
      {
        title: 'Controlled vs Uncontrolled — taqqoslash',
        language: 'tsx',
        code: `import { useState, useRef } from 'react'

// ✅ CONTROLLED — React boshqaradi
function ControlledForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const isValid = email.includes('@') && password.length >= 8

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    console.log({ email, password })  // state-dan
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={email} onChange={e => setEmail(e.target.value)}
        placeholder="Email" />
      {email && !email.includes('@') && (
        <p className="text-red-500">Email noto'g'ri</p>  // Real-time validation
      )}

      <input type="password" value={password}
        onChange={e => setPassword(e.target.value)} placeholder="Parol" />
      {password && password.length < 8 && (
        <p className="text-red-500">Kamida 8 belgi</p>
      )}

      <button disabled={!isValid}>Kirish</button>  {/* Shartli disable */}
    </form>
  )
}

// ✅ UNCONTROLLED — DOM boshqaradi
function UncontrolledForm() {
  const formRef = useRef<HTMLFormElement>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    console.log({
      email: formData.get('email'),      // DOM-dan o'qish
      password: formData.get('password'),
    })
  }

  function handleReset() {
    formRef.current?.reset()  // DOM method
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <input name="email" defaultValue="" placeholder="Email" />
      <input name="password" type="password" placeholder="Parol" />
      <button type="submit">Kirish</button>
      <button type="button" onClick={handleReset}>Tozalash</button>
    </form>
  )
}

// File input — FAQAT uncontrolled
function FileUpload() {
  const fileRef = useRef<HTMLInputElement>(null)

  function handleUpload() {
    const file = fileRef.current?.files?.[0]
    if (file) {
      console.log(file.name, file.size)
    }
  }

  return (
    <div>
      <input type="file" ref={fileRef} />
      <button onClick={handleUpload}>Yuklash</button>
    </div>
  )
}`,
        description: 'Controlled: value + onChange, real-time validatsiya, shartli disable. Uncontrolled: defaultValue + ref/FormData, submit-da o\'qish. File input — faqat uncontrolled.',
      },
    ],
    interviewQA: [
      {
        question: 'Controlled va uncontrolled komponent farqi nima?',
        answer: `Controlled — React STATE boshqaradi: value={state} + onChange={setState}. React har lahzada qiymatni biladi. Uncontrolled — DOM O'ZI boshqaradi: defaultValue + ref bilan kerak bo'lganda o'qish. React oraliq qiymatlarni bilMAYDI. Controlled afzalliklari: real-time validatsiya, format, shartli disable. Uncontrolled afzalliklari: kam kod, performance (har keystroke-da re-render yo'q). Ko'p hollarda Controlled tavsiya etiladi.`,
      },
      {
        question: 'Nima uchun file input faqat uncontrolled?',
        answer: `<input type="file"> — brauzer xavfsizligi tufayli JavaScript-dan value O'ZGARTIRIB BO'LMAYDI. Faqat foydalanuvchi tanlashi mumkin. Shuning uchun value prop berish mumkin emas — faqat ref bilan o'qish. fileRef.current.files — tanlangan fayllar ro'yxati. Bu brauzerning xavfsizlik cheklovi — script fayllarni o'zboshimchalik bilan tanlay olmasligi kerak.`,
      },
    ],
    relatedTopics: [
      { sectionId: 'component-patterns', topicId: 'controlled-vs-uncontrolled', label: 'Amaliy pattern' },
      { sectionId: 'react-core', topicId: 'use-ref', label: 'useRef (uncontrolled)' },
    ],
  },
  {
    id: 'key-importance',
    title: 'Key nima uchun kerak?',
    importance: 3,
    status: 'to-learn',
    description: 'Reconciliation, list performance',
    content: `Key — React reconciliation-da elementlarni identifikatsiya qilish uchun. Ro'yxatlarda MAJBURIY. Noto'g'ri key — buglar va performance muammo.

Bu mavzu Performance bo'limida batafsil yoritilgan. Asosiy fikrlar:

═══════════════════════════════════════
  KEY QANDAY ISHLAYDI
═══════════════════════════════════════

React ro'yxat yangilanganda KEY orqali aniqlaydi:
  - Qaysi element QOLDI (key saqlanadi)
  - Qaysi element QO'SHILDI (yangi key)
  - Qaysi element O'CHIRILDI (key yo'qoldi)
  - Qaysi element O'RNI O'ZGARDI (key boshqa joyda)

Key-siz React TARTIB bo'yicha taqqoslaydi — element boshiga qo'shilsa BARCHA element "o'zgardi" deb hisoblanadi.

═══════════════════════════════════════
  INDEX KEY MUAMMOSI
═══════════════════════════════════════

  items.map((item, index) => <Item key={index} />)

Boshiga element qo'shilsa:
  Eski: [A(0), B(1), C(2)]
  Yangi: [X(0), A(1), B(2), C(3)]

  Index bilan: 0→0, 1→1, 2→2 — React BARCHA elementni "o'zgardi" deb o'ylaydi
  Unique key bilan: X yangi, A/B/C qoldi — faqat X renderlanadi

Index key xavfsiz FAQAT:
  ✅ Ro'yxat O'ZGARMASA
  ✅ Tartib O'ZGARMAS
  ✅ Filter/sort YO'Q

═══════════════════════════════════════
  KEY BILAN KOMPONENT RESET
═══════════════════════════════════════

Key o'zgarsa — React komponentni QAYTADAN yaratadi:
  <Form key={userId} userId={userId} />

userId o'zgarsa — Form unmount/mount → state tozalanadi.
Bu useEffect + setState bilan reset-dan soddaro va xavfsizroq.`,
    codeExamples: [
      {
        title: 'Key ahamiyati — vizual demo',
        language: 'tsx',
        code: `import { useState } from 'react'

// Key muammosini ko'rsatish
function KeyDemo() {
  const [items, setItems] = useState([
    { id: 'a', text: 'Birinchi' },
    { id: 'b', text: 'Ikkinchi' },
    { id: 'c', text: 'Uchinchi' },
  ])

  function addToStart() {
    setItems(prev => [
      { id: crypto.randomUUID(), text: \`Yangi (\${Date.now()})\` },
      ...prev,
    ])
  }

  function shuffle() {
    setItems(prev => [...prev].sort(() => Math.random() - 0.5))
  }

  return (
    <div>
      <button onClick={addToStart}>Boshiga qo'shish</button>
      <button onClick={shuffle}>Aralashtirish</button>

      <h3>Unique key (to'g'ri):</h3>
      {items.map(item => (
        <div key={item.id} className="flex gap-2">
          <span>{item.text}</span>
          <input defaultValue={item.text} />
        </div>
      ))}

      <h3>Index key (noto'g'ri):</h3>
      {items.map((item, i) => (
        <div key={i} className="flex gap-2">
          <span>{item.text}</span>
          <input defaultValue={item.text} />
        </div>
      ))}
    </div>
  )
}`,
        description: 'Index key bilan boshiga qo\'shish/aralashtirish — input qiymatlari aralashib ketadi. Unique key bilan — har element o\'z joyida qoladi.',
      },
    ],
    interviewQA: [
      {
        question: 'Key nima uchun kerak va qanday ishlaydi?',
        answer: `Key — React reconciliation-da elementlarni identifikatsiya qilish. Ro'yxat yangilanganda React key orqali: qaysi qoldi, qo'shildi, o'chirildi — aniqlaydi. Key yo'q = tartib bo'yicha taqqoslash (noto'g'ri natija). Key unique va doimiy bo'lishi kerak: database ID eng yaxshi. Key React ichki mexanizm — props sifatida komponentga uzatilMAYDI.`,
      },
      {
        question: 'Index key qachon xavfsiz, qachon xavfli?',
        answer: `XAVFSIZ: ro'yxat hech o'zgarMAsa, tartib o'zgarMAsa, element qo'shilMAsa/o'chirilMAsa. Amalda deyarli hech qachon. XAVFLI: element qo'shilsa/o'chirilsa (index siljiydi), sort/filter qilinsa, uncontrolled input bo'lsa (defaultValue aralashadi), animatsiya bo'lsa. Doim unique ID ishlatish — xavfsiz va muammosiz.`,
      },
    ],
    relatedTopics: [
      { sectionId: 'performance', topicId: 'key-prop', label: 'Key Prop (amaliy)' },
      { sectionId: 'react-core', topicId: 'virtual-dom', label: 'Reconciliation' },
    ],
  },
  {
    id: 'effect-vs-layout-effect',
    title: 'useEffect vs useLayoutEffect',
    importance: 2,
    status: 'to-learn',
    description: 'Qachon nima, paint oldin/keyin',
    content: `useEffect va useLayoutEffect — ikkalasi ham side effect uchun. Farqi — QACHON ishlaydi.

═══════════════════════════════════════
  TARTIB
═══════════════════════════════════════

  Render → DOM commit → useLayoutEffect → PAINT → useEffect

useLayoutEffect — DOM yangilangandan KEYIN, brauzer PAINT qilishdan OLDIN.
  SINXRON ishlaydi — brauzer KUTADI.

useEffect — brauzer PAINT qilgandan KEYIN.
  ASINXRON ishlaydi — brauzer kutMAYDI.

═══════════════════════════════════════
  QACHON useLayoutEffect
═══════════════════════════════════════

useLayoutEffect kerak:
  ✅ DOM O'LCHASH kerak (element hajmi, pozitsiya)
  ✅ DOM o'zgartirish kerak (scroll pozitsiya)
  ✅ Flickering oldini olish (ko'rish → o'zgarish)
  ✅ Tooltip/popover pozitsiya hisoblash

useEffect yetarli (KO'P HOLLARDA):
  ✅ API so'rov
  ✅ Subscription (WebSocket, event listener)
  ✅ Timer (setTimeout, setInterval)
  ✅ Analytics, logging
  ✅ State yangilash (async natija bilan)

Qoida: AVVAL useEffect sinab ko'ring.
Faqat flickering bo'lsa — useLayoutEffect.`,
    codeExamples: [
      {
        title: 'useLayoutEffect — flickering oldini olish',
        language: 'tsx',
        code: `import { useState, useEffect, useLayoutEffect, useRef } from 'react'

// ❌ useEffect — flickering (qisqa vaqt noto'g'ri pozitsiya ko'rinadi)
function BadTooltip({ text }: { text: string }) {
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Paint KEYIN hisoblaydi — avval noto'g'ri joyda ko'rinadi
    const rect = ref.current?.getBoundingClientRect()
    if (rect) {
      setPosition({ top: rect.bottom, left: rect.left })
    }
  }, [])

  return <div ref={ref} style={{ top: position.top, left: position.left }}>{text}</div>
}

// ✅ useLayoutEffect — flickering YO'Q
function GoodTooltip({ text }: { text: string }) {
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    // Paint OLDIN hisoblaydi — foydalanuvchi faqat to'g'ri pozitsiyani ko'radi
    const rect = ref.current?.getBoundingClientRect()
    if (rect) {
      setPosition({ top: rect.bottom, left: rect.left })
    }
  }, [])

  return <div ref={ref} style={{ top: position.top, left: position.left }}>{text}</div>
}

// useEffect — ko'p hollarda TO'G'RI
function DataFetcher({ url }: { url: string }) {
  const [data, setData] = useState(null)

  useEffect(() => {
    // API so'rov — paint KEYIN, flickering ahamiyatsiz
    fetch(url).then(r => r.json()).then(setData)
  }, [url])

  return <div>{JSON.stringify(data)}</div>
}`,
        description: 'useLayoutEffect — DOM o\'lchash va pozitsiya hisoblash (flickering oldini olish). useEffect — API, subscription, timer (ko\'p hollarda). Qoida: avval useEffect, flickering bo\'lsa useLayoutEffect.',
      },
    ],
    interviewQA: [
      {
        question: 'useEffect va useLayoutEffect farqi nima?',
        answer: `Tartib: render → DOM commit → useLayoutEffect → PAINT → useEffect. useLayoutEffect — sinxron, paint OLDIN, brauzer KUTADI. DOM o'lchash, pozitsiya hisoblash, flickering oldini olish uchun. useEffect — asinxron, paint KEYIN. API, subscription, timer uchun. 99% hollarda useEffect yetarli. useLayoutEffect — faqat foydalanuvchi "qisqa vaqt noto'g'ri ko'rinish" ko'rsa kerak.`,
      },
      {
        question: 'useLayoutEffect nima uchun ehtiyot bo\'lish kerak?',
        answer: `useLayoutEffect SINXRON — brauzer paint qilishni KUTADI. Agar qimmat hisoblash bo'lsa — UI blokirovka (freeze). Shuning uchun: 1) Faqat DOM o'lchash uchun (tez operatsiya), 2) Og'ir logika qo'yMANG, 3) SSR-da ishlaMAYDI (server-da DOM yo'q) — ogohlantirish beradi. Qoida: avval useEffect ishlatish, flickering muammo bo'lsa useLayoutEffect.`,
      },
    ],
    relatedTopics: [
      { sectionId: 'react-core', topicId: 'use-effect', label: 'useEffect' },
      { sectionId: 'react-core', topicId: 'use-layout-effect', label: 'useLayoutEffect' },
      { sectionId: 'react-core', topicId: 'rendering-cycle', label: 'Rendering Cycle' },
    ],
  },
  {
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
      { sectionId: 'react-core', topicId: 'use-context', label: 'useContext (yechim)' },
      { sectionId: 'state-management', topicId: 'context-api', label: 'Context API' },
      { sectionId: 'state-management', topicId: 'when-to-use-what', label: 'Qachon nima ishlatish' },
      { sectionId: 'component-patterns', topicId: 'composition-vs-inheritance', label: 'Composition (yechim)' },
    ],
  },
  {
    id: 'ssr-csr-ssg',
    title: 'SSR vs CSR vs SSG',
    importance: 3,
    status: 'to-learn',
    description: 'Farqlari, qachon nima ishlatiladi',
    content: `Rendering strategiyalari — HTML QAYERDA va QACHON yaratiladi. Har birining o'z afzalligi va kamchiligi bor.

═══════════════════════════════════════
  CSR — CLIENT-SIDE RENDERING
═══════════════════════════════════════

Brauzer JavaScript-ni yuklab, HTML-ni BRAUZERDA yaratadi.

  1. Server bo'sh HTML yuboradi (<div id="root"></div>)
  2. JS bundle yuklanadi (500KB+)
  3. React ishlaydi → DOM yaratadi
  4. Foydalanuvchi kontentni ko'radi

  ✅ Tez navigatsiya (SPA — sahifa qayta yuklanmaydi)
  ✅ Rich interactivity
  ✅ Server yuki kam
  ✅ Sodda deploy (static hosting)

  ❌ LCP sekin (JS yuklanguncha bo'sh sahifa)
  ❌ SEO muammo (bot bo'sh HTML ko'radi)
  ❌ Katta JS bundle

Qachon: dashboard, admin panel, SaaS ilova (SEO muhim emas).

═══════════════════════════════════════
  SSR — SERVER-SIDE RENDERING
═══════════════════════════════════════

Server HAR SO'ROVDA HTML yaratib yuboradi.

  1. Server React komponentni HTML-ga aylantiradi
  2. Tayyor HTML brauzerga yuboriladi
  3. Foydalanuvchi kontentni DARHOL ko'radi
  4. JS yuklanadi → hydration → interaktiv bo'ladi

  ✅ Tez LCP (HTML darhol ko'rinadi)
  ✅ SEO yaxshi (bot tayyor HTML ko'radi)
  ✅ Social media preview ishlaydi

  ❌ Server yuki katta (har so'rovda render)
  ❌ TTFB sekin (server render vaqti)
  ❌ Hydration vaqtida interaktivlik yo'q
  ❌ Server infra kerak

Qachon: e-commerce, blog, marketing sahifa (SEO muhim).

═══════════════════════════════════════
  SSG — STATIC SITE GENERATION
═══════════════════════════════════════

BUILD VAQTIDA HTML yaratiladi (deploy oldin).

  1. Build vaqtida barcha sahifalar HTML-ga aylantiriladi
  2. Tayyor HTML CDN-ga qo'yiladi
  3. Foydalanuvchi CDN-dan DARHOL oladi

  ✅ Eng tez (CDN-dan static fayl)
  ✅ SEO yaxshi
  ✅ Server yuki YO'Q
  ✅ Arzon (static hosting)

  ❌ Build vaqtida ma'lumot kerak (dynamic emas)
  ❌ Har o'zgarishda qayta build kerak
  ❌ Ko'p sahifa = uzoq build

Qachon: blog, dokumentatsiya, portfolio (kamdan-kam o'zgaradigan kontent).

═══════════════════════════════════════
  ISR — INCREMENTAL STATIC REGENERATION
═══════════════════════════════════════

SSG + SSR aralashmasi (Next.js):
  - Birinchi so'rov — static HTML (SSG kabi)
  - Belgilangan vaqtda background-da qayta build
  - Yangi versiya tayyor bo'lganda almashtiradi

  ✅ Static tezlik
  ✅ Yangi data (revalidate bilan)
  ✅ Server yuki kam

Qachon: e-commerce katalog, news, blog (tez-tez yangilanadigan static kontent).`,
    codeExamples: [
      {
        title: 'CSR vs SSR vs SSG — farq',
        language: 'tsx',
        code: `// ===== CSR (Vite + React) =====
// Server yuboradi:
// <html><body><div id="root"></div><script src="app.js"></script></body></html>
// Brauzer app.js yuklaydi → React DOM yaratadi

// Vite + React = CSR (bu loyiha)
// index.html → main.tsx → App → Router → Pages

// ===== SSR (Next.js) =====
// pages/users.tsx (Pages Router)
export async function getServerSideProps() {
  const res = await fetch('https://api.example.com/users')
  const users = await res.json()
  return { props: { users } }  // HAR SO'ROVDA server-da
}

export default function UsersPage({ users }: { users: User[] }) {
  return (
    <ul>
      {users.map(u => <li key={u.id}>{u.name}</li>)}
    </ul>
  )
}
// Server tayyor HTML yuboradi → brauzer hydrate qiladi

// ===== SSG (Next.js) =====
export async function getStaticProps() {
  const res = await fetch('https://api.example.com/posts')
  const posts = await res.json()
  return {
    props: { posts },
    revalidate: 60,  // ISR: 60 sekundda qayta build
  }
}

export default function BlogPage({ posts }: { posts: Post[] }) {
  return (
    <div>
      {posts.map(p => <article key={p.id}><h2>{p.title}</h2></article>)}
    </div>
  )
}
// BUILD vaqtida HTML yaratiladi → CDN-dan xizmat qilinadi

// ===== Taqqoslash =====
// CSR:  [] → [JS yuklash] → [Render] → [Ko'rish]     (sekin FCP)
// SSR:  [Server render] → [Ko'rish] → [JS] → [Hydrate] (tez FCP)
// SSG:  [CDN] → [Ko'rish] → [JS] → [Hydrate]           (eng tez)`,
        description: 'CSR: brauzer render (SPA). SSR: server har so\'rovda render (getServerSideProps). SSG: build vaqtida render (getStaticProps). ISR: SSG + revalidate.',
      },
    ],
    interviewQA: [
      {
        question: 'CSR, SSR, SSG farqi nima?',
        answer: `CSR — brauzer JS yuklaydi va render qiladi. Tez navigatsiya, lekin sekin initial load, SEO yomon. SSR — server HAR SO'ROVDA HTML yaratadi. Tez FCP, yaxshi SEO, lekin server yuki katta. SSG — BUILD vaqtida HTML yaratiladi, CDN-dan xizmat. Eng tez, lekin dynamic emas. ISR — SSG + background revalidation. Qoida: SEO kerak + dynamic → SSR. SEO kerak + static → SSG. SEO kerak emas → CSR.`,
      },
      {
        question: 'SPA (CSR) da SEO muammosi nima?',
        answer: `SPA server-dan bo'sh HTML oladi (<div id="root"></div>). Google bot JS ishga tushirsa ham — VAQT KERAK. Boshqa botlar (Facebook, Twitter) JS ishga tushirMAYDI — social media preview ishlaMAYDI. Yechimlar: 1) SSR — server tayyor HTML beradi, 2) SSG — build vaqtida HTML, 3) Prerendering — maxsus bot uchun static HTML, 4) Dynamic rendering — bot uchun SSR, user uchun CSR. Ko'p SPA-lar uchun SSR/SSG shart emas — dashboard, admin panel SEO kerak emas.`,
      },
    ],
    relatedTopics: [
      { sectionId: 'theory-questions', topicId: 'hydration', label: 'Hydration' },
      { sectionId: 'theory-questions', topicId: 'server-components', label: 'Server Components' },
      { sectionId: 'performance', topicId: 'web-vitals', label: 'Core Web Vitals' },
    ],
  },
  {
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
      { sectionId: 'theory-questions', topicId: 'concurrent-mode', label: 'Concurrent Features' },
      { sectionId: 'theory-questions', topicId: 'server-components', label: 'Server Components' },
      { sectionId: 'performance', topicId: 'react-compiler', label: 'React Compiler' },
      { sectionId: 'react-core', topicId: 'batching', label: 'Automatic Batching' },
    ],
  },
  {
    id: 'rest-vs-graphql',
    title: 'REST vs GraphQL',
    importance: 2,
    status: 'to-learn',
    description: 'Farqi, qachon nima ishlatiladi',
    content: `REST va GraphQL — API arxitektura usullari. Har birining kuchli va zaif tomonlari bor.

═══════════════════════════════════════
  REST
═══════════════════════════════════════

  GET /api/users          — barcha userlar
  GET /api/users/123      — bitta user
  POST /api/users         — yangi user
  PUT /api/users/123      — yangilash
  DELETE /api/users/123   — o'chirish

  ✅ Oddiy va tushunarli
  ✅ HTTP cache ishlatadi
  ✅ Keng tarqalgan (standart)
  ✅ Har endpoint o'z URL-i

  ❌ Over-fetching (kerakdan ortiq data)
  ❌ Under-fetching (bitta sahifa uchun ko'p so'rov)
  ❌ Versiya boshqarish (/v1/, /v2/)

═══════════════════════════════════════
  GRAPHQL
═══════════════════════════════════════

Bitta endpoint, client NIMA KERAKLIGINI aytadi:

  POST /graphql
  {
    query: "{ user(id: 123) { name, email, posts { title } } }"
  }

  ✅ Client kerakli ma'lumotni tanlaydi (over-fetching yo'q)
  ✅ Bitta so'rov bilan ko'p data (under-fetching yo'q)
  ✅ Strong typing (schema)
  ✅ Introspection (self-documenting)

  ❌ Murakkabrok (o'rganish, setup)
  ❌ HTTP cache qiyin (bitta endpoint)
  ❌ N+1 query muammosi (server da)
  ❌ Over-engineering kichik loyihalar uchun

═══════════════════════════════════════
  QACHON NIMA
═══════════════════════════════════════

REST: ko'p hollarda, oddiy CRUD, kichik-o'rta loyiha, public API.
GraphQL: murakkab data talablar, mobil + web (farqli data kerak), katta loyiha, microservice aggregation.`,
    codeExamples: [
      {
        title: 'REST vs GraphQL — React-da',
        language: 'tsx',
        code: `// ===== REST bilan (TanStack Query) =====
function UserProfile({ userId }: { userId: string }) {
  // 3 ta alohida so'rov kerak
  const { data: user } = useQuery({
    queryKey: ['users', userId],
    queryFn: () => fetch(\`/api/users/\${userId}\`).then(r => r.json()),
  })

  const { data: posts } = useQuery({
    queryKey: ['users', userId, 'posts'],
    queryFn: () => fetch(\`/api/users/\${userId}/posts\`).then(r => r.json()),
    enabled: !!user,
  })

  const { data: followers } = useQuery({
    queryKey: ['users', userId, 'followers'],
    queryFn: () => fetch(\`/api/users/\${userId}/followers\`).then(r => r.json()),
    enabled: !!user,
  })

  // 3 ta so'rov, user-dan ko'p keraksiz maydon kelishi mumkin
  return <div>...</div>
}

// ===== GraphQL bilan =====
// BITTA so'rov — faqat kerakli maydonlar
const USER_PROFILE_QUERY = \`
  query UserProfile($id: ID!) {
    user(id: $id) {
      name
      avatar
      posts(limit: 5) {
        id
        title
      }
      followersCount
    }
  }
\`

function UserProfile({ userId }: { userId: string }) {
  const { data } = useQuery({
    queryKey: ['userProfile', userId],
    queryFn: () => fetch('/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: USER_PROFILE_QUERY,
        variables: { id: userId },
      }),
    }).then(r => r.json()).then(r => r.data),
  })

  // 1 ta so'rov, faqat kerakli maydonlar
  return <div>...</div>
}`,
        description: 'REST: 3 ta alohida endpoint, over-fetching mumkin. GraphQL: 1 ta so\'rov, faqat kerakli maydonlar. Murakkab sahifalar uchun GraphQL kamroq so\'rov.',
      },
    ],
    interviewQA: [
      {
        question: 'REST va GraphQL farqi nima?',
        answer: `REST: har resurs uchun alohida endpoint (/users, /posts), HTTP metod bilan CRUD, HTTP cache ishlaydi, oddiy va keng tarqalgan. GraphQL: bitta endpoint (/graphql), client kerakli ma'lumotni query bilan tanlaydi, strong typing (schema), introspection. REST muammo: over-fetching (keraksiz data) va under-fetching (ko'p so'rov). GraphQL yechadi: faqat kerakli maydonlar, bitta so'rovda ko'p data.`,
      },
      {
        question: 'Qachon REST, qachon GraphQL?',
        answer: `REST: ko'p hollarda yetarli, oddiy CRUD, public API, kichik-o'rta loyiha, HTTP caching muhim. GraphQL: murakkab va bog'liq data (user+posts+comments bitta so'rovda), mobil + web (farqli data talablar), microservice aggregation (bitta GraphQL gateway), real-time (subscriptions). Kichik loyihalar uchun GraphQL over-engineering — REST yetarli. Katta loyihalar uchun GraphQL vaqtni tejaydi.`,
      },
    ],
    relatedTopics: [
      { sectionId: 'state-management', topicId: 'tanstack-query', label: 'TanStack Query' },
      { sectionId: 'state-management', topicId: 'rtk-query', label: 'RTK Query' },
    ],
  },

  // ===== YANGI MAVZULAR =====
  {
    id: 'closures-in-hooks',
    title: 'Closures in Hooks (Stale Closures)',
    importance: 3,
    status: 'to-learn',
    description: 'Eskirgan closure muammosi — useEffect, useCallback, setTimeout ichida',
    content: `Stale closure — hook-lar ichida ESKI render-dagi qiymatni ishlatish muammosi. React-ning eng ko'p uchraydigan bug-laridan biri.

═══════════════════════════════════════
  CLOSURE NIMA
═══════════════════════════════════════

Closure — funksiya yaratilgan scope-dagi o'zgaruvchilarni "eslab qolishi".

  function outer() {
    const x = 10
    function inner() {
      console.log(x)  // x ni "eslab qoladi"
    }
    return inner
  }

React-da HAR RENDER yangi closure yaratadi:
  function Counter() {
    const [count, setCount] = useState(0)
    // count — SHU render-dagi qiymat (closure)
    // Keyingi render-da YANGI count, YANGI closure
  }

═══════════════════════════════════════
  STALE CLOSURE MUAMMOSI
═══════════════════════════════════════

  function Counter() {
    const [count, setCount] = useState(0)

    useEffect(() => {
      const timer = setInterval(() => {
        console.log(count)  // DOIM 0! (birinchi render-dagi closure)
      }, 1000)
      return () => clearInterval(timer)
    }, [])  // ← bo'sh deps! Effect faqat mount-da ishlaydi

    return <p>{count}</p>
  }

Muammo: useEffect faqat mount-da yaratiladi ([] deps).
Ichidagi closure birinchi render-dagi count=0 ni "eslab qoladi".
count o'zgarsa ham — closure ESKi qiymatni ko'radi.

═══════════════════════════════════════
  YECHIMLAR
═══════════════════════════════════════

1. TO'G'RI DEPENDENCY:
   useEffect(() => {
     const timer = setInterval(() => console.log(count), 1000)
     return () => clearInterval(timer)
   }, [count])  // count o'zgarsa effect qayta yaratiladi

2. UPDATER FUNCTION:
   setCount(prev => prev + 1)  // prev DOIM eng yangi

3. useRef (mutable reference):
   const countRef = useRef(count)
   countRef.current = count  // har renderda yangilanadi

   useEffect(() => {
     const timer = setInterval(() => {
       console.log(countRef.current)  // DOIM yangi qiymat
     }, 1000)
     return () => clearInterval(timer)
   }, [])`,
    codeExamples: [
      {
        title: 'Stale closure muammosi va yechimlari',
        language: 'tsx',
        code: `import { useState, useEffect, useRef, useCallback } from 'react'

// ❌ STALE CLOSURE
function BadTimer() {
  const [count, setCount] = useState(0)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      setMessage(\`3 sekund oldin count = \${count}\`)
      // count DOIM boshlang'ich qiymati (stale!)
    }, 3000)
    return () => clearTimeout(timer)
  }, [])  // ← bo'sh deps

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>+1</button>
      <p>{message}</p>
    </div>
  )
}

// ✅ YECHIM 1: to'g'ri dependency
function GoodTimer1() {
  const [count, setCount] = useState(0)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      setMessage(\`3 sekund oldin count = \${count}\`)
    }, 3000)
    return () => clearTimeout(timer)
  }, [count])  // ← count deps-da — har o'zgarishda yangi timer

  return <div>...</div>
}

// ✅ YECHIM 2: useRef (timer o'zgarmasligi kerak bo'lganda)
function GoodTimer2() {
  const [count, setCount] = useState(0)
  const countRef = useRef(count)

  // Har renderda ref yangilanadi
  countRef.current = count

  useEffect(() => {
    const timer = setInterval(() => {
      // ref.current DOIM eng yangi qiymat
      console.log('Hozirgi count:', countRef.current)
    }, 1000)
    return () => clearInterval(timer)
  }, [])  // Effect faqat 1 marta, lekin ref yangi

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>+1</button>
    </div>
  )
}

// ✅ YECHIM 3: updater function (setState uchun)
function GoodCounter() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCount(prev => prev + 1)  // prev DOIM eng yangi
      // setCount(count + 1) ← XATO! count stale bo'ladi
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return <p>Count: {count}</p>
}`,
        description: 'Stale closure: bo\'sh deps bilan effect eski qiymatni ko\'radi. Yechimlar: 1) to\'g\'ri deps, 2) useRef (mutable), 3) updater function (prev => prev + 1).',
      },
    ],
    interviewQA: [
      {
        question: 'Stale closure nima?',
        answer: `Stale closure — hook ichidagi funksiya ESKI render-dagi qiymatni ishlatishi. Sabab: React har renderda yangi closure yaratadi. Agar useEffect/useCallback/setTimeout bo'sh dependency bilan yaratilsa — birinchi render-dagi qiymatni "eslab qoladi". count o'zgarsa ham closure ESKi count ko'radi. Yechimlar: 1) dependency-ga qo'shish, 2) useRef (mutable reference), 3) updater function (prev => prev + 1).`,
      },
      {
        question: 'useRef stale closure-ni qanday hal qiladi?',
        answer: `useRef — renderlar orasida MUTABLE reference saqlaydi. ref.current o'zgarganda re-render bo'lMAYDI. Pattern: const countRef = useRef(count); countRef.current = count (har renderda yangilanadi). Effect ichida: countRef.current — DOIM eng yangi qiymat. Chunki ref ob'ekt referensi O'ZGARMAYDI, faqat .current o'zgaradi. Effect closure eski ref ni ko'rsa ham — ref.current yangi qiymat.`,
      },
    ],
    relatedTopics: [
      { sectionId: 'react-core', topicId: 'use-effect', label: 'useEffect dependencies' },
      { sectionId: 'react-core', topicId: 'use-callback', label: 'useCallback dependencies' },
      { sectionId: 'react-core', topicId: 'use-ref', label: 'useRef (yechim)' },
      { sectionId: 'theory-questions', topicId: 'rules-of-hooks', label: 'Rules of Hooks' },
    ],
  },
  {
    id: 'fiber-architecture',
    title: 'Fiber Architecture',
    importance: 3,
    status: 'to-learn',
    description: 'Fiber nima, linked list, work loop, prioritet tizimi',
    content: `React Fiber — React 16 da qayta yozilgan ichki arxitektura. Rendering-ni TO'XTATISH va DAVOM ETTIRISH imkonini beradi. Concurrent Mode-ning asosi.

═══════════════════════════════════════
  ESKI ARXITEKTURA (Stack Reconciler)
═══════════════════════════════════════

React 15 da rendering SINXRON edi:
  render() → diff → DOM update
  Butun daraxt BIR YO'LA qayta ishlanardi.
  Agar daraxt katta bo'lsa — UI 100ms+ bloklangardi.

═══════════════════════════════════════
  FIBER NIMA
═══════════════════════════════════════

Fiber — har komponent uchun VIRTUAL STACK FRAME.
Har komponent = bitta Fiber node.

Fiber node saqlaydigan ma'lumotlar:
  - type — komponent tipi (function, class, DOM)
  - props — hozirgi props
  - state — hozirgi state
  - hooks — linked list (useState, useEffect...)
  - child — birinchi bola fiber
  - sibling — keyingi aka-uka fiber
  - return — ota fiber
  - effectTag — nima qilish kerak (placement, update, deletion)

Fiber daraxt = LINKED LIST:
  App
  ├── child → Header
  │            └── sibling → Main
  │                          └── sibling → Footer
  └── Header.child → Logo
                      └── sibling → Nav

═══════════════════════════════════════
  WORK LOOP
═══════════════════════════════════════

Fiber rendering 2 bosqich:

1. RENDER PHASE (to'xtatilishi mumkin):
   - Har bir fiber "unit of work"
   - Bitta fiber ishlab bo'lgach — brauzerga nazoratni qaytarishi mumkin
   - Yuqori prioritetli ish bo'lsa — hozirgi ishni TO'XTATADI

2. COMMIT PHASE (to'xtatilishi MUMKIN EMAS):
   - Barcha DOM o'zgarishlar BIR YO'LA qo'llaniladi
   - Foydalanuvchi qisman yangilangan DOM ko'rMAYDI

Bu nima uchun muhim?
  ✅ 60fps — har frame 16ms ichida
  ✅ Input responsive — foydalanuvchi yozayotganda UI bloklaNMAYDI
  ✅ Prioritetli yangilanish — muhim narsa avval

═══════════════════════════════════════
  PRIORITET TIZIMI
═══════════════════════════════════════

React yangilanishlarni PRIORITET bo'yicha tartibga soladi:

  Yuqori: Foydalanuvchi input (click, type) — DARHOL
  O'rta:  Animatsiya — har frame
  Past:   Data fetching natijasi — keyinroq
  Eng past: Offscreen rendering — bo'sh vaqtda

useTransition — yangilanishni PAST prioritet qilish:
  startTransition(() => setFilteredItems(filter(items)))

useDeferredValue — qiymatni PAST prioritet qilish:
  const deferredQuery = useDeferredValue(query)`,
    codeExamples: [
      {
        title: 'Fiber tuzilmasi — vizual',
        language: 'tsx',
        code: `// React komponent daraxt:
function App() {
  return (
    <div>
      <Header />
      <Main>
        <Sidebar />
        <Content />
      </Main>
    </div>
  )
}

// Fiber daraxt (linked list):
//
// App (fiber)
//  │
//  └─ child ──► div (fiber)
//                │
//                └─ child ──► Header (fiber)
//                              │
//                              └─ sibling ──► Main (fiber)
//                                              │
//                                              └─ child ──► Sidebar (fiber)
//                                                            │
//                                                            └─ sibling ──► Content (fiber)
//
// Har fiber:
// {
//   type: Header,
//   child: null,           // birinchi bola
//   sibling: Main-fiber,   // keyingi aka-uka
//   return: div-fiber,     // ota
//   hooks: [               // useState, useEffect...
//     { state: ..., next: hook2 },
//     { effect: ..., next: null },
//   ],
//   effectTag: 'UPDATE',   // nima qilish kerak
// }

// Work Loop (taxminiy):
// function workLoop(deadline) {
//   while (nextUnitOfWork && deadline.timeRemaining() > 0) {
//     nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
//   }
//   if (!nextUnitOfWork) {
//     commitRoot()  // barcha DOM o'zgarishlar
//   }
//   requestIdleCallback(workLoop)
// }

// performUnitOfWork:
// 1. Fiber-ni ishlab chiqish (render)
// 2. child bo'lsa → child-ga o'tish
// 3. child yo'q → sibling-ga o'tish
// 4. sibling yo'q → return (ota) ga qaytish`,
        description: 'Fiber = linked list: child (bola), sibling (aka-uka), return (ota). Work loop: har fiber = 1 unit of work, brauzerga nazorat qaytarish mumkin. Hooks ham linked list.',
      },
    ],
    interviewQA: [
      {
        question: 'React Fiber nima?',
        answer: `Fiber — React 16 da qayta yozilgan ichki arxitektura. Har komponent uchun "fiber node" — virtual stack frame. Fiber rendering-ni TO'XTATISH va DAVOM ETTIRISH imkonini beradi (eski Stack Reconciler — sinxron, to'xtatolmasdi). Fiber node: type, props, state, hooks (linked list), child/sibling/return (daraxt navigatsiya). 2 bosqich: Render phase (to'xtatilishi mumkin) va Commit phase (to'xtatilishi MUMKIN EMAS).`,
      },
      {
        question: 'Fiber nima uchun kerak edi?',
        answer: `Eski React (Stack Reconciler) sinxron edi — butun daraxtni BIR YO'LA qayta ishlardi. Katta daraxt = UI 100ms+ bloklangan = input lag, animatsiya tiqilishi. Fiber bilan: rendering "unit of work" larga bo'linadi, har biridan keyin brauzerga nazorat qaytarilishi MUMKIN. Yuqori prioritet (user input) past prioritetni (data fetch) TO'XTATISHI mumkin. Natija: 60fps, responsive UI, concurrent features (useTransition, useDeferredValue).`,
      },
      {
        question: 'Hooks nima uchun linked list-da saqlanadi?',
        answer: `Har fiber-da hooks = linked list: hook1 → hook2 → hook3 → null. Har render-da React hook-larni TARTIB bo'yicha o'qiydi: 1-chi chaqiruv → hook1, 2-chi → hook2. SHU SABABLI hook-lar if ichida ishlatib bo'lmaydi — tartib o'zgarsa React noto'g'ri hook-ni qaytaradi (Rules of Hooks). Linked list — xotira samarali va tez access (index yo'q, faqat next pointer).`,
      },
    ],
    relatedTopics: [
      { sectionId: 'theory-questions', topicId: 'virtual-dom-theory', label: 'Virtual DOM' },
      { sectionId: 'react-core', topicId: 'rendering-cycle', label: 'Rendering Cycle' },
      { sectionId: 'theory-questions', topicId: 'concurrent-mode', label: 'Concurrent Mode' },
      { sectionId: 'theory-questions', topicId: 'rules-of-hooks', label: 'Rules of Hooks (linked list)' },
    ],
  },
  {
    id: 'hydration',
    title: 'Hydration',
    importance: 2,
    status: 'to-learn',
    description: 'SSR hydration jarayoni, selective hydration, hydration mismatch',
    content: `Hydration — server-da yaratilgan HTML-ni brauzerda INTERAKTIV qilish jarayoni. SSR-ning ikkinchi qadami.

═══════════════════════════════════════
  HYDRATION JARAYONI
═══════════════════════════════════════

  1. Server: React komponentni HTML string-ga aylantiradi
  2. Server: HTML brauzerga yuboriladi
  3. Brauzer: HTML-ni DARHOL ko'rsatadi (paint)
  4. Brauzer: JS bundle yuklanadi
  5. React: hydrateRoot() — mavjud HTML-ni "jonlantiradi"
     - Event listener-lar ulash
     - State boshqaruvi ulash
     - Interactive qilish

  Server HTML = ko'rinish (foto kabi)
  Hydration = interaktivlik (click, type ishlaydi)

═══════════════════════════════════════
  HYDRATION MISMATCH
═══════════════════════════════════════

Server HTML va client render FARQ qilsa — OGOHLANTIRISH:

  // ❌ Server va client farqli natija
  function Clock() {
    return <p>{new Date().toLocaleTimeString()}</p>
    // Server: 12:00:00 (server vaqti)
    // Client: 12:00:05 (client vaqti)
    // MISMATCH!
  }

  // ✅ Yechim — client-only rendering
  function Clock() {
    const [time, setTime] = useState<string>()

    useEffect(() => {
      setTime(new Date().toLocaleTimeString())
    }, [])

    if (!time) return null  // SSR da bo'sh
    return <p>{time}</p>
  }

═══════════════════════════════════════
  SELECTIVE HYDRATION (React 18)
═══════════════════════════════════════

React 18 da Suspense bilan:
  - Sahifa qismlari ALOHIDA hydrate bo'ladi
  - Foydalanuvchi bosgan qism AVVAL hydrate qilinadi
  - Qolgan qismlar background-da

  <Suspense fallback={<Loading />}>
    <HeavyComponent />  {/* alohida hydrate */}
  </Suspense>`,
    codeExamples: [
      {
        title: 'Hydration — asosiy',
        language: 'tsx',
        code: `// Server-da (Next.js yoki custom SSR):
import { renderToString } from 'react-dom/server'
// const html = renderToString(<App />)
// → "<div class='app'><h1>Salom</h1><button>Click</button></div>"
// Bu HTML brauzerga yuboriladi

// Client-da:
import { hydrateRoot } from 'react-dom/client'
// hydrateRoot(document.getElementById('root')!, <App />)
// Mavjud HTML-ga event listener-lar ulash
// DOM QAYTA YARATILMAYDI — faqat "jonlantiriladi"

// ❌ Hydration mismatch misollari
function BadComponent() {
  // Server va client FARQLI natija beradi
  return <p>{Math.random()}</p>           // ❌ har safar farqli
  return <p>{Date.now()}</p>              // ❌ vaqt farqi
  return <p>{window.innerWidth}</p>       // ❌ server-da window yo'q
  return <p>{typeof window}</p>           // ❌ server: undefined, client: object
}

// ✅ Client-only rendering pattern
function SafeComponent() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)  // faqat client-da
  }, [])

  if (!mounted) return null  // SSR da render qilMAYDI

  return <p>Window: {window.innerWidth}px</p>
}

// ✅ suppressHydrationWarning (bilgan holda)
function TimeDisplay() {
  return (
    <time suppressHydrationWarning>
      {new Date().toLocaleTimeString()}
    </time>
  )
}`,
        description: 'Hydration: server HTML + client JS = interaktiv ilova. Mismatch: server va client farqli render. Yechim: useEffect da client-only logika, yoki suppressHydrationWarning.',
      },
    ],
    interviewQA: [
      {
        question: 'Hydration nima?',
        answer: `Hydration — server-da yaratilgan statik HTML-ni brauzerda interaktiv qilish. SSR jarayoni: 1) Server React-ni HTML-ga aylantiradi, 2) HTML brauzerga yuboriladi (foydalanuvchi darhol ko'radi), 3) JS yuklanadi, 4) hydrateRoot() — mavjud HTML-ga event listener-lar va state ulaydi. DOM qayta yaratilMAYDI — faqat jonlantiriladi. Natija: tez FCP (HTML darhol) + interaktivlik (JS keyin).`,
      },
      {
        question: 'Hydration mismatch nima va qanday oldini olinadi?',
        answer: `Mismatch — server HTML va client render natijasi FARQ qilsa. Sabablar: Date.now(), Math.random(), window ob'ekti (server-da yo'q), browser-specific API. React ogohlantirish beradi, DOM qayta yaratishi mumkin (performance yomonlashadi). Oldini olish: 1) useEffect da client-only logika, 2) mounted state pattern, 3) suppressHydrationWarning (bilgan holda), 4) Server va client bir xil data ishlatishi.`,
      },
    ],
    relatedTopics: [
      { sectionId: 'theory-questions', topicId: 'ssr-csr-ssg', label: 'SSR vs CSR vs SSG' },
      { sectionId: 'theory-questions', topicId: 'server-components', label: 'Server Components' },
      { sectionId: 'react-core', topicId: 'use-id', label: 'useId (SSR-safe)' },
    ],
  },
  {
    id: 'server-components',
    title: 'React Server Components (RSC)',
    importance: 3,
    status: 'to-learn',
    description: 'Server vs Client components, "use client", Next.js App Router',
    content: `React Server Components (RSC) — server-da render bo'ladigan komponentlar. Client-ga JS yuborMAYDI — faqat HTML natijasi. React-ning kelajagi.

═══════════════════════════════════════
  SSR vs RSC (MUHIM FARQ!)
═══════════════════════════════════════

SSR:
  Server-da HTML yaratadi → client-ga yuboradi → JS yuklanadi → HYDRATION
  Barcha komponent JS client-ga yuboriladi (bundle)

RSC:
  Server Component JS client-ga YUBORILMAYDI
  Faqat render NATIJASI (HTML) yuboriladi
  Interaktiv bo'lishi kerak bo'lsa → "use client"

═══════════════════════════════════════
  SERVER vs CLIENT COMPONENT
═══════════════════════════════════════

Server Component (default Next.js App Router-da):
  ✅ Database-ga to'g'ridan-to'g'ri kirish
  ✅ File system o'qish
  ✅ API secret-lar xavfsiz
  ✅ Bundle-ga qo'shilMAYDI (kichik JS)
  ❌ useState, useEffect ishlatib BO'LMAYDI
  ❌ onClick, onChange ishlatib BO'LMAYDI
  ❌ Browser API (window, document) yo'q

Client Component ("use client"):
  ✅ useState, useEffect — interaktivlik
  ✅ onClick, onChange — event-lar
  ✅ Browser API
  ❌ Database-ga to'g'ridan-to'g'ri kirib bo'lmaydi
  ❌ Bundle-ga qo'shiladi

═══════════════════════════════════════
  "use client" DIREKTIVA
═══════════════════════════════════════

  // Server Component (default)
  async function ProductPage({ id }: { id: string }) {
    const product = await db.product.findById(id)  // to'g'ridan-to'g'ri DB
    return (
      <div>
        <h1>{product.name}</h1>
        <AddToCartButton productId={id} />  {/* client component */}
      </div>
    )
  }

  // Client Component
  'use client'  // ← BU DIREKTIVA
  function AddToCartButton({ productId }: { productId: string }) {
    const [added, setAdded] = useState(false)
    return (
      <button onClick={() => { addToCart(productId); setAdded(true) }}>
        {added ? 'Savatda ✓' : 'Savatga qo\'shish'}
      </button>
    )
  }

═══════════════════════════════════════
  QACHON NIMA
═══════════════════════════════════════

Server Component (default):
  ✅ Static kontent (matn, rasm)
  ✅ Data fetching (DB, API)
  ✅ Layout, page wrapper

Client Component ("use client"):
  ✅ Interaktivlik (click, hover, input)
  ✅ State (useState, useReducer)
  ✅ Effects (useEffect)
  ✅ Browser API (localStorage, geolocation)

Qoida: IMKON QADAR server component.
Faqat interaktivlik kerak bo'lganda "use client".`,
    codeExamples: [
      {
        title: 'Server va Client component — Next.js',
        language: 'tsx',
        code: `// ===== SERVER COMPONENT (default) =====
// app/products/[id]/page.tsx
// "use client" YO'Q — server component

interface Product {
  id: string
  name: string
  price: number
  description: string
}

// async function — server-da ishlaydi
async function ProductPage({ params }: { params: { id: string } }) {
  // To'g'ridan-to'g'ri DB-dan (API kerak emas!)
  const product = await db.product.findUnique({
    where: { id: params.id },
  })

  if (!product) return <p>Topilmadi</p>

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p>{product.price} so'm</p>

      {/* Client component — interaktiv qism */}
      <AddToCartButton productId={product.id} price={product.price} />
      <ProductReviews productId={product.id} />
    </div>
  )
}

// ===== CLIENT COMPONENT =====
// components/AddToCartButton.tsx
'use client'

import { useState } from 'react'

export function AddToCartButton({
  productId,
  price,
}: {
  productId: string
  price: number
}) {
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  async function handleAdd() {
    await fetch('/api/cart', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    })
    setAdded(true)
  }

  return (
    <div>
      <select value={quantity} onChange={e => setQuantity(Number(e.target.value))}>
        {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
      </select>
      <p>Jami: {price * quantity} so'm</p>
      <button onClick={handleAdd} disabled={added}>
        {added ? 'Savatda ✓' : 'Savatga'}
      </button>
    </div>
  )
}

// ProductPage — server-da render, JS client-ga YUBORILMAYDI
// AddToCartButton — client-da render, JS bundle-da
// Natija: kichikroq bundle, tezroq sahifa`,
        description: 'Server component: async, DB access, JS yuborilmaydi. Client component: "use client", useState/onClick, JS bundle-da. Server default, client faqat interaktivlik uchun.',
      },
    ],
    interviewQA: [
      {
        question: 'React Server Components nima?',
        answer: `RSC — server-da render bo'ladigan komponentlar. Client-ga JS yuborMAYDI — faqat render natijasi. SSR-dan farqi: SSR barcha komponent JS-ni client-ga yuboradi (hydration). RSC server component JS-ni YUBORILMAYDI — bundle kichikroq. Server component: async, DB access, API secret, useState/useEffect YO'Q. Client component: "use client" direktiva, interaktivlik, useState/useEffect.`,
      },
      {
        question: '"use client" nima va qachon kerak?',
        answer: `"use client" — fayl boshiga qo'yiladigan direktiva. Bu fayl va uning import-lari CLIENT COMPONENT ekanini bildiradi. QACHON: useState, useEffect kerak bo'lganda, onClick/onChange kerak bo'lganda, Browser API (window, localStorage) ishlatilganda. QACHON KERAK EMAS: static kontent, data fetching, layout. Qoida: IMKON QADAR server component (default). Faqat interaktivlik uchun "use client". Server component client component-ni CHILD sifatida ishlatishi MUMKIN.`,
      },
    ],
    relatedTopics: [
      { sectionId: 'theory-questions', topicId: 'ssr-csr-ssg', label: 'SSR vs CSR' },
      { sectionId: 'theory-questions', topicId: 'hydration', label: 'Hydration' },
      { sectionId: 'theory-questions', topicId: 'react-18-19', label: 'React 19 yangiliklari' },
      { sectionId: 'react-core', topicId: 'use-action-state', label: 'useActionState' },
    ],
  },
  {
    id: 'concurrent-mode',
    title: 'Concurrent Features',
    importance: 3,
    status: 'to-learn',
    description: 'Concurrent rendering, time slicing, prioritet tizimi',
    content: `Concurrent Features — React 18 ning asosiy yangiligi. Rendering jarayonini TO'XTATISH, DAVOM ETTIRISH, va BEKOR QILISH imkonini beradi.

═══════════════════════════════════════
  MUAMMO: SINXRON RENDERING
═══════════════════════════════════════

Eski React — sinxron:
  setState → render → diff → DOM update
  Butun jarayon TO'XTATILMAYDI.

10,000 elementni filterlash:
  Input typing → setState → 10,000 element re-render → 200ms bloklash
  Foydalanuvchi 200ms davomida yoza OLMAYDI!

═══════════════════════════════════════
  CONCURRENT RENDERING
═══════════════════════════════════════

React 18+ — concurrent:
  Rendering TO'XTATILISHI mumkin.
  Muhimroq ish kerak bo'lsa — hozirgi render BEKOR QILINADI.

  Input typing → YUQORI prioritet (darhol)
  Filterlash → PAST prioritet (keyinroq)

Foydalanuvchi typing davomida UI responsive qoladi.

═══════════════════════════════════════
  useTransition
═══════════════════════════════════════

State yangilanishini PAST PRIORITET qilish:

  const [isPending, startTransition] = useTransition()

  function handleChange(e) {
    setQuery(e.target.value)           // YUQORI — input responsive

    startTransition(() => {
      setFilteredItems(filter(items))  // PAST — keyinroq
    })
  }

  isPending — past prioritet yangilanish davom etayapti
  (loading indicator ko'rsatish mumkin)

═══════════════════════════════════════
  useDeferredValue
═══════════════════════════════════════

Qiymatning PAST PRIORITET versiyasini olish:

  const deferredQuery = useDeferredValue(query)
  // query — darhol yangilanadi (input responsive)
  // deferredQuery — keyinroq yangilanadi (qimmat hisoblash uchun)

  const filtered = useMemo(
    () => items.filter(i => i.name.includes(deferredQuery)),
    [items, deferredQuery]
  )

═══════════════════════════════════════
  TIME SLICING
═══════════════════════════════════════

React rendering-ni kichik bo'laklarga bo'ladi:
  [5ms ish] → [brauzerga nazorat] → [5ms ish] → [brauzerga nazorat]

Har 5ms dan keyin brauzer:
  - Input event-larni qayta ishlaydi
  - Animatsiya frame-larni chizadi
  - Layout/paint

Natija: 60fps saqlanadi, UI bloklanMAYDI.

═══════════════════════════════════════
  SUSPENSE + CONCURRENT
═══════════════════════════════════════

Suspense concurrent mode-da kuchliroq:
  - Streaming SSR — HTML bosqichma-bosqich yuboriladi
  - Selective hydration — foydalanuvchi bosgan qism avval
  - Data fetching — use() hook bilan`,
    codeExamples: [
      {
        title: 'Concurrent features — amaliy',
        language: 'tsx',
        code: `import { useState, useTransition, useDeferredValue, useMemo, Suspense } from 'react'

// useTransition — og'ir yangilanishni past prioritet qilish
function SearchPage() {
  const [query, setQuery] = useState('')
  const [isPending, startTransition] = useTransition()
  const [results, setResults] = useState<Product[]>([])

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    setQuery(value)  // YUQORI prioritet — input DARHOL yangilanadi

    startTransition(() => {
      // PAST prioritet — 10,000 mahsulot filterlash
      const filtered = products.filter(p =>
        p.name.toLowerCase().includes(value.toLowerCase())
      )
      setResults(filtered)
    })
  }

  return (
    <div>
      <input value={query} onChange={handleSearch} placeholder="Qidirish..." />

      {isPending && <p className="text-gray-400">Qidirilmoqda...</p>}

      <ul>
        {results.map(p => <li key={p.id}>{p.name} — {p.price} so'm</li>)}
      </ul>
    </div>
  )
}

// useDeferredValue — qiymatni kechiktirish
function FilteredList({ items, query }: { items: Item[]; query: string }) {
  const deferredQuery = useDeferredValue(query)
  const isStale = query !== deferredQuery

  const filtered = useMemo(
    () => items.filter(i => i.name.includes(deferredQuery)),
    [items, deferredQuery]
  )

  return (
    <div style={{ opacity: isStale ? 0.6 : 1, transition: 'opacity 0.2s' }}>
      <p>{filtered.length} ta topildi</p>
      {filtered.map(i => <div key={i.id}>{i.name}</div>)}
    </div>
  )
}

// useTransition vs useDeferredValue:
// useTransition — setState-ni past prioritet qilish
// useDeferredValue — QIYMATNI past prioritet qilish
// Natija bir xil — UI responsive, og'ir ish keyinroq`,
        description: 'useTransition: startTransition ichidagi setState past prioritet. useDeferredValue: qiymatning kechiktirilgan versiyasi. Ikkalasi ham — input responsive, og\'ir hisoblash keyinroq.',
      },
    ],
    interviewQA: [
      {
        question: 'Concurrent rendering nima?',
        answer: `Concurrent rendering — React 18+ da rendering jarayonini TO'XTATISH va DAVOM ETTIRISH imkonini beradi. Eski React sinxron — butun render bir yo'la. Concurrent — rendering kichik bo'laklarga bo'linadi (time slicing), har bo'lakdan keyin brauzerga nazorat qaytarilishi MUMKIN. Yuqori prioritet (user input) past prioritetni (data filtering) TO'XTATISHI mumkin. Natija: 60fps, responsive UI, foydalanuvchi kutMAYDI. Fiber arxitekturasiga asoslangan.`,
      },
      {
        question: 'useTransition va useDeferredValue farqi nima?',
        answer: `useTransition — setState-ni past prioritet qilish. startTransition(() => setState(value)). isPending — davom etayaptimi. Ishlatish: biz setState-ni boshqaramiz. useDeferredValue — QIYMATNING past prioritet versiyasini olish. const deferred = useDeferredValue(value). Ishlatish: qiymat tashqaridan keladi (props), biz setState-ni boshqarMAYMIZ. Natija bir xil — og'ir yangilanish past prioritet, UI responsive.`,
      },
      {
        question: 'Concurrent mode va Suspense qanday birga ishlaydi?',
        answer: `Suspense concurrent mode-da kuchliroq: 1) Streaming SSR — server HTML-ni bosqichma-bosqich yuboradi, Suspense boundary-lar alohida, 2) Selective hydration — foydalanuvchi bosgan Suspense boundary AVVAL hydrate qilinadi, 3) startTransition + Suspense — past prioritet navigatsiya, eski sahifa ko'rsatiladi yangi tayyor bo'lguncha (loading flash yo'q). Suspense — React-ning "kutish" mexanizmi, concurrent — prioritet boshqaruvi.`,
      },
    ],
    relatedTopics: [
      { sectionId: 'react-core', topicId: 'use-transition', label: 'useTransition' },
      { sectionId: 'react-core', topicId: 'use-deferred-value', label: 'useDeferredValue' },
      { sectionId: 'theory-questions', topicId: 'fiber-architecture', label: 'Fiber Architecture' },
      { sectionId: 'theory-questions', topicId: 'react-18-19', label: 'React 18/19' },
    ],
  },
]
