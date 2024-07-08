import React, { useState, useRef } from 'react';
import axios, { AxiosError } from 'axios';
import styles from '../styles/login/signup-modal.module.css';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SignupModal: React.FC<SignupModalProps> = ({ isOpen, onClose }) => {
  const [language, setLanguage] = useState('');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [userIdAvailable, setUserIdAvailable] = useState(false);
  const userIdRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const serverUrl = process.env.REACT_APP_SERVER_URL;

  const validateUserId = (userId: string) => {
    const regex = /^[a-zA-Z0-9]{1,10}$/;
    return regex.test(userId);
  };

  const checkUserIdAvailability = async () => {
    if (userId === '') return;

    if (!validateUserId(userId)) {
      alert('User ID는 10자리 이하의 영어와 숫자만 가능합니다.');
      userIdRef.current?.focus(); // userId 입력 필드에 포커스
      return;
    }

    try {
      // 서버에 중복 검사 요청을 보냅니다.
      const response = await axios.get(
        `${serverUrl}v1/oauth/check-userId/${userId}`
      );
      // 서버에서 중복된 아이디가 없다고 응답하면 true, 중복되었다면 false를 반환한다고 가정
      console.log(response.data);
      if (response.data.status === 200) {
        setUserIdAvailable(true);
        alert('사용 가능한 아이디입니다!');
      }
    } catch (error) {
      console.error('아이디 중복 검사 중 오류가 발생했습니다.', error);
      alert('중복된 아이디가 존재합니다.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userIdAvailable) {
      alert('아이디 중복검사를 실시해주세요.');
      return;
    }

    if (password !== passwordConfirm) {
      alert('비밀번호가 일치하지 않습니다.');
      passwordRef.current?.focus();
      return;
    }

    // 회원가입 로직
    console.log(language, userId, password);
    try {
      await axios.post(`${serverUrl}v1/oauth/sign-up`, {
        userId: userId,
        language: language,
        password: password,
        passwordCheck: passwordConfirm,
      });
      onClose(); // 모달 닫기
    } catch (error: unknown) {
      // 타입스크립트에서 error 타입을 unknown으로 처리
      if (axios.isAxiosError(error)) {
        // error가 AxiosError 타입인지 확인
        // 에러 메시지가 error.response 안에 있고, 그 안의 data 객체 안에 message 필드로 제공되는 경우
        const message =
          error.response?.data?.message ?? '서버에서 응답을 받지 못했습니다.';
        console.error('회원가입 실패:', message);
      } else {
        // Axios 외의 에러 처리
        console.error('회원가입 실패: 알 수 없는 에러 발생');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className={styles.modalBackdrop} onClick={onClose}></div>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <div className={styles.head}>
            <h2>SignUp</h2>
          </div>
          <span className={styles.closeButton} onClick={onClose}>
            &times;
          </span>
        </div>
        <form onSubmit={handleSubmit}>
          <div className={styles.modalContent}>
            <div className={styles.signupBox}>
              <div className={styles.item}>
                <input
                  className={styles.input}
                  type="text"
                  value={userId}
                  onChange={(e) => {
                    setUserId(e.target.value);
                    setUserIdAvailable(false);
                  }}
                  placeholder="User ID"
                  ref={userIdRef}
                  required
                />
                <button
                  type="button"
                  onClick={checkUserIdAvailability}
                  disabled={userIdAvailable}
                  className={styles.customBtn}
                >
                  중복검사
                </button>
              </div>
            </div>
            <div className={styles.item}>
              <select
                className={styles.selectBox}
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                required
              >
                <option value="" disabled hidden>
                  Language
                </option>
                <option value="javascript">Javascript</option>
                <option value="java">Java</option>
                <option value="python">Python</option>
                <option value="c">C</option>
              </select>
            </div>
            <div className={styles.item}>
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
              <input
                className={styles.input}
                type="password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                placeholder="Confirm Password"
                required
                ref={passwordRef}
              />
            </div>
            <div className={styles.item}>
              <button
                type="submit"
                className={`${styles.customBtn} ${styles.btn2}`}
              >
                회원가입
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default SignupModal;
