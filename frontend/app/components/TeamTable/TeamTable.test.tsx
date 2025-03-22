// TeamTable.test.tsx
import React from "react";
import { render, screen } from "@testing-library/react";
import TeamTable from "./TeamTable";
import "@testing-library/jest-dom";

describe("TeamTable Component", () => {
  const mockTeams = [
    {
      id: "1",
      name: "Team A",
      nickname: "TA",
      display_name: "Team Alpha",
      conference: "East",
      division: "North",
      logo: "/logo-team-a.png",
    },
    {
      id: "2",
      name: "Team B",
      nickname: "TB",
      display_name: "Team Beta",
      conference: "West",
      division: "South",
    },
  ];

  it("renders the table headers when isHead is true", () => {
    render(<TeamTable isHead={true} list={[]} />);

    expect(screen.getByText("NAME")).toBeInTheDocument();
    expect(screen.getByText("NICKNAME")).toBeInTheDocument();
    expect(screen.getByText("DISPLAY NAME")).toBeInTheDocument();
    expect(screen.getByText("CONFERENCE")).toBeInTheDocument();
    expect(screen.getByText("DIVISION")).toBeInTheDocument();
  });
});
