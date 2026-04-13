import type { Topic } from '../../../types'

export const responsive: Topic = {
  id: 'responsive',
  title: 'Responsive Design',
  importance: 3,
  status: 'to-learn',
  description: 'Media queries, mobile-first, container queries',
  content: `Responsive Design — Media queries, mobile-first, container queries

Bu mavzu haqida to'liq ma'lumot tayyorlanmoqda. Tez kunda batafsil kontent qo'shiladi.

Asosiy tushunchalar:
- Responsive Design nima ekanligi
- Qachon va qanday ishlatilishi
- Amaliy misollar
- Intervyu savollari`,
  codeExamples: [
    {
      title: 'Responsive Design — asosiy misol',
      language: 'css',
      code: '// Responsive Design misoli\n// Tez kunda qo\'shiladi',
      description: 'Responsive Design ning asosiy ishlatilishi',
    },
  ],
  interviewQA: [
    {
      question: 'Responsive Design nima va nima uchun ishlatiladi?',
      answer: 'Responsive Design — Media queries, mobile-first, container queries. Bu tushuncha zamonaviy web dasturlashda muhim ahamiyatga ega.',
    },
  ],
}
