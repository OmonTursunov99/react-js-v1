import type { Topic } from '../../../types'

export const testingVue: Topic = {
  id: 'testing-vue',
  title: 'Vue Testing',
  importance: 2,
  status: 'to-learn',
  description: 'Vue Test Utils, component testing',
  content: `Vue Testing — Vue Test Utils, component testing

Bu mavzu haqida to'liq ma'lumot tayyorlanmoqda. Tez kunda batafsil kontent qo'shiladi.

Asosiy tushunchalar:
- Vue Testing nima ekanligi
- Qachon va qanday ishlatilishi
- Amaliy misollar
- Intervyu savollari`,
  codeExamples: [
    {
      title: 'Vue Testing — asosiy misol',
      language: 'ts',
      code: '// Vue Testing misoli\n// Tez kunda qo\'shiladi',
      description: 'Vue Testing ning asosiy ishlatilishi',
    },
  ],
  interviewQA: [
    {
      question: 'Vue Testing nima va nima uchun ishlatiladi?',
      answer: 'Vue Testing — Vue Test Utils, component testing. Bu tushuncha zamonaviy web dasturlashda muhim ahamiyatga ega.',
    },
  ],
}
