import { useState, useMemo, useEffect, useCallback } from 'react';
import { Scissors, CreditCard, Banknote, Check, Percent, ArrowLeft, ArrowRight, User, Sparkles, Wallet, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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

type Step = 'barber' | 'service' | 'extras' | 'discount' | 'payment';

const STEPS: Step[] = ['barber', 'service', 'extras', 'discount', 'payment'];

const DISCOUNT_OPTIONS = [
  { id: 'none', label: 'Sin descuento', value: 0 },
  { id: '10', label: '10%', value: 10 },
  { id: '20', label: '20%', value: 20 },
  { id: '30', label: '30%', value: 30 },
  { id: '50', label: '50%', value: 50 },
];

const STEP_INFO = {
  barber: { title: 'Barbero', subtitle: 'Selecciona quién atendió', icon: User },
  service: { title: 'Servicio', subtitle: 'Selecciona el servicio principal', icon: Scissors },
  extras: { title: 'Extras', subtitle: 'Agrega extras opcionales (Enter para continuar)', icon: Sparkles },
  discount: { title: 'Descuento', subtitle: 'Aplica un descuento si corresponde', icon: Tag },
  payment: { title: 'Método de Pago', subtitle: 'Selecciona cómo paga el cliente', icon: Wallet },
};

export function PaymentRegistration({ services, extras, barbers, onSubmit }: PaymentRegistrationProps) {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<Step>('barber');
  const [selectedBarber, setSelectedBarber] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [selectedDiscount, setSelectedDiscount] = useState('none');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | ''>('');

  const currentStepIndex = STEPS.indexOf(currentStep);
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

  const discountPercentage = useMemo(() => {
    const option = DISCOUNT_OPTIONS.find(d => d.id === selectedDiscount);
    return option?.value || 0;
  }, [selectedDiscount]);

  const discountAmount = useMemo(() => {
    return Math.round(subtotal * (discountPercentage / 100));
  }, [subtotal, discountPercentage]);

  const total = useMemo(() => Math.max(0, subtotal - discountAmount), [subtotal, discountAmount]);

  const goToNextStep = useCallback(() => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < STEPS.length) {
      setCurrentStep(STEPS[nextIndex]);
    }
  }, [currentStepIndex]);

  const goToPrevStep = useCallback(() => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(STEPS[prevIndex]);
    }
  }, [currentStepIndex]);

  const handleSelectBarber = useCallback((barberId: string) => {
    setSelectedBarber(barberId);
    setTimeout(() => goToNextStep(), 150);
  }, [goToNextStep]);

  const handleSelectService = useCallback((serviceId: string) => {
    setSelectedService(serviceId);
    setTimeout(() => goToNextStep(), 150);
  }, [goToNextStep]);

  const handleToggleExtra = useCallback((extraId: string) => {
    setSelectedExtras(prev => 
      prev.includes(extraId) 
        ? prev.filter(id => id !== extraId)
        : [...prev, extraId]
    );
  }, []);

  const handleSelectDiscount = useCallback((discountId: string) => {
    setSelectedDiscount(discountId);
    setTimeout(() => goToNextStep(), 150);
  }, [goToNextStep]);

  const handleSelectPayment = useCallback((method: PaymentMethod) => {
    setPaymentMethod(method);
  }, []);

  const resetForm = useCallback(() => {
    setSelectedBarber('');
    setSelectedService('');
    setSelectedExtras([]);
    setSelectedDiscount('none');
    setPaymentMethod('');
    setCurrentStep('barber');
  }, []);

  const handleSubmit = useCallback(() => {
    if (!selectedBarber || !selectedService || !paymentMethod) {
      toast({
        title: "Campos requeridos",
        description: "Por favor completa todos los pasos.",
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
      discount: discountPercentage,
      discountType: 'percentage',
      paymentMethod,
      subtotal,
      total,
    });

    toast({
      title: "¡Cobro registrado!",
      description: `$${total.toLocaleString()} - ${service!.name} por ${barber!.name}`,
    });

    resetForm();
  }, [selectedBarber, selectedService, paymentMethod, barber, service, selectedExtrasData, discountPercentage, subtotal, total, onSubmit, toast, resetForm]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle Ctrl+Number shortcuts
      if (e.ctrlKey && e.key >= '1' && e.key <= '9') {
        e.preventDefault();
        const index = parseInt(e.key) - 1;
        
        if (currentStep === 'barber' && barbers[index]) {
          handleSelectBarber(barbers[index].id);
        } else if (currentStep === 'service' && services[index]) {
          handleSelectService(services[index].id);
        } else if (currentStep === 'extras' && extras[index]) {
          handleToggleExtra(extras[index].id);
        } else if (currentStep === 'discount' && DISCOUNT_OPTIONS[index]) {
          handleSelectDiscount(DISCOUNT_OPTIONS[index].id);
        } else if (currentStep === 'payment') {
          if (index === 0) handleSelectPayment('efectivo');
          if (index === 1) handleSelectPayment('mercado_pago');
        }
      }

      // Enter to continue (especially useful for extras step or to submit on payment)
      if (e.key === 'Enter' && !e.ctrlKey && !e.altKey && !e.shiftKey) {
        if (currentStep === 'extras') {
          e.preventDefault();
          goToNextStep();
        } else if (currentStep === 'payment' && paymentMethod) {
          e.preventDefault();
          handleSubmit();
        }
      }

      // Arrow navigation
      if (e.key === 'ArrowLeft' && e.altKey) {
        e.preventDefault();
        goToPrevStep();
      }
      if (e.key === 'ArrowRight' && e.altKey) {
        e.preventDefault();
        if (currentStep === 'barber' && selectedBarber) goToNextStep();
        if (currentStep === 'service' && selectedService) goToNextStep();
        if (currentStep === 'extras') goToNextStep();
      }

      // Escape to go back
      if (e.key === 'Escape') {
        goToPrevStep();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep, barbers, services, extras, paymentMethod, selectedBarber, selectedService, handleSelectBarber, handleSelectService, handleToggleExtra, handleSelectDiscount, handleSelectPayment, goToNextStep, goToPrevStep, handleSubmit]);

  const StepIcon = STEP_INFO[currentStep].icon;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-gradient-gold">
          <Scissors className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-display font-bold text-foreground">Nuevo Cobro</h2>
          <p className="text-muted-foreground text-sm">Usa Ctrl+1-9 para selección rápida</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-2">
        {STEPS.map((step, index) => (
          <div key={step} className="flex items-center flex-1">
            <button
              onClick={() => {
                // Only allow going back or to current step
                if (index <= currentStepIndex) {
                  setCurrentStep(step);
                }
              }}
              className={`flex-1 h-2 rounded-full transition-all ${
                index < currentStepIndex
                  ? 'bg-secondary cursor-pointer'
                  : index === currentStepIndex
                  ? 'bg-primary'
                  : 'bg-muted'
              }`}
            />
            {index < STEPS.length - 1 && <div className="w-2" />}
          </div>
        ))}
      </div>

      {/* Step Header */}
      <div className="flex items-center gap-3 pb-2 border-b border-border">
        <div className="p-2 rounded-lg bg-primary/10">
          <StepIcon className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground">{STEP_INFO[currentStep].title}</h3>
          <p className="text-sm text-muted-foreground">{STEP_INFO[currentStep].subtitle}</p>
        </div>
        <div className="text-sm text-muted-foreground font-medium">
          Paso {currentStepIndex + 1} de {STEPS.length}
        </div>
      </div>

      {/* Step Content */}
      <div className="min-h-[300px]">
        {/* Barber Step */}
        {currentStep === 'barber' && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {barbers.map((barber, index) => (
              <button
                key={barber.id}
                onClick={() => handleSelectBarber(barber.id)}
                className={`relative p-6 rounded-xl border-2 transition-all hover:scale-[1.02] ${
                  selectedBarber === barber.id
                    ? 'border-secondary bg-secondary/10 shadow-lg'
                    : 'border-border hover:border-secondary/50 bg-card'
                }`}
              >
                <div className="absolute top-2 left-2 w-6 h-6 rounded bg-muted text-muted-foreground text-xs font-bold flex items-center justify-center">
                  {index + 1}
                </div>
                <div className="w-14 h-14 rounded-full bg-gradient-gold mx-auto mb-3 flex items-center justify-center">
                  <User className="h-7 w-7 text-primary" />
                </div>
                <p className="font-semibold text-center text-foreground">{barber.name}</p>
                <p className="text-xs text-center text-muted-foreground mt-1">Ctrl+{index + 1}</p>
              </button>
            ))}
          </div>
        )}

        {/* Service Step */}
        {currentStep === 'service' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((service, index) => (
              <button
                key={service.id}
                onClick={() => handleSelectService(service.id)}
                className={`relative p-5 rounded-xl border-2 transition-all hover:scale-[1.02] text-left ${
                  selectedService === service.id
                    ? 'border-secondary bg-secondary/10 shadow-lg'
                    : 'border-border hover:border-secondary/50 bg-card'
                }`}
              >
                <div className="absolute top-2 left-2 w-6 h-6 rounded bg-muted text-muted-foreground text-xs font-bold flex items-center justify-center">
                  {index + 1}
                </div>
                <div className="flex justify-between items-center pl-6">
                  <div>
                    <p className="font-semibold text-foreground">{service.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">Ctrl+{index + 1}</p>
                  </div>
                  <div className="text-xl font-bold text-secondary">${service.price.toLocaleString()}</div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Extras Step */}
        {currentStep === 'extras' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {extras.map((extra, index) => (
                <button
                  key={extra.id}
                  onClick={() => handleToggleExtra(extra.id)}
                  className={`relative p-4 rounded-xl border-2 transition-all hover:scale-[1.02] ${
                    selectedExtras.includes(extra.id)
                      ? 'border-secondary bg-secondary/10 shadow-lg'
                      : 'border-border hover:border-secondary/50 bg-card'
                  }`}
                >
                  <div className="absolute top-2 left-2 w-6 h-6 rounded bg-muted text-muted-foreground text-xs font-bold flex items-center justify-center">
                    {index + 1}
                  </div>
                  {selectedExtras.includes(extra.id) && (
                    <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center">
                      <Check className="h-4 w-4" />
                    </div>
                  )}
                  <div className="pt-4">
                    <p className="font-semibold text-foreground text-center">{extra.name}</p>
                    <p className="text-lg font-bold text-secondary text-center mt-1">+${extra.price.toLocaleString()}</p>
                    <p className="text-xs text-center text-muted-foreground mt-1">Ctrl+{index + 1}</p>
                  </div>
                </button>
              ))}
            </div>

            <Button onClick={goToNextStep} className="w-full h-12" variant="secondary">
              Continuar <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Discount Step */}
        {currentStep === 'discount' && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {DISCOUNT_OPTIONS.map((option, index) => (
              <button
                key={option.id}
                onClick={() => handleSelectDiscount(option.id)}
                className={`relative p-6 rounded-xl border-2 transition-all hover:scale-[1.02] ${
                  selectedDiscount === option.id
                    ? 'border-secondary bg-secondary/10 shadow-lg'
                    : 'border-border hover:border-secondary/50 bg-card'
                }`}
              >
                <div className="absolute top-2 left-2 w-6 h-6 rounded bg-muted text-muted-foreground text-xs font-bold flex items-center justify-center">
                  {index + 1}
                </div>
                <div className="w-12 h-12 rounded-full bg-primary/10 mx-auto mb-3 flex items-center justify-center">
                  {option.value === 0 ? (
                    <Check className="h-6 w-6 text-primary" />
                  ) : (
                    <Percent className="h-6 w-6 text-secondary" />
                  )}
                </div>
                <p className="font-semibold text-center text-foreground text-lg">{option.label}</p>
                {option.value > 0 && subtotal > 0 && (
                  <p className="text-sm text-center text-muted-foreground mt-1">
                    -${Math.round(subtotal * (option.value / 100)).toLocaleString()}
                  </p>
                )}
                <p className="text-xs text-center text-muted-foreground mt-2">Ctrl+{index + 1}</p>
              </button>
            ))}
          </div>
        )}

        {/* Payment Step */}
        {currentStep === 'payment' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleSelectPayment('efectivo')}
                className={`relative p-8 rounded-xl border-2 transition-all hover:scale-[1.02] ${
                  paymentMethod === 'efectivo'
                    ? 'border-success bg-success/10 shadow-lg'
                    : 'border-border hover:border-success/50 bg-card'
                }`}
              >
                <div className="absolute top-2 left-2 w-6 h-6 rounded bg-muted text-muted-foreground text-xs font-bold flex items-center justify-center">
                  1
                </div>
                <Banknote className={`h-12 w-12 mx-auto mb-3 ${paymentMethod === 'efectivo' ? 'text-success' : 'text-muted-foreground'}`} />
                <p className="font-semibold text-center text-foreground">Efectivo</p>
                <p className="text-xs text-center text-muted-foreground mt-1">Ctrl+1</p>
              </button>
              <button
                onClick={() => handleSelectPayment('mercado_pago')}
                className={`relative p-8 rounded-xl border-2 transition-all hover:scale-[1.02] ${
                  paymentMethod === 'mercado_pago'
                    ? 'border-secondary bg-secondary/10 shadow-lg'
                    : 'border-border hover:border-secondary/50 bg-card'
                }`}
              >
                <div className="absolute top-2 left-2 w-6 h-6 rounded bg-muted text-muted-foreground text-xs font-bold flex items-center justify-center">
                  2
                </div>
                <CreditCard className={`h-12 w-12 mx-auto mb-3 ${paymentMethod === 'mercado_pago' ? 'text-secondary' : 'text-muted-foreground'}`} />
                <p className="font-semibold text-center text-foreground">Mercado Pago</p>
                <p className="text-xs text-center text-muted-foreground mt-1">Ctrl+2</p>
              </button>
            </div>

            {/* Summary */}
            <Card className="bg-gradient-hero text-primary-foreground border-0">
              <CardContent className="p-6">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-primary-foreground/70">Barbero</span>
                    <span className="font-medium">{barber?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-primary-foreground/70">Servicio</span>
                    <span className="font-medium">{service?.name} - ${service?.price.toLocaleString()}</span>
                  </div>
                  {selectedExtrasData.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-primary-foreground/70">Extras</span>
                      <span className="font-medium">{selectedExtrasData.map(e => e.name).join(', ')}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-primary-foreground/20 pt-3">
                    <span className="text-primary-foreground/70">Subtotal</span>
                    <span className="font-medium">${subtotal.toLocaleString()}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-primary-foreground/70">Descuento</span>
                      <span className="font-medium">-${discountAmount.toLocaleString()}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between pt-4 mt-4 border-t border-primary-foreground/20">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-3xl font-display font-bold">${total.toLocaleString()}</span>
                </div>
                <Button
                  onClick={handleSubmit}
                  className="w-full mt-6 h-14 text-lg font-semibold bg-secondary text-secondary-foreground hover:bg-secondary/90"
                  disabled={!paymentMethod}
                >
                  <Check className="h-5 w-5 mr-2" />
                  Registrar Cobro (Enter)
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Navigation */}
      {currentStepIndex > 0 && (
        <div className="flex justify-start pt-4 border-t border-border">
          <Button variant="ghost" onClick={goToPrevStep} className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Volver (Esc)
          </Button>
        </div>
      )}
    </div>
  );
}
