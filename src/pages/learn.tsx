"use client";

import { useEffect, useState } from "react";
import courseContent from "../courseContent/course1/content.json";
import Link from "next/link";
import AppSidebar from "../components/Sidebar";
import { auth, db } from "../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function PathPage() {
    const [completedLessons, setCompletedLessons] = useState<string[]>([]);

    useEffect(() => {
        const fetchProgress = async () => {
            const user = auth.currentUser;
            if (!user) return;

            const progressRef = doc(db, "progress", user.uid);
            const snap = await getDoc(progressRef);
            if (snap.exists()) {
                setCompletedLessons(snap.data().completedLessons || []);
            }
        };

        fetchProgress();
    }, []);

    return (
        <div className="flex flex-col items-center p-6 min-h-screen bg-gradient-to-b from-blue-50 to-white">
            <AppSidebar currentlyActive={"Learn"} />
            <h1 className="text-3xl font-bold mb-8">Design Path</h1>

            <div className="flex flex-col gap-10">
                {courseContent.sections.map((section, sectionIdx) => (
                    <div key={section.id} className="flex flex-col items-center">
                        <h2 className="text-xl font-semibold mb-4">{section.title}</h2>
                        <div
                            className={`flex gap-6 ${
                                sectionIdx % 2 === 0 ? "flex-row" : "flex-row-reverse"
                            }`}
                        >
                            {section.lessons.map((lesson) => {
                                const lessonId = `${section.id}-${lesson.id}`;
                                const isCompleted = completedLessons.includes(lessonId);

                                return (
                                    <Link
                                        key={lesson.id}
                                        href={`/lesson?section=${section.id}&lesson=${lesson.id}`}
                                        className={`w-24 h-24 flex items-center justify-center rounded-full shadow-md border transition-transform text-center text-sm font-medium ${
                                            isCompleted
                                                ? "bg-green-500 text-white border-green-600"
                                                : "bg-white hover:scale-105"
                                        }`}
                                    >
                                        {lesson.title}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
