import { useEffect, useState } from 'react'
import api from '../api/client'
import toast from 'react-hot-toast'
import { format, isPast } from 'date-fns'
import { es } from 'date-fns/locale'
import { Plus, Trash2, CheckCircle2, Circle, AlertCircle } from 'lucide-react'

interface Task {
  id: number
  titulo: string
  descripcion: string | null
  fecha_limite: string
  completada: boolean
  prioridad: string
  asignatura: string | null
}

const PRIORITY_COLORS: Record<string, string> = {
  alta: 'badge-alto',
  media: 'badge-medio',
  baja: 'badge-bajo',
}

export default function Agenda() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    titulo: '',
    descripcion: '',
    fecha_limite: '',
    prioridad: 'media',
    asignatura: '',
  })

  const load = async () => {
    const res = await api.get('/agenda/')
    setTasks(res.data)
  }

  useEffect(() => { load() }, [])

  const handleCreate = async () => {
    if (!form.titulo || !form.fecha_limite) return toast.error('Título y fecha son requeridos')
    try {
      await api.post('/agenda/', {
        ...form,
        fecha_limite: new Date(form.fecha_limite).toISOString(),
        descripcion: form.descripcion || null,
        asignatura: form.asignatura || null,
      })
      toast.success('Tarea creada')
      setForm({ titulo: '', descripcion: '', fecha_limite: '', prioridad: 'media', asignatura: '' })
      setShowForm(false)
      load()
    } catch {
      toast.error('Error al crear tarea')
    }
  }

  const toggleComplete = async (id: number) => {
    await api.patch(`/agenda/${id}/complete`)
    load()
  }

  const deleteTask = async (id: number) => {
    await api.delete(`/agenda/${id}`)
    toast.success('Tarea eliminada')
    load()
  }

  const pending = tasks.filter((t) => !t.completada)
  const done = tasks.filter((t) => t.completada)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-inacap-black">Agenda Académica</h1>
          <p className="text-gray-500 text-sm mt-1">{pending.length} tarea(s) pendiente(s)</p>
        </div>
        <button className="btn-primary flex items-center gap-2" onClick={() => setShowForm(!showForm)}>
          <Plus size={16} />
          Nueva tarea
        </button>
      </div>

      {showForm && (
        <div className="card border-inacap-red border">
          <h2 className="font-semibold text-inacap-black mb-4">Nueva tarea</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-500 mb-1">Título *</label>
              <input className="input" placeholder="Ej: Entregar informe de redes" value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Asignatura</label>
              <input className="input" placeholder="Ej: Base de Datos" value={form.asignatura} onChange={(e) => setForm({ ...form, asignatura: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Prioridad</label>
              <select className="input" value={form.prioridad} onChange={(e) => setForm({ ...form, prioridad: e.target.value })}>
                <option value="alta">Alta</option>
                <option value="media">Media</option>
                <option value="baja">Baja</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Fecha límite *</label>
              <input type="datetime-local" className="input" value={form.fecha_limite} onChange={(e) => setForm({ ...form, fecha_limite: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Descripción</label>
              <input className="input" placeholder="Descripción opcional" value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button className="btn-primary" onClick={handleCreate}>Crear tarea</button>
            <button className="btn-secondary" onClick={() => setShowForm(false)}>Cancelar</button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Pendientes</h2>
        {pending.length === 0 && <p className="text-gray-400 text-sm card">No hay tareas pendientes 🎉</p>}
        {pending.map((task) => {
          const overdue = isPast(new Date(task.fecha_limite))
          return (
            <div key={task.id} className={`card flex items-start gap-3 ${overdue ? 'border-red-200 bg-red-50' : ''}`}>
              <button onClick={() => toggleComplete(task.id)} className="mt-0.5 shrink-0 text-gray-300 hover:text-inacap-red transition-colors">
                <Circle size={20} />
              </button>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-0.5">
                  <p className="text-sm font-semibold text-inacap-black">{task.titulo}</p>
                  <span className={PRIORITY_COLORS[task.prioridad]}>{task.prioridad}</span>
                  {overdue && <span className="flex items-center gap-0.5 text-xs text-red-600 font-semibold"><AlertCircle size={12} />Vencida</span>}
                </div>
                {task.asignatura && <p className="text-xs text-gray-400">{task.asignatura}</p>}
                <p className="text-xs text-gray-500 mt-0.5">
                  Límite: {format(new Date(task.fecha_limite), "d MMM yyyy, HH:mm", { locale: es })}
                </p>
              </div>
              <button onClick={() => deleteTask(task.id)} className="shrink-0 text-gray-300 hover:text-red-500 transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
          )
        })}
      </div>

      {done.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Completadas</h2>
          {done.map((task) => (
            <div key={task.id} className="card flex items-center gap-3 opacity-60">
              <button onClick={() => toggleComplete(task.id)} className="shrink-0 text-green-500">
                <CheckCircle2 size={20} />
              </button>
              <p className="text-sm text-gray-500 line-through flex-1">{task.titulo}</p>
              <button onClick={() => deleteTask(task.id)} className="shrink-0 text-gray-300 hover:text-red-500 transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
