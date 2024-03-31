import Cookies from "js-cookie";

export const setToken = (token: string) => {
  Cookies.set("token", token, { expires: 7 });
};

export const getToken = () => {
  return Cookies.get("token");
};

export const removeToken = () => {
  Cookies.remove("token");
};
