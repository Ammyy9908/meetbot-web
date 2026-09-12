'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutGrid, Video, Calendar, LogOut } from 'lucide-react'

const NAV = [
  { href: '/dashboard', label: 'Dashboard',  icon: LayoutGrid },
  { href: '/meetings',  label: 'Meetings',   icon: Video       },
  { href: '/calendar',  label: 'Calendar',   icon: Calendar    },
]

const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || 'http://localhost:8080'

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function signOut() {
    await fetch(`${AUTH_URL}/auth/logout`, { method: 'POST', credentials: 'include' })
    router.push('/')
  }

  return (
    /*
     * Frosted glass approximation — Apple uses a native NSVisualEffectView with vibrancy
     * that cannot be replicated exactly on web. This uses backdrop-filter blur with a
     * semi-transparent background as the closest CSS equivalent.
     */
    <aside style={{
      width: '220px',
      flexShrink: 0,
      borderRight: '1px solid #38383a',
      /* Frosted glass approximation */
      background: 'rgba(28, 28, 30, 0.85)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'sticky',
      top: 0,
      fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif",
    }}>

      {/* App wordmark */}
      <div style={{
        padding: '20px 16px 16px',
        borderBottom: '1px solid #38383a',
      }}>
        <span style={{
          color: '#ffffff',
          fontWeight: 700,
          fontSize: '17px',
          letterSpacing: '-0.02em',
        }}>
          MeetBot
        </span>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '12px 8px' }}>
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '9px 10px',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: active ? 600 : 400,
                color: active ? '#0a84ff' : 'rgba(235,235,245,0.6)',
                textDecoration: 'none',
                background: active ? 'rgba(10,132,255,0.12)' : 'transparent',
                transition: 'background 0.15s ease, color 0.15s ease',
                marginBottom: '2px',
              }}
            >
              <Icon
                size={16}
                strokeWidth={active ? 2 : 1.5}
                style={{ flexShrink: 0 }}
              />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Sign out */}
      <div style={{ borderTop: '1px solid #38383a', padding: '8px 8px 16px' }}>
        <button
          onClick={signOut}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            width: '100%',
            padding: '9px 10px',
            borderRadius: '8px',
            fontSize: '15px',
            fontWeight: 400,
            color: 'rgba(235,235,245,0.6)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'left',
            fontFamily: 'inherit',
            transition: 'color 0.15s ease',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#ff453a' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(235,235,245,0.6)' }}
        >
          <LogOut size={16} strokeWidth={1.5} style={{ flexShrink: 0 }} />
          Sign out
        </button>
      </div>
    </aside>
  )
}
