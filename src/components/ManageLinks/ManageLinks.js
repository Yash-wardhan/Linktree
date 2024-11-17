"use client";

import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ManageLinks({ userId, existingLinks, existingBio }) {
  const [links, setLinks] = useState(existingLinks || []);
  const [bio, setBio] = useState(existingBio || ""); // Track the bio
  const [newLink, setNewLink] = useState({ title: "", url: "" });
  const [error, setError] = useState("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false); // Track unsaved changes

  // Handle adding a new link
  const handleAddLink = () => {
    if (links.length >= 4) {
      toast.error("You can only add up to 4 links.");
      return;
    }

    if (!newLink.title.trim() || !newLink.url.trim()) {
      toast.error("Both title and URL are required.");
      return;
    }

    if (!/^https?:\/\/[^\s]+$/.test(newLink.url)) {
      toast.error("Please enter a valid URL starting with http:// or https://");
      return;
    }

    setLinks([...links, { ...newLink, id: Date.now().toString() }]); // Generate a temporary ID
    setNewLink({ title: "", url: "" });
    setHasUnsavedChanges(true); // Mark as unsaved
    toast.success("Link added successfully!");
  };

  // Handle deleting a link
  const handleDeleteLink = (id) => {
    setLinks(links.filter((link) => link.id !== id));
    setHasUnsavedChanges(true); // Mark as unsaved
    toast.success("Link deleted successfully!");
  };

  // Handle saving links
  const handleSaveLinks = async () => {
    try {
      const res = await fetch("/api/users/update-links", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, links }),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.message || "An error occurred while saving links.");
      } else {
        setHasUnsavedChanges(false); // Reset unsaved changes
        toast.success("Links updated successfully!");
      }
    } catch (error) {
      console.error("Error saving links:", error.message);
      toast.error("An error occurred. Please try again.");
    }
  };

  // Handle saving bio
  const handleSaveBio = async () => {
    try {
      const res = await fetch("/api/users/update-bio", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, bio }),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.message || "An error occurred while saving the bio.");
      } else {
        toast.success("Bio updated successfully!");
      }
    } catch (error) {
      console.error("Error saving bio:", error.message);
      toast.error("An error occurred. Please try again.");
    }
  };

  useEffect(() => {
    if (hasUnsavedChanges) {
      console.log("You have unsaved changes.");
    }
  }, [hasUnsavedChanges]);

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold mb-4">Manage Your Profile</h2>

      {/* Bio Section */}
      <div className="mb-4">
        <label htmlFor="bio" className="block text-lg font-semibold mb-2">
          Bio
        </label>
        <textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Write a short bio about yourself"
          className="border p-2 rounded w-full"
          rows={4}
        />
        <button
          onClick={handleSaveBio}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Save Bio
        </button>
      </div>

      {/* Links Section */}
      <h3 className="text-xl font-semibold mb-2">Your Links</h3>
      {links.map((link) => (
        <div key={link.id} className="flex items-center justify-between mb-2 border p-2 rounded">
          <div>
            <p className="font-semibold">{link.title}</p>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              {link.url}
            </a>
          </div>
          <button
            onClick={() => handleDeleteLink(link.id)}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      ))}

      {links.length < 4 && (
        <div className="flex items-center space-x-2 mb-4">
          <input
            type="text"
            placeholder="Link Title"
            value={newLink.title}
            onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
            className="border p-2 rounded flex-1"
          />
          <input
            type="text"
            placeholder="Link URL"
            value={newLink.url}
            onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
            className="border p-2 rounded flex-1"
          />
          <button
            onClick={handleAddLink}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Add Link
          </button>
        </div>
      )}

      <button
        onClick={handleSaveLinks}
        className={`px-4 py-2 rounded ${
          hasUnsavedChanges
            ? "bg-yellow-500 hover:bg-yellow-600 text-black"
            : "bg-blue-500 hover:bg-blue-600 text-white"
        }`}
      >
        {hasUnsavedChanges ? "Save Changes" : "Saved"}
      </button>

      {/* Toast Container */}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </div>
  );
}
