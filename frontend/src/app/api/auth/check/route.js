// app/api/auth/check/route.js
import { NextResponse } from "next/server";

export async function GET(req) {
  const cookie = req.headers.get("cookie");
  const backendRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/check`, {
    method: "GET",
    headers: {
      Cookie: cookie, // ✅ Forward cookies manually
    },
  });

  const data = await backendRes.json();
  console.log('check server',data);
  return NextResponse.json(data, { status: backendRes.status });
}
