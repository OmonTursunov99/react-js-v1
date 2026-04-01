import './styles/App.css'
import ThemeProvider from './providers/ThemeProvider'
import StoreProvider from './providers/StoreProvider'
import QueryProvider from './providers/QueryProvider'
import RouterProvider from './providers/RouterProvider'

function App() {
  return (
    <StoreProvider>
      <QueryProvider>
        <ThemeProvider>
          <RouterProvider />
        </ThemeProvider>
      </QueryProvider>
    </StoreProvider>
  )
}

export default App
