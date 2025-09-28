import { TrendingUp, Calendar, Star, Clock, DollarSign, Target } from "lucide-react";
import { Client, Communication } from "@/types/client";
import { Job } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { format, subMonths, isAfter } from "date-fns";
import { pl } from "date-fns/locale";

interface ClientStatsProps {
  client: Client;
  jobs: Job[];
  communications: Communication[];
}

export function ClientStats({ client, jobs, communications }: ClientStatsProps) {
  // Calculate statistics
  const completedJobs = jobs.filter(job => job.status === 'completed');
  const activeJobs = jobs.filter(job => job.status === 'in-progress' || job.status === 'pending');
  const cancelledJobs = jobs.filter(job => job.status === 'cancelled');
  
  const totalRevenue = jobs.reduce((sum, job) => sum + (job.totalCost || 0), 0);
  const averageJobValue = jobs.length > 0 ? totalRevenue / jobs.length : 0;
  
  // Last 6 months revenue
  const sixMonthsAgo = subMonths(new Date(), 6);
  const recentJobs = completedJobs.filter(job => 
    job.completedAt && isAfter(new Date(job.completedAt), sixMonthsAgo)
  );
  const recentRevenue = recentJobs.reduce((sum, job) => sum + (job.totalCost || 0), 0);
  
  // Communication stats
  const completedCommunications = communications.filter(comm => comm.isCompleted);
  const pendingCommunications = communications.filter(comm => !comm.isCompleted);
  
  // Average job duration (if we have time tracking data)
  const jobsWithDuration = jobs.filter(job => job.estimatedHours > 0);
  const averageJobDuration = jobsWithDuration.length > 0 
    ? jobsWithDuration.reduce((sum, job) => sum + job.estimatedHours, 0) / jobsWithDuration.length 
    : 0;

  // Job completion rate
  const completionRate = jobs.length > 0 ? (completedJobs.length / jobs.length) * 100 : 0;

  // Monthly revenue trend (simplified)
  const monthlyRevenue = recentJobs.reduce((acc, job) => {
    if (job.completedAt) {
      const month = format(new Date(job.completedAt), 'MMM yyyy', { locale: pl });
      acc[month] = (acc[month] || 0) + job.totalCost;
    }
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Key Performance Indicators */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="glass-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-success/10 rounded-lg">
                <DollarSign className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Przychód (6 mies.)</p>
                <p className="text-xl font-bold text-success">
                  {recentRevenue.toLocaleString('pl-PL')} zł
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Wskaźnik realizacji</p>
                <p className="text-xl font-bold text-foreground">
                  {completionRate.toFixed(1)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-info/10 rounded-lg">
                <Clock className="h-5 w-5 text-info" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Śr. czas projektu</p>
                <p className="text-xl font-bold text-foreground">
                  {averageJobDuration.toFixed(1)}h
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Statistics */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="glass-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Statystyki zleceń
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Zakończone</span>
                <span className="font-semibold text-success">{completedJobs.length}</span>
              </div>
              <Progress value={(completedJobs.length / Math.max(jobs.length, 1)) * 100} className="h-2" />
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Aktywne</span>
                <span className="font-semibold text-info">{activeJobs.length}</span>
              </div>
              <Progress value={(activeJobs.length / Math.max(jobs.length, 1)) * 100} className="h-2" />
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Anulowane</span>
                <span className="font-semibold text-destructive">{cancelledJobs.length}</span>
              </div>
              <Progress value={(cancelledJobs.length / Math.max(jobs.length, 1)) * 100} className="h-2" />
            </div>

            <div className="pt-4 border-t border-border space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Średnia wartość zlecenia</span>
                <span className="font-semibold text-foreground">
                  {averageJobValue.toLocaleString('pl-PL')} zł
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Łączna wartość</span>
                <span className="font-semibold text-success">
                  {totalRevenue.toLocaleString('pl-PL')} zł
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Komunikacja
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Zakończone kontakty</span>
                <span className="font-semibold text-success">{completedCommunications.length}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Zaplanowane kontakty</span>
                <span className="font-semibold text-warning">{pendingCommunications.length}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Ocena klienta</span>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-warning text-warning" />
                  <span className="font-semibold text-foreground">{client.rating}/5</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Ostatni kontakt</span>
                <span className="font-semibold text-foreground">
                  {client.lastContactDate 
                    ? format(new Date(client.lastContactDate), 'dd MMM yyyy', { locale: pl })
                    : 'Brak'
                  }
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Preferowany kontakt</span>
                <span className="font-semibold text-foreground">
                  {client.preferredContactMethod === 'phone' ? 'Telefon' :
                   client.preferredContactMethod === 'email' ? 'Email' :
                   client.preferredContactMethod === 'sms' ? 'SMS' :
                   client.preferredContactMethod === 'meeting' ? 'Spotkanie' : 'Inne'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Revenue Chart (Simple) */}
      {Object.keys(monthlyRevenue).length > 0 && (
        <Card className="glass-card border-border/50">
          <CardHeader>
            <CardTitle>Przychód miesięczny (ostatnie 6 miesięcy)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(monthlyRevenue).map(([month, revenue]) => (
                <div key={month} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{month}</span>
                  <span className="font-semibold text-success">
                    {revenue.toLocaleString('pl-PL')} zł
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}