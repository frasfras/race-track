import React from 'react';
import Plot from 'react-plotly.js';
import './TrackMap.css';

const TrackMap = ({ data }) => {
  // Handle loading and error states
  if (!data || !data.track_map || !data.track_map.points || data.track_map.points.length === 0) {
    return (
      <div className="track-map-container">
        <div className="track-map-empty">
          <p>No track data available</p>
        </div>
      </div>
    );
  }

  const { points, corners = [] } = data.track_map;

  // Extract GPS coordinates and throttle data
  const latitudes = points.map(point => point.lat);
  const longitudes = points.map(point => point.lon);
  const throttleValues = points.map(point => point.throttle * 100); // Convert to percentage

  // Create main track trace with throttle heat mapping
  const trackTrace = {
    x: longitudes,
    y: latitudes,
    mode: 'lines+markers',
    type: 'scatter',
    name: 'Track',
    line: {
      width: 4,
      color: 'rgb(100, 100, 100)'
    },
    marker: {
      size: 8,
      color: throttleValues,
      colorscale: [
        [0, 'rgb(0, 0, 255)'],
        [0.5, 'rgb(255, 255, 0)'],
        [1, 'rgb(255, 0, 0)']
      ],
      colorbar: {
        title: 'Throttle %',
        titleside: 'right',
        tickmode: 'linear',
        tick0: 0,
        dtick: 25,
        thickness: 15,
        len: 0.7
      },
      showscale: true
    },
    hovertemplate: 
      '<b>Throttle:</b> %{marker.color:.1f}%<br>' +
      '<b>Lat:</b> %{y:.6f}<br>' +
      '<b>Lon:</b> %{x:.6f}<br>' +
      '<extra></extra>',
    showlegend: false
  };

  const traces = [trackTrace];

  // Add corner markers if available
  if (corners && corners.length > 0) {
    const cornerTrace = {
      x: corners.map(corner => corner.lon),
      y: corners.map(corner => corner.lat),
      mode: 'markers+text',
      type: 'scatter',
      name: 'Aggressive Corners',
      marker: {
        size: 14,
        color: 'rgba(255, 140, 0, 0.8)',
        symbol: 'diamond',
        line: {
          color: 'rgb(255, 69, 0)',
          width: 2
        }
      },
      text: corners.map(corner => corner.id),
      textposition: 'top center',
      textfont: {
        size: 11,
        color: 'rgb(255, 69, 0)',
        family: 'Arial, sans-serif',
        weight: 'bold'
      },
      hovertemplate: 
        '<b>Corner:</b> %{text}<br>' +
        '<b>Type:</b> Aggressive<br>' +
        '<b>Lat:</b> %{y:.6f}<br>' +
        '<b>Lon:</b> %{x:.6f}<br>' +
        '<extra></extra>',
      showlegend: true
    };
    traces.push(cornerTrace);
  }

  // Configure layout with annotations
  const layout = {
    title: {
      text: `Track Map - ${data.vehicle_id}`,
      font: { size: 18, color: '#333' }
    },
    xaxis: {
      title: 'Longitude',
      showgrid: true,
      zeroline: false
    },
    yaxis: {
      title: 'Latitude',
      showgrid: true,
      zeroline: false
    },
    hovermode: 'closest',
    plot_bgcolor: '#f8f9fa',
    paper_bgcolor: '#ffffff',
    margin: { l: 60, r: 100, t: 60, b: 60 },
    width: 1100,
    height: 450,
    legend: {
      x: 0.02,
      y: 0.98,
      bgcolor: 'rgba(255, 255, 255, 0.9)',
      bordercolor: '#ccc',
      borderwidth: 1
    }
  };

  // Configure responsive behavior
  const config = {
    responsive: true,
    displayModeBar: true,
    displaylogo: false,
    modeBarButtonsToRemove: ['lasso2d', 'select2d'],
    toImageButtonOptions: {
      format: 'png',
      filename: `track_map_${data.vehicle_id}`,
      height: 800,
      width: 1200,
      scale: 2
    }
  };

  return (
    <div className="track-map-container">
      <Plot
        data={traces}
        layout={layout}
        config={config}
        useResizeHandler={true}
      />
    </div>
  );
};

export default TrackMap;
