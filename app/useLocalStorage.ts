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

  const importData = (file: File) => {
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const data = JSON.parse(content);
          setWorkLog(data);
          resolve();
        } catch (error) {
          reject(error);
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
