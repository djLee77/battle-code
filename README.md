<div  align="center">

  # Battle Code !

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Spring Boot](https://img.shields.io/badge/spring-%236DB33F.svg?style=for-the-badge&logo=spring&logoColor=white)
![MySQL](https://img.shields.io/badge/mysql-%2300f.svg?style=for-the-badge&logo=mysql&logoColor=white)

</div>

## 개요
Battle Code는 기존의 온라인 저지 사이트(예: 백준, 프로그래머스 등)에 실시간 대결 기능을 추가한 웹 애플리케이션입니다. 이 프로젝트의 목표는 사용자들이 코딩을 게임처럼 즐길 수 있도록 하여, 코딩 학습의 흥미를 높이고, 사용자 간의 경쟁을 유도하는 것입니다.

- 실시간 대결 매칭: 사용자들이 실시간으로 코딩 대결을 할 수 있습니다.
- 실시간 채팅: 대결 중 다른 사용자와 실시간으로 소통할 수 있습니다.
- 실시간 채점: 코드를 제출하면 즉시 채점 결과를 확인할 수 있습니다.
- 사용자 관리: 문제 풀이 이력 및 성과를 관리할 수 있습니다.

## 화면 구성
![image](https://github.com/djLee77/battle-code/assets/117016295/71ce0275-b078-4359-848a-24fc4a488646)

## 주요 기능
### 로그인
![battlecode-login](https://github.com/djLee77/battle-code/assets/117016295/edd49c7e-0df0-42f8-b62d-fdfedeef7ad6)
- 사용자 인증: 사용자가 이메일과 비밀번호를 입력하여 로그인 요청을 하면, 서버는 입력된 정보를 기반으로 사용자를 인증합니다.
- JWT 발급: 인증이 성공하면, 서버는 사용자에게 JWT(JSON Web Token)를 발급합니다.
- JWT 저장: 발급된 JWT는 사용자의 브라우저 쿠키에 저장되어, 이후의 요청에서 인증 토큰으로 사용됩니다.
- 보안: JWT는 HTTP-Only 속성으로 설정되어 자바스크립트를 통해 접근할 수 없으며, 이를 통해 XSS(Cross-Site Scripting) 공격을 방지합니다.

<br>

### 대기실
![battlecode-enter-room](https://github.com/djLee77/battle-code/assets/117016295/6a052556-9de4-44d2-92d9-bde0d802603d)
- 대기실 구독: 사용자가 대기실 페이지에 접속하면, 제일 먼저 대기실 pub를 구독합니다. 이를 통해 실시간으로 대기방 목록을 받아볼 수 있습니다.
- 대기방 데이터 수신: STOMP 프로토콜을 사용하여 실시간으로 대기방 데이터를 수신합니다.
- 대기방 목록 표시: 수신된 대기방 데이터를 바탕으로 현재 활성화된 대기방 목록을 사용자에게 표시합니다.

<br>

### 대기방
![battlecode-waiting-room2](https://github.com/djLee77/battle-code/assets/117016295/97490064-f450-4ad1-a8ba-c09b4dfc58cd)
![battlecode-waiting-room](https://github.com/djLee77/battle-code/assets/117016295/4eba4fd3-7f95-4317-9e79-e2dcb5181740)
- 방 구독: 사용자가 특정 대기방에 입장하면 해당 방을 구독하여 실시간 데이터를 수신할 준비를 합니다.
- 실시간 채팅: 사용자가 채팅 메시지를 보내면, 같은 방을 구독한 모든 사용자에게 채팅 메시지가 전달됩니다.
- 언어 선택 및 준비 상태: 사용자가 사용할 언어와 준비 완료 상태를 서버에 전송하면, 같은 방에 있는 모든 사용자에게 해당 정보가 실시간으로 업데이트되어 화면에 출력됩니다.

<br>

### 인게임
![battlecode-ingame](https://github.com/djLee77/battle-code/assets/117016295/fe3a53b4-c7f2-430a-a054-4abe6c21cc5c)
![battlecode-ingame-surrend](https://github.com/djLee77/battle-code/assets/117016295/dc896f47-e592-46ef-b668-3cdb61c9f075)
- 코드 제출 및 실행: 사용자가 API 요청을 통해 서버에 코드를 제출하면, 서버는 Docker를 사용하여 제출된 코드를 격리된 환경에서 실행합니다.
- 테스트케이스 실행 및 결과 전송: 서버는 제출된 코드를 테스트케이스 별로 실행하고, 각 테스트케이스를 실행할 때마다 현재 통과된 테스트케이스가 몇번째 테스트케이스인지와 총 테스트케이스의 개수, 그리고 어떤 유저의 테스트 결과인지를 웹소켓을 통해 방을 구독한 모든 사용자에게 전송합니다.
- 채점 현황 표시: 클라이언트는 서버로부터 받은 데이터를 이용하여 progress bar에 통과율을 계산하여 표시합니다. (현재 맞은 테스트케이스의 개수 / 총 테스트케이스의 개수) * 100%로 통과율을 계산합니다.

- 게임 종료 분기:
  - 모든 유저가 정답 처리 되었거나 항복한 경우: 모든 유저가 문제를 풀어 정답 처리가 되었거나 항복 버튼을 눌렀을 때 게임이 종료됩니다.
  - 제한 시간이 끝났을 경우: 설정된 제한 시간이 다 되었을 때 게임이 자동으로 종료됩니다.

- 게임 결과 처리:
  - 승자 결정: 가장 먼저 정답을 맞춘 유저가 승자가 됩니다. 승자는 추가 포인트를 획득합니다.
  - DRAW 처리: 제한 시간이 끝났는데 정답을 맞춘 유저가 아무도 없을 경우, 게임은 무승부(DRAW)로 처리됩니다.

- 포인트 차감 및 보상:
  - 가장 먼저 정답을 맞추지는 못했지만 제한 시간 안에 문제를 풀었을 경우에는 포인트가 차감되지 않습니다.
  - 제한 시간 내에 문제를 풀지 못한 경우에는 포인트가 차감됩니다.

## ERD
![image](https://github.com/djLee77/battle-code/assets/117016295/51428d29-430f-4a4c-b0b8-21749700bb0c)

## 팀원 소개
### 🌞Front-end
- [이대준](https://github.com/djLee77)
- [김동건](https://github.com/ehdrjs4502)
### 🌚Back-end
- [이병선](https://github.com/dlqudtjs)

## 기술 스택
**Front-end**
- Typescript 4.9.5
- React 18.2.0
  
**Back-end**
- MySql 8.0
- Springboot 3.2.0

**기타 도구 및 주요 라이브러리**
- Stomp 1.2
- StompJs 2.3.3
- Zustand 4.5.2
- Eventemitter3 5.0.1
