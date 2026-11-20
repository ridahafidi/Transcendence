import AuthBrandPanel from '../features/auth/components/AuthBrandPanel'
import LandingPage from '../pages/LandingPage'

function App() {
  if (window.location.pathname === '/login') {
    return <AuthBrandPanel />
  }

  return <LandingPage />
}

export default App
