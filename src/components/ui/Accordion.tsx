import { useState } from 'react'

interface AccordionItem {
  title: string
  content: string
}

interface AccordionProps {
  items: AccordionItem[]
}

export default function Accordion({ items }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="flex flex-col gap-2">
      {items.map((item, index) => (
        <div
          key={index}
          className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full flex items-center justify-between px-3 sm:px-4 py-3 sm:py-3.5 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors gap-3"
          >
            <span className="text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-200">
              {item.title}
            </span>
            <svg
              className={`w-4 h-4 text-gray-400 transition-transform ${openIndex === index ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {openIndex === index && (
            <div className="px-3 sm:px-4 pb-3 sm:pb-4 text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed border-t border-gray-100 dark:border-gray-800 pt-3">
              {item.content}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
