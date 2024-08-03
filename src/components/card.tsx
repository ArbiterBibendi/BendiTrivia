"use client";
import { useEffect, useState } from "react";

export type Trivia = {
  question: string;
  answer: string;
  category: string;
  id: string;
  requestedCategory: string;
};
function revealAnswer(e: React.MouseEvent<HTMLElement>) {
  document.querySelector(".answer")?.setAttribute("style", "filter: none");
}
function getNewTrivia(category: string) {
  window.location.href = "/?category=" + category;
}
export function Card({ trivia }: { trivia: Trivia }) {
  const { question, answer, category, id, requestedCategory }: Trivia = trivia;
  useEffect(() => {
    window.history.replaceState(
      null,
      "",
      `/?category=${requestedCategory}&id=${id}`
    );
  }, []);

  return (
    <div className="card" onClick={revealAnswer}>
      <h3 className="category">{category}</h3>
      <h2>{question}</h2>
      <h2 className="answer">{answer}</h2>
      <button onClick={() => getNewTrivia(requestedCategory)}>next</button>
    </div>
  );
}
// still need to track category
