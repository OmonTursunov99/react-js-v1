import type { Topic } from '../../../types'

export const useDeferredValue: Topic = {
    id: 'use-deferred-value',
    title: 'useDeferredValue',
    importance: 2,
    status: 'to-learn' as const,
    description: `Qiymat yangilanishini kechiktirish uchun concurrent hook — tezkor UI bilan og'ir hisoblashni ajratadi`,
    content: `useDeferredValue — React 18 da qo'shilgan concurrent hook. U qiymat yangilanishini kechiktiradi: asl qiymat o'zgarganda, deferred versiya "keyinroq" yangilanadi.

═══════════════════════════════════════
  SINTAKSIS
═══════════════════════════════════════

  const deferredValue = useDeferredValue(value)

  - value — kechiktirmoqchi bo'lgan qiymat (state, props, yoki boshqa)
  - deferredValue — value-ning "kechiktirilgan" versiyasi

  Birinchi renderda deferredValue = value (bir xil).
  Keyingi yangilanishlarda deferredValue eski qiymatni ushlab turadi,
  yangi qiymat past prioritetda yangilanadi.

═══════════════════════════════════════
  NIMA UCHUN KERAK
═══════════════════════════════════════

Muammo: Input-ga yozganda har harf uchun og'ir hisoblash
bo'lsa (filterlash, rendering), UI sekinlashadi.

Yechim: Input TEZDA yangilanadi, lekin og'ir qism
KECHIKTIRILGAN qiymat bilan ishlaydi.

  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)

  // query — input-da ko'rinadigan (tezkor)
  // deferredQuery — filterlash uchun (kechiktirilgan)

═══════════════════════════════════════
  QANDAY ISHLAYDI
═══════════════════════════════════════

  1. query o'zgaradi: 'a' -> 'ab' -> 'abc'
  2. React har safar avval TEZKOR yangilanishlarni qiladi
  3. Keyin deferredQuery-ni yangilaydi
  4. Agar yangi tezkor yangilanish kelsa —
     deferred yangilanishni TO'XTATADI
  5. Faqat foydalanuvchi to'xtab turganda
     deferred to'liq yangilanadi

  Vaqt chizig'i:
  query:         'a' → 'ab' → 'abc'  (DARHOL)
  deferredQuery: 'a' →  'a' → 'abc'  ('ab' ni O'TKAZIB yuboradi)

═══════════════════════════════════════
  ASOSIY USE CASE
═══════════════════════════════════════

Search input + natijalar ro'yxati:
- Input tezda yangilanadi (foydalanuvchi erkin yozadi)
- Natijalar ro'yxati kechiktirilgan qiymat bilan ishlaydi
- Og'ir rendering foydalanuvchini TO'SLAMAYDI

═══════════════════════════════════════
  useTransition vs useDeferredValue
═══════════════════════════════════════

  useTransition:
    - setState-ni O'ZINGIZ wrap qilasiz
    - Action-ni kechiktiradi
    - isPending bor
    - setState-ga to'g'ridan-to'g'ri kirish bor

  useDeferredValue:
    - Tashqaridan kelgan VALUE-ni kechiktiradi
    - Props yoki boshqa qiymatlar uchun
    - isPending YO'Q (lekin value !== deferredValue tekshirish mumkin)
    - setState-ga kirish shart emas

═══════════════════════════════════════
  DEBOUNCE BILAN TAQQOSLASH
═══════════════════════════════════════

  Debounce:
    - Belgilangan vaqt kutadi (masalan 300ms)
    - Qurilma tezligidan qat'iy nazar DOIM kutadi
    - Tezkor qurilmada ham 300ms kutadi — bekorga

  useDeferredValue:
    - React O'ZI boshqaradi
    - Qurilma tezligiga MOSLANADI
    - Tezkor qurilmada deyarli darhol
    - Sekin qurilmada ko'proq kechiktiradi
    - Vaqtni BELGILASH shart emas`,
    codeExamples: [
      {
        title: 'Search input + natijalar — input tezkor, natijalar deferred',
        language: 'tsx' as const,
        code: `import { useState, useDeferredValue, useMemo } from 'react'

// Katta ma'lumotlar bazasi
const database = Array.from({ length: 10000 }, (_, i) => ({
  id: i + 1,
  title: \`Maqola #\${i + 1}: \${['React', 'TypeScript', 'JavaScript', 'Node.js', 'CSS'][i % 5]} bo'yicha\`,
}))

function SearchResults({ query }: { query: string }) {
  // Og'ir filterlash
  const results = useMemo(() => {
    if (!query.trim()) return []
    return database.filter(item =>
      item.title.toLowerCase().includes(query.toLowerCase())
    )
  }, [query])

  return (
    <div>
      <p style={{ color: '#6b7280' }}>{results.length} ta natija</p>
      <ul style={{ maxHeight: 300, overflow: 'auto' }}>
        {results.slice(0, 200).map(item => (
          <li key={item.id} style={{ padding: '4px 0' }}>
            {item.title}
          </li>
        ))}
      </ul>
    </div>
  )
}

function SearchPage() {
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)

  // query !== deferredQuery — yangilanish davom etyapti
  const isStale = query !== deferredQuery

  return (
    <div style={{ padding: 16 }}>
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Qidirish..."
        style={{ padding: '8px 12px', width: 300, fontSize: 16 }}
      />

      {/* Natijalar kechiktirilgan qiymat bilan ishlaydi */}
      <div style={{
        opacity: isStale ? 0.6 : 1,
        transition: 'opacity 0.15s',
      }}>
        <SearchResults query={deferredQuery} />
      </div>
    </div>
  )
}`,
        description: `Input-ga yozganda query darhol yangilanadi — input responsive. Lekin SearchResults komponenti deferredQuery bilan ishlaydi — kechiktirilgan. query !== deferredQuery bo'lganda natijalar xiralashadi (opacity 0.6) — yangilanish davom etyaptini ko'rsatadi.`,
      },
      {
        title: `Og'ir komponent lazy yangilanish`,
        language: 'tsx' as const,
        code: `import { useState, useDeferredValue, memo } from 'react'

// Og'ir komponent — ko'p elementlarni chizadi
const HeavyChart = memo(function HeavyChart({ value }: { value: number }) {
  // Simulatsiya: og'ir rendering
  const bars = Array.from({ length: 500 }, (_, i) => {
    const height = Math.sin((i + value) * 0.1) * 50 + 50
    return (
      <div
        key={i}
        style={{
          display: 'inline-block',
          width: 2,
          height,
          background: \`hsl(\${(i + value) % 360}, 70%, 50%)\`,
          marginRight: 1,
        }}
      />
    )
  })

  return (
    <div style={{ overflow: 'hidden', height: 120 }}>
      {bars}
    </div>
  )
})

function SliderWithChart() {
  const [value, setValue] = useState(0)
  const deferredValue = useDeferredValue(value)

  const isStale = value !== deferredValue

  return (
    <div style={{ padding: 16 }}>
      <input
        type="range"
        min={0}
        max={1000}
        value={value}
        onChange={e => setValue(Number(e.target.value))}
        style={{ width: '100%' }}
      />
      <p>Hozirgi qiymat: {value}</p>

      {/* Chart kechiktirilgan qiymat bilan ishlaydi */}
      <div style={{ opacity: isStale ? 0.7 : 1 }}>
        <HeavyChart value={deferredValue} />
      </div>
    </div>
  )
}`,
        description: `Slider tezda harakatlanadi (value darhol yangilanadi), lekin og'ir HeavyChart komponenti deferredValue bilan ishlaydi. memo bilan o'ralgan — faqat deferredValue o'zgarganda qayta renderlanadi. Slider silliq ishlaydi, chart "keyinroq" yangilanadi.`,
      },
    ],
    interviewQA: [
      {
        question: 'useDeferredValue qanday ishlaydi? Ichki mexanizmi qanday?',
        answer: `useDeferredValue qiymatning "kechiktirilgan" versiyasini yaratadi. Asl qiymat o'zgarganda, React avval barcha tezkor (yuqori prioritetli) yangilanishlarni bajaradi — input, click va boshqalar. Keyin deferred qiymatni past prioritetda yangilaydi. Agar yangi tezkor yangilanish kelsa, React deferred yangilanishni TO'XTATADI va avval tezkor ishni bajaradi. Bu concurrent rendering-ning bir qismi — React ish-ni bo'laklarga bo'lib bajaradi va foydalanuvchi interaksiyasiga doim javob beradi.`,
      },
      {
        question: `Debounce va useDeferredValue o'rtasidagi farq nima? Qaysi biri yaxshiroq?`,
        answer: `Debounce belgilangan vaqt kutadi (masalan 300ms) — qurilma tezligidan qat'iy nazar DOIM kutadi. Tezkor qurilmada ham 300ms kutadi, bu bekorga kechikish. useDeferredValue esa React tomonidan boshqariladi va qurilma tezligiga moslanadi: tezkor qurilmada deyarli darhol yangilanadi, sekin qurilmada ko'proq kechiktiradi. Bundan tashqari useDeferredValue concurrent rendering bilan integratsiyalangan — React ish-ni bo'laklaydi va foydalanuvchi interaksiyasini uzmasdan bajaradi. Debounce esa oddiy timer — React rendering siklidan xabarsiz.`,
      },
      {
        question: 'Qachon useTransition, qachon useDeferredValue ishlatish kerak?',
        answer: `Qoida oddiy: agar siz setState-ni chaqirayotgan bo'lsangiz va unga to'g'ridan-to'g'ri kirishingiz bor — useTransition ishlatish yaxshiroq, chunki startTransition ichiga setState-ni wrap qilasiz va isPending ham olasiz. Agar esa value tashqaridan kelsa (props, context) va siz setState-ni chaqirmayapsiz — useDeferredValue ishlatish kerak. Masalan: child komponent props orqali query olsa, u useDeferredValue ishlatadi. Parent komponent esa o'zining setState-ini useTransition bilan wrap qilishi mumkin.`,
      },
    ],
    relatedTopics: [
      { techId: 'react-js', sectionId: 'react-core', topicId: 'use-transition', label: 'useTransition' },
      { techId: 'react-js', sectionId: 'performance', topicId: 'debounce-throttle', label: 'Debounce/Throttle bilan taqqoslash' },
      { techId: 'react-js', sectionId: 'theory-questions', topicId: 'concurrent-mode', label: 'Concurrent Features' },
    ],
}
