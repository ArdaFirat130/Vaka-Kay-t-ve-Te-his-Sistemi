import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import styles from './Checkbox.module.css';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  error?: string;
  description?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, description, className = '', id, ...props }, ref) => {
    const checkboxId = id || `checkbox-${Math.random().toString(36).substring(2, 9)}`;

    return (
      <div className={`${styles.container} ${className}`.trim()}>
        <label htmlFor={checkboxId} className={styles.wrapper}>
          <input
            type="checkbox"
            id={checkboxId}
            ref={ref}
            className={`${styles.input} ${error ? styles.hasError : ''}`}
            {...props}
          />
          <div className={styles.checkboxControl}>
            <svg
              className={styles.checkIcon}
              width="12"
              height="10"
              viewBox="0 0 12 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 5L4.5 8.5L11 1.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className={styles.labelWrapper}>
            <span className={styles.label}>{label}</span>
            {description && <p className={styles.description}>{description}</p>}
          </div>
        </label>
        {error && <span className={styles.errorText}>{error}</span>}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
