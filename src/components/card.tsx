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
export type ReportResponse = {
  message: string;
};
function revealAnswer(e: React.MouseEvent<HTMLElement>) {
  document.querySelector(".answer")?.setAttribute("style", "filter: none");
}
function getNewTrivia(category: string, pathName: string) {
  window.location.href = `${pathName}?category=` + category;
}
function showReportDialogue() {
  const reportDialogue = document.querySelector("#reportDialogue");
  reportDialogue?.setAttribute("style", "display: flex");

  const reportButton = document.querySelector("#reportButton");
  reportButton?.setAttribute("style", "display: none");

  const nextButton = document.querySelector("#nextButton");
  nextButton?.setAttribute("style", "display: none");
}
function hideReportDialogue() {
  const reportDialogue = document.querySelector("#reportDialogue");
  reportDialogue?.setAttribute("style", "display: none");

  const reportButton = document.querySelector("#reportButton");
  reportButton?.setAttribute("style", "display: block");

  const nextButton = document.querySelector("#nextButton");
  nextButton?.setAttribute("style", "display: block");
}
async function reportCard(id: string) {
  const reasonTextArea: HTMLInputElement = document.querySelector(
    "#reportReason"
  ) as HTMLInputElement;
  const reason = reasonTextArea?.value;
  console.log(reason);
  const response = await fetch("/api/report", {
    method: "POST",
    body: JSON.stringify({
      trivia_id: id,
      reason: reason,
    }),
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
  });
  const reportResponse: ReportResponse = await response.json();
  if (!response.ok) {
    console.error("Something went wrong while reporting card.");
  } else {
    console.log(reportResponse.message);
  }
  hideReportDialogue();
}
export function Card({ trivia }: { trivia: Trivia }) {
  const { question, answer, category, id, requestedCategory }: Trivia = trivia;
  const pathName = usePathname();

  useEffect(() => {
    // store the cardid and requested category state in the URL
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
      <div id="buttonHolder">
        <button id="reportButton" onClick={() => showReportDialogue()}>
          <img src="/flag.svg" />
        </button>

        <button
          id="nextButton"
          onClick={() => getNewTrivia(requestedCategory, pathName)}
        >
          <img src="/next.svg" />
        </button>
      </div>
      <div id="reportDialogue">
        <textarea
          id="reportReason"
          placeholder="Input reason for report"
        ></textarea>
        <div id="reportDialogueButtonHolder">
          <button onClick={() => reportCard(id)} className="reportButton">
            <img src="/rightarrow.svg" />
          </button>
          <button onClick={hideReportDialogue} className="reportButton">
            <img src="/close.svg" />
          </button>
        </div>
      </div>
    </div>
  );
}
