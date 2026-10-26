"use client";

import { useEffect, useState } from "react";
import { shortDate, timeAgo } from "@/lib/format";

// "3h ago" depends on the current time, so the server and the browser would disagree.
// We show a fixed date first, then switch to the relative time once we're in the browser.
export default function TimeAgo({ iso }) {
  const [now, setNow] = useState(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(id);
  }, []);

  return <time dateTime={iso}>{now ? timeAgo(iso, now) : shortDate(iso)}</time>;
}
