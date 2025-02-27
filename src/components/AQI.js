import React, { useState, useEffect } from "react";
import axios from "axios";

const AQI = () => {
  const [aqiData, setAqiData] = useState(null);
  const [showPollutants, setShowPollutants] = useState(false);
  const [location, setLocation] = useState(null); // To store city, country, lat, lon
  const [error, setError] = useState(null);

  // Fetch user's IP-based location
  useEffect(() => {
    axios
      .get("http://ip-api.com/json")  // This is an open API that provides IP-based location data
      .then((response) => {
        const { city, country, lat, lon } = response.data;
        setLocation({ city, country, lat, lon });
      })
      .catch((err) => {
        setError("Could not retrieve location.");
        console.error(err);
      });
  }, []);

  // Fetch AQI data after getting the location
  useEffect(() => {
    if (location) {
      const { lat, lon } = location;
      const apiUrl = `https://api.waqi.info/feed/geo:${lat};${lon}/?token=d786d891d9a94b4be17ce32c405942d5f8f48395`;

      axios
        .get(apiUrl)
        .then((response) => {
          setAqiData(response.data);
        })
        .catch((err) => {
          setError("Could not fetch AQI data.");
          console.error(err);
        });
    }
  }, [location]);

  // Check if data is available
  if (error) {
    return <p>{error}</p>;
  }

  if (!aqiData) {
    return <p>Loading...</p>;
  }

  const aqi = aqiData.data.aqi;
  const dominantPol = aqiData.data.dominentpol; // Main pollutant
  const status = aqi <= 50 ? "Excellent" : aqi <= 100 ? "Good" : aqi <= 150 ? "Moderate" : aqi <= 200 ? "Unhealthy" : "Hazardous";

  // Dynamically set the background color based on AQI status
  let bgColor;
  if (aqi <= 50) {
    bgColor = "bg-green-500"; // Excellent
  } else if (aqi <= 100) {
    bgColor = "bg-yellow-500"; // Good
  } else if (aqi <= 150) {
    bgColor = "bg-orange-500"; // Moderate
  } else if (aqi <= 200) {
    bgColor = "bg-red-500"; // Unhealthy
  } else {
    bgColor = "bg-purple-500"; // Hazardous
  }

  // Toggle the dropdown for showing pollutants' details
  const togglePollutants = () => {
    setShowPollutants(!showPollutants);
  };

  // Get recommendations based on the AQI
  const getRecommendation = () => {
    if (aqi <= 50) {
      return "The air quality is excellent. Enjoy your time outdoors!";
    } else if (aqi <= 100) {
      return "The air quality is good. It's safe for outdoor activities.";
    } else if (aqi <= 150) {
      return "The air quality is moderate. Sensitive individuals may want to limit prolonged outdoor activities.";
    } else if (aqi <= 200) {
      return "The air quality is unhealthy. People with respiratory conditions should avoid prolonged outdoor activities.";
    } else {
      return "The air quality is hazardous. Everyone should avoid outdoor activities.";
    }
  };

  return (
    <>
      <section className={`${bgColor} text-white p-6 rounded-xl shadow-lg`}>
        <h2 className="text-2xl font-bold mb-4">Air Quality Index (AQI)</h2>

        {location && (
          <div className="mb-6 p-4 bg-white text-black rounded-lg shadow-md">
            <p className="font-medium text-lg">Location Details:</p>
            <p>City: {location.city}</p>
            <p>Country: {location.country}</p>
            <p>Coordinates: Latitude {location.lat}, Longitude {location.lon}</p>
          </div>
        )}

        <div className="flex items-center justify-between bg-white text-black p-4 rounded-lg shadow-md">
          <div>
            <p className="text-xl font-semibold mb-2">AQI: {aqi}</p>
            <p className="text-lg">Status: {status}</p>
          </div>
          <div className="text-5xl">
            {aqi <= 100 ? "🌬️" : "😷"}  {/* Mask icon for hazardous, wind for good air quality */}
          </div>
        </div>

        <div className="mt-4 flex justify-center">
          <button
            onClick={togglePollutants}
            className="bg-white text-black font-semibold px-6 py-3 rounded-full shadow-md hover:bg-gray-100 transition duration-200"
          >
            {showPollutants ? "Hide Pollutants Details" : "Show Pollutants Details"}
          </button>
        </div>

        {showPollutants && (
          <div className="mt-6 p-4 bg-white text-black rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">Pollutants Details</h3>
            <ul className="space-y-4">
              {Object.entries(aqiData.data.iaqi).map(([key, value]) => (
                <li key={key} className="flex justify-between items-center">
                  <div className="flex flex-col items-start">
                    <span className="font-medium text-lg">{getPollutantSymbol(key)}</span>
                    <span className="text-sm">{getFullPollutantName(key)}</span> {/* Full name under the symbol */}
                  </div>
                  <span className="text-right">{value.v} µg/m³</span>
                </li>
              ))}
              <li className="flex justify-between items-center mt-4">
                <div className="flex flex-col items-start">
                  <span className="font-medium text-lg">Dominant Pollutant</span>
                  <span className="text-sm">{getFullPollutantName(dominantPol)}</span>
                </div>
                <span className="text-right">{dominantPol}</span>
              </li>
            </ul>
          </div>
        )}

        {/* Recommendation Section */}
        <div className="mt-6 p-4 bg-white text-black rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-3">Recommendation:</h3>
          <p>{getRecommendation()}</p>
        </div>
      </section>

      {/* FAQ Section (separate container) */}
      <div className="mt-8 p-6 bg-blue-100 text-black rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">FAQ</h3>
        <ul className="space-y-4">
          <li>
            <strong>What is AQI?</strong>
            <p>AQI stands for Air Quality Index. It is used to communicate how polluted the air is, and what associated health effects might be a concern for the general population.</p>
          </li>
          <li>
            <strong>What do the colors represent?</strong>
            <ul className="ml-6 space-y-2">
              <li>
                <span className="text-green-500">Green (0-50)</span>: Excellent air quality, air pollution poses little or no risk.
              </li>
              <li>
                <span className="text-yellow-500">Yellow (51-100)</span>: Good air quality, air pollution poses little or no risk to the general population.
              </li>
              <li>
                <span className="text-orange-500">Orange (101-150)</span>: Moderate air quality, some individuals may experience health effects.
              </li>
              <li>
                <span className="text-red-500">Red (151-200)</span>: Unhealthy air quality, individuals with respiratory conditions may experience health effects.
              </li>
              <li>
                <span className="text-purple-500">Purple (201-300)</span>: Hazardous air quality, everyone may experience health effects.
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </>
  );
};

// Helper function to return full name of the pollutant
const getFullPollutantName = (abbreviation) => {
  const pollutants = {
    co: "Carbon Monoxide",
    no2: "Nitrogen Dioxide",
    o3: "Ozone",
    p: "Pressure",
    pm10: "Particulate Matter (10 microns)",
    pm25: "Particulate Matter (2.5 microns)",
    so2: "Sulfur Dioxide",
    t: "Temperature",
    w: "Wind Speed",
    wg: "Wind Gust",  // Added for Wind Gust
    h: "Humidity",    // Added for Humidity
  };
  return pollutants[abbreviation] || abbreviation;
};

// Helper function to return the pollutant symbol
const getPollutantSymbol = (abbreviation) => {
  const symbols = {
    co: "CO",
    no2: "NO2",
    o3: "O3",
    p: "P",
    pm10: "PM10",
    pm25: "PM2.5",
    so2: "SO2",
    t: "T",
    w: "W",
    wg: "WG",  // Added for Wind Gust
    h: "H",    // Added for Humidity
  };
  return symbols[abbreviation] || abbreviation;
};

export default AQI;
