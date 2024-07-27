import axios from "axios";
import useSWR from "swr";

export const useFetchQRcode = () => {
  const { data, isLoading, isValidating, mutate } = useSWR(
    "/api/generate-qrcode",
    async (url: string) => {
      try {
        const resp = await axios.get<{
          url: string;
          qrcode_key: string;
        }>(url);

        return resp.data;
      } catch (e) {
        console.log(e);
        return {
          url: "",
          qrcode_key: "",
        };
      }
    },
    {
      refreshInterval: 1000 * 60 * 60,
    }
  );

  return {
    qrcode: data,
    qrcodeLoading: isLoading,
    qrcodeValidating: isValidating,
    refreshQRcode: mutate,
  };
};

export const useQRcodeState = (qrcodeKey: string) => {
  const { data, isLoading, isValidating, mutate } = useSWR(
    !qrcodeKey ? null : "/api/scan-qrcode",
    async (url: string) => {
      try {
        const resp = await axios.get<{
          url: string;
          code: number;
        }>(url, { params: { qrcode: qrcodeKey } });

        return resp.data;
      } catch (e) {
        console.log(e);
        return {
          url: "",
          code: -1,
        };
      }
    },
    {
      refreshInterval: 1000 * 5,
    }
  );

  return {
    qrcodeState: data,
    qrcodeStateLoading: isLoading,
    qrcodeStateValidating: isValidating,
    refreshQRcodeState: mutate,
  };
};
