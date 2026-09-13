'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutGrid, 
  Video, 
  Calendar, 
  LogOut, 
  Zap, 
  Radio
} from 'lucide-react'

const NAV = [
  { href: '/dashboard', label: 'Dashboard',  icon: LayoutGrid, desc: 'Overview & metrics' },
  { href: '/meetings',  label: 'Meetings',   icon: Video,      desc: 'Transcripts & summaries' },
  { href: '/calendar',  label: 'Calendar',   icon: Calendar,   desc: 'Google & Zoom events' },
]

const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || 'http://localhost:8080'

export function Sidebar() {
  const pathname = usePathname()

  async function signOut() {
    try {
      await fetch(`${AUTH_URL}/auth/logout`, { method: 'POST', credentials: 'include' })
    } catch {}
    // Clear cookies on all possible client domains
    const cookieDomains = ['.meetbot.ink', 'www.meetbot.ink', 'api.meetbot.ink', '']
    cookieDomains.forEach(d => {
      const domainAttr = d ? `; domain=${d}` : ''
      document.cookie = `meetbot_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT${domainAttr}`
    })
    try {
      localStorage.clear()
      sessionStorage.clear()
    } catch {}
    window.location.href = '/'
  }

  return (
    <aside className="w-64 shrink-0 border-r border-zinc-800/80 bg-zinc-950 flex flex-col h-screen sticky top-0 z-30 select-none">
      
      {/* Brand Header */}
      <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-sm tracking-tight text-white group-hover:text-emerald-400 transition-colors">
              MeetBot
            </span>
          </div>
        </Link>
      </div>

      {/* Quick Launch Button */}
      <div className="px-3 pt-4 pb-2">
        <Link
          href="/calendar"
          className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-semibold shadow-md transition-all active:scale-[0.98]"
        >
          <Zap className="w-3.5 h-3.5 fill-zinc-950" />
          <span>Launch Bot to Call</span>
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-3 space-y-1">
        <div className="px-3 py-1.5 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
          Workspace
        </div>

        {NAV.map(({ href, label, icon: Icon, desc }) => {
          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? 'bg-zinc-900 text-white border border-zinc-800 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
              }`}
            >
              <div
                className={`p-1.5 rounded-lg transition-colors ${
                  active
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'text-zinc-400 group-hover:text-zinc-200'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
              </div>
              <div className="flex-1 truncate">
                <div className="flex items-center justify-between">
                  <span className="truncate">{label}</span>
                  {active && (
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  )}
                </div>
                <p className="text-[11px] text-zinc-500 truncate font-normal leading-tight mt-0.5">
                  {desc}
                </p>
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Active Engines Status */}
      <div className="px-4 py-3 mx-3 mb-3 rounded-xl bg-zinc-900 border border-zinc-800/80">
        <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-2 font-medium">
          <span className="flex items-center gap-1.5 text-zinc-300">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            Engines Ready
          </span>
          <span className="text-emerald-400 text-[10px] font-semibold">Active</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 font-mono">
          <span className="px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-emerald-400">
            Google Meet
          </span>
          <span className="px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-blue-400">
            Zoom
          </span>
          <span className="px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-zinc-300">
            Nova-3
          </span>
        </div>
      </div>

      {/* Sign Out */}
      <div className="p-3 border-t border-zinc-800 bg-zinc-950">
        <button
          onClick={signOut}
          className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-xs font-medium text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-all group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-zinc-800 flex items-center justify-center text-zinc-300 font-bold text-[10px]">
              U
            </div>
            <span className="text-zinc-300 text-xs font-medium group-hover:text-red-400">
              Sign out
            </span>
          </div>
          <LogOut className="w-3.5 h-3.5 text-zinc-500 group-hover:text-red-400 transition-colors" />
        </button>
      </div>
    </aside>
  )
}
