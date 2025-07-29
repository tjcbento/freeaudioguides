import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeadphones, FaMapMarkedAlt } from "react-icons/fa";

const LANGUAGES = [
  { code: "en", flag: "https://flagcdn.com/gb.svg" },
  { code: "fr", flag: "https://flagcdn.com/fr.svg" },
  { code: "pt", flag: "https://flagcdn.com/pt.svg" },
];

export default function Header() {
  const navigate = useNavigate();
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "en"
  );

  const handleLanguageChange = (code) => {
    localStorage.setItem("language", code);
    setLanguage(code);
    window.location.reload();
  };

  const pink = "#FCB2BF";

  return (
    <header
      className="fixed top-0 left-0 right-0 h-16 flex items-center px-4 z-50"
      style={{
        backgroundColor: pink,
        borderBottom: `1px solid ${pink}`,
        color: pink,
      }}
    >
      {/* Logo Left */}
      <div
        className="flex items-center cursor-pointer"
        onClick={() => navigate("/")}
        aria-label="Go to homepage"
      >
        <img
          src="http://localhost:3001/static/other/logo_minimalist_circle.png"
          alt="Logo"
          className="h-10 object-contain"
          style={{ userSelect: "none" }}
        />
      </div>

      <nav className="flex flex-1 justify-center items-center gap-6">
        <button
          onClick={() => navigate("/guides")}
          className="flex flex-col items-center px-4 py-2 bg-[#FCB2BF] rounded-lg hover:bg-[#f996a6] transition"
          aria-label="Go to Guides"
        >
          <FaHeadphones className="text-[#5a2d82] text-xl mb-1" />
          <span className="text-[#5a2d82] font-semibold text-sm">Guides</span>
        </button>

        <button
          onClick={() => navigate("/tours")}
          className="flex flex-col items-center px-4 py-2 bg-[#FCB2BF] rounded-lg hover:bg-[#f996a6] transition"
          aria-label="Go to Tours"
        >
          <FaMapMarkedAlt className="text-[#5a2d82] text-xl mb-1" />
          <span className="text-[#5a2d82] font-semibold text-sm">Tours</span>
        </button>
      </nav>

      {/* Language Selector Right */}
      <div className="relative">
        <button
          onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
          className="flex items-center rounded-full p-1 shadow transition"
          aria-label="Select language"
          style={{
            border: `1px solid ${pink}`,
            backgroundColor: "white",
            cursor: "pointer",
          }}
        >
          <img
            src={
              LANGUAGES.find((lang) => lang.code === language)?.flag ||
              "https://flagcdn.com/gb.svg"
            }
            alt={language}
            className="h-5 w-auto"
          />
        </button>
        {languageDropdownOpen && (
          <div
            className="absolute right-0 mt-2 rounded-md shadow-lg z-50"
            style={{
              backgroundColor: "white",
              border: `1px solid ${pink}`,
            }}
          >
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  handleLanguageChange(lang.code);
                  setLanguageDropdownOpen(false);
                }}
                className="flex items-center p-1 hover:bg-gray-100 w-full"
              >
                <img
                  src={lang.flag}
                  alt={lang.code}
                  className="h-5 w-auto mx-auto"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
