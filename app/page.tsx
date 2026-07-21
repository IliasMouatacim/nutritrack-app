"use client";

import Sidebar from "@/components/Sidebar";
import Dashboard from "@/components/Dashboard";
import MealTracker from "@/components/MealTracker";
import WaterTracker from "@/components/WaterTracker";
import Pantry from "@/components/Pantry";
import Reports from "@/components/Reports";
import Settings from "@/components/Settings";

export default function Home() {
  return (
    <Sidebar>
      <Dashboard />
      <MealTracker />
      <WaterTracker />
      <Pantry />
      <Reports />
      <Settings />
    </Sidebar>
  );
}
