'use client';

import React from 'react';
import clsx from 'clsx';
import styles from "../styles/Input.module.css"; // ✅ import as module

type InputProps = {
    size?: 'xs' | 's' | 'm' | 'l' | 'xl';
    className?: string;
    disabled?: boolean;
    type?: string;
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    name?: string;
};

export default function Input({
                                  size = 'm',
                                  className = '',
                                  disabled = false,
                                  type = 'text',
                                  placeholder = '',
                                  value,
                                  onChange,
                                  name,
                              }: InputProps) {
    const sizeClass = styles[`input-${size}`]; // ✅ lookup from module

    return (
        <input
            type={type}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            disabled={disabled}
            className={clsx(
                styles.input,   // ✅ base input styles from module
                sizeClass,      // ✅ size-specific styles
                disabled && 'opacity-60 cursor-not-allowed',
                className       // ✅ allow overrides
            )}
        />
    );
}
