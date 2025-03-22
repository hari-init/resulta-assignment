import React from "react";
import { render, screen } from "@testing-library/react";
import Page from "./page";
import "@testing-library/jest-dom";

describe("HomeClient Component", () => {
  it("renders the component with initial state", () => {
    render(<Page />);
    expect(screen.getByText("SocketIO:")).toBeInTheDocument();
    expect(screen.getByText("Disconnected")).toBeInTheDocument();
  });
});
