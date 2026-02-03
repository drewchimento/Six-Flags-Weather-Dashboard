import { useState } from 'react';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Moon, Sun, Settings } from 'lucide-react';
import { useTheme } from 'next-themes';
import type { ClaudeModel } from '../../types';

interface HeaderProps {
  model: ClaudeModel;
  onModelChange: (model: ClaudeModel) => void;
  onSettingsClick: () => void;
}

const models: { value: ClaudeModel; label: string }[] = [
  { value: 'claude-sonnet-4-20250514', label: 'Claude Sonnet 4.5' },
  { value: 'claude-opus-4-20250514', label: 'Claude Opus 4.1' },
  { value: 'claude-3-7-sonnet-20250219', label: 'Claude Sonnet 4' }
];

export function Header({ model, onModelChange, onSettingsClick }: HeaderProps) {
  const { theme, setTheme } = useTheme();

  return (
    <header className="h-16 border-b bg-card flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="text-3xl animate-rollercoaster">🎢</div>
          <div>
            <h1 className="text-xl font-heading text-primary tracking-wide">
              Six Flags
            </h1>
            <p className="text-xs text-muted-foreground -mt-1">Command Center</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Model:</span>
          <Select value={model} onValueChange={(value) => onModelChange(value as ClaudeModel)}>
            <SelectTrigger className="w-[180px] h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {models.map((m) => (
                <SelectItem key={m.value} value={m.value}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          
          <Button variant="ghost" size="icon" onClick={onSettingsClick}>
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
