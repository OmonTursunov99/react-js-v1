import type { Topic } from '../../../types'

export const rxjs: Topic = {
  id: 'rxjs',
  title: 'RxJS',
  importance: 3,
  status: 'to-learn',
  description: 'Observable, Subject, operators',
  content: `RxJS — Observable, Subject, operators

Bu mavzu haqida to'liq ma'lumot tayyorlanmoqda. Tez kunda batafsil kontent qo'shiladi.

Asosiy tushunchalar:
- RxJS nima ekanligi
- Qachon va qanday ishlatilishi
- Amaliy misollar
- Intervyu savollari`,
  codeExamples: [
    {
      title: 'RxJS — asosiy misol',
      language: 'ts',
      code: '// RxJS misoli\n// Tez kunda qo\'shiladi',
      description: 'RxJS ning asosiy ishlatilishi',
    },
  ],
  interviewQA: [
    {
      question: 'RxJS nima va nima uchun ishlatiladi?',
      answer: 'RxJS — Observable, Subject, operators. Bu tushuncha zamonaviy web dasturlashda muhim ahamiyatga ega.',
    },
  ],
}
