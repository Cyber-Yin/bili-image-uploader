"use client";
import { useIntersectionObserver } from "@uidotdev/usehooks";
import { Link, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import CopyButton from "../CopyButton";

const BASE_URL = "https://i0.hdslb.com/bfs/article";

const ImagePreview: React.FC<{
  id: number;
  fileName: string;
}> = ({ id, fileName }) => {
  const [ref, entry] = useIntersectionObserver({
    threshold: 0,
  });

  const [isRender, setIsRender] = useState(false);

  useEffect(() => {
    if (!entry) return;

    if (entry.isIntersecting && !isRender) {
      setIsRender(true);
    }
  }, [entry]);

  return (
    <div
      ref={ref}
      className="break-inside-avoid relative group overflow-hidden rounded-lg drop-shadow"
      key={id}
    >
      <img
        loading="lazy"
        className="group-hover:brightness-75 brightness-100 transition-all"
        src={
          isRender
            ? `${BASE_URL}/${fileName}`
            : `${BASE_URL}/58460680a40c1224c06adcb6bd4f3296129000357.jpg`
        }
        alt={fileName}
        referrerPolicy="no-referrer"
      />
      <div className="absolute bottom-0 left-0 right-0 h-10 bg-white translate-y-10 group-hover:translate-y-0 transition-all flex items-center justify-between space-x-3 px-4">
        <div className="flex items-center space-x-3 h-10 shrink-0">
          <CopyButton content={`${BASE_URL}/${fileName}`} />
        </div>
        <div className="grid grid-cols-1 truncate text-sm">{fileName}</div>
      </div>
    </div>
  );
};

export default ImagePreview;
