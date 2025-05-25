const STORAGE_KEY = 'restaurant_reservations';

// Sačuvaj podatke u localStorage
export const saveToLocalStorage = (data) => {
  try {
    const dataString = JSON.stringify(data);
    localStorage.setItem(STORAGE_KEY, dataString);
    return true;
  } catch (error) {
    console.error('Greška pri čuvanju u localStorage:', error);
    
    // Proveri da li je problem sa prostorom
    if (error.name === 'QuotaExceededError') {
      alert('Nema dovoljno prostora za čuvanje podataka. Molimo napravite backup i obrišite stare rezervacije.');
    } else {
      alert('Greška pri čuvanju podataka.');
    }
    return false;
  }
};

// Učitaj podatke iz localStorage
export const loadFromLocalStorage = () => {
  try {
    const dataString = localStorage.getItem(STORAGE_KEY);
    if (!dataString) {
      return [];
    }
    
    const data = JSON.parse(dataString);
    
    // Validacija da li su podaci array
    if (!Array.isArray(data)) {
      console.warn('Podaci u localStorage nisu validni array, vraćam prazan niz');
      return [];
    }
    
    return data;
  } catch (error) {
    console.error('Greška pri učitavanju iz localStorage:', error);
    
    // Ako su podaci corrupted, vrati prazan niz
    console.warn('Podaci u localStorage su oštećeni, vraćam prazan niz');
    return [];
  }
};

// Obriši sve podatke iz localStorage
export const clearLocalStorage = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Greška pri brisanju localStorage:', error);
    return false;
  }
};

// Proveri da li je localStorage dostupan
export const isLocalStorageAvailable = () => {
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (error) {
    return false;
  }
};

// Dobij informacije o korišćenom prostoru
export const getStorageInfo = () => {
  if (!isLocalStorageAvailable()) {
    return {
      available: false,
      used: 0,
      remaining: 0
    };
  }

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    const usedBytes = data ? new Blob([data]).size : 0;
    
    // Prosečna veličina localStorage je oko 5-10MB
    const estimatedLimit = 5 * 1024 * 1024; // 5MB
    
    return {
      available: true,
      used: usedBytes,
      remaining: estimatedLimit - usedBytes,
      usedMB: (usedBytes / (1024 * 1024)).toFixed(2),
      remainingMB: ((estimatedLimit - usedBytes) / (1024 * 1024)).toFixed(2)
    };
  } catch (error) {
    console.error('Greška pri dobijanju info o storage:', error);
    return {
      available: true,
      used: 0,
      remaining: 0,
      error: true
    };
  }
};

// Backup funkcije
export const createBackupData = (reservations) => {
  const backupData = {
    reservations,
    exportDate: new Date().toISOString(),
    version: '1.0',
    totalReservations: reservations.length
  };
  
  return JSON.stringify(backupData, null, 2);
};

export const parseBackupData = (backupString) => {
  try {
    const backupData = JSON.parse(backupString);
    
    // Proveri da li je novi format sa metadata
    if (backupData.reservations && Array.isArray(backupData.reservations)) {
      return {
        success: true,
        reservations: backupData.reservations,
        metadata: {
          exportDate: backupData.exportDate,
          version: backupData.version,
          totalReservations: backupData.totalReservations
        }
      };
    }
    
    // Stari format - direktno array
    if (Array.isArray(backupData)) {
      return {
        success: true,
        reservations: backupData,
        metadata: {
          exportDate: null,
          version: 'legacy',
          totalReservations: backupData.length
        }
      };
    }
    
    return {
      success: false,
      error: 'Nepoznat format backup fajla'
    };
    
  } catch (error) {
    return {
      success: false,
      error: 'Greška pri čitanju backup fajla: ' + error.message
    };
  }
};