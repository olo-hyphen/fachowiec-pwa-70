import { useState } from "react";
import { Search, Plus, Users, Star, Phone, Mail, MapPin } from "lucide-react";
import { Client } from "@/types/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ClientListProps {
  clients: Client[];
  onSelectClient: (client: Client) => void;
  onAddClient: () => void;
}

export function ClientList({ clients, onSelectClient, onAddClient }: ClientListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "rating" | "revenue" | "lastContact">("name");

  const filteredClients = clients
    .filter(client =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.phone?.includes(searchQuery) ||
      client.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "revenue":
          return b.totalRevenue - a.totalRevenue;
        case "lastContact":
          const aDate = a.lastContactDate ? new Date(a.lastContactDate).getTime() : 0;
          const bDate = b.lastContactDate ? new Date(b.lastContactDate).getTime() : 0;
          return bDate - aDate;
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={14}
        className={i < rating ? "fill-warning text-warning" : "text-muted-foreground"}
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Klienci</h1>
            <p className="text-muted-foreground">Zarządzaj bazą klientów</p>
          </div>
        </div>
        <Button onClick={onAddClient} className="gap-2">
          <Plus size={16} />
          Dodaj klienta
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
          <Input
            placeholder="Szukaj klientów..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-3 py-2 border border-input rounded-md bg-background text-foreground"
        >
          <option value="name">Sortuj: Nazwa</option>
          <option value="rating">Sortuj: Ocena</option>
          <option value="revenue">Sortuj: Przychód</option>
          <option value="lastContact">Sortuj: Ostatni kontakt</option>
        </select>
      </div>

      {/* Client Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredClients.map((client) => (
          <Card 
            key={client.id} 
            className="cursor-pointer hover-scale glass-card border-border/50 hover:border-primary/30 transition-all duration-200"
            onClick={() => onSelectClient(client)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {client.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate">{client.name}</h3>
                  
                  <div className="flex items-center gap-1 mt-1">
                    {renderStars(client.rating)}
                    <span className="text-sm text-muted-foreground ml-1">
                      ({client.rating}/5)
                    </span>
                  </div>

                  <div className="mt-3 space-y-2">
                    {client.phone && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone size={12} />
                        <span className="truncate">{client.phone}</span>
                      </div>
                    )}
                    
                    {client.email && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail size={12} />
                        <span className="truncate">{client.email}</span>
                      </div>
                    )}
                    
                    {client.address && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin size={12} />
                        <span className="truncate">{client.address}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="text-sm">
                      <span className="font-medium text-success">
                        {client.totalRevenue.toLocaleString('pl-PL')} zł
                      </span>
                      <span className="text-muted-foreground"> • {client.totalJobs} zleceń</span>
                    </div>
                  </div>

                  {client.tags && client.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {client.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {client.tags.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{client.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredClients.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {clients.length === 0 ? "Brak klientów" : "Brak wyników"}
          </h3>
          <p className="text-muted-foreground mb-4">
            {clients.length === 0 
              ? "Dodaj pierwszego klienta, aby rozpocząć zarządzanie bazą klientów"
              : "Spróbuj zmienić kryteria wyszukiwania"
            }
          </p>
          {clients.length === 0 && (
            <Button onClick={onAddClient} className="gap-2">
              <Plus size={16} />
              Dodaj klienta
            </Button>
          )}
        </div>
      )}
    </div>
  );
}