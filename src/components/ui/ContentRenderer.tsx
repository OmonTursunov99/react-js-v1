import SyntaxHighlighter from './SyntaxHighlighter'

interface ContentRendererProps {
  content: string
}

interface Block {
  type: 'heading' | 'code' | 'text'
  content: string
}

function parseContent(raw: string): Block[] {
  const lines = raw.split('\n')
  const blocks: Block[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    // Separator line ═══...═══
    if (/^[═]{3,}/.test(line.trim())) {
      // Skip separator, next line is heading, then another separator
      i++
      if (i < lines.length && !/^[═]{3,}/.test(lines[i].trim())) {
        blocks.push({ type: 'heading', content: lines[i].trim() })
        i++
        // Skip closing separator
        if (i < lines.length && /^[═]{3,}/.test(lines[i].trim())) {
          i++
        }
      }
      continue
    }

    // Code block — lines starting with 2+ spaces that look like code
    if (/^ {2}\S/.test(line) && isCodeLine(line.trim())) {
      const codeLines: string[] = []
      while (i < lines.length && (/^ {2}/.test(lines[i]) || lines[i].trim() === '')) {
        codeLines.push(lines[i])
        i++
        // Break on empty line followed by non-indented content
        if (lines[i]?.trim() === '' && i + 1 < lines.length && !/^ {2}/.test(lines[i + 1]) && lines[i + 1].trim() !== '') {
          break
        }
      }
      // Trim trailing empty lines and remove common indent
      const trimmed = codeLines
        .map(l => l.startsWith('  ') ? l.slice(2) : l)
        .join('\n')
        .trim()
      if (trimmed) {
        blocks.push({ type: 'code', content: trimmed })
      }
      continue
    }

    // Regular text — collect until empty line or section
    if (line.trim() !== '') {
      const textLines: string[] = []
      while (
        i < lines.length &&
        lines[i].trim() !== '' &&
        !/^[═]{3,}/.test(lines[i].trim()) &&
        !(/^ {2}\S/.test(lines[i]) && isCodeLine(lines[i].trim()))
      ) {
        textLines.push(lines[i])
        i++
      }
      blocks.push({ type: 'text', content: textLines.join('\n') })
      continue
    }

    i++
  }

  return blocks
}

function isCodeLine(line: string): boolean {
  return (
    line.startsWith('const ') ||
    line.startsWith('let ') ||
    line.startsWith('function ') ||
    line.startsWith('import ') ||
    line.startsWith('export ') ||
    line.startsWith('return ') ||
    line.startsWith('setState') ||
    line.startsWith('setCount') ||
    line.startsWith('setUser') ||
    line.startsWith('setItems') ||
    line.startsWith('setData') ||
    line.startsWith('set') ||
    line.startsWith('//') ||
    line.startsWith('<') ||
    line.startsWith('{') ||
    line.startsWith('useState') ||
    line.startsWith('useEffect') ||
    line.startsWith('user.') ||
    /^[a-z]+\(/.test(line) ||
    /^[a-z]+\./.test(line)
  )
}

function renderTextBlock(text: string) {
  const lines = text.split('\n')

  return lines.map((line, i) => {
    const trimmed = line.trim()

    // Bullet with emoji
    if (trimmed.startsWith('\u2705') || trimmed.startsWith('\u2717') || trimmed.startsWith('\u274C') || trimmed.startsWith('\u26A0')) {
      return (
        <div key={i} className="flex items-start gap-2 py-0.5">
          <span className="flex-shrink-0">{trimmed.slice(0, 2).trim()}</span>
          <span>{formatInlineCode(trimmed.slice(2).trim())}</span>
        </div>
      )
    }

    // MUHIM:, NOTO'G'RI:, TO'G'RI:, Qoida:
    if (/^(MUHIM|NOTO'G'RI|TO'G'RI|Qoida|Nima uchun\?):/.test(trimmed)) {
      const [label, ...rest] = trimmed.split(':')
      const isWarning = label === 'MUHIM' || label === "NOTO'G'RI"
      const isSuccess = label === "TO'G'RI"
      return (
        <div key={i} className={`flex items-start gap-2 py-1 px-3 rounded-lg my-1 ${
          isWarning ? 'bg-red-50 dark:bg-red-950/30' :
          isSuccess ? 'bg-green-50 dark:bg-green-950/30' :
          'bg-blue-50 dark:bg-blue-950/30'
        }`}>
          <span className={`font-bold text-sm flex-shrink-0 ${
            isWarning ? 'text-red-600 dark:text-red-400' :
            isSuccess ? 'text-green-600 dark:text-green-400' :
            'text-blue-600 dark:text-blue-400'
          }`}>{label}:</span>
          <span className="text-sm">{formatInlineCode(rest.join(':').trim())}</span>
        </div>
      )
    }

    // Numbered list (1., 2., etc.)
    if (/^\d+\./.test(trimmed)) {
      const num = trimmed.match(/^(\d+)\./)?.[1]
      const rest = trimmed.replace(/^\d+\.\s*/, '')
      return (
        <div key={i} className="flex items-start gap-3 py-0.5">
          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-bold flex items-center justify-center">{num}</span>
          <span>{formatInlineCode(rest)}</span>
        </div>
      )
    }

    // Dash list
    if (trimmed.startsWith('- ') || trimmed.startsWith('— ')) {
      const content = trimmed.replace(/^[-—]\s*/, '')
      return (
        <div key={i} className="flex items-start gap-2 py-0.5 pl-2">
          <span className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-500 flex-shrink-0 mt-2" />
          <span>{formatInlineCode(content)}</span>
        </div>
      )
    }

    // Empty line
    if (trimmed === '') {
      return <div key={i} className="h-2" />
    }

    // Regular paragraph
    return <p key={i} className="py-0.5">{formatInlineCode(trimmed)}</p>
  })
}

function formatInlineCode(text: string) {
  // Split by backtick-wrapped or code-like patterns
  const parts = text.split(/(`[^`]+`|(?:useState|useReducer|useEffect|useCallback|useMemo|useRef|useContext|useLayoutEffect|setState|setCount|setUser|Object\.is|React\.memo|JSON\.parse|localStorage|prev|count|fiber|linked list|render|batching|closure|immutability|dirty|queue|node)(?=[\s,.;:!?)—]|$))/g)

  return parts.map((part, i) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={i} className="px-1.5 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-pink-600 dark:text-pink-400 text-sm font-mono">
          {part.slice(1, -1)}
        </code>
      )
    }
    if (/^(useState|useReducer|useEffect|useCallback|useMemo|useRef|useContext|useLayoutEffect|setState|setCount|setUser|Object\.is|React\.memo|JSON\.parse|localStorage)$/.test(part)) {
      return (
        <code key={i} className="px-1.5 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-pink-600 dark:text-pink-400 text-sm font-mono">
          {part}
        </code>
      )
    }
    if (/^(prev|count|fiber|linked list|render|batching|closure|immutability|dirty|queue|node)$/.test(part)) {
      return (
        <code key={i} className="px-1 py-0.5 rounded bg-violet-50 dark:bg-violet-950/30 text-violet-700 dark:text-violet-300 text-sm font-mono">
          {part}
        </code>
      )
    }
    return <span key={i}>{part}</span>
  })
}

export default function ContentRenderer({ content }: ContentRendererProps) {
  const blocks = parseContent(content)

  return (
    <div className="flex flex-col gap-4 text-gray-700 dark:text-gray-300 leading-relaxed">
      {blocks.map((block, i) => {
        if (block.type === 'heading') {
          return (
            <h2 key={i} className="text-lg font-bold text-gray-900 dark:text-white mt-4 mb-1 pb-2 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
              <span className="w-1 h-6 rounded-full bg-gradient-to-b from-blue-500 to-purple-500" />
              {block.content}
            </h2>
          )
        }

        if (block.type === 'code') {
          return (
            <pre key={i} className="p-3 sm:p-4 rounded-xl bg-gray-950 text-xs sm:text-sm leading-relaxed overflow-x-auto border border-gray-800 font-mono">
              <SyntaxHighlighter code={block.content} />
            </pre>
          )
        }

        return (
          <div key={i} className="text-sm">
            {renderTextBlock(block.content)}
          </div>
        )
      })}
    </div>
  )
}
