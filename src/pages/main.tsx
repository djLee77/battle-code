import DockLayout from "rc-dock";
import RoomList from "../components/tabs/room-list";
import { useEffect, useRef } from "react";
import "../styles/rc-dock-dark.css"; // 다크모드(커스텀)
import Navigation from "../components/navigation";
import { getRefreshToken, removeRefreshToken } from "../utils/cookie";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useAuthStore from "../store/userStore";

// 탭 형식에 맞게 만드는 함수
function getTab(id: string, component: any) {
  return {
    id, // 탭의 고유한 ID
    content: component, // 탭 내용
    title: id, // 탭 제목
  };
}

export default function MainPage() {
  const navigate = useNavigate();
  const serverUrl = process.env.REACT_APP_SERVER_URL;
  const { setAccessToken } = useAuthStore();

  useEffect(() => {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      axios
        .post(`${serverUrl}/api/refresh`, { refreshToken })
        .then((response) => {
          const { accessToken } = response.data;
          setAccessToken(accessToken); // Zustand 스토어에 accessToken 저장
        })
        .catch(() => {
          removeRefreshToken(); // 쿠키에서 refreshToken 제거
          navigate("/login"); // 로그인 페이지로 리다이렉션
        });
    } else {
      alert("토큰이 만료되어 로그인 페이지로 이동합니다.");
      navigate("/login"); // refreshToken이 없으면 로그인 페이지로 리다이렉션
    }
  }, [navigate, setAccessToken, serverUrl]);
  const dockLayoutRef = useRef(null); // DockLayout 컴포넌트에 대한 ref 생성
  // 초기 레이아웃 설정
  const defaultLayout: any = {
    dockbox: {
      mode: "vertical", // 수직 모드로 설정
      children: [
        {
          id: "my_panel", // 패널의 고유한 ID
          tabs: [
            // 패널에 초기 탭 설정
            getTab("대기방 목록", <RoomList />),
          ],
        },
      ],
    },
  };

  return (
    <div className="App">
      <Navigation />
      <DockLayout
        ref={dockLayoutRef} // ref 설정
        defaultLayout={defaultLayout} // 초기 레이아웃 설정
        style={{ position: "absolute", left: 0, top: 50, right: 0, bottom: 0 }} // 스타일 설정
      />
    </div>
  );
}
