import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { period: "daily" | "weekly" | "monthly" } }
) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/inventory/combined/${params.period}`,
      { headers: { "Content-Type": "application/json" } }
    );

    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      const text = await res.text();
      return NextResponse.json(
        {
          message: "Upstream returned non-JSON",
          status: res.status,
          body: text,
        },
        { status: 502 }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    return NextResponse.json(
      { message: "Error fetching inventory combined", error: err.message },
      { status: 500 }
    );
  }
}
