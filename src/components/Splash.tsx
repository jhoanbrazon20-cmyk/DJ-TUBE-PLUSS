import { useEffect, useState } from 'react';

export function Splash({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 600);
    const t2 = setTimeout(() => setPhase(2), 1400);
    const t3 = setTimeout(() => onDone(), 2400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center">
      <div
        className="flex flex-col items-center transition-all duration-700"
        style={{
          opacity: phase >= 0 ? 1 : 0,
          transform: phase >= 1 ? 'scale(1)' : 'scale(0.8)',
        }}
      >
        {/* Equalizer animation */}
        <div className="flex items-end gap-1.5 h-16 mb-8">
          {[0, 1, 2, 3, 4, 5, 6].map(i => (
            <div
              key={i}
              className="w-2 bg-[#00ff88] rounded-full equalizer-bar"
              style={{
                height: phase >= 1 ? '100%' : '20%',
                animationDelay: `${i * 0.1}s`,
                boxShadow: '0 0 10px rgba(0, 255, 136, 0.5)',
              }}
            />
          ))}
        </div>

        {/* DJ */}
        <h1
          className="font-display font-bold text-7xl md:text-8xl neon-text animate-pulseGlow tracking-tighter"
          style={{ transition: 'all 0.5s ease' }}
        >
          DJ
        </h1>

        {/* Tube */}
        <h2
          className="font-display font-medium text-3xl md:text-4xl neon-text mt-1 tracking-widest transition-all duration-500"
          style={{
            opacity: phase >= 1 ? 1 : 0,
            transform: phase >= 1 ? 'translateY(0)' : 'translateY(10px)',
          }}
        >
          Tube
        </h2>

        {/* Loading bar */}
        <div className="mt-12 w-48 h-0.5 bg-[#1c1c1c] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#00ff88] rounded-full transition-all duration-1000 ease-out"
            style={{
              width: phase >= 2 ? '100%' : '0%',
              boxShadow: '0 0 8px rgba(0, 255, 136, 0.6)',
            }}
          />
        </div>

        <p
          className="text-gray-500 text-xs mt-4 tracking-wider transition-opacity duration-500"
          style={{ opacity: phase >= 1 ? 1 : 0 }}
        >
          DJ TUBE
        </p>
      </div>
    </div>
  );
}
