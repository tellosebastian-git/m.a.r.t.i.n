import { useState, useCallback, useEffect } from 'react';
import { Service, ServiceLine, Extra, Barber, Discount, Transaction } from '@/types/barbershop';
import { supabaseScissors as supabase } from '@/lib/supabaseScissors';
import { toast } from 'sonner';

const initialExtras: Extra[] = [
  { id: '1', name: 'Lavado', price: 500 },
  { id: '2', name: 'Cejas', price: 300 },
  { id: '3', name: 'Máscara Facial', price: 800 },
  { id: '4', name: 'Tinte Barba', price: 1000 },
];

const initialBarbers: Barber[] = [
  { id: '1', name: 'Carlos', active: true },
  { id: '2', name: 'Miguel', active: true },
  { id: '3', name: 'Andrés', active: true },
];

const initialDiscounts: Discount[] = [
  { id: 'none', label: 'Sin descuento', value: 0 },
  { id: '10', label: '10%', value: 10 },
  { id: '20', label: '20%', value: 20 },
  { id: '30', label: '30%', value: 30 },
  { id: '50', label: '50%', value: 50 },
];

export function useBarbershopStore() {
  const [serviceLines, setServiceLines] = useState<ServiceLine[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [extras, setExtras] = useState<Extra[]>(initialExtras);
  const [barbers, setBarbers] = useState<Barber[]>(initialBarbers);
  const [discounts, setDiscounts] = useState<Discount[]>(initialDiscounts);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from Supabase on mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      // Load service lines
      const { data: linesData, error: linesError } = await supabase
        .from('service_lines')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (linesError) {
        console.error('Error loading service lines:', linesError);
      } else if (linesData) {
        setServiceLines(linesData.map(l => ({ id: l.id, name: l.name })));
      }

      // Load services
      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (servicesError) {
        console.error('Error loading services:', servicesError);
      } else if (servicesData) {
        setServices(servicesData.map(s => ({
          id: s.id,
          name: s.name,
          price: Number(s.price),
          lineId: s.line_id || undefined,
        })));
      }

      setIsLoading(false);
    };

    loadData();
  }, []);

  // Service Lines CRUD
  const addServiceLine = useCallback(async (line: Omit<ServiceLine, 'id'>) => {
    const { data, error } = await supabase
      .from('service_lines')
      .insert({ name: line.name })
      .select()
      .single();
    
    if (error) {
      console.error('Error adding service line:', error);
      toast.error('Error al guardar la línea');
      return null;
    }
    
    const newLine = { id: data.id, name: data.name };
    setServiceLines(prev => [...prev, newLine]);
    toast.success('Línea creada');
    return newLine;
  }, []);

  const updateServiceLine = useCallback(async (id: string, updates: Partial<ServiceLine>) => {
    const { error } = await supabase
      .from('service_lines')
      .update({ name: updates.name })
      .eq('id', id);
    
    if (error) {
      console.error('Error updating service line:', error);
      toast.error('Error al actualizar la línea');
      return;
    }
    
    setServiceLines(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
  }, []);

  const deleteServiceLine = useCallback(async (id: string) => {
    // First update services to remove line_id reference
    await supabase
      .from('services')
      .update({ line_id: null })
      .eq('line_id', id);
    
    const { error } = await supabase
      .from('service_lines')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting service line:', error);
      toast.error('Error al eliminar la línea');
      return;
    }
    
    setServices(prev => prev.map(s => s.lineId === id ? { ...s, lineId: undefined } : s));
    setServiceLines(prev => prev.filter(l => l.id !== id));
    toast.success('Línea eliminada');
  }, []);

  // Services CRUD
  const addService = useCallback(async (service: Omit<Service, 'id'>) => {
    const { data, error } = await supabase
      .from('services')
      .insert({
        name: service.name,
        price: service.price,
        line_id: service.lineId || null,
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error adding service:', error);
      toast.error('Error al guardar el servicio');
      return null;
    }
    
    const newService = {
      id: data.id,
      name: data.name,
      price: Number(data.price),
      lineId: data.line_id || undefined,
    };
    setServices(prev => [...prev, newService]);
    toast.success('Servicio creado');
    return newService;
  }, []);

  const updateService = useCallback(async (id: string, updates: Partial<Service>) => {
    const { error } = await supabase
      .from('services')
      .update({
        name: updates.name,
        price: updates.price,
        line_id: updates.lineId || null,
      })
      .eq('id', id);
    
    if (error) {
      console.error('Error updating service:', error);
      toast.error('Error al actualizar el servicio');
      return;
    }
    
    setServices(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  }, []);

  const deleteService = useCallback(async (id: string) => {
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting service:', error);
      toast.error('Error al eliminar el servicio');
      return;
    }
    
    setServices(prev => prev.filter(s => s.id !== id));
    toast.success('Servicio eliminado');
  }, []);

  // Extras CRUD (local only for now)
  const addExtra = useCallback((extra: Omit<Extra, 'id'>) => {
    const newExtra = { ...extra, id: crypto.randomUUID() };
    setExtras(prev => [...prev, newExtra]);
    return newExtra;
  }, []);

  const updateExtra = useCallback((id: string, updates: Partial<Extra>) => {
    setExtras(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
  }, []);

  const deleteExtra = useCallback((id: string) => {
    setExtras(prev => prev.filter(e => e.id !== id));
  }, []);

  // Barbers CRUD (local only for now)
  const addBarber = useCallback((barber: Omit<Barber, 'id'>) => {
    const newBarber = { ...barber, id: crypto.randomUUID() };
    setBarbers(prev => [...prev, newBarber]);
    return newBarber;
  }, []);

  const updateBarber = useCallback((id: string, updates: Partial<Barber>) => {
    setBarbers(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
  }, []);

  const deleteBarber = useCallback((id: string) => {
    setBarbers(prev => prev.filter(b => b.id !== id));
  }, []);

  // Discounts CRUD (local only for now)
  const addDiscount = useCallback((discount: Omit<Discount, 'id'>) => {
    const newDiscount = { ...discount, id: crypto.randomUUID() };
    setDiscounts(prev => [...prev, newDiscount]);
    return newDiscount;
  }, []);

  const updateDiscount = useCallback((id: string, updates: Partial<Discount>) => {
    setDiscounts(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
  }, []);

  const deleteDiscount = useCallback((id: string) => {
    if (id === 'none') return;
    setDiscounts(prev => prev.filter(d => d.id !== id));
  }, []);

  // Transactions
  const addTransaction = useCallback(async (transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTransaction = {
      ...transaction,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    
    setTransactions(prev => [newTransaction, ...prev]);
    
    const extrasTotal = transaction.extras.reduce((sum, e) => sum + e.price, 0);
    const { error } = await supabase.from('transactions').insert({
      barber_id: transaction.barberId,
      barber_name: transaction.barberName,
      service_id: transaction.serviceId,
      service_name: transaction.serviceName,
      service_price: transaction.servicePrice,
      extras: transaction.extras,
      extras_total: extrasTotal,
      discount_id: null,
      discount_name: transaction.discountType === 'percentage' ? `${transaction.discount}%` : null,
      discount_percentage: transaction.discountType === 'percentage' ? transaction.discount : 0,
      discount_amount: transaction.subtotal - transaction.total,
      subtotal: transaction.subtotal,
      total: transaction.total,
      payment_method: transaction.paymentMethod,
    });
    
    if (error) {
      console.error('Error saving transaction:', error);
      toast.error('Error al guardar en la base de datos');
    } else {
      toast.success('Cobro guardado correctamente');
    }
    
    return newTransaction;
  }, []);

  const getTodayTransactions = useCallback(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return transactions.filter(t => new Date(t.createdAt) >= today);
  }, [transactions]);

  const getDailySummary = useCallback(() => {
    const todayTx = getTodayTransactions();
    const totalEfectivo = todayTx
      .filter(t => t.paymentMethod === 'efectivo')
      .reduce((sum, t) => sum + t.total, 0);
    const totalMercadoPago = todayTx
      .filter(t => t.paymentMethod === 'mercado_pago')
      .reduce((sum, t) => sum + t.total, 0);
    
    return {
      count: todayTx.length,
      totalEfectivo,
      totalMercadoPago,
      total: totalEfectivo + totalMercadoPago,
      transactions: todayTx,
    };
  }, [getTodayTransactions]);

  return {
    // Data
    serviceLines,
    services,
    extras,
    barbers: barbers.filter(b => b.active),
    allBarbers: barbers,
    discounts,
    transactions,
    isLoading,
    // Service Lines
    addServiceLine,
    updateServiceLine,
    deleteServiceLine,
    // Services
    addService,
    updateService,
    deleteService,
    // Extras
    addExtra,
    updateExtra,
    deleteExtra,
    // Barbers
    addBarber,
    updateBarber,
    deleteBarber,
    // Discounts
    addDiscount,
    updateDiscount,
    deleteDiscount,
    // Transactions
    addTransaction,
    getTodayTransactions,
    getDailySummary,
  };
}
