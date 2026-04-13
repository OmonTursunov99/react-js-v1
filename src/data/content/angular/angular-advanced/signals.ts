import type { Topic } from '../../../types'

export const signals: Topic = {
  id: 'signals',
  title: 'Signals',
  importance: 3,
  status: 'to-learn',
  description: 'Angular Signals, computed, effect',
  content: `Signals — Angular Signals, computed, effect

Bu mavzu haqida to'liq ma'lumot tayyorlanmoqda. Tez kunda batafsil kontent qo'shiladi.

Asosiy tushunchalar:
- Signals nima ekanligi
- Qachon va qanday ishlatilishi
- Amaliy misollar
- Intervyu savollari`,
  codeExamples: [
    {
      title: 'Signals — asosiy misol',
      language: 'ts',
      code: '// Signals misoli\n// Tez kunda qo\'shiladi',
      description: 'Signals ning asosiy ishlatilishi',
    },
  ],
  interviewQA: [
    {
      question: 'Signals nima va nima uchun ishlatiladi?',
      answer: 'Signals — Angular Signals, computed, effect. Bu tushuncha zamonaviy web dasturlashda muhim ahamiyatga ega.',
    },
  ],
}
