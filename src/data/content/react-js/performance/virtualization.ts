import type { Topic } from '../../../types'

export const virtualization: Topic = {
    id: 'virtualization',
    title: 'Virtualization',
    importance: 2,
    status: 'to-learn',
    description: 'Katta ro\'yxatlar — react-window / react-virtuoso',
    content: `Virtualization — katta ro'yxatlarni (1000+ element) samarali ko'rsatish texnikasi. Faqat KO'RINADIGAN elementlar DOM-da bo'ladi, qolganlari yo'q.

═══════════════════════════════════════
  MUAMMO: KATTA RO'YXAT
═══════════════════════════════════════

10,000 element ro'yxat:
  ❌ 10,000 DOM node yaratiladi
  ❌ Initial render sekin (100ms+)
  ❌ Scroll lag
  ❌ Xotira ko'p ishlatiladi
  ❌ Re-render juda sekin

HAQIQIY raqamlar:
  100 element → 2ms render (muammo yo'q)
  1,000 element → 20ms render (seziladi)
  10,000 element → 200ms+ render (foydalanib bo'lmaydi)

═══════════════════════════════════════
  VIRTUALIZATION KONSEPTI
═══════════════════════════════════════

10,000 elementdan faqat ~20 tasi ekranda ko'rinadi.
Virtualization — faqat ko'rinADIGAN elementlarni renderlaydii:

  Oddiy ro'yxat:
  [1] [2] [3] [4] [5] ... [9998] [9999] [10000]
  ← 10,000 DOM node →

  Virtualized:
  [scroll spacer]
  [visible: 15] [16] [17] [18] [19] ... [35]
  [scroll spacer]
  ← ~20 DOM node →

Qanday ishlaydi:
  1. Container — belgilangan balandlik (height: 500px, overflow: auto)
  2. Spacer — scroll hajmini to'g'ri ko'rsatish (total height)
  3. Faqat ko'rinadigan elementlar renderlanadi
  4. Scroll bo'lganda — yangi elementlar renderlanadi, eski o'chiriladi

═══════════════════════════════════════
  KUTUBXONALAR
═══════════════════════════════════════

react-window (Brian Vaughn):
  - Kichik bundle (~6KB)
  - FixedSizeList, VariableSizeList
  - Grid ham bor
  - Oddiy API

react-virtuoso:
  - O'zgaruvchan balandlik avtomatik
  - Grouped list
  - Infinite scroll built-in
  - Table virtualization
  - Kattaroq bundle (~15KB)

@tanstack/react-virtual:
  - Headless (UI yo'q — faqat logika)
  - Har qanday layout bilan ishlaydi
  - TypeScript-first
  - TanStack ekotizimi

═══════════════════════════════════════
  QACHON KERAK
═══════════════════════════════════════

Virtualization KERAK:
  ✅ 500+ element ro'yxat
  ✅ Scroll performance muammosi
  ✅ Har element murakkab (ko'p DOM node)

Virtualization KERAK EMAS:
  ❌ 100 dan kam element (oddiy ro'yxat yetarli)
  ❌ Pagination bilan cheklangan (50 per page)
  ❌ Elementlar balandligi juda farq qilsa (murakkablashadi)

ALTERNATIVALAR:
  - Pagination — sahifalar bo'yicha ko'rsatish
  - Infinite scroll — TanStack Query useInfiniteQuery
  - "Show more" button — bosqichma-bosqich ko'rsatish`,
    codeExamples: [
      {
        title: 'react-window — FixedSizeList',
        language: 'tsx',
        code: `import { FixedSizeList } from 'react-window'
import { memo } from 'react'

interface Item {
  id: string
  name: string
  email: string
}

// Har bir qator — memo bilan
const Row = memo(function Row({
  index,
  style,
  data,
}: {
  index: number
  style: React.CSSProperties
  data: Item[]
}) {
  const item = data[index]

  return (
    <div
      style={style}  // MUHIM: position va top react-window beradi
      className={\`flex items-center px-4 border-b \${
        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
      }\`}
    >
      <span className="w-12 text-gray-400">{index + 1}</span>
      <span className="flex-1 font-medium">{item.name}</span>
      <span className="text-gray-500">{item.email}</span>
    </div>
  )
})

function VirtualizedList({ items }: { items: Item[] }) {
  return (
    <FixedSizeList
      height={500}           // container balandligi
      width="100%"           // kenglik
      itemCount={items.length}  // jami elementlar
      itemSize={48}          // har qator balandligi (px)
      itemData={items}       // data Row-ga uzatiladi
    >
      {Row}
    </FixedSizeList>
  )
}

// 10,000 element — faqat ~12 tasi DOM-da
function App() {
  const items = Array.from({ length: 10000 }, (_, i) => ({
    id: String(i),
    name: \`User \${i}\`,
    email: \`user\${i}@example.com\`,
  }))

  return <VirtualizedList items={items} />
}`,
        description: 'react-window FixedSizeList — belgilangan balandlikdagi qatorlar. style prop MUHIM — position:absolute bilan joylashtiriladi. 10,000 elementdan faqat ~12 tasi DOM-da.',
      },
      {
        title: '@tanstack/react-virtual — headless virtualization',
        language: 'tsx',
        code: `import { useVirtualizer } from '@tanstack/react-virtual'
import { useRef } from 'react'

interface Message {
  id: string
  text: string
  sender: string
}

function VirtualMessageList({ messages }: { messages: Message[] }) {
  const parentRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60,  // taxminiy qator balandligi
    overscan: 5,             // ekran tashqarisida 5 ta qo'shimcha render
  })

  return (
    <div
      ref={parentRef}
      className="h-[500px] overflow-auto border rounded"
    >
      <div
        style={{ height: \`\${virtualizer.getTotalSize()}px\`, position: 'relative' }}
      >
        {virtualizer.getVirtualItems().map(virtualRow => {
          const message = messages[virtualRow.index]

          return (
            <div
              key={virtualRow.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: \`\${virtualRow.size}px\`,
                transform: \`translateY(\${virtualRow.start}px)\`,
              }}
              className="flex items-center px-4 border-b"
            >
              <span className="font-medium mr-2">{message.sender}:</span>
              <span>{message.text}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}`,
        description: '@tanstack/react-virtual — headless (UI bermaydi, faqat logika). O\'zingiz stil berasiz. estimateSize — taxminiy balandlik. overscan — scroll smooth bo\'lishi uchun qo\'shimcha elementlar.',
      },
    ],
    interviewQA: [
      {
        question: 'Virtualization nima va qanday ishlaydi?',
        answer: `Virtualization — katta ro'yxatdan faqat ekranda ko'rinadigan elementlarni DOM-ga qo'yish. 10,000 elementdan faqat ~20 tasi renderlanadi. Qanday ishlaydi: 1) Container belgilangan balandlik (overflow: auto), 2) Umumiy scroll hajmi saqlanadi (spacer/padding), 3) Scroll pozitsiyasiga qarab qaysi elementlar ko'rinishini hisoblaydi, 4) Faqat ko'rinadigan elementlar renderlanadi, 5) Scroll bo'lganda elementlar almashtiriladi. DOM node soni DOIMIY (~20-30), ro'yxat qanchalik katta bo'lishidan qat'iy nazar.`,
      },
      {
        question: 'Virtualization qachon kerak, qachon kerak emas?',
        answer: `KERAK: 500+ element, scroll lag bo'lganda, har element murakkab (ko'p DOM node). KERAK EMAS: 100 dan kam element (oddiy ro'yxat tez), pagination bilan cheklangan (50 per page), faqat bir marta ko'rsatiladigan ro'yxat. Alternativalar: pagination (sahifalar), infinite scroll (TanStack Query useInfiniteQuery bilan — kerak bo'lganda yuklash), "Show more" button. Virtualization murakkablik qo'shadi — faqat haqiqiy muammo bo'lganda ishlatish kerak.`,
      },
      {
        question: 'react-window va @tanstack/react-virtual farqi nima?',
        answer: `react-window — to'liq komponent beradi (FixedSizeList, VariableSizeList). Oddiy API, kichik bundle (~6KB). Cheklov: fixed/variable size, faqat list/grid. @tanstack/react-virtual — headless (faqat logika, UI yo'q). O'zingiz rendering boshqarasiz. Har qanday layout, o'zgaruvchan balandlik, TypeScript-first. Kattaroq flexibility. react-virtuoso — eng ko'p feature: avtomatik balandlik, grouped, infinite scroll built-in. Kattaroq bundle (~15KB).`,
      },
    ],
    relatedTopics: [
      { techId: 'react-js', sectionId: 'performance', topicId: 're-render-causes', label: 'Re-render kamytirish' },
      { techId: 'react-js', sectionId: 'performance', topicId: 'key-prop', label: 'Key Prop (list)' },
    ],
  }
