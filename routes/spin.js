import React, { useState } from "react";
import useBalanceStore from "../store/balanceStore";
import starIcon from "../assets/images/star.png";
import diamondIcon from "../assets/images/diamondIcon.png";
import api from "../http";
import Endpoints from "../http/endpoints";

const styles = {
  spinSection: {
    padding: "20px 14px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "14px",
    background: "linear-gradient(180deg, rgba(34, 34, 87, 1) 0%, #121535ff 100%)",
    borderRadius: "14px",
    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    fontFamily: "'Inter', sans-serif",
  },
  spinButton: {
    background: "linear-gradient(45deg, #0088CC, #00A3FF)",
    color: "#f0f0ff",
    padding: "10px 24px",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2), 0 0 8px rgba(255, 255, 255, 0.1)",
    transition: "all 0.3s ease",
    letterSpacing: "0.5px",
    ":hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.25), 0 0 12px rgba(255, 255, 255, 0.15)",
    },
  },
  spinButtonDisabled: {
    background: "linear-gradient(45deg, #2a2a3a, #3e3e4a)",
    color: "#aaaaaa",
    padding: "10px 24px",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "not-allowed",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
    letterSpacing: "0.5px",
  },
  errorText: {
    fontSize: "13px",
    color: "#ff3b3b",
    textAlign: "center",
    background: "rgba(0, 0, 0, 0.3)",
    padding: "4px 8px",
    borderRadius: "6px",
    border: "1px solid rgba(255, 255, 255, 0.08)",
  },
  icon: {
    width: "14px",
    height: "14px",
    verticalAlign: "middle",
    marginRight: "4px",
  },
  rouletteContainer: {
    width: "100%",
    overflow: "hidden",
    borderRadius: "8px",
    border: "1px solid rgba(255, 255, 255, 0.15)",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
    background: "rgba(0, 0, 0, 0.3)",
    position: "relative",
    height: "80px",
  },
  rouletteTape: {
    display: "flex",
    position: "absolute",
    animation: "spin 5s linear infinite",
  },
  rouletteItem: {
    width: "80px",
    height: "80px",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRight: "1px solid rgba(255, 255, 255, 0.1)",
  },
  rouletteItemImage: {
    width: "60px",
    height: "60px",
    objectFit: "contain",
  },
};

const spinAnimation = `
  @keyframes spin {
    0% { transform: translateX(0); }
    100% { transform: translateX(-100%); }
  }
`;

const Spin = ({
  caseData,
  telegramId,
  balance,
  diamonds,
  onSpinComplete,
  onInsufficientFunds,
  isDemoMode,
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [error, setError] = useState(null);
  const setBoth = useBalanceStore((state) => state.setBoth);

  const isHunterCase = ["case_10", "case_11", "case_12"].includes(caseData.id);

  const handleSpin = async () => {
    if (isSpinning) return;
    setError(null);
    setIsSpinning(true);

    try {
      const response = await api.post(`${Endpoints.SPIN}/${caseData.id}`, {
        telegramId,
        isDemo: isDemoMode,
        isHunterCase,
      });
      const { data } = response;

      if (response.status !== 200)
        throw new Error(data.message || "Ошибка при выполнении спина");

      if (!isDemoMode) {
        setBoth(data.newBalance, data.newDiamonds);
      }

      // Задержка для анимации (например, 3 секунды)
      setTimeout(() => {
        setIsSpinning(false);
        onSpinComplete(data.giftId);
      }, 3000);
    } catch (err) {
      setError(err.message || "Ошибка при выполнении спина");
      setIsSpinning(false);
      onInsufficientFunds(err.message, 1);
    }
  };

  const getButtonLabel = () => {
    if (isDemoMode) {
      return "Крутить (Демо)";
    }
    if (caseData.diamondPrice > 0) {
      return (
        <>
          <img src={diamondIcon} alt="Diamond" style={styles.icon} />
          Крутить за {caseData.diamondPrice}
        </>
      );
    }
    if (caseData.price > 0) {
      return (
        <>
          <img src={starIcon} alt="Star" style={styles.icon} />
          Крутить за {caseData.price}
        </>
      );
    }
    return "Крутить бесплатно";
  };

  return (
    <div style={styles.spinSection}>
      <style>{spinAnimation}</style>
      {isSpinning ? (
        <div style={styles.rouletteContainer}>
          <div style={styles.rouletteTape}>
            {caseData.items.concat(caseData.items).map((gift, index) => (
              <div key={`roulette-${gift.giftId}-${index}`} style={styles.rouletteItem}>
                <img
                  src={typeof gift.image === 'object' ? "https://via.placeholder.com/60" : gift.image}
                  alt={gift.name}
                  style={styles.rouletteItemImage}
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <button
          style={isSpinning ? styles.spinButtonDisabled : styles.spinButton}
          onClick={handleSpin}
          disabled={isSpinning}
        >
          {getButtonLabel()}
        </button>
      )}
      {error && <div style={styles.errorText}>{error}</div>}
    </div>
  );
};

export default Spin;