import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    label: string;
  };
  icon: LucideIcon;
  className?: string;
}

export function StatCard({ title, value, change, icon: Icon, className }: StatCardProps) {
  return (
    <Card className={cn('glass-card border-none shadow-glass hover:shadow-glow transition-all duration-300 hover:scale-105 group', className)}>
      <CardContent className="p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground/80 group-hover:text-foreground transition-colors font-inter mb-2">
              {title}
            </p>
            <p className="text-2xl md:text-3xl font-bold font-poppins bg-gradient-primary bg-clip-text text-transparent">
              {value}
            </p>
            {change && (
              <p className={cn(
                'text-xs font-medium mt-1 font-inter',
                change.value >= 0 ? 'text-success' : 'text-destructive'
              )}>
                {change.value >= 0 ? '+' : ''}{change.value}% {change.label}
              </p>
            )}
          </div>
          <div className="p-3 bg-gradient-primary rounded-2xl shadow-glow group-hover:scale-110 transition-transform duration-300">
            <Icon className="h-5 w-5 md:h-6 md:w-6 text-primary-foreground" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}