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
  hangoutLink: string
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

export default function CalendarPage() {
  const [events, setEvents] = useState<CalEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [googleToken, setGoogleToken] = useState<string | null>(null)
  const [jobs, setJobs] = useState<Record<string, Job>>({})
  const [manualUrl, setManualUrl] = useState('')
  const [manualTitle, setManualTitle] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const [createOpen, setCreateOpen] = useState(false)
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
      setEvents((data.items || []).filter((e: CalEvent) => e.hangoutLink))
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
        conferenceData: {
          createRequest: { requestId: crypto.randomUUID(), conferenceSolutionKey: { type: 'hangoutsMeet' } },
        },
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
        const err = await res.json()
        throw new Error(err.error?.message || 'Failed to create event')
      }
      const event = await res.json()
      setCreateOpen(false)
      setNewTitle('')
      setNewGuests('')
      await fetchEvents(activeToken)

      // Schedule bot directly at the meeting start time
      if (event.hangoutLink) {
        const email = await getUserEmail()
        await fetch(`${BOT_API}/bot/schedule`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            meetUrl: event.hangoutLink,
            title: event.summary,
            organizerEmail: email,
            startAt: event.start.dateTime,
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
    const res = await fetch(`${BOT_API}/bot/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ meetUrl: event.hangoutLink, title: event.summary, organizerEmail: email }),
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
          <p className="text-muted-foreground text-sm mt-1">Upcoming Google Meet events</p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="gap-2">
          <Video className="w-4 h-4" />
          New Meeting
        </Button>
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-foreground max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">Create Google Meet</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <label className="text-xs text-zinc-400 mb-1.5 block">Meeting title</label>
              <Input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Weekly standup" className="bg-zinc-950 border-zinc-700" autoFocus />
            </div>
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
              <Button onClick={createMeeting} disabled={!newTitle || !newDate || !newTime || creating || !googleToken} className="flex-1">
                {creating ? 'Creating...' : 'Create + Schedule Bot'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Plus className="w-4 h-4 text-zinc-400" />
          <p className="text-sm font-medium">Schedule bot for existing URL</p>
        </div>
        <div className="flex gap-3">
          <Input value={manualUrl} onChange={e => setManualUrl(e.target.value)} placeholder="https://meet.google.com/abc-defg-hij" className="font-mono text-xs bg-zinc-950 border-zinc-700 flex-1" />
          <Input value={manualTitle} onChange={e => setManualTitle(e.target.value)} placeholder="Title" className="bg-zinc-950 border-zinc-700 w-36" />
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
            <p className="text-sm text-zinc-400">No upcoming Meet events found</p>
          </div>
        ) : (
          <div className="space-y-2">
            {events.map(event => {
              const job = jobs[event.id]
              return (
                <div key={event.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{event.summary || 'No title'}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">{format(new Date(event.start.dateTime), 'MMM d · h:mm a')}</p>
                    <a href={event.hangoutLink} target="_blank" rel="noopener noreferrer"
                      className="text-xs text-blue-400 hover:text-blue-300 font-mono flex items-center gap-1 mt-1">
                      {event.hangoutLink.replace('https://', '')}
                      <ExternalLink className="w-3 h-3" />
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
