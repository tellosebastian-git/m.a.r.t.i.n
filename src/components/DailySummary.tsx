import { Banknote, CreditCard, Receipt, TrendingUp, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Transaction } from '@/types/barbershop';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface DailySummaryProps {
  summary: {
    count: number;
    totalEfectivo: number;
    totalMercadoPago: number;
    total: number;
    transactions: Transaction[];
  };
}

export function DailySummary({ summary }: DailySummaryProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-gradient-gold">
          <Receipt className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-display font-bold text-foreground">Cierre del Día</h2>
          <p className="text-muted-foreground text-sm">
            {format(new Date(), "EEEE d 'de' MMMM", { locale: es })}
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-card border-0 bg-gradient-hero text-primary-foreground">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-primary-foreground/70">Total del Día</p>
                <p className="text-3xl font-display font-bold">${summary.total.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary-foreground/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Efectivo</p>
                <p className="text-2xl font-bold text-success">${summary.totalEfectivo.toLocaleString()}</p>
              </div>
              <Banknote className="h-8 w-8 text-success/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Mercado Pago</p>
                <p className="text-2xl font-bold text-secondary">${summary.totalMercadoPago.toLocaleString()}</p>
              </div>
              <CreditCard className="h-8 w-8 text-secondary/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Servicios</p>
                <p className="text-2xl font-bold">{summary.count}</p>
              </div>
              <Receipt className="h-8 w-8 text-muted-foreground/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions List */}
      <Card className="shadow-card border-0">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            Transacciones de Hoy
          </CardTitle>
        </CardHeader>
        <CardContent>
          {summary.transactions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Receipt className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hay transacciones registradas hoy</p>
              <p className="text-sm mt-1">Los cobros aparecerán aquí</p>
            </div>
          ) : (
            <div className="space-y-3">
              {summary.transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="flex-shrink-0">
                    {tx.paymentMethod === 'efectivo' ? (
                      <div className="p-2 rounded-full bg-success/10">
                        <Banknote className="h-5 w-5 text-success" />
                      </div>
                    ) : (
                      <div className="p-2 rounded-full bg-secondary/10">
                        <CreditCard className="h-5 w-5 text-secondary" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{tx.serviceName}</span>
                      {tx.extras.length > 0 && (
                        <span className="text-xs px-2 py-0.5 bg-secondary/20 text-secondary-foreground rounded-full">
                          +{tx.extras.length} extras
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {tx.barberName} • {format(new Date(tx.createdAt), 'HH:mm')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">${tx.total.toLocaleString()}</p>
                    {tx.discount > 0 && (
                      <p className="text-xs text-muted-foreground">
                        -{tx.discountType === 'percentage' ? `${tx.discount}%` : `$${tx.discount}`}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
