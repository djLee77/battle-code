import DockLayout from 'rc-dock';
import type { PanelData, TabData } from 'rc-dock';
import React from 'react';

function isPanelData(x: any): x is PanelData {
  return x.tabs !== undefined;
}

// 탭 형식에 맞게 만드는 함수
export const getTab = (
  id: string,
  component: React.JSX.Element,
  isClose: boolean
): TabData => {
  return {
    id, // 탭의 고유한 ID
    content: component, // 탭 내용
    title: id, // 탭 제목
    closable: id.includes('번방') ? false : isClose,
    cached: true,
  };
};

// 탭 제거 함수
export const removeTab = (
  dockLayoutRef: React.RefObject<DockLayout>,
  idSubstring: string
) => {
  dockLayoutRef?.current?.state.layout.dockbox.children.forEach((child) => {
    if (isPanelData(child)) {
      const tabData = child.tabs?.find((tab: any) =>
        tab.id.includes(idSubstring)
      );
      console.log('탭 이름 :', tabData);
      if (tabData) {
        console.log(dockLayoutRef);
        dockLayoutRef?.current?.dockMove(tabData, null, 'remove');
        console.log('제거', dockLayoutRef);
      }
    }
  });

  dockLayoutRef?.current?.state?.layout?.floatbox?.children.forEach((child) => {
    if (isPanelData(child)) {
      const tabData = child.tabs?.find((tab: any) =>
        tab.id.includes(idSubstring)
      );
      console.log('탭 이름 :', tabData);
      if (tabData) {
        console.log(dockLayoutRef);
        dockLayoutRef?.current?.dockMove(tabData, null, 'remove');
        console.log('제거', dockLayoutRef);
      }
    }
  });
};

// 탭 추가 함수
export const addTab = (
  tabName: string,
  component: any,
  dockLayoutRef: React.RefObject<DockLayout>
) => {
  // 대기방 추가할 때 대기방 탭이 존재하는지 확인 존재할시 삭제

  if (tabName.includes('번방')) {
    // '번방' 포함된 탭 제거
    removeTab(dockLayoutRef, '번방');

    setTimeout(() => {
      const newTab = getTab(tabName, component, true); // 새로운 탭 생성
      dockLayoutRef?.current?.dockMove(newTab, 'my_panel', 'middle');
      console.log('추가');
    }, 100); // 0.1초 뒤에 실행

    return;
  }

  // 이미 탭에 존재하는지 확인
  if (
    !dockLayoutRef?.current?.updateTab(
      tabName,
      getTab(tabName, component, true)
    )
  ) {
    const newTab = getTab(tabName, component, true); // 새로운 탭 생성
    dockLayoutRef?.current?.dockMove(newTab, 'my_panel', 'middle');
    return;
  }
};
