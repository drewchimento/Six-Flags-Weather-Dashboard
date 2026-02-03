import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { Home, MessageSquare, Map, CheckCircle, Settings as SettingsIcon } from 'lucide-react';

const navItems = [
  { path: '/', label: 'Main Gate', icon: Home, description: 'Dashboard Home' },
  { path: '/chat', label: 'The Expert', icon: MessageSquare, description: 'AI Assistant' },
  { path: '/parks', label: 'Park Map', icon: Map, description: 'Explore Parks' },
  { path: '/validator', label: 'QA Center', icon: CheckCircle, description: 'IO & Tag Validation' },
  { path: '/settings', label: 'Guest Services', icon: SettingsIcon, description: 'Settings' }
];

export function Navigation() {
  const location = useLocation();

  return (
    <nav className="w-64 border-r bg-card h-full flex flex-col">
      <div className="p-6 border-b">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-2xl">
            🎡
          </div>
          <div>
            <h2 className="font-heading text-lg text-primary">Six Flags</h2>
            <p className="text-xs text-muted-foreground">Media Planning</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <div className="space-y-1 px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all',
                  'hover:bg-accent hover:text-accent-foreground',
                  'group relative',
                  isActive && 'bg-primary text-primary-foreground hover:bg-primary/90'
                )}
              >
                <Icon className={cn('h-5 w-5', isActive && 'animate-ticket-rip')} />
                <div className="flex-1">
                  <div className="font-semibold text-sm">{item.label}</div>
                  <div className={cn(
                    'text-xs',
                    isActive ? 'text-primary-foreground/80' : 'text-muted-foreground'
                  )}>
                    {item.description}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="p-4 border-t">
        <div className="bg-accent rounded-lg p-3 text-xs">
          <div className="font-semibold mb-1 flex items-center gap-2">
            <span className="text-lg">🎟️</span>
            <span>MCP Status</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
            <span className="text-muted-foreground">10 tools connected</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
