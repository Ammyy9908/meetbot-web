const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || 'http://localhost:8080'

export async function getMe(): Promise<{ id: string; email: string; name: string; avatarUrl: string } | null> {
  try {
    const res = await fetch(`${AUTH_URL}/auth/me`, {
      credentials: 'include',
      cache: 'no-store',
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}
