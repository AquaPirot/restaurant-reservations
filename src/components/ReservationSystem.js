'use client';

import React, { useState } from 'react';
import { Calendar, Download, Upload, RotateCcw, Plus } from 'lucide-react';
import { useReservations } from '@/hooks/useReservations';
import CalendarView from './CalendarView';
import WeekView from './WeekView';
import ReservationForm from './ReservationForm';

export default function ReservationSystem() {
  const [currentView, setCurrentView] = useState('week');
  const [showAddForm, setShowAddForm] = useState(false);
  
  const {
    reservations,
    addReservation,
    deleteReservation,
    exportData,
    importData,
    resetAllData,
    getReservationsForDate
  } = useReservations();

  const handleImportChange = (event) => {
    importData(event);
  };

  const getNext7Days = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      days.push(date);
    }
    return days;
  };

  return (
    <div className="min-h-screen bg-gray-50">
     {/* Header - MOBILE FRIENDLY */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* Mobile Layout - Stack vertically */}
          <div className="block md:hidden">
            {/* Title and Stats */}
            <div className="mb-4">
              <h1 className="text-xl font-bold text-gray-900 flex items-center space-x-2 mb-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span>Rezervacije</span>
              </h1>
              <p className="text-sm text-gray-600">
                Ukupno: {reservations.length} | Danas: {getReservationsForDate(new Date()).length}
              </p>
            </div>
            
            {/* Main Actions Row */}
            <div className="flex justify-between items-center mb-3">
              <button
                onClick={() => setCurrentView(currentView === 'week' ? 'calendar' : 'week')}
                className="flex items-center space-x-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm"
              >
                <span>{currentView === 'week' ? 'Kalendar' : 'Sedmica'}</span>
              </button>
              
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Nova</span>
              </button>
            </div>
            
            {/* Data Management Row */}
            <div className="flex justify-center space-x-2">
              <button
                onClick={exportData}
                className="flex items-center space-x-1 px-2 py-1.5 bg-green-100 hover:bg-green-200 text-green-700 rounded-md transition-colors text-xs"
                title="Backup"
              >
                <Download className="w-3 h-3" />
                <span>Backup</span>
              </button>
              
              <label className="flex items-center space-x-1 px-2 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md transition-colors cursor-pointer text-xs">
                <Upload className="w-3 h-3" />
                <span>Učitaj</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportChange}
                  className="hidden"
                />
              </label>

              <button
                onClick={resetAllData}
                className="flex items-center space-x-1 px-2 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-md transition-colors text-xs"
                title="Reset"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Desktop Layout - Original horizontal */}
          <div className="hidden md:flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                <Calendar className="w-6 h-6 text-blue-600" />
                <span>Rezervacije - Restoran</span>
              </h1>
              <p className="text-gray-600">
                Ukupno: {reservations.length} rezervacija | 
                Danas: {getReservationsForDate(new Date()).length}
              </p>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={exportData}
                className="flex items-center space-x-1 px-3 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors text-sm"
                title="Napravi backup"
              >
                <Download className="w-4 h-4" />
                <span>Backup</span>
              </button>
              
              <label className="flex items-center space-x-1 px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors cursor-pointer text-sm">
                <Upload className="w-4 h-4" />
                <span>Učitaj</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportChange}
                  className="hidden"
                />
              </label>

              <button
                onClick={resetAllData}
                className="flex items-center space-x-1 px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors text-sm"
                title="Obriši sve podatke"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>
              
              <button
                onClick={() => setCurrentView(currentView === 'week' ? 'calendar' : 'week')}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <span>{currentView === 'week' ? 'Kalendar' : 'Sedmica'}</span>
              </button>
              
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Nova rezervacija</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {currentView === 'week' ? (
          <WeekView 
            getNext7Days={getNext7Days}
            getReservationsForDate={getReservationsForDate}
            onDeleteReservation={deleteReservation}
          />
        ) : (
          <CalendarView 
            getReservationsForDate={getReservationsForDate}
          />
        )}
      </div>

      {/* Modal za dodavanje rezervacije */}
      {showAddForm && (
        <ReservationForm
          isOpen={showAddForm}
          onClose={() => setShowAddForm(false)}
          onSave={addReservation}
        />
      )}

      {/* Storage Info */}
      <div className="fixed bottom-4 right-4 text-xs text-gray-500 bg-white px-2 py-1 rounded shadow">
        Podaci se čuvaju lokalno na uređaju
      </div>
    </div>
  );
}