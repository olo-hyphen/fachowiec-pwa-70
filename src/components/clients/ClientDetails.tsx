import { useState } from "react";
import { ArrowLeft, Edit, Trash2, Phone, Mail, MapPin, Calendar, MessageSquare, TrendingUp, Star } from "lucide-react";
import { Client, Communication } from "@/types/client";
import { Job } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CommunicationHistory } from "./CommunicationHistory";
import { ClientStats } from "./ClientStats";
import { format } from "date-fns";
import { pl } from "date-fns/locale";

interface ClientDetailsProps {
  client: Client;
  jobs: Job[];
  communications: Communication[];
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onAddCommunication: () => void;
}

export function ClientDetails({ 
  client, 
  jobs, 
  communications, 
  onBack, 
  onEdit, 
  onDelete,
  onAddCommunication 
}: ClientDetailsProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={i < rating ? "fill-warning text-warning" : "text-muted-foreground"}
      />
    ));
  };

  const activeJobs = jobs.filter(job => job.status === 'in-progress' || job.status === 'pending');
  const completedJobs = jobs.filter(job => job.status === 'completed');
  const totalRevenue = jobs.reduce((sum, job) => sum + (job.totalCost || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
            <ArrowLeft size={16} />
            Powrót
          </Button>
          <div className="flex items-center gap-3">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-xl">
                {client.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{client.name}</h1>
              <div className="flex items-center gap-1 mt-1">
                {renderStars(client.rating)}
                <span className="text-sm text-muted-foreground ml-1">
                  ({client.rating}/5)
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={onEdit} className="gap-2">
            <Edit size={16} />
            Edytuj
          </Button>
          <Button variant="destructive" onClick={onDelete} className="gap-2">
            <Trash2 size={16} />
            Usuń
          </Button>
        </div>
      </div>

      {/* Contact Info Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {client.phone && (
          <Card className="glass-card border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-info/10 rounded-lg">
                  <Phone className="h-5 w-5 text-info" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Telefon</p>
                  <a 
                    href={`tel:${client.phone}`}
                    className="font-medium text-foreground hover:text-primary transition-colors"
                  >
                    {client.phone}
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {client.email && (
          <Card className="glass-card border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-success/10 rounded-lg">
                  <Mail className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <a 
                    href={`mailto:${client.email}`}
                    className="font-medium text-foreground hover:text-primary transition-colors truncate block"
                  >
                    {client.email}
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {client.address && (
          <Card className="glass-card border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-warning/10 rounded-lg">
                  <MapPin className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Adres</p>
                  <p className="font-medium text-foreground truncate">
                    {client.address}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="glass-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-success/10 rounded-lg">
                <TrendingUp className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Łączny przychód</p>
                <p className="text-xl font-bold text-success">
                  {totalRevenue.toLocaleString('pl-PL')} zł
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Wszystkie zlecenia</p>
                <p className="text-xl font-bold text-foreground">{jobs.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-info/10 rounded-lg">
                <MessageSquare className="h-5 w-5 text-info" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Aktywne zlecenia</p>
                <p className="text-xl font-bold text-foreground">{activeJobs.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/10 rounded-lg">
                <Star className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Średnia wartość</p>
                <p className="text-xl font-bold text-foreground">
                  {client.averageJobValue.toLocaleString('pl-PL')} zł
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="jobs" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="jobs">Zlecenia</TabsTrigger>
          <TabsTrigger value="communications">Komunikacja</TabsTrigger>
          <TabsTrigger value="notes">Notatki</TabsTrigger>
          <TabsTrigger value="stats">Statystyki</TabsTrigger>
        </TabsList>

        <TabsContent value="jobs" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Zlecenia klienta</h3>
            <div className="flex gap-2">
              <Badge variant="outline">{activeJobs.length} aktywnych</Badge>
              <Badge variant="secondary">{completedJobs.length} zakończonych</Badge>
            </div>
          </div>
          
          <div className="space-y-3">
            {jobs.length > 0 ? (
              jobs.map((job) => (
                <Card key={job.id} className="glass-card border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-foreground">{job.title}</h4>
                        <p className="text-sm text-muted-foreground">{job.description}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <Badge 
                            variant={job.status === 'completed' ? 'default' : 'secondary'}
                            className={
                              job.status === 'completed' ? 'bg-success text-success-foreground' :
                              job.status === 'in-progress' ? 'bg-info text-info-foreground' :
                              job.status === 'pending' ? 'bg-warning text-warning-foreground' :
                              'bg-destructive text-destructive-foreground'
                            }
                          >
                            {job.status === 'pending' ? 'Oczekujące' :
                             job.status === 'in-progress' ? 'W trakcie' :
                             job.status === 'completed' ? 'Zakończone' : 'Anulowane'}
                          </Badge>
                          {job.scheduledDate && (
                            <span className="text-sm text-muted-foreground">
                              {format(new Date(job.scheduledDate), 'dd MMM yyyy', { locale: pl })}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-success">
                          {job.totalCost.toLocaleString('pl-PL')} zł
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {job.estimatedHours}h • {job.hourlyRate} zł/h
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="glass-card border-border/50">
                <CardContent className="p-8 text-center">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Brak zleceń dla tego klienta</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="communications">
          <CommunicationHistory 
            communications={communications} 
            onAddCommunication={onAddCommunication}
          />
        </TabsContent>

        <TabsContent value="notes" className="space-y-4">
          <Card className="glass-card border-border/50">
            <CardHeader>
              <CardTitle>Notatki o kliencie</CardTitle>
            </CardHeader>
            <CardContent>
              {client.notes ? (
                <p className="text-foreground whitespace-pre-wrap">{client.notes}</p>
              ) : (
                <p className="text-muted-foreground italic">Brak notatek</p>
              )}
            </CardContent>
          </Card>

          {client.tags && client.tags.length > 0 && (
            <Card className="glass-card border-border/50">
              <CardHeader>
                <CardTitle>Tagi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {client.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="stats">
          <ClientStats client={client} jobs={jobs} communications={communications} />
        </TabsContent>
      </Tabs>
    </div>
  );
}