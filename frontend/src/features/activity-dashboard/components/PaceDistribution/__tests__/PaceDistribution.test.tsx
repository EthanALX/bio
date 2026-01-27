import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { PaceDistribution } from "../PaceDistribution";
import { Activity } from "../../../types";

const mockActivities: Activity[] = [
  {
    id: "1",
    date: "2024-01-15T10:00:00",
    distance: 5.0,
    pace: "5'20\"/km",
    bpm: 150,
    time: "26m 40s",
    route: "Morning Run",
    type: "run",
    coordinates: [],
  },
  {
    id: "2",
    date: "2024-01-16T10:00:00",
    distance: 10.0,
    pace: "5'00\"/km",
    bpm: 155,
    time: "50m 00s",
    route: "Long Run",
    type: "run",
    coordinates: [],
  },
  {
    id: "3",
    date: "2024-01-17T10:00:00",
    distance: 3.0,
    pace: "4'30\"/km",
    bpm: 165,
    time: "13m 30s",
    route: "Speed Work",
    type: "run",
    coordinates: [],
  },
];

describe("PaceDistribution", () => {
  it("renders pace distribution chart", () => {
    render(<PaceDistribution activities={mockActivities} />);
    expect(screen.getByText("Pace Distribution")).toBeInTheDocument();
  });

  it("displays pace statistics", () => {
    render(<PaceDistribution activities={mockActivities} />);
    expect(screen.getByText("Fastest Pace")).toBeInTheDocument();
    expect(screen.getByText("Average Pace")).toBeInTheDocument();
    expect(screen.getByText("Slowest Pace")).toBeInTheDocument();
    expect(screen.getByText("Total Activities")).toBeInTheDocument();
  });

  it("shows empty state when no activities", () => {
    render(<PaceDistribution activities={[]} />);
    expect(screen.getByText("No pace data available")).toBeInTheDocument();
  });
});
