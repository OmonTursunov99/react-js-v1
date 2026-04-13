import type { Topic } from '../../../types'

export const fileRouting: Topic = {
  id: 'file-routing',
  title: 'File-based Routing',
  importance: 3,
  status: 'to-learn',
  description: 'pages/, dynamic routes, nested routes',
  content: `File-based Routing — pages/, dynamic routes, nested routes

Bu mavzu haqida to'liq ma'lumot tayyorlanmoqda. Tez kunda batafsil kontent qo'shiladi.

Asosiy tushunchalar:
- File-based Routing nima ekanligi
- Qachon va qanday ishlatilishi
- Amaliy misollar
- Intervyu savollari`,
  codeExamples: [
    {
      title: 'File-based Routing — asosiy misol',
      language: 'ts',
      code: '// File-based Routing misoli\n// Tez kunda qo\'shiladi',
      description: 'File-based Routing ning asosiy ishlatilishi',
    },
  ],
  interviewQA: [
    {
      question: 'File-based Routing nima va nima uchun ishlatiladi?',
      answer: 'File-based Routing — pages/, dynamic routes, nested routes. Bu tushuncha zamonaviy web dasturlashda muhim ahamiyatga ega.',
    },
  ],
}
