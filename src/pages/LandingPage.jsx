import { useState, useEffect } from "react";
import { FaMapMarkedAlt, FaHeadphones } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Coffee, Twitter, Instagram } from "lucide-react";

export default function LandingPage() {
  const [showModal, setShowModal] = useState(false);
  const [searchMode, setSearchMode] = useState("smart");
  const [availableGuides, setAvailableGuides] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://127.0.0.1:3001/availableguides")
      .then((res) => res.json())
      .then((data) => setAvailableGuides(data))
      .catch((err) => {
        console.error("Failed to fetch available guides", err);
        setAvailableGuides([]);
      });
  }, []);

  const handleStartClick = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Hero Section */}
      <section
        id="home"
        className="min-h-screen flex flex-col items-center justify-center py-24 px-6 text-white"
        style={{
          backgroundImage: `url("http://localhost:3001/static/other/banner.png")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="relative z-10 text-center max-w-3xl p-8">
          <img
            src="http://localhost:3001/static/other/logo.png"
            alt="Free Audio Guide Logo"
            className="mx-auto mb-6 md:h-24"
          />

          <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-white">
            Thank you for visiting us!
          </h2>

          <p className="text-md md:text-lg font-semibold mb-6 max-w-xl mx-auto text-white">
            Explore a growing collection of bite-sized audio guides.
          </p>

         <div className="overflow-x-auto mb-6">
  <table className="max-w-md md:max-w-lg mx-auto text-sm text-left text-purple-100 bg-purple-800 bg-opacity-70 rounded-lg shadow-md">
    <thead>
      <tr>
        <th className="py-2 px-3 border-b border-purple-600 font-semibold text-white text-sm">
          City
        </th>
        <th className="py-2 px-3 border-b border-purple-600 font-semibold text-white text-sm text-center">
          Number of Audioguides
        </th>
      </tr>
    </thead>
    <tbody>
      {availableGuides.length === 0 ? (
        <tr>
          <td
            colSpan={2}
            className="text-center py-4 text-purple-300 italic text-sm"
          >
            Loading audioguides...
          </td>
        </tr>
      ) : (
        availableGuides.map(({ city, nraudioguides }) => (
          <tr
            key={city}
            className="hover:bg-purple-700 transition cursor-default"
          >
            <td className="py-1.5 px-3 border-b border-purple-600 text-white text-sm">
              {city}
            </td>
            <td className="py-1.5 px-3 border-b border-purple-600 text-white text-sm text-center">
              {nraudioguides}
            </td>
          </tr>
        ))
      )}
    </tbody>
  </table>
</div>

          <p className="text-md md:text-lg font-semibold max-w-xl mx-auto text-white">
            We hope you stick around and add us on your socials!
          </p>

          {/* Social Icons below the socials text */}
          <div className="flex justify-center mt-2 space-x-6 text-purple-600">
            <a
              href="https://instagram.com/yourhandle"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="hover:text-purple-400 transition"
            >
              <Instagram className="w-7 h-7" />
            </a>{" "}
            <a
              href="https://twitter.com/yourhandle"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter/X"
              className="hover:text-purple-400 transition"
            >
              <Twitter className="w-7 h-7" />
            </a>
          </div>

          <p className="text-md md:text-lg font-semibold mt-4 max-w-xl mx-auto text-white">
            Curious about what’s coming next? Visit our{" "}
            <a
              href="#roadmap"
              className="text-purple-600 font-bold underline hover:text-purple-400 transition"
            >
              roadmap
            </a>{" "}
            for upcoming features and updates.
          </p>

          <button
            onClick={handleStartClick}
            className="mt-8 bg-gradient-to-r from-purple-600 to-purple-400 text-white font-bold py-3 px-6 rounded-lg shadow hover:from-purple-700 hover:to-purple-500 transition"
          >
            Start
          </button>
        </div>
      </section>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-lg relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold"
              aria-label="Close modal"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-6 text-center text-purple-700">
              Choose your experience
            </h2>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div
                onClick={() => navigate("/guides")}
                className="cursor-pointer flex flex-col items-center p-4 bg-gray-100 rounded-xl hover:bg-purple-50 transition"
              >
                <FaHeadphones className="text-purple-600 text-3xl mb-2" />
                <span className="text-lg font-semibold mb-1">Guides</span>
                <p className="text-sm text-center text-gray-600">
                  Single-location audioguides
                </p>
              </div>
              <div
                onClick={() => navigate("/tours")}
                className="cursor-pointer flex flex-col items-center p-4 bg-gray-100 rounded-xl hover:bg-purple-50 transition"
              >
                <FaMapMarkedAlt className="text-purple-600 text-3xl mb-2" />
                <span className="text-lg font-semibold mb-1">Tours</span>
                <p className="text-sm text-center text-gray-600">
                  Curated series of audioguides in order
                </p>
              </div>
            </div>

            {/* Toggle Selector */}
            <div className="flex justify-end mb-6 space-x-2">
              <button
                onClick={() => setSearchMode("smart")}
                aria-pressed={searchMode === "smart"}
                className={`min-w-[120px] py-3 px-6 font-bold text-sm rounded-full transition ${
                  searchMode === "smart"
                    ? "bg-purple-700 text-white"
                    : "text-purple-600 hover:bg-purple-100 hover:text-purple-800"
                }`}
              >
                <span>Smart</span>
                <br />
                <span>Search</span>
              </button>
              <button
                onClick={() => setSearchMode("advanced")}
                aria-pressed={searchMode === "advanced"}
                className={`min-w-[120px] py-3 px-6 font-bold text-sm rounded-full transition ${
                  searchMode === "advanced"
                    ? "bg-purple-700 text-white"
                    : "text-purple-600 hover:bg-purple-100 hover:text-purple-800"
                }`}
              >
                <span>Advanced</span>
                <br />
                <span>Search</span>
              </button>
            </div>

            <p className="text-center text-base font-semibold">
              {searchMode === "smart"
                ? "Audioguides near your location"
                : "Search by audioguide name"}
            </p>
          </div>
        </div>
      )}

      {/* Mission Section */}
      <section
        id="mission"
        className="min-h-screen flex flex-col items-center justify-center bg-white py-24 px-6 space-y-12"
      >
        <div className="max-w-3xl text-center">
          <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
          <div className="flex justify-center gap-12">
            <div className="flex flex-col items-center">
              <img
                src="https://img.freepik.com/premium-vector/man-avatar-profile-picture-isolated-background-avatar-profile-picture-man_1293239-4841.jpg?semt=ais_hybrid&w=740"
                alt="Avatar 1"
                className="rounded-full w-28 h-28 object-cover mb-3 shadow-lg"
              />
              <p className="text-gray-900 mb-6 font-medium">Paulo Neves</p>
            </div>
            <div className="flex flex-col items-center">
              <img
                src="https://img.freepik.com/premium-vector/man-avatar-profile-picture-isolated-background-avatar-profile-picture-man_1293239-4841.jpg?semt=ais_hybrid&w=740"
                alt="Avatar 2"
                className="rounded-full w-28 h-28 object-cover mb-3 shadow-lg"
              />
              <p className="text-gray-900 mb-6 font-medium">Gabriel Reed</p>
            </div>
          </div>
          <p className="text-gray-700 text-lg mb-4">
            Two friends from college who share a passion for history and
            heritage. With master’s degrees and years guiding visitors through
            Lisbon, we know how powerful a story can be.
          </p>
          <p className="text-gray-700 text-lg mb-4">
            Our audioguides deliver focused, easy-to-digest insights that help
            visitors quickly grasp the cultural and historical significance of
            what they’re seeing.
          </p>
          <p className="text-gray-700 text-lg">
            While we highly recommend booking full guided tours for a truly
            immersive experience, our guides offer a convenient and flexible
            option for those who prefer to explore on their own.
          </p>
        </div>
      </section>

      {/* Why Free Section */}
      <section className="min-h-screen flex items-center justify-center bg-gray-100 py-24 px-6">
        <div className="max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-6">Why Free?</h2>

          <p className="text-lg mb-4">
            <a
              href="https://x.com/HakitaDev/status/1797245014268891236"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-700 underline font-semibold hover:text-purple-900 transition"
            >
              Culture shouldn’t exist only for those who can afford it.
            </a>
          </p>

          <p className="mb-6">
            Also, having worked as guides relying on tips for years, we’ve
            always been fairly compensated. We believe that online should be no
            different.
          </p>

          <p>
            If you like our content, consider leaving a{" "}
            <a
              href="https://buymeacoffee.com/yourhandle"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 hover:text-purple-800 font-bold text-lg underline transition"
            >
              tip
            </a>
            .
          </p>

          <p className="mb-6">
            If you can’t donate, please share our socials and tag us in your
            posts. Growing our reach means more support and better content for
            everyone.
          </p>

          <div className="flex justify-center space-x-4 mt-4">
            <a
              href="https://instagram.com/yourhandle"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-purple-500 transition"
              aria-label="Instagram"
            >
              <Instagram className="w-6 h-6" />
            </a>{" "}
            <a
              href="https://twitter.com/yourhandle"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-purple-500 transition"
              aria-label="Twitter/X"
            >
              <Twitter className="w-6 h-6" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
