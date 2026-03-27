import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.API_PROXY_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

// Allow large uploads (videos up to 50MB), 60s timeout
export const maxDuration = 60

// Whitelist — faqat kerakli headerlar backend'ga yuboriladi
const ALLOWED_REQUEST_HEADERS = new Set([
  'authorization',
  'content-type',
  'accept',
  'accept-language',
  'x-requested-with',
  'user-agent',
  'cookie',
])

async function handler(request: NextRequest) {
  const backendPath = request.nextUrl.pathname.replace('/api/v1', '')
  const targetUrl = `${BACKEND_URL}${backendPath}${request.nextUrl.search}`

  const headers = new Headers()
  request.headers.forEach((value, key) => {
    if (ALLOWED_REQUEST_HEADERS.has(key.toLowerCase())) {
      headers.set(key, value)
    }
  })
  // Client IP ni backend'ga yuborish
  headers.set('x-forwarded-for', request.headers.get('x-forwarded-for') || request.ip || '127.0.0.1')

  const fetchOptions: RequestInit = {
    method: request.method,
    headers,
    redirect: 'follow',
  }

  if (!['GET', 'HEAD'].includes(request.method)) {
    const body = await request.arrayBuffer()
    if (body.byteLength > 0) {
      fetchOptions.body = body
    }
  }

  try {
    const response = await fetch(targetUrl, fetchOptions)

    const responseHeaders = new Headers()
    response.headers.forEach((value, key) => {
      if (!['transfer-encoding', 'connection', 'content-encoding', 'content-length'].includes(key.toLowerCase())) {
        responseHeaders.set(key, value)
      }
    })

    return new NextResponse(response.body, {
      status: response.status,
      headers: responseHeaders,
    })
  } catch {
    return NextResponse.json({ error: 'Backend unavailable' }, { status: 503 })
  }
}

export const GET = handler
export const POST = handler
export const PUT = handler
export const DELETE = handler
export const PATCH = handler
export const OPTIONS = handler
