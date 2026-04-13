import type { Topic } from '../../../types'

export const performance: Topic = {
  id: 'performance',
  title: 'Vue Performance',
  importance: 2,
  status: 'to-learn',
  description: 'v-once, v-memo, async components',
  content: `Vue Performance — v-once, v-memo, async components

Bu mavzu haqida to'liq ma'lumot tayyorlanmoqda. Tez kunda batafsil kontent qo'shiladi.

Asosiy tushunchalar:
- Vue Performance nima ekanligi
- Qachon va qanday ishlatilishi
- Amaliy misollar
- Intervyu savollari`,
  codeExamples: [
    {
      title: 'Vue Performance — asosiy misol',
      language: 'ts',
      code: '// Vue Performance misoli\n// Tez kunda qo\'shiladi',
      description: 'Vue Performance ning asosiy ishlatilishi',
    },
  ],
  interviewQA: [
    {
      question: 'Vue Performance nima va nima uchun ishlatiladi?',
      answer: 'Vue Performance — v-once, v-memo, async components. Bu tushuncha zamonaviy web dasturlashda muhim ahamiyatga ega.',
    },
  ],
}
