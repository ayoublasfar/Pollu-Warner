import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import axios from "axios";

// Function to format date to "dd/mm" format for display
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}`;
};

// Function to get today's date in the "yyyy-mm-dd" format for comparison
const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split("T")[0]; // Returns "yyyy-mm-dd"
};

const AQIForecastCharts = () => {
  const [forecastData, setForecastData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isHistoricalData, setIsHistoricalData] = useState(false); // State to track if data is historical

  useEffect(() => {
    // Fetch user's location
    axios
      .get("http://ip-api.com/json")
      .then((response) => {
        const { lat, lon } = response.data;

        // Fetch forecast AQI data
        const apiUrl = `https://api.waqi.info/feed/geo:${lat};${lon}/?token=d786d891d9a94b4be17ce32c405942d5f8f48395`;
        return axios.get(apiUrl);
      })
      .then((response) => {
        const pollutants = response.data?.data?.forecast?.daily || {};

        // Format data and determine if it's historical
        const formattedData = Object.keys(pollutants).map((pollutant) => ({
          pollutant,
          data: pollutants[pollutant].map((item) => ({
            day: item.day, // Keep the raw date format "yyyy-mm-dd" for comparison
            formattedDay: formatDate(item.day), // Format date to "dd/mm" for display
            value: item.avg,
          })),
        }));

        // Get today's date for comparison
        const todayDate = getTodayDate();

        // Check if all the forecast days are historical (i.e., before today)
        const isHistory = formattedData.every((pollutantData) =>
          pollutantData.data.every((item) => item.day < todayDate)
        );

        setIsHistoricalData(isHistory);
        setForecastData(formattedData);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load forecast data.");
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading forecast data...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="flex flex-col items-center mt-8 w-full">
      <h2 className="text-xl font-bold mb-4 text-center">Air Quality Forecast</h2>
      
      {/* Show message if only historical data is available */}
      {isHistoricalData && (
        <div className="text-center text-red-500 font-semibold mb-4">
          <p>There is only historical data available for your region.</p>
        </div>
      )}

      {forecastData.map((pollutantData, index) => (
        <div key={index} className="mb-8 w-full" style={{ maxWidth: "700px" }}>
          <h3 className="text-lg font-semibold mb-2 text-center">
            {pollutantData.pollutant.toUpperCase()} Levels
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={pollutantData.data}
              margin={{ top: 20, right: 20, left: 10, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
              <XAxis
                dataKey="formattedDay"
                stroke="#555"
                label={{ value: "Day", position: "insideBottom", offset: -10 }}
                interval={0} // Ensures all days are shown
              />
              <YAxis
                stroke="#555"
                label={{
                  value: "Value",
                  angle: -90,
                  position: "insideLeft",
                  offset: -5,
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                }}
                labelStyle={{ color: "#333" }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#007BFF"
                strokeWidth={2.5}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ))}
      <p className="text-xs text-gray-500 mt-4 text-center">Source: WAQI API</p>
    </div>
  );
};

export default AQIForecastCharts;