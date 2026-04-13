import type { Topic } from '../../../types'

export const iteratorsGenerators: Topic = {
  id: 'iterators-generators',
  title: 'Iteratorlar va Generatorlar',
  importance: 2,
  status: 'to-learn',
  description: 'Symbol.iterator, generator funksiyalar, yield',
  content: `Iteratorlar va Generatorlar — Symbol.iterator, generator funksiyalar, yield

Bu mavzu haqida to'liq ma'lumot tayyorlanmoqda. Tez kunda batafsil kontent qo'shiladi.

Asosiy tushunchalar:
- Iteratorlar va Generatorlar nima ekanligi
- Qachon va qanday ishlatilishi
- Amaliy misollar
- Intervyu savollari`,
  codeExamples: [
    {
      title: 'Iteratorlar va Generatorlar — asosiy misol',
      language: 'js',
      code: '// Iteratorlar va Generatorlar misoli\n// Tez kunda qo\'shiladi',
      description: 'Iteratorlar va Generatorlar ning asosiy ishlatilishi',
    },
  ],
  interviewQA: [
    {
      question: 'Iteratorlar va Generatorlar nima va nima uchun ishlatiladi?',
      answer: 'Iteratorlar va Generatorlar — Symbol.iterator, generator funksiyalar, yield. Bu tushuncha zamonaviy web dasturlashda muhim ahamiyatga ega.',
    },
  ],
}
