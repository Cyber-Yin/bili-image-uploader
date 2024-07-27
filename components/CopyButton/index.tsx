"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

import { sleep } from "@/lib/utils";

const CopyButton: React.FC<{
  content: string;
}> = ({ content }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    setCopied(true);
    navigator.clipboard.writeText(content);
    await sleep(1000);
    setCopied(false);
  };

  return (
    <>
      {copied ? (
        <Check className="h-5 w-5 text-green-500 cursor-default" />
      ) : (
        <Copy
          onClick={handleCopy}
          className="h-5 w-5 text-green-500 cursor-pointer"
        />
      )}
    </>
  );
};

export default CopyButton;
