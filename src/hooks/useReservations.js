'use client';

import { useState, useEffect } from 'react';
import { saveToLocalStorage, loadFromLocalStorage, clearLocalStorage } from '@/lib/localStorage';

export function useReservations() {
  const [reservations, setReservations] = useState([]);

  // Učitaj podatke iz localStorage pri pokretanju
  useEffect(() => {
    const savedReservations = loadFromLocalStorage();
    if (savedReservations) {
      setReservations(savedReservations);
    }
  }, []);

  // Sačuvaj u localStorage kad se promene rezervacije
  useEffect(() => {
    saveToLocalStorage(reservations);
  }, [reservations]);

  // Dodaj novu rezervaciju
  const addReservation = (reservation) => {
    setReservations(prev => [...prev, reservation]);
  };

  // Obriši rezervaciju
  const deleteReservation = (id) => {
    setReservations(prev => prev.filter(res => res.id !== id));
  };

  // Ažuriraj rezervaciju
  const updateReservation = (id, updatedData) => {
    setReservations(prev => 
      prev.map(res => 
        res.id === id ? { ...res, ...updatedData } : res
      )
    );
  };

  // Filtriraj rezervacije za određeni dan
  const getReservationsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return reservations.filter(res => res.date === dateStr)
      .sort((a, b) => a.time.localeCompare(b.time));
  };

  // Export podataka u JSON fajl
  const exportData = () => {
    const dataStr = JSON.stringify(reservations, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `rezervacije_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  // Import podataka iz JSON fajla
  const importData = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        if (Array.isArray(importedData)) {
          setReservations(importedData);
          alert(`Uspešno učitano ${importedData.length} rezervacija!`);
        } else {
          alert('Neispravan format fajla!');
        }
      } catch (error) {
        alert('Greška pri čitanju fajla!');
      }
    };
    reader.readAsText(file);
    event.target.value = ''; // Reset input
  };

  // Resetuj sve podatke
  const resetAllData = () => {
    if (confirm('Da li ste sigurni da želite da obrišete SVE rezervacije? Ova akcija se ne može poništiti!')) {
      setReservations([]);
      clearLocalStorage();
      alert('Svi podaci su obrisani!');
    }
  };

  // Statistike
  const getStats = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayReservations = reservations.filter(res => res.date === today);
    
    return {
      total: reservations.length,
      today: todayReservations.length,
      upcoming: reservations.filter(res => res.date > today).length,
      birthdays: reservations.filter(res => res.type === 'birthday').length
    };
  };

  return {
    reservations,
    addReservation,
    deleteReservation,
    updateReservation,
    getReservationsForDate,
    exportData,
    importData,
    resetAllData,
    getStats
  };
}