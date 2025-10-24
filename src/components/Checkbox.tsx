'use client';

import React from 'react';
import { FaCheck } from 'react-icons/fa';
import styles from '../styles/Checkbox.module.css';

type CheckboxProps = {
    label?: string;
    checked?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
};

export default function Checkbox({
                                     label,
                                     checked = false,
                                     onChange,
                                     className = '',
                                 }: CheckboxProps) {
    const id = React.useId();

    return (
        <label htmlFor={id} className={`${styles.wrapper} ${className}`}>
            <input
                id={id}
                type="checkbox"
                checked={checked}
                onChange={onChange}
                className={styles.input}
            />
            <span className={styles.box}>
                {checked && <FaCheck size={12} />}
            </span>
            {label && <span className={"text-body-m"}>{label}</span>}
        </label>
    );
}
