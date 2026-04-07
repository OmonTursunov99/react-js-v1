interface ProgressBarProps {
  percent: number
  gradient?: string
  size?: 'sm' | 'md'
}

export default function ProgressBar({ percent, gradient = 'from-blue-500 to-purple-500', size = 'sm' }: ProgressBarProps) {
  const height = size === 'sm' ? 'h-1.5' : 'h-2.5'

  return (
    <div className={`w-full ${height} rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden`}>
      <div
        className={`${height} rounded-full bg-gradient-to-r ${gradient} transition-all duration-700 ease-out`}
        style={{ width: `${Math.min(percent, 100)}%` }}
      />
    </div>
  )
}
