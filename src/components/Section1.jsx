import React, { useState, useEffect } from "react";
import Typewriter from "typewriter-effect";

const VOCABULARY = [
  "CENSORSHIP", "RAW DATA", "VOICES", "VERIFIED", "THE AGENDA",
  "UNFILTERED", "DISPATCH", "SILENCE", "NOISE", "FACTS",
  "WITNESS", "RECORD", "PROOF", "OMITTED", "REDACTED"
];

export default function Section1({ count = 30, maxOpacity = 10, minSize = 5, maxSize = 40 }) {
  const [words, setWords] = useState([]);

  useEffect(() => {
    const generatedWords = Array.from({ length: count }).map((_, i) => ({
      id: i,
      text: VOCABULARY[Math.floor(Math.random() * VOCABULARY.length)],
      top: Math.floor(Math.random() * 100) + "%",
      left: Math.floor(Math.random() * 100) + "%",
      opacity: Math.floor(Math.random() * maxOpacity) + 5, // Minimum 5% opacity to be visible
      size: Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize,
      // Random speed between 15s (fast drift) and 45s (slow drift)
      duration: Math.floor(Math.random() * 30) + 15 + "s",
      // Random delay so they don't all start moving at once
      delay: Math.floor(Math.random() * 5) + "s",
    }));
    setWords(generatedWords);
  }, [count, maxOpacity, minSize, maxSize]);

  return (
    <section className="HERO w-full bg-black overflow-hidden relative">
      
      {/* DYNAMIC SCATTERED LAYER */}
      <div className="absolute inset-0 select-none pointer-events-none">
        {words.map((word) => (
          <span
            key={word.id}
            style={{
              top: word.top,
              left: word.left,
              fontSize: `${word.size}px`,
              opacity: word.opacity / 100,
              // Apply the random movement styles here
              animationName: "float",
              animationDuration: word.duration,
              animationDelay: word.delay,
              animationTimingFunction: "ease-in-out",
              animationIterationCount: "infinite"
            }}
            className="absolute font-black uppercase tracking-[0.2em] text-white whitespace-nowrap"
          >
            {word.text}
          </span>
        ))}
      </div>

      {/* MAIN CONTENT */}
      <div className="relative flex h-[70vh] w-full items-start pt-32 px-10 md:px-20 z-10">
        <div className="max-w-5xl">
          <div className="min-h-[200px] md:min-h-[300px]">
            <h1 className="font-serif text-5xl font-black leading-tight tracking-tight text-white md:text-8xl md:leading-[1.1]">
              <Typewriter
                onInit={(typewriter) => {
                  typewriter
                    .typeString("Who Speaks For The Facts?")
                    .start();
                }}
                options={{
                  delay: 40,
                  cursor: "|",
                  cursorClassName: "Typewriter__cursor",
                }}
              />
            </h1>
          </div>

          <p className="mt-8 text-[15px] font-black uppercase tracking-[5px] text-zinc-600">
            OneFifty / The Unfiltered Lens
          </p>
        </div>
      </div>
    </section>
  );
}
