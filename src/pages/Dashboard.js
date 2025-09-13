import axios from "axios";
import React, { useEffect, useState } from "react";
import Header from "../components/Common/Header";
import Loader from "../components/Common/Loader";
import Search from "../components/Dashboard/Search";
import TabsComponent from "../components/Dashboard/Tabs";
import PaginationComponent from "../components/Dashboard/Pagination";
import TopButton from "../components/Common/TopButton";
import Footer from "../components/Common/Footer/footer";
import News from "./News"; // Import News component

function Dashboard() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [paginatedCoins, setPaginatedCoins] = useState([]);
  const [activeSection, setActiveSection] = useState("Coins"); // Coins or News

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    setLoading(true);
    axios
      .get(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false"
      )
      .then((response) => {
        setCoins(response.data);
        setPaginatedCoins(response.data.slice(0, 10));
        setLoading(false);
      })
      .catch((error) => {
        console.log("ERROR>>>", error.message);
        setLoading(false);
      });
  };

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  const filteredCoins = coins.filter(
    (coin) =>
      coin.name.toLowerCase().includes(search.trim().toLowerCase()) ||
      coin.symbol.toLowerCase().includes(search.trim().toLowerCase())
  );

  const handlePageChange = (event, value) => {
    setPage(value);
    const initialCount = (value - 1) * 10;
    setPaginatedCoins(coins.slice(initialCount, initialCount + 10));
  };

  return (
    <>
      <Header />

      {loading ? (
        <Loader />
      ) : (
        <>
          {/* Toggle Buttons */}
          <div style={{ display: "flex", gap: "12px", margin: "16px 0" }}>
            <button
              onClick={() => setActiveSection("Coins")}
              style={{
                padding: "8px 12px",
                borderRadius: "8px",
                backgroundColor: activeSection === "Coins" ? "#3a80e9" : "#1f1f2e",
                color: "#fff",
                border: "none",
                cursor: "pointer",
              }}
            >
              Coins
            </button>

            <button
              onClick={() => setActiveSection("News")}
              style={{
                padding: "8px 12px",
                borderRadius: "8px",
                backgroundColor: activeSection === "News" ? "#3a80e9" : "#1f1f2e",
                color: "#fff",
                border: "none",
                cursor: "pointer",
              }}
            >
              News
            </button>
          </div>

          {/* Search Bar */}
          {activeSection === "Coins" && <Search search={search} handleChange={handleChange} />}

          {/* Content */}
          {activeSection === "Coins" ? (
            <>
              <TabsComponent
                coins={search ? filteredCoins : paginatedCoins}
                setSearch={setSearch}
              />
              {!search && (
                <PaginationComponent page={page} handlePageChange={handlePageChange} />
              )}
            </>
          ) : (
            <News />
          )}
        </>
      )}

      <TopButton />
      <Footer />
    </>
  );
}

export default Dashboard;
