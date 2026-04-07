import { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router'
import RootLayout from './layouts/RootLayout'

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

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Suspense fallback={<Loading />}><DashboardPage /></Suspense>,
      },
      {
        path: 'section/:sectionId',
        element: <Suspense fallback={<Loading />}><SectionPage /></Suspense>,
      },
      {
        path: 'section/:sectionId/:topicId',
        element: <Suspense fallback={<Loading />}><TopicPage /></Suspense>,
      },
      {
        path: '*',
        element: <Suspense fallback={<Loading />}><NotFoundPage /></Suspense>,
      },
    ],
  },
])

export default function AppRouter() {
  return <RouterProvider router={router} />
}
