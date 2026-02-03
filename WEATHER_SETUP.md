# Weather API Setup Guide

The Six Flags Media Planning Dashboard now includes real-time weather radar and forecast capabilities for all 29 parks!

## 🌤️ Features

- **Real-time Weather Radar**: Live precipitation, temperature, clouds, and wind overlays on the park map
- **Current Conditions**: Temperature, wind, humidity, and conditions for each park location
- **7-Day Forecasts**: Daily high/low temperatures and precipitation chances
- **Business Intelligence**: Attendance impact analysis and media spend recommendations based on weather

## 🔑 Getting Your Free API Key

### Step 1: Create an OpenWeather Account

1. Go to [https://openweathermap.org/api](https://openweathermap.org/api)
2. Click "Sign Up" in the top right corner
3. Fill out the registration form (email, password, username)
4. Verify your email address

### Step 2: Generate an API Key

1. Once logged in, click your username in the top right
2. Select "My API keys" from the dropdown
3. You'll see a default API key already created
4. Copy this key (it looks like: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`)

**Note:** It may take up to 2 hours for a new API key to become active. If you see authentication errors immediately after creating your key, wait a bit and try again.

### Step 3: Add Key to Dashboard

1. Open the Six Flags Command Center
2. Click **Settings** (Guest Services) in the navigation
3. Go to the **API Configuration** tab
4. Scroll down to the **Weather API Key** section
5. Paste your OpenWeather API key
6. Click **Save Weather API Key**

## 🎯 Using Weather Features

### Viewing Weather Radar

1. Navigate to **Parks** (Park Map)
2. Toggle **Show Weather Radar** at the top
3. Use the layers control on the map to toggle:
   - Weather Radar (Precipitation)
   - Temperature
   - Clouds
   - Wind

### Viewing Park Forecasts

1. Navigate to **Parks** (Park Map)
2. Toggle **Show Forecast**
3. Click any park marker to see current weather and 7-day forecast
4. Weather impact indicators show attendance predictions
5. Click "View Forecast" for a detailed 14-day outlook with media spend recommendations

### Weather-Based Media Planning

The dashboard provides intelligent recommendations:

- **🟢 Favorable Weather**: "Increase spend 15-20% to capitalize on ideal conditions"
- **🟡 Moderate Impact**: "Reduce spend 15-20% and emphasize covered attractions"
- **🔴 High Risk**: "Reduce spend 30-40% or shift to indoor attractions messaging"

## 🆓 Free Tier Limits

OpenWeather's free tier includes:
- ✅ 1,000 API calls per day
- ✅ Current weather data
- ✅ 5-day / 3-hour forecast
- ✅ Weather maps
- ✅ Hourly updates

This is more than enough for monitoring all 29 Six Flags parks throughout the day!

## 🔒 Security & Privacy

- Your Weather API key is stored **locally** in your browser
- It's never sent to any server except OpenWeather's API
- API keys are stored securely using browser localStorage
- You can clear your key at any time in Settings

## ❓ Troubleshooting

### "Weather API key not configured" Error

**Solution**: Go to Settings → API Configuration → Weather API Key and add your key.

### "Invalid Weather API key" Error

**Solution**: 
1. Verify you copied the entire key (no spaces or extra characters)
2. Wait up to 2 hours for new keys to activate
3. Check your OpenWeather account is active

### Weather Radar Not Showing

**Solution**:
1. Make sure "Show Weather Radar" toggle is ON
2. Use the layers control on the map to enable specific layers
3. Zoom in/out to different map levels
4. Check your Weather API key is valid

### "Failed to load weather data" Error

**Solution**:
1. Check your internet connection
2. Verify your API key hasn't exceeded daily limits (1,000 calls/day)
3. Try refreshing the page

## 📊 API Usage Tips

To stay within free tier limits:
- Weather data auto-refreshes when you toggle forecasts ON
- Data is cached per session
- Disable forecasts when not needed to save API calls

## 🚀 Upgrading

If you need more calls (for automated refreshing or higher frequency):
- **Startup Plan**: $25/month, 100,000 calls/day
- **Developer Plan**: $120/month, 1,000,000 calls/day

For media planning purposes, the free tier is usually sufficient!

## 🎢 Making Weather Work for You

Use weather insights to:
1. **Optimize Daily Spend**: Reduce wasted ad spend on rainy days
2. **Plan Ahead**: Shift budgets to favorable weather windows
3. **Adjust Creative**: Emphasize water parks on hot days, indoor attractions on cold days
4. **Market-Specific Strategy**: Different weather patterns across regions
5. **Performance Analysis**: Correlate attendance with weather conditions

---

**Questions?** Contact your dashboard administrator or check the [OpenWeather API docs](https://openweathermap.org/api).
