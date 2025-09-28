import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { getJobs, saveJob, deleteJob } from '@/lib/storage';
import { Job, JobStatus } from '@/types';
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  Activity
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Jobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    address: '',
    estimatedHours: '',
    hourlyRate: '',
    category: '',
    status: 'pending' as JobStatus
  });

  useEffect(() => {
    loadJobs();
  }, []);

  useEffect(() => {
    filterJobs();
  }, [jobs, searchTerm, statusFilter]);

  const loadJobs = () => {
    const allJobs = getJobs();
    setJobs(allJobs);
  };

  const filterJobs = () => {
    let filtered = jobs;

    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(job => job.status === statusFilter);
    }

    setFilteredJobs(filtered);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      clientName: '',
      clientPhone: '',
      clientEmail: '',
      address: '',
      estimatedHours: '',
      hourlyRate: '',
      category: '',
      status: 'pending'
    });
    setEditingJob(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const estimatedHours = parseInt(formData.estimatedHours);
    const hourlyRate = parseInt(formData.hourlyRate);
    
    if (!formData.title || !formData.clientName || !formData.address || !estimatedHours || !hourlyRate) {
      toast({
        title: "Błąd",
        description: "Wypełnij wszystkie wymagane pola",
        variant: "destructive"
      });
      return;
    }

    const jobData: Job = {
      id: editingJob?.id || Date.now().toString(),
      title: formData.title,
      description: formData.description,
      clientName: formData.clientName,
      clientPhone: formData.clientPhone,
      clientEmail: formData.clientEmail,
      address: formData.address,
      estimatedHours,
      hourlyRate,
      totalCost: estimatedHours * hourlyRate,
      status: formData.status,
      category: formData.category,
      createdAt: editingJob?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...(formData.status === 'completed' && !editingJob?.completedAt && {
        completedAt: new Date().toISOString()
      })
    };

    saveJob(jobData);
    loadJobs();
    setIsDialogOpen(false);
    resetForm();
    
    toast({
      title: editingJob ? "Zlecenie zaktualizowane" : "Zlecenie utworzone",
      description: `Zlecenie "${jobData.title}" zostało ${editingJob ? 'zaktualizowane' : 'utworzone'}.`
    });
  };

  const handleEdit = (job: Job) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      description: job.description,
      clientName: job.clientName,
      clientPhone: job.clientPhone || '',
      clientEmail: job.clientEmail || '',
      address: job.address,
      estimatedHours: job.estimatedHours.toString(),
      hourlyRate: job.hourlyRate.toString(),
      category: job.category || '',
      status: job.status
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (job: Job) => {
    if (confirm(`Czy na pewno chcesz usunąć zlecenie "${job.title}"?`)) {
      deleteJob(job.id);
      loadJobs();
      toast({
        title: "Zlecenie usunięte",
        description: `Zlecenie "${job.title}" zostało usunięte.`
      });
    }
  };

  const getStatusIcon = (status: JobStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'in-progress':
        return <Activity className="h-4 w-4 text-info" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-warning" />;
      case 'cancelled':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
    }
  };

  const getStatusText = (status: JobStatus) => {
    switch (status) {
      case 'completed':
        return 'Zakończone';
      case 'in-progress':
        return 'W trakcie';
      case 'pending':
        return 'Oczekujące';
      case 'cancelled':
        return 'Anulowane';
    }
  };

  const getStatusBadgeVariant = (status: JobStatus) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'in-progress':
        return 'secondary';
      case 'pending':
        return 'outline';
      case 'cancelled':
        return 'destructive';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Zlecenia</h1>
            <p className="text-muted-foreground">
              Zarządzaj swoimi zleceniami i projektami
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={resetForm}
                className="bg-gradient-primary hover:bg-gradient-primary/90 shadow-soft"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nowe zlecenie
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingJob ? 'Edytuj zlecenie' : 'Nowe zlecenie'}
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Tytuł zlecenia *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="np. Remont łazienki"
                    />
                  </div>
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select 
                      value={formData.status} 
                      onValueChange={(value: JobStatus) => setFormData({ ...formData, status: value })}
                    >
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

                <div>
                  <Label htmlFor="description">Opis</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Szczegółowy opis prac do wykonania..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="clientName">Nazwa klienta *</Label>
                    <Input
                      id="clientName"
                      value={formData.clientName}
                      onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                      placeholder="Jan Kowalski"
                    />
                  </div>
                  <div>
                    <Label htmlFor="clientPhone">Telefon</Label>
                    <Input
                      id="clientPhone"
                      value={formData.clientPhone}
                      onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                      placeholder="+48 123 456 789"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="clientEmail">Email</Label>
                    <Input
                      id="clientEmail"
                      type="email"
                      value={formData.clientEmail}
                      onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                      placeholder="jan@example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Kategoria</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="np. Hydraulika, Elektryka"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Adres *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="ul. Przykładowa 15, Warszawa"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="estimatedHours">Szacowane godziny *</Label>
                    <Input
                      id="estimatedHours"
                      type="number"
                      value={formData.estimatedHours}
                      onChange={(e) => setFormData({ ...formData, estimatedHours: e.target.value })}
                      placeholder="40"
                    />
                  </div>
                  <div>
                    <Label htmlFor="hourlyRate">Stawka godzinowa (zł) *</Label>
                    <Input
                      id="hourlyRate"
                      type="number"
                      value={formData.hourlyRate}
                      onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                      placeholder="80"
                    />
                  </div>
                </div>

                {formData.estimatedHours && formData.hourlyRate && (
                  <div className="p-4 bg-secondary/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Szacowana wartość zlecenia:</p>
                    <p className="text-lg font-semibold text-foreground">
                      {(parseInt(formData.estimatedHours) * parseInt(formData.hourlyRate)).toLocaleString('pl-PL')} zł
                    </p>
                  </div>
                )}

                <div className="flex justify-end gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Anuluj
                  </Button>
                  <Button type="submit">
                    {editingJob ? 'Zaktualizuj' : 'Utwórz'} zlecenie
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <Card className="mb-6 shadow-soft">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Szukaj zleceń..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="w-full md:w-48">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filtruj po statusie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Wszystkie</SelectItem>
                    <SelectItem value="pending">Oczekujące</SelectItem>
                    <SelectItem value="in-progress">W trakcie</SelectItem>
                    <SelectItem value="completed">Zakończone</SelectItem>
                    <SelectItem value="cancelled">Anulowane</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Jobs List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="shadow-soft hover:shadow-medium transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{job.title}</CardTitle>
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusIcon(job.status)}
                      <Badge variant={getStatusBadgeVariant(job.status)}>
                        {getStatusText(job.status)}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(job)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(job)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-foreground font-medium">{job.clientName}</p>
                  <p className="text-sm text-muted-foreground">{job.address}</p>
                  {job.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {job.description}
                    </p>
                  )}
                  <div className="flex justify-between items-center pt-2">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {job.estimatedHours}h × {job.hourlyRate} zł/h
                      </p>
                      {job.category && (
                        <Badge variant="outline" className="mt-1">
                          {job.category}
                        </Badge>
                      )}
                    </div>
                    <p className="text-lg font-bold text-foreground">
                      {job.totalCost.toLocaleString('pl-PL')} zł
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <Card className="shadow-soft">
            <CardContent className="p-12 text-center">
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                Brak zleceń
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Nie znaleziono zleceń spełniających kryteria wyszukiwania.'
                  : 'Utwórz swoje pierwsze zlecenie, aby rozpocząć.'
                }
              </p>
              {(!searchTerm && statusFilter === 'all') && (
                <Button 
                  onClick={() => {
                    resetForm();
                    setIsDialogOpen(true);
                  }}
                  className="bg-gradient-primary hover:bg-gradient-primary/90"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Utwórz zlecenie
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}