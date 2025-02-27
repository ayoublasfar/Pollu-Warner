import React, { useState } from "react";

function AQIAlerts() {
  const [aqi, setAqi] = useState(50); // Default AQI value
  const [receiveAlerts, setReceiveAlerts] = useState(false);
  const [savedAqiValues, setSavedAqiValues] = useState([]);
  const [saveMessage, setSaveMessage] = useState(false);

  const handleSave = () => {
    if (savedAqiValues.length < 4 && !savedAqiValues.includes(aqi)) {
      setSavedAqiValues([...savedAqiValues, aqi]);
      console.log("Saved AQI preferences:", { aqi, receiveAlerts });

      setSaveMessage(true);
      setTimeout(() => setSaveMessage(false), 3000); // Hide message after 3 seconds
    } else {
      alert("You can only save up to 4 unique AQI values.");
    }
  };

  const handleRemove = (value) => {
    setSavedAqiValues(savedAqiValues.filter((v) => v !== value));
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-bold mb-4">AQI Alerts</h2>

      {/* AQI Slider */}
      <div className="mb-4">
        <label className="font-semibold block mb-2">Select AQI Threshold</label>
        <input
          type="range"
          min="0"
          max="500"
          value={aqi}
          onChange={(e) => setAqi(Number(e.target.value))}
          className="w-full"
        />
        <div className="text-center mt-2 text-lg font-semibold">
          AQI Value: {aqi}
        </div>
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

      {/* Saved AQI Alerts */}
      <div className="mt-4">
        <h3 className="font-semibold mb-2">Saved AQI Alerts ({savedAqiValues.length}/4)</h3>
        <ul className="border border-gray-300 p-2 rounded-md">
          {savedAqiValues.map((value) => (
            <li
              key={value}
              className="flex justify-between items-center mb-2"
            >
              <span>AQI Value: {value}</span>
              <button
                onClick={() => handleRemove(value)}
                className="text-sm bg-red-500 text-white px-2 py-1 rounded-md"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Save Message Notification */}
      {saveMessage && (
        <div className="mt-2 bg-green-500 text-white px-4 py-2 rounded-md text-center">
          AQI threshold saved successfully!
        </div>
      )}
    </div>
  );
}

export default AQIAlerts;
