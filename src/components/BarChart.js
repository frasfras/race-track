import React from 'react';
import { 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import './BarChart.css';

/**
 * BarChart Component
 * Displays performance metrics in a horizontal bar chart format using Recharts
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5
 */
const BarChart = ({ data, className = '' }) => {
  // Handle empty or invalid data
  if (!data || !data.displayScores) {
    return (
      <div className={`bar-chart-container ${className}`}>
        <div className="bar-chart-error">
          <p>No performance data available</p>
        </div>
      </div>
    );
  }

  // Transform displayScores to bar chart format with distinct colors
  const barData = [
    { 
      metric: 'Aggression', 
      value: data.displayScores.aggression,
      color: '#ef4444' // Red
    },
    { 
      metric: 'Consistency', 
      value: data.displayScores.consistency,
      color: '#f97316' // Orange
    },
    { 
      metric: 'Composure', 
      value: data.displayScores.composure,
      color: '#eab308' // Yellow
    },
    { 
      metric: 'Smoothness', 
      value: data.displayScores.smoothness,
      color: '#22c55e' // Green
    },
    { 
      metric: 'Adaptability', 
      value: data.displayScores.adaptability,
      color: '#3b82f6' // Blue
    },
    { 
      metric: 'Strategy', 
      value: data.displayScores.strategy,
      color: '#8b5cf6' // Purple
    }
  ];



  // Custom tooltip to show metric values
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bar-chart-tooltip">
          <p className="tooltip-label">{label}</p>
          <p className="tooltip-value">
            Score: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };



  return (
    <div className={`bar-chart-container ${className}`}>
      <div className="bar-chart-header">
        <h3>Performance Breakdown</h3>
        <p>Detailed Metric Analysis</p>

      </div>
      
      <div className="bar-chart-wrapper">
        <ResponsiveContainer width="100%" height={400}>
          <RechartsBarChart
            data={barData}
            layout="vertical"
            margin={{ top: 20, right: 60, left: 80, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              type="number" 
              domain={[0, 100]}
            />
            <YAxis 
              type="category" 
              dataKey="metric"
              width={80}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="value" 
              radius={[0, 4, 4, 0]}
            >
              {barData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="bar-chart-legend">
        <div className="legend-grid">
          {barData.map((item, index) => (
            <div key={index} className="legend-item">
              <span 
                className="legend-color" 
                style={{ backgroundColor: item.color }}
              ></span>
              <span className="legend-text">{item.metric}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BarChart;