import type { Topic } from '../../../types'

export const newKeyword: Topic = {
  id: 'new-keyword',
  title: 'New Keyword',
  importance: 2,
  status: 'to-learn',
  description: 'New Keyword haqida batafsil ma\'lumot',
  content: `New Keyword — bu mavzu haqida to'liq ma'lumot tez kunda qo'shiladi.

Bu mavzu frontend dasturchi sifatida bilish kerak bo'lgan muhim tushunchalardan biri.
Kontent bosqichma-bosqich to'ldirilmoqda.`,
  codeExamples: [],
  interviewQA: [
    {
      question: 'New Keyword nima va nima uchun muhim?',
      answer: 'New Keyword — zamonaviy web dasturlashda muhim tushuncha. Batafsil javob tez kunda qo\'shiladi.',
    },
  ],
}
