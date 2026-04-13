import type { Topic } from '../../../types'

export const thisKeyword: Topic = {
  id: 'this-keyword',
  title: 'This Keyword',
  importance: 2,
  status: 'to-learn',
  description: 'This Keyword haqida batafsil ma\'lumot',
  content: `This Keyword — bu mavzu haqida to'liq ma'lumot tez kunda qo'shiladi.

Bu mavzu frontend dasturchi sifatida bilish kerak bo'lgan muhim tushunchalardan biri.
Kontent bosqichma-bosqich to'ldirilmoqda.`,
  codeExamples: [],
  interviewQA: [
    {
      question: 'This Keyword nima va nima uchun muhim?',
      answer: 'This Keyword — zamonaviy web dasturlashda muhim tushuncha. Batafsil javob tez kunda qo\'shiladi.',
    },
  ],
}
