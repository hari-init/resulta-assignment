import React, { useState, useRef, useEffect, memo } from "react";
import styles from "./Select.module.css";
import Image from "next/image";

/**
 * This Selection component involves little tricker implementation
 * like adding own styled dropdown and handling outside click to close the drop down
 *
 * 1.Handled the selection callback for both league selection and sortby option.
 * 2.wrapped with memo for optimization.
 * 3.Handled document level click event.
 * 4.Used Image for the icons (next/image).
 */

interface SelectProps {
  selectedOption: string;
  handleChange: (option: string) => void;
  options: string[];
  label: string;
}

const Select: React.FC<SelectProps> = memo(function Select({
  selectedOption,
  handleChange,
  options,
  label,
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen((prev) => {
      return !prev;
    });
  };

  const handleSelect = (option: string) => {
    handleChange(option);
    setIsOpen(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node) &&
      dropdownRef?.current?.id !== "dropDown"
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.label} ref={dropdownRef}>
      <p className={styles.labelName}>{label}</p>
      <div className={styles.dropdown}>
        <div
          id="dropDown"
          className={`${styles.dropdownHeader} ${isOpen ? styles.open : ""}`}
          onClick={toggleDropdown}
        >
          {selectedOption || `Select ${label.toLowerCase()}`}
          <Image
            src={isOpen ? "/caret-up.svg" : "/caret-down.svg"}
            alt={isOpen ? "Up Arrow" : "Down Arrow"}
            width={26}
            height={26}
          />
        </div>
        {isOpen && (
          <ul className={styles.dropdownList}>
            {options.map((option) => (
              <li
                key={option}
                className={`${styles.dropdownItem} ${
                  selectedOption === option ? styles.selected : ""
                }`}
                onClick={() => handleSelect(option)}
              >
                {option}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
});

export default Select;
