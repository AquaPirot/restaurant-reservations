'use client';

import React, { useState } from 'react';

export default function ReservationForm({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    time: '',
    guests: 1,
    tableNumber: '',
    type: 'standard',
    notes: '',
    createdBy: 'Konobar'
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.phone || !formData.date || !formData.time) {
      alert('Molimo unesite sva obavezna polja!');
      return;
    }

    const reservation = {
      ...formData,
      id: Date.now(),
      guests: parseInt(formData.guests),
      tableNumber: parseInt(formData.tableNumber) || null,
      createdAt: new Date().toISOString()
    };

    onSave(reservation);
    
    // Reset form
    setFormData({
      name: '',
      phone: '',
      date: '',
      time: '',
      guests: 1,
      tableNumber: '',
      type: 'standard',
      notes: '',
      createdBy: 'Konobar'
    });
    
    onClose();
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-screen overflow-y-auto">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Nova rezervacija</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ime i prezime *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Unesite ime i prezime"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefon *</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="062/123-456"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Datum *</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vreme *</label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => handleChange('time', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Broj osoba</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={formData.guests}
                  onChange={(e) => handleChange('guests', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Broj stola</label>
                <input
                  type="number"
                  value={formData.tableNumber}
                  onChange={(e) => handleChange('tableNumber', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Opciono"
                />
              </div>
            </div>

<div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tip rezervacije</label>
              <select
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="standard">Standardna</option>
                <option value="birthday">Rođendan</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ko pravi rezervaciju</label>
              <input
                type="text"
                value={formData.createdBy}
                onChange={(e) => handleChange('createdBy', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ime konobara/hostese"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Napomene</label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Dodatne informacije..."
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Odustani
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Sačuvaj
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}