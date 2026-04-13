import type { Topic } from '../../../types'

export const keyImportance: Topic = {
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
      { techId: 'react-js', sectionId: 'performance', topicId: 'key-prop', label: 'Key Prop (amaliy)' },
      { techId: 'react-js', sectionId: 'react-core', topicId: 'virtual-dom', label: 'Reconciliation' },
    ],
  }
