"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function UserNotFound({ message }) {
  const [timer, setTimer] = useState(5); // Set countdown timer (in seconds)
  const router = useRouter();

  useEffect(() => {
    // Decrement timer every second
    const countdown = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    // Redirect to home when timer reaches 0
    if (timer === 0) {
      router.push("/");
    }

    // Clear interval on component unmount
    return () => clearInterval(countdown);
  }, [timer, router]);

  return (
    <div className="text-center mt-10">
      <h1 className="text-red-500 text-2xl mb-4">{message}</h1>
      <p className="text-gray-600 mb-4">
        Redirecting to the home page in <span className="font-bold">{timer}</span> seconds...
      </p>
      <button
        onClick={() => router.push("/")}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
      >
        Go to Home Now
      </button>
    </div>
  );
}
