import React from 'react';
import './DriverSelector.css';

/**
 * DriverSelector Component
 * Controlled dropdown component for selecting drivers from available data
 */
const DriverSelector = ({ 
  drivers = [], 
  selectedDriverId = '', 
  onDriverSelect, 
  loading = false,
  error = null 
}) => {
  const handleSelectionChange = (event) => {
    const selectedId = event.target.value;
    if (onDriverSelect) {
      onDriverSelect(selectedId);
    }
  };

  // Handle loading state
  if (loading) {
    return (
      <div className="driver-selector">
        <label htmlFor="driver-select" className="driver-selector__label">
          Select Driver:
        </label>
        <select 
          id="driver-select"
          className="driver-selector__dropdown driver-selector__dropdown--loading"
          disabled
        >
          <option>Loading drivers...</option>
        </select>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="driver-selector">
        <label htmlFor="driver-select" className="driver-selector__label">
          Select Driver:
        </label>
        <select 
          id="driver-select"
          className="driver-selector__dropdown driver-selector__dropdown--error"
          disabled
        >
          <option>Error loading drivers</option>
        </select>
        <div className="driver-selector__error">
          {error}
        </div>
      </div>
    );
  }

  // Handle empty state
  if (!drivers || drivers.length === 0) {
    return (
      <div className="driver-selector">
        <label htmlFor="driver-select" className="driver-selector__label">
          Select Driver:
        </label>
        <select 
          id="driver-select"
          className="driver-selector__dropdown driver-selector__dropdown--empty"
          disabled
        >
          <option>No drivers available</option>
        </select>
      </div>
    );
  }

  return (
    <div className="driver-selector">
      <label htmlFor="driver-select" className="driver-selector__label">
        Select Driver:
      </label>
      <select
        id="driver-select"
        className="driver-selector__dropdown"
        value={selectedDriverId}
        onChange={handleSelectionChange}
      >
        <option value="" disabled>
          Choose a driver...
        </option>
        {drivers.map((driver) => (
          <option key={driver.vehicle_id} value={driver.vehicle_id}>
            {driver.vehicle_id} - {driver.overall_profile}
          </option>
        ))}
      </select>
      {selectedDriverId && (
        <div className="driver-selector__selected">
          Selected: {selectedDriverId}
        </div>
      )}
    </div>
  );
};

export default DriverSelector;