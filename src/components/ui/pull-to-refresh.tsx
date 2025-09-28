import { ReactNode } from 'react'
import { Loader2 } from 'lucide-react'
import { usePullToRefresh } from '@/hooks/useMobileGestures'
import { cn } from '@/lib/utils'

interface PullToRefreshProps {
  children: ReactNode
  onRefresh: () => Promise<void> | void
  className?: string
  disabled?: boolean
  threshold?: number
}

export function PullToRefresh({
  children,
  onRefresh,
  className,
  disabled = false,
  threshold = 80
}: PullToRefreshProps) {
  const { isRefreshing, pullDistance, showRefreshIndicator } = usePullToRefresh({
    onRefresh,
    threshold,
    disabled
  })

  const refreshProgress = Math.min(pullDistance / threshold, 1)
  const refreshOpacity = Math.min(pullDistance / (threshold * 0.6), 1)

  return (
    <div 
      className={cn("relative overflow-hidden", className)}
      data-pull-to-refresh
    >
      {/* Refresh Indicator */}
      <div 
        className={cn(
          "absolute top-0 left-0 right-0 flex items-center justify-center bg-background/90 backdrop-blur-sm border-b transition-all duration-200 z-10",
          showRefreshIndicator || isRefreshing ? "h-16" : "h-0"
        )}
        style={{
          opacity: isRefreshing ? 1 : refreshOpacity,
          transform: `translateY(${isRefreshing ? 0 : Math.max(pullDistance - threshold, -threshold)}px)`
        }}
      >
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 
            className={cn(
              "h-4 w-4 transition-transform duration-200",
              isRefreshing ? "animate-spin" : ""
            )}
            style={{
              transform: `rotate(${refreshProgress * 360}deg)`
            }}
          />
          <span>
            {isRefreshing 
              ? "Odświeżanie..." 
              : refreshProgress >= 1 
                ? "Puść, aby odświeżyć" 
                : "Pociągnij, aby odświeżyć"
            }
          </span>
        </div>
      </div>

      {/* Content */}
      <div 
        className="transition-transform duration-200"
        style={{
          transform: `translateY(${showRefreshIndicator || isRefreshing ? '64px' : '0px'})`
        }}
      >
        {children}
      </div>
    </div>
  )
}