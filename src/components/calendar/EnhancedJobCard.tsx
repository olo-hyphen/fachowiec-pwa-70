import { Job } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { SwipeToDelete } from '@/components/ui/swipe-to-delete'
import { Edit, MapPin, Clock, Euro } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'

interface EnhancedJobCardProps {
  job: Job
  onEdit?: (job: Job) => void
  onDelete?: (jobId: string) => void
  showActions?: boolean
  compact?: boolean
}

export function EnhancedJobCard({ 
  job, 
  onEdit, 
  onDelete, 
  showActions = true,
  compact = false 
}: EnhancedJobCardProps) {
  const { t } = useTranslation()

  const getStatusColor = (status: Job['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30'
      case 'in-progress':
        return 'bg-blue-500/20 text-blue-700 border-blue-500/30'
      case 'completed':
        return 'bg-green-500/20 text-green-700 border-green-500/30'
      case 'cancelled':
        return 'bg-red-500/20 text-red-700 border-red-500/30'
      default:
        return 'bg-gray-500/20 text-gray-700 border-gray-500/30'
    }
  }

  const getStatusText = (status: Job['status']) => {
    return t(`status.${status}`)
  }

  const cardContent = (
    <Card className="glass-card border-none shadow-soft hover:shadow-glow transition-all duration-300 hover:scale-[1.02]">
      <CardContent className={cn("p-4", compact && "p-3")}>
        <div className="flex justify-between items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className={cn(
                "font-semibold font-poppins truncate",
                compact ? "text-sm" : "text-base"
              )}>
                {job.title}
              </h3>
              <Badge 
                variant="outline" 
                className={cn(
                  "text-xs font-medium border shrink-0",
                  getStatusColor(job.status)
                )}
              >
                {getStatusText(job.status)}
              </Badge>
            </div>

            <div className="space-y-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{job.address || job.title}</span>
              </div>
              
              {job.address && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 shrink-0 opacity-60" />
                  <span className="truncate text-xs">{job.address}</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 shrink-0" />
                  <span className="text-xs">{job.estimatedHours}h</span>
                </div>
                
                <div className="flex items-center gap-1.5">
                  <Euro className="h-3.5 w-3.5 shrink-0" />
                  <span className="text-xs font-medium">{job.estimatedHours * 50}€</span>
                </div>
              </div>
            </div>
          </div>

          {showActions && (
            <div className="flex flex-col gap-1 shrink-0">
              {onEdit && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onEdit(job)}
                  className="h-8 w-8 p-0 hover:bg-primary/10"
                  aria-label={`${t('common.edit')} ${job.title}`}
                >
                  <Edit className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )

  if (onDelete) {
    return (
      <SwipeToDelete 
        onDelete={() => onDelete(job.id)}
        className="mb-3"
      >
        {cardContent}
      </SwipeToDelete>
    )
  }

  return cardContent
}