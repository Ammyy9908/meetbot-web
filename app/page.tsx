'use client'

import { useState } from 'react'
import { 
  Sparkles, 
  Video, 
  Bot, 
  Zap, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Mail, 
  BrainCircuit, 
  Clock, 
  Users, 
  Layers, 
  Check, 
  X,
  Play,
  FileText
} from 'lucide-react'

export default function LandingPage() {
  const authUrl = process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || 'http://localhost:8080'
  const [activeTab, setActiveTab] = useState<'summary' | 'decisions' | 'actions' | 'transcript'>('summary')

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 selection:bg-blue-500/30 selection:text-white relative overflow-hidden">
      
      {/* Ambient background glow & grid */}
      <div className="absolute inset-0 saas-grid-bg opacity-30 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-blue-600/15 via-indigo-600/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute top-[600px] right-0 w-[500px] h-[500px] bg-purple-600/10 blur-[120px] pointer-events-none" />

      {/* Top Navbar */}
      <header className="relative z-30 max-w-7xl mx-auto px-6 py-5 flex items-center justify-between border-b border-zinc-800/60 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 p-[1px] shadow-lg shadow-blue-500/20">
            <div className="w-full h-full bg-zinc-950 rounded-[11px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-blue-400" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg tracking-tight text-white">MeetBot</span>
            <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/25">
              v2.0
            </span>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#demo" className="hover:text-white transition-colors">Product Demo</a>
          <a href="#comparison" className="hover:text-white transition-colors">Why MeetBot</a>
        </nav>

        {/* Auth CTA */}
        <div className="flex items-center gap-4">
          <a
            href={`${authUrl}/auth/google`}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-semibold shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 transition-all active:scale-[0.98]"
          >
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none" className="shrink-0">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="currentColor"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="currentColor"/>
              <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="currentColor"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="currentColor"/>
            </svg>
            <span>Sign In with Google</span>
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-20 pt-20 pb-16 px-6 text-center max-w-5xl mx-auto">
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-700/60 shadow-inner mb-6 backdrop-blur-md">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-medium text-zinc-300">
            MeetBot 2.0 • Autonomous Zoom & Google Meet Intelligence
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1] mb-6">
          Transform meeting chaos into <br className="hidden sm:inline"/>
          <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
            instant executive intelligence.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-10">
          MeetBot joins your Google Meet and Zoom calls autonomously, diarizes speakers with Deepgram Nova-3, extracts structured decisions with Claude 3.7, and emails executive briefings in seconds.
        </p>

        {/* CTA Group */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <a
            href={`${authUrl}/auth/google`}
            className="flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-base shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 transition-all w-full sm:w-auto"
          >
            <svg width="20" height="20" viewBox="0 0 18 18" fill="none" className="shrink-0">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="currentColor"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="currentColor"/>
              <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="currentColor"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="currentColor"/>
            </svg>
            <span>Start Free with Google</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          <a
            href="#demo"
            className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 font-semibold text-sm border border-zinc-800 hover:border-zinc-700 transition-all w-full sm:w-auto"
          >
            <Play className="w-4 h-4 text-blue-400 fill-blue-400" />
            <span>Interactive Demo</span>
          </a>
        </div>

        {/* Social Proof Stats */}
        <div className="flex flex-wrap items-center justify-center gap-8 text-xs text-zinc-400 border-t border-zinc-800/60 pt-8 max-w-3xl mx-auto">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Zero install / No Chrome extension required</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Full Zoom & Google Meet Support</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Indian & Global English Accents</span>
          </div>
        </div>
      </section>

      {/* Interactive Product Demo Showcase */}
      <section id="demo" className="relative z-20 max-w-6xl mx-auto px-6 py-12">
        <div className="rounded-3xl border border-zinc-800/80 bg-zinc-950/80 shadow-2xl shadow-blue-500/10 overflow-hidden backdrop-blur-2xl">
          
          {/* Mock App Window Header */}
          <div className="bg-zinc-900/90 px-6 py-4 border-b border-zinc-800 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <div className="h-4 w-[1px] bg-zinc-700 mx-1" />
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-white">Q3 Architecture & Sprint Planning</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  Zoom Call
                </span>
              </div>
            </div>

            {/* Live Audio & Status */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Live Audio Waveform</span>
                <div className="flex items-center gap-0.5 h-3 ml-1">
                  <span className="w-0.5 bg-emerald-400 animate-wave-1 rounded-full" />
                  <span className="w-0.5 bg-emerald-400 animate-wave-2 rounded-full" />
                  <span className="w-0.5 bg-emerald-400 animate-wave-3 rounded-full" />
                  <span className="w-0.5 bg-emerald-400 animate-wave-4 rounded-full" />
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Workspace Body */}
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[480px]">
            
            {/* Left: Diarized Speaker Live Stream */}
            <div className="lg:col-span-5 p-6 border-b lg:border-b-0 lg:border-r border-zinc-800/80 bg-zinc-950/40 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Live Diarized Transcript
                  </span>
                  <span className="text-[11px] text-zinc-500 font-mono">Deepgram Nova-3</span>
                </div>

                {/* Speaker Dialogue items */}
                <div className="space-y-3.5">
                  <div className="flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-[10px] font-bold text-blue-400 shrink-0">
                      SK
                    </div>
                    <div className="bg-zinc-900/80 border border-zinc-800/80 p-3 rounded-xl rounded-tl-none">
                      <div className="flex items-center justify-between gap-4 mb-1">
                        <span className="text-xs font-semibold text-blue-400">Sumit Kumar (Lead)</span>
                        <span className="text-[10px] text-zinc-500 font-mono">00:14</span>
                      </div>
                      <p className="text-xs text-zinc-300 leading-relaxed">
                        Let's finalize the Zoom Server-to-Server OAuth integration. We need the bot to automatically join and record without requiring manual host authorization.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-[10px] font-bold text-emerald-400 shrink-0">
                      PK
                    </div>
                    <div className="bg-zinc-900/80 border border-zinc-800/80 p-3 rounded-xl rounded-tl-none">
                      <div className="flex items-center justify-between gap-4 mb-1">
                        <span className="text-xs font-semibold text-emerald-400">Priya K. (Backend)</span>
                        <span className="text-[10px] text-zinc-500 font-mono">00:38</span>
                      </div>
                      <p className="text-xs text-zinc-300 leading-relaxed">
                        Agreed. I have set up the Zoom REST API endpoints. The deepgram stream will send the raw PCM audio directly to the diarizer.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-[10px] font-bold text-purple-400 shrink-0">
                      AI
                    </div>
                    <div className="bg-purple-950/20 border border-purple-800/40 p-3 rounded-xl rounded-tl-none">
                      <div className="flex items-center justify-between gap-4 mb-1">
                        <span className="text-xs font-semibold text-purple-400 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> MeetBot Intelligence
                        </span>
                        <span className="text-[10px] text-purple-300 font-mono">Real-time</span>
                      </div>
                      <p className="text-xs text-purple-200 leading-relaxed">
                        Detected 2 action items and 1 key architectural decision. Updating executive summary...
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center justify-between text-[11px] text-zinc-500">
                <span>3 Participants Diarized</span>
                <span className="text-emerald-400">99.4% Transcription Accuracy</span>
              </div>
            </div>

            {/* Right: AI Executive Summary & Action Items */}
            <div className="lg:col-span-7 p-6 flex flex-col justify-between bg-zinc-900/30">
              <div>
                {/* Tab selector */}
                <div className="flex gap-2 p-1 bg-zinc-900/80 border border-zinc-800 rounded-xl mb-6">
                  <button
                    onClick={() => setActiveTab('summary')}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                      activeTab === 'summary'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    AI Summary
                  </button>
                  <button
                    onClick={() => setActiveTab('decisions')}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                      activeTab === 'decisions'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    Decisions (2)
                  </button>
                  <button
                    onClick={() => setActiveTab('actions')}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                      activeTab === 'actions'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    Action Items (2)
                  </button>
                </div>

                {/* Tab content */}
                {activeTab === 'summary' && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-100">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400 block mb-1">
                        Executive Overview
                      </span>
                      <p className="text-sm leading-relaxed text-zinc-200">
                        The team reviewed the deployment architecture for the automated meeting intelligence pipeline. Finalized transition to unified multi-platform Zoom S2S and Google Meet recording nodes.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
                        Key Discussion Points
                      </span>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2 text-xs text-zinc-300">
                          <span className="text-emerald-400 font-bold">•</span>
                          <span>Zoom Server-to-Server OAuth eliminates manual host bot admitting overhead.</span>
                        </div>
                        <div className="flex items-start gap-2 text-xs text-zinc-300">
                          <span className="text-emerald-400 font-bold">•</span>
                          <span>Deepgram Nova-3 model selected for superior Indian English dialect accuracy.</span>
                        </div>
                        <div className="flex items-start gap-2 text-xs text-zinc-300">
                          <span className="text-emerald-400 font-bold">•</span>
                          <span>Summaries will be automatically emailed to all calendar invitees post-call.</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'decisions' && (
                  <div className="space-y-3 animate-in fade-in duration-200">
                    <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 flex items-start gap-3">
                      <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-bold text-xs">
                        01
                      </span>
                      <p className="text-xs text-zinc-200 leading-relaxed">
                        Deploy Zoom REST API `/bot/zoom/create-meeting` endpoint for 1-click automatic Zoom scheduling.
                      </p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 flex items-start gap-3">
                      <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-bold text-xs">
                        02
                      </span>
                      <p className="text-xs text-zinc-200 leading-relaxed">
                        Standardize Claude 3.7 prompts for structured JSON output across all executive reports.
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === 'actions' && (
                  <div className="space-y-2.5 animate-in fade-in duration-200">
                    <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded border border-zinc-700 flex items-center justify-center text-blue-400 bg-zinc-950">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-white">Deploy Zoom S2S OAuth keys to EC2</p>
                          <p className="text-[11px] text-zinc-400">Assigned to: Sumit Kumar</p>
                        </div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20 font-medium">
                        High Priority
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded border border-zinc-700 flex items-center justify-center text-blue-400 bg-zinc-950">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-white">Configure Resend SMTP attendee distribution</p>
                          <p className="text-[11px] text-zinc-400">Assigned to: Priya K.</p>
                        </div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 font-medium">
                        Due Today
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom email dispatch banner */}
              <div className="mt-6 pt-4 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
                <span className="flex items-center gap-1.5 text-zinc-300">
                  <Mail className="w-3.5 h-3.5 text-blue-400" />
                  Auto-emailed to 4 attendees on call end
                </span>
                <span className="text-emerald-400 font-medium">Delivered in 18s</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise Feature Grid */}
      <section id="features" className="relative z-20 max-w-7xl mx-auto px-6 py-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-blue-400 mb-3">
            Engineered for Modern Teams
          </h2>
          <p className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Everything your team needs to eliminate manual note-taking forever.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: Bot,
              color: 'text-blue-400',
              bg: 'bg-blue-500/10',
              border: 'border-blue-500/20',
              title: 'Zero-Click Calendar Sync',
              desc: 'Connects with Google Calendar. MeetBot detects Google Meet & Zoom links and joins right on time automatically.',
            },
            {
              icon: Video,
              color: 'text-cyan-400',
              bg: 'bg-cyan-500/10',
              border: 'border-cyan-500/20',
              title: 'Dual Platform: Meet & Zoom',
              desc: 'Unified bot engine that handles both Google Meet and Zoom calls seamlessly via official Server-to-Server OAuth APIs.',
            },
            {
              icon: BrainCircuit,
              color: 'text-purple-400',
              bg: 'bg-purple-500/10',
              border: 'border-purple-500/20',
              title: 'Nova-3 Diarization',
              desc: 'State-of-the-art speech recognition fine-tuned for Indian English accents, complex corporate jargon, and audio crosstalk.',
            },
            {
              icon: Layers,
              color: 'text-emerald-400',
              bg: 'bg-emerald-500/10',
              border: 'border-emerald-500/20',
              title: 'Claude 3.7 Intelligence',
              desc: 'Generates structured executive TL;DRs, key architectural decisions, and prioritized action items with zero fluff.',
            },
            {
              icon: Mail,
              color: 'text-yellow-400',
              bg: 'bg-yellow-500/10',
              border: 'border-yellow-500/20',
              title: 'Instant Email Briefings',
              desc: 'Executive summaries sent straight to your inbox and meeting attendees within 30 seconds of the call wrapping up.',
            },
            {
              icon: ShieldCheck,
              color: 'text-rose-400',
              bg: 'bg-rose-500/10',
              border: 'border-rose-500/20',
              title: 'Enterprise Privacy & Security',
              desc: 'Encrypted audio streams, secure token storage, and strict workspace isolation. Your meeting data is never used for training.',
            },
          ].map((feature, i) => {
            const Icon = feature.icon
            return (
              <div
                key={i}
                className="saas-glow-card p-6 rounded-2xl flex flex-col justify-between"
              >
                <div>
                  <div className={`w-10 h-10 rounded-xl ${feature.bg} border ${feature.border} flex items-center justify-center mb-4`}>
                    <Icon className={`w-5 h-5 ${feature.color}`} />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2 tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Comparison Matrix: MeetBot vs Traditional Recorders */}
      <section id="comparison" className="relative z-20 max-w-5xl mx-auto px-6 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-blue-400 mb-2">
            Comparison
          </h2>
          <p className="text-2xl sm:text-3xl font-bold text-white">
            Why High-Velocity Teams Choose MeetBot
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 overflow-hidden">
          <div className="grid grid-cols-3 p-4 bg-zinc-900/70 border-b border-zinc-800 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            <span>Feature</span>
            <span className="text-blue-400 text-center font-bold">MeetBot AI</span>
            <span className="text-zinc-500 text-center">Fireflies / Otter</span>
          </div>

          {[
            { feature: 'Google Meet & Zoom S2S Support', meetbot: true, others: 'Partial / Paid add-on' },
            { feature: 'Indian English Accent Accuracy', meetbot: 'Nova-3 Optimized', others: 'Standard models' },
            { feature: 'Claude 3.7 Executive Extraction', meetbot: true, others: false },
            { feature: 'Instant Inbox Delivery on Call End', meetbot: '< 30 seconds', others: '3 - 10 minutes' },
            { feature: 'One-Click Meeting Creator (Auto-Zoom)', meetbot: true, others: false },
            { feature: 'Clean Markdown & Direct Copy Notes', meetbot: true, others: false },
          ].map((row, i) => (
            <div
              key={i}
              className="grid grid-cols-3 p-4 border-b border-zinc-800/60 text-xs items-center hover:bg-zinc-900/30 transition-colors"
            >
              <span className="text-zinc-300 font-medium">{row.feature}</span>
              <span className="text-center text-emerald-400 font-semibold flex items-center justify-center gap-1">
                {typeof row.meetbot === 'boolean' ? <Check className="w-4 h-4 text-emerald-400" /> : row.meetbot}
              </span>
              <span className="text-center text-zinc-500">
                {typeof row.others === 'boolean' ? (row.others ? <Check className="w-4 h-4 text-zinc-400 mx-auto" /> : <X className="w-4 h-4 text-zinc-600 mx-auto" />) : row.others}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA Card */}
      <section className="relative z-20 max-w-5xl mx-auto px-6 py-20">
        <div className="rounded-3xl p-10 sm:p-14 bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-1/2 translate-x-1/2 w-[600px] h-[200px] bg-blue-500/10 blur-3xl pointer-events-none" />
          
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Never take notes in a meeting again.
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto mb-8 leading-relaxed">
            Connect your Google account in 10 seconds. MeetBot will automatically sync your upcoming calendar meetings and deliver summaries.
          </p>

          <div className="flex justify-center">
            <a
              href={`${authUrl}/auth/google`}
              className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-base shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 transition-all active:scale-[0.98]"
            >
              <svg width="20" height="20" viewBox="0 0 18 18" fill="none" className="shrink-0">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="currentColor"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="currentColor"/>
                <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="currentColor"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="currentColor"/>
              </svg>
              <span>Get Started with Google</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* SaaS Footer */}
      <footer className="border-t border-zinc-800/80 bg-zinc-950 py-10 px-6 text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-zinc-300">MeetBot</span>
            <span>— AI Meeting Intelligence Platform</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="/dashboard" className="hover:text-zinc-300 transition-colors">Dashboard</a>
            <a href="/calendar" className="hover:text-zinc-300 transition-colors">Calendar</a>
            <a href="/meetings" className="hover:text-zinc-300 transition-colors">Meetings</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
