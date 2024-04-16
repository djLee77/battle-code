import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import { IconButton } from "@mui/material";
import styles from "../styles/navigation.module.css";
import { addTab } from "../utils/tabs";
import User from "./tabs/user";
import { removeRefreshToken, removeAccessToken } from "../utils/cookie";
import { useNavigate } from "react-router-dom";

interface NavigationProps {
  dockLayoutRef: React.RefObject<any>; // DockLayout 컴포넌트에 대한 RefObject 타입 지정
}

export default function Navigation({ dockLayoutRef }: NavigationProps) {
  const navigate = useNavigate();
  
  const onClickUserButton = () => {
    addTab("유저 정보", <User />, dockLayoutRef);
  };

  const onClickLogout = () => {
    removeRefreshToken();
    removeAccessToken();
    navigate('/login');
  }
  return (
    <nav className={styles.navigation}>
      <IconButton size="large" onClick={onClickUserButton}>
        <AccountCircleIcon />
      </IconButton>
      <IconButton size="large" onClick={onClickLogout}>
        <LogoutIcon />
      </IconButton>
    </nav>
  );
}
