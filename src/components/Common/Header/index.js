import React from "react";
import Button from "../Button";
import TemporaryDrawer from "./drawer";
import "./styles.css";
import Switch from "@mui/material/Switch";
import { toast } from "react-toastify";
import { useThemeContext } from "../../../context/ThemeContext";
import { Link } from "react-router-dom";

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
  <Switch checked={theme === "dark"} onClick={changeMode} />
        <Link to="/" className="link">Home</Link>
        <Link to="/compare" className="link">Compare</Link>
        <Link to="/watchlist" className="link">Watchlist</Link>
        <Link to="/dashboard">
          <Button text="Dashboard" dashboard={true} />
        </Link>
        <Link to="/news" className="link">News</Link>
      </div>

      <div className="drawer-component">
        <TemporaryDrawer />
      </div>
    </div>
  );
}

export default Header;
