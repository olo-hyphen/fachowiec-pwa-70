import { Job } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, MapPin, User, Phone, Mail, Euro, Edit3, ExternalLink } from 'lucide-react';
import { saveJob } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface JobCardProps {
  job: Job;
  onJobUpdated?: () => void;
  compact?: boolean;
}

export function JobCard({ job, onJobUpdated, compact = false }: JobCardProps) {
  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-warning/10 text-warning border-warning/20';
      case 'in-progress': return 'bg-info/10 text-info border-info/20';
      case 'completed': return 'bg-success/10 text-success border-success/20';
      case 'cancelled': return 'bg-muted text-muted-foreground border-muted/20';
      default: return 'bg-muted text-muted-foreground border-muted/20';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Oczekujące';
      case 'in-progress': return 'W trakcie';
      case 'completed': return 'Zakończone';
      case 'cancelled': return 'Anulowane';
      default: return status;
    }
  };

  const handleStatusChange = (newStatus: string) => {
    const updatedJob: Job = {
      ...job,
      status: newStatus as Job['status'],
      updatedAt: new Date().toISOString(),
      ...(newStatus === 'completed' && !job.completedAt ? { completedAt: new Date().toISOString() } : {})
    };

    saveJob(updatedJob);
    
    toast({
      title: "Status zaktualizowany",
      description: `Zlecenie "${job.title}" ma teraz status: ${getStatusText(newStatus)}`,
    });
    
    onJobUpdated?.();
  };

  if (compact) {
    return (
      <Card className="hover-scale glass-card border transition-all duration-200">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h4 className="font-semibold text-sm truncate flex-1 mr-2">{job.title}</h4>
            <Badge variant="outline" className={cn("text-xs", getStatusColor(job.status))}>
              {getStatusText(job.status)}
            </Badge>
          </div>
          
          <div className="space-y-1 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span className="truncate">{job.clientName}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span className="truncate">{job.address}</span>
            </div>
            {job.totalCost > 0 && (
              <div className="flex items-center gap-1">
                <Euro className="h-3 w-3" />
                <span>{job.totalCost} zł</span>
              </div>
            )}
          </div>

          <div className="flex gap-1 mt-3">
            <Select value={job.status} onValueChange={handleStatusChange}>
              <SelectTrigger className="h-7 text-xs flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Oczekujące</SelectItem>
                <SelectItem value="in-progress">W trakcie</SelectItem>
                <SelectItem value="completed">Zakończone</SelectItem>
                <SelectItem value="cancelled">Anulowane</SelectItem>
              </SelectContent>
            </Select>
            <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
              <ExternalLink className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover-scale glass-card border transition-all duration-200 animate-fade-in">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{job.title}</CardTitle>
          <Badge variant="outline" className={cn("ml-2", getStatusColor(job.status))}>
            {getStatusText(job.status)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {job.description && (
          <p className="text-sm text-muted-foreground">{job.description}</p>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>{job.clientName}</span>
            </div>
            
            {job.clientPhone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <a 
                  href={`tel:${job.clientPhone}`} 
                  className="text-primary hover:underline"
                >
                  {job.clientPhone}
                </a>
              </div>
            )}
            
            {job.clientEmail && (
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a 
                  href={`mailto:${job.clientEmail}`} 
                  className="text-primary hover:underline"
                >
                  {job.clientEmail}
                </a>
              </div>
            )}
            
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{job.address}</span>
            </div>
          </div>
          
          <div className="space-y-3">
            {job.estimatedHours > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{job.estimatedHours}h</span>
              </div>
            )}
            
            {job.totalCost > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <Euro className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold">{job.totalCost} zł</span>
              </div>
            )}
            
            {job.category && (
              <Badge variant="secondary" className="w-fit">
                {job.category}
              </Badge>
            )}
          </div>
        </div>
        
        <div className="flex gap-2 pt-2">
          <Select value={job.status} onValueChange={handleStatusChange}>
            <SelectTrigger className="flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Oczekujące</SelectItem>
              <SelectItem value="in-progress">W trakcie</SelectItem>
              <SelectItem value="completed">Zakończone</SelectItem>
              <SelectItem value="cancelled">Anulowane</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm">
            <Edit3 className="h-4 w-4 mr-1" />
            Edytuj
          </Button>
          
          <Button variant="outline" size="sm">
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}