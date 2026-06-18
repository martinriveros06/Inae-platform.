import { useEffect, useState } from 'react'
import api from '../api/client'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { AlertTriangle, CheckCircle2, Plus, ShieldAlert } from 'lucide-react'

interface Alert {
  id: number
  tipo: string
  descripcion: string
  nivel: string
  resuelta: boolean
  created_at: string
  estudiante: { id: number; nombre: string; carrera: string | null; email: string }
}

interface Student {
  id: number
  nombre: string
  email: string
}

const LEVEL_STYLES: Record<string, string> = {
  alto: 'badge-alto',
  medio: 'badge-medio',
  bajo: 'badge-bajo',
}

const TIPOS = [
  'Bajo rendimiento académico',
  'Riesgo de deserción',
  'Estado emocional crítico',
  'Inasistencia reiterada',
  'Otro',
]

export default function Alerts() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    estudiante_id: '',
    tipo: TIPOS[0],
    descripcion: '',
    nivel: 'medio',
  })

  const load = async () => {
    const [aRes, sRes] = await Promise.all([
      api.get('/alerts/'),
      api.get('/users/').catch(() => ({ data: [] })),
    ])
    setAlerts(aRes.data)
    setStudents(sRes.data.filter((u: { role: string }) => u.role === 'estudiante'))
  }

  useEffect(() => { load() }, [])

  const createAlert = async () => {
    if (!form.estudiante_id || !form.descripcion) return toast.error('Completa todos los campos')
    try {
      await api.post('/alerts/', { ...form, estudiante_id: Number(form.estudiante_id) })
      toast.success('Alerta creada')
      setShowForm(false)
      setForm({ estudiante_id: '', tipo: TIPOS[0], descripcion: '', nivel: 'medio' })
      load()
    } catch {
      toast.error('Error al crear alerta')
    }
  }

  const resolve = async (id: number) => {
    await api.patch(`/alerts/${id}/resolve`)
    toast.success('Alerta marcada como resuelta')
    load()
  }

  const active = alerts.filter((a) => !a.resuelta)
  const resolved = alerts.filter((a) => a.resuelta)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-inacap-black">Alertas de Riesgo</h1>
          <p className="text-gray-500 text-sm mt-1">{active.length} alerta(s) activa(s)</p>
        </div>
        <button className="btn-primary flex items-center gap-2" onClick={() => setShowForm(!showForm)}>
          <Plus size={16} />
          Nueva alerta
        </button>
      </div>

      {showForm && (
        <div className="card border-inacap-red border">
          <h2 className="font-semibold text-inacap-black mb-4">Crear nueva alerta</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Estudiante *</label>
              <select className="input" value={form.estudiante_id} onChange={(e) => setForm({ ...form, estudiante_id: e.target.value })}>
                <option value="">Seleccionar...</option>
                {students.map((s) => <option key={s.id} value={s.id}>{s.nombre}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Tipo de alerta</label>
              <select className="input" value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })}>
                {TIPOS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Nivel</label>
              <select className="input" value={form.nivel} onChange={(e) => setForm({ ...form, nivel: e.target.value })}>
                <option value="alto">Alto</option>
                <option value="medio">Medio</option>
                <option value="bajo">Bajo</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Descripción *</label>
              <input className="input" placeholder="Describe la situación de riesgo" value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button className="btn-primary" onClick={createAlert}>Crear alerta</button>
            <button className="btn-secondary" onClick={() => setShowForm(false)}>Cancelar</button>
          </div>
        </div>
      )}

      {active.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-2">
            <ShieldAlert size={14} className="text-inacap-red" /> Alertas activas
          </h2>
          {active.map((a) => (
            <div key={a.id} className="card border-l-4 border-l-inacap-red">
              <div className="flex items-start gap-3">
                <AlertTriangle size={18} className="text-inacap-red mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <p className="text-sm font-semibold text-inacap-black">{a.estudiante.nombre}</p>
                    <span className={LEVEL_STYLES[a.nivel]}>{a.nivel}</span>
                  </div>
                  <p className="text-xs font-medium text-gray-600">{a.tipo}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{a.descripcion}</p>
                  {a.estudiante.carrera && <p className="text-xs text-gray-400 mt-0.5">{a.estudiante.carrera}</p>}
                  <p className="text-xs text-gray-400 mt-1">
                    {format(new Date(a.created_at), "d MMM yyyy", { locale: es })}
                  </p>
                </div>
                <button
                  onClick={() => resolve(a.id)}
                  className="shrink-0 text-xs bg-green-50 text-green-700 border border-green-200 px-3 py-1.5 rounded-lg font-semibold hover:bg-green-100 transition-colors"
                >
                  Resolver
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {resolved.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Resueltas</h2>
          {resolved.map((a) => (
            <div key={a.id} className="card opacity-60 flex items-start gap-3">
              <CheckCircle2 size={18} className="text-green-500 mt-0.5 shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-700">{a.estudiante.nombre}</p>
                <p className="text-xs text-gray-500">{a.tipo}</p>
              </div>
              <span className={`ml-auto ${LEVEL_STYLES[a.nivel]}`}>{a.nivel}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
