import type { Topic } from '../../../types'

export const memoryManagement: Topic = {
  id: 'memory-management',
  title: 'Xotira Boshqaruvi',
  importance: 2,
  status: 'to-learn',
  description: 'Garbage collection, memory leak, WeakRef',
  content: `Xotira Boshqaruvi — Garbage collection, memory leak, WeakRef

Bu mavzu haqida to'liq ma'lumot tayyorlanmoqda. Tez kunda batafsil kontent qo'shiladi.

Asosiy tushunchalar:
- Xotira Boshqaruvi nima ekanligi
- Qachon va qanday ishlatilishi
- Amaliy misollar
- Intervyu savollari`,
  codeExamples: [
    {
      title: 'Xotira Boshqaruvi — asosiy misol',
      language: 'js',
      code: '// Xotira Boshqaruvi misoli\n// Tez kunda qo\'shiladi',
      description: 'Xotira Boshqaruvi ning asosiy ishlatilishi',
    },
  ],
  interviewQA: [
    {
      question: 'Xotira Boshqaruvi nima va nima uchun ishlatiladi?',
      answer: 'Xotira Boshqaruvi — Garbage collection, memory leak, WeakRef. Bu tushuncha zamonaviy web dasturlashda muhim ahamiyatga ega.',
    },
  ],
}
