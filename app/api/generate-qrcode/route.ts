import { generateQRcode } from "@/lib/bilibili-api";

export async function GET() {
  const data = await generateQRcode();

  return Response.json(data);
}
