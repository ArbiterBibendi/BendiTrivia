"use client";
import { EventHandler, MouseEventHandler } from "react";

export type Trivia = {
  question: string;
  answer: string;
  category: string;
};
function handleClick(e: React.MouseEvent<HTMLElement>) {
  const card: HTMLElement = e.target as HTMLElement;
  card.querySelector(".answer")?.setAttribute("style", "filter: none");
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
