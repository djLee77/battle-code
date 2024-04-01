import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import { IconButton } from "@mui/material";
import styles from "../styles/navigation.module.css";
import { addTab } from "../utils/tabs";
import User from "./tabs/user";

interface NavigationProps {
  dockLayoutRef: React.RefObject<any>; // DockLayout 컴포넌트에 대한 RefObject 타입 지정
}

export default function Navigation({ dockLayoutRef }: NavigationProps) {
  const onClickUserButton = () => {
    addTab("유저 정보", <User />, dockLayoutRef);
  };
  return (
    <nav className={styles.navigation}>
      <IconButton size="large" onClick={onClickUserButton}>
        <AccountCircleIcon />
      </IconButton>
      <IconButton size="large">
        <LogoutIcon />
      </IconButton>
    </nav>
  );
}
