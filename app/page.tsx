'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  CalendarCheck, 
  Mic, 
  Users, 
  FileText, 
  Zap, 
  Check, 
  ArrowRight, 
  Menu, 
  X,
  Video
} from 'lucide-react'

export default function LandingPage() {
  const authUrl = process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || 'http://localhost:8080'
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const features = [
    {
      icon: CalendarCheck,
      title: 'Auto-joins from Calendar',
      desc: 'Connect Google Calendar once. Bot joins every scheduled Meet & Zoom call automatically — no links, no copy-paste, no reminders needed.',
      wide: true,
    },
    {
      icon: Mic,
      title: 'Indian English optimized',
      desc: 'Powered by Deepgram nova-3 with en-IN support. Handles accents, Hinglish, and corporate jargon accurately.',
      wide: false,
    },
    {
      icon: Users,
      title: 'Speaker attribution',
      desc: 'Know who said what. Diarized timeline view shows each speaker\'s contributions with exact timestamps.',
      wide: false,
    },
    {
      icon: FileText,
      title: 'Structured summaries',
      desc: 'Every meeting produces a TL;DR, key decisions, action items with owners and due dates, and a parking lot for unresolved topics.',
      wide: false,
    },
    {
      icon: Zap,
      title: 'In your inbox in 2 minutes',
      desc: 'Summary lands in the organizer\'s inbox within 2 minutes of the meeting ending. No dashboard to check.',
      wide: false,
    },
  ]

  const steps = [
    {
      num: '01',
      title: 'Connect your calendar',
      desc: 'Sign in with Google. MeetBot watches your calendar for upcoming Google Meet and Zoom events.',
    },
    {
      num: '02',
      title: 'Bot joins automatically',
      desc: 'At meeting time, the bot joins as a participant. No action needed from you or other attendees.',
    },
    {
      num: '03',
      title: 'Meeting runs normally',
      desc: 'Talk as usual. The bot listens, transcribes in real time, and identifies each speaker.',
    },
    {
      num: '04',
      title: 'Summary in your inbox',
      desc: 'Within 2 minutes of the meeting ending, a structured summary lands in the organizer\'s email.',
    },
  ]

  const plans = [
    {
      name: 'Free',
      price: '₹0',
      period: 'forever',
      desc: 'For individuals who want to try MeetBot.',
      cta: 'Get started free',
      highlight: false,
      features: [
        '5 meetings per month',
        'Google Meet & Zoom support',
        'TL;DR + action items',
        'Email delivery',
        'Speaker attribution',
      ],
    },
    {
      name: 'Pro',
      price: '₹499',
      period: 'per month',
      desc: 'For teams that run on meetings.',
      cta: 'Start Pro trial',
      highlight: true,
      features: [
        'Unlimited meetings',
        'Google Meet & Zoom S2S support',
        'Full structured summaries',
        'Email & workspace delivery',
        'Speaker attribution with names',
        'Meeting history dashboard',
        'Priority support',
      ],
    },
  ]

  const testimonials = [
    {
      quote: "We run 6-8 meetings a day across three cities. MeetBot saves us at least 90 minutes of note-taking and follow-up writing every single day.",
      name: "Karthik Rajan",
      role: "VP Engineering",
      company: "Nahar Technologies",
    },
    {
      quote: "The action items it extracts are genuinely accurate. It picks up who said what and turns it into tasks. Our project managers love it.",
      name: "Deepika Shenoy",
      role: "Head of Product",
      company: "Vridhi Finance",
    },
    {
      quote: "Finally a bot that handles Indian English properly. No more fixing transcription errors for Bangalore and Hyderabad team calls.",
      name: "Arjun Malhotra",
      role: "Founding Engineer",
      company: "Claro Health",
    },
  ]

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 selection:bg-emerald-500/30 selection:text-white">
      
      {/* Top Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-sm font-semibold tracking-tight text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>MeetBot</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              {[
                ['Features', '#features'],
                ['How it works', '#how-it-works'],
                ['Pricing', '#pricing'],
                ['Testimonials', '#testimonials'],
              ].map(([label, href]) => (
                <a
                  key={label}
                  href={href}
                  className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors duration-150"
                >
                  {label}
                </a>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`${authUrl}/auth/google`}
              className="hidden md:inline-flex text-sm text-zinc-400 hover:text-zinc-100 transition-colors duration-150"
            >
              Sign in
            </a>
            <a
              href={`${authUrl}/auth/google`}
              className="inline-flex items-center px-4 py-1.5 rounded-md text-sm font-medium bg-emerald-500 text-zinc-950 hover:bg-emerald-400 active:scale-95 transition-all duration-150"
            >
              Get started
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1 text-zinc-400"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-zinc-800 bg-zinc-950 px-5 py-4 flex flex-col gap-3">
            {[
              ['Features', '#features'],
              ['How it works', '#how-it-works'],
              ['Pricing', '#pricing'],
              ['Testimonials', '#testimonials'],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                className="text-sm text-zinc-400 py-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                {label}
              </a>
            ))}
            <a href={`${authUrl}/auth/google`} className="text-sm text-zinc-400 py-1">
              Sign in
            </a>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="min-h-[100dvh] flex items-center pt-14">
        <div className="max-w-6xl mx-auto px-5 py-24 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column: Copy */}
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-medium text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-full px-3 py-1 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Built for Indian corporate teams
            </div>

            <h1 className="text-5xl md:text-6xl font-semibold tracking-tight leading-[1.08] text-white mb-6">
              Your meetings,<br />
              <span className="text-zinc-400">finally summarized.</span>
            </h1>

            <p className="text-lg text-zinc-400 leading-relaxed mb-8 max-w-md">
              MeetBot joins your Google Meet & Zoom calls, transcribes with Indian English support, and emails structured summaries with decisions and action items.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={`${authUrl}/auth/google`}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold bg-emerald-500 text-zinc-950 hover:bg-emerald-400 active:scale-95 transition-all duration-150 shadow-lg shadow-emerald-500/10"
              >
                Start for free
                <ArrowRight size={14} className="stroke-[2.5]" />
              </a>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg text-sm font-medium text-zinc-400 border border-zinc-800 hover:border-zinc-600 hover:text-zinc-200 transition-all duration-150"
              >
                See how it works
              </a>
            </div>

            <p className="mt-5 text-xs text-zinc-600">
              No credit card required. Works with Google Meet and Zoom.
            </p>
          </div>

          {/* Right Column: Live Summary Card Mockup */}
          <div className="relative">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 shadow-2xl shadow-black/40">
              {/* Card Header */}
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-zinc-800">
                <div>
                  <p className="text-xs text-zinc-500 mb-0.5">Product Standup</p>
                  <p className="text-sm font-medium text-zinc-100">Meeting Summary</p>
                </div>
                <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full px-2.5 py-0.5 font-medium">
                  Done
                </span>
              </div>

              {/* TL;DR Box */}
              <div className="mb-4 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/15">
                <p className="text-xs font-semibold text-emerald-400 mb-1.5 uppercase tracking-wider">
                  TL;DR
                </p>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  Team aligned on Q4 priorities. API migration moved to next sprint. Design review scheduled for Thursday.
                </p>
              </div>

              {/* Action items list */}
              <div>
                <p className="text-xs font-semibold text-zinc-500 mb-2.5 uppercase tracking-wider">
                  Action Items
                </p>
                <div className="space-y-2">
                  {[
                    { owner: 'Rahul', task: 'Finalize API spec doc', due: 'Fri' },
                    { owner: 'Priya', task: 'Share design mockups', due: 'Thu' },
                    { owner: 'Sumit', task: 'Update roadmap in Notion', due: 'Mon' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm">
                      <div className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0">
                        <span className="text-[9px] font-bold text-zinc-400">{item.owner[0]}</span>
                      </div>
                      <span className="text-zinc-300 flex-1 text-xs sm:text-sm">{item.task}</span>
                      <span className="text-xs text-zinc-600 font-mono">{item.due}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Footer */}
              <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between">
                <span className="text-xs text-zinc-600 font-mono">3 speakers · 28 min</span>
                <span className="text-xs text-zinc-600">Sent to sumit@company.com</span>
              </div>
            </div>

            {/* Subtle glow */}
            <div className="absolute -inset-px rounded-xl bg-gradient-to-tr from-emerald-500/5 to-transparent pointer-events-none" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 border-t border-zinc-800/50">
        <div className="max-w-6xl mx-auto px-5">
          <div className="mb-14">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-4">
              Everything you need.<br className="hidden md:block" /> Nothing you don't.
            </h2>
            <p className="text-zinc-400 text-lg max-w-lg">
              MeetBot handles the whole pipeline from joining to delivery. You just show up.
            </p>
          </div>

          {/* Asymmetric Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Wide card (col-span-2) */}
            <div className="md:col-span-2 rounded-xl border border-zinc-800 bg-zinc-900 p-6 flex flex-col justify-between min-h-[200px] hover:border-zinc-700 transition-colors duration-200">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
                <CalendarCheck size={18} className="text-emerald-400" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white mb-2">{features[0].title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed max-w-sm">{features[0].desc}</p>
              </div>
            </div>

            {/* Normal cards */}
            {features.slice(1).map(f => {
              const Icon = f.icon
              return (
                <div
                  key={f.title}
                  className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 flex flex-col justify-between min-h-[180px] hover:border-zinc-700 transition-colors duration-200"
                >
                  <div className="w-9 h-9 rounded-lg bg-zinc-800 flex items-center justify-center mb-4">
                    <Icon size={18} className="text-zinc-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-white mb-2">{f.title}</h3>
                    <p className="text-sm text-zinc-400 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 border-t border-zinc-800/50">
        <div className="max-w-6xl mx-auto px-5">
          <div className="mb-14">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-4">
              Set up once. Works forever.
            </h2>
            <p className="text-zinc-400 text-lg max-w-lg">
              Four steps from signup to structured summaries in your inbox.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-zinc-800 rounded-xl overflow-hidden">
            {steps.map(step => (
              <div key={step.num} className="bg-zinc-900 p-6">
                <div className="font-mono text-xs text-emerald-400 font-semibold mb-4 tracking-wider">
                  {step.num}
                </div>
                <h3 className="text-base font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 border-t border-zinc-800/50">
        <div className="max-w-6xl mx-auto px-5">
          <div className="mb-14">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-4">
              Simple pricing.
            </h2>
            <p className="text-zinc-400 text-lg max-w-md">
              Start free. Upgrade when your team needs more.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
            {plans.map(plan => (
              <div
                key={plan.name}
                className={`rounded-xl border p-6 flex flex-col ${
                  plan.highlight
                    ? 'border-emerald-500/40 bg-emerald-500/5'
                    : 'border-zinc-800 bg-zinc-900'
                }`}
              >
                {plan.highlight && (
                  <div className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2.5 py-0.5 w-fit mb-3">
                    Most popular
                  </div>
                )}
                <div className="mb-4">
                  <p className="text-sm font-medium text-zinc-400 mb-1">{plan.name}</p>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-bold text-white">{plan.price}</span>
                    <span className="text-sm text-zinc-500">/ {plan.period}</span>
                  </div>
                  <p className="text-sm text-zinc-500 mt-1.5">{plan.desc}</p>
                </div>

                <ul className="space-y-2.5 mb-6 flex-1">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-zinc-300">
                      <Check size={14} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <a
                  href={`${authUrl}/auth/google`}
                  className={`inline-flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 active:scale-95 ${
                    plan.highlight
                      ? 'bg-emerald-500 text-zinc-950 hover:bg-emerald-400 font-semibold'
                      : 'bg-zinc-800 text-zinc-100 hover:bg-zinc-700 border border-zinc-700'
                  }`}
                >
                  {plan.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 border-t border-zinc-800/50">
        <div className="max-w-6xl mx-auto px-5">
          <div className="mb-14">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-4">
              Teams that run fewer repeat meetings.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {testimonials.map(t => (
              <div
                key={t.name}
                className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 flex flex-col gap-4"
              >
                <p className="text-sm text-zinc-300 leading-relaxed flex-1">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-2 border-t border-zinc-800">
                  <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-semibold text-zinc-300">
                      {t.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-200">{t.name}</p>
                    <p className="text-xs text-zinc-500">{t.role}, {t.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 border-t border-zinc-800/50">
        <div className="max-w-6xl mx-auto px-5">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 px-8 py-14 text-center relative overflow-hidden">
            {/* Subtle radial gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(52,211,153,0.06)_0%,transparent_70%)] pointer-events-none" />

            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-4 relative">
              Stop writing meeting notes.<br className="hidden md:block" /> Start shipping.
            </h2>
            <p className="text-zinc-400 text-lg mb-8 max-w-md mx-auto relative">
              Join teams across India who get structured summaries without lifting a finger.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center relative">
              <a
                href={`${authUrl}/auth/google`}
                className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-lg text-sm font-semibold bg-emerald-500 text-zinc-950 hover:bg-emerald-400 active:scale-95 transition-all duration-150 shadow-lg shadow-emerald-500/10"
              >
                Get started free
                <ArrowRight size={14} className="stroke-[2.5]" />
              </a>
            </div>
            <p className="mt-4 text-xs text-zinc-600 relative">
              No credit card required. 5 free meetings every month.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800/50 py-8">
        <div className="max-w-6xl mx-auto px-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <span className="text-sm font-semibold text-white">MeetBot</span>
            <span className="text-xs text-zinc-600">
              &copy; {new Date().getFullYear()} MeetBot. All rights reserved.
            </span>
          </div>
          <div className="flex items-center gap-5">
            {['Privacy', 'Terms', 'Contact'].map(link => (
              <a key={link} href="#" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
                {link}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
