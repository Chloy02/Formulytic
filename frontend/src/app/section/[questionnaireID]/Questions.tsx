'use client'

import React from "react"

interface Question {
  questionID: string
  question: string
  questionType: "text" | "number" | "multiple-choice" | "checkbox" | "rating" | "date"
  options: string[]
}

interface QuestionComponentProps {
  id: string
  question: Question[]
}

export default function QuestionForm({ id, title, question }: QuestionComponentProps) {
  return (
    <form className="space-y-6 p-4">
      <h2 className="text-xl font-semibold mb-4">Section ID: {title}</h2>
      {question.map((q) => (
        <div key={q.questionID} className="space-y-1">
          <label htmlFor={q.questionID} className="block font-medium text-gray-700">
            {q.question}
          </label>

          {q.questionType === "text" && (
            <input
              id={q.questionID}
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          )}

          {q.questionType === "number" && (
            <input
              id={q.questionID}
              type="number"
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          )}

          {/* Extend for other types if needed */}
        </div>
      ))}
    </form>
  )
}
