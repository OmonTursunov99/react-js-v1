import type { Topic } from '../../../types'

export const e2eTesting: Topic = {
  id: 'e2e-testing',
  title: 'E2E Testing',
  importance: 2,
  status: 'to-learn',
  description: 'Playwright, Cypress, page objects',
  content: `E2E Testing — Playwright, Cypress, page objects

Bu mavzu haqida to'liq ma'lumot tayyorlanmoqda. Tez kunda batafsil kontent qo'shiladi.

Asosiy tushunchalar:
- E2E Testing nima ekanligi
- Qachon va qanday ishlatilishi
- Amaliy misollar
- Intervyu savollari`,
  codeExamples: [
    {
      title: 'E2E Testing — asosiy misol',
      language: 'js',
      code: '// E2E Testing misoli\n// Tez kunda qo\'shiladi',
      description: 'E2E Testing ning asosiy ishlatilishi',
    },
  ],
  interviewQA: [
    {
      question: 'E2E Testing nima va nima uchun ishlatiladi?',
      answer: 'E2E Testing — Playwright, Cypress, page objects. Bu tushuncha zamonaviy web dasturlashda muhim ahamiyatga ega.',
    },
  ],
}
