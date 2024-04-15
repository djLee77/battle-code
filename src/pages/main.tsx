import DockLayout, { LayoutData } from "rc-dock";
import RoomList from "../components/tabs/room-list";
import { useCallback, useEffect, useMemo, useRef } from "react";
import "../styles/rc-dock-dark.css"; // 다크모드(커스텀)
import Navigation from "../components/navigation";
import { getRefreshToken, removeRefreshToken, setRefreshToken, setAccessToken } from "../utils/cookie";
import { useNavigate } from "react-router-dom";
import { getTab } from "utils/tabs";
import * as StompJs from "@stomp/stompjs";
import useWebSocketStore from "store/websocketStore";

export default function MainPage() {
  const navigate = useNavigate();
  const serverUrl = process.env.REACT_APP_SERVER_URL;
  const { webSocketClient, connectWebSocket } = useWebSocketStore();

  // 컴포넌트가 마운트될 때 WebSocket 연결 시도
  useEffect(() => {
    const refreshToken = getRefreshToken(); // 적절한 refresh token 설정
    if (refreshToken) {
      connectWebSocket(refreshToken);
    }
  }, [connectWebSocket]); // connectWebSocket 함수는 컴포넌트가 마운트될 때 한 번만 호출

  //Todo : 아래 useEffect 삭제 후, api 요청시마다 header에 accessToken 넣고, accessToken이 만료되었을 시, refreshToken으로 재발급
  // useEffect(() => {
  //   const refreshToken = getRefreshToken();
  //   console.log(refreshToken);
  //   axios
  //     .get(`${serverUrl}v1/oauth/refresh-token`, {
  //       headers: {
  //         Authorization: `Bearer ${refreshToken}`,
  //       },
  //     })
  //     .then((response) => {
  //       const { accessToken, refreshToken } = response.data.data;
  //       setAccessToken(accessToken);
  //       setRefreshToken(refreshToken);
  //       // alert("환영합니다!");
  //     })
  //     .catch(() => {
  //       removeRefreshToken();
  //       navigate("/login");
  //     });
  // }, [navigate, setAccessToken, serverUrl]);

  const dockLayoutRef = useRef(null); // DockLayout 컴포넌트에 대한 ref 생성
  // 초기 레이아웃 설정
  const defaultLayout = useMemo<LayoutData>(
    () => ({
      dockbox: {
        mode: "vertical", // 수직 모드로 설정
        children: [
          {
            id: "my_panel", // 패널의 고유한 ID
            tabs: [
              // 패널에 초기 탭 설정
              getTab("대기방 목록", <RoomList dockLayoutRef={dockLayoutRef} />, false),
            ],
            panelLock: {},
          },
        ],
        size: 50,
      },
    }),
    []
  );

  return (
    <div className="App">
      <Navigation dockLayoutRef={dockLayoutRef} />
      <DockLayout
        ref={dockLayoutRef} // ref 설정
        defaultLayout={defaultLayout} // 초기 레이아웃 설정
        style={{ position: "absolute", left: 0, top: 50, right: 0, bottom: 0 }} // 스타일 설정
      />
    </div>
  );
}
