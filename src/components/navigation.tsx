import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { IconButton } from '@mui/material';
import styles from '../styles/navigation.module.css';
import { addTab } from '../utils/tabs';
import User from './tabs/user';
import useWebSocketStore from 'store/websocket-store';
import { removeRefreshToken, removeAccessToken } from '../utils/cookie';
import { useNavigate } from 'react-router-dom';

interface NavigationProps {
  dockLayoutRef: React.RefObject<any>; // DockLayout 컴포넌트에 대한 RefObject 타입 지정
}

export default function Navigation({ dockLayoutRef }: NavigationProps) {
  const navigate = useNavigate();
  const { webSocketClient } = useWebSocketStore();

  const handleUserInfo = () => {
    addTab('유저 정보', <User />, dockLayoutRef);
  };

  const handleLogout = () => {
    webSocketClient?.deactivate();
    console.log(webSocketClient);
    removeRefreshToken();
    removeAccessToken();
    navigate('/login');
  };

  return (
    <nav className={styles.navigation}>
      <IconButton size="large" onClick={handleUserInfo}>
        <AccountCircleIcon />
      </IconButton>
      <IconButton size="large">
        <LogoutIcon onClick={handleLogout} />
      </IconButton>
    </nav>
  );
}
