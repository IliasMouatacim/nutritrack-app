"use client";

import Sidebar from "@/components/Sidebar";
import Dashboard from "@/components/Dashboard";
import MealTracker from "@/components/MealTracker";
import WaterTracker from "@/components/WaterTracker";
import Pantry from "@/components/Pantry";
import Reports from "@/components/Reports";
import Settings from "@/components/Settings";
import Login from "@/components/Login";
import { useEffect, useState } from "react";
import { NutriTrackProvider } from "@/hooks/useNutriTrack";
import { useAuth } from "@/hooks/useAuth";

function NutriTrackApp() {
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

export default function Home() {
  const [mounted, setMounted] = useState(false);

  const { user, loading } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || loading) return null;

  if (!user) {
    return <Login />;
  }

  return (
    <NutriTrackProvider userUid={user.uid}>
      <NutriTrackApp />
    </NutriTrackProvider>
  );
}
