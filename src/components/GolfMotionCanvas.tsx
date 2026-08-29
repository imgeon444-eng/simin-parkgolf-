import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Flag, Play, RotateCcw } from 'lucide-react';

interface GolfMotionCanvasProps {
  className?: string;
  interactive?: boolean;
}

export const GolfMotionCanvas: React.FC<GolfMotionCanvasProps> = ({ 
  className = "w-full h-full",
  interactive = true 
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [shotCount, setShotCount] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 400);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // 파티클 시스템
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      color: string;
    }

    const particles: Particle[] = [];

    // 골프공 시뮬레이션 상태
    let progress = 0;
    const ball = {
      x: 0,
      y: 0,
      radius: 7,
      color: '#ffffff'
    };

    // 타겟 홀컵 & 깃발 위치
    const getHolePos = () => ({
      x: width * 0.82,
      y: height * 0.58
    });

    const getTeePos = () => ({
      x: width * 0.15,
      y: height * 0.72
    });

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const tee = getTeePos();
      const hole = getHolePos();

      // 1. 잔디 필드 및 옥상 라이트 그라디언트 배경
      const fieldGrad = ctx.createLinearGradient(0, 0, width, height);
      fieldGrad.addColorStop(0, '#061a10');
      fieldGrad.addColorStop(0.5, '#0a2e1d');
      fieldGrad.addColorStop(1, '#05140d');
      ctx.fillStyle = fieldGrad;
      ctx.fillRect(0, 0, width, height);

      // 잔디 라인 그리드 (350평 옥상 숏게임장 텍스처)
      ctx.strokeStyle = 'rgba(52, 211, 153, 0.08)';
      ctx.lineWidth = 1;
      const step = 40;
      for (let x = 0; x < width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 2. 궤적 가이드 라인 (포물선 스윙 궤적)
      const ctrlX = (tee.x + hole.x) / 2;
      const ctrlY = Math.min(tee.y, hole.y) - height * 0.45;

      ctx.beginPath();
      ctx.moveTo(tee.x, tee.y);
      ctx.quadraticCurveTo(ctrlX, ctrlY, hole.x, hole.y);
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.3)';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 6]);
      ctx.stroke();
      ctx.setLineDash([]);

      // 3. 홀컵 및 깃발 렌더링
      // 홀컵 (어두운 타원)
      ctx.beginPath();
      ctx.ellipse(hole.x, hole.y, 14, 6, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#020704';
      ctx.fill();
      ctx.strokeStyle = 'rgba(52, 211, 153, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // 깃대 (Pole)
      const flagHeight = 45;
      ctx.beginPath();
      ctx.moveTo(hole.x, hole.y);
      ctx.lineTo(hole.x, hole.y - flagHeight);
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // 깃발 (Flag 펄럭임)
      const wave = Math.sin(Date.now() * 0.005) * 4;
      ctx.beginPath();
      ctx.moveTo(hole.x, hole.y - flagHeight);
      ctx.lineTo(hole.x + 22, hole.y - flagHeight + 8 + wave);
      ctx.lineTo(hole.x, hole.y - flagHeight + 16);
      ctx.closePath();
      const flagGrad = ctx.createLinearGradient(hole.x, 0, hole.x + 22, 0);
      flagGrad.addColorStop(0, '#ef4444');
      flagGrad.addColorStop(1, '#f59e0b');
      ctx.fillStyle = flagGrad;
      ctx.fill();

      // 4. 티잉 구역 (Teeing ground)
      ctx.beginPath();
      ctx.ellipse(tee.x, tee.y, 10, 4, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(16, 185, 129, 0.3)';
      ctx.fill();

      // 5. 골프공 위치 계산 (Quadratic Bezier Curve)
      progress += 0.0085;
      if (progress > 1.25) {
        progress = 0;
        setShotCount((prev) => prev + 1);
      }

      const t = Math.min(progress, 1);
      // 베지에 공식: B(t) = (1-t)^2 * P0 + 2(1-t)t * P1 + t^2 * P2
      ball.x = Math.pow(1 - t, 2) * tee.x + 2 * (1 - t) * t * ctrlX + Math.pow(t, 2) * hole.x;
      ball.y = Math.pow(1 - t, 2) * tee.y + 2 * (1 - t) * t * ctrlY + Math.pow(t, 2) * hole.y;

      // 공 크기 원근감 (높이 떴을 때 커지고 착지 시 작아짐)
      const altitude = Math.sin(t * Math.PI);
      const currentRadius = ball.radius + altitude * 4;

      // 파티클 꼬리 생성 (공이 날아갈 때 반짝이는 빛)
      if (progress < 1) {
        for (let i = 0; i < 2; i++) {
          particles.push({
            x: ball.x + (Math.random() - 0.5) * 6,
            y: ball.y + (Math.random() - 0.5) * 6,
            vx: (Math.random() - 0.5) * 1.5,
            vy: (Math.random() - 0.5) * 1.5,
            size: Math.random() * 3 + 1,
            alpha: 1,
            color: Math.random() > 0.5 ? '#34d399' : '#fbbf24'
          });
        }
      }

      // 홀인원 이펙트 (착지 시 폭죽 파티클)
      if (progress >= 0.98 && progress <= 1.02) {
        for (let i = 0; i < 6; i++) {
          particles.push({
            x: hole.x,
            y: hole.y,
            vx: (Math.random() - 0.5) * 5,
            vy: -Math.random() * 4 - 1,
            size: Math.random() * 4 + 2,
            alpha: 1,
            color: Math.random() > 0.5 ? '#10b981' : '#f59e0b'
          });
        }
      }

      // 파티클 렌더링 및 업데이트
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.025;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 6. 골프공 렌더링
      if (progress <= 1) {
        // 공 그림자
        ctx.beginPath();
        const shadowY = tee.y + (hole.y - tee.y) * t;
        ctx.ellipse(ball.x, shadowY, currentRadius * 0.9, currentRadius * 0.35, 0, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 0, 0, ${0.4 * (1 - altitude * 0.5)})`;
        ctx.fill();

        // 공 본체 (빛나는 흰색 입체 구체)
        const ballGrad = ctx.createRadialGradient(
          ball.x - currentRadius * 0.3,
          ball.y - currentRadius * 0.3,
          currentRadius * 0.1,
          ball.x,
          ball.y,
          currentRadius
        );
        ballGrad.addColorStop(0, '#ffffff');
        ballGrad.addColorStop(0.7, '#e2e8f0');
        ballGrad.addColorStop(1, '#94a3b8');

        // 발광 글로우
        ctx.shadowColor = '#34d399';
        ctx.shadowBlur = 12;

        ctx.beginPath();
        ctx.arc(ball.x, ball.y, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = ballGrad;
        ctx.fill();

        ctx.shadowBlur = 0; // 리셋

        // 골프공 딤플(Dimple) 질감 점들
        ctx.fillStyle = 'rgba(100, 116, 139, 0.4)';
        for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 3) {
          const dx = Math.cos(angle) * (currentRadius * 0.4);
          const dy = Math.sin(angle) * (currentRadius * 0.4);
          ctx.beginPath();
          ctx.arc(ball.x + dx, ball.y + dy, currentRadius * 0.12, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // 클릭 시 강제 샷 발사 인터랙션
    const handleCanvasClick = () => {
      progress = 0;
    };

    canvas.addEventListener('click', handleCanvasClick);

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('click', handleCanvasClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className={`relative overflow-hidden rounded-3xl ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full block cursor-pointer"
        title="화면을 클릭하면 골프 샷이 다시 발사됩니다!"
      />
      {/* 인터랙티브 안내 배지 */}
      {interactive && (
        <div className="absolute bottom-2 right-3 pointer-events-none flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-emerald-500/30 text-[10px] text-emerald-300">
          <Sparkles className="w-3 h-3 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
          <span>실시간 60FPS 모션 엔진 구동 중</span>
        </div>
      )}
    </div>
  );
};
