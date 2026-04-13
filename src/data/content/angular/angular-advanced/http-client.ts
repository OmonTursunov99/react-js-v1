import type { Topic } from '../../../types'

export const httpClient: Topic = {
  id: 'http-client',
  title: 'HttpClient',
  importance: 2,
  status: 'to-learn',
  description: 'HttpClient, interceptors, error handling',
  content: `HttpClient — HttpClient, interceptors, error handling

Bu mavzu haqida to'liq ma'lumot tayyorlanmoqda. Tez kunda batafsil kontent qo'shiladi.

Asosiy tushunchalar:
- HttpClient nima ekanligi
- Qachon va qanday ishlatilishi
- Amaliy misollar
- Intervyu savollari`,
  codeExamples: [
    {
      title: 'HttpClient — asosiy misol',
      language: 'ts',
      code: '// HttpClient misoli\n// Tez kunda qo\'shiladi',
      description: 'HttpClient ning asosiy ishlatilishi',
    },
  ],
  interviewQA: [
    {
      question: 'HttpClient nima va nima uchun ishlatiladi?',
      answer: 'HttpClient — HttpClient, interceptors, error handling. Bu tushuncha zamonaviy web dasturlashda muhim ahamiyatga ega.',
    },
  ],
}
