import Cookies from "js-cookie";

export const setRefreshToken = (token: string) => {
  Cookies.set("refreshToken", token, {
    expires: 7,
    secure: true,
    httpOnly: true,
    sameSite: "Strict",
  });
};

export const getRefreshToken = () => {
  return Cookies.get("refreshToken");
};

export const removeRefreshToken = () => {
  Cookies.remove("refreshToken");
};
