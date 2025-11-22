import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(request: NextRequest) {
  try {
    console.log("🔔 [NextJS Proxy] Received Webhook from Midtrans");

    // 1. Ambil body dari request Midtrans
    const body = await request.json();

    // 2. Teruskan (Forward) data tersebut ke Backend NestJS (Port 5500)
    // Backend URL: http://localhost:5500/api/payments/webhook
    const backendResponse = await fetch(`${API_URL}/payments/webhook`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Midtrans tidak mengirim auth header, jadi kita tidak perlu forward token
      },
      body: JSON.stringify(body),
    });

    // 3. Cek respons dari Backend
    if (!backendResponse.ok) {
      const errorData = await backendResponse.text();
      console.error("❌ [NextJS Proxy] Backend rejected webhook:", errorData);
      return NextResponse.json(
        { message: "Backend failed to process" },
        { status: backendResponse.status }
      );
    }

    const result = await backendResponse.json();
    console.log("✅ [NextJS Proxy] Forwarded successfully:", result);

    // 4. Balas ke Midtrans dengan 200 OK
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("❌ [NextJS Proxy] Error forwarding webhook:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
