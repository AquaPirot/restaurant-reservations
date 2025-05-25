'use client';

import React from 'react';
import { Calendar } from 'lucide-react';
import ReservationCard from './ReservationCard';

export default function WeekView({ getNext7Days, getReservationsForDate, onDeleteReservation }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6 text-gray-800">Narednih 7 dana</h2>
      <div className="grid gap-6">
        {getNext7Days().map((day, index) => {
          const dayReservations = getReservationsForDate(day);
          const isToday = day.toDateString() === new Date().toDateString();
          
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-lg ${isToday ? 'bg-blue-100' : 'bg-gray-100'}`}>
                    <span className={`font-bold text-lg ${isToday ? 'text-blue-600' : 'text-gray-700'}`}>
                      {day.getDate()}
                    </span>
                  </div>
                  <div>
                    <h3 className={`font-semibold ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
                      {day.toLocaleDateString('sr-RS', { weekday: 'long' })}
                    </h3>
                    <p className="text-gray-600">
                      {day.toLocaleDateString('sr-RS', { day: 'numeric', month: 'long' })}
                    </p>
                  </div>
                  {isToday && (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                      Danas
                    </span>
                  )}
                </div>
                
                <div className="text-right">
                  <span className="text-2xl font-bold text-gray-900">{dayReservations.length}</span>
                  <p className="text-sm text-gray-600">rezervacija</p>
                </div>
              </div>

              {dayReservations.length > 0 ? (
                <div className="space-y-3">
                  {dayReservations.map(reservation => (
                    <ReservationCard 
                      key={reservation.id} 
                      reservation={reservation} 
                      isCompact={true}
                      onDelete={onDeleteReservation}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>Nema rezervacija za ovaj dan</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}