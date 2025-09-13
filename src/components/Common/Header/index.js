import React from "react";
import Button from "../Button";
import TemporaryDrawer from "./drawer";
import "./styles.css";
import Switch from "@mui/material/Switch";
import { toast } from "react-toastify";
import { useThemeContext } from "../../../context/ThemeContext";

function Header() {
  const { theme, toggleTheme } = useThemeContext();

  const changeMode = () => {
    toggleTheme();
    toast.success("Theme Changed!");
  };

  return (
    <div className="header">
      <h1>
        Crypton<span style={{ color: "var(--blue)" }}>.</span>
      </h1>
      <div className="links">
  <Switch checked={theme === "dark"} onClick={() => changeMode()} />
        <a href="/">
          <p className="link">Home</p>
        </a>
        <a href="/compare">
          <p className="link">Compare</p>
        </a>
        <a href="/watchlist">
          <p className="link">Watchlist</p>
        </a>
        <a href="/dashboard">
          <Button text={"dashboard"} />
        </a>
      </div>
      <div className="drawer-component">
        <TemporaryDrawer />
      </div>
    </div>
  );
}

export default Header;
