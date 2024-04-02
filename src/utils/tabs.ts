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
    const newTab = getTab(tabName, component, true); // 새로운 탭 생성
    dockLayoutRef.current.dockMove(newTab, "my_panel", "middle"); // 생성한 탭을 DockLayout에 추가
  }
};
