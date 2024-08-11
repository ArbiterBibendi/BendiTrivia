"use client";
import { usePathname } from "next/navigation";
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
function getNewTrivia(category: string, pathName: string) {
  window.location.href = `${pathName}?category=` + category;
}
export function Card({ trivia }: { trivia: Trivia }) {
  const { question, answer, category, id, requestedCategory }: Trivia = trivia;
  const pathName = usePathname();

  useEffect(() => {
    window.history.replaceState(
      null,
      "",
      `${pathName}?category=${requestedCategory}&id=${id}`
    );
  }, []);

  return (
    <div className="card" onClick={revealAnswer}>
      <div className="cardContents">
        <h3 className="category">{category}</h3>
        <h2>{question}</h2>
        <h2 className="answer">{answer}</h2>
      </div>

      <button
        id="nextButton"
        onClick={() => getNewTrivia(requestedCategory, pathName)}
      >
        <img src="/next.svg" />
      </button>
    </div>
  );
}
