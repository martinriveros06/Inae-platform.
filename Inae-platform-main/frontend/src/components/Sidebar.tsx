import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard, Heart, CalendarDays, Users, Bell, LogOut, X,
} from 'lucide-react'

interface Props {
  open: boolean
  onClose: () => void
}

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['estudiante', 'mentor', 'admin'] },
  { to: '/emocional', label: 'Bienestar Emocional', icon: Heart, roles: ['estudiante', 'mentor', 'admin'] },
  { to: '/agenda', label: 'Agenda Académica', icon: CalendarDays, roles: ['estudiante'] },
  { to: '/mentores', label: 'Red de Mentores', icon: Users, roles: ['estudiante', 'admin'] },
  { to: '/alertas', label: 'Alertas de Riesgo', icon: Bell, roles: ['mentor', 'admin'] },
]

export default function Sidebar({ open, onClose }: Props) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const filtered = navItems.filter((item) => user && item.roles.includes(user.role))

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-inacap-black text-white z-30 flex flex-col transition-transform duration-300
          ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-auto`}
      >
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
          <div>
            <span className="text-inacap-red font-bold text-xl tracking-tight">INAE</span>
            <p className="text-white/50 text-xs mt-0.5">Plataforma Estudiantil</p>
          </div>
          <button onClick={onClose} className="lg:hidden text-white/60 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {user && (
          <div className="px-5 py-4 border-b border-white/10">
            <div className="w-10 h-10 rounded-full bg-inacap-red flex items-center justify-center text-white font-bold text-lg mb-2">
              {user.nombre.charAt(0).toUpperCase()}
            </div>
            <p className="text-sm font-semibold leading-tight">{user.nombre}</p>
            <p className="text-white/50 text-xs capitalize">{user.role}</p>
            {user.carrera && <p className="text-white/40 text-xs mt-0.5 truncate">{user.carrera}</p>}
          </div>
        )}

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {filtered.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${isActive
                  ? 'bg-inacap-red text-white'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white w-full transition-colors"
          >
            <LogOut size={18} />
            Cerrar Sesión
          </button>
        </div>
      </aside>
    </>
  )
}
