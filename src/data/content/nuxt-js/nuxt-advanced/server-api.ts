import type { Topic } from '../../../types'

export const serverApi: Topic = {
  id: 'server-api',
  title: 'Server API',
  importance: 2,
  status: 'to-learn',
  description: 'server/api/, event handlers',
  content: `Server API — server/api/, event handlers

Bu mavzu haqida to'liq ma'lumot tayyorlanmoqda. Tez kunda batafsil kontent qo'shiladi.

Asosiy tushunchalar:
- Server API nima ekanligi
- Qachon va qanday ishlatilishi
- Amaliy misollar
- Intervyu savollari`,
  codeExamples: [
    {
      title: 'Server API — asosiy misol',
      language: 'ts',
      code: '// Server API misoli\n// Tez kunda qo\'shiladi',
      description: 'Server API ning asosiy ishlatilishi',
    },
  ],
  interviewQA: [
    {
      question: 'Server API nima va nima uchun ishlatiladi?',
      answer: 'Server API — server/api/, event handlers. Bu tushuncha zamonaviy web dasturlashda muhim ahamiyatga ega.',
    },
  ],
}
