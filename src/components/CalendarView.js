'use client';

import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Users, PartyPopper } from 'lucide-react';
import ReservationCard from './ReservationCard';

export default function CalendarView({ getReservationsForDate, onDeleteReservation, onEditReservation }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    // POPRAVKA: Ponedeljak kao prvi dan (0=Nedelja, 1=Ponedeljak, ...)
    // Konvertujemo da Ponedeljak bude 0, Utorak 1, itd.
    let startingDayOfWeek = firstDay.getDay() - 1;
    if (startingDayOfWeek < 0) startingDayOfWeek = 6; // Nedelja postaje 6
    
    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const dayDate = new Date(year, month, day);
      dayDate.setHours(12, 0, 0, 0);
      days.push(dayDate);
    }
    return days;
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(currentMonth.getMonth() + direction);
    setCurrentMonth(newDate);
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    if (timeString.match(/^\d{2}:\d{2}$/)) {
      return timeString;
    }
    if (timeString.match(/^\d{2}:\d{2}:\d{2}$/)) {
      return timeString.substring(0, 5);
    }
    return timeString;
  };

  const today = new Date();
  const days = getDaysInMonth(currentMonth);
  const monthName = currentMonth.toLocaleDateString('sr-RS', { month: 'long', year: 'numeric' });

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Calendar Header */}
      <div className="p-4 md:p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 capitalize">{monthName}</h2>
          <div className="flex space-x-1 md:space-x-2">
            <button
              onClick={() => navigateMonth(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
            </button>
            <button
              onClick={() => setCurrentMonth(new Date())}
              className="px-2 md:px-3 py-2 text-xs md:text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            >
              Ovaj mesec
            </button>
            <button
              onClick={() => navigateMonth(1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-3 md:p-6">
        {/* Days of Week Header - POPRAVKA: Pon-Ned umesto Ned-Sub */}
        <div className="grid grid-cols-7 gap-1 md:gap-2 mb-2 md:mb-4">
          {['Pon', 'Uto', 'Sre', 'Čet', 'Pet', 'Sub', 'Ned'].map(day => (
            <div key={day} className="text-center text-xs md:text-sm font-medium text-gray-500 py-1 md:py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 md:gap-2">
          {days.map((day, index) => {
            if (!day) {
              return <div key={index} className="h-12 md:h-24"></div>;
            }

            const dayReservations = getReservationsForDate(day);
            const isToday = day.toDateString() === today.toDateString();
            const isSelected = selectedDate && day.toDateString() === selectedDate.toDateString();
            const isPast = day < today && !isToday;

            return (
              <div
                key={index}
                onClick={() => setSelectedDate(day)}
                className={`h-12 md:h-24 border-2 rounded-lg cursor-pointer transition-all hover:shadow-lg ${
                  isSelected ? 'border-blue-500 bg-blue-100 shadow-md' : 
                  isToday ? 'border-blue-400 bg-blue-50 shadow-sm' : 
                  isPast ? 'border-gray-200 bg-gray-100' : 
                  dayReservations.length > 0 ? 'border-green-400 bg-green-50 hover:border-green-500' :
                  'border-gray-300 bg-white hover:border-gray-400 hover:shadow-sm'
                } ${isPast ? 'opacity-70' : ''}`}
              >
                <div className="p-1 md:p-2 h-full flex flex-col">
                  <div className="flex justify-between items-start">
                    <span className={`text-xs md:text-sm font-medium ${
                      isToday ? 'text-blue-600' : 
                      isPast ? 'text-gray-400' : 'text-gray-900'
                    }`}>
                      {day.getDate()}
                    </span>
                    {dayReservations.length > 0 && (
                      <span className={`text-xs px-1 md:px-2 py-0.5 md:py-1 rounded-full font-semibold ${
                        dayReservations.some(r => r.type === 'birthday') 
                          ? 'bg-pink-100 text-pink-700' 
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {dayReservations.length}
                      </span>
                    )}
                  </div>
                  
                  {/* Mobile - samo broj rezervacija */}
                  <div className="flex-1 mt-1 block md:hidden">
                    {dayReservations.length > 0 && (
                      <div className="text-center">
                        <div className="text-xs font-semibold text-gray-600">
                          {dayReservations.length} rez.
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Desktop - mini prikaz rezervacija */}
                  <div className="flex-1 mt-2 hidden md:block">
                    {dayReservations.slice(0, 2).map((reservation, idx) => (
                      <div
                        key={idx}
                        className={`text-xs p-1.5 mb-1 rounded-md truncate font-medium ${
                          reservation.type === 'birthday' 
                            ? 'bg-pink-100 text-pink-800 border-l-2 border-pink-400' 
                            : 'bg-green-100 text-green-800 border-l-2 border-green-400'
                        }`}
                      >
                        <div className="font-semibold">{formatTime(reservation.time)}</div>
                        <div className="truncate">{reservation.name.split(' ')[0]}</div>
                      </div>
                    ))}
                    {dayReservations.length > 2 && (
                      <div className="text-xs text-center rounded px-1 py-0.5 font-medium bg-gray-100 text-gray-600">
                        +{dayReservations.length - 2} više
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Date Details - Kompletan prikaz kao Week View */}
      {selectedDate && (
        <div className="border-t border-gray-200 p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {selectedDate.toLocaleDateString('sr-RS', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}
            </h3>
            <button
              onClick={() => setSelectedDate(null)}
              className="text-gray-400 hover:text-gray-600 text-xl p-1"
            >
              ×
            </button>
          </div>

          {(() => {
            const dayReservations = getReservationsForDate(selectedDate);
            return dayReservations.length > 0 ? (
              <div className="space-y-3">
                {dayReservations.map(reservation => (
                  <ReservationCard 
                    key={reservation.id} 
                    reservation={reservation} 
                    isCompact={true}
                    onDelete={onDeleteReservation}
                    onEdit={onEditReservation}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-lg font-medium text-green-600">Slobodan dan!</p>
                <p>Nema rezervacija za ovaj datum</p>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}