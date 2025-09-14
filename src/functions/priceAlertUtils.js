// Utility functions for price alerts

export const checkPriceAlerts = async (alerts) => {
  if (!alerts || alerts.length === 0) return [];

  const triggeredAlerts = [];
  
  try {
    // Get current prices for all coins in alerts
    const coinIds = [...new Set(alerts.map(alert => alert.coinId))];
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinIds.join(',')}&order=market_cap_desc&per_page=100&page=1&sparkline=false`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch price data');
    }
    
    const currentPrices = await response.json();
    const priceMap = new Map(currentPrices.map(coin => [coin.id, coin.current_price]));
    
    // Check each alert
    alerts.forEach(alert => {
      if (!alert.isActive) return;
      
      const currentPrice = priceMap.get(alert.coinId);
      if (!currentPrice) return;
      
      let isTriggered = false;
      
      if (alert.alertType === 'above' && currentPrice >= alert.alertPrice) {
        isTriggered = true;
      } else if (alert.alertType === 'below' && currentPrice <= alert.alertPrice) {
        isTriggered = true;
      }
      
      if (isTriggered) {
        triggeredAlerts.push({
          ...alert,
          currentPrice,
          triggeredAt: new Date().toISOString()
        });
      }
    });
    
  } catch (error) {
    console.error('Error checking price alerts:', error);
  }
  
  return triggeredAlerts;
};

export const formatAlertMessage = (alert) => {
  const { coinName, coinSymbol, currentPrice, alertPrice, alertType } = alert;
  
  const direction = alertType === 'above' ? 'above' : 'below';
  const emoji = alertType === 'above' ? '📈' : '📉';
  
  return `${emoji} ${coinName} (${coinSymbol.toUpperCase()}) price is now $${currentPrice.toLocaleString()}, which is ${direction} your alert price of $${alertPrice.toLocaleString()}`;
};

export const saveAlertToStorage = (alert) => {
  const existingAlerts = JSON.parse(localStorage.getItem('priceAlerts')) || [];
  const updatedAlerts = [...existingAlerts, alert];
  localStorage.setItem('priceAlerts', JSON.stringify(updatedAlerts));
  return updatedAlerts;
};

export const removeAlertFromStorage = (alertId) => {
  const existingAlerts = JSON.parse(localStorage.getItem('priceAlerts')) || [];
  const updatedAlerts = existingAlerts.filter(alert => alert.id !== alertId);
  localStorage.setItem('priceAlerts', JSON.stringify(updatedAlerts));
  return updatedAlerts;
};

export const updateAlertInStorage = (alertId, updates) => {
  const existingAlerts = JSON.parse(localStorage.getItem('priceAlerts')) || [];
  const updatedAlerts = existingAlerts.map(alert => 
    alert.id === alertId ? { ...alert, ...updates } : alert
  );
  localStorage.setItem('priceAlerts', JSON.stringify(updatedAlerts));
  return updatedAlerts;
};

export const getAlertsFromStorage = () => {
  return JSON.parse(localStorage.getItem('priceAlerts')) || [];
};
