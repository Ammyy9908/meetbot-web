'use client'

import { useState } from 'react'
import { Search, Clock, Copy, Check, MessageSquare } from 'lucide-react'

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

const SPEAKER_COLORS = [
  { text: '#34d399', bg: 'rgba(52, 211, 153, 0.12)', border: 'rgba(52, 211, 153, 0.3)' },
  { text: '#38bdf8', bg: 'rgba(56, 189, 248, 0.12)', border: 'rgba(56, 189, 248, 0.3)' },
  { text: '#fbbf24', bg: 'rgba(251, 191, 36, 0.12)', border: 'rgba(251, 191, 36, 0.3)' },
  { text: '#a78bfa', bg: 'rgba(167, 139, 250, 0.12)', border: 'rgba(167, 139, 250, 0.3)' },
  { text: '#f472b6', bg: 'rgba(244, 114, 182, 0.12)', border: 'rgba(244, 114, 182, 0.3)' },
  { text: '#fb923c', bg: 'rgba(251, 146, 60, 0.12)', border: 'rgba(251, 146, 60, 0.3)' },
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
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSpeaker, setSelectedSpeaker] = useState<string | null>(null)
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)

  if (!timeline || !Array.isArray(timeline) || timeline.length === 0) {
    return (
      <div className="p-8 text-center bg-zinc-900 rounded-xl border border-zinc-800">
        <MessageSquare className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
        <p className="text-xs text-zinc-400">No speaker timeline dialogue recorded for this session</p>
      </div>
    )
  }

  // Group consecutive segments
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

  const allSpeakers = Array.from(new Set(grouped.map(g => g.name)))

  const filtered = grouped.filter(g => {
    const matchesSearch = searchQuery === '' || g.text.toLowerCase().includes(searchQuery.toLowerCase()) || g.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSpeaker = selectedSpeaker === null || g.name === selectedSpeaker
    return matchesSearch && matchesSpeaker
  })

  function copyQuote(text: string, idx: number) {
    navigator.clipboard.writeText(text)
    setCopiedIdx(idx)
    setTimeout(() => setCopiedIdx(null), 1500)
  }

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between pb-2 border-b border-zinc-800">
        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search dialogue keywords..."
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        {/* Speaker Chips */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          <button
            onClick={() => setSelectedSpeaker(null)}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
              selectedSpeaker === null
                ? 'bg-zinc-800 text-white border border-zinc-700'
                : 'text-zinc-400 hover:text-zinc-200 bg-zinc-900 border border-zinc-800'
            }`}
          >
            All ({grouped.length})
          </button>
          {allSpeakers.map(sp => (
            <button
              key={sp}
              onClick={() => setSelectedSpeaker(selectedSpeaker === sp ? null : sp)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                selectedSpeaker === sp
                  ? 'bg-emerald-500 text-zinc-950 font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200 bg-zinc-900 border border-zinc-800'
              }`}
            >
              {sp}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="space-y-3">
        {filtered.map((seg, i) => {
          const color = getColor(seg.speakerIndex)
          return (
            <div
              key={i}
              className="flex items-start gap-3.5 p-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-750 transition-all group"
            >
              {/* Speaker Avatar */}
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5"
                style={{
                  color: color.text,
                  backgroundColor: color.bg,
                  border: `1px solid ${color.border}`,
                }}
              >
                {getInitials(seg.name)}
              </div>

              {/* Message Block */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold" style={{ color: color.text }}>
                      {seg.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-zinc-500 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-zinc-600" />
                      {formatTime(seg.startTime)} – {formatTime(seg.endTime)}
                    </span>
                    <button
                      onClick={() => copyQuote(seg.text, i)}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-all"
                      title="Copy quote"
                    >
                      {copiedIdx === i ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal">
                  {seg.text}
                </p>
              </div>
            </div>
          )
        })}

        {filtered.length === 0 && (
          <div className="text-center py-8 text-xs text-zinc-500">
            No dialogue matching "{searchQuery}"
          </div>
        )}
      </div>
    </div>
  )
}
