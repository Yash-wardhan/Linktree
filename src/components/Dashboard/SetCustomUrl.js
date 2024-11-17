"use client";

import { useState } from "react";
import debounce from "lodash.debounce";

export default function SetCustomUrl({ userId, existingUrl, onUrlChange }) {
  const [customUrl, setCustomUrl] = useState(existingUrl || "");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

  const debouncedValidateUrl = debounce((url) => validateUrl(url), 300);

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setCustomUrl(url);
    debouncedValidateUrl(url);
  };

  const handleUrlSubmit = async () => {
    if (!validateUrl(customUrl)) {
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

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
        onUrlChange(customUrl); // Notify parent component
      }
    } catch (err) {
      console.error("Error updating URL:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-gray-100 p-4 rounded shadow">
      <h2 className="text-lg font-bold mb-2">Set Your Custom URL</h2>
      <input
        type="text"
        value={customUrl}
        onChange={handleUrlChange}
        placeholder="Enter your custom URL"
        className="w-full border p-2 rounded mb-2"
        disabled={isLoading}
      />
      {error && (
        <p className="text-red-500 text-sm mb-2" aria-live="polite">
          {error}
        </p>
      )}
      {success && (
        <p className="text-green-500 text-sm mb-2" aria-live="polite">
          {success}
        </p>
      )}
      <button
        onClick={handleUrlSubmit}
        className={`w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition disabled:opacity-50 ${
          isLoading ? "cursor-not-allowed" : ""
        }`}
        disabled={isLoading}
      >
        {isLoading ? "Saving..." : "Save URL"}
      </button>
    </div>
  );
}