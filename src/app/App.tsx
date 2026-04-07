import ThemeProvider from './providers/ThemeProvider'
import AppRouter from './router'

function App() {
  return (
    <ThemeProvider>
      <AppRouter />
    </ThemeProvider>
  )
}

export default App
