"use client";

import { useId } from "react";
import type { DashboardChart, DashboardChartItem, DashboardStat } from "@/types/admin";

interface DashboardViewProps {
  stats: DashboardStat[];
  charts: DashboardChart[];
}

function BarChart({ chart }: { chart: DashboardChart }) {
  const titleId = useId();
  const maximum = Math.max(...chart.items.map((item) => item.value), 1);
  const axisLabels = [maximum, Math.round(maximum / 2), 0];

  return (
    <section className="chart-card" aria-labelledby={titleId}>
      <h2 className="chart-card__title" id={titleId}>
        {chart.title}
      </h2>
      <div className="chart-plot">
        <div className="chart-axis" aria-hidden="true">
          {axisLabels.map((label, index) => (
            <span className={`chart-axis__label chart-axis__label--${index}`} key={index}>
              {label}
            </span>
          ))}
        </div>
        <div
          className="chart-plot__area"
          role="list"
          aria-label={chart.title}
        >
          <span className="chart-gridline chart-gridline--top" aria-hidden="true" />
          <span className="chart-gridline chart-gridline--middle" aria-hidden="true" />
          <span className="chart-gridline chart-gridline--bottom" aria-hidden="true" />
          {chart.items.map((item) => (
            <ChartBar item={item} maximum={maximum} key={item.label} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ChartBar({ item, maximum }: { item: DashboardChartItem; maximum: number }) {
  const height = (item.value / maximum) * 82;

  return (
    <div
      className="chart-bar"
      role="listitem"
      aria-label={`${item.label}: ${item.value}`}
    >
      <div className="chart-bar__track">
        <span className="chart-bar__value">{item.value}</span>
        <span
          className="chart-bar__fill"
          style={{ height: `${height}%`, backgroundColor: item.color }}
          aria-hidden="true"
        />
      </div>
      <span className="chart-bar__label">{item.label}</span>
    </div>
  );
}

export default function DashboardView({ stats, charts }: DashboardViewProps) {
  return (
    <>
      <section className="stat-grid" aria-label="Ringkasan statistik">
        {stats.map((stat) => (
          <article className="stat-card" key={stat.label}>
            <p className="label">{stat.label}</p>
            <p className="value">{stat.value}</p>
            <p className="sub">{stat.description}</p>
          </article>
        ))}
      </section>

      <section aria-labelledby="dashboard-charts-title">
        <h2 className="section-title" id="dashboard-charts-title">
          Grafik
        </h2>
        <div className="chart-grid">
          {charts.map((chart) => (
            <BarChart chart={chart} key={chart.title} />
          ))}
        </div>
      </section>
    </>
  );
}
