import { useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router'
import Header from '@/components/layout/Header'
import Sidebar from '@/components/sidebar/Sidebar'
import ScrollToTopButton from '@/components/layout/ScrollToTopButton'

export default function RootLayout() {
  const mainRef = useRef<HTMLElement>(null)
  const { pathname } = useLocation()

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }, [pathname])

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header />
      <div className="flex flex-1 min-h-0">
        <Sidebar />
        <main ref={mainRef} className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
      <ScrollToTopButton mainRef={mainRef} />
    </div>
  )
}
