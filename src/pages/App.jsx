import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./LandingPage";
import Footer from "./Footer";
import GuidesPage from "./GuidesPage";
import ToursPage from "./ToursPage";
import Header from "./Header";

const LANGUAGES = [
  { code: "EN", flag: "https://flagcdn.com/gb.svg" },
  { code: "FR", flag: "https://flagcdn.com/fr.svg" },
  { code: "PT", flag: "https://flagcdn.com/pt.svg" },
];

export default function App() {
  const [language, setLanguage] = useState("en");

  function handleLanguageChange(code) {
    setLanguage(code);
  }

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header
          language={language}
          handleLanguageChange={handleLanguageChange}
          LANGUAGES={LANGUAGES}
        />
        <main className="flex-grow">
          <Routes>
            <Route
              path="/"
              element={<LandingPage language={language} />}
            />
            <Route
              path="/guides"
              element={<GuidesPage language={language} />}
            />
            <Route
              path="/tours"
              element={<ToursPage language={language} />}
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
