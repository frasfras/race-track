# CreateS a React dashboard app for analyzing racing driver  performance data. The app should read from a JSON file containing data for multiple drivers and display analytics for a selected driver.
# Required Features:

Driver Selection: Dropdown to filter data by driver ID (e.g., "GR86-002-000")
Racing Mindset Profile:

Radar/spider chart showing 6 metrics: Aggression, Consistency, Composure, Smoothness, Adaptability, and Strategy
Values range from 0-100


# Racing Mindset Breakdown:

Horizontal bar chart displaying the same 6 metrics with their scores
Color-coded bars


# Track Map Visualization:

Scatter plot showing GPS coordinates (latitude/longitude)
Points colored by throttle percentage (0-100%)
Highlight aggressive corners with distinct markers
Include corner labels (e.g., C51089, C24902)


# Summary Card:

Driver ID
Text descriptions for each metric (e.g., "high", "average", "below average", "low")
Actual numerical scores in parentheses

 Use Recharts for all charts (radar, bar, scatter)

Implement responsive layout (grid/flexbox)

# JSON Data Structure Example

{
  "vehicle_id": "GR86-002-000",
  "session": "R1_Barber_2025-09-07",
  "summary": {
    "laps_analyzed": 8,
    "duration_seconds": 1542.6
  },
  "features": {
    "mean_throttle": 74.2,
    "mean_brake": 0.13,
    "steering_variability": 12.7,
    "lap_distance_max": 3715.0
  },
  "scores": {
    "aggression": 0.74,
    "smoothness": 0.75,
    "consistency": 0.62,
    "focus": 0.93
  },
  "overall_profile": "Strategic Driver",
  "track_map": {
    "points": [
      { "lat": 33.53259, "lon": -86.61963, "throttle": 0.72 },
      { "lat": 33.53261, "lon": -86.61960, "throttle": 0.76 },
      { "lat": 33.53264, "lon": -86.61956, "throttle": 0.85 },
      { "lat": 33.53267, "lon": -86.61953, "throttle": 0.63 }
    ],
    "bounds": {
      "min_lat": 33.5325,
      "max_lat": 33.5330,
      "min_lon": -86.6200,
      "max_lon": -86.6190
    }
  }
}
