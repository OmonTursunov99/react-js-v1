import type { Topic } from '../../../types'

export const renderingModes: Topic = {
  id: 'rendering-modes',
  title: 'Rendering Modes',
  importance: 3,
  status: 'to-learn',
  description: 'SSR, SSG, ISR, SPA, hybrid',
  content: `Rendering Modes — SSR, SSG, ISR, SPA, hybrid

Bu mavzu haqida to'liq ma'lumot tayyorlanmoqda. Tez kunda batafsil kontent qo'shiladi.

Asosiy tushunchalar:
- Rendering Modes nima ekanligi
- Qachon va qanday ishlatilishi
- Amaliy misollar
- Intervyu savollari`,
  codeExamples: [
    {
      title: 'Rendering Modes — asosiy misol',
      language: 'ts',
      code: '// Rendering Modes misoli\n// Tez kunda qo\'shiladi',
      description: 'Rendering Modes ning asosiy ishlatilishi',
    },
  ],
  interviewQA: [
    {
      question: 'Rendering Modes nima va nima uchun ishlatiladi?',
      answer: 'Rendering Modes — SSR, SSG, ISR, SPA, hybrid. Bu tushuncha zamonaviy web dasturlashda muhim ahamiyatga ega.',
    },
  ],
}
