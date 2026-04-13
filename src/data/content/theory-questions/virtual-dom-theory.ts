import type { Topic } from '../../types'

export const virtualDomTheory: Topic = {
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
  }
