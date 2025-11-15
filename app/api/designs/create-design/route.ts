import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://3.107.22.251:2701";
  const backendRes = await fetch(`${backendUrl}/designs/create-design`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await backendRes.json();
  return NextResponse.json(data);
}
