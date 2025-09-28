import { useState, useEffect } from 'react';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Job } from '@/types';
import { getJobs } from '@/lib/storage';
import { format, isSameDay, startOfMonth, endOfMonth } from 'date-fns';
import { pl } from 'date-fns/locale';
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  Plus,
  CalendarDays,
  MapPin,
  User,
  Euro,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { AddJobDialog } from '@/components/calendar/AddJobDialog';
import { JobCard } from '@/components/calendar/JobCard';
import { JobTooltip } from '@/components/calendar/JobTooltip';
import { cn } from '@/lib/utils';

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedDateJobs, setSelectedDateJobs] = useState<Job[]>([]);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadJobs();
  }, []);

  useEffect(() => {
    setSelectedDateJobs(getJobsForDate(selectedDate));
  }, [selectedDate, jobs, statusFilter, searchTerm]);

  const loadJobs = () => {
    const allJobs = getJobs();
    setJobs(allJobs);
  };

  const getJobsForDate = (date: Date): Job[] => {
    let filteredJobs = jobs.filter(job => {
      if (!job.scheduledDate) return false;
      return isSameDay(new Date(job.scheduledDate), date);
    });

    // Apply status filter
    if (statusFilter !== 'all') {
      filteredJobs = filteredJobs.filter(job => job.status === statusFilter);
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filteredJobs = filteredJobs.filter(job => 
        job.title.toLowerCase().includes(term) ||
        job.clientName.toLowerCase().includes(term) ||
        job.description.toLowerCase().includes(term) ||
        job.address.toLowerCase().includes(term)
      );
    }

    return filteredJobs;
  };

  const getAllJobsInMonth = (month: Date): Job[] => {
    const start = startOfMonth(month);
    const end = endOfMonth(month);
    
    return jobs.filter(job => {
      if (!job.scheduledDate) return false;
      const jobDate = new Date(job.scheduledDate);
      return jobDate >= start && jobDate <= end;
    });
  };

  const getJobsCountForDate = (date: Date): number => {
    return jobs.filter(job => {
      if (!job.scheduledDate) return false;
      return isSameDay(new Date(job.scheduledDate), date);
    }).length;
  };

  const getDayStatusClasses = (date: Date): string => {
    const dayJobs = jobs.filter(job => {
      if (!job.scheduledDate) return false;
      return isSameDay(new Date(job.scheduledDate), date);
    });

    if (dayJobs.length === 0) return '';
    
    const statuses = [...new Set(dayJobs.map(job => job.status))];
    
    if (statuses.length > 1) {
      return 'calendar-day-multiple';
    }
    
    return `calendar-day-${statuses[0]}`;
  };

  return (
    <div className="container mx-auto py-8 px-4 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Kalendarz zleceń</h1>
        <p className="text-muted-foreground">
          Zarządzaj harmonogramem swoich zleceń i śledź ich postęp
        </p>
      </div>

      {/* Controls */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <AddJobDialog 
            selectedDate={selectedDate} 
            onJobAdded={loadJobs}
            trigger={
              <Button className="animate-scale-in">
                <Plus className="mr-2 h-4 w-4" />
                Dodaj zlecenie
              </Button>
            }
          />
          
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Szukaj zleceń..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-64"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Wszystkie statusy</SelectItem>
                <SelectItem value="pending">Oczekujące</SelectItem>
                <SelectItem value="in-progress">W trakcie</SelectItem>
                <SelectItem value="completed">Zakończone</SelectItem>
                <SelectItem value="cancelled">Anulowane</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Enhanced Legend */}
        <Card className="glass-card">
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gradient-primary"></div>
              Legenda statusów
            </h3>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <div className="calendar-day-marker calendar-day-pending"></div>
                <AlertCircle className="h-4 w-4 text-[hsl(var(--calendar-pending))]" />
                <span className="text-sm">Oczekujące</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="calendar-day-marker calendar-day-in-progress"></div>
                <Clock className="h-4 w-4 text-[hsl(var(--calendar-in-progress))]" />
                <span className="text-sm">W trakcie</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="calendar-day-marker calendar-day-completed"></div>
                <CheckCircle className="h-4 w-4 text-[hsl(var(--calendar-completed))]" />
                <span className="text-sm">Zakończone</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="calendar-day-marker calendar-day-cancelled"></div>
                <XCircle className="h-4 w-4 text-[hsl(var(--calendar-cancelled))]" />
                <span className="text-sm">Anulowane</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="calendar-day-marker calendar-day-multiple"></div>
                <span className="text-sm">Różne statusy</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Enhanced Calendar */}
        <div className="lg:col-span-2">
          <Card className="glass-card">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5" />
                  {format(currentMonth, 'LLLL yyyy', { locale: pl })}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentMonth(new Date())}
                  >
                    Dziś
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardDescription>
                {getAllJobsInMonth(currentMonth).length} zleceń w tym miesiącu
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                month={currentMonth}
                onMonthChange={setCurrentMonth}
                locale={pl}
                modifiers={{
                  hasJobs: (date) => getJobsCountForDate(date) > 0
                }}
                modifiersStyles={{
                  hasJobs: {
                    position: 'relative'
                  }
                }}
              />
              
              {/* Custom overlay for job markers */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Job markers would be positioned here based on calendar dates */}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Jobs Panel */}
        <div>
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5" />
                {format(selectedDate, 'dd MMMM yyyy', { locale: pl })}
              </CardTitle>
              <CardDescription>
                {selectedDateJobs.length} 
                {selectedDateJobs.length === 1 ? ' zlecenie zaplanowane' : ' zleceń zaplanowanych'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedDateJobs.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {selectedDateJobs.map((job, index) => (
                    <div
                      key={job.id}
                      className="animate-fade-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <JobCard 
                        job={job} 
                        compact={true}
                        onJobUpdated={loadJobs}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                    <CalendarDays className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold mb-2">Brak zleceń</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Nie ma żadnych zleceń zaplanowanych na ten dzień
                  </p>
                  <AddJobDialog 
                    selectedDate={selectedDate} 
                    onJobAdded={loadJobs}
                    trigger={
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Dodaj zlecenie
                      </Button>
                    }
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}