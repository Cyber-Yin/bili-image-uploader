"use client";

import { toDataURL } from "qrcode";
import { useFetchQRcode, useQRcodeState } from "./hooks";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const QRcode: React.FC = () => {
  const router = useRouter();
  const { qrcode, qrcodeLoading, qrcodeValidating, refreshQRcode } =
    useFetchQRcode();
  const {
    qrcodeState,
    qrcodeStateLoading,
    qrcodeStateValidating,
    refreshQRcodeState,
  } = useQRcodeState(qrcode?.qrcode_key || "");

  const [qrcodeImage, setQRcodeImage] = useState("");

  const generateQRcodeImage = async () => {
    if (!qrcode?.url) return;

    const imageDataURL = await toDataURL(qrcode.url);

    setQRcodeImage(imageDataURL);
  };

  useEffect(() => {
    generateQRcodeImage();
  }, [qrcode]);

  const handleScanned = async () => {
    if (!qrcodeState?.url) return;

    const sessdata = qrcodeState.url.match(/SESSDATA=(.*?)&/)?.[1];
    const escapedSessdata = encodeURIComponent(sessdata || "");
    const jct = qrcodeState.url.match(/bili_jct=(.*?)&/)?.[1];

    if (!escapedSessdata || !jct) return;

    await axios.post("/api/bili-cookie", {
      sessdata: escapedSessdata,
      jct,
    });

    router.refresh();
  };

  useEffect(() => {
    handleScanned();
  }, [qrcodeState]);

  if (!qrcode || !qrcodeState || !qrcodeImage) return <></>;

  return (
    <div className="flex items-center justify-center w-full h-screen">
      <img src={qrcodeImage} alt="qrcode" />
    </div>
  );
};

export default QRcode;
