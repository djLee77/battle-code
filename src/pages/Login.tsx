import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import SignupModal from '../components/SignupModal';
import {
  setRefreshToken,
  removeRefreshToken,
  setAccessToken,
} from '../utils/cookie';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/login/login.module.css';

const Login = () => {
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');

  const serverUrl = process.env.REACT_APP_SERVER_URL;
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${serverUrl}v1/oauth/sign-in`, {
        userId: userId,
        password: password,
      });
      const { accessToken, refreshToken } = response.data.data;
      setRefreshToken(refreshToken);
      setAccessToken(accessToken);
      localStorage.setItem('id', userId);
      navigate('/');
      console.log('로그인 성공');
    } catch (error: any) {
      // 에러면 error 출력 아니면 log 출력
      if (error instanceof Error) {
        console.error(error);
      } else {
        console.log(error);
      }
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ?? '서버에서 응답을 받지 못했습니다.';
        console.error('로그인 실패:', message);
      } else {
        // Axios 외의 에러 처리
      }
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
            style={{ zIndex: '5' }}
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
            style={{ cursor: 'pointer', color: '#fff' }}
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
