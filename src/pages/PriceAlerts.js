import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/Common/Header";
import Footer from "../components/Common/Footer/footer";
import TopButton from "../components/Common/TopButton";
import Loader from "../components/Common/Loader";
import Button from "../components/Common/Button";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import TrendingDownRoundedIcon from "@mui/icons-material/TrendingDownRounded";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import NotificationsOffIcon from "@mui/icons-material/NotificationsOff";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import SettingsIcon from "@mui/icons-material/Settings";
import SearchableDropdown from "../components/Common/SearchableDropdown";
import "./PriceAlerts.css";

function PriceAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [priceLoading, setPriceLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState("");
  const [alertPrice, setAlertPrice] = useState("");
  const [alertType, setAlertType] = useState("above");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPrices, setCurrentPrices] = useState({});
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [autoReloadEnabled, setAutoReloadEnabled] = useState(true);
  const [autoReloadInterval, setAutoReloadInterval] = useState(30000); // 30 seconds

  useEffect(() => {
    loadAlerts();
    fetchCoins();
    requestNotificationPermission();
    loadSettings();
  }, []);

  useEffect(() => {
    if (alerts.length > 0) {
      fetchCurrentPrices();
    }
  }, [alerts]);

  useEffect(() => {
    let interval;
    if (autoReloadEnabled && alerts.length > 0) {
      interval = setInterval(() => {
        fetchCurrentPrices();
      }, autoReloadInterval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoReloadEnabled, autoReloadInterval, alerts.length]);

  const loadAlerts = () => {
    const savedAlerts = JSON.parse(localStorage.getItem("priceAlerts")) || [];
    setAlerts(savedAlerts);
  };

  const fetchCoins = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false"
      );
      setCoins(response.data);
    } catch (error) {
      console.error("Error fetching coins:", error);
      toast.error("Failed to fetch coins data");
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentPrices = async () => {
    if (alerts.length === 0) return;
    
    setPriceLoading(true);
    try {
      const coinIds = [...new Set(alerts.map(alert => alert.coinId))];
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinIds.join(',')}&order=market_cap_desc&per_page=100&page=1&sparkline=false`
      );
      
      const priceMap = {};
      response.data.forEach(coin => {
        priceMap[coin.id] = {
          current_price: coin.current_price,
          price_change_percentage_24h: coin.price_change_percentage_24h
        };
      });
      
      setCurrentPrices(priceMap);
      
      // Check for price alerts and send notifications
      checkPriceAlerts(priceMap);
    } catch (error) {
      console.error("Error fetching current prices:", error);
      toast.error("Failed to fetch current prices");
    } finally {
      setPriceLoading(false);
    }
  };

  const refreshPrices = () => {
    fetchCurrentPrices();
    toast.success();
  };

  const requestNotificationPermission = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      setNotificationsEnabled(permission === "granted");
      if (permission === "granted") {
        toast.success();
      }
    }
  };

  const loadSettings = () => {
    const settings = JSON.parse(localStorage.getItem("priceAlertSettings")) || {};
    setNotificationsEnabled(settings.notificationsEnabled || false);
    setAutoReloadEnabled(settings.autoReloadEnabled !== false);
    setAutoReloadInterval(settings.autoReloadInterval || 30000);
  };

  const saveSettings = () => {
    const settings = {
      notificationsEnabled,
      autoReloadEnabled,
      autoReloadInterval
    };
    localStorage.setItem("priceAlertSettings", JSON.stringify(settings));
  };

  const checkPriceAlerts = (newPrices) => {
    if (!notificationsEnabled) return;

    alerts.forEach(alert => {
      if (!alert.isActive) return;

      const priceData = newPrices[alert.coinId];
      if (!priceData) return;

      const currentPrice = priceData.current_price;
      let shouldNotify = false;

      if (alert.alertType === "above" && currentPrice >= alert.alertPrice) {
        shouldNotify = true;
      } else if (alert.alertType === "below" && currentPrice <= alert.alertPrice) {
        shouldNotify = true;
      }

      if (shouldNotify) {
        showNotification(alert, currentPrice);
      }
    });
  };

  const showNotification = (alert, currentPrice) => {
    if ("Notification" in window && Notification.permission === "granted") {
      const notification = new Notification(`Price Alert: ${alert.coinName}`, {
        body: `${alert.coinName} (${alert.coinSymbol.toUpperCase()}) is now $${currentPrice.toLocaleString()}. Your alert was set for ${alert.alertType === "above" ? "above" : "below"} $${alert.alertPrice.toLocaleString()}.`,
        icon: alert.coinImage,
        badge: alert.coinImage,
        tag: `price-alert-${alert.id}`,
        requireInteraction: true,
        actions: [
          {
            action: "view",
            title: "View Alert"
          },
          {
            action: "dismiss",
            title: "Dismiss"
          }
        ]
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      // Auto-close after 10 seconds
      setTimeout(() => {
        notification.close();
      }, 10000);
    }
  };

  const toggleNotifications = () => {
    if (notificationsEnabled) {
      setNotificationsEnabled(false);
      toast.info();
    } else {
      requestNotificationPermission();
    }
    saveSettings();
  };

  const toggleAutoReload = () => {
    setAutoReloadEnabled(!autoReloadEnabled);
    saveSettings();
    toast.info();
  };

  const addAlert = () => {
    if (!selectedCoin || !alertPrice) {
      toast.error("Please fill in all fields");
      return;
    }

    const price = parseFloat(alertPrice);
    if (isNaN(price) || price <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    const coin = coins.find(c => c.id === selectedCoin);
    if (!coin) {
      toast.error("Selected coin not found");
      return;
    }

    const newAlert = {
      id: Date.now(),
      coinId: selectedCoin,
      coinName: coin.name,
      coinSymbol: coin.symbol,
      coinImage: coin.image,
      currentPrice: coin.current_price,
      alertPrice: price,
      alertType: alertType,
      createdAt: new Date().toISOString(),
      isActive: true
    };

    const updatedAlerts = [...alerts, newAlert];
    setAlerts(updatedAlerts);
    localStorage.setItem("priceAlerts", JSON.stringify(updatedAlerts));

    // Reset form
    setSelectedCoin("");
    setAlertPrice("");
    setAlertType("above");
    setShowAddForm(false);

    toast.success("Price alert added successfully!");
  };

  const removeAlert = (alertId) => {
    const updatedAlerts = alerts.filter(alert => alert.id !== alertId);
    setAlerts(updatedAlerts);
    localStorage.setItem("priceAlerts", JSON.stringify(updatedAlerts));
    toast.success("Alert removed successfully!");
  };

  const toggleAlert = (alertId) => {
    const updatedAlerts = alerts.map(alert => 
      alert.id === alertId ? { ...alert, isActive: !alert.isActive } : alert
    );
    setAlerts(updatedAlerts);
    localStorage.setItem("priceAlerts", JSON.stringify(updatedAlerts));
    toast.success("Alert status updated!");
  };

  const filteredAlerts = alerts.filter(alert =>
    alert.coinName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alert.coinSymbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCoins = coins.filter(coin =>
    coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4 }
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: { duration: 0.3 }
    }
  };

  return (
    <>
      <Header />
      
      <motion.div 
        className="price-alerts-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="price-alerts-header" variants={itemVariants}>
          <div className="header-content">
            <div className="header-icon">
              <NotificationsActiveIcon />
            </div>
            <div className="header-text">
              <h1>Price Alerts</h1>
              <p>Set up price alerts to stay informed about cryptocurrency price movements</p>
            </div>
          </div>
        </motion.div>

        <motion.div className="alerts-controls" variants={itemVariants}>
          <div className="search-container">
            <div className="search-wrapper">
              <SearchIcon className="search-icon" />
              <input
                type="text"
                placeholder="Search alerts or coins..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              text="Add New Alert"
              onClick={() => setShowAddForm(!showAddForm)}
            />
          </motion.div>
        </motion.div>

        <AnimatePresence>
          {showAddForm && (
            <motion.div 
              className="add-alert-form"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="form-header">
                <h3>Create New Price Alert</h3>
                <div className="form-icon">
                  <AddIcon />
                </div>
              </div>
              
              <div className="form-content">
                <div className="form-group">
                  <label>Select Coin:</label>
                  <SearchableDropdown
                    options={coins.map(coin => ({
                      value: coin.id,
                      label: coin.name,
                      symbol: coin.symbol.toUpperCase(),
                      image: coin.image,
                      price: coin.current_price
                    }))}
                    value={selectedCoin}
                    onChange={setSelectedCoin}
                    placeholder="Choose a coin..."
                    searchPlaceholder="Search coins..."
                    className="coin-selector"
                  />
                </div>

                <div className="form-group">
                  <label>Alert Type:</label>
                  <div className="alert-type-selector">
                    <button
                      type="button"
                      className={`type-btn ${alertType === 'above' ? 'active' : ''}`}
                      onClick={() => setAlertType('above')}
                    >
                      <TrendingUpRoundedIcon />
                      Price goes above
                    </button>
                    <button
                      type="button"
                      className={`type-btn ${alertType === 'below' ? 'active' : ''}`}
                      onClick={() => setAlertType('below')}
                    >
                      <TrendingDownRoundedIcon />
                      Price goes below
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label>Alert Price (USD):</label>
                  <input
                    type="number"
                    value={alertPrice}
                    onChange={(e) => setAlertPrice(e.target.value)}
                    placeholder="Enter price..."
                    className="form-input"
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>

              <div className="form-actions">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button text="Add Alert" onClick={addAlert} />
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button text="Cancel" onClick={() => setShowAddForm(false)} outlined={true} />
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div className="alerts-list" variants={itemVariants}>
          <div className="alerts-header">
            <div className="header-left">
              <h3>Your Price Alerts</h3>
              <div className="alerts-count">
                <span className="count-number">{alerts.length}</span>
                <span className="count-label">alerts</span>
              </div>
            </div>
            <div className="header-controls">
              <motion.button
                className={`control-btn ${notificationsEnabled ? 'active' : ''}`}
                onClick={toggleNotifications}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title={notificationsEnabled ? "Disable notifications" : "Enable notifications"}
              >
                {notificationsEnabled ? <NotificationsIcon /> : <NotificationsOffIcon />}
                {notificationsEnabled ? 'Notifications On' : 'Notifications Off'}
              </motion.button>
              
              <motion.button
                className={`control-btn ${autoReloadEnabled ? 'active' : ''}`}
                onClick={toggleAutoReload}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title={autoReloadEnabled ? "Disable auto-reload" : "Enable auto-reload"}
              >
                <AutorenewIcon className={autoReloadEnabled ? 'spinning' : ''} />
                {autoReloadEnabled ? 'Auto-Reload On' : 'Auto-Reload Off'}
              </motion.button>
              
              <motion.button
                className="refresh-prices-btn"
                onClick={refreshPrices}
                disabled={priceLoading || alerts.length === 0}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RefreshIcon className={`refresh-icon ${priceLoading ? 'spinning' : ''}`} />
                {priceLoading ? 'Updating...' : 'Refresh Prices'}
              </motion.button>
            </div>
          </div>
          
          {loading ? (
            <Loader />
          ) : filteredAlerts.length === 0 ? (
            <motion.div 
              className="no-alerts"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="no-alerts-icon">
                <NotificationsOffIcon />
              </div>
              <h4>No price alerts found</h4>
              <p>Create your first alert to get started!</p>
            </motion.div>
          ) : (
            <div className="alerts-grid">
              <AnimatePresence>
                {filteredAlerts.map((alert, index) => (
                  <motion.div 
                    key={alert.id} 
                    className={`alert-card ${!alert.isActive ? 'inactive' : ''}`}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  >
                    <div className="alert-header">
                      <div className="coin-info">
                        <div className="coin-image-wrapper">
                          <img src={alert.coinImage} alt={alert.coinName} className="coin-image" />
                          <div className="coin-glow"></div>
                        </div>
                        <div className="coin-details">
                          <h4>{alert.coinName}</h4>
                          <span className="coin-symbol">{alert.coinSymbol.toUpperCase()}</span>
                        </div>
                      </div>
                      <div className="alert-status">
                        <span className={`status-badge ${alert.isActive ? 'active' : 'inactive'}`}>
                          {alert.isActive ? (
                            <>
                              <NotificationsActiveIcon />
                              Active
                            </>
                          ) : (
                            <>
                              <NotificationsOffIcon />
                              Inactive
                            </>
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="alert-details">
                      <div className="price-info">
                        <div className="current-price">
                          <span className="label">Current Price</span>
                          <div className="price-value-container">
                            {currentPrices[alert.coinId] ? (
                              <>
                                <span className="value">${currentPrices[alert.coinId].current_price.toLocaleString()}</span>
                                <span className={`price-change ${currentPrices[alert.coinId].price_change_percentage_24h >= 0 ? 'positive' : 'negative'}`}>
                                  {currentPrices[alert.coinId].price_change_percentage_24h >= 0 ? '+' : ''}
                                  {currentPrices[alert.coinId].price_change_percentage_24h.toFixed(2)}%
                                </span>
                              </>
                            ) : (
                              <span className="value loading">Loading...</span>
                            )}
                          </div>
                        </div>
                        <div className="alert-price">
                          <span className="label">Alert Price</span>
                          <span className="value">${alert.alertPrice.toLocaleString()}</span>
                        </div>
                      </div>
                      
                      <div className="alert-condition">
                        <div className={`condition-icon ${alert.alertType}`}>
                          {alert.alertType === 'above' ? <TrendingUpRoundedIcon /> : <TrendingDownRoundedIcon />}
                        </div>
                        <span className={`condition ${alert.alertType}`}>
                          {alert.alertType === 'above' ? 'Price goes above' : 'Price goes below'} ${alert.alertPrice.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="alert-actions">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <button
                          className={`action-btn ${alert.isActive ? 'deactivate' : 'activate'}`}
                          onClick={() => toggleAlert(alert.id)}
                        >
                          {alert.isActive ? <NotificationsOffIcon /> : <NotificationsActiveIcon />}
                          {alert.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <button
                          className="action-btn delete"
                          onClick={() => removeAlert(alert.id)}
                        >
                          <DeleteIcon />
                          Remove
                        </button>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </motion.div>

      <TopButton />
      <Footer />
    </>
  );
}

export default PriceAlerts;
