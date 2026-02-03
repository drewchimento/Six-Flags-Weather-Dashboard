import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { ScrollArea } from '../components/ui/scroll-area';
import { Send, Loader2, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { anthropicService } from '../services/anthropic';
import { storageService } from '../services/storage';
import type { Message, ToolCall, ClaudeModel } from '../types';
import { QUICK_ACTIONS } from '../constants/quick-actions';

interface ChatPageProps {
  model: ClaudeModel;
  isConfigured: boolean;
}

export function ChatPage({ model, isConfigured }: ChatPageProps) {
  const [searchParams] = useSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeToolCalls, setActiveToolCalls] = useState<ToolCall[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check for quick action in URL
    const actionId = searchParams.get('action');
    if (actionId) {
      const action = QUICK_ACTIONS.find(a => a.id === actionId);
      if (action) {
        setInput(action.prompt);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    // Load welcome message only once
    if (messages.length === 0) {
      setMessages([{
        id: '1',
        role: 'assistant',
        content: `Welcome to the Six Flags Command Center! 🎢

I'm your AI-powered Six Flags expert, connected to our complete park intelligence system with 29 parks, market data, and naming convention expertise.

**What I can help with:**
• Validate campaign & placement names before MediaOcean entry
• Search our 29-park portfolio and analyze market coverage
• Translate metrics from any platform to Six Flags standards
• Generate properly formatted campaign names
• Answer strategic questions about parks, markets, and planning

**Get started:**
• Try a quick action from the sidebar
• Upload a file and ask me to analyze it
• Just ask me a question!

Let's make some Six Flags magic happen! ✨`,
        timestamp: Date.now()
      }]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeToolCalls]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    if (!isConfigured) {
      toast.error('Please configure your Anthropic API key in settings first');
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setActiveToolCalls([]);

    try {
      const { response, toolCalls } = await anthropicService.sendMessage(
        [...messages, userMessage].map(m => ({ role: m.role, content: m.content })),
        model,
        undefined,
        (tool) => {
          setActiveToolCalls(prev => [...prev, tool]);
        }
      );

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: Date.now(),
        toolCalls: toolCalls
      };

      setMessages(prev => [...prev, assistantMessage]);
      setActiveToolCalls([]);
    } catch (error) {
      console.error('Chat error:', error);
      toast.error('Failed to send message. Please check your API key and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Chat Header */}
      <div className="border-b bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-heading text-primary flex items-center gap-2">
              <span className="text-3xl">🎪</span>
              The Expert
            </h1>
            <p className="text-sm text-muted-foreground">Your AI-powered Six Flags assistant</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              Connected
            </Badge>
            <Badge variant="secondary">{model.includes('opus') ? 'Opus 4.1' : 'Sonnet 4.5'}</Badge>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <Card className={`max-w-[80%] ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-card'}`}>
                <div className="p-4 space-y-3">
                  {message.role === 'assistant' && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <span className="text-lg">🤖</span>
                      <span className="font-semibold">Six Flags Expert</span>
                    </div>
                  )}
                  
                  <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                    {message.content}
                  </div>

                  {message.toolCalls && message.toolCalls.length > 0 && (
                    <div className="space-y-2 pt-2 border-t">
                      {message.toolCalls.map((tool) => (
                        <div key={tool.id} className="flex items-center gap-2 text-xs">
                          <span className="animate-rollercoaster">🎢</span>
                          <span className="font-semibold">Riding: {tool.name.replace('sixflags_', '')}</span>
                          {tool.duration && <span className="text-muted-foreground">({tool.duration}ms)</span>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            </div>
          ))}

          {/* Active Tool Calls */}
          {activeToolCalls.length > 0 && (
            <div className="flex justify-start">
              <Card className="bg-accent/50">
                <div className="p-4 space-y-2">
                  {activeToolCalls.map((tool) => (
                    <div key={tool.id} className="flex items-center gap-2 text-sm">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="font-semibold">🎢 Riding: {tool.name.replace('sixflags_', '')}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {isLoading && activeToolCalls.length === 0 && (
            <div className="flex justify-start">
              <Card className="bg-accent/50">
                <div className="p-4 flex items-center gap-2 text-sm">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Thinking...</span>
                </div>
              </Card>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t bg-card p-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {!isConfigured && (
            <div className="bg-destructive/10 text-destructive rounded-lg p-3 text-sm">
              <strong>⚠️ API Key Required:</strong> Configure your Anthropic API key in Settings to start chatting.
            </div>
          )}

          <div className="flex gap-2">
            <Button variant="outline" size="icon" disabled={isLoading}>
              <Upload className="h-4 w-4" />
            </Button>
            
            <div className="flex-1 relative">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about Six Flags media planning..."
                disabled={isLoading || !isConfigured}
                className="pr-12"
              />
            </div>

            <Button onClick={handleSend} disabled={isLoading || !isConfigured}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>💡 Tip:</span>
            <span>Try "Validate CDFR_SFGA_DISP_MPART_X_X_Q3Q4_JUL2025_NOV2025" or "Which parks serve Chicago?"</span>
          </div>
        </div>
      </div>
    </div>
  );
}
