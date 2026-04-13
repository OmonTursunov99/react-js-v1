import type { Topic } from '../../../types'

export const customProperties: Topic = {
  id: 'custom-properties',
  title: 'CSS Variables',
  importance: 3,
  status: 'to-learn',
  description: 'Custom properties, themes',
  content: `CSS Variables — Custom properties, themes

Bu mavzu haqida to'liq ma'lumot tayyorlanmoqda. Tez kunda batafsil kontent qo'shiladi.

Asosiy tushunchalar:
- CSS Variables nima ekanligi
- Qachon va qanday ishlatilishi
- Amaliy misollar
- Intervyu savollari`,
  codeExamples: [
    {
      title: 'CSS Variables — asosiy misol',
      language: 'css',
      code: '// CSS Variables misoli\n// Tez kunda qo\'shiladi',
      description: 'CSS Variables ning asosiy ishlatilishi',
    },
  ],
  interviewQA: [
    {
      question: 'CSS Variables nima va nima uchun ishlatiladi?',
      answer: 'CSS Variables — Custom properties, themes. Bu tushuncha zamonaviy web dasturlashda muhim ahamiyatga ega.',
    },
  ],
}
