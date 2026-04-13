import type { Topic } from '../../../types'

export const modules: Topic = {
  id: 'modules',
  title: 'Modullar (ESM vs CJS)',
  importance: 3,
  status: 'to-learn',
  description: 'CommonJS vs ES Modules, import/export, dynamic import',
  content: `Modullar (ESM vs CJS) — CommonJS vs ES Modules, import/export, dynamic import

Bu mavzu haqida to'liq ma'lumot tayyorlanmoqda. Tez kunda batafsil kontent qo'shiladi.

Asosiy tushunchalar:
- Modullar (ESM vs CJS) nima ekanligi
- Qachon va qanday ishlatilishi
- Amaliy misollar
- Intervyu savollari`,
  codeExamples: [
    {
      title: 'Modullar (ESM vs CJS) — asosiy misol',
      language: 'js',
      code: '// Modullar (ESM vs CJS) misoli\n// Tez kunda qo\'shiladi',
      description: 'Modullar (ESM vs CJS) ning asosiy ishlatilishi',
    },
  ],
  interviewQA: [
    {
      question: 'Modullar (ESM vs CJS) nima va nima uchun ishlatiladi?',
      answer: 'Modullar (ESM vs CJS) — CommonJS vs ES Modules, import/export, dynamic import. Bu tushuncha zamonaviy web dasturlashda muhim ahamiyatga ega.',
    },
  ],
}
