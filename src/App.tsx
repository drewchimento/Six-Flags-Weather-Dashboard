import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import { Toaster } from './components/ui/sonner';
import { Header } from './components/layout/Header';
import { Navigation } from './components/layout/Navigation';
import { HomePage } from './pages/HomePage';
import { ChatPage } from './pages/ChatPage';
import { ParksPage } from './pages/ParksPage';
import { ValidatorPage } from './pages/ValidatorPage';
import { SettingsPage } from './pages/SettingsPage';
import { anthropicService } from './services/anthropic';
import { storageService } from './services/storage';
import type { ClaudeModel } from './types';
import './index.css';

function App() {
  const [model, setModel] = useState<ClaudeModel>('claude-sonnet-4-20250514');
  const [isConfigured, setIsConfigured] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    // Load saved model preference
    const savedModel = storageService.getModel();
    if (savedModel) {
      setModel(savedModel as ClaudeModel);
    }

    // Load API key
    const apiKey = storageService.getApiKey();
    if (apiKey) {
      anthropicService.setApiKey(apiKey);
      setIsConfigured(true);
    } else {
      setShowSettings(true);
    }
  }, []);

  const handleModelChange = (newModel: ClaudeModel) => {
    setModel(newModel);
    storageService.saveModel(newModel);
  };

  const handleSettingsClick = () => {
    setShowSettings(true);
  };

  const handleApiKeySaved = (apiKey: string) => {
    anthropicService.setApiKey(apiKey);
    storageService.saveApiKey(apiKey);
    setIsConfigured(true);
    setShowSettings(false);
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <BrowserRouter>
        <div className="h-screen flex flex-col">
          <Header
            model={model}
            onModelChange={handleModelChange}
            onSettingsClick={handleSettingsClick}
          />
          
          <div className="flex-1 flex overflow-hidden">
            <Navigation />
            
            <main className="flex-1 overflow-y-auto">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route 
                  path="/chat" 
                  element={<ChatPage model={model} isConfigured={isConfigured} />} 
                />
                <Route path="/parks" element={<ParksPage />} />
                <Route path="/validator" element={<ValidatorPage />} />
                <Route 
                  path="/settings" 
                  element={
                    <SettingsPage 
                      onApiKeySaved={handleApiKeySaved}
                      currentModel={model}
                    />
                  } 
                />
              </Routes>
            </main>
          </div>
        </div>
        
        <Toaster />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
