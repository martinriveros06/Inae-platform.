import { useEffect, useState } from 'react'
import api from '../api/client'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { UserCheck, Calendar, Clock } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

interface Mentor {
  id: number
  nombre: string
  email: string
  carrera: string | null
  sede: string | null
}

interface Session {
  id: number
  fecha: string
  estado: string
  notas: string | null
  mentor: { nombre: string; email: string }
  estudiante: { nombre: string }
}

const STATUS_STYLES: Record<string, string> = {
  pendiente: 'badge-medio',
  confirmada: 'badge-bajo',
  completada: 'bg-gray-100 text-gray-600 text-xs font-semibold px-2 py-0.5 rounded-full',
}

export default function Mentors() {
  const { user } = useAuth()
  const [mentors, setMentors] = useState<Mentor[]>([])
  const [sessions, setSessions] = useState<Session[]>([])
  const [selected, setSelected] = useState<Mentor | null>(null)
  const [fecha, setFecha] = useState('')
  const [notas, setNotas] = useState('')

  const load = async () => {
    const [mRes, sRes] = await Promise.all([
      api.get('/users/mentors'),
      api.get('/mentors/sessions/my'),
    ])
    setMentors(mRes.data)
    setSessions(sRes.data)
  }

  useEffect(() => { load() }, [])

  const requestSession = async () => {
    if (!selected || !fecha) return toast.error('Selecciona mentor y fecha')
    try {
      await api.post('/mentors/sessions', {
        mentor_id: selected.id,
        fecha: new Date(fecha).toISOString(),
        notas: notas || null,
      })
      toast.success('Sesión solicitada correctamente')
      setSelected(null)
      setFecha('')
      setNotas('')
      load()
    } catch {
      toast.error('Error al solicitar sesión')
    }
  }

  const updateStatus = async (id: number, estado: string) => {
    await api.patch(`/mentors/sessions/${id}/status?estado=${estado}`)
    toast.success('Estado actualizado')
    load()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-inacap-black">Red de Mentores</h1>
        <p className="text-gray-500 text-sm mt-1">{mentors.length} mentor(es) disponible(s)</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {mentors.map((m) => (
          <div
            key={m.id}
            className={`card cursor-pointer transition-all hover:shadow-md ${selected?.id === m.id ? 'border-inacap-red border-2' : ''}`}
            onClick={() => setSelected(selected?.id === m.id ? null : m)}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-inacap-red flex items-center justify-center text-white font-bold shrink-0">
                {m.nombre.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm text-inacap-black truncate">{m.nombre}</p>
                <p className="text-xs text-gray-400 truncate">{m.email}</p>
              </div>
            </div>
            {m.carrera && <p className="text-xs text-gray-500 mb-1">{m.carrera}</p>}
            {m.sede && (
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{m.sede}</span>
            )}
            <div className="flex items-center gap-1 mt-3">
              <UserCheck size={14} className="text-green-500" />
              <span className="text-xs text-green-600 font-medium">Disponible</span>
            </div>
          </div>
        ))}
      </div>

      {selected && user?.role === 'estudiante' && (
        <div className="card border-inacap-red border">
          <h2 className="font-semibold text-inacap-black mb-4">
            Solicitar sesión con <span className="text-inacap-red">{selected.nombre}</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Fecha y hora *</label>
              <input type="datetime-local" className="input" value={fecha} onChange={(e) => setFecha(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Notas (opcional)</label>
              <input className="input" placeholder="¿En qué necesitas ayuda?" value={notas} onChange={(e) => setNotas(e.target.value)} />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button className="btn-primary" onClick={requestSession}>Solicitar sesión</button>
            <button className="btn-secondary" onClick={() => setSelected(null)}>Cancelar</button>
          </div>
        </div>
      )}

      <div className="card">
        <h2 className="font-semibold text-inacap-black mb-4">
          {user?.role === 'mentor' ? 'Sesiones de mis estudiantes' : 'Mis sesiones de mentoría'}
        </h2>
        {sessions.length === 0 ? (
          <p className="text-gray-400 text-sm">Sin sesiones registradas.</p>
        ) : (
          <div className="space-y-3">
            {sessions.map((s) => (
              <div key={s.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                <Calendar size={18} className="text-inacap-red mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-inacap-black">
                    {user?.role === 'mentor' ? s.estudiante.nombre : s.mentor.nombre}
                  </p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Clock size={12} className="text-gray-400" />
                    <span className="text-xs text-gray-500">
                      {format(new Date(s.fecha), "d MMM yyyy, HH:mm", { locale: es })}
                    </span>
                  </div>
                  {s.notas && <p className="text-xs text-gray-400 mt-1">{s.notas}</p>}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={STATUS_STYLES[s.estado] ?? ''}>{s.estado}</span>
                  {user?.role === 'mentor' && s.estado === 'pendiente' && (
                    <button
                      onClick={() => updateStatus(s.id, 'confirmada')}
                      className="text-xs text-green-600 font-semibold hover:underline"
                    >
                      Confirmar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
