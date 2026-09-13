'use client'

interface StatusConfig {
  label: string
  color: string
  bg: string
  border: string
  dotColor: string
  isLive?: boolean
}

const CONFIG: Record<string, StatusConfig> = {
  queued: {
    label: 'Queued',
    color: '#a1a1aa',
    bg: 'rgba(161, 161, 170, 0.08)',
    border: 'rgba(161, 161, 170, 0.2)',
    dotColor: '#a1a1aa',
  },
  joining: {
    label: 'Joining Call',
    color: '#fbbf24',
    bg: 'rgba(251, 191, 36, 0.12)',
    border: 'rgba(251, 191, 36, 0.3)',
    dotColor: '#fbbf24',
    isLive: true,
  },
  'in-progress': {
    label: 'Recording & Diarizing',
    color: '#38bdf8',
    bg: 'rgba(56, 189, 248, 0.12)',
    border: 'rgba(56, 189, 248, 0.3)',
    dotColor: '#38bdf8',
    isLive: true,
  },
  done: {
    label: 'Summarized',
    color: '#34d399',
    bg: 'rgba(52, 211, 153, 0.12)',
    border: 'rgba(52, 211, 153, 0.25)',
    dotColor: '#34d399',
  },
  failed: {
    label: 'Failed',
    color: '#f87171',
    bg: 'rgba(248, 113, 113, 0.12)',
    border: 'rgba(248, 113, 113, 0.25)',
    dotColor: '#f87171',
  },
}

export function StatusBadge({ status }: { status: string }) {
  const cfg = CONFIG[status] || CONFIG.queued

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium tracking-tight transition-all"
      style={{
        color: cfg.color,
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
      }}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${cfg.isLive ? 'animate-pulse' : ''}`}
        style={{ backgroundColor: cfg.dotColor }}
      />
      {cfg.label}
    </span>
  )
}
