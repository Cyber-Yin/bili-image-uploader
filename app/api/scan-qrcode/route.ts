import { scanQRcode } from "@/lib/bilibili-api";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const qrcodeKey = searchParams.get("qrcode");

  if (!qrcodeKey) {
    return Response.json(
      {
        message: "invalid qrcode key",
      },
      { status: 400 }
    );
  }

  const data = await scanQRcode(qrcodeKey);

  return Response.json(data);
}
