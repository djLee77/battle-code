import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { IconButton } from '@mui/material';
import styles from '../styles/navigation.module.css';
import { addTab } from '../utils/tabs';
import MyPage from '../tabs/MyPage';
import useWebSocketStore from 'store/useWebSocketStore';
import { useNavigate } from 'react-router-dom';
import { removeAccessToken, removeRefreshToken } from 'utils/cookie';
import useRoomStore from 'store/useRoomStore';

interface NavigationProps {
  dockLayoutRef: React.RefObject<any>; // DockLayout 컴포넌트에 대한 RefObject 타입 지정
}

const Navigation = ({ dockLayoutRef }: NavigationProps) => {
  const navigate = useNavigate();
  const { resetState } = useRoomStore();
  const {
    webSocketClient,
    setIsLogout,
    reconnectAttempts,
    maxReconnectAttempts,
    resetWebSocket,
  } = useWebSocketStore();

  const handleUserInfo = () => {
    addTab('유저 정보', <MyPage />, dockLayoutRef);
  };

  const handleLogout = () => {
    setIsLogout(true);
    webSocketClient?.deactivate();
    removeRefreshToken();
    removeAccessToken();
    resetState();
    resetWebSocket();
    navigate('/login');
  };

  if (reconnectAttempts === maxReconnectAttempts) {
    alert('소켓 재연결 최대 횟수 도달.. 재 로그인 바랍니다.');
    handleLogout();
  }

  return (
    <nav className={styles.navigation}>
      <IconButton size="large" onClick={handleUserInfo}>
        <AccountCircleIcon />
      </IconButton>
      <IconButton size="large" onClick={handleLogout}>
        <LogoutIcon />
      </IconButton>
    </nav>
  );
};

export default Navigation;
