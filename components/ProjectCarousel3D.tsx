"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

interface CarouselProject {
  id: string;
  slug: string;
  name: string;
  coverPhoto?: string;
}

// If there aren't many real projects yet, we still want a full-looking ring —
// so we cycle through what exists to fill a minimum number of tile slots.
// Every tile still links to its real project page. This naturally stops
// repeating once enough real projects exist.
const MIN_TILES = 9;
const IDLE_SPEED = 0.035; // degrees per frame — the gentle perpetual drift
const FRICTION = 0.95; // how quickly a flick decays back toward idle speed
const RADIUS = 300;

export default function ProjectCarousel3D({ projects }: { projects: CarouselProject[] }) {
  const ringRef = useRef<HTMLDivElement>(null);
  const rotationRef = useRef(0);
  const velocityRef = useRef(IDLE_SPEED);
  const draggingRef = useRef(false);
  const lastXRef = useRef(0);
  const lastDeltaRef = useRef(0);
  const movedRef = useRef(0);

  const tiles =
    projects.length > 0
      ? Array.from({ length: Math.max(MIN_TILES, projects.length) }, (_, i) => projects[i % projects.length])
      : [];

  useEffect(() => {
    let frame: number;
    const loop = () => {
      if (!draggingRef.current) {
        rotationRef.current += velocityRef.current;
        velocityRef.current += (IDLE_SPEED - velocityRef.current) * 0.01;
        if (Math.abs(velocityRef.current) > IDLE_SPEED * 1.05) {
          velocityRef.current *= FRICTION;
        }
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `rotateY(${rotationRef.current}deg)`;
      }
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, []);

  function handlePointerDown(e: React.PointerEvent) {
    draggingRef.current = true;
    lastXRef.current = e.clientX;
    lastDeltaRef.current = 0;
    movedRef.current = 0;
    (e.target as Element).setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!draggingRef.current) return;
    const dx = e.clientX - lastXRef.current;
    const angleDelta = dx * 0.25;
    rotationRef.current += angleDelta;
    lastDeltaRef.current = angleDelta;
    lastXRef.current = e.clientX;
    movedRef.current += Math.abs(dx);
  }

  function handlePointerUp() {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    velocityRef.current = lastDeltaRef.current || IDLE_SPEED;
  }

  if (tiles.length === 0) return null;

  return (
    <div
      className="relative w-full select-none touch-pan-y cursor-grab active:cursor-grabbing"
      style={{ height: 480, perspective: 1400 }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <div ref={ringRef} className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
        {tiles.map((p, i) => {
          const angle = (360 / tiles.length) * i;
          return (
            <Link
              key={`${p.id}-${i}`}
              href={`/project/${p.slug}`}
              draggable={false}
              onClick={(e) => {
                if (movedRef.current > 6) e.preventDefault();
              }}
              className="absolute top-1/2 left-1/2 w-[112px] h-[144px] -mt-[72px] -ml-[56px] rounded-xl overflow-hidden shadow-lg shadow-ink/20 bg-panel"
              style={{
                transform: `rotateY(${angle}deg) translateZ(${RADIUS}px)`,
                backfaceVisibility: "hidden",
              }}
            >
              {p.coverPhoto ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.coverPhoto}
                  alt={p.name}
                  className="w-full h-full object-cover pointer-events-none"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-muted pointer-events-none px-2 text-center">
                  {p.name}
                </div>
              )}
            </Link>
          );
        })}
      </div>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <h1 className="font-display text-4xl md:text-6xl font-semibold text-ink text-center px-4">
          We are BuildProof.
        </h1>
      </div>
    </div>
  );
}
