import AuthBrandPanel from '../features/auth/components/AuthBrandPanel'
import LandingPage from '../pages/LandingPage'

function App() {
  const path = window.location.pathname

  if (path === '/login' || path === '/register') {
    return <AuthBrandPanel isRegister={path === '/register'} />
  }

  return <LandingPage />
}

export default App
