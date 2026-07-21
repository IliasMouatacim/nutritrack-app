/* ═══════════════════════════════════════════════════════════════
   NutriTrack — Application Logic
   ═══════════════════════════════════════════════════════════════ */

class NutriTrack {
  constructor() {
    this.currentSection = 'dashboard';
    this.currentDate = new Date();
    this.currentMealTab = 'breakfast';
    this.foodSearchCategory = 'All';
    this.selectedFood = null;
    this.currentBowl = []; // Temp state for the bowl builder

    // Default goals
    this.goals = this.loadData('nutritrack_goals') || {
      calories: 2000,
      water: 8, // glasses
      protein: 150, // grams
      carbs: 250,
      fat: 65
    };

    // Data stores
    this.meals = this.loadData('nutritrack_meals') || {};
    this.groceries = this.loadData('nutritrack_groceries') || [];
    this.waterLog = this.loadData('nutritrack_water') || {};
    this.customFoods = this.loadData('nutritrack_custom_foods') || [];
    this.activityLog = this.loadData('nutritrack_activity') || [];

    this.init();
  }

  init() {
    this.bindNavigation();
    this.bindDateNav();
    this.bindMealTabs();
    this.bindFoodSearch();
    this.bindBowlControls();
    this.bindWaterControls();
    this.bindGroceryControls();
    this.bindModal();
    this.bindSettings();
    this.updateDateDisplay();
    this.renderDashboard();
    this.renderMeals();
    this.renderWater();
    this.renderGroceries();
    this.renderReports();
    this.renderSettings();
    this.updateSidebarDate();
  }

  // ─── Data Persistence ───
  loadData(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }

  saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  getDateKey(date) {
    const d = date || this.currentDate;
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  // ─── Navigation ───
  bindNavigation() {
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', () => {
        const section = item.dataset.section;
        this.switchSection(section);
      });
    });
  }

  switchSection(section) {
    this.currentSection = section;

    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.querySelector(`.nav-item[data-section="${section}"]`).classList.add('active');

    document.querySelectorAll('.page-section').forEach(s => {
      s.classList.remove('active');
      s.style.display = 'none';
    });

    const target = document.getElementById(`section-${section}`);
    if (target) {
      target.style.display = 'block';
      // Force reflow for animation
      void target.offsetHeight;
      target.classList.add('active');
    }

    // Refresh section data
    if (section === 'dashboard') this.renderDashboard();
    if (section === 'meals') this.renderMeals();
    if (section === 'water') this.renderWater();
    if (section === 'groceries') this.renderGroceries();
    if (section === 'reports') this.renderReports();
    if (section === 'settings') this.renderSettings();
  }

  // ─── Date Navigation ───
  bindDateNav() {
    document.getElementById('date-prev')?.addEventListener('click', () => {
      this.currentDate.setDate(this.currentDate.getDate() - 1);
      this.onDateChange();
    });

    document.getElementById('date-next')?.addEventListener('click', () => {
      this.currentDate.setDate(this.currentDate.getDate() + 1);
      this.onDateChange();
    });

    document.getElementById('date-today')?.addEventListener('click', () => {
      this.currentDate = new Date();
      this.onDateChange();
    });
  }

  onDateChange() {
    this.updateDateDisplay();
    this.currentBowl = []; // Clear bowl on date change
    this.renderBowl();
    this.renderDashboard();
    this.renderMeals();
    this.renderWater();
  }

  updateDateDisplay() {
    const el = document.getElementById('current-date');
    if (!el) return;
    const today = new Date();
    const isToday = this.getDateKey() === this.getDateKey(today);
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    el.textContent = isToday ? 'Today — ' + this.currentDate.toLocaleDateString('en-US', options)
      : this.currentDate.toLocaleDateString('en-US', options);
  }

  updateSidebarDate() {
    const el = document.getElementById('sidebar-date');
    if (el) {
      const options = { month: 'short', day: 'numeric', year: 'numeric' };
      el.textContent = new Date().toLocaleDateString('en-US', options);
    }
  }

  // ─── Dashboard ───
  renderDashboard() {
    const dateKey = this.getDateKey();
    const dayMeals = this.meals[dateKey] || {};
    const dayWater = this.waterLog[dateKey] || [];

    // Calculate totals
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
    const waterGlasses = Math.round(totalWater / 250 * 10) / 10;
    const remaining = Math.max(0, this.goals.calories - totalCals);

    // Update stat cards
    this.setText('stat-calories', Math.round(totalCals));
    this.setText('stat-calories-sub', `of ${this.goals.calories} kcal goal`);
    this.setText('stat-water', waterGlasses);
    this.setText('stat-water-sub', `of ${this.goals.water} glasses goal`);
    this.setText('stat-protein', Math.round(totalProtein) + 'g');
    this.setText('stat-protein-sub', `of ${this.goals.protein}g goal`);
    this.setText('stat-remaining', remaining);
    this.setText('stat-remaining-sub', remaining > 0 ? 'calories left today' : 'goal reached! 🎉');

    // Update progress rings
    this.updateProgressRing('cal-ring', totalCals / this.goals.calories);
    this.updateProgressRing('water-ring', waterGlasses / this.goals.water);

    // Update macros
    this.updateMacroDisplay('macro-protein', totalProtein, this.goals.protein);
    this.updateMacroDisplay('macro-carbs', totalCarbs, this.goals.carbs);
    this.updateMacroDisplay('macro-fat', totalFat, this.goals.fat);

    // Progress text
    this.setText('cal-ring-value', Math.round(totalCals));
    this.setText('cal-ring-pct', Math.min(100, Math.round(totalCals / this.goals.calories * 100)) + '%');
    this.setText('cal-progress-text', `${Math.round(totalCals)} / ${this.goals.calories} kcal`);

    this.setText('water-ring-value', waterGlasses);
    this.setText('water-ring-pct', Math.min(100, Math.round(waterGlasses / this.goals.water * 100)) + '%');
    this.setText('water-progress-text', `${waterGlasses} / ${this.goals.water} glasses`);

    // Activity feed
    this.renderActivityFeed();

    // Update mini progress bars
    const calBar = document.getElementById('cal-bar');
    if (calBar) calBar.style.width = Math.min(100, (totalCals / this.goals.calories) * 100) + '%';
    const waterBar = document.getElementById('water-bar');
    if (waterBar) waterBar.style.width = Math.min(100, (waterGlasses / this.goals.water) * 100) + '%';
    
    // Render the calorie chart which is now on the dashboard
    this.renderCalorieChart();
  }

  updateProgressRing(id, ratio) {
    const el = document.getElementById(id);
    if (!el) return;
    const r = el.getAttribute('r');
    const circumference = 2 * Math.PI * r;
    const offset = circumference - (Math.min(1, ratio) * circumference);
    el.style.strokeDasharray = circumference;
    el.style.strokeDashoffset = offset;
  }

  updateMacroDisplay(id, current, goal) {
    const ring = document.getElementById(id + '-ring');
    const valueEl = document.getElementById(id + '-value');
    const targetEl = document.getElementById(id + '-target');

    if (ring) {
      const r = ring.getAttribute('r');
      const circumference = 2 * Math.PI * r;
      const ratio = Math.min(1, current / goal);
      ring.style.strokeDasharray = circumference;
      ring.style.strokeDashoffset = circumference - (ratio * circumference);
    }

    if (valueEl) valueEl.textContent = Math.round(current) + 'g';
    if (targetEl) targetEl.textContent = `of ${goal}g`;
  }

  renderActivityFeed() {
    const container = document.getElementById('activity-feed');
    if (!container) return;

    // Get recent activities (last 5)
    const recent = [...this.activityLog].reverse().slice(0, 5);

    if (recent.length === 0) {
      container.innerHTML = `
        <div class="empty-state" style="padding: 24px;">
          <p style="color: var(--text-tertiary);">No activity yet today. Start tracking!</p>
        </div>`;
      return;
    }

    container.innerHTML = recent.map(a => `
      <div class="activity-item">
        <div class="activity-dot ${a.type}"></div>
        <div class="activity-text">
          <strong>${a.name}</strong> ${a.detail || ''}
        </div>
        <div class="activity-time">${a.time}</div>
        ${a.calories ? `<div class="activity-cals">${a.calories} kcal</div>` : ''}
      </div>
    `).join('');
  }

  addActivity(type, name, detail, calories) {
    const now = new Date();
    const time = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    this.activityLog.push({ type, name, detail, calories, time, date: this.getDateKey(now) });
    // Keep last 50
    if (this.activityLog.length > 50) this.activityLog = this.activityLog.slice(-50);
    this.saveData('nutritrack_activity', this.activityLog);
  }

  // ─── Meal Tracker ───
  bindMealTabs() {
    document.querySelectorAll('.meal-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        this.currentMealTab = tab.dataset.meal;
        document.querySelectorAll('.meal-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.currentBowl = []; // Clear bowl when switching tabs
        this.renderBowl();
        this.renderMeals();
      });
    });
  }

  renderMeals() {
    const dateKey = this.getDateKey();
    const dayMeals = this.meals[dateKey] || {};
    const mealItems = dayMeals[this.currentMealTab] || [];

    const container = document.getElementById('meal-items-list');
    if (!container) return;

    // Update meal tab calories
    ['breakfast', 'lunch', 'dinner', 'snacks'].forEach(meal => {
      const items = (dayMeals[meal] || []);
      const cals = items.reduce((sum, i) => sum + (i.calories || 0), 0);
      const el = document.getElementById(`tab-cal-${meal}`);
      if (el) el.textContent = cals > 0 ? `${Math.round(cals)}` : '0';
    });

    // Update meal summary
    let totalCals = 0, totalProtein = 0, totalCarbs = 0, totalFat = 0;
    const currentItems = dayMeals[this.currentMealTab] || [];
    currentItems.forEach(item => {
      totalCals += item.calories || 0;
      totalProtein += item.protein || 0;
      totalCarbs += item.carbs || 0;
      totalFat += item.fat || 0;
    });

    this.setText('meal-total-cal', Math.round(totalCals));
    this.setText('meal-total-protein', Math.round(totalProtein) + 'g');
    this.setText('meal-total-carbs', Math.round(totalCarbs) + 'g');
    this.setText('meal-total-fat', Math.round(totalFat) + 'g');

    if (mealItems.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">${this.getMealEmoji(this.currentMealTab)}</div>
          <p>No ${this.currentMealTab} items logged yet</p>
          <p style="font-size: 0.82rem;">Search and add foods from the panel →</p>
        </div>`;
      return;
    }

    container.innerHTML = mealItems.map((item, idx) => `
      <div class="meal-food-item">
        <div class="meal-food-icon ${this.currentMealTab}">
          ${this.getFoodEmoji(item.category)}
        </div>
        <div class="meal-food-info">
          <div class="meal-food-name">${item.name}</div>
          <div class="meal-food-portion">${item.amount}g · ${item.servingNote || item.serving || ''}</div>
        </div>
        <div class="meal-food-macros">
          <span><span class="dot protein"></span>${Math.round(item.protein)}g P</span>
          <span><span class="dot carbs"></span>${Math.round(item.carbs)}g C</span>
          <span><span class="dot fat"></span>${Math.round(item.fat)}g F</span>
        </div>
        <div class="meal-food-cals">
          ${Math.round(item.calories)} <small>kcal</small>
        </div>
        <button class="meal-food-delete" onclick="app.removeMealItem('${this.currentMealTab}', ${idx})" title="Remove">✕</button>
      </div>
    `).join('');
  }

  addFoodToBowl(food, amount) {
    const ratio = amount / 100;
    const entry = {
      id: food.id,
      name: food.name,
      category: food.category,
      serving: food.serving,
      amount: amount,
      servingNote: `${amount}g`,
      calories: food.calories * ratio,
      protein: food.protein * ratio,
      carbs: food.carbs * ratio,
      fat: food.fat * ratio,
      addedAt: new Date().toISOString()
    };

    this.currentBowl.push(entry);
    this.renderBowl();
    this.showToast('🥣', `${food.name} added to your bowl`);
  }

  // ─── Bowl Builder Logic ───
  bindBowlControls() {
    document.getElementById('bowl-log-btn')?.addEventListener('click', () => this.logBowlToMeal());
    document.getElementById('bowl-clear-btn')?.addEventListener('click', () => {
      this.currentBowl = [];
      this.renderBowl();
    });
  }

  removeBowlItem(idx) {
    this.currentBowl.splice(idx, 1);
    this.renderBowl();
  }

  renderBowl() {
    const container = document.getElementById('bowl-items');
    const totalsContainer = document.getElementById('bowl-totals');
    const actionsContainer = document.getElementById('bowl-actions');
    if (!container) return;

    if (this.currentBowl.length === 0) {
      container.innerHTML = `
        <div class="empty-state" style="padding: 20px;">
          <div class="empty-icon" style="font-size: 2rem;">🥣</div>
          <p style="font-size: 0.82rem; color: var(--text-tertiary);">Your bowl is empty.<br>Add items from the pantry →</p>
        </div>`;
      totalsContainer.style.display = 'none';
      actionsContainer.style.display = 'none';
      return;
    }

    // Render items
    container.innerHTML = this.currentBowl.map((item, idx) => `
      <div class="bowl-item">
        <div class="bowl-item-info">
          <div class="bowl-item-name">${item.name}</div>
          <div class="bowl-item-portion">${item.amount}g</div>
        </div>
        <div class="bowl-item-cals">${Math.round(item.calories)}</div>
        <button class="bowl-item-delete" onclick="app.removeBowlItem(${idx})" title="Remove">✕</button>
      </div>
    `).join('');

    // Calculate totals
    let totalCals = 0, totalProtein = 0, totalCarbs = 0, totalFat = 0;
    this.currentBowl.forEach(item => {
      totalCals += item.calories || 0;
      totalProtein += item.protein || 0;
      totalCarbs += item.carbs || 0;
      totalFat += item.fat || 0;
    });

    this.setText('bowl-total-cal', Math.round(totalCals));
    this.setText('bowl-total-protein', Math.round(totalProtein) + 'g');
    this.setText('bowl-total-carbs', Math.round(totalCarbs) + 'g');
    this.setText('bowl-total-fat', Math.round(totalFat) + 'g');

    totalsContainer.style.display = 'flex';
    actionsContainer.style.display = 'flex';
  }

  logBowlToMeal() {
    if (this.currentBowl.length === 0) return;

    const dateKey = this.getDateKey();
    if (!this.meals[dateKey]) this.meals[dateKey] = {};
    if (!this.meals[dateKey][this.currentMealTab]) this.meals[dateKey][this.currentMealTab] = [];

    let totalCals = 0;
    this.currentBowl.forEach(item => {
      this.meals[dateKey][this.currentMealTab].push(item);
      totalCals += item.calories;
    });

    this.saveData('nutritrack_meals', this.meals);
    this.addActivity('meal', 'Meal Bowl', `logged to ${this.currentMealTab}`, Math.round(totalCals));
    
    // Clear bowl and re-render
    this.currentBowl = [];
    this.renderBowl();
    this.renderMeals();
    this.renderDashboard();
    
    this.showToast('🍽️', `Meal bowl logged to ${this.currentMealTab}`);
  }

  removeMealItem(meal, idx) {
    const dateKey = this.getDateKey();
    if (this.meals[dateKey] && this.meals[dateKey][meal]) {
      const removed = this.meals[dateKey][meal].splice(idx, 1);
      if (removed.length) {
        this.saveData('nutritrack_meals', this.meals);
        this.renderMeals();
        this.renderDashboard();
        this.showToast('🗑️', `${removed[0].name} removed`);
      }
    }
  }

  getMealEmoji(meal) {
    const emojis = { breakfast: '🌅', lunch: '☀️', dinner: '🌙', snacks: '🍿' };
    return emojis[meal] || '🍽️';
  }

  getFoodEmoji(category) {
    const emojis = {
      'Fruits': '🍎', 'Vegetables': '🥦', 'Grains': '🌾', 'Protein': '🥩',
      'Dairy & Eggs': '🥚', 'Nuts & Seeds': '🥜', 'Beverages': '🥤',
      'Snacks': '🍪', 'Fast Food': '🍔', 'Condiments': '🧂',
      'Breakfast': '🥞', 'Custom': '⭐'
    };
    return emojis[category] || '🍽️';
  }

  // ─── Food Search (from Pantry) ───
  bindFoodSearch() {
    const searchInput = document.getElementById('food-search');
    if (searchInput) {
      searchInput.addEventListener('input', () => this.filterFoods());
    }

    // Initial render
    this.filterFoods();
  }

  filterFoods() {
    const query = (document.getElementById('food-search')?.value || '').toLowerCase();
    // Search from user's pantry (groceries) only
    let filtered = [...this.groceries];
    if (query) {
      filtered = filtered.filter(f => f.name.toLowerCase().includes(query));
    }

    const container = document.getElementById('food-results');
    if (!container) return;

    if (this.groceries.length === 0) {
      container.innerHTML = `<div style="text-align: center; padding: 20px; color: var(--text-tertiary); font-size: 0.82rem;">Your pantry is empty.<br>Add items in the <strong style="color: var(--accent-primary); cursor: pointer;" onclick="app.switchSection('groceries')">Groceries</strong> section first.</div>`;
      return;
    }

    if (filtered.length === 0) {
      container.innerHTML = `<div style="text-align: center; padding: 20px; color: var(--text-tertiary); font-size: 0.82rem;">No matching items in your pantry</div>`;
      return;
    }

    container.innerHTML = filtered.map(food => `
      <div class="food-result-item" data-food-id="${food.id}">
        <div class="food-result-info">
          <div class="food-result-name">🛒 ${food.name}</div>
          <div class="food-result-serving">${food.calories} kcal · ${food.protein}g P · ${food.carbs}g C · ${food.fat}g F / 100g</div>
        </div>
        <div class="food-result-cals">${food.calories}</div>
        <button class="food-result-add" onclick="app.openPortionModal(${food.id})" title="Add to meal">+</button>
      </div>
    `).join('');
  }

  // ─── Portion Modal ───
  bindModal() {
    document.getElementById('modal-overlay')?.addEventListener('click', (e) => {
      if (e.target.id === 'modal-overlay') this.closeModal();
    });

    document.getElementById('modal-cancel')?.addEventListener('click', () => this.closeModal());

    document.getElementById('modal-confirm')?.addEventListener('click', () => {
      if (this.selectedFood) {
        const amount = parseFloat(document.getElementById('portion-amount').value) || 100;
        this.addFoodToBowl(this.selectedFood, amount);
        this.closeModal();
      }
    });

    document.getElementById('portion-amount')?.addEventListener('input', () => {
      this.updatePortionPreview();
    });
  }

  openPortionModal(foodId) {
    // Search from pantry (groceries)
    this.selectedFood = this.groceries.find(f => f.id === foodId);
    if (!this.selectedFood) return;

    const modal = document.getElementById('modal-overlay');
    document.getElementById('modal-food-name').textContent = this.selectedFood.name;
    document.getElementById('modal-food-emoji').textContent = '🛒';
    document.getElementById('modal-food-cals-per').textContent = `${this.selectedFood.calories} kcal per 100g`;
    document.getElementById('portion-amount').value = 100;
    this.updatePortionPreview();
    modal.classList.add('active');
  }

  updatePortionPreview() {
    if (!this.selectedFood) return;
    const amount = parseFloat(document.getElementById('portion-amount').value) || 0;
    const ratio = amount / 100;
    const cals = Math.round(this.selectedFood.calories * ratio);
    document.getElementById('modal-cal-preview').textContent = cals;
  }

  closeModal() {
    document.getElementById('modal-overlay')?.classList.remove('active');
    this.selectedFood = null;
  }

  // ─── Water Tracker ───
  bindWaterControls() {
    document.querySelectorAll('.water-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const amount = parseInt(btn.dataset.amount);
        if (amount) this.addWater(amount);
      });
    });

    document.getElementById('water-custom-add')?.addEventListener('click', () => {
      const input = document.getElementById('water-custom-amount');
      const amount = parseInt(input?.value);
      if (amount && amount > 0) {
        this.addWater(amount);
        input.value = '';
      }
    });
  }

  addWater(amount) {
    const dateKey = this.getDateKey();
    if (!this.waterLog[dateKey]) this.waterLog[dateKey] = [];

    this.waterLog[dateKey].push({
      amount,
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    });

    this.saveData('nutritrack_water', this.waterLog);
    this.addActivity('water', `${amount}ml water`, 'logged', null);
    this.renderWater();
    this.renderDashboard();
    this.showToast('💧', `${amount}ml water logged`);
  }

  renderWater() {
    const dateKey = this.getDateKey();
    const logs = this.waterLog[dateKey] || [];
    const totalMl = logs.reduce((sum, w) => sum + w.amount, 0);
    const glasses = Math.round(totalMl / 250 * 10) / 10;
    const goalMl = this.goals.water * 250;
    const pct = Math.min(100, (totalMl / goalMl) * 100);

    // Update visual
    this.setText('water-total-amount', totalMl);
    this.setText('water-glasses', `${glasses} / ${this.goals.water} glasses`);

    const fill = document.getElementById('water-fill-level');
    if (fill) fill.style.height = pct + '%';

    // Water history
    const historyContainer = document.getElementById('water-history-list');
    if (historyContainer) {
      if (logs.length === 0) {
        historyContainer.innerHTML = `<div style="text-align: center; padding: 16px; color: var(--text-tertiary); font-size: 0.82rem;">No water logged yet today</div>`;
      } else {
        historyContainer.innerHTML = [...logs].reverse().map(w => `
          <div class="water-history-item">
            <span>💧</span>
            <span class="wh-time">${w.time}</span>
            <span class="wh-amount">${w.amount}ml</span>
          </div>
        `).join('');
      }
    }
  }

  // ─── Grocery / Pantry ───
  bindGroceryControls() {
    document.getElementById('add-grocery-btn')?.addEventListener('click', () => {
      this.addGroceryFromForm();
    });
  }

  addGroceryFromForm() {
    const name = (document.getElementById('grocery-name')?.value || '').trim();
    const calories = parseFloat(document.getElementById('grocery-calories')?.value) || 0;
    const protein = parseFloat(document.getElementById('grocery-protein')?.value) || 0;
    const carbs = parseFloat(document.getElementById('grocery-carb')?.value) || 0;
    const fat = parseFloat(document.getElementById('grocery-fat')?.value) || 0;

    if (!name) {
      this.showToast('⚠️', 'Please enter a product name');
      return;
    }

    if (calories === 0 && protein === 0 && carbs === 0 && fat === 0) {
      this.showToast('⚠️', 'Please enter at least one nutritional value');
      return;
    }

    const newItem = {
      id: Date.now(),
      name,
      category: 'Custom',
      calories,
      protein,
      carbs,
      fat,
      serving: 'per 100g'
    };

    this.groceries.push(newItem);
    this.saveData('nutritrack_groceries', this.groceries);
    this.addActivity('grocery', name, 'added to pantry', calories);
    this.renderGroceries();
    this.filterFoods(); // Refresh meal pantry list
    this.showToast('🛒', `${name} added to your pantry`);

    // Clear form
    document.getElementById('grocery-name').value = '';
    document.getElementById('grocery-calories').value = '';
    document.getElementById('grocery-protein').value = '';
    document.getElementById('grocery-carb').value = '';
    document.getElementById('grocery-fat').value = '';
  }

  removeGroceryItem(idx) {
    const removed = this.groceries.splice(idx, 1);
    this.saveData('nutritrack_groceries', this.groceries);
    this.renderGroceries();
    this.filterFoods(); // Refresh meal pantry list
    if (removed.length) this.showToast('🗑️', `${removed[0].name} removed from pantry`);
  }

  renderGroceries() {
    const container = document.getElementById('grocery-items-list');
    if (!container) return;

    const count = this.groceries.length;

    // Summary stats
    this.setText('grocery-total-cal', count);
    if (count > 0) {
      const avgP = this.groceries.reduce((s, g) => s + g.protein, 0) / count;
      const avgC = this.groceries.reduce((s, g) => s + g.carbs, 0) / count;
      const avgF = this.groceries.reduce((s, g) => s + g.fat, 0) / count;
      this.setText('grocery-total-protein', Math.round(avgP) + 'g');
      this.setText('grocery-total-carbs', Math.round(avgC) + 'g');
      this.setText('grocery-total-fat', Math.round(avgF) + 'g');
    } else {
      this.setText('grocery-total-protein', '—');
      this.setText('grocery-total-carbs', '—');
      this.setText('grocery-total-fat', '—');
    }

    if (count === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🛒</div>
          <p>Your pantry is empty</p>
          <p style="font-size: 0.82rem;">Add items you bought using the form →</p>
        </div>`;
      return;
    }

    container.innerHTML = this.groceries.map((g, idx) => `
      <div class="grocery-item">
        <div class="gi-emoji">🛒</div>
        <div class="gi-info">
          <div class="gi-name">${g.name}</div>
          <div class="gi-details">${g.calories} kcal · ${g.protein}g P · ${g.carbs}g C · ${g.fat}g F per 100g</div>
        </div>
        <div class="gi-cals">${g.calories} <small>kcal/100g</small></div>
        <button class="gi-delete" onclick="app.removeGroceryItem(${idx})" title="Remove">✕</button>
      </div>
    `).join('');
  }

  // ─── Reports ───
  renderReports() {
    this.renderCalorieChart();
    this.renderWaterChart();
    this.renderMacroChart();
  }

  renderCalorieChart() {
    const canvas = document.getElementById('calorie-chart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);

    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    ctx.clearRect(0, 0, w, h);

    // Get last 7 days data
    const days = [];
    const dayLabels = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = this.getDateKey(d);
      const dayMeals = this.meals[key] || {};
      let cals = 0;
      Object.values(dayMeals).forEach(items => {
        items.forEach(item => cals += item.calories || 0);
      });
      days.push(cals);
      dayLabels.push(d.toLocaleDateString('en-US', { weekday: 'short' }));
    }

    const maxVal = Math.max(...days, this.goals.calories) * 1.15;
    const barWidth = (w - 80) / 7;
    const chartLeft = 50;
    const chartBottom = h - 30;
    const chartTop = 20;
    const chartHeight = chartBottom - chartTop;

    // Grid lines
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
      ctx.fillText(Math.round(maxVal - (maxVal / 4) * i), chartLeft - 8, y + 4);
    }

    // Goal line
    const goalY = chartTop + chartHeight * (1 - this.goals.calories / maxVal);
    ctx.strokeStyle = 'rgba(78, 205, 196, 0.4)';
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(chartLeft, goalY);
    ctx.lineTo(w - 10, goalY);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = 'rgba(78, 205, 196, 0.6)';
    ctx.font = '9px Inter';
    ctx.textAlign = 'left';
    ctx.fillText('Goal', w - 35, goalY - 5);

    // Bars
    days.forEach((val, i) => {
      const barH = (val / maxVal) * chartHeight;
      const x = chartLeft + i * barWidth + barWidth * 0.2;
      const bw = barWidth * 0.6;
      const y = chartBottom - barH;

      // Bar gradient
      const grad = ctx.createLinearGradient(x, y, x, chartBottom);
      grad.addColorStop(0, '#FF6B6B');
      grad.addColorStop(1, '#FFE66D');
      ctx.fillStyle = grad;

      // Rounded top
      const radius = 4;
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + bw - radius, y);
      ctx.quadraticCurveTo(x + bw, y, x + bw, y + radius);
      ctx.lineTo(x + bw, chartBottom);
      ctx.lineTo(x, chartBottom);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.fill();

      // Value on top
      if (val > 0) {
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.font = '10px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(Math.round(val), x + bw / 2, y - 6);
      }

      // Day label
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.font = '10px Inter';
      ctx.textAlign = 'center';
      ctx.fillText(dayLabels[i], x + bw / 2, chartBottom + 16);
    });
  }

  renderWaterChart() {
    const canvas = document.getElementById('water-chart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);

    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    ctx.clearRect(0, 0, w, h);

    const days = [];
    const dayLabels = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = this.getDateKey(d);
      const logs = this.waterLog[key] || [];
      const ml = logs.reduce((sum, w) => sum + w.amount, 0);
      days.push(ml / 250); // Convert to glasses
      dayLabels.push(d.toLocaleDateString('en-US', { weekday: 'short' }));
    }

    const maxVal = Math.max(...days, this.goals.water) * 1.2;
    const chartLeft = 50;
    const chartBottom = h - 30;
    const chartTop = 20;
    const chartHeight = chartBottom - chartTop;

    // Grid
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
      ctx.fillText(Math.round((maxVal - (maxVal / 4) * i) * 10) / 10, chartLeft - 8, y + 4);
    }

    // Goal line
    const goalY = chartTop + chartHeight * (1 - this.goals.water / maxVal);
    ctx.strokeStyle = 'rgba(108, 99, 255, 0.4)';
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(chartLeft, goalY);
    ctx.lineTo(w - 10, goalY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Line chart with area fill
    const points = days.map((val, i) => {
      const barWidth = (w - 80) / 7;
      const x = chartLeft + i * barWidth + barWidth / 2;
      const y = chartTop + chartHeight * (1 - val / maxVal);
      return { x, y };
    });

    // Area fill
    const areaGrad = ctx.createLinearGradient(0, chartTop, 0, chartBottom);
    areaGrad.addColorStop(0, 'rgba(78, 205, 196, 0.2)');
    areaGrad.addColorStop(1, 'rgba(78, 205, 196, 0.01)');
    ctx.fillStyle = areaGrad;
    ctx.beginPath();
    ctx.moveTo(points[0].x, chartBottom);
    points.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.lineTo(points[points.length - 1].x, chartBottom);
    ctx.fill();

    // Line
    const lineGrad = ctx.createLinearGradient(points[0].x, 0, points[points.length - 1].x, 0);
    lineGrad.addColorStop(0, '#4ECDC4');
    lineGrad.addColorStop(1, '#44B0FF');
    ctx.strokeStyle = lineGrad;
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    ctx.beginPath();
    points.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
    ctx.stroke();

    // Points
    points.forEach((p, i) => {
      ctx.fillStyle = '#4ECDC4';
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#0a0a1a';
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
      ctx.fill();

      // Labels
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.font = '10px Inter';
      ctx.textAlign = 'center';
      ctx.fillText(dayLabels[i], p.x, chartBottom + 16);

      if (days[i] > 0) {
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.fillText(Math.round(days[i] * 10) / 10, p.x, p.y - 10);
      }
    });
  }

  renderMacroChart() {
    const canvas = document.getElementById('macro-chart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);

    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    ctx.clearRect(0, 0, w, h);

    const dateKey = this.getDateKey();
    const dayMeals = this.meals[dateKey] || {};
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
      return;
    }

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

      // Label
      const midAngle = startAngle + sliceAngle / 2;
      const labelR = radius + 20;
      const lx = cx + Math.cos(midAngle) * labelR;
      const ly = cy + Math.sin(midAngle) * labelR;

      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.font = '10px Inter';
      ctx.textAlign = 'center';
      ctx.fillText(`${d.label}`, lx, ly - 5);
      ctx.fillStyle = d.color;
      ctx.font = 'bold 11px Inter';
      ctx.fillText(`${Math.round(d.value / total * 100)}%`, lx, ly + 10);

      startAngle = endAngle;
    });

    // Center text
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.font = 'bold 18px Inter';
    ctx.textAlign = 'center';
    ctx.fillText(Math.round(total) + 'g', cx, cy + 2);
    ctx.font = '10px Inter';
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.fillText('Total', cx, cy + 16);
  }

  // ─── Settings ───
  bindSettings() {
    // Auto-Calculate Macros
    document.getElementById('calc-btn')?.addEventListener('click', () => {
      const gender = document.getElementById('calc-gender').value;
      const age = parseInt(document.getElementById('calc-age').value);
      const weight = parseFloat(document.getElementById('calc-weight').value);
      const height = parseFloat(document.getElementById('calc-height').value);
      const activity = parseFloat(document.getElementById('calc-activity').value);
      const goal = document.getElementById('calc-goal').value;

      if (!age || !weight || !height || age <= 0 || weight <= 0 || height <= 0) {
        this.showToast('⚠️', 'Please enter valid age, weight, and height');
        return;
      }

      // Mifflin-St Jeor Equation
      let bmr = (10 * weight) + (6.25 * height) - (5 * age);
      if (gender === 'male') {
        bmr += 5;
      } else {
        bmr -= 161;
      }

      // Total Daily Energy Expenditure
      let tdee = bmr * activity;

      // Adjust for goal
      let targetCals = tdee;
      if (goal === 'lose') targetCals -= 500;
      else if (goal === 'build') targetCals += 300;

      // Safety minimum
      targetCals = Math.max(1200, Math.round(targetCals));

      // Calculate Macros based on clinical sports nutrition guidelines (e.g. ISSN)
      let proteinMultiplier = 1.6; // Base active maintenance

      if (goal === 'lose') {
        // Higher protein in a caloric deficit to preserve lean mass
        proteinMultiplier = 2.2; 
      } else if (goal === 'build') {
        // High protein for muscle protein synthesis
        proteinMultiplier = 2.0;
      } else if (goal === 'maintain' && activity <= 1.375) {
        // Lower protein needed for sedentary/light activity maintenance
        proteinMultiplier = 1.2;
      }

      // Protein: based on body weight multiplier
      const protein = Math.round(weight * proteinMultiplier);
      
      // Fat: 25% of total calories (9 kcal per gram) is a healthy baseline for hormone function
      const fat = Math.round((targetCals * 0.25) / 9);
      
      // Carbs: Remaining calories fuel training and brain function (4 kcal per gram)
      let carbs = Math.round((targetCals - (protein * 4) - (fat * 9)) / 4);
      
      // Fallback safeguard if extreme settings cause negative carbs
      if (carbs < 0) {
        carbs = 0;
      }

      // Water: rough estimate (weight in kg / 30) * 4 to get 250ml glasses, simplified to weight/10 + 2
      const water = Math.round(weight / 10) + 2;

      // Update the inputs in the UI
      document.getElementById('set-calories').value = targetCals;
      document.getElementById('set-protein').value = protein;
      document.getElementById('set-carbs').value = carbs;
      document.getElementById('set-fat').value = fat;
      document.getElementById('set-water').value = water;

      this.showToast('🧮', 'Calculated! Review and click Save Goals to apply.');
    });

    document.getElementById('save-settings')?.addEventListener('click', () => {
      this.goals.calories = parseInt(document.getElementById('set-calories').value) || 2000;
      this.goals.water = parseInt(document.getElementById('set-water').value) || 8;
      this.goals.protein = parseInt(document.getElementById('set-protein').value) || 150;
      this.goals.carbs = parseInt(document.getElementById('set-carbs').value) || 250;
      this.goals.fat = parseInt(document.getElementById('set-fat').value) || 65;

      this.saveData('nutritrack_goals', this.goals);
      this.renderDashboard();
      this.renderWater();
      this.showToast('✅', 'Goals saved successfully');
    });

    document.getElementById('reset-all-data')?.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
        localStorage.removeItem('nutritrack_meals');
        localStorage.removeItem('nutritrack_water');
        localStorage.removeItem('nutritrack_groceries');
        localStorage.removeItem('nutritrack_activity');
        localStorage.removeItem('nutritrack_custom_foods');

        this.meals = {};
        this.waterLog = {};
        this.groceries = [];
        this.activityLog = [];
        this.customFoods = [];

        this.renderDashboard();
        this.renderMeals();
        this.renderWater();
        this.renderGroceries();
        this.renderReports();
        this.showToast('🗑️', 'All data has been cleared');
      }
    });

    document.getElementById('add-custom-food')?.addEventListener('click', () => {
      const name = document.getElementById('custom-name').value.trim();
      const calories = parseFloat(document.getElementById('custom-calories').value) || 0;
      const protein = parseFloat(document.getElementById('custom-protein').value) || 0;
      const carbs = parseFloat(document.getElementById('custom-carbs').value) || 0;
      const fat = parseFloat(document.getElementById('custom-fat').value) || 0;

      if (!name) {
        this.showToast('⚠️', 'Please enter a food name');
        return;
      }

      const newFood = {
        id: Date.now(),
        name,
        category: 'Custom',
        calories,
        protein,
        carbs,
        fat,
        fiber: 0,
        serving: 'per 100g'
      };

      this.customFoods.push(newFood);
      this.saveData('nutritrack_custom_foods', this.customFoods);

      // Clear form
      document.getElementById('custom-name').value = '';
      document.getElementById('custom-calories').value = '';
      document.getElementById('custom-protein').value = '';
      document.getElementById('custom-carbs').value = '';
      document.getElementById('custom-fat').value = '';

      this.filterFoods();
      this.showToast('⭐', `${name} added to food database`);
    });
  }

  renderSettings() {
    const setEl = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.value = val;
    };

    setEl('set-calories', this.goals.calories);
    setEl('set-water', this.goals.water);
    setEl('set-protein', this.goals.protein);
    setEl('set-carbs', this.goals.carbs);
    setEl('set-fat', this.goals.fat);
  }

  // ─── Toast Notifications ───
  showToast(icon, message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <span class="toast-icon">${icon}</span>
      <span>${message}</span>
    `;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('removing');
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  }

  // ─── Helpers ───
  setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }
}

// Initialize app
let app;
document.addEventListener('DOMContentLoaded', () => {
  app = new NutriTrack();
});
