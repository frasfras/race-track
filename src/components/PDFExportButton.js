import React, { useState } from 'react';
import './PDFExportButton.css';
import { exportToPDF, exportSummaryToPDF, exportChartsToPDF } from '../utils/pdfExport';

/**
 * PDFExportButton component for exporting dashboard data to PDF
 * @param {Object} props - Component props
 * @param {Object} props.driverData - Selected driver's complete data object
 * @param {string} props.exportType - Type of export: 'full', 'summary', 'charts'
 * @param {string} props.buttonText - Custom button text
 * @param {string} props.className - Additional CSS classes
 */
const PDFExportButton = ({ 
  driverData, 
  exportType = 'full', 
  buttonText, 
  className = '' 
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState(null);

  const getButtonText = () => {
    if (buttonText) return buttonText;
    
    switch (exportType) {
      case 'summary':
        return 'Export Summary';
      case 'charts':
        return 'Export Charts';
      default:
        return 'Export Report';
    }
  };

  const handleExport = async () => {
    if (!driverData) {
      setExportStatus({
        type: 'error',
        message: 'No driver data available for export'
      });
      return;
    }

    setIsExporting(true);
    setExportStatus(null);

    try {
      let result;
      
      switch (exportType) {
        case 'summary':
          result = await exportSummaryToPDF(driverData);
          break;
        case 'charts':
          result = await exportChartsToPDF(driverData);
          break;
        default:
          result = await exportToPDF(driverData);
          break;
      }

      setExportStatus({
        type: 'success',
        message: `PDF exported successfully: ${result.filename}`
      });

      // Clear success message after 3 seconds
      setTimeout(() => {
        setExportStatus(null);
      }, 3000);

    } catch (error) {
      console.error('Export failed:', error);
      setExportStatus({
        type: 'error',
        message: error.message || 'Export failed. Please try again.'
      });

      // Clear error message after 5 seconds
      setTimeout(() => {
        setExportStatus(null);
      }, 5000);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className={`pdf-export-container ${className}`}>
      <button
        className={`pdf-export-button ${isExporting ? 'exporting' : ''} ${!driverData ? 'disabled' : ''}`}
        onClick={handleExport}
        disabled={isExporting || !driverData}
      >
        {isExporting ? (
          <>
            <span className="export-spinner"></span>
            Exporting...
          </>
        ) : (
          <>
            <span className="export-icon">📄</span>
            {getButtonText()}
          </>
        )}
      </button>

      {exportStatus && (
        <div className={`export-status ${exportStatus.type}`}>
          <span className="status-icon">
            {exportStatus.type === 'success' ? '✅' : '❌'}
          </span>
          <span className="status-message">{exportStatus.message}</span>
        </div>
      )}
    </div>
  );
};

export default PDFExportButton;