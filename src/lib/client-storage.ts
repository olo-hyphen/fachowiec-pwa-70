import { Client, Communication, MessageTemplate, ClientStats } from '@/types/client';
import { getJobs } from './storage';

// Storage keys
const CLIENT_STORAGE_KEYS = {
  CLIENTS: 'fachowiec_clients',
  COMMUNICATIONS: 'fachowiec_communications',
  MESSAGE_TEMPLATES: 'fachowiec_message_templates',
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

// Clients
export function getClients(): Client[] {
  return getFromStorage<Client>(CLIENT_STORAGE_KEYS.CLIENTS);
}

export function getClientById(clientId: string): Client | undefined {
  return getClients().find(client => client.id === clientId);
}

export function saveClient(client: Client): void {
  const clients = getClients();
  const existingIndex = clients.findIndex(c => c.id === client.id);
  
  if (existingIndex >= 0) {
    clients[existingIndex] = { ...client, updatedAt: new Date().toISOString() };
  } else {
    clients.push(client);
  }
  
  saveToStorage(CLIENT_STORAGE_KEYS.CLIENTS, clients);
}

export function deleteClient(clientId: string): void {
  const clients = getClients().filter(c => c.id !== clientId);
  saveToStorage(CLIENT_STORAGE_KEYS.CLIENTS, clients);
  
  // Also delete related communications
  const communications = getCommunications().filter(c => c.clientId !== clientId);
  saveToStorage(CLIENT_STORAGE_KEYS.COMMUNICATIONS, communications);
}

export function updateClientStats(clientId: string): void {
  const client = getClientById(clientId);
  if (!client) return;

  const jobs = getJobs().filter(job => job.clientName === client.name);
  const totalJobs = jobs.length;
  const totalRevenue = jobs.reduce((sum, job) => sum + (job.totalCost || 0), 0);
  const averageJobValue = totalJobs > 0 ? totalRevenue / totalJobs : 0;

  const updatedClient: Client = {
    ...client,
    totalJobs,
    totalRevenue,
    averageJobValue,
    updatedAt: new Date().toISOString()
  };

  saveClient(updatedClient);
}

// Communications
export function getCommunications(): Communication[] {
  return getFromStorage<Communication>(CLIENT_STORAGE_KEYS.COMMUNICATIONS);
}

export function getCommunicationsByClientId(clientId: string): Communication[] {
  return getCommunications().filter(comm => comm.clientId === clientId);
}

export function saveCommunication(communication: Communication): void {
  const communications = getCommunications();
  const existingIndex = communications.findIndex(c => c.id === communication.id);
  
  if (existingIndex >= 0) {
    communications[existingIndex] = communication;
  } else {
    communications.push(communication);
  }
  
  saveToStorage(CLIENT_STORAGE_KEYS.COMMUNICATIONS, communications);
  
  // Update client's last contact date
  if (communication.isCompleted && communication.completedDate) {
    const client = getClientById(communication.clientId);
    if (client) {
      const updatedClient = { ...client, lastContactDate: communication.completedDate };
      saveClient(updatedClient);
    }
  }
}

export function deleteCommunication(communicationId: string): void {
  const communications = getCommunications().filter(c => c.id !== communicationId);
  saveToStorage(CLIENT_STORAGE_KEYS.COMMUNICATIONS, communications);
}

// Message Templates
export function getMessageTemplates(): MessageTemplate[] {
  return getFromStorage<MessageTemplate>(CLIENT_STORAGE_KEYS.MESSAGE_TEMPLATES);
}

export function saveMessageTemplate(template: MessageTemplate): void {
  const templates = getMessageTemplates();
  const existingIndex = templates.findIndex(t => t.id === template.id);
  
  if (existingIndex >= 0) {
    templates[existingIndex] = { ...template, updatedAt: new Date().toISOString() };
  } else {
    templates.push(template);
  }
  
  saveToStorage(CLIENT_STORAGE_KEYS.MESSAGE_TEMPLATES, templates);
}

export function deleteMessageTemplate(templateId: string): void {
  const templates = getMessageTemplates().filter(t => t.id !== templateId);
  saveToStorage(CLIENT_STORAGE_KEYS.MESSAGE_TEMPLATES, templates);
}

// Client Statistics
export function getClientStats(): ClientStats {
  const clients = getClients();
  const communications = getCommunications();
  
  const totalClients = clients.length;
  const averageRating = clients.length > 0 
    ? clients.reduce((sum, client) => sum + client.rating, 0) / clients.length 
    : 0;
  const totalRevenue = clients.reduce((sum, client) => sum + client.totalRevenue, 0);
  const topClients = clients
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 5);
  const recentCommunications = communications
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10);

  return {
    totalClients,
    averageRating,
    totalRevenue,
    topClients,
    recentCommunications
  };
}

// Create client from job data
export function createClientFromJob(clientName: string, clientPhone?: string, clientEmail?: string, address?: string): Client {
  const existingClient = getClients().find(c => c.name === clientName);
  if (existingClient) {
    return existingClient;
  }

  const newClient: Client = {
    id: crypto.randomUUID(),
    name: clientName,
    phone: clientPhone,
    email: clientEmail,
    address,
    rating: 5, // Default rating
    totalJobs: 0,
    totalRevenue: 0,
    averageJobValue: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: []
  };

  saveClient(newClient);
  return newClient;
}

// Initialize with sample templates
export function initializeSampleTemplates(): void {
  const templates = getMessageTemplates();
  if (templates.length === 0) {
    const sampleTemplates: MessageTemplate[] = [
      {
        id: '1',
        name: 'Potwierdzenie zlecenia',
        subject: 'Potwierdzenie zlecenia - {jobTitle}',
        content: 'Dzień dobry {clientName},\n\nDziękuję za zlecenie "{jobTitle}". Potwierdzam przyjęcie zlecenia na {scheduledDate}.\n\nSerdecznie pozdrawiam',
        type: 'email',
        variables: ['clientName', 'jobTitle', 'scheduledDate'],
        category: 'Potwierdzenia',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Przypomnienie o terminie',
        content: 'Dzień dobry {clientName}, przypominam o jutrzejszym terminie realizacji zlecenia "{jobTitle}". Do zobaczenia!',
        type: 'sms',
        variables: ['clientName', 'jobTitle'],
        category: 'Przypomnienia',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '3',
        name: 'Zakończenie prac',
        subject: 'Zakończenie prac - {jobTitle}',
        content: 'Dzień dobry {clientName},\n\nInformuję o zakończeniu prac "{jobTitle}". Łączny koszt wynosi {totalCost} zł.\n\nDziękuję za zaufanie!',
        type: 'email',
        variables: ['clientName', 'jobTitle', 'totalCost'],
        category: 'Zakończenie',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    
    sampleTemplates.forEach(template => saveMessageTemplate(template));
  }
}