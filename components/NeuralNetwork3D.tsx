"use client";

import React, { useEffect, useRef } from "react";

/**
 * NeuralNetworkScene — versão transparente
 * - Pontos e linhas com brilho
 * - Movimento fluido, sem fundo (canvas transparente)
 * - Sem bibliotecas externas
 */

type Node = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
};

export default function NeuralNetworkScene({
  className = "",
}: {
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null); // ✅ inicializado corretamente

  const nodesRef = useRef<Node[]>([]);
  const sizeRef = useRef({ w: 0, h: 0 });
  const mouseRef = useRef({ x: 0, y: 0, active: false });

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d", { alpha: true })!; // alpha = fundo transparente

    const LINK_DISTANCE = 150;
    const NODE_COUNT = 60;

    const init = () => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      sizeRef.current = { w, h };
      canvas.width = w;
      canvas.height = h;
      nodesRef.current = Array.from({ length: NODE_COUNT }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: 1.2 + Math.random() * 2.5,
      }));
    };

    const update = () => {
      const { w, h } = sizeRef.current;
      const nodes = nodesRef.current;
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;

        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;

        // leve atração ao mouse
        if (mouseRef.current.active) {
          const dx = mouseRef.current.x - n.x;
          const dy = mouseRef.current.y - n.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            n.vx -= dx * 0.0003;
            n.vy -= dy * 0.0003;
          }
        }
      }
    };

    const draw = () => {
      const { w, h } = sizeRef.current;
      const nodes = nodesRef.current;
      ctx.clearRect(0, 0, w, h);

      // linhas conectando nós próximos
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINK_DISTANCE) {
            const alpha = 1 - dist / LINK_DISTANCE;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(0,160,255,${alpha * 0.5})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // pontos brilhantes
      for (const n of nodes) {
        const glow = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.radius * 6);
        glow.addColorStop(0, "rgba(100,200,255,0.9)");
        glow.addColorStop(0.4, "rgba(60,150,255,0.3)");
        glow.addColorStop(1, "rgba(10,20,40,0)");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius * 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "rgba(200,230,255,0.9)";
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = () => {
      update();
      draw();
      rafRef.current = requestAnimationFrame(loop);
    };

    const handleResize = () => init();
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
      mouseRef.current.active = true;
    };
    const handleMouseLeave = () => (mouseRef.current.active = false);

    init();
    loop();

    window.addEventListener("resize", handleResize);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };

  }, []);

  return (
    <div className={`w-full h-full ${className}`} aria-hidden>
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          background: "transparent", // sem fundo
        }}
      />
    </div>
  );
}
