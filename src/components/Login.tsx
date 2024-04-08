import React, { useState } from "react";
import axios from "axios";
import SignupModal from "./SignupModal";
import { setRefreshToken, removeRefreshToken } from "../utils/cookie";
import { useNavigate } from "react-router-dom";
import styles from "../styles/login.module.css";

const Login = () => {
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

  const serverUrl = process.env.REACT_APP_SERVER_URL;
  const { setAccessToken } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      //아래 라인들은 이후 병선이와 다시 맞추기
      const response = await axios.post(`${serverUrl}/api/login`, {
        userId,
        password,
      });
      const { accessToken, refreshToken } = response.data;
      setRefreshToken(refreshToken);
      setAccessToken(accessToken);
      navigate("/");
      console.log("로그인 성공");
    } catch (error) {
      console.error("로그인 실패", error);
      removeRefreshToken();
    }
  };

  return (
    <div>
      <h2>로그인</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="UserId"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">로그인</button>
      </form>
      <button onClick={() => setIsSignupModalOpen(true)}>회원가입</button>
      <SignupModal
        isOpen={isSignupModalOpen}
        onClose={() => setIsSignupModalOpen(false)}
      />
    </div>
  );
};

export default Login;
