import { useEffect, useState } from "react";

export function Countdown({ date }: { date: string }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const timer = window.setInterval(() => setNow(Date.now()), 1000); return () => window.clearInterval(timer); }, []);
  const diff = Math.max(0, new Date(date).getTime() - now);
  const values = [Math.floor(diff / 86400000), Math.floor(diff / 3600000) % 24, Math.floor(diff / 60000) % 60, Math.floor(diff / 1000) % 60];
  return <div className="flex flex-wrap justify-center gap-3">{values.map((value, i) => <div key={i} className="min-w-20 border border-background/40 bg-foreground/30 px-4 py-3 text-center backdrop-blur-md"><strong className="block font-serif text-3xl text-primary-foreground">{value}</strong><span className="text-[10px] uppercase text-primary-foreground/80">{["dias", "horas", "min", "seg"][i]}</span></div>)}</div>;
}
