import React, { useEffect, useMemo, useRef, useState } from 'react'
import TopBar from './components/TopBar.jsx'
import PlayerCard from './components/PlayerCard.jsx'
import Setup from './components/Setup.jsx'
import { msToClock } from './utils/time.js'

const DEFAULT_SETTINGS = { playersCount: 2, startingLife: 40, minutesPerPlayer: 15 }
const COLORS = [
  'linear-gradient(145deg, #0a0a0a 0%, #4c1d95 100%)', // Swamp
  'linear-gradient(145deg, #0284c7 0%, #38bdf8 100%)', // Island
  'linear-gradient(145deg, #dc2626 0%, #f87171 100%)', // Mountain
  'linear-gradient(145deg, #16a34a 0%, #86efac 100%)', // Forest
  'linear-gradient(145deg, #eab308 0%, #fde68a 100%)'  // Plains
]

function makePlayers(settings, names = [], colors = []) {
  const ms = settings.minutesPerPlayer * 60_000
  return Array.from({ length: settings.playersCount }).map((_, i) => ({
    id: i + 1,
    name: names[i] ? names[i] : `Jugador ${i + 1}`,
    life: settings.startingLife,
    timeMs: ms,
    out: false,
    color: colors[i] ? colors[i] : COLORS[i % COLORS.length],
  }))
}).map((_, i) => ({
    id: i + 1,
    name: names[i] ? names[i] : `Jugador ${i + 1}`,
    life: settings.startingLife,
    timeMs: ms,
    out: false,
    color: colors[i] ? colors[i] : COLORS[i % COLORS.length],
  }))
}

export default function App() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [players, setPlayers] = useState(() => makePlayers(DEFAULT_SETTINGS))
  const [activeIndex, setActiveIndex] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [inSetup, setInSetup] = useState(true)
  const [tableMode, setTableMode] = useState(false)
  const wakeLockRef = useRef(null)

  const aliveCount = players.filter(p => !p.out).length

  // Tick timer for active player
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

  // Auto-pass if someone just ran out of time
  useEffect(() => {
    const p = players[activeIndex]
    if (p && p.out && isRunning) {
      nextTurn()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [players])

  function startFromSetup(newSettings) {
  const cfg = { ...DEFAULT_SETTINGS, ...newSettings }
  setSettings(cfg)
  const created = makePlayers(cfg, newSettings.names || [], newSettings.colors || [])
  setPlayers(created)
  const alive = created.map((p, i) => (!p.out ? i : -1)).filter((i) => i !== -1)
  const starter = alive[Math.floor(Math.random() * alive.length)]
  setActiveIndex(starter)
  setIsRunning(false)
  setInSetup(false)
}
    setSettings(cfg)
    setPlayers(makePlayers(cfg, newSettings.names || [], newSettings.colors || []))
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

  \1
function chooseRandomStarter() {
  const aliveIndexes = players
    .map((p, idx) => (!p.out ? idx : -1))
    .filter((idx) => idx !== -1)

  if (aliveIndexes.length === 0) return

  const randomIdx = aliveIndexes[Math.floor(Math.random() * aliveIndexes.length)]
  setActiveIndex(randomIdx)
  setIsRunning(false)
}
      return i
    })
  }

  function resetMatch() {
  setPlayers(makePlayers(
    settings,
    players.map(p => p.name),
    players.map(p => p.color)
  ))
  setActiveIndex(0)
  setIsRunning(false)
}

  function toggleTableMode() {
    setTableMode(t => !t)
  }

  const winner = useMemo(() => {
    const alive = players.filter(p => !p.out)
    return alive.length === 1 ? alive[0] : null
  }, [players])

  if (inSetup) {
    return <Setup initial={DEFAULT_SETTINGS} onStart={startFromSetup} />
  }

  return (
    <div className={tableMode ? 'min-h-screen p-0 m-0' : 'min-h-screen p-5 max-w-5xl mx-auto'}>
      <h1 className="text-center text-3xl font-bold text-slate-100 mb-4">Life Clock</h1>
      <TopBar
      settings={settings}
      onReset={resetMatch}
      isRunning={isRunning}
      onToggleRun={toggleRun}
      onPassTurn={nextTurn}
      onToggleTableMode={toggleTableMode}
      tableMode={tableMode}
      onRandomStart={chooseRandomStarter}
    />

      {winner && (
        <div className="my-4 p-4 rounded-2xl bg-emerald-500/20 text-emerald-50 font-semibold border border-emerald-500/30">
          🏆 {winner.name} gana la partida
        </div>
      )}

      {tableMode ? (
        <div className="table-grid mt-0">
          {players.map((p, i) => (
            <div key={p.id} style={{ backgroundColor: p.color, borderRadius: '1rem' }}>
              <PlayerCard
                player={p}
                isActive={!p.out && i === activeIndex && isRunning}
                onLife={onLife}
                onRename={onRename}
                color={p.color}
                tableMode
                slot={i}
              />
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="mt-4 grid gap-4 md:grid-cols-2 players-grid">
            {players.map((p, i) => (
              <div key={p.id} style={{ backgroundColor: p.color, borderRadius: '1rem' }}>
                <PlayerCard
                  player={p}
                  isActive={!p.out && i === activeIndex && isRunning}
                  onLife={onLife}
                  onRename={onRename}
                  color={p.color}
                />
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-2">
            <div className="text-sm text-slate-200/80">
              Turno actual: <span className="font-semibold">{players[activeIndex]?.name}</span>
            </div>
            <div className="text-xs text-slate-200/50">
              Consejo: toca <span className="font-mono">Iniciar</span> para que comience a correr el tiempo del jugador en turno. Usa{' '}
              <span className="font-mono">Pasar turno</span> para pausar ese reloj y activar el siguiente.
            </div>
          </div>
        </>
      )}
    </div>
  )
}

  useEffect(() => {
    async function enableWakeLock() {
      try {
        if ('wakeLock' in navigator) {
          wakeLockRef.current = await navigator.wakeLock.request('screen')
        }
      } catch (err) {
        console.error('WakeLock error', err)
      }
    }
    async function disableWakeLock() {
      try {
        if (wakeLockRef.current) {
          await wakeLockRef.current.release()
          wakeLockRef.current = null
        }
      } catch (err) {}
    }

    if (tableMode) enableWakeLock(); else disableWakeLock()
    return () => { disableWakeLock() }
  }, [tableMode])
