import type { Topic } from '../../../types'

export const methodologies: Topic = {
  id: 'methodologies',
  title: 'CSS Metodologiyalar',
  importance: 2,
  status: 'to-learn',
  description: 'BEM, OOCSS, Tailwind',
  content: `CSS Metodologiyalar — BEM, OOCSS, Tailwind

Bu mavzu haqida to'liq ma'lumot tayyorlanmoqda. Tez kunda batafsil kontent qo'shiladi.

Asosiy tushunchalar:
- CSS Metodologiyalar nima ekanligi
- Qachon va qanday ishlatilishi
- Amaliy misollar
- Intervyu savollari`,
  codeExamples: [
    {
      title: 'CSS Metodologiyalar — asosiy misol',
      language: 'css',
      code: '// CSS Metodologiyalar misoli\n// Tez kunda qo\'shiladi',
      description: 'CSS Metodologiyalar ning asosiy ishlatilishi',
    },
  ],
  interviewQA: [
    {
      question: 'CSS Metodologiyalar nima va nima uchun ishlatiladi?',
      answer: 'CSS Metodologiyalar — BEM, OOCSS, Tailwind. Bu tushuncha zamonaviy web dasturlashda muhim ahamiyatga ega.',
    },
  ],
}
