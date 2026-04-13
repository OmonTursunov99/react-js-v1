import type { Topic } from '../../../types'

export const keyProp: Topic = {
    id: 'key-prop',
    title: 'Key Prop',
    importance: 3,
    status: 'to-learn',
    description: 'Nima uchun kerak, index key nima uchun yomon',
    content: `Key prop — React-ning reconciliation (diffing) algoritmida elementlarni IDENTIFIKATSIYA qilish uchun ishlatiladigan maxsus prop. Ro'yxatlar (map) uchun MAJBURIY.

═══════════════════════════════════════
  NIMA UCHUN KEY KERAK?
═══════════════════════════════════════

React ro'yxat yangilanganda qaysi element:
  - QOLDI (o'zgarmadi)
  - O'ZGARDI (yangilash kerak)
  - QO'SHILDI (yangi yaratish kerak)
  - O'CHIRILDI (DOM-dan olib tashlash kerak)

Key-siz React TARTIB bo'yicha taqqoslaydi:
  Eski: [A, B, C]
  Yangi: [A, C]    ← B o'chirildi

  Key-siz React o'ylaydi: B→C ga o'zgardi, C o'chirildi (NOTO'G'RI!)
  Key bilan React biladi: B o'chirildi, A va C QOLDI (TO'G'RI)

═══════════════════════════════════════
  INDEX KEY NIMA UCHUN YOMON
═══════════════════════════════════════

  items.map((item, index) => <Item key={index} />)

Muammo: element QO'SHILSA yoki O'CHIRILSA index O'ZGARADI:

  Eski:  [A(0), B(1), C(2)]
  Yangi: [X(0), A(1), B(2), C(3)]  ← boshiga X qo'shildi

  Index key bilan React o'ylaydi:
    0: A→X (o'zgardi — qayta render)
    1: B→A (o'zgardi — qayta render)
    2: C→B (o'zgardi — qayta render)
    3: C (yangi — yaratish kerak)
  → BARCHA element qayta renderlanadi!

  Unique key bilan:
    X: yangi — yaratish kerak
    A, B, C: qoldi — hech narsa qilish kerak emas
  → Faqat X renderlanadi!

Index key XAVFSIZ faqat:
  ✅ Ro'yxat HECH QACHON o'zgarmasa
  ✅ Element tartibi o'zgarMAsa
  ✅ Element qo'shilMAsa va o'chirilMAsa

═══════════════════════════════════════
  KEY QOIDALARI
═══════════════════════════════════════

1. Key UNIQUE bo'lishi kerak (bir ro'yxat ichida)
2. Key DOIMIY bo'lishi kerak (renderlar orasida o'zgarmaydi)
3. Key PREDICTABLE bo'lishi kerak (random/Date.now EMAS)

TO'G'RI key-lar:
  ✅ Database ID (user.id, product.id)
  ✅ Unique identifikator (UUID, slug)
  ✅ Kombinatsiya (category + '-' + id)

NOTO'G'RI key-lar:
  ❌ Math.random() — har renderda o'zgaradi
  ❌ Date.now() — har renderda yangi
  ❌ index — element tartibi o'zgarganda muammo

═══════════════════════════════════════
  KEY BILAN KOMPONENT RESET QILISH
═══════════════════════════════════════

Key o'zgarsa — React eski komponentni O'CHIRADI
va YANGI komponent yaratadi (state TOZALANADI).

Bu trick sifatida ishlatiladi:

  // userId o'zgarsa — ProfileForm QAYTADAN yaratiladi
  // ichidagi useState lar TOZALANADI
  <ProfileForm key={userId} userId={userId} />

Bu useEffect + setState bilan reset qilishdan YAXSHIROQ:
  - State avtomatik tozalanadi
  - Stale data ko'rinmaydi
  - Kod soddaro`,
    codeExamples: [
      {
        title: 'Index key muammosi — demo',
        language: 'tsx',
        code: `import { useState } from 'react'

interface Item {
  id: string
  text: string
}

function KeyDemo() {
  const [items, setItems] = useState<Item[]>([
    { id: 'a', text: 'Olma' },
    { id: 'b', text: 'Banan' },
    { id: 'c', text: 'Gilos' },
  ])

  function addToStart() {
    setItems([
      { id: crypto.randomUUID(), text: 'YANGI' },
      ...items,
    ])
  }

  return (
    <div>
      <button onClick={addToStart}>Boshiga qo'shish</button>

      {/* ❌ INDEX KEY — input qiymatlari aralashib ketadi */}
      <h3>Index key (noto'g'ri):</h3>
      {items.map((item, index) => (
        <div key={index} className="flex gap-2 mb-1">
          <span>{item.text}</span>
          <input defaultValue={item.text} />
          {/* "YANGI" qo'shilganda input-lar BIR POZITSIYA SILJIYDI */}
          {/* Chunki index o'zgaradi — React noto'g'ri elementni yangilaydi */}
        </div>
      ))}

      {/* ✅ UNIQUE KEY — to'g'ri ishlaydi */}
      <h3>Unique key (to'g'ri):</h3>
      {items.map(item => (
        <div key={item.id} className="flex gap-2 mb-1">
          <span>{item.text}</span>
          <input defaultValue={item.text} />
          {/* Yangi element qo'shilsa — faqat YANGI input yaratiladi */}
          {/* Eski input-lar o'z joyida qoladi */}
        </div>
      ))}
    </div>
  )
}`,
        description: 'Index key bilan boshiga element qo\'shilsa — barcha input qiymatlari aralashib ketadi. Unique key bilan — faqat yangi element yaratiladi, eskilar saqlanadi.',
      },
      {
        title: 'Key bilan komponent reset qilish',
        language: 'tsx',
        code: `import { useState } from 'react'

// Form komponent — ichida state bor
function UserForm({ userId }: { userId: string }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  return (
    <form>
      <h3>Foydalanuvchi: {userId}</h3>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Ism" />
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
    </form>
  )
}

function App() {
  const [selectedUser, setSelectedUser] = useState('user-1')

  return (
    <div>
      <button onClick={() => setSelectedUser('user-1')}>User 1</button>
      <button onClick={() => setSelectedUser('user-2')}>User 2</button>
      <button onClick={() => setSelectedUser('user-3')}>User 3</button>

      {/* ❌ KEY-SIZ — user o'zgarsa form state QOLADI (eski qiymatlar) */}
      {/* <UserForm userId={selectedUser} /> */}

      {/* ✅ KEY BILAN — user o'zgarsa form QAYTADAN YARATILADI */}
      <UserForm key={selectedUser} userId={selectedUser} />
      {/* name va email state TOZALANADI — chunki yangi komponent */}
    </div>
  )
}`,
        description: 'Key o\'zgarsa — React eski komponentni O\'CHIRADI va yangi yaratadi. Ichidagi useState lar tozalanadi. User o\'zgarganda form reset bo\'ladi — useEffect kerak emas.',
      },
    ],
    interviewQA: [
      {
        question: 'Key prop nima uchun kerak?',
        answer: `Key — React-ning reconciliation algoritmida elementlarni identifikatsiya qilish uchun. Ro'yxat yangilanganda React key orqali qaysi element qoldi, qo'shildi, o'chirildi yoki o'zgardi — aniq biladi. Key-siz React tartib bo'yicha taqqoslaydi — element qo'shilsa/o'chirilsa noto'g'ri natija beradi. Key unique va doimiy bo'lishi kerak — database ID eng yaxshi variant. Key React-ning ichki mexanizmi — props sifatida komponentga uzatilMAYDI.`,
      },
      {
        question: 'Index key nima uchun yomon?',
        answer: `Index key ro'yxat o'zgarsa muammo: element boshiga qo'shilsa, barcha index-lar siljiydi → React BARCHA elementlarni "o'zgardi" deb hisoblaydi → barchasi qayta renderlanadi. Bundan tashqari: uncontrolled input (defaultValue), animatsiya, ichki state — barchasi aralashib ketadi. Index key xavfsiz FAQAT: ro'yxat hech o'zgarMAsa, tartibi o'zgarMAsa, element qo'shilMAsa. Amalda — deyarli hech qachon. Doim unique ID ishlatish kerak.`,
      },
      {
        question: 'Key bilan komponent reset qilish qanday ishlaydi?',
        answer: `React key o'zgarsa eski komponentni unmount qiladi va YANGI komponent mount qiladi. Ichidagi barcha useState, useRef lar tozalanadi. Bu trick: <UserForm key={userId} /> — userId o'zgarsa form qaytadan yaratiladi, eski state qolmaydi. useEffect + setState bilan reset-dan afzalroq: 1) stale data ko'rinmaydi (bitta render-da), 2) kod soddaro, 3) barcha state avtomatik tozalanadi. Kamchiligi: DOM qaytadan yaratiladi — focus yo'qoladi.`,
      },
      {
        question: 'Math.random() yoki Date.now() key sifatida ishlatsa bo\'ladimi?',
        answer: `YO'Q! Key doimiy bo'lishi kerak — renderlar orasida o'zgarMAsligi kerak. Math.random() va Date.now() har renderda yangi qiymat beradi → React har renderda BARCHA elementlarni "yangi" deb hisoblaydi → barchasi unmount/mount bo'ladi → state yo'qoladi, animatsiya buziladi, performance yomonlashadi. To'g'ri key: database ID, UUID (yaratish vaqtida bir marta generatsiya qilish), yoki tarkibiy unique qiymat.`,
      },
    ],
    relatedTopics: [
      { techId: 'react-js', sectionId: 'react-core', topicId: 'virtual-dom', label: 'Reconciliation' },
      { techId: 'react-js', sectionId: 'theory-questions', topicId: 'key-importance', label: 'Nazariy savol' },
      { techId: 'react-js', sectionId: 'performance', topicId: 'virtualization', label: 'Virtualization' },
    ],
  }
