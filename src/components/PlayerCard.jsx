
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
  const bg = color || player.color || '#94a3b8'

  if (tableMode) {
    return (
      <div
        className={`table-cell ${isActive ? 'active-table-player' : ''}`}
        style={{ background: bg, backgroundImage: bg }}
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
      style={{
        boxShadow: isActive ? '0 0 25px rgba(14,165,233,0.6)' : undefined,
        background: 'transparent'
      }}
    >
      <div
        className="rounded-2xl w-full h-full p-3"
        style={{
          background: bg,
          backgroundImage: bg,
          borderRadius: '1.25rem',
        }}
      >
        <div className="flex items-center justify-between gap-2 mb-2">
          <input
            aria-label="Nombre del jugador"
            className="player-name-input text-lg font-bold bg-transparent outline-none w-full text-slate-50 drop-shadow"
            value={player.name}
            onChange={(e) => onRename(player.id, e.target.value)}
          />
          <span
            className={`player-status-pill rounded-full px-3 py-1 text-sm ${
              isActive
                ? 'bg-white/80 text-slate-900'
                : 'bg-slate-900/30 text-slate-50/80'
            }`}
          >
            {isActive ? 'En turno' : 'En espera'}
          </span>
        </div>

        <div className="grid gap-3 items-center sm:grid-cols-2">
          <div className="flex flex-col items-start gap-2">
            <div className="life-big text-4xl font-black tabular-nums leading-none text-white drop-shadow">
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
                player.timeMs <= 15000 ? 'text-red-200' : 'text-white'
              } drop-shadow`}
            >
              {msToClock(player.timeMs)}
            </div>
            <div className="text-xs text-white/70 drop-shadow">Tiempo total restante</div>
          </div>
        </div>

        {player.out && (
          <div className="mt-3 rounded-xl bg-red-500/30 text-red-50 text-sm px-3 py-2">
            Sin tiempo • Eliminado
          </div>
        )}
      </div>
    </div>
  )
}
