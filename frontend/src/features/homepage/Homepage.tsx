"use client";

import React, { useState } from "react";
import { Header } from "./components/Header";
import { MapSection } from "./components/MapSection";
import { ActivityHeatmap } from "./components/ActivityHeatmap";
import { QuickStats } from "./components/QuickStats";
import { PersonalBests } from "./components/PersonalBests";
import { MetricCards } from "./components/MetricCards";
import { Footer } from "./components/Footer";

export function Homepage() {
  const [selectedYear, setSelectedYear] = useState<number | undefined>(
    undefined,
  );

  return (
    <div className="homepage">
      {/*<Header selectedYear={selectedYear} onYearChange={setSelectedYear} />*/}
      <main className="main-content">
        <section className="left-column">
          <MapSection selectedYear={selectedYear} />
          <ActivityHeatmap selectedYear={selectedYear} />
        </section>
        <aside className="right-column">
          <QuickStats selectedYear={selectedYear} />
          <PersonalBests selectedYear={selectedYear} />
          <MetricCards selectedYear={selectedYear} />
        </aside>
      </main>
      <Footer />
    </div>
  );
}
