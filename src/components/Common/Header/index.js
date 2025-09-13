import React, { useEffect, useState } from "react";
import Button from "../Button";
import TemporaryDrawer from "./drawer";
import "./styles.css";
import Switch from "@mui/material/Switch";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

function Header() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (localStorage.getItem("theme") === "dark") setDark();
    else setLight();
  }, []);

  const changeMode = () => {
    if (localStorage.getItem("theme") !== "dark") setDark();
    else setLight();

    setDarkMode(!darkMode);
    toast.success("Theme Changed!");
  };

  const setDark = () => {
    localStorage.setItem("theme", "dark");
    document.documentElement.setAttribute("data-theme", "dark");
  };

  const setLight = () => {
    localStorage.setItem("theme", "light");
    document.documentElement.setAttribute("data-theme", "light");
  };

  return (
    <div className="header">
      <h1>
        Crypton<span style={{ color: "var(--blue)" }}>.</span>
      </h1>

      <div className="links">
        <Switch checked={darkMode} onClick={changeMode} />
        <Link to="/" className="link">Home</Link>
        <Link to="/compare" className="link">Compare</Link>
        <Link to="/watchlist" className="link">Watchlist</Link>
        <Link to="/dashboard">
          <Button text="Dashboard" />
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
