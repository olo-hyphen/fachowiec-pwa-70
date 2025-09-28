import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Job, JobStatus } from '@/types';
import { saveJob } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

interface AddJobDialogProps {
  selectedDate?: Date;
  onJobAdded?: () => void;
  trigger?: React.ReactNode;
}

export function AddJobDialog({ selectedDate, onJobAdded, trigger }: AddJobDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    address: '',
    estimatedHours: '',
    hourlyRate: '',
    status: 'pending' as JobStatus,
    category: '',
    scheduledDate: selectedDate || new Date(),
  });
  
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.clientName || !formData.address) {
      toast({
        title: "Błąd",
        description: "Wypełnij wymagane pola: tytuł, klient i adres.",
        variant: "destructive",
      });
      return;
    }

    const estimatedHours = parseFloat(formData.estimatedHours) || 0;
    const hourlyRate = parseFloat(formData.hourlyRate) || 0;

    const newJob: Job = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      status: formData.status,
      clientName: formData.clientName,
      clientPhone: formData.clientPhone || undefined,
      clientEmail: formData.clientEmail || undefined,
      address: formData.address,
      estimatedHours,
      hourlyRate,
      totalCost: estimatedHours * hourlyRate,
      scheduledDate: formData.scheduledDate.toISOString(),
      category: formData.category || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveJob(newJob);
    
    toast({
      title: "Sukces",
      description: "Zlecenie zostało dodane do kalendarza.",
    });

    setOpen(false);
    setFormData({
      title: '',
      description: '',
      clientName: '',
      clientPhone: '',
      clientEmail: '',
      address: '',
      estimatedHours: '',
      hourlyRate: '',
      status: 'pending',
      category: '',
      scheduledDate: selectedDate || new Date(),
    });
    
    onJobAdded?.();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="animate-fade-in">
            <Plus className="mr-2 h-4 w-4" />
            Dodaj zlecenie
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Dodaj nowe zlecenie</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Tytuł zlecenia *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="np. Remont łazienki"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as JobStatus })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Oczekujące</SelectItem>
                  <SelectItem value="in-progress">W trakcie</SelectItem>
                  <SelectItem value="completed">Zakończone</SelectItem>
                  <SelectItem value="cancelled">Anulowane</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Opis</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Szczegółowy opis zlecenia..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clientName">Klient *</Label>
              <Input
                id="clientName"
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                placeholder="Jan Kowalski"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="clientPhone">Telefon</Label>
              <Input
                id="clientPhone"
                value={formData.clientPhone}
                onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                placeholder="+48 123 456 789"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientEmail">Email klienta</Label>
            <Input
              id="clientEmail"
              type="email"
              value={formData.clientEmail}
              onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
              placeholder="jan@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Adres *</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="ul. Przykładowa 15, Warszawa"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="estimatedHours">Szacowane godziny</Label>
              <Input
                id="estimatedHours"
                type="number"
                step="0.5"
                value={formData.estimatedHours}
                onChange={(e) => setFormData({ ...formData, estimatedHours: e.target.value })}
                placeholder="8"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="hourlyRate">Stawka godzinowa (zł)</Label>
              <Input
                id="hourlyRate"
                type="number"
                step="0.01"
                value={formData.hourlyRate}
                onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                placeholder="100"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Łączny koszt</Label>
              <Input
                value={`${(parseFloat(formData.estimatedHours) || 0) * (parseFloat(formData.hourlyRate) || 0)} zł`}
                disabled
                className="bg-muted"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Kategoria</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="Hydraulika, Elektryka, Malarstwo..."
              />
            </div>
            
            <div className="space-y-2">
              <Label>Data realizacji</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.scheduledDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(formData.scheduledDate, "PPP", { locale: pl })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.scheduledDate}
                    onSelect={(date) => date && setFormData({ ...formData, scheduledDate: date })}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              Dodaj zlecenie
            </Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Anuluj
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}