import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import styles from "../styles/Modal.module.css";

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SignupModal: React.FC<SignupModalProps> = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [checkingUserId, setCheckingUserId] = useState(false);
  const [userIdAvailable, setUserIdAvailable] = useState(true);

  const serverUrl = process.env.REACT_APP_SERVER_URL;

  const checkUserIdAvailability = async () => {
    setCheckingUserId(true);
    try {
      // 서버에 중복 검사 요청을 보냅니다.
      // 이 예제에서는 요청 URL과 응답 형식이 가정되어 있습니다.
      const response = await axios.get(
        `${serverUrl}/api/checkUserId?userId=${userId}`
      );
      // 서버에서 중복된 아이디가 없다고 응답하면 true, 중복되었다면 false를 반환한다고 가정
      setUserIdAvailable(response.data.available);
    } catch (error) {
      console.error("아이디 중복 검사 중 오류가 발생했습니다.", error);
      setUserIdAvailable(false); // 오류 발생 시 사용 가능하지 않다고 가정
    }
    setCheckingUserId(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // if (!checkingUserId || !userIdAvailable) {
    //   alert("아이디 중복검사를 실시해주세요.");
    //   return;
    // }

    if (password !== passwordConfirm) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    // 회원가입 로직
    console.log(username, userId, password);
    try {
      await axios.post(`${serverUrl}v1/oauth/sign-up`, {
        userId: userId,
        nickname: username,
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
          error.response?.data?.message ?? "서버에서 응답을 받지 못했습니다.";
        console.error("회원가입 실패:", message);
      } else {
        // Axios 외의 에러 처리
        console.error("회원가입 실패: 알 수 없는 에러 발생");
      }
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className={styles.modalBackdrop} onClick={onClose}></div>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>회원가입</h2>
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
                    setUserIdAvailable(true);
                  }}
                  placeholder="User ID"
                  required
                />
                <button
                  type="button"
                  onClick={checkUserIdAvailability}
                  disabled={checkingUserId}
                  className={`${styles.customBtn} ${styles.btn2}`}
                >
                  중복 검사
                </button>
              </div>
            </div>
            <div className={styles.item}>
              <input
                className={styles.input}
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
              />
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
              />
            </div>
            <div className={styles.modalActions}>
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