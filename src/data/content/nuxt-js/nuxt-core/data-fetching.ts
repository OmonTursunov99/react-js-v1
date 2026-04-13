import type { Topic } from '../../../types'

export const dataFetching: Topic = {
  id: 'data-fetching',
  title: 'Data Fetching',
  importance: 3,
  status: 'to-learn',
  description: 'useFetch, useAsyncData, $fetch',
  content: `Data Fetching — useFetch, useAsyncData, $fetch

Bu mavzu haqida to'liq ma'lumot tayyorlanmoqda. Tez kunda batafsil kontent qo'shiladi.

Asosiy tushunchalar:
- Data Fetching nima ekanligi
- Qachon va qanday ishlatilishi
- Amaliy misollar
- Intervyu savollari`,
  codeExamples: [
    {
      title: 'Data Fetching — asosiy misol',
      language: 'ts',
      code: '// Data Fetching misoli\n// Tez kunda qo\'shiladi',
      description: 'Data Fetching ning asosiy ishlatilishi',
    },
  ],
  interviewQA: [
    {
      question: 'Data Fetching nima va nima uchun ishlatiladi?',
      answer: 'Data Fetching — useFetch, useAsyncData, $fetch. Bu tushuncha zamonaviy web dasturlashda muhim ahamiyatga ega.',
    },
  ],
}
