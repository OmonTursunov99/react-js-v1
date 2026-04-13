import type { Topic } from '../../../types'

export const asyncTesting: Topic = {
  id: 'async-testing',
  title: 'Async Testing',
  importance: 2,
  status: 'to-learn',
  description: 'Async testlar, timerlar, network',
  content: `Async Testing — Async testlar, timerlar, network

Bu mavzu haqida to'liq ma'lumot tayyorlanmoqda. Tez kunda batafsil kontent qo'shiladi.

Asosiy tushunchalar:
- Async Testing nima ekanligi
- Qachon va qanday ishlatilishi
- Amaliy misollar
- Intervyu savollari`,
  codeExamples: [
    {
      title: 'Async Testing — asosiy misol',
      language: 'js',
      code: '// Async Testing misoli\n// Tez kunda qo\'shiladi',
      description: 'Async Testing ning asosiy ishlatilishi',
    },
  ],
  interviewQA: [
    {
      question: 'Async Testing nima va nima uchun ishlatiladi?',
      answer: 'Async Testing — Async testlar, timerlar, network. Bu tushuncha zamonaviy web dasturlashda muhim ahamiyatga ega.',
    },
  ],
}
