import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NinjaIcon } from '@/components/icons/NinjaIcon';
import { INTERVAL, ANIMATION, randomInterval } from '@/utils/timing';

type NinjaState = 'idle' | 'fighting' | 'winning' | 'fleeing' | 'spinning-kick' | 'dodge';
type SidePosition = 'left' | 'right';

// Dad jokes for the older ninja (colorful, fun)
const DAD_JOKES = [
  { text: "Why don't ninjas ever get lost? They always follow their sensei!", type: 'joke' },
  { text: "I told my son he was a ninja... he didn't see it coming.", type: 'joke' },
  { text: "What's a ninja's favorite drink? Karate-chop-olate milk!", type: 'joke' },
  { text: 'Why did the ninja go to therapy? Too many throwing stars!', type: 'joke' },
  { text: "My ninja skills are so good... you can't even see me trying!", type: 'joke' },
  { text: 'What do you call a ninja cow? Mooooo-shi!', type: 'joke' },
] as const;

// Dad rants (grumpy, monochrome-ish)
const DAD_RANTS = [
  { text: 'KIDS! When I was your age, we trained UPHILL both ways!', type: 'rant' },
  { text: "Stop fighting! You're embarrassing the dojo!", type: 'rant' },
  { text: "I didn't raise you to be this dramatic!", type: 'rant' },
  { text: 'Back in my day, we had REAL swords!', type: 'rant' },
  { text: 'You call that a spinning kick?!', type: 'rant' },
] as const;

// Fighting ninja taunts
const GOOD_NINJA_TAUNTS = [
  'You dare challenge me?!',
  'HIYAAA! 🥷',
  'Prepare yourself!',
  'Too slow!',
  'Is that all you got?',
] as const;

const DEVIL_NINJA_TAUNTS = [
  'Muahaha! 😈',
  "You'll never win!",
  "I'll defeat you!",
  'Not so fast!',
  'Take THIS!',
] as const;

type DadLine = { text: string; type: 'joke' | 'rant' };

export const HeroNinjas = () => {
  const [goodNinjaState, setGoodNinjaState] = useState<NinjaState>('idle');
  const [devilNinjaState, setDevilNinjaState] = useState<NinjaState>('idle');
  const [showDevil, setShowDevil] = useState(false);
  const [fightMode, setFightMode] = useState(false);

  // Dad ninja state
  const [dadNinjaPosition, setDadNinjaPosition] = useState<SidePosition>('left');
  const [dadNinjaVisible, setDadNinjaVisible] = useState(false);
  const [dadLine, setDadLine] = useState<DadLine | null>(null);
  const [showJoke, setShowJoke] = useState(false);

  // Fighting ninja speech bubbles
  const [goodNinjaTaunt, setGoodNinjaTaunt] = useState<string | null>(null);
  const [devilNinjaTaunt, setDevilNinjaTaunt] = useState<string | null>(null);

  // Impact effects
  const [showImpact, setShowImpact] = useState(false);
  const [impactType, setImpactType] = useState<'clash' | 'kick' | 'victory'>('clash');

  // Screen shake and combo
  const [screenShake, setScreenShake] = useState(false);
  const [comboCount, setComboCount] = useState(0);
  const [showCombo, setShowCombo] = useState(false);

  // Shurikens
  const [shurikens, setShurikens] = useState<
    Array<{ id: number; from: 'good' | 'devil'; delay: number }>
  >([]);
  const [shurikenId, setShurikenId] = useState(0);

  // Trigger screen shake with combo
  const triggerImpact = (type: 'clash' | 'kick' | 'victory') => {
    setImpactType(type);
    setShowImpact(true);
    setScreenShake(true);

    // Update combo
    setComboCount((prev) => prev + 1);
    setShowCombo(true);

    setTimeout(() => setShowImpact(false), type === 'victory' ? 500 : 300);
    setTimeout(() => setScreenShake(false), 150);
  };

  // Launch shuriken
  const launchShuriken = (from: 'good' | 'devil') => {
    const newId = shurikenId + 1;
    setShurikenId(newId);
    setShurikens((prev) => [...prev, { id: newId, from, delay: 0 }]);
    setTimeout(() => {
      setShurikens((prev) => prev.filter((s) => s.id !== newId));
    }, 600);
  };

  // Dad ninja roaming and telling jokes/rants - more frequent during fights
  useEffect(() => {
    const getRandomLine = (): DadLine => {
      // During fights, 70% rants (about the fighting), 30% jokes
      if (fightMode) {
        if (Math.random() > 0.3) {
          return DAD_RANTS[Math.floor(Math.random() * DAD_RANTS.length)];
        }
        return DAD_JOKES[Math.floor(Math.random() * DAD_JOKES.length)];
      }
      // Normal: 60% jokes, 40% rants
      if (Math.random() > 0.4) {
        return DAD_JOKES[Math.floor(Math.random() * DAD_JOKES.length)];
      }
      return DAD_RANTS[Math.floor(Math.random() * DAD_RANTS.length)];
    };

    const roamAndJoke = () => {
      const side: SidePosition = Math.random() > 0.5 ? 'left' : 'right';
      setDadNinjaPosition(side);
      setDadNinjaVisible(true);

      setTimeout(() => {
        const line = getRandomLine();
        setDadLine(line);
        setShowJoke(true);
      }, 400);

      setTimeout(() => {
        setShowJoke(false);
        setDadLine(null);
      }, 4000);

      setTimeout(() => {
        setDadNinjaVisible(false);
      }, 4500);

      // Sometimes reappear on other side
      if (Math.random() > 0.5) {
        setTimeout(() => {
          const otherSide: SidePosition = side === 'left' ? 'right' : 'left';
          setDadNinjaPosition(otherSide);
          setDadNinjaVisible(true);

          setTimeout(() => {
            const line = getRandomLine();
            setDadLine(line);
            setShowJoke(true);
          }, 300);

          setTimeout(() => {
            setShowJoke(false);
          }, 3500);

          setTimeout(() => {
            setDadNinjaVisible(false);
          }, 4000);
        }, 5500);
      }
    };

    const initialTimeout = setTimeout(roamAndJoke, 2000);
    // Appear more frequently during fights (4-6s) vs normal (12-18s)
    const intervalTime = fightMode
      ? randomInterval(INTERVAL.FIGHT_ROAM_MIN, INTERVAL.FIGHT_ROAM_MAX)
      : randomInterval(12000, 18000);
    const roamInterval = setInterval(roamAndJoke, intervalTime);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(roamInterval);
    };
  }, [fightMode]);

  // Fight sequence with speech bubbles
  useEffect(() => {
    const startFight = () => {
      setShowDevil(true);
      setDevilNinjaState('idle');
      setGoodNinjaTaunt(null);
      setDevilNinjaTaunt(null);
      setComboCount(0);
      setShowCombo(false);

      // Devil appears with taunt
      setTimeout(() => {
        setDevilNinjaTaunt(
          DEVIL_NINJA_TAUNTS[Math.floor(Math.random() * DEVIL_NINJA_TAUNTS.length)]
        );
      }, 800);

      setTimeout(() => {
        setFightMode(true);
        setGoodNinjaState('fighting');
        setDevilNinjaState('fighting');
        setDevilNinjaTaunt(null);
        // Good ninja responds
        setGoodNinjaTaunt(GOOD_NINJA_TAUNTS[Math.floor(Math.random() * GOOD_NINJA_TAUNTS.length)]);
        // First clash impact with shake
        triggerImpact('clash');
      }, 1200);

      setTimeout(() => {
        setGoodNinjaTaunt(null);
        setGoodNinjaState('spinning-kick');
        // Good ninja attack taunt
        setGoodNinjaTaunt('HIYAAA! 🥷');
        // Kick impact with shake
        triggerImpact('kick');
        // Launch shurikens
        launchShuriken('good');
      }, 2200);

      setTimeout(() => {
        setDevilNinjaState('dodge');
        setGoodNinjaTaunt(null);
        setDevilNinjaTaunt('Missed me!');
        // Devil throws shuriken back
        launchShuriken('devil');
      }, 2700);

      setTimeout(() => {
        setGoodNinjaState('fighting');
        setDevilNinjaState('fighting');
        setDevilNinjaTaunt(null);
        // Exchange more taunts
        setGoodNinjaTaunt(GOOD_NINJA_TAUNTS[Math.floor(Math.random() * GOOD_NINJA_TAUNTS.length)]);
        // Another clash with shake
        triggerImpact('clash');
        // Both throw shurikens
        launchShuriken('good');
        setTimeout(() => launchShuriken('devil'), 100);
      }, 3200);

      setTimeout(() => {
        setGoodNinjaState('winning');
        setDevilNinjaState('fleeing');
        setGoodNinjaTaunt('Victory! 🎉');
        setDevilNinjaTaunt("I'll be back!");
        // Victory impact with shake
        triggerImpact('victory');
      }, 4000);

      setTimeout(() => {
        setShowDevil(false);
        setFightMode(false);
        setGoodNinjaState('idle');
        setGoodNinjaTaunt(null);
        setDevilNinjaTaunt(null);
        setShowCombo(false);
      }, 5000);
    };

    const initialTimeout = setTimeout(startFight, INTERVAL.FIGHT_START);
    const fightInterval = setInterval(
      startFight,
      randomInterval(INTERVAL.FIGHT_INTERVAL_MIN, INTERVAL.FIGHT_INTERVAL_MAX)
    );

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(fightInterval);
    };
  }, []);

  return (
    <motion.div
      className="relative flex items-center justify-center gap-4 pointer-events-none"
      animate={
        screenShake
          ? {
              x: [0, -4, 4, -3, 3, -2, 2, 0],
              y: [0, 2, -2, 1, -1, 0],
            }
          : { x: 0, y: 0 }
      }
      transition={{ duration: 0.15, ease: 'easeOut' }}
    >
      {/* Combo Counter */}
      <AnimatePresence>
        {showCombo && comboCount > 0 && (
          <motion.div
            className="absolute z-30 font-mono font-black text-center"
            style={{
              top: '-40px',
              left: '50%',
              transform: 'translateX(-50%)',
            }}
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -10 }}
            transition={{ duration: 0.2, type: 'spring', stiffness: 200 }}
          >
            <motion.div
              className="relative"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.2 }}
              key={comboCount}
            >
              <span
                className="text-2xl md:text-3xl"
                style={{
                  color:
                    comboCount >= 4
                      ? 'hsl(var(--jules-yellow))'
                      : comboCount >= 2
                        ? 'hsl(var(--jules-cyan))'
                        : 'hsl(var(--jules-green))',
                  textShadow:
                    comboCount >= 4
                      ? '0 0 20px hsl(var(--jules-yellow)), 0 0 40px hsl(var(--jules-magenta) / 0.5)'
                      : comboCount >= 2
                        ? '0 0 15px hsl(var(--jules-cyan))'
                        : '0 0 10px hsl(var(--jules-green))',
                }}
              >
                {comboCount}x
              </span>
              <span
                className="ml-1 text-xs md:text-sm uppercase tracking-wider"
                style={{
                  color: 'hsl(var(--muted-foreground))',
                }}
              >
                {comboCount >= 4
                  ? 'ULTRA!'
                  : comboCount >= 3
                    ? 'SUPER!'
                    : comboCount >= 2
                      ? 'COMBO!'
                      : 'HIT!'}
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Flying Shurikens */}
      <AnimatePresence>
        {shurikens.map((shuriken) => (
          <motion.div
            key={shuriken.id}
            className="absolute z-25"
            style={{
              left: shuriken.from === 'good' ? '30%' : '70%',
              top: '50%',
            }}
            initial={{
              opacity: 1,
              scale: 0.5,
              x: 0,
              y: 0,
              rotate: 0,
            }}
            animate={{
              opacity: [1, 1, 0],
              scale: [0.5, 1, 0.8],
              x: shuriken.from === 'good' ? [0, 60, 80] : [0, -60, -80],
              y: [0, -10, 5],
              rotate: shuriken.from === 'good' ? [0, 720, 1080] : [0, -720, -1080],
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            {/* Shuriken SVG */}
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              style={{
                filter:
                  shuriken.from === 'good'
                    ? 'drop-shadow(0 0 6px hsl(var(--jules-green)))'
                    : 'drop-shadow(0 0 6px hsl(var(--jules-magenta)))',
              }}
            >
              {/* 4-pointed shuriken */}
              <path
                d="M12 2 L14 10 L12 8 L10 10 Z"
                fill={
                  shuriken.from === 'good' ? 'hsl(var(--jules-green))' : 'hsl(var(--jules-magenta))'
                }
              />
              <path
                d="M22 12 L14 14 L16 12 L14 10 Z"
                fill={
                  shuriken.from === 'good' ? 'hsl(var(--jules-green))' : 'hsl(var(--jules-magenta))'
                }
              />
              <path
                d="M12 22 L10 14 L12 16 L14 14 Z"
                fill={
                  shuriken.from === 'good' ? 'hsl(var(--jules-green))' : 'hsl(var(--jules-magenta))'
                }
              />
              <path
                d="M2 12 L10 10 L8 12 L10 14 Z"
                fill={
                  shuriken.from === 'good' ? 'hsl(var(--jules-green))' : 'hsl(var(--jules-magenta))'
                }
              />
              <circle
                cx="12"
                cy="12"
                r="3"
                fill={
                  shuriken.from === 'good' ? 'hsl(var(--jules-cyan))' : 'hsl(var(--destructive))'
                }
              />
            </svg>

            {/* Trail effect */}
            <motion.div
              className="absolute top-1/2 -translate-y-1/2"
              style={{
                width: 30,
                height: 2,
                left: shuriken.from === 'good' ? -30 : 20,
                background:
                  shuriken.from === 'good'
                    ? 'linear-gradient(90deg, transparent, hsl(var(--jules-green) / 0.6))'
                    : 'linear-gradient(-90deg, transparent, hsl(var(--jules-magenta) / 0.6))',
              }}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: [0, 1, 0.5], opacity: [0, 0.8, 0] }}
              transition={{ duration: 0.4 }}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Impact Effects */}
      <AnimatePresence>
        {showImpact && (
          <motion.div
            className="absolute z-20"
            style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.15 }}
          >
            {/* Shockwave ring */}
            <motion.div
              className="absolute rounded-full"
              style={{
                width: impactType === 'victory' ? 120 : 80,
                height: impactType === 'victory' ? 120 : 80,
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                border:
                  impactType === 'victory'
                    ? '3px solid hsl(var(--jules-yellow))'
                    : impactType === 'kick'
                      ? '3px solid hsl(var(--jules-green))'
                      : '3px solid hsl(var(--jules-cyan))',
                boxShadow:
                  impactType === 'victory'
                    ? '0 0 30px hsl(var(--jules-yellow) / 0.6), inset 0 0 20px hsl(var(--jules-yellow) / 0.3)'
                    : impactType === 'kick'
                      ? '0 0 25px hsl(var(--jules-green) / 0.6), inset 0 0 15px hsl(var(--jules-green) / 0.3)'
                      : '0 0 20px hsl(var(--jules-cyan) / 0.5), inset 0 0 10px hsl(var(--jules-cyan) / 0.2)',
              }}
              initial={{ scale: 0.3, opacity: 1 }}
              animate={{ scale: 2, opacity: 0 }}
              transition={{ duration: impactType === 'victory' ? 0.5 : 0.3, ease: 'easeOut' }}
            />

            {/* Spark particles */}
            {[...Array(impactType === 'victory' ? 12 : 8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  left: '50%',
                  top: '50%',
                  background:
                    impactType === 'victory'
                      ? `hsl(var(--jules-yellow))`
                      : impactType === 'kick'
                        ? `hsl(var(--jules-green))`
                        : `hsl(var(--jules-cyan))`,
                  boxShadow:
                    impactType === 'victory'
                      ? '0 0 8px hsl(var(--jules-yellow)), 0 0 15px hsl(var(--jules-magenta) / 0.5)'
                      : impactType === 'kick'
                        ? '0 0 8px hsl(var(--jules-green))'
                        : '0 0 6px hsl(var(--jules-cyan))',
                }}
                initial={{
                  x: 0,
                  y: 0,
                  scale: 1,
                  opacity: 1,
                }}
                animate={{
                  x:
                    Math.cos(((i * 360) / (impactType === 'victory' ? 12 : 8)) * (Math.PI / 180)) *
                    (40 + Math.random() * 30),
                  y:
                    Math.sin(((i * 360) / (impactType === 'victory' ? 12 : 8)) * (Math.PI / 180)) *
                    (40 + Math.random() * 30),
                  scale: 0,
                  opacity: 0,
                }}
                transition={{
                  duration: impactType === 'victory' ? 0.5 : 0.35,
                  ease: 'easeOut',
                  delay: i * 0.02,
                }}
              />
            ))}

            {/* Center flash */}
            <motion.div
              className="absolute rounded-full"
              style={{
                width: impactType === 'victory' ? 40 : 24,
                height: impactType === 'victory' ? 40 : 24,
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                background:
                  impactType === 'victory'
                    ? 'radial-gradient(circle, hsl(var(--jules-yellow)), hsl(var(--jules-magenta) / 0.5), transparent)'
                    : impactType === 'kick'
                      ? 'radial-gradient(circle, hsl(var(--jules-green)), transparent)'
                      : 'radial-gradient(circle, hsl(var(--jules-cyan)), transparent)',
              }}
              initial={{ scale: 0.5, opacity: 1 }}
              animate={{ scale: 2.5, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            />

            {/* Speed lines for kick */}
            {impactType === 'kick' && (
              <>
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={`line-${i}`}
                    className="absolute"
                    style={{
                      width: 20 + Math.random() * 15,
                      height: 2,
                      left: '50%',
                      top: '50%',
                      background: 'linear-gradient(90deg, hsl(var(--jules-green)), transparent)',
                      transformOrigin: 'left center',
                      rotate: `${-30 + i * 12}deg`,
                    }}
                    initial={{ scaleX: 0, opacity: 1, x: 0 }}
                    animate={{ scaleX: 1, opacity: 0, x: 20 }}
                    transition={{ duration: 0.3, delay: i * 0.03 }}
                  />
                ))}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* All Ninjas - together in one row */}
      <div className="flex items-center gap-3">
        {/* Dad Ninja - inline with fighting ninjas */}
        <AnimatePresence>
          {dadNinjaVisible && (
            <motion.div
              className="relative"
              initial={{
                opacity: 0,
                scale: 0.5,
                x: -20,
              }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{
                opacity: 0,
                scale: 0.5,
                x: -20,
              }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <div className="relative flex flex-col items-center">
                {/* Dad joke speech bubble - positioned ABOVE ninja's head */}
                <AnimatePresence>
                  {showJoke && dadLine && (
                    <motion.div
                      className="absolute w-[180px] md:w-[220px]"
                      style={{
                        bottom: '100%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        marginBottom: '8px',
                      }}
                      initial={{ opacity: 0, scale: 0.5, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.5, y: 10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div
                        className="relative px-3 py-2 rounded-xl font-mono text-xs text-center"
                        style={{
                          background:
                            dadLine.type === 'joke'
                              ? 'linear-gradient(135deg, hsl(var(--jules-cyan) / 0.15), hsl(var(--jules-magenta) / 0.15))'
                              : 'hsl(var(--jules-dark) / 0.95)',
                          border:
                            dadLine.type === 'joke'
                              ? '2px solid hsl(var(--jules-yellow) / 0.8)'
                              : '2px solid hsl(var(--muted-foreground) / 0.5)',
                          boxShadow:
                            dadLine.type === 'joke'
                              ? '0 0 25px hsl(var(--jules-yellow) / 0.4), 0 0 50px hsl(var(--jules-magenta) / 0.2)'
                              : '0 0 15px hsl(var(--muted-foreground) / 0.2)',
                          color:
                            dadLine.type === 'joke'
                              ? 'hsl(var(--jules-yellow))'
                              : 'hsl(var(--muted-foreground))',
                        }}
                      >
                        {dadLine.type === 'joke' && <span className="mr-1">😂</span>}
                        <span
                          className="font-medium leading-relaxed"
                          style={{
                            textShadow:
                              dadLine.type === 'joke'
                                ? '0 0 10px hsl(var(--jules-yellow) / 0.5)'
                                : 'none',
                          }}
                        >
                          {dadLine.text}
                        </span>
                        <div
                          className="absolute left-1/2 -translate-x-1/2 w-0 h-0"
                          style={{
                            bottom: '-10px',
                            borderLeft: '10px solid transparent',
                            borderRight: '10px solid transparent',
                            borderTop:
                              dadLine.type === 'joke'
                                ? '10px solid hsl(var(--jules-yellow) / 0.8)'
                                : '10px solid hsl(var(--muted-foreground) / 0.5)',
                          }}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Dad ninja with purple bands */}
                <motion.div
                  animate={{ y: [0, -4, 0], rotate: [-1, 1, -1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="relative"
                >
                  <div
                    className="absolute -top-1 left-1/2 -translate-x-1/2 w-12 h-1.5 rounded-full opacity-90"
                    style={{
                      background:
                        'linear-gradient(90deg, transparent, hsl(var(--jules-purple)), transparent)',
                      boxShadow: '0 0 10px hsl(var(--jules-purple) / 0.7)',
                    }}
                  />
                  <NinjaIcon
                    variant="thinking"
                    weapon="none"
                    className="w-10 h-10 md:w-14 md:h-14 drop-shadow-[0_0_15px_hsl(var(--jules-purple)/0.6)]"
                  />
                  <motion.div
                    className="absolute -right-2 top-1 w-4 h-0.5 rounded-full"
                    style={{ background: 'hsl(var(--jules-purple))' }}
                    animate={{ rotate: [0, 20, 0, -15, 0], x: [0, 3, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                  />
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Good Ninja - green tinted */}
        <div className="relative">
          {/* Good ninja speech bubble */}
          <AnimatePresence>
            {goodNinjaTaunt && (
              <motion.div
                className="absolute w-[120px] md:w-[140px] z-10"
                style={{
                  bottom: '100%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  marginBottom: '8px',
                }}
                initial={{ opacity: 0, scale: 0.5, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5, y: 5 }}
                transition={{ duration: 0.2 }}
              >
                <div
                  className="relative px-2 py-1.5 rounded-lg font-mono text-xs text-center font-bold"
                  style={{
                    background:
                      'linear-gradient(135deg, hsl(var(--jules-green) / 0.2), hsl(var(--jules-cyan) / 0.2))',
                    border: '2px solid hsl(var(--jules-green) / 0.8)',
                    boxShadow: '0 0 15px hsl(var(--jules-green) / 0.5)',
                    color: 'hsl(var(--jules-green))',
                    textShadow: '0 0 8px hsl(var(--jules-green) / 0.6)',
                  }}
                >
                  {goodNinjaTaunt}
                  <div
                    className="absolute left-1/2 -translate-x-1/2 w-0 h-0"
                    style={{
                      bottom: '-8px',
                      borderLeft: '8px solid transparent',
                      borderRight: '8px solid transparent',
                      borderTop: '8px solid hsl(var(--jules-green) / 0.8)',
                    }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            animate={{
              scale:
                goodNinjaState === 'spinning-kick' ? 1.4 : goodNinjaState === 'winning' ? 1.3 : 1.1,
              rotate:
                goodNinjaState === 'spinning-kick'
                  ? 540
                  : goodNinjaState === 'fighting'
                    ? [-4, 4, -4]
                    : 0,
              x: goodNinjaState === 'fighting' || goodNinjaState === 'spinning-kick' ? -10 : 0,
            }}
            transition={{
              duration: goodNinjaState === 'spinning-kick' ? 0.4 : 0.8,
              ease: 'easeInOut',
              type: 'spring',
              stiffness: 120,
            }}
            style={{ filter: 'hue-rotate(80deg) saturate(1.2)' }}
          >
            <NinjaIcon
              variant={fightMode ? 'coding' : 'happy'}
              weapon={fightMode ? 'katana' : 'shuriken'}
              className="w-10 h-10 md:w-14 md:h-14 drop-shadow-[0_0_12px_hsl(var(--jules-green)/0.6)]"
            />
          </motion.div>
        </div>

        {/* Devil Ninja with drawn devil horns */}
        <AnimatePresence>
          {showDevil && (
            <div className="relative">
              {/* Devil ninja speech bubble */}
              <AnimatePresence>
                {devilNinjaTaunt && (
                  <motion.div
                    className="absolute w-[120px] md:w-[140px] z-10"
                    style={{
                      bottom: '100%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      marginBottom: '8px',
                    }}
                    initial={{ opacity: 0, scale: 0.5, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5, y: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div
                      className="relative px-2 py-1.5 rounded-lg font-mono text-xs text-center font-bold"
                      style={{
                        background:
                          'linear-gradient(135deg, hsl(var(--jules-magenta) / 0.2), hsl(var(--destructive) / 0.2))',
                        border: '2px solid hsl(var(--jules-magenta) / 0.8)',
                        boxShadow: '0 0 15px hsl(var(--jules-magenta) / 0.5)',
                        color: 'hsl(var(--jules-magenta))',
                        textShadow: '0 0 8px hsl(var(--jules-magenta) / 0.6)',
                      }}
                    >
                      {devilNinjaTaunt}
                      <div
                        className="absolute left-1/2 -translate-x-1/2 w-0 h-0"
                        style={{
                          bottom: '-8px',
                          borderLeft: '8px solid transparent',
                          borderRight: '8px solid transparent',
                          borderTop: '8px solid hsl(var(--jules-magenta) / 0.8)',
                        }}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                style={{ filter: 'hue-rotate(330deg) saturate(1.4)' }}
                initial={{ scale: 0, opacity: 0, rotate: -180 }}
                animate={{
                  scale:
                    devilNinjaState === 'dodge' ? 0.85 : devilNinjaState === 'fleeing' ? 0.4 : 1.1,
                  rotate:
                    devilNinjaState === 'dodge'
                      ? 20
                      : devilNinjaState === 'fighting'
                        ? [4, -4, 4]
                        : 0,
                  opacity: devilNinjaState === 'fleeing' ? 0 : 1,
                  x: devilNinjaState === 'dodge' ? 20 : 10,
                }}
                exit={{ opacity: 0, scale: 0.4, rotate: 180 }}
                transition={{
                  duration: devilNinjaState === 'fleeing' ? 0.4 : 0.8,
                  ease: devilNinjaState === 'fleeing' ? 'easeIn' : 'easeOut',
                  type: 'spring',
                  stiffness: 100,
                }}
              >
                <div className="relative">
                  <NinjaIcon
                    variant="wink"
                    weapon="katana"
                    className="w-10 h-10 md:w-14 md:h-14 drop-shadow-[0_0_12px_hsl(var(--jules-magenta)/0.5)]"
                  />
                  {/* Devil horns - drawn SVG */}
                  <svg
                    className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-4"
                    viewBox="0 0 32 16"
                    fill="none"
                  >
                    <path
                      d="M8 14 L4 2 L10 8 Z"
                      fill="hsl(var(--jules-magenta))"
                      stroke="hsl(var(--destructive))"
                      strokeWidth="1"
                    />
                    <path
                      d="M24 14 L28 2 L22 8 Z"
                      fill="hsl(var(--jules-magenta))"
                      stroke="hsl(var(--destructive))"
                      strokeWidth="1"
                    />
                  </svg>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default HeroNinjas;
