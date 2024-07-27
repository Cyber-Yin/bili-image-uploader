"use client";

import { cn } from "@/lib/utils";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";

const Uploader: React.FC = () => {
  const router = useRouter();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File>();
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      setFile(file);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      setLoading(true);

      await axios.post("/api/upload-image", formData);

      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const imagePreview = useMemo(() => {
    if (!file) return "";

    return URL.createObjectURL(file);
  }, [file]);

  return (
    <>
      <input
        className="hidden"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        ref={fileInputRef}
      />
      {imagePreview && file && (
        <div className="flex items-center justify-center">
          <img className="w-[300px]" src={imagePreview} alt={file.name} />
        </div>
      )}
      <div className="flex items-center justify-center space-x-4">
        <button
          className={cn(
            "bg-white border border-slate-400 rounded-md px-4 py-2 text-sm font-semibold hover:border-blue-400 hover:text-blue-400 transition-colors",
            {
              "cursor-not-allowed opacity-70": loading,
            }
          )}
          disabled={loading}
          onClick={handleClick}
        >
          选择图片
        </button>
        <button
          className={cn(
            "bg-blue-500 border border-blue-500 rounded-md px-4 py-2 text-sm font-semibold text-white hover:opacity-80 transition-opacity",
            {
              "cursor-not-allowed opacity-70 hover:opacity-70":
                loading || !file,
            }
          )}
          disabled={loading || !file}
          onClick={handleUpload}
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "上传"}
        </button>
      </div>
    </>
  );
};

export default Uploader;
