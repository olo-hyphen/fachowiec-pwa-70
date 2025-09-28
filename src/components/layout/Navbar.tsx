import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Home, 
  Briefcase, 
  Clock, 
  Camera, 
  Calendar,
  Calculator,
  BarChart3,
  Menu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { LanguageToggle } from '@/components/ui/language-toggle';
import { ShortcutsHelp } from '@/components/ui/shortcuts-help';
import { useTranslation } from 'react-i18next';

export default function Navbar() {
  const location = useLocation();
  const { t } = useTranslation();
  
  const navigation = [
    { name: t('nav.dashboard'), href: '/', icon: Home },
    { name: t('nav.jobs'), href: '/jobs', icon: Briefcase },
    { name: t('nav.calendar'), href: '/calendar', icon: Calendar },
    { name: t('nav.timeTracking'), href: '/time-tracking', icon: Clock },
    { name: t('nav.photos'), href: '/photos', icon: Camera },
    { name: t('nav.estimates'), href: '/estimates', icon: Calculator },
    { name: t('nav.reports'), href: '/reports', icon: BarChart3 },
  ];

  const NavLinks = () => (
    <>
      {navigation.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.href;
        
        return (
          <Link
            key={item.name}
            to={item.href}
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-300 hover:scale-105 font-inter',
              isActive
                ? 'bg-gradient-primary text-primary-foreground shadow-glow'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50 hover:shadow-soft'
            )}
          >
            <Icon className="h-5 w-5" />
            {item.name}
          </Link>
        );
      })}
    </>
  );

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden md:flex glass-card border-none shadow-glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link 
                to="/" 
                className="flex items-center gap-3 text-xl font-bold text-foreground font-poppins hover:scale-105 transition-transform duration-300"
              >
                <div className="p-2 bg-gradient-primary rounded-2xl text-primary-foreground shadow-glow">
                  <Briefcase className="h-6 w-6" />
                </div>
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  FachowiecApp
                </span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-2">
              <NavLinks />
              <div className="flex items-center gap-1 ml-4 border-l border-border pl-4">
                <ThemeToggle />
                <LanguageToggle />
                <ShortcutsHelp />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navbar */}
      <div className="md:hidden glass-card border-none shadow-glass sticky top-0 z-50">
        <div className="flex justify-between items-center px-4 h-16">
          <Link 
            to="/" 
            className="flex items-center gap-3 text-lg font-bold text-foreground font-poppins hover:scale-105 transition-transform duration-300"
          >
            <div className="p-2 bg-gradient-primary rounded-xl text-primary-foreground shadow-glow">
              <Briefcase className="h-5 w-5" />
            </div>
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              FachowiecApp
            </span>
          </Link>
          
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <LanguageToggle />
            <ShortcutsHelp />
            
            <Sheet>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="hover:bg-muted/50 hover:scale-110 transition-all duration-300 ml-2"
                  aria-label={t('a11y.toggleMenu')}
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64 glass-card border-none">
                <div className="flex flex-col gap-3 pt-8">
                  <NavLinks />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </>
  );
}