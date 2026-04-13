import type { Topic } from '../../../types'

export const forms: Topic = {
  id: 'forms',
  title: 'Forms',
  importance: 3,
  status: 'to-learn',
  description: 'Template-driven, Reactive forms, validators',
  content: `Forms — Template-driven, Reactive forms, validators

Bu mavzu haqida to'liq ma'lumot tayyorlanmoqda. Tez kunda batafsil kontent qo'shiladi.

Asosiy tushunchalar:
- Forms nima ekanligi
- Qachon va qanday ishlatilishi
- Amaliy misollar
- Intervyu savollari`,
  codeExamples: [
    {
      title: 'Forms — asosiy misol',
      language: 'ts',
      code: '// Forms misoli\n// Tez kunda qo\'shiladi',
      description: 'Forms ning asosiy ishlatilishi',
    },
  ],
  interviewQA: [
    {
      question: 'Forms nima va nima uchun ishlatiladi?',
      answer: 'Forms — Template-driven, Reactive forms, validators. Bu tushuncha zamonaviy web dasturlashda muhim ahamiyatga ega.',
    },
  ],
}
