import Cookies from "js-cookie";

export const setRefreshToken = (token: string) => {
  Cookies.set("refreshToken", token, {
    secure: true,
    sameSite: "Strict",
  });
};

export const getRefreshToken = () => {
  return Cookies.get("refreshToken");
};

export const removeRefreshToken = () => {
  Cookies.remove("refreshToken");
};

export const setAccessToken = (token: string) => {
  Cookies.set("accessToken", token, {
    secure: true,
    sameSite: "Strict",
  });
};

export const getAccessToken = () => {
  return Cookies.get("accessToken");
};

export const removeAccessToken = () => {
  Cookies.remove("accessToken");
};
