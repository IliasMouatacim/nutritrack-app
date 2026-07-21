"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// --- Types ---
export type GoalState = {
  calories: number;
  water: number;
  protein: number;
  carbs: number;
  fat: number;
};

export type UserInfo = {
  gender: string;
  age: string;
  weight: string;
  height: string;
  activity: string;
  goal: string;
};

export type FoodItem = {
  id: number;
  name: string;
  category: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  serving?: string;
  amount?: number;
  servingNote?: string;
  addedAt?: string;
};

export type Activity = {
  type: 'meal' | 'water' | 'grocery';
  name: string;
  detail: string | null;
  calories: number | null;
  time: string;
  date: string;
};

export type WaterLogEntry = {
  amount: number;
  time: string;
};

export type NutriTrackContextType = {
  currentSection: string;
  setCurrentSection: (s: string) => void;
  currentDate: Date;
  setCurrentDate: (d: Date) => void;
  currentMealTab: string;
  setCurrentMealTab: (t: string) => void;
  goals: GoalState;
  setGoals: (g: GoalState) => void;
  saveGoals: (g: GoalState) => void;
  userInfo: UserInfo;
  saveUserInfo: (info: UserInfo) => void;
  meals: Record<string, Record<string, FoodItem[]>>;
  groceries: FoodItem[];
  waterLog: Record<string, WaterLogEntry[]>;
  activityLog: Activity[];
  customFoods: FoodItem[];
  currentBowl: FoodItem[];
  getDateKey: (date?: Date) => string;
  addActivity: (type: Activity['type'], name: string, detail: string | null, calories: number | null) => void;
  addFoodToBowl: (food: FoodItem, amount: number) => void;
  removeBowlItem: (idx: number) => void;
  clearBowl: () => void;
  logBowlToMeal: () => void;
  removeMealItem: (meal: string, idx: number) => void;
  addWater: (amount: number) => void;
  addGrocery: (item: FoodItem) => void;
  removeGroceryItem: (idx: number) => void;
  addCustomFood: (food: FoodItem) => void;
  resetAllData: () => void;
};

const NutriTrackContext = createContext<NutriTrackContextType | undefined>(undefined);

export function NutriTrackProvider({ children }: { children: ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);
  
  const [currentSection, setCurrentSection] = useState('dashboard');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentMealTab, setCurrentMealTab] = useState('breakfast');
  
  const [goals, setGoals] = useState<GoalState>({ calories: 2000, water: 8, protein: 150, carbs: 250, fat: 65 });
  const [userInfo, setUserInfo] = useState<UserInfo>({ gender: 'male', age: '', weight: '', height: '', activity: '1.55', goal: 'maintain' });
  const [meals, setMeals] = useState<Record<string, Record<string, FoodItem[]>>>({});
  const [groceries, setGroceries] = useState<FoodItem[]>([]);
  const [waterLog, setWaterLog] = useState<Record<string, WaterLogEntry[]>>({});
  const [activityLog, setActivityLog] = useState<Activity[]>([]);
  const [customFoods, setCustomFoods] = useState<FoodItem[]>([]);
  const [currentBowl, setCurrentBowl] = useState<FoodItem[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const load = (key: string, fallback: any) => {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : fallback;
      };
      setGoals(load('nutritrack_goals', { calories: 2000, water: 8, protein: 150, carbs: 250, fat: 65 }));
      setUserInfo(load('nutritrack_user_info', { gender: 'male', age: '', weight: '', height: '', activity: '1.55', goal: 'maintain' }));
      setMeals(load('nutritrack_meals', {}));
      setGroceries(load('nutritrack_groceries', []));
      setWaterLog(load('nutritrack_water', {}));
      setActivityLog(load('nutritrack_activity', []));
      setCustomFoods(load('nutritrack_custom_foods', []));
    } catch (e) {
      console.error("Failed to load local storage", e);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage when state changes
  const saveState = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const getDateKey = (date?: Date) => {
    const d = date || currentDate;
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const addActivity = (type: Activity['type'], name: string, detail: string | null, calories: number | null) => {
    const now = new Date();
    const time = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    const newActivity = { type, name, detail, calories, time, date: getDateKey(now) };
    
    setActivityLog(prev => {
      let next = [...prev, newActivity];
      if (next.length > 50) next = next.slice(-50);
      saveState('nutritrack_activity', next);
      return next;
    });
  };

  const saveGoals = (g: GoalState) => {
    setGoals(g);
    saveState('nutritrack_goals', g);
  };

  const saveUserInfo = (info: UserInfo) => {
    setUserInfo(info);
    saveState('nutritrack_user_info', info);
  };

  const addFoodToBowl = (food: FoodItem, amount: number) => {
    const ratio = amount / 100;
    const entry = {
      ...food,
      amount: amount,
      servingNote: `${amount}g`,
      calories: food.calories * ratio,
      protein: food.protein * ratio,
      carbs: food.carbs * ratio,
      fat: food.fat * ratio,
      addedAt: new Date().toISOString()
    };
    setCurrentBowl(prev => [...prev, entry]);
  };

  const removeBowlItem = (idx: number) => {
    setCurrentBowl(prev => {
      const next = [...prev];
      next.splice(idx, 1);
      return next;
    });
  };

  const clearBowl = () => setCurrentBowl([]);

  const logBowlToMeal = () => {
    if (currentBowl.length === 0) return;
    
    const dateKey = getDateKey();
    let totalCals = 0;
    
    setMeals(prev => {
      const next = { ...prev };
      if (!next[dateKey]) next[dateKey] = {};
      if (!next[dateKey][currentMealTab]) next[dateKey][currentMealTab] = [];
      
      currentBowl.forEach(item => {
        next[dateKey][currentMealTab].push(item);
        totalCals += item.calories;
      });
      
      saveState('nutritrack_meals', next);
      return next;
    });

    addActivity('meal', 'Meal Bowl', `logged to ${currentMealTab}`, Math.round(totalCals));
    setCurrentBowl([]);
  };

  const removeMealItem = (meal: string, idx: number) => {
    const dateKey = getDateKey();
    setMeals(prev => {
      const next = { ...prev };
      if (next[dateKey] && next[dateKey][meal]) {
        next[dateKey][meal].splice(idx, 1);
        saveState('nutritrack_meals', next);
      }
      return next;
    });
  };

  const addWater = (amount: number) => {
    const dateKey = getDateKey();
    setWaterLog(prev => {
      const next = { ...prev };
      if (!next[dateKey]) next[dateKey] = [];
      next[dateKey].push({
        amount,
        time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
      });
      saveState('nutritrack_water', next);
      return next;
    });
    addActivity('water', `${amount}ml water`, 'logged', null);
  };

  const addGrocery = (item: FoodItem) => {
    setGroceries(prev => {
      const next = [...prev, item];
      saveState('nutritrack_groceries', next);
      return next;
    });
    addActivity('grocery', item.name, 'added to pantry', item.calories);
  };

  const removeGroceryItem = (idx: number) => {
    setGroceries(prev => {
      const next = [...prev];
      next.splice(idx, 1);
      saveState('nutritrack_groceries', next);
      return next;
    });
  };

  const addCustomFood = (item: FoodItem) => {
    setCustomFoods(prev => {
      const next = [...prev, item];
      saveState('nutritrack_custom_foods', next);
      return next;
    });
  };

  const resetAllData = () => {
    localStorage.removeItem('nutritrack_meals');
    localStorage.removeItem('nutritrack_water');
    localStorage.removeItem('nutritrack_groceries');
    localStorage.removeItem('nutritrack_activity');
    localStorage.removeItem('nutritrack_custom_foods');
    
    setMeals({});
    setWaterLog({});
    setGroceries([]);
    setActivityLog([]);
    setCustomFoods([]);
    setCurrentBowl([]);
  };

  // Clear bowl on date or tab change
  useEffect(() => {
    setCurrentBowl([]);
  }, [currentDate, currentMealTab]);

  return (
    <NutriTrackContext.Provider value={{
      currentSection, setCurrentSection,
      currentDate, setCurrentDate,
      currentMealTab, setCurrentMealTab,
      goals, setGoals, saveGoals,
      userInfo, saveUserInfo,
      meals, groceries, waterLog, activityLog, customFoods, currentBowl,
      getDateKey, addActivity, addFoodToBowl, removeBowlItem, clearBowl, logBowlToMeal,
      removeMealItem, addWater, addGrocery, removeGroceryItem, addCustomFood, resetAllData
    }}>
      {children}
    </NutriTrackContext.Provider>
  );
}

export function useNutriTrack() {
  const context = useContext(NutriTrackContext);
  if (context === undefined) {
    throw new Error('useNutriTrack must be used within a NutriTrackProvider');
  }
  return context;
}
