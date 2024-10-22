import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import Navbar from "./Navbar"; // Ensure Navbar is imported if it's not included in App.js
import "./Players.css"; // Import the corresponding CSS

function Players() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await fetch(
          "https://valorant-esport-manager.onrender.com/player/state",
          {
            method: "GET",
            headers: {
              Accept: "*/*",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setPlayers(data.list);
      } catch (err) {
        console.error("Fetching Players Failed:", err);
        setError("Failed to fetch player data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  // Function to clean up player names by removing actual newline and tab characters
  const cleanPlayerName = (name) => {
    return name.replace(/[\n\t]/g, "").trim();
  };

  // Handle Explore Navigation
  const handleExploreClick = (id, name) => {
    navigate(
      `/chatui?id=${id}&name=${encodeURIComponent(cleanPlayerName(name))}`
    );
  };

  // Helper component for Data Bars
  const DataBar = ({ percentage }) => {
    // Extract numerical value from percentage string
    const value = parseFloat(percentage.replace("%", "")) || 0;

    return (
      <div className="data-bar">
        <div className="data-bar-fill" style={{ width: `${value}%` }}></div>
        <span className="data-bar-text">{percentage}</span>
      </div>
    );
  };

  return (
    <div>
      {/* If Navbar is already included in App.js, you can remove it here */}
      {/* <Navbar /> */}

      <div className="players-container">
        <h1 className="players-title">Players Statistics</h1>

        {loading && <div className="loader"></div>}

        {error && <div className="error-message">{error}</div>}

        {!loading && !error && (
          <div className="cards-container">
            {players.map((player) => (
              <div key={player.id} className="player-card">
                {/* Player Data */}
                <div className="card-content">
                  <h2 className="player-name">{cleanPlayerName(player.playerName)}</h2>
                  {/* <p className="player-org"><strong>Organization:</strong> {player.org}</p> */}
                  <p className="player-agents"><strong>Agents:</strong> {player.agents.join(', ')}</p>
                  <div className="player-stats">
                    <div className="stat-item">
                      <strong>Rounds Played:</strong> {player.roundsPlayed}
                    </div>
                    <div className="stat-item">
                      <strong>Rating:</strong> {player.rating}
                    </div>
                    <div className="stat-item">
                      <strong>Avg. Combat Score:</strong> {player.averageCombatScore}
                    </div>
                    <div className="stat-item">
                      <strong>K/D Ratio:</strong> {player.killDeaths}
                    </div>
                    <div className="stat-item">
                      <strong>Avg. Damage/Round:</strong> {player.averageDamagePerRound}
                    </div>
                    <div className="stat-item">
                      <strong>Kills/Round:</strong> {player.killsPerRound}
                    </div>
                    <div className="stat-item">
                      <strong>Assists/Round:</strong> {player.assistsPerRound}
                    </div>
                    <div className="stat-item">
                      <strong>First Kills/Round:</strong> {player.firstKillsPerRound}
                    </div>
                    <div className="stat-item">
                      <strong>First Deaths/Round:</strong> {player.firstDeathsPerRound}
                    </div>
                    <div className="stat-item">
                      <strong>K/A/S/T:</strong>
                      <DataBar percentage={player.killAssistsSurvivedTraded} />
                    </div>
                    <div className="stat-item">
                      <strong>Headshot %:</strong>
                      <DataBar percentage={player.headshotPercentage} />
                    </div>
                    <div className="stat-item">
                      <strong>Clutch Success %:</strong>
                      <DataBar percentage={player.clutchSuccessPercentage} />
                    </div>
                  </div>
                </div>

                {/* Overlay for Explore */}
                <div className="card-overlay">
                  <button
                    className="explore-button-overlay"
                    onClick={() => handleExploreClick(player.id, player.playerName)}
                    aria-label={`Explore more about ${cleanPlayerName(player.playerName)}`}
                  >
                    Explore more about {cleanPlayerName(player.playerName)}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Players;
