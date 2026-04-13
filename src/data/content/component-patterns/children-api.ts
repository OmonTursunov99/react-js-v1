import type { Topic } from '../../types'

export const childrenApi: Topic = {
    id: `children-api`,
    title: `Children API`,
    importance: 2,
    status: `to-learn`,
    description: `React.Children, cloneElement, children manipulation`,
    content: `React.Children — children ustida xavfsiz iteratsiya qilish uchun utility funksiyalar. cloneElement — child-ga qo'shimcha props berish. Lekin zamonaviy React-da boshqa usullar AFZAL.

═══════════════════════════════════════
  React.Children UTILITIES
═══════════════════════════════════════

React.Children — children ustida xavfsiz ishlash:

  React.Children.map(children, fn)
    — har bir child ustida funksiya chaqirish
    — null/undefined xavfsiz (skip qilinadi)

  React.Children.forEach(children, fn)
    — map kabi, lekin natija qaytarmaydi

  React.Children.count(children)
    — children soni (nested array-larni ham hisoblaydi)

  React.Children.toArray(children)
    — children-ni yassi (flat) massivga aylantiradi
    — key avtomatik qo'shiladi

  React.Children.only(children)
    — faqat BITTA child borligini tekshiradi
    — ko'p bo'lsa throw error

═══════════════════════════════════════
  cloneElement
═══════════════════════════════════════

Child-ga qo'shimcha props berish:

  React.cloneElement(child, { extraProp: 'value' })

  // Masalan: har bir child-ga active prop berish:
  React.Children.map(children, (child, index) =>
    React.cloneElement(child, { active: index === activeIndex })
  )

Lekin React jamoasi cloneElement-ni TAVSIYA QILMAYDI!
Sabablar:
  1. Props nomlar to'qnashuvi mumkin
  2. Child ichki tuzilmasini buzishi mumkin
  3. TypeScript tipizatsiyasi murakkab
  4. Yashirin data flow — debug qiyin

Yaxshiroq alternativalar:
  - Render props
  - Context (Provider pattern)
  - Compound components + Context

═══════════════════════════════════════
  NIMA UCHUN React.Children KERAK
═══════════════════════════════════════

children har xil bo'lishi mumkin:
  — string: <Card>Matn</Card>
  — element: <Card><p>Matn</p></Card>
  — array: <Card><p>1</p><p>2</p></Card>
  — null: <Card>{null}</Card>
  — number: <Card>{42}</Card>

Oddiy children.map() ishlamaydi — chunki children
DOIM array emas. React.Children bu farqlarni
xavfsiz boshqaradi.

  // NOTO'G'RI — children string bo'lsa crash:
  children.map(child => ...)

  // TO'G'RI — har qanday children bilan ishlaydi:
  React.Children.map(children, child => ...)`,
    codeExamples: [
      {
        title: `React.Children.map — har bir child-ga props berish`,
        language: `tsx`,
        code: `import { Children, cloneElement, useState, isValidElement, type ReactNode } from 'react'

// Stepper — qadamli form
interface StepperProps {
  children: ReactNode
}

function Stepper({ children }: StepperProps) {
  const [activeStep, setActiveStep] = useState(0)
  const steps = Children.toArray(children)
  const totalSteps = steps.length

  return (
    <div className="max-w-md mx-auto">
      {/* Progress */}
      <div className="flex mb-4">
        {steps.map((_, index) => (
          <div
            key={index}
            className={\`flex-1 h-2 mx-1 rounded \${
              index <= activeStep ? 'bg-blue-500' : 'bg-gray-200'
            }\`}
          />
        ))}
      </div>

      {/* Hozirgi qadam — cloneElement bilan props berish */}
      {Children.map(children, (child, index) => {
        if (!isValidElement(child)) return null
        if (index !== activeStep) return null

        return cloneElement(child as React.ReactElement<StepProps>, {
          stepNumber: index + 1,
          isActive: true,
        })
      })}

      {/* Navigation */}
      <div className="flex justify-between mt-4">
        <button
          onClick={() => setActiveStep(s => s - 1)}
          disabled={activeStep === 0}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Orqaga
        </button>
        <span>{activeStep + 1} / {totalSteps}</span>
        <button
          onClick={() => setActiveStep(s => s + 1)}
          disabled={activeStep === totalSteps - 1}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Keyingisi
        </button>
      </div>
    </div>
  )
}

// Step component
interface StepProps {
  children: ReactNode
  title: string
  stepNumber?: number
  isActive?: boolean
}

function Step({ children, title, stepNumber }: StepProps) {
  return (
    <div className="p-4 border rounded">
      <h3 className="font-bold mb-2">
        Qadam {stepNumber}: {title}
      </h3>
      {children}
    </div>
  )
}

// Ishlatish
function SignupForm() {
  return (
    <Stepper>
      <Step title="Shaxsiy ma'lumotlar">
        <input placeholder="Ism" className="w-full p-2 border rounded mb-2" />
        <input placeholder="Familiya" className="w-full p-2 border rounded" />
      </Step>
      <Step title="Aloqa">
        <input placeholder="Email" className="w-full p-2 border rounded mb-2" />
        <input placeholder="Telefon" className="w-full p-2 border rounded" />
      </Step>
      <Step title="Parol">
        <input type="password" placeholder="Parol" className="w-full p-2 border rounded mb-2" />
        <input type="password" placeholder="Tasdiqlash" className="w-full p-2 border rounded" />
      </Step>
    </Stepper>
  )
}`,
        description: `Stepper — React.Children.map va cloneElement bilan qadamli form. Har bir Step-ga stepNumber va isActive props dinamik beriladi. Lekin zamonaviy React-da Context bilan qilish tavsiya etiladi.`,
      },
    ],
    interviewQA: [
      {
        question: `React.Children nima uchun kerak?`,
        answer: `React.Children — children prop ustida xavfsiz iteratsiya qilish uchun utility. children har xil bo'lishi mumkin: string, element, array, null, number. Oddiy children.map() crash bo'lishi mumkin (agar children string yoki null bo'lsa). React.Children.map() har qanday children bilan xavfsiz ishlaydi. Boshqa utility-lar: count (soni), toArray (massivga aylantirish), only (faqat bitta child borligini tekshirish), forEach (side effect uchun iteratsiya).`,
      },
      {
        question: `cloneElement nima uchun tavsiya qilinmaydi?`,
        answer: `React rasmiy jamoasi cloneElement-ni TAVSIYA QILMAYDI sabablari: 1) Yashirin data flow — child qayerdan props olayotgani nomalum, debug qiyin. 2) Props nomlar to'qnashuvi — parent va cloneElement bir xil prop nom bersa, biri yutiladi. 3) TypeScript tipizatsiyasi murakkab — child tipi nomalum. 4) Faqat birinchi darajali children bilan ishlaydi (nested emas). Yaxshiroq alternativalar: Context (compound components), render props, yoki oddiy props orqali ma'lumot uzatish.`,
      },
    ],
    relatedTopics: [
      { sectionId: `component-patterns`, topicId: `compound-components`, label: `Compound Components` },
      { sectionId: `component-patterns`, topicId: `composition-vs-inheritance`, label: `Composition` },
      { sectionId: `typescript-react`, topicId: `children-types`, label: `Children tipizatsiyasi` },
    ],
  }
