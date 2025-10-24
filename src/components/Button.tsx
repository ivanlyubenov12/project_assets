'use client';

import React from 'react';
import clsx from 'clsx';
import styles from "../styles/Button.module.css"; // ✅ CSS module

type ButtonProps = {
  children?: React.ReactNode;
  size?: 'xs' | 's' | 'm' | 'l' | 'xl';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  variant?: 'primary' | 'secondary'; // ✅ new prop
};

export default function Button({
                                 children,
                                 size = 'm',
                                 leftIcon,
                                 rightIcon,
                                 className = '',
                                 onClick,
                                 type = 'button',
                                 disabled = false,
                                 variant = 'primary', // ✅ default is primary
                               }: ButtonProps) {
  const sizeClass = styles[`btn-${size}`];
  const variantClass = styles[`btn-${variant}`]; // ✅ maps to .btn-primary or .btn-secondary
  const iconOnly = !!(leftIcon && !children && !rightIcon);

  const iconSpacing = {
    xs: 4,
    s: 6,
    m: 8,
    l: 10,
    xl: 12,
  }[size];

  return (
      <button
          type={type}
          className={clsx(
              styles.btn,          // base button style
              sizeClass,           // size-specific
              variantClass,        // ✅ primary / secondary
              iconOnly && styles['btn-icon'],
              'inline-flex items-center justify-center',
              className
          )}
          onClick={onClick}
          disabled={disabled}
      >
        {leftIcon && (
            <span
                className={styles.icon}
                style={{
                  marginRight: !iconOnly && children ? `${iconSpacing}px` : 0,
                }}
            >
          {leftIcon}
        </span>
        )}
        {!iconOnly && (
            <span className="inline-block leading-none text-center">
          {children}
        </span>
        )}
        {rightIcon && (
            <span
                className={styles.icon}
                style={{
                  marginLeft: !iconOnly && children ? `${iconSpacing}px` : 0,
                }}
            >
          {rightIcon}
        </span>
        )}
      </button>
  );
}
