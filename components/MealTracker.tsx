"use client";

import React, { useState } from 'react';
import { useNutriTrack, FoodItem } from '@/hooks/useNutriTrack';
import { showToast } from '@/lib/utils';

const MEAL_TABS = [
  { id: 'breakfast', label: '🌅 Breakfast' },
  { id: 'lunch', label: '☀️ Lunch' },
  { id: 'dinner', label: '🌙 Dinner' },
  { id: 'snacks', label: '🍿 Snacks' },
];

export default function MealTracker() {
  const { 
    currentSection, 
    currentMealTab, 
    setCurrentMealTab, 
    getDateKey, 
    meals, 
    groceries,
    currentBowl,
    addFoodToBowl,
    removeBowlItem,
    clearBowl,
    logBowlToMeal,
    removeMealItem
  } = useNutriTrack();

  const [searchQuery, setSearchQuery] = useState('');
  const [modalFood, setModalFood] = useState<FoodItem | null>(null);
  const [modalAmount, setModalAmount] = useState<number>(100);

  if (currentSection !== 'meals') return null;

  const dateKey = getDateKey();
  const dayMeals = meals[dateKey] || {};
  const currentItems = dayMeals[currentMealTab] || [];

  // Tab Totals
  const getTabCals = (tab: string) => {
    return (dayMeals[tab] || []).reduce((sum, i) => sum + (i.calories || 0), 0);
  };

  // Summary Totals
  let totalCals = 0, totalProtein = 0, totalCarbs = 0, totalFat = 0;
  currentItems.forEach(item => {
    totalCals += item.calories || 0;
    totalProtein += item.protein || 0;
    totalCarbs += item.carbs || 0;
    totalFat += item.fat || 0;
  });

  // Bowl Totals
  let bowlCals = 0, bowlProtein = 0, bowlCarbs = 0, bowlFat = 0;
  currentBowl.forEach(item => {
    bowlCals += item.calories || 0;
    bowlProtein += item.protein || 0;
    bowlCarbs += item.carbs || 0;
    bowlFat += item.fat || 0;
  });

  // Search Results
  const filteredGroceries = searchQuery 
    ? groceries.filter(g => g.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : groceries;

  const handleOpenModal = (food: FoodItem) => {
    setModalFood(food);
    setModalAmount(100);
  };

  const handleConfirmModal = () => {
    if (modalFood && modalAmount > 0) {
      addFoodToBowl(modalFood, modalAmount);
      showToast('🥣', `${modalFood.name} added to your bowl`);
      setModalFood(null);
    }
  };

  const getEmoji = (tab: string) => {
    const emojis: Record<string, string> = { breakfast: '🌅', lunch: '☀️', dinner: '🌙', snacks: '🍿' };
    return emojis[tab] || '🍽️';
  };

  const getFoodEmoji = (category: string) => {
    const emojis: Record<string, string> = {
      'Fruits': '🍎', 'Vegetables': '🥦', 'Grains': '🌾', 'Protein': '🥩',
      'Dairy & Eggs': '🥚', 'Nuts & Seeds': '🥜', 'Beverages': '🥤',
      'Snacks': '🍪', 'Fast Food': '🍔', 'Condiments': '🧂',
      'Breakfast': '🥞', 'Custom': '⭐'
    };
    return emojis[category] || '🍽️';
  };

  return (
    <section className="page-section active">
      <div className="section-header">
        <h2>Meal Tracker</h2>
        <p className="subtitle">Pick from your pantry — enter grams and we'll calculate the rest</p>
      </div>

      <div className="meal-tabs">
        {MEAL_TABS.map(tab => (
          <button 
            key={tab.id}
            className={`meal-tab ${currentMealTab === tab.id ? 'active' : ''}`}
            onClick={() => setCurrentMealTab(tab.id)}
          >
            {tab.label} <span className="tab-cal">{Math.round(getTabCals(tab.id))}</span>
          </button>
        ))}
      </div>

      <div className="meal-summary-row">
        <div className="meal-summary-item">
          <div className="ms-value cal">{Math.round(totalCals)}</div>
          <div className="ms-label">Calories</div>
        </div>
        <div className="meal-summary-item">
          <div className="ms-value prot">{Math.round(totalProtein)}g</div>
          <div className="ms-label">Protein</div>
        </div>
        <div className="meal-summary-item">
          <div className="ms-value carb">{Math.round(totalCarbs)}g</div>
          <div className="ms-label">Carbs</div>
        </div>
        <div className="meal-summary-item">
          <div className="ms-value fats">{Math.round(totalFat)}g</div>
          <div className="ms-label">Fat</div>
        </div>
      </div>

      <div className="meal-content-area" style={{ gridTemplateColumns: '1fr 360px 300px' }}>
        
        {/* Logged Items */}
        <div className="meal-list">
          {currentItems.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">{getEmoji(currentMealTab)}</div>
              <p>No {currentMealTab} items logged yet</p>
              <p style={{ fontSize: '0.82rem' }}>Build a meal using the bowl builder →</p>
            </div>
          ) : (
            currentItems.map((item, idx) => (
              <div className="meal-food-item" key={idx}>
                <div className={`meal-food-icon ${currentMealTab}`}>
                  {getFoodEmoji(item.category)}
                </div>
                <div className="meal-food-info">
                  <div className="meal-food-name">{item.name}</div>
                  <div className="meal-food-portion">{item.amount}g · {item.servingNote || ''}</div>
                </div>
                <div className="meal-food-macros">
                  <span><span className="dot protein"></span>{Math.round(item.protein)}g P</span>
                  <span><span className="dot carbs"></span>{Math.round(item.carbs)}g C</span>
                  <span><span className="dot fat"></span>{Math.round(item.fat)}g F</span>
                </div>
                <div className="meal-food-cals">
                  {Math.round(item.calories)} <small>kcal</small>
                </div>
                <button className="meal-food-delete" onClick={() => removeMealItem(currentMealTab, idx)} title="Remove">✕</button>
              </div>
            ))
          )}
        </div>

        {/* Bowl Builder */}
        <div className="add-food-panel">
          <h3>🥣 Meal Bowl Builder</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginBottom: '12px' }}>
            Combine multiple items, set grams for each, then log the whole meal.
          </p>

          <div className="bowl-items">
            {currentBowl.length === 0 ? (
              <div className="empty-state" style={{ padding: '20px' }}>
                <div className="empty-icon" style={{ fontSize: '2rem' }}>🥣</div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-tertiary)' }}>Your bowl is empty.<br/>Add items from the pantry →</p>
              </div>
            ) : (
              currentBowl.map((item, idx) => (
                <div className="bowl-item" key={idx}>
                  <div className="bowl-item-info">
                    <div className="bowl-item-name">{item.name}</div>
                    <div className="bowl-item-portion">{item.amount}g</div>
                  </div>
                  <div className="bowl-item-cals">{Math.round(item.calories)}</div>
                  <button className="bowl-item-delete" onClick={() => removeBowlItem(idx)} title="Remove">✕</button>
                </div>
              ))
            )}
          </div>

          {currentBowl.length > 0 && (
            <>
              <div className="bowl-totals" style={{ display: 'flex' }}>
                <div className="bowl-total-row">
                  <span>🔥 Calories</span>
                  <span className="bowl-val cal">{Math.round(bowlCals)}</span>
                </div>
                <div className="bowl-total-row">
                  <span>💪 Protein</span>
                  <span className="bowl-val prot">{Math.round(bowlProtein)}g</span>
                </div>
                <div className="bowl-total-row">
                  <span>🌾 Carbs</span>
                  <span className="bowl-val carb">{Math.round(bowlCarbs)}g</span>
                </div>
                <div className="bowl-total-row">
                  <span>🧈 Fat</span>
                  <span className="bowl-val fats">{Math.round(bowlFat)}g</span>
                </div>
              </div>

              <div className="bowl-actions" style={{ display: 'flex' }}>
                <button className="btn btn-primary" style={{ flex: 2 }} onClick={() => {
                  logBowlToMeal();
                  showToast('🍽️', `Meal bowl logged to ${currentMealTab}`);
                }}>
                  ✅ Log This Meal
                </button>
                <button className="btn btn-secondary" style={{ flex: 1 }} onClick={clearBowl}>
                  🗑️ Clear
                </button>
              </div>
            </>
          )}
        </div>

        {/* Pantry Search */}
        <div className="add-food-panel">
          <h3>🛒 Add From Pantry</h3>
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input 
              type="text" 
              placeholder="Search your pantry..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="food-results">
            {groceries.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-tertiary)', fontSize: '0.82rem' }}>
                Your pantry is empty.<br/>Add items in the <strong>Groceries</strong> section first.
              </div>
            ) : filteredGroceries.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-tertiary)', fontSize: '0.82rem' }}>
                No matching items in your pantry
              </div>
            ) : (
              filteredGroceries.map(food => (
                <div className="food-result-item" key={food.id}>
                  <div className="food-result-info">
                    <div className="food-result-name">🛒 {food.name}</div>
                    <div className="food-result-serving">{food.calories} kcal · {food.protein}g P · {food.carbs}g C · {food.fat}g F / 100g</div>
                  </div>
                  <div className="food-result-cals">{food.calories}</div>
                  <button className="food-result-add" onClick={() => handleOpenModal(food)} title="Add to bowl">+</button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalFood && (
        <div className="modal-overlay active" onClick={(e) => {
          if ((e.target as HTMLElement).classList.contains('modal-overlay')) setModalFood(null);
        }}>
          <div className="modal">
            <h3>Add Food to Meal</h3>
            <div className="modal-food-info">
              <span className="food-emoji">🛒</span>
              <div>
                <div className="food-name">{modalFood.name}</div>
                <div className="food-cals-per">{modalFood.calories} kcal per 100g</div>
              </div>
            </div>
            
            <div className="form-group">
              <label>Amount (grams)</label>
              <input 
                type="number" 
                value={modalAmount} 
                onChange={(e) => setModalAmount(Number(e.target.value) || 0)} 
                min="1" 
                max="5000" 
                step="10"
              />
            </div>

            <div className="modal-cal-preview">
              <div className="cal-num">{Math.round(modalFood.calories * (modalAmount / 100))}</div>
              <div className="cal-label">estimated calories</div>
            </div>

            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setModalFood(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleConfirmModal}>➕ Add to Bowl</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
