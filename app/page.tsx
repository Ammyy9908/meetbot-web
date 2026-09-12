'use client'

export default function LandingPage() {
  const authUrl = process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || 'http://localhost:8080'

  return (
    <div
      className="min-h-[100dvh] flex flex-col"
      style={{
        background: '#000000',
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Display', system-ui, sans-serif",
      }}
    >
      {/* Top nav bar */}
      <header style={{
        borderBottom: '1px solid #38383a',
        padding: '14px 28px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span style={{
          color: '#ffffff',
          fontWeight: 700,
          fontSize: '17px',
          letterSpacing: '-0.02em',
        }}>
          MeetBot
        </span>
        <span style={{ color: 'rgba(235,235,245,0.3)', fontSize: '13px' }}>v1.0</span>
      </header>

      {/* Hero */}
      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 24px 48px',
        textAlign: 'center',
      }}>
        {/* Eyebrow label */}
        <p style={{
          color: '#0a84ff',
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: '20px',
        }}>
          Meeting Intelligence
        </p>

        <h1 style={{
          color: '#ffffff',
          fontSize: 'clamp(40px, 8vw, 72px)',
          fontWeight: 700,
          lineHeight: 1.05,
          letterSpacing: '-0.03em',
          marginBottom: '24px',
          maxWidth: '700px',
        }}>
          Stop wasting your meetings.
        </h1>

        <p style={{
          color: 'rgba(235,235,245,0.6)',
          fontSize: '17px',
          lineHeight: 1.6,
          marginBottom: '48px',
          maxWidth: '480px',
        }}>
          MeetBot joins your Google Meet, transcribes everything, and delivers structured summaries with decisions and action items — straight to your inbox.
        </p>

        {/* CTA */}
        <a
          href={`${authUrl}/auth/google`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            padding: '14px 28px',
            background: '#0a84ff',
            color: '#ffffff',
            fontSize: '15px',
            fontWeight: 600,
            letterSpacing: '-0.01em',
            textDecoration: 'none',
            borderRadius: '10px',
            transition: 'opacity 0.15s ease',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.85' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1' }}
        >
          {/* Google "G" mark */}
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="rgba(255,255,255,0.9)"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="rgba(255,255,255,0.9)"/>
            <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="rgba(255,255,255,0.9)"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="rgba(255,255,255,0.9)"/>
          </svg>
          Sign in with Google
        </a>

        <p style={{
          color: 'rgba(235,235,245,0.3)',
          fontSize: '13px',
          marginTop: '16px',
        }}>
          Calendar access required for auto-join
        </p>

        {/* Feature cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '12px',
          marginTop: '80px',
          width: '100%',
          maxWidth: '680px',
        }}>
          {[
            {
              title: 'Auto-Join',
              desc: 'Bot joins from Google Calendar. No links, no copy-paste.',
            },
            {
              title: 'Transcribe',
              desc: 'Optimized for Indian English with Deepgram nova-3.',
            },
            {
              title: 'Summarize',
              desc: 'TL;DR, decisions, and action items sent to your inbox.',
            },
          ].map(({ title, desc }) => (
            <div
              key={title}
              style={{
                background: '#1c1c1e',
                borderRadius: '12px',
                padding: '20px',
                textAlign: 'left',
              }}
            >
              <p style={{
                color: '#ffffff',
                fontSize: '15px',
                fontWeight: 600,
                letterSpacing: '-0.01em',
                marginBottom: '6px',
              }}>
                {title}
              </p>
              <p style={{
                color: 'rgba(235,235,245,0.6)',
                fontSize: '13px',
                lineHeight: 1.5,
                margin: 0,
              }}>
                {desc}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
