import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const revalidate = 0;

export async function POST(req: NextRequest) {
  const data: {
    sessdata: string;
    jct: string;
  } = await req.json();

  cookies().set("sessdata", data.sessdata, {
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
    sameSite: "lax",
  });
  cookies().set("jct", data.jct, {
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
    sameSite: "lax",
  });

  return redirect("/");
}
