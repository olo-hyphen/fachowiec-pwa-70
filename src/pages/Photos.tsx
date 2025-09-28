import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { getJobs, getPhotos, savePhoto, deletePhoto } from '@/lib/storage';
import { Job, Photo, PhotoType } from '@/types';
import { 
  Camera, 
  Upload, 
  Search, 
  Filter,
  Trash2,
  Eye,
  Plus,
  Image as ImageIcon
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Photos() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [filteredPhotos, setFilteredPhotos] = useState<Photo[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [jobFilter, setJobFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    jobId: '',
    type: 'progress' as PhotoType,
    description: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterPhotos();
  }, [photos, searchTerm, jobFilter, typeFilter]);

  const loadData = () => {
    setJobs(getJobs());
    setPhotos(getPhotos());
  };

  const filterPhotos = () => {
    let filtered = photos;

    if (searchTerm) {
      filtered = filtered.filter(photo =>
        photo.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getJobTitle(photo.jobId).toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (jobFilter !== 'all') {
      filtered = filtered.filter(photo => photo.jobId === jobFilter);
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(photo => photo.type === typeFilter);
    }

    // Sort by creation date (newest first)
    filtered = filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    setFilteredPhotos(filtered);
  };

  const getJobTitle = (jobId: string): string => {
    const job = jobs.find(j => j.id === jobId);
    return job ? job.title : 'Nieznane zlecenie';
  };

  const getTypeText = (type: PhotoType): string => {
    switch (type) {
      case 'before':
        return 'Przed';
      case 'progress':
        return 'W trakcie';
      case 'after':
        return 'Po';
      case 'issue':
        return 'Problem';
      case 'solution':
        return 'Rozwiązanie';
    }
  };

  const getTypeVariant = (type: PhotoType) => {
    switch (type) {
      case 'before':
        return 'secondary';
      case 'progress':
        return 'default';
      case 'after':
        return 'outline';
      case 'issue':
        return 'destructive';
      case 'solution':
        return 'default';
    }
  };

  const resetForm = () => {
    setFormData({
      jobId: '',
      type: 'progress',
      description: ''
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (!formData.jobId) {
      toast({
        title: "Błąd",
        description: "Wybierz zlecenie przed dodaniem zdjęć",
        variant: "destructive"
      });
      return;
    }

    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const photoData: Photo = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            jobId: formData.jobId,
            type: formData.type,
            url: event.target?.result as string,
            description: formData.description,
            createdAt: new Date().toISOString()
          };

          savePhoto(photoData);
          loadData();

          toast({
            title: "Zdjęcie dodane",
            description: `Zdjęcie zostało dodane do zlecenia`
          });
        };
        reader.readAsDataURL(file);
      }
    });

    setIsDialogOpen(false);
    resetForm();
  };

  const handleCameraCapture = () => {
    // In a real app, this would open the camera
    // For demo purposes, we'll simulate it
    toast({
      title: "Funkcja kamery",
      description: "Funkcja aparatu będzie dostępna w przyszłej wersji",
      variant: "default"
    });
  };

  const handleDelete = (photo: Photo) => {
    if (confirm('Czy na pewno chcesz usunąć to zdjęcie?')) {
      deletePhoto(photo.id);
      loadData();
      toast({
        title: "Zdjęcie usunięte",
        description: "Zdjęcie zostało usunięte"
      });
    }
  };

  const viewPhoto = (photo: Photo) => {
    setSelectedPhoto(photo);
    setIsViewerOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Dokumentacja fotograficzna</h1>
            <p className="text-muted-foreground">
              Zarządzaj zdjęciami swoich projektów
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={resetForm}
                className="bg-gradient-primary hover:bg-gradient-primary/90 shadow-soft"
              >
                <Plus className="h-4 w-4 mr-2" />
                Dodaj zdjęcia
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Dodaj nowe zdjęcia</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="job-select">Wybierz zlecenie *</Label>
                  <Select 
                    value={formData.jobId} 
                    onValueChange={(value) => setFormData({ ...formData, jobId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Wybierz zlecenie" />
                    </SelectTrigger>
                    <SelectContent>
                      {jobs.map(job => (
                        <SelectItem key={job.id} value={job.id}>
                          {job.title} - {job.clientName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="type-select">Typ zdjęcia</Label>
                  <Select 
                    value={formData.type} 
                    onValueChange={(value: PhotoType) => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="before">Przed rozpoczęciem</SelectItem>
                      <SelectItem value="progress">W trakcie prac</SelectItem>
                      <SelectItem value="after">Po zakończeniu</SelectItem>
                      <SelectItem value="issue">Problem/usterka</SelectItem>
                      <SelectItem value="solution">Rozwiązanie</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="description">Opis (opcjonalnie)</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Opisz co przedstawia zdjęcie..."
                    rows={3}
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1"
                    disabled={!formData.jobId}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Wybierz pliki
                  </Button>
                  <Button
                    type="button"
                    onClick={handleCameraCapture}
                    variant="outline"
                    disabled={!formData.jobId}
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Aparat
                  </Button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <Card className="mb-6 shadow-soft">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Szukaj zdjęć..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Select value={jobFilter} onValueChange={setJobFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filtruj po zleceniu" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Wszystkie zlecenia</SelectItem>
                    {jobs.map(job => (
                      <SelectItem key={job.id} value={job.id}>
                        {job.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filtruj po typie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Wszystkie typy</SelectItem>
                    <SelectItem value="before">Przed</SelectItem>
                    <SelectItem value="progress">W trakcie</SelectItem>
                    <SelectItem value="after">Po</SelectItem>
                    <SelectItem value="issue">Problem</SelectItem>
                    <SelectItem value="solution">Rozwiązanie</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Photos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPhotos.map((photo) => (
            <Card key={photo.id} className="shadow-soft hover:shadow-medium transition-shadow overflow-hidden">
              <div className="relative aspect-square">
                <img
                  src={photo.url}
                  alt={photo.description || 'Zdjęcie projektu'}
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => viewPhoto(photo)}
                />
                <div className="absolute top-2 right-2 flex gap-1">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => viewPhoto(photo)}
                    className="bg-background/80 hover:bg-background/90"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(photo)}
                    className="bg-destructive/80 hover:bg-destructive/90"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-sm line-clamp-1">
                    {getJobTitle(photo.jobId)}
                  </h3>
                  <Badge variant={getTypeVariant(photo.type)} className="text-xs">
                    {getTypeText(photo.type)}
                  </Badge>
                </div>
                {photo.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                    {photo.description}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  {new Date(photo.createdAt).toLocaleDateString('pl-PL')}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPhotos.length === 0 && (
          <Card className="shadow-soft">
            <CardContent className="p-12 text-center">
              <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                Brak zdjęć
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || jobFilter !== 'all' || typeFilter !== 'all'
                  ? 'Nie znaleziono zdjęć spełniających kryteria wyszukiwania.'
                  : 'Dodaj swoje pierwsze zdjęcia, aby dokumentować projekty.'
                }
              </p>
              {(!searchTerm && jobFilter === 'all' && typeFilter === 'all') && (
                <Button 
                  onClick={() => {
                    resetForm();
                    setIsDialogOpen(true);
                  }}
                  className="bg-gradient-primary hover:bg-gradient-primary/90"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Dodaj zdjęcia
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Photo Viewer Modal */}
        <Dialog open={isViewerOpen} onOpenChange={setIsViewerOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
            {selectedPhoto && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center justify-between">
                    <span>{getJobTitle(selectedPhoto.jobId)}</span>
                    <Badge variant={getTypeVariant(selectedPhoto.type)}>
                      {getTypeText(selectedPhoto.type)}
                    </Badge>
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <img
                    src={selectedPhoto.url}
                    alt={selectedPhoto.description || 'Zdjęcie projektu'}
                    className="w-full max-h-[60vh] object-contain rounded-lg"
                  />
                  {selectedPhoto.description && (
                    <p className="text-muted-foreground">{selectedPhoto.description}</p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    Dodano: {new Date(selectedPhoto.createdAt).toLocaleString('pl-PL')}
                  </p>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}