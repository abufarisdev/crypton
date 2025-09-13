import React from "react";
import "./styles.css";
import cloudSmall from "../../../assets/cloud-small.svg";
import cloudMedium from "../../../assets/cloud-medium.svg";
import cloudLarge from "../../../assets/cloud-large.svg";

const FloatingClouds = () => {
  // Generate random cloud configurations
  const generateRandomClouds = () => {
    const cloudTypes = [cloudSmall, cloudMedium, cloudLarge];
    const clouds = [];
    
    for (let i = 1; i <= 8; i++) {
      clouds.push({
        id: i,
        src: cloudTypes[Math.floor(Math.random() * cloudTypes.length)],
        className: `cloud cloud-${i}`,
        style: {
          top: `${Math.random() * 80 + 5}%`,
          animationDelay: `-${Math.random() * 15}s`,
          animationDuration: `${8 + Math.random() * 8}s`,
          opacity: 0.6 + Math.random() * 0.3,
        }
      });
    }
    
    return clouds;
  };

  const clouds = generateRandomClouds();

  return (
    <div className="floating-clouds-container">
      {clouds.map((cloud) => (
        <img
          key={cloud.id}
          src={cloud.src}
          alt=""
          className={cloud.className}
          style={{
            ...cloud.style,
            position: 'absolute',
            animation: `drift-random ${cloud.style.animationDuration} linear infinite`,
            animationDelay: cloud.style.animationDelay,
            opacity: cloud.style.opacity,
            top: cloud.style.top,
          }}
        />
      ))}
    </div>
  );
};

export default FloatingClouds;