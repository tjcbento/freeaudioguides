import React from "react";
import TipPopup from "../components/Tip/TipPopup";
import { Coffee, Twitter, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <>
      <footer className="bg-gray-900 text-white py-6 px-4 text-center">
        <p className="mb-4 text-lg">Like us? Support us!</p>

        <div className="flex justify-center gap-6 text-2xl mb-4">
          {/* Buy Me A Coffee */}
          <a
            href="https://buymeacoffee.com/yourname"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-yellow-400 transition"
            aria-label="Buy Me A Coffee"
          >
            <Coffee className="w-6 h-6" />
          </a>
          {/* Instagram */}
          <a
            href="https://instagram.com/yourhandle"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-pink-400 transition"
            aria-label="Instagram"
          >
            <Instagram className="w-6 h-6" />
          </a>{" "}
          {/* Twitter/X */}
          <a
            href="https://twitter.com/yourhandle"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400 transition"
            aria-label="Twitter/X"
          >
            <Twitter className="w-6 h-6" />
          </a>
        </div>

        <p className="text-xs text-gray-400">
          {new Date().getFullYear()} - Free Audio Guides
        </p>
      </footer>

      <TipPopup />
    </>
  );
}
