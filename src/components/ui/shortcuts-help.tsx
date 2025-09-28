import { useState, useEffect } from 'react'
import { HelpCircle, Keyboard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useTranslation } from 'react-i18next'

export function ShortcutsHelp() {
  const [open, setOpen] = useState(false)
  const { t } = useTranslation()

  // Show shortcuts with ? key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === '?' && !event.ctrlKey && !event.metaKey) {
        // Don't trigger in input fields
        if (
          event.target instanceof HTMLInputElement ||
          event.target instanceof HTMLTextAreaElement ||
          event.target instanceof HTMLSelectElement
        ) {
          return
        }
        
        event.preventDefault()
        setOpen(true)
      }
      
      // Also handle Ctrl+/ for help
      if (event.key === '/' && (event.ctrlKey || event.metaKey)) {
        event.preventDefault()
        setOpen(true)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const shortcuts = [
    {
      category: t('shortcuts.navigation'),
      items: [
        { key: '1', description: t('shortcuts.dashboard') },
        { key: '2', description: t('shortcuts.jobs') },
        { key: '3', description: t('shortcuts.calendar') },
        { key: '4', description: t('shortcuts.timeTracking') },
        { key: '5', description: t('shortcuts.photos') },
        { key: '6', description: t('shortcuts.estimates') },
        { key: '7', description: t('shortcuts.reports') },
      ]
    },
    {
      category: t('shortcuts.global'),
      items: [
        { key: 'Ctrl+T', description: t('shortcuts.toggleTheme') },
        { key: 'Ctrl+K', description: t('shortcuts.commandPalette') },
        { key: 'Ctrl+N', description: t('shortcuts.addNew') },
        { key: 'Ctrl+F', description: t('shortcuts.focusSearch') },
        { key: '?', description: 'Show shortcuts help' },
      ]
    }
  ]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="hover:bg-muted/50 hover:scale-110 transition-all duration-300"
          aria-label="Show keyboard shortcuts"
        >
          <Keyboard className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            {t('shortcuts.title')}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {shortcuts.map((category) => (
            <div key={category.category}>
              <h3 className="font-medium text-sm text-muted-foreground mb-3">
                {category.category}
              </h3>
              <div className="space-y-2">
                {category.items.map((shortcut) => (
                  <div 
                    key={shortcut.key} 
                    className="flex items-center justify-between py-1"
                  >
                    <span className="text-sm">{shortcut.description}</span>
                    <kbd className="pointer-events-none inline-flex h-6 select-none items-center gap-1 rounded border bg-muted px-2 font-mono text-xs font-medium text-muted-foreground">
                      {shortcut.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}