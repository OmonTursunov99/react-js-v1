import type { Topic } from '../../../types'

export const stateAsync: Topic = {
  id: 'state-async',
  title: 'State va AsyncStorage',
  importance: 2,
  status: 'to-learn',
  description: 'AsyncStorage, MMKV, state management',
  content: `State va AsyncStorage — AsyncStorage, MMKV, state management

Bu mavzu haqida to'liq ma'lumot tayyorlanmoqda. Tez kunda batafsil kontent qo'shiladi.

Asosiy tushunchalar:
- State va AsyncStorage nima ekanligi
- Qachon va qanday ishlatilishi
- Amaliy misollar
- Intervyu savollari`,
  codeExamples: [
    {
      title: 'State va AsyncStorage — asosiy misol',
      language: 'tsx',
      code: '// State va AsyncStorage misoli\n// Tez kunda qo\'shiladi',
      description: 'State va AsyncStorage ning asosiy ishlatilishi',
    },
  ],
  interviewQA: [
    {
      question: 'State va AsyncStorage nima va nima uchun ishlatiladi?',
      answer: 'State va AsyncStorage — AsyncStorage, MMKV, state management. Bu tushuncha zamonaviy web dasturlashda muhim ahamiyatga ega.',
    },
  ],
}
