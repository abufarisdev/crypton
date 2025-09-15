import React, { useEffect, useState } from "react";
import Drawer from "@mui/material/Drawer";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import { IconButton } from "@mui/material";
import Switch from "@mui/material/Switch";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

export default function TemporaryDrawer() {
  const [open, setOpen] = useState(false);
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
    <div>
      <IconButton onClick={() => setOpen(true)}>
        <MenuRoundedIcon className="link" />
      </IconButton>
      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <div className="drawer-div">
          <Link to="/" className="link" onClick={() => setOpen(false)}>Home</Link>
          <Link to="/compare" className="link" onClick={() => setOpen(false)}>Compare</Link>
          <Link to="/watchlist" className="link" onClick={() => setOpen(false)}>Watchlist</Link>
          <Link to="/price-alerts" className="link" onClick={() => setOpen(false)}>Price Alerts</Link>
          <Link to="/dashboard" className="link" onClick={() => setOpen(false)}>Dashboard</Link>

          <Switch 
            checked={darkMode} 
            onChange={changeMode}
            sx={{
              '& .MuiSwitch-track': {
                backgroundColor: '#f18500',
              },
              '& .MuiSwitch-thumb': {
                backgroundColor: darkMode ? '#fff' : '#f18500',
              },
              '& .Mui-checked .MuiSwitch-thumb': {
                backgroundColor: '#fff',
              },
              '& .Mui-checked + .MuiSwitch-track': {
                backgroundColor: '#f18500 !important',
              },
            }}
          />
        </div>
      </Drawer>
    </div>
  );
}
