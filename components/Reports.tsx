"use client";

import React, { useEffect, useRef } from 'react';
import { useNutriTrack } from '@/hooks/useNutriTrack';

export default function Reports() {
  const { currentSection, currentDate, getDateKey, meals, waterLog, goals } = useNutriTrack();
  
  const waterCanvasRef = useRef<HTMLCanvasElement>(null);
  const macroCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (currentSection !== 'reports') return;

    // --- Water Chart ---
    const wCanvas = waterCanvasRef.current;
    if (wCanvas) {
      const ctx = wCanvas.getContext('2d');
      if (ctx) {
        wCanvas.width = wCanvas.offsetWidth * 2;
        wCanvas.height = wCanvas.offsetHeight * 2;
        ctx.scale(2, 2);

        const w = wCanvas.offsetWidth;
        const h = wCanvas.offsetHeight;
        ctx.clearRect(0, 0, w, h);

        const days: number[] = [];
        const dayLabels: string[] = [];
        for (let i = 6; i >= 0; i--) {
          const d = new Date(currentDate);
          d.setDate(d.getDate() - i);
          const key = getDateKey(d);
          const logs = waterLog[key] || [];
          const ml = logs.reduce((sum, val) => sum + val.amount, 0);
          days.push(ml / 250); // glasses
          dayLabels.push(d.toLocaleDateString('en-US', { weekday: 'short' }));
        }

        const maxVal = Math.max(...days, goals.water) * 1.2;
        const chartLeft = 50;
        const chartBottom = h - 30;
        const chartTop = 20;
        const chartHeight = chartBottom - chartTop;

        ctx.strokeStyle = 'rgba(255,255,255,0.05)';
        for (let i = 0; i <= 4; i++) {
          const y = chartTop + (chartHeight / 4) * i;
          ctx.beginPath();
          ctx.moveTo(chartLeft, y);
          ctx.lineTo(w - 10, y);
          ctx.stroke();

          ctx.fillStyle = 'rgba(255,255,255,0.3)';
          ctx.font = '10px Inter';
          ctx.textAlign = 'right';
          ctx.fillText((Math.round((maxVal - (maxVal / 4) * i) * 10) / 10).toString(), chartLeft - 8, y + 4);
        }

        const goalY = chartTop + chartHeight * (1 - goals.water / maxVal);
        ctx.strokeStyle = 'rgba(108, 99, 255, 0.4)';
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(chartLeft, goalY);
        ctx.lineTo(w - 10, goalY);
        ctx.stroke();
        ctx.setLineDash([]);

        const points = days.map((val, i) => {
          const barWidth = (w - 80) / 7;
          const x = chartLeft + i * barWidth + barWidth / 2;
          const y = chartTop + chartHeight * (1 - val / maxVal);
          return { x, y };
        });

        if (points.length > 0) {
          const areaGrad = ctx.createLinearGradient(0, chartTop, 0, chartBottom);
          areaGrad.addColorStop(0, 'rgba(78, 205, 196, 0.2)');
          areaGrad.addColorStop(1, 'rgba(78, 205, 196, 0.01)');
          ctx.fillStyle = areaGrad;
          ctx.beginPath();
          ctx.moveTo(points[0].x, chartBottom);
          points.forEach(p => ctx.lineTo(p.x, p.y));
          ctx.lineTo(points[points.length - 1].x, chartBottom);
          ctx.fill();

          const lineGrad = ctx.createLinearGradient(points[0].x, 0, points[points.length - 1].x, 0);
          lineGrad.addColorStop(0, '#4ECDC4');
          lineGrad.addColorStop(1, '#44B0FF');
          ctx.strokeStyle = lineGrad;
          ctx.lineWidth = 2.5;
          ctx.lineJoin = 'round';
          ctx.beginPath();
          points.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
          ctx.stroke();

          points.forEach((p, i) => {
            ctx.fillStyle = '#4ECDC4';
            ctx.beginPath();
            ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#0a0a1a';
            ctx.beginPath();
            ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = 'rgba(255,255,255,0.4)';
            ctx.font = '10px Inter';
            ctx.textAlign = 'center';
            ctx.fillText(dayLabels[i], p.x, chartBottom + 16);

            if (days[i] > 0) {
              ctx.fillStyle = 'rgba(255,255,255,0.6)';
              ctx.fillText((Math.round(days[i] * 10) / 10).toString(), p.x, p.y - 10);
            }
          });
        }
      }
    }

    // --- Macro Chart ---
    const mCanvas = macroCanvasRef.current;
    if (mCanvas) {
      const ctx = mCanvas.getContext('2d');
      if (ctx) {
        mCanvas.width = mCanvas.offsetWidth * 2;
        mCanvas.height = mCanvas.offsetHeight * 2;
        ctx.scale(2, 2);

        const w = mCanvas.offsetWidth;
        const h = mCanvas.offsetHeight;
        ctx.clearRect(0, 0, w, h);

        const dateKey = getDateKey();
        const dayMeals = meals[dateKey] || {};
        let totalProtein = 0, totalCarbs = 0, totalFat = 0;

        Object.values(dayMeals).forEach(items => {
          items.forEach(item => {
            totalProtein += item.protein || 0;
            totalCarbs += item.carbs || 0;
            totalFat += item.fat || 0;
          });
        });

        const total = totalProtein + totalCarbs + totalFat;
        if (total === 0) {
          ctx.fillStyle = 'rgba(255,255,255,0.3)';
          ctx.font = '13px Inter';
          ctx.textAlign = 'center';
          ctx.fillText('No macro data yet today', w / 2, h / 2);
        } else {
          const data = [
            { label: 'Protein', value: totalProtein, color: '#B24BF3' },
            { label: 'Carbs', value: totalCarbs, color: '#6C63FF' },
            { label: 'Fat', value: totalFat, color: '#FF6B6B' }
          ];

          const cx = w / 2;
          const cy = h / 2;
          const radius = Math.min(w, h) / 2 - 40;
          const innerRadius = radius * 0.6;
          let startAngle = -Math.PI / 2;

          data.forEach(d => {
            const sliceAngle = (d.value / total) * Math.PI * 2;
            const endAngle = startAngle + sliceAngle;

            ctx.fillStyle = d.color;
            ctx.beginPath();
            ctx.arc(cx, cy, radius, startAngle, endAngle);
            ctx.arc(cx, cy, innerRadius, endAngle, startAngle, true);
            ctx.closePath();
            ctx.fill();

            // Labels
            const midAngle = startAngle + sliceAngle / 2;
            const labelRadius = radius + 20;
            const lx = cx + Math.cos(midAngle) * labelRadius;
            const ly = cy + Math.sin(midAngle) * labelRadius;

            ctx.fillStyle = 'rgba(255,255,255,0.8)';
            ctx.font = '11px Inter';
            ctx.textAlign = 'center';
            ctx.fillText(`${Math.round((d.value / total) * 100)}%`, lx, ly);

            startAngle = endAngle;
          });
        }
      }
    }

  }, [currentSection, currentDate, meals, waterLog, goals.water]);

  if (currentSection !== 'reports') return null;

  return (
    <section className="page-section active">
      <div className="section-header">
        <h2>Weekly Reports</h2>
        <p className="subtitle">Visualize your nutrition trends over the past week</p>
      </div>

      <div className="reports-grid">
        <div className="chart-card" style={{ gridColumn: '1 / -1' }}>
          <h3>💧 Water Intake (7 Days)</h3>
          <canvas className="chart-canvas" id="water-chart" ref={waterCanvasRef}></canvas>
          <div className="chart-legend">
            <div className="legend-item">
              <div className="legend-dot" style={{ background: 'var(--gradient-cool)' }}></div>
              <span>Glasses</span>
            </div>
            <div className="legend-item">
              <div className="legend-dot" style={{ background: 'var(--accent-primary)' }}></div>
              <span>Goal</span>
            </div>
          </div>
        </div>
      </div>

      <div className="reports-full-width">
        <div className="chart-card">
          <h3>🥧 Today's Macro Distribution</h3>
          <canvas className="chart-canvas" id="macro-chart" ref={macroCanvasRef} style={{ height: '260px' }}></canvas>
          <div className="chart-legend">
            <div className="legend-item">
              <div className="legend-dot" style={{ background: '#B24BF3' }}></div>
              <span>Protein</span>
            </div>
            <div className="legend-item">
              <div className="legend-dot" style={{ background: '#6C63FF' }}></div>
              <span>Carbs</span>
            </div>
            <div className="legend-item">
              <div className="legend-dot" style={{ background: '#FF6B6B' }}></div>
              <span>Fat</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
