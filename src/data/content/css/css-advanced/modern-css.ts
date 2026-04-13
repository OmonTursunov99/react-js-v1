import type { Topic } from '../../../types'

export const modernCss: Topic = {
  id: 'modern-css',
  title: 'Zamonaviy CSS',
  importance: 2,
  status: 'to-learn',
  description: ':has(), container queries, nesting, @layer',
  content: `Zamonaviy CSS — :has(), container queries, nesting, @layer

Bu mavzu haqida to'liq ma'lumot tayyorlanmoqda. Tez kunda batafsil kontent qo'shiladi.

Asosiy tushunchalar:
- Zamonaviy CSS nima ekanligi
- Qachon va qanday ishlatilishi
- Amaliy misollar
- Intervyu savollari`,
  codeExamples: [
    {
      title: 'Zamonaviy CSS — asosiy misol',
      language: 'css',
      code: '// Zamonaviy CSS misoli\n// Tez kunda qo\'shiladi',
      description: 'Zamonaviy CSS ning asosiy ishlatilishi',
    },
  ],
  interviewQA: [
    {
      question: 'Zamonaviy CSS nima va nima uchun ishlatiladi?',
      answer: 'Zamonaviy CSS — :has(), container queries, nesting, @layer. Bu tushuncha zamonaviy web dasturlashda muhim ahamiyatga ega.',
    },
  ],
}
