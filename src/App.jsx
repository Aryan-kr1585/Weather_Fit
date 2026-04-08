import { useState } from "react";
import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [weatherList, setWeatherList] = useState([]);

  const [sort, setSort] = useState("default");
  const [minTemp, setMinTemp] = useState(0);

  const API_KEY = "6e628b6782a96e14b252308972caf801";

  const getWeather = async () => {
    if (!city) return;

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

      const res = await fetch(url);
      const data = await res.json();

      if (data && data.main) {
        setWeatherList((prev) => [...prev, data]);
        setCity("");
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Filter (temperature)
  const filtered = weatherList.filter(
    (item) => item.main.temp >= minTemp
  );

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (sort === "temp") return b.main.temp - a.main.temp;
    if (sort === "name") return a.name.localeCompare(b.name);
    return 0;
  });

  return (
    <div className="container">
      <h1>🌦 Weather App</h1>

      {/* Search */}
      <div className="controls">
        <input
          type="text"
          placeholder="Enter city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />

        <button onClick={getWeather}>Search</button>

        {/* Sort */}
        <select onChange={(e) => setSort(e.target.value)}>
          <option value="default">Sort</option>
          <option value="temp">By Temp</option>
          <option value="name">A-Z</option>
        </select>

        {/* Filter */}
        <select onChange={(e) => setMinTemp(Number(e.target.value))}>
          <option value="0">All Temps</option>
          <option value="20">20°C+</option>
          <option value="30">30°C+</option>
        </select>
      </div>

      {/* Cards */}
      <div className="grid">
        {sorted.map((item, index) => (
          <div key={index} className="card">
            <h2>{item.name}</h2>
            <p>🌡 {item.main.temp} °C</p>
            <p>☁️ {item.weather[0].main}</p>

            <img
              src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
              alt="weather"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;