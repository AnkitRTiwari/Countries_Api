import { useEffect, useLayoutEffect, useState } from "react";
import "./Intro.css";
import { APP_NAME, APP_TAGLINE } from "../utilis/brand";

const SHOW_MS = 1300;
const LEAVE_MS = 700;

// Brand splash shown on each full page load; click anywhere to skip
const Intro = () => {
  const [phase, setPhase] = useState(() =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "done" : "playing"
  );

  // Page entrance animations stay paused until the curtain starts lifting
  useLayoutEffect(() => {
    document.documentElement.classList.toggle("intro-playing", phase === "playing");
  }, [phase]);

  useEffect(() => {
    if (phase === "done") return;
    const id = setTimeout(
      () => setPhase(phase === "playing" ? "leaving" : "done"),
      phase === "playing" ? SHOW_MS : LEAVE_MS
    );
    return () => clearTimeout(id);
  }, [phase]);

  if (phase === "done") return null;

  return (
    <div
      className={`intro ${phase === "leaving" ? "is-leaving" : ""}`}
      style={{ "--leave-duration": `${LEAVE_MS}ms` }}
      aria-hidden="true"
      onClick={() => setPhase("leaving")}
    >
      <div className="intro-content">
        <span className="intro-logo">
          <i className="fa-solid fa-earth-americas" />
        </span>
        <p className="intro-name">
          {[...APP_NAME].map((letter, i) => (
            <span key={i} style={{ "--i": i }}>
              {letter}
            </span>
          ))}
        </p>
        <p className="intro-tagline">{APP_TAGLINE}</p>
        <span className="intro-bar" />
      </div>
    </div>
  );
};

export default Intro;
