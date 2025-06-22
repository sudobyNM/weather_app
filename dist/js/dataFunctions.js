const API_BASE =
  window.location.hostname === "localhost"
    ? "http://localhost:3000"
    : window.location.origin;

export const setLocationObject = (locationObj, coordsObj) => {
  const { lat, lon, name, unit = "metric" } = coordsObj;
  locationObj.setLat(lat);
  locationObj.setLon(lon);
  locationObj.setName(name);
  if (unit) {
    locationObj.setUnit(unit);
  }
};

export const getHomeLocation = () => {
  return localStorage.getItem("defaultWeatherLocation");
};

export const getWeatherFromCoords = async (locationObj) => {
  // const lat = locationObj.getLat();
  // const lon = locationObj.getLon();
  // const units = locationObj.getUnit();
  // const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=${units}&appid=${WEATHER_API_KEY }`
  // try {
  //     const weatherStream = await fetch(url);
  //     const weatherJson = await weatherStream.json();
  //     return weatherJson;
  // } catch (err){
  //     console.error(err);
  // }

  const urlDataObj = {
    lat: locationObj.getLat(),
    lon: locationObj.getLon(),
    units: locationObj.getUnit(),
  };
  console.log(urlDataObj.lat, urlDataObj.lon, urlDataObj.units);
  try {
    const response = await fetch(`${API_BASE}/api/weather`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(urlDataObj),
    });
    const weatherJson = await response.json();
    return weatherJson;
  } catch (err) {
    console.error(err);
  }
};

export const getCoordsFromApi = async (entryText, units) => {
  //  const regex = /^\d+${}/g;
  // const flag = regex.test(entryText) ? "zip" : "q";
  // const url = `https://api.openweathermap.org/data/2.5/weather?${flag}=${entryText}&units=${units}&appid=${WEATHER_API_KEY }`;
  // const encodedUrl = encodeURI(url);
  // try {
  //     const dataStream = await fetch(encodedUrl);
  //     const jsonData = await dataStream.json();
  //     console.log(jsonData)
  //     return jsonData;
  // }   catch (err) {
  //     console.error(err.stack);
  // }

  const urlDataObj = {
    text: entryText,
    units: "metric",
  };
  try {
    const response = await fetch(`${API_BASE}/api/weather/coords`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(urlDataObj),
    });
    const jsonData = await response.json();
    return jsonData;
  } catch (err) {
    console.error(err);
  }
};

export const cleanText = (text) => {
  const regex = / {2,} /g;
  const entryText = text.replaceAll(regex, " ").trim();
  return entryText;
};
