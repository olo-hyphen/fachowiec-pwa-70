import { Job } from '@/types';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Badge } from '@/components/ui/badge';
import { User, MapPin, Euro, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface JobTooltipProps {
  jobs: Job[];
  children: React.ReactNode;
}

export function JobTooltip({ jobs, children }: JobTooltipProps) {
  if (jobs.length === 0) {
    return <>{children}</>;
  }

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

  return (
    <HoverCard openDelay={300} closeDelay={100}>
      <HoverCardTrigger asChild>
        {children}
      </HoverCardTrigger>
      <HoverCardContent 
        className="w-80 p-0 glass-card border shadow-strong animate-fade-in" 
        align="center"
        side="top"
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-sm">
              {jobs.length === 1 ? 'Zlecenie' : `${jobs.length} zleceń`}
            </h4>
          </div>
          
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {jobs.slice(0, 3).map((job) => (
              <div 
                key={job.id} 
                className="p-3 bg-background/50 rounded-lg border border-border/50"
              >
                <div className="flex items-start justify-between mb-2">
                  <h5 className="font-medium text-sm truncate flex-1 mr-2">
                    {job.title}
                  </h5>
                  <Badge 
                    variant="outline" 
                    className={cn("text-xs shrink-0", getStatusColor(job.status))}
                  >
                    {getStatusText(job.status)}
                  </Badge>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <User className="h-3 w-3" />
                    <span className="truncate">{job.clientName}</span>
                  </div>
                  
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span className="truncate">{job.address}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    {job.estimatedHours > 0 && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{job.estimatedHours}h</span>
                      </div>
                    )}
                    
                    {job.totalCost > 0 && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Euro className="h-3 w-3" />
                        <span className="font-medium">{job.totalCost} zł</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {jobs.length > 3 && (
              <div className="text-center text-xs text-muted-foreground py-2">
                i {jobs.length - 3} więcej...
              </div>
            )}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}