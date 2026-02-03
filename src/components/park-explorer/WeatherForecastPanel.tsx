import { useState, useEffect } from 'react';
import { Cloud, CloudRain, Sun, Wind, Droplets, TrendingUp, TrendingDown, AlertTriangle, AlertCircle } from 'lucide-react';
import type { Park } from '../../types';
import { weatherService, type ForecastDay as WeatherForecastDay, type WeatherAlert } from '../../services/weather';
import { storageService } from '../../services/storage';

interface WeatherForecastPanelProps {
  park: Park;
  onClose: () => void;
}

interface ForecastDay extends WeatherForecastDay {
  attendanceImpact: 'positive' | 'neutral' | 'negative';
  mediaSpendRecommendation: string;
}

export function WeatherForecastPanel({ park, onClose }: WeatherForecastPanelProps) {
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeatherForecast = async () => {
      try {
        setLoading(true);
        setError(null);

        // Initialize weather service
        const apiKey = storageService.getWeatherApiKey();
        if (!apiKey) {
          // Show user-friendly message when API key is missing
          setError('Weather API key not configured. Please add it in Settings.');
          setLoading(false);
          return;
        }

        weatherService.setApiKey(apiKey);

        const lat = parseFloat(park.location.coordinates.lat);
        const lon = parseFloat(park.location.coordinates.lon);

        // Fetch 16-day forecast and weather alerts in parallel
        const [weatherForecast, weatherAlerts] = await Promise.all([
          weatherService.getForecast(lat, lon),
          weatherService.getWeatherAlerts(lat, lon)
        ]);

        // Add business intelligence to each forecast day
        const forecastWithInsights: ForecastDay[] = weatherForecast.map(day => {
          const impact = weatherService.calculateBusinessImpact(day);
          
          return {
            ...day,
            attendanceImpact: impact.attendanceImpact,
            mediaSpendRecommendation: impact.mediaSpendRecommendation
          };
        });

        setForecast(forecastWithInsights);
        setAlerts(weatherAlerts);
      } catch (err) {
        // Only log and show errors that are not about missing API key
        const errorMessage = err instanceof Error ? err.message : 'Failed to load weather forecast';
        if (!errorMessage.includes('not configured')) {
          console.error('Error fetching weather forecast:', err);
          setError(errorMessage);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherForecast();
  }, [park]);

  const getWeatherIcon = (condition: string) => {
    if (condition.includes('Rain') || condition.includes('Storm')) return <CloudRain className="h-5 w-5" />;
    if (condition.includes('Cloud')) return <Cloud className="h-5 w-5" />;
    return <Sun className="h-5 w-5" />;
  };

  const getImpactBadge = (impact: 'positive' | 'neutral' | 'negative') => {
    const styles = {
      positive: 'bg-green-100 text-green-700 border-green-300',
      neutral: 'bg-gray-100 text-gray-700 border-gray-300',
      negative: 'bg-red-100 text-red-700 border-red-300'
    };
    
    const icons = {
      positive: <TrendingUp className="h-3 w-3" />,
      neutral: <span className="h-3 w-3">−</span>,
      negative: <TrendingDown className="h-3 w-3" />
    };
    
    const labels = {
      positive: 'High Attendance Expected',
      neutral: 'Normal Attendance',
      negative: 'Low Attendance Risk'
    };
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border ${styles[impact]}`}>
        {icons[impact]}
        {labels[impact]}
      </span>
    );
  };

  // Calculate weekly summary
  const weeklyImpact = {
    positive: forecast.slice(0, 7).filter(d => d.attendanceImpact === 'positive').length,
    neutral: forecast.slice(0, 7).filter(d => d.attendanceImpact === 'neutral').length,
    negative: forecast.slice(0, 7).filter(d => d.attendanceImpact === 'negative').length,
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-4xl w-full">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold text-primary mb-1">
              {park.product_name} Weather Forecast
            </h2>
            <p className="text-gray-600">
              {park.location.city}, {park.location.state}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gray-600">Loading real-time weather data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-4xl w-full">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold text-primary mb-1">
              {park.product_name} Weather Forecast
            </h2>
            <p className="text-gray-600">
              {park.location.city}, {park.location.state}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center max-w-md">
            <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-900 mb-2">Weather Data Unavailable</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <p className="text-sm text-gray-500">
              Please check your Weather API key in Settings and try again.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-xl p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-2xl font-bold text-primary mb-1">
            {park.product_name} Weather Forecast
          </h2>
          <p className="text-gray-600">
            {park.location.city}, {park.location.state}
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Weather Alerts */}
      {alerts.length > 0 && (
        <div className="mb-6 space-y-2">
          {alerts.map((alert, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-lg border-l-4 ${
                alert.severity === 'Extreme' || alert.severity === 'Severe'
                  ? 'bg-red-50 border-red-600'
                  : 'bg-yellow-50 border-yellow-600'
              }`}
            >
              <div className="flex items-start gap-3">
                <AlertCircle className={`h-5 w-5 mt-0.5 ${
                  alert.severity === 'Extreme' || alert.severity === 'Severe'
                    ? 'text-red-600'
                    : 'text-yellow-600'
                }`} />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-gray-900">{alert.title}</h4>
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${
                      alert.severity === 'Extreme' || alert.severity === 'Severe'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {alert.severity}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{alert.description}</p>
                  <div className="text-xs text-gray-600">
                    Effective: {new Date(alert.effective).toLocaleString()} • 
                    Expires: {new Date(alert.expires).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Weekly Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{weeklyImpact.positive}</div>
          <div className="text-xs text-gray-600">Favorable Days</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-600">{weeklyImpact.neutral}</div>
          <div className="text-xs text-gray-600">Normal Days</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">{weeklyImpact.negative}</div>
          <div className="text-xs text-gray-600">Risk Days</div>
        </div>
      </div>

      {/* 16-Day Forecast */}
      <div className="space-y-3">
        {forecast.map((day, idx) => (
          <div
            key={idx}
            className={`border rounded-lg p-4 transition-all hover:shadow-md ${
              day.attendanceImpact === 'positive' ? 'border-green-200 bg-green-50/30' :
              day.attendanceImpact === 'negative' ? 'border-red-200 bg-red-50/30' :
              'border-gray-200 bg-white'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                <div className="text-center min-w-[60px]">
                  <div className="text-lg font-bold text-gray-900">{day.day}</div>
                  <div className="text-sm text-gray-600">{day.date}</div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-gray-700">
                    {getWeatherIcon(day.condition)}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{day.condition}</div>
                    <div className="text-sm text-gray-600">
                      <span className="font-semibold text-gray-900">{day.high}°</span>
                      {' / '}
                      <span className="text-gray-600">{day.low}°</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Droplets className="h-4 w-4" />
                    {day.precipChance}%
                  </div>
                  <div className="flex items-center gap-1">
                    <Wind className="h-4 w-4" />
                    {day.wind} mph
                  </div>
                </div>
              </div>

              <div className="text-right">
                {getImpactBadge(day.attendanceImpact)}
              </div>
            </div>

            {/* Media Spend Recommendation */}
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex items-start gap-2">
                <div className="mt-0.5">
                  <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-sm">
                  <strong className="text-gray-900">Media Spend Strategy:</strong>{' '}
                  <span className="text-gray-700">{day.mediaSpendRecommendation}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Note */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-900">
          <strong>💡 Pro Tip:</strong> Weather-based media optimization can improve ROI by 20-35%. 
          Adjust daily spend based on forecast to maximize attendance on favorable days and minimize waste during poor weather.
        </p>
        <p className="text-xs text-gray-600 mt-2">
          Data powered by Weatherbit API • Updated in real-time • 16-day forecast with alerts
        </p>
      </div>
    </div>
  );
}
