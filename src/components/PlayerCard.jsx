
import React from 'react'
import { msToClock } from '../utils/time.js'

export default function PlayerCard({
  player,
  isActive,
  onLife,
  onRename,
  tableMode = false,
  slot = 0,
  color
}) {
  if (tableMode) {
    return (
      <div
        className={`table-cell ${isActive ? 'active-table-player' : ''}`}
        style={{ background: color || player.color || '#94a3b8' }}
      >
        <div className="table-cell-inner">
          <div className="table-player-name">{player.name}</div>
          <div className="table-life">{player.life}</div>
          <div className="table-buttons">
            <button onClick={() => onLife(player.id, -1)}>-</button>
            <button onClick={() => onLife(player.id, +1)}>+</button>
          </div>
          <div className="table-time">{msToClock(player.timeMs)}</div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`card flex flex-col gap-3 border w-full ${isActive ? 'active-card' : ''}`}
      style={isActive ? { boxShadow: '0 0 25px rgba(14,165,233,0.6)' } : {}}
    >
      <div className="flex items-center justify-between gap-2">
        <input
          aria-label="Nombre del jugador"
          className="player-name-input text-lg font-bold bg-transparent outline-none w-full"
          value={player.name}
          onChange={(e) => onRename(player.id, e.target.value)}
        />
        <span
          className={`player-status-pill rounded-full ${
            isActive ? 'bg-blue-100 text-blue-700' : 'bg-slate-100/10 text-slate-100/70'
          }`}
        >
          {isActive ? 'En turno' : 'En espera'}
        </span>
      </div>

      <div className="grid gap-3 items-center sm:grid-cols-2">
        <div className="flex flex-col items-start gap-2">
          <div className="life-big text-4xl font-black tabular-nums leading-none">
            {player.life}
          </div>
          <div className="life-btn-row flex flex-wrap gap-2">
            <button className="btn-ghost" onClick={() => onLife(player.id, -5)}>
              -5
            </button>
            <button className="btn-ghost" onClick={() => onLife(player.id, -1)}>
              -1
            </button>
            <button className="btn-ghost" onClick={() => onLife(player.id, +1)}>
              +1
            </button>
            <button className="btn-ghost" onClick={() => onLife(player.id, +5)}>
              +5
            </button>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div
            className={`time-big text-3xl font-extrabold tabular-nums ${
              player.timeMs <= 15000 ? 'text-red-400' : 'text-slate-50'
            }`}
          >
            {msToClock(player.timeMs)}
          </div>
          <div className="text-xs text-slate-200/50">Tiempo total restante</div>
        </div>
      </div>

      {player.out && (
        <div className="rounded-xl bg-red-500/10 text-red-200 text-sm px-3 py-2">
          Sin tiempo • Eliminado
        </div>
      )}
    </div>
  )
}
