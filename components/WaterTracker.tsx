"use client";

import React, { useState } from 'react';
import { useNutriTrack } from '@/hooks/useNutriTrack';
import { showToast } from '@/lib/utils';

export default function WaterTracker() {
  const { currentSection, getDateKey, waterLog, goals, addWater } = useNutriTrack();
  const [customAmount, setCustomAmount] = useState('');

  if (currentSection !== 'water') return null;

  const dateKey = getDateKey();
  const logs = waterLog[dateKey] || [];
  
  const totalMl = logs.reduce((sum, w) => sum + w.amount, 0);
  const glasses = Math.round((totalMl / 250) * 10) / 10;
  const goalMl = goals.water * 250;
  const pct = Math.min(100, (totalMl / goalMl) * 100);

  const handleCustomAdd = () => {
    const amt = parseInt(customAmount);
    if (amt && amt > 0) {
      addWater(amt);
      showToast('💧', `${amt}ml water logged`);
      setCustomAmount('');
    }
  };

  const handleQuickAdd = (amt: number) => {
    addWater(amt);
    showToast('💧', `${amt}ml water logged`);
  };

  return (
    <section className="page-section active">
      <div className="section-header">
        <h2>Water Tracker</h2>
        <p className="subtitle">Stay hydrated — track every glass</p>
      </div>

      <div className="water-tracker-layout">
        <div className="water-visual-card">
          <div className="water-bottle">
            <div className="water-fill" style={{ height: `${pct}%` }}></div>
          </div>
          <div className="water-amount">
            <span>{totalMl}</span><small> ml</small>
          </div>
          <div className="water-goal">{glasses} / {goals.water} glasses</div>
        </div>

        <div className="water-actions-card">
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '20px' }}>⚡ Quick Add</h3>

          <div className="water-quick-add">
            <button className="water-btn" onClick={() => handleQuickAdd(250)}>
              <span className="water-btn-icon">🥛</span>
              <span>1 Glass</span>
              <span className="water-btn-amount">250ml</span>
            </button>
            <button className="water-btn" onClick={() => handleQuickAdd(500)}>
              <span className="water-btn-icon">🍶</span>
              <span>2 Glasses</span>
              <span className="water-btn-amount">500ml</span>
            </button>
            <button className="water-btn" onClick={() => handleQuickAdd(750)}>
              <span className="water-btn-icon">🫗</span>
              <span>Bottle</span>
              <span className="water-btn-amount">750ml</span>
            </button>
            <button className="water-btn" onClick={() => handleQuickAdd(1000)}>
              <span className="water-btn-icon">🏺</span>
              <span>Large Bottle</span>
              <span className="water-btn-amount">1000ml</span>
            </button>
          </div>

          <div className="water-custom">
            <h4>Custom Amount</h4>
            <div className="water-custom-input">
              <input 
                type="number" 
                placeholder="Enter ml..." 
                min="1" 
                max="5000"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
              />
              <button className="btn-add" onClick={handleCustomAdd}>💧 Add</button>
            </div>
          </div>

          <div className="water-history">
            <h4>Today's Log</h4>
            <div className="water-history-list">
              {logs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '16px', color: 'var(--text-tertiary)', fontSize: '0.82rem' }}>
                  No water logged yet today
                </div>
              ) : (
                [...logs].reverse().map((w, i) => (
                  <div className="water-history-item" key={i}>
                    <span>💧</span>
                    <span className="wh-time">{w.time}</span>
                    <span className="wh-amount">{w.amount}ml</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
