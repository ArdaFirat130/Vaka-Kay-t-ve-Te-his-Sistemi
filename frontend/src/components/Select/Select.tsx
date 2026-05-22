import { forwardRef } from 'react';
import type { SelectHTMLAttributes, ReactNode } from 'react';
import styles from './Select.module.css';

interface Option {
  label: string;
  value: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Option[];
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      options,
      fullWidth = false,
      leftIcon,
      className = '',
      id,
      placeholder = 'Seçiniz...',
      ...props
    },
    ref
  ) => {
    const selectId = id || `select-${Math.random().toString(36).substring(2, 9)}`;

    const containerClass = `
      ${styles.container} 
      ${fullWidth ? styles.fullWidth : ''} 
      ${className}
    `.trim();

    return (
      <div className={containerClass}>
        {label && (
          <label htmlFor={selectId} className={styles.label}>
            {label}
          </label>
        )}
        
        <div className={styles.selectWrapper}>
          {leftIcon && <span className={styles.leftIcon}>{leftIcon}</span>}
          
          <select
            id={selectId}
            ref={ref}
            className={`
              ${styles.select} 
              ${leftIcon ? styles.hasLeftIcon : ''} 
              ${error ? styles.hasError : ''}
            `}
            {...props}
          >
            <option value="" disabled hidden>{placeholder}</option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          
          {/* Custom Chevron for select */}
          <span className={styles.chevron}>
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </div>
        
        {error && <span className={styles.errorText}>{error}</span>}
      </div>
    );
  }
);

Select.displayName = 'Select';
