import { NavLink } from 'react-router'

export default function Header() {
  return (
    <header className="w-full p-4">
      <nav className="flex items-center w-full gap-2">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            isActive ? 'font-bold text-blue-600' : 'text-gray-600'
          }
        >
          Bosh sahifa
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) =>
            isActive ? 'font-bold text-blue-600' : 'text-gray-600'
          }
        >
          Biz haqimizda
        </NavLink>
      </nav>
    </header>
  )
}
