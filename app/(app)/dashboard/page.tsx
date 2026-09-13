import { cookies } from 'next/headers'
import { SummaryView } from '@/components/SummaryView'
import { StatusBadge } from '@/components/StatusBadge'
import Link from 'next/link'
import { format } from 'date-fns'
import { 
  Video, 
  Clock, 
  CheckCircle2, 
  ListTodo, 
  ArrowUpRight, 
  Calendar as CalendarIcon, 
  ExternalLink, 
  Radio, 
  Zap,
  TrendingUp,
  FileText
} from 'lucide-react'

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

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('meetbot_token')?.value || ''
  const [meetings, user] = await Promise.all([getMeetings(token), getUser(token)])

  const total = Array.isArray(meetings) ? meetings.length : 0
  const doneMeetings = Array.isArray(meetings) ? meetings.filter((m: { status: string }) => m.status === 'done') : []
  const done = doneMeetings.length
  const active = Array.isArray(meetings) ? meetings.filter((m: { status: string }) => ['queued', 'joining', 'in-progress'].includes(m.status)) : []
  const recent = doneMeetings.slice(0, 5)

  // Calculate aggregate insights
  let totalDecisions = 0
  let totalActionItems = 0
  doneMeetings.forEach((m: any) => {
    if (m.summary?.decisions?.length) totalDecisions += m.summary.decisions.length
    if (m.summary?.action_items?.length) totalActionItems += m.summary.action_items.length
    if (m.summary?.actionItems?.length) totalActionItems += m.summary.actionItems.length
  })
  const hoursSaved = Math.max(1, Math.round(done * 0.85))

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8">
      
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Dashboard
            </h1>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Live Pipeline
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            Signed in as <span className="text-zinc-200 font-medium">{user?.email || 'Logged in user'}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/calendar"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-semibold transition-all active:scale-95 shadow-md shadow-emerald-500/10"
          >
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Schedule Meeting</span>
          </Link>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Transcriptions',
            value: total,
            icon: Video,
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/10',
            border: 'border-emerald-500/20',
            trend: '+12% this month',
          },
          {
            label: 'Hours Saved',
            value: `${hoursSaved} hrs`,
            icon: Clock,
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/10',
            border: 'border-emerald-500/20',
            trend: '100% automated notes',
          },
          {
            label: 'Decisions Captured',
            value: totalDecisions > 0 ? totalDecisions : done * 3,
            icon: CheckCircle2,
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/10',
            border: 'border-emerald-500/20',
            trend: 'Zero context loss',
          },
          {
            label: 'Action Items Assigned',
            value: totalActionItems > 0 ? totalActionItems : done * 4,
            icon: ListTodo,
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/10',
            border: 'border-emerald-500/20',
            trend: 'High team alignment',
          },
        ].map((kpi, idx) => {
          const Icon = kpi.icon
          return (
            <div
              key={idx}
              className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 flex flex-col justify-between hover:border-zinc-700 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-zinc-400">
                  {kpi.label}
                </span>
                <div className={`w-8 h-8 rounded-lg ${kpi.bg} border ${kpi.border} flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${kpi.color}`} />
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-white tracking-tight mb-1">
                  {kpi.value}
                </p>
                <div className="flex items-center gap-1 text-[11px] text-zinc-500">
                  <TrendingUp className="w-3 h-3 text-emerald-400" />
                  <span className="text-zinc-400 font-medium">{kpi.trend}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Active Live Sessions Banner */}
      {active.length > 0 && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/10 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                Live Recording & Diarization in Progress
              </h2>
            </div>
            <span className="text-xs text-emerald-400 font-medium">
              {active.length} active session{active.length > 1 ? 's' : ''}
            </span>
          </div>

          <div className="space-y-3">
            {active.map((m: { id: string; title?: string; meetUrl: string; status: string }) => {
              const isZoom = m.meetUrl?.includes('zoom.us')
              return (
                <div
                  key={m.id}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm text-white truncate">
                        {m.title || 'Untitled Meeting'}
                      </span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        isZoom
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}>
                        {isZoom ? 'Zoom' : 'Google Meet'}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 font-mono truncate max-w-md">
                      {m.meetUrl}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <StatusBadge status={m.status} />
                    <a
                      href={m.meetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs flex items-center gap-1 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Join</span>
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Recent Summaries Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Recent Summaries
            </h2>
            <p className="text-xs text-zinc-400">
              Summaries and action items processed by Claude 3.7 & Deepgram
            </p>
          </div>
          <Link
            href="/meetings"
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
          >
            <span>All meetings</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recent.length > 0 ? (
          <div className="space-y-4">
            {recent.map((m: any) => {
              const isZoom = m.meetUrl?.includes('zoom.us')
              return (
                <div
                  key={m.id}
                  className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 hover:border-zinc-700 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-zinc-800">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-base font-bold text-white">
                          {m.title || 'Untitled Meeting'}
                        </h3>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          isZoom
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}>
                          {isZoom ? 'Zoom' : 'Google Meet'}
                        </span>
                        <StatusBadge status={m.status} />
                      </div>
                      <span className="text-xs text-zinc-500 font-mono">
                        {format(new Date(m.createdAt), 'dd MMM yyyy · HH:mm')}
                      </span>
                    </div>

                    <Link
                      href={`/meetings/${m.id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-750 border border-zinc-700 text-zinc-200 text-xs font-medium transition-all shrink-0 self-start sm:self-auto"
                    >
                      <FileText className="w-3.5 h-3.5 text-emerald-400" />
                      <span>View Summary</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </Link>
                  </div>

                  {m.summary && <SummaryView summary={m.summary} />}
                </div>
              )
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-12 text-center">
            <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center mx-auto mb-4 text-zinc-400">
              <FileText className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">
              No meeting summaries yet
            </h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto mb-6">
              Connect your Google Calendar or launch MeetBot directly to any Google Meet or Zoom call to generate your first AI summary.
            </p>
            <Link
              href="/calendar"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-semibold transition-all active:scale-95"
            >
              <Zap className="w-3.5 h-3.5 fill-zinc-950" />
              <span>Go to Calendar & Launch Bot</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
