import React from 'react';
import { 
  RadarChart as RechartsRadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  ResponsiveContainer 
} from 'recharts';
import './RadarChart.css';

/**
 * RadarChart Component
 * Displays six performance metrics in a radar chart format using Recharts
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5
 */
const RadarChart = ({ data, className = '' }) => {
  // Handle empty or invalid data
  if (!data || !data.displayScores) {
    return (
      <div className={`radar-chart-container ${className}`}>
        <div className="radar-chart-error">
          <p>No performance data available</p>
        </div>
      </div>
    );
  }

  // Transform displayScores to radar chart format
  const radarData = [
    { metric: 'Aggression', value: data.displayScores.aggression, fullMark: 100 },
    { metric: 'Consistency', value: data.displayScores.consistency, fullMark: 100 },
    { metric: 'Composure', value: data.displayScores.composure, fullMark: 100 },
    { metric: 'Smoothness', value: data.displayScores.smoothness, fullMark: 100 },
    { metric: 'Adaptability', value: data.displayScores.adaptability, fullMark: 100 },
    { metric: 'Strategy', value: data.displayScores.strategy, fullMark: 100 }
  ];

  return (
    <div className={`radar-chart-container ${className}`}>
      <div className="radar-chart-header">
        <h3>Performance Radar Chart</h3>
        <p>Racing Mindset Profile</p>
      </div>
      
      <div className="radar-chart-wrapper">
        <ResponsiveContainer width="100%" height={400}>
          <RechartsRadarChart data={radarData} margin={{ top: 20, right: 80, bottom: 20, left: 80 }}>
            <PolarGrid />
            <PolarAngleAxis 
              dataKey="metric" 
              tick={{ fontSize: 12, fill: '#333' }}
              className="radar-axis-label"
            />
            <PolarRadiusAxis 
              angle={90} 
              domain={[0, 100]} 
              tick={{ fontSize: 10, fill: '#666' }}
              tickCount={6}
            />
            <Radar
              name="Performance"
              dataKey="value"
              stroke="#2563eb"
              fill="#3b82f6"
              fillOpacity={0.3}
              strokeWidth={2}
              dot={{ r: 4, fill: '#2563eb' }}
            />
          </RechartsRadarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="radar-chart-legend">
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#3b82f6' }}></span>
          <span>Performance Metrics (0-100 scale)</span>
        </div>
      </div>
    </div>
  );
};

export default RadarChart;