import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/ui/stat-card';
import { getJobs, getTimeEntries, initializeSampleData } from '@/lib/storage';
import { Job, TimeEntry, KPI } from '@/types';
import { 
  Briefcase, 
  Euro, 
  Clock, 
  Star, 
  Activity,
  TrendingUp,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export default function Dashboard() {
  const [kpi, setKpi] = useState<KPI>({
    completedJobs: 0,
    totalRevenue: 0,
    averageJobDuration: 0,
    averageRating: 4.8,
    activeJobs: 0,
    profitMargin: 0
  });

  const [recentJobs, setRecentJobs] = useState<Job[]>([]);

  useEffect(() => {
    // Initialize sample data on first load
    initializeSampleData();
    
    // Calculate KPIs
    const jobs = getJobs();
    const timeEntries = getTimeEntries();
    
    const completedJobs = jobs.filter(job => job.status === 'completed');
    const activeJobs = jobs.filter(job => job.status === 'in-progress');
    const totalRevenue = completedJobs.reduce((sum, job) => sum + job.totalCost, 0);
    
    // Calculate average job duration from time entries
    const avgDuration = timeEntries.length > 0 
      ? timeEntries.reduce((sum, entry) => sum + entry.duration, 0) / timeEntries.length / 60 // convert to hours
      : 0;

    setKpi({
      completedJobs: completedJobs.length,
      totalRevenue,
      averageJobDuration: Math.round(avgDuration * 10) / 10,
      averageRating: 4.8,
      activeJobs: activeJobs.length,
      profitMargin: 85
    });

    // Set recent jobs (last 5)
    const sortedJobs = jobs
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5);
    setRecentJobs(sortedJobs);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'in-progress':
        return <Activity className="h-4 w-4 text-info" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-warning" />;
      case 'cancelled':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Zakończone';
      case 'in-progress':
        return 'W trakcie';
      case 'pending':
        return 'Oczekujące';
      case 'cancelled':
        return 'Anulowane';
      default:
        return status;
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6 md:space-y-8">
      <div className="space-y-2 animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-hero bg-clip-text text-transparent font-poppins">
          Dashboard
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Przegląd Twoich zleceń i wyników biznesowych
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 animate-fade-in">
        <div className="animate-bounce-in" style={{animationDelay: '0.1s'}}>
          <StatCard
            title="Zakończone zlecenia"
            value={kpi.completedJobs}
            change={{ value: 12, label: 'w tym miesiącu' }}
            icon={CheckCircle}
          />
        </div>
        <div className="animate-bounce-in" style={{animationDelay: '0.2s'}}>
          <StatCard
            title="Łączne przychody"
            value={`${kpi.totalRevenue.toLocaleString('pl-PL')} zł`}
            change={{ value: 8, label: 'vs poprzedni miesiąc' }}
            icon={Euro}
          />
        </div>
        <div className="animate-bounce-in" style={{animationDelay: '0.3s'}}>
          <StatCard
            title="Średni czas zlecenia"
            value={`${kpi.averageJobDuration}h`}
            change={{ value: -5, label: 'efektywność' }}
            icon={Clock}
          />
        </div>
        <div className="animate-bounce-in" style={{animationDelay: '0.4s'}}>
          <StatCard
            title="Średnia ocena"
            value={kpi.averageRating}
            change={{ value: 2, label: 'zadowolenie klientów' }}
            icon={Star}
          />
        </div>
        <div className="animate-bounce-in" style={{animationDelay: '0.5s'}}>
          <StatCard
            title="Aktywne zlecenia"
            value={kpi.activeJobs}
            icon={Activity}
          />
        </div>
        <div className="animate-bounce-in" style={{animationDelay: '0.6s'}}>
          <StatCard
            title="Marża zysku"
            value={`${kpi.profitMargin}%`}
            change={{ value: 3, label: 'rentowność' }}
            icon={TrendingUp}
          />
        </div>
      </div>

      {/* Recent Jobs */}
      <Card className="glass-card border-none shadow-glass animate-fade-in mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-poppins">
            <Briefcase className="h-5 w-5 text-primary" />
            Ostatnie zlecenia
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentJobs.map((job, index) => (
              <div
                key={job.id}
                className="flex items-center justify-between p-4 glass rounded-xl hover:shadow-glass transition-all duration-300 hover:scale-[1.02] group"
                style={{animationDelay: `${0.7 + index * 0.1}s`}}
              >
                <div className="flex items-center gap-4">
                  <div className="group-hover:scale-110 transition-transform duration-300">
                    {getStatusIcon(job.status)}
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground font-inter group-hover:text-primary transition-colors">
                      {job.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {job.clientName} • {job.address}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground font-poppins">
                    {job.totalCost.toLocaleString('pl-PL')} zł
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {getStatusText(job.status)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}