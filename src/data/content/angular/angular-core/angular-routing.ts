import type { Topic } from '../../../types'

export const angularRouting: Topic = {
  id: 'angular-routing',
  title: 'Routing',
  importance: 3,
  status: 'to-learn',
  description: 'RouterModule, guards, lazy routes',
  content: `Routing — RouterModule, guards, lazy routes

Bu mavzu haqida to'liq ma'lumot tayyorlanmoqda. Tez kunda batafsil kontent qo'shiladi.

Asosiy tushunchalar:
- Routing nima ekanligi
- Qachon va qanday ishlatilishi
- Amaliy misollar
- Intervyu savollari`,
  codeExamples: [
    {
      title: 'Routing — asosiy misol',
      language: 'ts',
      code: '// Routing misoli\n// Tez kunda qo\'shiladi',
      description: 'Routing ning asosiy ishlatilishi',
    },
  ],
  interviewQA: [
    {
      question: 'Routing nima va nima uchun ishlatiladi?',
      answer: 'Routing — RouterModule, guards, lazy routes. Bu tushuncha zamonaviy web dasturlashda muhim ahamiyatga ega.',
    },
  ],
}
