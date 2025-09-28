import { Plus, Phone, Mail, MessageSquare, Calendar, User, Check, Clock } from "lucide-react";
import { Communication } from "@/types/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { pl } from "date-fns/locale";

interface CommunicationHistoryProps {
  communications: Communication[];
  onAddCommunication: () => void;
}

export function CommunicationHistory({ communications, onAddCommunication }: CommunicationHistoryProps) {
  const getTypeIcon = (type: Communication['type']) => {
    switch (type) {
      case 'phone': return <Phone size={16} />;
      case 'email': return <Mail size={16} />;
      case 'sms': return <MessageSquare size={16} />;
      case 'meeting': return <User size={16} />;
      default: return <MessageSquare size={16} />;
    }
  };

  const getTypeLabel = (type: Communication['type']) => {
    switch (type) {
      case 'phone': return 'Telefon';
      case 'email': return 'Email';
      case 'sms': return 'SMS';
      case 'meeting': return 'Spotkanie';
      default: return 'Inne';
    }
  };

  const getTypeColor = (type: Communication['type']) => {
    switch (type) {
      case 'phone': return 'bg-info/10 text-info';
      case 'email': return 'bg-success/10 text-success';
      case 'sms': return 'bg-warning/10 text-warning';
      case 'meeting': return 'bg-primary/10 text-primary';
      default: return 'bg-muted/10 text-muted-foreground';
    }
  };

  const sortedCommunications = communications.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Historia komunikacji</h3>
        <Button onClick={onAddCommunication} className="gap-2">
          <Plus size={16} />
          Dodaj komunikację
        </Button>
      </div>

      {sortedCommunications.length > 0 ? (
        <div className="space-y-3">
          {sortedCommunications.map((communication) => (
            <Card key={communication.id} className="glass-card border-border/50">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg ${getTypeColor(communication.type)}`}>
                    {getTypeIcon(communication.type)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">
                        {getTypeLabel(communication.type)}
                      </Badge>
                      
                      {communication.isCompleted ? (
                        <Badge variant="default" className="bg-success text-success-foreground gap-1">
                          <Check size={12} />
                          Zakończone
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="gap-1">
                          <Clock size={12} />
                          Planowane
                        </Badge>
                      )}
                      
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(communication.createdAt), 'dd MMM yyyy, HH:mm', { locale: pl })}
                      </span>
                    </div>

                    {communication.subject && (
                      <h4 className="font-semibold text-foreground mb-1">
                        {communication.subject}
                      </h4>
                    )}

                    <p className="text-foreground mb-2 whitespace-pre-wrap">
                      {communication.content}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      {communication.scheduledDate && (
                        <div className="flex items-center gap-1">
                          <Calendar size={12} />
                          <span>
                            Zaplanowane na: {format(new Date(communication.scheduledDate), 'dd MMM yyyy, HH:mm', { locale: pl })}
                          </span>
                        </div>
                      )}
                      
                      {communication.completedDate && (
                        <div className="flex items-center gap-1">
                          <Check size={12} />
                          <span>
                            Zakończone: {format(new Date(communication.completedDate), 'dd MMM yyyy, HH:mm', { locale: pl })}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="glass-card border-border/50">
          <CardContent className="p-8 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h4 className="font-semibold text-foreground mb-2">Brak historii komunikacji</h4>
            <p className="text-muted-foreground mb-4">
              Dodaj pierwszą komunikację, aby śledzić kontakty z tym klientem
            </p>
            <Button onClick={onAddCommunication} className="gap-2">
              <Plus size={16} />
              Dodaj komunikację
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}