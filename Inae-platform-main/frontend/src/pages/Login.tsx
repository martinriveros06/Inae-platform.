import { useState, FormEvent } from 'react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const DEMO_ACCOUNTS = [
  { label: 'Admin DAE', email: 'admin@inacap.cl', password: 'admin123' },
  { label: 'Mentor 1', email: 'mentor1@inacap.cl', password: 'mentor123' },
  { label: 'Estudiante 1', email: 'estudiante1@inacap.cl', password: 'est123' },
]

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(email, password)
      // PublicRoute se encarga de redirigir cuando user cambia
    } catch {
      toast.error('Credenciales incorrectas')
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = (acc: typeof DEMO_ACCOUNTS[0]) => {
    setEmail(acc.email)
    setPassword(acc.password)
  }

  return (
    <div className="min-h-screen bg-inacap-black flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-block bg-inacap-red px-4 py-1 rounded mb-3">
            <span className="text-white font-bold text-3xl tracking-widest">INAE</span>
          </div>
          <p className="text-white/60 text-sm">Plataforma de Bienestar Estudiantil</p>
          <p className="text-white/40 text-xs mt-1">INACAP</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-xl">
          <h1 className="text-lg font-bold text-inacap-black mb-5">Iniciar Sesión</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Correo institucional</label>
              <input
                type="email"
                className="input"
                placeholder="usuario@inacap.cl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Contraseña</label>
              <input
                type="password"
                className="input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn-primary w-full mt-2" disabled={loading}>
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400 font-semibold mb-2">Cuentas demo</p>
            <div className="space-y-1.5">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.email}
                  onClick={() => fillDemo(acc)}
                  className="w-full text-left text-xs px-3 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-100"
                >
                  <span className="font-semibold text-inacap-red">{acc.label}</span>
                  <span className="text-gray-400 ml-2">{acc.email}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
