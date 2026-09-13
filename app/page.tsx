'use client'

import { 
  CalendarCheck, 
  Mic, 
  Video, 
  Sparkles, 
  ArrowLeft, 
  ShieldCheck, 
  Zap, 
  CheckCircle2 
} from 'lucide-react'
import Link from 'next/link'

export default function AppLoginPage() {
  const authUrl = process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || 'https://api.meetbot.ink'
  const landingUrl = process.env.NEXT_PUBLIC_LANDING_URL || 'https://meetbot.ink'

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col justify-between selection:bg-emerald-500/30 selection:text-white p-6 relative overflow-hidden">
      
      {/* Ambient background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-emerald-500/5 blur-[120px] pointer-events-none" />

      {/* Top Header */}
      <header className="max-w-5xl w-full mx-auto flex items-center justify-between z-10">
        <a
          href={landingUrl}
          className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to meetbot.ink</span>
        </a>

        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-semibold text-zinc-300">Production Node Ready</span>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="max-w-md w-full mx-auto my-auto z-10">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-2xl shadow-black/60 relative">
          
          {/* Brand & Title */}
          <div className="text-center mb-8">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center mx-auto mb-4">
              <span className="w-3 h-3 rounded-full bg-emerald-400" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
              Sign in to MeetBot
            </h1>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-xs mx-auto">
              Access your meeting transcripts, AI executive summaries, and action item trackers.
            </p>
          </div>

          {/* Google Sign In CTA */}
          <div className="space-y-4 mb-8">
            <a
              href={`${authUrl}/auth/google`}
              className="flex items-center justify-center gap-3 w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold text-sm transition-all duration-150 active:scale-[0.98] shadow-lg shadow-emerald-500/15"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="shrink-0">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#09090b"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#09090b"/>
                <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#09090b"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#09090b"/>
              </svg>
              <span>Continue with Google</span>
            </a>

            <p className="text-[11px] text-zinc-500 text-center">
              Calendar permissions are used solely to auto-join scheduled calls.
            </p>
          </div>

          {/* Quick Features Checklist */}
          <div className="border-t border-zinc-800 pt-5 space-y-2.5">
            {[
              'Zero-click auto-join for Google Meet & Zoom',
              'Deepgram Nova-3 Indian English diarization',
              'Claude 3.7 TL;DRs, decisions & action items',
              'Automated email delivery on meeting wrap-up',
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-2.5 text-xs text-zinc-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl w-full mx-auto text-center text-xs text-zinc-600 z-10 py-4">
        &copy; {new Date().getFullYear()} MeetBot AI. All rights reserved.
      </footer>
    </div>
  )
}
