import type { Topic } from '../../types'

export const virtualDom: Topic = {
    id: 'virtual-dom',
    title: 'Virtual DOM & Reconciliation',
    importance: 3,
    status: 'to-learn' as const,
    description: 'Virtual DOM tushunchasi, diffing algoritmi va reconciliation jarayoni',
    content: `Virtual DOM — React-ning eng muhim tushunchalaridan biri. U React-ni tez va samarali qiladi.

═══════════════════════════════════════
  VIRTUAL DOM NIMA
═══════════════════════════════════════

Virtual DOM — bu JavaScript object bo'lib, haqiqiy DOM-ning yengil nusxasi hisoblanadi.
React bu object-ni xotirada saqlaydi va u bilan ishlaydi.

Oddiy qilib aytganda:
- Haqiqiy DOM = brauzer ko'rsatadigan HTML daraxti
- Virtual DOM = JavaScript-da saqlangan o'sha daraxtning NUSXASI (copy)

Misol:
<div class="card">
  <h1>Salom</h1>
  <p>Matn</p>
</div>

Virtual DOM-da bu shunday ko'rinadi:
{
  type: 'div',
  props: { className: 'card' },
  children: [
    { type: 'h1', props: {}, children: ['Salom'] },
    { type: 'p', props: {}, children: ['Matn'] }
  ]
}

═══════════════════════════════════════
  NIMA UCHUN KERAK
═══════════════════════════════════════

Haqiqiy DOM bilan ishlash SEKIN:
- Har bir o'zgarishda brauzer REFLOW (layout qayta hisoblash) va REPAINT (qayta chizish) qiladi
- Bu ayniqsa ko'p elementli sahifalarda og'ir bo'ladi

Virtual DOM bilan ishlash TEZROQ:
- JavaScript object-da o'zgarish qilish — juda tez
- React faqat FARQNI (diff) haqiqiy DOM-ga qo'llaydi
- Minimal DOM operatsiyalari = maximum tezlik

═══════════════════════════════════════
  RECONCILIATION (SOLISHTIRISH)
═══════════════════════════════════════

State o'zgarganda React quyidagilarni qiladi:

1. Yangi Virtual DOM yaratadi (yangi state asosida)
2. Eski Virtual DOM bilan TAQQOSLAYDI (diffing)
3. Faqat FARQLARNI haqiqiy DOM-ga yozadi

Bu jarayon RECONCILIATION deyiladi.

Masalan:
- Eski: <h1>Salom</h1>
- Yangi: <h1>Xayr</h1>
- React faqat matn node-ni o'zgartiradi, h1 elementni qaytadan yaratmaydi

═══════════════════════════════════════
  DIFFING ALGORITHM
═══════════════════════════════════════

React-ning diffing algoritmi O(n) murakkablikda ishlaydi.
(Oddiy daraxt solishtirish — O(n^3), bu juda sekin bo'lardi)

React 2 ta TAXMIN (heuristic) ishlatadi:

1. BOSHQA TIP = BUTUN SUBTREE QAYTA YARATILADI
   - <div> dan <span> ga o'zgarsa — eski daraxt o'chiriladi, yangi yaratiladi
   - <ComponentA> dan <ComponentB> ga o'zgarsa — ham shunday

2. KEY PROP — ro'yxatda elementlarni aniqlash
   - key orqali React qaysi element qaysi ekanligini biladi
   - key bilan React elementni QAYTA ISHLATADI, key-siz QAYTA YARATADI

═══════════════════════════════════════
  KEY PROP ROLI
═══════════════════════════════════════

key — React-ga ro'yxatda qaysi element qaysi ekanligini aytadi.

KEY YO'Q holat:
- React index bo'yicha taqqoslaydi
- Tartib o'zgarsa — XATO yangilanadi (input qiymatlari aralashadi)

KEY BOR holat:
- React har bir elementni key bo'yicha topadi
- Tartib o'zgarsa ham TO'G'RI yangilanadi

QOIDA: key UNIKAL va BARQAROR bo'lishi kerak.
- id ishlatish — TO'G'RI
- index ishlatish — ko'p hollarda XATO (tartib o'zgarsa)
- Math.random() — HAR DOIM XATO (har renderda yangi key = har renderda qayta yaratiladi)

═══════════════════════════════════════
  FIBER ARXITEKTURA
═══════════════════════════════════════

React 16+ da Fiber arxitektura joriy etildi.

ESKI (Stack Reconciler):
- Rendering bir martalik — boshlangan bo'lsa to'xtab bo'lmaydi
- Og'ir komponentlar brauzer-ni "muzlatadi"

YANGI (Fiber Reconciler):
- Rendering ish-ni kichik bo'laklarga bo'ladi
- To'xtatib, davom ettirishi mumkin
- Muhimroq ishlarni (masalan, foydalanuvchi inputi) oldin bajaradi

Bu CONCURRENT RENDERING-ning asosi:
- useTransition, useDeferredValue — shu tufayli mumkin
- Brauzer hech qachon "qotib" qolmaydi`,
    codeExamples: [
        {
            title: 'Key prop ahamiyati',
            language: 'tsx' as const,
            code: `import { useState } from 'react'

// ❌ NOTO'G'RI — index key sifatida
function BadList() {
  const [items, setItems] = useState(['Olma', 'Nok', 'Uzum'])

  const addToStart = () => {
    setItems(['Banan', ...items])
  }

  return (
    <div>
      <button onClick={addToStart}>Boshiga qo'shish</button>
      {items.map((item, index) => (
        // index key = tartib o'zgarsa input qiymatlari aralashadi!
        <div key={index}>
          <span>{item}</span>
          <input placeholder="Narx kiriting" />
        </div>
      ))}
    </div>
  )
}

// ✅ TO'G'RI — unikal id key sifatida
function GoodList() {
  const [items, setItems] = useState([
    { id: 1, name: 'Olma' },
    { id: 2, name: 'Nok' },
    { id: 3, name: 'Uzum' },
  ])

  const addToStart = () => {
    setItems([{ id: Date.now(), name: 'Banan' }, ...items])
  }

  return (
    <div>
      <button onClick={addToStart}>Boshiga qo'shish</button>
      {items.map((item) => (
        // Unikal id = tartib o'zgarsa ham input to'g'ri qoladi
        <div key={item.id}>
          <span>{item.name}</span>
          <input placeholder="Narx kiriting" />
        </div>
      ))}
    </div>
  )
}`,
            description: `index key ishlatilganda tartib o'zgarsa input qiymatlari aralashib ketadi. Unikal id key ishlatilsa — React har elementni to'g'ri kuzatadi.`,
        },
        {
            title: `Reconciliation — tip o'zgarganda`,
            language: 'tsx' as const,
            code: `import { useState } from 'react'

// React bir xil tip bo'lsa — YANGILAYDI
// Boshqa tip bo'lsa — O'CHIRIB QAYTA YARATADI

function ReconciliationDemo() {
  const [isAdmin, setIsAdmin] = useState(false)

  return (
    <div>
      <button onClick={() => setIsAdmin(!isAdmin)}>
        Rolni almashtirish
      </button>

      {/*
        1-holat: Bir xil tip — React faqat props-ni yangilaydi
        Input ichidagi matn SAQLANADI
      */}
      {isAdmin ? (
        <input placeholder="Admin qidiruv" style={{ border: '2px solid red' }} />
      ) : (
        <input placeholder="Oddiy qidiruv" style={{ border: '2px solid blue' }} />
      )}

      {/*
        2-holat: Boshqa tip — React butun subtree-ni qayta yaratadi
        Input ichidagi matn YO'QOLADI
      */}
      {isAdmin ? (
        <div>
          <input placeholder="Admin panel" />
        </div>
      ) : (
        <section>
          <input placeholder="Foydalanuvchi panel" />
        </section>
      )}
    </div>
  )
}`,
            description: `Bir xil HTML tip (input → input) bo'lsa React faqat props-ni yangilaydi (state saqlanadi). Boshqa tip (div → section) bo'lsa butun subtree qayta yaratiladi (state yo'qoladi).`,
        },
    ],
    interviewQA: [
        {
            question: 'Virtual DOM nima va nima uchun kerak?',
            answer: `Virtual DOM — JavaScript object bo'lib, haqiqiy DOM-ning yengil nusxasi. React uni xotirada saqlaydi. State o'zgarganda React yangi Virtual DOM yaratadi, eski bilan solishtiradi (diffing), va faqat FARQLARNI haqiqiy DOM-ga qo'llaydi. Bu haqiqiy DOM bilan to'g'ridan-to'g'ri ishlashdan tezroq, chunki DOM operatsiyalari og'ir (reflow, repaint), JavaScript object bilan ishlash esa yengil.`,
        },
        {
            question: 'React diffing algoritmi qanday ishlaydi?',
            answer: `React diffing algoritmi O(n) murakkablikda ishlaydi (odatda daraxt solishtirish O(n^3)). Bu 2 ta taxmin (heuristic) tufayli: 1) Agar element tipi o'zgarsa (masalan, div dan span ga) — butun subtree o'chiriladi va qayta yaratiladi, 2) key prop orqali ro'yxatda elementlar aniqlanadi — React qaysi element yangi, qaysi eski ekanini biladi. Shu ikki qoida tufayli React juda tez solishtirish amalga oshiradi.`,
        },
        {
            question: 'Key nima uchun kerak va nima uchun index key sifatida yomon?',
            answer: `key — React-ga ro'yxatdagi har bir elementni aniqlash uchun kerak. Key bo'lmaganda React index bo'yicha taqqoslaydi. Muammo: agar elementlar tartibi o'zgarsa (qo'shish, o'chirish, saralash), index-lar ham o'zgaradi va React XATO elementni yangilaydi. Masalan, ro'yxat boshiga element qo'shsangiz, barcha input-lar bir pozitsiyaga siljiydi va qiymatlar aralashadi. Unikal id ishlatilsa — React har elementni to'g'ri kuzatadi. Math.random() ham yomon — har renderda yangi key = har renderda qayta yaratish.`,
        },
        {
            question: 'Fiber nima va qanday afzallik beradi?',
            answer: `Fiber — React 16+ da joriy etilgan yangi reconciliation arxitektura. Eski Stack Reconciler rendering-ni bir martalik bajarar edi — boshlanganini to'xtatib bo'lmas edi, bu esa og'ir komponentlarda brauzer-ni "muzlatar" edi. Fiber esa rendering ishini kichik bo'laklarga (fiber unit) bo'ladi. React istalgan vaqtda to'xtatib, muhimroq ishni (masalan, foydalanuvchi inputi) bajarib, keyin davom ettirishi mumkin. Bu Concurrent Rendering-ning asosi — useTransition, useDeferredValue kabi hooklar shu tufayli ishlaydi.`,
        },
    ],
    relatedTopics: [
        { sectionId: 'react-core', topicId: 'rendering-cycle', label: 'Rendering Cycle' },
        { sectionId: 'theory-questions', topicId: 'fiber-architecture', label: 'Fiber Architecture' },
        { sectionId: 'theory-questions', topicId: 'key-importance', label: 'Key nima uchun kerak' },
        { sectionId: 'theory-questions', topicId: 'virtual-dom-theory', label: 'Nazariy savol' },
    ],
}
