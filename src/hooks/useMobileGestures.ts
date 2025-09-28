import { useEffect, useRef, useState, useCallback } from 'react'

interface SwipeConfig {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  threshold?: number
  preventDefaultTouchmoveEvent?: boolean
}

interface PullToRefreshConfig {
  onRefresh: () => Promise<void> | void
  threshold?: number
  disabled?: boolean
}

interface TouchPosition {
  x: number
  y: number
}

export function useSwipeGestures(config: SwipeConfig) {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    threshold = 50,
    preventDefaultTouchmoveEvent = false
  } = config

  const touchStart = useRef<TouchPosition | null>(null)
  const touchEnd = useRef<TouchPosition | null>(null)

  const onTouchStart = useCallback((e: TouchEvent) => {
    touchEnd.current = null
    touchStart.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    }
  }, [])

  const onTouchMove = useCallback((e: TouchEvent) => {
    if (preventDefaultTouchmoveEvent) {
      e.preventDefault()
    }
  }, [preventDefaultTouchmoveEvent])

  const onTouchEnd = useCallback((e: TouchEvent) => {
    if (!touchStart.current) return
    
    touchEnd.current = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY
    }

    if (!touchEnd.current) return

    const distanceX = touchStart.current.x - touchEnd.current.x
    const distanceY = touchStart.current.y - touchEnd.current.y
    const isLeftSwipe = distanceX > threshold
    const isRightSwipe = distanceX < -threshold
    const isUpSwipe = distanceY > threshold
    const isDownSwipe = distanceY < -threshold

    // Determine if this is more of a horizontal or vertical swipe
    const isHorizontal = Math.abs(distanceX) > Math.abs(distanceY)

    if (isHorizontal) {
      if (isLeftSwipe && onSwipeLeft) {
        onSwipeLeft()
      }
      if (isRightSwipe && onSwipeRight) {
        onSwipeRight()
      }
    } else {
      if (isUpSwipe && onSwipeUp) {
        onSwipeUp()
      }
      if (isDownSwipe && onSwipeDown) {
        onSwipeDown()
      }
    }
  }, [onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, threshold])

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd
  }
}

export function usePullToRefresh(config: PullToRefreshConfig) {
  const { onRefresh, threshold = 80, disabled = false } = config
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const touchStart = useRef<number | null>(null)
  const scrollElement = useRef<HTMLElement | null>(null)

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (disabled || isRefreshing) return
    
    const target = e.target as HTMLElement
    scrollElement.current = target.closest('[data-pull-to-refresh]') || document.documentElement
    
    if (scrollElement.current && scrollElement.current.scrollTop === 0) {
      touchStart.current = e.touches[0].clientY
    }
  }, [disabled, isRefreshing])

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (disabled || isRefreshing || !touchStart.current || !scrollElement.current) return
    
    const currentY = e.touches[0].clientY
    const distance = currentY - touchStart.current
    
    if (distance > 0 && scrollElement.current.scrollTop === 0) {
      e.preventDefault()
      setPullDistance(Math.min(distance, threshold * 1.5))
    }
  }, [disabled, isRefreshing, threshold])

  const handleTouchEnd = useCallback(async () => {
    if (disabled || isRefreshing || !touchStart.current) return
    
    if (pullDistance >= threshold) {
      setIsRefreshing(true)
      try {
        await onRefresh()
      } finally {
        setIsRefreshing(false)
      }
    }
    
    touchStart.current = null
    setPullDistance(0)
  }, [disabled, isRefreshing, pullDistance, threshold, onRefresh])

  useEffect(() => {
    if (disabled) return

    document.addEventListener('touchstart', handleTouchStart, { passive: false })
    document.addEventListener('touchmove', handleTouchMove, { passive: false })
    document.addEventListener('touchend', handleTouchEnd)

    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, disabled])

  return {
    isRefreshing,
    pullDistance,
    showRefreshIndicator: pullDistance > 0
  }
}

export function useSwipeToDelete(onDelete: () => void, threshold = 100) {
  const [swipeOffset, setSwipeOffset] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const touchStart = useRef<number | null>(null)

  const handleTouchStart = useCallback((e: TouchEvent) => {
    touchStart.current = e.touches[0].clientX
    setSwipeOffset(0)
  }, [])

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!touchStart.current) return
    
    const currentX = e.touches[0].clientX
    const distance = touchStart.current - currentX
    
    if (distance > 0) {
      setSwipeOffset(Math.min(distance, threshold * 1.2))
    }
  }, [threshold])

  const handleTouchEnd = useCallback(async () => {
    if (swipeOffset >= threshold) {
      setIsDeleting(true)
      setTimeout(async () => {
        await onDelete()
        setIsDeleting(false)
        setSwipeOffset(0)
      }, 200)
    } else {
      setSwipeOffset(0)
    }
    touchStart.current = null
  }, [swipeOffset, threshold, onDelete])

  return {
    swipeOffset,
    isDeleting,
    swipeHandlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd
    }
  }
}