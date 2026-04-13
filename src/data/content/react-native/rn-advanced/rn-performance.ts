import type { Topic } from '../../../types'

export const rnPerformance: Topic = {
  id: 'rn-performance',
  title: 'Performance',
  importance: 2,
  status: 'to-learn',
  description: 'FlatList optimization, Hermes',
  content: `Performance — FlatList optimization, Hermes

Bu mavzu haqida to'liq ma'lumot tayyorlanmoqda. Tez kunda batafsil kontent qo'shiladi.

Asosiy tushunchalar:
- Performance nima ekanligi
- Qachon va qanday ishlatilishi
- Amaliy misollar
- Intervyu savollari`,
  codeExamples: [
    {
      title: 'Performance — asosiy misol',
      language: 'tsx',
      code: '// Performance misoli\n// Tez kunda qo\'shiladi',
      description: 'Performance ning asosiy ishlatilishi',
    },
  ],
  interviewQA: [
    {
      question: 'Performance nima va nima uchun ishlatiladi?',
      answer: 'Performance — FlatList optimization, Hermes. Bu tushuncha zamonaviy web dasturlashda muhim ahamiyatga ega.',
    },
  ],
}
