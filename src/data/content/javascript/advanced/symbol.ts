import type { Topic } from '../../../types'

export const symbol: Topic = {
  id: 'symbol',
  title: 'Symbol',
  importance: 2,
  status: 'to-learn',
  description: 'Symbol primitiv tipi va well-known symbollar',
  content: `Symbol — Symbol primitiv tipi va well-known symbollar

Bu mavzu haqida to'liq ma'lumot tayyorlanmoqda. Tez kunda batafsil kontent qo'shiladi.

Asosiy tushunchalar:
- Symbol nima ekanligi
- Qachon va qanday ishlatilishi
- Amaliy misollar
- Intervyu savollari`,
  codeExamples: [
    {
      title: 'Symbol — asosiy misol',
      language: 'js',
      code: '// Symbol misoli\n// Tez kunda qo\'shiladi',
      description: 'Symbol ning asosiy ishlatilishi',
    },
  ],
  interviewQA: [
    {
      question: 'Symbol nima va nima uchun ishlatiladi?',
      answer: 'Symbol — Symbol primitiv tipi va well-known symbollar. Bu tushuncha zamonaviy web dasturlashda muhim ahamiyatga ega.',
    },
  ],
}
