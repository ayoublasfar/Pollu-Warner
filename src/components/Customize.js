import React, { useState } from "react";

function HealthConditions() {
  const [hasHealthCondition, setHasHealthCondition] = useState(null); // Yes/No toggle
  const [agreeToShare, setAgreeToShare] = useState(false); // Agreement to share data
  const [saveMessage, setSaveMessage] = useState(false);

  const handleSave = () => {
    if (hasHealthCondition !== null && agreeToShare) {
      console.log("User's health condition:", { hasHealthCondition, agreeToShare });

      setSaveMessage(true);
      setTimeout(() => setSaveMessage(false), 3000); // Hide message after 3 seconds
    } else {
      alert("Please answer both the health condition and the data sharing agreement.");
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-bold mb-4">Customize my recommendations</h2>

      {/* Health Condition Question */}
      <div className="mb-4">
        <label className="font-semibold block mb-2">Do you have any health conditions related to air quality?</label>
        <div className="flex space-x-4">
          <div>
            <label className="mr-2">Yes</label>
            <input
              type="radio"
              value="yes"
              checked={hasHealthCondition === "yes"}
              onChange={() => setHasHealthCondition("yes")}
            />
          </div>
          <div>
            <label className="mr-2">No</label>
            <input
              type="radio"
              value="no"
              checked={hasHealthCondition === "no"}
              onChange={() => setHasHealthCondition("no")}
            />
          </div>
        </div>
      </div>
	  
	  {/* Agreement to Share Data */}
      <div className="mb-4 flex items-center">
        <input
          type="checkbox"
          checked={agreeToShare}
          onChange={() => setAgreeToShare(!agreeToShare)}
          className="w-6 h-6 mr-2"
        />
        <label className="font-semibold">I agree to share my health data with the service</label>
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
          Your information has been saved successfully!
        </div>
      )}
    </div>
  );
}

export default HealthConditions;
