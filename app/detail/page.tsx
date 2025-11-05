"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState,  } from "react";
import data from ".././json/topic.json";

type Question = {
  id: number;
  question: string;
  answer: string;
  difficulty: string;
  points: number;
  options?: string[];
};

export default function Detail() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const topic = searchParams.get("topic");
  const questionId = searchParams.get("questionId");

  const [showAnswer, setShowAnswer] = useState(false);

  if (!topic || !questionId) return <p className="text-white">Loading...</p>;

  const topicData = data.topics.find((t) => t.name === topic);
  const question: Question | undefined = topicData?.questions.find(
    (q) => q.id.toString() === questionId
  );

  if (!question) return <p className="text-white">Question not found.</p>;

  const handleShowAnswer = () => {
    setShowAnswer(!showAnswer);

    // Save to localStorage to mark as viewed
    const key = `${question.question}-${question.id}`;
    const stored = localStorage.getItem("viewedQuestions");
    const viewed = stored ? JSON.parse(stored) : [];
    if (!viewed.includes(key)) {
      viewed.push(key);
      localStorage.setItem("viewedQuestions", JSON.stringify(viewed));
    }
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen flex flex-col items-center justify-center text-white">
      {/* Back Button */}
     

      <h1 className="text-3xl font-bold mb-4">{topic}</h1>
      <p className="text-2xl mb-4">{question.question}</p>

      {/* Options */}
      {question.options && (
        <ul className="list-disc pl-8 text-xl mb-4">
          {question.options.map((opt, idx) => (
            <li key={idx}>{opt}</li>
          ))}
        </ul>
      )}

      {/* Show Answer Button */}
      <div className="flex items-center gap-6"> <button
        onClick={() => router.back()}
        className="self-start mb-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white transition"
      >
        ← Back
      </button>
      <button
        onClick={handleShowAnswer}
        className="mb-4 px-6 py-2 bg-blue-700 hover:bg-blue-600 rounded transition"
      >
        {showAnswer ? "Hide Answer" : "Show Answer"}
      </button></div>

      {/* Answer */}
      {showAnswer && (
        <p className="text-green-400 text-2xl font-semibold">{question.answer}</p>
      )}
    </div>
  );
}
