"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useMutation } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import { mockVerify2FAAPI } from "@/lib/mock-api"
import { ShieldCheck, AlertCircle, ArrowLeft } from "lucide-react"

interface TwoFactorFormProps {
  email: string
  sessionToken: string
  onSuccess: () => void
  onBack: () => void
}

export function TwoFactorForm({ email, sessionToken, onSuccess, onBack }: TwoFactorFormProps) {
  const [code, setCode] = useState(["", "", "", "", "", ""])
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const verify2FAMutation = useMutation({
    mutationFn: mockVerify2FAAPI,
    onSuccess: () => {
      onSuccess()
    },
  })

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value[0]
    }

    if (!/^\d*$/.test(value)) return

    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").slice(0, 6)
    if (!/^\d+$/.test(pastedData)) return

    const newCode = [...code]
    pastedData.split("").forEach((char, index) => {
      if (index < 6) newCode[index] = char
    })
    setCode(newCode)

    const nextEmptyIndex = newCode.findIndex((c) => !c)
    if (nextEmptyIndex !== -1) {
      inputRefs.current[nextEmptyIndex]?.focus()
    } else {
      inputRefs.current[5]?.focus()
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const fullCode = code.join("")
    if (fullCode.length === 6) {
      verify2FAMutation.mutate({ sessionToken, code: fullCode })
    }
  }

  const isCodeComplete = code.every((digit) => digit !== "")

  return (
    <Card className="w-full max-w-md shadow-xl border-0">
      <CardHeader className="space-y-3 text-center pb-6">
        <button
          onClick={onBack}
          className="absolute left-6 top-6 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Назад"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="mx-auto w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
          <ShieldCheck className="w-6 h-6 text-white" />
        </div>
        <CardTitle className="text-2xl font-semibold text-balance">Двухфакторная аутентификация</CardTitle>
        <CardDescription className="text-base">Введите 6-значный код из вашего приложения</CardDescription>
        <p className="text-sm text-muted-foreground pt-1">{email}</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex gap-2 justify-center" onPaste={handlePaste}>
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                disabled={verify2FAMutation.isPending}
                className="w-12 h-14 text-center text-2xl font-semibold border-2 border-input rounded-lg focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label={`Цифра ${index + 1}`}
              />
            ))}
          </div>

          {verify2FAMutation.isError && (
            <Alert variant="destructive" className="animate-in fade-in slide-in-from-top-1">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {verify2FAMutation.error instanceof Error
                  ? verify2FAMutation.error.message
                  : "Произошла ошибка при проверке"}
              </AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-base font-medium"
            disabled={!isCodeComplete || verify2FAMutation.isPending}
          >
            {verify2FAMutation.isPending ? (
              <>
                <Spinner className="mr-2" />
                Проверка...
              </>
            ) : (
              "Подтвердить код"
            )}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            {"Не получили код? "}
            <button type="button" className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
              Отправить повторно
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
