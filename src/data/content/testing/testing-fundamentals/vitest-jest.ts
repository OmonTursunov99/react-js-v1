import type { Topic } from '../../../types'

export const vitestJest: Topic = {
  id: 'vitest-jest',
  title: 'Vitest va Jest',
  importance: 3,
  status: 'to-learn',
  description: 'describe/it/expect, matchers, setup/teardown',
  content: `Vitest va Jest — describe/it/expect, matchers, setup/teardown

Bu mavzu haqida to'liq ma'lumot tayyorlanmoqda. Tez kunda batafsil kontent qo'shiladi.

Asosiy tushunchalar:
- Vitest va Jest nima ekanligi
- Qachon va qanday ishlatilishi
- Amaliy misollar
- Intervyu savollari`,
  codeExamples: [
    {
      title: 'Vitest va Jest — asosiy misol',
      language: 'js',
      code: '// Vitest va Jest misoli\n// Tez kunda qo\'shiladi',
      description: 'Vitest va Jest ning asosiy ishlatilishi',
    },
  ],
  interviewQA: [
    {
      question: 'Vitest va Jest nima va nima uchun ishlatiladi?',
      answer: 'Vitest va Jest — describe/it/expect, matchers, setup/teardown. Bu tushuncha zamonaviy web dasturlashda muhim ahamiyatga ega.',
    },
  ],
}
