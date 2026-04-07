import { Outlet } from 'react-router'
import Header from '@/components/layout/Header'
import Sidebar from '@/components/sidebar/Sidebar'

export default function RootLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
