export interface MetricCardsProps {
  selectedYear?: number;
}

export type MetricVariant = "primary" | "blue" | "orange";

export interface MetricItem {
  label: string;
  value: string;
  unit: string;
  icon: string;
  variant: MetricVariant;
}

export interface MetricCardsData {
  metrics: MetricItem[];
}

export interface UseMetricCardsProps {
  selectedYear?: number;
}

export interface UseMetricCardsResult {
  data: MetricCardsData;
}
