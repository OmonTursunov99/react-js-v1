import { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router'
import RootLayout from './layouts/RootLayout'
import TechLayout from './layouts/TechLayout'

const DirectionPage = lazy(() => import('@/pages/DirectionPage'))
const CategoryPage = lazy(() => import('@/pages/CategoryPage'))
const TechnologyPage = lazy(() => import('@/pages/TechnologyPage'))
const DashboardPage = lazy(() => import('@/pages/DashboardPage'))
const SectionPage = lazy(() => import('@/pages/SectionPage'))
const TopicPage = lazy(() => import('@/pages/TopicPage'))
const StatsPage = lazy(() => import('@/pages/StatsPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

function Loading() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

function S({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<Loading />}>{children}</Suspense>
}

/** Sidebar yo'q sahifalar uchun scrollable wrapper */
function Scroll({ children }: { children: React.ReactNode }) {
  return <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6">{children}</div>
}

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      // 1-daraja: Yo'nalishlar (Frontend, Backend...)
      {
        index: true,
        element: <Scroll><S><DirectionPage /></S></Scroll>,
      },
      // 2-daraja: Kategoriyalar (HTML, CSS, JS, React...)
      {
        path: ':directionId',
        element: <Scroll><S><CategoryPage /></S></Scroll>,
      },
      // 3-daraja: Texnologiyalar (React.js, Next.js...)
      {
        path: ':directionId/:categoryId',
        element: <Scroll><S><TechnologyPage /></S></Scroll>,
      },
      // 4-6 daraja: Sidebar bilan (Tech selected)
      {
        path: ':directionId/:categoryId/:techId',
        element: <TechLayout />,
        children: [
          // Dashboard (bo'limlar grid)
          {
            index: true,
            element: <S><DashboardPage /></S>,
          },
          // Section (topic grid)
          {
            path: ':sectionId',
            element: <S><SectionPage /></S>,
          },
          // Topic (kontent, kod, intervyu)
          {
            path: ':sectionId/:topicId',
            element: <S><TopicPage /></S>,
          },
        ],
      },
      // Statistika
      {
        path: 'stats',
        element: <Scroll><S><StatsPage /></S></Scroll>,
      },
      // 404
      {
        path: '*',
        element: <Scroll><S><NotFoundPage /></S></Scroll>,
      },
    ],
  },
])

export default function AppRouter() {
  return <RouterProvider router={router} />
}
