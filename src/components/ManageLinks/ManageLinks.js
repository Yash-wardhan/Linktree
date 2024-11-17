"use client";

import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";

export default function ManageLinks({ userId, existingLinks, existingBio }) {
  const [links, setLinks] = useState(existingLinks || []);
  const [bio, setBio] = useState(existingBio || "");
  const [newLink, setNewLink] = useState({ title: "", url: "" });
  const [error, setError] = useState("");
  const [isSavingLinks, setIsSavingLinks] = useState(false);
  const [isSavingBio, setIsSavingBio] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

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

    if (links.some((link) => link.url === newLink.url)) {
      toast.error("This link already exists.");
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
    if (!links.length) {
      toast.error("You must add at least one link before saving.");
      return;
    }

    setIsSavingLinks(true);

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
    } finally {
      setIsSavingLinks(false);
    }
  };

  // Handle saving bio
  const handleSaveBio = async () => {
    if (!bio.trim()) {
      toast.error("Bio cannot be empty.");
      return;
    }

    setIsSavingBio(true);

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
    } finally {
      setIsSavingBio(false);
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
          disabled={isSavingBio}
        />
        <button
          onClick={handleSaveBio}
          disabled={isSavingBio}
          className={`mt-2 px-4 py-2 rounded ${isSavingBio
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
        >
          {isSavingBio ? "Saving..." : "Save Bio"}
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
        <div className="flex items-start justify-start md:items-center flex-col md:flex-row md:space-x-2 mb-4">
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
        disabled={!hasUnsavedChanges || isSavingLinks}
        className={`px-4 py-2 rounded ${hasUnsavedChanges
            ? "bg-yellow-500 hover:bg-yellow-600 text-black"
            : "bg-blue-500 text-white"
          } ${isSavingLinks ? "cursor-not-allowed" : ""}`}
      >
        {isSavingLinks ? "Saving..." : hasUnsavedChanges ? "Save Changes" : "Saved"}
      </button>

      {/* Toast Container */}
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
    </div>
  );
}
