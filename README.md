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
![battlecode-login](https://github.com/djLee77/battle-code/assets/117016295/f570e0ea-f33d-4d50-b54b-c2acb6f57658)
- 대기실 구독: 사용자가 대기실 페이지에 접속하면, 제일 먼저 대기실 pub를 구독합니다. 이를 통해 실시간으로 대기방 목록을 받아볼 수 있습니다.
- 대기방 데이터 수신: STOMP 프로토콜을 사용하여 실시간으로 대기방 데이터를 수신합니다.
- 대기방 목록 표시: 수신된 대기방 데이터를 바탕으로 현재 활성화된 대기방 목록을 사용자에게 표시합니다.

### 인게임
![battlecode-ingame](https://github.com/djLee77/battle-code/assets/117016295/f0e24fa9-d316-4716-a37d-56fd9ef55c7f)

### 항복
![battlecode-ingame-surrend](https://github.com/djLee77/battle-code/assets/117016295/dc896f47-e592-46ef-b668-3cdb61c9f075)

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
