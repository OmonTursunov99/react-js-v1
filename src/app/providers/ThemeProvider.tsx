import { useState, useCallback, useMemo, useEffect } from 'react'
import { ThemeContext } from './theme-context'
import type { Theme } from './theme-context'

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme')
    return (saved === 'dark' || saved === 'light') ? saved : 'light'
  })

  useEffect(() => {
    localStorage.setItem('theme', theme)
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }, [])

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme])

  return (
    <ThemeContext.Provider value={value}>
      <div className={theme === 'dark' ? 'dark bg-gray-950 text-gray-100 min-h-screen' : 'bg-gray-50 text-gray-900 min-h-screen'}>
        {children}
      </div>
    </ThemeContext.Provider>
  )
}
