import { useState } from "react";
import { Plus, Edit, Trash2, Copy, Mail, Phone, MessageSquare, User } from "lucide-react";
import { MessageTemplate, CommunicationType } from "@/types/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

interface MessageTemplatesProps {
  templates: MessageTemplate[];
  onAddTemplate: (template: Omit<MessageTemplate, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onEditTemplate: (template: MessageTemplate) => void;
  onDeleteTemplate: (templateId: string) => void;
  onUseTemplate: (template: MessageTemplate) => void;
}

export function MessageTemplates({ 
  templates, 
  onAddTemplate, 
  onEditTemplate, 
  onDeleteTemplate,
  onUseTemplate 
}: MessageTemplatesProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<MessageTemplate | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<CommunicationType | 'all'>('all');

  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    content: '',
    type: 'email' as CommunicationType,
    category: '',
    variables: [] as string[]
  });

  const resetForm = () => {
    setFormData({
      name: '',
      subject: '',
      content: '',
      type: 'email',
      category: '',
      variables: []
    });
    setEditingTemplate(null);
  };

  const openAddDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (template: MessageTemplate) => {
    setFormData({
      name: template.name,
      subject: template.subject || '',
      content: template.content,
      type: template.type,
      category: template.category,
      variables: template.variables
    });
    setEditingTemplate(template);
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.content.trim()) return;

    // Extract variables from content
    const variableMatches = formData.content.match(/\{([^}]+)\}/g);
    const extractedVariables = variableMatches 
      ? variableMatches.map(match => match.slice(1, -1))
      : [];

    const templateData = {
      ...formData,
      variables: extractedVariables
    };

    if (editingTemplate) {
      onEditTemplate({
        ...editingTemplate,
        ...templateData,
        updatedAt: new Date().toISOString()
      });
    } else {
      onAddTemplate(templateData);
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const getTypeIcon = (type: CommunicationType) => {
    switch (type) {
      case 'phone': return <Phone size={16} />;
      case 'email': return <Mail size={16} />;
      case 'sms': return <MessageSquare size={16} />;
      case 'meeting': return <User size={16} />;
      default: return <MessageSquare size={16} />;
    }
  };

  const getTypeLabel = (type: CommunicationType) => {
    switch (type) {
      case 'phone': return 'Telefon';
      case 'email': return 'Email';
      case 'sms': return 'SMS';
      case 'meeting': return 'Spotkanie';
      default: return 'Inne';
    }
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success("Skopiowano do schowka");
  };

  const filteredTemplates = templates
    .filter(template => {
      const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          template.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          template.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === 'all' || template.type === filterType;
      return matchesSearch && matchesType;
    });

  const categories = [...new Set(templates.map(t => t.category))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Szablony wiadomości</h2>
          <p className="text-muted-foreground">Zarządzaj szablonami komunikacji</p>
        </div>
        <Button onClick={openAddDialog} className="gap-2">
          <Plus size={16} />
          Dodaj szablon
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Szukaj szablonów..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Wszystkie typy</SelectItem>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="phone">Telefon</SelectItem>
            <SelectItem value="sms">SMS</SelectItem>
            <SelectItem value="meeting">Spotkanie</SelectItem>
            <SelectItem value="other">Inne</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Templates Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="glass-card border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="gap-1">
                      {getTypeIcon(template.type)}
                      {getTypeLabel(template.type)}
                    </Badge>
                    <Badge variant="secondary">{template.category}</Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {template.subject && (
                <div>
                  <Label className="text-xs text-muted-foreground">Temat</Label>
                  <p className="text-sm font-medium text-foreground">{template.subject}</p>
                </div>
              )}
              
              <div>
                <Label className="text-xs text-muted-foreground">Treść</Label>
                <p className="text-sm text-foreground line-clamp-3 whitespace-pre-wrap">
                  {template.content}
                </p>
              </div>

              {template.variables.length > 0 && (
                <div>
                  <Label className="text-xs text-muted-foreground">Zmienne</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {template.variables.map((variable) => (
                      <Badge key={variable} variant="outline" className="text-xs">
                        {"{" + variable + "}"}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => onUseTemplate(template)}
                  className="flex-1"
                >
                  Użyj
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => copyToClipboard(template.content)}
                >
                  <Copy size={14} />
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => openEditDialog(template)}
                >
                  <Edit size={14} />
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => onDeleteTemplate(template.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <Card className="glass-card border-border/50">
          <CardContent className="p-8 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {templates.length === 0 ? "Brak szablonów" : "Brak wyników"}
            </h3>
            <p className="text-muted-foreground mb-4">
              {templates.length === 0 
                ? "Dodaj pierwszy szablon, aby ułatwić komunikację z klientami"
                : "Spróbuj zmienić kryteria wyszukiwania"
              }
            </p>
            {templates.length === 0 && (
              <Button onClick={openAddDialog} className="gap-2">
                <Plus size={16} />
                Dodaj szablon
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingTemplate ? 'Edytuj szablon' : 'Dodaj szablon'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nazwa szablonu *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="np. Potwierdzenie zlecenia"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Typ komunikacji</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: CommunicationType) => setFormData(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="phone">Telefon</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="meeting">Spotkanie</SelectItem>
                    <SelectItem value="other">Inne</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category">Kategoria</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  placeholder="np. Potwierdzenia, Przypomnienia"
                  list="categories"
                />
                <datalist id="categories">
                  {categories.map(category => (
                    <option key={category} value={category} />
                  ))}
                </datalist>
              </div>

              {formData.type === 'email' && (
                <div className="space-y-2">
                  <Label htmlFor="subject">Temat (opcjonalnie)</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="np. Potwierdzenie zlecenia - {jobTitle}"
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Treść wiadomości *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Użyj zmiennych w nawiasach klamrowych, np. {clientName}, {jobTitle}, {scheduledDate}"
                rows={6}
                required
              />
              <p className="text-xs text-muted-foreground">
                Dostępne zmienne: {"{clientName}, {jobTitle}, {scheduledDate}, {totalCost}, {address}"}
              </p>
            </div>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Anuluj
              </Button>
              <Button type="submit">
                {editingTemplate ? 'Zapisz zmiany' : 'Dodaj szablon'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}