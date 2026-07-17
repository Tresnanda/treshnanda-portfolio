"use client";

import SlotText from "@/components/SlotText";

/**
 * Status label. Pass `cycle` to slot-roll the label through several statuses;
 * otherwise it's a static `label`.
 */
export default function StatusPill({
  label = "System Operational",
  cycle,
}: {
  label?: string;
  cycle?: string[];
}) {
  return (
    <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-zinc-400">
      {cycle && cycle.length > 1 ? <SlotText cycle={cycle} cycleMs={3200} options={{ skipUnchanged: false }} /> : label}
    </span>
  );
}
