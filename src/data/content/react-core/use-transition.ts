import type { Topic } from '../../types'

export const useTransition: Topic = {
    id: 'use-transition',
    title: 'useTransition',
    importance: 2,
    status: 'to-learn' as const,
    description: `Og'ir state yangilanishlarni past prioritetli qilib, UI responsiv saqlash uchun React 18+ concurrent hook`,
    content: `useTransition — React 18 da qo'shilgan concurrent hook. U og'ir (sekin) state yangilanishlarni PAST prioritetli qiladi, shunda UI responsiv (javob beradigan) qoladi.

═══════════════════════════════════════
  SINTAKSIS
═══════════════════════════════════════

  const [isPending, startTransition] = useTransition()

  - isPending: boolean — transition hali tugamaganmi?
  - startTransition: (callback) => void — past prioritetli yangilanish boshlash

═══════════════════════════════════════
  NIMA UCHUN KERAK
═══════════════════════════════════════

Muammo: Ba'zi state yangilanishlar OG'IR bo'lishi mumkin:
- Katta ro'yxatni filterlash (10,000+ element)
- Murakkab komponentni qayta renderlash
- Katta data-ni qayta hisoblash

Bu vaqtda UI "qotib qoladi" — foydalanuvchi boshqa
tugmalarni bosa olmaydi, input-ga yoza olmaydi.

Yechim: startTransition ichidagi setState PAST prioritetli.
React avval TEZKOR yangilanishlarni bajaradi (input, click),
keyin transition-ni.

═══════════════════════════════════════
  QANDAY ISHLAYDI
═══════════════════════════════════════

  function handleTabChange(tab: string) {
    setActiveTab(tab)                    // TEZKOR — darhol yangilanadi

    startTransition(() => {
      setTabContent(loadHeavyContent(tab)) // SEKIN — past prioritet
    })
  }

  1. setActiveTab — yuqori prioritet, darhol bajariladi
  2. startTransition ichidagi setTabContent — past prioritet
  3. React avval tab-ni o'zgartiradi
  4. Keyin content-ni yangilaydi
  5. Agar yangi tezkor yangilanish kelsa — transition-ni TO'XTATADI

═══════════════════════════════════════
  isPending — LOADING INDICATOR
═══════════════════════════════════════

isPending = true bo'ladi transition boshlanganidan to
tugagunicha. Bu vaqtda loading indicator ko'rsatish mumkin:

  {isPending && <Spinner />}
  {isPending ? <Skeleton /> : <Content />}

isPending UI-ni bloklaMASlik bilan loading holatini
ko'rsatish imkonini beradi.

═══════════════════════════════════════
  startTransition vs useDeferredValue
═══════════════════════════════════════

  startTransition — ACTION-ni kechiktiradi:
    Siz setState chaqiruvini o'zingiz wrap qilasiz.
    Qachon transition boshlashni SIZ hal qilasiz.

  useDeferredValue — QIYMAT-ni kechiktiradi:
    Tashqaridan kelgan value-ning eski versiyasini ushlab turadi.
    Props yoki boshqa qiymatlar uchun qulay.

  Qoida: Agar setState-ga kirishingiz bor — useTransition.
  Agar faqat value bor (props) — useDeferredValue.

═══════════════════════════════════════
  REACT 18 CONCURRENT FEATURE
═══════════════════════════════════════

useTransition — concurrent rendering-ning bir qismi:
- React ish-ni kichik BO'LAKLARGA bo'ladi
- Har bo'lak orasida foydalanuvchi interaksiyasini tekshiradi
- Agar yangi input/click bo'lsa — transition-ni TO'XTATIB,
  tezkor yangilanishni bajaradi
- Keyin transition-ni DAVOM ettiradi

Bu "time slicing" deyiladi — React vaqtni bo'laklarga bo'ladi.`,
    codeExamples: [
      {
        title: 'Tab almashtirish — isPending bilan loading',
        language: 'tsx' as const,
        code: `import { useState, useTransition } from 'react'

interface TabContentProps {
  tab: string
}

// Og'ir komponent — ko'p elementlarni renderlaydigan
function HeavyTabContent({ tab }: TabContentProps) {
  const items = Array.from({ length: 5000 }, (_, i) => (
    <div key={i} style={{ padding: '2px 0' }}>
      {tab} — element #{i + 1}
    </div>
  ))
  return <div>{items}</div>
}

function TabsExample() {
  const [activeTab, setActiveTab] = useState('tab1')
  const [contentTab, setContentTab] = useState('tab1')
  const [isPending, startTransition] = useTransition()

  const tabs = ['tab1', 'tab2', 'tab3']

  function handleTabClick(tab: string) {
    // TEZKOR — tab darhol active bo'ladi
    setActiveTab(tab)

    // SEKIN — content past prioritetda yangilanadi
    startTransition(() => {
      setContentTab(tab)
    })
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => handleTabClick(tab)}
            style={{
              padding: '8px 16px',
              background: activeTab === tab ? '#3b82f6' : '#e5e7eb',
              color: activeTab === tab ? 'white' : 'black',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
            }}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* isPending — transition davom etyapti */}
      <div style={{ opacity: isPending ? 0.5 : 1, transition: 'opacity 0.2s' }}>
        {isPending && <p>Yuklanmoqda...</p>}
        <HeavyTabContent tab={contentTab} />
      </div>
    </div>
  )
}`,
        description: `Tab bosilganda activeTab darhol o'zgaradi (tezkor), lekin og'ir content past prioritetda yangilanadi. isPending=true bo'lganda opacity 0.5 va "Yuklanmoqda..." ko'rsatiladi. Foydalanuvchi boshqa tab-larga bosishi mumkin — UI qotmaydi.`,
      },
      {
        title: `Katta ro'yxat filterlash — input tezkor, list transition`,
        language: 'tsx' as const,
        code: `import { useState, useTransition, useMemo } from 'react'

// 10,000 ta mahsulot generatsiya qilish
const allProducts = Array.from({ length: 10000 }, (_, i) => ({
  id: i + 1,
  name: \`Mahsulot #\${i + 1}\`,
  category: ['Elektronika', 'Kiyim', 'Oziq-ovqat', 'Kitob'][i % 4],
  price: Math.round(Math.random() * 100000) / 100,
}))

function ProductFilter() {
  const [query, setQuery] = useState('')
  const [filterQuery, setFilterQuery] = useState('')
  const [isPending, startTransition] = useTransition()

  // Og'ir filterlash — faqat filterQuery o'zgarganda ishlaydi
  const filteredProducts = useMemo(() => {
    if (!filterQuery) return allProducts.slice(0, 100)
    return allProducts.filter(p =>
      p.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(filterQuery.toLowerCase())
    )
  }, [filterQuery])

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value

    // TEZKOR — input darhol yangilanadi
    setQuery(value)

    // SEKIN — filterlash past prioritetda
    startTransition(() => {
      setFilterQuery(value)
    })
  }

  return (
    <div style={{ padding: 16 }}>
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Mahsulot qidiring..."
        style={{ padding: '8px 12px', width: 300, fontSize: 16 }}
      />

      {isPending && (
        <p style={{ color: '#6b7280' }}>Qidirilmoqda...</p>
      )}

      <p>{filteredProducts.length} ta natija</p>

      <div style={{ maxHeight: 400, overflow: 'auto' }}>
        {filteredProducts.map(p => (
          <div key={p.id} style={{ padding: '4px 0', borderBottom: '1px solid #eee' }}>
            {p.name} — {p.category} — {p.price} so'm
          </div>
        ))}
      </div>
    </div>
  )
}`,
        description: 'Input-ga yozganda query darhol yangilanadi (input responsive), lekin 10,000 ta mahsulotni filterlash startTransition ichida past prioritetda bajariladi. Foydalanuvchi input-ga tez yoza oladi, UI qotmaydi.',
      },
    ],
    interviewQA: [
      {
        question: 'useTransition nima uchun kerak? Oddiy setState-dan farqi nima?',
        answer: `useTransition og'ir (sekin) state yangilanishlarni past prioritetli qilish uchun kerak. Oddiy setState-da barcha yangilanishlar bir xil prioritetda — agar bittasi sekin bo'lsa, UI qotib qoladi. useTransition bilan siz setState-ni startTransition ichiga o'raysiz va React uni past prioritetli deb belgilaydi. Natijada React avval tezkor yangilanishlarni (input yozish, tugma bosish) bajaradi, keyin sekin transition-ni. Agar yangi tezkor yangilanish kelsa, React transition-ni to'xtatib, avval tezkor ishni bajaradi.`,
      },
      {
        question: 'isPending qanday ishlatiladi? Nima uchun kerak?',
        answer: `isPending — useTransition qaytaradigan boolean qiymat. U transition boshlanganidan to tugaguncha true bo'ladi. isPending yordamida foydalanuvchiga "ish bajarilmoqda" deb ko'rsatish mumkin: loading spinner, skeleton, opacity kamaytirish, "Yuklanmoqda..." matni. Masalan: {isPending && <Spinner />} yoki style={{ opacity: isPending ? 0.5 : 1 }}. isPending muhim chunki u UI-ni bloklaMASdan foydalanuvchiga feedback beradi — yangilanish ketayotganini bildiradi.`,
      },
      {
        question: `useTransition va useDeferredValue o'rtasidagi farq nima? Qachon qaysi birini ishlatish kerak?`,
        answer: `Asosiy farq: useTransition ACTION-ni (setState chaqiruvi) kechiktiradi, useDeferredValue esa QIYMAT-ni kechiktiradi. useTransition-da siz startTransition ichiga setState-ni o'zingiz o'raysiz — setState-ga to'g'ridan-to'g'ri kirishingiz bor. useDeferredValue-da esa tashqaridan kelgan value-ning (masalan props) eski versiyasini vaqtincha ushlab turadi. Qoida: agar setState-ga kirishingiz bor — useTransition, agar faqat props yoki boshqa qiymatni kechiktirish kerak — useDeferredValue. Ikkalasi ham React 18 concurrent feature.`,
      },
    ],
    relatedTopics: [
      { sectionId: 'react-core', topicId: 'use-deferred-value', label: 'useDeferredValue' },
      { sectionId: 'theory-questions', topicId: 'concurrent-mode', label: 'Concurrent Features' },
      { sectionId: 'performance', topicId: 're-render-causes', label: 'Re-render prioritetlari' },
    ],
}
