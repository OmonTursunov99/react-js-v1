import type { Topic } from '../../../types'

export const flexbox: Topic = {
  id: 'flexbox',
  title: 'Flexbox',
  importance: 3,
  status: 'to-learn',
  description: 'Flex container/items, alignment, wrapping',
  content: `Flexbox — Flex container/items, alignment, wrapping

Bu mavzu haqida to'liq ma'lumot tayyorlanmoqda. Tez kunda batafsil kontent qo'shiladi.

Asosiy tushunchalar:
- Flexbox nima ekanligi
- Qachon va qanday ishlatilishi
- Amaliy misollar
- Intervyu savollari`,
  codeExamples: [
    {
      title: 'Flexbox — asosiy misol',
      language: 'css',
      code: '// Flexbox misoli\n// Tez kunda qo\'shiladi',
      description: 'Flexbox ning asosiy ishlatilishi',
    },
  ],
  interviewQA: [
    {
      question: 'Flexbox nima va nima uchun ishlatiladi?',
      answer: 'Flexbox — Flex container/items, alignment, wrapping. Bu tushuncha zamonaviy web dasturlashda muhim ahamiyatga ega.',
    },
  ],
}
