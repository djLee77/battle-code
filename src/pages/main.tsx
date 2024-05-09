import DockLayout, { LayoutData } from 'rc-dock';
import RoomList from '../components/tabs/room-list';
import { useEffect, useMemo, useRef } from 'react';
import '../styles/rc-dock-dark.css'; // 다크모드(커스텀)
import Navigation from '../components/navigation';
import { getAccessToken } from '../utils/cookie';
import { useNavigate } from 'react-router-dom';
import { getTab } from 'utils/tabs';
import useWebSocketStore from 'store/websocket-store';

export default function MainPage() {
  const navigate = useNavigate();
  const { isConnected, connectWebSocket, subscribe } = useWebSocketStore();

  // 컴포넌트가 마운트될 때 WebSocket 연결 시도
  useEffect(() => {
    const accessToken = getAccessToken(); // accesstoken 가져오기
    if (!accessToken) navigate('/login'); // accesstoken 없으면 로그인 창으로 이동
    if (accessToken) connectWebSocket(accessToken); // accesstoken 있으면 웹 소켓 연결 시도
  }, []); // 컴포넌트가 마운트될 때 한 번만 호출

  // webscoket 연결 후 default, error방 구독
  useEffect(() => {
    if (isConnected) {
      console.log(isConnected);
      // default room 구독
      subscribe('/topic/room/0', (message: any) => {
        console.log('공개 대기실 : ', message.body);
      });
      // 에러 메시지 room 구독 (에러 발생 시 메시지로 알려줌)
      subscribe('/topic/error', (message: any) => {
        console.log('error room : ', message.body);
      });
    }
  }, [isConnected]);

  const dockLayoutRef = useRef<DockLayout>(null); // DockLayout 컴포넌트에 대한 ref 생성
  // 초기 레이아웃 설정
  const defaultLayout = useMemo<LayoutData>(
    () => ({
      dockbox: {
        mode: 'vertical', // 수직 모드로 설정
        children: [
          {
            id: 'my_panel', // 패널의 고유한 ID
            tabs: [
              // 패널에 초기 탭 설정
              getTab(
                '대기방 목록',
                <RoomList dockLayoutRef={dockLayoutRef} />,
                false
              ),
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
      {isConnected && (
        <DockLayout
          ref={dockLayoutRef} // ref 설정
          defaultLayout={defaultLayout} // 초기 레이아웃 설정
          style={{
            position: 'absolute',
            left: 0,
            top: 50,
            right: 0,
            bottom: 0,
          }} // 스타일 설정
        />
      )}
    </div>
  );
}
