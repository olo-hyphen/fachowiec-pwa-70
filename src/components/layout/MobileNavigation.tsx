import { NavLink } from "react-router-dom";
import { Home, Briefcase, Clock, Camera, Calendar, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Zlecenia", href: "/jobs", icon: Briefcase },
  { name: "Kalendarz", href: "/calendar", icon: Calendar },
  { name: "Czas", href: "/time-tracking", icon: Clock },
  { name: "Zdjęcia", href: "/photos", icon: Camera },
];

export default function MobileNavigation() {
  const [showFAB, setShowFAB] = useState(false);

  const toggleFAB = () => setShowFAB(!showFAB);

  return (
    <>
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        <div className="glass-card rounded-t-3xl border-t shadow-strong">
          <nav className="flex items-center justify-around px-2 py-3">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `flex flex-col items-center space-y-1 px-3 py-2 rounded-2xl transition-all duration-300 ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-glow transform scale-105"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`
                }
              >
                <item.icon className="h-5 w-5" />
                <span className="text-xs font-medium">{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-24 right-6 z-40 md:hidden">
        <div className="relative">
          {showFAB && (
            <div className="absolute bottom-16 right-0 space-y-3 animate-slide-up">
              <Button
                size="lg"
                className="w-14 h-14 rounded-full glass-card shadow-glass hover:shadow-glow transition-all duration-300 hover:scale-110"
                onClick={() => window.location.href = "/jobs"}
              >
                <Briefcase className="h-6 w-6" />
              </Button>
              <Button
                size="lg"
                className="w-14 h-14 rounded-full glass-card shadow-glass hover:shadow-glow transition-all duration-300 hover:scale-110"
                onClick={() => window.location.href = "/time-tracking"}
              >
                <Clock className="h-6 w-6" />
              </Button>
            </div>
          )}
          
          <Button
            size="lg"
            onClick={toggleFAB}
            className="w-16 h-16 rounded-full bg-gradient-primary shadow-glow hover:shadow-strong transition-all duration-300 hover:scale-110 transform"
          >
            <Plus 
              className={`h-7 w-7 transition-transform duration-300 ${
                showFAB ? "rotate-45" : "rotate-0"
              }`} 
            />
          </Button>
        </div>
      </div>

      {/* Bottom padding for content */}
      <div className="h-20 md:hidden" />
    </>
  );
}