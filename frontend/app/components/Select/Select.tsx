import React, { useState, useRef, useEffect, useCallback } from "react";
import styles from "./Select.module.css";
import Image from "next/image";

interface SelectProps {
  selectedOption: string;
  handleChange: (option: string) => void;
  options: string[];
  label: string;
}

const Select: React.FC<SelectProps> = ({
  selectedOption,
  handleChange,
  options,
  label,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Toggle dropdown visibility
  const toggleDropdown = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  // Handle option selection
  const handleSelect = useCallback(
    (option: string) => {
      handleChange(option);
      setIsOpen(false); // Close dropdown after selection
    },
    [handleChange]
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

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
};

export default Select;
