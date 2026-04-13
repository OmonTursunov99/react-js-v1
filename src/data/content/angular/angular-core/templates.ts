import type { Topic } from '../../../types'

export const templates: Topic = {
  id: 'templates',
  title: 'Templates',
  importance: 3,
  status: 'to-learn',
  description: 'Data binding, directives, pipes',
  content: `Templates — Data binding, directives, pipes

Bu mavzu haqida to'liq ma'lumot tayyorlanmoqda. Tez kunda batafsil kontent qo'shiladi.

Asosiy tushunchalar:
- Templates nima ekanligi
- Qachon va qanday ishlatilishi
- Amaliy misollar
- Intervyu savollari`,
  codeExamples: [
    {
      title: 'Templates — asosiy misol',
      language: 'ts',
      code: '// Templates misoli\n// Tez kunda qo\'shiladi',
      description: 'Templates ning asosiy ishlatilishi',
    },
  ],
  interviewQA: [
    {
      question: 'Templates nima va nima uchun ishlatiladi?',
      answer: 'Templates — Data binding, directives, pipes. Bu tushuncha zamonaviy web dasturlashda muhim ahamiyatga ega.',
    },
  ],
}
