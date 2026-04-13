import type { Topic } from '../../../types'

export const mapSet: Topic = {
  id: 'map-set',
  title: 'Map va Set',
  importance: 2,
  status: 'to-learn',
  description: 'Map vs Object, Set vs Array — qachon nima ishlatiladi',
  content: `Map va Set — Map vs Object, Set vs Array — qachon nima ishlatiladi

Bu mavzu haqida to'liq ma'lumot tayyorlanmoqda. Tez kunda batafsil kontent qo'shiladi.

Asosiy tushunchalar:
- Map va Set nima ekanligi
- Qachon va qanday ishlatilishi
- Amaliy misollar
- Intervyu savollari`,
  codeExamples: [
    {
      title: 'Map va Set — asosiy misol',
      language: 'js',
      code: '// Map va Set misoli\n// Tez kunda qo\'shiladi',
      description: 'Map va Set ning asosiy ishlatilishi',
    },
  ],
  interviewQA: [
    {
      question: 'Map va Set nima va nima uchun ishlatiladi?',
      answer: 'Map va Set — Map vs Object, Set vs Array — qachon nima ishlatiladi. Bu tushuncha zamonaviy web dasturlashda muhim ahamiyatga ega.',
    },
  ],
}
