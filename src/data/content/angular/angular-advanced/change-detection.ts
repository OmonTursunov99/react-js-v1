import type { Topic } from '../../../types'

export const changeDetection: Topic = {
  id: 'change-detection',
  title: 'Change Detection',
  importance: 2,
  status: 'to-learn',
  description: 'Default vs OnPush, zone.js',
  content: `Change Detection — Default vs OnPush, zone.js

Bu mavzu haqida to'liq ma'lumot tayyorlanmoqda. Tez kunda batafsil kontent qo'shiladi.

Asosiy tushunchalar:
- Change Detection nima ekanligi
- Qachon va qanday ishlatilishi
- Amaliy misollar
- Intervyu savollari`,
  codeExamples: [
    {
      title: 'Change Detection — asosiy misol',
      language: 'ts',
      code: '// Change Detection misoli\n// Tez kunda qo\'shiladi',
      description: 'Change Detection ning asosiy ishlatilishi',
    },
  ],
  interviewQA: [
    {
      question: 'Change Detection nima va nima uchun ishlatiladi?',
      answer: 'Change Detection — Default vs OnPush, zone.js. Bu tushuncha zamonaviy web dasturlashda muhim ahamiyatga ega.',
    },
  ],
}
