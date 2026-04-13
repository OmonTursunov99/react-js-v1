import type { Topic } from '../../../types'

export const weakmapWeakset: Topic = {
  id: 'weakmap-weakset',
  title: 'WeakMap va WeakSet',
  importance: 2,
  status: 'to-learn',
  description: 'Zaif referenslar, garbage collection bilan ishlash',
  content: `WeakMap va WeakSet — Zaif referenslar, garbage collection bilan ishlash

Bu mavzu haqida to'liq ma'lumot tayyorlanmoqda. Tez kunda batafsil kontent qo'shiladi.

Asosiy tushunchalar:
- WeakMap va WeakSet nima ekanligi
- Qachon va qanday ishlatilishi
- Amaliy misollar
- Intervyu savollari`,
  codeExamples: [
    {
      title: 'WeakMap va WeakSet — asosiy misol',
      language: 'js',
      code: '// WeakMap va WeakSet misoli\n// Tez kunda qo\'shiladi',
      description: 'WeakMap va WeakSet ning asosiy ishlatilishi',
    },
  ],
  interviewQA: [
    {
      question: 'WeakMap va WeakSet nima va nima uchun ishlatiladi?',
      answer: 'WeakMap va WeakSet — Zaif referenslar, garbage collection bilan ishlash. Bu tushuncha zamonaviy web dasturlashda muhim ahamiyatga ega.',
    },
  ],
}
