import type { Topic } from '../../../types'

export const eventSystem: Topic = {
    id: 'event-system',
    title: 'React Event System',
    importance: 2,
    status: 'to-learn' as const,
    description: 'SyntheticEvent, Event Delegation, React event tizimi ishlash prinsipi',
    content: `React o'zining event tizimiga ega — SyntheticEvent. Bu brauzerlar orasidagi farqlarni yo'qotadi va performance-ni oshiradi.

═══════════════════════════════════════
  SYNTHETICEVENT NIMA
═══════════════════════════════════════

SyntheticEvent — React-ning cross-browser event wrapper-i.
Barcha brauzerlarda BIR XIL ishlaydi.

React native brauzer event-ni o'rab oladi:
onClick → SyntheticEvent(MouseEvent)
onChange → SyntheticEvent(InputEvent)
onKeyDown → SyntheticEvent(KeyboardEvent)

Native event-ga kirish: event.nativeEvent

═══════════════════════════════════════
  EVENT DELEGATION
═══════════════════════════════════════

React BARCHA event-larni root elementga qo'yadi (bitta listener).
Har bir button-ga alohida listener qo'yMAYDI.

1000 ta button = 1000 ta listener ❌ (oddiy JS)
1000 ta button = 1 ta listener ✅ (React)

Bu "Event Delegation" deyiladi — performance uchun yaxshi.

React 17+: root container-ga (document emas)
React 16: document-ga qo'yardi

═══════════════════════════════════════
  onClick vs addEventListener
═══════════════════════════════════════

React: <button onClick={handler}> — JSX ichida, declarative
JS: element.addEventListener('click', handler) — imperative

React usulining afzalliklari:
- Avtomatik cleanup (unmount-da listener olib tashlanadi)
- Cross-browser muvofiqlik
- Event delegation performance

═══════════════════════════════════════
  event.preventDefault() va event.stopPropagation()
═══════════════════════════════════════

preventDefault(): Brauzer default harakatni to'xtatish
- Form submit → sahifa yangilanishini to'xtatish
- Link click → sahifa o'tishini to'xtatish

stopPropagation(): Event yuqoriga (parent-ga) ko'tarilishini to'xtatish
- Child onClick ishlaydi, Parent onClick ISHLAMAYDI

═══════════════════════════════════════
  EVENT POOLING (OLIB TASHLANGAN)
═══════════════════════════════════════

React 16 da event QAYTA ISHLATILARDI (pooling).
event.persist() chaqirish kerak edi async funksiyada.

React 17+ da event pooling OLIB TASHLANDI.
event.persist() kerak EMAS. Intervyu da eslating.`,
    codeExamples: [
        {
            title: 'Form submit va input change — event ishlatish',
            language: 'tsx' as const,
            code: `import { useState, type FormEvent, type ChangeEvent } from 'react'

function EventDemo() {
  const [name, setName] = useState('')
  const [submitted, setSubmitted] = useState(false)

  // FormEvent — form submit uchun tip
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault() // Sahifa yangilanishini to'xtatish
    console.log('Form yuborildi:', name)
    setSubmitted(true)
  }

  // ChangeEvent — input o'zgarishi uchun tip
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
    console.log('Native event:', e.nativeEvent) // Brauzer native event
  }

  // stopPropagation — parent-ga event ko'tarilishini to'xtatish
  const handleChildClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    console.log('Faqat child bosildi, parent bilMAYDI')
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={name}
        onChange={handleChange}
        placeholder="Ismingiz"
      />

      {/* Event Delegation misoli */}
      <div onClick={() => console.log('Parent bosildi')}>
        <button type="button" onClick={handleChildClick}>
          Child (stopPropagation)
        </button>
      </div>

      <button type="submit">Yuborish</button>
      {submitted && <p>Yuborildi: {name}</p>}
    </form>
  )
}`,
            description: `preventDefault form submit-ni, stopPropagation event bubbling-ni to'xtatadi. TypeScript bilan FormEvent, ChangeEvent, MouseEvent tiplarini ishlatish.`,
        },
    ],
    interviewQA: [
        {
            question: 'SyntheticEvent nima?',
            answer: `SyntheticEvent — React-ning cross-browser event wrapper-i. React native brauzer eventni o'rab oladi va barcha brauzerlarda BIR XIL interfeys beradi. Masalan, onClick SyntheticEvent(MouseEvent) qaytaradi. Native event-ga event.nativeEvent orqali kirish mumkin. React 17+ da event pooling olib tashlangan — event.persist() kerak emas.`,
        },
        {
            question: 'React Event Delegation qanday ishlaydi?',
            answer: `React BARCHA event listener-larni root elementga qo'yadi (bitta listener). Har bir elementga alohida listener qo'ymaydi. 1000 ta button bo'lsa ham React faqat 1 ta listener ishlatadi — bu Event Delegation. Event sodir bo'lganda React uni root-da ushlaydi va to'g'ri komponentga yo'naltiradi. React 17+ dan boshlab listener document emas, root container-ga qo'yiladi.`,
        },
        {
            question: 'preventDefault va stopPropagation farqi nima?',
            answer: `preventDefault — brauzer default harakatini to'xtatadi. Masalan, form submit-da sahifa yangilanishini, link click-da sahifa o'tishini to'xtatadi. stopPropagation — event bubbling-ni to'xtatadi, ya'ni event parent elementlarga ko'tarilmaydi. Masalan, child onClick ishlaydi, lekin parent onClick ISHLAMAYDI. Ikkalasi ham turli muammolarni hal qiladi.`,
        },
    ],
    relatedTopics: [
        { techId: 'react-js', sectionId: 'typescript-react', topicId: 'event-types', label: 'Event tipizatsiyasi' },
        { techId: 'react-js', sectionId: 'component-patterns', topicId: 'controlled-vs-uncontrolled', label: 'Form eventlari' },
    ],
}
