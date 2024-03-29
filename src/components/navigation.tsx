import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import { IconButton } from "@mui/material";
import styles from "../styles/navigation.module.css";

export default function Navigation() {
  return (
    <nav className={styles.navigation}>
      <IconButton size="large">
        <AccountCircleIcon />
      </IconButton>
      <IconButton size="large">
        <LogoutIcon />
      </IconButton>
    </nav>
  );
}
