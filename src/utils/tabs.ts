// 탭 형식에 맞게 만드는 함수
export const getTab = (id: string, component: any, isClose: boolean) => {
  return {
    id, // 탭의 고유한 ID
    content: component, // 탭 내용
    title: id, // 탭 제목
    closable: isClose,
  };
};

// 탭 추가 함수
export const addTab = (tabName: string, component: any, dockLayoutRef: React.RefObject<any>) => {
  // 이미 탭에 존재하는지 확인
  if (!dockLayoutRef.current.updateTab(tabName, getTab(tabName, component, true))) {
    // 대기방 추가할 때 대기방 탭이 존재하는지 확인 존재할시 삭제
    if (tabName.includes("번방")) {
      dockLayoutRef.current.state.layout.dockbox.children.map((child: any) => {
        const tabName = child.tabs?.filter((tab: any) => tab.id.includes("번방"))[0];
        console.log(tabName);
        dockLayoutRef.current.dockMove(tabName, null, "remove");
      });
    }

    const newTab = getTab(tabName, component, true); // 새로운 탭 생성
    dockLayoutRef.current.dockMove(newTab, "my_panel", "middle");
  }
};
