import type { Topic } from '../../../types'

export const nuxtMiddleware: Topic = {
  id: 'nuxt-middleware',
  title: 'Middleware',
  importance: 2,
  status: 'to-learn',
  description: 'Route middleware, server middleware',
  content: `Middleware — Route middleware, server middleware

Bu mavzu haqida to'liq ma'lumot tayyorlanmoqda. Tez kunda batafsil kontent qo'shiladi.

Asosiy tushunchalar:
- Middleware nima ekanligi
- Qachon va qanday ishlatilishi
- Amaliy misollar
- Intervyu savollari`,
  codeExamples: [
    {
      title: 'Middleware — asosiy misol',
      language: 'ts',
      code: '// Middleware misoli\n// Tez kunda qo\'shiladi',
      description: 'Middleware ning asosiy ishlatilishi',
    },
  ],
  interviewQA: [
    {
      question: 'Middleware nima va nima uchun ishlatiladi?',
      answer: 'Middleware — Route middleware, server middleware. Bu tushuncha zamonaviy web dasturlashda muhim ahamiyatga ega.',
    },
  ],
}
