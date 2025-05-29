'use client';

import React, { useState } from 'react';
import { Calendar, Plus, RefreshCw } from 'lucide-react';
import { useReservations } from '../hooks/useReservations';
import CalendarView from './CalendarView';
import WeekView from './WeekView';
import ReservationForm from './ReservationForm';

export default function ReservationSystem() {
  const [currentView, setCurrentView] = useState('week');
  const [showAddForm, setShowAddForm] = useState(false);
  
  const {
    reservations,
    loading,
    error,
    addReservation,
    updateReservation,
    deleteReservation,
    getReservationsForDate,
    refetch
  } = useReservations();

  const handleAddReservation = async (reservationData) => {
    try {
      await addReservation(reservationData);
      setShowAddForm(false);
    } catch (error) {
      alert('Greška pri dodavanju rezervacije: ' + error.message);
    }
  };

  const handleUpdateReservation = async (id, reservationData) => {
    try {
      await updateReservation(id, reservationData);
    } catch (error) {
      alert('Greška pri ažuriranju rezervacije: ' + error.message);
      throw error;
    }
  };

  const handleDeleteReservation = async (id) => {
    if (confirm('Da li ste sigurni da želite da obrišete ovu rezervaciju?')) {
      try {
        await deleteReservation(id);
      } catch (error) {
        alert('Greška pri brisanju rezervacije: ' + error.message);
      }
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Učitavam rezervacije...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-6 rounded-lg shadow-sm">
          <p className="text-red-600 mb-4">Greška: {error}</p>
          <button
            onClick={refetch}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Pokušaj ponovo</span>
          </button>
        </div>
      </div>
    );
  }

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
            
            {/* Refresh Button */}
            <div className="flex justify-center">
              <button
                onClick={refetch}
                className="flex items-center space-x-1 px-2 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors text-xs"
                title="Osvezi podatke"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Osvezi</span>
              </button>
            </div>
          </div>

          {/* Desktop Layout */}
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
                onClick={refetch}
                className="flex items-center space-x-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm"
                title="Osvezi podatke"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Osvezi</span>
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
            onDeleteReservation={handleDeleteReservation}
            onUpdateReservation={handleUpdateReservation}
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
          onSave={handleAddReservation}
        />
      )}

      {/* Database Info */}
      <div className="fixed bottom-4 right-4 text-xs text-gray-500 bg-white px-2 py-1 rounded shadow">
        Podaci se čuvaju u MySQL bazi
      </div>
    </div>
  );
}