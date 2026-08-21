import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

const JWT_SECRET = process.env.JWT_SECRET!
const COOKIE_NAME = 'svv_admin_token'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

if (!JWT_SECRET) {
  // Only warn at runtime, not at build time
  if (typeof window === 'undefined') {
    console.warn('JWT_SECRET is not set in environment variables')
  }
}

function getSecretKey() {
  return new TextEncoder().encode(JWT_SECRET)
}

export interface JWTPayload {
  sub: string      // Admin _id
  email: string
  role: string
  iat?: number
  exp?: number
}

/** Sign a JWT with the admin payload */
export async function signJWT(payload: Omit<JWTPayload, 'iat' | 'exp'>) {
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getSecretKey())
  return token
}

/** Verify and decode a JWT */
export async function verifyJWT(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey())
    return payload as unknown as JWTPayload
  } catch {
    return null
  }
}

/** Set the auth cookie (HTTP-only, Secure, SameSite=Lax) */
export async function setAuthCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  })
}

/** Clear the auth cookie */
export async function clearAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

/** Get the JWT token from the request cookie */
export function getTokenFromRequest(request: NextRequest): string | null {
  return request.cookies.get(COOKIE_NAME)?.value ?? null
}

/** Get the JWT token from server-side cookies() */
export async function getTokenFromCookies(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get(COOKIE_NAME)?.value ?? null
}

/** Verify auth from server-side context */
export async function verifyAuth(): Promise<JWTPayload | null> {
  const token = await getTokenFromCookies()
  if (!token) return null
  return verifyJWT(token)
}
