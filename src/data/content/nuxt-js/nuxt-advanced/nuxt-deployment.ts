import type { Topic } from '../../../types'

export const nuxtDeployment: Topic = {
  id: 'nuxt-deployment',
  title: 'Deployment',
  importance: 2,
  status: 'to-learn',
  description: 'Nitro, Vercel, Netlify deployment',
  content: `Deployment — Nitro, Vercel, Netlify deployment

Bu mavzu haqida to'liq ma'lumot tayyorlanmoqda. Tez kunda batafsil kontent qo'shiladi.

Asosiy tushunchalar:
- Deployment nima ekanligi
- Qachon va qanday ishlatilishi
- Amaliy misollar
- Intervyu savollari`,
  codeExamples: [
    {
      title: 'Deployment — asosiy misol',
      language: 'ts',
      code: '// Deployment misoli\n// Tez kunda qo\'shiladi',
      description: 'Deployment ning asosiy ishlatilishi',
    },
  ],
  interviewQA: [
    {
      question: 'Deployment nima va nima uchun ishlatiladi?',
      answer: 'Deployment — Nitro, Vercel, Netlify deployment. Bu tushuncha zamonaviy web dasturlashda muhim ahamiyatga ega.',
    },
  ],
}
