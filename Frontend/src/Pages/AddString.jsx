import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddString() {
  const [string, setString] = useState("");
  const [customRecoveryString, setCustomRecoveryString] = useState(""); // New state for custom recovery string
  const [recoveryString, setRecoveryString] = useState("");
  const [receivedString, setReceivedString] = useState(false);
  const [retrievedString, setRetrievedString] = useState("");

  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    console.log("String to upload:", string);

    axios
      .post("http://localhost:5000/api/v1/uploadString", {
        string,
        recoveryString: customRecoveryString || undefined, // Pass custom recovery string if provided
      })
      .then((response) => {
        setRecoveryString(response.data.recoveryString);
        alert(
          `String uploaded successfully! Recovery String: ${
            customRecoveryString || response.data.recoveryString
          }`
        );
      })
      .catch((error) => {
        console.error("Error uploading string:", error);
      });
  };

  const submitRecovery = (e) => {
    e.preventDefault();
    console.log("Recovery String:", recoveryString);

    axios
      .get("http://localhost:5000/api/v1/receiveString", {
        params: {
            RecoveryString: recoveryString,
        },
      })
      .then((response) => {
        console.log(response.data);
        setRetrievedString(response.data.string || "String not found!");
        setReceivedString(true);
      })
      .catch((error) => {
        console.error("Error retrieving string:", error);
      });
  };

  const handleCopy = () => {
    navigator.clipboard
      .writeText(retrievedString)
      .then(() => alert("Copied to clipboard!"))
      .catch(() => alert("Failed to copy!"));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 flex-col">
      {!receivedString && (
        <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
          <div className="text-gray-700 text-2xl font-bold mb-4">Text Manager</div>

          {/* Send String Form */}
          <form onSubmit={submitHandler} className="flex flex-col space-y-4">
            <div className="text-gray-700 text-lg font-semibold">Send Text</div>
            <div className="border border-gray-300 bg-amber-100 rounded-lg p-4">
              <textarea
                placeholder="Enter Text"
                value={string}
                className="w-full resize-none bg-transparent focus:outline-none focus:ring focus:ring-amber-300 rounded-md p-2"
                onChange={(e) => setString(e.target.value)}
                required
              />
            </div>
            <div className="text-gray-700 text-lg font-semibold">Set Recovery Password (Optional)</div>
            <input
              type="text"
              placeholder="Enter Custom Recovery Password"
              value={customRecoveryString}
              onChange={(e) => setCustomRecoveryString(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-amber-300 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-amber-500 text-white py-2 rounded-lg hover:bg-amber-600 transition"
            >
              Send text to Online Clipboard
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 border-t border-gray-300 text-center relative">
            <span className="bg-white px-2 text-gray-500 text-sm absolute -top-2.5 left-1/2 transform -translate-x-1/2">
              OR
            </span>
          </div>

          {/* Retrieve String Form */}
          <form onSubmit={submitRecovery} className="flex flex-col space-y-4">
            <div className="text-gray-700 text-lg font-semibold">Retrieve Text</div>
            <input
              type="text"
              placeholder="Enter Recovery String"
              value={recoveryString}
              onChange={(e) => setRecoveryString(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-amber-300 focus:outline-none"
              required
            />
            <button
              type="submit"
              className="bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-900 transition"
            >
              Retrieve Text From online Clipboard
            </button>
          </form>
        </div>
      )}

      {receivedString && (
        <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mt-6">
          <div className="flex justify-between items-center mb-4">
            <div className="text-gray-700 text-xl font-bold">Received String</div>
            <button
              onClick={handleCopy}
              className="bg-amber-500 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-amber-600 transition"
            >
              Copy
            </button>
          </div>
          <div
            className="border border-gray-300 rounded-lg p-4 text-gray-800 text-base font-medium bg-amber-100"
            style={{ whiteSpace: "pre-wrap" }}
          >
            {retrievedString}
          </div>
        </div>
      )}

      <br />
      <button
        onClick={() => navigate("/addFile")}
        className="bg-gray-800 text-white p-2 rounded-lg hover:bg-gray-900 transition"
      >
        SendFile
      </button>
    </div>
  );
}

export default AddString;
