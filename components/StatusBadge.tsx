/* Apple HIG pill-shaped status badges — colored backgrounds at 15% opacity with full-opacity text */
const CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  queued:        { label: 'Queued',     color: 'rgba(235,235,245,0.6)',  bg: 'rgba(235,235,245,0.08)' },
  joining:       { label: 'Joining',   color: '#ffd60a',                bg: 'rgba(255,214,10,0.15)'  },
  'in-progress': { label: 'Recording', color: '#0a84ff',                bg: 'rgba(10,132,255,0.15)'  },
  done:          { label: 'Done',      color: '#30d158',                bg: 'rgba(48,209,88,0.15)'   },
  failed:        { label: 'Failed',    color: '#ff453a',                bg: 'rgba(255,69,58,0.15)'   },
}

export function StatusBadge({ status }: { status: string }) {
  const cfg = CONFIG[status] || CONFIG.queued
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif",
      fontSize: '12px',
      fontWeight: 500,
      letterSpacing: '-0.01em',
      color: cfg.color,
      background: cfg.bg,
      padding: '3px 10px',
      borderRadius: '20px',
      whiteSpace: 'nowrap',
    }}>
      {cfg.label}
    </span>
  )
}
