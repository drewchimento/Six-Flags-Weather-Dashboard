import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, LayersControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Park } from '../../types';
import { Cloud, CloudRain, Sun, Wind, AlertTriangle } from 'lucide-react';
import { weatherService } from '../../services/weather';
import { storageService } from '../../services/storage';

// Fix for default marker icon in Leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface InteractiveMapProps {
  parks: Park[];
  selectedPark: string | null;
  onParkSelect: (productCode: string) => void;
  showWeatherRadar: boolean;
  showForecast: boolean;
}

import type { WeatherForecast } from '../../services/weather';

const createParkIcon = (tier: string) => {
  const color = tier === '1' ? '#E31E24' : tier === '2' ? '#0033A0' : '#FFD100';
  
  return L.divIcon({
    className: 'custom-park-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        color: white;
        font-size: 14px;
      ">🎢</div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
};

export function InteractiveMap({ 
  parks, 
  selectedPark, 
  onParkSelect,
  showWeatherRadar,
  showForecast 
}: InteractiveMapProps) {
  const [weatherData, setWeatherData] = useState<Record<string, WeatherForecast>>({});
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const [radarTileUrl, setRadarTileUrl] = useState<string>('');

  // Center of the US for initial view
  const center: [number, number] = [39.8283, -98.5795];

  useEffect(() => {
    // Initialize weather service with API key from storage
    const apiKey = storageService.getWeatherApiKey();
    if (apiKey) {
      weatherService.setApiKey(apiKey);
    }

    // Fetch radar tile URL when weather radar is enabled
    if (showWeatherRadar && weatherService.isConfigured()) {
      fetchRadarUrl();
    }

    // Only fetch if weather features are enabled AND API key is configured
    if ((showForecast || showWeatherRadar) && weatherService.isConfigured()) {
      fetchWeatherData();
    } else if ((showForecast || showWeatherRadar) && !weatherService.isConfigured()) {
      // Silently skip weather data fetch - don't show error
      setWeatherError(null);
      setWeatherData({});
    } else {
      // Weather features disabled, clear any errors
      setWeatherError(null);
    }
  }, [showForecast, showWeatherRadar, parks]);

  const fetchRadarUrl = async () => {
    try {
      const url = await weatherService.getRadarTileUrl();
      setRadarTileUrl(url);
    } catch (error) {
      console.error('Error fetching radar tile URL:', error);
      // Fallback to OpenWeatherMap precipitation layer
      setRadarTileUrl('https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=demo');
    }
  };

  const fetchWeatherData = async () => {
    setWeatherLoading(true);
    setWeatherError(null);
    
    try {
      const parksWithCoords = parks.map(park => ({
        code: park.product_code,
        lat: parseFloat(park.location.coordinates.lat),
        lon: parseFloat(park.location.coordinates.lon)
      }));

      const weatherMap = await weatherService.getWeatherForParks(parksWithCoords);
      
      const weatherDataObject: Record<string, WeatherForecast> = {};
      weatherMap.forEach((weather, code) => {
        weatherDataObject[code] = weather;
      });
      
      setWeatherData(weatherDataObject);
    } catch (error) {
      // Only show error if it's not about missing API key
      const errorMessage = error instanceof Error ? error.message : 'Failed to load weather data';
      if (!errorMessage.includes('not configured')) {
        console.error('Error fetching weather data:', error);
        setWeatherError(errorMessage);
      }
    } finally {
      setWeatherLoading(false);
    }
  };

  const getWeatherIcon = (condition: string) => {
    if (condition.includes('Rain') || condition.includes('Storm')) return <CloudRain className="h-4 w-4" />;
    if (condition.includes('Cloud')) return <Cloud className="h-4 w-4" />;
    return <Sun className="h-4 w-4" />;
  };



  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={center}
        zoom={4}
        className="h-full w-full rounded-lg"
        style={{ zIndex: 0 }}
      >
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Street Map">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
          </LayersControl.BaseLayer>
          
          <LayersControl.BaseLayer name="Satellite">
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution='&copy; Esri'
            />
          </LayersControl.BaseLayer>

          {showWeatherRadar && weatherService.isConfigured() && radarTileUrl && (
            <>
              <LayersControl.Overlay checked name="Weather Radar (Precipitation)">
                <TileLayer
                  url={radarTileUrl}
                  attribution='Weather data &copy; RainViewer'
                  opacity={0.6}
                />
              </LayersControl.Overlay>

              <LayersControl.Overlay name="Temperature">
                <TileLayer
                  url={weatherService.getTemperatureTileUrl()}
                  attribution='Weather data &copy; OpenWeatherMap'
                  opacity={0.5}
                />
              </LayersControl.Overlay>

              <LayersControl.Overlay name="Clouds">
                <TileLayer
                  url={weatherService.getCloudsTileUrl()}
                  attribution='Weather data &copy; OpenWeatherMap'
                  opacity={0.4}
                />
              </LayersControl.Overlay>

              <LayersControl.Overlay name="Wind">
                <TileLayer
                  url={weatherService.getWindTileUrl()}
                  attribution='Weather data &copy; OpenWeatherMap'
                  opacity={0.5}
                />
              </LayersControl.Overlay>
            </>
          )}
        </LayersControl>

        {parks.map((park) => {
          const lat = parseFloat(park.location.coordinates.lat);
          const lon = parseFloat(park.location.coordinates.lon);
          const weatherForecast = weatherData[park.product_code];
          const weather = weatherForecast?.current;

          return (
            <Marker
              key={park.product_code}
              position={[lat, lon]}
              icon={createParkIcon(park.tier)}
              eventHandlers={{
                click: () => onParkSelect(park.product_code)
              }}
            >
              <Popup className="park-popup" maxWidth={350}>
                <div className="p-2">
                  <h3 className="text-lg font-bold text-primary mb-1">
                    {park.product_name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {park.location.city}, {park.location.state}
                  </p>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      park.tier === '1' ? 'bg-red-100 text-red-700' :
                      park.tier === '2' ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      Tier {park.tier}
                    </span>
                    <span className="px-2 py-1 rounded text-xs font-semibold bg-gray-100 text-gray-700">
                      {park.brand}
                    </span>
                  </div>

                  <div className="text-sm text-gray-700 mb-2">
                    <strong>Primary DMAs:</strong> {park.primary_dmas}
                  </div>

                  {showForecast && weather && weatherForecast && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                        {getWeatherIcon(weather.condition)}
                        Current Weather
                      </h4>
                      
                      <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                        <div>
                          <span className="text-gray-600">Temp:</span>{' '}
                          <strong>{weather.temp}°F</strong>
                        </div>
                        <div>
                          <span className="text-gray-600">Wind:</span>{' '}
                          <strong>{weather.wind} mph</strong>
                        </div>
                        <div className="col-span-2">
                          <span className="text-gray-600">Condition:</span>{' '}
                          <strong>{weather.description}</strong>
                        </div>
                        <div className="col-span-2">
                          <span className="text-gray-600">Humidity:</span>{' '}
                          <strong>{weather.humidity}%</strong>
                        </div>
                      </div>

                      {(() => {
                        const impact = weatherService.calculateBusinessImpact(weather);
                        return (
                          <div className={`flex items-start gap-2 p-2 rounded text-xs ${
                            impact.level === 'high' ? 'bg-red-50' :
                            impact.level === 'medium' ? 'bg-yellow-50' :
                            'bg-green-50'
                          }`}>
                            {impact.level !== 'low' && <AlertTriangle className="h-3 w-3 mt-0.5" />}
                            <span className={impact.color}>{impact.message}</span>
                          </div>
                        );
                      })()}

                      <div className="mt-3">
                        <h5 className="font-semibold text-xs mb-1">7-Day Forecast</h5>
                        <div className="grid grid-cols-7 gap-1">
                          {weatherForecast.forecast.map((day, idx) => (
                            <div key={idx} className="text-center">
                              <div className="text-xs text-gray-600">{day.day}</div>
                              <div className="text-xs font-semibold">{day.high}°</div>
                              <div className="text-xs text-gray-500">{day.low}°</div>
                              <div className="text-xs text-blue-600">{day.precipChance}%</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {showForecast && !weather && weatherError && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="text-xs text-red-600 p-2 bg-red-50 rounded">
                        {weatherError}
                      </div>
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {weatherLoading && (
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 z-[1000]">
          <div className="flex items-center gap-2">
            <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
            <span className="text-sm text-gray-700">Loading real-time weather data...</span>
          </div>
        </div>
      )}

      {weatherError && !weatherLoading && (
        <div className="absolute top-4 right-4 bg-red-50 border border-red-200 rounded-lg shadow-lg p-3 z-[1000] max-w-xs">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
            <div>
              <div className="text-sm font-semibold text-red-900 mb-1">Weather Error</div>
              <div className="text-xs text-red-700">{weatherError}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
