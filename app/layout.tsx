import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MeetBot',
  description: 'AI meeting summaries for Indian corporate teams',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-background text-foreground">
        {children}
      </body>
    </html>
  )
}
