"use client";

import React, { useEffect, useState } from 'react';

export const Confetti: React.FC = () => {
  const [pieces, setPieces] = useState<{ id: number; x: number; y: number; color: string }[]>([]);

  useEffect(() => {
    const colors = ['#FFCC1A', '#FB9651', '#FF0000', '#1565C0', '#2E7D32', '#FF80AB'];
    const newPieces = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 800,
      y: (Math.random() - 0.5) * 800,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    setPieces(newPieces);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[60] flex items-center justify-center">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="absolute w-4 h-4 rounded-sm animate-confetti"
          style={{
            backgroundColor: p.color,
            '--x': `${p.x}px`,
            '--y': `${p.y}px`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
};

export const StarRain: React.FC = () => {
  const [stars, setStars] = useState<{ id: number; left: string; delay: string }[]>([]);

  useEffect(() => {
    const newStars = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 1.5}s`,
    }));
    setStars(newStars);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[60]">
      {stars.map((s) => (
        <div
          key={s.id}
          className="absolute text-yellow-400 text-4xl animate-star-rain"
          style={{
            left: s.left,
            animationDelay: s.delay,
          }}
        >
          ⭐
        </div>
      ))}
    </div>
  );
};
