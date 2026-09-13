import { cookies } from 'next/headers'
import { MeetingDetailClient } from './MeetingDetailClient'
import { notFound } from 'next/navigation'

const MEETINGS_URL = process.env.NEXT_PUBLIC_MEETINGS_SERVICE_URL || 'http://localhost:8081'

export default async function MeetingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const cookieStore = await cookies()
  const token = cookieStore.get('meetbot_token')?.value || ''

  const res = await fetch(`${MEETINGS_URL}/meetings/${id}`, {
    headers: { Cookie: `meetbot_token=${token}` },
    cache: 'no-store',
  })
  if (!res.ok) notFound()
  const meeting = await res.json()

  return <MeetingDetailClient meeting={meeting} />
}
