// Formatiranje datuma za srpski jezik  
export const formatDate = (date, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options
  };
  
  return new Date(date).toLocaleDateString('sr-RS', defaultOptions);
};

// Formatiranje vremena
export const formatTime = (timeString) => {
  if (!timeString) return '';
  
  // Ako je već u HH:MM formatu
  if (timeString.includes(':')) {
    return timeString;
  }
  
  // Konvertuj iz drugih formata ako treba
  return timeString;
};

// Generiši narednih N dana
export const getNextDays = (numberOfDays = 7) => {
  const days = [];
  for (let i = 0; i < numberOfDays; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    days.push(date);
  }
  return days;
};

// Proveri da li je datum danas
export const isToday = (date) => {
  const today = new Date();
  const checkDate = new Date(date);
  
  return checkDate.toDateString() === today.toDateString();
};

// Proveri da li je datum u prošlosti
export const isPastDate = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);
  
  return checkDate < today;
};

// Proveri da li je datum u budućnosti
export const isFutureDate = (date) => {
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  
  const checkDate = new Date(date);
  
  return checkDate > today;
};

// Sortiranje rezervacija po vremenu
export const sortReservationsByTime = (reservations) => {
  return [...reservations].sort((a, b) => {
    return a.time.localeCompare(b.time);
  });
};

// Filtriraj rezervacije po datumu
export const filterReservationsByDate = (reservations, date) => {
  const dateStr = new Date(date).toISOString().split('T')[0];
  return reservations.filter(res => res.date === dateStr);
};

// Grupiši rezervacije po danima
export const groupReservationsByDate = (reservations) => {
  const grouped = {};
  
  reservations.forEach(reservation => {
    const date = reservation.date;
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(reservation);
  });
  
  // Sortiraj rezervacije u svakom danu po vremenu
  Object.keys(grouped).forEach(date => {
    grouped[date] = sortReservationsByTime(grouped[date]);
  });
  
  return grouped;
};

// Validacija rezervacije
export const validateReservation = (reservation) => {
  const errors = [];
  
  if (!reservation.name || reservation.name.trim().length < 2) {
    errors.push('Ime mora imati najmanje 2 karaktera');
  }
  
  if (!reservation.phone || reservation.phone.trim().length < 6) {
    errors.push('Telefon mora imati najmanje 6 cifara');
  }
  
  if (!reservation.date) {
    errors.push('Datum je obavezan');
  } else if (isPastDate(reservation.date)) {
    errors.push('Datum ne može biti u prošlosti');
  }
  
  if (!reservation.time) {
    errors.push('Vreme je obavezno');
  }
  
  if (!reservation.guests || reservation.guests < 1 || reservation.guests > 50) {
    errors.push('Broj gostiju mora biti između 1 i 50');
  }
  
  if (reservation.tableNumber && (reservation.tableNumber < 1 || reservation.tableNumber > 100)) {
    errors.push('Broj stola mora biti između 1 i 100');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Formatiraj telefon
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  
  // Ukloni sve što nije broj
  const cleaned = phone.replace(/\D/g, '');
  
  // Formatiraj za srpske brojeve
  if (cleaned.length === 9 && cleaned.startsWith('6')) {
    return `0${cleaned.slice(0, 2)}/${cleaned.slice(2, 5)}-${cleaned.slice(5)}`;
  }
  
  if (cleaned.length === 10 && cleaned.startsWith('06')) {
    return `${cleaned.slice(0, 3)}/${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  // Vrati originalni ako ne možemo da formatiramo
  return phone;
};

// Generiši ID za rezervaciju
export const generateReservationId = () => {
  return `res_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Statistike rezervacija
export const calculateReservationStats = (reservations) => {
  const today = new Date().toISOString().split('T')[0];
  const thisMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  
  return {
    total: reservations.length,
    today: reservations.filter(r => r.date === today).length,
    thisMonth: reservations.filter(r => r.date.startsWith(thisMonth)).length,
    upcoming: reservations.filter(r => r.date > today).length,
    past: reservations.filter(r => r.date < today).length,
    birthdays: reservations.filter(r => r.type === 'birthday').length,
    standard: reservations.filter(r => r.type === 'standard').length,
    avgGuestsPerReservation: reservations.length > 0 
      ? Math.round(reservations.reduce((sum, r) => sum + r.guests, 0) / reservations.length * 10) / 10
      : 0
  };
};

// Export utility za različite formate
export const exportFormats = {
  json: (data, filename = 'rezervacije') => {
    const dataStr = JSON.stringify(data, null, 2);
    downloadFile(dataStr, `${filename}.json`, 'application/json');
  },
  
  csv: (reservations, filename = 'rezervacije') => {
    const headers = ['Ime', 'Telefon', 'Datum', 'Vreme', 'Gosti', 'Sto', 'Tip', 'Napomene', 'Kreirao'];
    const csvContent = [
      headers.join(','),
      ...reservations.map(r => [
        `"${r.name}"`,
        `"${r.phone}"`,
        r.date,
        r.time,
        r.guests,
        r.tableNumber || '',
        r.type,
        `"${r.notes || ''}"`,
        `"${r.createdBy}"`
      ].join(','))
    ].join('\n');
    
    downloadFile(csvContent, `${filename}.csv`, 'text/csv');
  }
};

// Helper za download fajlova
const downloadFile = (content, filename, mimeType) => {
  const blob = new Blob([content], { type: mimeType });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
};