import React, { useEffect, useState } from "react";
import Info from "../components/CoinPage/Info";
import LineChart from "../components/CoinPage/LineChart";
import ToggleComponents from "../components/CoinPage/ToggleComponent";
import Header from "../components/Common/Header";
import Loader from "../components/Common/Loader";
import SelectCoins from "../components/ComparePage/SelectCoins";
import List from "../components/Dashboard/List";
import { get100Coins } from "../functions/get100Coins";
import { getCoinData } from "../functions/getCoinData";
import { getPrices } from "../functions/getPrices";
import { settingChartData } from "../functions/settingChartData";
import { settingCoinObject } from "../functions/settingCoinObject";

function Compare() {
  const [allCoins, setAllCoins] = useState([]);
  const [loading, setLoading] = useState(false);
  // id states
  const [crypto1, setCrypto1] = useState("bitcoin");
  const [crypto2, setCrypto2] = useState("ethereum");
  // data states
  const [coin1Data, setCoin1Data] = useState({});
  const [coin2Data, setCoin2Data] = useState({});
  // days state
  const [days, setDays] = useState(30);
  const [priceType, setPriceType] = useState("prices");
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setLoading(true);
    try {
      const coins = await get100Coins();
      if (coins) {
        setAllCoins(coins);

        const [data1, data2] = await Promise.all([
          getCoinData(crypto1),
          getCoinData(crypto2),
        ]);

        settingCoinObject(data1, setCoin1Data);
        settingCoinObject(data2, setCoin2Data);

        if (data1 && data2) {
          const [prices1, prices2] = await Promise.all([
            getPrices(crypto1, days, priceType),
            getPrices(crypto2, days, priceType),
          ]);

          if (prices1 && prices2) {
            settingChartData(setChartData, prices1, prices2);
          }
        }
      }
    } catch (err) {
      console.error("Error in getData:", err);
    } finally {
      setLoading(false);
    }
  };

  const onCoinChange = async (e, isCoin2) => {
    const selectedCoin = e.target.value;
    setLoading(true);

    try {
      if (isCoin2) {
        setCrypto2(selectedCoin);

        const data2 = await getCoinData(selectedCoin);
        settingCoinObject(data2, setCoin2Data);

        const [prices1, prices2] = await Promise.all([
          getPrices(crypto1, days, priceType),
          getPrices(selectedCoin, days, priceType),
        ]);

        if (prices1 && prices2) {
          settingChartData(setChartData, prices1, prices2);
        }
      } else {
        setCrypto1(selectedCoin);

        const data1 = await getCoinData(selectedCoin);
        settingCoinObject(data1, setCoin1Data);

        const [prices1, prices2] = await Promise.all([
          getPrices(selectedCoin, days, priceType),
          getPrices(crypto2, days, priceType),
        ]);

        if (prices1 && prices2) {
          settingChartData(setChartData, prices1, prices2);
        }
      }
    } catch (err) {
      console.error("Error while changing coin:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDaysChange = async (e) => {
    const newDays = e.target.value;
    setLoading(true);

    try {
      setDays(newDays);

      const [prices1, prices2] = await Promise.all([
        getPrices(crypto1, newDays, priceType),
        getPrices(crypto2, newDays, priceType),
      ]);

      if (prices1 && prices2) {
        settingChartData(setChartData, prices1, prices2);
      }
    } catch (err) {
      console.error("Error while changing days:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePriceTypeChange = async (e) => {
    const newPriceType = e.target.value;
    setLoading(true);

    try {
      setPriceType(newPriceType);

      const [prices1, prices2] = await Promise.all([
        getPrices(crypto1, days, newPriceType),
        getPrices(crypto2, days, newPriceType),
      ]);

      if (prices1 && prices2) {
        settingChartData(setChartData, prices1, prices2);
      }
    } catch (err) {
      console.error("Error while changing price type:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      {loading || !coin1Data?.id || !coin2Data?.id ? (
        <Loader />
      ) : (
        <>
          <SelectCoins
            allCoins={allCoins}
            crypto1={crypto1}
            crypto2={crypto2}
            onCoinChange={onCoinChange}
            days={days}
            handleDaysChange={handleDaysChange}
          />
          <div className="grey-wrapper">
            <List coin={coin1Data} />
          </div>
          <div className="grey-wrapper">
            <List coin={coin2Data} />
          </div>
          <div className="grey-wrapper">
            <ToggleComponents
              priceType={priceType}
              handlePriceTypeChange={handlePriceTypeChange}
            />
            <LineChart chartData={chartData} multiAxis={true} />
          </div>
          <Info title={coin1Data.name} desc={coin1Data.desc} />
          <Info title={coin2Data.name} desc={coin2Data.desc} />
        </>
      )}
    </div>
  );
}

export default Compare;
