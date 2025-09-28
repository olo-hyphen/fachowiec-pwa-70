import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { getJobs, getTimeEntries, saveTimeEntry, deleteTimeEntry } from '@/lib/storage';
import { Job, TimeEntry } from '@/types';
import { 
  Play, 
  Pause, 
  Square,
  Clock,
  Calendar,
  Trash2,
  Plus
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ActiveTimer {
  jobId: string;
  startTime: Date;
  description: string;
}

export default function TimeTracking() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [activeTimer, setActiveTimer] = useState<ActiveTimer | null>(null);
  const [selectedJobId, setSelectedJobId] = useState<string>('');
  const [description, setDescription] = useState('');
  const [elapsedTime, setElapsedTime] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (activeTimer) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - activeTimer.startTime.getTime()) / 1000));
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeTimer]);

  const loadData = () => {
    setJobs(getJobs());
    setTimeEntries(getTimeEntries());
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const startTimer = () => {
    if (!selectedJobId) {
      toast({
        title: "Błąd",
        description: "Wybierz zlecenie przed rozpoczęciem mierzenia czasu",
        variant: "destructive"
      });
      return;
    }

    setActiveTimer({
      jobId: selectedJobId,
      startTime: new Date(),
      description: description
    });
    setElapsedTime(0);

    toast({
      title: "Timer uruchomiony",
      description: `Rozpoczęto mierzenie czasu dla zlecenia`
    });
  };

  const pauseTimer = () => {
    if (activeTimer) {
      // Save current session
      const duration = Math.floor((Date.now() - activeTimer.startTime.getTime()) / 1000 / 60); // in minutes
      
      const timeEntry: TimeEntry = {
        id: Date.now().toString(),
        jobId: activeTimer.jobId,
        startTime: activeTimer.startTime.toISOString(),
        endTime: new Date().toISOString(),
        duration: duration,
        description: activeTimer.description || description,
        createdAt: new Date().toISOString()
      };

      saveTimeEntry(timeEntry);
      setActiveTimer(null);
      setElapsedTime(0);
      setDescription('');
      loadData();

      toast({
        title: "Timer zatrzymany",
        description: `Zapisano sesję: ${formatDuration(duration)}`
      });
    }
  };

  const stopTimer = () => {
    pauseTimer();
  };

  const deleteEntry = (entryId: string) => {
    if (confirm('Czy na pewno chcesz usunąć ten wpis?')) {
      deleteTimeEntry(entryId);
      loadData();
      toast({
        title: "Wpis usunięty",
        description: "Wpis czasu pracy został usunięty"
      });
    }
  };

  const getJobTitle = (jobId: string): string => {
    const job = jobs.find(j => j.id === jobId);
    return job ? job.title : 'Nieznane zlecenie';
  };

  const getTotalTimeForJob = (jobId: string): number => {
    return timeEntries
      .filter(entry => entry.jobId === jobId)
      .reduce((total, entry) => total + entry.duration, 0);
  };

  const activeJobs = jobs.filter(job => job.status === 'in-progress' || job.status === 'pending');

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Śledzenie czasu pracy</h1>
          <p className="text-muted-foreground">
            Mierz czas poświęcony na każde zlecenie
          </p>
        </div>

        {/* Timer Section */}
        <Card className="mb-8 shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Timer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Timer Display */}
            <div className="text-center">
              <div className="text-6xl font-mono font-bold text-foreground mb-4">
                {formatTime(elapsedTime)}
              </div>
              {activeTimer && (
                <p className="text-muted-foreground">
                  {getJobTitle(activeTimer.jobId)}
                </p>
              )}
            </div>

            {/* Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="job-select">Wybierz zlecenie</Label>
                <Select 
                  value={selectedJobId} 
                  onValueChange={setSelectedJobId}
                  disabled={!!activeTimer}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Wybierz zlecenie" />
                  </SelectTrigger>
                  <SelectContent>
                    {activeJobs.map(job => (
                      <SelectItem key={job.id} value={job.id}>
                        {job.title} - {job.clientName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">Opis aktywności (opcjonalnie)</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Co obecnie robisz..."
                  rows={2}
                  disabled={!!activeTimer}
                />
              </div>
            </div>

            {/* Timer Buttons */}
            <div className="flex justify-center gap-4">
              {!activeTimer ? (
                <Button
                  onClick={startTimer}
                  size="lg"
                  className="bg-gradient-primary hover:bg-gradient-primary/90 shadow-soft"
                  disabled={!selectedJobId}
                >
                  <Play className="h-5 w-5 mr-2" />
                  Start
                </Button>
              ) : (
                <div className="flex gap-4">
                  <Button
                    onClick={pauseTimer}
                    size="lg"
                    variant="outline"
                  >
                    <Pause className="h-5 w-5 mr-2" />
                    Pauza i zapisz
                  </Button>
                  <Button
                    onClick={stopTimer}
                    size="lg"
                    variant="destructive"
                  >
                    <Square className="h-5 w-5 mr-2" />
                    Stop
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Job Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {activeJobs.map(job => {
            const totalTime = getTotalTimeForJob(job.id);
            const progress = job.estimatedHours > 0 ? (totalTime / 60 / job.estimatedHours) * 100 : 0;
            
            return (
              <Card key={job.id} className="shadow-soft">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{job.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{job.clientName}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Przepracowano:</span>
                      <span className="font-semibold">{formatDuration(totalTime)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Szacowane:</span>
                      <span className="font-semibold">{job.estimatedHours}h</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-gradient-primary h-2 rounded-full transition-all"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">Postęp</span>
                      <span className="text-xs font-medium">{Math.round(progress)}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent Time Entries */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Ostatnie wpisy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {timeEntries
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, 10)
                .map(entry => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg hover:bg-secondary/70 transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">{getJobTitle(entry.jobId)}</h3>
                      {entry.description && (
                        <p className="text-sm text-muted-foreground">{entry.description}</p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {new Date(entry.startTime).toLocaleDateString('pl-PL')} • {' '}
                        {new Date(entry.startTime).toLocaleTimeString('pl-PL', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                        {entry.endTime && (
                          <span>
                            {' - '}
                            {new Date(entry.endTime).toLocaleTimeString('pl-PL', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="secondary">
                        {formatDuration(entry.duration)}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteEntry(entry.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              
              {timeEntries.length === 0 && (
                <div className="text-center py-8">
                  <h3 className="text-lg font-medium text-muted-foreground mb-2">
                    Brak wpisów czasu
                  </h3>
                  <p className="text-muted-foreground">
                    Rozpocznij mierzenie czasu, aby zobaczyć wpisy tutaj.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}