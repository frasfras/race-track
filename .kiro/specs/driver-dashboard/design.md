# Design Document

## Overview

The Driver Insights Dashboard is a single-page React application that transforms racing driver telemetry data into interactive visualizations. The application follows a component-based architecture with a responsive grid layout, integrating Recharts for standard charts and Plotly for advanced track visualization. The design emphasizes data clarity, user experience, and performance optimization for real-time analytics.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Driver Dashboard App                     │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │ Driver Selector │  │ Summary Card    │  │ Data Loader │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │ Radar Chart     │  │ Bar Chart       │                  │
│  │ (Recharts)      │  │ (Recharts)      │                  │
│  └─────────────────┘  └─────────────────┘                  │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────┐ │
│  │            Track Map (Plotly)                           │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Component Hierarchy

```
App
├── DataLoader (utility component)
├── DriverSelector
├── DashboardGrid
    ├── SummaryCard
    ├── RadarChart
    ├── BarChart
    └── TrackMap
```

## Components and Interfaces

### App Component
- **Purpose**: Root component managing global state and data flow
- **State**: 
  - `driversData`: Array of all driver records
  - `selectedDriverId`: Currently selected driver ID
  - `selectedDriverData`: Filtered data for selected driver
- **Props**: None
- **Methods**: 
  - `handleDriverSelection(driverId)`: Updates selected driver
  - `loadDriverData()`: Initializes data from JSON

### DriverSelector Component
- **Purpose**: Dropdown for driver selection
- **Props**: 
  - `drivers`: Array of driver objects
  - `selectedDriverId`: Current selection
  - `onDriverSelect`: Callback function
- **State**: None (controlled component)

### SummaryCard Component
- **Purpose**: Display driver profile and metric descriptions
- **Props**: 
  - `driverData`: Selected driver's complete data object
- **Methods**: 
  - `getMetricDescription(score)`: Converts numeric score to text description
  - `formatScore(score)`: Formats score for display

### RadarChart Component
- **Purpose**: Six-axis radar visualization of performance metrics
- **Props**: 
  - `data`: Performance metrics object
- **Library**: Recharts RadarChart
- **Configuration**: 
  - Axes: Aggression, Consistency, Composure, Smoothness, Adaptability, Strategy
  - Scale: 0-100
  - Colors: Primary blue theme

### BarChart Component
- **Purpose**: Horizontal bar chart for metric comparison
- **Props**: 
  - `data`: Performance metrics object
- **Library**: Recharts BarChart
- **Configuration**: 
  - Orientation: Horizontal
  - Colors: Distinct color palette for each metric
  - Value labels: Displayed on bars

### TrackMap Component
- **Purpose**: GPS track visualization with throttle heat mapping
- **Props**: 
  - `trackData`: GPS points and throttle data
  - `corners`: Corner markers and labels
- **Library**: Plotly.js
- **Configuration**: 
  - Plot type: Line plot (scattergl mode)
  - Color scale: Blue (low throttle) to Red (high throttle)
  - Markers: Corner annotations
  - Layout: Equal aspect ratio, no axes labels

### DataLoader Utility
- **Purpose**: Handle JSON data loading and parsing
- **Methods**: 
  - `loadJSON(filePath)`: Async data loading
  - `validateData(data)`: Data structure validation
  - `transformData(rawData)`: Convert raw data to component format

## Data Models

### Driver Data Structure
```javascript
{
  vehicle_id: string,           // "GR86-002-000"
  session: string,              // "R1_Barber_2025-09-07"
  summary: {
    laps_analyzed: number,
    duration_seconds: number
  },
  features: {
    mean_throttle: number,
    mean_brake: number,
    steering_variability: number,
    lap_distance_max: number
  },
  scores: {
    aggression: number,         // 0-1 scale
    smoothness: number,
    consistency: number,
    focus: number,
    adaptability: number,       // Additional metrics
    strategy: number,
    composure: number
  },
  overall_profile: string,      // "Strategic Driver"
  track_map: {
    points: [
      {
        lat: number,
        lon: number,
        throttle: number        // 0-1 scale
      }
    ],
    bounds: {
      min_lat: number,
      max_lat: number,
      min_lon: number,
      max_lon: number
    },
    corners: [                  // Optional corner data
      {
        id: string,             // "C51089"
        lat: number,
        lon: number,
        type: string            // "aggressive"
      }
    ]
  }
}
```

### Transformed Chart Data
```javascript
// Radar/Bar Chart Data
const performanceData = [
  { metric: 'Aggression', value: 74, description: 'high' },
  { metric: 'Consistency', value: 62, description: 'average' },
  { metric: 'Composure', value: 85, description: 'high' },
  { metric: 'Smoothness', value: 75, description: 'high' },
  { metric: 'Adaptability', value: 68, description: 'average' },
  { metric: 'Strategy', value: 93, description: 'very high' }
];

// Track Map Data
const trackMapData = {
  x: [lat1, lat2, lat3, ...],
  y: [lon1, lon2, lon3, ...],
  mode: 'lines+markers',
  line: {
    color: [throttle1, throttle2, throttle3, ...],
    colorscale: 'RdYlBu_r',
    width: 4
  },
  marker: { size: 3 }
};
```

## Error Handling

### Data Loading Errors
- **File Not Found**: Display user-friendly message with retry option
- **Invalid JSON**: Show parsing error details and data format requirements
- **Missing Required Fields**: Validate data structure and highlight missing properties
- **Network Errors**: Implement retry mechanism with exponential backoff

### Runtime Errors
- **Chart Rendering Failures**: Fallback to error message with data summary
- **Invalid Driver Selection**: Reset to first available driver
- **Performance Metric Calculation**: Handle missing or invalid score values
- **GPS Data Issues**: Display partial track map with warning message

### User Input Validation
- **Driver Selection**: Ensure selected driver exists in dataset
- **Data Filtering**: Handle empty or null data gracefully
- **Component Props**: Implement PropTypes for type checking

## Testing Strategy

### Unit Testing
- **Component Rendering**: Test all components render without crashing
- **Data Transformation**: Verify utility functions handle edge cases
- **User Interactions**: Test dropdown selection and state updates
- **Chart Data**: Validate data formatting for Recharts and Plotly

### Integration Testing
- **Data Flow**: Test complete data loading to visualization pipeline
- **Component Communication**: Verify parent-child component interactions
- **Chart Libraries**: Test Recharts and Plotly integration
- **Responsive Behavior**: Test layout adaptation across screen sizes

### Performance Testing
- **Large Datasets**: Test with multiple drivers and extensive GPS data
- **Chart Rendering**: Measure rendering performance for complex visualizations
- **Memory Usage**: Monitor for memory leaks during driver switching
- **Load Times**: Optimize initial data loading and component mounting

### Accessibility Testing
- **Keyboard Navigation**: Ensure all interactive elements are keyboard accessible
- **Screen Readers**: Test with assistive technologies
- **Color Contrast**: Verify chart colors meet accessibility standards
- **Focus Management**: Implement proper focus handling for dynamic content

## Responsive Design

### Breakpoints
- **Mobile**: < 768px - Single column layout, stacked charts
- **Tablet**: 768px - 1024px - Two column grid, medium chart sizes
- **Desktop**: > 1024px - Full grid layout, large visualizations

### Layout Adaptations
- **Mobile**: Vertical stack, full-width components, touch-friendly controls
- **Tablet**: 2x2 grid for charts, collapsible summary card
- **Desktop**: 2x3 grid with track map spanning full width

### Chart Responsiveness
- **Recharts**: Implement ResponsiveContainer for automatic sizing
- **Plotly**: Configure responsive: true and autosize for dynamic resizing
- **Text Scaling**: Adjust font sizes and label positioning per breakpoint