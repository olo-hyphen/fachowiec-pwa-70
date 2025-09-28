import { useState } from "react";
import { ArrowLeft, Save, Star } from "lucide-react";
import { Client } from "@/types/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ClientFormProps {
  client?: Client;
  onSave: (client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export function ClientForm({ client, onSave, onCancel }: ClientFormProps) {
  const [formData, setFormData] = useState({
    name: client?.name || '',
    phone: client?.phone || '',
    email: client?.email || '',
    address: client?.address || '',
    notes: client?.notes || '',
    rating: client?.rating || 5,
    preferredContactMethod: client?.preferredContactMethod || 'phone' as const,
    tags: client?.tags || [],
    totalJobs: client?.totalJobs || 0,
    totalRevenue: client?.totalRevenue || 0,
    averageJobValue: client?.averageJobValue || 0,
    lastContactDate: client?.lastContactDate || '',
    nextContactReminder: client?.nextContactReminder || ''
  });

  const [newTag, setNewTag] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    onSave(formData);
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={24}
        className={`cursor-pointer transition-colors ${
          i < rating ? "fill-warning text-warning" : "text-muted-foreground hover:text-warning"
        }`}
        onClick={() => setFormData(prev => ({ ...prev, rating: i + 1 }))}
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onCancel} className="gap-2">
            <ArrowLeft size={16} />
            Powrót
          </Button>
          <h1 className="text-2xl font-bold text-foreground">
            {client ? 'Edytuj klienta' : 'Dodaj klienta'}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Podstawowe informacje */}
          <Card className="glass-card border-border/50">
            <CardHeader>
              <CardTitle>Podstawowe informacje</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nazwa klienta *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="np. Jan Kowalski"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rating">Ocena klienta</Label>
                <div className="flex items-center gap-1">
                  {renderStars(formData.rating)}
                  <span className="ml-2 text-sm text-muted-foreground">
                    ({formData.rating}/5)
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="preferredContactMethod">Preferowany kontakt</Label>
                <Select
                  value={formData.preferredContactMethod}
                  onValueChange={(value: any) => setFormData(prev => ({ 
                    ...prev, 
                    preferredContactMethod: value 
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="phone">Telefon</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="meeting">Spotkanie</SelectItem>
                    <SelectItem value="other">Inne</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Kontakt */}
          <Card className="glass-card border-border/50">
            <CardHeader>
              <CardTitle>Informacje kontaktowe</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Telefon</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="np. +48 123 456 789"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="np. jan@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Adres</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="np. ul. Przykładowa 15, Warszawa"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notatki i tagi */}
        <Card className="glass-card border-border/50">
          <CardHeader>
            <CardTitle>Dodatkowe informacje</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="notes">Notatki</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Dodatkowe informacje o kliencie, preferencje, uwagi..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label>Tagi</Label>
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Dodaj tag..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                />
                <Button type="button" variant="outline" onClick={addTag}>
                  Dodaj
                </Button>
              </div>
              
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag) => (
                    <Badge 
                      key={tag} 
                      variant="secondary" 
                      className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => removeTag(tag)}
                    >
                      {tag} ×
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Przypomnienia */}
        <Card className="glass-card border-border/50">
          <CardHeader>
            <CardTitle>Przypomnienia</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nextContactReminder">Następny kontakt</Label>
              <Input
                id="nextContactReminder"
                type="datetime-local"
                value={formData.nextContactReminder}
                onChange={(e) => setFormData(prev => ({ ...prev, nextContactReminder: e.target.value }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Buttons */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Anuluj
          </Button>
          <Button type="submit" className="gap-2">
            <Save size={16} />
            {client ? 'Zapisz zmiany' : 'Dodaj klienta'}
          </Button>
        </div>
      </form>
    </div>
  );
}