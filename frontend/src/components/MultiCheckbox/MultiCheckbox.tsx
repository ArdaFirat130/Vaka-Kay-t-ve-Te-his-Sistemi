import React, { useState, useRef, useEffect } from 'react';
import { useController } from 'react-hook-form';
import type { UseControllerProps } from 'react-hook-form';
import styles from './MultiCheckbox.module.css';

export interface Option {
  label: string;
  value: string;
}

interface MultiCheckboxProps extends UseControllerProps<any> {
  label: string;
  options: Option[];
}

export const MultiCheckbox: React.FC<MultiCheckboxProps> = (props) => {
  const { field, fieldState } = useController(props);
  const selectedValues = Array.isArray(field.value) ? field.value : [];
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = (value: string) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter((v: string) => v !== value)
      : [...selectedValues, value];
    field.onChange(newValues);
  };

  const getDisplayText = () => {
    if (selectedValues.length === 0) return 'Seçiniz...';
    if (selectedValues.length === 1) {
      return props.options.find(o => o.value === selectedValues[0])?.label || '1 Seçili';
    }
    return `${selectedValues.length} Seçili`;
  };

  return (
    <div className={styles.container} ref={containerRef} style={{ zIndex: isOpen ? 50 : 1 }}>
      <label className={styles.mainLabel}>{props.label}</label>
      
      <div 
        className={`${styles.dropdownHeader} ${isOpen ? styles.open : ''} ${fieldState.error ? styles.errorBorder : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={selectedValues.length > 0 ? styles.hasSelection : ''}>
          {getDisplayText()}
        </span>
        <svg 
          className={`${styles.chevron} ${isOpen ? styles.rotated : ''}`} 
          width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      {isOpen && (
        <div className={styles.optionsDropdown}>
          {props.options.map((option) => (
            <label key={option.value} className={styles.checkboxWrapper}>
              <input
                type="checkbox"
                className={styles.input}
                checked={selectedValues.includes(option.value)}
                onChange={() => handleToggle(option.value)}
              />
              <div className={styles.checkboxControl}>
                <svg className={styles.checkIcon} viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 5L4.5 8.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className={styles.optionLabel}>{option.label}</span>
            </label>
          ))}
        </div>
      )}

      {fieldState.error && <span className={styles.errorText}>{fieldState.error.message}</span>}
    </div>
  );
};
