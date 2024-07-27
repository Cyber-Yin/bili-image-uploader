import { NextRequest } from "next/server";
import { uploadImage } from "@/lib/bilibili-api";
import DatabaseInstance from "@/lib/server/prisma";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const image = formData.get("image") as File;

  if (!image) {
    return Response.json(
      {
        success: false,
        message: "no image found",
      },
      {
        status: 400,
      }
    );
  }

  try {
    const imageUrl = await uploadImage(image);

    const pathname = new URL(imageUrl).pathname;
    const filename = pathname.substring(pathname.lastIndexOf("/") + 1);

    await DatabaseInstance.image.create({
      data: {
        file_name: filename,
        deleted: 0,
      },
    });

    return Response.json({
      success: true,
    });
  } catch (error) {
    console.log(error);

    return Response.json(
      {
        success: false,
        message: "upload image failed",
      },
      {
        status: 500,
      }
    );
  }
}
