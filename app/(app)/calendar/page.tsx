'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { StatusBadge } from '@/components/StatusBadge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { format, addMinutes } from 'date-fns'
import { 
  Calendar as CalendarIcon, 
  Bot, 
  ExternalLink, 
  Plus, 
  Video, 
  Zap, 
  Clock, 
  Users, 
  RefreshCw
} from 'lucide-react'

interface CalEvent {
  id: string
  summary: string
  start: { dateTime: string }
  meetingUrl: string
  platform: 'google_meet' | 'zoom' | 'other'
  attendees?: { email: string }[]
}

interface Job {
  jobId: string
  status: string
}

const BOT_API = process.env.NEXT_PUBLIC_BOT_API_URL || 'https://api.meetbot.ink'
const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || 'https://api.meetbot.ink'

async function getGoogleToken(): Promise<string | null> {
  try {
    const res = await fetch(`${AUTH_URL}/auth/me`, { credentials: 'include' })
    if (!res.ok) return null
    const user = await res.json()
    return user.googleToken || null
  } catch { return null }
}

function extractMeetingInfo(e: any): { meetingUrl: string; platform: 'google_meet' | 'zoom' | 'other' } | null {
  if (e.hangoutLink) {
    return { meetingUrl: e.hangoutLink, platform: 'google_meet' }
  }

  if (e.conferenceData?.entryPoints) {
    for (const ep of e.conferenceData.entryPoints) {
      if (ep.uri) {
        if (ep.uri.includes('zoom.us')) return { meetingUrl: ep.uri, platform: 'zoom' }
        if (ep.uri.includes('meet.google.com')) return { meetingUrl: ep.uri, platform: 'google_meet' }
      }
    }
  }

  if (e.location) {
    const m = e.location.match(/https?:\/\/[^\s<>"'\)]+/)
    if (m) {
      if (m[0].includes('zoom.us')) return { meetingUrl: m[0], platform: 'zoom' }
      if (m[0].includes('meet.google.com')) return { meetingUrl: m[0], platform: 'google_meet' }
    }
  }

  if (e.description) {
    const matches = e.description.match(/https?:\/\/[^\s<>"'\)]+/g)
    if (matches) {
      for (const url of matches) {
        if (url.includes('zoom.us')) return { meetingUrl: url, platform: 'zoom' }
        if (url.includes('meet.google.com')) return { meetingUrl: url, platform: 'google_meet' }
      }
    }
  }

  return null
}

export default function CalendarPage() {
  const [events, setEvents] = useState<CalEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [googleToken, setGoogleToken] = useState<string | null>(null)
  const [jobs, setJobs] = useState<Record<string, Job>>({})
  const [manualUrl, setManualUrl] = useState('')
  const [manualTitle, setManualTitle] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const [createOpen, setCreateOpen] = useState(false)
  const [newPlatform, setNewPlatform] = useState<'google_meet' | 'zoom'>('google_meet')
  const [zoomMode, setZoomMode] = useState<'auto' | 'custom'>('auto')
  const [newZoomUrl, setNewZoomUrl] = useState('')
  const [newTitle, setNewTitle] = useState('')
  const [newDate, setNewDate] = useState('')
  const [newTime, setNewTime] = useState('')
  const [newDuration, setNewDuration] = useState('60')
  const [newGuests, setNewGuests] = useState('')
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState('')

  useEffect(() => {
    const soon = addMinutes(new Date(), 30)
    setNewDate(format(soon, 'yyyy-MM-dd'))
    setNewTime(format(soon, 'HH:mm'))
    initCalendar()
  }, [])

  async function initCalendar() {
    const token = await getGoogleToken()
    setGoogleToken(token)
    if (token) await fetchEvents(token)
    else setLoading(false)
  }

  async function fetchEvents(token: string) {
    setLoading(true)
    try {
      let activeToken = token
      let res = await fetch(
        'https://www.googleapis.com/calendar/v3/calendars/primary/events?' +
        new URLSearchParams({
          timeMin: new Date().toISOString(),
          timeMax: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          singleEvents: 'true',
          orderBy: 'startTime',
          maxResults: '20',
        }),
        { headers: { Authorization: `Bearer ${activeToken}` } }
      )
      if (res.status === 401) {
        const fresh = await getGoogleToken()
        if (fresh) {
          activeToken = fresh
          setGoogleToken(fresh)
          res = await fetch(
            'https://www.googleapis.com/calendar/v3/calendars/primary/events?' +
            new URLSearchParams({
              timeMin: new Date().toISOString(),
              timeMax: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
              singleEvents: 'true',
              orderBy: 'startTime',
              maxResults: '20',
            }),
            { headers: { Authorization: `Bearer ${activeToken}` } }
          )
        }
      }
      const data = await res.json()
      const parsedEvents: CalEvent[] = (data.items || [])
        .map((e: any) => {
          const info = extractMeetingInfo(e)
          if (!info) return null
          return {
            id: e.id,
            summary: e.summary || 'Untitled Meeting',
            start: e.start || {},
            meetingUrl: info.meetingUrl,
            platform: info.platform,
            attendees: e.attendees,
          }
        })
        .filter(Boolean)

      setEvents(parsedEvents)
    } catch { /* ignore */ }
    setLoading(false)
    setRefreshing(false)
  }

  async function getUserEmail(): Promise<string> {
    try {
      const res = await fetch(`${AUTH_URL}/auth/me`, { credentials: 'include' })
      const user = await res.json()
      return user.email || ''
    } catch { return '' }
  }

  async function createMeeting() {
    if (!newTitle || !newDate || !newTime) return
    if (newPlatform === 'zoom' && zoomMode === 'custom' && !newZoomUrl.trim()) {
      setCreateError('Please enter a valid Zoom meeting link or choose Create Automatically')
      return
    }

    setCreating(true)
    setCreateError('')
    try {
      const activeToken = await getGoogleToken() || googleToken
      if (!activeToken) throw new Error('No Google account connected. Please sign in again.')
      setGoogleToken(activeToken)

      const startDt = new Date(`${newDate}T${newTime}:00`)
      const endDt = addMinutes(startDt, parseInt(newDuration))
      let targetMeetUrl = ''

      // 1. If Zoom Auto-generate: call Zoom REST API
      if (newPlatform === 'zoom') {
        if (zoomMode === 'auto') {
          const zoomRes = await fetch(`${BOT_API}/bot/zoom/create-meeting`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              topic: newTitle,
              startTime: startDt.toISOString(),
              duration: parseInt(newDuration),
              timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            }),
          })
          const zoomData = await zoomRes.json()
          if (!zoomRes.ok || !zoomData.joinUrl) {
            throw new Error(zoomData.error || 'Failed to create Zoom meeting link')
          }
          targetMeetUrl = zoomData.joinUrl
        } else {
          targetMeetUrl = newZoomUrl.trim()
        }
      }

      // 2. Build Google Calendar Event
      const body: Record<string, unknown> = {
        summary: newTitle,
        start: { dateTime: startDt.toISOString(), timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone },
        end:   { dateTime: endDt.toISOString(),   timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone },
      }

      if (newPlatform === 'google_meet') {
        body.conferenceData = {
          createRequest: { requestId: crypto.randomUUID(), conferenceSolutionKey: { type: 'hangoutsMeet' } },
        }
      } else if (newPlatform === 'zoom') {
        body.location = targetMeetUrl
        body.description = `Zoom Meeting: ${targetMeetUrl}\n\nRecorded and summarized by MeetBot.`
      }

      if (newGuests.trim()) {
        body.attendees = newGuests.split(',').map(e => ({ email: e.trim() })).filter((a: { email: string }) => a.email)
      }

      let res = await fetch(
        'https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1',
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${activeToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        }
      )
      if (res.status === 401) {
        const fresh = await getGoogleToken()
        if (fresh) {
          setGoogleToken(fresh)
          res = await fetch(
            'https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1',
            {
              method: 'POST',
              headers: { Authorization: `Bearer ${fresh}`, 'Content-Type': 'application/json' },
              body: JSON.stringify(body),
            }
          )
        }
      }
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        const msg = err.error?.message || 'Failed to create event'
        if (res.status === 401 || msg.toLowerCase().includes('invalid authentication credentials')) {
          throw new Error('Google Calendar access expired. Please sign out and sign in with Google to refresh permissions.')
        }
        throw new Error(msg)
      }
      const event = await res.json()
      setCreateOpen(false)
      setNewTitle('')
      setNewZoomUrl('')
      setNewGuests('')
      await fetchEvents(activeToken)

      // 3. Determine final meeting URL to schedule bot
      const finalBotUrl = newPlatform === 'zoom' ? targetMeetUrl : event.hangoutLink
      if (finalBotUrl) {
        const email = await getUserEmail()
        const attendeeEmails = (event.attendees || []).map((a: { email: string }) => a.email).filter(Boolean)
        await fetch(`${BOT_API}/bot/schedule`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            meetUrl: finalBotUrl,
            title: event.summary || newTitle,
            organizerEmail: email,
            attendeeEmails,
            startAt: event.start?.dateTime || startDt.toISOString(),
            eventId: event.id,
          }),
        })
      }
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : 'Something went wrong')
    }
    setCreating(false)
  }

  async function scheduleBot(event: CalEvent) {
    const email = await getUserEmail()
    const attendeeEmails = (event.attendees || []).map(a => a.email).filter(Boolean)
    const res = await fetch(`${BOT_API}/bot/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        meetUrl: event.meetingUrl,
        title: event.summary,
        organizerEmail: email,
        attendeeEmails,
      }),
    })
    const data = await res.json()
    if (data.jobId) {
      setJobs(prev => ({ ...prev, [event.id]: { jobId: data.jobId, status: data.status } }))
      pollJob(data.jobId, event.id)
    }
  }

  async function submitManual() {
    if (!manualUrl) return
    setSubmitting(true)
    const email = await getUserEmail()
    const res = await fetch(`${BOT_API}/bot/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ meetUrl: manualUrl, title: manualTitle || 'Meeting', organizerEmail: email }),
    })
    const data = await res.json()
    if (data.jobId) {
      setJobs(prev => ({ ...prev, manual: { jobId: data.jobId, status: data.status } }))
      pollJob(data.jobId, 'manual')
      setManualUrl('')
      setManualTitle('')
    }
    setSubmitting(false)
  }

  function pollJob(jobId: string, key: string) {
    const interval = setInterval(async () => {
      const res = await fetch(`${BOT_API}/bot/status/${jobId}`)
      const data = await res.json()
      setJobs(prev => ({ ...prev, [key]: { ...prev[key], status: data.status } }))
      if (data.status === 'done' || data.status === 'failed') clearInterval(interval)
    }, 4000)
  }

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Calendar & Schedule
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Google Sync Active
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            Auto-join upcoming Google Meet & Zoom meetings from your calendar
          </p>
        </div>

        <Button 
          onClick={() => setCreateOpen(true)} 
          className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-semibold gap-2 px-4 py-2 rounded-lg self-start sm:self-auto transition-all active:scale-95 shadow-md shadow-emerald-500/10"
        >
          <Plus className="w-4 h-4" />
          <span>New Meeting</span>
        </Button>
      </div>

      {/* New Meeting Modal */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-foreground max-w-lg rounded-xl shadow-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-white">
              Create & Schedule Meeting
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            {/* Meeting Provider Toggle */}
            <div>
              <label className="text-xs font-semibold text-zinc-400 mb-1.5 block uppercase tracking-wider">
                Meeting Provider
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setNewPlatform('google_meet')}
                  className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg border text-xs font-medium transition-all ${
                    newPlatform === 'google_meet'
                      ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-400 font-semibold'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${newPlatform === 'google_meet' ? 'bg-emerald-400' : 'bg-zinc-600'}`} />
                  Google Meet
                </button>
                <button
                  type="button"
                  onClick={() => setNewPlatform('zoom')}
                  className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg border text-xs font-medium transition-all ${
                    newPlatform === 'zoom'
                      ? 'bg-blue-500/15 border-blue-500/50 text-blue-400 font-semibold'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${newPlatform === 'zoom' ? 'bg-blue-400' : 'bg-zinc-600'}`} />
                  Zoom Meeting
                </button>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="text-xs font-semibold text-zinc-400 mb-1.5 block">Meeting Title</label>
              <Input
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="Weekly Sprint Sync / Client Review"
                className="bg-zinc-950 border-zinc-800 text-xs rounded-lg focus:border-emerald-500"
                autoFocus
              />
            </div>

            {/* Zoom Link Selector */}
            {newPlatform === 'zoom' && (
              <div className="space-y-2 p-3 bg-zinc-950 border border-zinc-800 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-zinc-300">Zoom Link</span>
                  <div className="flex text-xs bg-zinc-900 border border-zinc-800 rounded p-0.5">
                    <button
                      type="button"
                      onClick={() => setZoomMode('auto')}
                      className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
                        zoomMode === 'auto'
                          ? 'bg-blue-600 text-white'
                          : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      Create Automatically
                    </button>
                    <button
                      type="button"
                      onClick={() => setZoomMode('custom')}
                      className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
                        zoomMode === 'custom'
                          ? 'bg-blue-600 text-white'
                          : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      Paste Existing Link
                    </button>
                  </div>
                </div>

                {zoomMode === 'auto' ? (
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    A Zoom link will be created automatically and added to your calendar event.
                  </p>
                ) : (
                  <div>
                    <Input
                      value={newZoomUrl}
                      onChange={e => setNewZoomUrl(e.target.value)}
                      placeholder="https://zoom.us/j/1234567890?pwd=..."
                      className="bg-zinc-900 border-zinc-800 font-mono text-xs mt-1.5 rounded-lg"
                    />
                    <p className="text-[10px] text-zinc-500 mt-1">Paste your Zoom meeting link</p>
                  </div>
                )}
              </div>
            )}

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-zinc-400 mb-1.5 block">Date</label>
                <Input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} className="bg-zinc-950 border-zinc-800 text-xs rounded-lg" />
              </div>
              <div>
                <label className="text-xs font-semibold text-zinc-400 mb-1.5 block">Time</label>
                <Input type="time" value={newTime} onChange={e => setNewTime(e.target.value)} className="bg-zinc-950 border-zinc-800 text-xs rounded-lg" />
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="text-xs font-semibold text-zinc-400 mb-1.5 block">Duration (minutes)</label>
              <Input type="number" value={newDuration} onChange={e => setNewDuration(e.target.value)} min="15" max="480" step="15" className="bg-zinc-950 border-zinc-800 text-xs rounded-lg" />
            </div>

            {/* Guests */}
            <div>
              <label className="text-xs font-semibold text-zinc-400 mb-1.5 block">
                Invite Guests <span className="text-zinc-500 font-normal">(comma-separated)</span>
              </label>
              <Input
                value={newGuests}
                onChange={e => setNewGuests(e.target.value)}
                placeholder="sarah@acme.com, david@company.com"
                className="bg-zinc-950 border-zinc-800 text-xs rounded-lg"
              />
            </div>

            {createError && (
              <p className="text-xs text-red-400 bg-red-950/30 border border-red-900/50 rounded-lg px-3 py-2">
                {createError}
              </p>
            )}

            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={() => setCreateOpen(false)} className="flex-1 border-zinc-800 hover:bg-zinc-800 rounded-lg text-xs">
                Cancel
              </Button>
              <Button
                onClick={createMeeting}
                disabled={
                  !newTitle ||
                  !newDate ||
                  !newTime ||
                  creating ||
                  !googleToken ||
                  (newPlatform === 'zoom' && zoomMode === 'custom' && !newZoomUrl.trim())
                }
                className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-semibold rounded-lg"
              >
                {creating ? 'Creating...' : 'Create & Schedule'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Quick Bot Launcher / Paste Widget */}
      <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900 shadow-xl">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="w-4 h-4 text-emerald-400 fill-emerald-400" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
            Instant Bot Launchpad
          </h2>
        </div>
        <p className="text-xs text-zinc-400 mb-3">
          Have a Google Meet or Zoom URL right now? Paste it below to send MeetBot immediately.
        </p>

        <div className="flex flex-col sm:flex-row gap-2.5">
          <Input
            value={manualUrl}
            onChange={e => setManualUrl(e.target.value)}
            placeholder="https://meet.google.com/abc-defg-hij or https://zoom.us/j/..."
            className="font-mono text-xs bg-zinc-950 border-zinc-800 rounded-lg flex-1 focus:border-emerald-500"
          />
          <Input
            value={manualTitle}
            onChange={e => setManualTitle(e.target.value)}
            placeholder="Topic (optional)"
            className="bg-zinc-950 border-zinc-800 text-xs rounded-lg w-full sm:w-44"
          />
          <Button
            onClick={submitManual}
            disabled={!manualUrl || submitting}
            className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-semibold px-4 rounded-lg shrink-0 active:scale-95"
          >
            {submitting ? 'Launching...' : 'Send Bot'}
          </Button>
        </div>

        {jobs.manual && (
          <div className="mt-3 flex items-center gap-2 text-xs">
            <StatusBadge status={jobs.manual.status} />
            <span className="text-zinc-500 font-mono text-[11px]">Job ID: {jobs.manual.jobId}</span>
          </div>
        )}
      </div>

      {/* Upcoming 7-Days Calendar Timeline */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-emerald-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Upcoming Calendar Meetings (Next 7 Days)
            </h2>
          </div>

          {googleToken && (
            <button
              onClick={() => { setRefreshing(true); fetchEvents(googleToken); }}
              className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          )}
        </div>

        {loading ? (
          <div className="text-center py-16 text-zinc-500 text-xs">
            Syncing calendar events...
          </div>
        ) : !googleToken ? (
          <div className="text-center py-16 rounded-xl border border-zinc-800 bg-zinc-900 p-8">
            <CalendarIcon className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-white mb-1">Calendar access required</h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto mb-4">
              Sign out and sign in with Google to grant calendar read and schedule permissions.
            </p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-16 rounded-xl border border-zinc-800 bg-zinc-900 p-8">
            <CalendarIcon className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-white mb-1">No upcoming meetings found</h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              Create a new Google Meet or Zoom meeting above to schedule the bot.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {events.map(event => {
              const job = jobs[event.id]
              const isZoom = event.platform === 'zoom'
              return (
                <div
                  key={event.id}
                  className="rounded-xl p-5 border border-zinc-800 bg-zinc-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-zinc-700 transition-colors"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2.5 mb-1">
                      <h3 className="text-sm font-bold text-white truncate">
                        {event.summary || 'Untitled Event'}
                      </h3>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        isZoom
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}>
                        {isZoom ? 'Zoom' : 'Google Meet'}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400 mb-2">
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3.5 h-3.5 text-zinc-500" />
                        {format(new Date(event.start.dateTime || Date.now()), 'EEEE, dd MMM · HH:mm')}
                      </span>
                      {event.attendees && event.attendees.length > 0 && (
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-zinc-500" />
                          {event.attendees.length} guest{event.attendees.length > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>

                    <a
                      href={event.meetingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-emerald-400 hover:text-emerald-300 font-mono flex items-center gap-1 truncate max-w-md transition-colors"
                    >
                      <ExternalLink className="w-3 h-3 shrink-0" />
                      <span>{event.meetingUrl.replace('https://', '')}</span>
                    </a>
                  </div>

                  <div className="shrink-0">
                    {job ? (
                      <div className="flex items-center gap-2">
                        <StatusBadge status={job.status} />
                        <span className="text-[10px] font-mono text-zinc-500">Scheduled</span>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => scheduleBot(event)}
                        className="bg-zinc-800 hover:bg-zinc-750 border border-zinc-700 text-zinc-200 text-xs font-semibold gap-1.5 rounded-lg shadow-sm transition-all"
                      >
                        <Bot className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Schedule Bot</span>
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
