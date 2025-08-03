import { useState, useEffect, useRef } from 'react'
import { Howl } from 'howler'
import './AudioController.css'

interface AudioControllerProps {
  audioFiles?: string[]
  className?: string
}

interface AudioState {
  isPlaying: boolean
  volume: number
  rate: number
  pitch: number
  loop: boolean
  currentTrack: number
  duration: number
  currentTime: number
}

export default function AudioController({ 
  audioFiles = [
    './audio/background.mp3',
    './audio/ambient.mp3',
    './audio/mystery.mp3'
  ],
  className = ''
}: AudioControllerProps) {
  const [audioState, setAudioState] = useState<AudioState>({
    isPlaying: false,
    volume: 0.7,
    rate: 1.0,
    pitch: 1.0,
    loop: true,
    currentTrack: 0,
    duration: 0,
    currentTime: 0
  })

  const soundRef = useRef<Howl | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // 音楽ファイル読み込み
  const loadTrack = (trackIndex: number) => {
    if (soundRef.current) {
      soundRef.current.stop()
      soundRef.current.unload()
    }

    if (audioFiles[trackIndex]) {
      console.log('Loading track:', audioFiles[trackIndex])
      const sound = new Howl({
        src: [audioFiles[trackIndex]],
        loop: audioState.loop,
        volume: audioState.volume,
        rate: audioState.rate,
        format: ['mp3', 'ogg', 'wav'],
        html5: true,
        onload: () => {
          console.log('Track loaded successfully')
          setAudioState(prev => ({ ...prev, duration: sound.duration() || 0 }))
        },
        onloaderror: (id, error) => {
          console.error('Error loading audio file:', error)
          console.error('File path:', audioFiles[trackIndex])
          // ファイルが見つからない場合、状態をリセット
          setAudioState(prev => ({ 
            ...prev, 
            isPlaying: false, 
            duration: 0, 
            currentTime: 0 
          }))
        },
        onplay: () => {
          setAudioState(prev => ({ ...prev, isPlaying: true }))
          startTimeUpdate()
        },
        onpause: () => {
          setAudioState(prev => ({ ...prev, isPlaying: false }))
          stopTimeUpdate()
        },
        onstop: () => {
          setAudioState(prev => ({ ...prev, isPlaying: false, currentTime: 0 }))
          stopTimeUpdate()
        },
        onend: () => {
          if (!audioState.loop) {
            setAudioState(prev => ({ ...prev, isPlaying: false, currentTime: 0 }))
            stopTimeUpdate()
          }
        },
        onplayerror: (id, error) => {
          console.error('Error playing audio:', error)
        }
      })

      soundRef.current = sound
    }
  }

  // 時間更新
  const startTimeUpdate = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      if (soundRef.current && soundRef.current.playing()) {
        setAudioState(prev => ({ 
          ...prev, 
          currentTime: soundRef.current?.seek() || 0 
        }))
      }
    }, 100)
  }

  const stopTimeUpdate = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  // 初期読み込み
  useEffect(() => {
    loadTrack(audioState.currentTrack)
    return () => {
      if (soundRef.current) {
        soundRef.current.unload()
      }
      stopTimeUpdate()
    }
  }, [])

  // 再生/停止
  const togglePlay = () => {
    if (soundRef.current) {
      if (audioState.isPlaying) {
        soundRef.current.pause()
      } else {
        soundRef.current.play()
      }
    }
  }

  // 音量調整
  const setVolume = (volume: number) => {
    setAudioState(prev => ({ ...prev, volume }))
    if (soundRef.current) {
      soundRef.current.volume(volume)
    }
  }

  // 再生速度調整
  const setRate = (rate: number) => {
    setAudioState(prev => ({ ...prev, rate }))
    if (soundRef.current) {
      soundRef.current.rate(rate)
    }
  }

  // ピッチ調整（レートを使用してピッチ効果を模倣）
  const setPitch = (pitch: number) => {
    setAudioState(prev => ({ ...prev, pitch }))
    if (soundRef.current) {
      // howlerでは直接的なピッチ制御がないため、rateで代用
      const newRate = audioState.rate * pitch
      soundRef.current.rate(newRate)
    }
  }

  // ループ切り替え
  const toggleLoop = () => {
    const newLoop = !audioState.loop
    setAudioState(prev => ({ ...prev, loop: newLoop }))
    if (soundRef.current) {
      soundRef.current.loop(newLoop)
    }
  }

  // トラック変更
  const changeTrack = (trackIndex: number) => {
    if (trackIndex !== audioState.currentTrack && trackIndex < audioFiles.length) {
      setAudioState(prev => ({ ...prev, currentTrack: trackIndex }))
      loadTrack(trackIndex)
    }
  }

  // シーク
  const seekTo = (position: number) => {
    if (soundRef.current && audioState.duration > 0) {
      const seekTime = (position / 100) * audioState.duration
      soundRef.current.seek(seekTime)
      setAudioState(prev => ({ ...prev, currentTime: seekTime }))
    }
  }

  // 時間フォーマット
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className={`audio-controller ${className}`}>
      <div className="audio-header">
        <div className="audio-title">🎵 NEURAL AUDIO SYSTEM</div>
        <div className="audio-status">
          <span className="status-indicator">
            {audioState.isPlaying ? '▶️ PLAYING' : '⏸️ PAUSED'}
          </span>
        </div>
      </div>

      <div className="audio-body">
        {/* トラック選択 */}
        <div className="track-selector">
          <label>TRACK SELECT:</label>
          <div className="track-buttons">
            {audioFiles.map((_, index) => (
              <button 
                key={index}
                className={`track-btn ${index === audioState.currentTrack ? 'active' : ''}`}
                onClick={() => changeTrack(index)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>

        {/* 再生コントロール */}
        <div className="playback-controls">
          <button className="control-btn play-btn" onClick={togglePlay}>
            {audioState.isPlaying ? '⏸️' : '▶️'}
          </button>
          <button 
            className={`control-btn loop-btn ${audioState.loop ? 'active' : ''}`}
            onClick={toggleLoop}
          >
            🔁
          </button>
        </div>

        {/* プログレスバー */}
        <div className="progress-section">
          <div className="time-display">
            <span>{formatTime(audioState.currentTime)}</span>
            <span>{formatTime(audioState.duration)}</span>
          </div>
          <div className="progress-bar">
            <input
              type="range"
              min="0"
              max="100"
              value={audioState.duration > 0 ? (audioState.currentTime / audioState.duration) * 100 : 0}
              onChange={(e) => seekTo(Number(e.target.value))}
              className="progress-slider"
            />
          </div>
        </div>

        {/* オーディオコントロール */}
        <div className="audio-controls">
          <div className="control-group">
            <label>VOLUME: {Math.round(audioState.volume * 100)}%</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={audioState.volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="control-slider"
            />
          </div>

          <div className="control-group">
            <label>SPEED: {audioState.rate.toFixed(2)}x</label>
            <input
              type="range"
              min="0.25"
              max="4.0"
              step="0.25"
              value={audioState.rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="control-slider"
            />
          </div>

          <div className="control-group">
            <label>PITCH: {audioState.pitch.toFixed(2)}x</label>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={audioState.pitch}
              onChange={(e) => setPitch(Number(e.target.value))}
              className="control-slider"
            />
          </div>
        </div>

        {/* 波形ビジュアライザー（装飾） */}
        <div className="visualizer">
          <div className="visualizer-bars">
            {[...Array(32)].map((_, i) => (
              <div 
                key={i} 
                className={`bar ${audioState.isPlaying ? 'active' : ''}`}
                style={{
                  animationDelay: `${i * 0.1}s`,
                  height: `${Math.random() * 60 + 20}%`
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}