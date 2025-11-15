import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await context.params;
    const pathStr = path.join("/");
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://3.107.22.251:2701";
    
    const url = new URL(req.url);
    const searchParams = url.searchParams.toString();
    const queryString = searchParams ? `?${searchParams}` : "";
    
    // Forward authorization header if present
    const authHeader = req.headers.get("authorization");
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    if (authHeader) {
      headers["Authorization"] = authHeader;
    }
    
    const backendRes = await fetch(`${backendUrl}/${pathStr}${queryString}`, {
      method: "GET",
      headers,
    });

    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to connect to backend", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  context: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await context.params;
    const pathStr = path.join("/");
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://3.107.22.251:2701";
    const body = await req.json();
    
    // Forward authorization header if present
    const authHeader = req.headers.get("authorization");
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    if (authHeader) {
      headers["Authorization"] = authHeader;
    }
    
    const backendRes = await fetch(`${backendUrl}/${pathStr}`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to connect to backend", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await context.params;
    const pathStr = path.join("/");
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://3.107.22.251:2701";
    const body = await req.json();
    
    // Forward authorization header if present
    const authHeader = req.headers.get("authorization");
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    if (authHeader) {
      headers["Authorization"] = authHeader;
    }
    
    const backendRes = await fetch(`${backendUrl}/${pathStr}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(body),
    });

    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to connect to backend", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await context.params;
    const pathStr = path.join("/");
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://3.107.22.251:2701";
    
    // Forward authorization header if present
    const authHeader = req.headers.get("authorization");
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    if (authHeader) {
      headers["Authorization"] = authHeader;
    }
    
    const backendRes = await fetch(`${backendUrl}/${pathStr}`, {
      method: "DELETE",
      headers,
    });

    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to connect to backend", error: error.message },
      { status: 500 }
    );
  }
}

