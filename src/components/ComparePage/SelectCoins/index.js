import { MenuItem, Select, Box, Typography } from "@mui/material";
import React from "react";
import SelectDays from "../../CoinPage/SelectDays";
import "./styles.css";

function SelectCoins({
  allCoins,
  crypto1,
  crypto2,
  onCoinChange,
  days,
  handleDaysChange,
}) {
  const style = {
    height: "2.5rem",
    color: "var(--white)",
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "var(--white)",
    },
    "& .MuiSvgIcon-root": {
      color: "var(--white)",
    },
    "&:hover": {
      "&& fieldset": {
        borderColor: "#3a80e9",
      },
    },
  };

  const renderMenuItem = (coin) => (
    <MenuItem
      value={coin.id}
      key={coin.id}
      sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
    >
      <img
        src={coin.image}
        alt={coin.name}
        style={{ width: "20px", height: "20px", borderRadius: "50%" }}
      />
      {coin.name}
    </MenuItem>
  );

  const renderValue = (selectedId) => {
    const coin = allCoins.find((c) => c.id === selectedId);
    if (!coin) return null;
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <img
          src={coin.image}
          alt={coin.name}
          style={{ width: "20px", height: "20px", borderRadius: "50%" }}
        />
        <Typography>{coin.name}</Typography>
      </Box>
    );
  };

  return (
    <div className="select-coins-div">
      <div className="select-flex">
        <p>Crypto 1</p>
        <Select
          value={crypto1}
          onChange={(e) => onCoinChange(e, false)}
          sx={style}
          renderValue={renderValue}
        >
          {allCoins
            .filter((coin) => coin.id !== crypto2)
            .map(renderMenuItem)}
        </Select>
      </div>

      <div className="select-flex">
        <p>Crypto 2</p>
        <Select
          value={crypto2}
          onChange={(e) => onCoinChange(e, true)}
          sx={style}
          renderValue={renderValue}
        >
          {allCoins
            .filter((coin) => coin.id !== crypto1)
            .map(renderMenuItem)}
        </Select>
      </div>

      <SelectDays
        days={days}
        handleDaysChange={handleDaysChange}
        noPTag={true}
      />
    </div>
  );
}

export default SelectCoins;
