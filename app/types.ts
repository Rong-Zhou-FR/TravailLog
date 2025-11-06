export interface Shift {
  id: string;
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  pauseMinutes: number;
}

export interface DayData {
  date: string; // YYYY-MM-DD format
  shifts: Shift[];
}

export interface WorkLog {
  [key: string]: DayData; // key is YYYY-MM-DD
}

export interface MonthStats {
  totalMinutesWithPauses: number;
  totalMinutesWithoutPauses: number;
  totalHoursWithPauses: string;
  totalHoursWithoutPauses: string;
}
