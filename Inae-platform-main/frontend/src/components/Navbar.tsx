import { Menu } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

interface Props {
  onMenuClick: () => void
}

export default function Navbar({ onMenuClick }: Props) {
  const { user } = useAuth()

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between lg:px-6 sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Menu size={20} />
        </button>
        <span className="font-semibold text-sm text-gray-500 hidden sm:block">
          Bienvenido/a, <span className="text-inacap-black">{user?.nombre}</span>
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs bg-inacap-red/10 text-inacap-red font-semibold px-2.5 py-1 rounded-full capitalize">
          {user?.role}
        </span>
      </div>
    </header>
  )
}
