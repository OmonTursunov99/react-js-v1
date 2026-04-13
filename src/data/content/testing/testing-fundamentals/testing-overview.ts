import type { Topic } from '../../../types'

export const testingOverview: Topic = {
  id: 'testing-overview',
  title: 'Testing Overview',
  importance: 3,
  status: 'to-learn',
  description: 'Unit/integration/e2e, testing pyramid, TDD',
  content: `Testing Overview — Unit/integration/e2e, testing pyramid, TDD

Bu mavzu haqida to'liq ma'lumot tayyorlanmoqda. Tez kunda batafsil kontent qo'shiladi.

Asosiy tushunchalar:
- Testing Overview nima ekanligi
- Qachon va qanday ishlatilishi
- Amaliy misollar
- Intervyu savollari`,
  codeExamples: [
    {
      title: 'Testing Overview — asosiy misol',
      language: 'js',
      code: '// Testing Overview misoli\n// Tez kunda qo\'shiladi',
      description: 'Testing Overview ning asosiy ishlatilishi',
    },
  ],
  interviewQA: [
    {
      question: 'Testing Overview nima va nima uchun ishlatiladi?',
      answer: 'Testing Overview — Unit/integration/e2e, testing pyramid, TDD. Bu tushuncha zamonaviy web dasturlashda muhim ahamiyatga ega.',
    },
  ],
}
