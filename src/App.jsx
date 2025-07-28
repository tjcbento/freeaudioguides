import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./LandingPage";
import Footer from "./Footer";
import GuidesPage from "./GuidesPage";
import ToursPage from "./ToursPage";

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/guides" element={<GuidesPage />} />
            <Route path="/tours" element={<ToursPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
