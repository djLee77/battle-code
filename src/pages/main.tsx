import DockLayout, { LayoutData } from "rc-dock";
import RoomList from "../components/tabs/room-list";
import { useCallback, useEffect, useMemo, useRef } from "react";
import "../styles/rc-dock-dark.css"; // 다크모드(커스텀)
import Navigation from "../components/navigation";
import { getRefreshToken, removeRefreshToken, setRefreshToken, setAccessToken } from "../utils/cookie";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getTab } from "utils/tabs";
import * as StompJs from "@stomp/stompjs";

export default function MainPage() {
  const navigate = useNavigate();
  const serverUrl = process.env.REACT_APP_SERVER_URL;
  const wsUrl = process.env.REACT_APP_WS_URL;

  const connect = useCallback(() => {
    const refreshToken = getRefreshToken();
    // 소켓 연결
    if (refreshToken !== undefined) {
      try {
        const client = new StompJs.Client({
          brokerURL: `ws://192.168.28.207:8080/socket-endpoint`,
          connectHeaders: {
            Authorization: `Bearer ${refreshToken}`,
          },
        });

        client.activate(); // 클라이언트 활성화

        client.onConnect = () => {
          console.log("WebSocket 연결 성공");
          client.subscribe(
            "/topic/chat",
            (message) => {
              console.log("Received message:", message.body);
            },
            {
              Authorization: `Bearer ${refreshToken}`,
            }
          );

          // WebSocket 연결 이후에 메시지 전송
          client.publish({
            destination: "/app/chat",
            body: JSON.stringify("Hello!"),
          });
        };

        console.log(client);
      } catch (err) {
        console.log(err);
      }
    } else {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    connect();
  }, []);

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
