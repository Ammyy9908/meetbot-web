interface TimelineSegment {
  speaker?: number | string
  speakerId?: string
  speaker_id?: string
  speakerName?: string
  participantName?: string | null
  participant_name?: string | null
  text?: string
  startTime?: number
  start_time?: number
  start?: number
  endTime?: number
  end_time?: number
  end?: number
}

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '00:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

// Consistent color per speaker index
const SPEAKER_COLORS = [
  { text: '#0a84ff', bg: 'rgba(10,132,255,0.12)' },
  { text: '#30d158', bg: 'rgba(48,209,88,0.12)' },
  { text: '#ffd60a', bg: 'rgba(255,214,10,0.12)' },
  { text: '#ff9f0a', bg: 'rgba(255,159,10,0.12)' },
  { text: '#bf5af2', bg: 'rgba(191,90,242,0.12)' },
  { text: '#ff453a', bg: 'rgba(255,69,58,0.12)' },
]

function getSpeakerIndex(seg: TimelineSegment, fallbackIndex: number): number {
  if (typeof seg.speaker === 'number' && !isNaN(seg.speaker)) {
    return Math.abs(seg.speaker)
  }
  const idStr = String(seg.speakerId || seg.speaker_id || seg.speaker || '')
  const match = idStr.match(/\d+/)
  if (match) {
    const parsed = parseInt(match[0], 10)
    if (!isNaN(parsed)) return parsed
  }
  return fallbackIndex
}

function getColor(speakerIndex: number) {
  const safeIdx = typeof speakerIndex === 'number' && !isNaN(speakerIndex) ? Math.abs(speakerIndex) : 0
  return SPEAKER_COLORS[safeIdx % SPEAKER_COLORS.length] || SPEAKER_COLORS[0]
}

function getDisplayName(seg: TimelineSegment): string {
  if (seg.participantName) return seg.participantName
  if (seg.participant_name) return seg.participant_name
  if (seg.speakerName) return seg.speakerName
  if (seg.speakerId) return seg.speakerId.replace('_', ' ')
  if (seg.speaker_id) return seg.speaker_id.replace('_', ' ')
  if (seg.speaker !== undefined && seg.speaker !== null) return `Speaker ${seg.speaker}`
  return 'Speaker'
}

function getInitials(name: string): string {
  if (!name || typeof name !== 'string') return 'SP'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 0 || !parts[0]) return 'SP'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function getStartTime(seg: TimelineSegment): number {
  return Number(seg.startTime ?? seg.start_time ?? seg.start ?? 0)
}

function getEndTime(seg: TimelineSegment): number {
  return Number(seg.endTime ?? seg.end_time ?? seg.end ?? getStartTime(seg) + 1)
}

export function TimelineView({ timeline }: { timeline: TimelineSegment[] }) {
  if (!timeline || !Array.isArray(timeline) || timeline.length === 0) {
    return (
      <p style={{ color: 'rgba(235,235,245,0.3)', fontSize: '14px', fontStyle: 'italic' }}>
        No timeline data available
      </p>
    )
  }

  // Group consecutive segments by same speaker for cleaner display
  const grouped: Array<{
    name: string
    speakerIndex: number
    text: string
    startTime: number
    endTime: number
  }> = []

  for (let i = 0; i < timeline.length; i++) {
    const seg = timeline[i]
    if (!seg || typeof seg !== 'object') continue

    const name = getDisplayName(seg)
    const speakerIndex = getSpeakerIndex(seg, i)
    const text = String(seg.text || '').trim()
    const startTime = getStartTime(seg)
    const endTime = getEndTime(seg)

    if (!text) continue

    const last = grouped[grouped.length - 1]
    if (last && last.name === name && startTime - last.endTime < 3) {
      last.text += ' ' + text
      last.endTime = Math.max(last.endTime, endTime)
    } else {
      grouped.push({
        name,
        speakerIndex,
        text,
        startTime,
        endTime,
      })
    }
  }

  if (grouped.length === 0) {
    return (
      <p style={{ color: 'rgba(235,235,245,0.3)', fontSize: '14px', fontStyle: 'italic' }}>
        No timeline dialogue recorded
      </p>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {grouped.map((seg, i) => {
        const color = getColor(seg.speakerIndex)

        return (
          <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            {/* Timestamp */}
            <span style={{
              fontFamily: "'SF Mono', 'Menlo', monospace",
              fontSize: '11px',
              color: 'rgba(235,235,245,0.3)',
              paddingTop: '8px',
              flexShrink: 0,
              width: '40px',
              textAlign: 'right',
            }}>
              {formatTime(seg.startTime)}
            </span>

            {/* Avatar */}
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: color.bg,
              border: `1px solid ${color.text}44`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              marginTop: '4px',
            }}>
              <span style={{ fontSize: '10px', fontWeight: 700, color: color.text }}>
                {getInitials(seg.name)}
              </span>
            </div>

            {/* Bubble */}
            <div style={{
              background: '#1c1c1e',
              borderRadius: '12px',
              borderTopLeftRadius: '4px',
              padding: '10px 14px',
              flex: 1,
              border: '1px solid rgba(255,255,255,0.05)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: color.text }}>
                  {seg.name}
                </span>
                <span style={{
                  fontFamily: "'SF Mono', 'Menlo', monospace",
                  fontSize: '11px',
                  color: 'rgba(235,235,245,0.25)',
                }}>
                  {formatTime(seg.startTime)} – {formatTime(seg.endTime)}
                </span>
              </div>
              <p style={{ color: 'rgba(235,235,245,0.85)', fontSize: '14px', lineHeight: 1.5, margin: 0 }}>
                {seg.text}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

