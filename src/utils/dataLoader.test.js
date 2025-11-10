import { validateDriverData, transformDriverData, getMetricDescription, formatPerformanceDataForCharts } from './dataLoader';

// Mock data for testing
const mockDriverData = [
  {
    vehicle_id: "TEST-001",
    session: "Test Session",
    summary: {
      laps_analyzed: 10,
      duration_seconds: 600
    },
    features: {
      mean_throttle: 0.5,
      mean_brake: 0.3,
      steering_variability: 0.1,
      lap_distance_max: 2.0
    },
    scores: {
      aggression: 0.75,
      smoothness: 0.80,
      consistency: 0.65,
      focus: 0.70,
      adaptability: 0.60,
      strategy: 0.85,
      composure: 0.90
    },
    overall_profile: "Test Driver",
    track_map: {
      points: [
        { lat: 32.4782, lon: -86.0712, throttle: 0.85 },
        { lat: 32.4785, lon: -86.0715, throttle: 0.92 }
      ],
      bounds: {
        min_lat: 32.4782,
        max_lat: 32.4785,
        min_lon: -86.0715,
        max_lon: -86.0712
      },
      corners: []
    }
  }
];

describe('Data Loader Utilities', () => {
  test('validateDriverData should accept valid data', () => {
    expect(() => validateDriverData(mockDriverData)).not.toThrow();
  });

  test('validateDriverData should reject empty array', () => {
    expect(() => validateDriverData([])).toThrow('Driver data array cannot be empty');
  });

  test('validateDriverData should reject non-array input', () => {
    expect(() => validateDriverData({})).toThrow('Driver data must be an array');
  });

  test('transformDriverData should convert scores to 0-100 scale', () => {
    const transformed = transformDriverData(mockDriverData);
    expect(transformed[0].displayScores.aggression).toBe(75);
    expect(transformed[0].displayScores.smoothness).toBe(80);
    expect(transformed[0].displayScores.composure).toBe(90);
  });

  test('getMetricDescription should return correct descriptions', () => {
    expect(getMetricDescription(95)).toBe('very high');
    expect(getMetricDescription(80)).toBe('high');
    expect(getMetricDescription(65)).toBe('average');
    expect(getMetricDescription(45)).toBe('below average');
    expect(getMetricDescription(25)).toBe('low');
  });

  test('formatPerformanceDataForCharts should return correct format', () => {
    const displayScores = {
      aggression: 75,
      consistency: 65,
      composure: 90,
      smoothness: 80,
      adaptability: 60,
      strategy: 85
    };
    
    const chartData = formatPerformanceDataForCharts(displayScores);
    expect(chartData).toHaveLength(6);
    expect(chartData[0]).toEqual({
      metric: 'Aggression',
      value: 75,
      description: 'high'
    });
  });
});