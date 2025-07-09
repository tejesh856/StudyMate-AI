import { NextResponse } from "next/server";

export function middleware(req) {
  const url = req.nextUrl.clone();
  const token = req.cookies.get("authToken")?.value;
  const quizToken = req.cookies.get("quizToken")?.value;
  const quizId = req.cookies.get("quizId")?.value;

  const isAuth = !!token;
  const isPublicPage = ["/", "/login", "/signup"].includes(url.pathname);
  const isAttemptIdPage = /^\/quiz\/attempt\/[^\/]+$/.test(url.pathname);
  const isQueryAttemptPage = url.pathname === "/quiz/attempt" && url.searchParams.has("topic");

  // 🔒 Redirect unauthenticated users
  if (!isAuth && !isPublicPage) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // 🚫 Redirect authenticated users away from public pages
  if (isAuth && isPublicPage) {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // ❌ Block access to /quiz/attempt/[id] if quizToken is missing
  if (!quizToken && isAttemptIdPage) {
    url.pathname = "/quiz";
    return NextResponse.redirect(url);
  }

  // ❌ Block access to quiz generation page if quiz is active
  if (isQueryAttemptPage && quizToken) {
    url.pathname = "/quiz";
    url.search = "";
    return NextResponse.redirect(url);
  }

  // ✅ If quiz is active, and not already on correct locked room, redirect
  if (quizToken && quizId) {
    const expectedPath = `/quiz/attempt/${quizId}`;
    if (
      url.pathname !== expectedPath &&
      !isQueryAttemptPage && // prevent loop if already on /quiz/attempt with params
      !isPublicPage &&
      !isAttemptIdPage
    ) {
      url.pathname = expectedPath;
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/", "/login", "/signup",
    "/dashboard", "/profile", "/quiz",
    "/quiz/attempt/:path*", "/quiz/review/:path*",
    "/learn/:path*",'/settings'
  ],
};
