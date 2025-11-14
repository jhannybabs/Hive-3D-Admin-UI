import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const backendRes = await fetch("http://192.168.254.106:2701/designs/create-design", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await backendRes.json();
  return NextResponse.json(data);
}
