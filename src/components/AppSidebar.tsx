import { Scissors, BarChart3, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AppSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: 'registro', label: 'Cobrar', icon: Scissors },
  { id: 'resumen', label: 'Resumen', icon: BarChart3 },
  { id: 'config', label: 'Configuración', icon: Settings },
];

export function AppSidebar({ activeTab, onTabChange }: AppSidebarProps) {
  return (
    <aside className="w-64 h-screen bg-sidebar border-r border-sidebar-border flex flex-col sticky top-0">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
            <Scissors className="h-4 w-4 text-secondary-foreground" />
          </div>
          <span className="font-semibold text-sidebar-foreground">BarberPOS</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  activeTab === item.id
                    ? "bg-secondary text-secondary-foreground"
                    : "text-muted-foreground hover:text-sidebar-foreground hover:bg-muted"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="text-xs text-muted-foreground text-center">
          Sistema de Ventas v1.0
        </div>
      </div>
    </aside>
  );
}
