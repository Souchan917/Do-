import { useState, useEffect } from 'react'
import './App.css'
import AudioController from './components/AudioController'

function App() {
  const [displayText, setDisplayText] = useState('')
  const [isGlitching, setIsGlitching] = useState(false)
  const [currentPhase, setCurrentPhase] = useState(0)
  
  const phases = [
    "SYSTEM_INITIALIZING...",
    "NEURAL_NETWORK_ONLINE",
    "QUANTUM_ENCRYPTION_ENABLED", 
    "MYSTERY_PROTOCOL_ACTIVATED",
    "謎解きシステム起動完了"
  ]

  useEffect(() => {
    const typeText = (text: string, callback?: () => void) => {
      setDisplayText('')
      let index = 0
      const interval = setInterval(() => {
        if (index < text.length) {
          setDisplayText(text.substring(0, index + 1))
          index++
        } else {
          clearInterval(interval)
          if (callback) callback()
        }
      }, 80)
    }

    const nextPhase = () => {
      if (currentPhase < phases.length) {
        typeText(phases[currentPhase], () => {
          setTimeout(() => {
            setCurrentPhase(prev => prev + 1)
          }, 1500)
        })
      }
    }

    nextPhase()
  }, [currentPhase])

  const triggerGlitch = () => {
    setIsGlitching(true)
    setTimeout(() => setIsGlitching(false), 500)
  }

  return (
    <div className="app-container">
      {/* Background Effects */}
      <div className="background-grid"></div>
      <div className="particles">
        {[...Array(50)].map((_, i) => (
          <div key={i} className="particle" style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${3 + Math.random() * 4}s`
          }}></div>
        ))}
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="terminal-header">
          <div className="terminal-controls">
            <span className="control close"></span>
            <span className="control minimize"></span>
            <span className="control maximize"></span>
          </div>
          <div className="terminal-title">MYSTERY_SOLVER.EXE</div>
        </div>

        <div className="terminal-body">
          <div className="title-container">
            <h1 className={`cyber-title ${isGlitching ? 'glitch' : ''}`}>
              <span className="title-text" data-text="ENIGMA PROTOCOL">
                ENIGMA PROTOCOL
              </span>
            </h1>
            <div className="subtitle">Neural Puzzle Interface v2.1</div>
          </div>

          <div className="status-display">
            <div className="status-line">
              <span className="prompt">$&gt;</span>
              <span className="typing-text">{displayText}</span>
              <span className="cursor">_</span>
            </div>
          </div>

          <div className="action-grid">
            <div className="action-card" onClick={triggerGlitch}>
              <div className="card-header">
                <div className="card-icon">🧩</div>
                <div className="card-title">PUZZLE MODE</div>
              </div>
              <div className="card-description">
                謎を解き明かせ
              </div>
              <div className="hologram-effect"></div>
            </div>

            <div className="action-card">
              <div className="card-header">
                <div className="card-icon">🔍</div>
                <div className="card-title">INVESTIGATION</div>
              </div>
              <div className="card-description">
                手がかりを探せ
              </div>
              <div className="hologram-effect"></div>
            </div>

            <div className="action-card">
              <div className="card-header">
                <div className="card-icon">⚡</div>
                <div className="card-title">QUANTUM LEAP</div>
              </div>
              <div className="card-description">
                次元を超越せよ
              </div>
              <div className="hologram-effect"></div>
            </div>
          </div>

          <div className="neural-visualization">
            <div className="neural-network">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="neural-node" style={{
                  left: `${20 + Math.random() * 60}%`,
                  top: `${20 + Math.random() * 60}%`,
                  animationDelay: `${Math.random() * 3}s`
                }}></div>
              ))}
              {[...Array(20)].map((_, i) => (
                <div key={i} className="neural-connection" style={{
                  transform: `rotate(${Math.random() * 360}deg)`,
                  left: `${Math.random() * 80}%`,
                  top: `${Math.random() * 80}%`,
                  animationDelay: `${Math.random() * 2}s`
                }}></div>
              ))}
            </div>
          </div>

          <AudioController 
            audioFiles={[
              './audio/mystery-theme.mp3',
              './audio/ambient-puzzle.mp3'
            ]}
            className="mystery-audio"
          />

          <div className="system-info">
            <div className="info-bar">
              <span className="info-item">
                <span className="label">CPU:</span>
                <span className="value">QUANTUM_CORE_ACTIVE</span>
              </span>
              <span className="info-item">
                <span className="label">MEM:</span>
                <span className="value">∞ GB NEURAL_RAM</span>
              </span>
              <span className="info-item">
                <span className="label">STATUS:</span>
                <span className="value status-ready">READY</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
