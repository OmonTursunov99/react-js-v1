interface SyntaxHighlighterProps {
  code: string
  language?: string
}

interface Token {
  type: 'keyword' | 'string' | 'comment' | 'number' | 'hook' | 'type' | 'jsx-tag' | 'punctuation' | 'function' | 'operator' | 'property' | 'plain'
  value: string
}

const KEYWORDS = new Set([
  'const', 'let', 'var', 'function', 'return', 'if', 'else', 'switch', 'case',
  'break', 'default', 'for', 'while', 'do', 'import', 'from', 'export',
  'default', 'new', 'typeof', 'instanceof', 'in', 'of', 'throw', 'try',
  'catch', 'finally', 'async', 'await', 'yield', 'class', 'extends',
  'interface', 'type', 'enum', 'implements', 'public', 'private', 'protected',
  'static', 'readonly', 'abstract', 'as', 'is', 'keyof', 'infer',
  'true', 'false', 'null', 'undefined', 'void', 'never', 'any', 'unknown',
  'this', 'super', 'delete', 'satisfies',
])

const HOOKS = new Set([
  'useState', 'useEffect', 'useRef', 'useMemo', 'useCallback', 'useContext',
  'useReducer', 'useLayoutEffect', 'useTransition', 'useDeferredValue',
  'useImperativeHandle', 'useId', 'useSyncExternalStore', 'useOptimistic',
  'useActionState', 'useDebugValue', 'useFormStatus',
])

const TYPES = new Set([
  'React', 'ReactNode', 'ReactElement', 'JSX', 'HTMLElement',
  'HTMLInputElement', 'HTMLButtonElement', 'HTMLDivElement',
  'Promise', 'Array', 'Map', 'Set', 'Record', 'Partial', 'Omit', 'Pick',
  'Required', 'Readonly', 'ReturnType', 'Parameters', 'Exclude', 'Extract',
  'string', 'number', 'boolean', 'object', 'symbol', 'bigint',
  'FormData', 'Event', 'MouseEvent', 'ChangeEvent', 'KeyboardEvent',
  'RefObject', 'MutableRefObject', 'Dispatch', 'SetStateAction',
  'PropsWithChildren',
])

function tokenize(code: string): Token[] {
  const tokens: Token[] = []
  let i = 0

  while (i < code.length) {
    // Single-line comment
    if (code[i] === '/' && code[i + 1] === '/') {
      let end = code.indexOf('\n', i)
      if (end === -1) end = code.length
      tokens.push({ type: 'comment', value: code.slice(i, end) })
      i = end
      continue
    }

    // Multi-line comment
    if (code[i] === '/' && code[i + 1] === '*') {
      const end = code.indexOf('*/', i + 2)
      const closeAt = end === -1 ? code.length : end + 2
      tokens.push({ type: 'comment', value: code.slice(i, closeAt) })
      i = closeAt
      continue
    }

    // Template literal
    if (code[i] === '`') {
      let j = i + 1
      while (j < code.length && code[j] !== '`') {
        if (code[j] === '\\') j++
        j++
      }
      tokens.push({ type: 'string', value: code.slice(i, j + 1) })
      i = j + 1
      continue
    }

    // String (single or double quotes)
    // Only treat as string if preceded by non-letter (avoids Qo'shish, don't, etc.)
    if (code[i] === "'" || code[i] === '"') {
      const prev = i > 0 ? code[i - 1] : ''
      const isStringStart = !prev || /[\s=:(,[\]{+\-*/<>!&|^~%?;}\n]/.test(prev)

      if (isStringStart) {
        const quote = code[i]
        let j = i + 1
        while (j < code.length && code[j] !== quote && code[j] !== '\n') {
          if (code[j] === '\\') j++
          j++
        }
        if (j < code.length && code[j] === quote) {
          tokens.push({ type: 'string', value: code.slice(i, j + 1) })
          i = j + 1
          continue
        }
      }
      // Not a string — treat as punctuation
      tokens.push({ type: 'punctuation', value: code[i] })
      i++
      continue
    }

    // Number
    if (/\d/.test(code[i]) && (i === 0 || /[\s=:(,[\]{+\-*/<>!&|^~%]/.test(code[i - 1]))) {
      let j = i
      while (j < code.length && /[\d.xXa-fA-F_n]/.test(code[j])) j++
      tokens.push({ type: 'number', value: code.slice(i, j) })
      i = j
      continue
    }

    // JSX tag
    if (code[i] === '<' && i + 1 < code.length && (/[A-Za-z/]/.test(code[i + 1]))) {
      // Check if it's JSX (not comparison operator)
      const rest = code.slice(i)
      const match = rest.match(/^<\/?([A-Z][A-Za-z0-9.]*|[a-z][a-z0-9-]*)/)
      if (match) {
        tokens.push({ type: 'jsx-tag', value: match[0] })
        i += match[0].length
        continue
      }
    }

    // JSX closing >  or />
    if ((code[i] === '/' && code[i + 1] === '>') || (code[i] === '>' && i > 0)) {
      // Only treat as JSX close if we're likely in a tag context
      if (code[i] === '/' && code[i + 1] === '>') {
        tokens.push({ type: 'jsx-tag', value: '/>' })
        i += 2
        continue
      }
    }

    // Word (identifier)
    if (/[a-zA-Z_$]/.test(code[i])) {
      let j = i
      while (j < code.length && /[a-zA-Z0-9_$]/.test(code[j])) j++
      const word = code.slice(i, j)

      if (HOOKS.has(word)) {
        tokens.push({ type: 'hook', value: word })
      } else if (KEYWORDS.has(word)) {
        tokens.push({ type: 'keyword', value: word })
      } else if (TYPES.has(word)) {
        tokens.push({ type: 'type', value: word })
      } else if (j < code.length && code[j] === '(') {
        tokens.push({ type: 'function', value: word })
      } else if (i > 0 && code[i - 1] === '.') {
        tokens.push({ type: 'property', value: word })
      } else {
        tokens.push({ type: 'plain', value: word })
      }
      i = j
      continue
    }

    // Operators
    if (/[=+\-*/<>!&|^~%?:]/.test(code[i])) {
      let j = i
      while (j < code.length && /[=+\-*/<>!&|^~%?:]/.test(code[j]) && j - i < 3) j++
      tokens.push({ type: 'operator', value: code.slice(i, j) })
      i = j
      continue
    }

    // Punctuation
    if (/[{}()[\];,.]/.test(code[i])) {
      tokens.push({ type: 'punctuation', value: code[i] })
      i++
      continue
    }

    // Whitespace / other
    tokens.push({ type: 'plain', value: code[i] })
    i++
  }

  return tokens
}

const tokenColors: Record<Token['type'], string> = {
  keyword: 'text-purple-400',
  string: 'text-green-400',
  comment: 'text-gray-500 italic',
  number: 'text-orange-400',
  hook: 'text-yellow-300 font-medium',
  type: 'text-cyan-400',
  'jsx-tag': 'text-red-400',
  punctuation: 'text-gray-400',
  function: 'text-blue-400',
  operator: 'text-pink-400',
  property: 'text-sky-300',
  plain: 'text-gray-200',
}

export default function SyntaxHighlighter({ code }: SyntaxHighlighterProps) {
  const tokens = tokenize(code)

  return (
    <code>
      {tokens.map((token, i) => (
        <span key={i} className={tokenColors[token.type]}>
          {token.value}
        </span>
      ))}
    </code>
  )
}
