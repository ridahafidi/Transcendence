import AuthBrandPanel from '../components/AuthBrandPanel'

export default function AuthPage({ isRegister = false }: { isRegister?: boolean }) {
  return <AuthBrandPanel isRegister={isRegister} />
}
