'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { StatusBadge } from '@/components/StatusBadge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { format, addMinutes } from 'date-fns'
import { Calendar, Bot, ExternalLink, Plus, Video } from 'lucide-react'

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
  // 1. hangoutLink
  if (e.hangoutLink) {
    return { meetingUrl: e.hangoutLink, platform: 'google_meet' }
  }

  // 2. conferenceData entryPoints
  if (e.conferenceData?.entryPoints) {
    for (const ep of e.conferenceData.entryPoints) {
      if (ep.uri) {
        if (ep.uri.includes('zoom.us')) return { meetingUrl: ep.uri, platform: 'zoom' }
        if (ep.uri.includes('meet.google.com')) return { meetingUrl: ep.uri, platform: 'google_meet' }
      }
    }
  }

  // 3. Location field
  if (e.location) {
    const m = e.location.match(/https?:\/\/[^\s<>"'\)]+/)
    if (m) {
      if (m[0].includes('zoom.us')) return { meetingUrl: m[0], platform: 'zoom' }
      if (m[0].includes('meet.google.com')) return { meetingUrl: m[0], platform: 'google_meet' }
    }
  }

  // 4. Description field
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
  const [googleToken, setGoogleToken] = useState<string | null>(null)
  const [jobs, setJobs] = useState<Record<string, Job>>({})
  const [manualUrl, setManualUrl] = useState('')
  const [manualTitle, setManualTitle] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const [createOpen, setCreateOpen] = useState(false)
  const [newPlatform, setNewPlatform] = useState<'google_meet' | 'zoom'>('google_meet')
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
    if (newPlatform === 'zoom' && !newZoomUrl.trim()) {
      setCreateError('Please enter a valid Zoom meeting link')
      return
    }

    setCreating(true)
    setCreateError('')
    try {
      const activeToken = await getGoogleToken() || googleToken
      if (!activeToken) throw new Error('No Google token available. Please sign in again.')
      setGoogleToken(activeToken)

      const startDt = new Date(`${newDate}T${newTime}:00`)
      const endDt = addMinutes(startDt, parseInt(newDuration))
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
        body.location = newZoomUrl.trim()
        body.description = `Zoom Meeting Link: ${newZoomUrl.trim()}\n\nRecorded and summarized by MeetBot.`
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

      // Determine meeting URL to schedule bot
      const targetMeetUrl = newPlatform === 'zoom' ? newZoomUrl.trim() : event.hangoutLink
      if (targetMeetUrl) {
        const email = await getUserEmail()
        const attendeeEmails = (event.attendees || []).map((a: { email: string }) => a.email).filter(Boolean)
        await fetch(`${BOT_API}/bot/schedule`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            meetUrl: targetMeetUrl,
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
    <div className="p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground text-sm mt-1">Upcoming Google Meet & Zoom events</p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="gap-2">
          <Video className="w-4 h-4" />
          New Meeting
        </Button>
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-foreground max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">Create New Meeting</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <label className="text-xs text-zinc-400 mb-1.5 block">Meeting Provider</label>
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

            <div>
              <label className="text-xs text-zinc-400 mb-1.5 block">Meeting title</label>
              <Input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Weekly standup" className="bg-zinc-950 border-zinc-700" autoFocus />
            </div>

            {newPlatform === 'zoom' && (
              <div>
                <label className="text-xs text-zinc-400 mb-1.5 block">Zoom Meeting Link</label>
                <Input
                  value={newZoomUrl}
                  onChange={e => setNewZoomUrl(e.target.value)}
                  placeholder="https://zoom.us/j/1234567890?pwd=..."
                  className="bg-zinc-950 border-zinc-700 font-mono text-xs"
                />
                <p className="text-[11px] text-zinc-500 mt-1">Paste your Zoom meeting or personal room link</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-zinc-400 mb-1.5 block">Date</label>
                <Input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} className="bg-zinc-950 border-zinc-700" />
              </div>
              <div>
                <label className="text-xs text-zinc-400 mb-1.5 block">Time</label>
                <Input type="time" value={newTime} onChange={e => setNewTime(e.target.value)} className="bg-zinc-950 border-zinc-700" />
              </div>
            </div>
            <div>
              <label className="text-xs text-zinc-400 mb-1.5 block">Duration (minutes)</label>
              <Input type="number" value={newDuration} onChange={e => setNewDuration(e.target.value)} min="15" max="480" step="15" className="bg-zinc-950 border-zinc-700" />
            </div>
            <div>
              <label className="text-xs text-zinc-400 mb-1.5 block">Guests <span className="text-zinc-600">(optional, comma-separated)</span></label>
              <Input value={newGuests} onChange={e => setNewGuests(e.target.value)} placeholder="alice@company.com, bob@company.com" className="bg-zinc-950 border-zinc-700 text-xs" />
            </div>
            {createError && <p className="text-xs text-red-400 bg-red-950/30 border border-red-900/50 rounded px-3 py-2">{createError}</p>}
            {!googleToken && <p className="text-xs text-yellow-400 bg-yellow-950/30 border border-yellow-900/50 rounded px-3 py-2">Google Calendar access not available. Sign out and sign in again to grant calendar permissions.</p>}
            <div className="flex gap-3 pt-1">
              <Button variant="outline" onClick={() => setCreateOpen(false)} className="flex-1 border-zinc-700 hover:bg-zinc-800">Cancel</Button>
              <Button onClick={createMeeting} disabled={!newTitle || !newDate || !newTime || creating || !googleToken || (newPlatform === 'zoom' && !newZoomUrl.trim())} className="flex-1">
                {creating ? 'Creating...' : 'Create + Schedule Bot'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Plus className="w-4 h-4 text-zinc-400" />
          <p className="text-sm font-medium">Join or schedule bot for any meeting</p>
        </div>
        <div className="flex gap-3">
          <Input
            value={manualUrl}
            onChange={e => setManualUrl(e.target.value)}
            placeholder="https://zoom.us/j/... or https://meet.google.com/..."
            className="font-mono text-xs bg-zinc-950 border-zinc-700 flex-1"
          />
          <Input
            value={manualTitle}
            onChange={e => setManualTitle(e.target.value)}
            placeholder="Title (optional)"
            className="bg-zinc-950 border-zinc-700 w-36"
          />
          <Button onClick={submitManual} disabled={!manualUrl || submitting} size="sm" className="shrink-0">
            {submitting ? 'Sending...' : 'Send Bot'}
          </Button>
        </div>
        {jobs.manual && (
          <div className="mt-3 flex items-center gap-2">
            <StatusBadge status={jobs.manual.status} />
            <span className="text-xs text-zinc-500 font-mono">{jobs.manual.jobId}</span>
          </div>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Next 7 days</h2>
          {googleToken && <button onClick={() => fetchEvents(googleToken)} className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">Refresh</button>}
        </div>

        {loading ? (
          <div className="text-center py-12 text-zinc-600 text-sm">Loading calendar...</div>
        ) : !googleToken ? (
          <div className="text-center py-12">
            <Calendar className="w-10 h-10 mx-auto mb-3 text-zinc-700" />
            <p className="text-sm text-zinc-400">Calendar access not available</p>
            <p className="text-xs text-zinc-600 mt-1">Sign out and sign in again to grant Google Calendar permissions</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-10 h-10 mx-auto mb-3 text-zinc-700" />
            <p className="text-sm text-zinc-400">No upcoming meetings found</p>
          </div>
        ) : (
          <div className="space-y-2">
            {events.map(event => {
              const job = jobs[event.id]
              const isZoom = event.platform === 'zoom'
              return (
                <div key={event.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium truncate">{event.summary || 'No title'}</p>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        isZoom
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}>
                        {isZoom ? 'Zoom' : 'Google Meet'}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 mt-0.5">{format(new Date(event.start.dateTime || Date.now()), 'MMM d · h:mm a')}</p>
                    <a href={event.meetingUrl} target="_blank" rel="noopener noreferrer"
                      className="text-xs text-blue-400 hover:text-blue-300 font-mono flex items-center gap-1 mt-1 truncate max-w-md">
                      {event.meetingUrl.replace('https://', '')}
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  </div>
                  <div className="shrink-0">
                    {job ? <StatusBadge status={job.status} /> : (
                      <Button size="sm" variant="outline" onClick={() => scheduleBot(event)} className="gap-2 border-zinc-700 hover:bg-zinc-800">
                        <Bot className="w-3.5 h-3.5" />
                        Schedule Bot
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
