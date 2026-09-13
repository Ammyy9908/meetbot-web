'use client'

import { useState } from 'react'
import { SummaryView } from '@/components/SummaryView'
import { TimelineView } from '@/components/TimelineView'
import { StatusBadge } from '@/components/StatusBadge'
import Link from 'next/link'
import { format } from 'date-fns'
import { 
  ArrowLeft, 
  ExternalLink, 
  Sparkles, 
  Clock, 
  Calendar, 
  Copy, 
  Check, 
  Share2, 
  Layers, 
  FileText, 
  MessageSquare,
  Radio
} from 'lucide-react'

interface MeetingData {
  id: string
  title?: string
  status: string
  meetUrl: string
  createdAt: string
  startedAt?: string
  endedAt?: string
  error?: string
  summary?: {
    tldr?: string
    decisions?: string[]
    actionItems?: any[]
    action_items?: any[]
    parkingLot?: string[]
    parking_lot?: string[]
    key_discussion_points?: string[]
    timeline?: any[]
    transcript?: string
  }
}

export function MeetingDetailClient({ meeting }: { meeting: MeetingData }) {
  const [activeTab, setActiveTab] = useState<'summary' | 'timeline' | 'transcript'>('summary')
  const [copiedAll, setCopiedAll] = useState(false)

  const isZoom = meeting.meetUrl?.includes('zoom.us')
  const duration = meeting.startedAt && meeting.endedAt
    ? Math.round((new Date(meeting.endedAt).getTime() - new Date(meeting.startedAt).getTime()) / 60000)
    : null

  const summary = meeting.summary

  function exportFullMarkdown() {
    if (!summary) return
    const actionItems = summary.action_items || summary.actionItems || []
    const decisions = summary.decisions || []
    const points = summary.key_discussion_points || []

    let md = `# ${meeting.title || 'Meeting Summary'}\n`
    md += `**Date**: ${format(new Date(meeting.createdAt), 'dd MMMM yyyy, HH:mm')}\n`
    md += `**Platform**: ${isZoom ? 'Zoom' : 'Google Meet'}\n`
    md += `**Link**: ${meeting.meetUrl}\n\n`

    if (summary.tldr) {
      md += `## Executive Summary\n${summary.tldr}\n\n`
    }

    if (decisions.length > 0) {
      md += `## Key Decisions\n`
      decisions.forEach((d, i) => { md += `${i + 1}. ${d}\n` })
      md += `\n`
    }

    if (actionItems.length > 0) {
      md += `## Action Items\n`
      actionItems.forEach(item => {
        md += `- **[${item.owner || 'Unassigned'}]** ${item.task} (Due: ${item.due || 'ASAP'})\n`
      })
      md += `\n`
    }

    if (points.length > 0) {
      md += `## Discussion Points\n`
      points.forEach(p => { md += `- ${p}\n` })
      md += `\n`
    }

    if (summary.transcript) {
      md += `## Raw Transcript\n\`\`\`\n${summary.transcript}\n\`\`\`\n`
    }

    navigator.clipboard.writeText(md)
    setCopiedAll(true)
    setTimeout(() => setCopiedAll(false), 2000)
  }

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
      
      {/* Back Navigation & Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/meetings"
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Meetings</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={exportFullMarkdown}
            disabled={!summary}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-zinc-200 transition-all disabled:opacity-50"
          >
            {copiedAll ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Notes Copied (Markdown)</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-zinc-400" />
                <span>Export Markdown</span>
              </>
            )}
          </button>

          <a
            href={meeting.meetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Join Provider</span>
          </a>
        </div>
      </div>

      {/* Main Title & Metadata Card */}
      <div className="p-6 rounded-2xl border border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2.5 mb-2">
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {meeting.title || 'Untitled Meeting'}
              </h1>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                isZoom
                  ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                  : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              }`}>
                {isZoom ? 'Zoom' : 'Google Meet'}
              </span>
              <StatusBadge status={meeting.status} />
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400">
              <span className="flex items-center gap-1.5 font-mono">
                <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                {format(new Date(meeting.createdAt), 'dd MMMM yyyy · HH:mm')}
              </span>
              {duration && (
                <span className="flex items-center gap-1.5 font-mono">
                  <Clock className="w-3.5 h-3.5 text-zinc-500" />
                  {duration} minutes duration
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Meeting Link Bar */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/80 border border-zinc-800/60 font-mono text-xs text-zinc-400">
          <span className="truncate max-w-lg">{meeting.meetUrl}</span>
          <span className="text-[11px] text-zinc-500 hidden sm:inline">Encrypted recording node</span>
        </div>
      </div>

      {/* Tabs Navigation */}
      {summary ? (
        <div className="space-y-6">
          <div className="flex border-b border-zinc-800">
            <button
              onClick={() => setActiveTab('summary')}
              className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all ${
                activeTab === 'summary'
                  ? 'border-blue-500 text-blue-400 bg-blue-500/5'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>AI Executive Summary</span>
            </button>

            {summary.timeline && summary.timeline.length > 0 && (
              <button
                onClick={() => setActiveTab('timeline')}
                className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all ${
                  activeTab === 'timeline'
                    ? 'border-blue-500 text-blue-400 bg-blue-500/5'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Speaker Diarization</span>
                <span className="px-1.5 py-0.2 rounded-full bg-zinc-800 text-[10px] text-zinc-300">
                  {summary.timeline.length}
                </span>
              </button>
            )}

            {summary.transcript && (
              <button
                onClick={() => setActiveTab('transcript')}
                className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all ${
                  activeTab === 'transcript'
                    ? 'border-blue-500 text-blue-400 bg-blue-500/5'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Raw Transcript</span>
              </button>
            )}
          </div>

          {/* Tab 1: AI Summary */}
          {activeTab === 'summary' && (
            <div className="p-6 rounded-2xl border border-zinc-800/80 bg-zinc-950/60 shadow-lg">
              <SummaryView summary={{
                tldr: summary.tldr || '',
                decisions: summary.decisions || [],
                action_items: summary.action_items || summary.actionItems || [],
                parking_lot: summary.parking_lot || summary.parkingLot || [],
                key_discussion_points: summary.key_discussion_points || [],
                transcript: summary.transcript,
              }} />
            </div>
          )}

          {/* Tab 2: Timeline View */}
          {activeTab === 'timeline' && summary.timeline && (
            <div className="p-6 rounded-2xl border border-zinc-800/80 bg-zinc-950/60 shadow-lg">
              <TimelineView timeline={summary.timeline} />
            </div>
          )}

          {/* Tab 3: Raw Transcript */}
          {activeTab === 'transcript' && summary.transcript && (
            <div className="p-6 rounded-2xl border border-zinc-800/80 bg-zinc-950/60 shadow-lg space-y-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Full Meeting Audio Transcription
                </span>
                <span className="text-xs text-zinc-500 font-mono">Deepgram Nova-3</span>
              </div>
              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300 leading-relaxed whitespace-pre-wrap max-h-[600px] overflow-y-auto">
                {summary.transcript}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl border border-zinc-800 bg-zinc-950/60">
          {meeting.status === 'failed' ? (
            <div>
              <p className="text-red-400 font-bold text-sm mb-1">Recording Session Failed</p>
              <p className="text-xs text-zinc-500">{meeting.error || 'Unknown pipeline failure occurred.'}</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <Radio className="w-8 h-8 text-blue-400 animate-pulse" />
              <p className="text-sm font-bold text-white">Bot is actively processing this meeting</p>
              <p className="text-xs text-zinc-400 max-w-sm">
                Summary, action items, and diarized speakers will be delivered automatically as soon as the meeting ends.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
