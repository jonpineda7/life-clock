
import React, { useEffect, useMemo, useState } from 'react'
import TopBar from './components/TopBar.jsx'
import PlayerCard from './components/PlayerCard.jsx'
import Setup from './components/Setup.jsx'

const DEFAULT_SETTINGS = { playersCount: 2, startingLife: 40, minutesPerPlayer: 15 }
const TABLE_MODE_KEY = 'life-clock:tableMode:preferred'

function makePlayers(settings, names = []) {
  const ms = settings.minutesPerPlayer * 60_000
  return Array.from({ length: settings.playersCount }).map((_, i) => ({
    id: i + 1,
    name: names[i] ? names[i] : `Jugador ${i + 1}`,
    life: settings.startingLife,
    timeMs: ms,
    out: false
  }))
}

export default function App() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [players, setPlayers] = useState(() => makePlayers(DEFAULT_SETTINGS))
  const [activeIndex, setActiveIndex] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [inSetup, setInSetup] = useState(true)
  const [tableMode, setTableMode] = useState(false)

  // load preference
  useEffect(() => {
    if (typeof window === 'undefined') return
    const saved = window.localStorage.getItem(TABLE_MODE_KEY)
    if (saved === 'true') {
      setTableMode(true)
    }
  }, [])

  const aliveCount = players.filter(p => !p.out).length

  // tick timer
  useEffect(() => {
    if (!isRunning) return
    if (players[activeIndex]?.out) { nextTurn(); return }
    const id = setInterval(() => {
      setPlayers(prev => {
        const next = [...prev]
        const p = { ...next[activeIndex] }
        if (!p || p.out) return next
        p.timeMs = Math.max(0, p.timeMs - 1000)
        if (p.timeMs === 0) {
          p.out = true
        }
        next[activeIndex] = p
        return next
      })
    }, 1000)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, activeIndex])

  // auto-pass if current died
  useEffect(() => {
    const p = players[activeIndex]
    if (p && p.out && isRunning) {
      nextTurn()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [players])

  // auto-activate table mode on landscape IF user liked it before
  useEffect(() => {
    if (typeof window === 'undefined') return
    const saved = window.localStorage.getItem(TABLE_MODE_KEY)
    if (!saved || saved !== 'true') return

    function onResize() {
      if (window.innerWidth > window.innerHeight) {
        setTableMode(true)
      }
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  function startFromSetup(newSettings) {
    const cfg = { ...DEFAULT_SETTINGS, ...newSettings }
    setSettings(cfg)
    setPlayers(makePlayers(cfg, newSettings.names || []))
    setActiveIndex(0)
    setIsRunning(false)
    setInSetup(false)
  }

  function onLife(id, delta) {
    setPlayers(prev => prev.map(p => p.id === id ? { ...p, life: Math.max(0, p.life + delta) } : p))
  }

  function onRename(id, name) {
    setPlayers(prev => prev.map(p => p.id === id ? { ...p, name } : p))
  }

  function toggleRun() {
    if (aliveCount <= 1) return
    setIsRunning(r => !r)
  }

  function nextTurn() {
    setActiveIndex(i => {
      let idx = i
      for (let tries = 0; tries < players.length; tries++) {
        idx = (idx + 1) % players.length
        if (!players[idx].out) return idx
      }
      return i
    })
  }

  function resetMatch() {
    setPlayers(makePlayers(settings))
    setActiveIndex(0)
    setIsRunning(false)
  }

  function toggleTableMode() {
    setTableMode(v => {
      const next = !v
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(TABLE_MODE_KEY, next ? 'true' : 'false')
      }
      return next
    })
  }

  const winner = useMemo(() => {
    const alive = players.filter(p => !p.out)
    return alive.length === 1 ? alive[0] : null
  }, [players])

  if (inSetup) {
    return <Setup initial={DEFAULT_SETTINGS} onStart={startFromSetup} />
  }

  return (
    <div className="min-h-screen p-5 max-w-5xl mx-auto">
      <TopBar
        settings={settings}
        onReset={resetMatch}
        isRunning={isRunning}
        onToggleRun={toggleRun}
        onPassTurn={nextTurn}
        onToggleTableMode={toggleTableMode}
        tableMode={tableMode}
      />

      {winner && (
        <div className="my-4 p-4 rounded-2xl bg-emerald-500/20 text-emerald-50 font-semibold border border-emerald-500/30">
          🏆 {winner.name} gana la partida
        </div>
      )}

      {tableMode ? (
        <div className="table-grid mt-4">
          {players.map((p, i) => (
            <PlayerCard
              key={p.id}
              player={p}
              isActive={!p.out && i === activeIndex && isRunning}
              onLife={onLife}
              onRename={onRename}
              tableMode
              slot={i}
            />
          ))}
        </div>
      ) : (
        <div className="mt-4 grid gap-4 md:grid-cols-2 players-grid">
          {players.map((p, i) => (
            <PlayerCard
              key={p.id}
              player={p}
              isActive={!p.out && i === activeIndex && isRunning}
              onLife={onLife}
              onRename={onRename}
            />
          ))}
        </div>
      )}

      {!tableMode && (
        <div className="mt-6 grid gap-2">
          <div className="text-sm text-slate-200/80">
            Turno actual: <span className="font-semibold">{players[activeIndex]?.name}</span>
          </div>
          <div className="text-xs text-slate-200/50">
            Consejo: toca <span className="font-mono">Iniciar</span> para que comience a correr el tiempo del jugador en turno. Usa <span className="font-mono">Pasar turno</span> para pausar ese reloj y activar el siguiente.
          </div>
        </div>
      )}
    </div>
  )
}
