import { cookies } from 'next/headers'
import { SummaryView } from '@/components/SummaryView'
import { StatusBadge } from '@/components/StatusBadge'
import Link from 'next/link'
import { format } from 'date-fns'

const MEETINGS_URL = process.env.NEXT_PUBLIC_MEETINGS_SERVICE_URL || 'http://localhost:8081'
const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || 'http://localhost:8080'

async function getMeetings(token: string) {
  try {
    const res = await fetch(`${MEETINGS_URL}/meetings`, {
      headers: { Cookie: `meetbot_token=${token}` },
      cache: 'no-store',
    })
    if (!res.ok) return []
    return res.json()
  } catch { return [] }
}

async function getUser(token: string) {
  try {
    const res = await fetch(`${AUTH_URL}/auth/me`, {
      headers: { Cookie: `meetbot_token=${token}` },
      cache: 'no-store',
    })
    if (!res.ok) return null
    return res.json()
  } catch { return null }
}

const appleFont = "-apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif"

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('meetbot_token')?.value || ''
  const [meetings, user] = await Promise.all([getMeetings(token), getUser(token)])

  const total = meetings.length
  const done = meetings.filter((m: { status: string }) => m.status === 'done').length
  const active = meetings.filter((m: { status: string }) => ['queued', 'joining', 'in-progress'].includes(m.status))
  const recent = meetings.filter((m: { status: string }) => m.status === 'done').slice(0, 3)

  return (
    <div style={{
      padding: '32px 28px',
      maxWidth: '960px',
      fontFamily: appleFont,
    }}>

      {/* Page header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{
          color: '#ffffff',
          fontSize: '28px',
          fontWeight: 700,
          letterSpacing: '-0.02em',
          margin: '0 0 6px',
          lineHeight: 1.15,
        }}>
          Dashboard
        </h1>
        <p style={{
          color: 'rgba(235,235,245,0.4)',
          fontSize: '15px',
          margin: 0,
        }}>
          {user?.email || 'Loading…'}
        </p>
      </div>

      {/* Stats row — Apple-style rounded cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '12px',
        marginBottom: '40px',
      }}>
        {[
          { label: 'Total meetings',  value: total,         color: '#ffffff' },
          { label: 'Completed',       value: done,          color: '#30d158' },
          { label: 'Active now',      value: active.length, color: '#0a84ff' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{
            background: '#1c1c1e',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
          }}>
            <p style={{
              color: 'rgba(235,235,245,0.4)',
              fontSize: '13px',
              fontWeight: 500,
              margin: '0 0 10px',
              letterSpacing: '-0.01em',
            }}>
              {label}
            </p>
            <p style={{
              color,
              fontSize: '36px',
              fontWeight: 700,
              margin: 0,
              lineHeight: 1,
              letterSpacing: '-0.03em',
            }}>
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Active sessions */}
      {active.length > 0 && (
        <div style={{ marginBottom: '40px' }}>
          <p style={{
            color: 'rgba(235,235,245,0.3)',
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            marginBottom: '12px',
          }}>
            Active Now
          </p>
          <div style={{
            background: '#1c1c1e',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
          }}>
            {active.map((m: { id: string; title?: string; meetUrl: string; status: string }, i: number) => (
              <div
                key={m.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 16px',
                  borderBottom: i < active.length - 1 ? '1px solid #38383a' : 'none',
                  gap: '16px',
                }}
              >
                <span style={{
                  color: '#ffffff',
                  fontSize: '15px',
                  fontWeight: 500,
                  flex: 1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {m.title || 'Untitled'}
                </span>
                <span style={{
                  color: 'rgba(235,235,245,0.3)',
                  fontSize: '13px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: '220px',
                }}>
                  {m.meetUrl}
                </span>
                <StatusBadge status={m.status} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent summaries */}
      {recent.length > 0 && (
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px',
          }}>
            <p style={{
              color: 'rgba(235,235,245,0.3)',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              margin: 0,
            }}>
              Recent Summaries
            </p>
            <Link href="/meetings" style={{
              color: '#0a84ff',
              fontSize: '13px',
              fontWeight: 500,
              textDecoration: 'none',
              letterSpacing: '-0.01em',
            }}>
              All meetings →
            </Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recent.map((m: { id: string; title?: string; createdAt: string; summary?: { tldr: string; decisions: string[]; action_items: { owner: string; task: string; due: string }[]; parking_lot: string[] } }) => (
              <div
                key={m.id}
                style={{
                  background: '#1c1c1e',
                  borderRadius: '12px',
                  padding: '20px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  marginBottom: '16px',
                  gap: '12px',
                }}>
                  <span style={{
                    color: '#ffffff',
                    fontSize: '17px',
                    fontWeight: 600,
                    letterSpacing: '-0.01em',
                  }}>
                    {m.title || 'Untitled'}
                  </span>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexShrink: 0 }}>
                    <span style={{
                      color: 'rgba(235,235,245,0.3)',
                      fontSize: '13px',
                    }}>
                      {format(new Date(m.createdAt), 'dd MMM yyyy, HH:mm')}
                    </span>
                    <Link href={`/meetings/${m.id}`} style={{
                      color: '#0a84ff',
                      fontSize: '13px',
                      fontWeight: 500,
                      textDecoration: 'none',
                    }}>
                      View →
                    </Link>
                  </div>
                </div>
                {m.summary && <SummaryView summary={m.summary} />}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {total === 0 && (
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
            margin: '0 0 24px',
          }}>
            Schedule a meeting from the Calendar tab to get started.
          </p>
          <Link href="/calendar" style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '10px 20px',
            background: '#0a84ff',
            color: '#ffffff',
            fontSize: '15px',
            fontWeight: 600,
            textDecoration: 'none',
            borderRadius: '10px',
          }}>
            Go to Calendar
          </Link>
        </div>
      )}
    </div>
  )
}
