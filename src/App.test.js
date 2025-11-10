import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

// Mock the dataLoader module
jest.mock('./utils/dataLoader', () => ({
  loadDriverData: jest.fn(() => Promise.resolve([
    {
      vehicle_id: 'GR86-002-000',
      session: 'R1_Barber_2025-09-07',
      overall_profile: 'Strategic Driver',
      summary: { laps_analyzed: 15, duration_seconds: 1245 },
      displayScores: { aggression: 74, consistency: 62 },
      displayTrackMap: { points: [] }
    }
  ]))
}));

test('renders driver insights dashboard', async () => {
  render(<App />);
  
  // Check if the main title is rendered
  const titleElement = screen.getByText(/Driver Insights Dashboard/i);
  expect(titleElement).toBeInTheDocument();
  
  // Check if the subtitle is rendered
  const subtitleElement = screen.getByText(/Racing Driver Performance Analytics/i);
  expect(subtitleElement).toBeInTheDocument();
});

test('renders driver selector', async () => {
  render(<App />);
  
  // Wait for the driver selector to appear
  await waitFor(() => {
    const selectorLabel = screen.getByText(/Select Driver:/i);
    expect(selectorLabel).toBeInTheDocument();
  });
});
