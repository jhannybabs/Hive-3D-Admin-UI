import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await context.params;
    const pathStr = path.join("/");
    
    // Normalize backend URL - remove trailing slash if present
    let backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://3.107.22.251:2701";
    backendUrl = backendUrl.replace(/\/+$/, ""); // Remove trailing slashes
    
    const url = new URL(req.url);
    const searchParams = url.searchParams.toString();
    const queryString = searchParams ? `?${searchParams}` : "";
    
    // Construct full URL properly
    const backendApiUrl = `${backendUrl}/${pathStr}${queryString}`;
    
    // Forward authorization header if present
    const authHeader = req.headers.get("authorization");
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    if (authHeader) {
      headers["Authorization"] = authHeader;
    }
    
    // Add timeout for long-running requests (Vercel function timeout: 10s Hobby, 60s Pro)
    // Reduce to 25 seconds to leave buffer for Vercel function execution
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000); // 25 second timeout
    
    let backendRes;
    try {
      backendRes = await fetch(backendApiUrl, {
        method: "GET",
        headers,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      console.error(`[Proxy GET] Failed to fetch ${pathStr}:`, fetchError);
      return NextResponse.json(
        { 
          message: "Failed to connect to backend server",
          error: fetchError.message,
          details: fetchError.cause || "Network error - backend may be unreachable",
          backendUrl: backendApiUrl,
          statusCode: 500
        },
        { status: 500 }
      );
    }

    // Handle non-OK responses
    if (!backendRes.ok) {
      const errorText = await backendRes.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { 
          message: errorText || "Backend error",
          statusCode: backendRes.status
        };
      }
      return NextResponse.json(errorData, { status: backendRes.status });
    }

    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch (error: any) {
    console.error(`[Proxy GET] Error for ${pathStr}:`, error);
    return NextResponse.json(
      { 
        message: "Internal server error",
        error: error.message,
        statusCode: 500
      },
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
    
    // Normalize backend URL - remove trailing slash if present
    let backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://3.107.22.251:2701";
    backendUrl = backendUrl.replace(/\/+$/, ""); // Remove trailing slashes
    
    const body = await req.json();
    const backendApiUrl = `${backendUrl}/${pathStr}`;
    
    // Forward authorization header if present
    const authHeader = req.headers.get("authorization");
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    if (authHeader) {
      headers["Authorization"] = authHeader;
    }
    
    // Special timeout for backfill-inventory (can take a long time)
    // Other requests: 25 seconds, Backfill: 55 seconds (to leave buffer for Vercel's 60s limit)
    const isBackfill = pathStr.includes("backfill-inventory");
    const timeoutDuration = isBackfill ? 55000 : 25000;
    
    // Add timeout for long-running requests (Vercel function timeout: 10s Hobby, 60s Pro)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutDuration);
    
    let backendRes;
    try {
      backendRes = await fetch(backendApiUrl, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      console.error(`[Proxy POST] Failed to fetch ${pathStr}:`, fetchError);
      return NextResponse.json(
        { 
          message: "Failed to connect to backend server",
          error: fetchError.message,
          details: fetchError.cause || "Network error - backend may be unreachable",
          backendUrl: backendApiUrl,
          statusCode: 500
        },
        { status: 500 }
      );
    }

    // Handle non-OK responses
    if (!backendRes.ok) {
      const errorText = await backendRes.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { 
          message: errorText || "Backend error",
          statusCode: backendRes.status
        };
      }
      return NextResponse.json(errorData, { status: backendRes.status });
    }

    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch (error: any) {
    console.error(`[Proxy POST] Error for ${pathStr}:`, error);
    return NextResponse.json(
      { 
        message: "Internal server error",
        error: error.message,
        statusCode: 500
      },
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
    
    // Normalize backend URL - remove trailing slash if present
    let backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://3.107.22.251:2701";
    backendUrl = backendUrl.replace(/\/+$/, ""); // Remove trailing slashes
    
    const body = await req.json();
    const backendApiUrl = `${backendUrl}/${pathStr}`;
    
    // Forward authorization header if present
    const authHeader = req.headers.get("authorization");
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    if (authHeader) {
      headers["Authorization"] = authHeader;
    }
    
    // Add timeout for long-running requests (Vercel function timeout: 10s Hobby, 60s Pro)
    // Reduce to 25 seconds to leave buffer for Vercel function execution
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000); // 25 second timeout
    
    let backendRes;
    try {
      backendRes = await fetch(backendApiUrl, {
        method: "PUT",
        headers,
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      console.error(`[Proxy PUT] Failed to fetch ${pathStr}:`, fetchError);
      return NextResponse.json(
        { 
          message: "Failed to connect to backend server",
          error: fetchError.message,
          details: fetchError.cause || "Network error - backend may be unreachable",
          backendUrl: backendApiUrl,
          statusCode: 500
        },
        { status: 500 }
      );
    }

    // Handle non-OK responses
    if (!backendRes.ok) {
      const errorText = await backendRes.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { 
          message: errorText || "Backend error",
          statusCode: backendRes.status
        };
      }
      return NextResponse.json(errorData, { status: backendRes.status });
    }

    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch (error: any) {
    console.error(`[Proxy PUT] Error for ${pathStr}:`, error);
    return NextResponse.json(
      { 
        message: "Internal server error",
        error: error.message,
        statusCode: 500
      },
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
    
    // Normalize backend URL - remove trailing slash if present
    let backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://3.107.22.251:2701";
    backendUrl = backendUrl.replace(/\/+$/, ""); // Remove trailing slashes
    
    const backendApiUrl = `${backendUrl}/${pathStr}`;
    
    // Forward authorization header if present
    const authHeader = req.headers.get("authorization");
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    if (authHeader) {
      headers["Authorization"] = authHeader;
    }
    
    // Add timeout for long-running requests (Vercel function timeout: 10s Hobby, 60s Pro)
    // Reduce to 25 seconds to leave buffer for Vercel function execution
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000); // 25 second timeout
    
    let backendRes;
    try {
      backendRes = await fetch(backendApiUrl, {
        method: "DELETE",
        headers,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      console.error(`[Proxy DELETE] Failed to fetch ${pathStr}:`, fetchError);
      return NextResponse.json(
        { 
          message: "Failed to connect to backend server",
          error: fetchError.message,
          details: fetchError.cause || "Network error - backend may be unreachable",
          backendUrl: backendApiUrl,
          statusCode: 500
        },
        { status: 500 }
      );
    }

    // Handle non-OK responses
    if (!backendRes.ok) {
      const errorText = await backendRes.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { 
          message: errorText || "Backend error",
          statusCode: backendRes.status
        };
      }
      return NextResponse.json(errorData, { status: backendRes.status });
    }

    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch (error: any) {
    console.error(`[Proxy DELETE] Error for ${pathStr}:`, error);
    return NextResponse.json(
      { 
        message: "Internal server error",
        error: error.message,
        statusCode: 500
      },
      { status: 500 }
    );
  }
}

