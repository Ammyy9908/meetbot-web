import { cookies } from 'next/headers'
import { MeetingsClient } from './MeetingsClient'
import Link from 'next/link'
import { Calendar as CalendarIcon, Video } from 'lucide-react'

const MEETINGS_URL = process.env.NEXT_PUBLIC_MEETINGS_SERVICE_URL || 'http://localhost:8081'

export default async function MeetingsPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('meetbot_token')?.value || ''

  let meetings = []

  try {
    const res = await fetch(`${MEETINGS_URL}/meetings`, {
      headers: { Cookie: `meetbot_token=${token}` },
      cache: 'no-store',
    })
    if (res.ok) meetings = await res.json()
  } catch { /* ignore */ }

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Meetings Archive
            </h1>
            {meetings.length > 0 && (
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                {meetings.length} recorded
              </span>
            )}
          </div>
          <p className="text-xs text-zinc-400">
            Search transcripts, diarized dialogues, action items, and summaries
          </p>
        </div>

        <Link
          href="/calendar"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition-all self-start sm:self-auto"
        >
          <CalendarIcon className="w-3.5 h-3.5" />
          <span>Schedule / Join Call</span>
        </Link>
      </div>

      {/* Interactive Meetings Client */}
      <MeetingsClient initialMeetings={meetings} />
    </div>
  )
}
