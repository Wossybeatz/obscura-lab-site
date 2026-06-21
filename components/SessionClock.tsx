"use client";

import { useEffect, useState } from "react";

function formatClock(d: Date): string {
  return d.toLocaleTimeString("en-GB", { hour12: false });
}

export default function SessionClock() {
  // Render nothing server-side and fill in on mount, so the clock never
  // mismatches between server-rendered HTML and the client (hydration).
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    setTime(formatClock(new Date()));
    const id = setInterval(() => setTime(formatClock(new Date())), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="font-mono-brand tabular-nums">
      {time ?? "00:00:00"}
    </span>
  );
}
