import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/client'
import { Heart, CalendarDays, Users, Bell, TrendingUp, AlertTriangle } from 'lucide-react'
import { Link } from 'react-router-dom'

interface Stats {
  emociones: number
  tareas_pendientes: number
  tareas_completadas: number
  sesiones_mentor: number
  alertas_activas: number
}

const EMOTION_LABELS: Record<string, { label: string; color: string }> = {
  muy_bien: { label: 'Muy bien', color: 'text-green-600' },
  bien: { label: 'Bien', color: 'text-green-500' },
  neutral: { label: 'Neutral', color: 'text-yellow-500' },
  mal: { label: 'Mal', color: 'text-orange-500' },
  muy_mal: { label: 'Muy mal', color: 'text-red-600' },
}

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState<Stats | null>(null)
  const [lastEmotion, setLastEmotion] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const [emotRes, agendaRes] = await Promise.all([
          api.get('/emotional/my').catch(() => ({ data: [] })),
          api.get('/agenda/').catch(() => ({ data: [] })),
        ])

        const emociones = emotRes.data
        const tareas = agendaRes.data

        let sesiones = 0
        let alertas = 0
        if (user?.role !== 'estudiante') {
          const [sesRes, alertRes] = await Promise.all([
            api.get('/mentors/sessions/my').catch(() => ({ data: [] })),
            api.get('/alerts/').catch(() => ({ data: [] })),
          ])
          sesiones = sesRes.data.length
          alertas = alertRes.data.filter((a: { resuelta: boolean }) => !a.resuelta).length
        } else {
          const sesRes = await api.get('/mentors/sessions/my').catch(() => ({ data: [] }))
          sesiones = sesRes.data.length
        }

        setStats({
          emociones: emociones.length,
          tareas_pendientes: tareas.filter((t: { completada: boolean }) => !t.completada).length,
          tareas_completadas: tareas.filter((t: { completada: boolean }) => t.completada).length,
          sesiones_mentor: sesiones,
          alertas_activas: alertas,
        })

        if (emociones.length > 0) setLastEmotion(emociones[0].emocion)
      } catch {
        // ignore
      }
    }
    load()
  }, [user])

  const cards = [
    {
      label: 'Registros emocionales',
      value: stats?.emociones ?? '—',
      icon: Heart,
      to: '/emocional',
      color: 'bg-pink-50 text-pink-600',
    },
    {
      label: 'Tareas pendientes',
      value: stats?.tareas_pendientes ?? '—',
      icon: CalendarDays,
      to: '/agenda',
      color: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Sesiones de mentoría',
      value: stats?.sesiones_mentor ?? '—',
      icon: Users,
      to: '/mentores',
      color: 'bg-purple-50 text-purple-600',
    },
    ...(user?.role !== 'estudiante'
      ? [{
          label: 'Alertas activas',
          value: stats?.alertas_activas ?? '—',
          icon: Bell,
          to: '/alertas',
          color: 'bg-red-50 text-red-600',
        }]
      : []),
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-inacap-black">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">
          {new Date().toLocaleDateString('es-CL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {lastEmotion && (
        <div className="card flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center shrink-0">
            <Heart size={20} className="text-pink-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Tu último registro emocional</p>
            <p className={`font-semibold ${EMOTION_LABELS[lastEmotion]?.color}`}>
              {EMOTION_LABELS[lastEmotion]?.label}
            </p>
          </div>
          <Link to="/emocional" className="ml-auto text-xs text-inacap-red font-semibold hover:underline">
            Ver historial →
          </Link>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ label, value, icon: Icon, to, color }) => (
          <Link key={to} to={to} className="card hover:shadow-md transition-shadow group">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${color}`}>
              <Icon size={20} />
            </div>
            <p className="text-2xl font-bold text-inacap-black">{value}</p>
            <p className="text-xs text-gray-500 mt-0.5 leading-tight">{label}</p>
          </Link>
        ))}
      </div>

      {user?.role === 'admin' && (
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={18} className="text-inacap-red" />
            <h2 className="font-semibold text-inacap-black">Resumen del sistema</h2>
          </div>
          <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-100">
            <AlertTriangle size={18} className="text-yellow-600 shrink-0" />
            <p className="text-sm text-yellow-800">
              {stats?.alertas_activas ?? 0} alerta(s) de riesgo requieren atención.{' '}
              <Link to="/alertas" className="font-semibold underline">Revisar ahora</Link>
            </p>
          </div>
        </div>
      )}

      {user?.role === 'mentor' && (
        <div className="card">
          <div className="flex items-center gap-2 mb-3">
            <Users size={18} className="text-inacap-red" />
            <h2 className="font-semibold text-inacap-black">Tu rol como Mentor</h2>
          </div>
          <p className="text-sm text-gray-500">
            Tienes <strong>{stats?.sesiones_mentor ?? 0}</strong> sesión(es) de mentoría registradas.
            También puedes revisar las alertas de riesgo de los estudiantes.
          </p>
        </div>
      )}
    </div>
  )
}
