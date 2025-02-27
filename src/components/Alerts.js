import React, { useState } from "react";
import axios from "axios";

function Alerts() {
  const [searchQuery, setSearchQuery] = useState("");
  const [places, setPlaces] = useState([]);
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [receiveAlerts, setReceiveAlerts] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [saveMessage, setSaveMessage] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery) return;

    const query = `
      [out:json];
      (
        node["place"~"city|town|village"]["name"~"${searchQuery}",i];
        node["place"="country"]["name"~"${searchQuery}",i];
      );
      out body;
    `;

    try {
      console.log("Sending search query to Overpass API:", query);

      const response = await axios.post("https://overpass-api.de/api/interpreter", query, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      console.log("Response from Overpass API:", response.data);

      const data = response.data.elements.map((place) => ({
        id: place.id,
        name: place.tags.name || "Unknown",
        type: place.tags.place || "Unknown",
        country: place.tags["addr:country"] || null, // Optional country tag
      }));

      if (data.length === 0) {
        setErrorMessage("No results found for your search.");
        console.log("No results found.");
      } else {
        setErrorMessage("");
      }

      setPlaces(data);
    } catch (error) {
      console.error("Error fetching places:", error);
      setErrorMessage("An error occurred while searching. Please try again.");
    }
  };

  const handleSelectPlace = (place) => {
    if (selectedPlaces.length < 10 && !selectedPlaces.find((p) => p.id === place.id)) {
      setSelectedPlaces([...selectedPlaces, place]);
    }
  };

  const handleRemovePlace = (id) => {
    setSelectedPlaces(selectedPlaces.filter((place) => place.id !== id));
  };

  const handleSave = () => {
    console.log("Saved selected places:", selectedPlaces);
    setSaveMessage(true);
    setTimeout(() => setSaveMessage(false), 3000); // Hide message after 3 seconds
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-bold mb-4">Alerts</h2>

      {/* Search Field */}
      <div className="flex mb-4">
        <input
          type="text"
          className="border border-gray-300 p-2 rounded-md flex-grow"
          placeholder="Search for a city or country..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Search
        </button>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
      )}

      {/* Search Results */}
      <div>
        <h3 className="font-semibold mb-2">Search Results</h3>
        <ul className="border border-gray-300 p-2 rounded-md max-h-40 overflow-y-auto">
          {places.map((place) => (
            <li
              key={place.id}
              className="flex justify-between items-center mb-2"
            >
              <span>
                {place.name}
                {place.type !== "country" && place.country ? `, ${place.country}` : ""}
              </span>
              <button
                onClick={() => handleSelectPlace(place)}
                className="text-sm bg-green-500 text-white px-2 py-1 rounded-md"
                disabled={selectedPlaces.find((p) => p.id === place.id) || selectedPlaces.length >= 10}
              >
                Add
              </button>
            </li>
          ))}
          {places.length === 0 && !errorMessage && (
            <div className="text-gray-500 text-sm">
              No results yet. Try searching for a city or country.
            </div>
          )}
        </ul>
      </div>

      {/* Selected Places */}
      <div className="mt-4">
        <h3 className="font-semibold mb-2">Selected Places ({selectedPlaces.length}/10)</h3>
        <ul className="border border-gray-300 p-2 rounded-md">
          {selectedPlaces.map((place) => (
            <li
              key={place.id}
              className="flex justify-between items-center mb-2"
            >
              <span>
                {place.name}
                {place.type !== "country" && place.country ? `, ${place.country}` : ""}
              </span>
              <button
                onClick={() => handleRemovePlace(place.id)}
                className="text-sm bg-red-500 text-white px-2 py-1 rounded-md"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Toggle for Alerts */}
      <div className="mt-4 flex items-center">
        <label className="font-semibold mr-2">Receive Alerts</label>
        <input
          type="checkbox"
          className="w-6 h-6"
          checked={receiveAlerts}
          onChange={() => setReceiveAlerts(!receiveAlerts)}
        />
      </div>

      {/* Save Button */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={handleSave}
          className="bg-green-500 text-white px-4 py-2 rounded-md"
        >
          Save
        </button>
      </div>

      {/* Save Message Notification */}
      {saveMessage && (
        <div className="mt-2 bg-green-500 text-white px-4 py-2 rounded-md text-center">
          Places saved successfully!
        </div>
      )}
    </div>
  );
}

export default Alerts;
