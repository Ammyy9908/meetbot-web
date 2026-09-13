'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutGrid, 
  Video, 
  Calendar, 
  LogOut, 
  Sparkles, 
  Zap, 
  CheckCircle2, 
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
    <aside className="w-64 shrink-0 border-r border-zinc-800/80 bg-zinc-950/90 backdrop-blur-xl flex flex-col h-screen sticky top-0 z-30 select-none">
      
      {/* Brand Header */}
      <div className="p-5 border-b border-zinc-800/70 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 p-[1px] shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/30 transition-all">
            <div className="w-full h-full bg-zinc-950 rounded-[11px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-blue-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base tracking-tight text-white group-hover:text-blue-400 transition-colors">
                MeetBot
              </span>
              <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                AI
              </span>
            </div>
          </div>
        </Link>
      </div>

      {/* Quick Bot Trigger / Shortcut */}
      <div className="px-3 pt-4 pb-2">
        <Link
          href="/calendar"
          className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20 hover:shadow-blue-600/30 transition-all"
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Launch Bot to Meeting</span>
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
                  ? 'bg-zinc-800/80 text-white shadow-sm border border-zinc-700/60'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
              }`}
            >
              <div
                className={`p-1.5 rounded-lg transition-colors ${
                  active
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                    : 'text-zinc-400 group-hover:text-zinc-200 group-hover:bg-zinc-800/50'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
              </div>
              <div className="flex-1 truncate">
                <div className="flex items-center justify-between">
                  <span className="truncate">{label}</span>
                  {active && (
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-sm shadow-blue-400" />
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

      {/* Integrations Status Pill */}
      <div className="px-4 py-3 mx-3 mb-3 rounded-xl bg-zinc-900/50 border border-zinc-800/60">
        <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-2 font-medium">
          <span className="flex items-center gap-1.5">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            Active Engines
          </span>
          <span className="text-emerald-400 text-[10px] font-semibold">Ready</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-zinc-400 font-mono">
          <span className="px-2 py-0.5 rounded bg-zinc-800/80 border border-zinc-700/40 text-emerald-400">
            Meet
          </span>
          <span className="px-2 py-0.5 rounded bg-zinc-800/80 border border-zinc-700/40 text-blue-400">
            Zoom
          </span>
          <span className="px-2 py-0.5 rounded bg-zinc-800/80 border border-zinc-700/40 text-purple-400">
            Claude 3.7
          </span>
        </div>
      </div>

      {/* User Card & Sign Out */}
      <div className="p-3 border-t border-zinc-800/70 bg-zinc-950/60">
        <button
          onClick={signOut}
          className="flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-xs font-medium text-zinc-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-300 font-bold border border-zinc-700">
              U
            </div>
            <div className="text-left">
              <p className="text-zinc-200 text-xs font-semibold leading-tight group-hover:text-red-400">
                Sign out
              </p>
              <p className="text-[10px] text-zinc-500 leading-tight">
                End session
              </p>
            </div>
          </div>
          <LogOut className="w-4 h-4 text-zinc-500 group-hover:text-red-400 transition-colors shrink-0" />
        </button>
      </div>
    </aside>
  )
}
