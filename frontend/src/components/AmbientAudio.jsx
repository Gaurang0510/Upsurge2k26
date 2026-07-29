import { useEffect, useRef } from "react";

export default function AmbientAudio() {
  const audioRef = useRef(null);

useEffect(() => {
  console.log("AmbientAudio Loaded");

  const startAudio = async () => {
    console.log("Click detected");

    try {
      if (audioRef.current) {
        console.log("Trying to play...");
        audioRef.current.volume = 0.15;
        await audioRef.current.play();
        console.log("✅ Playing!");
      }
    } catch (err) {
      console.error("Play failed:", err);
    }
  };

  window.addEventListener("click", startAudio, { once: true });

  return () => {
    window.removeEventListener("click", startAudio);
  };
}, []);

  return (
    <audio ref={audioRef} loop preload="auto">
      <source src="/audio/server-room.mp3" type="audio/mpeg" />
    </audio>
  );
}