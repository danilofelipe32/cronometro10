
import React, { useState, FC, PropsWithChildren, useMemo, useEffect } from 'react';
import { useTimer } from './hooks/useTimer';

// --- Reusable Glass Card Component ---
const GlassCard: FC<PropsWithChildren<{ className?: string }>> = ({ children, className = '' }) => {
  return (
    <div className={`bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10 shadow-lg p-6 ${className}`}>
      {children}
    </div>
  );
};

// --- Timer Digit Component ---
interface DigitProps {
  value: string;
}
const Digit: FC<DigitProps> = ({ value }) => {
  return (
    <div className="relative w-[20vw] h-[40vh] max-w-[250px] max-h-[350px] flex items-center justify-center">
      <span
        key={value}
        className="absolute text-white text-[38vmin] font-bold animate-flip-down"
        style={{ textShadow: '0 0 20px rgba(255,255,255,0.3)' }}
      >
        {value}
      </span>
    </div>
  );
};


// --- Timer Display Component ---
interface TimerDisplayProps {
  totalSeconds: number;
  isFinished: boolean;
}
const TimerDisplay: FC<TimerDisplayProps> = ({ totalSeconds, isFinished }) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  const [m1, m2] = useMemo(() => String(minutes).padStart(2, '0').split(''), [minutes]);
  const [s1, s2] = useMemo(() => String(seconds).padStart(2, '0').split(''), [seconds]);

  return (
    <div className={`flex items-center justify-center transition-transform duration-500 ${isFinished ? 'animate-pulse-finish' : ''}`}>
      <Digit value={m1} />
      <Digit value={m2} />
      <div className="relative w-[10vw] h-[40vh] max-w-[120px] max-h-[350px] flex items-center justify-center">
          <span className="text-white text-[30vmin] font-bold pb-8">:</span>
      </div>
      <Digit value={s1} />
      <Digit value={s2} />
    </div>
  );
};

// --- Controls Component ---
interface ControlsProps {
  minutes: string;
  setMinutes: (val: string) => void;
  seconds: string;
  setSeconds: (val: string) => void;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  isActive: boolean;
  totalSeconds: number;
}
const Controls: FC<ControlsProps> = ({ minutes, setMinutes, seconds, setSeconds, onStart, onPause, onReset, isActive, totalSeconds }) => {
    
  const handleInputChange = (setter: (val: string) => void, value: string) => {
      const num = parseInt(value, 10);
      if (value === '' || (num >= 0 && num <= 59)) {
          setter(value);
      }
  };

  return (
    <GlassCard className="w-full max-w-md">
      <div className="flex justify-around items-center mb-4">
        <div>
          <label className="text-white/70 text-sm block text-center mb-1">Minutos</label>
          <input
            type="number"
            value={minutes}
            onChange={(e) => handleInputChange(setMinutes, e.target.value)}
            disabled={isActive}
            className="bg-white/10 text-white w-24 p-2 text-center rounded-lg text-2xl focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
          />
        </div>
        <div>
          <label className="text-white/70 text-sm block text-center mb-1">Segundos</label>
          <input
            type="number"
            value={seconds}
            onChange={(e) => handleInputChange(setSeconds, e.target.value)}
            disabled={isActive}
            className="bg-white/10 text-white w-24 p-2 text-center rounded-lg text-2xl focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-6">
        {isActive ? (
          <button onClick={onPause} className="bg-yellow-500/80 hover:bg-yellow-500/100 text-black font-bold py-3 px-4 rounded-lg transition duration-300 transform hover:scale-105">
            Pausar
          </button>
        ) : (
          <button onClick={onStart} disabled={totalSeconds === 0} className="bg-green-500/80 hover:bg-green-500/100 disabled:bg-gray-500/50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition duration-300 transform hover:scale-105">
            Iniciar
          </button>
        )}
        <button onClick={onReset} className="bg-red-500/80 hover:bg-red-500/100 text-white font-bold py-3 px-4 rounded-lg transition duration-300 transform hover:scale-105">
          Zerar
        </button>
      </div>
    </GlassCard>
  );
};


// --- Main App Component ---
const App: FC = () => {
  const [minutes, setMinutes] = useState('1');
  const [seconds, setSeconds] = useState('30');
  const [showControls, setShowControls] = useState(true);

  const initialTotalSeconds = useMemo(() => {
    const min = parseInt(minutes, 10) || 0;
    const sec = parseInt(seconds, 10) || 0;
    return (min * 60) + sec;
  }, [minutes, seconds]);

  const { totalSeconds, isActive, isFinished, start, pause, reset } = useTimer(initialTotalSeconds);

  useEffect(() => {
    if (isFinished) {
      setShowControls(true);
      // Play a sound or show a notification if desired
    }
  }, [isFinished]);
  
  const handleStart = () => {
    if (initialTotalSeconds > 0) {
      if(totalSeconds !== initialTotalSeconds) reset(initialTotalSeconds);
      start();
      setShowControls(false);
    }
  };

  const handlePause = () => {
    pause();
    setShowControls(true);
  };
  
  const handleReset = () => {
    reset(initialTotalSeconds);
    setShowControls(true);
  };

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-white flex flex-col items-center justify-center p-4 overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.04%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50"></div>
      
      <main className="z-10 flex flex-col items-center justify-center flex-grow w-full">
        <TimerDisplay totalSeconds={totalSeconds} isFinished={isFinished} />
      </main>

      <footer className={`z-20 w-full max-w-md transition-all duration-500 ease-in-out ${showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full pointer-events-none'}`}>
         <Controls 
            minutes={minutes}
            setMinutes={setMinutes}
            seconds={seconds}
            setSeconds={setSeconds}
            onStart={handleStart}
            onPause={handlePause}
            onReset={handleReset}
            isActive={isActive}
            totalSeconds={initialTotalSeconds}
         />
      </footer>

       <button onClick={() => setShowControls(!showControls)} className="absolute bottom-4 right-4 z-30 bg-white/10 backdrop-blur-lg p-3 rounded-full hover:bg-white/20 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
      </button>

    </div>
  );
};

export default App;
