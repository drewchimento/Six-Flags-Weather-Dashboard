// Weather service for real-time weather data using Weatherbit API
// API Documentation: https://www.weatherbit.io/api

export interface WeatherData {
  temp: number;
  feelsLike: number;
  condition: string;
  description: string;
  wind: number;
  precipitation: number;
  humidity: number;
  pressure: number;
  visibility: number;
  clouds: number;
  uv: number;
  dewPoint: number;
  airQuality: number;
  icon: string;
}

export interface ForecastDay {
  date: string;
  day: string;
  high: number;
  low: number;
  condition: string;
  description: string;
  precipChance: number;
  wind: number;
  humidity: number;
  uv: number;
  icon: string;
}

export interface WeatherForecast {
  current: WeatherData;
  forecast: ForecastDay[];
}

export interface WeatherAlert {
  title: string;
  description: string;
  severity: string;
  regions: string[];
  effective: string;
  expires: string;
}

class WeatherService {
  private apiKey: string = '3737b70c160141fc97738a9fa4ce45cd';
  private baseUrl = 'https://api.weatherbit.io/v2.0';
  
  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
  }

  getApiKey(): string | null {
    return this.apiKey;
  }

  isConfigured(): boolean {
    return !!this.apiKey;
  }

  /**
   * Get current weather for a location
   */
  async getCurrentWeather(lat: number, lon: number): Promise<WeatherData> {
    if (!this.apiKey) {
      throw new Error('Weather API key not configured');
    }

    const url = `${this.baseUrl}/current?lat=${lat}&lon=${lon}&key=${this.apiKey}&units=I`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new Error('Invalid Weather API key. Please check your API key in Settings.');
      }
      throw new Error(`Weather API error: ${response.statusText}`);
    }

    const result = await response.json();
    const data = result.data[0];
    
    return {
      temp: Math.round(data.temp),
      feelsLike: Math.round(data.app_temp),
      condition: data.weather.description,
      description: data.weather.description,
      wind: Math.round(data.wind_spd),
      precipitation: data.precip || 0,
      humidity: data.rh,
      pressure: Math.round(data.pres),
      visibility: Math.round(data.vis),
      clouds: data.clouds,
      uv: data.uv || 0,
      dewPoint: Math.round(data.dewpt),
      airQuality: data.aqi || 0,
      icon: data.weather.icon
    };
  }

  /**
   * Get 16-day forecast for a location (Weatherbit provides up to 16 days)
   */
  async getForecast(lat: number, lon: number): Promise<ForecastDay[]> {
    if (!this.apiKey) {
      throw new Error('Weather API key not configured');
    }

    const url = `${this.baseUrl}/forecast/daily?lat=${lat}&lon=${lon}&key=${this.apiKey}&units=I&days=16`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new Error('Invalid Weather API key');
      }
      throw new Error(`Weather API error: ${response.statusText}`);
    }

    const result = await response.json();
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    return result.data.map((day: any) => {
      const date = new Date(day.datetime);
      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        day: dayNames[date.getDay()],
        high: Math.round(day.high_temp),
        low: Math.round(day.low_temp),
        condition: day.weather.description,
        description: day.weather.description,
        precipChance: Math.round(day.pop),
        wind: Math.round(day.wind_spd),
        humidity: day.rh,
        uv: day.uv || 0,
        icon: day.weather.icon
      };
    });
  }

  /**
   * Get complete weather forecast (current + 16-day)
   */
  async getWeatherForecast(lat: number, lon: number): Promise<WeatherForecast> {
    const [current, forecast] = await Promise.all([
      this.getCurrentWeather(lat, lon),
      this.getForecast(lat, lon)
    ]);

    return { current, forecast };
  }

  /**
   * Get weather for multiple parks in parallel
   */
  async getWeatherForParks(parks: Array<{ lat: number; lon: number; code: string }>): Promise<Map<string, WeatherForecast>> {
    if (!this.apiKey) {
      // Return empty map silently when API key is not configured
      return new Map<string, WeatherForecast>();
    }

    const weatherMap = new Map<string, WeatherForecast>();
    
    // Fetch weather for all parks in parallel
    const results = await Promise.allSettled(
      parks.map(async (park) => ({
        code: park.code,
        weather: await this.getWeatherForecast(park.lat, park.lon)
      }))
    );

    // Process results - suppress all console errors (they're shown in Settings page)
    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        weatherMap.set(result.value.code, result.value.weather);
      }
      // Silently fail - errors are handled in Settings page
    });

    return weatherMap;
  }

  /**
   * Get weather alerts for a location
   */
  async getWeatherAlerts(lat: number, lon: number): Promise<WeatherAlert[]> {
    if (!this.apiKey) {
      return [];
    }

    try {
      const url = `${this.baseUrl}/alerts?lat=${lat}&lon=${lon}&key=${this.apiKey}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        return [];
      }

      const result = await response.json();
      
      if (!result.alerts || result.alerts.length === 0) {
        return [];
      }

      return result.alerts.map((alert: any) => ({
        title: alert.title,
        description: alert.description,
        severity: alert.severity,
        regions: alert.regions || [],
        effective: alert.effective_utc,
        expires: alert.expires_utc
      }));
    } catch (error) {
      return [];
    }
  }

  /**
   * Get weather radar tile URL for map overlay
   * Using OpenWeatherMap precipitation layer for consistency
   */
  getRadarTileUrl(): string {
    if (!this.apiKey) {
      return '';
    }
    return `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=demo`;
  }

  /**
   * Get temperature tile URL for map overlay
   */
  getTemperatureTileUrl(): string {
    if (!this.apiKey) {
      return '';
    }
    return `https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=demo`;
  }

  /**
   * Get clouds tile URL for map overlay
   */
  getCloudsTileUrl(): string {
    if (!this.apiKey) {
      return '';
    }
    return `https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=demo`;
  }

  /**
   * Get wind tile URL for map overlay
   */
  getWindTileUrl(): string {
    if (!this.apiKey) {
      return '';
    }
    return `https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=demo`;
  }

  /**
   * Calculate business impact based on weather conditions
   */
  calculateBusinessImpact(weather: WeatherData | ForecastDay): {
    level: 'high' | 'medium' | 'low';
    message: string;
    color: string;
    attendanceImpact: 'positive' | 'neutral' | 'negative';
    mediaSpendRecommendation: string;
  } {
    const temp = 'temp' in weather ? weather.temp : weather.high;
    const condition = weather.condition;
    const precipChance = 'precipChance' in weather ? weather.precipChance : 0;
    const uv = 'uv' in weather ? weather.uv : 0;
    const airQuality = 'airQuality' in weather && weather.airQuality ? weather.airQuality : 0;

    // Severe weather conditions
    if (condition.includes('Thunderstorm') || condition.includes('Storm') || precipChance > 70) {
      return {
        level: 'high',
        message: 'High weather risk - significant attendance impact expected',
        color: 'text-red-600',
        attendanceImpact: 'negative',
        mediaSpendRecommendation: 'Reduce spend 30-40% or shift to indoor attractions messaging'
      };
    }

    // Moderate rain
    if (condition.includes('Rain') || precipChance > 40) {
      return {
        level: 'medium',
        message: 'Moderate weather impact - some attendance reduction likely',
        color: 'text-yellow-600',
        attendanceImpact: 'negative',
        mediaSpendRecommendation: 'Reduce spend 15-20% and emphasize covered attractions'
      };
    }

    // Poor air quality
    if (airQuality > 150) {
      return {
        level: 'high',
        message: 'Unhealthy air quality - outdoor activities discouraged',
        color: 'text-red-600',
        attendanceImpact: 'negative',
        mediaSpendRecommendation: 'Reduce spend 40-50% until air quality improves'
      };
    }

    // Moderate air quality concerns
    if (airQuality > 100) {
      return {
        level: 'medium',
        message: 'Moderate air quality - sensitive groups may avoid outdoor activities',
        color: 'text-yellow-600',
        attendanceImpact: 'negative',
        mediaSpendRecommendation: 'Reduce spend 20-25% and adjust messaging'
      };
    }

    // Extreme heat
    if (temp > 95) {
      return {
        level: 'medium',
        message: 'Extreme heat may reduce attendance',
        color: 'text-orange-600',
        attendanceImpact: 'negative',
        mediaSpendRecommendation: 'Adjust messaging to water park features, reduce overall spend 10-15%'
      };
    }

    // High UV index
    if (uv > 10) {
      return {
        level: 'medium',
        message: 'Extreme UV index - sun protection essential',
        color: 'text-purple-600',
        attendanceImpact: 'neutral',
        mediaSpendRecommendation: 'Emphasize shaded areas and water attractions in messaging'
      };
    }

    // Ideal conditions
    if (condition === 'Clear' && temp >= 70 && temp <= 85) {
      return {
        level: 'low',
        message: 'Ideal weather conditions - high attendance expected',
        color: 'text-green-600',
        attendanceImpact: 'positive',
        mediaSpendRecommendation: 'Increase spend 15-20% to capitalize on ideal conditions'
      };
    }

    // Good conditions
    if ((condition === 'Clear' || condition === 'Clouds') && temp >= 60 && temp <= 90) {
      return {
        level: 'low',
        message: 'Favorable weather conditions',
        color: 'text-green-600',
        attendanceImpact: 'positive',
        mediaSpendRecommendation: 'Maintain normal spend levels with positive messaging'
      };
    }

    // Cool but acceptable
    if (temp < 60 && temp > 45) {
      return {
        level: 'medium',
        message: 'Cool weather may slightly reduce attendance',
        color: 'text-blue-600',
        attendanceImpact: 'neutral',
        mediaSpendRecommendation: 'Maintain spend but adjust creative to emphasize seasonal activities'
      };
    }

    // Default
    return {
      level: 'low',
      message: 'Normal weather conditions',
      color: 'text-gray-600',
      attendanceImpact: 'neutral',
      mediaSpendRecommendation: 'Maintain normal spend levels'
    };
  }
}

export const weatherService = new WeatherService();
