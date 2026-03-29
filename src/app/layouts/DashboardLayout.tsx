import { Outlet } from 'react-router'
import { Header } from '../../widgets'
import { Footer } from '../../widgets'

export default function DashboardLayout() {
  return (
    <>
      <Header />
      <main className="p-4">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
