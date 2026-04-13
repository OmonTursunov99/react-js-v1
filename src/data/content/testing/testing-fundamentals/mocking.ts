import type { Topic } from '../../../types'

export const mocking: Topic = {
  id: 'mocking',
  title: 'Mocking',
  importance: 3,
  status: 'to-learn',
  description: 'vi.fn, vi.mock, spies, stubs',
  content: `Mocking — vi.fn, vi.mock, spies, stubs

Bu mavzu haqida to'liq ma'lumot tayyorlanmoqda. Tez kunda batafsil kontent qo'shiladi.

Asosiy tushunchalar:
- Mocking nima ekanligi
- Qachon va qanday ishlatilishi
- Amaliy misollar
- Intervyu savollari`,
  codeExamples: [
    {
      title: 'Mocking — asosiy misol',
      language: 'js',
      code: '// Mocking misoli\n// Tez kunda qo\'shiladi',
      description: 'Mocking ning asosiy ishlatilishi',
    },
  ],
  interviewQA: [
    {
      question: 'Mocking nima va nima uchun ishlatiladi?',
      answer: 'Mocking — vi.fn, vi.mock, spies, stubs. Bu tushuncha zamonaviy web dasturlashda muhim ahamiyatga ega.',
    },
  ],
}
