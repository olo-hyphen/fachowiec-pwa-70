import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// Translation resources
const resources = {
  pl: {
    translation: {
      // Navigation
      'nav.dashboard': 'Dashboard',
      'nav.jobs': 'Zlecenia',
      'nav.calendar': 'Kalendarz',
      'nav.timeTracking': 'Czas pracy',
      'nav.photos': 'Zdjęcia',
      'nav.estimates': 'Kosztorysy',
      'nav.reports': 'Raporty',
      
      // Common
      'common.search': 'Szukaj...',
      'common.add': 'Dodaj',
      'common.edit': 'Edytuj',
      'common.delete': 'Usuń',
      'common.save': 'Zapisz',
      'common.cancel': 'Anuluj',
      'common.confirm': 'Potwierdź',
      'common.loading': 'Ładowanie...',
      'common.error': 'Błąd',
      'common.success': 'Sukces',
      
      // Jobs
      'jobs.title': 'Zlecenia',
      'jobs.addNew': 'Dodaj nowe zlecenie',
      'jobs.client': 'Klient',
      'jobs.address': 'Adres',
      'jobs.status': 'Status',
      'jobs.estimatedHours': 'Szacowane godziny',
      'jobs.cost': 'Koszt',
      'jobs.description': 'Opis',
      
      // Calendar
      'calendar.title': 'Kalendarz',
      'calendar.addJob': 'Dodaj zlecenie',
      'calendar.noJobsForDate': 'Brak zleceń na ten dzień',
      'calendar.jobsCount': '{{count}} zlecenie',
      'calendar.jobsCount_plural': '{{count}} zleceń',
      
      // Status
      'status.pending': 'Oczekujące',
      'status.inProgress': 'W trakcie',
      'status.completed': 'Zakończone',
      'status.cancelled': 'Anulowane',
      
      // Theme
      'theme.light': 'Jasny',
      'theme.dark': 'Ciemny',
      'theme.system': 'System',
      
      // Accessibility
      'a11y.skipToContent': 'Przejdź do treści',
      'a11y.toggleMenu': 'Przełącz menu',
      'a11y.toggleTheme': 'Przełącz motyw',
      'a11y.previousMonth': 'Poprzedni miesiąc',
      'a11y.nextMonth': 'Następny miesiąc',
      'a11y.selectDate': 'Wybierz datę',
      
      // Keyboard shortcuts
      'shortcuts.title': 'Skróty klawiszowe',
      'shortcuts.navigation': 'Nawigacja',
      'shortcuts.global': 'Globalne',
      'shortcuts.dashboard': 'Dashboard (1)',
      'shortcuts.jobs': 'Zlecenia (2)',
      'shortcuts.calendar': 'Kalendarz (3)',
      'shortcuts.timeTracking': 'Czas pracy (4)',
      'shortcuts.photos': 'Zdjęcia (5)',
      'shortcuts.estimates': 'Kosztorysy (6)',
      'shortcuts.reports': 'Raporty (7)',
      'shortcuts.toggleTheme': 'Przełącz motyw (Ctrl+T)',
      'shortcuts.commandPalette': 'Paleta poleceń (Ctrl+K)',
      'shortcuts.addNew': 'Dodaj nowy (Ctrl+N)',
      'shortcuts.focusSearch': 'Fokus na wyszukiwanie (Ctrl+F)',
    }
  },
  en: {
    translation: {
      // Navigation
      'nav.dashboard': 'Dashboard',
      'nav.jobs': 'Jobs',
      'nav.calendar': 'Calendar',
      'nav.timeTracking': 'Time Tracking',
      'nav.photos': 'Photos',
      'nav.estimates': 'Estimates',
      'nav.reports': 'Reports',
      
      // Common
      'common.search': 'Search...',
      'common.add': 'Add',
      'common.edit': 'Edit',
      'common.delete': 'Delete',
      'common.save': 'Save',
      'common.cancel': 'Cancel',
      'common.confirm': 'Confirm',
      'common.loading': 'Loading...',
      'common.error': 'Error',
      'common.success': 'Success',
      
      // Jobs
      'jobs.title': 'Jobs',
      'jobs.addNew': 'Add New Job',
      'jobs.client': 'Client',
      'jobs.address': 'Address',
      'jobs.status': 'Status',
      'jobs.estimatedHours': 'Estimated Hours',
      'jobs.cost': 'Cost',
      'jobs.description': 'Description',
      
      // Calendar
      'calendar.title': 'Calendar',
      'calendar.addJob': 'Add Job',
      'calendar.noJobsForDate': 'No jobs for this date',
      'calendar.jobsCount': '{{count}} job',
      'calendar.jobsCount_plural': '{{count}} jobs',
      
      // Status
      'status.pending': 'Pending',
      'status.inProgress': 'In Progress',
      'status.completed': 'Completed',
      'status.cancelled': 'Cancelled',
      
      // Theme
      'theme.light': 'Light',
      'theme.dark': 'Dark',
      'theme.system': 'System',
      
      // Accessibility
      'a11y.skipToContent': 'Skip to content',
      'a11y.toggleMenu': 'Toggle menu',
      'a11y.toggleTheme': 'Toggle theme',
      'a11y.previousMonth': 'Previous month',
      'a11y.nextMonth': 'Next month',
      'a11y.selectDate': 'Select date',
      
      // Keyboard shortcuts
      'shortcuts.title': 'Keyboard Shortcuts',
      'shortcuts.navigation': 'Navigation',
      'shortcuts.global': 'Global',
      'shortcuts.dashboard': 'Dashboard (1)',
      'shortcuts.jobs': 'Jobs (2)',
      'shortcuts.calendar': 'Calendar (3)',
      'shortcuts.timeTracking': 'Time Tracking (4)',
      'shortcuts.photos': 'Photos (5)',
      'shortcuts.estimates': 'Estimates (6)',
      'shortcuts.reports': 'Reports (7)',
      'shortcuts.toggleTheme': 'Toggle Theme (Ctrl+T)',
      'shortcuts.commandPalette': 'Command Palette (Ctrl+K)',
      'shortcuts.addNew': 'Add New (Ctrl+N)',
      'shortcuts.focusSearch': 'Focus Search (Ctrl+F)',
    }
  }
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'pl', // default language
    fallbackLng: 'pl',
    
    interpolation: {
      escapeValue: false, // React already escapes
    },
    
    // Add pluralization support
    react: {
      useSuspense: false,
    }
  })

export default i18n