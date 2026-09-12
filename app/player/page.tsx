'use client'

import { useState, useRef } from 'react'

const appleFont = "-apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif"

export default function AudioPlayerPage() {
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const togglePlay = () => {
    if (!audioRef.current) return
    if (playing) {
      audioRef.current.pause()
      setPlaying(false)
    } else {
      audioRef.current.play()
      setPlaying(true)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000000',
      color: '#ffffff',
      fontFamily: appleFont,
      padding: '32px 20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
    }}>
      <div style={{
        maxWidth: '420px',
        width: '100%',
        background: '#1c1c1e',
        borderRadius: '20px',
        padding: '32px 24px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'rgba(10,132,255,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
          color: '#0a84ff',
          fontSize: '28px',
        }}>
          🎙️
        </div>

        <h1 style={{ fontSize: '22px', fontWeight: 700, margin: '0 0 8px', letterSpacing: '-0.02em' }}>
          MeetBot Test Audio
        </h1>
        <p style={{ color: 'rgba(235,235,245,0.5)', fontSize: '14px', margin: '0 0 24px', lineHeight: 1.4 }}>
          Play this through your speakers/mic while joined in Google Meet to test the meeting summary!
        </p>

        <audio
          ref={audioRef}
          src="/test-meeting.mp3"
          onEnded={() => setPlaying(false)}
          onPause={() => setPlaying(false)}
          onPlay={() => setPlaying(true)}
          controls
          style={{ width: '100%', marginBottom: '24px' }}
        />

        <button
          onClick={togglePlay}
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: '12px',
            background: playing ? '#ff453a' : '#0a84ff',
            color: '#ffffff',
            border: 'none',
            fontSize: '16px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'background 0.2s ease',
          }}
        >
          {playing ? '⏸ Pause Test Audio' : '▶ Play Test Meeting Audio'}
        </button>

        <div style={{ marginTop: '24px', textAlign: 'left', background: '#121214', padding: '16px', borderRadius: '12px', fontSize: '12px', color: 'rgba(235,235,245,0.6)' }}>
          <p style={{ margin: '0 0 6px', fontWeight: 600, color: '#0a84ff' }}>Voices Included:</p>
          <p style={{ margin: '0 0 4px' }}>👨 <strong>Rahul (Product Lead)</strong> — Alex (Male)</p>
          <p style={{ margin: '0 0 4px' }}>👩 <strong>Priya (Backend)</strong> — Samantha (Female)</p>
          <p style={{ margin: 0 }}>👨 <strong>Amit (DevOps)</strong> — Daniel (Male)</p>
        </div>
      </div>
    </div>
  )
}
