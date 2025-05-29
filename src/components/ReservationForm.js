'use client';

import React, { useState, useEffect } from 'react';

export default function ReservationForm({ 
  isOpen, 
  onClose, 
  onSave, 
  editMode = false, 
  initialData = null 
}) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    time: '',
    guests: 1,
    // Rođendan specifična polja
    adultsCount: 1,
    childrenCount: 0,
    birthdayMenu: '780', // 780 ili 980 dinara
    tableNumber: '',
    type: 'standard',
    notes: '',
    createdBy: ''
  });

  // Postavi početne vrednosti ako je edit mode
  useEffect(() => {
    if (editMode && initialData) {
      setFormData({
        name: initialData.name || '',
        phone: initialData.phone || '',
        date: initialData.date || '',
        time: initialData.time || '',
        guests: initialData.guests || 1,
        adultsCount: initialData.adultsCount || 1,
        childrenCount: initialData.childrenCount || 0,
        birthdayMenu: initialData.birthdayMenu || '780',
        tableNumber: initialData.tableNumber?.toString() || '',
        type: initialData.type || 'standard',
        notes: initialData.notes || '',
        createdBy: initialData.createdBy || ''
      });
    }
  }, [editMode, initialData]);

  // Funkcija za formatiranje datuma iz YYYY-MM-DD u DD/MM/YYYY
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  // Funkcija za konvertovanje datuma iz DD/MM/YYYY u YYYY-MM-DD
  const formatDateForSubmit = (dateString) => {
    if (!dateString) return '';
    if (dateString.includes('-')) return dateString; // već u ispravnom formatu
    const [day, month, year] = dateString.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.phone || !formData.date || !formData.time || !formData.createdBy) {
      alert('Molimo unesite sva obavezna polja!');
      return;
    }

    // Za rođendan rezervacije, calculiraj ukupan broj gostiju
    const totalGuests = formData.type === 'birthday' 
      ? parseInt(formData.adultsCount) + parseInt(formData.childrenCount)
      : parseInt(formData.guests);

    const reservation = {
      ...formData,
      id: editMode ? initialData.id : Date.now(),
      guests: totalGuests,
      adultsCount: formData.type === 'birthday' ? parseInt(formData.adultsCount) : null,
      childrenCount: formData.type === 'birthday' ? parseInt(formData.childrenCount) : null,
      birthdayMenu: formData.type === 'birthday' ? formData.birthdayMenu : null,
      tableNumber: parseInt(formData.tableNumber) || null,
      date: formatDateForSubmit(formData.date), // konvertuj u YYYY-MM-DD za bazu
      createdAt: editMode ? initialData.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSave(reservation);
    
    // Reset form samo ako nije edit mode
    if (!editMode) {
      setFormData({
        name: '',
        phone: '',
        date: '',
        time: '',
        guests: 1,
        adultsCount: 1,
        childrenCount: 0,
        birthdayMenu: '780',
        tableNumber: '',
        type: 'standard',
        notes: '',
        createdBy: ''
      });
    }
    
    onClose();
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Funkcija za select all u number input polju
  const handleNumberInputFocus = (e) => {
    e.target.select();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-screen overflow-y-auto">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            {editMode ? 'Izmeni rezervaciju' : 'Nova rezervacija'}
          </h3>
          
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
                {/* Prikaz datuma u srpskom formatu */}
                {formData.date && (
                  <div className="text-xs text-gray-500 mt-1">
                    {formatDateForDisplay(formData.date)}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vreme *</label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => handleChange('time', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  step="300"
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

            {/* ROĐENDAN SPECIFIČNA POLJA */}
            {formData.type === 'birthday' ? (
              <>
                {/* Broj odraslih i dece */}
                <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
                  <h4 className="text-sm font-semibold text-pink-800 mb-3 flex items-center">
                    🎂 Rođendanska rezervacija
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Broj odraslih</label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={formData.adultsCount}
                        onChange={(e) => handleChange('adultsCount', e.target.value)}
                        onFocus={handleNumberInputFocus}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Broj dece</label>
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={formData.childrenCount}
                        onChange={(e) => handleChange('childrenCount', e.target.value)}
                        onFocus={handleNumberInputFocus}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Meni opcije */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rođendanski meni</label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="780"
                          checked={formData.birthdayMenu === '780'}
                          onChange={(e) => handleChange('birthdayMenu', e.target.value)}
                          className="mr-2 text-pink-600 focus:ring-pink-500"
                        />
                        <span className="text-sm">Meni 780 dinara</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="980"
                          checked={formData.birthdayMenu === '980'}
                          onChange={(e) => handleChange('birthdayMenu', e.target.value)}
                          className="mr-2 text-pink-600 focus:ring-pink-500"
                        />
                        <span className="text-sm">Meni 980 dinara</span>
                      </label>
                    </div>
                  </div>

                  {/* Prikaz ukupnog broja gostiju */}
                  <div className="mt-3 text-sm text-gray-600 bg-white p-2 rounded">
                    <strong>Ukupno gostiju: {parseInt(formData.adultsCount) + parseInt(formData.childrenCount)}</strong>
                  </div>
                </div>
              </>
            ) : (
              /* STANDARDNA REZERVACIJA - Broj osoba */
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Broj osoba</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={formData.guests}
                  onChange={(e) => handleChange('guests', e.target.value)}
                  onFocus={handleNumberInputFocus}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Broj stola</label>
              <input
                type="number"
                min="1"
                max="100"
                value={formData.tableNumber}
                onChange={(e) => handleChange('tableNumber', e.target.value)}
                onFocus={handleNumberInputFocus}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Opciono"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ko zakazuje rezervaciju *</label>
              <input
                type="text"
                value={formData.createdBy}
                onChange={(e) => handleChange('createdBy', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ukucaj ime ko je zakazao rezervaciju"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Napomene</label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
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
                {editMode ? 'Sačuvaj izmene' : 'Sačuvaj'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}