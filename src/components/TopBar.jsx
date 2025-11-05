import React from 'react'

export default function TopBar({ settings, onReset, isRunning, onToggleRun, onPassTurn, onToggleTableMode, tableMode, onRandomStart }) {
  return (
    <div className="mtg-topbar rounded-2xl px-4 py-3 mb-4 flex flex-wrap gap-2 items-center justify-between sm:flex-row flex-col">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-400 to-amber-200 flex items-center justify-center text-slate-950 font-black text-sm shadow">
          MTG
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tight">Life Clock</h1>
          <p className="text-xs text-slate-200/70">
            {settings.playersCount} jugadores • {settings.startingLife} vidas • {settings.minutesPerPlayer} min
          </p>
          <div className="flex items-center gap-2 mt-1 text-xs text-slate-200/70">
            <span className={`inline-block h-2.5 w-2.5 rounded-full ${tableMode ? 'bg-green-400' : 'bg-slate-400'}`}></span>
            <span>{tableMode ? 'Pantalla activa' : 'Pantalla libre'}</span>
          </div>
        </div>
      </div>
      <div className="flex gap-2 flex-wrap">
        <button className="btn-ghost" onClick={onPassTurn}>Pasar turno</button>
        <button className="btn-primary" onClick={onToggleRun}>{isRunning ? 'Pausar' : 'Iniciar'}</button>
        <button className="btn-ghost" onClick={onReset}>Reiniciar</button>
        {onRandomStart && (
          <button className="btn-ghost" onClick={onRandomStart}>Elegir inicial</button>
        )}
        {onToggleTableMode && (
          <button
            className={tableMode ? 'btn-primary' : 'btn-ghost'}
            onClick={onToggleTableMode}
          >
            Modo mesa
          </button>
        )}
      </div>
    </div>
  )
}
