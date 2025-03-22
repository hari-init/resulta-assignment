import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import Select from "./Select";
import "@testing-library/jest-dom";

describe("Select Component", () => {
  const options = ["NCAAB", "NFL", "NCAAF"];
  const handleChange = jest.fn();

  it("renders the label and placeholder correctly", () => {
    render(
      <Select
        selectedOption="NCAAB"
        handleChange={handleChange}
        options={options}
        label="League"
      />
    );

    expect(screen.getByText("League")).toBeInTheDocument();
    expect(screen.getByText("NCAAB")).toBeInTheDocument();
  });

  it("toggles the dropdown open and closed", () => {
    render(
      <Select
        selectedOption="NCAAB"
        handleChange={handleChange}
        options={options}
        label="League"
      />
    );

    // Dropdown should be closed initially
    expect(screen.queryByText("NFL")).not.toBeInTheDocument();

    // Open the dropdown
    fireEvent.click(screen.getByText("NCAAB"));
    expect(screen.getByText("NFL")).toBeInTheDocument();

    // Close the dropdown
    fireEvent.click(screen.getByText("NFL"));
    expect(screen.queryByText("NFL")).not.toBeInTheDocument();
  });

  it("closes the dropdown when clicking outside", () => {
    render(
      <div>
        <Select
          selectedOption="NCAAB"
          handleChange={handleChange}
          options={options}
          label="League"
        />
        <div data-testid="outside">Outside Element</div>
      </div>
    );

    // Open the dropdown
    fireEvent.click(screen.getByText("NCAAB"));
    expect(screen.getByText("NFL")).toBeInTheDocument(); // Dropdown is open

    // Click outside the dropdown
    fireEvent.mouseDown(screen.getByTestId("outside"));

    // Dropdown should be closed
    expect(screen.queryByText("NFL")).not.toBeInTheDocument();
  });
});
