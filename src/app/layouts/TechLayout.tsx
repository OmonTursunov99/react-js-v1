import { useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router'
import Sidebar from '@/components/sidebar/Sidebar'
import ScrollToTopButton from '@/components/layout/ScrollToTopButton'

export default function TechLayout() {
  const mainRef = useRef<HTMLDivElement>(null)
  const { pathname } = useLocation()

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }, [pathname])

  return (
    <div className="flex flex-1 min-h-0">
      <Sidebar />
      <div ref={mainRef} className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6">
        <Outlet />
      </div>
      <ScrollToTopButton mainRef={mainRef} />
    </div>
  )
}
