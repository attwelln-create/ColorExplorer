"use client";

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export type MascotState = 'idle' | 'correct' | 'wrong' | 'start' | 'end';

interface ArcoirisProps {
  state?: MascotState;
  message?: string;
  className?: string;
}

export const Arcoiris: React.FC<ArcoirisProps> = ({ state = 'idle', message, className }) => {
  const [animationClass, setAnimationClass] = useState('animate-float');

  useEffect(() => {
    switch (state) {
      case 'correct':
        setAnimationClass('animate-jump');
        const timer = setTimeout(() => setAnimationClass('animate-float'), 500);
        return () => clearTimeout(timer);
      case 'wrong':
        setAnimationClass('animate-shake');
        const timerWrong = setTimeout(() => setAnimationClass('animate-float'), 400);
        return () => clearTimeout(timerWrong);
      case 'start':
        setAnimationClass('animate-bounce-in');
        break;
      case 'end':
        setAnimationClass('animate-jump');
        break;
      default:
        setAnimationClass('animate-float');
    }
  }, [state]);

  return (
    <div className={cn("fixed bottom-8 left-8 flex flex-col items-center z-50", className)}>
      {message && (
        <div className="mb-8 max-w-[250px] animate-bounce-in">
          <div className="speech-bubble">
            <p className="font-headline text-lg font-bold text-center leading-tight">
              {message}
            </p>
          </div>
        </div>
      )}
      
      <div className={cn("relative w-40 h-40", animationClass)}>
        <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xl">
          {/* Star Shape */}
          <path
            d="M100 0 L131 63 L200 73 L150 121 L162 190 L100 157 L38 190 L50 121 L0 73 L69 63 Z"
            fill="#FFCC1A"
            stroke="#FB9651"
            strokeWidth="6"
            strokeLinejoin="round"
          />
          
          {/* Eyes */}
          <circle cx="70" cy="90" r="10" fill="white" />
          <circle cx="70" cy="90" r="5" fill="black" />
          <circle cx="130" cy="90" r="10" fill="white" />
          <circle cx="130" cy="90" r="5" fill="black" />
          
          {/* Smile */}
          {state === 'wrong' ? (
             <path d="M70 130 Q100 120 130 130" stroke="black" strokeWidth="4" fill="none" strokeLinecap="round" />
          ) : (
            <path d="M70 120 Q100 150 130 120" stroke="black" strokeWidth="4" fill="none" strokeLinecap="round" />
          )}

          {/* Arms (simplistic) */}
          <path d="M40 100 Q20 110 20 130" stroke="#FFCC1A" strokeWidth="8" fill="none" strokeLinecap="round" />
          <path d="M160 100 Q180 110 180 130" stroke="#FFCC1A" strokeWidth="8" fill="none" strokeLinecap="round" />
        </svg>

        {/* Dynamic Wink for wrong answer */}
        {state === 'wrong' && (
          <div className="absolute top-[85px] right-[62px] w-6 h-2 bg-[#FFCC1A] z-10" />
        )}
      </div>
    </div>
  );
};
