import { cookies } from 'next/headers'
import { StatusBadge } from '@/components/StatusBadge'
import Link from 'next/link'
import { format } from 'date-fns'

const MEETINGS_URL = process.env.NEXT_PUBLIC_MEETINGS_SERVICE_URL || 'http://localhost:8081'

const appleFont = "-apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif"

export default async function MeetingsPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('meetbot_token')?.value || ''

  let meetings: {
    id: string; title?: string; status: string
    meetUrl: string; createdAt: string
    summary?: { tldr?: string }
  }[] = []

  try {
    const res = await fetch(`${MEETINGS_URL}/meetings`, {
      headers: { Cookie: `meetbot_token=${token}` },
      cache: 'no-store',
    })
    if (res.ok) meetings = await res.json()
  } catch { /* ignore */ }

  return (
    <div style={{
      padding: '32px 28px',
      maxWidth: '960px',
      fontFamily: appleFont,
    }}>

      {/* Page header */}
      <div style={{ marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <h1 style={{
          color: '#ffffff',
          fontSize: '28px',
          fontWeight: 700,
          letterSpacing: '-0.02em',
          margin: 0,
          lineHeight: 1.15,
        }}>
          Meetings
        </h1>
        {meetings.length > 0 && (
          <span style={{
            color: 'rgba(235,235,245,0.3)',
            fontSize: '15px',
          }}>
            {meetings.length} total
          </span>
        )}
      </div>

      {meetings.length > 0 ? (
        <div style={{
          background: '#1c1c1e',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
        }}>
          {/* Column headers */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 150px 110px 60px',
            gap: '16px',
            padding: '10px 16px',
            borderBottom: '1px solid #38383a',
            background: '#2c2c2e',
          }}>
            {['Title', 'Date', 'Status', ''].map((h, i) => (
              <span key={i} style={{
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: 'rgba(235,235,245,0.3)',
              }}>
                {h}
              </span>
            ))}
          </div>

          {/* Rows */}
          {meetings.map((m, i) => (
            <div
              key={m.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 150px 110px 60px',
                gap: '16px',
                padding: '14px 16px',
                borderBottom: i < meetings.length - 1 ? '1px solid #38383a' : 'none',
                alignItems: 'center',
              }}
            >
              {/* Title + tldr */}
              <div style={{ overflow: 'hidden' }}>
                <p style={{
                  color: '#ffffff',
                  fontSize: '15px',
                  fontWeight: 500,
                  margin: 0,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  letterSpacing: '-0.01em',
                }}>
                  {m.title || 'Untitled meeting'}
                </p>
                {m.summary?.tldr && (
                  <p style={{
                    color: 'rgba(235,235,245,0.3)',
                    fontSize: '13px',
                    margin: '3px 0 0',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {m.summary.tldr.slice(0, 70)}{m.summary.tldr.length > 70 ? '…' : ''}
                  </p>
                )}
              </div>

              {/* Date */}
              <span style={{
                color: 'rgba(235,235,245,0.4)',
                fontSize: '13px',
                whiteSpace: 'nowrap',
              }}>
                {format(new Date(m.createdAt), 'dd MMM, HH:mm')}
              </span>

              {/* Status */}
              <StatusBadge status={m.status} />

              {/* View link */}
              <div>
                {m.status === 'done' && (
                  <Link href={`/meetings/${m.id}`} style={{
                    color: '#0a84ff',
                    fontSize: '13px',
                    fontWeight: 500,
                    textDecoration: 'none',
                  }}>
                    View →
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{
          padding: '60px 0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '8px',
        }}>
          <p style={{
            color: 'rgba(235,235,245,0.6)',
            fontSize: '17px',
            fontWeight: 500,
            margin: 0,
          }}>
            No meetings yet
          </p>
          <p style={{
            color: 'rgba(235,235,245,0.3)',
            fontSize: '15px',
            margin: 0,
          }}>
            Meetings will appear here after the bot summarizes them.
          </p>
        </div>
      )}
    </div>
  )
}
