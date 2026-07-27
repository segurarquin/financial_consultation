import { useState, useEffect, useRef } from 'react';

interface StatCardProps {
  icon: string;
  label: string;
  value: number;
  accentClass: string;
}

function useCountUp(target: number, duration = 800, start = false) {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!start || target === 0) {
      setCount(target);
      return;
    }

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration, start]);

  return count;
}

export default function StatCard({ icon, label, value, accentClass }: StatCardProps) {
  const [animate, setAnimate] = useState(false);
  const displayed = useCountUp(value, 900, animate);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 150);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-background-50 rounded-xl border border-background-200/70 p-5 flex items-start gap-4 transition-all duration-200 hover:border-background-300/60">
      <div className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 ${accentClass}`}>
        <i className={`${icon} text-lg`}></i>
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-bold text-foreground-950 font-heading leading-none mb-1 tabular-nums">
          {displayed}
        </p>
        <p className="text-sm text-foreground-600 leading-tight">{label}</p>
      </div>
    </div>
  );
}