import React, { useState } from "react";

const LANGUAGES = [
  { code: "en", flag: "https://flagcdn.com/gb.svg" },
  { code: "fr", flag: "https://flagcdn.com/fr.svg" },
  { code: "pt", flag: "https://flagcdn.com/pt.svg" },
];

export default function Header() {
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "en"
  );

  const handleLanguageChange = (code) => {
    localStorage.setItem("language", code);
    setLanguage(code);
    window.location.reload();
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-50">
      <div style={{ width: 40 }}></div>
      <div className="flex justify-center flex-1">
        <img
          src="https://via.placeholder.com/120x40?text=Logo"
          alt="Logo"
          className="h-8 object-contain"
        />
      </div>
      <div className="relative">
        <button
          onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
          className="flex items-center border border-gray-300 rounded-full p-1 bg-white shadow hover:shadow-md transition"
          aria-label="Select language"
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
          <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg z-50">
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
