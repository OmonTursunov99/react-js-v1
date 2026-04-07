interface CheckboxProps {
  checked: boolean
  onChange: () => void
  label: string
}

export default function Checkbox({ checked, onChange, label }: CheckboxProps) {
  return (
    <button
      onClick={onChange}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
        checked
          ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 shadow-sm'
          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
      }`}
    >
      <span className={`flex items-center justify-center w-5 h-5 rounded-md border-2 transition-all ${
        checked
          ? 'bg-green-500 border-green-500 text-white'
          : 'border-gray-300 dark:border-gray-600'
      }`}>
        {checked && (
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </span>
      {label}
    </button>
  )
}
