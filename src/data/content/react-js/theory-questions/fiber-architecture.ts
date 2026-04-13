import type { Topic } from '../../../types'

export const fiberArchitecture: Topic = {
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
      { techId: 'react-js', sectionId: 'theory-questions', topicId: 'virtual-dom-theory', label: 'Virtual DOM' },
      { techId: 'react-js', sectionId: 'react-core', topicId: 'rendering-cycle', label: 'Rendering Cycle' },
      { techId: 'react-js', sectionId: 'theory-questions', topicId: 'concurrent-mode', label: 'Concurrent Mode' },
      { techId: 'react-js', sectionId: 'theory-questions', topicId: 'rules-of-hooks', label: 'Rules of Hooks (linked list)' },
    ],
  }
