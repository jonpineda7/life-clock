import React from 'react'
import { msToClock } from '../utils/time.js'

export default function PlayerCard({ player, isActive, onLife, onRename }) {
  return (
    <div className={`card flex flex-col gap-3 border w-full ${isActive ? 'border-blue-600 ring-2 ring-blue-200' : 'border-transparent'}`}>
      <div className="flex items-center justify-between">
        <input
          aria-label="Nombre del jugador"
          className="player-name-input text-lg font-bold bg-transparent outline-none w-full"
          value={player.name}
          onChange={(e) => onRename(player.id, e.target.value)}
        />
        <span className={`player-status-pill ml-3 text-xs px-2 py-1 rounded-full ${isActive ? 'bg-blue-100 text-blue-700' : 'bg-zinc-100 text-zinc-600'}`}>
          {isActive ? 'En turno' : 'En espera'}
        </span>
      </div>

      <div className="grid gap-3 items-center sm:grid-cols-2">
        <div className="flex flex-col items-start gap-2">
          <div className="life-big text-4xl font-black tabular-nums">{player.life}</div>
          <div className="life-btn-row flex gap-2">
            <button className="btn-ghost" onClick={() => onLife(player.id, -5)}>-5</button>
            <button className="btn-ghost" onClick={() => onLife(player.id, -1)}>-1</button>
            <button className="btn-ghost" onClick={() => onLife(player.id, +1)}>+1</button>
            <button className="btn-ghost" onClick={() => onLife(player.id, +5)}>+5</button>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className={`time-big text-3xl font-extrabold tabular-nums ${player.timeMs <= 15000 ? 'text-red-600' : ''}`}>
            {msToClock(player.timeMs)}
          </div>
          <div className="text-xs text-zinc-500">
            Tiempo total restante
          </div>
        </div>
      </div>

      {player.out && (
        <div className="rounded-xl bg-red-50 text-red-700 text-sm px-3 py-2">
          Sin tiempo • Eliminado
        </div>
      )}
    </div>
  )
}
