import './styles/App.css'
import ThemeProvider from './providers/ThemeProvider'
import RouterProvider from './providers/RouterProvider'

function App() {
  return (
    <ThemeProvider>
      <RouterProvider />
    </ThemeProvider>
  )
}

export default App
