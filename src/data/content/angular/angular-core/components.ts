import type { Topic } from '../../../types'

export const components: Topic = {
  id: 'components',
  title: 'Components',
  importance: 3,
  status: 'to-learn',
  description: '@Component, template, lifecycle hooks',
  content: `Components — @Component, template, lifecycle hooks

Bu mavzu haqida to'liq ma'lumot tayyorlanmoqda. Tez kunda batafsil kontent qo'shiladi.

Asosiy tushunchalar:
- Components nima ekanligi
- Qachon va qanday ishlatilishi
- Amaliy misollar
- Intervyu savollari`,
  codeExamples: [
    {
      title: 'Components — asosiy misol',
      language: 'ts',
      code: '// Components misoli\n// Tez kunda qo\'shiladi',
      description: 'Components ning asosiy ishlatilishi',
    },
  ],
  interviewQA: [
    {
      question: 'Components nima va nima uchun ishlatiladi?',
      answer: 'Components — @Component, template, lifecycle hooks. Bu tushuncha zamonaviy web dasturlashda muhim ahamiyatga ega.',
    },
  ],
}
