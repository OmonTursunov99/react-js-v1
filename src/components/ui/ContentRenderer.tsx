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
    const trimmed = line.trim()

    // ═══ separator heading (React content format)
    if (/^[═]{3,}/.test(trimmed)) {
      i++
      if (i < lines.length && !/^[═]{3,}/.test(lines[i].trim())) {
        blocks.push({ type: 'heading', content: lines[i].trim() })
        i++
        if (i < lines.length && /^[═]{3,}/.test(lines[i].trim())) {
          i++
        }
      }
      continue
    }

    // Markdown heading: # or ##
    if (/^#{1,3}\s+/.test(trimmed)) {
      blocks.push({ type: 'heading', content: trimmed.replace(/^#{1,3}\s+/, '') })
      i++
      continue
    }

    // Code block — lines starting with 2+ spaces that look like code
    if (/^ {2}\S/.test(line) && isCodeLine(line.trim())) {
      const codeLines: string[] = []
      while (i < lines.length && (/^ {2}/.test(lines[i]) || lines[i].trim() === '')) {
        codeLines.push(lines[i])
        i++
        if (lines[i]?.trim() === '' && i + 1 < lines.length && !/^ {2}/.test(lines[i + 1]) && lines[i + 1].trim() !== '') {
          break
        }
      }
      const trimmedCode = codeLines
        .map(l => l.startsWith('  ') ? l.slice(2) : l)
        .join('\n')
        .trim()
      if (trimmedCode) {
        blocks.push({ type: 'code', content: trimmedCode })
      }
      continue
    }

    // Regular text — collect until empty line or section
    if (trimmed !== '') {
      const textLines: string[] = []
      while (
        i < lines.length &&
        lines[i].trim() !== '' &&
        !/^[═]{3,}/.test(lines[i].trim()) &&
        !/^#{1,3}\s+/.test(lines[i].trim()) &&
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
    line.startsWith('var ') ||
    line.startsWith('function ') ||
    line.startsWith('class ') ||
    line.startsWith('import ') ||
    line.startsWith('export ') ||
    line.startsWith('return ') ||
    line.startsWith('if ') ||
    line.startsWith('for ') ||
    line.startsWith('while ') ||
    line.startsWith('switch ') ||
    line.startsWith('try ') ||
    line.startsWith('new ') ||
    line.startsWith('async ') ||
    line.startsWith('await ') ||
    line.startsWith('setState') ||
    line.startsWith('setCount') ||
    line.startsWith('setUser') ||
    line.startsWith('set') ||
    line.startsWith('get') ||
    line.startsWith('//') ||
    line.startsWith('/*') ||
    line.startsWith('<') ||
    line.startsWith('{') ||
    line.startsWith('[') ||
    line.startsWith('useState') ||
    line.startsWith('useEffect') ||
    line.startsWith('console.') ||
    line.startsWith('document.') ||
    line.startsWith('window.') ||
    line.startsWith('Object.') ||
    line.startsWith('Array.') ||
    line.startsWith('Promise.') ||
    line.startsWith('JSON.') ||
    line.startsWith('Math.') ||
    line.startsWith('this.') ||
    line.startsWith('super') ||
    /^[a-z_$]+\s*[=(]/.test(line) ||
    /^[a-z_$]+\./.test(line) ||
    /^[A-Z][a-zA-Z]*\s*[=(]/.test(line)
  )
}

// JS/TS kalit so'zlar — inline code sifatida highlight qilinadi
const CODE_KEYWORDS = /(`[^`]+`|(?:useState|useReducer|useEffect|useCallback|useMemo|useRef|useContext|useLayoutEffect|useSyncExternalStore|setState|setCount|setUser|Object\.is|Object\.create|Object\.assign|Object\.keys|Object\.freeze|Object\.defineProperty|Object\.getPrototypeOf|Array\.isArray|Array\.from|Promise\.all|Promise\.race|JSON\.parse|JSON\.stringify|React\.memo|React\.lazy|localStorage|sessionStorage|typeof|instanceof|undefined|null|NaN|Infinity|Symbol|Proxy|Reflect|Map|Set|WeakMap|WeakSet|RegExp|Generator|Iterator|async\/await|for\.\.\.of|for\.\.\.in|arguments|this|new|class|extends|super|prototype|__proto__|constructor)(?=[\s,.;:!?)—\]]|$))/g

const CONCEPT_KEYWORDS = /\b(prev|count|fiber|linked list|render|batching|closure|closures|immutability|dirty|queue|node|hoisting|TDZ|scope chain|event loop|call stack|microtask|macrotask|callback|promise|currying|memoization|garbage collection|prototype chain|lexical scope|execution context)\b/g

function renderTextBlock(text: string) {
  const lines = text.split('\n')

  return lines.map((line, i) => {
    const trimmed = line.trim()

    // Bullet with emoji
    if (/^[\u2705\u2717\u274C\u26A0]/.test(trimmed)) {
      return (
        <div key={i} className="flex items-start gap-2 py-0.5">
          <span className="flex-shrink-0">{trimmed.slice(0, 2).trim()}</span>
          <span>{formatInline(trimmed.slice(2).trim())}</span>
        </div>
      )
    }

    // MUHIM:, NOTO'G'RI:, TO'G'RI:, Qoida:, Eslatma:
    if (/^(MUHIM|NOTO'G'RI|TO'G'RI|Qoida|Eslatma|Nima uchun\?|XULOSA):/.test(trimmed)) {
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
          <span className="text-sm">{formatInline(rest.join(':').trim())}</span>
        </div>
      )
    }

    // Numbered list (1., 2., etc.)
    if (/^\d+[.)]/.test(trimmed)) {
      const num = trimmed.match(/^(\d+)/)?.[1]
      const rest = trimmed.replace(/^\d+[.)]\s*/, '')
      return (
        <div key={i} className="flex items-start gap-3 py-0.5">
          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-bold flex items-center justify-center">{num}</span>
          <span>{formatInline(rest)}</span>
        </div>
      )
    }

    // Dash/bullet list
    if (trimmed.startsWith('- ') || trimmed.startsWith('— ') || trimmed.startsWith('• ')) {
      const content = trimmed.replace(/^[-—•]\s*/, '')
      return (
        <div key={i} className="flex items-start gap-2 py-0.5 pl-2">
          <span className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-500 flex-shrink-0 mt-2" />
          <span>{formatInline(content)}</span>
        </div>
      )
    }

    // Empty line
    if (trimmed === '') {
      return <div key={i} className="h-2" />
    }

    // Regular paragraph
    return <p key={i} className="py-0.5">{formatInline(trimmed)}</p>
  })
}

function formatInline(text: string): React.ReactNode[] {
  // Step 1: Replace **bold** with marker
  const BOLD_RE = /\*\*([^*]+)\*\*/g
  const parts: React.ReactNode[] = []
  let lastIndex = 0
  let key = 0

  // Process bold markers first, then code keywords
  const segments: Array<{ type: 'text' | 'bold'; content: string }> = []
  let match

  while ((match = BOLD_RE.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: 'text', content: text.slice(lastIndex, match.index) })
    }
    segments.push({ type: 'bold', content: match[1] })
    lastIndex = match.index + match[0].length
  }
  if (lastIndex < text.length) {
    segments.push({ type: 'text', content: text.slice(lastIndex) })
  }
  if (segments.length === 0) {
    segments.push({ type: 'text', content: text })
  }

  // Step 2: Process each segment for code keywords
  for (const segment of segments) {
    if (segment.type === 'bold') {
      parts.push(
        <strong key={key++} className="font-semibold text-gray-900 dark:text-white">
          {segment.content}
        </strong>
      )
    } else {
      // Process code keywords
      const codeParts = segment.content.split(CODE_KEYWORDS)
      for (const part of codeParts) {
        if (!part) continue
        if (part.startsWith('`') && part.endsWith('`')) {
          parts.push(
            <code key={key++} className="px-1.5 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-pink-600 dark:text-pink-400 text-sm font-mono">
              {part.slice(1, -1)}
            </code>
          )
        } else if (CODE_KEYWORDS.test(part)) {
          CODE_KEYWORDS.lastIndex = 0
          parts.push(
            <code key={key++} className="px-1.5 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-pink-600 dark:text-pink-400 text-sm font-mono">
              {part}
            </code>
          )
        } else {
          // Check concept keywords
          const conceptParts = part.split(CONCEPT_KEYWORDS)
          for (const cp of conceptParts) {
            if (!cp) continue
            if (CONCEPT_KEYWORDS.test(cp)) {
              CONCEPT_KEYWORDS.lastIndex = 0
              parts.push(
                <code key={key++} className="px-1 py-0.5 rounded bg-violet-50 dark:bg-violet-950/30 text-violet-700 dark:text-violet-300 text-sm font-mono">
                  {cp}
                </code>
              )
            } else {
              parts.push(<span key={key++}>{cp}</span>)
            }
          }
        }
      }
    }
  }

  return parts
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
