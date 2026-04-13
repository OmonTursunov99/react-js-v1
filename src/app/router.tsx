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

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      // 1-daraja: Yo'nalishlar (Frontend, Backend...)
      {
        index: true,
        element: <S><DirectionPage /></S>,
      },
      // 2-daraja: Kategoriyalar (HTML, CSS, JS, React...)
      {
        path: ':directionId',
        element: <S><CategoryPage /></S>,
      },
      // 3-daraja: Texnologiyalar (React.js, Next.js...)
      {
        path: ':directionId/:categoryId',
        element: <S><TechnologyPage /></S>,
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
      // 404
      {
        path: '*',
        element: <S><NotFoundPage /></S>,
      },
    ],
  },
])

export default function AppRouter() {
  return <RouterProvider router={router} />
}
