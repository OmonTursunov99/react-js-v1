import type { Topic } from '../../../types'

export const regex: Topic = {
  id: 'regex',
  title: 'Regular Expressions',
  importance: 2,
  status: 'to-learn',
  description: 'RegExp, patternlar, grouplar, lookahead',
  content: `Regular Expressions — RegExp, patternlar, grouplar, lookahead

Bu mavzu haqida to'liq ma'lumot tayyorlanmoqda. Tez kunda batafsil kontent qo'shiladi.

Asosiy tushunchalar:
- Regular Expressions nima ekanligi
- Qachon va qanday ishlatilishi
- Amaliy misollar
- Intervyu savollari`,
  codeExamples: [
    {
      title: 'Regular Expressions — asosiy misol',
      language: 'js',
      code: '// Regular Expressions misoli\n// Tez kunda qo\'shiladi',
      description: 'Regular Expressions ning asosiy ishlatilishi',
    },
  ],
  interviewQA: [
    {
      question: 'Regular Expressions nima va nima uchun ishlatiladi?',
      answer: 'Regular Expressions — RegExp, patternlar, grouplar, lookahead. Bu tushuncha zamonaviy web dasturlashda muhim ahamiyatga ega.',
    },
  ],
}
