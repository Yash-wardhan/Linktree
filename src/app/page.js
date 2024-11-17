"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const heroRef = useRef(null);
  const headingRef = useRef(null);
  const textRef = useRef(null);
  const formRef = useRef(null);
  const phoneRef = useRef(null);
  const vinylRef = useRef(null);

  useEffect(() => {
    try {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
      });

      // Initial states
      gsap.set([headingRef.current, textRef.current, formRef.current], {
        y: 50,
        opacity: 0,
      });
      gsap.set([phoneRef.current, vinylRef.current], {
        y: 100,
        opacity: 0,
      });

      // Animations
      tl.to(headingRef.current, {
        y: 0,
        opacity: 1,
        duration: 1,
      })
        .to(
          textRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 1,
          },
          "-=0.5"
        )
        .to(
          formRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 1,
          },
          "-=0.5"
        )
        .to(
          [phoneRef.current, vinylRef.current],
          {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.2,
          },
          "-=0.5"
        );

      // Floating animation for phone
      gsap.to(phoneRef.current, {
        y: -20,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });
    } catch (error) {
      console.error("GSAP Animation Error:", error);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#1B4332]">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 px-4 py-4">
        <nav className="max-w-6xl mx-auto flex items-center justify-between bg-white rounded-full px-6 py-3">
          <Link href="/" className="text-xl font-extrabold text-black no-underline">
            Linktree*
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/login" className="px-4 py-2 text-sm text-gray-600 no-underline hover:text-gray-900">
              Log In
            </Link>
            <Link href="/signup" className="px-4 py-2 text-sm bg-black no-underline text-white rounded-full hover:bg-gray-800">
              Sign up free
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="pt-32 pb-20 px-4" ref={heroRef}>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1
              ref={headingRef}
              className="text-[#C5E063] text-5xl md:text-7xl font-bold leading-tight"
            >
              Everything you are. In one, simple link in bio.
            </h1>
            <p ref={textRef} className="text-[#C5E063] text-lg md:text-xl">
              Join 50M+ people using Linktree for their link in bio. One link to help you share
              everything you create, curate and sell from your Instagram, TikTok, Twitter, YouTube
              and other social media profiles.
            </p>
            <div ref={formRef} className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                placeholder="linktr.ee/yourname"
                className="px-4 py-2 bg-white text-black rounded-full w-full sm:w-auto"
              />
              <Link
                href="/dashboard"
                className="px-6 py-2 bg-[#E9C0F5] text-black no-underline font-semibold rounded-full hover:bg-[#E9C0F5]/90"
              >
                Claim your Linktree
              </Link>
            </div>
          </div>

          {/* Images Section */}
          <div className="relative">
            <div ref={phoneRef} className="relative z-10">
              <Image
                src="/HeaderImageLeft.jpg"
                alt="Phone mockup"
                width={400}
                height={800}
                className="w-full max-w-[400px] mx-auto"
                priority
              />
            </div>
            {/* <div
              ref={vinylRef}
              className="absolute top-1/2 right-0 transform translate-x-1/4 -translate-y-1/2"
            >
              <Image
                src="/HeaderImageRight.jpg"
                alt="Vinyl record"
                width={200}
                height={200}
                className="w-full max-w-[200px]"
              />
            </div> */}
          </div>
        </div>
      </main>

      {/* Custom Styles */}
      <style jsx>{`
        .bg-[#1B4332] {
          background-color: #1b4332;
        }
        .text-[#C5E063] {
          color: #c5e063;
        }
        .bg-[#E9C0F5] {
          background-color: #e9c0f5;
        }
        .hover\:bg-[#E9C0F5]/90:hover {
          background-color: rgba(233, 192, 245, 0.9);
        }
      `}</style>
    </div>
  );
}