import { useState } from 'react';
import { Scissors, Settings, BarChart3 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PaymentRegistration } from '@/components/PaymentRegistration';
import { ConfigurationPanel } from '@/components/ConfigurationPanel';
import { DailySummary } from '@/components/DailySummary';
import { useBarbershopStore } from '@/hooks/useBarbershopStore';

const Index = () => {
  const [activeTab, setActiveTab] = useState('registro');
  
  const {
    services,
    extras,
    barbers,
    allBarbers,
    addService,
    updateService,
    deleteService,
    addExtra,
    updateExtra,
    deleteExtra,
    addBarber,
    updateBarber,
    deleteBarber,
    addTransaction,
    getDailySummary,
  } = useBarbershopStore();

  const summary = getDailySummary();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-hero text-primary-foreground sticky top-0 z-50">
        <div className="container py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-secondary/20">
              <Scissors className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-display font-bold">BarberPOS</h1>
              <p className="text-xs text-primary-foreground/70">Sistema de Gestión</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-6 pb-24">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsContent value="registro" className="mt-0">
            <PaymentRegistration
              services={services}
              extras={extras}
              barbers={barbers}
              onSubmit={addTransaction}
            />
          </TabsContent>

          <TabsContent value="resumen" className="mt-0">
            <DailySummary summary={summary} />
          </TabsContent>

          <TabsContent value="config" className="mt-0">
            <ConfigurationPanel
              services={services}
              extras={extras}
              barbers={allBarbers}
              onAddService={addService}
              onUpdateService={updateService}
              onDeleteService={deleteService}
              onAddExtra={addExtra}
              onUpdateExtra={updateExtra}
              onDeleteExtra={deleteExtra}
              onAddBarber={addBarber}
              onUpdateBarber={updateBarber}
              onDeleteBarber={deleteBarber}
            />
          </TabsContent>

          {/* Bottom Navigation */}
          <TabsList className="fixed bottom-0 left-0 right-0 h-16 rounded-none bg-card border-t border-border shadow-elevated grid grid-cols-3 p-1 z-50">
            <TabsTrigger 
              value="registro" 
              className="flex flex-col items-center gap-1 data-[state=active]:bg-secondary/10 data-[state=active]:text-secondary rounded-lg"
            >
              <Scissors className="h-5 w-5" />
              <span className="text-xs">Cobrar</span>
            </TabsTrigger>
            <TabsTrigger 
              value="resumen" 
              className="flex flex-col items-center gap-1 data-[state=active]:bg-secondary/10 data-[state=active]:text-secondary rounded-lg"
            >
              <BarChart3 className="h-5 w-5" />
              <span className="text-xs">Resumen</span>
            </TabsTrigger>
            <TabsTrigger 
              value="config" 
              className="flex flex-col items-center gap-1 data-[state=active]:bg-secondary/10 data-[state=active]:text-secondary rounded-lg"
            >
              <Settings className="h-5 w-5" />
              <span className="text-xs">Config</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
