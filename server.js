import dotenv from "dotenv";
import cors from "cors";
import fetch from "node-fetch";

import express from "express";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const PORT = process.env.PORT || 3000;

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "dist")));
app.use(express.json());
app.use(cors());

// get weather data based on coordinates
app.post("/api/weather", async (req, res) => {
  const { lat, lon, units } = req.body;
  console.log(lat, lon, units);
  const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=${units}&appid=${WEATHER_API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.sendStatus(500);
  }
});

// get weather data based on city name or zip code
app.post("/api/weather/coords", async (req, res) => {
  const { text, units } = req.body;
  console.log(text, units);
  const regex = /^\d{6}$/; // 6 digit for indian zip
  let query;

  if (regex.test(text)) {
    query = `zip=${text},IN`; //indian zip code
  } else {
    query = `q=${text}`; // city name
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?${query}&units=${units}&appid=${WEATHER_API_KEY}`;
  const encodedUrl = encodeURI(url);

  try {
    const response = await fetch(encodedUrl);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
