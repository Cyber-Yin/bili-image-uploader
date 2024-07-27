import { generateQRcode } from "@/lib/bilibili-api";

export const revalidate = 0;

export async function GET() {
  const data = await generateQRcode();

  return Response.json(data);
}
