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
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#FDFBF7]">
      
      {/* ================= COLUMNA IZQUIERDA: DISEÑO EMOCIONAL ================= */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop" 
          alt="Estudiantes felices"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#6B8E23]/95 via-[#6B8E23]/40 to-transparent flex flex-col justify-end p-12 text-white">
          <h1 className="text-5xl font-bold mb-4 font-sans tracking-tight">Tu bienestar importa</h1>
          <p className="text-xl mb-8 max-w-md opacity-90">
            Un espacio seguro diseñado para acompañarte, entregarte herramientas y cuidar tu salud mental durante tu vida académica.
          </p>
          
          <div className="flex items-start gap-4 bg-white/10 p-5 rounded-2xl backdrop-blur-md border border-white/10 max-w-md">
            <svg className="mt-1 w-8 h-8 text-white fill-white animate-pulse" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            <div>
              <h3 className="font-bold text-lg">¿Cómo te sientes hoy?</h3>
              <p className="text-sm opacity-80">Recuerda que dentro de la plataforma puedes registrar tu estado de ánimo diario de forma segura.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ================= COLUMNA DERECHA: FORMULARIO TÉCNICO ================= */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 lg:p-16">
        <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
          
          <div className="text-center">
            <div className="inline-block p-3 bg-[#6B8E23]/10 rounded-2xl mb-4">
              <svg className="w-8 h-8 text-[#6B8E23]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 tracking-tight">Iniciar Sesión</h2>
            <p className="text-gray-500 mt-2">Plataforma de Bienestar Estudiantil</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">Correo institucional</label>
              <input
                type="email"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#6B8E23] focus:ring-1 focus:ring-[#6B8E23] transition-colors"
                placeholder="usuario@inacap.cl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">Contraseña</label>
              <input
                type="password"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#6B8E23] focus:ring-1 focus:ring-[#6B8E23] transition-colors"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="w-full py-4 bg-[#6B8E23] hover:bg-[#55721c] text-white rounded-xl font-bold transition-all transform hover:scale-[1.01] shadow-lg shadow-[#6B8E23]/20 mt-2" disabled={loading}>
              {loading ? 'Ingresando...' : 'Ingresar a la plataforma'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-400 font-bold tracking-wider uppercase mb-3">Cuentas de prueba</p>
            <div className="space-y-2">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.email}
                  onClick={() => fillDemo(acc)}
                  type="button"
                  className="w-full flex justify-between items-center px-4 py-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-100"
                >
                  <span className="font-semibold text-gray-600">{acc.label}</span>
                  <span className="text-[#6B8E23] font-mono text-sm font-medium">{acc.email}</span>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
