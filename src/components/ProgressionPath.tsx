// components/ProgressionPath.tsx
"use client";
import Link from "next/link";


interface Segment {
    id: string;
    type: string;
    content: string;
    question?: string;
    answers?: string[];
    correctAnswer?: string;
}

interface Lesson {
    id: string;
    title: string;
    segments: any[];
}

interface Section {
    id: string;
    title: string;
    lessons: Lesson[];
}

interface Course {
    sections: Section[];
}

export default function ProgressionPath({ course }: { course: Course }) {
    const [currentSection, setCurrentSection] = useState(course.sections[0]);
    const [currentLesson, setCurrentLesson] = useState(currentSection.lessons[0]);

    return (
        <div className="flex flex-col gap-6 items-center">
            {course.sections.map((section, si) => (
                <div key={section.id} className="flex flex-col gap-4 items-center">
                    <h2 className="text-lg font-bold">{section.title}</h2>
                    <div className="flex gap-4">
                        {section.lessons.map((lesson, li) => (
                            <button
                                key={lesson.id}
                                onClick={() => setCurrentLesson(lesson)}
                                className="p-4 bg-white rounded-full shadow-md hover:scale-105 transition"
                            >
                                {lesson.title}
                            </button>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
