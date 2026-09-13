'use client'

import { useState } from 'react'
import { StatusBadge } from '@/components/StatusBadge'
import Link from 'next/link'
import { format } from 'date-fns'
import { 
  Search, 
  Video, 
  ArrowUpRight, 
  Sparkles, 
  ExternalLink, 
  Layers, 
  Calendar, 
  Filter
} from 'lucide-react'

interface MeetingItem {
  id: string
  title?: string
  status: string
  meetUrl: string
  createdAt: string
  summary?: { tldr?: string }
}

export function MeetingsClient({ initialMeetings }: { initialMeetings: MeetingItem[] }) {
  const [search, setSearch] = useState('')
  const [platformFilter, setPlatformFilter] = useState<'all' | 'google_meet' | 'zoom'>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'done' | 'active'>('all')

  const filtered = initialMeetings.filter(m => {
    const isZoom = m.meetUrl?.includes('zoom.us')
    const matchesPlatform =
      platformFilter === 'all' ||
      (platformFilter === 'zoom' && isZoom) ||
      (platformFilter === 'google_meet' && !isZoom)

    const isActive = ['queued', 'joining', 'in-progress'].includes(m.status)
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'done' && m.status === 'done') ||
      (statusFilter === 'active' && isActive)

    const matchesSearch =
      search === '' ||
      (m.title && m.title.toLowerCase().includes(search.toLowerCase())) ||
      (m.meetUrl && m.meetUrl.toLowerCase().includes(search.toLowerCase())) ||
      (m.summary?.tldr && m.summary.tldr.toLowerCase().includes(search.toLowerCase()))

    return matchesPlatform && matchesStatus && matchesSearch
  })

  return (
    <div className="space-y-6">
      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-zinc-900/60 p-3.5 rounded-2xl border border-zinc-800/80 backdrop-blur-md">
        
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search meetings by title, notes, or URL..."
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-4 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-all"
          />
        </div>

        {/* Platform & Status Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <div className="flex bg-zinc-950 p-1 rounded-xl border border-zinc-800">
            <button
              onClick={() => setPlatformFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                platformFilter === 'all' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setPlatformFilter('zoom')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                platformFilter === 'zoom' ? 'bg-blue-600 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Zoom
            </button>
            <button
              onClick={() => setPlatformFilter('google_meet')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                platformFilter === 'google_meet' ? 'bg-emerald-600 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Meet
            </button>
          </div>

          <div className="flex bg-zinc-950 p-1 rounded-xl border border-zinc-800">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === 'all' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              All Status
            </button>
            <button
              onClick={() => setStatusFilter('done')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === 'done' ? 'bg-emerald-600 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Completed
            </button>
          </div>
        </div>
      </div>

      {/* Meetings List / Table */}
      {filtered.length > 0 ? (
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/60 overflow-hidden shadow-xl">
          <div className="divide-y divide-zinc-800/60">
            {filtered.map(m => {
              const isZoom = m.meetUrl?.includes('zoom.us')
              return (
                <div
                  key={m.id}
                  className="p-5 hover:bg-zinc-900/40 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
                      <Link
                        href={`/meetings/${m.id}`}
                        className="font-bold text-sm sm:text-base text-zinc-100 hover:text-blue-400 transition-colors truncate"
                      >
                        {m.title || 'Untitled Meeting'}
                      </Link>

                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        isZoom
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}>
                        {isZoom ? 'Zoom' : 'Google Meet'}
                      </span>

                      <StatusBadge status={m.status} />
                    </div>

                    {m.summary?.tldr && (
                      <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed mb-2 font-normal">
                        {m.summary.tldr}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500 font-mono">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-zinc-600" />
                        {format(new Date(m.createdAt), 'dd MMM yyyy · HH:mm')}
                      </span>
                      <a
                        href={m.meetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-zinc-300 flex items-center gap-1 truncate max-w-xs transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>{m.meetUrl.replace('https://', '')}</span>
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-start md:self-center">
                    {m.status === 'done' ? (
                      <Link
                        href={`/meetings/${m.id}`}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-all"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>View Notes</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    ) : (
                      <a
                        href={m.meetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium transition-all"
                      >
                        <span>Join Call</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl border border-zinc-800/80 bg-zinc-950/60">
          <Video className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-white mb-1">
            No matching meetings found
          </h3>
          <p className="text-xs text-zinc-500 max-w-xs mx-auto">
            Try adjusting your search keywords or platform filters.
          </p>
        </div>
      )}
    </div>
  )
}
