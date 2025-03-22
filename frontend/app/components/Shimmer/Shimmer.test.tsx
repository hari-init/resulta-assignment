// Shimmer.test.tsx
import React from "react";
import { render, screen } from "@testing-library/react";
import Shimmer from "./Shimmer";
import "@testing-library/jest-dom";

describe("Shimmer Component", () => {
  it("renders the correct number of shimmer elements", () => {
    const count = 5;
    render(<Shimmer count={count} />);

    const tableWrappers = screen.getAllByTestId("shimmer-wrapper-desktop");
    expect(tableWrappers).toHaveLength(count);
  });
});
