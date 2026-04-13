import type { Topic } from '../../../types'

export const dependencyInjection: Topic = {
  id: 'dependency-injection',
  title: 'Dependency Injection',
  importance: 3,
  status: 'to-learn',
  description: 'DI system, providers, services',
  content: `Dependency Injection — DI system, providers, services

Bu mavzu haqida to'liq ma'lumot tayyorlanmoqda. Tez kunda batafsil kontent qo'shiladi.

Asosiy tushunchalar:
- Dependency Injection nima ekanligi
- Qachon va qanday ishlatilishi
- Amaliy misollar
- Intervyu savollari`,
  codeExamples: [
    {
      title: 'Dependency Injection — asosiy misol',
      language: 'ts',
      code: '// Dependency Injection misoli\n// Tez kunda qo\'shiladi',
      description: 'Dependency Injection ning asosiy ishlatilishi',
    },
  ],
  interviewQA: [
    {
      question: 'Dependency Injection nima va nima uchun ishlatiladi?',
      answer: 'Dependency Injection — DI system, providers, services. Bu tushuncha zamonaviy web dasturlashda muhim ahamiyatga ega.',
    },
  ],
}
