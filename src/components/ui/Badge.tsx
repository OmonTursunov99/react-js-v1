interface BadgeProps {
  learned: boolean
}

export default function Badge({ learned }: BadgeProps) {
  if (learned) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400">
        Bilasiz
      </span>
    )
  }

  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400">
      O'rganish kerak
    </span>
  )
}
