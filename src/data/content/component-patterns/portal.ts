import type { Topic } from '../../types'

export const portal: Topic = {
    id: `portal`,
    title: `Portal`,
    importance: 2,
    status: `to-learn`,
    description: `createPortal — modal, tooltip, dropdown`,
    content: `Portal — createPortal orqali komponentni DOM tree-da BOSHQA JOYGA render qilish. React tree-da parent-da qoladi, lekin DOM-da boshqa joyda ko'rinadi.

═══════════════════════════════════════
  NIMA BU
═══════════════════════════════════════

createPortal — komponentni DOM tree-da BOSHQA JOYGA
render qilish:

  React tree:
  <App>
    <Card>
      <Modal />    ← React-da Card ichida
    </Card>
  </App>

  DOM tree (portal bilan):
  <div id="root">
    <div class="card">
      ...            ← Modal shu yerda YO'Q
    </div>
  </div>
  <div id="modal-root">
    <div class="modal">...</div>  ← Modal SHU YERDA
  </div>

Modal React-da Card ichida, lekin DOM-da body-da.

═══════════════════════════════════════
  NIMA UCHUN KERAK
═══════════════════════════════════════

Modal, tooltip, dropdown — parent-ning CSS-dan
chiqishi kerak:

1. overflow: hidden — parent-da overflow hidden bo'lsa,
   child undan chiqib ko'rinmaydi. Portal hal qiladi.

2. z-index — parent-da z-index cheklansa, child
   tepalik ola olmaydi. Portal body-ga render qilib,
   z-index muammosini hal qiladi.

3. Stacking context — CSS stacking context muammolari.
   Portal DOM-ning eng yuqori darajasida render qilib,
   barcha muammolarni bartaraf qiladi.

═══════════════════════════════════════
  EVENT BUBBLING
═══════════════════════════════════════

MUHIM FARQ: Portal ichidagi event React tree bo'yicha
YUQORIGA ko'tariladi — DOM tree bo'yicha EMAS!

  <Card onClick={() => console.log('Card bosildi!')}>
    <Modal />  {/* Portal orqali body-ga render */}
  </Card>

  Modal ichida button bosilsa → Card onClick HAM ishlaydi!
  Chunki React event bubbling React tree bo'yicha ishlaydi.

  DOM-da Modal body-da, Card-da emas.
  Lekin React uchun Modal Card ichida.
  Shuning uchun event Card-ga ko'tariladi.

  Bu xususiyat ba'zan foydali, ba'zan kutilmagan.
  Ehtiyot bo'lish kerak!

═══════════════════════════════════════
  SINTAKSIS
═══════════════════════════════════════

  import { createPortal } from 'react-dom'

  createPortal(children, domNode)

  - children — render qilinadigan React element
  - domNode — DOM-dagi manzil (document.getElementById)

  index.html-da:
  <body>
    <div id="root"></div>
    <div id="portal-root"></div>   ← portal manzili
  </body>`,
    codeExamples: [
      {
        title: `Modal — createPortal bilan body-ga render`,
        language: `tsx`,
        code: `import { useState, useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

// Modal component — Portal orqali body-ga render
interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  title?: string
}

function Modal({ isOpen, onClose, children, title }: ModalProps) {
  // ESC tugmasi bilan yopish
  useEffect(() => {
    if (!isOpen) return

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleEsc)
    // Body scroll-ni bloklash
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  // createPortal — DOM-da document.body-ga render
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      {/* Overlay — tashqi click bilan yopish */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal content */}
      <div
        className="relative bg-white rounded-lg shadow-xl p-6 max-w-lg w-full mx-4"
        onClick={e => e.stopPropagation()} // Ichki click overlay-ga ketmasin
      >
        {title && (
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              &times;
            </button>
          </div>
        )}
        {children}
      </div>
    </div>,
    document.body  // ← DOM-da body-ga render!
  )
}

// Ishlatish
function App() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="p-8">
      <h1>Asosiy sahifa</h1>

      {/* Bu div overflow:hidden bo'lsa ham, Modal chiqadi! */}
      <div style={{ overflow: 'hidden', height: 200 }}>
        <p>Bu konteyner overflow: hidden</p>
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Modalni ochish
        </button>

        {/* React-da shu yerda, DOM-da body-da */}
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Salom!">
          <p>Bu modal kontent. ESC yoki overlay bosilsa yopiladi.</p>
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Yopish
            </button>
            <button className="px-4 py-2 bg-blue-500 text-white rounded">
              Tasdiqlash
            </button>
          </div>
        </Modal>
      </div>
    </div>
  )
}`,
        description: `Portal bilan Modal — DOM-da body-ga render, shuning uchun parent-ning overflow:hidden va z-index muammolari ta'sir qilmaydi. ESC, overlay click, body scroll lock — to'liq modal pattern.`,
      },
    ],
    interviewQA: [
      {
        question: `Portal nima va qachon kerak?`,
        answer: `Portal — createPortal(children, domNode) orqali React komponentni DOM tree-da boshqa joyga render qilish. Komponent React tree-da parent ichida qoladi (state, context, event ishlaydi), lekin DOM-da boshqa joyda ko'rinadi. Qachon kerak: 1) Modal/dialog — body-ga render, parent-ning overflow:hidden ta'sir qilmasligi uchun. 2) Tooltip — z-index muammolarini bartaraf qilish. 3) Dropdown menu — stacking context muammolarini hal qilish. Barcha "floating" UI elementlar uchun portal kerak.`,
      },
      {
        question: `Event bubbling portal-da qanday ishlaydi?`,
        answer: `Portal-da event bubbling React tree bo'yicha ishlaydi, DOM tree bo'yicha EMAS. Masalan: <Card onClick={handler}><Modal /></Card> — Modal DOM-da body-da, lekin React tree-da Card ichida. Modal ichida button bosilsa, event React tree bo'yicha yuqoriga ko'tariladi va Card onClick ham ishlaydi. Bu ba'zan foydali (parent event-larni ushlash), ba'zan kutilmagan. Kerak bo'lmasa e.stopPropagation() bilan to'xtatish mumkin. Bu React-ning muhim xususiyati — DOM strukturasidan mustaqil event propagation.`,
      },
    ],
    relatedTopics: [
      { sectionId: `react-core`, topicId: `event-system`, label: `Event bubbling portal-da` },
    ],
  }
