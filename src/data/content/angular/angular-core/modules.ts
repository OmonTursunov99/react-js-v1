import type { Topic } from '../../../types'

export const modules: Topic = {
  id: 'modules',
  title: 'Modules',
  importance: 3,
  status: 'to-learn',
  description: 'NgModule, standalone, lazy loading',
  content: `Modules — NgModule, standalone, lazy loading

Bu mavzu haqida to'liq ma'lumot tayyorlanmoqda. Tez kunda batafsil kontent qo'shiladi.

Asosiy tushunchalar:
- Modules nima ekanligi
- Qachon va qanday ishlatilishi
- Amaliy misollar
- Intervyu savollari`,
  codeExamples: [
    {
      title: 'Modules — asosiy misol',
      language: 'ts',
      code: '// Modules misoli\n// Tez kunda qo\'shiladi',
      description: 'Modules ning asosiy ishlatilishi',
    },
  ],
  interviewQA: [
    {
      question: 'Modules nima va nima uchun ishlatiladi?',
      answer: 'Modules — NgModule, standalone, lazy loading. Bu tushuncha zamonaviy web dasturlashda muhim ahamiyatga ega.',
    },
  ],
}
