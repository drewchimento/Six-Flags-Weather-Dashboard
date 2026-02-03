import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { ArrowRight, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

const COMMON_METRICS = [
  { platform: 'Meta', original: 'Amount spent', standard: 'media_spend' },
  { platform: 'Meta', original: 'Impressions', standard: 'impressions' },
  { platform: 'Meta', original: 'Link clicks', standard: 'clicks' },
  { platform: 'Pinterest', original: 'Total spend', standard: 'media_spend' },
  { platform: 'Pinterest', original: 'Impression', standard: 'impressions' },
  { platform: 'DCM', original: 'Media Cost', standard: 'media_spend' },
  { platform: 'DCM', original: 'IMPs', standard: 'impressions' },
  { platform: 'MediaOcean', original: 'Cost', standard: 'media_spend' }
];

export function TranslatorPage() {
  const [inputMetrics, setInputMetrics] = useState('');
  const [translations, setTranslations] = useState<any[]>([]);
  const [isTranslating, setIsTranslating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleTranslate = async () => {
    if (!inputMetrics.trim()) {
      toast.error('Please enter metrics to translate');
      return;
    }

    setIsTranslating(true);
    setTranslations([]);

    try {
      // Simulate translation (in production, this would call the MCP server)
      await new Promise(resolve => setTimeout(resolve, 800));

      const metrics = inputMetrics.split(',').map(m => m.trim()).filter(m => m);
      const results = metrics.map(metric => {
        const found = COMMON_METRICS.find(m => 
          m.original.toLowerCase() === metric.toLowerCase()
        );

        if (found) {
          return {
            original: metric,
            standard: found.standard,
            platform: found.platform,
            status: 'found'
          };
        }

        return {
          original: metric,
          standard: metric.toLowerCase().replace(/\s+/g, '_'),
          platform: 'Unknown',
          status: 'unmapped'
        };
      });

      setTranslations(results);
      toast.success(`Translated ${results.filter(r => r.status === 'found').length} of ${metrics.length} metrics`);
    } catch (error) {
      toast.error('Translation failed. Please try again.');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleCopyStandard = () => {
    const standardNames = translations.map(t => t.standard).join(', ');
    navigator.clipboard.writeText(standardNames);
    setCopied(true);
    toast.success('Copied standard names to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-5xl mx-auto p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-heading text-primary flex items-center justify-center gap-3">
            <span className="text-4xl">🔄</span>
            Decoder Ring
          </h1>
          <p className="text-muted-foreground">
            Translate platform-specific metrics to Six Flags standards
          </p>
        </div>

        {/* Input Card */}
        <Card>
          <CardHeader>
            <CardTitle>Enter Metric Names</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Metric Names (comma-separated)</label>
              <Textarea
                value={inputMetrics}
                onChange={(e) => setInputMetrics(e.target.value)}
                placeholder="Amount spent, Impressions, Link clicks, CTR, CPM"
                rows={5}
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">
                Enter metric names from any platform (Meta, Pinterest, DCM, MediaOcean, etc.)
              </p>
            </div>

            <Button
              onClick={handleTranslate}
              disabled={!inputMetrics.trim() || isTranslating}
              className="w-full"
            >
              {isTranslating ? 'Translating...' : 'Translate Metrics'}
            </Button>
          </CardContent>
        </Card>

        {/* Translation Results */}
        {translations.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Translation Results</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyStandard}
                >
                  {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                  Copy Standard Names
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {translations.map((translation, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 bg-accent/5 rounded-lg border"
                  >
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground mb-1">Platform Name</p>
                      <p className="font-mono font-semibold">{translation.original}</p>
                      {translation.platform !== 'Unknown' && (
                        <Badge variant="outline" className="mt-2">
                          {translation.platform}
                        </Badge>
                      )}
                    </div>

                    <ArrowRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />

                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground mb-1">Six Flags Standard</p>
                      <p className="font-mono font-semibold text-primary">{translation.standard}</p>
                      {translation.status === 'found' ? (
                        <Badge className="mt-2 bg-green-600">Mapped</Badge>
                      ) : (
                        <Badge variant="destructive" className="mt-2">Unmapped</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {translations.some(t => t.status === 'unmapped') && (
                <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
                  <p className="text-sm font-semibold text-amber-800 dark:text-amber-200 mb-1">
                    ⚠️ Unmapped Metrics Found
                  </p>
                  <p className="text-xs text-amber-700 dark:text-amber-300">
                    Some metrics don't have standard mappings. These may be platform-specific
                    or need to be added to the translation table.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Common Metrics Reference */}
        <Card className="border-accent/50 bg-accent/5">
          <CardHeader>
            <CardTitle className="text-base">Common Metric Translations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-sm mb-3">Spend Metrics</h4>
                <div className="space-y-2">
                  {['Amount spent', 'Total spend', 'Media Cost', 'Cost'].map(metric => (
                    <div key={metric} className="flex items-center gap-2 text-sm">
                      <code className="bg-background px-2 py-1 rounded">{metric}</code>
                      <ArrowRight className="h-3 w-3 text-muted-foreground" />
                      <code className="bg-primary/10 text-primary px-2 py-1 rounded">media_spend</code>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-sm mb-3">Performance Metrics</h4>
                <div className="space-y-2">
                  {[
                    { from: 'Impressions / IMPs', to: 'impressions' },
                    { from: 'Link clicks / Clicks', to: 'clicks' },
                    { from: 'CTR', to: 'click_through_rate' },
                    { from: 'CPM', to: 'cost_per_thousand' }
                  ].map((metric, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <code className="bg-background px-2 py-1 rounded text-xs">{metric.from}</code>
                      <ArrowRight className="h-3 w-3 text-muted-foreground" />
                      <code className="bg-primary/10 text-primary px-2 py-1 rounded text-xs">{metric.to}</code>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <p className="text-xs text-muted-foreground">
                💡 <strong>Tip:</strong> Copy and paste column headers from your platform exports
                to quickly translate entire datasets.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Examples */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Try These Examples</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start text-left font-mono text-sm"
              onClick={() => setInputMetrics('Amount spent, Impressions, Link clicks, CTR')}
            >
              Meta Ads: Amount spent, Impressions, Link clicks, CTR
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-mono text-sm"
              onClick={() => setInputMetrics('Media Cost, IMPs, Clicks, CPM, CPC')}
            >
              DCM: Media Cost, IMPs, Clicks, CPM, CPC
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-mono text-sm"
              onClick={() => setInputMetrics('Total spend, Impression, Pin click, Engagement rate')}
            >
              Pinterest: Total spend, Impression, Pin click, Engagement rate
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
