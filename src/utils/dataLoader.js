/**
 * Data loading utilities for driver performance data
 */

/**
 * Load driver data from JSON file
 * @param {string} filePath - Path to the JSON file
 * @returns {Promise<Array>} Array of driver data objects
 */
export const loadDriverData = async (filePath = '/data/all_drivers_summary.json') => {
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`Failed to load data: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    
    // Validate the loaded data
    const validatedData = validateDriverData(data);
    
    // Transform data for component consumption
    return transformDriverData(validatedData);
  } catch (error) {
    console.error('Error loading driver data:', error);
    throw new Error(`Data loading failed: ${error.message}`);
  }
};

/**
 * Validate driver data structure
 * @param {Array} data - Raw driver data array
 * @returns {Array} Validated driver data
 */
export const validateDriverData = (data) => {
  if (!Array.isArray(data)) {
    throw new Error('Driver data must be an array');
  }

  if (data.length === 0) {
    throw new Error('Driver data array cannot be empty');
  }

  data.forEach((driver, index) => {
    validateDriverRecord(driver, index);
  });

  return data;
};

/**
 * Validate individual driver record
 * @param {Object} driver - Driver data object
 * @param {number} index - Index in array for error reporting
 */
const validateDriverRecord = (driver, index) => {
  const requiredFields = ['vehicle_id', 'session', 'summary', 'features', 'scores', 'track_map'];
  
  requiredFields.forEach(field => {
    if (!driver[field]) {
      throw new Error(`Driver record ${index}: Missing required field '${field}'`);
    }
  });

  // Validate vehicle_id format
  if (typeof driver.vehicle_id !== 'string' || driver.vehicle_id.trim() === '') {
    throw new Error(`Driver record ${index}: Invalid vehicle_id`);
  }

  // Validate summary structure
  if (typeof driver.summary.laps_analyzed !== 'number' || typeof driver.summary.duration_seconds !== 'number') {
    throw new Error(`Driver record ${index}: Invalid summary structure - laps_analyzed and duration_seconds must be numbers`);
  }

  // Validate scores structure and range
  const requiredScores = ['aggression', 'smoothness', 'consistency', 'focus', 'adaptability', 'strategy', 'composure'];
  requiredScores.forEach(score => {
    if (typeof driver.scores[score] !== 'number' || driver.scores[score] < 0 || driver.scores[score] > 1) {
      throw new Error(`Driver record ${index}: Invalid score '${score}' - must be number between 0 and 1`);
    }
  });

  // Validate track_map structure
  if (!driver.track_map.points || !Array.isArray(driver.track_map.points)) {
    throw new Error(`Driver record ${index}: Invalid track_map.points - must be array`);
  }

  if (driver.track_map.points.length === 0) {
    throw new Error(`Driver record ${index}: track_map.points cannot be empty`);
  }

  // Validate GPS points
  driver.track_map.points.forEach((point, pointIndex) => {
    if (typeof point.lat !== 'number' || typeof point.lon !== 'number' || typeof point.throttle !== 'number') {
      throw new Error(`Driver record ${index}, point ${pointIndex}: Invalid GPS point structure`);
    }
    if (point.throttle < 0 || point.throttle > 1) {
      throw new Error(`Driver record ${index}, point ${pointIndex}: Throttle must be between 0 and 1`);
    }
  });
};

/**
 * Transform raw driver data for component consumption
 * @param {Array} rawData - Validated raw driver data
 * @returns {Array} Transformed driver data
 */
export const transformDriverData = (rawData) => {
  return rawData.map(driver => ({
    ...driver,
    // Convert scores from 0-1 scale to 0-100 scale for display
    displayScores: {
      aggression: Math.round(driver.scores.aggression * 100),
      smoothness: Math.round(driver.scores.smoothness * 100),
      consistency: Math.round(driver.scores.consistency * 100),
      focus: Math.round(driver.scores.focus * 100),
      adaptability: Math.round(driver.scores.adaptability * 100),
      strategy: Math.round(driver.scores.strategy * 100),
      composure: Math.round(driver.scores.composure * 100)
    },
    // Convert throttle percentages from 0-1 to 0-100 for display
    displayTrackMap: {
      ...driver.track_map,
      points: driver.track_map.points.map(point => ({
        ...point,
        throttlePercentage: Math.round(point.throttle * 100)
      }))
    }
  }));
};

/**
 * Get metric description based on score
 * @param {number} score - Score from 0-100
 * @returns {string} Description text
 */
export const getMetricDescription = (score) => {
  if (score >= 90) return 'very high';
  if (score >= 75) return 'high';
  if (score >= 60) return 'average';
  if (score >= 40) return 'below average';
  return 'low';
};

/**
 * Format performance data for chart components
 * @param {Object} displayScores - Transformed scores object
 * @returns {Array} Array formatted for Recharts
 */
export const formatPerformanceDataForCharts = (displayScores) => {
  return [
    { metric: 'Aggression', value: displayScores.aggression, description: getMetricDescription(displayScores.aggression) },
    { metric: 'Consistency', value: displayScores.consistency, description: getMetricDescription(displayScores.consistency) },
    { metric: 'Composure', value: displayScores.composure, description: getMetricDescription(displayScores.composure) },
    { metric: 'Smoothness', value: displayScores.smoothness, description: getMetricDescription(displayScores.smoothness) },
    { metric: 'Adaptability', value: displayScores.adaptability, description: getMetricDescription(displayScores.adaptability) },
    { metric: 'Strategy', value: displayScores.strategy, description: getMetricDescription(displayScores.strategy) }
  ];
};

/**
 * Format track map data for Plotly
 * @param {Object} trackMapData - Track map data with GPS points
 * @returns {Object} Plotly-formatted data object
 */
export const formatTrackMapDataForPlotly = (trackMapData) => {
  const points = trackMapData.points;
  
  return {
    x: points.map(point => point.lat),
    y: points.map(point => point.lon),
    mode: 'lines+markers',
    type: 'scattergl',
    line: {
      color: points.map(point => point.throttlePercentage),
      colorscale: 'RdYlBu_r', // Red-Yellow-Blue reversed (blue=low, red=high)
      width: 4,
      colorbar: {
        title: 'Throttle %',
        titleside: 'right'
      }
    },
    marker: { 
      size: 3,
      color: points.map(point => point.throttlePercentage),
      colorscale: 'RdYlBu_r'
    },
    hovertemplate: 'Lat: %{x}<br>Lon: %{y}<br>Throttle: %{marker.color}%<extra></extra>'
  };
};