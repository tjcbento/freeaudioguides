import { useState, useEffect } from "react";
import { Twitter, Instagram } from "lucide-react";

const TipPopup = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (Math.random() < 1) {
      setShow(true);
    }
  }, []);

  if (!show) return null;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={() => setShow(false)}
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.4)",
          zIndex: 1000,
          cursor: "pointer",
        }}
        aria-label="Close tip popup overlay"
      />

      {/* Modal */}
    <div
  role="dialog"
  aria-modal="true"
  aria-labelledby="tip-popup-title"
  style={{
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#FCB2BF", // updated here
    borderRadius: 12,
    padding: 24,
    boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
    maxWidth: 400,
    width: "90%",
    zIndex: 1001,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: "#333",
    textAlign: "center",
  }}
>

        {/* Close Cross */}
        <button
          onClick={() => setShow(false)}
          aria-label="Close tip popup"
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            backgroundColor: "#ccc",
            borderRadius: 6,
            border: "none",
            width: 50,
            height: 50,
            fontSize: 28,
            fontWeight: "bold",
            cursor: "pointer",
            color: "#333",
            lineHeight: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background-color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#aaa")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ccc")}
        >
          ×
        </button>

        <h2
          id="tip-popup-title"
          style={{
            marginBottom: 12,
            fontWeight: "700",
            fontSize: "1.5rem",
            color: "#5a2d82",
          }}
        >
          Support Us
        </h2>

        <p style={{ fontSize: "1rem", lineHeight: 1.5, marginBottom: 20 }}>
          If you like our content, consider leaving a tip.
          <br />
          <br />
          If you can’t donate, please share our socials and tag us in your
          posts. Growing our reach means more support and better content for
          everyone.
        </p>

        {/* Tip Button */}
        <button
          onClick={() => setShow(false)}
          style={{
            backgroundColor: "#5a2d82",
            border: "none",
            color: "white",
            padding: "10px 24px",
            borderRadius: 24,
            fontWeight: "600",
            cursor: "pointer",
            fontSize: "1rem",
            transition: "background-color 0.3s",
            marginBottom: 24,
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#7b4ab3")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#5a2d82")
          }
          aria-label="Close tip popup"
        >
          Leave a Tip
        </button>

        {/* Social Icons */}
        <div style={{ display: "flex", justifyContent: "center", gap: 24 }}>
          <a
            href="https://twitter.com/yourhandle"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
            style={{ color: "#1DA1F2" }}
          >
            <Twitter size={28} />
          </a>

          <a
            href="https://instagram.com/yourhandle"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            style={{ color: "#E4405F" }}
          >
            <Instagram size={28} />
          </a>
        </div>
      </div>
    </>
  );
};

export default TipPopup;
