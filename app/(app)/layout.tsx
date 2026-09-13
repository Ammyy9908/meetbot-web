import { Sidebar } from '@/components/Sidebar'
import { Sparkles, ShieldCheck, Search, Activity } from 'lucide-react'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[100dvh] bg-[#09090b] text-zinc-100">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top SaaS Header */}
        <header className="h-14 border-b border-zinc-800/80 bg-zinc-950/60 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-zinc-400">Workspace</span>
            <span className="text-zinc-600">/</span>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Production Bot Core
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900/80 border border-zinc-800/80 text-xs text-zinc-400">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>Multi-Platform AI Engine Active</span>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
