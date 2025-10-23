// Mock API functions with various error scenarios for testing

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  sessionToken: string
  requires2FA: boolean
  userName: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export interface RegisterResponse {
  sessionToken: string
  requires2FA: boolean
}

export interface Verify2FARequest {
  sessionToken: string
  code: string
}

export interface Verify2FAResponse {
  success: boolean
  accessToken: string
}

export interface User {
  id: string
  name: string
  email: string
  password: string
  createdAt: string
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

type ErrorScenario = "none" | "invalid-credentials" | "network-error" | "rate-limit" | "server-error"

const LOGIN_ERROR_SCENARIO: ErrorScenario = "none"
const TWO_FA_ERROR_SCENARIO: ErrorScenario = "none"
const REGISTER_ERROR_SCENARIO: ErrorScenario = "none"

const USERS_STORAGE_KEY = "auth_users"

function getUsers(): User[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(USERS_STORAGE_KEY)
  return stored ? JSON.parse(stored) : []
}

function saveUsers(users: User[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
}

function findUserByEmail(email: string): User | undefined {
  return getUsers().find((user) => user.email.toLowerCase() === email.toLowerCase())
}

export async function mockRegisterAPI(request: RegisterRequest): Promise<RegisterResponse> {
  await delay(1500)

  switch (REGISTER_ERROR_SCENARIO) {
    case "invalid-credentials":
      throw new Error("Некорректные данные. Проверьте введенную информацию.")

    case "network-error":
      throw new Error("Ошибка сети. Проверьте подключение к интернету.")

    case "rate-limit":
      throw new Error("Слишком много попыток регистрации. Попробуйте позже.")

    case "server-error":
      throw new Error("Ошибка сервера. Попробуйте позже.")

    case "none":
    default:
      const existingUser = findUserByEmail(request.email)
      if (existingUser) {
        throw new Error("Пользователь с таким email уже зарегистрирован.")
      }

      const newUser: User = {
        id: `user_${Math.random().toString(36).substring(7)}`,
        name: request.name,
        email: request.email,
        password: request.password,
        createdAt: new Date().toISOString(),
      }

      const users = getUsers()
      users.push(newUser)
      saveUsers(users)

      return {
        sessionToken: `session_${Math.random().toString(36).substring(7)}`,
        requires2FA: true,
      }
  }
}

export async function mockLoginAPI(request: LoginRequest): Promise<LoginResponse> {
  await delay(1500)

  switch (LOGIN_ERROR_SCENARIO) {
    case "invalid-credentials":
      throw new Error("Invalid email or password. Please check your credentials and try again.")

    case "network-error":
      throw new Error("Network error. Please check your internet connection and try again.")

    case "rate-limit":
      throw new Error("Too many login attempts. Please wait 5 minutes before trying again.")

    case "server-error":
      throw new Error("Server error. Our team has been notified. Please try again later.")

    case "none":
    default:
      const user = findUserByEmail(request.email)

      if (!user) {
        throw new Error("Пользователь не найден. Пожалуйста, зарегистрируйтесь.")
      }

      if (user.password !== request.password) {
        throw new Error("Неверный пароль. Проверьте данные и попробуйте снова.")
      }

      return {
        sessionToken: `session_${Math.random().toString(36).substring(7)}`,
        requires2FA: true,
        userName: user.name,
      }
  }
}

export async function mockVerify2FAAPI(request: Verify2FARequest): Promise<Verify2FAResponse> {
  await delay(1500)

  switch (TWO_FA_ERROR_SCENARIO) {
    case "invalid-credentials":
      throw new Error("Invalid verification code. Please check the code and try again.")

    case "network-error":
      throw new Error("Network error. Please check your internet connection and try again.")

    case "rate-limit":
      throw new Error("Too many verification attempts. Please wait before trying again.")

    case "server-error":
      throw new Error("Server error. Our team has been notified. Please try again later.")

    case "none":
    default:
      if (request.code.length === 6) {
        return {
          success: true,
          accessToken: `access_${Math.random().toString(36).substring(7)}`,
        }
      }
      throw new Error("Invalid verification code format.")
  }
}
