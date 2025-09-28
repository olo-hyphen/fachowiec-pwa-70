export type CommunicationType = 'phone' | 'email' | 'meeting' | 'sms' | 'other';

export interface Client {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  notes?: string;
  rating: number; // 1-5 stars
  totalJobs: number;
  totalRevenue: number;
  averageJobValue: number;
  lastContactDate?: string;
  nextContactReminder?: string;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  preferredContactMethod?: CommunicationType;
}

export interface Communication {
  id: string;
  clientId: string;
  type: CommunicationType;
  subject?: string;
  content: string;
  scheduledDate?: string;
  completedDate?: string;
  createdAt: string;
  isCompleted: boolean;
}

export interface MessageTemplate {
  id: string;
  name: string;
  subject?: string;
  content: string;
  type: CommunicationType;
  variables: string[]; // Variables like {clientName}, {jobTitle}, etc.
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClientStats {
  totalClients: number;
  averageRating: number;
  totalRevenue: number;
  topClients: Client[];
  recentCommunications: Communication[];
}