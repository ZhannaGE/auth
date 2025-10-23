"use client"

import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"
import { setSessionCookie, type UserSession } from "@/lib/cookies"

interface SuccessScreenProps {
  email: string
  name?: string
}

export function SuccessScreen({ email, name }: SuccessScreenProps) {
  useEffect(() => {
    const session: UserSession = {
      id: `user_${Math.random().toString(36).substring(7)}`,
      name: name || email.split("@")[0],
      email,
      accessToken: `access_${Math.random().toString(36).substring(7)}`,
      createdAt: new Date().toISOString(),
    }

    setSessionCookie(session)
  }, [email, name])

  const displayName = name || email.split("@")[0]

  return (
    <Card className="w-full max-w-md shadow-xl border-0 animate-in fade-in zoom-in-95">
      <CardHeader className="space-y-4 text-center pb-6">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center animate-in zoom-in">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        <CardTitle className="text-2xl font-semibold text-balance">Добро пожаловать!</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-center">
        <div className="space-y-2">
          <p className="text-lg text-muted-foreground">Вы успешно вошли в систему</p>
          <p className="text-2xl font-semibold text-foreground">{displayName}</p>
        </div>
        <div className="pt-4 pb-2">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium">
            <CheckCircle2 className="w-4 h-4" />
            Аутентификация успешна
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
