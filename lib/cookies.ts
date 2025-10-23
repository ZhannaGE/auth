export interface UserSession {
  id: string
  name: string
  email: string
  accessToken: string
  createdAt: string
}

const SESSION_COOKIE_NAME = "auth_session"

export function setSessionCookie(session: UserSession) {
  if (typeof document === "undefined") return

  const expires = new Date()
  expires.setDate(expires.getDate() + 7)

  document.cookie = `${SESSION_COOKIE_NAME}=${JSON.stringify(session)}; expires=${expires.toUTCString()}; path=/; SameSite=Strict`
}

export function getSessionCookie(): UserSession | null {
  if (typeof document === "undefined") return null

  const cookies = document.cookie.split("; ")
  const sessionCookie = cookies.find((cookie) => cookie.startsWith(`${SESSION_COOKIE_NAME}=`))

  if (!sessionCookie) return null

  try {
    const value = sessionCookie.split("=")[1]
    return JSON.parse(decodeURIComponent(value))
  } catch {
    return null
  }
}

export function clearSessionCookie() {
  if (typeof document === "undefined") return

  document.cookie = `${SESSION_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict`
}
