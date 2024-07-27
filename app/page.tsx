"use server";

import ImagePreview from "@/components/ImagePreview";
import Loading from "@/components/Loading";
import QRcode from "@/components/QRcode";
import Uploader from "@/components/Uploader";
import { getUserInfo } from "@/lib/bilibili-api";
import DatabaseInstance from "@/lib/server/prisma";
import { sleep } from "@/lib/utils";
import { Suspense } from "react";

export const revalidate = 0;

export default async function Home() {
  return (
    <Suspense fallback={<Loading />}>
      <StreamPage />
    </Suspense>
  );
}

const StreamPage: React.FC = async () => {
  const user = {
    face: "",
    uname: "",
    isLogin: false,
  };

  try {
    const data = await getUserInfo();
    user.face = data.face;
    user.uname = data.uname;
    user.isLogin = true;
  } catch (err) {}

  const images = await DatabaseInstance.image.findMany({
    select: {
      id: true,
      file_name: true,
    },
    where: { deleted: 0 },
    orderBy: [
      {
        id: "desc",
      },
    ],
  });

  await sleep(1000);

  return (
    <main className="w-full">
      {user.isLogin ? (
        <div className="space-y-6 w-full px-4 py-20">
          <div className="w-full flex flex-col space-y-4 justify-center items-center">
            <img
              className="h-12 w-12 rounded-full drop-shadow"
              referrerPolicy="no-referrer"
              src={user.face}
              alt={user.uname}
            />
            <h1 className="text-2xl font-bold">{user.uname}</h1>
          </div>
          <Uploader />
          <div className="sm:columns-2 columns-1 gap-6 space-y-6 max-w-screen-lg mx-auto">
            {images.map((item) => (
              <ImagePreview
                key={item.id}
                id={item.id}
                fileName={item.file_name}
              />
            ))}
          </div>
        </div>
      ) : (
        <QRcode />
      )}
    </main>
  );
};
