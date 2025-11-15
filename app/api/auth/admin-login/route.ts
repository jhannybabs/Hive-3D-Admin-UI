import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // Normalize backend URL - remove trailing slash if present
    let backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://3.107.22.251:2701";
    backendUrl = backendUrl.replace(/\/+$/, ""); // Remove trailing slashes
    
    // Construct full URL properly
    const loginUrl = `${backendUrl}/auth/admin-login`;
    
    console.log("[Admin Login] Attempting login for:", body.email);
    console.log("[Admin Login] Backend URL:", loginUrl);
    console.log("[Admin Login] Env NEXT_PUBLIC_API_URL:", process.env.NEXT_PUBLIC_API_URL);
    
    let backendRes;
    try {
      // Create abort controller for timeout (Vercel function timeout: 10s Hobby, 60s Pro)
      // Reduce to 25 seconds to leave buffer for Vercel function execution
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 25000); // 25 second timeout
      
      backendRes = await fetch(loginUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
    } catch (fetchError: any) {
      console.error("[Admin Login] Fetch error:", fetchError);
      
      // Return detailed error for debugging
      return NextResponse.json(
        { 
          message: "Failed to connect to backend server",
          error: fetchError.message,
          details: fetchError.cause || "Network error - backend may be unreachable",
          backendUrl: backendUrl,
          statusCode: 500
        },
        { status: 500 }
      );
    }

    console.log("[Admin Login] Backend response status:", backendRes.status);

    // Handle non-OK responses
    if (!backendRes.ok) {
      const errorText = await backendRes.text();
      console.error("[Admin Login] Backend error:", errorText);
      
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { 
          message: errorText || "Authentication failed",
          statusCode: backendRes.status
        };
      }
      return NextResponse.json(
        errorData,
        { status: backendRes.status }
      );
    }

    // Parse response as JSON
    const data = await backendRes.json();
    console.log("[Admin Login] Success");
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error("[Admin Login] Error:", error);
    console.error("[Admin Login] Error stack:", error.stack);
    
    // Return detailed error information
    return NextResponse.json(
      { 
        message: "Internal server error",
        error: error.message,
        details: error.stack || error.toString(),
        statusCode: 500
      },
      { status: 500 }
    );
  }
}

