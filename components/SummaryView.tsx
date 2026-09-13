'use client'

import { useState } from 'react'
import { 
  Sparkles, 
  CheckCircle2, 
  ListTodo, 
  HelpCircle, 
  Copy, 
  Check, 
  FileText, 
  ChevronDown, 
  ChevronUp,
  User,
  Calendar,
  Layers
} from 'lucide-react'

interface ActionItem {
  owner: string
  task: string
  due: string
}

interface Summary {
  tldr: string
  key_discussion_points?: string[]
  decisions: string[]
  action_items?: ActionItem[]
  actionItems?: ActionItem[]
  parking_lot?: string[]
  parkingLot?: string[]
  transcript?: string
}

export function SummaryView({ summary }: { summary: Summary }) {
  const [copiedSection, setCopiedSection] = useState<string | null>(null)
  const [showTranscript, setShowTranscript] = useState(false)

  const actionItems = summary.action_items || summary.actionItems || []
  const parkingLot = summary.parking_lot || summary.parkingLot || []

  function copyText(text: string, sectionId: string) {
    navigator.clipboard.writeText(text)
    setCopiedSection(sectionId)
    setTimeout(() => setCopiedSection(null), 2000)
  }

  return (
    <div className="space-y-6 select-text">
      
      {/* Executive Summary / TL;DR Card */}
      {summary.tldr && (
        <div className="rounded-2xl bg-gradient-to-br from-blue-950/40 via-zinc-900/60 to-zinc-900/30 border border-blue-500/25 p-5 relative overflow-hidden shadow-lg shadow-blue-500/5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                Executive Overview & What Happened
              </span>
            </div>
            <button
              onClick={() => copyText(summary.tldr, 'tldr')}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-[11px] font-medium text-zinc-300 transition-colors"
            >
              {copiedSection === 'tldr' ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 text-zinc-400" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          <p className="text-sm text-zinc-200 leading-relaxed whitespace-pre-line font-normal">
            {summary.tldr}
          </p>
        </div>
      )}

      {/* Key Discussion Points */}
      {summary.key_discussion_points && summary.key_discussion_points.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Layers className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Key Discussion Points
            </span>
          </div>

          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/50 divide-y divide-zinc-800/60 overflow-hidden">
            {summary.key_discussion_points.map((pt, i) => (
              <div key={i} className="flex items-start gap-3 p-3.5 hover:bg-zinc-850/40 transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  {pt}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Key Decisions */}
      {summary.decisions && summary.decisions.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Key Decisions ({summary.decisions.length})
              </span>
            </div>
            <button
              onClick={() => copyText(summary.decisions.map((d, i) => `${i + 1}. ${d}`).join('\n'), 'decisions')}
              className="flex items-center gap-1.5 px-2 py-0.5 rounded-md hover:bg-zinc-800 text-[11px] text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              {copiedSection === 'decisions' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedSection === 'decisions' ? 'Copied' : 'Copy Decisions'}</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {summary.decisions.map((decision, i) => (
              <div
                key={i}
                className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3.5 flex items-start gap-3 hover:border-zinc-700 transition-colors"
              >
                <span className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold text-xs shrink-0 font-mono">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="text-xs sm:text-sm text-zinc-200 font-medium leading-relaxed">
                  {decision}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Items */}
      {actionItems.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ListTodo className="w-4 h-4 text-yellow-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Action Items & Ownership ({actionItems.length})
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/50 overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-3 px-4 py-2.5 bg-zinc-950/60 border-b border-zinc-800 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
              <div className="col-span-4 sm:col-span-3">Owner</div>
              <div className="col-span-8 sm:col-span-7">Action Item</div>
              <div className="hidden sm:block sm:col-span-2 text-right">Target</div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-zinc-800/60">
              {actionItems.map((item, i) => (
                <div key={i} className="grid grid-cols-12 gap-3 px-4 py-3 items-center hover:bg-zinc-800/30 transition-colors text-xs sm:text-sm">
                  <div className="col-span-4 sm:col-span-3 flex items-center gap-2 min-w-0">
                    <div className="w-5 h-5 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] text-zinc-300 font-bold shrink-0">
                      {item.owner ? item.owner.slice(0, 1).toUpperCase() : 'U'}
                    </div>
                    <span className="font-semibold text-zinc-200 truncate">
                      {item.owner || 'Unassigned'}
                    </span>
                  </div>

                  <div className="col-span-8 sm:col-span-7 text-zinc-300 leading-relaxed font-normal">
                    {item.task}
                  </div>

                  <div className="hidden sm:flex sm:col-span-2 justify-end">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-zinc-800 text-[11px] text-zinc-400 font-medium">
                      <Calendar className="w-3 h-3 text-zinc-500" />
                      {item.due || 'ASAP'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Parking Lot / Open Questions */}
      {parkingLot.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <HelpCircle className="w-4 h-4 text-yellow-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Parking Lot & Open Questions
            </span>
          </div>

          <div className="rounded-2xl border border-yellow-500/20 bg-yellow-950/10 divide-y divide-yellow-500/15 overflow-hidden">
            {parkingLot.map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-3.5">
                <span className="text-yellow-400 font-bold">•</span>
                <p className="text-xs sm:text-sm text-yellow-200/90 leading-relaxed">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Raw Transcript Collapsible Accordion */}
      {summary.transcript && (
        <div className="pt-2 border-t border-zinc-800/80">
          <button
            onClick={() => setShowTranscript(!showTranscript)}
            className="flex items-center justify-between w-full p-3 rounded-xl bg-zinc-900/60 hover:bg-zinc-850 border border-zinc-800 text-xs font-semibold text-zinc-400 hover:text-zinc-200 transition-all"
          >
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-zinc-400" />
              <span>Full Raw Audio Transcript</span>
            </div>
            {showTranscript ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showTranscript && (
            <div className="mt-3 p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-400 font-mono leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto">
              {summary.transcript}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
