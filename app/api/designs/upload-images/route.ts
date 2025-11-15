import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // proxy request to backend (server-side, no mixed content issues)
  const formData = await req.formData();
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://3.107.22.251:2701";
  const backendRes = await fetch(`${backendUrl}/designs/upload-images`, {
    method: "POST",
    body: formData,
  });
  const data = await backendRes.json();
  return NextResponse.json(data);
}
