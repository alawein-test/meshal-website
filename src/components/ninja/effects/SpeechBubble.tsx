/**
 * 💬 SpeechBubble - What the ninja says
 */

import type { NinjaSpeechBubble, NinjaColors } from '../types';

interface SpeechBubbleProps {
  bubble: string | NinjaSpeechBubble;
  colors: NinjaColors;
  size: number;
  visible?: boolean;
}

export function SpeechBubble({ bubble, colors, size, visible = true }: SpeechBubbleProps) {
  const config: NinjaSpeechBubble =
    typeof bubble === 'string' ? { text: bubble, type: 'tip', position: 'top' } : bubble;

  const { text, type = 'tip', position = 'top' } = config;

  // Position offsets
  const positionStyles: Record<string, React.CSSProperties> = {
    top: { bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: size * 0.1 },
    right: { left: '100%', top: '50%', transform: 'translateY(-50%)', marginLeft: size * 0.1 },
    bottom: { top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: size * 0.1 },
    left: { right: '100%', top: '50%', transform: 'translateY(-50%)', marginRight: size * 0.1 },
  };

  // Type-based styling
  const typeStyles: Record<string, { bg: string; border: string; emoji?: string }> = {
    tip: { bg: 'rgba(0,0,0,0.9)', border: colors.accessoryPrimary, emoji: '💡' },
    joke: { bg: 'rgba(0,0,0,0.9)', border: '#FBBF24', emoji: '😄' },
    motivation: { bg: 'rgba(0,0,0,0.9)', border: colors.eyes, emoji: '🔥' },
    rant: { bg: 'rgba(40,40,40,0.95)', border: '#888', emoji: '😤' },
    greeting: { bg: 'rgba(0,0,0,0.9)', border: colors.accessoryPrimary, emoji: '👋' },
  };

  const style = typeStyles[type] || typeStyles.tip;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.8,
            y: position === 'top' ? 10 : position === 'bottom' ? -10 : 0,
          }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            ...positionStyles[position],
            zIndex: 50,
          }}
        >
          <div
            style={{
              background: style.bg,
              border: `2px solid ${style.border}`,
              borderRadius: size * 0.15,
              padding: `${size * 0.08}px ${size * 0.12}px`,
              maxWidth: size * 2.5,
              minWidth: size * 0.8,
              boxShadow: `0 4px 20px rgba(0,0,0,0.5), 0 0 10px ${style.border}40`,
            }}
          >
            {/* Bubble tail */}
            <div
              style={{
                position: 'absolute',
                width: 0,
                height: 0,
                ...(position === 'top'
                  ? {
                      bottom: -8,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      borderLeft: '8px solid transparent',
                      borderRight: '8px solid transparent',
                      borderTop: `8px solid ${style.border}`,
                    }
                  : position === 'bottom'
                    ? {
                        top: -8,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        borderLeft: '8px solid transparent',
                        borderRight: '8px solid transparent',
                        borderBottom: `8px solid ${style.border}`,
                      }
                    : {}),
              }}
            />

            {/* Content */}
            <div style={{ display: 'flex', alignItems: 'center', gap: size * 0.06 }}>
              {style.emoji && <span style={{ fontSize: size * 0.15 }}>{style.emoji}</span>}
              <span
                style={{
                  color: '#fff',
                  fontSize: Math.max(10, size * 0.12),
                  fontWeight: 600,
                  lineHeight: 1.3,
                  fontFamily: 'Inter, system-ui, sans-serif',
                }}
              >
                {text}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
