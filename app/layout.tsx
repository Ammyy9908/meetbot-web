import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist-sans' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })

export const metadata: Metadata = {
  title: 'MeetBot - AI Meeting Summaries for Indian Teams',
  description: 'Bot joins your Google Meet & Zoom calls, transcribes everything with Indian English support, and sends structured summaries with decisions and action items to your inbox.',
  openGraph: {
    title: 'MeetBot',
    description: 'Stop wasting time in meetings. Get structured AI summaries.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${geist.variable} ${geistMono.variable} antialiased bg-background text-foreground`}>
        {children}
      </body>
    </html>
  )
}
