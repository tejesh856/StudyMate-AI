// app/api/auth/login/route.js
import { NextResponse } from 'next/server';

export async function POST(req) {
  const body = await req.json();
  const cookie = req.headers.get("cookie");
  try {
    const backendRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookie,
      },
      body: JSON.stringify(body),
    });

    const data = await backendRes.json();
    const response = NextResponse.json(data, {
      status: backendRes.status,
    });

    // Forward "Set-Cookie" header from backend to browser
    const setCookie = backendRes.headers.get('set-cookie');
    if (setCookie) {
      response.headers.set('set-cookie', setCookie);
    }

    return response;
  } catch (err) {
    console.error('Login Proxy Error:', err);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
