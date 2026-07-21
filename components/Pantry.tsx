"use client";

import React, { useState } from 'react';
import { useNutriTrack, FoodItem } from '@/hooks/useNutriTrack';
import { showToast } from '@/lib/utils';

export default function Pantry() {
  const { currentSection, groceries, addGrocery, removeGroceryItem } = useNutriTrack();
  
  const [name, setName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');

  if (currentSection !== 'groceries') return null;

  const count = groceries.length;
  const avgP = count > 0 ? groceries.reduce((s, g) => s + g.protein, 0) / count : 0;
  const avgC = count > 0 ? groceries.reduce((s, g) => s + g.carbs, 0) / count : 0;
  const avgF = count > 0 ? groceries.reduce((s, g) => s + g.fat, 0) / count : 0;

  const handleAddGrocery = () => {
    const trimmedName = name.trim();
    const cals = parseFloat(calories) || 0;
    const p = parseFloat(protein) || 0;
    const c = parseFloat(carbs) || 0;
    const f = parseFloat(fat) || 0;

    if (!trimmedName) {
      showToast('⚠️', 'Please enter a product name');
      return;
    }

    if (cals === 0 && p === 0 && c === 0 && f === 0) {
      showToast('⚠️', 'Please enter at least one nutritional value');
      return;
    }

    const newItem: FoodItem = {
      id: Date.now(),
      name: trimmedName,
      category: 'Custom',
      calories: cals,
      protein: p,
      carbs: c,
      fat: f,
      serving: 'per 100g'
    };

    addGrocery(newItem);
    showToast('🛒', `${trimmedName} added to your pantry`);

    setName('');
    setCalories('');
    setProtein('');
    setCarbs('');
    setFat('');
  };

  const handleRemove = (idx: number, foodName: string) => {
    removeGroceryItem(idx);
    showToast('🗑️', `${foodName} removed from pantry`);
  };

  return (
    <section className="page-section active">
      <div className="section-header">
        <h2>My Pantry</h2>
        <p className="subtitle">Add items you bought — enter nutrition info from the label (per 100g)</p>
      </div>

      <div className="grocery-layout">
        <div className="grocery-list-container">
          <div className="grocery-summary">
            <div className="grocery-summary-item">
              <div className="gs-value cal">{count}</div>
              <div className="gs-label">Total Items</div>
            </div>
            <div className="grocery-summary-item">
              <div className="gs-value prot">{count > 0 ? `${Math.round(avgP)}g` : '—'}</div>
              <div className="gs-label">Avg Protein</div>
            </div>
            <div className="grocery-summary-item">
              <div className="gs-value carb">{count > 0 ? `${Math.round(avgC)}g` : '—'}</div>
              <div className="gs-label">Avg Carbs</div>
            </div>
            <div className="grocery-summary-item">
              <div className="gs-value fats">{count > 0 ? `${Math.round(avgF)}g` : '—'}</div>
              <div className="gs-label">Avg Fat</div>
            </div>
          </div>

          <div className="grocery-items">
            {count === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🛒</div>
                <p>Your pantry is empty</p>
                <p style={{ fontSize: '0.82rem' }}>Add items you bought using the form →</p>
              </div>
            ) : (
              groceries.map((g, idx) => (
                <div className="grocery-item" key={g.id}>
                  <div className="gi-emoji">🛒</div>
                  <div className="gi-info">
                    <div className="gi-name">{g.name}</div>
                    <div className="gi-details">{g.calories} kcal · {g.protein}g P · {g.carbs}g C · {g.fat}g F per 100g</div>
                  </div>
                  <div className="gi-cals">{g.calories} <small>kcal/100g</small></div>
                  <button className="gi-delete" onClick={() => handleRemove(idx, g.name)} title="Remove">✕</button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="add-grocery-panel">
          <h3>➕ Add Grocery Item</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginBottom: '16px' }}>
            Enter the nutrition info from the product label. All values are <strong style={{ color: 'var(--accent-primary)' }}>per 100g</strong>.
          </p>

          <div className="form-group">
            <label>Product Name</label>
            <input 
              type="text" 
              placeholder="e.g. Oikos Greek Yogurt"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          <div className="custom-food-grid">
            <div className="form-group">
              <label>🔥 Calories</label>
              <input 
                type="number" 
                placeholder="kcal / 100g" 
                min="0" 
                step="any"
                value={calories}
                onChange={e => setCalories(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>💪 Protein (g)</label>
              <input 
                type="number" 
                placeholder="grams" 
                min="0" 
                step="any"
                value={protein}
                onChange={e => setProtein(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>🌾 Carbs (g)</label>
              <input 
                type="number" 
                placeholder="grams" 
                min="0" 
                step="any"
                value={carbs}
                onChange={e => setCarbs(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>🧈 Fat (g)</label>
              <input 
                type="number" 
                placeholder="grams" 
                min="0" 
                step="any"
                value={fat}
                onChange={e => setFat(e.target.value)}
              />
            </div>
          </div>

          <button className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }} onClick={handleAddGrocery}>
            🛒 Add to Pantry
          </button>
        </div>
      </div>
    </section>
  );
}
