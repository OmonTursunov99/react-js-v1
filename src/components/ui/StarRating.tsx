import type { ImportanceLevel } from '@/data/types'

interface StarRatingProps {
  level: ImportanceLevel
}

export default function StarRating({ level }: StarRatingProps) {
  return (
    <span className="flex gap-0.5" title={`Muhimlik: ${level}/3`}>
      {Array.from({ length: 3 }, (_, i) => (
        <span
          key={i}
          className={`text-sm ${i < level ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
        >
          ★
        </span>
      ))}
    </span>
  )
}
