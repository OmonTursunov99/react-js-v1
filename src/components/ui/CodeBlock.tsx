import { useState } from 'react'
import SyntaxHighlighter from './SyntaxHighlighter'

interface CodeBlockProps {
  code: string
  language?: string
  title?: string
}

export default function CodeBlock({ code, language = 'tsx', title }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
      {title && (
        <div className="flex items-center justify-between px-3 sm:px-4 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 truncate mr-2">{title}</span>
          <span className="text-xs text-gray-400 flex-shrink-0">{language}</span>
        </div>
      )}
      <div className="relative">
        <pre className="p-3 sm:p-4 overflow-x-auto bg-gray-950 text-xs sm:text-sm leading-relaxed font-mono">
          <SyntaxHighlighter code={code} language={language} />
        </pre>
        <button
          onClick={handleCopy}
          className="absolute top-3 right-3 px-2 py-1 rounded-md text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors"
        >
          {copied ? 'Nusxalandi!' : 'Nusxalash'}
        </button>
      </div>
    </div>
  )
}
