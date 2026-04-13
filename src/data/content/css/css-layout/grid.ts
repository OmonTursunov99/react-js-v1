import type { Topic } from '../../../types'

export const grid: Topic = {
  id: 'grid',
  title: 'CSS Grid',
  importance: 3,
  status: 'to-learn',
  description: 'Grid template, areas, minmax, fr unit',
  content: `CSS Grid — Grid template, areas, minmax, fr unit

Bu mavzu haqida to'liq ma'lumot tayyorlanmoqda. Tez kunda batafsil kontent qo'shiladi.

Asosiy tushunchalar:
- CSS Grid nima ekanligi
- Qachon va qanday ishlatilishi
- Amaliy misollar
- Intervyu savollari`,
  codeExamples: [
    {
      title: 'CSS Grid — asosiy misol',
      language: 'css',
      code: '// CSS Grid misoli\n// Tez kunda qo\'shiladi',
      description: 'CSS Grid ning asosiy ishlatilishi',
    },
  ],
  interviewQA: [
    {
      question: 'CSS Grid nima va nima uchun ishlatiladi?',
      answer: 'CSS Grid — Grid template, areas, minmax, fr unit. Bu tushuncha zamonaviy web dasturlashda muhim ahamiyatga ega.',
    },
  ],
}
