"use client";

import { useState } from "react";

export default function SetCustomUrl({ userId, existingUrl, onUrlChange }) {
  const [customUrl, setCustomUrl] = useState(existingUrl || "");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const validateUrl = (url) => {
    if (url.length < 5) {
      setError("Custom URL must be at least 5 characters long.");
      return false;
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(url)) {
      setError("URL can only contain alphanumeric characters, dashes, and underscores.");
      return false;
    }
    setError("");
    return true;
  };

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setCustomUrl(url);

    if (!validateUrl(url)) {
      return;
    }
  };

  const handleUrlSubmit = async () => {
    if (!validateUrl(customUrl)) {
      return;
    }

    try {
      const res = await fetch("/api/users/update-url", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, userurl: customUrl }),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.message || "An error occurred while updating the URL.");
        setSuccess("");
      } else {
        setSuccess("Custom URL updated successfully!");
        setError("");

        // Notify the parent component of the URL change
        onUrlChange(customUrl);
      }
    } catch (err) {
      console.error("Error updating URL:", err);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div>
      <h2>Set Your Custom URL</h2>
      <input
        type="text"
        value={customUrl}
        onChange={handleUrlChange}
        placeholder="Enter your custom URL"
        className="border p-2 rounded"
      />
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}
      <button
        onClick={handleUrlSubmit}
        className="bg-blue-500 text-white px-4 py-2 mt-2 rounded hover:bg-blue-600"
      >
        Save URL
      </button>
    </div>
  );
}
