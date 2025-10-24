"use client";

import { useState } from "react";
import Button from "./Button"

interface MultipleChoiceListProps {
    options: string[];
    correctAnswer: string;
    onCorrect: () => void;
    onContinue: () => void;
}

export default function MultipleChoiceList({
                                               options,
                                               correctAnswer,
                                               onCorrect,
                                               onContinue,
                                           }: MultipleChoiceListProps) {
    const [selected, setSelected] = useState<string | null>(null);
    const [isChecked, setIsChecked] = useState(false);

    const handleCheck = () => {
        if (!selected) return;
        setIsChecked(true);

        if (selected === correctAnswer) {
            onCorrect();
        }
    };

    const getClasses = (option: string) => {
        const base =
            "flex items-center gap-3 px-4 py-3 rounded-lg border cursor-pointer transition-colors";

        if (!isChecked) {
            return selected === option
                ? `${base} border-blue-500 bg-blue-100`
                : `${base} border-gray-600 bg-gray-900 hover:bg-gray-800`;
        }

        if (option === correctAnswer) {
            return `${base} border-green-500 bg-green-900/30`;
        }

        if (selected === option && option !== correctAnswer) {
            return `${base} border-red-500 bg-red-900/30`;
        }

        return `${base} border-gray-600 bg-gray-900`;
    };

    return (
        <div className="flex flex-col gap-4">
            <ul className="flex flex-col gap-3">
                {options.map((opt, idx) => (
                    <li
                        key={opt}
                        onClick={() => !isChecked && setSelected(opt)}
                        className={getClasses(opt)}
                    >
            <span className="flex items-center justify-center w-6 h-6 rounded-full border text-sm">
              {idx + 1}
            </span>
                        <span>{opt}</span>
                    </li>
                ))}
            </ul>

            {!isChecked ? (
                <Button
                    onClick={handleCheck}
                    disabled={!selected}
                    className="btn btn-primary btn-m disabled:opacity-50"
                >
                    Check
                </Button>
            ) : (
                <Button onClick={onContinue} className="btn btn-primary btn-m">
                    Continue
                </Button>
            )}
        </div>
    );
}
