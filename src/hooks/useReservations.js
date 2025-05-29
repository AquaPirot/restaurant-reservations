'use client';

import { useState, useEffect } from 'react';

export function useReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Učitaj rezervacije iz baze
  const fetchReservations = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/reservations');
      if (!response.ok) {
        throw new Error('Greška pri učitavanju rezervacija');
      }
      const data = await response.json();
      setReservations(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Greška:', err);
    } finally {
      setLoading(false);
    }
  };

  // Učitaj rezervacije pri prvom pokretanju
  useEffect(() => {
    fetchReservations();
  }, []);

  // Dodaj novu rezervaciju
  const addReservation = async (reservationData) => {
    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reservationData),
      });

      if (!response.ok) {
        throw new Error('Greška pri dodavanju rezervacije');
      }

      const newReservation = await response.json();
      setReservations(prev => [...prev, newReservation]);
      return newReservation;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Obriši rezervaciju
  const deleteReservation = async (id) => {
    try {
      const response = await fetch(`/api/reservations?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Greška pri brisanju rezervacije');
      }

      setReservations(prev => prev.filter(res => res.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Filtriraj rezervacije za određeni dan
  const getReservationsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return reservations
      .filter(res => res.date === dateStr)
      .sort((a, b) => a.time.localeCompare(b.time));
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
    loading,
    error,
    addReservation,
    deleteReservation,
    getReservationsForDate,
    getStats,
    refetch: fetchReservations
  };
}