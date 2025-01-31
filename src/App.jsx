import { useState, useEffect } from "react";
import React from "react";
import axios from "axios";

function App() {
  const [data, setData] = useState([]);
  const [location, setLocation] = useState("");
  const [background, setBackground] = useState("default-bg");
  const [localTime, setLocalTime] = useState("");
  const [timezone, setTimezone] = useState(0);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        fetchWeatherByCoords(lat, lon);
      });
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      updateLocalTime(timezone);
    }, 1000);

    return () => clearInterval(interval);
  }, [timezone]);

  const fetchWeatherByCoords = (lat, lon) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=51afe5ea0b9ea4d68a2c9f3bdd915422`;
    axios
      .get(url)
      .then((res) => {
        setData(res.data);
        console.log(res.data);
        setLocation(res.data.name);
        setTimezone(res.data.timezone);
        updateBackground(res.data.weather[0].main);
        updateLocalTime(res.data.timezone);
        setLocation("");
      })
      .catch((error) => {
        console.error("Error fetching the weather data", error);
      });
  };

  const searchLocation = (event) => {
    if (event.key === "Enter") {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=51afe5ea0b9ea4d68a2c9f3bdd915422`;
      axios
        .get(url)
        .then((res) => {
          setData(res.data);
          console.log(res.data);
          setLocation("");
          updateBackground(res.data.weather[0].main);
          updateLocalTime(res.data.timezone);
        })

        .catch((error) => {
          console.error("Error fetching the weather data", error);
        });
    }
  };

  const updateBackground = (weather) => {
    switch (weather) {
      case "Clear":
        setBackground("clear-bg");
        break;
      case "Clouds":
        setBackground("clouds-bg");
        break;
      case "Rain":
        setBackground("rain-bg");
        break;
      case "Snow":
        setBackground("snow-bg");
        break;
      case "Thunderstorm":
        setBackground("thunderstorm-bg");
        break;
      case "Mist":
        setBackground("mist-bg");
        break;
      case "Smoke":
        setBackground("mist-bg");
        break;
      case "Haze":
        setBackground("mist-bg");
        break;
      case "Dust":
        setBackground("dust-bg");
        break;
      case "Fog":
        setBackground("dust-bg");
        break;
      case "Sand":
        setBackground("dust-bg");
        break;
      case "Ash":
        setBackground("dust-bg");
        break;
      case "Squall":
        setBackground("dust-bg");
        break;
      case "Tornado":
        setBackground("tornado-bg");
        break;
      default:
        setBackground("default-bg");
        break;
    }
  };

  const updateLocalTime = (timezone) => {
    const localDate = new Date();
    const utc = localDate.getTime() + localDate.getTimezoneOffset() * 60000;

    const localTime = new Date(utc + timezone * 1000);
    setLocalTime(localTime.toLocaleTimeString("en-US"));
  };

  return (
    <div className={`App ${background}`}>
      <div className="search">
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          onKeyDown={searchLocation}
          placeholder="Search"
        />
      </div>
      <div className="container">
        <div className="top">
          <div className="location">
            <h1>{data.name}</h1>
            <div className="weather-status">
              {data.main ? <h2>{data.main.temp} °C</h2> : null}
              {data.weather ? <p>{data.weather[0].main}</p> : null}
            </div>
          </div>
        </div>
        {data.name !== undefined && (
          <div className="bottom">
            <div className="feels">
              {data.main ? <p>{data.main.feels_like} °C</p> : null}
              <p>Feels like</p>
            </div>
            <div className="humidity">
              {data.main ? <p>{data.main.humidity}%</p> : null}
              <p>Humidity</p>
            </div>
            <div className="wind">
              {data.wind ? <p>{data.wind.speed} m/s</p> : null}
              <p>Wind speed</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
