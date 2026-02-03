import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Settings as SettingsIcon, Key, Database, Download, Upload, Trash2, Cloud } from 'lucide-react';
import { toast } from 'sonner';
import { storageService } from '../services/storage';
import type { ClaudeModel } from '../types';

interface SettingsPageProps {
  onApiKeySaved: (apiKey: string) => void;
  currentModel: ClaudeModel;
}

export function SettingsPage({ onApiKeySaved, currentModel }: SettingsPageProps) {
  const [apiKey, setApiKey] = useState('');
  const [weatherApiKey, setWeatherApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [showWeatherApiKey, setShowWeatherApiKey] = useState(false);
  const [hasExistingKey, setHasExistingKey] = useState(false);
  const [hasExistingWeatherKey, setHasExistingWeatherKey] = useState(false);

  useEffect(() => {
    const existing = storageService.getApiKey();
    if (existing) {
      setHasExistingKey(true);
      setApiKey(existing);
    }

    const existingWeather = storageService.getWeatherApiKey();
    if (existingWeather) {
      setHasExistingWeatherKey(true);
      setWeatherApiKey(existingWeather);
    }
  }, []);

  const handleSaveApiKey = () => {
    if (!apiKey.trim()) {
      toast.error('Please enter an API key');
      return;
    }

    if (!apiKey.startsWith('sk-ant-')) {
      toast.error('Invalid API key format. Should start with sk-ant-');
      return;
    }

    onApiKeySaved(apiKey);
    toast.success('API key saved successfully!');
    setHasExistingKey(true);
  };

  const handleClearApiKey = () => {
    storageService.clearApiKey();
    setApiKey('');
    setHasExistingKey(false);
    toast.success('API key cleared');
  };

  const handleSaveWeatherApiKey = () => {
    if (!weatherApiKey.trim()) {
      toast.error('Please enter a Weather API key');
      return;
    }

    storageService.saveWeatherApiKey(weatherApiKey);
    setHasExistingWeatherKey(true);
    toast.success('Weather API key saved successfully!');
  };

  const handleClearWeatherApiKey = () => {
    storageService.clearWeatherApiKey();
    setWeatherApiKey('');
    setHasExistingWeatherKey(false);
    toast.success('Weather API key cleared');
  };

  const handleExportData = () => {
    try {
      const data = storageService.exportAllData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `sixflags-backup-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success('Data exported successfully!');
    } catch (error) {
      toast.error('Failed to export data');
    }
  };

  const handleImportData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      storageService.importData(text);
      toast.success('Data imported successfully!');
      window.location.reload();
    } catch (error) {
      toast.error('Failed to import data. Invalid file format.');
    }
  };

  const handleClearAllData = () => {
    if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      storageService.clearAllData();
      toast.success('All data cleared');
      window.location.reload();
    }
  };

  const maskApiKey = (key: string) => {
    if (key.length <= 8) return key;
    return key.substring(0, 8) + '•'.repeat(key.length - 8);
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-heading text-primary flex items-center justify-center gap-3">
            <SettingsIcon className="h-8 w-8" />
            Guest Services
          </h1>
          <p className="text-muted-foreground">
            Configure your Six Flags Command Center
          </p>
        </div>

        <Tabs defaultValue="api" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="api">API Configuration</TabsTrigger>
            <TabsTrigger value="data">Data Management</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>

          {/* API Configuration */}
          <TabsContent value="api" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Anthropic API Key
                </CardTitle>
                <CardDescription>
                  Your API key is required to connect to Claude AI. Get yours at{' '}
                  <a
                    href="https://console.anthropic.com/settings/keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    console.anthropic.com
                  </a>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="apiKey">API Key</Label>
                  <div className="flex gap-2">
                    <Input
                      id="apiKey"
                      type={showApiKey ? 'text' : 'password'}
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="sk-ant-api03-..."
                      className="font-mono"
                    />
                    <Button
                      variant="outline"
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      {showApiKey ? 'Hide' : 'Show'}
                    </Button>
                  </div>
                  {hasExistingKey && (
                    <p className="text-xs text-green-600">
                      ✓ API key is configured
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleSaveApiKey} className="flex-1">
                    Save API Key
                  </Button>
                  {hasExistingKey && (
                    <Button variant="destructive" onClick={handleClearApiKey}>
                      Clear
                    </Button>
                  )}
                </div>

                <div className="bg-accent/20 rounded-lg p-4 space-y-2 text-sm">
                  <p className="font-semibold">🔒 Security Note:</p>
                  <p className="text-muted-foreground">
                    Your API key is stored locally in your browser and never sent to any
                    server except Anthropic's API. It's used directly for Claude AI requests.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cloud className="h-5 w-5" />
                  Weather API Key (Weatherbit)
                </CardTitle>
                <CardDescription>
                  Enable real-time weather radar, 16-day forecasts, and weather alerts for park locations. Get a free API key at{' '}
                  <a
                    href="https://www.weatherbit.io/pricing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    weatherbit.io
                  </a>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="weatherApiKey">Weatherbit API Key</Label>
                  <div className="flex gap-2">
                    <Input
                      id="weatherApiKey"
                      type={showWeatherApiKey ? 'text' : 'password'}
                      value={weatherApiKey}
                      onChange={(e) => setWeatherApiKey(e.target.value)}
                      placeholder="Enter your OpenWeather API key"
                      className="font-mono"
                    />
                    <Button
                      variant="outline"
                      onClick={() => setShowWeatherApiKey(!showWeatherApiKey)}
                    >
                      {showWeatherApiKey ? 'Hide' : 'Show'}
                    </Button>
                  </div>
                  {hasExistingWeatherKey && (
                    <p className="text-xs text-green-600">
                      ✓ Weather API key is configured
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleSaveWeatherApiKey} className="flex-1">
                    Save Weather API Key
                  </Button>
                  {hasExistingWeatherKey && (
                    <Button variant="destructive" onClick={handleClearWeatherApiKey}>
                      Clear
                    </Button>
                  )}
                </div>

                <div className="bg-blue-50 rounded-lg p-4 space-y-2 text-sm">
                  <p className="font-semibold">☁️ Weather Features:</p>
                  <ul className="text-muted-foreground space-y-1 text-xs">
                    <li>• Real-time weather radar overlays on park map</li>
                    <li>• Current weather conditions for all 29 parks with UV index and air quality</li>
                    <li>• 16-day forecasts with attendance impact analysis (vs 7-day with OpenWeather)</li>
                    <li>• Weather alerts for severe conditions affecting park operations</li>
                    <li>• Business intelligence: weather-based media spend recommendations</li>
                    <li>• Temperature, precipitation, wind, humidity, dew point, and cloud cover data</li>
                  </ul>
                  <p className="text-xs text-muted-foreground mt-2">
                    <strong>Getting started:</strong> Sign up for a free account at Weatherbit.io, 
                    create an API key, and paste it above. The free tier includes 500 calls/day, 
                    which is plenty for monitoring all parks with extended forecasts.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Current Model</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{currentModel}</p>
                    <p className="text-sm text-muted-foreground">
                      Change model in the header dropdown
                    </p>
                  </div>
                  <Badge variant="secondary">Active</Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Management */}
          <TabsContent value="data" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Backup & Restore
                </CardTitle>
                <CardDescription>
                  Export or import your conversations and settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={handleExportData}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export All Data
                </Button>

                <div>
                  <Input
                    id="import"
                    type="file"
                    accept=".json"
                    onChange={handleImportData}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => document.getElementById('import')?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Import Data
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <Trash2 className="h-5 w-5" />
                  Danger Zone
                </CardTitle>
                <CardDescription>
                  Permanently delete all data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={handleClearAllData}
                >
                  Clear All Data
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  This will delete all conversations, settings, and validation history.
                  This action cannot be undone.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* About */}
          <TabsContent value="about" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Six Flags Command Center</CardTitle>
                <CardDescription>Version 1.0.0</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-6">
                  <div className="text-6xl mb-4">🎢</div>
                  <h3 className="text-xl font-heading text-primary mb-2">
                    Making Media Planning Magical
                  </h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    A fun, theme park-inspired dashboard that connects to the Six Flags MCP
                    server via Anthropic's Claude models.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-4 bg-accent/5 rounded-lg">
                    <p className="text-3xl font-heading text-primary">29</p>
                    <p className="text-sm text-muted-foreground">Parks</p>
                  </div>
                  <div className="p-4 bg-accent/5 rounded-lg">
                    <p className="text-3xl font-heading text-primary">10</p>
                    <p className="text-sm text-muted-foreground">MCP Tools</p>
                  </div>
                  <div className="p-4 bg-accent/5 rounded-lg">
                    <p className="text-3xl font-heading text-primary">95+</p>
                    <p className="text-sm text-muted-foreground">DMAs Covered</p>
                  </div>
                  <div className="p-4 bg-accent/5 rounded-lg">
                    <p className="text-3xl font-heading text-primary">∞</p>
                    <p className="text-sm text-muted-foreground">Possibilities</p>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <h4 className="font-semibold">Features:</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>✓ Campaign & placement name validation</li>
                    <li>✓ 29-park portfolio intelligence</li>
                    <li>✓ DMA market analysis</li>
                    <li>✓ Cross-platform metric translation</li>
                    <li>✓ AI-powered insights with Claude</li>
                    <li>✓ Real-time MCP tool visualization</li>
                  </ul>
                </div>

                <div className="pt-4 border-t text-center text-xs text-muted-foreground">
                  <p>Built with ❤️ for Six Flags Media Planning Team</p>
                  <p className="mt-1">Powered by Anthropic Claude + MCP Protocol</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
