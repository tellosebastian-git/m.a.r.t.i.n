import { useState } from 'react';
import { Plus, Edit2, Trash2, Save, X, Scissors, Sparkles, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Service, Extra, Barber } from '@/types/barbershop';

interface ConfigurationPanelProps {
  services: Service[];
  extras: Extra[];
  barbers: Barber[];
  onAddService: (service: Omit<Service, 'id'>) => void;
  onUpdateService: (id: string, updates: Partial<Service>) => void;
  onDeleteService: (id: string) => void;
  onAddExtra: (extra: Omit<Extra, 'id'>) => void;
  onUpdateExtra: (id: string, updates: Partial<Extra>) => void;
  onDeleteExtra: (id: string) => void;
  onAddBarber: (barber: Omit<Barber, 'id'>) => void;
  onUpdateBarber: (id: string, updates: Partial<Barber>) => void;
  onDeleteBarber: (id: string) => void;
}

export function ConfigurationPanel({
  services,
  extras,
  barbers,
  onAddService,
  onUpdateService,
  onDeleteService,
  onAddExtra,
  onUpdateExtra,
  onDeleteExtra,
  onAddBarber,
  onUpdateBarber,
  onDeleteBarber,
}: ConfigurationPanelProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-gradient-gold">
          <Scissors className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-display font-bold text-foreground">Configuración</h2>
          <p className="text-muted-foreground text-sm">Administra servicios, extras y staff</p>
        </div>
      </div>

      <Tabs defaultValue="services" className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-12 bg-muted p-1">
          <TabsTrigger value="services" className="flex items-center gap-2 data-[state=active]:bg-card">
            <Scissors className="h-4 w-4" />
            <span className="hidden sm:inline">Servicios</span>
          </TabsTrigger>
          <TabsTrigger value="extras" className="flex items-center gap-2 data-[state=active]:bg-card">
            <Sparkles className="h-4 w-4" />
            <span className="hidden sm:inline">Extras</span>
          </TabsTrigger>
          <TabsTrigger value="staff" className="flex items-center gap-2 data-[state=active]:bg-card">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Staff</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="services" className="mt-6">
          <ServicesList
            services={services}
            onAdd={onAddService}
            onUpdate={onUpdateService}
            onDelete={onDeleteService}
          />
        </TabsContent>

        <TabsContent value="extras" className="mt-6">
          <ExtrasList
            extras={extras}
            onAdd={onAddExtra}
            onUpdate={onUpdateExtra}
            onDelete={onDeleteExtra}
          />
        </TabsContent>

        <TabsContent value="staff" className="mt-6">
          <StaffList
            barbers={barbers}
            onAdd={onAddBarber}
            onUpdate={onUpdateBarber}
            onDelete={onDeleteBarber}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Services List Component
function ServicesList({
  services,
  onAdd,
  onUpdate,
  onDelete,
}: {
  services: Service[];
  onAdd: (service: Omit<Service, 'id'>) => void;
  onUpdate: (id: string, updates: Partial<Service>) => void;
  onDelete: (id: string) => void;
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');

  const handleAdd = () => {
    if (newName && newPrice) {
      onAdd({ name: newName, price: parseFloat(newPrice) });
      setNewName('');
      setNewPrice('');
      setIsAdding(false);
    }
  };

  const handleUpdate = (id: string) => {
    if (newName && newPrice) {
      onUpdate(id, { name: newName, price: parseFloat(newPrice) });
      setEditingId(null);
      setNewName('');
      setNewPrice('');
    }
  };

  const startEdit = (service: Service) => {
    setEditingId(service.id);
    setNewName(service.name);
    setNewPrice(service.price.toString());
  };

  return (
    <Card className="shadow-card border-0">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Servicios</CardTitle>
        {!isAdding && (
          <Button variant="outline" size="sm" onClick={() => setIsAdding(true)}>
            <Plus className="h-4 w-4 mr-1" />
            Agregar
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {isAdding && (
          <div className="flex gap-2 p-3 bg-muted rounded-lg animate-scale-in">
            <Input
              placeholder="Nombre del servicio"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="flex-1"
            />
            <Input
              type="number"
              placeholder="Precio"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              className="w-28"
            />
            <Button size="icon" onClick={handleAdd} className="bg-success hover:bg-success/90">
              <Save className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" onClick={() => setIsAdding(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {services.map((service) => (
          <div
            key={service.id}
            className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg group hover:bg-muted transition-colors"
          >
            {editingId === service.id ? (
              <>
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="flex-1"
                />
                <Input
                  type="number"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="w-28"
                />
                <Button size="icon" onClick={() => handleUpdate(service.id)} className="bg-success hover:bg-success/90">
                  <Save className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => setEditingId(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <span className="flex-1 font-medium">{service.name}</span>
                <span className="text-muted-foreground font-medium">${service.price.toLocaleString()}</span>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => startEdit(service)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => onDelete(service.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// Extras List Component
function ExtrasList({
  extras,
  onAdd,
  onUpdate,
  onDelete,
}: {
  extras: Extra[];
  onAdd: (extra: Omit<Extra, 'id'>) => void;
  onUpdate: (id: string, updates: Partial<Extra>) => void;
  onDelete: (id: string) => void;
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');

  const handleAdd = () => {
    if (newName && newPrice) {
      onAdd({ name: newName, price: parseFloat(newPrice) });
      setNewName('');
      setNewPrice('');
      setIsAdding(false);
    }
  };

  const handleUpdate = (id: string) => {
    if (newName && newPrice) {
      onUpdate(id, { name: newName, price: parseFloat(newPrice) });
      setEditingId(null);
      setNewName('');
      setNewPrice('');
    }
  };

  const startEdit = (extra: Extra) => {
    setEditingId(extra.id);
    setNewName(extra.name);
    setNewPrice(extra.price.toString());
  };

  return (
    <Card className="shadow-card border-0">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Extras</CardTitle>
        {!isAdding && (
          <Button variant="outline" size="sm" onClick={() => setIsAdding(true)}>
            <Plus className="h-4 w-4 mr-1" />
            Agregar
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {isAdding && (
          <div className="flex gap-2 p-3 bg-muted rounded-lg animate-scale-in">
            <Input
              placeholder="Nombre del extra"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="flex-1"
            />
            <Input
              type="number"
              placeholder="Precio"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              className="w-28"
            />
            <Button size="icon" onClick={handleAdd} className="bg-success hover:bg-success/90">
              <Save className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" onClick={() => setIsAdding(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {extras.map((extra) => (
          <div
            key={extra.id}
            className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg group hover:bg-muted transition-colors"
          >
            {editingId === extra.id ? (
              <>
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="flex-1"
                />
                <Input
                  type="number"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="w-28"
                />
                <Button size="icon" onClick={() => handleUpdate(extra.id)} className="bg-success hover:bg-success/90">
                  <Save className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => setEditingId(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <span className="flex-1 font-medium">{extra.name}</span>
                <span className="text-muted-foreground font-medium">${extra.price.toLocaleString()}</span>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => startEdit(extra)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => onDelete(extra.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// Staff List Component
function StaffList({
  barbers,
  onAdd,
  onUpdate,
  onDelete,
}: {
  barbers: Barber[];
  onAdd: (barber: Omit<Barber, 'id'>) => void;
  onUpdate: (id: string, updates: Partial<Barber>) => void;
  onDelete: (id: string) => void;
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');

  const handleAdd = () => {
    if (newName) {
      onAdd({ name: newName, active: true });
      setNewName('');
      setIsAdding(false);
    }
  };

  const handleUpdate = (id: string) => {
    if (newName) {
      onUpdate(id, { name: newName });
      setEditingId(null);
      setNewName('');
    }
  };

  const startEdit = (barber: Barber) => {
    setEditingId(barber.id);
    setNewName(barber.name);
  };

  return (
    <Card className="shadow-card border-0">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Staff</CardTitle>
        {!isAdding && (
          <Button variant="outline" size="sm" onClick={() => setIsAdding(true)}>
            <Plus className="h-4 w-4 mr-1" />
            Agregar
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {isAdding && (
          <div className="flex gap-2 p-3 bg-muted rounded-lg animate-scale-in">
            <Input
              placeholder="Nombre del barbero"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="flex-1"
            />
            <Button size="icon" onClick={handleAdd} className="bg-success hover:bg-success/90">
              <Save className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" onClick={() => setIsAdding(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {barbers.map((barber) => (
          <div
            key={barber.id}
            className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg group hover:bg-muted transition-colors"
          >
            {editingId === barber.id ? (
              <>
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="flex-1"
                />
                <Button size="icon" onClick={() => handleUpdate(barber.id)} className="bg-success hover:bg-success/90">
                  <Save className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => setEditingId(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <span className="flex-1 font-medium">{barber.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {barber.active ? 'Activo' : 'Inactivo'}
                  </span>
                  <Switch
                    checked={barber.active}
                    onCheckedChange={(checked) => onUpdate(barber.id, { active: checked })}
                  />
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => startEdit(barber)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => onDelete(barber.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
