import { Outlet } from 'react-router'
import Header from '@/components/layout/Header'

export default function RootLayout() {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
