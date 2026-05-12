"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Arcoiris, MascotState } from '@/components/Arcoiris';
import { Background } from '@/components/Background';
import { Confetti, StarRain } from '@/components/Effects';
import { COLORS, ColorInfo, getRandomOptions, calculateStars } from '@/lib/game-logic';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { generateArcoirisMessage } from '@/ai/flows/arcoiris-dynamic-encourgement-flow';
import { Volume2, Star, RotateCcw, Play, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

type Screen = 'start' | 'game' | 'results';

export default function ColorExplorer() {
  const [screen, setScreen] = useState<Screen>('start');
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [shuffledColors, setShuffledColors] = useState<ColorInfo[]>([]);
  const [currentOptions, setCurrentOptions] = useState<ColorInfo[]>([]);
  const [attempts, setAttempts] = useState(1);
  const [feedback, setFeedback] = useState<{ state: MascotState; message: string }>({
    state: 'start',
    message: '¡Hola! 👋 ¡Vamos a aprender los colores!'
  });
  const [celebration, setCelebration] = useState<boolean>(false);
  const [disabledButtons, setDisabledButtons] = useState<string[]>([]);
  const [isAnswering, setIsAnswering] = useState(false);

  const speak = (text: string, isEnglish: boolean = true) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = isEnglish ? 'en-US' : 'es-ES';
      utterance.rate = 0.85;
      utterance.pitch = 1.2;
      window.speechSynthesis.speak(utterance);
    }
  };

  const startGame = () => {
    const randomized = [...COLORS].sort(() => 0.5 - Math.random());
    setShuffledColors(randomized);
    setScore(0);
    setRound(0);
    setAttempts(1);
    setScreen('game');
    setCelebration(false);
    setDisabledButtons([]);
    setFeedback({
      state: 'idle',
      message: '¿De qué color es esto? 🤔'
    });
    speak("Let's learn colors!");
    setupRound(randomized, 0);
  };

  const setupRound = (colors: ColorInfo[], roundIdx: number) => {
    const correct = colors[roundIdx];
    const options = getRandomOptions(correct, COLORS);
    setCurrentOptions(options);
    setAttempts(1);
    setDisabledButtons([]);
    setIsAnswering(false);
    
    if (roundIdx === colors.length - 1) {
      setFeedback({ state: 'idle', message: '¡Última pregunta! ¡Tú puedes! ⭐' });
    } else {
      setFeedback({ state: 'idle', message: '¿De qué color es esto? 🤔' });
    }
  };

  const handleAnswer = async (color: ColorInfo) => {
    if (isAnswering) return;
    setIsAnswering(true);
    speak(color.name);

    const correct = shuffledColors[round];
    const isCorrect = color.id === correct.id;

    try {
      const aiResponse = await generateArcoirisMessage({
        isCorrect,
        attemptNumber: attempts,
        colorName: correct.name
      });
      setFeedback(prev => ({ ...prev, message: aiResponse.message }));
    } catch (e) {
      setFeedback(prev => ({ 
        ...prev, 
        message: isCorrect ? '¡Muy bien! 🎉' : '¡Casi! Inténtalo otra vez. 💪' 
      }));
    }

    if (isCorrect) {
      let points = 0;
      if (attempts === 1) points = 10;
      else if (attempts === 2) points = 5;
      
      setScore(prev => prev + points);
      setFeedback(prev => ({ ...prev, state: 'correct' }));
      setCelebration(true);
      
      setTimeout(() => speak("Correct! Great job!"), 500);

      setTimeout(() => {
        if (round < shuffledColors.length - 1) {
          setRound(prev => prev + 1);
          setCelebration(false);
          setupRound(shuffledColors, round + 1);
        } else {
          endGame();
        }
      }, 2000);
    } else {
      setAttempts(prev => prev + 1);
      setDisabledButtons(prev => [...prev, color.id]);
      setFeedback(prev => ({ ...prev, state: 'wrong' }));
      setTimeout(() => speak("Try again!"), 800);
      setIsAnswering(false);
    }
  };

  const endGame = () => {
    setScreen('results');
    const maxScore = shuffledColors.length * 10;
    setFeedback({
      state: 'end',
      message: score >= (maxScore * 0.7) ? '¡Eres una ESTRELLA! 🌟🌟🌟' : '¡Muy bien! ¡Practiquemos más! 💪'
    });
    speak("Amazing! You finished!");
  };

  return (
    <main className="relative h-screen w-full flex flex-col items-center justify-center p-2 md:p-4 select-none overflow-hidden">
      <Background />
      {celebration && <><Confetti /><StarRain /></>}
      
      <div className="hidden xl:block">
        <Arcoiris state={feedback.state} message={feedback.message} />
      </div>

      {screen === 'start' && (
        <div className="flex flex-col items-center text-center space-y-4 animate-bounce-in max-w-2xl">
          <h1 className="text-5xl md:text-7xl font-headline font-black text-primary drop-shadow-md">
            Color Explorer <span className="inline-block animate-bounce">🎨</span>
          </h1>
          <p className="text-xl md:text-2xl font-body text-foreground/80 font-semibold italic">
            ¡Aprende los colores en inglés!
          </p>
          <Button 
            onClick={startGame}
            className="h-16 md:h-20 px-8 md:px-10 text-2xl md:text-3xl font-headline font-bold rounded-full bg-accent hover:bg-accent/90 shadow-xl border-b-8 border-accent-foreground/20 hover:translate-y-1 transition-all animate-pulse-soft"
          >
            ¡JUGAR! <Play className="ml-4 w-6 h-6 md:w-8 md:h-8 fill-current" />
          </Button>
        </div>
      )}

      {screen === 'game' && shuffledColors.length > 0 && (
        <div className="w-full max-w-6xl flex flex-col items-center space-y-2 md:space-y-4 h-full">
          {/* Header */}
          <div className="w-full flex justify-between items-center bg-white/40 backdrop-blur-md p-3 rounded-2xl shadow-sm">
            <div className="flex flex-col space-y-1 w-1/4">
              <span className="font-headline font-bold text-sm md:text-base whitespace-nowrap">Ronda {round + 1} / {shuffledColors.length}</span>
              <Progress value={((round + 1) / shuffledColors.length) * 100} className="h-2 bg-white/50" />
            </div>
            
            <div className="xl:hidden flex-1 flex justify-center px-2">
              <div className="bg-white/90 px-4 py-1.5 rounded-xl border-2 border-primary shadow-sm">
                 <p className="font-headline text-xs md:text-sm font-bold text-center leading-tight">{feedback.message}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 bg-primary px-3 py-1.5 rounded-full text-white shadow-lg animate-bounce-in" key={score}>
              <Star className="fill-current w-4 h-4" />
              <span className="text-xl font-headline font-black">{score}</span>
            </div>
          </div>

          {/* Main Question Display - Compact for Horizontal View */}
          <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-12 w-full overflow-hidden">
            <div 
              className={cn(
                "w-[140px] h-[140px] md:w-[200px] md:h-[200px] lg:w-[240px] lg:h-[240px] rounded-[30px] shadow-2xl border-8 animate-bounce-in animate-pulse-soft flex items-center justify-center transition-all duration-500 shrink-0",
                shuffledColors[round].id === 'white' ? 'border-gray-200' : 'border-white'
              )}
              style={{ backgroundColor: shuffledColors[round].hex }}
            />

            {/* Answer Buttons Grid - Reduced heights to fit on one screen */}
            <div className="grid grid-cols-2 gap-3 md:gap-4 w-full max-w-xl px-2">
              {currentOptions.map((option, idx) => {
                const isWrong = disabledButtons.includes(option.id);
                const isCorrect = celebration && option.id === shuffledColors[round].id;
                
                return (
                  <Button
                    key={`${option.id}-${idx}`}
                    disabled={isWrong || (celebration && option.id !== shuffledColors[round].id)}
                    onClick={() => handleAnswer(option)}
                    className={cn(
                      "h-16 md:h-20 lg:h-24 text-lg md:text-xl font-headline font-bold rounded-2xl transition-all shadow-md border-b-4",
                      "bg-white text-foreground hover:bg-white/90 border-gray-100",
                      isWrong && "opacity-50 grayscale animate-shake border-gray-300",
                      isCorrect && "bg-primary text-white border-primary-foreground scale-105 ring-4 ring-primary/30"
                    )}
                  >
                    <div className="flex flex-col items-center">
                      <div className="flex items-center">
                        <Volume2 className="mr-2 w-4 h-4 md:w-5 md:h-5" />
                        {option.name}
                      </div>
                      <div className="h-6 flex items-center justify-center">
                        {isWrong && <X className="text-red-500 w-5 h-5 animate-in fade-in zoom-in" />}
                        {isCorrect && <Check className="text-white w-6 h-6 animate-in fade-in zoom-in" />}
                      </div>
                    </div>
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {screen === 'results' && (
        <div className="w-full max-w-4xl flex flex-col items-center space-y-4 animate-bounce-in bg-white/60 backdrop-blur-xl p-6 md:p-8 rounded-[40px] shadow-2xl border-4 border-white overflow-hidden max-h-full">
          <h2 className="text-3xl md:text-4xl font-headline font-black text-primary">Resultados</h2>
          
          <div className="flex space-x-3">
            {[1, 2, 3].map((starIdx) => (
              <div 
                key={starIdx} 
                className={cn(
                  "text-4xl md:text-6xl transition-all duration-500",
                  starIdx <= calculateStars(score, shuffledColors.length * 10) ? "scale-110 drop-shadow-xl animate-bounce" : "opacity-30 grayscale scale-90"
                )}
                style={{ animationDelay: `${starIdx * 0.3}s` }}
              >
                ⭐
              </div>
            ))}
          </div>

          <div className="text-5xl md:text-7xl font-headline font-black text-accent drop-shadow-sm animate-pulse-soft">
            {score}
          </div>

          <div className="grid grid-cols-6 md:grid-cols-11 gap-2 w-full justify-center">
            {COLORS.map((c) => (
              <div key={c.id} className="flex flex-col items-center space-y-1">
                <div 
                  className="w-8 h-8 rounded-lg shadow-sm border-2 border-white"
                  style={{ backgroundColor: c.hex }}
                />
                <span className="font-body font-bold text-[8px] md:text-[10px] text-foreground/70 truncate w-full text-center">{c.spanishName}</span>
              </div>
            ))}
          </div>

          <Button 
            onClick={startGame}
            className="h-14 md:h-16 px-6 md:px-8 text-xl md:text-2xl font-headline font-bold rounded-full bg-accent hover:bg-accent/90 shadow-xl border-b-6 border-accent-foreground/20"
          >
            ¡Jugar otra vez! <RotateCcw className="ml-3 w-5 h-5 md:w-6 md:h-6" />
          </Button>
        </div>
      )}
    </main>
  );
}
