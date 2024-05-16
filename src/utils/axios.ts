import axios from 'axios';
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
} from './cookie';

const baseURL = process.env.REACT_APP_SERVER_URL;

// api 인스턴스 생성
const api = axios.create({
  baseURL,
});

// 새로운 AccessToken을 발급받는 함수
const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();
  try {
    const response = await axios.get(`${baseURL}v1/oauth/refresh-token`, {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });
    const { accessToken: newAccessToken } = response.data.data;
    console.log('토큰 재발급', response);
    setAccessToken(newAccessToken);
    return newAccessToken;
  } catch (error) {
    console.error(error);
  }
};

// 요청 보낼 때 headers에 accesstoken 추가
api.interceptors.request.use(
  (config) => {
    const accessToken = getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답을 가로채고 처리하는 인터셉터 설정
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // AccessToken이 만료되었을 경우
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      // 새로운 AccessToken을 발급받습니다.
      const newAccessToken = await refreshAccessToken();
      // 발급받은 AccessToken으로 요청을 다시 시도합니다.
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return api(originalRequest);
    }
    return Promise.reject(error);
  }
);

export default api;
