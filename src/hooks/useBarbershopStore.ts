import { useState, useCallback } from 'react';
import { Service, Extra, Barber, Transaction } from '@/types/barbershop';

// Initial demo data
const initialServices: Service[] = [
  { id: '1', name: 'Corte Clásico', price: 3500 },
  { id: '2', name: 'Corte + Barba', price: 5000 },
  { id: '3', name: 'Barba', price: 2000 },
  { id: '4', name: 'Combo Premium', price: 6500 },
];

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

export function useBarbershopStore() {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [extras, setExtras] = useState<Extra[]>(initialExtras);
  const [barbers, setBarbers] = useState<Barber[]>(initialBarbers);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Services CRUD
  const addService = useCallback((service: Omit<Service, 'id'>) => {
    const newService = { ...service, id: crypto.randomUUID() };
    setServices(prev => [...prev, newService]);
    return newService;
  }, []);

  const updateService = useCallback((id: string, updates: Partial<Service>) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  }, []);

  const deleteService = useCallback((id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
  }, []);

  // Extras CRUD
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

  // Barbers CRUD
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

  // Transactions
  const addTransaction = useCallback((transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTransaction = {
      ...transaction,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    setTransactions(prev => [newTransaction, ...prev]);
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
    services,
    extras,
    barbers: barbers.filter(b => b.active),
    allBarbers: barbers,
    transactions,
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
    // Transactions
    addTransaction,
    getTodayTransactions,
    getDailySummary,
  };
}
