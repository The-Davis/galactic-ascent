import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  r: number;
  opacity: number;
  speed: number;
  twinkleOffset: number;
}

function generateStars(count: number, width: number, height: number): Star[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    r: Math.random() * 1.5 + 0.2,
    opacity: Math.random() * 0.7 + 0.1,
    speed: Math.random() * 0.02 + 0.005,
    twinkleOffset: Math.random() * Math.PI * 2,
  }));
}

export function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const frameRef = useRef<number>(0);
  const timeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      starsRef.current = generateStars(200, canvas.width, canvas.height);
    };

    resize();
    window.addEventListener('resize', resize);

    const draw = (t: number) => {
      timeRef.current = t * 0.001;
      const { width, height } = canvas;

      ctx.clearRect(0, 0, width, height);

      for (const star of starsRef.current) {
        const twinkle = 0.5 + 0.5 * Math.sin(timeRef.current * star.speed * 60 + star.twinkleOffset);
        const alpha = star.opacity * (0.4 + 0.6 * twinkle);

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 230, 255, ${alpha})`;
        ctx.fill();
      }

      frameRef.current = requestAnimationFrame(draw);
    };

    frameRef.current = requestAnimationFrame(draw);
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'radial-gradient(ellipse at 30% 40%, #0a0f2e 0%, #020408 70%)' }}
    />
  );
}
