import { useState, useMemo } from 'react';
import { Scissors, CreditCard, Banknote, Check, Percent, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Service, Extra, Barber, PaymentMethod, DiscountType } from '@/types/barbershop';

interface PaymentRegistrationProps {
  services: Service[];
  extras: Extra[];
  barbers: Barber[];
  onSubmit: (data: {
    barberId: string;
    barberName: string;
    serviceId: string;
    serviceName: string;
    servicePrice: number;
    extras: { id: string; name: string; price: number }[];
    discount: number;
    discountType: DiscountType;
    paymentMethod: PaymentMethod;
    subtotal: number;
    total: number;
  }) => void;
}

export function PaymentRegistration({ services, extras, barbers, onSubmit }: PaymentRegistrationProps) {
  const { toast } = useToast();
  const [selectedBarber, setSelectedBarber] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [discount, setDiscount] = useState('');
  const [discountType, setDiscountType] = useState<DiscountType>('fixed');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | ''>('');

  const service = useMemo(() => services.find(s => s.id === selectedService), [services, selectedService]);
  const barber = useMemo(() => barbers.find(b => b.id === selectedBarber), [barbers, selectedBarber]);
  const selectedExtrasData = useMemo(() => 
    extras.filter(e => selectedExtras.includes(e.id)), 
    [extras, selectedExtras]
  );

  const subtotal = useMemo(() => {
    const servicePrice = service?.price || 0;
    const extrasTotal = selectedExtrasData.reduce((sum, e) => sum + e.price, 0);
    return servicePrice + extrasTotal;
  }, [service, selectedExtrasData]);

  const discountAmount = useMemo(() => {
    const discountValue = parseFloat(discount) || 0;
    if (discountType === 'percentage') {
      return Math.round(subtotal * (discountValue / 100));
    }
    return discountValue;
  }, [discount, discountType, subtotal]);

  const total = useMemo(() => Math.max(0, subtotal - discountAmount), [subtotal, discountAmount]);

  const handleExtraToggle = (extraId: string) => {
    setSelectedExtras(prev => 
      prev.includes(extraId) 
        ? prev.filter(id => id !== extraId)
        : [...prev, extraId]
    );
  };

  const resetForm = () => {
    setSelectedBarber('');
    setSelectedService('');
    setSelectedExtras([]);
    setDiscount('');
    setDiscountType('fixed');
    setPaymentMethod('');
  };

  const handleSubmit = () => {
    if (!selectedBarber || !selectedService || !paymentMethod) {
      toast({
        title: "Campos requeridos",
        description: "Por favor completa barbero, servicio y método de pago.",
        variant: "destructive",
      });
      return;
    }

    onSubmit({
      barberId: selectedBarber,
      barberName: barber!.name,
      serviceId: selectedService,
      serviceName: service!.name,
      servicePrice: service!.price,
      extras: selectedExtrasData,
      discount: parseFloat(discount) || 0,
      discountType,
      paymentMethod,
      subtotal,
      total,
    });

    toast({
      title: "¡Cobro registrado!",
      description: `$${total.toLocaleString()} - ${service!.name} por ${barber!.name}`,
    });

    resetForm();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-gradient-gold">
          <Scissors className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-display font-bold text-foreground">Nuevo Cobro</h2>
          <p className="text-muted-foreground text-sm">Registra un servicio completado</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Barber Selection */}
        <Card className="shadow-card border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Barbero</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedBarber} onValueChange={setSelectedBarber}>
              <SelectTrigger className="h-12 text-base">
                <SelectValue placeholder="Seleccionar barbero" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                {barbers.map(barber => (
                  <SelectItem key={barber.id} value={barber.id}>
                    {barber.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Service Selection */}
        <Card className="shadow-card border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Servicio Principal</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedService} onValueChange={setSelectedService}>
              <SelectTrigger className="h-12 text-base">
                <SelectValue placeholder="Seleccionar servicio" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                {services.map(service => (
                  <SelectItem key={service.id} value={service.id}>
                    <span className="flex items-center justify-between w-full gap-4">
                      {service.name}
                      <span className="text-muted-foreground">${service.price.toLocaleString()}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      {/* Extras */}
      <Card className="shadow-card border-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">Extras (Opcional)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {extras.map(extra => (
              <label
                key={extra.id}
                className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedExtras.includes(extra.id)
                    ? 'border-secondary bg-secondary/10'
                    : 'border-border hover:border-muted-foreground/30'
                }`}
              >
                <Checkbox
                  checked={selectedExtras.includes(extra.id)}
                  onCheckedChange={() => handleExtraToggle(extra.id)}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{extra.name}</p>
                  <p className="text-xs text-muted-foreground">${extra.price.toLocaleString()}</p>
                </div>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Discount */}
      <Card className="shadow-card border-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">Descuento (Opcional)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                type="number"
                placeholder="0"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                className="h-12 text-base"
              />
            </div>
            <div className="flex rounded-lg border overflow-hidden">
              <button
                type="button"
                onClick={() => setDiscountType('fixed')}
                className={`px-4 flex items-center gap-1 transition-colors ${
                  discountType === 'fixed' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                <DollarSign className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setDiscountType('percentage')}
                className={`px-4 flex items-center gap-1 transition-colors ${
                  discountType === 'percentage' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                <Percent className="h-4 w-4" />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card className="shadow-card border-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">Método de Pago</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setPaymentMethod('efectivo')}
              className={`flex items-center justify-center gap-3 p-4 rounded-lg border-2 transition-all ${
                paymentMethod === 'efectivo'
                  ? 'border-success bg-success/10'
                  : 'border-border hover:border-muted-foreground/30'
              }`}
            >
              <Banknote className={`h-6 w-6 ${paymentMethod === 'efectivo' ? 'text-success' : 'text-muted-foreground'}`} />
              <span className="font-medium">Efectivo</span>
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod('mercado_pago')}
              className={`flex items-center justify-center gap-3 p-4 rounded-lg border-2 transition-all ${
                paymentMethod === 'mercado_pago'
                  ? 'border-secondary bg-secondary/10'
                  : 'border-border hover:border-muted-foreground/30'
              }`}
            >
              <CreditCard className={`h-6 w-6 ${paymentMethod === 'mercado_pago' ? 'text-secondary' : 'text-muted-foreground'}`} />
              <span className="font-medium">Mercado Pago</span>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Summary & Submit */}
      <Card className="shadow-elevated border-0 bg-gradient-hero text-primary-foreground">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-primary-foreground/70">Subtotal</span>
            <span className="font-medium">${subtotal.toLocaleString()}</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex items-center justify-between mb-4 text-destructive-foreground">
              <span className="text-primary-foreground/70">Descuento</span>
              <span className="font-medium">-${discountAmount.toLocaleString()}</span>
            </div>
          )}
          <div className="flex items-center justify-between pt-4 border-t border-primary-foreground/20">
            <span className="text-lg font-semibold">Total</span>
            <span className="text-3xl font-display font-bold">${total.toLocaleString()}</span>
          </div>
          <Button
            onClick={handleSubmit}
            className="w-full mt-6 h-14 text-lg font-semibold bg-secondary text-secondary-foreground hover:bg-secondary/90"
            disabled={!selectedBarber || !selectedService || !paymentMethod}
          >
            <Check className="h-5 w-5 mr-2" />
            Registrar Cobro
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
