import { NavLink } from 'react-router'
import { useTheme } from '../../app/providers/ThemeProvider'

export default function Header() {
  const { theme, toggleTheme } = useTheme()

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

        <button
          onClick={toggleTheme}
          className="ml-auto px-3 py-1 rounded-lg border border-gray-300 text-sm hover:bg-gray-200 transition-colors"
        >
          {theme === 'light' ? 'Dark' : 'Light'}
        </button>
      </nav>
    </header>
  )
}
