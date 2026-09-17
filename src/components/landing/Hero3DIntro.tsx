"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

interface MountainSpec {
  src: string;
  opacity: number;
  brightness: number;
  zIndex: number;
  /** Render width as a % of the viewport — bigger = closer/nearer layer. */
  widthPercent: number;
  /** Horizontal shift (as % of the layer's own width) so peaks scatter across the full screen instead of stacking centrally. */
  offsetPercent: number;
}

// Ordered back-to-front by each mountain's own natural peak height (shortest
// first), so stacking them full-width, bottom-anchored, gives a genuine
// "ridge behind ridge" silhouette instead of one image poking above another
// at random. Every layer spans the full viewport width — no gaps at the edges.
const MOUNTAIN_LAYERS: MountainSpec[] = [
  { src: "/night_mountain_2_trimmed.png", opacity: 0.45, brightness: 0.55, zIndex: 1, widthPercent: 102, offsetPercent: 0 },
  { src: "/night_mountain_6_trimmed.png", opacity: 0.6, brightness: 0.65, zIndex: 2, widthPercent: 102, offsetPercent: 0 },
  { src: "/night_mountain_5_trimmed.png", opacity: 0.75, brightness: 0.75, zIndex: 3, widthPercent: 102, offsetPercent: 0 },
  { src: "/night_mountain_3_trimmed.png", opacity: 0.88, brightness: 0.85, zIndex: 4, widthPercent: 102, offsetPercent: 0 },
  { src: "/night_mountain_4_trimmed.png", opacity: 1, brightness: 0.9, zIndex: 5, widthPercent: 102, offsetPercent: 0 },
];

const devotees = [
  "/devotees_1_trimmed.png",
  "/devotees_2_trimmed.png",
  "/devotees_3_trimmed.png",
  "/devotees_4_trimmed.png",
  "/devotees_5_trimmed.png",
  "/devotees_6_trimmed.png",
];

const ORBIT_RADIUS_X = 230;
const ORBIT_RADIUS_Y = 42;
const ORBIT_DURATION = 20;
const ORBIT_STEPS = 48;

function ellipseKeyframes(radiusX: number, radiusY: number, steps: number, phase: number) {
  const xs: number[] = [];
  const ys: number[] = [];
  for (let i = 0; i <= steps; i++) {
    const angle = ((i / steps) + phase) * Math.PI * 2;
    xs.push(Math.cos(angle) * radiusX);
    ys.push(Math.sin(angle) * radiusY);
  }
  return { xs, ys };
}

const SPRING = { stiffness: 90, damping: 24, mass: 0.6 };

export function Hero3DIntro() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);

  // Scroll-scrubbed progress across the whole (tall) section, while the
  // inner scene stays visually pinned via `sticky`.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const progress = useSpring(scrollYProgress, SPRING);

  // Scene 1 -> Scene 2 crossfade
  const heroTextOpacity = useTransform(progress, [0, 0.28], [1, 0]);
  const heroTextY = useTransform(progress, [0, 0.3], [0, -50]);
  const scrollHintOpacity = useTransform(progress, [0, 0.1, 0.9, 1], [1, 0, 0, 0]);

  const mountainsOpacity = useTransform(progress, [0.3, 0.6], [1, 0.2]);
  const skyY = useTransform(progress, [0, 1], [0, 40]);

  // Five real mountain layers, back to front — each scrolls/parallaxes a
  // little faster than the one behind it for a convincing depth effect.
  const mtn1Y = useTransform(progress, [0, 1], [0, 50]);
  const mtn2Y = useTransform(progress, [0, 1], [0, 90]);
  const mtn3Y = useTransform(progress, [0, 1], [0, 140]);
  const mtn4Y = useTransform(progress, [0, 1], [0, 190]);
  const mtn5Y = useTransform(progress, [0, 1], [0, 250]);

  // Temple grows and drifts toward center as the "darshan" scene arrives
  const templeTop = useTransform(progress, [0, 0.3, 0.85], ["46%", "46%", "40%"]);
  const templeScale = useTransform(progress, [0, 0.3, 0.85], [1, 1, 3.4]);

  const pilgrimsOpacity = useTransform(progress, [0.55, 0.75], [0, 1]);
  const pilgrimsY = useTransform(progress, [0.55, 0.8], [30, 0]);

  const secondCaptionOpacity = useTransform(progress, [0.62, 0.82], [0, 1]);
  const secondCaptionY = useTransform(progress, [0.62, 0.85], [24, 0]);

  const heroScale = useTransform(progress, [0, 0.3], [1, 1.06]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 });

  const mtn1X = useTransform(springX, [-0.5, 0.5], [6, -6]);
  const mtn2X = useTransform(springX, [-0.5, 0.5], [12, -12]);
  const mtn3X = useTransform(springX, [-0.5, 0.5], [20, -20]);
  const mtn4X = useTransform(springX, [-0.5, 0.5], [28, -28]);
  const mtn5X = useTransform(springX, [-0.5, 0.5], [38, -38]);
  const templeX = useTransform(springX, [-0.5, 0.5], [14, -14]);
  const rotateY3d = useTransform(springX, [-0.5, 0.5], [-5, 5]);
  const rotateX3d = useTransform(springY, [-0.5, 0.5], [5, -5]);

  const glowX = useTransform(springX, [-0.5, 0.5], ["10%", "90%"]);
  const glowY = useTransform(springY, [-0.5, 0.5], ["10%", "90%"]);

  const mountainMotion = [
    { y: mtn1Y, x: mtn1X },
    { y: mtn2Y, x: mtn2X },
    { y: mtn3Y, x: mtn3X },
    { y: mtn4Y, x: mtn4X },
    { y: mtn5Y, x: mtn5X },
  ];

  // The climber sits on the 4th ridge (night_mountain_2) and shares its
  // exact motion values so it stays visually glued to that slope.
  const climberY = mtn4Y;
  const climberX = mtn4X;

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = sceneRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <section ref={sectionRef} className="relative h-[220vh] w-full">
      <div
        ref={sceneRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="sticky top-0 h-screen w-full overflow-hidden bg-gradient-to-b from-[#0b1024] via-[#1a1a3d] to-[#2a1a35]"
        style={{ perspective: 1400 }}
      >
        {/* cursor-following glow orb (incense / divine light) */}
        <motion.div
          className="pointer-events-none absolute h-[420px] w-[420px] rounded-full blur-3xl"
          style={{
            left: glowX,
            top: glowY,
            x: "-50%",
            y: "-50%",
            willChange: "transform",
            background:
              "radial-gradient(circle, rgba(244,214,117,0.35) 0%, rgba(234,88,12,0.12) 45%, transparent 70%)",
          }}
        />

        {/* stars */}
        <motion.div
          style={{ y: skyY, opacity: mountainsOpacity, willChange: "transform" }}
          className="pointer-events-none absolute inset-0"
        >
          {Array.from({ length: 60 }).map((_, i) => (
            <span
              key={i}
              className="absolute rounded-full bg-white/70"
              style={{
                width: (i % 3) + 1,
                height: (i % 3) + 1,
                left: `${(i * 53) % 100}%`,
                top: `${(i * 29) % 65}%`,
                opacity: 0.3 + ((i * 13) % 60) / 100,
              }}
            />
          ))}
          <motion.div
            className="absolute right-[12%] top-[12%] h-20 w-20 rounded-full bg-gradient-to-br from-yellow-100 to-amber-300"
            style={{ boxShadow: "0 0 80px 20px rgba(253,224,71,0.35)" }}
          />
        </motion.div>

        {/* 3D tilting parallax scene */}
        <motion.div
          style={{
            rotateX: rotateX3d,
            rotateY: rotateY3d,
            scale: heroScale,
            inset: "-8%",
            willChange: "transform",
            backfaceVisibility: "hidden",
          }}
          className="absolute"
        >
          <motion.div style={{ opacity: mountainsOpacity }}>
            {MOUNTAIN_LAYERS.map((layer, i) => (
              <div
                key={layer.src}
                className="absolute bottom-0"
                style={{
                  left: `${50 + layer.offsetPercent}%`,
                  width: `${layer.widthPercent}%`,
                  transform: "translateX(-50%)",
                  zIndex: layer.zIndex,
                }}
              >
                <motion.div
                  style={{
                    y: mountainMotion[i].y,
                    x: mountainMotion[i].x,
                    opacity: layer.opacity,
                    filter: `brightness(${layer.brightness})`,
                    willChange: "transform",
                  }}
                >
                  <Image
                    src={layer.src}
                    alt=""
                    width={2000}
                    height={600}
                    className="h-auto w-full object-contain object-bottom"
                    priority={i === MOUNTAIN_LAYERS.length - 1}
                  />
                </motion.div>
              </div>
            ))}

            {/* trekker climbing the mid-front ridge, synced to its motion */}
            <motion.div
              className="absolute bottom-[13%] left-[26%] z-[6]"
              style={{ y: climberY, x: climberX, willChange: "transform" }}
            >
              <motion.div
                className="inline-block"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Image
                  src="/night_climbing_trimmed.png"
                  alt="Trekker climbing the mountain"
                  width={400}
                  height={520}
                  className="h-20 w-auto object-contain drop-shadow-[0_6px_12px_rgba(0,0,0,0.5)] sm:h-24 md:h-28"
                />
              </motion.div>
            </motion.div>

            {/* drifting incense / mist wisps */}
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.span
                key={i}
                className="absolute bottom-[10%] rounded-full bg-gold/20 blur-2xl"
                style={{
                  left: `${20 + i * 14}%`,
                  width: 40 + (i % 3) * 20,
                  height: 90 + (i % 3) * 30,
                  willChange: "transform, opacity",
                }}
                animate={{ y: [0, -140, -280], opacity: [0, 0.5, 0] }}
                transition={{
                  duration: 6 + (i % 3),
                  repeat: Infinity,
                  delay: i * 0.9,
                  ease: "easeOut",
                }}
              />
            ))}
          </motion.div>

          {/* temple silhouette — grows into the darshan scene on scroll */}
          <motion.div
            className="absolute left-1/2 z-20"
            style={{
              top: templeTop,
              x: templeX,
              scale: templeScale,
              translateX: "-50%",
              translateY: "-50%",
              willChange: "transform",
            }}
          >
            <motion.div
              className="inline-block"
              style={{ filter: "drop-shadow(0 0 28px rgba(245,158,11,0.6))" }}
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <Image
                src="/temple_trimmed.png"
                alt="Temple"
                width={900}
                height={900}
                quality={90}
                priority
                className="h-16 w-16 object-contain sm:h-20 sm:w-20 md:h-24 md:w-24"
              />
            </motion.div>
          </motion.div>

          {/* devotees dancing in a circle around the temple, arriving for darshan */}
          <motion.div
            className="absolute left-1/2 z-20"
            style={{
              bottom: "26%",
              x: "-50%",
              opacity: pilgrimsOpacity,
              y: pilgrimsY,
            }}
          >
            <div
              className="relative"
              style={{ width: ORBIT_RADIUS_X * 2, height: ORBIT_RADIUS_Y * 2 }}
            >
              {devotees.map((src, i) => {
                const { xs, ys } = ellipseKeyframes(
                  ORBIT_RADIUS_X,
                  ORBIT_RADIUS_Y,
                  ORBIT_STEPS,
                  i / devotees.length
                );
                // Dancers on the back half of the ellipse render behind the temple glow.
                const backHalf = i % devotees.length >= devotees.length / 2;
                return (
                  <motion.div
                    key={src}
                    className="absolute left-1/2 top-1/2"
                    style={{
                      translateX: "-50%",
                      translateY: "-50%",
                      willChange: "transform",
                      zIndex: backHalf ? 5 : 15,
                    }}
                    animate={{ x: xs, y: ys }}
                    transition={{ duration: ORBIT_DURATION, repeat: Infinity, ease: "linear" }}
                  >
                    <Image
                      src={src}
                      alt="Devotee dancing near the temple"
                      width={260}
                      height={420}
                      className="h-12 w-auto object-contain drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] sm:h-14 md:h-16"
                    />
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>

        {/* scene 1 — headline */}
        <motion.div
          style={{ y: heroTextY, opacity: heroTextOpacity }}
          className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center"
        >
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="font-poppins text-xs uppercase tracking-[0.35em] text-gold sm:text-sm"
          >
            Bharath Treks &amp; Tales
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.9 }}
            className="mt-4 max-w-3xl text-balance text-center font-heading text-3xl font-bold leading-tight text-white sm:text-5xl md:text-6xl"
          >
            Walk the Sacred Trails.
            <br />
            Climb Beyond the Clouds.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-4 max-w-xl text-center text-sm text-white/70 sm:text-base"
          >
            Every ridge hides a shrine. Every summit tells a story. Move your
            cursor, and watch the mountains breathe.
          </motion.p>
        </motion.div>

        {/* scene 2 — darshan caption */}
        <motion.div
          style={{ opacity: secondCaptionOpacity, y: secondCaptionY }}
          className="pointer-events-none absolute inset-x-0 bottom-[6%] z-20 flex flex-col items-center px-6 text-center"
        >
          <h2 className="font-heading text-2xl font-bold text-white sm:text-4xl">
            Every Shrine Welcomes the Faithful.
          </h2>
          <p className="mt-3 max-w-lg text-sm text-white/70 sm:text-base">
            Pilgrims arrive where the mountains meet the divine — join the
            journey to India&apos;s most sacred temples.
          </p>
        </motion.div>

        {/* scroll hint */}
        <motion.div
          style={{ opacity: scrollHintOpacity }}
          className="pointer-events-none absolute inset-x-0 bottom-8 z-10 flex flex-col items-center gap-2 text-xs uppercase tracking-widest text-white/60"
        >
          Scroll to continue
          <motion.span
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity }}
            className="h-8 w-5 rounded-full border border-white/30 p-1"
          >
            <motion.span
              animate={{ y: [0, 10, 0], opacity: [1, 0, 1] }}
              transition={{ duration: 1.6, repeat: Infinity }}
              className="block h-1.5 w-1.5 rounded-full bg-gold"
            />
          </motion.span>
        </motion.div>
      </div>
    </section>
  );
}
