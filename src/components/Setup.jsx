
import React, { useEffect, useState } from 'react'

export default function Setup({ initial, onStart }) {
  const [playersCount, setPlayersCount] = useState(initial.playersCount)
  const [startingLife, setStartingLife] = useState(initial.startingLife)
  const [minutesPerPlayer, setMinutesPerPlayer] = useState(initial.minutesPerPlayer)
  const [names, setNames] = useState(() => Array.from({ length: initial.playersCount }, (_, i) => `Jugador ${i + 1}`))

  // Ajusta la cantidad de inputs de nombres según playersCount
  useEffect(() => {
    setNames(prev => {
      const next = [...prev]
      if (playersCount > next.length) {
        for (let i = next.length; i < playersCount; i++) next.push(`Jugador ${i + 1}`)
      } else if (playersCount < next.length) {
        next.length = playersCount
      }
      return next
    })
  }, [playersCount])

  function handleNameChange(index, value) {
    setNames(prev => prev.map((n, i) => i === index ? value : n))
  }

  function handleSubmit(e) {
    e.preventDefault()
    onStart({ playersCount, startingLife, minutesPerPlayer, names })
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="card max-w-lg w-full">
        <h2 className="text-xl font-extrabold mb-4">Configurar partida</h2>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <label className="grid gap-1">
            <span className="text-sm text-zinc-600">Cantidad de jugadores</span>
            <select className="border rounded-xl px-3 py-2" value={playersCount} onChange={e=>setPlayersCount(parseInt(e.target.value))}>
              {[2,3,4].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </label>

          <label className="grid gap-1">
            <span className="text-sm text-zinc-600">Vidas iniciales</span>
            <select className="border rounded-xl px-3 py-2" value={startingLife} onChange={e=>setStartingLife(parseInt(e.target.value))}>
              {[20,30,40].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </label>

          <label className="grid gap-1">
            <span className="text-sm text-zinc-600">Minutos por jugador</span>
            <input className="border rounded-xl px-3 py-2" type="number" min="1" max="90" value={minutesPerPlayer} onChange={e=>setMinutesPerPlayer(parseInt(e.target.value || 0))} />
          </label>

          <div className="grid gap-2 mt-2">
            <span className="text-sm text-zinc-600">Nombres de jugadores</span>
            {Array.from({ length: playersCount }).map((_, i) => (
              <input
                key={i}
                className="border rounded-xl px-3 py-2"
                aria-label={`Nombre del jugador ${i + 1}`}
                value={names[i] ?? ''}
                onChange={(e) => handleNameChange(i, e.target.value)}
                placeholder={`Jugador ${i + 1}`}
              />
            ))}
          </div>

          <button className="btn-primary mt-2" type="submit">Comenzar</button>
        </form>
      </div>
    </div>
  )
}
