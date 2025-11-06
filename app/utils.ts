import { Shift, DayData, WorkLog, MonthStats } from './types';

export function calculateShiftDuration(shift: Shift): number {
  const [startHour, startMin] = shift.startTime.split(':').map(Number);
  const [endHour, endMin] = shift.endTime.split(':').map(Number);
  
  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;
  
  let durationMinutes = endMinutes - startMinutes;
  if (durationMinutes < 0) {
    durationMinutes += 24 * 60; // Handle overnight shifts
  }
  
  return durationMinutes;
}

export function calculateDayTotal(dayData: DayData): { withPauses: number; withoutPauses: number } {
  let totalWithoutPauses = 0;
  let totalPauses = 0;
  
  dayData.shifts.forEach(shift => {
    const duration = calculateShiftDuration(shift);
    totalWithoutPauses += duration;
    totalPauses += shift.pauseMinutes;
  });
  
  return {
    withPauses: totalWithoutPauses,
    withoutPauses: totalWithoutPauses - totalPauses,
  };
}

export function calculateMonthStats(workLog: WorkLog, year: number, month: number): MonthStats {
  let totalMinutesWithPauses = 0;
  let totalMinutesWithoutPauses = 0;
  
  const monthStr = String(month).padStart(2, '0');
  const prefix = `${year}-${monthStr}`;
  
  Object.keys(workLog).forEach(dateKey => {
    if (dateKey.startsWith(prefix)) {
      const dayTotals = calculateDayTotal(workLog[dateKey]);
      totalMinutesWithPauses += dayTotals.withPauses;
      totalMinutesWithoutPauses += dayTotals.withoutPauses;
    }
  });
  
  const formatHours = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };
  
  return {
    totalMinutesWithPauses,
    totalMinutesWithoutPauses,
    totalHoursWithPauses: formatHours(totalMinutesWithPauses),
    totalHoursWithoutPauses: formatHours(totalMinutesWithoutPauses),
  };
}

export function getDaysInMonth(year: number, month: number): Date[] {
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  const days: Date[] = [];
  
  for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
    days.push(new Date(d));
  }
  
  return days;
}

export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

export function getFirstMonthInWorkLog(workLog: WorkLog): { year: number; month: number } | null {
  const dateKeys = Object.keys(workLog);
  
  if (dateKeys.length === 0) {
    return null;
  }
  
  // Sort date keys chronologically to find the earliest date
  const sortedKeys = dateKeys.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  const firstDateKey = sortedKeys[0];
  
  // Parse YYYY-MM-DD format
  const [year, month] = firstDateKey.split('-').map(Number);
  
  return { year, month };
}
