"use client";

import { useRouter } from "next/router";
import { useState, useMemo } from "react";
import courseContent from "../courseContent/course1/content.json";
import { auth, db } from "../../lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import AppSidebar from "../components/Sidebar";
import App from "next/app";

export default function LessonPage() {
    const router = useRouter();
    const { section, lesson } = router.query;

    if (!section || !lesson) return <div>Loading...</div>;

    const sectionData = courseContent.sections.find((s) => s.id === section);
    const lessonData = sectionData?.lessons.find((l) => l.id === lesson);

    if (!lessonData) return <div>Lesson not found</div>;

    const steps = useMemo(() => {
        return lessonData.segments.flatMap((seg: any) => {
            const theoryStep = { type: "theory", segment: seg };
            const questionSteps =
                seg.questions?.map((q: any) => ({
                    type: "question",
                    segment: seg,
                    question: q,
                })) || [];
            return [theoryStep, ...questionSteps];
        });
    }, [lessonData]);

    const [step, setStep] = useState(0);
    const [selected, setSelected] = useState<string | null>(null);
    const [isAnsweredCorrectly, setIsAnsweredCorrectly] = useState(false);
    const [feedback, setFeedback] = useState<string | null>(null);
    const [checked, setChecked] = useState(false);

    const current = steps[step];
    if (!current) return <div>No content found</div>;

    const handleCheck = () => {
        if (!selected) return;

        if (current.type === "question") {
            const correct =
                current.question.type === "multiple-choice"
                    ? selected === current.question.answer
                    : (selected === "True" && current.question.answer === true) ||
                    (selected === "False" && current.question.answer === false);

            setChecked(true);

            if (correct) {
                setIsAnsweredCorrectly(true);
                setFeedback("✅ Correct!");
            } else {
                setFeedback("❌ Try again.");
            }
        }
    };

    const handleFinish = async () => {
        const user = auth.currentUser;
        if (!user) {
            router.push("/login");
            return;
        }

        const progressRef = doc(db, "progress", user.uid);
        const snap = await getDoc(progressRef);
        let completed: string[] = [];

        if (snap.exists()) {
            completed = snap.data().completedLessons || [];
        }

        const lessonId = `${section}-${lesson}`;
        if (!completed.includes(lessonId)) {
            completed.push(lessonId);
        }

        await setDoc(progressRef, { completedLessons: completed }, { merge: true });
        router.push("/learn");
    };

    return (
        <div className="p-6 min-h-screen flex flex-col">
            
            <h1 className="text-2xl font-bold mb-4">{lessonData.title}</h1>

            {current.type === "theory" && (
                <div>
                    <h2 className="text-xl font-semibold mb-2">{current.segment.title}</h2>
                    <p>{current.segment.theory}</p>
                </div>
            )}

            {current.type === "question" && (
                <div>
                    <h2 className="text-lg font-semibold mb-2">
                        {current.segment.title} – Question
                    </h2>
                    <p className="mb-4">{current.question.question}</p>

                    {current.question.type === "multiple-choice" && (
                        <ul className="space-y-2">
                            {current.question.options.map((opt: string, idx: number) => {
                                let style = "p-2 border rounded cursor-pointer transition ";
                                if (selected === opt && !checked) {
                                    style += "bg-blue-100";
                                }
                                if (checked) {
                                    if (opt === current.question.answer) {
                                        style += "bg-green-200 border-green-500";
                                    } else if (opt === selected && opt !== current.question.answer) {
                                        style += "bg-red-200 border-red-500";
                                    }
                                }
                                return (
                                    <li
                                        key={idx}
                                        className={style}
                                        onClick={() =>
                                            !isAnsweredCorrectly && setSelected(opt)
                                        }
                                    >
                                        {opt}
                                    </li>
                                );
                            })}
                        </ul>
                    )}

                    {current.question.type === "true-false" && (
                        <div className="flex gap-4">
                            {["True", "False"].map((opt) => {
                                let style =
                                    "px-4 py-2 border rounded transition cursor-pointer ";
                                if (selected === opt && !checked) {
                                    style += "bg-blue-100";
                                }
                                if (checked) {
                                    if (
                                        (opt === "True" && current.question.answer === true) ||
                                        (opt === "False" && current.question.answer === false)
                                    ) {
                                        style += "bg-green-200 border-green-500";
                                    } else if (opt === selected) {
                                        style += "bg-red-200 border-red-500";
                                    }
                                }
                                return (
                                    <button
                                        key={opt}
                                        className={style}
                                        onClick={() =>
                                            !isAnsweredCorrectly && setSelected(opt)
                                        }
                                    >
                                        {opt}
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {feedback && <p className="mt-4 font-medium">{feedback}</p>}
                </div>
            )}

            {/* Navigation */}
            <div className="mt-6 flex gap-4">
                {current.type === "question" && !isAnsweredCorrectly && (
                    <button
                        onClick={handleCheck}
                        disabled={!selected}
                        className={`px-4 py-2 rounded text-white ${
                            selected
                                ? "bg-blue-500 hover:bg-blue-600"
                                : "bg-gray-300 cursor-not-allowed"
                        }`}
                    >
                        Check
                    </button>
                )}

                {step < steps.length - 1 && (current.type === "theory" || isAnsweredCorrectly) && (
                    <button
                        onClick={() => {
                            setStep(step + 1);
                            setSelected(null);
                            setIsAnsweredCorrectly(false);
                            setFeedback(null);
                            setChecked(false);
                        }}
                        className="px-4 py-2 bg-blue-500 text-white rounded"
                    >
                        Continue
                    </button>
                )}

                {step === steps.length - 1 && (current.type === "theory" || isAnsweredCorrectly) && (
                    <button
                        onClick={handleFinish}
                        className="px-4 py-2 bg-green-500 text-white rounded"
                    >
                        Finish
                    </button>
                )}
            </div>
        </div>
    );
}
