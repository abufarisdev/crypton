import React from "react";
import Button from "../Button";
import TemporaryDrawer from "./drawer";
import "./styles.css";
import Switch from "@mui/material/Switch";
import { useThemeContext } from "../../../context/ThemeContext";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

function Header() {
  const { theme, toggleTheme } = useThemeContext();

  const changeMode = () => {
    toggleTheme();
  };

  const iconVariants = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
  };

  return (
    <div className="header">
      <h1>
        Crypton<span style={{ color: "var(--blue)" }}>.</span>
      </h1>

      <div className="links">
        {/* Animated Theme Toggle */}
        <Switch
          checked={theme === "dark"}
          onChange={changeMode}
          icon={
            <AnimatePresence mode="wait" initial={false}>
              {theme === "light" && (
                <motion.span
                  key="sun"
                  variants={iconVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  style={{ fontSize: "1.3rem", color: "#facc15" }}
                >
                  🌞
                </motion.span>
              )}
            </AnimatePresence>
          }
          checkedIcon={
            <AnimatePresence mode="wait" initial={false}>
              {theme === "dark" && (
                <motion.span
                  key="moon"
                  variants={iconVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  style={{ fontSize: "1.3rem", color: "#f1f5f9" }}
                >
                  🌙
                </motion.span>
              )}
            </AnimatePresence>
          }
        />

        <Link to="/" className="link">Home</Link>
        <Link to="/compare" className="link">Compare</Link>
        <Link to="/watchlist" className="link">Watchlist</Link>
        <Link to="/dashboard">
          <Button text="Dashboard" dashboard={true} />
        </Link>
      </div>

      <div className="drawer-component">
        <TemporaryDrawer />
      </div>
    </div>
  );
}

export default Header;
