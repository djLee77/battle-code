import DockLayout from "rc-dock";
import RoomList from "./pages/room-list";
import { useRef } from "react";
import "./styles/rc-dock-dark.css"; // 다크모드(커스텀)
import Navigation from "./components/navigation";
import "./styles/global-style.css";

// 탭 형식에 맞게 만드는 함수
function getTab(id: string, component: any) {
  return {
    id, // 탭의 고유한 ID
    content: component, // 탭 내용
    title: id, // 탭 제목
  };
}

function App() {
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

export default App;
