'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Clock } from 'lucide-react';
import DatePickerModal from './DatePickerModal';

// Custom Date Input - uvek DD/MM/YYYY format
function CustomDateInput({ value, onChange, className, required = false, onCalendarClick }) {
  const [displayValue, setDisplayValue] = useState('');

  useEffect(() => {
    if (value) {
      // Konvertuj YYYY-MM-DD u DD/MM/YYYY za prikaz
      const [year, month, day] = value.split('-');
      setDisplayValue(`${day}/${month}/${year}`);
    }
  }, [value]);

  const handleChange = (e) => {
    let input = e.target.value.replace(/\D/g, ''); // samo brojevi
    let formatted = '';
    
    // Formatiranje DD/MM/YYYY
    if (input.length >= 1) {
      formatted = input.substring(0, 2);
    }
    if (input.length >= 3) {
      formatted += '/' + input.substring(2, 4);
    }
    if (input.length >= 5) {
      formatted += '/' + input.substring(4, 8);
    }
    
    setDisplayValue(formatted);
    
    // Ako je kompletan datum (DD/MM/YYYY), konvertuj u YYYY-MM-DD
    if (formatted.length === 10) {
      const [day, month, year] = formatted.split('/');
      if (day && month && year && 
          parseInt(day) >= 1 && parseInt(day) <= 31 &&
          parseInt(month) >= 1 && parseInt(month) <= 12 &&
          year.length === 4) {
        const isoDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        onChange({ target: { value: isoDate } });
      }
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={displayValue}
        onChange={handleChange}
        className={className}
        placeholder="DD/MM/YYYY"
        maxLength={10}
        required={required}
      />
      <button
        type="button"
        onClick={onCalendarClick}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded transition-colors"
        title="Izaberi datum iz kalendara"
      >
        <Calendar className="w-4 h-4 text-gray-400 hover:text-blue-600" />
      </button>
    </div>
  );
}

// Custom Time Input - uvek 24h format
function CustomTimeInput({ value, onChange, className, required = false }) {
  const [displayValue, setDisplayValue] = useState(value || '');

  useEffect(() => {
    setDisplayValue(value || '');
  }, [value]);

  const handleChange = (e) => {
    let input = e.target.value.replace(/\D/g, ''); // samo brojevi
    let formatted = '';
    
    if (input.length >= 1) {
      let hours = input.substring(0, 2);
      // Ograniči sate na 0-23
      if (parseInt(hours) > 23) hours = '23';
      formatted = hours.padStart(2, '0');
    }
    if (input.length >= 3) {
      let minutes = input.substring(2, 4);
      // Ograniči minute na 0-59
      if (parseInt(minutes) > 59) minutes = '59';
      formatted += ':' + minutes.padStart(2, '0');
    }
    
    setDisplayValue(formatted);
    
    // Ako je kompletno vreme (HH:MM), pošalji dalje
    if (formatted.length === 5) {
      onChange({ target: { value: formatted } });
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={displayValue}
        onChange={handleChange}
        className={className}
        placeholder="HH:MM"
        maxLength={5}
        required={required}
      />
      <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
    </div>
  );
}

// Quick select dugmićи za vreme
function TimeQuickSelect({ onSelect }) {
  const commonTimes = [
    '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', 
    '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
  ];

  return (
    <div className="flex flex-wrap gap-1 mt-2">
      {commonTimes.map(time => (
        <button
          key={time}
          type="button"
          onClick={() => onSelect(time)}
          className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
        >
          {time}
        </button>
      ))}
    </div>
  );
}

// Quick select dugmići za datum
function DateQuickSelect({ onSelect }) {
  const getQuickDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        label: i === 0 ? 'Danas' : i === 1 ? 'Sutra' : 
                date.toLocaleDateString('sr-RS', { weekday: 'short', day: 'numeric', month: 'numeric' }),
        value: date.toISOString().split('T')[0]
      });
    }
    
    return dates;
  };

  return (
    <div className="flex flex-wrap gap-1 mt-2">
      {getQuickDates().map(date => (
        <button
          key={date.value}
          type="button"
          onClick={() => onSelect(date.value)}
          className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
        >
          {date.label}
        </button>
      ))}
    </div>
  );
}

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
    birthdayMenu: '780',
    tableNumber: '',
    type: 'standard',
    notes: '',
    createdBy: ''
  });

  const [showTimeQuickSelect, setShowTimeQuickSelect] = useState(false);
  const [showDateQuickSelect, setShowDateQuickSelect] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

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
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-screen overflow-y-auto">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">
              {editMode ? 'Izmeni rezervaciju' : 'Nova rezervacija'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ime i prezime <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Unesite ime i prezime"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefon <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="062/123-456"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Datum <span className="text-red-500">*</span>
                    <button
                      type="button"
                      onClick={() => setShowDateQuickSelect(!showDateQuickSelect)}
                      className="ml-2 text-xs text-blue-600 hover:text-blue-800"
                    >
                      (brzo)
                    </button>
                  </label>
                  <CustomDateInput
                    value={formData.date}
                    onChange={(e) => handleChange('date', e.target.value)}
                    onCalendarClick={() => setShowDatePicker(true)}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  {showDateQuickSelect && (
                    <DateQuickSelect 
                      onSelect={(date) => {
                        handleChange('date', date);
                        setShowDateQuickSelect(false);
                      }}
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vreme <span className="text-red-500">*</span>
                    <button
                      type="button"
                      onClick={() => setShowTimeQuickSelect(!showTimeQuickSelect)}
                      className="ml-2 text-xs text-blue-600 hover:text-blue-800"
                    >
                      (brzo)
                    </button>
                  </label>
                  <CustomTimeInput
                    value={formData.time}
                    onChange={(e) => handleChange('time', e.target.value)}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  {showTimeQuickSelect && (
                    <TimeQuickSelect 
                      onSelect={(time) => {
                        handleChange('time', time);
                        setShowTimeQuickSelect(false);
                      }}
                    />
                  )}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ko zakazuje rezervaciju <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.createdBy}
                  onChange={(e) => handleChange('createdBy', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ukucaj ime ko je zakazao rezervaciju"
                  required
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

      {/* Date Picker Modal */}
      <DatePickerModal
        isOpen={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        onSelect={(date) => handleChange('date', date)}
      />
    </>
  );
}