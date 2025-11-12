import { jsPDF } from 'jspdf';
import { WorkLog, MonthStats } from './types';
import { getDaysInMonth, formatDate, calculateDayTotal } from './utils';

interface PDFExportData {
  workLog: WorkLog;
  year: number;
  month: number;
  monthName: string;
  name: string;
  socialSecurityNumber: string;
  stats: MonthStats;
  footerText: string;
  translations: {
    pdfTitle: string;
    nameLabel: string;
    ssnLabel: string;
    monthlyStats: string;
    totalWithPauses: string;
    totalWithoutPauses: string;
    weekDays: string[];
  };
}

export function generatePDF(data: PDFExportData): void {
  const { workLog, year, month, monthName, name, socialSecurityNumber, stats, footerText, translations } = data;
  
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Helper function to add footer to current page
  const addFooter = () => {
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(footerText, pageWidth - 10, pageHeight - 10, { align: 'right' });
  };
  
  // Header
  doc.setFontSize(16);
  doc.text(`${translations.pdfTitle} - ${monthName} ${year}`, pageWidth / 2, 15, { align: 'center' });
  
  // User info
  doc.setFontSize(10);
  let yPos = 25;
  if (name) {
    doc.text(`${translations.nameLabel}: ${name}`, 15, yPos);
    yPos += 6;
  }
  if (socialSecurityNumber) {
    doc.text(`${translations.ssnLabel}: ${socialSecurityNumber}`, 15, yPos);
    yPos += 6;
  }
  
  // Monthly totals
  yPos += 4;
  doc.setFontSize(12);
  doc.text(`${translations.monthlyStats}:`, 15, yPos);
  yPos += 6;
  doc.setFontSize(10);
  doc.text(`${translations.totalWithPauses}: ${stats.totalHoursWithPauses}`, 20, yPos);
  yPos += 6;
  doc.text(`${translations.totalWithoutPauses}: ${stats.totalHoursWithoutPauses}`, 20, yPos);
  yPos += 10;
  
  // Calendar grid
  const days = getDaysInMonth(year, month);
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay();
  const cellWidth = (pageWidth - 20) / 7;
  const cellHeight = 25;
  const startX = 10;
  let startY = yPos;
  
  // Week headers
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  for (let i = 0; i < 7; i++) {
    doc.text(translations.weekDays[i], startX + i * cellWidth + cellWidth / 2, startY, { align: 'center' });
  }
  startY += 5;
  
  // Draw calendar
  doc.setFont('helvetica', 'normal');
  let dayIndex = 0;
  let row = 0;
  
  // Empty cells before first day
  for (let i = 0; i < firstDayOfWeek; i++) {
    dayIndex++;
  }
  
  // Days
  for (let i = 0; i < days.length; i++) {
    const date = days[i];
    const col = dayIndex % 7;
    
    if (col === 0 && dayIndex > 0) {
      row++;
      // Check if we need a new page
      if (startY + row * cellHeight > pageHeight - 20) {
        addFooter(); // Add footer to previous page before creating new page
        doc.addPage();
        row = 0;
        startY = 20;
        // Re-draw week headers
        doc.setFont('helvetica', 'bold');
        for (let j = 0; j < 7; j++) {
          doc.text(translations.weekDays[j], startX + j * cellWidth + cellWidth / 2, startY, { align: 'center' });
        }
        startY += 5;
        doc.setFont('helvetica', 'normal');
      }
    }
    
    const x = startX + col * cellWidth;
    const y = startY + row * cellHeight;
    
    // Draw cell border
    doc.rect(x, y, cellWidth, cellHeight);
    
    // Date number
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(date.getDate().toString(), x + 2, y + 5);
    doc.setFont('helvetica', 'normal');
    
    // Shift data
    const dateKey = formatDate(date);
    const dayData = workLog[dateKey];
    
    if (dayData && dayData.shifts.length > 0) {
      doc.setFontSize(7);
      let shiftY = y + 10;
      
      dayData.shifts.forEach((shift) => {
        if (shiftY + 3 < y + cellHeight - 2) {
          const text = `${shift.startTime}-${shift.endTime}`;
          doc.text(text, x + 2, shiftY);
          shiftY += 3;
        }
      });
      
      // Total for the day
      const dayTotals = calculateDayTotal(dayData);
      const hours = Math.floor(dayTotals.withoutPauses / 60);
      const mins = dayTotals.withoutPauses % 60;
      if (shiftY + 3 < y + cellHeight - 2) {
        doc.setFont('helvetica', 'bold');
        doc.text(`${hours}h ${mins}m`, x + 2, shiftY);
        doc.setFont('helvetica', 'normal');
      }
    }
    
    dayIndex++;
  }
  
  // Add footer to the last page
  addFooter();
  
  // Save PDF
  const fileName = `worklog-${year}-${String(month).padStart(2, '0')}.pdf`;
  doc.save(fileName);
}
