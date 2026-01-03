import { useEffect, useRef } from 'react';

const QUANTUM_CHARS = '01ψφ∇∑∂∫λΩαβγδεζηθικμνξπρστυχω⟨⟩|+−×÷=≠≈∞∈∉⊂⊃∪∩';

export const MatrixRain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const fontSize = 16;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array(columns).fill(1);
    const speeds: number[] = Array(columns)
      .fill(0)
      .map(() => Math.random() * 0.8 + 0.5);

    const draw = () => {
      ctx.fillStyle = 'rgba(10, 10, 15, 0.03)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `bold ${fontSize}px "JetBrains Mono", monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = QUANTUM_CHARS[Math.floor(Math.random() * QUANTUM_CHARS.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // More vibrant gradient from cyan to magenta
        const hue = (y / canvas.height) * 80 + 170;
        const lightness = 50 + Math.random() * 20;
        const alpha = Math.random() * 0.25 + 0.1;

        if (Math.random() > 0.95) {
          // Brighter flash effect
          ctx.shadowColor = `hsla(${hue}, 100%, 70%, 0.8)`;
          ctx.shadowBlur = 10;
          ctx.fillStyle = `hsla(${hue}, 100%, 80%, ${alpha * 4})`;
        } else {
          ctx.shadowBlur = 0;
          ctx.fillStyle = `hsla(${hue}, 100%, ${lightness}%, ${alpha})`;
        }

        ctx.fillText(char, x, y);

        if (y > canvas.height && Math.random() > 0.96) {
          drops[i] = 0;
        }
        drops[i] += speeds[i];
      }
    };

    const interval = setInterval(draw, 35);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.08 }}
    />
  );
};

export default MatrixRain;
