
import React from 'react'

export default function TopBar({ settings, onReset, isRunning, onToggleRun, onPassTurn }) {
  return (
    <div className="flex flex-wrap gap-2 items-center justify-between">
      <div className="flex items-baseline gap-3">
        <h1 className="text-2xl font-black">Life Clock</h1>
        <div className="text-sm text-zinc-600">
          {settings.playersCount} jugadores • {settings.startingLife} vidas • {settings.minutesPerPlayer} min c/u
        </div>
      </div>
      <div className="flex gap-2">
        <button className="btn-ghost" onClick={onPassTurn}>Pasar turno</button>
        <button className="btn-primary" onClick={onToggleRun}>{isRunning ? 'Pausar' : 'Iniciar'}</button>
        <button className="btn-ghost" onClick={onReset}>Reiniciar partida</button>
      </div>
    </div>
  )
}
