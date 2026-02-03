import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Button } from '../components/ui/button';
import { Search, MapPin, Star, Map as MapIcon, List, Cloud } from 'lucide-react';
import { PARKS_DATA, PARK_TIERS, PARK_BRANDS, PARK_REGIONS } from '../constants/parks';
import { InteractiveMap } from '../components/park-explorer/InteractiveMap';
import { WeatherForecastPanel } from '../components/park-explorer/WeatherForecastPanel';

export function ParksPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [brandFilter, setBrandFilter] = useState<string>('all');
  const [regionFilter, setRegionFilter] = useState<string>('all');
  const [selectedPark, setSelectedPark] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [showWeatherRadar, setShowWeatherRadar] = useState(true);
  const [showForecast, setShowForecast] = useState(true);
  const [showWeatherPanel, setShowWeatherPanel] = useState(false);

  const filteredParks = useMemo(() => {
    return PARKS_DATA.filter(park => {
      const matchesSearch = 
        park.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        park.product_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        park.location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        park.location.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
        park.primary_dmas.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTier = tierFilter === 'all' || park.tier === tierFilter;
      const matchesBrand = brandFilter === 'all' || park.brand === brandFilter;
      const matchesRegion = regionFilter === 'all' || park.location.region === regionFilter;

      return matchesSearch && matchesTier && matchesBrand && matchesRegion;
    });
  }, [searchQuery, tierFilter, brandFilter, regionFilter]);

  const selectedParkData = useMemo(() => {
    return PARKS_DATA.find(p => p.product_code === selectedPark);
  }, [selectedPark]);

  const getTierBadgeColor = (tier: string) => {
    switch (tier) {
      case '1': return 'bg-primary text-primary-foreground';
      case '2': return 'bg-secondary text-secondary-foreground';
      case '3': return 'bg-accent text-accent-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b bg-card px-6 py-4">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-heading text-primary flex items-center gap-2">
            <span className="text-3xl">🗺️</span>
            Park Map
          </h1>
          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex border rounded-lg overflow-hidden">
              <Button
                variant={viewMode === 'map' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('map')}
                className="rounded-none"
              >
                <MapIcon className="h-4 w-4 mr-2" />
                Map View
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-none"
              >
                <List className="h-4 w-4 mr-2" />
                List View
              </Button>
            </div>
            
            {/* Weather Controls */}
            {viewMode === 'map' && (
              <div className="flex gap-2">
                <Button
                  variant={showWeatherRadar ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setShowWeatherRadar(!showWeatherRadar)}
                >
                  <Cloud className="h-4 w-4 mr-2" />
                  Weather Radar
                </Button>
                <Button
                  variant={showForecast ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setShowForecast(!showForecast)}
                >
                  Forecast
                </Button>
              </div>
            )}
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Explore all {PARKS_DATA.length} Six Flags parks with market intelligence and weather-based optimization
        </p>
      </div>

      <div className="flex-1 overflow-hidden flex">
        {/* Filters & List */}
        <div className="w-96 border-r flex flex-col bg-card">
          {/* Search & Filters */}
          <div className="p-4 space-y-3 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search parks, cities, DMAs..."
                className="pl-9"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <Select value={tierFilter} onValueChange={setTierFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Tier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tiers</SelectItem>
                  {PARK_TIERS.map(tier => (
                    <SelectItem key={tier} value={tier}>Tier {tier}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={brandFilter} onValueChange={setBrandFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Brand" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Brands</SelectItem>
                  {PARK_BRANDS.map(brand => (
                    <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={regionFilter} onValueChange={setRegionFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  {PARK_REGIONS.map(region => (
                    <SelectItem key={region} value={region}>{region}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="text-xs text-muted-foreground">
              Showing {filteredParks.length} of {PARKS_DATA.length} parks
            </div>
          </div>

          {/* Parks List */}
          <div className="flex-1 overflow-y-auto p-2">
            <div className="space-y-2">
              {filteredParks.map((park) => (
                <Card
                  key={park.product_code}
                  className={`cursor-pointer transition-all hover:border-primary/50 ${
                    selectedPark === park.product_code ? 'border-primary border-2' : ''
                  }`}
                  onClick={() => setSelectedPark(park.product_code)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="font-semibold text-sm">{park.product_name}</h3>
                        <p className="text-xs text-muted-foreground">
                          {park.location.city}, {park.location.state}
                        </p>
                      </div>
                      <Badge className={getTierBadgeColor(park.tier)}>
                        Tier {park.tier}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <span className="font-mono font-semibold">{park.product_code}</span>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-muted-foreground">{park.brand}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Area - Map or Details */}
        <div className="flex-1 overflow-hidden relative">
          {viewMode === 'map' ? (
            <div className="h-full w-full">
              <InteractiveMap
                parks={filteredParks}
                selectedPark={selectedPark}
                onParkSelect={setSelectedPark}
                showWeatherRadar={showWeatherRadar}
                showForecast={showForecast}
              />
            </div>
          ) : (
            <div className="h-full overflow-y-auto p-6">
              {selectedParkData ? (
            <div className="max-w-3xl mx-auto space-y-6">
              {/* Park Header */}
              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl flex items-center gap-3">
                        <span className="text-4xl">🎢</span>
                        {selectedParkData.product_name}
                      </CardTitle>
                      <CardDescription className="text-base mt-2">
                        {selectedParkData.location.address}
                      </CardDescription>
                    </div>
                    <Badge className={`${getTierBadgeColor(selectedParkData.tier)} text-lg py-1 px-3`}>
                      Tier {selectedParkData.tier}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Product Code</p>
                      <p className="font-mono font-semibold text-lg">{selectedParkData.product_code}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Brand</p>
                      <p className="font-semibold text-lg">{selectedParkData.brand}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Region</p>
                      <p className="font-semibold">{selectedParkData.location.region}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Coordinates</p>
                      <p className="font-mono text-xs">
                        {selectedParkData.location.coordinates.lat}, {selectedParkData.location.coordinates.lon}
                      </p>
                    </div>
                  </div>

                  {selectedParkData.location.unique_feature && (
                    <div className="bg-accent/20 rounded-lg p-3 flex items-start gap-2">
                      <Star className="h-4 w-4 text-accent mt-0.5" />
                      <p className="text-sm">{selectedParkData.location.unique_feature}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* DMA Coverage */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    DMA Coverage
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground mb-2">Primary DMAs</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedParkData.primary_dmas.split(', ').map((dma) => (
                        <Badge key={dma} variant="default" className="bg-primary">
                          {dma}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {selectedParkData.secondary_dmas.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground mb-2">Secondary DMAs</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedParkData.secondary_dmas.map((dma) => (
                          <Badge key={dma} variant="outline">
                            {dma}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Strategic Insights */}
              <Card className="border-accent/50 bg-accent/5">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <span className="text-xl">💡</span>
                    Strategic Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p>
                    • <strong>Market Priority:</strong> Tier {selectedParkData.tier} park with {selectedParkData.primary_dmas.split(', ').length} primary DMA{selectedParkData.primary_dmas.split(', ').length > 1 ? 's' : ''}
                  </p>
                  <p>
                    • <strong>Brand Family:</strong> {selectedParkData.brand} portfolio
                  </p>
                  <p>
                    • <strong>Geographic Reach:</strong> {selectedParkData.location.region} region
                  </p>
                  {selectedParkData.secondary_dmas.length > 0 && (
                    <p>
                      • <strong>Extended Coverage:</strong> {selectedParkData.secondary_dmas.length} secondary market{selectedParkData.secondary_dmas.length > 1 ? 's' : ''}
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Weather Forecast Button */}
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Cloud className="h-8 w-8 text-blue-600" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Weather-Based Media Optimization</h4>
                      <p className="text-sm text-gray-600">View 14-day forecast with attendance impact analysis</p>
                    </div>
                  </div>
                  <Button onClick={() => setShowWeatherPanel(true)}>
                    View Forecast
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-center">
              <div className="space-y-4">
                <div className="text-6xl mb-4">🗺️</div>
                <h3 className="text-2xl font-heading text-muted-foreground">
                  Select a park to view details
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Click on any park from the list to see comprehensive market intelligence,
                  DMA coverage, and strategic insights.
                </p>
              </div>
            </div>
          )}
            </div>
          )}
        </div>
      </div>

      {/* Weather Forecast Modal */}
      {showWeatherPanel && selectedParkData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <WeatherForecastPanel
            park={selectedParkData}
            onClose={() => setShowWeatherPanel(false)}
          />
        </div>
      )}
    </div>
  );
}
