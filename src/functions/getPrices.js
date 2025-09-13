import axios from "axios";

export const getPrices = async (id, days, priceType, setError) => {
  try {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${id}/market_chart`,
      {
        params: {
          vs_currency: "usd",
          days: days,
          interval: "daily",
        },
      }
    );

    if (response.data) {
      console.log("Prices>>>", response.data);

      if (priceType === "market_caps") {
        return response.data.market_caps;
      } else if (priceType === "total_volumes") {
        return response.data.total_volumes;
      } else {
        return response.data.prices;
      }
    }
  } catch (e) {
    console.error("Error fetching prices:", e.message);
    if (setError) setError(true);
    return [];
  }
};
