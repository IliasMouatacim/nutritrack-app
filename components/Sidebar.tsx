"use client";

import { useNutriTrack } from "@/hooks/useNutriTrack";

export default function Sidebar({ children }: { children: React.ReactNode }) {
  const { currentSection, setCurrentSection, currentDate, setCurrentDate, getDateKey } = useNutriTrack();

  const handleNextDay = () => {
    const next = new Date(currentDate);
    next.setDate(next.getDate() + 1);
    setCurrentDate(next);
  };

  const handlePrevDay = () => {
    const prev = new Date(currentDate);
    prev.setDate(prev.getDate() - 1);
    setCurrentDate(prev);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const navItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'meals', icon: '🍽️', label: 'Meal Tracker' },
    { id: 'water', icon: '💧', label: 'Water Tracker' },
    { id: 'groceries', icon: '🛒', label: 'My Pantry' },
    { id: 'reports', icon: '📈', label: 'Weekly Reports' },
    { id: 'settings', icon: '⚙️', label: 'Settings' },
  ];

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-logo">🥗</div>
          <h1>NutriTrack</h1>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(item => (
            <div 
              key={item.id}
              className={`nav-item ${currentSection === item.id ? 'active' : ''}`} 
              onClick={() => setCurrentSection(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="date-display" id="sidebar-date">
            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
        </div>
      </aside>

      <main className="main-content">
        <div className="date-nav">
          <button id="date-prev" title="Previous day" onClick={handlePrevDay}>◀</button>
          <span className="current-date">
            {getDateKey(currentDate) === getDateKey(new Date()) ? 
              'Today — ' + currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) :
              currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
            }
          </span>
          <button id="date-next" title="Next day" onClick={handleNextDay}>▶</button>
          <button className="today-btn" onClick={handleToday}>Today</button>
        </div>
        {children}
      </main>
    </div>
  );
}
