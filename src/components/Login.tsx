import React, { useState, useEffect } from "react";
import axios from "axios";
import SignupModal from "./SignupModal";
import { setToken, getToken, removeToken } from "../utils/cookie";

const Login = () => {
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

  const serverUrl = process.env.REACT_APP_SERVER_URL;

  //아래 useEffect는 추후 삭제
  useEffect(() => {
    const token = getToken();
    if (token) {
      console.log("already logged in");
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      //아래 라인들은 이후 병선이와 다시 맞추기
      const response = await axios.post(`${serverUrl}/api/login`, {
        userId,
        password,
      });
      const { token } = response.data;
      setToken(token);
      console.log("로그인 성공");
    } catch (error) {
      console.error("로그인 실패", error);
      removeToken();
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
