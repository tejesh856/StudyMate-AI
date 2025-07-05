// app/api/auth/logout/route.js
import { NextResponse } from "next/server";

export async function POST() {
  const cookie = req.headers.get("cookie");
  const backendRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
    method: "POST",
    headers: {
      Cookie: cookie,
    },
  });

  const data = await backendRes.json();
  const response = NextResponse.json(data, { status: backendRes.status });

  const setCookie = backendRes.headers.get("set-cookie");
  if (setCookie) {
    response.headers.set("set-cookie", setCookie);
  }

  return response;
}
