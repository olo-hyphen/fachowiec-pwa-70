import { useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '@/components/ui/theme-provider'

interface ShortcutConfig {
  key: string
  ctrlKey?: boolean
  metaKey?: boolean
  altKey?: boolean
  shiftKey?: boolean
  action: () => void
  description: string
}

export function useKeyboardShortcuts() {
  const navigate = useNavigate()
  const { setTheme, theme } = useTheme()

  const toggleTheme = useCallback(() => {
    const nextTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'
    setTheme(nextTheme)
  }, [theme, setTheme])

  const shortcuts: ShortcutConfig[] = [
    // Navigation shortcuts
    { key: '1', action: () => navigate('/'), description: 'Dashboard' },
    { key: '2', action: () => navigate('/jobs'), description: 'Zlecenia' },
    { key: '3', action: () => navigate('/calendar'), description: 'Kalendarz' },
    { key: '4', action: () => navigate('/time-tracking'), description: 'Czas pracy' },
    { key: '5', action: () => navigate('/photos'), description: 'Zdjęcia' },
    { key: '6', action: () => navigate('/estimates'), description: 'Kosztorysy' },
    { key: '7', action: () => navigate('/reports'), description: 'Raporty' },
    
    // Global shortcuts
    { 
      key: 't', 
      ctrlKey: true, 
      action: toggleTheme, 
      description: 'Toggle theme' 
    },
    { 
      key: 'k', 
      ctrlKey: true, 
      action: () => {
        // Future: Open command palette
        console.log('Command palette (coming soon)')
      }, 
      description: 'Command palette' 
    },
    { 
      key: 'n', 
      ctrlKey: true, 
      action: () => {
        // Focus on adding new job/item based on current page
        const addButton = document.querySelector('[data-shortcut="add-new"]') as HTMLButtonElement
        if (addButton) addButton.click()
      }, 
      description: 'Add new item' 
    },
    { 
      key: 'f', 
      ctrlKey: true, 
      action: () => {
        // Focus search input
        const searchInput = document.querySelector('input[type="search"], input[placeholder*="szukaj"], input[placeholder*="Search"]') as HTMLInputElement
        if (searchInput) {
          searchInput.focus()
          searchInput.select()
        }
      }, 
      description: 'Focus search' 
    }
  ]

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement ||
        (event.target as HTMLElement)?.contentEditable === 'true'
      ) {
        return
      }

      const shortcut = shortcuts.find(s => {
        const ctrlOrCmd = event.ctrlKey || event.metaKey
        return (
          s.key.toLowerCase() === event.key.toLowerCase() &&
          !!s.ctrlKey === ctrlOrCmd &&
          !!s.altKey === event.altKey &&
          !!s.shiftKey === event.shiftKey &&
          !s.metaKey // We handle metaKey same as ctrlKey
        )
      })

      if (shortcut) {
        event.preventDefault()
        shortcut.action()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [shortcuts])

  return { shortcuts }
}