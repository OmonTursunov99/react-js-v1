import { useParams, Link } from 'react-router'
import { useTechSections } from '@/hooks/useTechSections'
import { useProgress } from '@/hooks/useProgress'
import { useTimeTracker } from '@/hooks/useTimeTracker'
import { formatTime } from '@/stores/time-store'
import { findDirection, findCategory, findTechnologyMeta } from '@/data/directions'
import Tabs from '@/components/ui/Tabs'
import ContentRenderer from '@/components/ui/ContentRenderer'
import CodeBlock from '@/components/ui/CodeBlock'
import Accordion from '@/components/ui/Accordion'
import Checkbox from '@/components/ui/Checkbox'
import StarRating from '@/components/ui/StarRating'
import Badge from '@/components/ui/Badge'

export default function TopicPage() {
  const { directionId, categoryId, techId, sectionId, topicId } = useParams()
  const { sections } = useTechSections(techId)
  const { isLearned, toggleLearned } = useProgress()
  const { liveTime: timeSpent, isPaused, togglePause } = useTimeTracker(techId, sectionId, topicId)

  const direction = findDirection(directionId!)
  const category = findCategory(directionId!, categoryId!)
  const techMeta = findTechnologyMeta(directionId!, categoryId!, techId!)
  const section = sections?.find(s => s.id === sectionId)
  const topic = section?.topics.find(t => t.id === topicId)
  const basePath = `/${directionId}/${categoryId}/${techId}`

  if (!section || !topic || !direction || !category || !techMeta) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 dark:text-gray-400">Mavzu topilmadi</p>
      </div>
    )
  }

  const learned = isLearned(techId!, section.id, topic.id)

  const tabs = [
    {
      id: 'info',
      label: "Ma'lumot",
      content: (
        <div>
          {topic.content ? (
            <ContentRenderer content={topic.content} />
          ) : (
            <div className="text-center py-12 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
              <p className="text-4xl mb-3">📝</p>
              <p className="text-gray-500 dark:text-gray-400 font-medium">Kontent hali qo'shilmagan</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Bu mavzuni o'rganib, kontent qo'shiladi</p>
            </div>
          )}
        </div>
      ),
    },
    {
      id: 'code',
      label: 'Kod misollari',
      content: (
        <div className="flex flex-col gap-4">
          {topic.codeExamples.length > 0 ? (
            topic.codeExamples.map((example, i) => (
              <div key={i}>
                <CodeBlock code={example.code} language={example.language} title={example.title} />
                {example.description && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 ml-1">{example.description}</p>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
              <p className="text-4xl mb-3">💻</p>
              <p className="text-gray-500 dark:text-gray-400 font-medium">Kod misollari hali qo'shilmagan</p>
            </div>
          )}
        </div>
      ),
    },
    {
      id: 'interview',
      label: 'Intervyu savollari',
      content: (
        <div>
          {topic.interviewQA.length > 0 ? (
            <Accordion
              items={topic.interviewQA.map(qa => ({
                title: qa.question,
                content: qa.answer,
              }))}
            />
          ) : (
            <div className="text-center py-12 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
              <p className="text-4xl mb-3">🎯</p>
              <p className="text-gray-500 dark:text-gray-400 font-medium">Intervyu savollari hali qo'shilmagan</p>
            </div>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-4 sm:mb-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-400 dark:text-gray-500 mb-4 flex-wrap">
          <Link to="/" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">Bosh sahifa</Link>
          <span>/</span>
          <Link to={`/${directionId}`} className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">{direction.title}</Link>
          {category.technologies.length > 1 && (
            <>
              <span>/</span>
              <Link to={`/${directionId}/${categoryId}`} className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">{category.title}</Link>
            </>
          )}
          <span>/</span>
          <Link to={basePath} className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">{techMeta.title}</Link>
          <span>/</span>
          <Link to={`${basePath}/${section.id}`} className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">{section.title}</Link>
          <span>/</span>
          <span className="text-gray-600 dark:text-gray-300">{topic.title}</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {topic.title}
            </h1>
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-3">{topic.description}</p>
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <StarRating level={topic.importance} />
              <Badge learned={learned} />
              <span className="inline-flex items-center gap-1 text-xs font-mono text-gray-400 dark:text-gray-500">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
                </svg>
                {formatTime(timeSpent)}
                <button
                  onClick={togglePause}
                  className={`ml-0.5 p-1 rounded-md transition-colors ${
                    isPaused
                      ? 'text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950'
                      : 'text-red-400 hover:bg-red-50 dark:hover:bg-red-950'
                  }`}
                  aria-label={isPaused ? 'Davom ettirish' : "To'xtatish"}
                >
                  {isPaused ? (
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  ) : (
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                    </svg>
                  )}
                </button>
              </span>
            </div>
          </div>

          <Checkbox
            checked={learned}
            onChange={() => toggleLearned(techId!, section.id, topic.id)}
            label="O'rgandim"
          />
        </div>
      </div>

      <Tabs tabs={tabs} />

      {topic.relatedTopics && topic.relatedTopics.length > 0 && (
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
            Bog'liq mavzular
          </h3>
          <div className="flex flex-wrap gap-2">
            {topic.relatedTopics.map(related => (
              <Link
                key={`${related.techId}/${related.sectionId}/${related.topicId}`}
                to={`/${directionId}/${categoryId}/${related.techId}/${related.sectionId}/${related.topicId}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-950 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                <span className="text-gray-400 dark:text-gray-500">→</span>
                {related.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
