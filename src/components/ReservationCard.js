'use client';

import React from 'react';
import { Clock, Users, Phone, PartyPopper, Edit, Trash2 } from 'lucide-react';

export default function ReservationCard({ reservation, isCompact = false, onDelete }) {
  const handleDelete = () => {
    if (confirm('Da li ste sigurni da želite da obrišete ovu rezervaciju?')) {
      onDelete(reservation.id);
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border-l-4 ${
      reservation.type === 'birthday' ? 'border-pink-400' : 'border-blue-400'
    } p-4 hover:shadow-md transition-shadow ${isCompact ? 'mb-2' : 'mb-4'}`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h4 className="font-semibold text-gray-900">{reservation.name}</h4>
            {reservation.type === 'birthday' && (
              <PartyPopper className="w-4 h-4 text-pink-500" />
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{reservation.time}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>{reservation.guests} osoba</span>
            </div>
            <div className="flex items-center space-x-1">
              <Phone className="w-4 h-4" />
              <span>{reservation.phone}</span>
            </div>
            {reservation.tableNumber && (
              <div className="text-blue-600 font-medium">
                Sto {reservation.tableNumber}
              </div>
            )}
          </div>
          
          {reservation.notes && (
            <p className="text-sm text-gray-500 mt-2 italic">&quot;{reservation.notes}&quot;</p>
          )}
          
          <div className="text-xs text-gray-400 mt-2 flex items-center space-x-2">
            <span>Kreirao: {reservation.createdBy}</span>
            <span>•</span>
            <span>{new Date(reservation.createdAt).toLocaleDateString('sr-RS')}</span>
          </div>
        </div>
        
        <div className="flex space-x-1 ml-4">
          <button className="p-1 hover:bg-gray-100 rounded" title="Izmeni">
            <Edit className="w-4 h-4 text-gray-500" />
          </button>
          <button 
            onClick={handleDelete}
            className="p-1 hover:bg-red-50 rounded"
            title="Obriši"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </button>
        </div>
      </div>
    </div>
  );
}