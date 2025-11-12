import React, { useState, useEffect } from 'react';
import './App.css';
import DriverSelector from './components/DriverSelector';
import RadarChart from './components/RadarChart';
import BarChart from './components/BarChart';
import SummaryCard from './components/SummaryCard';
import TrackMap from './components/TrackMap';
import PDFExportButton from './components/PDFExportButton';
import Leaderboard from './components/Leaderboard';
import { loadDriverData } from './utils/dataLoader';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  // State management for drivers data, selected driver, and filtered data
  const [driversData, setDriversData] = useState([]);
  const [selectedDriverId, setSelectedDriverId] = useState('');
  const [selectedDriverData, setSelectedDriverData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);

  // Load driver data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await loadDriverData();
        setDriversData(data);
        
        // Auto-select first driver if available
        if (data.length > 0) {
          const firstDriverKey = `${data[0].vehicle_id}_${data[0].session}`;
          setSelectedDriverId(firstDriverKey);
        }
      } catch (err) {
        console.error('Failed to load driver data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Update selected driver data when selection changes
  useEffect(() => {
    if (selectedDriverId && driversData.length > 0) {
      const driverData = driversData.find(driver => {
        const driverKey = `${driver.vehicle_id}_${driver.session}`;
        return driverKey === selectedDriverId;
      });
      setSelectedDriverData(driverData || null);
    } else {
      setSelectedDriverData(null);
    }
  }, [selectedDriverId, driversData]);

  // Handle driver selection logic
  const handleDriverSelection = (driverId) => {
    setSelectedDriverId(driverId);
  };

  return (
    <ErrorBoundary>
      <div className="App">
        <header className="App-header">
          <div className="header-content">
            <div className="header-text">
              <h1>Driver Insights Dashboard</h1>
              <p>Racing Driver Performance Analytics</p>
            </div>
            <button 
              className="leaderboard-button"
              onClick={() => setIsLeaderboardOpen(true)}
            >
              🏆 Leaderboard
            </button>
          </div>
        </header>
        
        <footer className="App-footer">
          <span>Developed by Plotly FSTech</span>
          <span className="footer-separator">|</span>
          <span>Data Source: Apex Insight Toyota GR telemetry - Barber</span>
          <span className="footer-separator">|</span>
          <span>Version 1.0.0</span>
          <span className="footer-separator">|</span>
          <span>Data updated 2025-09-07</span>
        </footer>
        
        <main className="App-main">
          <div className="dashboard-container">
            {/* Driver Selection Section */}
            <section className="driver-selection-section">
              <div className="selection-header">
                <DriverSelector
                  drivers={driversData}
                  selectedDriverId={selectedDriverId}
                  onDriverSelect={handleDriverSelection}
                  loading={loading}
                  error={error}
                />
                
                {/* PDF Export Controls */}
                {selectedDriverData && (
                  <div className="export-controls">
                    <h4>Export Options</h4>
                    <div className="export-buttons">
                      <PDFExportButton 
                        driverData={selectedDriverData} 
                        exportType="full"
                        buttonText="Full Report"
                      />
                      <PDFExportButton 
                        driverData={selectedDriverData} 
                        exportType="summary"
                        buttonText="Summary Only"
                      />
                      <PDFExportButton 
                        driverData={selectedDriverData} 
                        exportType="charts"
                        buttonText="Charts Only"
                      />
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Dashboard Content */}
            {(selectedDriverData || loading || error) && (
              <section className="dashboard-content">
                {/* Summary Card */}
                <div className="summary-section">
                  <SummaryCard 
                    driverData={selectedDriverData} 
                    loading={loading}
                    error={error}
                  />
                </div>
                
                {/* Performance Charts */}
                {selectedDriverData && (
                  <div className="charts-container">
                    <div className="charts-row">
                      <RadarChart data={selectedDriverData} className="chart-item" />
                      <BarChart data={selectedDriverData} className="chart-item" />
                    </div>
                    <div className="track-map-section">
                      <TrackMap data={selectedDriverData} />
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* No driver selected state */}
            {!loading && !error && !selectedDriverData && (
              <section className="no-driver-selected">
                <h2>No Driver Selected</h2>
                <p>Please select a driver from the dropdown above to view their performance analytics.</p>
              </section>
            )}

            {/* Error state */}
            {error && (
              <section className="error-state">
                <h2>Error Loading Data</h2>
                <p>{error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="retry-button"
                >
                  Retry
                </button>
              </section>
            )}
          </div>
        </main>
        
        <Leaderboard 
          isOpen={isLeaderboardOpen}
          onClose={() => setIsLeaderboardOpen(false)}
        />
      </div>
    </ErrorBoundary>
  );
}

export default App;
