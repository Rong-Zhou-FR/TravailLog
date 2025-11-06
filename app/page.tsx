"use client";

import { useState, useRef } from 'react';
import { Calendar } from './Calendar';
import { useLocalStorage } from './useLocalStorage';
import { calculateMonthStats } from './utils';

export default function Home() {
  const { workLog, setWorkLog, isLoaded, exportData, importData } = useLocalStorage();
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const previousMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };
  
  const nextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };
  
  const goToToday = () => {
    const today = new Date();
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth() + 1);
  };
  
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await importData(file);
        alert('Data imported successfully!');
      } catch (error) {
        alert('Error importing data. Please check the file format.');
        console.error(error);
      }
    }
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const stats = calculateMonthStats(workLog, currentYear, currentMonth);
  
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-center mb-2 text-gray-900 dark:text-white">
            TravailLog
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-400">
            Track your work hours - Zero server-side storage
          </p>
        </div>
        
        {/* Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            {/* Month navigation */}
            <div className="flex items-center gap-2">
              <button
                onClick={previousMonth}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                ← Previous
              </button>
              <div className="text-xl font-semibold min-w-[200px] text-center">
                {monthNames[currentMonth - 1]} {currentYear}
              </div>
              <button
                onClick={nextMonth}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Next →
              </button>
              <button
                onClick={goToToday}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Today
              </button>
            </div>
            
            {/* Import/Export buttons */}
            <div className="flex gap-2">
              <button
                onClick={exportData}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Export JSON
              </button>
              <label className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 cursor-pointer">
                Import JSON
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
        
        {/* Statistics */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
          <h2 className="text-xl font-semibold mb-3">Monthly Statistics</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900 rounded">
              <div className="text-sm text-gray-600 dark:text-gray-300">Total Work Time (with pauses)</div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {stats.totalHoursWithPauses}
              </div>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900 rounded">
              <div className="text-sm text-gray-600 dark:text-gray-300">Total Work Time (without pauses)</div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {stats.totalHoursWithoutPauses}
              </div>
            </div>
          </div>
        </div>
        
        {/* Calendar */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <Calendar 
            workLog={workLog}
            setWorkLog={setWorkLog}
            currentYear={currentYear}
            currentMonth={currentMonth}
          />
        </div>
        
        {/* Instructions */}
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-2">How to Use</h2>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
            <li>Click the + button on any day to expand and add shifts</li>
            <li>Add multiple shifts per day with start/end times</li>
            <li>Specify pause duration in minutes for each shift</li>
            <li>Statistics update automatically as you add/edit shifts</li>
            <li>Export your data as JSON to save your progress</li>
            <li>Import previously exported JSON files to restore data</li>
            <li>All data is stored locally in your browser (zero server-side storage)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
