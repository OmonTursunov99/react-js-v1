import { Outlet } from 'react-router'
import Header from '@/components/layout/Header'

export default function RootLayout() {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header />
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
        <Outlet />
      </div>
    </div>
  )
}
