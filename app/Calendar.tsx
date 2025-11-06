"use client";

import React, { useState } from 'react';
import { WorkLog, Shift } from './types';
import { getDaysInMonth, formatDate, generateId, calculateDayTotal } from './utils';
import { useLanguage } from './LanguageContext';

interface CalendarProps {
  workLog: WorkLog;
  setWorkLog: React.Dispatch<React.SetStateAction<WorkLog>>;
  currentYear: number;
  currentMonth: number;
}

export function Calendar({ workLog, setWorkLog, currentYear, currentMonth }: CalendarProps) {
  const [expandedDate, setExpandedDate] = useState<string | null>(null);
  const { t } = useLanguage();
  
  const days = getDaysInMonth(currentYear, currentMonth);
  const firstDayOfWeek = new Date(currentYear, currentMonth - 1, 1).getDay();
  
  const addShift = (dateKey: string) => {
    setWorkLog(prev => {
      const newWorkLog = { ...prev };
      if (!newWorkLog[dateKey]) {
        newWorkLog[dateKey] = { date: dateKey, shifts: [] };
      }
      
      const newShift: Shift = {
        id: generateId(),
        startTime: '09:00',
        endTime: '17:00',
        pauseMinutes: 0,
      };
      
      newWorkLog[dateKey] = {
        ...newWorkLog[dateKey],
        shifts: [...newWorkLog[dateKey].shifts, newShift],
      };
      
      return newWorkLog;
    });
  };
  
  const updateShift = (dateKey: string, shiftId: string, field: keyof Shift, value: string | number) => {
    setWorkLog(prev => {
      const newWorkLog = { ...prev };
      if (newWorkLog[dateKey]) {
        newWorkLog[dateKey] = {
          ...newWorkLog[dateKey],
          shifts: newWorkLog[dateKey].shifts.map(shift =>
            shift.id === shiftId ? { ...shift, [field]: value } : shift
          ),
        };
      }
      return newWorkLog;
    });
  };
  
  const deleteShift = (dateKey: string, shiftId: string) => {
    setWorkLog(prev => {
      const newWorkLog = { ...prev };
      if (newWorkLog[dateKey]) {
        newWorkLog[dateKey] = {
          ...newWorkLog[dateKey],
          shifts: newWorkLog[dateKey].shifts.filter(shift => shift.id !== shiftId),
        };
        
        // Remove day entry if no shifts left
        if (newWorkLog[dateKey].shifts.length === 0) {
          delete newWorkLog[dateKey];
        }
      }
      return newWorkLog;
    });
  };
  
  const toggleExpand = (dateKey: string) => {
    setExpandedDate(expandedDate === dateKey ? null : dateKey);
  };
  
  return (
    <div className="w-full">
      {/* Week day headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {t.weekDays.map(day => (
          <div key={day} className="text-center font-semibold text-sm p-2 bg-gray-100 dark:bg-gray-800">
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells for days before the first day of month */}
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} className="min-h-24 bg-gray-50 dark:bg-gray-900" />
        ))}
        
        {/* Day cells */}
        {days.map(date => {
          const dateKey = formatDate(date);
          const dayData = workLog[dateKey];
          const isExpanded = expandedDate === dateKey;
          const dayTotals = dayData ? calculateDayTotal(dayData) : null;
          
          return (
            <div
              key={dateKey}
              className="min-h-24 border border-gray-300 dark:border-gray-700 p-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
            >
              <div className="flex justify-between items-start">
                <span className="font-semibold text-lg">{date.getDate()}</span>
                <button
                  onClick={() => toggleExpand(dateKey)}
                  className="text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  {isExpanded ? '−' : '+'}
                </button>
              </div>
              
              {dayData && dayData.shifts.length > 0 && (
                <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                  <div>{dayData.shifts.length} {dayData.shifts.length > 1 ? t.shifts : t.shift}</div>
                  {dayTotals && (
                    <div className="font-semibold text-green-600 dark:text-green-400">
                      {Math.floor(dayTotals.withoutPauses / 60)}h {dayTotals.withoutPauses % 60}m
                    </div>
                  )}
                </div>
              )}
              
              {isExpanded && (
                <div className="mt-2 space-y-2">
                  {dayData?.shifts.map(shift => (
                    <div key={shift.id} className="border border-gray-200 dark:border-gray-600 p-2 rounded text-xs space-y-1">
                      <div className="flex gap-1">
                        <input
                          type="time"
                          value={shift.startTime}
                          onChange={(e) => updateShift(dateKey, shift.id, 'startTime', e.target.value)}
                          className="w-full px-1 py-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                        />
                        <span className="self-center">→</span>
                        <input
                          type="time"
                          value={shift.endTime}
                          onChange={(e) => updateShift(dateKey, shift.id, 'endTime', e.target.value)}
                          className="w-full px-1 py-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                        />
                      </div>
                      <div className="flex gap-1">
                        <label className="text-xs">{t.pauseLabel}</label>
                        <input
                          type="number"
                          min="0"
                          value={shift.pauseMinutes}
                          onChange={(e) => updateShift(dateKey, shift.id, 'pauseMinutes', parseInt(e.target.value) || 0)}
                          className="w-20 px-1 py-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                        />
                        <span className="self-center">{t.minutesLabel}</span>
                      </div>
                      <button
                        onClick={() => deleteShift(dateKey, shift.id)}
                        className="w-full px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
                      >
                        {t.deleteButton}
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addShift(dateKey)}
                    className="w-full px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs"
                  >
                    {t.addShift}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
