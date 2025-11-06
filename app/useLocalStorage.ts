"use client";

import { useState, useEffect } from 'react';
import { WorkLog } from './types';

const STORAGE_KEY = 'travail-log-data';

export function useLocalStorage() {
  const [workLog, setWorkLog] = useState<WorkLog>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setWorkLog(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(workLog));
      } catch (error) {
        console.error('Error saving data to localStorage:', error);
      }
    }
  }, [workLog, isLoaded]);

  const exportData = () => {
    const dataStr = JSON.stringify(workLog, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `travail-log-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const validateWorkLog = (data: unknown): data is WorkLog => {
    if (!data || typeof data !== 'object') {
      return false;
    }

    for (const [key, value] of Object.entries(data)) {
      // Validate date key format (YYYY-MM-DD)
      if (!/^\d{4}-\d{2}-\d{2}$/.test(key)) {
        return false;
      }

      // Validate DayData structure
      if (!value || typeof value !== 'object') {
        return false;
      }

      const dayData = value as Record<string, unknown>;
      
      // Check for required fields
      if (typeof dayData.date !== 'string' || !Array.isArray(dayData.shifts)) {
        return false;
      }

      // Validate each shift
      for (const shift of dayData.shifts) {
        if (!shift || typeof shift !== 'object') {
          return false;
        }

        const s = shift as Record<string, unknown>;
        
        // Check shift fields
        if (
          typeof s.id !== 'string' ||
          typeof s.startTime !== 'string' ||
          typeof s.endTime !== 'string' ||
          typeof s.pauseMinutes !== 'number'
        ) {
          return false;
        }

        // Validate time format (HH:MM)
        if (!/^\d{2}:\d{2}$/.test(s.startTime) || !/^\d{2}:\d{2}$/.test(s.endTime)) {
          return false;
        }

        // Validate pauseMinutes is non-negative
        if (s.pauseMinutes < 0) {
          return false;
        }
      }
    }

    return true;
  };

  const importData = (file: File) => {
    return new Promise<WorkLog>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const data = JSON.parse(content);
          
          if (!validateWorkLog(data)) {
            reject(new Error('Invalid data format. Please ensure the file contains valid TravailLog data.'));
            return;
          }
          
          setWorkLog(data);
          resolve(data);
        } catch (error) {
          if (error instanceof SyntaxError) {
            reject(new Error('Invalid JSON file. Please select a valid TravailLog export file.'));
          } else {
            reject(error);
          }
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
  };

  return {
    workLog,
    setWorkLog,
    isLoaded,
    exportData,
    importData,
  };
}
