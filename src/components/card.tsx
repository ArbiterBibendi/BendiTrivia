"use client";
import { useEffect, useState } from "react";

export type Trivia = {
  question: string;
  answer: string;
  category: string;
  id: string;
};
function revealAnswer(e: React.MouseEvent<HTMLElement>) {
  document.querySelector(".answer")?.setAttribute("style", "filter: none");
}
function getNewTrivia(currentID: string) {
  window.location.href = "/";
}
export function Card({ trivia }: { trivia: Trivia }) {
  const { question, answer, category, id }: Trivia = trivia;
  useEffect(() => {
    window.history.replaceState(null, "", `/?id=${id}`);
  }, []);

  return (
    <div className="card" onClick={revealAnswer}>
      <h3 className="category">{category}</h3>
      <h2>{question}</h2>
      <h2 className="answer">{answer}</h2>
      <button onClick={() => getNewTrivia(id)}>next</button>
    </div>
  );
}
// still need to track category
