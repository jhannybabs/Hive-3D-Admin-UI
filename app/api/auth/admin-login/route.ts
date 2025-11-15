import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://3.107.22.251:2701";
    
    console.log("[Admin Login] Attempting login for:", body.email);
    console.log("[Admin Login] Backend URL:", `${backendUrl}/auth/admin-login`);
    
    const backendRes = await fetch(`${backendUrl}/auth/admin-login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    console.log("[Admin Login] Backend response status:", backendRes.status);

    // Handle non-OK responses
    if (!backendRes.ok) {
      const errorText = await backendRes.text();
      console.error("[Admin Login] Backend error:", errorText);
      
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText || "Authentication failed" };
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
    
    return NextResponse.json(
      { 
        message: "Failed to connect to backend", 
        error: error.message,
        statusCode: 500
      },
      { status: 500 }
    );
  }
}

