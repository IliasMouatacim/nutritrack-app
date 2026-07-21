"use client";

import React, { useEffect, useRef } from 'react';
import { useNutriTrack } from '@/hooks/useNutriTrack';

export default function Dashboard() {
  const { currentSection, currentDate, getDateKey, meals, waterLog, goals, activityLog } = useNutriTrack();

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const dateKey = getDateKey();
  const dayMeals = meals[dateKey] || {};
  const dayWater = waterLog[dateKey] || [];

  let totalCals = 0, totalProtein = 0, totalCarbs = 0, totalFat = 0;
  Object.values(dayMeals).forEach(mealItems => {
    mealItems.forEach(item => {
      totalCals += item.calories || 0;
      totalProtein += item.protein || 0;
      totalCarbs += item.carbs || 0;
      totalFat += item.fat || 0;
    });
  });

  const totalWater = dayWater.reduce((sum, w) => sum + w.amount, 0);
  const waterGlasses = Math.round((totalWater / 250) * 10) / 10;
  const remaining = Math.max(0, goals.calories - totalCals);

  const calRatio = Math.min(1, totalCals / goals.calories);
  const waterRatio = Math.min(1, waterGlasses / goals.water);
  const proteinRatio = Math.min(1, totalProtein / goals.protein);
  const carbsRatio = Math.min(1, totalCarbs / goals.carbs);
  const fatRatio = Math.min(1, totalFat / goals.fat);

  const circumference = 2 * Math.PI * 55;
  const macroCirc = 2 * Math.PI * 32;

  // Chart rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Scale for high DPI
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);

    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    ctx.clearRect(0, 0, w, h);

    const days: number[] = [];
    const dayLabels: string[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(currentDate);
      d.setDate(d.getDate() - i);
      const k = getDateKey(d);
      const dMeals = meals[k] || {};
      let cals = 0;
      Object.values(dMeals).forEach(items => {
        items.forEach(item => cals += item.calories || 0);
      });
      days.push(cals);
      dayLabels.push(d.toLocaleDateString('en-US', { weekday: 'short' }));
    }

    const maxVal = Math.max(...days, goals.calories) * 1.15;
    const barWidth = (w - 80) / 30;
    const chartLeft = 50;
    const chartBottom = h - 30;
    const chartTop = 20;
    const chartHeight = chartBottom - chartTop;

    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = chartTop + (chartHeight / 4) * i;
      ctx.beginPath();
      ctx.moveTo(chartLeft, y);
      ctx.lineTo(w - 10, y);
      ctx.stroke();

      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.font = '10px Inter';
      ctx.textAlign = 'right';
      const val = Math.round(maxVal - (maxVal / 4) * i);
      ctx.fillText(val.toString(), chartLeft - 10, y + 4);
    }

    const goalY = chartBottom - (goals.calories / maxVal) * chartHeight;
    ctx.beginPath();
    ctx.moveTo(chartLeft, goalY);
    ctx.lineTo(w - 10, goalY);
    ctx.strokeStyle = '#4ECDC4';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([5, 5]);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#4ECDC4';
    ctx.fillText('Goal', w - 10, goalY - 8);

    days.forEach((val, i) => {
      const barH = (val / maxVal) * chartHeight;
      const x = chartLeft + 15 + i * barWidth;
      const y = chartBottom - barH;

      const gradient = ctx.createLinearGradient(0, y, 0, chartBottom);
      gradient.addColorStop(0, '#FF6B6B');
      gradient.addColorStop(1, '#FFE66D');
      
      const barW = Math.max(2, barWidth * 0.8);

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.roundRect(x, y, barW, barH, [4, 4, 0, 0]);
      ctx.fill();

      if (val > 0 && barWidth > 25) {
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        ctx.font = 'bold 10px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(Math.round(val).toString(), x + barW / 2, y - 5);
      }

      if (i % 5 === 0 || i === days.length - 1) {
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.font = '10px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(dayLabels[i], x + barW / 2, chartBottom + 20);
      }
    });
  }, [currentDate, meals, goals.calories]);

  const recentActivity = [...activityLog].reverse().slice(0, 5);

  if (currentSection !== 'dashboard') return null;

  return (
    <section className="page-section active">
      <div className="section-header">
        <h2>Dashboard</h2>
        <p className="subtitle">Your daily nutrition overview at a glance</p>
      </div>

      <div className="chart-card" style={{ marginBottom: 'var(--space-xl)' }}>
        <h3>🔥 Calorie Intake (30 Days)</h3>
        <canvas className="chart-canvas" id="calorie-chart" ref={canvasRef}></canvas>
        <div className="chart-legend">
          <div className="legend-item">
            <div className="legend-dot" style={{ background: 'var(--gradient-warm)' }}></div>
            <span>Daily Calories</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot" style={{ background: 'var(--accent-secondary)' }}></div>
            <span>Goal</span>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="stat-card calories">
          <div className="stat-icon">🔥</div>
          <div className="stat-value">{Math.round(totalCals)}</div>
          <div className="stat-label">Calories</div>
          <div className="stat-sub">of {goals.calories} kcal goal</div>
        </div>
        <div className="stat-card water">
          <div className="stat-icon">💧</div>
          <div className="stat-value">{waterGlasses}</div>
          <div className="stat-label">Water (glasses)</div>
          <div className="stat-sub">of {goals.water} glasses goal</div>
        </div>
        <div className="stat-card protein">
          <div className="stat-icon">💪</div>
          <div className="stat-value">{Math.round(totalProtein)}g</div>
          <div className="stat-label">Protein</div>
          <div className="stat-sub">of {goals.protein}g goal</div>
        </div>
        <div className="stat-card remaining">
          <div className="stat-icon">🎯</div>
          <div className="stat-value">{remaining}</div>
          <div className="stat-label">Remaining</div>
          <div className="stat-sub">{remaining > 0 ? 'calories left today' : 'goal reached! 🎉'}</div>
        </div>
      </div>

      <div className="progress-section">
        <div className="progress-card">
          <div className="progress-ring-wrapper">
            <svg className="progress-ring" width="130" height="130">
              <circle className="progress-ring-bg" cx="65" cy="65" r="55" strokeWidth="10"/>
              <circle className="progress-ring-fill calories" cx="65" cy="65" r="55" strokeWidth="10"
                style={{ strokeDasharray: circumference, strokeDashoffset: circumference - (calRatio * circumference) }}/>
            </svg>
            <div className="progress-center-text">
              <div className="value">{Math.round(totalCals)}</div>
              <div className="label">{Math.min(100, Math.round(calRatio * 100))}%</div>
            </div>
          </div>
          <div className="progress-details">
            <h3>🔥 Calories</h3>
            <p className="progress-meta">{Math.round(totalCals)} / {goals.calories} kcal</p>
            <div className="progress-bar-mini">
              <div className="bar-fill calories" style={{ width: `${Math.min(100, calRatio * 100)}%` }}></div>
            </div>
          </div>
        </div>

        <div className="progress-card">
          <div className="progress-ring-wrapper">
            <svg className="progress-ring" width="130" height="130">
              <circle className="progress-ring-bg" cx="65" cy="65" r="55" strokeWidth="10"/>
              <circle className="progress-ring-fill water" cx="65" cy="65" r="55" strokeWidth="10"
                style={{ strokeDasharray: circumference, strokeDashoffset: circumference - (waterRatio * circumference) }}/>
            </svg>
            <div className="progress-center-text">
              <div className="value">{waterGlasses}</div>
              <div className="label">{Math.min(100, Math.round(waterRatio * 100))}%</div>
            </div>
          </div>
          <div className="progress-details">
            <h3>💧 Hydration</h3>
            <p className="progress-meta">{waterGlasses} / {goals.water} glasses</p>
            <div className="progress-bar-mini">
              <div className="bar-fill water" style={{ width: `${Math.min(100, waterRatio * 100)}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      <div className="macros-grid">
        <div className="macro-card">
          <svg className="macro-ring" width="80" height="80">
            <circle className="progress-ring-bg" cx="40" cy="40" r="32" strokeWidth="6" fill="none"
              stroke="rgba(255,255,255,0.06)" transform="rotate(-90 40 40)"/>
            <circle cx="40" cy="40" r="32" strokeWidth="6" fill="none"
              stroke="url(#gradientPurple)" strokeLinecap="round" transform="rotate(-90 40 40)"
              style={{ strokeDasharray: macroCirc, strokeDashoffset: macroCirc - (proteinRatio * macroCirc) }}/>
          </svg>
          <div className="macro-value">{Math.round(totalProtein)}g</div>
          <div className="macro-label">Protein</div>
          <div className="macro-target">of {goals.protein}g</div>
        </div>
        <div className="macro-card">
          <svg className="macro-ring" width="80" height="80">
            <circle className="progress-ring-bg" cx="40" cy="40" r="32" strokeWidth="6" fill="none"
              stroke="rgba(255,255,255,0.06)" transform="rotate(-90 40 40)"/>
            <circle cx="40" cy="40" r="32" strokeWidth="6" fill="none"
              stroke="url(#gradientPrimary)" strokeLinecap="round" transform="rotate(-90 40 40)"
              style={{ strokeDasharray: macroCirc, strokeDashoffset: macroCirc - (carbsRatio * macroCirc) }}/>
          </svg>
          <div className="macro-value">{Math.round(totalCarbs)}g</div>
          <div className="macro-label">Carbs</div>
          <div className="macro-target">of {goals.carbs}g</div>
        </div>
        <div className="macro-card">
          <svg className="macro-ring" width="80" height="80">
            <circle className="progress-ring-bg" cx="40" cy="40" r="32" strokeWidth="6" fill="none"
              stroke="rgba(255,255,255,0.06)" transform="rotate(-90 40 40)"/>
            <circle cx="40" cy="40" r="32" strokeWidth="6" fill="none"
              stroke="url(#gradientSunset)" strokeLinecap="round" transform="rotate(-90 40 40)"
              style={{ strokeDasharray: macroCirc, strokeDashoffset: macroCirc - (fatRatio * macroCirc) }}/>
          </svg>
          <div className="macro-value">{Math.round(totalFat)}g</div>
          <div className="macro-label">Fat</div>
          <div className="macro-target">of {goals.fat}g</div>
        </div>
      </div>

      <div className="activity-feed">
        <div className="card-header">
          <div className="card-title">📋 Recent Activity</div>
        </div>
        <div>
          {recentActivity.length === 0 ? (
            <div className="empty-state" style={{ padding: '24px' }}>
              <p style={{ color: 'var(--text-tertiary)' }}>No activity yet today. Start tracking!</p>
            </div>
          ) : (
            recentActivity.map((a, i) => (
              <div className="activity-item" key={i}>
                <div className={`activity-dot ${a.type}`}></div>
                <div className="activity-text">
                  <strong>{a.name}</strong> {a.detail || ''}
                </div>
                <div className="activity-time">{a.time}</div>
                {a.calories && <div className="activity-cals">{a.calories} kcal</div>}
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
