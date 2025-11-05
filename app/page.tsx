"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import data from "./json/topic.json";

type Question = {
  id: number;
  question: string;
  answer: string;
  difficulty: string;
  points: number;
  options?: string[];
};

type Topic = {
  id: number;
  name: string;
  questions: Question[];
};

export default function Home() {
  const router = useRouter();

  // Lazy state initialization from localStorage
  const [viewedQuestions, setViewedQuestions] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("viewedQuestions");
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });

  const difficultyOrder = ["маш амархан", "амархан", "дунд", "хэцүү", "маш хэцүү"];

  const rows = difficultyOrder.map((diff) =>
    data.topics.map((topic: Topic) => {
      const question = topic.questions.find((q) => q.difficulty === diff);
      return question ? { ...question, topicName: topic.name } : null;
    })
  );

  const handleClick = (question: Question & { topicName: string } | null) => {
    if (!question) return;
    router.push(`/detail?topic=${question.topicName}&questionId=${question.id}`);
  };

  return (
    <div className="p-6 flex items-center justify-center bg-[#0f0f0f] min-h-screen">
      <table className="border border-gray-300 text-center">
        <thead className="bg-gray-100">
          <tr>
            {data.topics.map((topic: Topic) => (
              <th
                key={topic.id}
                className="border border-gray-300 p-5 min-w-[200px] text-2xl"
              >
                {topic.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
              {row.map((question, i) => {
                const isViewed = question
                  ? viewedQuestions.includes(`${question.topicName}-${question.id}`)
                  : false;
                return (
                  <td
                    key={i}
                    className={`border p-5 text-3xl cursor-pointer transition ${
                      isViewed
                        ? "border-4 border-red-500 text-red-500"
                        : "border-gray-300 hover:bg-gray-200"
                    }`}
                    onClick={() => handleClick(question)}
                  >
                    {question ? question.points : "-"}
                    {isViewed && " X"}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
