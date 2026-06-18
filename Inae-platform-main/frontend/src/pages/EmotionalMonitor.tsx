import { useEffect, useState } from 'react'
import api from '../api/client'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useAuth } from '../context/AuthContext'

const EMOTIONS = [
  { value: 'muy_bien', label: 'Muy bien', emoji: '😄', color: '#22c55e' },
  { value: 'bien', label: 'Bien', emoji: '🙂', color: '#86efac' },
  { value: 'neutral', label: 'Neutral', emoji: '😐', color: '#fbbf24' },
  { value: 'mal', label: 'Mal', emoji: '😟', color: '#f97316' },
  { value: 'muy_mal', label: 'Muy mal', emoji: '😢', color: '#ef4444' },
]

const EMOTION_SCORE: Record<string, number> = {
  muy_bien: 5, bien: 4, neutral: 3, mal: 2, muy_mal: 1,
}

interface Record {
  id: number
  emocion: string
  nota: string | null
  fecha: string
  usuario: { nombre: string }
}

export default function EmotionalMonitor() {
  const { user } = useAuth()
  const [records, setRecords] = useState<Record[]>([])
  const [selected, setSelected] = useState('')
  const [nota, setNota] = useState('')
  const [loading, setLoading] = useState(false)
  const [allRecords, setAllRecords] = useState<Record[]>([])

  const isStaff = user?.role === 'admin' || user?.role === 'mentor'

  const load = async () => {
    const [myRes, allRes] = await Promise.all([
      api.get('/emotional/my'),
      isStaff ? api.get('/emotional/all') : Promise.resolve({ data: [] }),
    ])
    setRecords(myRes.data)
    setAllRecords(allRes.data)
  }

  useEffect(() => { load() }, [])

  const handleSubmit = async () => {
    if (!selected) return toast.error('Selecciona cómo te sientes')
    setLoading(true)
    try {
      await api.post('/emotional/', { emocion: selected, nota: nota || null })
      toast.success('Registro guardado')
      setSelected('')
      setNota('')
      load()
    } catch {
      toast.error('Error al guardar')
    } finally {
      setLoading(false)
    }
  }

  const chartData = [...records].reverse().slice(-14).map((r) => ({
    fecha: format(new Date(r.fecha), 'd MMM', { locale: es }),
    score: EMOTION_SCORE[r.emocion],
    label: EMOTIONS.find((e) => e.value === r.emocion)?.label,
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-inacap-black">Bienestar Emocional</h1>
        <p className="text-gray-500 text-sm mt-1">Registra cómo te sientes hoy</p>
      </div>

      <div className="card">
        <h2 className="font-semibold text-inacap-black mb-4">¿Cómo te sientes hoy?</h2>
        <div className="flex gap-3 flex-wrap mb-4">
          {EMOTIONS.map((e) => (
            <button
              key={e.value}
              onClick={() => setSelected(e.value)}
              className={`flex flex-col items-center gap-1 px-4 py-3 rounded-xl border-2 transition-all
                ${selected === e.value
                  ? 'border-inacap-red bg-red-50 scale-105'
                  : 'border-gray-200 bg-white hover:border-gray-300'}`}
            >
              <span className="text-2xl">{e.emoji}</span>
              <span className="text-xs font-medium text-gray-600">{e.label}</span>
            </button>
          ))}
        </div>
        <textarea
          className="input mb-3 resize-none"
          rows={2}
          placeholder="Nota opcional (¿qué influyó en cómo te sientes?)"
          value={nota}
          onChange={(e) => setNota(e.target.value)}
        />
        <button className="btn-primary" onClick={handleSubmit} disabled={loading || !selected}>
          {loading ? 'Guardando...' : 'Registrar'}
        </button>
      </div>

      {chartData.length > 1 && (
        <div className="card">
          <h2 className="font-semibold text-inacap-black mb-4">Mi historial (últimas 2 semanas)</h2>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={chartData}>
              <XAxis dataKey="fecha" tick={{ fontSize: 11 }} />
              <YAxis domain={[1, 5]} hide />
              <Tooltip formatter={(val: number) => EMOTIONS[5 - val]?.label} />
              <Line type="monotone" dataKey="score" stroke="#CC0000" strokeWidth={2} dot={{ r: 3, fill: '#CC0000' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="card">
        <h2 className="font-semibold text-inacap-black mb-4">Mis registros recientes</h2>
        {records.length === 0 ? (
          <p className="text-gray-400 text-sm">Sin registros todavía.</p>
        ) : (
          <div className="space-y-2">
            {records.slice(0, 10).map((r) => {
              const em = EMOTIONS.find((e) => e.value === r.emocion)
              return (
                <div key={r.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                  <span className="text-xl">{em?.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800">{em?.label}</p>
                    {r.nota && <p className="text-xs text-gray-500 truncate">{r.nota}</p>}
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    {format(new Date(r.fecha), "d MMM, HH:mm", { locale: es })}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {isStaff && allRecords.length > 0 && (
        <div className="card">
          <h2 className="font-semibold text-inacap-black mb-4">Registros de todos los estudiantes</h2>
          <div className="space-y-2">
            {allRecords.slice(0, 15).map((r) => {
              const em = EMOTIONS.find((e) => e.value === r.emocion)
              return (
                <div key={r.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                  <span className="text-xl">{em?.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800">{r.usuario.nombre}</p>
                    <p className="text-xs text-gray-500">{em?.label}{r.nota ? ` · ${r.nota}` : ''}</p>
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    {format(new Date(r.fecha), "d MMM", { locale: es })}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
