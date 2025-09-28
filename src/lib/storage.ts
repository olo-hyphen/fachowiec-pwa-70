import { Job, TimeEntry, Photo } from '@/types';

// Storage keys
const STORAGE_KEYS = {
  JOBS: 'fachowiec_jobs',
  TIME_ENTRIES: 'fachowiec_time_entries',
  PHOTOS: 'fachowiec_photos',
} as const;

// Generic storage functions
function getFromStorage<T>(key: string): T[] {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(`Error reading from storage (${key}):`, error);
    return [];
  }
}

function saveToStorage<T>(key: string, data: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving to storage (${key}):`, error);
  }
}

// Jobs
export function getJobs(): Job[] {
  return getFromStorage<Job>(STORAGE_KEYS.JOBS);
}

export function saveJob(job: Job): void {
  const jobs = getJobs();
  const existingIndex = jobs.findIndex(j => j.id === job.id);
  
  if (existingIndex >= 0) {
    jobs[existingIndex] = { ...job, updatedAt: new Date().toISOString() };
  } else {
    jobs.push(job);
  }
  
  saveToStorage(STORAGE_KEYS.JOBS, jobs);
  
  // Update client stats if client exists
  try {
    const { createClientFromJob, updateClientStats } = require('./client-storage');
    if (job.clientName) {
      const client = createClientFromJob(job.clientName, job.clientPhone, job.clientEmail, job.address);
      updateClientStats(client.id);
    }
  } catch (error) {
    // Client storage not available yet, ignore
  }
}

export function deleteJob(jobId: string): void {
  const jobs = getJobs().filter(j => j.id !== jobId);
  saveToStorage(STORAGE_KEYS.JOBS, jobs);
  
  // Also delete related time entries and photos
  const timeEntries = getTimeEntries().filter(t => t.jobId !== jobId);
  saveToStorage(STORAGE_KEYS.TIME_ENTRIES, timeEntries);
  
  const photos = getPhotos().filter(p => p.jobId !== jobId);
  saveToStorage(STORAGE_KEYS.PHOTOS, photos);
}

// Time Entries
export function getTimeEntries(): TimeEntry[] {
  return getFromStorage<TimeEntry>(STORAGE_KEYS.TIME_ENTRIES);
}

export function saveTimeEntry(timeEntry: TimeEntry): void {
  const timeEntries = getTimeEntries();
  const existingIndex = timeEntries.findIndex(t => t.id === timeEntry.id);
  
  if (existingIndex >= 0) {
    timeEntries[existingIndex] = timeEntry;
  } else {
    timeEntries.push(timeEntry);
  }
  
  saveToStorage(STORAGE_KEYS.TIME_ENTRIES, timeEntries);
}

export function deleteTimeEntry(entryId: string): void {
  const timeEntries = getTimeEntries().filter(t => t.id !== entryId);
  saveToStorage(STORAGE_KEYS.TIME_ENTRIES, timeEntries);
}

// Photos
export function getPhotos(): Photo[] {
  return getFromStorage<Photo>(STORAGE_KEYS.PHOTOS);
}

export function savePhoto(photo: Photo): void {
  const photos = getPhotos();
  photos.push(photo);
  saveToStorage(STORAGE_KEYS.PHOTOS, photos);
}

export function deletePhoto(photoId: string): void {
  const photos = getPhotos().filter(p => p.id !== photoId);
  saveToStorage(STORAGE_KEYS.PHOTOS, photos);
}

// Initialize with sample data if empty
export function initializeSampleData(): void {
  const jobs = getJobs();
  if (jobs.length === 0) {
    const sampleJobs: Job[] = [
      {
        id: '1',
        title: 'Remont łazienki',
        description: 'Kompleksowy remont łazienki - wymiana glazury, armatura, sanitariaty',
        status: 'in-progress',
        clientName: 'Jan Kowalski',
        clientPhone: '+48 123 456 789',
        clientEmail: 'jan@example.com',
        address: 'ul. Przykładowa 15, Warszawa',
        estimatedHours: 40,
        hourlyRate: 80,
        totalCost: 3200,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
        category: 'Hydraulika',
        tags: ['remont', 'łazienka', 'glazura']
      },
      {
        id: '2',
        title: 'Malowanie mieszkania',
        description: 'Malowanie wszystkich pomieszczeń w mieszkaniu 3-pokojowym',
        status: 'completed',
        clientName: 'Anna Nowak',
        clientPhone: '+48 987 654 321',
        address: 'ul. Testowa 8/12, Kraków',
        estimatedHours: 24,
        hourlyRate: 60,
        totalCost: 1440,
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        category: 'Malarstwo',
        tags: ['malowanie', 'mieszkanie']
      },
      {
        id: '3',
        title: 'Naprawa instalacji elektrycznej',
        description: 'Wymiana uszkodzonej instalacji elektrycznej w kuchni',
        status: 'pending',
        clientName: 'Piotr Wiśniewski',
        clientPhone: '+48 555 123 456',
        address: 'ul. Elektryczna 3, Gdańsk',
        estimatedHours: 8,
        hourlyRate: 100,
        totalCost: 800,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        category: 'Elektryka',
        tags: ['naprawa', 'instalacja', 'kuchnia']
      }
    ];
    
    sampleJobs.forEach(job => saveJob(job));
    
    // Sample time entries
    const sampleTimeEntries: TimeEntry[] = [
      {
        id: '1',
        jobId: '1',
        startTime: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        duration: 120,
        description: 'Demontaż starej glazury',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        jobId: '2',
        startTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000).toISOString(),
        duration: 480,
        description: 'Malowanie pokoju dziennego',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
    
    sampleTimeEntries.forEach(entry => saveTimeEntry(entry));
  }
}