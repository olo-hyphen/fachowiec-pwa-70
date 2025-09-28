import { ReactNode } from 'react'
import { Trash2 } from 'lucide-react'
import { useSwipeToDelete } from '@/hooks/useMobileGestures'
import { cn } from '@/lib/utils'

interface SwipeToDeleteProps {
  children: ReactNode
  onDelete: () => void
  className?: string
  disabled?: boolean
  threshold?: number
}

export function SwipeToDelete({
  children,
  onDelete,
  className,
  disabled = false,
  threshold = 100
}: SwipeToDeleteProps) {
  const { swipeOffset, isDeleting, swipeHandlers } = useSwipeToDelete(onDelete, threshold)

  const touchHandlers = disabled ? {} : {
    onTouchStart: (e: React.TouchEvent) => swipeHandlers.onTouchStart(e.nativeEvent),
    onTouchMove: (e: React.TouchEvent) => swipeHandlers.onTouchMove(e.nativeEvent),
    onTouchEnd: () => swipeHandlers.onTouchEnd()
  }

  return (
    <div 
      className={cn("swipe-container", className)}
      {...touchHandlers}
    >
      {/* Delete action background */}
      <div 
        className="swipe-actions"
        style={{
          opacity: swipeOffset > 0 ? Math.min(swipeOffset / threshold, 1) : 0
        }}
      >
        <Trash2 className="h-5 w-5" />
      </div>

      {/* Main content */}
      <div 
        className={cn(
          "swipe-item transition-transform duration-200",
          isDeleting && "opacity-0 scale-95",
          swipeOffset > 0 && "swiping"
        )}
        style={{
          transform: `translateX(-${swipeOffset}px)`
        }}
      >
        {children}
      </div>
    </div>
  )
}