"use client";

import { useState, useRef, useEffect } from 'react';
import { Calendar } from './Calendar';
import { useLocalStorage } from './useLocalStorage';
import { calculateMonthStats, getFirstMonthInWorkLog } from './utils';
import { useLanguage } from './LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { generatePDF } from './pdfGenerator';

export default function Home() {
  const { workLog, setWorkLog, isLoaded, exportData, importData } = useLocalStorage();
  const [currentYear, setCurrentYear] = useState(2024);
  const [currentMonth, setCurrentMonth] = useState(1);
  const [name, setName] = useState('');
  const [ssn, setSsn] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();
  
  // Initialize to current date after mount (external system synchronization)
  useEffect(() => {
    const today = new Date();
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth() + 1);
  }, []);

  // Load name and SSN from localStorage after mount (external system synchronization)
  useEffect(() => {
    try {
      const savedName = localStorage.getItem('worklog_user_name');
      const savedSsn = localStorage.getItem('worklog_user_ssn');
      if (savedName) setName(savedName);
      if (savedSsn) setSsn(savedSsn);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }, []);
  
  // Save name to localStorage
  const handleNameChange = (newName: string) => {
    setName(newName);
    try {
      localStorage.setItem('worklog_user_name', newName);
    } catch (error) {
      console.error('Error saving name:', error);
    }
  };
  
  // Save SSN to localStorage
  const handleSsnChange = (newSsn: string) => {
    setSsn(newSsn);
    try {
      localStorage.setItem('worklog_user_ssn', newSsn);
    } catch (error) {
      console.error('Error saving SSN:', error);
    }
  };
  
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
        const importedData = await importData(file);
        const firstMonth = getFirstMonthInWorkLog(importedData);
        
        // Reload user info from localStorage (it was updated during import)
        const savedName = localStorage.getItem('worklog_user_name');
        const savedSsn = localStorage.getItem('worklog_user_ssn');
        if (savedName) setName(savedName);
        if (savedSsn) setSsn(savedSsn);
        
        // Navigate to the first month in the imported data
        if (firstMonth) {
          setCurrentYear(firstMonth.year);
          setCurrentMonth(firstMonth.month);
        }
        
        alert(t.importSuccess);
      } catch (error) {
        alert(t.importError);
        console.error(error);
      }
    }
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleExportPDF = () => {
    const stats = calculateMonthStats(workLog, currentYear, currentMonth);
    generatePDF({
      workLog,
      year: currentYear,
      month: currentMonth,
      monthName: t.monthNames[currentMonth - 1],
      name,
      socialSecurityNumber: ssn,
      stats,
      footerText: t.pdfFooter,
      translations: {
        pdfTitle: t.pdfTitle,
        nameLabel: t.nameLabel,
        ssnLabel: t.ssnLabel,
        monthlyStats: t.monthlyStats,
        totalWithPauses: t.totalWithPauses,
        totalWithoutPauses: t.totalWithoutPauses,
        weekDays: t.weekDays,
      },
    });
  };
  
  const stats = calculateMonthStats(workLog, currentYear, currentMonth);
  
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">{t.loading}</div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white">
                {t.appTitle}
              </h1>
            </div>
            <LanguageSwitcher />
          </div>
          <p className="text-center text-gray-600 dark:text-gray-400">
            {t.appSubtitle}
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
                ← {t.previousButton}
              </button>
              <div className="text-xl font-semibold min-w-[200px] text-center">
                {t.monthNames[currentMonth - 1]} {currentYear}
              </div>
              <button
                onClick={nextMonth}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {t.nextButton} →
              </button>
              <button
                onClick={goToToday}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                {t.todayButton}
              </button>
            </div>
            
            {/* Import/Export buttons */}
            <div className="flex gap-2">
              <button
                onClick={exportData}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                {t.exportButton}
              </button>
              <label className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 cursor-pointer">
                {t.importButton}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
              </label>
              <button
                onClick={handleExportPDF}
                className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
              >
                {t.exportPdfButton}
              </button>
            </div>
          </div>
        </div>
        
        {/* User Information */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                {t.nameLabel}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                placeholder={t.nameLabel}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                {t.ssnLabel}
              </label>
              <input
                type="text"
                value={ssn}
                onChange={(e) => handleSsnChange(e.target.value)}
                className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                placeholder={t.ssnLabel}
              />
            </div>
          </div>
        </div>
        
        {/* Statistics */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
          <h2 className="text-xl font-semibold mb-3">{t.monthlyStats}</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900 rounded">
              <div className="text-sm text-gray-600 dark:text-gray-300">{t.totalWithPauses}</div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {stats.totalHoursWithPauses}
              </div>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900 rounded">
              <div className="text-sm text-gray-600 dark:text-gray-300">{t.totalWithoutPauses}</div>
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
          <h2 className="text-lg font-semibold mb-2">{t.howToUse}</h2>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
            <li>{t.instructions.line1}</li>
            <li>{t.instructions.line2}</li>
            <li>{t.instructions.line3}</li>
            <li>{t.instructions.line4}</li>
            <li>{t.instructions.line5}</li>
            <li>{t.instructions.line6}</li>
            <li>{t.instructions.line7}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
