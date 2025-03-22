// TeamTable.test.tsx
import React from "react";
import { render, screen } from "@testing-library/react";
import TeamTable from "./TeamTable";
import "@testing-library/jest-dom";

describe("TeamTable Component", () => {
  it("renders the table headers when isHead is true", () => {
    render(<TeamTable isHead={true} list={[]} />);

    expect(screen.getByText("NAME")).toBeInTheDocument();
    expect(screen.getByText("NICKNAME")).toBeInTheDocument();
    expect(screen.getByText("DISPLAY NAME")).toBeInTheDocument();
    expect(screen.getByText("CONFERENCE")).toBeInTheDocument();
    expect(screen.getByText("DIVISION")).toBeInTheDocument();
  });
});
