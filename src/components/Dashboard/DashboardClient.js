"use client";

import { useState, useEffect } from "react";
import SetCustomUrl from "@/components/Dashboard/SetCustomUrl";
import ManageLinks from "@/components/ManageLinks/ManageLinks";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

export default function DashboardClient({ user }) {
  const [userData, setUserData] = useState(user); // Local state for user data
  const [error, setError] = useState("");
  const router = useRouter();

  // Function to update the user URL in the local state
  const handleUrlChange = (newUrl) => {
    setUserData((prevUser) => ({
      ...prevUser,
      userurl: newUrl,
    }));
    toast.success("Custom URL updated successfully!");
  };

  // Function to update user links in the local state
  const handleLinksUpdate = (updatedLinks) => {
    setUserData((prevUser) => ({
      ...prevUser,
      links: updatedLinks,
    }));
    toast.success("Links updated successfully!");
  };

  // Handle Sign-Out
  const handleSignOut = async () => {
    try {
      const res = await fetch("/api/auth/signout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        toast.success("You have been signed out.");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        toast.error("Failed to sign out. Please try again.");
      }
    } catch (error) {
      console.error("Error signing out:", error.message);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  useEffect(() => {
    if (userData.userurl) {
      console.log("User URL updated:", userData.userurl);
    }
  }, [userData.userurl]);

  useEffect(() => {
    if (userData.links) {
      console.log("User links updated:", userData.links);
    }
  }, [userData.links]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 p-6">
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-4xl font-bold text-left mb-6 text-gray-800">
          Dashboard
        </h1>
        <div className="mb-6 text-left flex flex-col md:justify-between md:flex-row">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-semibold text-gray-700">
              Welcome, {userData.name}!
            </h2>
            <p className="text-gray-500">
              Email: <strong>{userData.email}</strong>
            </p>
          </div>
          <div className="mt-4 flex flex-col-reverse justify-between gap-3">
            <div>
              Your unique URL:{" "}
              {userData.userurl ? (
                <a
                  href={`${process.env.NEXT_PUBLIC_API_URL}/${userData.userurl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline hover:text-blue-700"
                >
                  {userData.userurl}
                </a>
              ) : (
                <span className="text-gray-500">No URL set yet</span>
              )}
            </div>
            <div className="text-left md:text-center">
              <button
                onClick={handleSignOut}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Custom URL Section */}
        <div className="bg-gray-100 rounded-lg p-6 shadow-md mb-8">
          <h3 className="text-xl font-bold text-gray-700 mb-4">
            Set Your Custom URL
          </h3>
          <SetCustomUrl
            userId={userData.id}
            existingUrl={userData.userurl || ""}
            onUrlChange={handleUrlChange}
          />
        </div>

        {/* Links Management Section */}
        {userData.userurl && (
          <div className="bg-gray-100 rounded-lg p-6 shadow-md mb-6">
            <h3 className="text-xl font-bold text-gray-700 mb-4">
              Manage Your Links
            </h3>
            <ManageLinks
              userId={userData.id}
              existingLinks={userData.links || []}
              onLinksUpdate={handleLinksUpdate}
            />
          </div>
        )}

        {/* Error Notification */}
        {error && (
          <div className="mt-6 text-center">
            <p className="text-red-500 font-semibold">Error: {error}</p>
          </div>
        )}
      </div>
    </div>
  );
}