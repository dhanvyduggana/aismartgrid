import { useState } from "react";
import axios from "axios";

export default function PredictionForm({ setResult }) {
  const [solarForm, setSolarForm] = useState({
    temperature: "",
    humidity: "",
    cloud: "",
    radiation: "",
    power: ""
  });

  const [windForm, setWindForm] = useState({
    ws10: "",
    ws100: "",
    wd10: "",
    wd100: "",
    wg10: "",
    temp: "",
    humidity: ""
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  // ✅ store last prediction payload for allocation
  const [predictionPayload, setPredictionPayload] = useState(null);

  const handleSolarChange = (e) => {
    setSolarForm({
      ...solarForm,
      [e.target.name]: e.target.value
    });
  };

  const handleWindChange = (e) => {
    setWindForm({
      ...windForm,
      [e.target.name]: e.target.value
    });
  };

  // =============================
  // Fetch weather
  // =============================
  const handleFetchWeather = async () => {
    try {
      setFetching(true);

      const res = await axios.get(
        "https://api.open-meteo.com/v1/forecast?latitude=17.0005&longitude=81.8040&hourly=temperature_2m,relative_humidity_2m,cloud_cover,shortwave_radiation,wind_speed_10m,wind_speed_100m,wind_direction_10m,wind_direction_100m,wind_gusts_10m&forecast_days=1"
      );

      const h = res.data.hourly;

      setSolarForm({
        temperature: h.temperature_2m[0],
        humidity: h.relative_humidity_2m[0],
        cloud: h.cloud_cover[0],
        radiation: h.shortwave_radiation[0],
        power: 120
      });

      setWindForm({
        ws10: h.wind_speed_10m[0],
        ws100: h.wind_speed_100m[0],
        wd10: h.wind_direction_10m[0],
        wd100: h.wind_direction_100m[0],
        wg10: h.wind_gusts_10m[0],
        temp: h.temperature_2m[0],
        humidity: h.relative_humidity_2m[0]
      });

    } catch (error) {
      console.error(error);
      alert("Failed to fetch weather");
    } finally {
      setFetching(false);
    }
  };

  const createSolarSequence = () => {
    const row = [
      Number(solarForm.temperature),
      Number(solarForm.humidity),
      Number(solarForm.cloud),
      Number(solarForm.radiation),
      Number(solarForm.power)
    ];
    return Array.from({ length: 24 }, () => row);
  };

  const createWindSequence = () => {
    const row = [
      Number(windForm.ws10),
      Number(windForm.ws100),
      Number(windForm.wd10),
      Number(windForm.wd100),
      Number(windForm.wg10),
      Number(windForm.temp),
      Number(windForm.humidity)
    ];
    return Array.from({ length: 24 }, () => row);
  };

  // =============================
  // Predict only
  // =============================
  const handlePredict = async () => {
    try {
      setLoading(true);

      const payload = {
        solar_sequence: createSolarSequence(),
        wind_sequence: createWindSequence()
      };

      const res = await axios.post(
        "http://localhost:8000/predict/hybrid",
        payload
      );

      // save for allocation
      setPredictionPayload(payload);

      setResult(res.data);

    } catch (error) {
      console.error(error.response?.data || error.message);
      alert("Prediction failed");
    } finally {
      setLoading(false);
    }
  };

  // =============================
  // Allocate only on button click
  // =============================
  const handleAllocate = async () => {
    try {
      if (!predictionPayload) {
        alert("Please predict first");
        return;
      }

      setLoading(true);

      const res = await axios.post(
        "http://localhost:8000/smart-grid/dispatch",
        predictionPayload
      );

      setResult(res.data);

    } catch (error) {
      console.error(error.response?.data || error.message);
      alert("Allocation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Fetch */}
      <button
        onClick={handleFetchWeather}
        className="w-full bg-blue-600 text-white px-6 py-4 rounded-xl text-lg font-semibold"
      >
        {fetching ? "Fetching..." : "🌦️ Fetch Live Weather Data"}
      </button>

      {/* Solar */}
      <div className="bg-white p-6 rounded-2xl shadow-xl">
        <h2 className="text-xl font-bold mb-4">☀️ Solar Inputs</h2>
        <div className="grid grid-cols-2 gap-4">
          <input name="temperature" value={solarForm.temperature} placeholder="Temperature" type="number" onChange={handleSolarChange} className="border p-3 rounded" />
          <input name="humidity" value={solarForm.humidity} placeholder="Humidity" type="number" onChange={handleSolarChange} className="border p-3 rounded" />
          <input name="cloud" value={solarForm.cloud} placeholder="Cloud Cover" type="number" onChange={handleSolarChange} className="border p-3 rounded" />
          <input name="radiation" value={solarForm.radiation} placeholder="Solar Radiation" type="number" onChange={handleSolarChange} className="border p-3 rounded" />
          <input name="power" value={solarForm.power} placeholder="Previous Solar Power" type="number" onChange={handleSolarChange} className="border p-3 rounded" />
        </div>
      </div>

      {/* Wind */}
      <div className="bg-white p-6 rounded-2xl shadow-xl">
        <h2 className="text-xl font-bold mb-4">🌬️ Wind Inputs</h2>
        <div className="grid grid-cols-2 gap-4">
          <input name="ws10" value={windForm.ws10} placeholder="Wind Speed 10m" type="number" onChange={handleWindChange} className="border p-3 rounded" />
          <input name="ws100" value={windForm.ws100} placeholder="Wind Speed 100m" type="number" onChange={handleWindChange} className="border p-3 rounded" />
          <input name="wd10" value={windForm.wd10} placeholder="Wind Direction 10m" type="number" onChange={handleWindChange} className="border p-3 rounded" />
          <input name="wd100" value={windForm.wd100} placeholder="Wind Direction 100m" type="number" onChange={handleWindChange} className="border p-3 rounded" />
          <input name="wg10" value={windForm.wg10} placeholder="Wind Gust 10m" type="number" onChange={handleWindChange} className="border p-3 rounded" />
          <input name="temp" value={windForm.temp} placeholder="Temperature" type="number" onChange={handleWindChange} className="border p-3 rounded" />
          <input name="humidity" value={windForm.humidity} placeholder="Humidity" type="number" onChange={handleWindChange} className="border p-3 rounded" />
        </div>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={handlePredict}
          className="w-full bg-black text-white px-6 py-4 rounded-xl text-lg font-semibold"
        >
          ⚡ Predict Hybrid Power
        </button>

        <button
          onClick={handleAllocate}
          className="w-full bg-green-600 text-white px-6 py-4 rounded-xl text-lg font-semibold"
        >
          🎯 Allocate City Power
        </button>
      </div>
    </div>
  );
}