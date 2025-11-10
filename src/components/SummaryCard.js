import React from 'react';
import './SummaryCard.css';
import { getMetricDescription, formatPerformanceDataForCharts } from '../utils/dataLoader';

/**
 * SummaryCard component displays driver profile information and metric descriptions
 * @param {Object} props - Component props
 * @param {Object} props.driverData - Selected driver's complete data object
 * @param {boolean} props.loading - Loading state indicator
 * @param {string} props.error - Error message if any
 */
const SummaryCard = ({ driverData, loading = false, error = null }) => {
  // Handle loading state
  if (loading) {
    return (
      <div className="summary-card">
        <div className="summary-card-header">
          <h3>Driver Summary</h3>
        </div>
        <div className="summary-card-content">
          <div className="loading-state">
            <p>Loading driver data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="summary-card">
        <div className="summary-card-header">
          <h3>Driver Summary</h3>
        </div>
        <div className="summary-card-content">
          <div className="error-state">
            <p className="error-message">Error loading driver data: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  // Handle no driver selected state
  if (!driverData) {
    return (
      <div className="summary-card">
        <div className="summary-card-header">
          <h3>Driver Summary</h3>
        </div>
        <div className="summary-card-content">
          <p className="no-driver-message">No driver selected</p>
        </div>
      </div>
    );
  }

  // Get formatted performance data with descriptions
  const performanceMetrics = formatPerformanceDataForCharts(driverData.displayScores);

  return (
    <div className="summary-card">
      <div className="summary-card-header">
        <h3>Driver Summary</h3>
      </div>
      
      <div className="summary-card-content">
        {/* Driver Profile Information */}
        <div className="driver-profile-section">
          <div className="driver-id">
            <strong>Driver ID:</strong> {driverData.vehicle_id}
          </div>
          <div className="driver-profile">
            <strong>Profile:</strong> {driverData.overall_profile}
          </div>
          <div className="session-info">
            <strong>Session:</strong> {driverData.session}
          </div>
          <div className="laps-info">
            <strong>Laps Analyzed:</strong> {driverData.summary.laps_analyzed}
          </div>
        </div>

        {/* Performance Metrics with Descriptions */}
        <div className="metrics-section">
          <h4>Performance Metrics</h4>
          <div className="metrics-list">
            {performanceMetrics.map((metric) => (
              <div key={metric.metric} className="metric-item">
                <span className="metric-name">{metric.metric}:</span>
                <span className="metric-description">
                  {metric.description} ({metric.value})
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Session Details */}
        <div className="session-details">
          <h4>Session Details</h4>
          <div className="detail-item">
            <span className="detail-label">Duration:</span>
            <span className="detail-value">
              {Math.round(driverData.summary.duration_seconds / 60)} minutes
            </span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Mean Throttle:</span>
            <span className="detail-value">
              {Math.round(driverData.features.mean_throttle * 100)}%
            </span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Mean Brake:</span>
            <span className="detail-value">
              {Math.round(driverData.features.mean_brake * 100)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;