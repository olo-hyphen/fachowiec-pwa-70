import { useState, useEffect } from "react";
import { Client, Communication, MessageTemplate } from "@/types/client";
import { getJobs } from "@/lib/storage";
import { 
  getClients, 
  saveClient, 
  deleteClient, 
  getCommunications,
  saveCommunication,
  deleteCommunication,
  getMessageTemplates,
  saveMessageTemplate,
  deleteMessageTemplate,
  createClientFromJob,
  updateClientStats,
  initializeSampleTemplates
} from "@/lib/client-storage";
import { ClientList } from "@/components/clients/ClientList";
import { ClientDetails } from "@/components/clients/ClientDetails";
import { ClientForm } from "@/components/clients/ClientForm";
import { MessageTemplates } from "@/components/clients/MessageTemplates";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

type View = 'list' | 'details' | 'form' | 'templates';

export default function Clients() {
  const [view, setView] = useState<View>('list');
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [messageTemplates, setMessageTemplates] = useState<MessageTemplate[]>([]);
  const [activeTab, setActiveTab] = useState('clients');

  // Load data
  useEffect(() => {
    loadData();
    initializeSampleTemplates();
    syncClientsFromJobs();
  }, []);

  const loadData = () => {
    setClients(getClients());
    setCommunications(getCommunications());
    setMessageTemplates(getMessageTemplates());
  };

  const syncClientsFromJobs = () => {
    const jobs = getJobs();
    const existingClients = getClients();
    
    jobs.forEach(job => {
      const existingClient = existingClients.find(c => c.name === job.clientName);
      if (!existingClient) {
        createClientFromJob(job.clientName, job.clientPhone, job.clientEmail, job.address);
      }
    });

    // Update stats for all clients
    existingClients.forEach(client => {
      updateClientStats(client.id);
    });

    loadData();
  };

  // Client handlers
  const handleSelectClient = (client: Client) => {
    setSelectedClient(client);
    setView('details');
  };

  const handleAddClient = () => {
    setEditingClient(null);
    setView('form');
  };

  const handleEditClient = () => {
    setEditingClient(selectedClient);
    setView('form');
  };

  const handleSaveClient = (clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    
    if (editingClient) {
      const updatedClient: Client = {
        ...editingClient,
        ...clientData,
        updatedAt: now
      };
      saveClient(updatedClient);
      setSelectedClient(updatedClient);
      toast.success("Klient został zaktualizowany");
    } else {
      const newClient: Client = {
        id: crypto.randomUUID(),
        ...clientData,
        createdAt: now,
        updatedAt: now
      };
      saveClient(newClient);
      setSelectedClient(newClient);
      toast.success("Klient został dodany");
    }
    
    loadData();
    setView('details');
  };

  const handleDeleteClient = () => {
    if (!selectedClient) return;
    
    if (confirm(`Czy na pewno chcesz usunąć klienta "${selectedClient.name}"?`)) {
      deleteClient(selectedClient.id);
      setSelectedClient(null);
      loadData();
      setView('list');
      toast.success("Klient został usunięty");
    }
  };

  const handleBack = () => {
    if (view === 'details') {
      setView('list');
      setSelectedClient(null);
    } else if (view === 'form') {
      if (selectedClient) {
        setView('details');
      } else {
        setView('list');
      }
    }
  };

  // Communication handlers
  const handleAddCommunication = () => {
    if (!selectedClient) return;
    
    const newCommunication: Communication = {
      id: crypto.randomUUID(),
      clientId: selectedClient.id,
      type: 'phone',
      content: '',
      isCompleted: false,
      createdAt: new Date().toISOString()
    };
    
    saveCommunication(newCommunication);
    loadData();
    toast.success("Komunikacja została dodana");
  };

  // Template handlers
  const handleAddTemplate = (templateData: Omit<MessageTemplate, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newTemplate: MessageTemplate = {
      id: crypto.randomUUID(),
      ...templateData,
      createdAt: now,
      updatedAt: now
    };
    
    saveMessageTemplate(newTemplate);
    loadData();
    toast.success("Szablon został dodany");
  };

  const handleEditTemplate = (template: MessageTemplate) => {
    saveMessageTemplate(template);
    loadData();
    toast.success("Szablon został zaktualizowany");
  };

  const handleDeleteTemplate = (templateId: string) => {
    if (confirm("Czy na pewno chcesz usunąć ten szablon?")) {
      deleteMessageTemplate(templateId);
      loadData();
      toast.success("Szablon został usunięty");
    }
  };

  const handleUseTemplate = (template: MessageTemplate) => {
    // This would open a communication dialog with the template content
    toast.info("Funkcja używania szablonu w przygotowaniu");
  };

  // Get client-specific data
  const getClientJobs = () => {
    if (!selectedClient) return [];
    return getJobs().filter(job => job.clientName === selectedClient.name);
  };

  const getClientCommunications = () => {
    if (!selectedClient) return [];
    return communications.filter(comm => comm.clientId === selectedClient.id);
  };

  if (activeTab === 'templates') {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="clients">Klienci</TabsTrigger>
            <TabsTrigger value="templates">Szablony</TabsTrigger>
          </TabsList>
          
          <TabsContent value="templates" className="mt-6">
            <MessageTemplates
              templates={messageTemplates}
              onAddTemplate={handleAddTemplate}
              onEditTemplate={handleEditTemplate}
              onDeleteTemplate={handleDeleteTemplate}
              onUseTemplate={handleUseTemplate}
            />
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="clients">Klienci</TabsTrigger>
          <TabsTrigger value="templates">Szablony</TabsTrigger>
        </TabsList>
        
        <TabsContent value="clients" className="mt-6">
          {view === 'list' && (
            <ClientList
              clients={clients}
              onSelectClient={handleSelectClient}
              onAddClient={handleAddClient}
            />
          )}

          {view === 'details' && selectedClient && (
            <ClientDetails
              client={selectedClient}
              jobs={getClientJobs()}
              communications={getClientCommunications()}
              onBack={handleBack}
              onEdit={handleEditClient}
              onDelete={handleDeleteClient}
              onAddCommunication={handleAddCommunication}
            />
          )}

          {view === 'form' && (
            <ClientForm
              client={editingClient}
              onSave={handleSaveClient}
              onCancel={handleBack}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}