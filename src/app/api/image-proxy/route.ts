// app/api/image-proxy/route.ts
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')

  if (!url) {
    return NextResponse.json({ error: 'Missing image URL' }, { status: 400 })
  }

  const username = process.env.BASIC_AUTH_USER
  const password = process.env.BASIC_AUTH_PASSWORD

  if (!username || !password) {
    return NextResponse.json({ error: 'Basic auth credentials not configured' }, { status: 500 })
  }

  const basicAuth = 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64')

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: basicAuth,
      },
    })

    if (!response.ok) {
      return NextResponse.json({ error: `Failed to fetch image: ${response.statusText}` }, { status: response.status })
    }

    // Clone the response body as a stream and forward it
    const contentType = response.headers.get('content-type') || 'image/jpeg'

    const imageBuffer = await response.arrayBuffer()

    return new NextResponse(Buffer.from(imageBuffer), {
      status: 200,
      headers: {
        'Content-Type': contentType,
      },
    })
  } catch (error) {
    console.log({error})
    return NextResponse.json({ error: 'Error fetching image' }, { status: 500 })
  }
}
