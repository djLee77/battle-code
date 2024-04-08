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
    <div className={styles.background}>
      <div className={styles.filter}></div>
      <form onSubmit={handleLogin} className={styles.loginBox}>
        <div className={styles.logo}>
          <img
            src="logo-battlecode-removebg.png"
            alt="logo"
            width="250px"
            height="40px"
            style={{ zIndex: "5" }}
          ></img>
        </div>
        <div className={styles.intro}>
          <pre>실시간으로 상대방과 코딩테스트 대결을 펼쳐 보세요!</pre>
        </div>
        <div className={styles.inputGroup}>
        <input
            className={styles.input}
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="UserId"
          required
        />
        </div>
        <div className={styles.inputGroup}>
        <input
            className={styles.input}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        </div>
        <div className={styles.item}>
          <button className={`${styles.customBtn}`} type="submit">
            로그인
          </button>
        </div>
        <div className={styles.signup}>
          <pre>아직 계정이 없으신가요? </pre>
          <pre
            onClick={() => setIsSignupModalOpen(true)}
            style={{ cursor: "pointer", color: "#fff" }}
          >
            회원가입
          </pre>
        </div>
      </form>
      <div>
      <SignupModal
        isOpen={isSignupModalOpen}
        onClose={() => setIsSignupModalOpen(false)}
      />
      </div>
    </div>
  );
};

export default Login;
