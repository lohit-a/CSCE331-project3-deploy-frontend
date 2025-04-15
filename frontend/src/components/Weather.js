// src/components/Weather.js
import React, { useEffect, useState } from 'react';
import { WeatherApiKey } from '../constant.js';

function Weather() {
  const [weatherData, setWeatherData] = useState(null);
  //const apiKey = process.env.REACT_APP_OPENWEATHER_API_KEY;
  // Example coordinates—you can set these dynamically with geolocation if needed.
  const lat = 30.615011;
  const lon = -96.342476;

  const apiKey = WeatherApiKey;

  useEffect(() => {
    fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&appid=${WeatherApiKey}&units=metric`)
      .then(response => {
        if (!response.ok) {
          throw new Error("Failed to fetch weather data.");
        }
        return response.json();
      })
      .then(data => setWeatherData(data))
      .catch(error => console.error("Error fetching weather data:", error));
  }, [apiKey, lat, lon]);

  if (!weatherData) {
    return <div className="weather">Loading weather…</div>;
  }

  const { temp } = weatherData.current;
  const { description } = weatherData.current.weather[0];

  return (
    <div className="weather">
      <p><strong>Current Temp:</strong> {temp}°C</p>
      <p><strong>Condition:</strong> {description}</p>
    </div>
  );
}

export default Weather;
