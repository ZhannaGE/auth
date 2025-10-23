"use client"

import { useState } from "react"
import { LoginForm } from "./login-form"
import { RegisterForm } from "./register-form"
import { TwoFactorForm } from "./two-factor-form"
import { SuccessScreen } from "./success-screen"

export type AuthStep = "login" | "register" | "2fa" | "success"

export function AuthFlow() {
  const [step, setStep] = useState<AuthStep>("login")
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [sessionToken, setSessionToken] = useState("")

  const handleLoginSuccess = (userEmail: string, token: string, userName: string) => {
    setEmail(userEmail)
    setName(userName)
    setSessionToken(token)
    setStep("2fa")
  }

  const handleRegisterSuccess = (userEmail: string, userName: string, token: string) => {
    setEmail(userEmail)
    setName(userName)
    setSessionToken(token)
    setStep("2fa")
  }

  const handle2FASuccess = () => {
    setStep("success")
  }

  return (
    <>
      {step === "login" && <LoginForm onSuccess={handleLoginSuccess} onSwitchToRegister={() => setStep("register")} />}
      {step === "register" && <RegisterForm onSuccess={handleRegisterSuccess} onBackToLogin={() => setStep("login")} />}
      {step === "2fa" && (
        <TwoFactorForm
          email={email}
          sessionToken={sessionToken}
          onSuccess={handle2FASuccess}
          onBack={() => setStep("login")}
        />
      )}
      {step === "success" && <SuccessScreen email={email} name={name} />}
    </>
  )
}
