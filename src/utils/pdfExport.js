import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * PDF Export utilities for generating racing mindset reports
 */

/**
 * Export dashboard components to PDF
 * @param {Object} driverData - Selected driver's complete data object
 * @param {Object} options - Export options
 */
export const exportToPDF = async (driverData, options = {}) => {
  if (!driverData) {
    throw new Error('Driver data is required for PDF export');
  }

  const {
    filename = `Racing_Mindset_Report_${driverData.vehicle_id}_${new Date().toISOString().split('T')[0]}.pdf`,
    includeCharts = true,
    includeSummary = true,
    orientation = 'portrait'
  } = options;

  try {
    // Create new PDF document
    const pdf = new jsPDF({
      orientation: orientation,
      unit: 'mm',
      format: 'a4'
    });

    // Add title page
    await addTitlePage(pdf, driverData);

    // Add summary card if requested
    if (includeSummary) {
      pdf.addPage();
      await addSummaryPage(pdf, driverData);
    }

    // Add charts if requested
    if (includeCharts) {
      pdf.addPage();
      await addChartsPage(pdf, driverData);
    }

    // Save the PDF
    pdf.save(filename);
    
    return {
      success: true,
      filename: filename,
      message: 'PDF exported successfully'
    };
  } catch (error) {
    console.error('PDF export failed:', error);
    throw new Error(`PDF export failed: ${error.message}`);
  }
};

/**
 * Add title page to PDF
 * @param {jsPDF} pdf - PDF document instance
 * @param {Object} driverData - Driver data
 */
const addTitlePage = async (pdf, driverData) => {
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  
  // Header
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Racing Mindset Report', pageWidth / 2, 30, { align: 'center' });
  
  // Driver information
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Driver: ${driverData.vehicle_id}`, pageWidth / 2, 50, { align: 'center' });
  
  pdf.setFontSize(14);
  pdf.text(`Profile: ${driverData.overall_profile}`, pageWidth / 2, 65, { align: 'center' });
  pdf.text(`Session: ${driverData.session}`, pageWidth / 2, 80, { align: 'center' });
  
  // Report details
  pdf.setFontSize(12);
  pdf.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, 100, { align: 'center' });
  pdf.text(`Laps Analyzed: ${driverData.summary.laps_analyzed}`, pageWidth / 2, 115, { align: 'center' });
  pdf.text(`Duration: ${Math.round(driverData.summary.duration_seconds / 60)} minutes`, pageWidth / 2, 130, { align: 'center' });
  
  // Performance overview box
  const boxY = 150;
  const boxHeight = 80;
  const boxWidth = 160;
  const boxX = (pageWidth - boxWidth) / 2;
  
  pdf.setDrawColor(0, 123, 255);
  pdf.setLineWidth(1);
  pdf.rect(boxX, boxY, boxWidth, boxHeight);
  
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Performance Overview', pageWidth / 2, boxY + 15, { align: 'center' });
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  
  const metrics = [
    `Aggression: ${driverData.displayScores.aggression}`,
    `Consistency: ${driverData.displayScores.consistency}`,
    `Composure: ${driverData.displayScores.composure}`,
    `Smoothness: ${driverData.displayScores.smoothness}`,
    `Adaptability: ${driverData.displayScores.adaptability}`,
    `Strategy: ${driverData.displayScores.strategy}`
  ];
  
  metrics.forEach((metric, index) => {
    const row = Math.floor(index / 2);
    const col = index % 2;
    const x = boxX + 10 + (col * 75);
    const y = boxY + 35 + (row * 12);
    pdf.text(metric, x, y);
  });
  
  // Footer
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'italic');
  pdf.text('Driver Insights Dashboard - Performance Analytics', pageWidth / 2, pageHeight - 20, { align: 'center' });
};

/**
 * Add summary page to PDF
 * @param {jsPDF} pdf - PDF document instance
 * @param {Object} driverData - Driver data
 */
const addSummaryPage = async (pdf, driverData) => {
  const pageWidth = pdf.internal.pageSize.getWidth();
  
  // Page title
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Driver Performance Summary', pageWidth / 2, 25, { align: 'center' });
  
  // Try to capture summary card from DOM
  const summaryElement = document.querySelector('.summary-card');
  if (summaryElement) {
    try {
      const canvas = await html2canvas(summaryElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 180;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 15, 40, imgWidth, imgHeight);
    } catch (error) {
      console.warn('Could not capture summary card, using text fallback:', error);
      addSummaryTextFallback(pdf, driverData);
    }
  } else {
    addSummaryTextFallback(pdf, driverData);
  }
};

/**
 * Add text-based summary fallback
 * @param {jsPDF} pdf - PDF document instance
 * @param {Object} driverData - Driver data
 */
const addSummaryTextFallback = (pdf, driverData) => {
  let yPosition = 50;
  
  // Driver profile section
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Driver Profile', 20, yPosition);
  yPosition += 15;
  
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Driver ID: ${driverData.vehicle_id}`, 25, yPosition);
  yPosition += 10;
  pdf.text(`Profile: ${driverData.overall_profile}`, 25, yPosition);
  yPosition += 10;
  pdf.text(`Session: ${driverData.session}`, 25, yPosition);
  yPosition += 10;
  pdf.text(`Laps Analyzed: ${driverData.summary.laps_analyzed}`, 25, yPosition);
  yPosition += 20;
  
  // Performance metrics section
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Performance Metrics', 20, yPosition);
  yPosition += 15;
  
  const metrics = [
    { name: 'Aggression', value: driverData.displayScores.aggression },
    { name: 'Consistency', value: driverData.displayScores.consistency },
    { name: 'Composure', value: driverData.displayScores.composure },
    { name: 'Smoothness', value: driverData.displayScores.smoothness },
    { name: 'Adaptability', value: driverData.displayScores.adaptability },
    { name: 'Strategy', value: driverData.displayScores.strategy }
  ];
  
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  
  metrics.forEach(metric => {
    const description = getMetricDescription(metric.value);
    pdf.text(`${metric.name}: ${description} (${metric.value})`, 25, yPosition);
    yPosition += 10;
  });
  
  yPosition += 10;
  
  // Session details section
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Session Details', 20, yPosition);
  yPosition += 15;
  
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Duration: ${Math.round(driverData.summary.duration_seconds / 60)} minutes`, 25, yPosition);
  yPosition += 10;
  pdf.text(`Mean Throttle: ${Math.round(driverData.features.mean_throttle * 100)}%`, 25, yPosition);
  yPosition += 10;
  pdf.text(`Mean Brake: ${Math.round(driverData.features.mean_brake * 100)}%`, 25, yPosition);
};

/**
 * Add charts page to PDF
 * @param {jsPDF} pdf - PDF document instance
 * @param {Object} driverData - Driver data
 */
const addChartsPage = async (pdf, driverData) => {
  const pageWidth = pdf.internal.pageSize.getWidth();
  
  // Page title
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Performance Charts', pageWidth / 2, 25, { align: 'center' });
  
  let yPosition = 40;
  
  // Try to capture radar chart
  const radarElement = document.querySelector('.radar-chart-container');
  if (radarElement) {
    try {
      const canvas = await html2canvas(radarElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 85;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 15, yPosition, imgWidth, imgHeight);
    } catch (error) {
      console.warn('Could not capture radar chart:', error);
    }
  }
  
  // Try to capture bar chart
  const barElement = document.querySelector('.bar-chart-container');
  if (barElement) {
    try {
      const canvas = await html2canvas(barElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 85;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 110, yPosition, imgWidth, imgHeight);
    } catch (error) {
      console.warn('Could not capture bar chart:', error);
    }
  }
};

/**
 * Get metric description based on score
 * @param {number} score - Score from 0-100
 * @returns {string} Description text
 */
const getMetricDescription = (score) => {
  if (score >= 90) return 'very high';
  if (score >= 75) return 'high';
  if (score >= 60) return 'average';
  if (score >= 40) return 'below average';
  return 'low';
};

/**
 * Export only summary card to PDF
 * @param {Object} driverData - Driver data
 * @param {string} filename - Optional filename
 */
export const exportSummaryToPDF = async (driverData, filename) => {
  return exportToPDF(driverData, {
    filename: filename || `Driver_Summary_${driverData.vehicle_id}.pdf`,
    includeCharts: false,
    includeSummary: true
  });
};

/**
 * Export only charts to PDF
 * @param {Object} driverData - Driver data
 * @param {string} filename - Optional filename
 */
export const exportChartsToPDF = async (driverData, filename) => {
  return exportToPDF(driverData, {
    filename: filename || `Driver_Charts_${driverData.vehicle_id}.pdf`,
    includeCharts: true,
    includeSummary: false
  });
};