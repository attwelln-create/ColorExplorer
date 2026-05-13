
"use client";

import React, { useState, useCallback } from 'react';
import { Arcoiris, MascotState } from '@/components/Arcoiris';
import { Background } from '@/components/Background';
import { Confetti, StarRain } from '@/components/Effects';
import { COLORS, NUMBERS, ColorInfo, NumberInfo, getRandomOptions, calculateStars } from '@/lib/game-logic';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { generateArcoirisMessage } from '@/ai/flows/arcoiris-dynamic-encourgement-flow';
import { Volume2, Star, RotateCcw, Play, Check, X, Share2, Palette, Hash, Home as HomeIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type Screen = 'menu' | 'game' | 'results';
type GameMode = 'colors' | 'numbers';

export default function Home() {
  const [screen, setScreen] = useState<Screen>('menu');
  const [mode, setMode] = useState<GameMode>('colors');
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [shuffledItems, setShuffledItems] = useState<(ColorInfo | NumberInfo)[]>([]);
  const [currentOptions, setCurrentOptions] = useState<(ColorInfo | NumberInfo)[]>([]);
  const [attempts, setAttempts] = useState(1);
  const [feedback, setFeedback] = useState<{ state: MascotState; message: string }>({
    state: 'start',
    message: '¡Hola! 👋 ¡Elige un juego para empezar!'
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

  const startNewGame = (gameMode: GameMode) => {
    const sourceData = gameMode === 'colors' ? COLORS : NUMBERS;
    const randomized = [...sourceData].sort(() => 0.5 - Math.random());
    
    setMode(gameMode);
    setShuffledItems(randomized);
    setScore(0);
    setRound(0);
    setAttempts(1);
    setScreen('game');
    setCelebration(false);
    setDisabledButtons([]);
    setFeedback({
      state: 'idle',
      message: gameMode === 'colors' ? '¿De qué color es esto? 🤔' : '¿Qué número es este? 🔢'
    });
    
    speak(gameMode === 'colors' ? "Let's learn colors!" : "Let's learn numbers!");
    setupRound(randomized, 0, gameMode);
  };

  const setupRound = (items: (ColorInfo | NumberInfo)[], roundIdx: number, gameMode: GameMode) => {
    const sourceData = gameMode === 'colors' ? COLORS : NUMBERS;
    const correct = items[roundIdx];
    const options = getRandomOptions(correct, sourceData);
    
    setCurrentOptions(options);
    setAttempts(1);
    setDisabledButtons([]);
    setIsAnswering(false);
    
    setFeedback({ 
      state: 'idle', 
      message: roundIdx === items.length - 1 ? '¡Última pregunta! ¡Tú puedes! ⭐' : (gameMode === 'colors' ? '¿De qué color es esto? 🤔' : '¿Qué número es este? 🔢')
    });
  };

  const handleAnswer = async (item: ColorInfo | NumberInfo) => {
    if (isAnswering) return;
    setIsAnswering(true);
    speak(item.name);

    const correct = shuffledItems[round];
    const isCorrect = item.id === correct.id;

    try {
      const aiResponse = await generateArcoirisMessage({
        isCorrect,
        attemptNumber: attempts,
        itemName: correct.name
      });
      setFeedback(prev => ({ ...prev, message: aiResponse.message }));
    } catch (e) {
      setFeedback(prev => ({ 
        ...prev, 
        message: isCorrect ? '¡Muy bien! 🎉' : '¡Casi! Inténtalo otra vez. 💪' 
      }));
    }

    if (isCorrect) {
      let points = attempts === 1 ? 10 : attempts === 2 ? 5 : 2;
      setScore(prev => prev + points);
      setFeedback(prev => ({ ...prev, state: 'correct' }));
      setCelebration(true);
      
      setTimeout(() => speak("Correct! Great job!"), 500);

      setTimeout(() => {
        if (round < shuffledItems.length - 1) {
          setRound(prev => prev + 1);
          setCelebration(false);
          setupRound(shuffledItems, round + 1, mode);
        } else {
          endGame();
        }
      }, 2000);
    } else {
      setAttempts(prev => prev + 1);
      setDisabledButtons(prev => [...prev, item.id]);
      setFeedback(prev => ({ ...prev, state: 'wrong' }));
      setTimeout(() => speak("Try again!"), 800);
      setIsAnswering(false);
    }
  };

  const endGame = () => {
    setScreen('results');
    const maxScore = shuffledItems.length * 10;
    setFeedback({
      state: 'end',
      message: score >= (maxScore * 0.7) ? '¡Eres una ESTRELLA! 🌟🌟🌟' : '¡Muy bien! ¡Practiquemos más! 💪'
    });
    speak("Amazing! You finished!");
  };

  const handleShare = () => {
    if (navigator.share) {
      const text = mode === 'colors' ? 'colores' : 'números';
      navigator.share({
        title: 'Color & Number Explorer 🎨🔢',
        text: `¡Saqué ${score} puntos aprendiendo los ${text}! ¿Puedes superarme?`,
        url: window.location.href,
      }).catch(() => {});
    }
  };

  return (
    <main className="relative h-screen w-full flex flex-col items-center justify-center p-2 select-none overflow-hidden">
      <Background />
      {celebration && <><Confetti /><StarRain /></>}
      
      <div className="hidden xl:block">
        <Arcoiris state={feedback.state} message={feedback.message} />
      </div>

      {screen === 'menu' && (
        <div className="flex flex-col items-center text-center space-y-6 animate-bounce-in max-w-4xl px-4">
          <h1 className="text-4xl md:text-6xl font-headline font-black text-primary drop-shadow-md">
            Explorer <span className="inline-block animate-bounce">🌈</span>
          </h1>
          <p className="text-xl md:text-2xl font-body text-foreground/80 font-semibold italic">
            ¡Elige una aventura para aprender!
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            <Button 
              onClick={() => startNewGame('colors')}
              className="h-32 md:h-40 text-2xl md:text-3xl font-headline font-bold rounded-[2rem] bg-accent hover:bg-accent/90 shadow-xl border-b-8 border-accent-foreground/20 transition-all flex flex-col gap-2"
            >
              <Palette className="w-10 h-10 md:w-14 md:h-14" />
              COLORES
            </Button>
            
            <Button 
              onClick={() => startNewGame('numbers')}
              className="h-32 md:h-40 text-2xl md:text-3xl font-headline font-bold rounded-[2rem] bg-primary hover:bg-primary/90 shadow-xl border-b-8 border-primary-foreground/20 transition-all flex flex-col gap-2"
            >
              <Hash className="w-10 h-10 md:w-14 md:h-14" />
              NÚMEROS
            </Button>
          </div>
        </div>
      )}

      {screen === 'game' && shuffledItems.length > 0 && (
        <div className="w-full max-w-6xl flex flex-col items-center space-y-2 h-full">
          <div className="w-full flex justify-between items-center bg-white/40 backdrop-blur-md p-3 rounded-2xl shadow-sm">
            <div className="flex items-center space-x-2 w-1/4">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setScreen('menu')}
                className="h-8 w-8 rounded-full bg-white/50 hover:bg-white shrink-0"
              >
                <HomeIcon className="w-4 h-4 text-primary" />
              </Button>
              <div className="flex flex-col space-y-1 overflow-hidden">
                <span className="font-headline font-bold text-[10px] md:text-xs whitespace-nowrap">Ronda {round + 1} / {shuffledItems.length}</span>
                <Progress value={((round + 1) / shuffledItems.length) * 100} className="h-1.5 md:h-2 bg-white/50" />
              </div>
            </div>
            
            <div className="xl:hidden flex-1 flex justify-center px-2">
              <div className="bg-white/90 px-4 py-1.5 rounded-xl border-2 border-primary shadow-sm">
                 <p className="font-headline text-[10px] md:text-xs font-bold text-center leading-tight">{feedback.message}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 bg-primary px-3 py-1.5 rounded-full text-white shadow-lg animate-bounce-in" key={score}>
              <Star className="fill-current w-3 h-3 md:w-4 md:h-4" />
              <span className="text-lg md:text-xl font-headline font-black">{score}</span>
            </div>
          </div>

          <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-12 w-full overflow-hidden">
            {mode === 'colors' ? (
              <div 
                className={cn(
                  "w-[140px] h-[140px] md:w-[180px] md:h-[180px] lg:w-[200px] lg:h-[200px] rounded-[30px] shadow-2xl border-8 animate-bounce-in animate-pulse-soft flex items-center justify-center transition-all duration-500 shrink-0",
                  (shuffledItems[round] as ColorInfo).id === 'white' ? 'border-gray-200' : 'border-white'
                )}
                style={{ backgroundColor: (shuffledItems[round] as ColorInfo).hex }}
              />
            ) : (
              <div className="w-[140px] h-[140px] md:w-[180px] md:h-[180px] lg:w-[200px] lg:h-[200px] bg-white rounded-[30px] shadow-2xl border-8 border-primary animate-bounce-in animate-pulse-soft flex items-center justify-center shrink-0">
                <span className="text-7xl md:text-9xl font-headline font-black text-primary">
                  {(shuffledItems[round] as NumberInfo).value}
                </span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 md:gap-4 w-full max-w-xl px-2">
              {currentOptions.map((option, idx) => {
                const isWrong = disabledButtons.includes(option.id);
                const isCorrect = celebration && option.id === shuffledItems[round].id;
                
                return (
                  <Button
                    key={`${option.id}-${idx}`}
                    disabled={isWrong || (celebration && option.id !== shuffledItems[round].id)}
                    onClick={() => handleAnswer(option)}
                    className={cn(
                      "h-14 md:h-16 lg:h-18 text-xl md:text-2xl font-headline font-bold rounded-2xl transition-all shadow-md border-b-4",
                      "bg-white text-foreground hover:bg-white/90 border-gray-100",
                      isWrong && "opacity-50 grayscale animate-shake border-gray-300",
                      isCorrect && "bg-primary text-white border-primary-foreground scale-105 ring-4 ring-primary/30"
                    )}
                  >
                    <div className="flex flex-col items-center">
                      <div className="flex items-center">
                        <Volume2 className="mr-2 w-5 h-5" />
                        {option.name}
                      </div>
                      <div className="h-4 flex items-center justify-center">
                        {isWrong && <X className="text-red-500 w-4 h-4 animate-in fade-in zoom-in" />}
                        {isCorrect && <Check className="text-white w-5 h-5 animate-in fade-in zoom-in" />}
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
        <div className="w-full max-w-4xl flex flex-col items-center space-y-4 animate-bounce-in bg-white/60 backdrop-blur-xl p-6 rounded-[40px] shadow-2xl border-4 border-white overflow-hidden max-h-full">
          <h2 className="text-3xl md:text-4xl font-headline font-black text-primary">Resultados</h2>
          
          <div className="flex space-x-3">
            {[1, 2, 3].map((starIdx) => (
              <div 
                key={starIdx} 
                className={cn(
                  "text-4xl md:text-6xl transition-all duration-500",
                  starIdx <= calculateStars(score, shuffledItems.length * 10) ? "scale-110 drop-shadow-xl animate-bounce" : "opacity-30 grayscale scale-90"
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

          <div className="flex gap-4">
            <Button 
              onClick={() => setScreen('menu')}
              className="h-14 md:h-16 px-6 md:px-8 text-xl md:text-2xl font-headline font-bold rounded-full bg-primary hover:bg-primary/90 shadow-xl border-b-6 border-primary-foreground/20"
            >
              Menú <Play className="ml-3 w-5 h-5" />
            </Button>
            <Button 
              variant="outline"
              onClick={handleShare}
              className="h-14 md:h-16 px-6 md:px-8 text-xl md:text-2xl font-headline font-bold rounded-full bg-white hover:bg-gray-50 shadow-xl border-b-6 border-gray-200"
            >
              Compartir <Share2 className="ml-3 w-5 h-5" />
            </Button>
          </div>
        </div>
      )}
    </main>
  );
}
