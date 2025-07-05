// app/api/auth/check/route.js
import { NextResponse } from "next/server";

export async function GET() {
  const backendRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/check`, {
    method: "GET",
    credentials: "include",
  });

  const data = await backendRes.json();
  return NextResponse.json(data, { status: backendRes.status });
}
