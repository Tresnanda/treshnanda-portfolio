import type { Variants, Transition } from "framer-motion";

/**
 * Motion system — Emil Kowalski + motion-design principles.
 *
 * Custom curves only. The built-in CSS easings are too weak; these carry the
 * "punch" that makes UI feel intentional. Never `ease-in` for entrances.
 */
export const ease = {
  /** expo-out — strong, responsive entrances (the workhorse) */
  out: [0.16, 1, 0.3, 1] as const,
  /** quint-out — Emil's strong ease-out for snappy UI */
  snappy: [0.23, 1, 0.32, 1] as const,
  /** on-screen movement / morphing — accelerate then decelerate */
  inOut: [0.77, 0, 0.175, 1] as const,
  /** iOS drawer curve (Ionic) — premium, weighty reveals */
  drawer: [0.32, 0.72, 0, 1] as const,
  /** accelerate — exits / dismissals */
  in: [0.7, 0, 0.84, 0] as const,
} as const;

/** Apple-style spring: easier to reason about than stiffness/damping. */
export const spring = {
  soft: { type: "spring", stiffness: 200, damping: 26, mass: 1 },
  press: { type: "spring", stiffness: 400, damping: 30 },
  pop: { type: "spring", stiffness: 320, damping: 18 },
} satisfies Record<string, Transition>;

/** Reveal: rise + blur-in. Blur masks the imperfect crossfade as it lands. */
export const revealUp: Variants = {
  hidden: { opacity: 0, y: 28, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: ease.out },
  },
};

/** Reduced-motion variant of revealUp: opacity only, no movement. */
export const revealUpReduced: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, ease: ease.out } },
};

/** Parent that cascades children. Keep child delay short (30–80ms). */
export const staggerParent: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

/** Standard viewport config: fire once, a touch before the element is centered. */
export const inView = { once: true, margin: "-80px" } as const;
