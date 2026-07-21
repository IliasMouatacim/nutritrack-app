"use client";

import Sidebar from "@/components/Sidebar";
import Dashboard from "@/components/Dashboard";
import MealTracker from "@/components/MealTracker";
import WaterTracker from "@/components/WaterTracker";
import Pantry from "@/components/Pantry";
import Reports from "@/components/Reports";
import Settings from "@/components/Settings";
import { useEffect, useState } from "react";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

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
