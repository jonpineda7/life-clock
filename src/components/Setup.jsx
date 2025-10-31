
import React, { useState } from 'react'

const COLORS = ['#0ea5e9', '#f43f5e', '#22c55e', '#6366f1']

export default function Setup({ initial, onStart }) {
  const [playersCount, setPlayersCount] = useState(initial.playersCount)
  const [startingLife, setStartingLife] = useState(initial.startingLife)
  const [minutesPerPlayer, setMinutesPerPlayer] = useState(initial.minutesPerPlayer)
  const [names, setNames] = useState(
    Array.from({ length: 4 }).map((_, i) => `Jugador ${i + 1}`)
  )
  const [colors, setColors] = useState(
    Array.from({ length: 4 }).map((_, i) => COLORS[i % COLORS.length])
  )

  function handleSubmit(e) {
    e.preventDefault()
    const payload = {
      playersCount: Number(playersCount),
      startingLife: Number(startingLife),
      minutesPerPlayer: Number(minutesPerPlayer),
      names: names.slice(0, playersCount),
      colors: colors.slice(0, playersCount),
    }
    onStart(payload)
  }

  function updateName(i, value) {
    setNames(prev => prev.map((n, idx) => (idx === i ? value : n)))
  }

  function updateColor(i, color) {
    setColors(prev => prev.map((c, idx) => (idx === i ? color : c)))
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-slate-900/40 border border-slate-200/5 rounded-3xl p-6 shadow-2xl backdrop-blur-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-slate-100 mb-4">Configurar partida</h2>

        <div className="space-y-1">
          <label className="text-sm text-slate-200/80">Cantidad de jugadores</label>
          <select
            value={playersCount}
            onChange={e => setPlayersCount(Number(e.target.value))}
            className="w-full bg-slate-900/50 border border-slate-200/10 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            {[2,3,4].map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-sm text-slate-200/80">Vidas iniciales</label>
          <input
            type="number"
            value={startingLife}
            onChange={e => setStartingLife(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-200/10 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm text-slate-200/80">Minutos por jugador</label>
          <input
            type="number"
            value={minutesPerPlayer}
            onChange={e => setMinutesPerPlayer(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-200/10 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div className="space-y-3">
          <p className="text-sm text-slate-200/70">Nombres y colores de jugadores</p>
          {Array.from({ length: playersCount }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <input
                value={names[i]}
                onChange={e => updateName(i, e.target.value)}
                className="flex-1 bg-slate-900/50 border border-slate-200/10 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <div className="flex gap-2">
                {COLORS.map(col => (
                  <button
                    key={col}
                    type="button"
                    onClick={() => updateColor(i, col)}
                    className={`w-7 h-7 rounded-full border ${colors[i] === col ? 'ring-2 ring-white/80 border-white/80' : 'border-transparent'}`}
                    style={{ background: col }}
                    aria-label={`Color ${col}`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-sky-500 to-indigo-500 text-white py-2 rounded-xl font-semibold shadow-lg shadow-sky-500/30"
        >
          Comenzar
        </button>
      </form>
    </div>
  )
}
