import { createTheme, ThemeProvider } from "@mui/material";
import { ThemeProvider as AppThemeProvider, useThemeContext } from "./context/ThemeContext";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Coin from "./pages/Coin";
import Compare from "./pages/Compare";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Watchlist from "./pages/Watchlist";
import PriceAlerts from "./pages/PriceAlerts";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FloatingClouds from "./components/Common/FloatingClouds";

function App() {
  const theme = createTheme({
    palette: {
      primary: {
        main: "#3a80e9",
      },
    },
  });

  return (
    <AppThemeProvider>
      <AppContent theme={theme} />
    </AppThemeProvider>
  );
}

function AppContent({ theme }) {
  const { theme: currentTheme } = useThemeContext();

  return (
    <div className="App" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <ToastContainer />
      
      {/* Blinking Stars Overlay - Dark Mode Only */}
      {currentTheme === "dark" && (
        <div className="stars-container">
          {Array.from({ length: 30 }, (_, i) => (
            <div key={i} className="star"></div>
          ))}
        </div>
      )}
      
      {/* Floating Clouds - Light Mode Only */}
      {currentTheme === "light" && <FloatingClouds />}
      
      <ThemeProvider theme={theme}>
        <div style={{ flex: 1 }}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/coin/:id" element={<Coin />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/watchlist" element={<Watchlist />} />
            <Route path="/price-alerts" element={<PriceAlerts />} />
          </Routes>
        </BrowserRouter>
        </div>
      </ThemeProvider>
    </div>
  );
}

export default App;
