"use client";
import { EventHandler, MouseEventHandler } from "react";

export type Trivia = {
  question: string;
  answer: string;
  category: string;
  id: string;
};
function handleClick(e: React.MouseEvent<HTMLElement>) {
  document.querySelector(".answer")?.setAttribute("style", "filter: none");
}
export function Card({ trivia }: { trivia: Trivia }) {
  const { question, answer, category } = trivia;
  return (
    <div className="card" onClick={handleClick}>
      <h3 className="category">{category}</h3>
      <h2>{question}</h2>
      <h2 className="answer">{answer}</h2>
    </div>
  );
}
