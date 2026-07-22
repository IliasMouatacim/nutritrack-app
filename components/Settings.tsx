"use client";

import React, { useState, useEffect } from 'react';
import { useNutriTrack } from '@/hooks/useNutriTrack';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { showToast } from '@/lib/utils';

export default function Settings() {
  const { currentSection, goals, saveGoals, userInfo, saveUserInfo, addCustomFood, resetAllData, forceSyncToCloud } = useNutriTrack();

  const [calcGender, setCalcGender] = useState(userInfo.gender);
  const [calcAge, setCalcAge] = useState(userInfo.age);
  const [calcWeight, setCalcWeight] = useState(userInfo.weight);
  const [calcHeight, setCalcHeight] = useState(userInfo.height);
  const [calcActivity, setCalcActivity] = useState(userInfo.activity);
  const [calcGoal, setCalcGoal] = useState(userInfo.goal);

  const [setCalories, setSetCalories] = useState(goals.calories.toString());
  const [setWater, setSetWater] = useState(goals.water.toString());
  const [setProtein, setSetProtein] = useState(goals.protein.toString());
  const [setCarbs, setSetCarbs] = useState(goals.carbs.toString());
  const [setFat, setSetFat] = useState(goals.fat.toString());

  const [customName, setCustomName] = useState('');
  const [customCals, setCustomCals] = useState('');
  const [customProtein, setCustomProtein] = useState('');
  const [customCarbs, setCustomCarbs] = useState('');
  const [customFat, setCustomFat] = useState('');

  useEffect(() => {
    setSetCalories(goals.calories.toString());
    setSetWater(goals.water.toString());
    setSetProtein(goals.protein.toString());
    setSetCarbs(goals.carbs.toString());
    setSetFat(goals.fat.toString());
  }, [goals]);

  useEffect(() => {
    setCalcGender(userInfo.gender);
    setCalcAge(userInfo.age);
    setCalcWeight(userInfo.weight);
    setCalcHeight(userInfo.height);
    setCalcActivity(userInfo.activity);
    setCalcGoal(userInfo.goal);
  }, [userInfo]);

  if (currentSection !== 'settings') return null;

  const handleCalculate = () => {
    const age = parseInt(calcAge);
    const weight = parseFloat(calcWeight);
    const height = parseFloat(calcHeight);
    const activity = parseFloat(calcActivity);
    
    if (!age || !weight || !height) {
      showToast('⚠️', 'Please fill in all calculator fields');
      return;
    }

    let bmr = 0;
    if (calcGender === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    let tdee = bmr * activity;
    
    if (calcGoal === 'lose') tdee -= 500;
    if (calcGoal === 'build') tdee += 300;
    if (tdee < 1200) tdee = 1200; 

    let proteinMultiplier = 1.6;
    if (calcGoal === 'lose') {
      proteinMultiplier = activity > 1.5 ? 2.2 : 2.0;
    } else if (calcGoal === 'build') {
      proteinMultiplier = activity > 1.5 ? 2.0 : 1.8;
    } else {
      proteinMultiplier = activity > 1.5 ? 1.8 : 1.6;
    }

    const protein = Math.round(weight * proteinMultiplier);
    const fatCalories = tdee * 0.25;
    const fat = Math.round(fatCalories / 9);
    const remainingCalories = tdee - (protein * 4) - fatCalories;
    const carbs = Math.round(remainingCalories / 4);
    const water = Math.round((weight * 35) / 250); 

    setSetCalories(Math.round(tdee).toString());
    setSetProtein(protein.toString());
    setSetFat(fat.toString());
    setSetCarbs(carbs.toString());
    setSetWater(water.toString());

    // Save user info
    saveUserInfo({
      gender: calcGender,
      age: calcAge,
      weight: calcWeight,
      height: calcHeight,
      activity: calcActivity,
      goal: calcGoal
    });

    // Also auto-save goals
    saveGoals({
      calories: Math.round(tdee),
      water: water,
      protein: protein,
      carbs: carbs,
      fat: fat
    });

    showToast('✨', 'Goals calculated & saved successfully!');
  };

  const handleSaveGoals = () => {
    saveGoals({
      calories: parseInt(setCalories) || 2000,
      water: parseInt(setWater) || 8,
      protein: parseInt(setProtein) || 150,
      carbs: parseInt(setCarbs) || 250,
      fat: parseInt(setFat) || 65
    });
    showToast('✅', 'Goals saved successfully');
  };

  const handleAddCustom = () => {
    if (!customName) {
      showToast('⚠️', 'Please enter a food name');
      return;
    }

    addCustomFood({
      id: Date.now(),
      name: customName,
      category: 'Custom',
      calories: parseFloat(customCals) || 0,
      protein: parseFloat(customProtein) || 0,
      carbs: parseFloat(customCarbs) || 0,
      fat: parseFloat(customFat) || 0,
      serving: 'per 100g'
    });

    showToast('⭐', `${customName} added to custom foods`);
    setCustomName('');
    setCustomCals('');
    setCustomProtein('');
    setCustomCarbs('');
    setCustomFat('');
  };

  const handleResetData = () => {
    if (window.confirm("Are you sure you want to clear all data? This cannot be undone.")) {
      resetAllData();
      showToast('🗑️', 'All data cleared');
    }
  };

  const handleLogout = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
    } catch (e) {
      console.error(e);
    }
  };

  const handleForceSync = async () => {
    const success = await forceSyncToCloud();
    if (success) {
      showToast('☁️', 'Local data synced to cloud perfectly!');
    } else {
      showToast('⚠️', 'Sync failed. Make sure you are logged in.');
    }
  };

  return (
    <section className="page-section active">
      <div className="section-header">
        <h2>Settings</h2>
        <p className="subtitle">Configure your goals and preferences</p>
        <button onClick={handleLogout} className="btn" style={{ background: 'rgba(255, 107, 107, 0.1)', color: 'var(--accent-coral)', marginTop: '1rem' }}>
          Sign Out
        </button>
      </div>

      <div className="settings-grid">
        
        <div className="settings-card" style={{ gridColumn: '1 / -1' }}>
          <h3>✨ Auto-Calculate Goals</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginBottom: '20px' }}>
            Enter your details below to calculate personalized daily calories and macros based on the Mifflin-St Jeor equation.
          </p>

          <div className="custom-food-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' }}>
            <div className="form-group">
              <label>Gender</label>
              <select className="setting-input" style={{ padding: '10px', background: 'var(--bg-input)' }} value={calcGender} onChange={e => setCalcGender(e.target.value)}>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div className="form-group">
              <label>Age (years)</label>
              <input type="number" placeholder="e.g. 25" min="10" max="120" value={calcAge} onChange={e => setCalcAge(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Weight (kg)</label>
              <input type="number" placeholder="e.g. 70" min="30" max="300" step="any" value={calcWeight} onChange={e => setCalcWeight(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Height (cm)</label>
              <input type="number" placeholder="e.g. 175" min="100" max="250" value={calcHeight} onChange={e => setCalcHeight(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Activity Level</label>
              <select className="setting-input" style={{ padding: '10px', background: 'var(--bg-input)' }} value={calcActivity} onChange={e => setCalcActivity(e.target.value)}>
                <option value="1.2">Sedentary (office job)</option>
                <option value="1.375">Lightly active (1-3 days/week)</option>
                <option value="1.55">Moderately active (3-5 days/week)</option>
                <option value="1.725">Very active (6-7 days/week)</option>
                <option value="1.9">Extra active (physical job)</option>
              </select>
            </div>
            <div className="form-group">
              <label>Goal</label>
              <select className="setting-input" style={{ padding: '10px', background: 'var(--bg-input)' }} value={calcGoal} onChange={e => setCalcGoal(e.target.value)}>
                <option value="lose">Lose Weight (-500 kcal)</option>
                <option value="maintain">Maintain Weight</option>
                <option value="build">Build Muscle (+300 kcal)</option>
              </select>
            </div>
          </div>

          <button className="btn btn-secondary" style={{ marginTop: '16px', width: 'auto' }} onClick={handleCalculate}>
            🧮 Calculate & Apply Below
          </button>
        </div>

        <div className="settings-card">
          <h3>🎯 Daily Goals</h3>

          <div className="setting-row">
            <div className="setting-info">
              <div className="setting-label">Calorie Goal</div>
              <div className="setting-desc">Daily calorie intake target</div>
            </div>
            <input type="number" className="setting-input" min="500" max="10000" value={setCalories} onChange={e => setSetCalories(e.target.value)} /> 
          </div>

          <div className="setting-row">
            <div className="setting-info">
              <div className="setting-label">Water Goal</div>
              <div className="setting-desc">Daily glasses of water (250ml each)</div>
            </div>
            <input type="number" className="setting-input" min="1" max="20" value={setWater} onChange={e => setSetWater(e.target.value)} />
          </div>

          <div className="setting-row">
            <div className="setting-info">
              <div className="setting-label">Protein Goal</div>
              <div className="setting-desc">Daily protein target in grams</div>
            </div>
            <input type="number" className="setting-input" min="10" max="500" value={setProtein} onChange={e => setSetProtein(e.target.value)} />
          </div>

          <div className="setting-row">
            <div className="setting-info">
              <div className="setting-label">Carbs Goal</div>
              <div className="setting-desc">Daily carbohydrate target in grams</div>
            </div>
            <input type="number" className="setting-input" min="10" max="800" value={setCarbs} onChange={e => setSetCarbs(e.target.value)} />
          </div>

          <div className="setting-row">
            <div className="setting-info">
              <div className="setting-label">Fat Goal</div>
              <div className="setting-desc">Daily fat target in grams</div>
            </div>
            <input type="number" className="setting-input" min="10" max="300" value={setFat} onChange={e => setSetFat(e.target.value)} />
          </div>

          <button className="btn btn-primary btn-save-settings" onClick={handleSaveGoals}>
            ✅ Save Goals
          </button>
        </div>

        <div className="settings-card">
          <h3>⭐ Add Custom Food</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginBottom: '20px' }}>
            Add your own foods to the database. Values are per 100g.
          </p>

          <div className="custom-food-form">
            <div className="form-group">
              <label>Food Name</label>
              <input type="text" placeholder="e.g. Homemade Granola" value={customName} onChange={e => setCustomName(e.target.value)} />
            </div>

            <div className="custom-food-grid">
              <div className="form-group">
                <label>Calories</label>
                <input type="number" placeholder="kcal" value={customCals} onChange={e => setCustomCals(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Protein (g)</label>
                <input type="number" placeholder="grams" value={customProtein} onChange={e => setCustomProtein(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Carbs (g)</label>
                <input type="number" placeholder="grams" value={customCarbs} onChange={e => setCustomCarbs(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Fat (g)</label>
                <input type="number" placeholder="grams" value={customFat} onChange={e => setCustomFat(e.target.value)} />
              </div>
            </div>

            <button className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }} onClick={handleAddCustom}>
              ⭐ Add to Database
            </button>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border-subtle)', margin: '24px 0' }} />

          <h3 style={{ marginBottom: '16px' }}>☁️ Cloud Sync</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginBottom: '16px' }}>
            If you added meals or weight data before logging in, click here to push it to your account so you can see it on your phone.
          </p>
          <button className="btn btn-secondary" onClick={handleForceSync} style={{ marginBottom: '24px' }}>
            ☁️ Sync Local Data to Cloud
          </button>

          <h3 style={{ marginBottom: '16px' }}>🗑️ Data Management</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginBottom: '16px' }}>
            Clear all tracked data including meals, water, groceries, and custom foods.
          </p>
          <button className="btn-reset" onClick={handleResetData}>
            🗑️ Clear All Data
          </button>
        </div>
      </div>
    </section>
  );
}
