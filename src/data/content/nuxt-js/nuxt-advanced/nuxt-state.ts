import type { Topic } from '../../../types'

export const nuxtState: Topic = {
  id: 'nuxt-state',
  title: 'State Management',
  importance: 2,
  status: 'to-learn',
  description: 'useState, Pinia with Nuxt',
  content: `State Management — useState, Pinia with Nuxt

Bu mavzu haqida to'liq ma'lumot tayyorlanmoqda. Tez kunda batafsil kontent qo'shiladi.

Asosiy tushunchalar:
- State Management nima ekanligi
- Qachon va qanday ishlatilishi
- Amaliy misollar
- Intervyu savollari`,
  codeExamples: [
    {
      title: 'State Management — asosiy misol',
      language: 'ts',
      code: '// State Management misoli\n// Tez kunda qo\'shiladi',
      description: 'State Management ning asosiy ishlatilishi',
    },
  ],
  interviewQA: [
    {
      question: 'State Management nima va nima uchun ishlatiladi?',
      answer: 'State Management — useState, Pinia with Nuxt. Bu tushuncha zamonaviy web dasturlashda muhim ahamiyatga ega.',
    },
  ],
}
