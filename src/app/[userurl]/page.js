"use client";

import { useEffect, useState } from "react";
import UserLinks from "@/components/User/UserLinks";
import UserNotFound from "@/components/User/UserNotFound";

export default function UserPage({ params }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Unwrap params (userurl) and fetch data dynamically
  useEffect(() => {
    async function fetchUser() {
      try {
        const { userurl } = await params; // Resolve params here
        const response = await fetch(`/api/users/${userurl}`);
        if (!response.ok) {
          throw new Error("User not found");
        }
        const userData = await response.json();
        setUser(userData);
      } catch (err) {
        console.error("Failed to fetch user:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [params]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <UserNotFound message={error} />;
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 neon-text">
            {user.name || "User's Links"}
          </h1>
          {user.bio && (
            <p className="text-xl text-gray-400 max-w-2xl mx-auto neon-text-subtle">
              {user.bio}
            </p>
          )}
        </header>

        <main>
          {user.links && user.links.length > 0 ? (
            <UserLinks links={user.links} />
          ) : (
            <p className="text-center text-gray-500 neon-text-subtle">
              No links added yet.
            </p>
          )}
        </main>

        <style jsx global>{`
          @keyframes flicker {
            0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
              text-shadow: 0 0 10px var(--neon-color), 0 0 20px var(--neon-color),
                0 0 30px var(--neon-color), 0 0 40px var(--neon-color);
            }
            20%, 24%, 55% {
              text-shadow: none;
            }
          }

          .neon-text {
            --neon-color: #f40;
            color: #fff;
            font-size: 2rem;
            text-transform: uppercase;
            font-weight: bold;
            animation: flicker 1.5s infinite alternate;
          }

          .neon-text-subtle {
            --neon-color: #08f;
            font-size: 1rem;
            animation: flicker 4s infinite alternate;
          }

          .loading {
            font-size: 2rem;
            color: #f40;
            text-align: center;
            padding-top: 20vh;
            animation: flicker 1s infinite alternate;
          }
        `}</style>
      </div>
    </div>
  );
}
