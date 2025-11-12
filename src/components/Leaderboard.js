import React, { useState, useEffect } from 'react';
import './Leaderboard.css';

const Leaderboard = ({ isOpen, onClose }) => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      loadLeaderboardData();
    }
  }, [isOpen]);

  const loadLeaderboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/data/drivers2.json');
      if (!response.ok) {
        throw new Error('Failed to load leaderboard data');
      }
      const data = await response.json();
      
      // Handle both array and object with drivers array
      let driversArray = Array.isArray(data) ? data : data.drivers;
      
      if (!Array.isArray(driversArray)) {
        throw new Error('Invalid data format');
      }
      
      // Calculate composite score if not present and add rank
      const driversWithScores = driversArray.map((driver, index) => {
        let composite = driver.scores.composite;
        
        // Calculate composite if not present
        if (composite === undefined) {
          const scores = driver.scores;
          composite = (
            scores.aggression +
            scores.smoothness +
            scores.consistency +
            scores.focus +
            scores.adaptability +
            scores.strategy +
            scores.composure
          ) / 7;
        }
        
        return {
          ...driver,
          scores: {
            ...driver.scores,
            composite
          },
          rank: driver.rank || index + 1
        };
      });
      
      // Sort by composite score descending
      const sortedData = driversWithScores.sort((a, b) => b.scores.composite - a.scores.composite);
      
      // Update ranks based on sorted order
      sortedData.forEach((driver, index) => {
        driver.rank = index + 1;
      });
      
      setLeaderboardData(sortedData);
    } catch (err) {
      console.error('Error loading leaderboard:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="leaderboard-overlay" onClick={onClose}>
      <div className="leaderboard-modal" onClick={(e) => e.stopPropagation()}>
        <div className="leaderboard-header">
          <h2>Driver Leaderboard</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="leaderboard-content">
          {loading && (
            <div className="leaderboard-loading">
              <p>Loading leaderboard...</p>
            </div>
          )}

          {error && (
            <div className="leaderboard-error">
              <p>Error: {error}</p>
            </div>
          )}

          {!loading && !error && leaderboardData.length > 0 && (
            <table className="leaderboard-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Vehicle ID</th>
                  <th>Composite Score</th>
                  <th>Profile</th>
                </tr>
              </thead>
              <tbody>
                {leaderboardData.map((driver) => (
                  <tr key={driver.vehicle_id} className={`rank-${driver.rank}`}>
                    <td className="rank-cell">
                      <span className="rank-badge">{driver.rank}</span>
                    </td>
                    <td className="vehicle-cell">{driver.vehicle_id}</td>
                    <td className="score-cell">
                      <div className="score-bar-container">
                        <div 
                          className="score-bar" 
                          style={{ width: `${driver.scores.composite * 100}%` }}
                        />
                        <span className="score-text">
                          {(driver.scores.composite * 100).toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td className="profile-cell">{driver.overall_profile}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {!loading && !error && leaderboardData.length === 0 && (
            <div className="leaderboard-empty">
              <p>No leaderboard data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
