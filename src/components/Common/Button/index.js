import React from "react";
import "./styles.css";

function Button({ text, onClick, outlined, dashboard }) {
  const getClassName = () => {
    if (outlined) return "btn-outlined";
    if (dashboard) return "btn-dashboard";
    return "btn";
  };

  return (
    <div
      className={getClassName()}
      onClick={() => onClick()}
    >
      {text}
    </div>
  );
}

export default Button;
