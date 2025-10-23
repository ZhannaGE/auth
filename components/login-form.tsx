"use client"

import type React from "react"

import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import { mockLoginAPI } from "@/lib/mock-api"
import { ShieldCheck, AlertCircle, Eye, EyeOff } from "lucide-react"

interface LoginFormProps {
  onSuccess: (email: string, sessionToken: string, userName: string) => void
  onSwitchToRegister: () => void
}

export function LoginForm({ onSuccess, onSwitchToRegister }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const loginMutation = useMutation({
    mutationFn: mockLoginAPI,
    onSuccess: (data) => {
      onSuccess(email, data.sessionToken, data.userName)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    loginMutation.mutate({ email, password })
  }

  return (
    <Card className="w-full max-w-md shadow-xl border-0">
      <CardHeader className="space-y-3 text-center pb-6">
        <div className="mx-auto w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
          <ShieldCheck className="w-6 h-6 text-white" />
        </div>
        <CardTitle className="text-2xl font-semibold text-balance">Войдите в свой аккаунт</CardTitle>
        <CardDescription className="text-base">Введите свои данные для доступа</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email адрес</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loginMutation.isPending}
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Пароль</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Введите ваш пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loginMutation.isPending}
                className="h-11 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {loginMutation.isError && (
            <Alert variant="destructive" className="animate-in fade-in slide-in-from-top-1">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {loginMutation.error instanceof Error ? loginMutation.error.message : "Произошла ошибка при входе"}
              </AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-base font-medium"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? (
              <>
                <Spinner className="mr-2" />
                Вход...
              </>
            ) : (
              "Продолжить"
            )}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            <button type="button" className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
              Забыли пароль?
            </button>
          </div>

          <div className="text-center text-sm text-muted-foreground pt-2 border-t">
            Нет аккаунта?{" "}
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
              disabled={loginMutation.isPending}
            >
              Зарегистрироваться
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
