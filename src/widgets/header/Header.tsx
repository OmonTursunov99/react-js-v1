import { useState, useCallback } from 'react'
import { NavLink } from 'react-router'
import { useTheme } from '../../app/providers/ThemeProvider'
import { useWeather } from '../../features/weather'
import { Modal } from '../../shared'

export default function Header() {
    const { theme, toggleTheme } = useTheme()
    const { data: weather, isLoading, error } = useWeather()
    const [isWeatherOpen, setIsWeatherOpen] = useState(false)

    const openWeather = useCallback(() => setIsWeatherOpen(true), [])
    const closeWeather = useCallback(() => setIsWeatherOpen(false), [])

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

                <div className="ml-auto flex items-center gap-2">
                    <button
                        onClick={openWeather}
                        className="px-3 py-1 rounded-lg border border-gray-300 text-sm hover:bg-gray-200 transition-colors"
                    >
                        {isLoading ? '...' : weather ? `${weather.temp}°C` : 'Ob-havo'}
                    </button>
                    <button
                        onClick={toggleTheme}
                        className="px-3 py-1 rounded-lg border border-gray-300 text-sm hover:bg-gray-200 transition-colors"
                    >
                        {theme === 'light' ? 'Dark' : 'Light'}
                    </button>
                </div>
            </nav>

            <Modal isOpen={isWeatherOpen} onClose={closeWeather} title="Bugungi ob-havo">
                {isLoading && <p className="text-gray-500">Yuklanmoqda...</p>}
                {error && <p className="text-red-500">Xato: {error.message}</p>}
                {weather && (
                    <div className="flex flex-col gap-4">
                        <div className="text-center">
                            <p className="text-4xl font-bold">{weather.temp}°C</p>
                            <p className="text-gray-500">{weather.city}</p>
                            <p className="text-sm text-gray-400">{weather.description}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-gray-50 rounded-lg p-3 text-center">
                                <p className="text-sm text-gray-500">Namlik</p>
                                <p className="font-bold">{weather.humidity}%</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3 text-center">
                                <p className="text-sm text-gray-500">Shamol</p>
                                <p className="font-bold">{weather.wind} km/h</p>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </header>
    )
}
