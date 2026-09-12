import { cookies } from 'next/headers'
import { SummaryView } from '@/components/SummaryView'
import { TimelineView } from '@/components/TimelineView'
import { StatusBadge } from '@/components/StatusBadge'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'

const MEETINGS_URL = process.env.NEXT_PUBLIC_MEETINGS_SERVICE_URL || 'http://localhost:8081'

const appleFont = "-apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif"

export default async function MeetingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const cookieStore = await cookies()
  const token = cookieStore.get('meetbot_token')?.value || ''

  const res = await fetch(`${MEETINGS_URL}/meetings/${id}`, {
    headers: { Cookie: `meetbot_token=${token}` },
    cache: 'no-store',
  })
  if (!res.ok) notFound()
  const meeting = await res.json()

  const duration = meeting.startedAt && meeting.endedAt
    ? Math.round((new Date(meeting.endedAt).getTime() - new Date(meeting.startedAt).getTime()) / 60000)
    : null

  return (
    <div style={{
      padding: '32px 28px',
      maxWidth: '840px',
      fontFamily: appleFont,
    }}>

      {/* Back navigation */}
      <Link href="/meetings" style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        color: '#0a84ff',
        fontSize: '15px',
        fontWeight: 500,
        textDecoration: 'none',
        marginBottom: '24px',
      }}>
        ← Meetings
      </Link>

      {/* Title block */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '16px',
          marginBottom: '10px',
        }}>
          <h1 style={{
            color: '#ffffff',
            fontSize: '28px',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            margin: 0,
            lineHeight: 1.15,
          }}>
            {meeting.title || 'Untitled meeting'}
          </h1>
          <StatusBadge status={meeting.status} />
        </div>
        <div style={{
          display: 'flex',
          gap: '16px',
          color: 'rgba(235,235,245,0.4)',
          fontSize: '13px',
        }}>
          <span>{format(new Date(meeting.createdAt), 'dd MMM yyyy, HH:mm')}</span>
          {duration && <span>{duration} min</span>}
        </div>
      </div>

      {/* Meet URL row */}
      <div style={{
        background: '#1c1c1e',
        borderRadius: '10px',
        padding: '12px 16px',
        marginBottom: '36px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '16px',
      }}>
        <span style={{
          color: 'rgba(235,235,245,0.4)',
          fontSize: '13px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          fontFamily: "'SF Mono', 'Menlo', 'Monaco', monospace",
        }}>
          {meeting.meetUrl}
        </span>
        <a
          href={meeting.meetUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: '#0a84ff',
            fontSize: '13px',
            fontWeight: 500,
            textDecoration: 'none',
            flexShrink: 0,
          }}
        >
          Join →
        </a>
      </div>

      {/* Summary */}
      {meeting.summary ? (
        <>
          <SummaryView summary={{
            tldr: meeting.summary.tldr || '',
            decisions: meeting.summary.decisions || [],
            action_items: meeting.summary.actionItems || [],
            parking_lot: meeting.summary.parkingLot || [],
            transcript: meeting.summary.transcript,
          }} />

          {/* Who said what timeline */}
          {meeting.summary.timeline && meeting.summary.timeline.length > 0 && (
            <div style={{ marginTop: '48px' }}>
              <p style={{
                color: 'rgba(235,235,245,0.3)',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                marginBottom: '20px',
              }}>
                Who Said What
              </p>
              <TimelineView timeline={meeting.summary.timeline} />
            </div>
          )}
        </>
      ) : (
        <div style={{
          background: '#1c1c1e',
          borderRadius: '12px',
          padding: '32px',
          textAlign: 'center',
        }}>
          <p style={{
            color: meeting.status === 'failed'
              ? '#ff453a'
              : 'rgba(235,235,245,0.4)',
            fontSize: '15px',
            margin: 0,
          }}>
            {meeting.status === 'failed'
              ? `Error: ${meeting.error || 'Unknown error'}`
              : 'Summary not available yet'}
          </p>
        </div>
      )}
    </div>
  )
}
