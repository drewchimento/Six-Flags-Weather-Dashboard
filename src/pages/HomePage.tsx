import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { MessageSquare, Map, CheckCircle, Languages, TrendingUp, Zap } from 'lucide-react';
import { QUICK_ACTIONS } from '../constants/quick-actions';

export function HomePage() {
  const stats = [
    { label: '29 Parks', value: '29', icon: '🎢', color: 'text-primary' },
    { label: 'MCP Tools', value: '10', icon: '🛠️', color: 'text-secondary' },
    { label: 'Validations Today', value: '247', icon: '✓', color: 'text-green-600' },
    { label: 'Markets Covered', value: '95+', icon: '📍', color: 'text-blue-600' }
  ];

  const features = [
    {
      title: 'The Expert',
      description: 'Chat with your AI-powered Six Flags media planning assistant',
      icon: MessageSquare,
      link: '/chat',
      color: 'bg-primary/10 text-primary'
    },
    {
      title: 'Park Map',
      description: 'Explore all 29 parks with interactive visualization',
      icon: Map,
      link: '/parks',
      color: 'bg-secondary/10 text-secondary'
    },
    {
      title: 'Quality Check',
      description: 'Validate campaign and placement names instantly',
      icon: CheckCircle,
      link: '/validator',
      color: 'bg-green-600/10 text-green-600'
    },
    {
      title: 'Decoder Ring',
      description: 'Translate metrics across all platforms',
      icon: Languages,
      link: '/translator',
      color: 'bg-purple-600/10 text-purple-600'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4 py-12">
        <div className="flex items-center justify-center gap-4 mb-4">
          <span className="text-6xl animate-rollercoaster">🎢</span>
          <div className="text-left">
            <h1 className="text-5xl font-heading text-primary mb-2">
              Welcome to the Six Flags Command Center
            </h1>
            <p className="text-xl text-muted-foreground">
              Your AI-powered hub for media planning excellence
            </p>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-lg p-6 max-w-3xl mx-auto">
          <p className="text-lg">
            Connected to our complete park intelligence system with <strong>29 parks</strong>, 
            market data, and naming convention expertise. Ready to make your planning faster and smarter! ✨
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="border-2 hover:border-primary/50 transition-colors">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className={`text-3xl font-heading ${stat.color}`}>{stat.value}</p>
                </div>
                <span className="text-4xl">{stat.icon}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Features Grid */}
      <div>
        <h2 className="text-2xl font-heading text-foreground mb-4 flex items-center gap-2">
          <Zap className="h-6 w-6 text-accent" />
          Quick Access
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Link key={index} to={feature.link}>
                <Card className="h-full border-2 hover:border-primary/50 transition-all hover:shadow-lg">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-lg ${feature.color}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{feature.title}</CardTitle>
                        <CardDescription>{feature.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-heading text-foreground mb-4 flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-accent" />
          Popular Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {QUICK_ACTIONS.slice(0, 6).map((action) => (
            <Link key={action.id} to={`/chat?action=${action.id}`}>
              <Card className="h-full hover:border-primary/50 transition-all hover:shadow-md">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{action.icon}</span>
                    <div>
                      <h3 className="font-semibold mb-1">{action.title}</h3>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                      <Badge variant="outline" className="mt-2">
                        {action.category}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Getting Started */}
      <Card className="border-2 border-accent/50 bg-accent/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">🎫</span>
            Getting Started
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  1
                </div>
                <h4 className="font-semibold">Ask Questions</h4>
              </div>
              <p className="text-sm text-muted-foreground ml-10">
                Go to The Expert and ask about parks, markets, or campaigns
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  2
                </div>
                <h4 className="font-semibold">Validate Names</h4>
              </div>
              <p className="text-sm text-muted-foreground ml-10">
                Use Quality Check to validate campaign and placement names
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  3
                </div>
                <h4 className="font-semibold">Explore Data</h4>
              </div>
              <p className="text-sm text-muted-foreground ml-10">
                Browse Park Map to see all 29 parks and their market coverage
              </p>
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <Link to="/chat">
              <Button size="lg" className="w-full md:w-auto">
                <MessageSquare className="mr-2 h-5 w-5" />
                Start Your First Conversation
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Footer Info */}
      <div className="text-center text-sm text-muted-foreground space-y-2 py-8">
        <p className="flex items-center justify-center gap-2">
          <span className="text-lg">🎡</span>
          Powered by Claude AI + Six Flags MCP Server
        </p>
        <p>Making media planning magical since 2025 ✨</p>
      </div>
    </div>
  );
}
