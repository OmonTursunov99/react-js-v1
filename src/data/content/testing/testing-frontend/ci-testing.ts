import type { Topic } from '../../../types'

export const ciTesting: Topic = {
  id: 'ci-testing',
  title: 'CI/CD Testing',
  importance: 2,
  status: 'to-learn',
  description: 'CI integration, coverage, reporting',
  content: `CI/CD Testing — CI integration, coverage, reporting

Bu mavzu haqida to'liq ma'lumot tayyorlanmoqda. Tez kunda batafsil kontent qo'shiladi.

Asosiy tushunchalar:
- CI/CD Testing nima ekanligi
- Qachon va qanday ishlatilishi
- Amaliy misollar
- Intervyu savollari`,
  codeExamples: [
    {
      title: 'CI/CD Testing — asosiy misol',
      language: 'js',
      code: '// CI/CD Testing misoli\n// Tez kunda qo\'shiladi',
      description: 'CI/CD Testing ning asosiy ishlatilishi',
    },
  ],
  interviewQA: [
    {
      question: 'CI/CD Testing nima va nima uchun ishlatiladi?',
      answer: 'CI/CD Testing — CI integration, coverage, reporting. Bu tushuncha zamonaviy web dasturlashda muhim ahamiyatga ega.',
    },
  ],
}
