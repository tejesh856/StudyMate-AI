// lib/proxyRequest.js
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function proxyRequest(req, {
  backendPath,
  method = 'GET',
  body = null,
  headers = {},
  includeQuizCookies = false, // 👈 custom flag
}) {
  const cookieStore = cookies();

  const authToken = cookieStore.get('authToken');
  const quizToken = includeQuizCookies ? cookieStore.get('quizToken') : null;
  const quizId = includeQuizCookies ? cookieStore.get('quizId') : null;

  const cookieHeader = [
    authToken ? `authToken=${authToken.value}` : '',
    quizToken ? `quizToken=${quizToken.value}` : '',
    quizId ? `quizId=${quizId.value}` : ''
  ]
    .filter(Boolean)
    .join('; ');

  const backendURL = `${process.env.NEXT_PUBLIC_API_URL}${backendPath}`;

  const requestHeaders = {
    ...headers,
    'Content-Type': 'application/json',
    Cookie: cookieHeader, // ✅ Combine cookies
  };

  const backendRes = await fetch(backendURL, {
    method,
    headers: requestHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await backendRes.json();
  const response = NextResponse.json(data, { status: backendRes.status });

  const setCookie = backendRes.headers.get('set-cookie');
  if (setCookie) {
    response.headers.set('set-cookie', setCookie);
  }

  return response;
}
