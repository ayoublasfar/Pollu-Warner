import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";

// Function to get AQI color based on value
const getAQIColor = (aqi) => {
  if (aqi <= 50) return "#00E400"; // Good (Green)
  if (aqi <= 100) return "#FFFF00"; // Moderate (Yellow)
  if (aqi <= 150) return "#FF7E00"; // Unhealthy for Sensitive Groups (Orange)
  if (aqi <= 200) return "#FF0000"; // Unhealthy (Red)
  if (aqi <= 300) return "#99004C"; // Very Unhealthy (Purple)
  return "#7E0023"; // Hazardous (Maroon)
};

const Map = () => {
  const mapContainer = useRef(null); // Reference for the map container
  const mapInstance = useRef(null); // Reference for Leaflet map instance
  const userMarker = useRef(null); // Reference for user's location marker
  const markersGroup = useRef(null); // Reference for the markers layer group
  const [userLocation, setUserLocation] = useState(null); // To store user location
  const [aqi, setAqi] = useState(null); // To store AQI value

  // Fetch user's location and AQI
  useEffect(() => {
    axios
      .get("http://ip-api.com/json")
      .then((response) => {
        const { lat, lon } = response.data;
        setUserLocation({ lat, lon });

        // Fetch AQI data for the user's location
        const apiUrl = `https://api.waqi.info/feed/geo:${lat};${lon}/?token=d786d891d9a94b4be17ce32c405942d5f8f48395`;
        return axios.get(apiUrl);
      })
      .then((response) => {
        const aqiData = response.data?.data?.aqi || null;
        setAqi(aqiData);
      })
      .catch((err) => {
        console.error("Failed to load location or AQI data", err);
      });
  }, []);

  // Function to fetch cities within the map bounds using Overpass API
  const fetchCities = async (bounds) => {
    const northEast = bounds.getNorthEast();
    const southWest = bounds.getSouthWest();
    const bbox = `${southWest.lng},${southWest.lat},${northEast.lng},${northEast.lat}`;

    const zoomLevel = mapInstance.current.getZoom();
    const maxCities = zoomLevel < 10 ? 10 : 20; // Adjust city limit based on zoom level

    // Minimum population size for large cities (e.g., 50,000 people)
    const minPopulation = 50000;

    // Updated Overpass query to filter cities by population
    const overpassQuery = `
      [out:json];
      (
        node["place"="city"](if: t["population"] >= ${minPopulation})(${southWest.lat},${southWest.lng},${northEast.lat},${northEast.lng});
        node["place"="town"](if: t["population"] >= ${minPopulation})(${southWest.lat},${southWest.lng},${northEast.lat},${northEast.lng});
        node["place"="village"](if: t["population"] >= ${minPopulation})(${southWest.lat},${southWest.lng},${northEast.lat},${northEast.lng});
      );
      out body ${maxCities};
    `;

    try {
      const response = await axios.post(
        "https://overpass-api.de/api/interpreter",
        overpassQuery,
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );

      const cities = response.data.elements || [];
      if (cities.length === 0) {
        console.log("No cities found in the bounds.");
      }

      markersGroup.current.clearLayers(); // Clear old markers

      // Add a marker for each city
      cities.forEach((city) => {
        const lat = city.lat;
        const lon = city.lon;

        // Fetch AQI for the city
        const apiUrl = `https://api.waqi.info/feed/geo:${lat};${lon}/?token=d786d891d9a94b4be17ce32c405942d5f8f48395`;
        axios.get(apiUrl).then((aqiResponse) => {
          const aqiData = aqiResponse.data?.data?.aqi || null;
          const color = getAQIColor(aqiData);

          L.marker([lat, lon], {
            icon: L.divIcon({
              className: "aqi-marker",
              html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white;"></div>`,
            }),
          })
            .bindPopup(`<strong>${city.tags.name}</strong><br>AQI: ${aqiData || "N/A"}`)
            .addTo(markersGroup.current);
        });
      });
    } catch (error) {
      console.error("Error fetching cities from Overpass API:", error);
    }
  };

  // Initialize the map and handle markers
  useEffect(() => {
    if (userLocation && mapContainer.current) {
      const { lat, lon } = userLocation;

      // Initialize the map
      mapInstance.current = L.map(mapContainer.current, {
        center: [lat, lon],
        zoom: 13,
      });

      // Add tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstance.current);

      // Add marker for user's location
      userMarker.current = L.marker([lat, lon]).addTo(mapInstance.current);
      userMarker.current
        .bindPopup(`Current AQI: ${aqi || "Loading..."}`)
        .openPopup();

      // Group to manage other markers
      markersGroup.current = L.layerGroup().addTo(mapInstance.current);

      // Fetch cities within bounds on map movement
      const onMoveEnd = () => {
        const bounds = mapInstance.current.getBounds();
        fetchCities(bounds);
      };

      // Listen to moveend event to dynamically load cities
      mapInstance.current.on("moveend", onMoveEnd);

      // Initial fetch of cities
      const initialBounds = mapInstance.current.getBounds();
      fetchCities(initialBounds);

      return () => {
        mapInstance.current.remove(); // Cleanup map on unmount
      };
    }
  }, [userLocation]);

  // Update AQI for the user's location
  useEffect(() => {
    if (aqi !== null && userMarker.current) {
      const color = getAQIColor(aqi);

      userMarker.current.setIcon(
        L.divIcon({
          className: "aqi-marker",
          html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white;"></div>`,
        })
      );

      userMarker.current.bindPopup(`Current AQI: ${aqi}`).openPopup();
    }
  }, [aqi]);

  return (
    <div className="w-full h-full flex flex-col p-0 m-0">
      <div
        ref={mapContainer}
        className="w-full h-full"
        style={{ height: "100vh", width: "100%" }}
      ></div>
    </div>
  );
};

export default Map;