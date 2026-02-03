import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Copy, Clock, FileText, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

export function ValidatorPage() {
  const [campaignName, setCampaignName] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<any>(null);
  
  // IO vs Flowchart comparison
  const [ioData, setIoData] = useState('');
  const [flowchartData, setFlowchartData] = useState('');
  const [comparisonResult, setComparisonResult] = useState<any>(null);

  const validateCampaign = async () => {
    setIsValidating(true);
    // Simulate validation
    setTimeout(() => {
      setValidationResult({
        isValid: campaignName.includes('_') && campaignName.split('_').length >= 5,
        errors: campaignName.includes('_') && campaignName.split('_').length >= 5 
          ? [] 
          : ['Tag naming convention not followed', 'Missing required fields for proper Zimmerman dashboard mapping'],
        warnings: campaignName.length > 0 && campaignName.split('_').length < 9 
          ? ['Incomplete naming structure - may cause mapping issues'] 
          : [],
        components: {
          brand: campaignName.split('_')[0] || 'N/A',
          park: campaignName.split('_')[1] || 'N/A',
          channel: campaignName.split('_')[2] || 'N/A',
          partner: campaignName.split('_')[3] || 'N/A',
        },
      });
      setIsValidating(false);
    }, 1000);
  };

  const compareIOToFlowchart = async () => {
    setIsValidating(true);
    // Simulate comparison
    setTimeout(() => {
      setComparisonResult({
        matches: true,
        discrepancies: [
          { field: 'Budget', io: '$50,000', flowchart: '$55,000', severity: 'high' },
          { field: 'Flight Dates', io: '01/15-02/15', flowchart: '01/15-02/28', severity: 'medium' },
        ],
        tagNamingIssues: [
          { tag: 'SFDC_2024_Banner_300x250', issue: 'Missing park code', suggestion: 'Add park code after brand (e.g., SFDC_SFGA_2024_Banner_300x250)' },
        ],
      });
      setIsValidating(false);
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-primary">QA Center</h1>
          <p className="text-muted-foreground">
            Ensure IOs match flowcharts and tag naming conventions are followed for accurate Zimmerman dashboard mapping
          </p>
        </div>

        <Tabs defaultValue="naming" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="naming" className="gap-2">
              <Tag className="w-4 h-4" />
              Tag Naming Validation
            </TabsTrigger>
            <TabsTrigger value="io-check" className="gap-2">
              <FileText className="w-4 h-4" />
              IO vs Flowchart
            </TabsTrigger>
          </TabsList>

          <TabsContent value="naming" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tag Naming Convention Validator</CardTitle>
                <CardDescription>
                  Validate campaign and tag names to ensure proper mapping to Zimmerman dashboard
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g., SixFlags_SFDK_2024_Summer_Digital_Display"
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    onClick={validateCampaign}
                    disabled={!campaignName || isValidating}
                  >
                    {isValidating ? 'Validating...' : 'Validate'}
                  </Button>
                </div>

                {validationResult && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-4"
                  >
                    <div className={`p-4 rounded-lg border-2 ${
                      validationResult.isValid
                        ? 'border-success bg-success/10'
                        : 'border-error bg-error/10'
                    }`}>
                      <div className="flex items-center gap-2">
                        {validationResult.isValid ? (
                          <CheckCircle className="w-6 h-6 text-success" />
                        ) : (
                          <XCircle className="w-6 h-6 text-error" />
                        )}
                        <span className="font-bold">
                          {validationResult.isValid
                            ? '✅ Valid Tag Name - Ready for Zimmerman Dashboard'
                            : '❌ Invalid Tag Name - Will NOT map correctly'}
                        </span>
                      </div>
                    </div>

                    {validationResult.errors.length > 0 && (
                      <div className="space-y-2">
                        <h3 className="font-bold text-error">Critical Errors (Fix Required):</h3>
                        {validationResult.errors.map((error: string, i: number) => (
                          <div key={i} className="flex items-start gap-2 text-sm p-2 bg-error/10 rounded">
                            <XCircle className="w-4 h-4 text-error mt-0.5 flex-shrink-0" />
                            <span>{error}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {validationResult.warnings.length > 0 && (
                      <div className="space-y-2">
                        <h3 className="font-bold text-warning">Warnings (Recommended):</h3>
                        {validationResult.warnings.map((warning: string, i: number) => (
                          <div key={i} className="flex items-start gap-2 text-sm p-2 bg-warning/10 rounded">
                            <AlertCircle className="w-4 h-4 text-warning mt-0.5 flex-shrink-0" />
                            <span>{warning}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="space-y-2">
                      <h3 className="font-bold">Tag Components:</h3>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(validationResult.components).map(([key, value]) => (
                          <Badge key={key} variant="secondary">
                            {key}: {value as string}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigator.clipboard.writeText(campaignName)}
                      className="gap-2"
                    >
                      <Copy className="w-4 h-4" />
                      Copy Validated Name
                    </Button>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="io-check" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>IO vs Flowchart Comparison</CardTitle>
                <CardDescription>
                  Compare Mediaocean IO against flowchart to ensure accuracy before sending to buying partners
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Mediaocean IO Data</label>
                    <Textarea
                      placeholder="Paste IO data from Mediaocean..."
                      value={ioData}
                      onChange={(e) => setIoData(e.target.value)}
                      className="min-h-[200px] font-mono text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Flowchart Plan</label>
                    <Textarea
                      placeholder="Paste flowchart plan data..."
                      value={flowchartData}
                      onChange={(e) => setFlowchartData(e.target.value)}
                      className="min-h-[200px] font-mono text-sm"
                    />
                  </div>
                </div>

                <Button
                  onClick={compareIOToFlowchart}
                  disabled={!ioData || !flowchartData || isValidating}
                  className="w-full"
                >
                  {isValidating ? 'Analyzing...' : 'Compare IO to Flowchart'}
                </Button>

                {comparisonResult && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-4"
                  >
                    <div className={`p-4 rounded-lg border-2 ${
                      comparisonResult.matches && comparisonResult.discrepancies.length === 0
                        ? 'border-success bg-success/10'
                        : 'border-warning bg-warning/10'
                    }`}>
                      <div className="flex items-center gap-2">
                        {comparisonResult.matches && comparisonResult.discrepancies.length === 0 ? (
                          <CheckCircle className="w-6 h-6 text-success" />
                        ) : (
                          <AlertCircle className="w-6 h-6 text-warning" />
                        )}
                        <span className="font-bold">
                          {comparisonResult.discrepancies.length === 0
                            ? '✅ IO Matches Flowchart - Ready to Send'
                            : `⚠️ ${comparisonResult.discrepancies.length} Discrepancies Found`}
                        </span>
                      </div>
                    </div>

                    {comparisonResult.discrepancies.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">IO vs Flowchart Discrepancies</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {comparisonResult.discrepancies.map((item: any, i: number) => (
                              <div
                                key={i}
                                className={`p-3 rounded-lg border ${
                                  item.severity === 'high' ? 'border-error bg-error/5' : 'border-warning bg-warning/5'
                                }`}
                              >
                                <div className="flex items-start justify-between mb-2">
                                  <span className="font-bold">{item.field}</span>
                                  <Badge variant={item.severity === 'high' ? 'destructive' : 'secondary'}>
                                    {item.severity}
                                  </Badge>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                  <div>
                                    <span className="text-muted-foreground">IO:</span>{' '}
                                    <span className="font-mono">{item.io}</span>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Flowchart:</span>{' '}
                                    <span className="font-mono">{item.flowchart}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {comparisonResult.tagNamingIssues.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Tag Naming Issues</CardTitle>
                          <CardDescription>These tags will not map correctly to Zimmerman dashboard</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {comparisonResult.tagNamingIssues.map((item: any, i: number) => (
                              <div key={i} className="p-3 rounded-lg border border-error bg-error/5">
                                <div className="font-mono text-sm mb-2">{item.tag}</div>
                                <div className="text-sm text-error mb-1">
                                  <strong>Issue:</strong> {item.issue}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  <strong>Suggestion:</strong> {item.suggestion}
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle>Recent QA Checks</CardTitle>
            <CardDescription>Your recent validation and comparison history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                { name: 'SixFlags_SFDK_2024_Q2_Digital', status: 'passed', type: 'Tag Naming' },
                { name: 'Spring Campaign IO vs Flowchart', status: 'discrepancies', type: 'IO Check' },
                { name: 'SixFlags_SFMM_Banner_728x90', status: 'passed', type: 'Tag Naming' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {item.status === 'passed' ? (
                      <CheckCircle className="w-5 h-5 text-success" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-warning" />
                    )}
                    <div>
                      <span className="font-mono text-sm block">{item.name}</span>
                      <span className="text-xs text-muted-foreground">{item.type}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{i + 1} hours ago</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
