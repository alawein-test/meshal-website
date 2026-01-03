// Manager for click effects (shurikens and smoke)
import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import Shuriken from './Shuriken';
import SmokeEffect from './SmokeEffect';

interface Effect {
  id: number;
  x: number;
  y: number;
  type: 'shuriken' | 'smoke';
}

export const ClickEffectsManager = () => {
  const [effects, setEffects] = useState<Effect[]>([]);
  const [clickCount, setClickCount] = useState(0);

  const removeEffect = useCallback((id: number) => {
    setEffects((prev) => prev.filter((e) => e.id !== id));
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const newCount = clickCount + 1;
      setClickCount(newCount);

      // Alternate between smoke and shuriken, with occasional both
      const effectType: 'shuriken' | 'smoke' = newCount % 3 === 0 ? 'smoke' : 'shuriken';

      const newEffect: Effect = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY,
        type: effectType,
      };

      setEffects((prev) => [...prev, newEffect]);

      // If it's a special click (every 5th), add both effects
      if (newCount % 5 === 0) {
        setTimeout(() => {
          setEffects((prev) => [
            ...prev,
            {
              id: Date.now() + Math.random() + 1,
              x: e.clientX,
              y: e.clientY,
              type: 'smoke',
            },
          ]);
        }, 100);
      }
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [clickCount]);

  return (
    <AnimatePresence>
      {effects.map((effect) =>
        effect.type === 'shuriken' ? (
          <Shuriken
            key={effect.id}
            id={effect.id}
            startX={effect.x}
            startY={effect.y}
            onComplete={removeEffect}
          />
        ) : (
          <SmokeEffect
            key={effect.id}
            id={effect.id}
            x={effect.x}
            y={effect.y}
            onComplete={removeEffect}
          />
        )
      )}
    </AnimatePresence>
  );
};

export default ClickEffectsManager;
