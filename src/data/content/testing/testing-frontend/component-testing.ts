import type { Topic } from '../../../types'

export const componentTesting: Topic = {
  id: 'component-testing',
  title: 'Component Testing',
  importance: 3,
  status: 'to-learn',
  description: 'Rendering, assertions, snapshots',
  content: `Component Testing — Rendering, assertions, snapshots

Bu mavzu haqida to'liq ma'lumot tayyorlanmoqda. Tez kunda batafsil kontent qo'shiladi.

Asosiy tushunchalar:
- Component Testing nima ekanligi
- Qachon va qanday ishlatilishi
- Amaliy misollar
- Intervyu savollari`,
  codeExamples: [
    {
      title: 'Component Testing — asosiy misol',
      language: 'tsx',
      code: '// Component Testing misoli\n// Tez kunda qo\'shiladi',
      description: 'Component Testing ning asosiy ishlatilishi',
    },
  ],
  interviewQA: [
    {
      question: 'Component Testing nima va nima uchun ishlatiladi?',
      answer: 'Component Testing — Rendering, assertions, snapshots. Bu tushuncha zamonaviy web dasturlashda muhim ahamiyatga ega.',
    },
  ],
}
