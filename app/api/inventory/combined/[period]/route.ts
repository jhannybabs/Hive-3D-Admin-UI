import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  context: { params: Promise<{ period: "daily" | "weekly" | "monthly" }> }
) {
  try {
    const { period } = await context.params;

    const url = `${process.env.NEXT_PUBLIC_API_URL}/inventory/combined/${period}`;
    const res = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { message: "Backend error", status: res.status, body: text },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(Array.isArray(data) ? data : [], { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { message: "Error fetching inventory combined", error: err.message },
      { status: 500 }
    );
  }
}
