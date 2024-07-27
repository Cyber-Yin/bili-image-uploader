"use server";

import axios from "axios";
import { cookies } from "next/headers";

const AxiosInstance = axios.create({
  timeout: 1000 * 20,
});

export const generateQRcode = async (): Promise<{
  url: string;
  qrcode_key: string;
}> => {
  return new Promise((resolve, reject) => {
    AxiosInstance.get<{
      code: number;
      message: string;
      data: {
        url: string;
        qrcode_key: string;
      };
    }>(`https://passport.bilibili.com/x/passport-login/web/qrcode/generate`)
      .then((res) => {
        resolve(res.data.data);
      })
      .catch((err) => {
        if (err.response) {
          reject(err.response.data.message);
        } else {
          reject(err);
        }
      });
  });
};

export const scanQRcode = async (
  qrcodeKey: string
): Promise<{
  url: string;
  code: number;
}> => {
  return new Promise((resolve, reject) => {
    AxiosInstance.get<{
      code: number;
      message: string;
      data: {
        url: string;
        refresh_token: string;
        timestamp: number;
        code: number;
        message: string;
      };
    }>(`https://passport.bilibili.com/x/passport-login/web/qrcode/poll`, {
      params: {
        qrcode_key: qrcodeKey,
      },
    })
      .then((res) => {
        resolve({
          url: res.data.data.code === 0 ? res.data.data.url : "",
          code: res.data.data.code,
        });
      })
      .catch((err) => {
        if (err.response) {
          reject(err.response.data.message);
        } else {
          reject(err);
        }
      });
  });
};

export const getUserInfo = async (): Promise<{
  face: string;
  uname: string;
}> => {
  const sessdata = cookies().get("sessdata");

  return new Promise((resolve, reject) => {
    if (!sessdata?.value) {
      reject("not login");
    }

    AxiosInstance.get<{
      code: number;
      message: string;
      data: {
        face: string;
        uname: string;
      };
    }>(`https://api.bilibili.com/x/web-interface/nav`, {
      headers: {
        Cookie: `SESSDATA=${sessdata!.value};`,
      },
    })
      .then((res) => {
        resolve(res.data.data);
      })
      .catch((err) => {
        if (err.response) {
          reject(err.response.data.message);
        } else {
          reject(err);
        }
      });
  });
};

export const uploadImage = async (image: File): Promise<string> => {
  const sessdata = cookies().get("sessdata");
  const jct = cookies().get("jct");

  return new Promise((resolve, reject) => {
    if (!sessdata?.value || !jct?.value) {
      reject("not login");
    }

    const formData = new FormData();
    formData.append("file_up", image);
    formData.append("biz", "article");
    formData.append("csrf", jct!.value);

    AxiosInstance.post<{
      code: number;
      message: string;
      data: {
        image_url: string;
        image_width: number;
        image_height: number;
      };
    }>(`https://api.bilibili.com/x/dynamic/feed/draw/upload_bfs`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Cookie: `SESSDATA=${sessdata!.value};`,
      },
    })
      .then((res) => {
        resolve(res.data.data.image_url);
      })
      .catch((err) => {
        if (err.response) {
          reject(err.response.data.message);
        } else {
          reject(err);
        }
      });
  });
};
