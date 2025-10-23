"use client"

import { AuthFlow } from "@/components/auth-flow"

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <AuthFlow />
    </div>
  )
}
