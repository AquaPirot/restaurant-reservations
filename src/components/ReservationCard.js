'use client';

import React, { useState } from 'react';
import { Clock, Users, Phone, PartyPopper, Edit, Trash2, User, Baby } from 'lucide-react';
import ReservationForm from './ReservationForm';

export default function ReservationCard({ reservation, isCompact = false, onDelete, onUpdate }) {
  const [showEditForm, setShowEditForm] = useState(false);

  const handleDelete = () => {
    if (confirm('Da li ste sigurni da želite da obrišete ovu rezervaciju?')) {
      onDelete(reservation.id);
    }
  };

  const handleEdit = () => {
    setShowEditForm(true);
  };

  const handleUpdateReservation = async (updatedData) => {
    try {
      // Pozovi funkciju za ažuriranje rezervacije
      if (onUpdate) {
        await onUpdate(reservation.id, updatedData);
      }
      setShowEditForm(false);
    } catch (error) {
      alert('Greška pri ažuriranju rezervacije: ' + error.message);
    }
  };

  return (
    <>
      <div className={`bg-white rounded-lg shadow-sm border-l-4 ${
        reservation.type === 'birthday' ? 'border-pink-400' : 'border-blue-400'
      } p-4 hover:shadow-md transition-shadow ${isCompact ? 'mb-2' : 'mb-4'}`}>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h4 className="font-semibold text-gray-900">{reservation.name}</h4>
              {reservation.type === 'birthday' && (
                <div className="flex items-center space-x-1">
                  <PartyPopper className="w-4 h-4 text-pink-500" />
                  {reservation.birthdayMenu && (
                    <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded-full font-medium">
                      Meni {reservation.birthdayMenu} din
                    </span>
                  )}
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{reservation.time}</span>
              </div>
              
              {/* POBOLJŠAN prikaz gostiju za rođendane */}
              {reservation.type === 'birthday' && reservation.adultsCount !== null ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    <User className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-blue-600">{reservation.adultsCount}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Baby className="w-4 h-4 text-green-600" />
                    <span className="font-medium text-green-600">{reservation.childrenCount}</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{reservation.guests} osoba</span>
                </div>
              )}
              
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
            
            {/* POBOLJŠANE dodatne info za rođendane */}
            {reservation.type === 'birthday' && (
              <div className="mt-2 text-xs bg-pink-50 border border-pink-200 rounded-lg p-2">
                <div className="flex justify-between items-center">
                  <div className="text-pink-700">
                    <span className="font-medium">Ukupno: {reservation.guests} gostiju</span>
                    <span className="mx-2">•</span>
                    <span>Odrasli: {reservation.adultsCount}</span>
                    <span className="mx-2">•</span>
                    <span>Deca: {reservation.childrenCount}</span>
                  </div>
                  {reservation.birthdayMenu && (
                    <div className="bg-pink-100 px-2 py-1 rounded text-pink-800 font-medium">
                      {reservation.birthdayMenu} din
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {reservation.notes && (
              <p className="text-sm text-gray-500 mt-2 italic">&quot;{reservation.notes}&quot;</p>
            )}
            
            <div className="text-xs text-gray-400 mt-2 flex items-center space-x-2">
              <span>Zakazao: {reservation.createdBy}</span>
              <span>•</span>
              <span>{new Date(reservation.createdAt).toLocaleDateString('sr-RS')}</span>
            </div>
          </div>
          
          <div className="flex space-x-1 ml-4">
            <button 
              onClick={handleEdit}
              className="p-1 hover:bg-blue-50 rounded transition-colors" 
              title="Izmeni"
            >
              <Edit className="w-4 h-4 text-blue-500 hover:text-blue-600" />
            </button>
            <button 
              onClick={handleDelete}
              className="p-1 hover:bg-red-50 rounded transition-colors"
              title="Obriši"
            >
              <Trash2 className="w-4 h-4 text-red-500 hover:text-red-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal za izmenu rezervacije */}
      {showEditForm && (
        <ReservationForm
          isOpen={showEditForm}
          onClose={() => setShowEditForm(false)}
          onSave={handleUpdateReservation}
          editMode={true}
          initialData={reservation}
        />
      )}
    </>
  );
}