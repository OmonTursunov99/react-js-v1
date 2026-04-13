import type { Topic } from '../../../types'

export const rtl: Topic = {
  id: 'rtl',
  title: 'React Testing Library',
  importance: 3,
  status: 'to-learn',
  description: 'Queries, userEvent, screen',
  content: `React Testing Library — Queries, userEvent, screen

Bu mavzu haqida to'liq ma'lumot tayyorlanmoqda. Tez kunda batafsil kontent qo'shiladi.

Asosiy tushunchalar:
- React Testing Library nima ekanligi
- Qachon va qanday ishlatilishi
- Amaliy misollar
- Intervyu savollari`,
  codeExamples: [
    {
      title: 'React Testing Library — asosiy misol',
      language: 'tsx',
      code: '// React Testing Library misoli\n// Tez kunda qo\'shiladi',
      description: 'React Testing Library ning asosiy ishlatilishi',
    },
  ],
  interviewQA: [
    {
      question: 'React Testing Library nima va nima uchun ishlatiladi?',
      answer: 'React Testing Library — Queries, userEvent, screen. Bu tushuncha zamonaviy web dasturlashda muhim ahamiyatga ega.',
    },
  ],
}
